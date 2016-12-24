function startArea(character, index) {
    if (!map[index]) {
        throw new Error('No level found for ' + index);
    }

    if (character.currentLevelKey !== index) {
        character.levelCompleted = false;
        character.board.boardPreview = null;
        drawBoardBackground(character.boardContext, character.board);
        updateConfirmSkillButton();
    }
    character.currentLevelKey = index;
    var levelCompleted = ifdefor(character.divinityScores[index], 0) !== 0;
    var difficultyCompleted = !!ifdefor(character.levelTimes[index], {})[character.levelDifficulty];
    if (character.levelDifficulty === 'endless') {
        character.area = instantiateLevel(map[index], character.levelDifficulty, difficultyCompleted, getEndlessLevel(character, map[index]));
    } else {
        character.area = instantiateLevel(map[index], character.levelDifficulty, difficultyCompleted);
    }
    character.cameraX = -60;
    initializeActorForAdventure(character.adventurer);
    character.waveIndex = 0;
    character.adventurer.x = 0;
    character.finishTime = false;
    character.startTime = character.time;
    character.enemies = [];
    character.objects = [];
    character.projectiles = [];
    character.effects = [];
    character.allies = [character.adventurer];
    character.adventurer.allies = character.allies;
    character.adventurer.enemies = character.enemies;
    character.adventurer.desiredTarget = null;
    character.treasurePopups = [];
    character.textPopups = [];
    character.timeStopEffect = null;
    character.adventurer.actions.concat(character.adventurer.reactions).forEach(function (action) {
        action.readyAt = 0;
    });
    if (state.selectedCharacter === character) {
        updateAdventureButtons();
    }
    saveGame();
}
function checkIfActorDied(actor) {
    if (!actor.isDead && actor.health <= 0 && !actor.undying && !actor.pull) {
        actor.isDead = true;
        actor.timeOfDeath = actor.time;
        if (actor.character.enemies.indexOf(actor) >= 0 ) {
            defeatedEnemy(actor.character, actor);
        }
    }
}

function timeStopLoop(character, delta) {
    if (!character.timeStopEffect) return false;
    var actor = character.timeStopEffect.actor;
    actor.time += delta;
    actor.animationTime += delta * Math.max(.1, 1 - actor.slow);
    if (actor.time >= character.timeStopEffect.endAt) {
        character.timeStopEffect = null;
        return false;
    }
    processStatusEffects(character, actor, delta);
    checkIfActorDied(actor);
    if (actor.isDead) {
        character.timeStopEffect = null;
        return false;
    }
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
    moveActor(actor, delta);
    capHealth(actor);
    updateActorHelpText(actor);
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
        if (actor.character === state.selectedCharacter && !actor.character.replay && !testingLevel && currentContext === 'adventure') {
            displayAreaMenu();
        }
    }
}
function checkToStartNextWave(character) {
    // Check to start next wave/complete level.
    if (character.enemies.length + character.objects.length == 0) {
        if (character.waveIndex >= character.area.waves.length) {
            if (!character.finishTime) {
                character.finishTime = character.time + 2;
                character.completionTime = character.time - character.startTime;
            } else if (character.finishTime <= character.time) {
                completeLevel(character);
                returnToMap(character);
                return;
            }
        } else {
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
        actor.animationTime += delta * Math.max(.1, 1 - actor.slow);
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
        moveActor(actor, delta);
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
        textPopup.y--;
        textPopup.duration = ifdefor(textPopup.duration, 30);
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
    // Update position info.
    ifdefor(character.enemies, []).forEach(function (actor, index) {
        return updateActorDimensions(actor, 1 + character.enemies.length - index);
    });
    ifdefor(character.allies, []).forEach(function (actor, index) {
        return updateActorDimensions(actor, -index);
    });
}
function updateActorDimensions(actor, index) {
    var source = actor.source;
    var scale = ifdefor(actor.scale, 1);
    actor.width = source.width * scale;
    actor.height = ifdefor(source.height, 64) * scale;
    actor.top = groundY - actor.height - ifdefor(source.y, 0) * scale - 2 * (index % maxIndex);
    actor.left = actor.x - actor.character.cameraX;
    if (isNaN(actor.top) || isNaN(actor.left) || isNaN(actor.width) || isNaN(actor.height)) {
        console.log(actor.scale);
        console.log([actor.x, actor.character.cameraX]);
        console.log(source);
        console.log([actor.left,actor.top,actor.width,actor.height]);
        pause();
        return false;
    }
    return true;
}
function moveActor(actor, delta) {
    if (actor.target && actor.target.pull) {
        actor.target = null;
    }
    if (actor.isDead || actor.stunned || actor.pull || ifdefor(actor.stationary)) {
        return;
    }
    if ((!actor.target || actor.target.isDead) && (!actor.desiredTarget || actor.desiredTarget.isDead || actor.enemies.indexOf(actor.desiredTarget) < 0)) {
        actor.desiredTarget = null;
        var bestDistance = 10000;
        actor.enemies.forEach(function (target) {
            if (target.isDead) return;
            var distance = getDistance(actor, target);
            if (distance < bestDistance) {
                distance = bestDistance;
                actor.desiredTarget = target;
            }
        });
    }
    var goalTarget = actor.target || actor.desiredTarget;
    if (goalTarget) {
        actor.direction = (goalTarget.x < actor.x) ? -1 : 1;
    } else {
        actor.direction = 1;
    }
    // Make sure the main character doesn't run in front of their allies.
    // If the allies are fast enough, this shouldn't be an isse.
    var speedBonus = 1;
    var xOffset = 0;
    for (var i = 0; i < actor.allies.length; i++) {
        xOffset += actor.x - actor.allies[i].x;
    }
    speedBonus -= actor.direction * xOffset / 1000;
    speedBonus = Math.min(1.25, Math.max(speedBonus, .2));
    if (actor.chargeEffect) {
        speedBonus *= actor.chargeEffect.chargeSkill.speedBonus;
        actor.chargeEffect.distance += speedBonus * actor.speed * Math.max(.1, 1 - actor.slow) * delta;
    }
    // If the character is closer than they need to be to auto attack then they can back away f
    if (actor.target) {
        var distanceToTarget = getDistance(actor, actor.target);
        if (distanceToTarget <= (actor.weaponRange - 1) * 32 || Math.abs(actor.x - actor.target.x) < 32) {
            speedBonus *= -.5;
        } else if (distanceToTarget <= actor.weaponRange * 32) {
            speedBonus = 0;
        }
    }
    actor.x += speedBonus * actor.speed * actor.direction * Math.max(.1, 1 - actor.slow) * delta;
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
        newMonster.direction = -1; // Monsters move right to left
        newMonster.x = x;
        newMonster.character = character;
        initializeActorForAdventure(newMonster);
        newMonster.time = 0;
        newMonster.animationTime = newMonster.x;
        newMonster.allies = character.enemies;
        newMonster.enemies = character.allies;
        character.enemies.push(newMonster);
        x += 120 + Math.floor(Math.random() * 50);
    });
    wave.objects.forEach(function (entityData) {
        if (entityData.type === 'chest') {
            entityData.x = x;
            entityData.y = 0;
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
        capHealth(target);
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
    if (actor.isDead || actor.stunned) return;
    var targets = [];
    for (var i = 0; i < actor.allies.length; i++) {
        var target = actor.allies[i];
        target.priority = getDistance(actor, target) - 1000;
        targets.push(target);
    }
    for (var i = 0; i < actor.enemies.length; i++) {
        var target = actor.enemies[i];
        target.priority = getDistance(actor, target);
        if (target.priority <= 0) {
            if (actor.chargeEffect) {
                var attackStats = createAttackStats(actor, actor.chargeEffect.chargeSkill, target);
                attackStats.distance = actor.chargeEffect.distance;
                var hitTargets = getAllInRange(target.x, actor.chargeEffect.chargeSkill.area, actor.enemies);
                for (var j = 0; j < hitTargets.length; j++) {
                    applyAttackToTarget(attackStats, hitTargets[j]);
                }
                actor.chargeEffect = null;
                actor.target = target;
                return;
            }
        }
        if (target === actor.target) {
            target.priority -= 100;
        }
        targets.push(target);
    }
    // An actor that is being pulled cannot perform any actions.
    if (actor.pull || actor.chargeEffect) {
        actor.target = null;
        return;
    }
    // The main purpose of this is to prevent pulled actors from passing through their enemies.
     // Character is assumed to not be blocked each frame
    // Target the enemy closest to you, not necessarily the one previously targeted.
    targets.sort(function (A, B) {
        return A.priority - B.priority;
    });
    // Don't choose a new target until
    if (ifdefor(actor.attackCooldown, 0) > actor.time) {
        return;
    }
    actor.target = null;
    for (var i = 0; i < targets.length; i++) {
        var target = targets[i];
        // Returns true if the actor chose an action. May actually take an action
        // that doesn't target an enemy, but that's okay, we set target anyway
        // to indicate that he has acted this frame.
        if (checkToUseSkillOnTarget(character, actor, target)) {
            actor.target = target;
            break;
        }
    }
    actor.cloaked = (actor.cloaking && !actor.target);
}
function checkToUseSkillOnTarget(character, actor, target) {
    for(var i = 0; i < ifdefor(actor.actions, []).length; i++) {
        if (useSkill(actor, actor.actions[i], target, false)) {
            return true;
        }
    }
    return false;
}

function getDistance(actorA, actorB) {
    return Math.max(0, (actorA.x > actorB.x)
        ? (actorA.x - actorB.x - ifdefor(actorB.width, 64))
        : (actorB.x - actorA.x - ifdefor(actorA.width, 64)));
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
        loot.addTreasurePopup(character, enemy.x + enemy.base.source.width / 2 + index * 20, enemy.height, 0, 1, index * 10);
    });
}
