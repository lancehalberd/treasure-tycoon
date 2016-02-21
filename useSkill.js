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
        return target && !target.cloaked && getDistance(actor, target) <= attackSkill.range * 32;
    },
    use: function (actor, attackSkill, target) {
        performAttack(actor.character, attackSkill, actor, target);
    }
}

skillDefinitions.revive = {
    isValid: function (actor, reviveSkill, attackStats) {
        if (attackStats.evaded) return false;
        // Cast revive only when the incoming hit would kill the character.
        return actor.health - ifdefor(attackStats.totalDamage, 0) <= 0;
    },
    use: function (actor, reviveSkill, attackStats) {
        attackStats.stopped = true;
        actor.health = reviveSkill.amount;
        actor.stunned = actor.time + .3;
        if (reviveSkill.buff) {
            addTimedEffect(actor.character, actor, reviveSkill.buff);
        }
        if (reviveSkill.instantCooldown) {
            for(var i = 0; i < ifdefor(actor.attacks, []).length; i++) {
                var skill = actor.attacks[i];
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
        // Cast stop only when the incoming hit would kill the character.
        return actor.health - ifdefor(attackStats.totalDamage, 0) <= 0;
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
        var monsterData = {
            'key': minionSkill.base.monsterKey,
            'bonuses': {'*maxHealth': ifdefor(minionSkill.healthBonus, 1),
                        '*minDamage': ifdefor(minionSkill.damageBonus, 1),
                        '*maxDamage': ifdefor(minionSkill.damageBonus, 1),
                        '*minMagicDamage': ifdefor(minionSkill.damageBonus, 1),
                        '*maxMagicDamage': ifdefor(minionSkill.damageBonus, 1),
                        '*attackSpeed': ifdefor(minionSkill.attackSpeedBonus, 1),
                        '*speed': ifdefor(minionSkill.speedBonus, 1)}
        }
        actor.pull = {'x': actor.x - actor.direction * 64, 'time': actor.time + .3, 'damage': 0};
        var newMonster = makeMonster(monsterData, actor.level, [], true);
        newMonster.x = actor.x + actor.direction * 32;
        newMonster.character = actor.character;
        newMonster.direction = actor.direction;
        newMonster.speed = Math.max(actor.speed + 5, newMonster.speed);
        newMonster.source = minionSkill;
        newMonster.allies = actor.allies;
        newMonster.enemies = actor.enemies;
        newMonster.time = 0;
        actor.allies.push(newMonster);
        actor.stunned = actor.time + .3;
    }
};

skillDefinitions.clone = {
    isValid: function (actor, cloneSkill, attackStats) {
        var count = 0;
        actor.allies.forEach(function (ally) {
            if (ally.source == cloneSkill) count++;
        });
        return count < cloneSkill.limit && Math.random() < cloneSkill.chance;
    },
    use: function (actor, cloneSkill, attackStats) {
        var clone;
        if (actor.personCanvas) {
            clone = makeAdventurer(actor.job, actor.level, {});
            clone.name = actor.name + ' shadow clone';
            clone.hairOffset = actor.hairOffset;
            clone.equipment = actor.equipment;
            updateAdventurer(clone);
        } else {
            var monsterData = {'key': actor.base.key};
            clone = makeMonster(monsterData, actor.level, [], true);
        }
        clone.bonuses = actor.bonuses.slice();
        actor.pull = {'x': actor.x - actor.direction * 64, 'time': actor.time + .3, 'damage': 0};
        clone.x = actor.x + actor.direction * 32;
        clone.character = actor.character;
        clone.direction = actor.direction;
        clone.speed = Math.max(actor.speed + 5, clone.speed);
        clone.source = cloneSkill;
        clone.allies = actor.allies;
        clone.enemies = actor.enemies;
        clone.stunned = 0;
        clone.slow = 0;
        clone.pull = null;
        clone.time = 0;
        clone.timedEffects = [];
        clone.bonuses.push({'*maxHealth': ifdefor(cloneSkill.healthBonus, 1),
            '*minDamage': ifdefor(cloneSkill.damageBonus, 1),
            '*maxDamage': ifdefor(cloneSkill.damageBonus, 1),
            '*minMagicDamage': ifdefor(cloneSkill.damageBonus, 1),
            '*maxMagicDamage': ifdefor(cloneSkill.damageBonus, 1),
            '*attackSpeed': ifdefor(cloneSkill.attackSpeedBonus, 1),
            '*speed': ifdefor(cloneSkill.speedBonus, 1)});
        updateActorStats(clone);
        actor.allies.push(clone);
        actor.stunned = actor.time + .3;
        // Clone has same percent health as creator.
        clone.health = Math.max(1, clone.maxHealth * actor.health / actor.maxHealth);
    }
};

skillDefinitions.heal = {
    isValid: function (actor, healSkill, attackStats) {
        // Don't use a heal ability unless none of it will be wasted or the actor is below half life.
        return (actor.health + healSkill.amount <= actor.maxHealth) || (actor.health <= actor.maxHealth / 2);
    },
    use: function (actor, healSkill, attackStats) {
        actor.health += healSkill.amount;
        actor.stunned = actor.time + .3;
    }
};

skillDefinitions.buff = {
    isValid: function (actor, buffSkill, target) {
        return true;
    },
    use: function (actor, buffSkill, target) {
        addTimedEffect(actor.character, actor, buffSkill.buff);
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
            addTimedEffect(actor.character, actor, dodgeSkill.buff);
        }
        if (ifdefor(dodgeSkill.globalDebuff)) {
            actor.enemies.forEach(function (enemy) {
                addTimedEffect(actor.character, enemy, dodgeSkill.globalDebuff);
            });
        }
    }
}

skillDefinitions.counterAttack = {
    isValid: function (actor, counterAttackSkill, attackStats) {
        if (attackStats.evaded) return false;
        var distance = getDistance(actor, attackStats.source);
        // Can only counter attack if the target is in range, and the chance to
        // counter attack is reduced by a factor of the distance.
        return distance <= counterAttackSkill.range * 32
            && Math.random() < counterAttackSkill.chance * Math.min(1, 32 / getDistance(actor, attackStats.source));
    },
    use: function (actor, counterAttackSkill, attackStats) {
        performAttack(actor.character, counterAttackSkill, actor, attackStats.source);
    }
}
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
}
skillDefinitions.evadeAndCounter = {
    isValid: function (actor, evadeAndCounterSkill, attackStats) {
        if (!attackStats.evaded) return false;
        // Can only counter attack if the target is in range, and the chance to
        // counter attack is reduced by a factor of the distance.
        return getDistance(actor, attackStats.source) <= evadeAndCounterSkill.range * 32;
    },
    use: function (actor, evadeAndCounterSkill, attackStats) {
        performAttack(actor.character, evadeAndCounterSkill, actor, attackStats.source);
    }
}
