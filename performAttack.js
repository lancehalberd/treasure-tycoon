function getBasicAttack(adventurer) {
    return findActionByTag(adventurer.actions, 'basic');
}
function findActionByTag(actions, tag) {
    for (var action of actions) {
        if (action.tags[tag]) {
            return action;
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
        sections.push('Physical damage ' + attack.minPhysicalDamage.format(1).abbreviate() + ' - ' + attack.maxPhysicalDamage.format(1).abbreviate());
    }
    if (attack.minMagicDamage) {
        sections.push('Magic damage ' + attack.minMagicDamage.format(1).abbreviate() + ' - ' + attack.maxMagicDamage.format(1).abbreviate());
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
            sections.push('Physical damage ' + (attack.minPhysicalDamage * (1 + attack.critDamage)).format(1).abbreviate() + ' - ' + (attack.maxPhysicalDamage * (1 + attack.critDamage)).format(1).abbreviate());
        }
        if (attack.minMagicDamage) {
            sections.push('Magic damage ' + (attack.minMagicDamage * (1 + attack.critDamage)).format(1).abbreviate() + ' - ' + (attack.maxMagicDamage * (1 + attack.critDamage)).format(1).abbreviate());
        }
        sections.push((attack.accuracy * (1 + attack.critAccuracy)).format(1) + ' accuracy');
    }
    sections.push('');
    if (rawPhysicalDPS && rawMagicDPS) {
        sections.push('Total Average DPS is ' +  (rawPhysicalDPS + rawMagicDPS).format(1).abbreviate() + '(' + rawPhysicalDPS.format(1).abbreviate() + ' physical + ' + rawMagicDPS.format(1).abbreviate() + ' magic)');
    } else {
        sections.push('Total Average DPS is ' + (rawPhysicalDPS + rawMagicDPS).format(1).abbreviate());
    }

    // Expected damage against an 'average' monster of the adventurer's level.
    var level = map[character.currentLevelKey];
    if (!monsterLevel) {
        if (level) {
            if (character.currentLevelKey === 'guild') {
                monsterLevel = 1;
            } else if (character.levelDifficulty === 'endless') {
                monsterLevel = getEndlessLevel(character, level);
            } else {
                monsterLevel = level ? level.level : adventurer.level;
            }
        }
    }
    var dummy = makeMonster('dummy', monsterLevel, [], 0);
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
    var expectedPhysical = Math.max(0, damageMultiplier * physical - dummy.block / 2);
    expectedPhysical = applyArmorToDamage(expectedPhysical, dummy.armor);
    var expectedMagic = Math.max(0, damageMultiplier * magic - dummy.magicBlock / 2);
    expectedMagic = expectedMagic * Math.max(0, (1 - dummy.magicResist));
    var expectedPhysicalDPS = expectedPhysical * hitPercent * attackSpeed;
    var expectedMagicDPS = expectedMagic * hitPercent * attackSpeed;

    sections.push('');
    sections.push('Expected hit rate is ' + hitPercent.percent(1));
    if (attack.minPhysicalDamage && attack.minMagicDamage) {
        sections.push('Total Expected DPS is ' + (expectedPhysicalDPS + expectedMagicDPS).format(1).abbreviate() + '(' + expectedPhysicalDPS.format(1).abbreviate() + ' physical + ' + expectedMagicDPS.format(1).abbreviate() + ' magic)');
    } else {
        sections.push('Total Expected DPS is ' + (expectedPhysicalDPS + expectedMagicDPS).format(1).abbreviate());
    }
    var $damage =  $statsPanel.find('.js-damage');
    $damage.text((expectedPhysicalDPS + expectedMagicDPS).format(1).abbreviate());
    $damage.parent().attr('helptext', sections.join('<br/>'));

    attack = getBasicAttack(dummy);

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
    sections.push(attack.maxPhysicalDamage.format(1) + ' damage reduced to ' + physical.format(1) );
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
    sections.push(attack.maxMagicDamage.format(1) + ' damage reduced to ' + magic.format(1));
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
    if (ifdefor(attack.firstStrike) && target && target.isActor) {
        isCritical = isCritical || target.health >= target.maxHealth;
    }
    var damage = Random.range(attack.minPhysicalDamage, attack.maxPhysicalDamage);
    var magicDamage = Random.range(attack.minMagicDamage, attack.maxMagicDamage);
    var sacrificedHealth = Math.floor(attacker.health * ifdefor(attack.healthSacrifice, 0));
    damage += sacrificedHealth;
    var accuracy = Math.random() * attack.accuracy;
    if (isCritical) {
        damage *= (1 + attack.critDamage);
        magicDamage *= (1 + attack.critDamage);
        accuracy *= (1 + attack.critAccuracy);
    }
    var animation = ifdefor(attack.base.animation);
    if (!animation && attacker.equipment.weapon) {
        animation = ifdefor(attacker.equipment.weapon.base.animation);
    }
    if (animation && !projectileAnimations[animation]) {
        pause();
        throw new Error('Missing animation for ' + animation);
    }
    if (animation) animation = projectileAnimations[animation];
    var gravity = ifdefor(attack.base.gravity);
    if (!gravity && attacker.equipment.weapon) {
        gravity = ifdefor(attacker.equipment.weapon.base.gravity);
    }
    if (!gravity) {
        gravity = .8;
    }
    return {
        'distance': 0,
        'animation': animation,
        'size': animation ? animation.frames[0][2] : ifdefor(attack.base.size, 10),
        'gravity': gravity,
        'speed': ifdefor(attack.speed, ifdefor(attack.base.speed, ifdefor(attack.range, 10) * 2.5)),
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
    if (ifdefor(spell.firstStrike) && target && target.isActor) {
        isCritical = isCritical || target.health >= target.maxHealth;
    }
    var magicDamage = spell.power;
    var sacrificedHealth = Math.floor(attacker.health * ifdefor(spell.healthSacrifice, 0));
    magicDamage += sacrificedHealth;
    if (isCritical) {
        magicDamage *= (1 + spell.critDamage);
    }
    var animation = ifdefor(spell.base.animation);
    if (animation && !projectileAnimations[animation]) {
        pause();
        throw new Error('Missing animation for ' + animation);
    }
    if (animation) animation = projectileAnimations[animation];
    return {
        'distance': 0,
        'animation': animation,
        'size': animation ? animation.frames[0][2] : ifdefor(spell.base.size, 10),
        'gravity': ifdefor(spell.base.gravity, .8),
        'speed': ifdefor(spell.speed, ifdefor(spell.base.speed, ifdefor(spell.range, 10) * 2.5)),
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

function createSpellImprintedAttackStats(attacker, attack, spell, target) {
    var isCritical = Math.random() <= spell.critChance;
    if (ifdefor(spell.firstStrike) && target && target.isActor) {
        isCritical = isCritical || target.health >= target.maxHealth;
    }
    var magicDamage = spell.power;
    var sacrificedHealth = Math.floor(attacker.health * ifdefor(spell.healthSacrifice, 0));
    magicDamage += sacrificedHealth;
    var accuracy = Math.random() * attack.accuracy;
    if (isCritical) {
        magicDamage *= (1 + spell.critDamage);
        accuracy *= (1 + attack.critAccuracy);
    }
    var animation = ifdefor(attack.base.animation);
    if (!animation && attacker.equipment.weapon) {
        animation = ifdefor(attacker.equipment.weapon.base.animation);
    }
    if (animation && !projectileAnimations[animation]) {
        pause();
        throw new Error('Missing animation for ' + animation);
    }
    if (animation) animation = projectileAnimations[animation];
    var gravity = ifdefor(attack.base.gravity);
    if (!gravity && attacker.equipment.weapon) {
        gravity = ifdefor(attacker.equipment.weapon.base.gravity);
    }
    if (!gravity) {
        gravity = .8;
    }
    return {
        'distance': 0,
        'animation': animation,
        'size': animation ? animation.frames[0][2] : ifdefor(attack.base.size, 10),
        'gravity': gravity,
        'speed': ifdefor(attack.speed, ifdefor(attack.base.speed, ifdefor(attack.range, 10) * 2.5)),
        'healthSacrificed': sacrificedHealth,
        'source': attacker,
        'attack': attack,
        'imprintedSpell': spell,
        'isCritical': isCritical,
        'damage': 0,
        'magicDamage': magicDamage,
        'accuracy': accuracy,
        'explode': ifdefor(spell.explode, 0),
        'cleave': ifdefor(attack.cleave, 0),
        'piercing': ifdefor(attack.criticalPiercing) ? isCritical : false,
        'strikes': ifdefor(attack.doubleStrike) ? 2 : 1
    };
}
function performAttack(attacker, attack, target) {
    var attackStats;
    if (attack.tags['basic'] && attacker.imprintSpell && attacker.imprintedSpell) {
        attackStats = createSpellImprintedAttackStats(attacker, attack, attacker.imprintedSpell, target);
    } else {
        attackStats = createAttackStats(attacker, attack, target);
    }
    attacker.health -= attackStats.healthSacrificed;
    performAttackProper(attackStats, target);
    return attackStats;
}
function castAttackSpell(attacker, spell, target) {
    var attackStats = createSpellStats(attacker, spell, target);
    attacker.health -= attackStats.healthSacrificed;
    performAttackProper(attackStats, target);
    if (attacker.imprintSpell) attacker.imprintedSpell = spell;
    return attackStats;
}
function performAttackProper(attackStats, target) {
    var attacker = attackStats.source;
    var area = attacker.area;
    // If the attack allows the user to teleport, teleport them to an optimal location for attacking.
    var teleport = ifdefor(attackStats.attack.teleport, 0) * 32;
    if (teleport) {
        // It is easier for me to understand this code if I break it up into facing right and facing left cases.
        if (attacker.heading[0] > 0) {
            // Teleport to the location furthest from enemies that leaves the enemy within range to attack.
            attacker.x = Math.max(attacker.x - teleport, Math.min(attacker.x + teleport, target.x - attackStats.attack.range * 32 - attacker.width / 2 - target.width / 2));
        } else {
            attacker.x = Math.min(attacker.x + teleport, Math.max(attacker.x - teleport, target.x + target.width / 2 + attacker.width / 2 + attackStats.attack.range * 32));
        }
    }
    if (attackStats.attack.tags['song']) {
        area.effects.push(songEffect(attackStats));
    } else if (attackStats.attack.tags['field']) {
        area.effects.push(fieldEffect(attackStats, attacker));
    } else if (attackStats.attack.tags['nova']) {
        // attackStats.explode--;
        area.effects.push(explosionEffect(attackStats, attacker.x, getAttackY(attacker), attacker.z));
    } else if (attackStats.attack.tags['blast']) {
        // attackStats.explode--;
        area.effects.push(explosionEffect(attackStats, target.x, getAttackY(attacker), target.z));
    } else if (attackStats.attack.tags['rain']) {
        // attackStats.explode--;
        var targets = [];
        var count = Math.floor(ifdefor(attackStats.attack.count, 1));
        var maxFrameSpread = 250;
        for (var i = 0; i < count; i++) {
            var projectileAttackStats = shallowCopy(attackStats);
            if (!targets.length) {
                targets = Random.shuffle(attacker.enemies);
            }
            var currentTarget = targets.pop();
            var x = attacker.x - 250 + Math.random() * 400 + 10 * i;
            var z = attacker.z - 90 + Math.random() * 180;
            var y = 550 + Math.random() * 100;
            // Point the meteor at the target and hope it hits!
            var vy = -y;
            var vx = currentTarget.x - x;
            var vz = currentTarget.z - z;
            // Normalize starting speed at 15px per frame.
            var mag = Math.sqrt(vx * vx + vy * vy + vz * vz);
            vy *= 15 / mag;
            vx *= 15 / mag;
            vz *= 15 / mag;
            area.projectiles.push(projectile(
                projectileAttackStats, x, y, z, vx, vy, vz,currentTarget, Math.min(i * maxFrameSpread / count, i * 10), // delay is in frames
                projectileAttackStats.isCritical ? 'yellow' : 'red', ifdefor(projectileAttackStats.size, 20) * (projectileAttackStats.isCritical ? 1.5 : 1)));
        }
    } else if (attackStats.attack.tags['ranged']) {
        var distance = getDistance(attacker, target);
        var x = attacker.x + getXDirection(attacker) * attacker.width / 4;
        var y = getAttackY(attacker);
        var z = attacker.z;
        var v = getProjectileVelocity(attackStats, x, y, z, target);
        area.projectiles.push(projectile(
            attackStats, x, y, z, v[0], v[1], v[2], target, 0,
            attackStats.isCritical ? 'yellow' : 'red', ifdefor(attackStats.size, 10) * (attackStats.isCritical ? 1.5 : 1)
        ));
    } else {
        attackStats.distance = getDistance(attacker, target);
        // apply melee attacks immediately
        applyAttackToTarget(attackStats, target);
    }
}
function getAttackY(attacker) {
    // This could actually be a location for abilities targeting locations. Just use 0, which is the height of the floor.
    if (!attacker.isActor) return 0;
    // Y value of projectiles can either be set on the source for the actor, or it will use the set yCenter or half the height.
    var height = ifdefor(attacker.source.height, 64);
    return attacker.scale * ifdefor(attacker.source.attackY, height - ifdefor(attacker.source.yCenter, height / 2));
}
function applyAttackToTarget(attackStats, target) {
    var attack = attackStats.attack;
    var imprintedSpell = attackStats.imprintedSpell;
    var attacker = attackStats.source;
    var area = attacker.area;
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
            'imprintedSpell': attackStats.imprintedSpell,
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
            if ((cleaveTarget.x - attacker.x) * attacker.heading[0] < 0) {
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
            'imprintedSpell': attackStats.imprintedSpell,
            'isCritical': attackStats.isCritical,
            'damage': attackStats.damage,
            'magicDamage': attackStats.magicDamage,
            'accuracy': attackStats.accuracy,
            'explode': attackStats.explode - 1
        };
        var explosionX,explosionY,explosionZ;
        if (attackStats.projectile) {
            explosionX = attackStats.projectile.x;
            explosionY = attackStats.projectile.y;
            explosionZ = attackStats.projectile.z;
        } else if (target) {
            explosionX = target.x;
            explosionY = ifdefor(attackStats.y, getAttackY(target));
            explosionZ = target.z;
        } else {
            explosionX = attacker.x;
            explosionY = ifdefor(attackStats.y, getAttackY(attacker));
            explosionZ = target.z;
        }
        var explosion = explosionEffect(explodeAttackStats, explosionX, explosionY, explosionZ);
        area.effects.push(explosion);
        // Meteor calls applyAttackToTarget with a null target so it can explode
        // anywhere. If that has happened, just return once the explosion has
        // been created.
        if (target) explosion.hitTargets.push(target);
        else return true;
    }
    // All the logic beyond this point does not apply to location targets.
    if (!target.isActor) return true;
    var distance = attackStats.distance;
    var hitText = {x: target.x, y: target.height + 10, z: target.z, color: 'grey', 'vx': -(Math.random() * 3 + 2) * target.heading[0], 'vy': 5};
    if (target.invulnerable) {
        hitText.value = 'invulnerable';
        hitText.fontSize = 15;
        appendTextPopup(area, hitText);
        return false;
    }
    var multiplier = ifdefor(attack.rangeDamage) ? (1 + attack.rangeDamage * distance / 32) : 1;
    if (attackStats.isCritical) {
        hitText.fontSize = 30;
    }
    var damage = Math.floor(attackStats.damage * multiplier * effectiveness);
    var magicDamage = Math.floor(attackStats.magicDamage * multiplier * effectiveness);
    // Spell paradigm shift converts all magic damage to physical damage.
    if (attack.magicToPhysical) {
        damage += magicDamage;
        magicDamage = 0;
    }
    if (attack.heals) {
        hitText.color = 'green';
        hitText.value = (damage + magicDamage).abbreviate();
        target.health += (damage + magicDamage);
        var speed = 1 + Math.log(damage+magicDamage) / 10;
        hitText.vy *= speed;
        hitText.vx *= speed;
        appendTextPopup(area, hitText);
        return true;
    }
    attackStats.evaded = false;
    if (!ifdefor(attack.alwaysHits)) {
        var evasionRoll = (target.maxEvasion ? 1 : Math.random()) * target.evasion;
        // Projectiles have up to 50% reduced accuracy at a distance of 320 pixels.
        var effectiveAccuracy = attackStats.accuracy * Math.max(.5, 1 - ifdefor(attackStats.distance, 0) / 640);
        // if(attacker.character) console.log([attackStats.distance, attackStats.accuracy, effectiveAccuracy, evasionRoll]);
        if (effectiveAccuracy - evasionRoll < 0) {
            hitText.value = 'miss';
            if (ifdefor(attack.damageOnMiss)) {
                var damageOnMiss = Math.round(attack.damageOnMiss * effectiveness);
                target.health -= damageOnMiss;
                hitText.value = 'miss (' + damageOnMiss + ')';
            }
            // Target has evaded the attack.
            hitText.font = 15;
            appendTextPopup(area, hitText);
            attackStats.evaded = true;
        }
        // Chaining attack accuracy is reduced by the evasion roll of each target hit.
        // This is to keep attack from chaining forever.
        if (attackStats.attack.chaining) {
            attackStats.accuracy -= evasionRoll;
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
        if (canUseReaction(target, target.reactions[i], attackStats)) {
            useReaction(target, target.reactions[i], attackStats)
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
    attacker.health += ifdefor(attack.healthGainOnHit, 0) * effectiveness;
    target.slow += ifdefor(attack.slowOnHit, 0) * effectiveness;
    if (imprintedSpell) {
        target.slow += ifdefor(imprintedSpell.slowOnHit, 0) * effectiveness;
    }
    if (attack.debuff) {
        addTimedEffect(target, attack.debuff, 0);
    }
    if (imprintedSpell && imprintedSpell.debuff) {
        addTimedEffect(target, imprintedSpell.debuff, 0);
    }
    var effects = ifdefor(attacker.onHitEffects, []);
    if (attackStats.isCritical) {
        effects = effects.concat(ifdefor(attacker.onCritEffects, []));
    }
    for (var effect of effects) {
        // Some abilities like corsairs venom add a stacking debuff to the target every hit.
        if (ifdefor(effect.debuff)) {
            addTimedEffect(target, effect.debuff, 0);
        }
        // Some abilities like dancer's whirling dervish add a stacking buff to the attacker every hit.
        if (ifdefor(effect.buff)) {
            addTimedEffect(attacker, effect.buff, 0);
        }
    }
    if (totalDamage > 0) {
        var percentPhysical = damage / totalDamage;
        var percentMagic = 1 - percentPhysical;
        var percentOffset = Math.min(.9 - percentPhysical, .9 - percentMagic);
        percentPhysical += percentOffset;
        percentMagic += percentOffset;
        var critBonus = attackStats.isCritical ? 30 : 0;
        var r = toHex(Math.floor(220 * percentPhysical) + critBonus);
        var b = toHex(Math.floor(220 * percentMagic) + critBonus);
        var g = toHex(critBonus * 5);
        hitText.color = "#" + r + g + b;
        var cull = Math.max(ifdefor(attack.cull, 0), imprintedSpell ? ifdefor(imprintedSpell.cull, 0) : 0);
        if (cull > 0 && target.health / target.maxHealth <= cull) {
            target.health = 0;
            hitText.value = 'culled!';
        } else {
            target.health -= totalDamage;
            hitText.value = totalDamage.abbreviate();
            var speed = 1 + Math.log(totalDamage) / 10;
            hitText.vy *= speed;
            hitText.vx *= speed;
        }
        attacker.health += ifdefor(attack.lifeSteal, 0) * totalDamage
        if (imprintedSpell) attacker.health += ifdefor(imprintedSpell.lifeSteal, 0) * totalDamage
        if (ifdefor(attack.poison)) {
            addTimedEffect(target, {'bonuses': {'+damageOverTime': totalDamage * attack.poison}}, 0);
        }
        if (imprintedSpell && ifdefor(imprintedSpell.poison)) {
            addTimedEffect(target, {'bonuses': {'+damageOverTime': totalDamage * imprintedSpell.poison}}, 0);
        }
        var stun = Math.max(ifdefor(attack.stun, 0), imprintedSpell ? ifdefor(imprintedSpell.stun, 0) : 0);
        if (stun) {
            target.stunned = Math.max(ifdefor(target.stunned, 0), target.time + stun * effectiveness);
            hitText.value += ' stunned!';
        }
        // Some attacks pull the target towards the attacker
        var direction = (target.x < attacker.x) ? -1 : 1;
        if (Math.random() < ifdefor(attack.knockbackChance, 0)) {
            var targetX = target.x + direction * 32 * ifdefor(attack.knockbackDistance, 1);
            target.pull = {'x': targetX, 'time': target.time + .3, 'damage': 0};
            target.rotation = direction * ifdefor(attack.knockbackRotation, 45);
        }
        if (attack.pullsTarget) {
            target.stunned =  Math.max(ifdefor(target.stunned, 0), target.time + .3 + distance / 32 * ifdefor(attack.dragStun * effectiveness, 0));
            var targetX = (attacker.x > target.x) ? (attacker.x - target.width) : (attacker.x + attacker.width);
            target.pull = {'x': targetX, 'time': target.time + .3, 'damage': Math.floor(distance / 32 * damage * ifdefor(attack.dragDamage * effectiveness, 0))};
            attacker.pull = {'x': attacker.x, 'time': attacker.time + .3, 'damage': 0};
            target.rotation = direction * ifdefor(attack.knockbackRotation, -45);
            hitText.value += ' hooked!';
        }
        if (attack.domino) {
            target.dominoAttackStats = attackStats;
            var targetX = (attacker.x < target.x) ? (target.x + attacker.width + ifdefor(attack.distance * effectiveness, 128)) : (target.x - ifdefor(attack.distance * effectiveness, 128));
            target.pull = {'x': targetX, 'time': target.time + .3, 'damage': 0};
            target.rotation = direction * ifdefor(attack.knockbackRotation, 45);
        }
    } else {
        hitText.value = 'blocked';
        hitText.font = 15;
    }
    appendTextPopup(area, hitText);
    return true;
}

function appendTextPopup(area, hitText, important) {
    if (important || area.textPopups.length < 100) area.textPopups.push(hitText);
}

function applyArmorToDamage(damage, armor) {
    if (damage <= 0) {
        return 0;
    }
    //This equation looks a bit funny but is designed to have the following properties:
    //100% when armor = 0, 50% when armor = damage, 25% when armor = 2 * damage
    //1/(2^N) damage when armor is N times base damage
    return damage / Math.pow(2, armor / damage);
}
