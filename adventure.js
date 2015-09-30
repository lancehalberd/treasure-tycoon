function startArea(character, area) {
    character.$panel.find('.js-infoMode').hide();
    character.$panel.find('.js-adventureMode').show();
    character.area = area;
    character.monsterIndex = 0;
    character.adventurer.x = 0;
    character.adventurer.pull = null;
    character.cameraX = -30;
    character.enemies = [];
    character.allies = [character.adventurer];
    character.adventurer.isAlly = true;
    character.textPopups = [];
    character.$panel.find('.js-recall').prop('disabled', false);
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
    // Check to start next wave/complete level.
    if (character.enemies.length == 0) {
        if (character.monsterIndex >= character.area.monsters.length) {
            completeArea(character);
            return;
        }
        startNextWave(character);
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
    var monsters = character.area.monsters[character.monsterIndex];
    monsters = Array.isArray(monsters) ? monsters : [monsters]
    var x = character.adventurer.x + 800;
    monsters.forEach(function (monsterData) {
        var newMonster = makeMonster(monsterData, character.area.level);
        newMonster.x = x;
        newMonster.character = character;
        newMonster.direction = -1; // Monsters move right to left
        character.enemies.push(newMonster);
        x += Random.range(50, 150);
    });
    character.monsterIndex++;
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
    actor.blocked = false; // Character is assum    ed to not be blocked each frame
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
            if (attack.base.type == 'hook') {
                if (distance <= actor.range * 32 || distance > attack.abilityRange * 32 || target.cloaked) {
                    return true;
                }
                var hitText = performHookAttack(character, attack, actor, target);
                character.textPopups.push({value: hitText, x: target.x + 32, y: 240 - 128, color: 'red'});
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
        var hitText = performAttack(actor, target);
        character.textPopups.push({value: hitText, x: target.x + 32, y: 240 - 128, color: 'red'});
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

function performAttack(attacker, target) {
    var damage = Random.range(attacker.minDamage, attacker.maxDamage);
    var magicDamage = Random.range(attacker.minMagicDamage, attacker.maxMagicDamage);
    var accuracyRoll = Random.range(0, attacker.accuracy);
    var evasionRoll = Random.range(0, target.evasion);
    if (accuracyRoll < evasionRoll) {
        if (ifdefor(attacker.damageOnMiss)) {
            target.health -= attacker.damageOnMiss;
            return 'miss (' + attacker.damageOnMiss + ')';
        }
        // Target has evaded the attack.
        return 'miss';
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
    target.health -= (damage + magicDamage);
    return (damage + magicDamage) > 0 ? (damage + magicDamage) : 'blocked';
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
    target.health -= totalDamage;
    target.stunned = character.time + .3 + distance / 32 * ifdefor(attack.dragStun, 0);
    target.pull = {'x': targetX, 'time': character.time + .3, 'damage': Math.floor(distance / 32 * damage * ifdefor(attack.dragDamage, 0))};
    attacker.pull = {'x': attacker.x, 'time': character.time + .3, 'damage': 0};
    return totalDamage + ' hooked!';
}
function getDistance(actorA, actorB) {
    return Math.max(0, (actorA.x > actorB.x) ? (actorA.x - actorB.x - 64) : (actorB.x - actorA.x - 64));
}

function defeatedEnemy(character, enemy) {
    if (character.adventurer.health <= 0) {
        return;
    }
    // Character receives 10% penalty per level difference between them and the monster.
    var reducedXP = Math.floor(enemy.xp * Math.max(0, 1 - .1 * Math.abs(character.adventurer.level - enemy.level)));
    gainXP(character.adventurer, reducedXP);
    gain('IP', enemy.ip);
    if (enemy.ip) {
        character.textPopups.push(
            {value: '+' + enemy.ip, x: enemy.x + 35, y: 240 - 140, color: 'white', font: "20px sans-serif"}
        );
    }
    gain('MP', enemy.mp);
    if (enemy.mp) {
        character.textPopups.push(
            {value: '+' + enemy.mp, x: enemy.x + 45, y: 240 - 145, color: '#fc4', font: "22px sans-serif"}
        )
    }
    gain('RP', enemy.rp);
    if (enemy.rp) {
        character.textPopups.push(
            {value: '+' + enemy.rp, x: enemy.x + 55, y: 240 - 150, color: '#c4f', font: "24px sans-serif"}
        );
    }
    gain('UP', enemy.up);
    if (enemy.up) {
        character.textPopups.push(
            {value: '+' + enemy.up, x: enemy.x + 65, y: 240 - 155, color: '#4cf', font: "26px sans-serif"}
        );
    }
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
    // Draw enemies
    for (var i = 0; i < character.enemies.length; i++) {
        var enemy = character.enemies[i];
        var enemyFps = ifdefor(enemy.base.fpsMultiplier, 1) * 3 * enemy.speed / 100;
        var source = enemy.base.source;
        var enemyFrame = Math.floor(character.time * enemyFps) % source.frames;
        if (enemy.pull) {
            enemyFrame = 0;
        }
        if (enemy.cloaked) {
            context.globalAlpha = .2;
        }
        if (source.flipped) {
            context.translate((enemy.x - cameraX + source.width), 0);
            context.scale(-1, 1);
            context.drawImage(enemy.image, enemyFrame * source.width + source.offset, 0 , source.width, 64, -source.width, 240 - 128 - 72, source.width * 2, 128);
            context.scale(-1, 1);
            context.translate(-(enemy.x - cameraX + source.width), 0);
        } else {
            context.translate((enemy.x - cameraX + source.width), 0);
            context.drawImage(enemy.image, enemyFrame * source.width + source.offset, 0 , source.width, 64, -source.width, 240 - 128 - 72, source.width * 2, 128);
            context.translate(-(enemy.x - cameraX + source.width), 0);
        }
        context.globalAlpha = 1;
        enemy.left = enemy.x - cameraX;
        enemy.top = 240 - 128 - 72;
        enemy.width = source.width * 2;
        enemy.height = 128;
        // Uncomment to draw a reference of the character to show where left side of enemy should be
        // context.drawImage(character.personCanvas, 0 * 32, 0 , 32, 64, enemy.x - cameraX, 240 - 128 - 72, 64, 128);
        //context.fillRect(enemy.x - cameraX, 240 - 128 - 72, 64, 128);
        // life bar
        drawBar(context, enemy.x - cameraX + 20, 240 - 128 - 36 - 5 * i, 64, 4, 'white', enemy.color, enemy.health / enemy.maxHealth);
    }
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
        if (adventurer.pull) {
            frame = 0;
        }
        context.drawImage(adventurer.personCanvas, walkLoop[frame] * 32, 0 , 32, 64,
                        adventurer.x - cameraX, 240 - 128 - 72, 64, 128);
    }
    //context.fillRect(adventurer.x - cameraX, 240 - 128 - 72, 64, 128);
    context.globalAlpha = 1;
    // life bar
    drawBar(context, adventurer.x - cameraX, 240 - 128 - 72, 64, 4, 'white', 'red', adventurer.health / adventurer.maxHealth);
    // xp bar
    drawBar(context, 35, 240 - 15, 400, 6, 'white', '#00C000', adventurer.xp / adventurer.xpToLevel);
    context.font = "20px sans-serif";
    context.textAlign = 'right'
    context.fillText(adventurer.level, 30, 240 - 5);
    // Draw text popups such as damage dealt, item points gained, and so on.
    context.fillStyle = 'red';
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
}