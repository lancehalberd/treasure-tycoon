function startArea(character, index) {
    if (!levels[index]) {
        throw new Error('No level found for ' + index);
    }
    character.currentLevelIndex = index;
    character.$panel.find('.js-infoMode').hide();
    character.$panel.find('.js-adventureMode').show();
    character.area = instantiateLevel(levels[index], character.levelsCompleted[index]);
    character.waveIndex = 0;
    character.adventurer.x = 0;
    character.adventurer.pull = null;
    character.finishTime = false;
    character.cameraX = -30;
    character.enemies = [];
    character.objects = [];
    character.allies = [character.adventurer];
    character.adventurer.isAlly = true;
    character.treasurePopups = [];
    character.textPopups = [];
    character.$panel.find('.js-recall').prop('disabled', false);
    character.adventurer.attacks.forEach(function (attack) {
        attack.readyAt = 0;
    });
}
function adventureLoop(character, delta) {
    var adventurer = character.adventurer;
    var everybody = character.allies.concat(character.enemies);
    everybody.forEach(function (actor) {
        processStatusEffects(character, actor, delta);
    });
    // Check for defeated player/enemies.
    if (adventurer.health <= 0) {
        displayInfoMode(character);
        return;
    }
    for (var i = 0; i < character.enemies.length; i++) {
        var enemy = character.enemies[i];
        if (enemy.health <= 0) {
            character.enemies.splice(i--, 1);
            defeatedEnemy(character, enemy);
            continue;
        }
    }
    for (var i = 0; i < character.allies.length; i++) {
        var ally = character.allies[i];
        if (ally.health <= 0) {
            character.allies.splice(i--, 1);
            continue;
        }
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
        performAction(character, actor, character.enemies.slice());
    });
    character.enemies.forEach(function (actor) {
        performAction(character, actor, character.allies.slice());
    });
    everybody.forEach(function (actor) {
        if (!actor.stunned && !actor.blocked && !actor.target && !actor.pull && !ifdefor(actor.stationary)) {
            actor.x += actor.speed * actor.direction * Math.max(0, (1 - actor.slow)) * delta;
        }
    });
    everybody.forEach(function (actor) {
        actor.health = Math.min(actor.maxHealth, Math.max(0, actor.health));
    });
    drawAdventure(character, delta);
}
function startNextWave(character) {
    var wave = character.area.waves[character.waveIndex];
    var x = character.adventurer.x + 800;
    wave.monsters.forEach(function (entityData) {
        var newMonster = makeMonster(entityData, character.area.level, character.area.enemyBonuses);
        newMonster.x = x;
        newMonster.character = character;
        newMonster.direction = -1; // Monsters move right to left
        character.enemies.push(newMonster);
        newMonster.timeOffset = character.time + newMonster.x;
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
    target.slow = Math.max(0, target.slow - .1 * delta);
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
function performAction(character, actor, targets) {
    if (actor.stunned) return;
    actor.blocked = false; // Character is assumed to not be blocked each frame
    if (actor.target) {
        var index = targets.indexOf(actor.target);
        if (index >= 0) {
            targets.splice(index, 1);
            targets.unshift(actor.target);
        }
    }
    actor.target = null;
    targets.forEach(function (target) {
        var distance = Math.abs(target.x - actor.x) - 64; // 64 is the width of the character
        actor.blocked = actor.blocked || distance <= 0; // block the actor if a target is too close
        if (actor.pull) {
            return;
        }
        if (actor.target) return;
        ifdefor(actor.attacks, []).forEach(function (attack) {
            if (ifdefor(actor.attackCooldown, 0) > character.time) { // Attack the target if possible.
                return false;
            }
            if (attack.readyAt > character.time) {
                return true;
            }
            if (attack.base.type == 'monster') {
                var count = 0;
                character.allies.forEach(function (ally) {
                    if (ally.source == attack) count++;
                });
                if (count >= attack.limit) {
                    return true;
                }
                attack.readyAt = character.time + attack.cooldown;
                var monsterData = {
                    'key': attack.base.key,
                    'bonuses': {'*maxHealth': ifdefor(attack.healthBonus, 1),
                                '*minDamage': ifdefor(attack.damageBonus, 1),
                                '*maxDamage': ifdefor(attack.damageBonus, 1),
                                '*minMagicDamage': ifdefor(attack.damageBonus, 1),
                                '*maxMagicDamage': ifdefor(attack.damageBonus, 1)}
                }
                var newMonster = makeMonster(monsterData, character.adventurer.level);
                newMonster.x = actor.x + 32 + actor.direction * 64;
                newMonster.character = character;
                newMonster.direction = 1; // Minios move left to right
                newMonster.speed = Math.max(actor.speed + 5, newMonster.speed);
                newMonster.source = attack;
                character.allies.push(newMonster);
                actor.stunned = character.time + .3;
            }
            if (attack.base.type == 'hook') {
                if (distance <= actor.range * 32 || distance > attack.abilityRange * 32 || target.cloaked) {
                    return true;
                }
                performHookAttack(character, attack, actor, target);
            }
            return true;
        });
        if (distance > actor.range * 32 || target.cloaked) {
            return;
        }
        actor.target = target;
        if (ifdefor(actor.attackCooldown, 0) > character.time) { // Attack the target if possible.
            return;
        }
        actor.attackCooldown = character.time + 1 / (actor.attackSpeed * Math.max(.1, (1 - actor.slow)));
        performAttack(character, actor, target);
    });
    actor.cloaked = (actor.cloaking && !actor.blocked && !actor.target);
}
function applyArmorToDamage(damage, armor) {
    if (damage <= 0) {
        return 0;
    }
    //This equation looks a bit funny but is designed to have the following properties:
    //100% when armor = 0, 50% when armor = damage, 25% when armor = 2 * damage
    //1/(2^N) damage when armor is N times base damage
    return Math.max(1, Math.round(damage / Math.pow(2, armor / damage)));
}

function performAttack(character, attacker, target) {
    var damage = Random.range(attacker.minDamage, attacker.maxDamage);
    var magicDamage = Random.range(attacker.minMagicDamage, attacker.maxMagicDamage);
    var accuracyRoll = Random.range(0, attacker.accuracy);
    var hitText = {x: target.x + 32, y: 240 - 128, color: 'red'};
    if (Math.random() <= attacker.critChance) {
        damage *= (1 + attacker.critDamage);
        magicDamage *= (1 + attacker.critDamage);
        accuracyRoll *= (1 + attacker.critAccuracy);
        hitText.color = 'yellow';
        hitText.font, "40px sans-serif"
    }
    var evasionRoll = Random.range(0, target.evasion);
    if (accuracyRoll < evasionRoll) {
        hitText.value = 'miss';
        if (ifdefor(attacker.damageOnMiss)) {
            target.health -= attacker.damageOnMiss;
            hitText.value = 'miss (' + attacker.damageOnMiss + ')';
        }
        // Target has evaded the attack.
        hitText.color = 'blue';
        hitText.font, "15px sans-serif"
        character.textPopups.push(hitText);
        return;
    }
    if (ifdefor(attacker.healthGainOnHit)) {
        attacker.health += attacker.healthGainOnHit;
    }
    if (ifdefor(attacker.slowOnHit)) {
        target.slow = Math.max(target.slow, attacker.slowOnHit);
    }
    // Apply block reduction
    var blockRoll = Random.range(0, target.block);
    var magicBlockRoll = Random.range(0, target.magicBlock);
    damage = Math.max(0, damage - blockRoll);
    magicDamage = Math.max(0, magicDamage - magicBlockRoll);
    // Apply armor and magic resistance mitigation
    // TODO: Implement armor penetration here.
    damage = applyArmorToDamage(damage, target.armor);
    magicDamage = Math.round(magicDamage * Math.max(0, (1 - target.magicResist)));
    // TODO: Implement flat damage reduction here.
    var totalDamage = (damage + magicDamage);
    target.health -= totalDamage;
    hitText.value = totalDamage;
    if (totalDamage <= 0) {
        hitText.value = 'blocked';
        hitText.color = 'blue';
        hitText.font, "15px sans-serif"
    }
    character.textPopups.push(hitText);
}
function performHookAttack(character, attack, attacker, target) {
    var distance = getDistance(attacker, target);
    attack.readyAt = character.time + attack.cooldown;
    attacker.target = target;
    // Pull them just into range of the normal attack, no closer.
    var targetX = (attacker.x > target.x) ? (attacker.x - attacker.range * 32 - 64) : (attacker.x + 64 + attacker.range * 32);
    var multiplier = (1 + ifdefor(attack.rangeDamage, 0) * distance / 32);
    var damage = Random.range(attacker.minDamage, attacker.maxDamage);
    var magicDamage = Random.range(attacker.minMagicDamage, attacker.maxMagicDamage);
    var hitText = {x: target.x + 32, y: 240 - 128, color: 'red'};
    if (Math.random() <= attacker.critChance) {
        damage *= (1 + attacker.critDamage);
        magicDamage *= (1 + attacker.critDamage);
        hitText.color = 'yellow';
        hitText.font, "40px sans-serif"
    }
    damage = Math.floor(damage * multiplier);
    magicDamage = Math.floor(magicDamage * multiplier);
    if (ifdefor(attacker.healthGainOnHit)) {
        attacker.health += attacker.healthGainOnHit;
    }
    if (ifdefor(attacker.slowOnHit)) {
        target.slow = Math.max(target.slow, attacker.slowOnHit);
    }
    // Apply block reduction
    var blockRoll = Random.range(0, target.block);
    var magicBlockRoll = Random.range(0, target.magicBlock);
    damage = Math.max(0, damage - blockRoll);
    magicDamage = Math.max(0, magicDamage - magicBlockRoll);
    // Apply armor and magic resistance mitigation
    // TODO: Implement armor penetration here.
    damage = applyArmorToDamage(damage, target.armor);
    magicDamage = Math.round(magicDamage * Math.max(0, (1 - target.magicResist)));
    var totalDamage = damage + magicDamage;
    if (totalDamage > 0) {
        target.health -= totalDamage;
        target.stunned = character.time + .3 + distance / 32 * ifdefor(attack.dragStun, 0);
        target.pull = {'x': targetX, 'time': character.time + .3, 'damage': Math.floor(distance / 32 * damage * ifdefor(attack.dragDamage, 0))};
        attacker.pull = {'x': attacker.x, 'time': character.time + .3, 'damage': 0};
        hitText.value = totalDamage + ' hooked!';
    } else {
        hitText.value = 'blocked';
        hitText.color = 'blue';
        hitText.font, "15px sans-serif"
    }
    character.textPopups.push(hitText);
}
function getDistance(actorA, actorB) {
    return Math.max(0, (actorA.x > actorB.x) ? (actorA.x - actorB.x - 64) : (actorB.x - actorA.x - 64));
}

function defeatedEnemy(character, enemy) {
    if (character.adventurer.health <= 0) {
        return;
    }
    // Character receives 10% penalty per level difference between them and the monster.
    var reducedXP = Math.floor(enemy.xpValue * Math.max(0, 1 - .1 * Math.abs(character.adventurer.level - enemy.level)));
    gainXP(character.adventurer, reducedXP);
    var loot = [];
    if (enemy.ip) loot.push(pointsLootDrop('IP', enemy.ip));
    if (enemy.mp) loot.push(pointsLootDrop('MP', enemy.mp));
    if (enemy.rp) loot.push(pointsLootDrop('RP', enemy.rp));
    if (enemy.up) loot.push(pointsLootDrop('UP', enemy.up));
    loot.forEach(function (loot, index) {
        loot.gainLoot();
        loot.addTreasurePopup(character, enemy.x + index * 20, 240 - 140, 0, -1, index * 10);
    });
}
function drawAdventure(character, delta) {
    var adventurer = character.adventurer;
    var context = character.context;
    var targetCameraX = adventurer.x - 10;
    for (var i = 0; i < delta / .05; i++) {
        character.cameraX = (character.cameraX * 10 + targetCameraX ) / 11;
    }
    var cameraX = character.cameraX;
    context.clearRect(0, 0, character.canvas.width, character.canvas.height);
    var backgroundImage = ifdefor(character.area.backgroundImage, images['gfx/grass.png']);
    // Draw background
    for (var i = 0; i <= 768; i += 64) {
        var x = (784 + (i - cameraX) % 768) % 768 - 64;
        context.drawImage(backgroundImage, 0, 0 , 64, 240,
                              x, 0, 64, 240);
    }
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
        treasurePopup.update(character);
        treasurePopup.draw(character);
        if (treasurePopup.done) {
            character.treasurePopups.splice(i--, 1);
        }
    }
    for (var i = 0; i < character.textPopups.length; i++) {
        var textPopup = character.textPopups[i];
        context.fillStyle = ifdefor(textPopup.color, "red");
        context.font = ifdefor(textPopup.font, "20px sans-serif");
        context.textAlign = 'center'
        context.fillText(textPopup.value, textPopup.x - cameraX, textPopup.y);
        textPopup.y--;
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
    if (adventurer.target) { // attacking loop
        var attackFps = 1 / ((1 / adventurer.attackSpeed) / fightLoop.length);
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