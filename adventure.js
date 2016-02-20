function startArea(character, index) {
    if (!levels[index]) {
        throw new Error('No level found for ' + index);
    }
    character.currentLevelIndex = index;
    character.area = instantiateLevel(levels[index], character.levelsCompleted[index]);
    character.waveIndex = 0;
    character.adventurer.x = 0;
    character.adventurer.stunned = 0;
    character.adventurer.pull = null;
    character.adventurer.timedEffects = [];
    character.adventurer.health = character.adventurer.maxHealth;
    character.finishTime = false;
    character.cameraX = -30;
    character.enemies = [];
    character.objects = [];
    character.projectiles = [];
    character.allies = [character.adventurer];
    character.adventurer.allies = character.allies;
    character.adventurer.enemies = character.enemies;
    character.adventurer.isAlly = true;
    character.treasurePopups = [];
    character.textPopups = [];
    character.$panel.find('.js-recall').prop('disabled', false);
    character.adventurer.actions.concat(character.adventurer.reactions).forEach(function (action) {
        action.readyAt = 0;
    });
    drawAdventure(character);
    character.$panel.find('.js-infoMode').hide();
    character.$panel.find('.js-adventureMode').show();
}
function isActorDead(actor, character) {
    return actor.health <= 0 && !actor.undying;
}

function adventureLoop(character, delta) {
    var adventurer = character.adventurer;
    var everybody = character.allies.concat(character.enemies);
    everybody.forEach(function (actor) {
        processStatusEffects(character, actor, delta);
    });
    // Check for defeated player/enemies.
    if (isActorDead(adventurer, character)) {
        displayInfoMode(character);
        return;
    }
    for (var i = 0; i < character.enemies.length; i++) {
        var enemy = character.enemies[i];
        if (isActorDead(enemy, character)) {
            character.enemies.splice(i--, 1);
            defeatedEnemy(character, enemy);
            continue;
        }
        expireTimedEffects(character, enemy);
    }
    for (var i = 0; i < character.allies.length; i++) {
        var ally = character.allies[i];
        if (isActorDead(ally, character)) {
            character.allies.splice(i--, 1);
            continue;
        }
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
    // Check to start next wave/complete level.
    if (character.enemies.length + character.objects.length == 0) {
        if (character.waveIndex >= character.area.waves.length) {
            if (!character.finishTime) {
                character.finishTime = character.time + 2;
            } else if (character.finishTime <= character.time) {
                completeArea(character);
                return;
            }
        } else {
            startNextWave(character);
            if (character.waveIndex >= character.area.waves.length) {
                character.$panel.find('.js-recall').prop('disabled', true);
            }
        }
    }
    character.allies.forEach(function (actor) {
        runActorLoop(character, actor);
    });
    character.enemies.forEach(function (actor) {
        runActorLoop(character, actor);
    });
    everybody.forEach(function (actor) {
        if (!actor.stunned && !actor.blocked && !actor.target && !actor.pull && !ifdefor(actor.stationary)) {
            // Make sure the main character doesn't run in front of their allies.
            if (actor.isMainCharacter) {
                for (var i = 0; i < character.allies.length; i++) {
                    if (character.allies[i] === actor) continue;
                    if (character.allies[i].x < actor.x) return true;
                }
            }
            actor.x += actor.speed * actor.direction * Math.max(0, (1 - actor.slow)) * delta;
        }
        return true;
    });
    everybody.forEach(function (actor) {
        actor.health = Math.min(actor.maxHealth, Math.max(0, actor.health));
    });
    for (var i = 0; i < character.projectiles.length; i++) {
        character.projectiles[i].update(character);
    }
    for (var i = 0; i < character.treasurePopups.length; i++) {
        character.treasurePopups[i].update(character);
    }
    for (var i = 0; i < character.textPopups.length; i++) {
        character.textPopups[i].y--;
    }
}
function expireTimedEffects(character, actor) {
    var changed = false;
    for (var i = 0; i < actor.timedEffects.length; i++) {
        if (actor.timedEffects[i].expirationTime < character.time) {
            actor.timedEffects.splice(i--);
            changed = true;
        }
    }
    if (changed) {
        updateActorStats(actor);
    }
}
function addTimedEffect(character, actor, effect) {
    effect = copy(effect);
    effect.expirationTime = character.time + effect.duration;
    actor.timedEffects.push(effect);
    updateActorStats(actor);
}
function startNextWave(character) {
    var wave = character.area.waves[character.waveIndex];
    var x = character.adventurer.x + 800;
    wave.monsters.forEach(function (entityData) {
        var extraSkills = ifdefor(character.area.enemySkills, []).concat({'bonuses' : wave.extraBonuses});
        var newMonster = makeMonster(entityData, character.area.level, extraSkills);
        newMonster.x = x;
        newMonster.character = character;
        newMonster.direction = -1; // Monsters move right to left
        newMonster.allies = character.enemies;
        newMonster.enemies = character.allies;
        character.enemies.push(newMonster);
        newMonster.timeOffset = character.time + newMonster.x;
        x += 120 + Math.floor(Math.random() * 50);
    });
    wave.objects.forEach(function (entityData) {
        if (entityData.type === 'chest') {
            entityData.x = x;
            character.objects.push(entityData);
            return;
        }
    throw Error("Unrecognized object: " + JSON.stringify(entityData));
    });
    character.waveIndex++;
}
function processStatusEffects(character, target, delta) {
    if (target.health <= 0) {
        return;
    }
    // Apply DOT, movement effects and other things that happen to targets here.
    // Target becomes 50% less slow over 1 second, or loses .1 slow over one second, whichever is faster.
    if (target.slow) {
        target.slow = Math.max(0, Math.min(target.slow - .5 * target.slow * delta, target.slow - .1 * delta));
    }
    if (ifdefor(target.healthRegen)) {
        target.health += target.healthRegen * delta;
    }
    if (ifdefor(target.pull)) {
        var timeLeft = (target.pull.time - character.time);
        if (timeLeft > 0) {
            var dx = (target.pull.x - target.x) * Math.min(1, delta / timeLeft);
            var damage = target.pull.damage * Math.min(1, delta / timeLeft);
            target.pull.damage -= damage;
            if (!target.blocked) {
                target.x += dx;
                target.health -= damage;
            }
        } else {
            if (!target.blocked) {
                target.x = target.pull.x;
                target.health -= target.pull.damage;
            }
            target.pull = null;
        }
    }
    if (target.stunned && target.stunned <= character.time) {
        target.stunned = null;
    }
}
function runActorLoop(character, actor) {
    if (actor.stunned) return;
    var targets = actor.enemies.slice();
    actor.blocked = false; // Character is assumed to not be blocked each frame
    if (actor.target) {
        var index = targets.indexOf(actor.target);
        if (index >= 0) {
            targets.splice(index, 1);
            targets.unshift(actor.target);
        }
    }
    // Target the enemy closest to you, not necessarily the one previously targeted.
    targets.sort(function (A, B) {
        return actor.direction * (A.x - B.x);
    });
    // Don't choose a new target until
    if (ifdefor(actor.attackCooldown, 0) > character.time) {
        return;
    }
    actor.target = null;
    for (var i = 0; i < targets.length; i++) {
        var target = targets[i];
        var distance = Math.abs(target.x - actor.x) - 64; // 64 is the width of the character
        actor.blocked = actor.blocked || distance <= 0; // block the actor if a target is too close
        // Don't check to attack if the character is disabled, already has a
        if (actor.pull || actor.target) {
            continue;
        }
        // Returns true if the actor chose an action. May actually take an action
        // that doesn't target an enemy, but that's okay, we set target anyway
        // to indicate that he has acted this frame.
        if (checkToAttackTarget(character, actor, target, distance)) {
            actor.target = target;
        }
    }
    actor.cloaked = (actor.cloaking && !actor.blocked && !actor.target);
}
function checkToAttackTarget(character, actor, target, distance) {
    for(var i = 0; i < ifdefor(actor.actions, []).length; i++) {
        if (useSkill(actor, actor.actions[i], target, false)) {
            return true;
        }
    }
    return false;
}

function getDistance(actorA, actorB) {
    return Math.max(0, (actorA.x > actorB.x) ? (actorA.x - actorB.x - 64) : (actorB.x - actorA.x - 64));
}

function defeatedEnemy(character, enemy) {
    if (character.adventurer.health <= 0) {
        return;
    }
    // Character only gains experience from equal or higher level monsters.
    if (enemy.level >= character.adventurer.level) {
        gainXP(character.adventurer, enemy.xpValue);
    }
    var loot = [];
    if (enemy.coins) loot.push(coinsLootDrop(enemy.coins));
    if (enemy.anima) loot.push(animaLootDrop(enemy.anima));
    loot.forEach(function (loot, index) {
        loot.gainLoot(character);
        loot.addTreasurePopup(character, enemy.x +enemy.base.source.width / 2 + index * 20, 240 - 140, 0, -1, index * 10);
    });
}
function drawAdventure(character) {
    var adventurer = character.adventurer;
    var context = character.context;
    var cameraX = character.cameraX;
    context.clearRect(0, 0, character.canvas.width, character.canvas.height);
    var background = ifdefor(character.area.background, backgrounds.field);
    var cloudX = cameraX + character.time * .5;
    background.forEach(function(section) {
        var source = section.source;
        var y = ifdefor(section.y, 0);
        var height = ifdefor(section.height, 240 - y);
        var width = ifdefor(section.width, 64);
        var parallax = ifdefor(section.parallax, 1);
        var spacing = ifdefor(section.spacing, 1);
        var velocity = ifdefor(section.velocity, 0);
        for (var i = 0; i <= 704; i += 64 * spacing) {
            var x = (768 + (i - (cameraX - character.time * velocity) * parallax) % 768) % 768 - 64;
            context.drawImage(source.image, source.x, source.y, source.width, source.height,
                                  x, y, width, height);
        }
    });
    character.objects.forEach(function (object, index) {
        object.draw(character.context, object.x - cameraX, 240 - 128);
    });
    character.enemies.forEach(function (actor, index) {
        drawActor(character, actor, index)
    });
    character.allies.forEach(function (actor, index) {
        if (actor == adventurer) return;
        drawActor(character, actor, -index)
    });
    drawActor(character, adventurer, 0);
    context.globalAlpha = 1;
    // xp bar
    drawBar(context, 35, 240 - 45, 400, 6, 'white', '#00C000', adventurer.xp / adventurer.xpToLevel);
    context.font = "20px sans-serif";
    context.textAlign = 'right'
    context.fillText(adventurer.level, 30, 240 - 35);
    // Draw text popups such as damage dealt, item points gained, and so on.
    context.fillStyle = 'red';
    for (var i = 0; i < character.treasurePopups.length; i++) {
        var treasurePopup = character.treasurePopups[i];
        treasurePopup.draw(character);
        if (treasurePopup.done) {
            character.treasurePopups.splice(i--, 1);
        }
    }
    for (var i = 0; i < character.projectiles.length; i++) {
        var projectile = character.projectiles[i];
        projectile.draw(character);
        if (projectile.done) {
            character.projectiles.splice(i--, 1);
        }
    }
    for (var i = 0; i < character.textPopups.length; i++) {
        var textPopup = character.textPopups[i];
        context.fillStyle = ifdefor(textPopup.color, "red");
        context.font = ifdefor(textPopup.font, "20px sans-serif");
        context.textAlign = 'center'
        context.fillText(textPopup.value, textPopup.x - cameraX, textPopup.y);
        if (textPopup.y < 60) {
            character.textPopups.splice(i--, 1);
        }
    }
    drawMinimap(character);
}
function drawActor(character, actor, index) {
    if (actor.personCanvas) drawAdventurer(character, actor, index);
    else drawMonster(character, actor, index);
}
function drawMonster(character, monster, index) {
    var cameraX = character.cameraX;
    var context = character.context;
    var fps = ifdefor(monster.base.fpsMultiplier, 1) * 3 * monster.speed / 100;
    var source = monster.base.source;
    var frame = Math.floor(character.time * fps) % source.frames;
    if (monster.pull) {
        frame = 0;
    }
    if (monster.cloaked) {
        context.globalAlpha = .2;
    }
    if (source.flipped && monster.direction < 0) {
        context.translate((monster.x - cameraX + source.width), 0);
        context.scale(-1, 1);
        context.drawImage(monster.image, frame * source.width + source.offset, 0 , source.width, 64,
                          -source.width, 240 - 128 - 72, source.width * 2, 128);
        context.scale(-1, 1);
        context.translate(-(monster.x - cameraX + source.width), 0);
    } else {
        context.translate((monster.x - cameraX + source.width), 0);
        context.drawImage(monster.image, frame * source.width + source.offset, 0 , source.width, 64,
                          -source.width, 240 - 128 - 72, source.width * 2, 128);
        context.translate(-(monster.x - cameraX + source.width), 0);
    }
    context.globalAlpha = 1;
    monster.left = monster.x - cameraX;
    monster.top = 240 - 128 - 72;
    monster.width = source.width * 2;
    monster.height = 128;
    // Uncomment to draw a reference of the character to show where left side of monster should be
    // context.drawImage(character.personCanvas, 0 * 32, 0 , 32, 64, monster.x - cameraX, 240 - 128 - 72, 64, 128);
    //context.fillRect(monster.x - cameraX, 240 - 128 - 72, 64, 128);
    // life bar
    drawBar(context, monster.x - cameraX + source.width - 32, 240 - 128 - 36 - 5 * index, 64, 4, 'white', monster.color, monster.health / monster.maxHealth);
}
function drawAdventurer(character, adventurer, index) {
    var cameraX = character.cameraX;
    var context = character.context;
    //draw character
    if (adventurer.target && adventurer.lastAction && adventurer.lastAction.attackSpeed) { // attacking loop
        var attackSpeed = adventurer.lastAction.attackSpeed;
        var attackFps = 1 / ((1 / attackSpeed) / fightLoop.length);
        var frame = Math.floor(Math.abs(character.time - adventurer.attackCooldown) * attackFps) % fightLoop.length;
        context.drawImage(adventurer.personCanvas, fightLoop[frame] * 32, 0 , 32, 64,
                        adventurer.x - cameraX, 240 - 128 - 72, 64, 128);
    } else { // walking loop
        if (adventurer.cloaked) {
            context.globalAlpha = .2;
        }
        var fps = Math.floor(3 * adventurer.speed / 100);
        var frame = Math.floor(character.time * fps) % walkLoop.length;
        if (adventurer.pull || adventurer.stunned) {
            frame = 0;
        }
        context.drawImage(adventurer.personCanvas, walkLoop[frame] * 32, 0 , 32, 64,
                        adventurer.x - cameraX, 240 - 128 - 72, 64, 128);
    }
    //context.fillRect(adventurer.x - cameraX, 240 - 128 - 72, 64, 128);
    // life bar
    drawBar(context, adventurer.x - cameraX, 240 - 128 - 36 - 5 * index, 64, 4, 'white', 'red', adventurer.health / adventurer.maxHealth);
}
function drawMinimap(character) {
    var y = 240 - 18;
    var height = 6;
    var x = 10;
    var width = 650;
    var context = character.context;
    drawBar(context, x, y, width, height, 'white', 'white', character.waveIndex / character.area.waves.length);
    for (var i = 0; i < character.area.waves.length; i++) {
        var centerX = x + (i + 1) * width / character.area.waves.length;
        var centerY = y + height / 2;
        context.fillStyle = 'white';
        context.beginPath();
            context.arc(centerX, centerY, 11, 0, 2 * Math.PI);
        context.fill();
    }
    context.fillStyle = 'orange';
    context.fillRect(x + 1, y + 1, (width - 2) * (character.waveIndex / character.area.waves.length) - 10, height - 2);
    for (var i = 0; i < character.area.waves.length; i++) {
        var centerX = x + (i + 1) * width / character.area.waves.length;
        var centerY = y + height / 2;
        if (i < character.waveIndex) {
            context.fillStyle = 'orange';
            context.beginPath();
            context.arc(centerX, centerY, 10, 0, 2 * Math.PI);
            context.fill();
        }
        var waveCompleted = (i < character.waveIndex - 1)  || (i <= character.waveIndex && (character.enemies.length + character.objects.length) === 0);
        character.area.waves[i].draw(context, waveCompleted, centerX, centerY);
    }
}