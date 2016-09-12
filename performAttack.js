function getBasicAttack(adventurer) {
    for (var i = 0; i < adventurer.actions.length; i++) {
        var attack = adventurer.actions[i];
        if (attack.base.tags['basic']) {
            return attack;
        }
    }
    return null;
}
function updateDamageInfo(character, $statsPanel, monsterLevel) {
    var adventurer = character.adventurer;
    if (!adventurer || !adventurer.actions) return;
    var attack = getBasicAttack(adventurer);
    if (!attack) return;
    // Raw damage numbers.
    var damageMultiplier =  (1 - attack.critChance) + (1 + attack.critDamage) * attack.critChance;
    var accuracyMultiplier = (1 - attack.critChance) + (1 + attack.critAccuracy) * attack.critChance;
    var physical =  (attack.minPhysicalDamage + attack.maxPhysicalDamage) / 2, physicalAfterblock;
    var magic = (attack.minMagicDamage + attack.maxMagicDamage) / 2;

    var attackSpeed = Math.min(1 / ifdefor(attack.cooldown, .001), attack.attackSpeed);
    var rawPhysicalDPS = damageMultiplier * physical * attackSpeed;
    var rawMagicDPS = damageMultiplier * magic * attackSpeed;

    var sections = [];
    if (attack.minPhysicalDamage) {
        sections.push('Physical damage ' + attack.minPhysicalDamage.format(1) + ' - ' + attack.maxPhysicalDamage.format(1));
    }
    if (attack.minMagicDamage) {
        sections.push('Magic damage ' + attack.minMagicDamage.format(1) + ' - ' + attack.maxMagicDamage.format(1));
    }
    if (ifdefor(attack.cooldown)) {
        sections.push('Can be used once every' + attack.cooldown.format(1) + ' seconds');
    } else {
        sections.push(attackSpeed.format(2) + ' attacks per second.');
    }
    sections.push(attack.accuracy.format(1) + ' accuracy rating.');
    if (ifdefor(attack.critChance)) {
        sections.push('');
        sections.push(attack.critChance.percent(1) + ' chance to crit for:');
        if (attack.minPhysicalDamage) {
            sections.push('Physical damage ' + (attack.minPhysicalDamage * (1 + attack.critDamage)).format(1) + ' - ' + (attack.maxPhysicalDamage * (1 + attack.critDamage)).format(1));
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
    var level = map[character.currentLevelKey];
    var dummy = makeMonster('dummy', ifdefor(monsterLevel, level ? level.level : adventurer.level), [], true);
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
    if (ifdefor(attack.alwaysHits)) {
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
    if (attack.minPhysicalDamage && attack.minMagicDamage) {
        sections.push('Total Expected DPS is ' + (expectedPhysicalDPS + expectedMagicDPS).format(1) + '(' + expectedPhysicalDPS.format(1) + ' physical + ' + expectedMagicDPS.format(1) + ' magic)');
    } else {
        sections.push('Total Expected DPS is ' + (expectedPhysicalDPS + expectedMagicDPS).format(1));
    }
    var $damage =  $statsPanel.find('.js-damage');
    $damage.text((expectedPhysicalDPS + expectedMagicDPS).format(1));
    $damage.parent().attr('helptext', sections.join('<br/>'));

    attack = dummy.actions[dummy.actions.length - 1];

    var $protection =  $statsPanel.find('.js-protection');
    physical = attack.maxPhysicalDamage;
    if (adventurer.block <= physical) {
        physicalAfterBlock = physical - adventurer.block / 2;
    } else {
        physicalAfterBlock = physical * (physical + 1) / 2 / (adventurer.block + 1);
    }
    var blockProtection = 1 - physicalAfterBlock / attack.maxPhysicalDamage;
    physical = applyArmorToDamage(attack.maxPhysicalDamage, adventurer.armor);
    var armorProtection = 1 - physical / attack.maxPhysicalDamage;
    physical = applyArmorToDamage(physicalAfterBlock, adventurer.armor);
    var physicalProtection = 1 - physical / attack.maxPhysicalDamage;
    $protection.text(physicalProtection.percent(1));
    sections = ['This is an estimate of your physical damage reduction.', '']
    sections.push(adventurer.block + ' Block (' + blockProtection.percent(1) + ')');
    sections.push(adventurer.armor + ' Armor (' + armorProtection.percent(1) + ')');
    sections.push('');
    sections.push(physicalProtection.percent(1) + ' combined reduction');
    sections.push(attack.maxPhysicalDamage + ' damage reduced to ' + physical.format(1) );
    $protection.parent().attr('helptext', sections.join('<br/>'));

    var $resistance =  $statsPanel.find('.js-resistance');
    var magic = attack.maxMagicDamage;
    if (adventurer.magicBlock <= magic) {
        magic = magic - adventurer.magicBlock / 2;
    } else {
        magic = (magic) * (magic + 1) / 2 / (adventurer.magicBlock + 1);
    }
    var magicBlockResistance = 1 - magic / attack.maxMagicDamage;
    magic = magic * Math.max(0, 1 - adventurer.magicResist);
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
    $evasion.text((1 - hitPercent).percent(1));
    $evasion.parent().attr('helptext', adventurer.evasion + ' Evasion<br/><br/>' + (1 - hitPercent).percent(1) + ' estimated chance to evade attacks.');
}

function createAttackStats(attacker, attack, target) {
    var isCritical = Math.random() <= attack.critChance;
    if (ifdefor(attack.firstStrike)) {
        isCritical = isCritical || target.health >= target.maxHealth;
    }
    var damage = Random.range(attack.minPhysicalDamage, attack.maxPhysicalDamage);
    var magicDamage = Random.range(attack.minMagicDamage, attack.maxMagicDamage);
    var sacrificedHealth = Math.floor(attacker.health * ifdefor(attack.healthSacrifice, 0));
    damage += sacrificedHealth;
    var accuracy = Math.random() * attack.accuracy;
    damage *= ifdefor(attack.attackPower, 1);
    magicDamage *= ifdefor(attack.attackPower, 1);
    if (isCritical) {
        damage *= (1 + attack.critDamage);
        magicDamage *= (1 + attack.critDamage);
        accuracy *= (1 + attack.critAccuracy);
    }
    return {
        'distance': 0,
        'healthSacrificed': sacrificedHealth,
        'source': attacker,
        'attack': attack,
        'isCritical': isCritical,
        'damage': damage,
        'magicDamage': magicDamage,
        'accuracy': accuracy,
        'explode': ifdefor(attack.explode, 0),
        'cleave': ifdefor(attack.cleave, 0),
        'piercing': ifdefor(attack.criticalPiercing) ? isCritical : false,
        'strikes': ifdefor(attack.doubleStrike) ? 2 : 1
    };
}

function createSpellStats(attacker, spell, target) {
    var isCritical = Math.random() <= spell.critChance;
    if (ifdefor(spell.firstStrike)) {
        isCritical = isCritical || target.health >= target.maxHealth;
    }
    var magicDamage = getPower(attacker, spell);
    var sacrificedHealth = Math.floor(attacker.health * ifdefor(spell.healthSacrifice, 0));
    magicDamage += sacrificedHealth;
    if (isCritical) {
        magicDamage *= (1 + spell.critDamage);
    }
    return {
        'distance': 0,
        'healthSacrificed': sacrificedHealth,
        'source': attacker,
        'attack': spell,
        'isCritical': isCritical,
        'damage': 0,
        'magicDamage': magicDamage,
        'accuracy': 0,
        'explode': ifdefor(spell.explode, 0),
        'cleave': ifdefor(spell.cleave, 0),
        'strikes': 1
    };
}
function performAttack(attacker, attack, target) {
    var attackStats = createAttackStats(attacker, attack, target);
    attacker.health -= attackStats.healthSacrificed;
    attacker.attackCooldown = attacker.time + 1 / (attackStats.attack.attackSpeed * Math.max(.1, (1 - attacker.slow)));
    performAttackProper(attackStats, target);
    return attackStats;
}
function castSpell(attacker, spell, target) {
    var attackStats = createSpellStats(attacker, spell, target);
    attacker.health -= attackStats.healthSacrificed;
    attacker.attackCooldown = attacker.time + .2;
    performAttackProper(attackStats, target);
    return attackStats;
}
function performAttackProper(attackStats, target) {
    var attacker = attackStats.source;
    // If the attack allows the user to teleport, teleport them to an optimal location for attacking.
    var teleport = ifdefor(attackStats.attack.teleport, 0) * 32;
    if (teleport) {
        // It is easier for me to understand this code if I break it up into facing right and facing left cases.
        if (attacker.direction > 0) {
            // Teleport to the location furthest from enemies that leaves the enemy within range to attack.
            attacker.x = Math.max(attacker.x - teleport, Math.min(attacker.x + teleport, target.x - attackStats.attack.range * 32 - attacker.width));
        } else {
            attacker.x = Math.min(attacker.x + teleport, Math.max(attacker.x - teleport, target.x + target.width + attackStats.attack.range * 32));
        }
    }
    if (attackStats.attack.base.tags['song']) {
        attacker.character.effects.push(songEffect(attackStats));
    } else if (attackStats.attack.base.tags['field']) {
        attacker.character.effects.push(fieldEffect(attackStats, attacker));
    } else if (attackStats.attack.base.tags['nova']) {
        // attackStats.explode--;
        attacker.character.effects.push(explosionEffect(attackStats, attacker.x + attacker.width / 2 + attacker.direction * attacker.width / 4, 120));
    } else if (attackStats.attack.base.tags['blast']) {
        // attackStats.explode--;
        attacker.character.effects.push(explosionEffect(attackStats, target.x + target.width / 2 + target.direction * target.width / 4, 120));
    } else if (attackStats.attack.base.tags['rain']) {
        // attackStats.explode--;
        var targets = [];
        var count = Math.floor(ifdefor(attackStats.attack.count, 1));
        for (var i = 0; i < count; i++) {
            if (!targets.length) {
                targets = Random.shuffle(attacker.enemies);
            }
            var currentTarget = targets.pop();
            var x = attacker.x + attacker.width / 2 + 500 * (i + 1) / (count + 2);
            var y = -100;
            var vy = 2;
            var vx = (x > currentTarget.x) ? -1 : 1;
            attacker.character.projectiles.push(projectile(
                attackStats, x, y, vx, vy, currentTarget, i * 10, // delay is in frames
                attackStats.isCritical ? 'yellow' : 'red', ifdefor(attackStats.attack.base.size, 10) * (attackStats.isCritical ? 1.5 : 1)));
        }
    } else if (attackStats.attack.base.tags['ranged']) {
        var distance = getDistance(attacker, target);
        attacker.character.projectiles.push(projectile(
            attackStats, attacker.x + attacker.width / 2 + attacker.direction * attacker.width / 4, 240 - 128,
            attacker.direction * Math.max(15, distance / 25), -1, target, 0,
            attackStats.isCritical ? 'yellow' : 'red', ifdefor(attackStats.attack.base.size, 10) * (attackStats.isCritical ? 1.5 : 1)));
    } else {
        attackStats.distance = getDistance(attacker, target);
        // apply melee attacks immediately
        applyAttackToTarget(attackStats, target);
    }
}
function applyAttackToTarget(attackStats, target) {
    var attack = attackStats.attack;
    var attacker = attackStats.source;
    var effectiveness = ifdefor(attackStats.effectiveness, 1);
    if (ifdefor(attackStats.strikes, 1) > 1) {
        attackStats.strikes--;
        applyAttackToTarget(attackStats, target);
    }

    if (ifdefor(attackStats.cleave) > 0) {
        var cleaveAttackStats = {
            'distance': 0,
            'source': attackStats.source,
            'attack': attackStats.attack,
            'isCritical': attackStats.isCritical,
            // Apply cleave damage by the coefficient.
            'damage': attackStats.damage * attackStats.cleave,
            'magicDamage': attackStats.magicDamage * attackStats.cleave,
            'accuracy': attackStats.accuracy,
            'explode': attackStats.explode,
            'cleave': 0
        };
        for (var i = 0; i < attackStats.source.enemies.length; i++) {
            var cleaveTarget = attackStats.source.enemies[i];
            if (cleaveTarget === target) {
                continue;
            }
            // ignore targets that got behind the attacker.
            if ((cleaveTarget.x - attacker.x) * attacker.direction < 0) {
                continue;
            }
            var distance = getDistance(attacker, cleaveTarget);
            if (distance > (attackStats.attack.range + ifdefor(attackStats.attack.cleaveRange, 0)) * 32) continue;
            applyAttackToTarget(cleaveAttackStats, cleaveTarget);
        }
    }
    if (ifdefor(attackStats.explode) > 0) {
        var explodeAttackStats = {
            'distance': 0,
            'source': attackStats.source,
            'attack': attackStats.attack,
            'isCritical': attackStats.isCritical,
            'damage': attackStats.damage,
            'magicDamage': attackStats.magicDamage,
            'accuracy': attackStats.accuracy,
            'explode': attackStats.explode - 1
        };
        var explosion = explosionEffect(explodeAttackStats, target.x + ifdefor(target.width, 64) / 2, 128);
        attacker.character.effects.push(explosion);
        explosion.hitTargets.push(target);
    }
    var distance = attackStats.distance;
    var character = target.character;
    var hitText = {x: target.x + 32, y: 240 - 128, color: 'red'};
    if (target.invulnerable) {
        hitText.value = 'invulnerable';
        hitText.color = 'blue';
        hitText.font, "15px sans-serif"
        character.textPopups.push(hitText);
        return false;
    }
    var multiplier = ifdefor(attack.rangeDamage) ? (1 + attack.rangeDamage * distance / 32) : 1;
    if (attackStats.isCritical) {
        hitText.color = 'yellow';
        hitText.font = "30px sans-serif"
    }
    var damage = Math.floor(attackStats.damage * multiplier * effectiveness);
    var magicDamage = Math.floor(attackStats.magicDamage * multiplier * effectiveness);
    attackStats.evaded = false;
    if (!ifdefor(attack.alwaysHits)) {
        var evasionRoll = (target.maxEvasion ? 1 : Math.random()) * target.evasion;
        if (attackStats.accuracy < evasionRoll) {
            hitText.value = 'miss';
            if (ifdefor(attack.damageOnMiss)) {
                var damageOnMiss = Math.round(attack.damageOnMiss * effectiveness);
                target.health -= damageOnMiss;
                hitText.value = 'miss (' + damageOnMiss + ')';
            }
            // Target has evaded the attack.
            hitText.color = 'blue';
            hitText.font, "15px sans-serif"
            character.textPopups.push(hitText);
            attackStats.evaded = true;
        }
    }
    // Apply block reduction
    var blockRoll = Math.round((target.maxBlock ? 1 : Math.random()) * target.block);
    var magicBlockRoll = Math.round((target.maxMagicBlock ? 1 : Math.random()) * target.magicBlock);
    damage = Math.max(0, damage - blockRoll);
    magicDamage = Math.max(0, magicDamage - magicBlockRoll);
    // Apply armor and magic resistance mitigation
    if (!ifdefor(attack.ignoreArmor)) {
        var effectiveArmor = target.armor * (1 - ifdefor(attack.armorPenetration, 0));
        damage = Math.round(applyArmorToDamage(damage, effectiveArmor));
    }
    if (!ifdefor(attack.ignoreResistance)) {
        magicDamage = Math.round(magicDamage * Math.max(0, (1 - target.magicResist)));
    }
    var totalDamage = damage + magicDamage;
    attackStats.totalDamage = totalDamage;
    attackStats.deflected = false;
    attackStats.dodged = false;
    attackStats.stopped = false;
    for (var i = 0; i < ifdefor(target.reactions, []).length; i++) {
        if (useSkill(target, target.reactions[i], attackStats)) {
            break;
        }
    }
    if (attackStats.deflected || attackStats.evaded || attackStats.stopped) {
        return false;
    }
    // Attacks that always hit can still be avoided by a 'dodge' skill.
    if (attackStats.dodged && !ifdefor(attack.undodgeable)) {
        return false;
    }
    attacker.health += ifdefor(attack.healthGainOnHit * effectiveness, 0);
    target.slow += ifdefor(attack.slowOnHit * effectiveness, 0);
    if (ifdefor(attack.debuff)) {
        addTimedEffect(target, attack.debuff);
    }
    var effects = ifdefor(attacker.onHitEffects, []);
    if (attackStats.isCritical) {
        effects = effects.concat(ifdefor(attacker.onCritEffects, []));
    }
    for (var i = 0; i < effects.length; i++) {
        var effect = effects[i];
        // Some abilities like corsairs venom add a stacking debuff to the target every hit.
        if (ifdefor(effect.debuff)) {
            addTimedEffect(target, effect.debuff);
        }
        // Some abilities like dancer's whirling dervish add a stacking buff to the attacker every hit.
        if (ifdefor(effect.buff)) {
            console.log("BUFFED");
            addTimedEffect(attacker, effect.buff);
        }
    }
    if (totalDamage > 0) {
        if (ifdefor(attack.cull, 0) > 0 && target.health / target.maxHealth <= attack.cull) {
            target.health = 0;
            hitText.value = 'culled!';
        } else {
            target.health -= totalDamage;
            hitText.value = totalDamage;
        }
        attacker.health += ifdefor(attack.lifeSteal, 0) * totalDamage
        if (ifdefor(attack.poison)) {
            addTimedEffect(target, {'bonuses': {'+damageOverTime': totalDamage * attack.poison}});
        }
        // Some attacks pull the target towards the attacker
        if (attack.stun) {
            target.stunned = Math.max(ifdefor(target.stunned, 0), target.time + attack.stun * effectiveness);
            hitText.value += ' stunned!';
        }
        if (Math.random() < ifdefor(attack.knockbackChance, 0)) {
            var targetX = target.x - target.direction * 32 * ifdefor(attack.knockbackDistance, 1);
            // unset the current target since they are being pushed away.
            attacker.target = null;
            target.pull = {'x': targetX, 'time': target.time + .3, 'damage': 0};
        }
        if (attack.pullsTarget) {
            target.stunned =  Math.max(ifdefor(target.stunned, 0), target.time + .3 + distance / 32 * ifdefor(attack.dragStun * effectiveness, 0));
            var targetX = (attacker.x > target.x) ? (attacker.x - 64) : (attacker.x + 64);
            target.pull = {'x': targetX, 'time': target.time + .3, 'damage': Math.floor(distance / 32 * damage * ifdefor(attack.dragDamage * effectiveness, 0))};
            attacker.pull = {'x': attacker.x, 'time': attacker.time + .3, 'damage': 0};
            hitText.value += ' hooked!';
        }
        if (attack.domino) {
            target.dominoAttackStats = attackStats;
            var targetX = (attacker.x < target.x) ? (target.x + ifdefor(attack.distance * effectiveness, 128)) : (target.x - ifdefor(attack.distance * effectiveness, 128));
            target.pull = {'x': targetX, 'time': target.time + .3, 'damage': 0};
        }
    } else {
        hitText.value = 'blocked';
        hitText.color = 'blue';
        hitText.font, "15px sans-serif"
    }
    character.textPopups.push(hitText);
    return true;
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
