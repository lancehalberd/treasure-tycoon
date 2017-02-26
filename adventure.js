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
    leaveCurrentArea(character);
    if (character.levelDifficulty === 'endless') {
        character.area = instantiateLevel(map[index], character.levelDifficulty, difficultyCompleted, getEndlessLevel(character, map[index]));
    } else {
        character.area = instantiateLevel(map[index], character.levelDifficulty, difficultyCompleted);
    }
    character.cameraX = -60;
    var hero = character.adventurer;
    initializeActorForAdventure(hero);
    character.waveIndex = 0;
    character.finishTime = false;
    character.startTime = character.time;
    character.enemies = [];
    character.area.objects = character.objects = [];
    character.area.projectiles = character.projectiles = [];
    character.area.effects = character.effects = [];
    character.allies = [hero];
    character.area.allies = hero.allies = character.allies;
    character.area.enemies = hero.enemies = character.enemies;
    character.area.treasurePopups = character.treasurePopups = [];
    character.area.textPopups = character.textPopups = [];
    character.area.timeStopEffect = character.timeStopEffect = null;
    hero.x = 0;
    hero.y = 0;
    hero.z = 0;
    hero.activity = null;
    hero.actions.concat(hero.reactions).forEach(function (action) {
        action.readyAt = 0;
    });
    if (state.selectedCharacter === character) {
        updateAdventureButtons();
    }
    saveGame();
}
function checkIfActorDied(actor) {
    // The actor who has stopped time cannot die while the effect is in place.
    if (actor.character.timeStopEffect && actor.character.timeStopEffect.actor === actor) return;
    // Actor has not died if they are already dead, have postiive health, cannot die or are currently being pulled.
    if (actor.isDead || actor.health > 0 || actor.undying || actor.pull) return;
    // If the actor is about to die, check to activate their temporal shield if they have ont.
    var stopTimeAction = findActionByTag(actor.reactions, 'stopTime');
    if (useSkill(actor, stopTimeAction, null, {})) return;
    // The actor has actually died, mark them as such and begin their death animation and drop spoils.
    actor.isDead = true;
    actor.timeOfDeath = actor.time;
    if (actor.character.enemies.indexOf(actor) >= 0 ) {
        defeatedEnemy(actor.character, actor);
    }
}

function timeStopLoop(character, delta) {
    if (!character.timeStopEffect) return false;
    var actor = character.timeStopEffect.actor;
    actor.time += delta;
    actor.temporalShield -= delta;
    if (actor.temporalShield <= 0 || actor.health / actor.maxHealth > .5) {
        character.timeStopEffect = null;
        return false;
    }
    processStatusEffects(character, actor, delta);
    // The enemies of the time stopper can still die. This wil stop their life
    // bars from going negative.
    for (var i = 0; i < actor.enemies.length; i++) {
        var enemy = actor.enemies[i];
        checkIfActorDied(enemy);
    }
    checkToStartNextWave(character);
    if (!character.area) return false;
    expireTimedEffects(character, actor);
    runActorLoop(character, actor);
    moveActor(actor);
    capHealth(actor);
    updateActorHelpText(actor);
    // Update position info.
    ifdefor(character.enemies, []).forEach(function (actor, index) {
        return updateActorDimensions(actor, 1 + character.enemies.length - index);
    });
    ifdefor(character.allies, []).forEach(function (actor, index) {
        return updateActorDimensions(actor, -index);
    });
    return true;
}
function actorCanOverHeal(actor) {
    return ifdefor(actor.overHeal, 0) + ifdefor(actor.overHealReflection, 0) > 0;
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
    if (index < 0) {
        console.log("Tried to remove actor that was not amongst its allies");
        console.log(actor);
        console.log(actor.allies);
        pause();
        return;
    }
    actor.allies.splice(index, 1);
    if (actor.isMainCharacter) {
        var character = actor.character;
        if (character.levelDifficulty === 'endless') {
            var currentEndlessLevel = getEndlessLevel(character, map[character.currentLevelKey]);
            character.levelTimes[character.currentLevelKey][character.levelDifficulty] = currentEndlessLevel - 1;
        }
        returnToMap(actor.character);
        if (actor.character === state.selectedCharacter && !actor.character.replay && !testingLevel) {
            displayAreaMenu();
        }
    }
}
function checkToStartNextWave(character) {
    // Check to start next wave/complete level.
    if (character.enemies.length + character.objects.length == 0) {
        if (character.waveIndex >= character.area.waves.length) {
            returnToMap(character);
        } else {
            if (character.waveIndex >= character.area.waves.length - 1) {
                character.completionTime = character.time - character.startTime;
            }
            startNextWave(character);
            updateAdventureButtons();
        }
    }
}
function adventureLoop(character, delta) {
    if (timeStopLoop(character, delta)) {
        return;
    }
    var adventurer = character.adventurer;
    var everybody = character.allies.concat(character.enemies);
    // Advance subjective time for each actor.
    everybody.forEach(function (actor) {
        actor.time += delta;
        processStatusEffects(character, actor, delta);
    });
    for (var i = 0; i < character.enemies.length; i++) {
        var enemy = character.enemies[i];
        checkIfActorDied(enemy);
        expireTimedEffects(character, enemy);
    }
    for (var i = 0; i < character.allies.length; i++) {
        var ally = character.allies[i];
        checkIfActorDied(ally);
        expireTimedEffects(character, ally);
    }
    for (var i = 0; i < character.objects.length; i++) {
        var object = character.objects[i];
        if (object.x < character.adventurer.x && object.x + object.width - character.cameraX < 0 ) {
            character.objects.splice(i--, 1);
            continue;
        } else {
            object.update(character);
        }
    }
    checkToStartNextWave(character);
    if (!character.area) return;
    character.allies.forEach(function (actor) {
        runActorLoop(character, actor);
    });
    character.enemies.forEach(function (actor) {
        runActorLoop(character, actor);
    });
    // A skill may have removed an actor from one of the allies/enemies array, so remake everybody.
    everybody = character.allies.concat(character.enemies);
    everybody.forEach(function (actor) {
        moveActor(actor);
    });
    for (var i = 0; i < character.projectiles.length; i++) {
        character.projectiles[i].update(character);
        if (character.projectiles[i].done) {
            character.projectiles.splice(i--, 1);
        }
    }
    for (var i = 0; i < character.effects.length; i++) {
        character.effects[i].update(character);
        if (character.effects[i].done) {
            character.effects.splice(i--, 1);
        }
    }
    for (var i = 0; i < character.treasurePopups.length; i++) {
        character.treasurePopups[i].update(character);
        if (character.treasurePopups[i].done) {
            character.treasurePopups.splice(i--, 1);
        }
    }
    for (var i = 0; i < character.textPopups.length; i++) {
        var textPopup = character.textPopups[i];
        textPopup.y += ifdefor(textPopup.vy, -1);
        textPopup.x += ifdefor(textPopup.vx, 0);
        textPopup.duration = ifdefor(textPopup.duration, 35);
        textPopup.vy += ifdefor(textPopup.gravity, -.5);
        if (textPopup.duration-- < 0) {
            character.textPopups.splice(i--, 1);
        }
    }
    everybody.forEach(function (actor) {
        if (actor.timeOfDeath < actor.time - 1) {
            removeActor(actor);
            return;
        }
        // Since damage can be dealt at various points in the frame, it is difficult to pin point what damage was dealt
        // since the last action check. To this end, we keep track of their health over the last five frames and use
        // these values to determine how much damage has accrued recently for abilities that trigger when a character
        // is in danger.
        capHealth(actor);
        updateActorHelpText(actor);
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
}
function updateActorDimensions(actor) {
    var source = actor.source;
    var scale = ifdefor(actor.scale, 1);
    actor.width = source.actualWidth * scale;
    actor.height = source.actualHeight * scale;
    if (isNaN(actor.width) || isNaN(actor.height)) {
        console.log(actor.scale);
        console.log([actor.x, actor.character.cameraX]);
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
    var delta = frameMilliseconds / 1000;
    if (ifdefor(actor.character.isStuckAtShrine)) {
        actor.walkFrame = 0;
        return;
    }
    if (actor.isDead || actor.stunned || actor.pull || ifdefor(actor.stationary) || (actor.skillInUse && actor.skillInUse.preparationTime < actor.skillInUse.totalPreparationTime)) {
        return;
    }
    var goalTarget = (actor.skillInUse && actor.skillTarget !== actor) ? actor.skillTarget : null;
    actor.isMoving = false;
    var speedBonus = 1;
    if (actor.activity) {
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
                        actor.activity.target.action();
                    }
                    actor.activity = null;
                    break;
                }
                actor.heading = [actor.activity.target.x - actor.x, 0, actor.activity.target.z - actor.z];
                actor.isMoving = true;
                break;
            case 'attack':
                goalTarget = actor.activity.target;
                break;
        }
    }
    if (!actor.isMainCharacter && (!goalTarget || goalTarget.isDead)) {
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
        actor.heading[2] -= actor.z / 180;
        actor.isMoving = true;
    }
    actor.heading = new Vector(actor.heading).normalize().getArrayValue();
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
        // Actor is not allowed to leave the path.
        actor.z = Math.max(-180 + actor.width / 2, Math.min(180 - actor.width / 2, actor.z));
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
            for (var object of actor.character.objects) {
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
                    finishChargeEffect(enemy);
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
                    if (blockedByEnemy)setActorAttackTarget(actor, blockedByEnemy);
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
        finishChargeEffect(null);
    }
}
function finishChargeEffect(target) {
    var attackStats = createAttackStats(actor, actor.chargeEffect.chargeSkill, target);
    attackStats.distance = actor.chargeEffect.distance;
    var hitTargets = getAllInRange(target ? target.x : actor.x, actor.chargeEffect.chargeSkill.area, actor.enemies);
    for (var hitTarget of hitTargets) {
        applyAttackToTarget(attackStats, hitTarget);
    }
    actor.chargeEffect = null;
}
function startNextWave(character) {
    var wave = character.area.waves[character.waveIndex];
    var x = character.adventurer.x + 800;
    wave.monsters.forEach(function (entityData) {
        var extraSkills = ifdefor(character.area.enemySkills, []).slice();
        if (wave.extraBonuses) extraSkills.push(wave.extraBonuses);
        if (character.levelDifficulty === 'easy') {
            extraSkills.push(easyBonuses);
        }
        if (character.levelDifficulty === 'hard' || character.levelDifficulty === 'endless') {
            extraSkills.push(hardBonuses);
        }
        var newMonster = makeMonster(entityData, character.area.level, extraSkills, !!wave.extraBonuses);
        newMonster.heading = [-1, 0, 0]; // Monsters move right to left
        newMonster.x = x;
        newMonster.y = ifdefor(newMonster.y, 0);
        newMonster.z = -150 + Math.random() * 300;
        newMonster.character = character;
        initializeActorForAdventure(newMonster);
        newMonster.time = 0;
        newMonster.allies = character.enemies;
        newMonster.enemies = character.allies;
        character.enemies.push(newMonster);
        x += 40 + Math.floor(Math.random() * 40);
    });
    wave.objects.forEach(function (entityData) {
        if (entityData.type === 'chest') {
            entityData.x = x;
            entityData.y = 0;
            entityData.z = 20;
            character.objects.push(entityData);
            return;
        }
        if (entityData.type === 'shrine') {
            entityData.x = x + 128;
            entityData.y = 0;
            entityData.z = 50;
            character.objects.push(entityData);
            return;
        }
        if (entityData.type === 'button') {
            character.objects.push(entityData);
            return;
        }
        throw Error("Unrecognized object: " + JSON.stringify(entityData));
    });
    character.waveIndex++;
}
function processStatusEffects(character, target, delta) {
    if (target.isDead ) return;
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
function runActorLoop(character, actor) {
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
        }
        return;
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
    for(var action of ifdefor(actor.actions, [])) {
        if (!canUseSkillOnTarget(actor, action, target)) {
            //console.log("cannot use skill");
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
    }
    return distance;
}
function getDistanceBetweenPointsSquared(pointA, pointB) {
    var dx = pointA.x - pointB.x;
    var dy = pointA.y - pointB.y;
    var dz = pointA.z - pointB.z;
    return dx*dx + dy*dy + dz*dz;
}

function defeatedEnemy(character, enemy) {
    if (character.adventurer.health <= 0) {
        return;
    }
    var loot = [];
    if (enemy.coins) loot.push(coinsLootDrop(enemy.coins));
    if (enemy.anima) loot.push(animaLootDrop(enemy.anima));
    loot.forEach(function (loot, index) {
        loot.gainLoot(character);
        loot.addTreasurePopup(character, enemy.x + index * 20, enemy.height, 0, 1, index * 10);
    });
}
