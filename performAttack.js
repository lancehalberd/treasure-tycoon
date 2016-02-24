
function updateDamageInfo(character) {
    var adventurer = character.adventurer;
    if (!adventurer || !adventurer.actions) return;
    var attack = adventurer.actions[adventurer.actions.length - 1];
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
    if (attack.minDamage && attack.minMagicDamage) {
        sections.push('Total Expected DPS is ' + (expectedPhysicalDPS + expectedMagicDPS).format(1) + '(' + expectedPhysicalDPS.format(1) + ' physical + ' + expectedMagicDPS.format(1) + ' magic)');
    } else {
        sections.push('Total Expected DPS is ' + (expectedPhysicalDPS + expectedMagicDPS).format(1));
    }
    var $statsPanel = character.$panel.find('.js-infoMode .js-stats');
    var $damage =  $statsPanel.find('.js-damage');
    $damage.text( (rawPhysicalDPS + rawMagicDPS).format(1) + ' (' + (expectedPhysicalDPS + expectedMagicDPS).format(1) + ')');
    $damage.parent().attr('helptext', sections.join('<br/>'));

    attack = dummy.actions[dummy.actions.length - 1];

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

function createAttackStats(attacker, attack) {
    var isCritical = Math.random() <= attack.critChance;
    var damage = Random.range(attack.minDamage, attack.maxDamage);
    var magicDamage = Random.range(attack.minMagicDamage, attack.maxMagicDamage);
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
        'source': attacker,
        'attack': attack,
        'isCritical': isCritical,
        'damage': damage,
        'magicDamage': magicDamage,
        'accuracy': accuracy,
    };
}

function projectile(attackStats, x, y, vx, vy, target, delay, color, size) {
    size = ifdefor(size, 10);
    var self = {
        'x': x, 'y': y, 'vx': vx, 'vy': vy, 't': 0, 'done': false, 'delay': delay,
        'hit': false, 'target': target, 'attackStats': attackStats,
        'update': function (character) {
            // Put an absolute cap on how far a projectile can travel
            if (self.y > 240 - 64 || self.attackStats.distance > 2000) self.done = true;
            if (self.done || self.delay-- > 0) return
            self.x += self.vx;
            self.y += self.vy;
            self.vy+= .1 * 15 / Math.abs(self.vx);
            self.t += 1;
            // Don't do any collision detection once the projectile is spent.
            if (self.hit) return;
            self.attackStats.distance += Math.sqrt(self.vx * self.vx + self.vy * self.vy);
            if (Math.abs(self.target.x + 32 - self.x) < 10 && self.target.health > 0) {
                self.hit = true;
                if (ifdefor(self.target.reflectBarrier, 0)) {
                    self.target.reflectBarrier = Math.max(0, self.target.reflectBarrier - self.attackStats.magicDamage - self.attackStats.damage);
                    self.hit = false;
                    var newTarget = self.attackStats.source;
                    self.attackStats.source = self.target;
                    self.target = newTarget;
                    self.vx = -self.vx;
                    var distance = Math.abs(self.x - newTarget.x);
                    if (self.y > 240 - 128) self.vy = -distance / 200;
                } else if (applyAttackToTarget(self.attackStats, self.target)) {
                    self.done = true;
                    if (ifdefor(attackStats.attack.chaining)) {
                        self.done = false;
                        // reduce the speed. This seems realistic and make it easier to
                        // distinguish bounced attacks from new attacks.
                        self.vx = -self.vx / 5;
                        var targets = self.attackStats.source.enemies.slice();
                        while (targets.length) {
                            var index = Math.floor(Math.random() * targets.length);
                            var newTarget = targets[index];
                            if (newTarget.health <= 0 || newTarget === self.target || newTarget.cloaked) {
                                targets.splice(index--, 1);
                                continue;
                            }
                            // increase the speed back to normal if the ricochete succeeds.
                            self.vx *= 5;
                            self.hit = false;
                            self.target = newTarget;
                            var distance = Math.abs(self.x - newTarget.x);
                            if (self.vx * (self.target.x + 32 - self.x) <= 0) {
                                self.vx = -self.vx;
                            }
                            if (self.y > 240 - 128) self.vy = -distance / 200;
                            self.attackStats.accuracy *= .95;
                            break;
                        }
                    }
                }
            } else if (self.target.health > 0 && self.vx * (self.target.x + 32 - self.x) <= 0) {
                self.vx = -self.vx;
            }
        },
        'draw': function (character) {
            if (self.done || self.delay > 0) return
            character.context.fillStyle = ifdefor(color, '#000');
            character.context.fillRect(self.x - character.cameraX - size / 2, self.y - size / 2, size, size);
        }
    };
    self.attackStats.projectile = self;
    return self;
}
function performAttack(attacker, attack, target) {
    var character = attacker.character;
    var attackStats = createAttackStats(attacker, attack);
    attacker.attackCooldown = attacker.time + 1 / (attackStats.attack.attackSpeed * Math.max(.1, (1 - attacker.slow)));
    performAttackProper(attackStats, target);
}
function performAttackProper(attackStats, target) {
    var attacker = attackStats.source;
    if (attackStats.attack.base.tags.indexOf('ranged') >= 0) {
        attacker.character.projectiles.push(projectile(
            attackStats, attacker.x + attacker.width / 2 + attacker.direction * attacker.width / 4, 240 - 128,
            attacker.direction * 15, -getDistance(attacker, target) / 200, target, 0,
            attackStats.isCritical ? 'yellow' : 'red', attackStats.isCritical ? 15 : 10));
    } else {
        attackStats.distance = getDistance(attacker, target);
        // apply melee attacks immediately
        applyAttackToTarget(attackStats, target);
    }
}
function applyAttackToTarget(attackStats, target) {
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
    var attack = attackStats.attack;
    var attacker = attackStats.source;
    var multiplier = ifdefor(attack.rangeDamage) ? (1 + attack.rangeDamage * distance / 32) : 1;
    if (attackStats.isCritical) {
        hitText.color = 'yellow';
        hitText.font = "30px sans-serif"
    }
    var damage = Math.floor(attackStats.damage * multiplier);
    var magicDamage = Math.floor(attackStats.magicDamage * multiplier);
    attackStats.evaded = false;
    if (!ifdefor(attack.alwaysHits)) {
        var evasionRoll = (target.maxEvasion ? 1 : Math.random()) * target.evasion;
        if (attackStats.accuracy < evasionRoll) {
            hitText.value = 'miss';
            if (ifdefor(attack.damageOnMiss)) {
                target.health -= attack.damageOnMiss;
                hitText.value = 'miss (' + attack.damageOnMiss + ')';
            }
            // Target has evaded the attack.
            hitText.color = 'blue';
            hitText.font, "15px sans-serif"
            character.textPopups.push(hitText);
            attackStats.evaded = true;
        }
    }
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
    attacker.health += ifdefor(attack.healthGainOnHit, 0);
    target.slow += ifdefor(attack.slowOnHit, 0);
    if (totalDamage > 0) {
        target.health -= totalDamage;
        hitText.value = totalDamage;
        // Some attacks pull the target towards the attacker
        if (attack.pullsTarget) {
            target.stunned = target.time + .3 + distance / 32 * ifdefor(attack.dragStun, 0);
            var targetX = (attacker.x > target.x) ? (attacker.x - 64) : (attacker.x + 64);
            target.pull = {'x': targetX, 'time': target.time + .3, 'damage': Math.floor(distance / 32 * damage * ifdefor(attack.dragDamage, 0))};
            attacker.pull = {'x': attacker.x, 'time': attacker.time + .3, 'damage': 0};
            hitText.value += ' hooked!';
        }
        if (attack.domino) {
            target.dominoAttackStats = attackStats;
            var targetX = (attacker.x < target.x) ? (target.x + ifdefor(attack.distance, 128)) : (target.x - ifdefor(attack.distance, 128));
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
