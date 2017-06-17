/**
 * Checks whether an actor may use a skill on a given target.
 *
 * @param object actor       The actor performing the skill.
 * @param object skill       The skill being performed.
 * @param object target      The target to attack for active abilities.
 */
function canUseSkillOnTarget(actor, skill, target) {
    if (!actor) throw new Error('No actor was passed to canUseSkillOnTarget');
    if (!skill) throw new Error('No skill was passed to canUseSkillOnTarget');
    if (!target) throw new Error('No target was passed to canUseSkillOnTarget');
    if (skill.readyAt > actor.time) return false; // Skill is still on cool down.
    if (skill.tags['basic'] && actor.healingAttacks) return false;
    if (!!ifdefor(skill.base.targetDeadUnits) !== target.isDead) return false; // targetDeadUnits must match target.isDead.
    for (var i = 0; i < ifdefor(skill.base.restrictions, []).length; i++) {
        if (!actor.tags[skill.base.restrictions[i]]) {
            return false;
        }
    }
    if (actor.cannotAttack && skill.tags['attack']) return false; // Jujutsu prevents a user from using active attacks.
    // Make sure target matches the target type of the skill.
    if (ifdefor(skill.base.target) === 'self' && actor !== target) return false;
    if (ifdefor(skill.base.target) === 'otherAllies' && (actor === target || actor.allies.indexOf(target) < 0)) return false;
    if (ifdefor(skill.base.target) === 'allies' && actor.allies.indexOf(target) < 0) return false;
    if (ifdefor(skill.base.target, 'enemies') === 'enemies' && actor.enemies.indexOf(target) < 0) return false;
    if (ifdefor(skill.base.target, 'enemies') === 'enemies' && target.cloaked) return false;
    var skillDefinition = skillDefinitions[skill.base.type];
    if (!skillDefinition) return false; // Invalid skill, maybe from a bad/old save file.
    return !skillDefinition.isValid || skillDefinition.isValid(actor, skill, target);
}

/**
 * Checks whether an actor may use a reaction in response to a given attack targeting them.
 *
 * @param object actor       The actor performing the skill.
 * @param object skill       The skill being performed.
 * @param object target      The target to attack for active abilities.
 */
function canUseReaction(actor, reaction, attackStats) {
    if (!actor) throw new Error('No actor was passed to canUseReaction');
    if (!reaction) throw new Error('No reaction was passed to canUseReaction');
    if (!attackStats) throw new Error('No attackStats was passed to canUseReaction');
    if (reaction.readyAt > actor.time) return false;
    var reactionDefinition = skillDefinitions[reaction.base.type];
    if (!reactionDefinition) return false;
    for (var i = 0; i < ifdefor(reaction.base.restrictions, []).length; i++) {
        if (!actor.tags[reaction.base.restrictions[i]]) {
            return false;
        }
    }
    return !reactionDefinition.isValid || reactionDefinition.isValid(actor, reaction, attackStats);
}

/**
 * Checks whether a target is currently within range of a particular skill.
 *
 * @param object actor       The actor performing the skill.
 * @param object skill       The skill being performed.
 * @param object target      The target to attack for active abilities.
 */
function isTargetInRangeOfSkill(actor, skill, pointOrTarget) {
    if (skill.base.target === 'none') return true;
    var isAOE = skill.cleave || skill.tags['nova'] || skill.tags['field'] || skill.tags['blast'] || skill.tags['rain'];
    // Nova skills use area instead of range for checking for valid targets.
    if (skill.tags['nova']) return getDistance(actor, pointOrTarget) < skill.area * 32 / 2;
    if (skill.tags['field']) return getDistance(actor, pointOrTarget) < skill.area * 32 / 2;
    return getDistance(actor, pointOrTarget) <= (skill.range + ifdefor(skill.teleport, 0)) * 32;
}

/**
 * Checks if the AI thinks the actor should use a skill.
 *
 * The idea is that if the skill has a long cooldown, it won't be used unless it is
 * worthwhile, for example, healing and damage won't be wasted.
 *
 * This should only be called after confirming that canUseSkillOnTarget and isTargetInRangeOfSkill
 * are true.
 *
 * @param object actor       The actor performing the skill.
 * @param object skill       The skill being performed.
 * @param object target      The target to attack for active abilities.
 *
 * @return boolean True if the skill was used.
 */
function shouldUseSkillOnTarget(actor, skill, target) {
    if (target.isMainCharacter) return true; // Enemies always use skills on the hero, since they win if the hero dies.
    if (ifdefor(skill.cooldown, 0) < 10) return true; // Don't worry about wasting skills with short cool downs.
    // Make sure combined health of enemies in range is less than the raw damage of the attack, or that the ability
    // will result in life gain that makes it worth using
    if (ifdefor(skill.base.target, 'enemies') === 'enemies') {
        var health = 0;
        if (skill.cleave || skill.tags['nova'] || skill.tags['field'] || skill.tags['blast'] || skill.tags['rain']) {
            var targetsInRange = getEnemiesLikelyToBeHitIfEnemyIsTargetedBySkill(actor, skill, target);
            if (targetsInRange.length === 0) {
                return false;
            }
            targetsInRange.forEach(function (target) {
                health += target.health;
            })
            // scale health by number of targets for aoe attacks.
            health *= targetsInRange.length;
        } else {
            health = target.health;
        }
        var previewAttackStats = skill.tags['spell'] ? createSpellStats(actor, skill, target) : createAttackStats(actor, skill, target);
        // Any life gained by this attack should be considered in the calculation as well in favor of using the attack.
        var possibleLifeGain = (previewAttackStats.damage + previewAttackStats.magicDamage) * ifdefor(skill.lifeSteal, 0);
        var actualLifeGain = actorCanOverHeal(actor) ? possibleLifeGain : Math.min(actor.maxHealth - actor.health, possibleLifeGain);
        // Make sure the total health of the target/combined targets is at least
        // the damage output of the attack.
        // We weight wasted life gain very high to avoid using life stealing moves when the user has full life,
        // and then weight actual life gained even higher to encourage using life stealing moves that will restore a lot of health.
        if (health + 8 * actualLifeGain < (previewAttackStats.damage + previewAttackStats.magicDamage) + 5 * possibleLifeGain) {
            return false;
        }
    }
    // Some (but not all) skill definitions have specific criteria for using them or not (like heal checks that the full heal will be used or you might die soon).
    var skillDefinition = skillDefinitions[skill.base.type];
    if (skillDefinition.shouldUse && !skillDefinition.shouldUse(actor, skill, target)) return false;
    return true;
}

/**
 * Causes an actor to start performing a skill on the given target.
 *
 * This method actually performs the skill without any validation, so validation should
 * be checked before calling this code.
 *
 * The skill isn't actually used until the preparation time of the skill is finished,
 * and it can be interrupted if the user loses control before then.
 *
 * @param object actor       The actor performing the skill.
 * @param object skill       The skill being performed.
 * @param object target      The target to attack for active abilities.
 *
 * @return boolean True if the skill was used. Only false if the ability is probabilistic like raise dead.
 */
function prepareToUseSkillOnTarget(actor, skill, target) {
    if (target && ifdefor(skill.base.consumeCorpse) && target.isDead) {
        removeActor(target);
    }
    // Only use skill if they meet the RNG for using it. This is currently only used by the
    // 15% chance to raise dead on unit, which is why it comes after consuming the corpse.
    if (ifdefor(skill.chance, 1) < Math.random()) {
        return;
    }
    if (skill.tags['attack']) {
        // The wind up for an attack is at most .2s but is typically half the attack duration.
        // We don't make it longer than .2s because the wind up stops user movement and leaves the
        // attacker vulnerable to interrupt and because the attack animation looks bad slow during
        // the attack stage. Making the recovery stage be > .2s is fine because the user can still
        // move (slowly) and the recover animation doesn't look terrible slow.
        skill.totalPreparationTime = Math.min(.2, (1 / skill.attackSpeed) / 2);
        // Whatever portion of the attack time isn't used by the prep time is designated as recoveryTime.
        actor.totalRecoveryTime = 1 / skill.attackSpeed - skill.totalPreparationTime;
    } else {
        // As of writing this, no skill uses prepTime, but we could use it to make certain spells
        // take longer to cast than others.
        skill.totalPreparationTime = ifdefor(skill.prepTime, .2);
        actor.totalRecoveryTime = ifdefor(skill.recoveryTime, .1);
    }
    actor.skillInUse = skill;
    actor.skillTarget = target;
    // These values will count up until completion. If a character is slowed, it will reduce how quickly these numbers accrue.
    skill.preparationTime = actor.recoveryTime = 0;
}

/**
 * Call to make an actor actually use the skill they have been preparing.
 *
 * @param object actor The actor performing the skill.
 *
 * @return boolean True if the skill was used. Only false if the ability is probabilistic like raise dead.
 */
function useSkill(actor) {
    var skill = actor.skillInUse;
    var target = actor.skillTarget
    if (!skill || !target) {
        actor.skillInUse = actor.skillTarget = null;
        return;
    }
    skill.readyAt = actor.time + ifdefor(skill.cooldown, 0);
    // Show the name of the skill used if it isn't a basic attack. When skills have distinct
    // visible animations, we should probably remove this.
    if (!skill.tags['basic']) {
        var hitText = {x: actor.x, y: actor.height, z: actor.z, color: 'white', fontSize: 15, 'vx': 0, 'vy': 1, 'gravity': .1};
        hitText.value = skill.base.name;
        appendTextPopup(actor.area, hitText, true);
    }
    skillDefinitions[skill.base.type].use(actor, skill, target);
    triggerSkillEffects(actor, skill);
}

/**
 * Use a reaction in response to a given attack targeting an actor.
 *
 * This should only be called after canUseReaction returns true for the same arguments.
 *
 * @param object actor  The actor performing the skill.
 * @param object skill  The skill being performed.
 * @param object target The target to attack for active abilities.
 */
function useReaction(actor, reaction, attackStats) {
    reaction.readyAt = actor.time + ifdefor(reaction.cooldown, 0);
    // Show the name of the skill. When skills have distinct visible animations, we should probably remove this.
    var skillPopupText = {x: actor.x, y: actor.height, z: actor.z, color: 'white', fontSize: 15, 'vx': 0, 'vy': 1, 'gravity': .1};
    skillPopupText.value = reaction.base.name;
    appendTextPopup(actor.area, skillPopupText, true);
    skillDefinitions[reaction.base.type].use(actor, reaction, attackStats);
    triggerSkillEffects(actor, reaction);
}

/**
 * Triggers effects that occur when a skill is used.
 *
 * This applies to both active skills and reactions and is used for things like:
 * Instant cooldown effects common on unique mobs that reset one skill when another is used.
 * Priest's heal/knockback on spell cast.
 *
 * @param object actor The actor performing the skill.
 * @param object skill The skill being performed.
 *
 * @return void
 */
function triggerSkillEffects(actor, skill) {
    // Apply instant cooldown if it is set.
    if (skill.instantCooldown) {
        // * is wild card meaning all other skills
        for(var otherSkill of ifdefor(actor.actions, [])) {
            if ((skill !== otherSkill && skill.instantCooldown === '*') || otherSkill.tags[skill.instantCooldown]) {
                otherSkill.readyAt = actor.time;
            }
        }
        for(var otherSkill of ifdefor(actor.reactions, [])) {
            if ((skill !== otherSkill && skill.instantCooldown === '*') || otherSkill.tags[skill.instantCooldown]) {
                otherSkill.readyAt = actor.time;
            }
        }
    }
    if (skill.tags.spell && actor.castKnockBack) {
        for (var enemy of getActorsInRange(actor, actor.castKnockBack, actor.enemies)) {
            banishTarget(actor, enemy, actor.castKnockBack, 30);
        }
    }
    if (skill.tags.spell && actor.healOnCast) {
        actor.health += actor.maxHealth * actor.healOnCast;
    }
}

function getEnemiesLikelyToBeHitIfEnemyIsTargetedBySkill(actor, skill, skillTarget) {
    var targets = [];
    // Rain targets everything on the field.
    if (skill.tags['rain']) {
        return actor.enemies.slice();
    }
    for (var i = 0; i < actor.enemies.length; i++) {
        var target = actor.enemies[i];
        if (skill.tags['nova'] || skill.tags['field']) {
            if (getDistance(actor, target) < skill.area * 32) {
                targets.push(target);
                continue;
            }
        } else if (skill.area) {
            if (getDistance(skillTarget, target) < skill.area * 32) {
                targets.push(target);
                continue;
            }
        }
    }
    return targets;
}
function getActorsInRange(source, range, targets) {
    var targetsInRange = [];
    for (var target of targets) {
        if (target !== source && getDistance(source, target) < range* 32) {
            targetsInRange.push(target);
        }
    }
    return targetsInRange;
}

function closestEnemyDistance(actor) {
    var distance = 2000;
    for (var enemy of actor.enemies) {
        distance = Math.min(distance, getDistance(actor, enemy));
    }
    return distance;
}

/**
 * Hash of skill methods that causes an actor to perform a skill on the given target.
 *
 * No logic about whether the actor can use this skill is included. This can
 * be used when an actor mimics a target and uses a skill they don't possess,
 * or when a pet is ordered to use a skill they cannot otherwise or when a skill
 * is performed even though its cooldown is not available, such as commanding
 * a pet to attack when the "Sick 'em" ability is used.
 *
 * The methods each have the following signature:
 * @param object actor  The actor performing the skill.
 * @param object skill  The skill being performed.
 * @param object target The target to consider using the skill on.
 * @return void
 */
var skillDefinitions = {};

skillDefinitions.attack = {
    use: function (actor, attackSkill, target) {
        performAttack(actor, attackSkill, target);
    }
};

skillDefinitions.spell = {
    use: function (actor, spellSkill, target) {
        castAttackSpell(actor, spellSkill, target);
    }
};

skillDefinitions.consume = {
    use: function (actor, consumeSkill, target) {
        actor.health += target.maxHealth * ifdefor(consumeSkill.consumeRatio, 1);
        stealAffixes(actor, target, consumeSkill);
    }
};
skillDefinitions.song = {
    shouldUse: function (actor, songSkill, target) {
        return closestEnemyDistance(actor) < 500;
    },
    use: function (actor, songSkill, target) {
        var attackStats = createSpellStats(actor, songSkill, target);
        performAttackProper(attackStats, target);
        return attackStats;
    }
};
skillDefinitions.heroSong = {
    shouldUse: function (actor, songSkill, target) {
        var healthValues = target.healthValues;
        // healthValues might not be set right when a target spawns.
        if (!healthValues || target.isMainCharacter) {
            return false;
        }
        // Use ability if target is low on life.
        //console.log(target.health / target.maxHealth);
        if (target.health / target.maxHealth <= 1 / 3) {
            return true;
        }
        // Use ability if target is losing remaining life rapidly.
        var maxHealth = Math.max.apply(null, healthValues);
        //console.log(healthValues[0] + ' / ' + target.maxHealth);
        if (healthValues[0] / maxHealth <= .6) {
            ///console.log(healthValues);
            return true;
        }
        return false;
    },
    use: function (actor, songSkill, target) {
        var attackStats = createSpellStats(actor, songSkill, target);
        performAttackProper(attackStats, target);
        return attackStats;
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
            addTimedEffect(actor, reviveSkill.buff, 0);
        }
    }
};

skillDefinitions.stop = {
    isValid: function (actor, stopSkill, attackStats) {
        return (actor.health / actor.maxHealth < .1) && (actor.temporalShield > 0);
    },
    use: function (actor, stopSkill, attackStats) {
        actor.stunned = actor.time + .3;
        actor.character.timeStopEffect = {'actor': actor};
        if (actor.health <= 0) actor.health = 1;
    }
};

skillDefinitions.minion = {
    isValid: function (actor, minionSkill, target) {
        var count = 0;
        // Cannot raise corpses of uncontrollable enemies as minions.
        if (minionSkill.base.consumeCorpse && (target.uncontrollable || target.stationary)) {
            return false;
        }
        actor.allies.forEach(function (ally) {
            if (ally.skillSource == minionSkill) count++;
        });
        return count < minionSkill.limit;
    },
    use: function (actor, minionSkill, target) {
        var newMonster;
        if (minionSkill.base.consumeCorpse) {
            newMonster = makeMonster({'key': target.base.key}, target.level, [], true);
            newMonster.x = target.x;
            newMonster.y = target.y;
            newMonster.z = target.z;
        } else {
            newMonster = makeMonster({'key': minionSkill.base.monsterKey}, actor.level, [], true);
            newMonster.x = actor.x + actor.heading[0] * 32;
            newMonster.y = actor.y + actor.heading[1] * 32;
            newMonster.z = actor.z + actor.heading[2] * 32;
        }
        newMonster.character = actor.character;
        newMonster.heading = actor.heading.slice();
        newMonster.skillSource = minionSkill;
        actor.minions.push(newMonster);
        newMonster.allies = actor.allies;
        newMonster.enemies = actor.enemies;
        newMonster.time = 0;
        addMinionBonuses(actor, minionSkill, newMonster);
        initializeActorForAdventure(newMonster);
        newMonster.owner = actor;
        actor.allies.push(newMonster);
        actor.stunned = actor.time + .3;
    }
};

function cloneActor(actor, skill) {
    var clone;
    if (actor.personCanvas) {
        clone = makeAdventurerFromJob(actor.job, actor.level, {});
        clone.hairOffset = actor.hairOffset;
        clone.skinColorOffset = actor.skinColorOffset;
        clone.equipment = actor.equipment;
        updateAdventurer(clone);
        // Add bonuses from source character's abilities/jewel board.
        // Note that we don't give the clone the source character's actions.
        for (var ability of actor.abilities) {
            if (ability.bonuses) addBonusSourceToObject(clone, ability);
        }
        if (actor.character) addBonusSourceToObject(clone, actor.character.jewelBonuses);
    } else {
        clone = makeMonster({'key': actor.base.key}, actor.level, [], true);
    }
    clone.x = actor.x + actor.heading[0] * 32;
    clone.y = actor.y + actor.heading[1] * 32;
    clone.z = actor.z + actor.heading[2] * 32;
    clone.character = actor.character;
    clone.heading = actor.heading.slice();
    initializeActorForAdventure(clone);
    clone.allies = actor.allies;
    clone.enemies = actor.enemies;
    clone.stunned = 0;
    clone.slow = 0;
    clone.pull = null;
    clone.time = 0;
    clone.allEffects = [];
    addMinionBonuses(actor, skill, clone);
    actor.stunned = actor.time + .3;
    return clone;
}
function addMinionBonuses(actor, skill, minion) {
    var newTags = {};
    // Add skill tags to the clone's tags. This is how minion bonuses can target minion's
    // produced by specific skills like '*shadowClone:damage': .1
    for (var tag of Object.keys(minion.tags)) newTags[tag] = true;
    for (var tag in skill.tags) {
        if (tag != 'melee' && tag != 'ranged') newTags[tag] = true;
    }
    updateTags(minion, newTags, true);
    for (var minionBonusSource of actor.minionBonusSources) {
        addBonusSourceToObject(minion, minionBonusSource, false);
    }
    addBonusSourceToObject(minion, getMinionSpeedBonus(actor, minion), true);
}

function getMinionSpeedBonus(actor, minion) {
    return {'bonuses': {'*speed': Math.max(.5, (actor.speed + 40) /  minion.speed)}};
}

skillDefinitions.clone = {
    isValid: function (actor, cloneSkill, attackStats) {
        var count = 0;
        actor.allies.forEach(function (ally) {
            if (ally.skillSource == cloneSkill) count++;
        });
        return count < cloneSkill.limit && Math.random() < cloneSkill.chance;
    },
    use: function (actor, cloneSkill, attackStats) {
        var clone = cloneActor(actor, cloneSkill);
        clone.skillSource = cloneSkill;
        clone.owner = actor;
        actor.minions.push(clone);
        clone.name = actor.name + ' shadow clone';
        clone.percentHealth = actor.percentHealth;
        clone.health = clone.percentHealth * clone.maxHealth;
        actor.allies.push(clone);
        actor.stunned = actor.time + .3;
    }
};

skillDefinitions.decoy = {
    isValid: function (actor, decoySkill, attackStats) {
        var count = 0;
        actor.allies.forEach(function (ally) {
            if (ally.skillSource == decoySkill) count++;
        });
        return count < ifdefor(decoySkill.limit, 10);
    },
    use: function (actor, decoySkill, attackStats) {
        var clone = cloneActor(actor, decoySkill);
        clone.skillSource = decoySkill;
        clone.owner = actor;
        actor.minions.push(clone);
        clone.name = actor.name + ' decoy';
        addActions(clone, abilities.explode);
        actor.allies.push(clone);
        actor.stunned = actor.time + .3;
        clone.health = Math.max(1, clone.maxHealth * actor.percentHealth);
        clone.percentHealth = clone.health / clone.maxHealth;
    }
};

skillDefinitions.explode = {
    isValid: function (actor, explodeSkill, attackStats) {
        if (attackStats.evaded) return false;
        // Cast only on death.
        return actor.health - ifdefor(attackStats.totalDamage, 0) <= 0;
    },
    use: function (actor, explodeSkill, attackStats) {
        // Shoot a projectile at every enemy.
        for (var i = 0; i < actor.enemies.length; i++) {
            performAttackProper({
                'distance': 0,
                'gravity': ifdefor(explodeSkill.gravity, ifdefor(explodeSkill.base.gravity, .8)),
                'speed': ifdefor(explodeSkill.speed, ifdefor(explodeSkill.base.speed, ifdefor(explodeSkill.range, 10) * 2.5)),
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
    shouldUse: function (actor, healSkill, target) {
        // Don't use a heal ability unless none of it will be wasted or the actor is below half life.
        return actorCanOverHeal(actor) || (target.health + healSkill.power <= target.maxHealth) || (target.health <= target.maxHealth / 2);
    },
    use: function (actor, healSkill, target) {
        target.health += healSkill.power;
        if (healSkill.area > 0) {
            for (target of getActorsInRange(target, healSkill.area, target.allies)) {
                target.health += healSkill.power;
            }
        }
        actor.stunned = actor.time + .3;
    }
};

skillDefinitions.effect = {
    shouldUse: function (actor, effectSkill, target) {
        if (closestEnemyDistance(target) >= 500) {
            return false;
        }
        if (effectSkill.allyBuff) {
            return actor.allies.length > 1;
        }
        // It would be nice to have some way to avoid using buffs too pre emptively here.
        // For example, only activate a buff if health <50% or an enemy is targeting you.
        return true;
    },
    use: function (actor, effectSkill, target) {
        if (effectSkill.buff) {
            addTimedEffect(target, effectSkill.buff);
        }
        // Ranger's Sic 'em ability buffs all allies but not the actor.
        if (effectSkill.allyBuff) {
            for (var i = 0; i < actor.allies.length; i++) {
                if (actor.allies[i] === actor) continue;
                addTimedEffect(actor.allies[i], effectSkill.allyBuff, 0);
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
        if (ifdefor(dodgeSkill.base.rangedOnly) && !attackStats.projectile) {
            return false;
        }
        return !attackStats.evaded;
    },
    use: function (actor, dodgeSkill, attackStats) {
        attackStats.dodged = true;
        if (ifdefor(dodgeSkill.distance)) {
            actor.pull = {'x': actor.x + actor.heading[0] * dodgeSkill.distance,
                        'z': actor.z + actor.heading[2] * dodgeSkill.distance,
                        'time': actor.time + ifdefor(dodgeSkill.moveDuration, .3), 'damage': 0};
        }
        if (ifdefor(dodgeSkill.buff)) {
            addTimedEffect(actor, dodgeSkill.buff, 0);
        }
        if (ifdefor(dodgeSkill.globalDebuff)) {
            actor.enemies.forEach(function (enemy) {
                addTimedEffect(enemy, dodgeSkill.globalDebuff, 0);
            });
        }
    }
};

skillDefinitions.sideStep = {
    isValid: function (actor, dodgeSkill, attackStats) {
        // side step can only dodge ranged attacked.
        if (ifdefor(dodgeSkill.base.rangedOnly) && !attackStats.projectile ) {
            return false;
        }
        // Cannot side step if attacker is on top of you.
        if (getDistance(actor, attackStats.source) <= 0) {
            return false;
        }
        return !attackStats.evaded;
    },
    use: function (actor, dodgeSkill, attackStats) {
        attackStats.dodged = true;
        if (ifdefor(dodgeSkill.distance)) {
            var attacker = attackStats.source;
            actor.pull = {'time': actor.time + ifdefor(dodgeSkill.moveDuration, .3), 'damage': 0};
            if (attacker.x > actor.x) actor.pull.x = Math.min(actor.x + actor.heading[0] * dodgeSkill.distance, attacker.x - (attacker.width + actor.width) / 2);
            else actor.pull.x = Math.max(actor.x + actor.heading[0] * dodgeSkill.distance, attacker.x + (attacker.width + actor.width) / 2);
            if (attacker.z > actor.z) actor.pull.z = Math.min(actor.z + actor.heading[2] * dodgeSkill.distance, attacker.z - (attacker.width + actor.width) / 2);
            else actor.pull.z = Math.max(actor.z + actor.heading[2] * dodgeSkill.distance, attacker.z + (attacker.width + actor.width) / 2);
        }
        if (ifdefor(dodgeSkill.buff)) {
            addTimedEffect(actor, dodgeSkill.buff, 0);
        }
        if (ifdefor(dodgeSkill.globalDebuff)) {
            actor.enemies.forEach(function (enemy) {
                addTimedEffect(enemy, dodgeSkill.globalDebuff, 0);
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
            actor.pull = {'x': actor.x + actor.heading[0] * ifdefor(counterSkill.distance, 64),
                        'z': actor.z + actor.heading[2] * ifdefor(counterSkill.distance, 64),
                        'time': actor.time + ifdefor(counterSkill.moveDuration, .3), 'damage': 0};
        }
        if (ifdefor(counterSkill.buff)) {
            addTimedEffect(actor, counterSkill.buff, 0);
        }
        if (ifdefor(counterSkill.globalDebuff)) {
            actor.enemies.forEach(function (enemy) {
                addTimedEffect(enemy, counterSkill.globalDebuff, 0);
            });
        }
    }
};

skillDefinitions.counterAttack = {
    isValid: function (actor, counterAttackSkill, attackStats) {
        if (attackStats.evaded) {
            //console.log("Attack was evaded.");
            return false;
        }
        var distance = getDistance(actor, attackStats.source);
        // Can only counter attack if the target is in range, and
        if (distance > counterAttackSkill.range * 32 + 4) { // Give the range a tiny bit of lee way
            //console.log("Attacker is too far away: " + [distance, counterAttackSkill.range]);
            return false;
        }
        // The chance to counter attack is reduced by a factor of the distance.
        if (Math.random() > Math.min(1, 128 / (distance + 64))) {
            //console.log("Failed distance roll against: " + [distance, Math.min(1, 128 / (distance + 64))]);
            return false;
        }
        return true;
    },
    use: function (actor, counterAttackSkill, attackStats) {
        if (counterAttackSkill.dodge) {
            attackStats.dodged = true;
        }
        performAttack(actor, counterAttackSkill, attackStats.source);
    }
};
skillDefinitions.deflect = {
    isValid: function (actor, deflectSkill, attackStats) {
        if (attackStats.evaded) return false;
        // Only non-spell, projectile attacks can be deflected.
        return attackStats.projectile && !attackStats.attack.tags['spell'];
    },
    use: function (actor, deflectSkill, attackStats) {
        var projectile = attackStats.projectile;
        // mark the projectile as having not hit so it can hit again now that it
        // has been deflected.
        projectile.hit = false;
        projectile.target = attackStats.source;
        attackStats.source = actor;
        // Make the deflected projectiles extra accurate so they have greater impact
        attackStats.accuracy += deflectSkill.accuracy;
        attackStats.damage *= deflectSkill.damageRatio;
        attackStats.magicDamage *= deflectSkill.damageRatio;
        projectile.vx = -projectile.vx;
        projectile.vy = -getDistance(actor, projectile.target) / 200;
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
        return !attackStats.attack.tags['basic'];
    },
    use: function (actor, counterAttackSkill, attackStats) {
        performAttack(actor, attackStats.attack, attackStats.source);
    }
};

skillDefinitions.reflect = {
    isValid: function (actor, plunderSkill, target) {
        return ifdefor(actor.reflectBarrier, 0) < actor.maxHealth;
    },
    shouldUse: function (actor, reflectSkill, target) {
        // Only use reflection if it is at least 60% effective
        var currentBarrier = Math.max(0, ifdefor(actor.reflectBarrier, 0));
        var maxPossibleGain = Math.min(reflectSkill.power, actor.maxHealth);
        var actualGain = Math.min(reflectSkill.power, actor.maxHealth - currentBarrier);
        return actualGain / maxPossibleGain >= .6;
    },
    use: function (actor, reflectSkill, target) {
        // Reset reflection barrier back to 0 when using the reflection barrier spell.
        // It may be negative from when it was broken.
        actor.reflectBarrier = Math.max(0, ifdefor(actor.reflectBarrier, 0));
        gainReflectionBarrier(target, reflectSkill.power);
    }
};

function gainReflectionBarrier(actor, amount) {
    actor.maxReflectBarrier = actor.maxHealth;
    actor.reflectBarrier = Math.min(actor.maxReflectBarrier, ifdefor(actor.reflectBarrier, 0) + amount);
}

skillDefinitions.plunder = {
    isValid: function (actor, plunderSkill, target) {
        return ifdefor(target.prefixes, []).length + ifdefor(target.suffixes, []).length;
    },
    use: function (actor, plunderSkill, target) {
        stealAffixes(actor, target, plunderSkill);
    }
};
function stealAffixes(actor, target, skill) {
    if (!ifdefor(skill.count)) {
        return;
    }
    var allAffixes = target.prefixes.concat(target.suffixes);
    if (!allAffixes.length) return;
    var originalBonus = (allAffixes.length > 2) ? imbuedMonsterBonuses : enchantedMonsterBonuses;
    for (var i = 0; i < skill.count && allAffixes.length; i++) {
        var affix = Random.element(allAffixes);
        if (target.prefixes.indexOf(affix) >= 0) target.prefixes.splice(target.prefixes.indexOf(affix), 1);
        if (target.suffixes.indexOf(affix) >= 0) target.suffixes.splice(target.suffixes.indexOf(affix), 1);
        var effect = {
            'bonuses': affix.bonuses,
            'duration': skill.duration
        };
        addTimedEffect(actor, effect, 0);
        allAffixes = target.prefixes.concat(target.suffixes);
        removeBonusSourceFromObject(target, affix);
    }
    if (allAffixes.length >= 2) {
        // Do nothing, monster is still imbued
    } else if (allAffixes.length > 0 && originalBonus !== enchantedMonsterBonuses) {
        removeBonusSourceFromObject(target, originalBonus);
        addBonusSourceToObject(target, enchantedMonsterBonuses);
    } else if (allAffixes.length === 0) {
        removeBonusSourceFromObject(target, originalBonus);
    }
    recomputeDirtyStats(target);
}

skillDefinitions.banish = {
    use: function (actor, banishSkill, target) {
        var attackStats = performAttack(actor, banishSkill, target);
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
                banishTarget(actor, enemy, banishSkill.distance, ifdefor(banishSkill.knockbackRotation, 30));
                // The shockwave upgrade applies the same damage to the targets hit by the shockwave.
                if (banishSkill.shockwave) {
                    enemy.pull.attackStats = attackStats;
                }
                if (ifdefor(banishSkill.otherDebuff)) {
                    addTimedEffect(enemy, banishSkill.otherDebuff, 0);
                }
            }
        });
    }
};
function banishTarget(actor, target, range, rotation) {
    // Adding the delay here creates a shockwave effect where the enemies
    // all get pushed from a certain point at the same time, rather than
    // them all immediately moving towards the point initially.
    var dx = target.x - actor.x;
    var dz = target.z - actor.z;
    var mag = Math.sqrt(dx * dx + dz * dz);
    target.pull = {
        'x': actor.x + actor.width / 2 + 32 * range * dx / mag,
        'z': actor.z + actor.width / 2 + 32 * range * dz / mag,
        'delay': target.time + getDistance(actor, target) * .02 / 32,
        'time': target.time + range * .02, 'damage': 0
    };
    target.rotation = getXDirection(actor) * rotation;
}

function getXDirection(actor) {
    return ((actor.heading[0] > 0) ? 1 : -1);
}

skillDefinitions.charm = {
    isValid: function (actor, charmSkill, target) {
        return !(target.uncontrollable || target.stationary);
    },
    use: function (actor, charmSkill, target) {
        target.allies = actor.allies;
        target.enemies = actor.enemies;
        addBonusSourceToObject(target, getMinionSpeedBonus(actor, target), true);
        actor.enemies.splice(actor.enemies.indexOf(target), 1);
        actor.allies.push(target);
        target.heading = actor.heading.slice();
        actor.stunned = actor.time + 1;
    }
};
skillDefinitions.charge = {
    shouldUse: function (actor, chargeSkill, target) {
        return getDistance(actor, target) >= 128;
    },
    use: function (actor, chargeSkill, target) {
        actor.chargeEffect = {
            'chargeSkill': chargeSkill,
            'distance': 0,
            'target': target,
        };
    }
};