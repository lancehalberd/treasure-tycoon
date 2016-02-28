/**
 * Causes an actor to perform a skill on the given target if valid.
 *
 * The skill must be one the actor possesses, and it must be ready to be used.
 *
 * @param object actor  The actor performing the skill.
 * @param object skill  The skill being performed.
 * @param object target The target to attack or the attackStats of the attack to react to.
 *
 * @return boolean True if the skill was used.
 */
function useSkill(actor, skill, target) {
    if (!skill) return false;
    var actionIndex = actor.actions.indexOf(skill);
    var reactionIndex = actor.reactions.indexOf(skill);
    if (actionIndex < 0 && reactionIndex < 0) return false;
    if (skill.readyAt > actor.time) return false;
    var skillDefinition = skillDefinitions[skill.base.type];
    if (!skillDefinition) {
        console.log("Attempted to use skill " + skill.base.type + " with no definition.");
        console.log(skill);
        skill.readyAt = actor.time + 1000;
        return false;
    }
    for (var i = 0; i < ifdefor(skill.base.restrictions, []).length; i++) {
        if (actor.tags.indexOf(skill.base.restrictions[i]) < 0) {
            return false;
        }
    }
    // Action skills have targets and won't activate if that target is out of range or not of the correct type.
    if (actionIndex >= 0) {
        if (getDistance(actor, target) > skill.range * 32) {
            return false;
        }
        if (ifdefor(skill.base.target) === 'self' && actor !== target) {
            return false;
        }
        if (ifdefor(skill.base.target) === 'allies' && actor.allies.indexOf(target) < 0) {
            return false;
        }
        if (ifdefor(skill.base.target, 'enemies') === 'enemies' && actor.enemies.indexOf(target) < 0) {
            return false;
        }
    }
    if (!skillDefinition.isValid(actor, skill, target)) {
        return false;
    }

    var cdr = Math.min(.9, ifdefor(actor.cooldownReduction, 0));
    skill.readyAt = actor.time + ifdefor(skill.cooldown, 0) * (1 - cdr);
    // Show the name of the skill used if it isn't a basic attack. When skills have distinct
    // visible animations, we should probably remove this.
    if (skill.base.tags.indexOf('basic') < 0) {
        var hitText = {x: actor.x + 32, y: 240 - 170, color: 'white', font: "15px sans-serif"};
        hitText.value = skill.base.name;
        actor.character.textPopups.push(hitText);
    }
    // Run shared code for using any action, which does not contain logic specific
    // for an actor using a skill they possess.
    skillDefinition.use(actor, skill, target);

    actor.lastAction = skill;
    actor.target = target;
    // Every time a skill is used, we push it to the back of possible choices. That
    // way if multiple abilities are always available (such as with 100% CDR),
    // the actor will cycle through them instead of using the first one in the list
    // constantly.
    if (actionIndex >= 0) {
        actor.actions.splice(actionIndex, 1);
        actor.actions.push(skill);
    }
    if (reactionIndex >= 0) {
        actor.reactions.splice(reactionIndex, 1);
        actor.reactions.push(skill);
    }
    return true;
}

/**
 * Hash of skill methods that causes an actor to perform a skill on the given target.
 *
 * No logic about whether the actor can use this skill is included. This can
 * be used when an actor mimics a target and uses a skill they don't possess,
 * or when a pet is ordered to use a skill they cannot otherwise or when a skill
 * is performed even though its cooldown is not available, such as summoning
 * a pet when the "Sick 'em" ability is used.
 *
 * The methods each have the following signature:
 * @param object actor  The actor performing the skill.
 * @param object skill  The skill being performed.
 * @param object target The target to consider using the skill on.
 * @return void
 */
var skillDefinitions = {};

skillDefinitions.attack = {
    isValid: function (actor, attackSkill, target) {
        return !target.cloaked;
    },
    use: function (actor, attackSkill, target) {
        performAttack(actor, attackSkill, target);
    }
};

skillDefinitions.revive = {
    isValid: function (actor, reviveSkill, attackStats) {
        if (attackStats.evaded) return false;
        // Cast revive only when the incoming hit would kill the character.
        return actor.health - ifdefor(attackStats.totalDamage, 0) <= 0;
    },
    use: function (actor, reviveSkill, attackStats) {
        attackStats.stopped = true;
        actor.health = reviveSkill.power;
        actor.percentHealth = actor.health / actor.maxHealth;
        actor.stunned = actor.time + .3;
        if (reviveSkill.buff) {
            addTimedEffect(actor, reviveSkill.buff);
        }
        if (reviveSkill.instantCooldown) {
            for(var i = 0; i < ifdefor(actor.actions, []).length; i++) {
                var skill = actor.actions[i];
                if (skill !== reviveSkill) {
                    skill.readyAt = actor.time;
                }
            }
            for(var i = 0; i < ifdefor(actor.reactions, []).length; i++) {
                var skill = actor.reactions[i];
                if (skill !== reviveSkill) {
                    skill.readyAt = actor.time;
                }
            }
        }
    }
};

skillDefinitions.stop = {
    isValid: function (actor, stopSkill, attackStats) {
        if (attackStats.evaded) return false;
        // Cast stop only when the incoming hit would deal more than half of the
        // character's remaining health in damage.
        return ifdefor(attackStats.totalDamage, 0) >= actor.health / 2;
    },
    use: function (actor, stopSkill, attackStats) {
        attackStats.stopped = true;
        actor.stunned = actor.time + .3;
        actor.character.timeStopEffect = {'actor': actor, 'endAt': actor.time + stopSkill.duration}
    }
};

skillDefinitions.minion = {
    isValid: function (actor, minionSkill, target) {
        var count = 0;
        actor.allies.forEach(function (ally) {
            if (ally.source == minionSkill) count++;
        });
        return count < minionSkill.limit;
    },
    use: function (actor, minionSkill, target) {
        actor.pull = {'x': actor.x - actor.direction * 64, 'time': actor.time + .3, 'damage': 0};
        var newMonster = makeMonster({'key': minionSkill.base.monsterKey}, actor.level, [], true);
        newMonster.x = actor.x + actor.direction * 32;
        newMonster.character = actor.character;
        newMonster.direction = actor.direction;
        newMonster.source = minionSkill;
        newMonster.allies = actor.allies;
        newMonster.enemies = actor.enemies;
        newMonster.time = 0;
        newMonster.bonuses.push(getMinionSpeedBonus(actor, newMonster));
        newMonster.bonuses.push(getMinionSkillBonuses(minionSkill));
        updateActorStats(newMonster);
        actor.allies.push(newMonster);
        actor.stunned = actor.time + .3;
    }
};

function cloneActor(actor) {
    var clone;
    if (actor.personCanvas) {
        clone = makeAdventurer(actor.job, actor.level, {});
        clone.hairOffset = actor.hairOffset;
        clone.equipment = actor.equipment;
        updateAdventurer(clone);
    } else {
        clone = makeMonster({'key': actor.base.key}, actor.level, [], true);
    }
    clone.bonuses = actor.bonuses.slice();
    actor.pull = {'x': actor.x - actor.direction * 64, 'time': actor.time + .3, 'damage': 0};
    clone.x = actor.x + actor.direction * 32;
    clone.character = actor.character;
    clone.direction = actor.direction;
    clone.allies = actor.allies;
    clone.enemies = actor.enemies;
    clone.stunned = 0;
    clone.slow = 0;
    clone.pull = null;
    clone.time = 0;
    clone.timedEffects = [];
    return clone;
}

function getMinionSkillBonuses(minionSkill) {
    return {'*maxHealth': ifdefor(minionSkill.healthBonus, 1),
            '*minDamage': ifdefor(minionSkill.damageBonus, 1),
            '*maxDamage': ifdefor(minionSkill.damageBonus, 1),
            '*minMagicDamage': ifdefor(minionSkill.damageBonus, 1),
            '*maxMagicDamage': ifdefor(minionSkill.damageBonus, 1),
            '*attackSpeed': ifdefor(minionSkill.attackSpeedBonus, 1),
            '*speed': ifdefor(minionSkill.speedBonus, 1)};
}
function getMinionSpeedBonus(actor, minion) {
    return {'+speed': Math.max(5, actor.speed + 5 - minion.speed)};
}

skillDefinitions.clone = {
    isValid: function (actor, cloneSkill, attackStats) {
        var count = 0;
        actor.allies.forEach(function (ally) {
            if (ally.source == cloneSkill) count++;
        });
        return count < cloneSkill.limit && Math.random() < cloneSkill.chance;
    },
    use: function (actor, cloneSkill, attackStats) {
        var clone = cloneActor(actor);
        clone.source = cloneSkill;
        clone.name = actor.name + ' shadow clone';
        clone.bonuses.push(getMinionSpeedBonus(actor, clone));
        clone.bonuses.push(getMinionSkillBonuses(cloneSkill));
        clone.percentHealth = actor.percentHealth;
        updateActorStats(clone);
        actor.allies.push(clone);
        actor.stunned = actor.time + .3;
    }
};

skillDefinitions.decoy = {
    isValid: function (actor, decoySkill, attackStats) {
        var count = 0;
        actor.allies.forEach(function (ally) {
            if (ally.source == decoySkill) count++;
        });
        return count < ifdefor(decoySkill.limit, 10);
    },
    use: function (actor, decoySkill, attackStats) {
        var clone = cloneActor(actor);
        clone.source = decoySkill;
        clone.name = actor.name + ' decoy';
        clone.bonuses.push(getMinionSpeedBonus(actor, clone));
        clone.bonuses.push(getMinionSkillBonuses(decoySkill));
        addBonusesAndActions(clone, abilities.explode);
        updateActorStats(clone);
        actor.allies.push(clone);
        actor.stunned = actor.time + .3;
        // Clone has same percent health as creator.
        clone.health = Math.max(1, clone.maxHealth * actor.health / actor.maxHealth);
    }
};

skillDefinitions.explode = {
    isValid: function (actor, explodeSkill, attackStats) {
        if (attackStats.evaded) return false;
        // Cast revive only when the incoming hit would kill the character.
        return actor.health - ifdefor(attackStats.totalDamage, 0) <= 0;
    },
    use: function (actor, explodeSkill, attackStats) {
        // Shoot a projectile at every enemy.
        for (var i = 0; i < actor.enemies.length; i++) {
            performAttackProper({
                'distance': 0,
                'source': actor,
                'attack': explodeSkill,
                'isCritical': true,
                'damage': 0,
                'magicDamage': explodeSkill.power,
                'accuracy': 0,
            }, actor.enemies[i]);
        }
    }
};

skillDefinitions.heal = {
    isValid: function (actor, healSkill, target) {
        // Only heal allies.
        if (actor.allies.indexOf(target) < 0) return false;
        // Don't use a heal ability unless none of it will be wasted or the actor is below half life.
        return (target.health + healSkill.power <= target.maxHealth) || (target.health <= target.maxHealth / 2);
    },
    use: function (actor, healSkill, target) {
        target.health += healSkill.power;
        actor.stunned = actor.time + .3;
    }
};

skillDefinitions.effect = {
    isValid: function (actor, effectSkill, target) {
        return actor.allies.length > 1;
    },
    use: function (actor, effectSkill, target) {
        if (effectSkill.buff) {
            addTimedEffect(target, effectSkill.buff);
        }
        // Ranger's Sic 'em ability buffs all allies but not the actor.
        if (effectSkill.allyBuff) {
            for (var i = 0; i < actor.allies.length; i++) {
                if (actor.allies[i] === actor) continue;
                addTimedEffect(actor.allies[i], effectSkill.allyBuff);
            }
        }
        if (effectSkill.debuff) {
            addTimedEffect(target, effectSkill.debuff);
        }
        actor.stunned = actor.time + .3;
    }
};

skillDefinitions.dodge = {
    isValid: function (actor, dodgeSkill, attackStats) {
        // side step can only dodge ranged attacked.
        if (ifdefor(dodgeSkill.rangedOnly) && !attackStats.projectile) {
            return false;
        }
        return !attackStats.evaded;
    },
    use: function (actor, dodgeSkill, attackStats) {
        attackStats.dodged = true;
        if (ifdefor(dodgeSkill.distance)) {
            actor.pull = {'x': actor.x + actor.direction * dodgeSkill.distance, 'time': actor.time + ifdefor(dodgeSkill.moveDuration, .3), 'damage': 0};
        }
        if (ifdefor(dodgeSkill.buff)) {
            addTimedEffect(actor, dodgeSkill.buff);
        }
        if (ifdefor(dodgeSkill.globalDebuff)) {
            actor.enemies.forEach(function (enemy) {
                addTimedEffect(enemy, dodgeSkill.globalDebuff);
            });
        }
    }
};
// Counters with the skill if the player would receive more than half their remaining health in damage
skillDefinitions.criticalCounter = {
    isValid: function (actor, counterSkill, attackStats) {
        if (attackStats.evaded) return false;
        // Cast stop only when the incoming hit would deal more than half of the
        // character's remaining health in damage.
        return ifdefor(attackStats.totalDamage, 0) >= actor.health / 2;
    },
    use: function (actor, counterSkill, attackStats) {
        if (counterSkill.dodgeAttack) attackStats.dodged = true;
        if (counterSkill.stopAttack) attackStats.stopped = true;
        if (ifdefor(counterSkill.distance)) {
            actor.pull = {'x': actor.x + actor.direction * ifdefor(counterSkill.distance, 64), 'time': actor.time + ifdefor(counterSkill.moveDuration, .3), 'damage': 0};
        }
        if (ifdefor(counterSkill.buff)) {
            addTimedEffect(actor, counterSkill.buff);
        }
        if (ifdefor(counterSkill.globalDebuff)) {
            actor.enemies.forEach(function (enemy) {
                addTimedEffect(enemy, counterSkill.globalDebuff);
            });
        }
    }
};

skillDefinitions.counterAttack = {
    isValid: function (actor, counterAttackSkill, attackStats) {
        if (attackStats.evaded) return false;
        var distance = getDistance(actor, attackStats.source);
        // Can only counter attack if the target is in range, and the chance to
        // counter attack is reduced by a factor of the distance.
        return distance <= counterAttackSkill.range * 32
            && Math.random() < counterAttackSkill.chance * Math.min(1, 32 / distance);
    },
    use: function (actor, counterAttackSkill, attackStats) {
        performAttack(actor, counterAttackSkill, attackStats.source);
    }
};
skillDefinitions.deflect = {
    isValid: function (actor, deflectSkill, attackStats) {
        if (attackStats.evaded) return false;
        // Only non-spell, projectile attacks can be deflected.
        return attackStats.projectile && attackStats.attack.base.tags.indexOf('spell') < 0;
    },
    use: function (actor, counterAttackSkill, attackStats) {
        var projectile = attackStats.projectile;
        // mark the projectile as having not hit so it can hit again now that it
        // has been deflected.
        projectile.hit = false;
        projectile.target = attackStats.source;
        attackStats.source = actor;
        attackStats.damage *= counterAttackSkill.attackPower;
        attackStats.magicDamage *= counterAttackSkill.attackPower;
        attackStats.vx = -attackStats.vx;
        attackStats.vy = -getDistance(actor, projectile.target) / 200;
        // This prevents the attack in progress from hitting the deflector.
        attackStats.deflected = true;
    }
};
skillDefinitions.evadeAndCounter = {
    isValid: function (actor, evadeAndCounterSkill, attackStats) {
        if (!attackStats.evaded) return false;
        // Can only counter attack if the target is in range, and the chance to
        // counter attack is reduced by a factor of the distance.
        return getDistance(actor, attackStats.source) <= evadeAndCounterSkill.range * 32;
    },
    use: function (actor, evadeAndCounterSkill, attackStats) {
        performAttack(actor, evadeAndCounterSkill, attackStats.source);
    }
};

skillDefinitions.mimic = {
    isValid: function (actor, counterAttackSkill, attackStats) {
        // Only non basic attacks can be mimicked.
        return attackStats.attack.base.tags.indexOf('basic') < 0;
    },
    use: function (actor, counterAttackSkill, attackStats) {
        performAttack(actor, attackStats.attack, attackStats.source);
    }
};

skillDefinitions.reflect = {
    isValid: function (actor, reflectSkill, target) {
        return true;
    },
    use: function (actor, reflectSkill, target) {
        actor.reflectBarrier = ifdefor(actor.reflectBarrier, 0) + reflectSkill.power;
        actor.maxReflectBarrier = actor.reflectBarrier;
    }
};

skillDefinitions.plunder = {
    isValid: function (actor, plunderSkill, target) {
        return ifdefor(target.prefixes, []).length + ifdefor(target.suffixes, []).length;
    },
    use: function (actor, plunderSkill, target) {

        var allAffixes = target.prefixes.concat(target.suffixes);
        for (var i = 0; i < plunderSkill.count && allAffixes.length; i++) {
            var affix = Random.element(allAffixes);
            if (target.prefixes.indexOf(affix) >= 0) target.prefixes.splice(target.prefixes.indexOf(affix), 1);
            if (target.suffixes.indexOf(affix) >= 0) target.suffixes.splice(target.suffixes.indexOf(affix), 1);
            var bonuses = affix.bonuses;
            bonuses['duration'] = plunderSkill.duration;
            addTimedEffect(actor, bonuses);
            allAffixes = target.prefixes.concat(target.suffixes);
        }
        updateMonster(target);
    }
};

skillDefinitions.banish = {
    isValid: function (actor, banishSkill, target) {
        return !target.cloaked;
    },
    use: function (actor, banishSkill, target) {
        var attackStats = performAttack(actor, banishSkill, target);
        if (ifdefor(banishSkill.mainDebuff)) {
            addTimedEffect(target, banishSkill.mainDebuff);
        }
        // The purify upgrade removes all enchantments from a target.
        if (banishSkill.purify && target.prefixes.length + target.suffixes.length > 0) {
            target.prefixes = [];
            target.suffixes = [];
            updateMonster(target);
        }
        actor.enemies.forEach(function (enemy) {
            if (enemy === target) {
                return;
            }
            var distance = getDistance(actor, enemy);
            if (distance < 32 * banishSkill.distance) {
                // Adding the delay here creates a shockwave effect where the enemies
                // all get pushed from a certain point at the same time, rather than
                // them all immediately moving towards the point initially.
                enemy.pull = {'x': actor.x + actor.direction * (64 + 32 * banishSkill.distance), 'delay': enemy.time + distance * .02 / 32, 'time': enemy.time + banishSkill.distance * .02, 'damage': 0};
                // The shockwave upgrade applies the same damage to the targets hit by the shockwave.
                if (banishSkill.shockwave) {
                    enemy.pull.attackStats = attackStats;
                }
                if (ifdefor(banishSkill.otherDebuff)) {
                    addTimedEffect(enemy, banishSkill.otherDebuff);
                }
            }
        });
    }
};

skillDefinitions.charm = {
    isValid: function (actor, charmSkill, target) {
        return !target.cloaked && !target.uncontrollable;
    },
    use: function (actor, charmSkill, target) {
        target.allies = actor.allies;
        target.enemies = actor.enemies;
        target.bonuses.push(getMinionSpeedBonus(actor, target));
        updateActorStats(target);
        actor.enemies.splice(actor.enemies.indexOf(target), 1);
        actor.allies.push(target);
        target.direction = actor.direction;
        actor.stunned = actor.time + 1;
    }
};
skillDefinitions.charge = {
    isValid: function (actor, chargeSkill, target) {
        return !target.cloaked;
    },
    use: function (actor, chargeSkill, target) {
        actor.chargeEffect = {
            'chargeSkill': chargeSkill,
            'distance': 0
        };
    }
};