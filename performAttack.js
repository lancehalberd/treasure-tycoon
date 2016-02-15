
function updateDamageInfo(character) {
    var adventurer = character.adventurer;
    if (!adventurer || !adventurer.attacks) return;
    var attack = adventurer.attacks[adventurer.attacks.length - 1];
    // Raw damage numbers.
    var damageMultiplier =  (1 - attack.critChance) + (1 + attack.critDamage) * attack.critChance;
    var accuracyMultiplier = (1 - attack.critChance) + (1 + attack.critAccuracy) * attack.critChance;
    var physical =  (attack.minDamage + attack.maxDamage) / 2;
    var magic = (attack.minMagicDamage + attack.maxMagicDamage) / 2;

    var attackSpeed = Math.min(1 / ifdefor(attack.cooldown, .001), attack.attackSpeed);
    var rawPhysicalDPS = damageMultiplier * physical * attackSpeed;
    var rawMagicDPS = damageMultiplier * magic * attackSpeed;

    var sections = [];
    if (attack.minDamage) {
        sections.push('Physical damage ' + attack.minDamage.format(1) + ' - ' + attack.maxDamage.format(1));
    }
    if (attack.minMagicDamage) {
        sections.push('Magic damage ' + attack.minMagicDamage.format(1) + ' - ' + attack.maxMagicDamage.format(1));
    }
    if (ifdefor(attack.cooldown)) {
        sections.push('Can be used once every' + attack.cooldown.format(1) + ' seconds');
    } else {
        sections.push(attackSpeed.format(2) + ' attacks per second.');
    }
    sections.push(attack.accuracy + ' accuracy rating.');
    if (ifdefor(attack.critChance)) {
        sections.push('');
        sections.push(attack.critChance.percent(1) + ' chance to crit for:');
        if (attack.minDamage) {
            sections.push('Physical damage ' + (attack.minDamage * (1 + attack.critDamage)).format(1) + ' - ' + (attack.maxDamage * (1 + attack.critDamage)).format(1));
        }
        if (attack.minMagicDamage) {
            sections.push('Magic damage ' + (attack.minMagicDamage * (1 + attack.critDamage)).format(1) + ' - ' + (attack.maxMagicDamage * (1 + attack.critDamage)).format(1));
        }
        sections.push((attack.accuracy * (1 + attack.critAccuracy)).format(1) + ' accuracy');
    }
    sections.push('');
    if (rawPhysicalDPS && rawMagicDPS) {
        sections.push('Total Average DPS is ' +  (rawPhysicalDPS + rawMagicDPS).format(1) + '(' + rawPhysicalDPS.format(1) + ' physical + ' + rawMagicDPS.format(1) + ' magic)');
    } else {
        sections.push('Total Average DPS is ' + (rawPhysicalDPS + rawMagicDPS).format(1));
    }

    // Expected damage against an 'average' monster of the adventurer's level.
    var dummy = makeMonster('dummy', adventurer.level, [], true);
    var hitPercent;
    // tie breaker is given to hitting, so for this calculation use 1 less evasion.
    var evasion = dummy.evasion;
    var accuracy = accuracyMultiplier * attack.accuracy;
    if (evasion > accuracy) {
        var overRollChance = (evasion - accuracy) / evasion;
        var chanceToEvade = overRollChance + (1 - overRollChance) / 2;
        hitPercent = (1 - chanceToEvade);
    } else {
        var overRollChance = (accuracy - evasion) / accuracy;
        hitPercent = overRollChance + (1 - overRollChance) / 2;
    }
    if (ifdefor(attack.base.alwaysHits)) {
        hitPercent = 1;
    }
    var expectedPhysical = Math.max(0, damageMultiplier *physical - dummy.block / 2);
    expectedPhysical = applyArmorToDamage(expectedPhysical, dummy.armor);
    var expectedMagic = Math.max(0, damageMultiplier * magic - dummy.magicBlock / 2);
    expectedMagic = expectedMagic * Math.max(0, (1 - dummy.magicResist));
    var expectedPhysicalDPS = expectedPhysical * hitPercent * attackSpeed;
    var expectedMagicDPS = expectedMagic * hitPercent * attackSpeed;

    sections.push('');
    sections.push('Expected hit rate is ' + hitPercent.percent(1));
    if (attack.minDamage && attack.minMagicDamage) {
        sections.push('Total Expected DPS is ' + (expectedPhysicalDPS + expectedMagicDPS).format(1) + '(' + expectedPhysicalDPS.format(1) + ' physical + ' + expectedMagicDPS.format(1) + ' magic)');
    } else {
        sections.push('Total Expected DPS is ' + (expectedPhysicalDPS + expectedMagicDPS).format(1));
    }
    var $statsPanel = character.$panel.find('.js-infoMode .js-stats');
    var $damage =  $statsPanel.find('.js-damage');
    $damage.text( (rawPhysicalDPS + rawMagicDPS).format(1) + ' (' + (expectedPhysicalDPS + expectedMagicDPS).format(1) + ')');
    $damage.parent().attr('helptext', sections.join('<br/>'));

    attack = dummy.attacks[dummy.attacks.length - 1];

    var $protection =  $statsPanel.find('.js-protection');
    physical = Math.max(0, attack.maxDamage - adventurer.block / 2);
    var blockProtection = 1 - physical / attack.maxDamage;
    physical = applyArmorToDamage(attack.maxDamage, adventurer.armor);
    var armorProtection = 1 - physical / attack.maxDamage;
    physical = applyArmorToDamage(Math.max(0, attack.maxDamage - adventurer.block / 2), adventurer.armor);
    var physicalProtection = 1 - physical / attack.maxDamage;
    $protection.text(physicalProtection.percent(1));
    sections = ['This is an estimate of your physical damage reduction.', '']
    sections.push(adventurer.block + ' Block (' + blockProtection.percent(1) + ')');
    sections.push(adventurer.armor + ' Armor (' + armorProtection.percent(1) + ')');
    sections.push('');
    sections.push(physicalProtection.percent(1) + ' combined reduction');
    sections.push(attack.maxDamage + ' damage reduced to ' + physical.format(1) );
    $protection.parent().attr('helptext', sections.join('<br/>'));

    var $resistance =  $statsPanel.find('.js-resistance');
    magic = Math.max(0, attack.maxMagicDamage - adventurer.magicBlock / 2);
    var magicBlockResistance = 1 - magic / attack.maxMagicDamage;
    magic = Math.max(0, attack.maxMagicDamage - adventurer.magicBlock / 2) * Math.max(0, 1 - adventurer.magicResist);
    var magicResistance = 1 - magic / attack.maxMagicDamage;
    $resistance.text(magicResistance.percent(1));
    sections = ['This is an estimate of your magic damage reduction.', ''];
    sections.push(adventurer.magicResist.percent(1) + ' Magic Resistance');
    sections.push(adventurer.magicBlock + ' Magic Block (' + magicBlockResistance.percent(1) + ')');
    sections.push('');
    sections.push(magicResistance.percent(1) + ' combined reduction');
    sections.push(attack.maxMagicDamage + ' damage reduced to ' + magic.format(1));
    $resistance.parent().attr('helptext', sections.join('<br/>'));


    // tie breaker is given to hitting, so for this calculation use 1 less evasion.
    evasion = adventurer.evasion;
    accuracy = attack.accuracy;
    if (evasion > accuracy) {
        var overRollChance = (evasion - accuracy) / evasion;
        var chanceToEvade = overRollChance + (1 - overRollChance) / 2;
        hitPercent = (1 - chanceToEvade);
    } else {
        var overRollChance = (accuracy - evasion) / accuracy;
        hitPercent = overRollChance + (1 - overRollChance) / 2;
    }
    var $evasion =  $statsPanel.find('.js-evasion');
    $evasion.text( adventurer.evasion + ' (' + (1 - hitPercent).percent(1) + ')');
    $evasion.parent().attr('helptext', (1 - hitPercent).percent(1) + ' estimated chance to evade attacks.');
}

function performAttack(character, attack, attacker, target, distance) {
    attack.readyAt = character.time + ifdefor(attack.cooldown, 0);
    attacker.attackCooldown = character.time + 1 / (attack.attackSpeed * Math.max(.1, (1 - attacker.slow)));
    attacker.target = target;
    var isCritical = Math.random() <= attack.critChance;
    var multiplier = ifdefor(attack.rangeDamage) ? (1 + attack.rangeDamage * distance / 32) : 1;
    var damage = Random.range(attack.minDamage, attack.maxDamage);
    var magicDamage = Random.range(attack.minMagicDamage, attack.maxMagicDamage);
    var hitText = {x: target.x + 32, y: 240 - 128, color: 'red'};
    if (isCritical) {
        damage *= (1 + attack.critDamage);
        magicDamage *= (1 + attack.critDamage);
        hitText.color = 'yellow';
        hitText.font, "40px sans-serif"
    }
    damage = Math.floor(damage * multiplier);
    magicDamage = Math.floor(magicDamage * multiplier);
    if (!ifdefor(attack.base.alwaysHits)) {
        var accuracyRoll = Math.random() * attack.accuracy;
        if (isCritical) {
            accuracyRoll = accuracyRoll * (1 + attack.critAccuracy);
        }
        var hitText = {x: target.x + 32, y: 240 - 128, color: 'red'};
        var evasionRoll = Math.random() * target.evasion;
        if (accuracyRoll < evasionRoll) {
            hitText.value = 'miss';
            if (ifdefor(attack.damageOnMiss)) {
                target.health -= attack.damageOnMiss;
                hitText.value = 'miss (' + attack.damageOnMiss + ')';
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
    damage = Math.round(applyArmorToDamage(damage, target.armor));
    magicDamage = Math.round(magicDamage * Math.max(0, (1 - target.magicResist)));
    var totalDamage = damage + magicDamage;
    if (totalDamage > 0) {
        target.health -= totalDamage;
        hitText.value = totalDamage;
        // Hook attacks pull the target in if it lands.
        if (attack.base.type === 'hook') {
            target.stunned = character.time + .3 + distance / 32 * ifdefor(attack.dragStun, 0);
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
    return Math.max(1, damage / Math.pow(2, armor / damage));
}
