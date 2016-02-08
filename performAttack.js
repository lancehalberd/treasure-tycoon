
function performAttack(character, attack, attacker, target, distance) {
    attack.readyAt = character.time + ifdefor(attack.cooldown);
    attacker.attackCooldown = character.time + 1 / (attack.attackSpeed * Math.max(.1, (1 - attacker.slow)));
    attacker.target = target;
    var isCritical = Math.random() <= attack.critChance;
    var multiplier = ifdefor(attack.rangeDamage) ? (1 + attack.rangeDamage * distance / 32) : 1;
    var damage = Random.range(attack.minDamage, attack.maxDamage);
    var magicDamage = Random.range(attack.minMagicDamage, attack.maxMagicDamage);
    var hitText = {x: target.x + 32, y: 240 - 128, color: 'red'};
    if (isCritical) {
        damage *= (1 + attacker.critDamage);
        magicDamage *= (1 + attacker.critDamage);
        hitText.color = 'yellow';
        hitText.font, "40px sans-serif"
    }
    damage = Math.floor(damage * multiplier);
    magicDamage = Math.floor(magicDamage * multiplier);
    if (!ifdefor(attack.base.alwaysHits)) {
        var accuracyRoll = Random.range(0, attack.accuracy);
        if (isCritical) {
            accuracyRoll *= (1 + attack.critAccuracy);
        }
        var hitText = {x: target.x + 32, y: 240 - 128, color: 'red'};
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
    }
    // Attacks that always hit can still be avoided by a 'dodge' skill.
    var dodged = false;
    ifdefor(target.attacks, []).forEach(function (attack) {
        if (attack.readyAt > character.time) {
            return true;
        }
        if (attack.base.type == 'dodge') {
            dodged = true;
            attack.readyAt = character.time + attack.cooldown;
            target.pull = {'x': target.x - target.direction * attack.distance, 'time': character.time + .3, 'damage': 0};
            addTimedEffect(character, target, attack.buff);
            return false;
        }
        return true;
    });
    if (dodged) {
        // Target has evaded the attack using an ability like 'dodge'.
        hitText.value = 'dodged';
        hitText.color = 'blue';
        hitText.font, "15px sans-serif"
        character.textPopups.push(hitText);
        return;
    }
    attacker.health += ifdefor(attack.healthGainOnHit, 0);
    target.slow = Math.max(target.slow, ifdefor(attack.slowOnHit, 0));
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
        hitText.value = totalDamage;
        // Hook attacks pull the target in if it lands.
        if (attack.base.type === 'hook') {
            var targetX = (attacker.x > target.x) ? (attacker.x - 64) : (attacker.x + 64);
            target.pull = {'x': targetX, 'time': character.time + .3, 'damage': Math.floor(distance / 32 * damage * ifdefor(attack.dragDamage, 0))};
            attacker.pull = {'x': attacker.x, 'time': character.time + .3, 'damage': 0};
            hitText.value += ' hooked!';
        }
    } else {
        hitText.value = 'blocked';
        hitText.color = 'blue';
        hitText.font, "15px sans-serif"
    }
    character.textPopups.push(hitText);
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
