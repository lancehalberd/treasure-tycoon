var MIN_SLOW = .5;
function startLevel(character, index) {
    if (!map[index]) {
        throw new Error('No level found for ' + index);
    }

    if (character.currentLevelKey !== index) {
        character.board.boardPreview = null;
        drawBoardBackground(character.boardContext, character.board);
    }
    var hero = character.hero;
    hero.heading = [1, 0, 0];
    character.currentLevelKey = index;
    var levelCompleted = ifdefor(character.divinityScores[index], 0) !== 0;
    var difficultyCompleted = !!ifdefor(character.levelTimes[index], {})[character.levelDifficulty];
    leaveCurrentArea(hero, true);
    // Can't bring minions with you into new areas.
    (hero.minions || []).forEach(removeActor);
    hero.boundEffects = [];
    // Effects don't persist accross areas.
    removeAdventureEffects(hero);
    if (character.levelDifficulty === 'endless') {
        hero.levelInstance = instantiateLevel(map[index], character.levelDifficulty, difficultyCompleted, getEndlessLevel(character, map[index]));
    } else {
        hero.levelInstance = instantiateLevel(map[index], character.levelDifficulty, difficultyCompleted);
    }
    for (var action of hero.actions.concat(hero.reactions)) action.readyAt = 0;
    enterArea(hero, hero.levelInstance.entrance);
    if (state.selectedCharacter === character) {
        updateAdventureButtons();
    }
    saveGame();
}

function enterArea(actor, {x, z, areaKey}) {
    var character = actor.character;
    if (areaKey === 'worldMap') {
        returnToMap(character);
        return;
    }
    leaveCurrentArea(actor);
    var area;
    if (guildAreas[areaKey]) {
        area = guildAreas[areaKey];
        initializeActorForAdventure(actor);
        if (!area.allies.length && !state.unlockedGuildAreas[area.key]) {
            addMonstersToArea(area, area.monsters, [], 0);
        }
        actor.actions.concat(actor.reactions).forEach(function (action) {
            action.readyAt = 0;
        });
        if (character) {
            character.context = 'guild'
            character.currentLevelKey = 'guild';
            character.guildAreaKey = area.key;
            if (character === state.selectedCharacter) {
                updateAdventureButtons();
                showContext('guild');
            }
        }
    } else {
        area = (actor.owner || actor).levelInstance.areas.get(areaKey);
    }
    // This can be uncommented to allow minions to follow you through areas.
    (actor.minions || []).forEach(minion => enterArea(minion, {x:x + actor.heading[0] * 10, z: z - 90, areaKey}));
    // Any effects bound to the hero should be added to the area they have entered.
    (actor.boundEffects || []).forEach(effect => {
        area.effects.push(effect);
    });
    actor.area = area;
    actor.x = x;
    actor.y = 0;
    actor.z = z;
    if (character === state.selectedCharacter) {
        area.cameraX = Math.round(Math.max(area.left, Math.min(area.width - 800, actor.x - 400)));
    }
    if (isNaN(actor.x) || isNaN(actor.z)) {
        debugger;
    }
    area.allies.push(actor);
    actor.allies = area.allies;
    actor.enemies = area.enemies;
    actor.activity = null;
}
function addMonstersToArea(area, monsters, extraBonuses = [], specifiedRarity) {
    area.enemies = [];
    for (var monsterData of (monsters || [])) {
        var bonusSources = (monsterData.bonusSources || []).concat(extraBonuses);
        var rarity = ifdefor(monsterData.rarity, specifiedRarity);
        var newMonster = makeMonster(monsterData.key, monsterData.level, bonusSources, rarity);
        newMonster.heading = [-1, 0, 0]; // Monsters move right to left
        newMonster.x = monsterData.location[0];
        newMonster.y = monsterData.location[1];
        newMonster.z = monsterData.location[2];
        newMonster.area = area;
        initializeActorForAdventure(newMonster);
        newMonster.time = 0;
        newMonster.allies = newMonster.area.enemies;
        newMonster.enemies = newMonster.area.allies;
        newMonster.allies.push(newMonster);
    }
}
function checkIfActorDied(actor) {
    const area = actor.area;
    // The actor who has stopped time cannot die while the effect is in place.
    if (area.timeStopEffect && area.timeStopEffect.actor === actor) return;
    // Actor has not died if they are already dead, have postiive health, cannot die or are currently being pulled.
    if (actor.isDead || actor.health > 0 || actor.undying || actor.pull) return;
    // If the actor is about to die, check to activate their temporal shield if they have one.
    var stopTimeAction = findActionByTag(actor.reactions, 'stopTime');
    if (stopTimeAction && canUseReaction(actor, stopTimeAction, {})) {
        useReaction(actor, stopTimeAction, {});
        return;
    }
    // The actor has actually died, mark them as such and begin their death animation and drop spoils.
    actor.isDead = true;
    actor.timeOfDeath = actor.time;
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

    if (actor.targetHealth < actor.health) {
        // Life is lost at a rate dictated by the actors tenacity.
        var healthLostPerFrame = actor.maxHealth * frameMilliseconds / (actor.tenacity * 1000);
        // Lost health each frame until actor.health === actor.targetHealth.
        actor.health = Math.max(actor.targetHealth, actor.health - healthLostPerFrame);
    } else actor.health = actor.targetHealth; //Life gained is immediately applied
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
    actor.targetHealth = Math.min(actor.maxHealth, actor.targetHealth);
    if (!actor.enemies.length && actor.bonusMaxHealth) {
        actor.bonusMaxHealth *= .99;
    }
    actor.percentTargetHealth = actor.targetHealth / actor.maxHealth;
}
// Remove bound effects from an area. Called when the actor dies or leaves the area.
function removeBoundEffects(actor, area, finishEffect = false) {
    (actor.boundEffects || []).forEach(effect => {
        var index = area.effects.indexOf(effect);
        if (index >= 0) area.effects.splice(index, 1);
        if (finishEffect && effect.finish) effect.finish();
    });
}
function removeActor(actor) {
    if (actor.owner) {
        var minionIndex = actor.owner.minions.indexOf(actor);
        if (minionIndex >= 0) actor.owner.minions.splice(minionIndex, 1);
    }
    if (actor.area) removeBoundEffects(actor, actor.area, true);
    var index = actor.allies.indexOf(actor);
    // When a character with minions exits to the world map, this method is called on minions
    // after they are already removed from the area, so they won't be in the list of allies already.
    if (index < 0) return;
    actor.allies.splice(index, 1);
    if (actor.character) {
        var character = actor.character;
        var area = actor.area;
        if (area.isGuildArea) {
            removeAdventureEffects(actor);
            enterArea(actor, actor.escapeExit || guildYardEntrance);
            return;
        }
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
    // Speed up time for actors when no enemies are around to heal+reduce cool downs
    // after each area is cleared of monsters. Could make this something that the
    // player can toggle on, but it will hurt dark knight when I reduce max health
    // bonus when no monsters are around.
    //var multiplier = area.enemies.length ? 1 : 10;
    for (var actor of everybody) actor.time += delta;// * multiplier;
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
    area.allies.forEach(runActorLoop);
    area.enemies.forEach(runActorLoop);
    // A skill may have removed an actor from one of the allies/enemies array, so remake everybody.
    everybody = area.allies.concat(area.enemies);
    everybody.forEach(moveActor);
    // This may have changed if actors left the area.
    everybody = area.allies.concat(area.enemies);
    for (var i = 0; i < area.projectiles.length; i++) {
        area.projectiles[i].update(area);
        if (area.projectiles[i].done) area.projectiles.splice(i--, 1);
    }
    for (var i = 0; i < area.effects.length; i++) {
        var effect = area.effects[i];
        effect.update(area);
        // If the effect was removed from the array already (when a song follows its owner between areas)
        // we need to decrement i to not skip the next effect.
        if (effect !== area.effects[i]) {
            i--;
        } else {
            if (area.effects[i].done) area.effects.splice(i--, 1);
        }
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
        if (actor.timeOfDeath < actor.time - 1) {
            removeActor(actor);
            return;
        }
        capHealth(actor);
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
function processStatusEffects(target) {
    if (target.isDead ) return;
    var delta = frameMilliseconds / 1000;
    // Apply DOT, movement effects and other things that happen to targets here.
    // Target becomes 50% less slow over 1 second, or loses .1 slow over one second, whichever is faster.
    if (target.slow) {
        target.slow = Math.max(0, Math.min(target.slow - .5 * target.slow * delta, target.slow - .1 * delta));
    }
    healActor(target, (target.healthRegen || 0) * delta);
    damageActor(target, (target.damageOverTime || 0) * delta);
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
        if (!target.pull.duration) {
            target.pull.duration = target.pull.time - target.time;
        }
        if (target.pull.attackStats) {
            performAttackProper(target.pull.attackStats, target);
            target.pull.attackStats = null;
        }
        var timeLeft = (target.pull.time - target.time);
        var radius = target.pull.duration / 2
        var parabolaValue = (radius**2 - (timeLeft - radius)**2) / (radius ** 2);
        if (timeLeft > 0) {
            var dx = (target.pull.x - target.x) * Math.min(1, delta / timeLeft);
            var dz = (target.pull.z - target.z) * Math.min(1, delta / timeLeft);
            var dr = (0 - target.rotation) * Math.min(1, delta / timeLeft);
            target.rotation += dr;
            var damage = target.pull.damage * Math.min(1, delta / timeLeft);
            target.pull.damage -= damage;
            target.x += dx;
            target.z += dz;
            var baseY = target.baseY || 0;
            var dy = target.pull.y || 0 - baseY;
            target.y = baseY + dy * parabolaValue;
            damageActor(target, damage);
        } else {
            target.rotation = 0;
            target.x = target.pull.x;
            target.z = target.pull.z;
            target.y = target.baseY || 0;
            damageActor(target, target.pull.damage);
            if (target.pull.action) {
                prepareToUseSkillOnTarget(target, target.pull.action, target.pull.target);
                target.pull.action.totalPreparationTime = 0;
            }
            target.pull = null;
        }
        // End the pull if the target hits something.
        for (var object of target.area.objects) {
            if (object.solid === false) continue;
            var distance = getDistanceOverlap(target, object);
            if (distance <= -8) {
                target.pull = null;
                target.y = target.baseY || 0;
                target.rotation = 0;
                break;
            }
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
        var actionDelta = frameMilliseconds / 1000 * Math.max(MIN_SLOW, 1 - actor.slow);
        if (actor.preparationTime <= actor.skillInUse.totalPreparationTime) {
            actor.preparationTime += actionDelta;
            if (actor.preparationTime >= actor.skillInUse.totalPreparationTime) {
                actor.preparationTime++; // make sure this is strictly greater than totalPreparation time.
                useSkill(actor);
            }
            return;
        } else if (actor.recoveryTime < actor.totalRecoveryTime) {
            actor.recoveryTime += actionDelta;
            return;
        } else {
            actor.skillInUse = null;
            if (actor.character && actor.character.paused && !mouseDown) {
                actor.activity = null;
            }
        }
    }
    if (actor.activity) {
        switch (actor.activity.type) {
            case 'attack':
                if (actor.activity.target.isDead) {
                    actor.activity = null;
                } else {
                    var target = actor.activity.target;
                    // If the actor is in manual mode, only do auto attacks.
                    if (actor.character && actor.character.paused) {
                        var basicAttack = getBasicAttack(actor);
                        if (!basicAttack) {
                            actor.acitity = null;
                            break;
                        }
                        if (!canUseSkillOnTarget(actor, basicAttack, target)) break;
                        if (!isTargetInRangeOfSkill(actor, basicAttack, target)) break;
                        prepareToUseSkillOnTarget(actor, basicAttack, target);
                    } else {
                        checkToUseSkillOnTarget(actor, target);
                    }
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
    } else if (actor.character && actorShouldAutoplay(actor) && !actor.enemies.filter(enemy => enemy.targetHealth >= 0).length) {
        const character = actor.character;
        // Code for intracting with chest/shrine at the end of level and leaving the area.
        for (var object of area.objects) {
            // Hack the actor will only check objects the he hasn't passed yet.
            if (
                object.solid === false
                || object.x < actor.x + 100
                || (object.isEnabled && !object.isEnabled())
            ) {
                continue;
            }
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
            if (object.exit) {
                setActorInteractionTarget(actor, object);
                break;
            }
        }
    }
    // Manual control doesn't use the auto targeting logic.
    if (actor.character && actor.character.paused) {
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
    if (!actor.character) return true; // Only character heroes can be manually controlled.
    return !actor.character.isStuckAtShrine
        && (actor.character.autoplay || (actor.character !== state.selectedCharacter && actor.enemies.length));
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
    var distance = Math.sqrt(dx*dx + dz*dz) - ((spriteA.width || 0) + (spriteB.width || 0)) / 2;
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
        loot.addTreasurePopup(hero, enemy.x + index * 20, enemy.height, index * 10);
        // If the last enemy is defeated in the boss area, the level is completed.
    });
    if (hero.area.isBossArea && hero.enemies.every(enemy => enemy.isDead)) {
        // hero.time is set to 0 at the start of the level by initializeActorForAdventure.
        completeLevel(hero);
    }
}

function completeLevel(hero) {
    var character = hero.character;
    var completionTime = hero.time;
    const levelInstance = hero.levelInstance;
    levelInstance.completed = true;
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
    if (levelInstance.levelDifficulty === 'endless') {
        newDivinityScore = Math.max(10, Math.round(baseDivinity(currentEndlessLevel)));
    } else {
        var difficultyBonus = difficultyBonusMap[levelInstance.levelDifficulty];
        var timeBonus = .8;
        if (completionTime <= getGoldTimeLimit(level, difficultyBonus)) timeBonus = 1.2;
        else if (completionTime <= getSilverTimeLimit(level, difficultyBonus)) timeBonus = 1;
        newDivinityScore = Math.max(10, Math.round(difficultyBonus * timeBonus * baseDivinity(level.level)));
    }
    var gainedDivinity = newDivinityScore - oldDivinityScore;
    if (gainedDivinity > 0) {
        character.divinity += gainedDivinity;
        var textPopup = {value:'+' + gainedDivinity.abbreviate() + ' Divinity', x: hero.x, y: hero.height, z: hero.z, color: 'gold', fontSize: 15, 'vx': 0, 'vy': 1, 'gravity': .1};
        appendTextPopup(hero.area, textPopup, true);
    }
    character.divinityScores[character.currentLevelKey] = Math.max(oldDivinityScore, newDivinityScore);
    // Initialize level times for this level if not yet set.
    character.levelTimes[character.currentLevelKey] = ifdefor(character.levelTimes[character.currentLevelKey], {});
    if (levelInstance.levelDifficulty === 'endless') {
        unlockItemLevel(currentEndlessLevel + 1);
        character.levelTimes[character.currentLevelKey][levelInstance.levelDifficulty] = currentEndlessLevel + 5;
    } else {
        unlockItemLevel(level.level + 1);
        var oldTime = ifdefor(character.levelTimes[character.currentLevelKey][levelInstance.levelDifficulty], 99999);
        character.levelTimes[character.currentLevelKey][levelInstance.levelDifficulty] = Math.min(completionTime, oldTime);
    }
    saveGame();
}
