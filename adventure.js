function startArea(character, index) {
    if (!map[index]) {
        throw new Error('No level found for ' + index);
    }

    if (character.currentLevelKey !== index) {
        character.board.boardPreview = null;
        drawBoardBackground(character.boardContext, character.board);
    }
    character.currentLevelKey = index;
    var levelCompleted = ifdefor(character.divinityScores[index], 0) !== 0;
    var difficultyCompleted = !!ifdefor(character.levelTimes[index], {})[character.levelDifficulty];
    leaveCurrentArea(character.hero);
    var area;
    if (character.levelDifficulty === 'endless') {
        area = instantiateLevel(map[index], character.levelDifficulty, difficultyCompleted, getEndlessLevel(character, map[index]));
    } else {
        area = instantiateLevel(map[index], character.levelDifficulty, difficultyCompleted);
    }
    area.time = 0;
    var hero = character.hero;
    hero.area = area;
    initializeActorForAdventure(hero);
    area.waveIndex = 0;
    area.objects = [];
    area.projectiles = [];
    area.effects = [];
    area.cameraX = 0;
    area.allies = hero.allies = [hero];
    area.enemies = hero.enemies = [];
    area.treasurePopups = [];
    area.textPopups = [];
    area.timeStopEffect = null;
    hero.x = 120;
    hero.y = 0;
    hero.z = 0;
    hero.activity = null;
    hero.actions.concat(hero.reactions).forEach(function (action) {
        action.readyAt = 0;
    });
    character.finishTime = false;
    character.startTime = area.time;
    if (state.selectedCharacter === character) {
        updateAdventureButtons();
    }
    saveGame();
}
function checkIfActorDied(actor) {
    const area = actor.area;
    // The actor who has stopped time cannot die while the effect is in place.
    if (area.timeStopEffect && area.timeStopEffect.actor === actor) return;
    // Actor has not died if they are already dead, have postiive health, cannot die or are currently being pulled.
    if (actor.isDead || actor.health > 0 || actor.undying || actor.pull) return;
    // If the actor is about to die, check to activate their temporal shield if they have one.
    var stopTimeAction = findActionByTag(actor.reactions, 'stopTime');
    if (useSkill(actor, stopTimeAction, null, {})) return;
    // The actor has actually died, mark them as such and begin their death animation and drop spoils.
    actor.isDead = true;
    actor.timeOfDeath = area.time;
    // Each enemy that is a main character should gain experience when this actor dies.
    actor.enemies.filter(enemy => enemy.character).forEach(enemy => defeatedEnemy(enemy, actor));
}

function timeStopLoop(area) {
    if (!area.timeStopEffect) return false;
    var actor = area.timeStopEffect.actor;
    var delta = frameMilliseconds / 1000;
    actor.time += delta;
    actor.temporalShield -= delta;
    if (actor.temporalShield <= 0 || actor.health / actor.maxHealth > .5) {
        area.timeStopEffect = null;
        return false;
    }
    processStatusEffects(actor);
    // The enemies of the time stopper can still die. This wil stop their life
    // bars from going negative.
    for (var i = 0; i < actor.enemies.length; i++) {
        var enemy = actor.enemies[i];
        checkIfActorDied(enemy);
    }
    checkToStartNextWave(area);
    expireTimedEffects(actor);
    runActorLoop(actor);
    moveActor(actor);
    capHealth(actor);
    // Update position info.
    area.allies.concat(area.enemies).forEach(updateActorDimensions);
    return true;
}
function actorCanOverHeal(actor) {
    return (ifdefor(actor.overHeal, 0) > 0)
        || (ifdefor(actor.overHealReflection, 0) > 0 && actor.reflectBarrier < actor.maxReflectBarrier);
}
function capHealth(actor) {
    // Apply overhealing if the actor is over their health cap and possesses overhealing.
    var excessHealth = actor.health - actor.maxHealth;
    if (actor.overHeal && excessHealth > 0) {
        setStat(actor, 'bonusMaxHealth', ifdefor(actor.bonusMaxHealth, 0) + actor.overHeal * excessHealth);
    }
    if (actor.overHealReflection && excessHealth > 0) {
        gainReflectionBarrier(actor, actor.overHealReflection * excessHealth);
    }
    actor.health = Math.min(actor.maxHealth, Math.max(0, actor.health));
    actor.percentHealth = actor.health / actor.maxHealth;
}
function removeActor(actor) {
    var index = actor.allies.indexOf(actor);
    if (actor.owner) {
        var minionIndex = actor.owner.minions.indexOf(actor);
        if (minionIndex >= 0) {
            actor.owner.minions.splice(minionIndex, 1);
        }
    }
    if (index < 0) {
        console.log("Tried to remove actor that was not amongst its allies");
        console.log(actor);
        console.log(actor.allies);
        pause();
        return;
    }
    actor.allies.splice(index, 1);
    if (actor.character) {
        var character = actor.character;
        var area = actor.area;
        if (area.levelDifficulty === 'endless') {
            var currentEndlessLevel = getEndlessLevel(character, map[character.currentLevelKey]);
            character.levelTimes[character.currentLevelKey][area.levelDifficulty] = currentEndlessLevel - 1;
        }
        returnToMap(actor.character);
        if (actor.character === state.selectedCharacter && !actor.character.replay && !testingLevel) {
            displayAreaMenu();
        }
    }
}
function checkToStartNextWave(area) {
    if (!area.waves) return;
    if (area.waveIndex >= area.waves.length) return;
    if (area.enemies.some(enemy => !enemy.isDead)) return
    if (area.waveIndex >= area.waves.length - 1) {
        for (var actor of area.allies) {
            const character = actor.character;
            if (!character) continue;
            completeLevel(character, area.time - character.startTime);
        }
    }
    startNextWave(area);
    updateAdventureButtons();
}
function unlockGuildArea(guildArea) {
    state.unlockedGuildAreas[guildArea.key] = true;
    // Now that the guild area is unlocked the furniture bonuses should apply.
    addAreaFurnitureBonuses(guildArea, true);
    saveGame();
}

function updateArea(area) {
    if (area.isGuildArea && !state.unlockedGuildAreas[area.key] && !area.enemies.length && area.allies.some(actor => !actor.isDead)) {
        unlockGuildArea(area);
    }
    if (timeStopLoop(area)) return;
    var delta = frameMilliseconds / 1000;
    var everybody = area.allies.concat(area.enemies);
    // Advance subjective time of area and each actor.
    area.time += delta;
    for (var actor of everybody) actor.time += delta;
    everybody.forEach(processStatusEffects);
    for (var enemy of area.enemies) {
        checkIfActorDied(enemy);
        expireTimedEffects(enemy);
    }
    for (var ally of area.allies) {
        checkIfActorDied(ally);
        expireTimedEffects(ally);
    }
    for (var object of area.objects) if (object.update) object.update(area);
    checkToStartNextWave(area);
    area.allies.forEach(runActorLoop);
    area.enemies.forEach(runActorLoop);
    // A skill may have removed an actor from one of the allies/enemies array, so remake everybody.
    everybody = area.allies.concat(area.enemies);
    everybody.forEach(moveActor);
    for (var i = 0; i < area.projectiles.length; i++) {
        area.projectiles[i].update(area);
        if (area.projectiles[i].done) area.projectiles.splice(i--, 1);
    }
    for (var i = 0; i < area.effects.length; i++) {
        area.effects[i].update(area);
        if (area.effects[i].done) area.effects.splice(i--, 1);
    }
    for (var i = 0; i < area.treasurePopups.length; i++) {
        area.treasurePopups[i].update(area);
        if (area.treasurePopups[i].done) area.treasurePopups.splice(i--, 1);
    }
    for (var i = 0; i < area.textPopups.length; i++) {
        var textPopup = area.textPopups[i];
        textPopup.y += ifdefor(textPopup.vy, -1);
        textPopup.x += ifdefor(textPopup.vx, 0);
        textPopup.duration = ifdefor(textPopup.duration, 35);
        textPopup.vy += ifdefor(textPopup.gravity, -.5);
        if (textPopup.duration-- < 0) area.textPopups.splice(i--, 1);
    }
    everybody.forEach(function (actor) {
        if (actor.timeOfDeath < area.time - 1) {
            removeActor(actor);
            return;
        }
        // Since damage can be dealt at various points in the frame, it is difficult to pin point what damage was dealt
        // since the last action check. To this end, we keep track of their health over the last five frames and use
        // these values to determine how much damage has accrued recently for abilities that trigger when a character
        // is in danger.
        capHealth(actor);
        if ((actor.time * 1000) % 100 < 20) {
            if (!actor.healthValues) {
                actor.healthValues = [];
            }
            actor.healthValues.unshift(actor.health);
            while (actor.healthValues.length > 10) {
                actor.healthValues.pop();
            }
        }
    });
    everybody.forEach(updateActorDimensions);
    everybody.forEach(updateActorAnimationFrame);
    everybody.forEach(updateActorHelpText);
}
function updateActorDimensions(actor) {
    var source = actor.source;
    var scale = ifdefor(actor.scale, 1);
    actor.width = source.actualWidth * scale;
    actor.height = source.actualHeight * scale;
    if (isNaN(actor.width) || isNaN(actor.height)) {
        console.log(actor.scale);
        console.log(actor.x);
        console.log(source);
        console.log([actor.width,actor.height]);
        pause();
        return false;
    }
    return true;
}
var rotationA = Math.cos(Math.PI / 20);
var rotationB = Math.sin(Math.PI / 20);
function moveActor(actor) {
    const area = actor.area;
    var delta = frameMilliseconds / 1000;
    if (actor.character && actor.character.isStuckAtShrine) {
        actor.walkFrame = 0;
        return;
    }
    if (actor.isDead || actor.stunned || actor.pull || ifdefor(actor.stationary) || (actor.skillInUse && actor.skillInUse.preparationTime < actor.skillInUse.totalPreparationTime)) {
        return;
    }
    var goalTarget = (actor.skillInUse && actor.skillTarget !== actor) ? actor.skillTarget : null;
    actor.isMoving = false;
    var speedBonus = 1;
    if (actor.chargeEffect) {
        goalTarget = actor.chargeEffect.target;
    } else if (actor.activity) {
        switch (actor.activity.type) {
            case 'move':
                if (getDistanceBetweenPointsSquared(actor, actor.activity) < 10) {
                    actor.activity = null;
                    break;
                }
                goalTarget = null;
                // If the actor is currently using a skill, they cannot adjust their heading,
                // but we do allow them to move forward/backward in their current direction at 25% speed
                // if they are in recovery.
                if (actor.skillInUse) {
                    if (actor.heading[0] * (actor.activity.x - actor.x) < 0) {
                        speedBonus = -.25;
                    } else {
                        speedBonus = .25;
                    }
                } else {
                    actor.heading = [actor.activity.x - actor.x, 0, actor.activity.z - actor.z];
                }
                actor.isMoving = true;
                break;
            case 'interact':
                if (getDistanceOverlap(actor, actor.activity.target) <= 5) {
                    if (actor.activity.target.action) {
                        actor.activity.target.action(actor);
                    }
                    actor.activity = null;
                    break;
                }
                actor.heading = [actor.activity.target.x - actor.x, 0, actor.activity.target.z - actor.z];
                if (isNaN(actor.heading[0])) debugger;
                actor.isMoving = true;
                break;
            case 'attack':
            case 'action':
                goalTarget = actor.activity.target;
                break;
        }
    }
    if ((actor.chargeEffect || (actorShouldAutoplay(actor) && !actor.activity)) && (!goalTarget || goalTarget.isDead)) {
        var bestDistance = 10000;
        actor.enemies.forEach(function (target) {
            if (target.isDead) return;
            var distance = getDistance(actor, target);
            if (distance < bestDistance) {
                bestDistance = distance;
                goalTarget = target;
            }
        });
    }
    if (goalTarget) {
        actor.heading = [goalTarget.x - actor.x, 0, goalTarget.z - actor.z];
                if (isNaN(actor.heading[0])) debugger;
        actor.heading[2] -= actor.z / 180;
        actor.isMoving = true;
        actor.goalTarget = goalTarget;
    } else {
        actor.goalTarget = null;
    }
    actor.heading = new Vector(actor.heading).normalize().getArrayValue();
                if (isNaN(actor.heading[0])) debugger;
    if (!actor.isMoving) {
        return;
    }
    //console.log(JSON.stringify(actor.heading));
    // Make sure the main character doesn't run in front of their allies.
    // If the allies are fast enough, this shouldn't be an isse.
    var xOffset = 0;
    for (var i = 0; i < actor.allies.length; i++) {
        xOffset += actor.x - actor.allies[i].x;
    }
    if (actor.chargeEffect) {
        speedBonus *= actor.chargeEffect.chargeSkill.speedBonus;
        actor.chargeEffect.distance += speedBonus * actor.speed * Math.max(.1, 1 - actor.slow) * delta;
        // Cancel charge if they run for too long.
        if (actor.chargeEffect.distance > 2000) {
            actor.chargeEffect = null;
        }
    } else if (goalTarget && !goalTarget.cloaked) {
        // If the character is closer than they need to be to auto attack then they can back away from
        // them slowly to try and stay at range.
        var basicAttackRange = getBasicAttack(actor).range;
        var distanceToTarget = getDistanceOverlap(actor, goalTarget);
        // Set the max distance to back away to to 10, otherwise they will back out of the range
        // of many activated abilities like fireball and meteor.
        if (distanceToTarget < (Math.min(basicAttackRange - 1.5, 10)) * 32) {
            speedBonus *= -.25;
        } else if (distanceToTarget <= basicAttackRange * 32) {
            speedBonus = 0;
        }
    }
    var currentX = actor.x;
    var currentZ = actor.z;
    var collision = false;
    var originalHeading = actor.heading.slice();
    var tryingVertical = false;
    var clockwiseFailed = false;
    var blockedByEnemy = null;
    var blockedByAlly = null;
    while (true) {
        actor.x = currentX + speedBonus * actor.speed * actor.heading[0] * Math.max(.1, 1 - actor.slow) * delta;
        actor.z = currentZ + speedBonus * actor.speed * actor.heading[2] * Math.max(.1, 1 - actor.slow) * delta;
        if (isNaN(actor.x) || isNaN(actor.z)) {
            debugger;
        }
        // Actor is not allowed to leave the path.
        actor.z = Math.max(-180 + actor.width / 2, Math.min(180 - actor.width / 2, actor.z));
        if (actor.area.leftWall) actor.x = Math.max(ifdefor(actor.area.left, 0) + 25 + actor.width / 2 + actor.z / 6, actor.x);
        else actor.x = Math.max(ifdefor(actor.area.left, 0) + actor.width / 2, actor.x);
        if (actor.area.rightWall) actor.x = Math.min(actor.area.width - 25 - actor.width / 2 - actor.z / 6, actor.x);
        else actor.x = Math.min(actor.area.width - actor.width / 2, actor.x);
        var collision = false;
        // Ignore ally collision during charge effects.
        if (!actor.chargeEffect) {
            for (var ally of actor.allies) {
                if (!ally.isDead && actor !== ally && getDistanceOverlap(actor, ally) <= -16 && new Vector([speedBonus * actor.heading[0], speedBonus * actor.heading[2]]).dotProduct(new Vector([ally.x - actor.x, ally.z - actor.z])) > 0) {
                    collision = true;
                    blockedByAlly = ally;
                    break;
                }
            }
        }
        if (!collision) {
            for (var object of area.objects) {
                var distance = getDistanceOverlap(actor, object);
                if (distance <= -8 && new Vector([speedBonus * (actor.x - currentX), speedBonus * (actor.z - currentZ)]).dotProduct(new Vector([object.x - currentX, object.z - currentZ])) > 0) {
                    collision = true;
                    break;
                }
            }
        }
        if (!collision) {
            for (var enemy of actor.enemies) {
                if (enemy.isDead || actor === enemy) continue;
                var distance = getDistanceOverlap(actor, enemy);
                if (distance <= 0 && actor.chargeEffect) {
                    finishChargeEffect(actor, enemy);
                    // Although this is a collision, don't mark it as one so that the move will complete.
                    collision = false;
                    break;
                }
                if (distance <= -16 && new Vector([speedBonus * actor.heading[0], speedBonus * actor.heading[2]]).dotProduct(new Vector([enemy.x - actor.x, enemy.z - actor.z])) > 0) {
                    collision = true;
                    blockedByEnemy = enemy;
                    break;
                }
            }
        }
        if (!collision) {
            break;
        }
        //console.log(JSON.stringify(['old', actor.heading]));
        var oldXHeading = actor.heading[0];
        if (clockwiseFailed) {
            actor.heading[0] = oldXHeading * rotationA + actor.heading[2] * rotationB;
            actor.heading[2] = actor.heading[2] * rotationA - oldXHeading * rotationB;
        } else {
            // rotationB is Math.sin(Math.PI / 20), so Math.sin(-Math.PI / 20) is -rotationB.
            actor.heading[0] = oldXHeading * rotationA - actor.heading[2] * rotationB;
            actor.heading[2] = actor.heading[2] * rotationA + oldXHeading * rotationB;
        }
        if (originalHeading[0] * actor.heading[0] + originalHeading[2] * actor.heading[2] < .01) {
            if (clockwiseFailed) {
                actor.x = currentX;
                actor.z = currentZ;
                actor.heading = originalHeading.slice();
                if (actor.activity) {
                    // If there is at least 1 enemy blocking the way, attack it
                    if (blockedByEnemy) setActorAttackTarget(actor, blockedByEnemy);
                    // If the way is only blocked by objects (non-enemies/non-allies), give up on the current action as those obstacles won't disappear or move.
                    else if (!blockedByAlly) actor.activity = null;
                }
                break;
            }
            clockwiseFailed = true;
            actor.heading = originalHeading.slice();
        }
        actor.x = currentX;
        actor.z = currentZ;
    }
    // If the actor hit something, complete the charge effect. The splash may still hit enemies,
    // and if it had an animation, it should play.
    if (collision && actor.chargeEffect) {
        finishChargeEffect(actor, null);
    }
}
function finishChargeEffect(actor, target) {
    var attackStats = createAttackStats(actor, actor.chargeEffect.chargeSkill, target);
    attackStats.distance = actor.chargeEffect.distance;
    var hitTargets = getAllInRange(target ? target.x : actor.x, actor.chargeEffect.chargeSkill.area, actor.enemies);
    for (var hitTarget of hitTargets) {
        applyAttackToTarget(attackStats, hitTarget);
    }
    actor.chargeEffect = null;
}
function startNextWave(area) {
    var wave = area.waves[area.waveIndex];
    var x = area.cameraX + 1200;
    wave.monsters.forEach(function (entityData) {
        var extraSkills = ifdefor(area.enemySkills, []).slice();
        if (wave.extraBonuses) extraSkills.push(wave.extraBonuses);
        if (area.levelDifficulty === 'easy') {
            extraSkills.push(easyBonuses);
        }
        if (area.levelDifficulty === 'hard' || area.levelDifficulty === 'endless') {
            extraSkills.push(hardBonuses);
        }
        var newMonster = makeMonster(entityData, area.level, extraSkills, wave.extraBonuses ? 0 : undefined);
        newMonster.heading = [-1, 0, 0]; // Monsters move right to left
        newMonster.x = x;
        newMonster.y = ifdefor(newMonster.y, 0);
        newMonster.z = -150 + Math.random() * 300;
        newMonster.area = area;
        initializeActorForAdventure(newMonster);
        newMonster.time = 0;
        newMonster.allies = area.enemies;
        newMonster.enemies = area.allies;
        area.enemies.push(newMonster);
        x += 40 + Math.floor(Math.random() * 40);
    });
    for (var object of wave.objects) {
        if (object.fixed) {
            object.z = (120 - object.width / 2) * (Math.random() * 2 - 1);
            object.x = x + object.width / 2;
            x += object.width + 60;
        } else if (entityData.type === 'button') {
        } else {
            throw Error("Unrecognized object: " + JSON.stringify(entityData));
        }
        object.area = area;
        area.objects.push(object);
    }
    area.waveIndex++;
    area.left = area.cameraX - 800;
    area.width = x + 400;
}
function processStatusEffects(target) {
    if (target.isDead ) return;
    var delta = frameMilliseconds / 1000;
    // Apply DOT, movement effects and other things that happen to targets here.
    // Target becomes 50% less slow over 1 second, or loses .1 slow over one second, whichever is faster.
    if (target.slow) {
        target.slow = Math.max(0, Math.min(target.slow - .5 * target.slow * delta, target.slow - .1 * delta));
    }
    if (target.health > 0 && ifdefor(target.healthRegen)) {
        target.health = target.health + target.healthRegen * delta;
    }
    target.health = target.health - ifdefor(target.damageOverTime, 0) * delta;
    if (target.pull && target.dominoAttackStats) {
        for (var i = 0; i < target.allies.length; i++) {
            var ally = target.allies[i];
            if (ally === target || ally.x < target.x || target.x + target.width < ally.x) continue;
            applyAttackToTarget(target.dominoAttackStats, ally);
            target.dominoAttackStats = null;
            target.pull = null;
            target.stunned = Math.max(target.time + .3, target.stunned);
            break;
        }
    }
    if (ifdefor(target.pull) && ifdefor(target.pull.delay, 0) < target.time) {
        if (target.pull.attackStats) {
            performAttackProper(target.pull.attackStats, target);
            target.pull.attackStats = null;
        }
        var timeLeft = (target.pull.time - target.time);
        if (timeLeft > 0) {
            var dx = (target.pull.x - target.x) * Math.min(1, delta / timeLeft);
            var dr = (0 - target.rotation) * Math.min(1, delta / timeLeft);
            target.rotation += dr;
            var damage = target.pull.damage * Math.min(1, delta / timeLeft);
            target.pull.damage -= damage;
            target.x += dx;
            target.health -= damage;
        } else {
            var dx = target.pull.x - target.x;
            target.rotation = 0;
            target.x = target.pull.x;
            target.health -= target.pull.damage;
            target.pull = null;
        }
    }
    if (target.stunned && target.stunned <= target.time) {
        target.stunned = null;
    }
}
function getAllInRange(x, range, targets) {
    var targetsInRange = [];
    for (var i = 0; i < targets.length; i++) {
        if (Math.abs(targets[i].x - x) <= range * 32) {
            targetsInRange.push(targets[i]);
        }
    }
    return targetsInRange
}
function runActorLoop(actor) {
    const area = actor.area;
    if (actor.isDead || actor.stunned || actor.pull || actor.chargeEffect) {
        actor.skillInUse = null;
        return;
    }
    if (actor.skillInUse) {
        var actionDelta = frameMilliseconds / 1000 * Math.max(.1, 1 - actor.slow);
        if (actor.skillInUse.preparationTime < actor.skillInUse.totalPreparationTime) {
            actor.skillInUse.preparationTime += actionDelta;
            if (actor.skillInUse.preparationTime >= actor.skillInUse.totalPreparationTime) {
                useSkill(actor);
            }
            return;
        } else if (actor.recoveryTime < actor.totalRecoveryTime) {
            actor.recoveryTime += actionDelta;
            return;
        } else {
            actor.skillInUse = null;
        }
    }
    if (actor.activity) {
        switch (actor.activity.type) {
            case 'attack':
                if (actor.activity.target.isDead) {
                    actor.activity = null;
                } else {
                    checkToUseSkillOnTarget(actor, actor.activity.target);
                }
                break;
            case 'action':
                var action = actor.activity.action;
                var target = actor.activity.target;
                // console.log([actor, action, target]);
                // console.log('valid target? ' + canUseSkillOnTarget(actor, action, target));
                if (!canUseSkillOnTarget(actor, action, target)) {
                    actor.activity = null;
                    break;
                }
                // console.log('in range? ' + isTargetInRangeOfSkill(actor, action, target));
                if (!isTargetInRangeOfSkill(actor, action, target)) break;
                prepareToUseSkillOnTarget(actor, action, target);
                actor.activity = null;
                break;
        }
        return;
    } else if (actor.character && actorShouldAutoplay(actor) && area.waves && area.waveIndex >= area.waves.length) {
        const character = actor.character;
        // Code for intracting with chest/shrine at the end of level and leaving the area.
        for (var object of area.objects) {
            if (object.considered) continue;
            // The AI only considers each object once.
            object.considered = true;
            if (object.key === 'closedChest') {
                setActorInteractionTarget(actor, object);
                break;
            }
            if (object.key === 'skillShrine' && !character.skipShrines) {
                setActorInteractionTarget(actor, object);
                break;
            }
        }
        if (!actor.activity && !character.isStuckAtShrine) {
            if (!character.finishTime) character.finishTime = area.time + 1;
            if (area.time >= character.finishTime) returnToMap(actor.character);
        }
        // Make minions follow their owners when there are no enemies present.
    } else if (actor.owner && !actor.owner.enemies.length) {
        if (getDistance(actor, actor.owner) > actor.owner.width / 2 + 10) {
            setActorInteractionTarget(actor, actor.owner);
        }
    }
    var targets = [];
    for (var ally of actor.allies) {
        ally.priority = getDistance(actor, ally) - 1000;
        targets.push(ally);
    }
    for (var enemy of actor.enemies) {
        enemy.priority = getDistance(actor, enemy);
        // actor.skillTarget will hold the last target the actor tried to use a skill on.
        // This lines causes the actor to prefer to continue attacking the same enemy continuously
        // even if they aren't the closest target any longer.
        if (enemy === actor.skillTarget) enemy.priority -= 100;
        targets.push(enemy);
    }
    // The main purpose of this is to prevent pulled actors from passing through their enemies.
     // Character is assumed to not be blocked each frame
    // Target the enemy closest to you, not necessarily the one previously targeted.
    targets.sort(function (A, B) {
        return A.priority - B.priority;
    });
    for (var target of targets) {
        if (checkToUseSkillOnTarget(actor, target)) {
            break;
        }
    }
    actor.cloaked = (actor.cloaking && !actor.skillInUse);
}
function checkToUseSkillOnTarget(actor, target) {
    var autoplay = actorShouldAutoplay(actor);
    for(var action of ifdefor(actor.actions, [])) {
        // Only basic attacks will be used by your hero when you manually control them.
        if (!autoplay && !action.tags['basic'] && actor.character &&
            // If the player has set this skill to auto, then it will be used automatically during manual control.
            !actor.character.autoActions[action.base.key]
        ) {
            continue;
        }
        // If the skill has been set to manual, it won't be used during autoplay.
        if (autoplay && actor.character && actor.character.manualActions[action.base.key]) {
            continue;
        }
        if (!canUseSkillOnTarget(actor, action, target)) {
            // console.log("cannot use skill");
            continue;
        }
        if (!isTargetInRangeOfSkill(actor, action, target)) {
            continue;
        }
        if (!shouldUseSkillOnTarget(actor, action, target)) {
            continue;
        }
        prepareToUseSkillOnTarget(actor, action, target);
        return true;
    }
    return false;
}

function actorShouldAutoplay(actor) {
    return !actor.character || (actor.character.autoplay || actor.character !== state.selectedCharacter);
}

// The distance functions assume objects are circular in the x/z plane and are calculating
// only distance within that plane, ignoring the height of objects and their y positions.
function getDistance(spriteA, spriteB) {
    var distance = getDistanceOverlap(spriteA, spriteB);
    return Math.max(0, distance);
}
function getDistanceOverlap(spriteA, spriteB) {
    var dx = spriteA.x - spriteB.x;
    var dz = spriteA.z - spriteB.z;
    var distance = Math.sqrt(dx*dx + dz*dz) - (ifdefor(spriteA.width, 0) + ifdefor(spriteB.width, 0)) / 2;
    if (isNaN(distance)) {
        console.log(JSON.stringify(['A:', spriteA.x, spriteA.y, spriteA.z, spriteA.width]));
        console.log(JSON.stringify(['B:', spriteB.x, spriteB.y, spriteB.z, spriteB.width]));
        debugger;
    }
    return distance;
}
function getDistanceBetweenPointsSquared(pointA, pointB) {
    var dx = pointA.x - pointB.x;
    var dy = pointA.y - pointB.y;
    var dz = pointA.z - pointB.z;
    return dx*dx + dy*dy + dz*dz;
}

function defeatedEnemy(hero, enemy) {
    if (hero.health <= 0) {
        return;
    }
    var loot = [];
    if (enemy.coins) loot.push(coinsLootDrop(enemy.coins));
    if (enemy.anima) loot.push(animaLootDrop(enemy.anima));
    loot.forEach(function (loot, index) {
        loot.gainLoot(hero);
        loot.addTreasurePopup(hero, enemy.x + index * 20, enemy.height, 0, 1, index * 10);
    });
}

function completeLevel(character, completionTime) {
    const area = character.hero.area;
    area.completed = true;
    // If the character beat the last adventure open to them, unlock the next one
    var level = map[character.currentLevelKey];
    increaseAgeOfApplications();
    var oldDivinityScore = ifdefor(character.divinityScores[character.currentLevelKey], 0);
    if (oldDivinityScore === 0) {
        character.fame += level.level;
        gain('fame', level.level);
        // Unlock the next areas.
        var levelData = map[character.currentLevelKey];
        state.completedLevels[character.currentLevelKey] = true;
        levelData.unlocks.forEach(function (levelKey) {
            unlockMapLevel(levelKey);
        });
    }
    var newDivinityScore;
    var currentEndlessLevel = getEndlessLevel(character, level);
    if (area.levelDifficulty === 'endless') {
        newDivinityScore = Math.max(10, Math.round(baseDivinity(currentEndlessLevel)));
    } else {
        var difficultyBonus = difficultyBonusMap[area.levelDifficulty];
        var timeBonus = .8;
        if (completionTime <= getGoldTimeLimit(level, difficultyBonus)) timeBonus = 1.2;
        else if (completionTime <= getSilverTimeLimit(level, difficultyBonus)) timeBonus = 1;
        newDivinityScore = Math.max(10, Math.round(difficultyBonus * timeBonus * baseDivinity(level.level)));
    }
    var gainedDivinity = newDivinityScore - oldDivinityScore;
    if (gainedDivinity > 0) {
        character.divinity += gainedDivinity;
        var hero = character.hero;
        var textPopup = {value:'+' + gainedDivinity.abbreviate() + ' Divinity', x: hero.x, y: hero.height, z: hero.z, color: 'gold', fontSize: 15, 'vx': 0, 'vy': 1, 'gravity': .1};
        appendTextPopup(area, textPopup, true);
    }
    character.divinityScores[character.currentLevelKey] = Math.max(oldDivinityScore, newDivinityScore);
    // Initialize level times for this level if not yet set.
    character.levelTimes[character.currentLevelKey] = ifdefor(character.levelTimes[character.currentLevelKey], {});
    if (area.levelDifficulty === 'endless') {
        unlockItemLevel(currentEndlessLevel + 1);
        character.levelTimes[character.currentLevelKey][area.levelDifficulty] = currentEndlessLevel + 5;
    } else {
        unlockItemLevel(level.level + 1);
        var oldTime = ifdefor(character.levelTimes[character.currentLevelKey][area.levelDifficulty], 99999);
        character.levelTimes[character.currentLevelKey][area.levelDifficulty] = Math.min(completionTime, oldTime);
    }
    saveGame();
}
