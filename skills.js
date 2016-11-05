function genericAction(type, action, bonuses, helpText) {
    action.type = type;
    action.variableObjectType = 'action';
    action.bonuses = bonuses;
    action.helpText = helpText;
    action.tags = ifdefor(action.tags, []);
    action.tags.unshift(type);
    return action;
}

function movementAction(type, action, bonuses, helpText) {
    action.type = type;
    action.variableObjectType = 'action';
    action.bonuses = bonuses;
    action.helpText = helpText;
    action.tags = ifdefor(action.tags, []);
    action.tags.unshift('movement');
    action.tags.unshift(type);
    return action;
}

function attackAction(type, action, bonuses, helpText) {
    action.type = type;
    action.variableObjectType = 'action';
    // Range of an attack action is the weaponRange unless otherwise specified.
    if (typeof(bonuses['+range']) === 'undefined') {
        bonuses['+range'] = ['{weaponRange}'];
    }
    action.bonuses = bonuses;
    action.helpText = helpText;
    action.tags = ifdefor(action.tags, []);
    action.tags.unshift('attack');
    action.tags.unshift(type);
    return action;
}

function spellAction(type, action, bonuses, helpText) {
    action.type = type;
    action.variableObjectType = 'action';
    if (typeof(bonuses['+power']) === 'undefined') {
        bonuses['+power'] = ['{magicPower}'];
    }
    action.bonuses = bonuses;
    action.helpText = helpText;
    action.tags = ifdefor(action.tags, []);
    action.tags.unshift('spell');
    action.tags.unshift(type);
    return action;
}

function buffEffect(effect, bonuses) {
    effect.variableObjectType = 'effect';
    effect.tags = ifdefor(effect.tags, []);
    effect.tags.unshift('buff');
    effect.bonuses = bonuses;
    return effect;
}
function debuffEffect(effect, bonuses) {
    effect.variableObjectType = 'effect';
    effect.tags = ifdefor(effect.tags, []);
    effect.tags.unshift('debuff');
    effect.bonuses = bonuses;
    return effect;
}

var skills = {
    // Movement actions
    'dodge': movementAction('dodge', {}, {'+cooldown': 10, '+distance': -128, '$buff': buffEffect({}, {'%evasion': .5, '+duration': 5})},
                            'Leap back to dodge an attack and gain: {$buff}'),

    // Attack actions
    'basicAttack': attackAction('attack', {'tags': ['basic']}, {}, 'A basic attack'),
    'bullseye': attackAction('attack', {}, {'*damage': 2, '+cooldown': 15, '$alwaysHits': 'Never misses', '$undodgeable': 'Cannot be dodged'}),
    'counterAttack': attackAction('counterAttack', {}, {'*damage': 1.5, '+chance': .1},
                            'Perform a powerful counter attack.<br/>The chance to counter is lower the further away the attacker is.'),
    'dragonPunch': attackAction('attack', {'restrictions': ['fist']},
                              {'*damage': 3, '+cooldown': 30, '$alwaysHits': 'Never misses', '$undodgeable': 'Cannot be dodged',
                                        '+distance': 256, '$domino': 'Knocks target away possibly damaging other enemies.'}),
    'hook':  attackAction('attack', {}, {'+cooldown': 10, '+range': 10, '+dragDamage': 0, '+dragStun': 0, '+rangeDamage': 0, '$alwaysHits': 'Never misses', '$pullsTarget': 'Pulls target'},
                            'Throw a hook to damage and pull enemies closer.'),
    'banishingStrike': attackAction('banish', {'restrictions': ['melee']}, {'+cooldown': 30, '+attackPower': 2, '+distance': [6, '+', ['{strength}' , '/', 20]],
                '$alwaysHits': 'Never misses', '+purify': 0, '+shockwave': 0,
                '$debuff': debuffEffect({}, {'*damage': .5, '*magicDamage': .5, '+duration': ['{intelligence}', '/', 20]}),
                '$otherDebuff': debuffEffect({}, {'*speed': .1, '+duration': ['{intelligence}', '/', 20]})},
                'Perform a mighty strike that inflicts the enemy with: {$debuff} And knocks all other enemies away, slowing them.'),
    'evadeAndCounter': attackAction('evadeAndCounter', {}, {'$alwaysHits': 'Never misses', '+range': 1}, 'Counter whenever you successfully evade an attack.'),
    'charge': attackAction('charge', {'tags': ['movement']}, {'+range': 15, '*damage': 2, '+cooldown': 30, '+speedBonus': 3, '+stun': .5,
                                            '+rangeDamage': 0, '$alwaysHits': 'Never misses'},
                                        'Charge at enemies, damaging and stunning them briefly on impact.'),
    'armorBreak': attackAction('attack', {'restrictions': ['melee']}, {'*damage': 3, '+cooldown': 30, '+stun': .5, '$alwaysHits': 'Never misses',
                                            '$debuff': debuffEffect({}, {'-armor': ['{strength}', '/', 2], '-block': ['{strength}', '/', 2]})},
                                            'Deliver a might blow that destroys the targets armor causing: {$debuff}'),
    'blinkStrike': attackAction('attack', {'restrictions': ['melee'], 'tags': ['movement']}, {'*damage': 1.5, '+cooldown': 6, '$alwaysHits': 'Never misses', '+teleport': 6},
                                'Instantly teleport to and attack a nearby enemy.'),
    'soulStrike': attackAction('attack', {'restrictions': ['melee']}, {'+range': 2, '*damage': 2, '+cooldown': 15,
                               '$alwaysHits': 'Never misses', '+healthSacrifice': .2, '+cleave': 1},
                    'Sacrifice a portion of your current health to deal a cleaving attack that hits all enemies in an extended range.'),
    // Generic actions:
    'deflect': genericAction('deflect', {}, {'+attackPower': [.5, '+', ['{strength}', '/', 100]], '+cooldown': ['20', '*', [100, '/', [100, '+', '{dexterity}']]], '+chance': 1},
                             'Deflect ranged attacks back at enemies.'),
    'plunder': genericAction('plunder', {}, {'+range': 2, '+count': 1, '+duration': ['{strength}', '/', 10], '+cooldown': ['40', '*', [100, '/', [100, '+', '{dexterity}']]]},
                             'Steal an enemies enchantment for yourself.'),
    'distract': genericAction('dodge', {}, {'$globalDebuff': debuffEffect({}, {'*accuracy': .5, '+duration': 2}), '+cooldown': 10},
                              'Dodge an attack with a distracting flourish that inflicts: {globalDebuff} on all enemies.'),
    'charm': genericAction('charm', {'tags': ['minion']}, {'+range': 1, '+cooldown': ['240', '*', [100, '/', [100, '+', '{intelligence}']]]},
                           'Steal an enemies heart, turning them into an ally.'),
    'pet': genericAction('minion', {'target': 'none', 'tags': ['minion'], 'monsterKey': 'wolf'}, {'+limit': 1, '+cooldown': 30},
                         'Call up to 1 pet to fight with you.'),
    'summonCaterpillar': genericAction('minion', {'target': 'none', 'tags': ['minion'], 'monsterKey': 'caterpillar'}, {'+limit': 3, '+cooldown': 20},
                         'Call up to 1 pet to fight with you.'),
    'summonSkeleton': genericAction('minion', {'target': 'none', 'tags': ['minion'], 'monsterKey': 'skeleton'}, {'+limit': 2, '+cooldown': 15},
                         'Call up to 1 pet to fight with you.'),
    'net': genericAction('effect', {}, {'+cooldown': 10, '+range': 10, '$debuff': debuffEffect({}, {'*speed': 0, '+duration': 3})},
                         'Throw a net to ensnare a distant enemy.'),
    'sicem': genericAction('effect', {}, {'+cooldown': [60, '*', [100, '/', [100, '+', '{dexterity}']]],
                            '+range': 10, '$allyBuff': {'bonuses': {'*speed': 2, '*attackSpeed': 2, '*damage': 2, '+duration': 2}}},
                            'Incite your allies to fiercely attack the enemy granting them: {allyBuff}'),
    'consume': genericAction('consume', {'target': 'enemies', 'targetDeadUnits': true, 'consumeCorpse': true},
                             {'+consumeRatio': .2, '+range': 5, '+count': 0, '+duration': 0},
                             'Consume the spirits of nearby defeated enemies to regenerate your health.'),
    // Song buffs should be based on the singer's stats, not the stats of the targets. Not sure if this is the case or not.
    'attackSong': genericAction('song', {'tags': ['song', 'field'], 'target': 'allies', 'color': 'orange', 'alpha': .2},
                                {'+area': 8, '+cooldown': 30, '+duration': 10, '$buff': buffEffect({}, {
                                    '%attackSpeed': [.2, '+', ['{dexterity}', '/', 1000]],
                                    '%accuracy': [.2, '+', ['{intelligence}', '/', 1000]],
                                    '%damage': [.2, '+', ['{strength}', '/', 1000]]})},
            'Play a tune that inspires you and your allies to attack more fiercely, granting all allies in range: {buff}'),
    'defenseSong': genericAction('song', {'tags': ['song', 'field'], 'target': 'allies', 'color': 'purple', 'alpha': .2},
                                 {'+area': 10, '+cooldown': 45, '+duration': 20, '$buff': buffEffect({}, {
                                    '%evasion': [.2, '+', ['{dexterity}', '/', 1000]],
                                    '%block': [.2, '+', ['{intelligence}', '/', 1000]],
                                    '%maxHealth': [.2, '+', ['{strength}', '/', 1000]]})},
            'Play an uplifting rondo that steels you and your allies defenses for battle, granting all allies in range: {buff}'),
    'heroSong': genericAction('heroSong', {'tags': ['song', 'field'], 'target': 'allies', 'color': 'gold', 'alpha': .2},
                              {'+area': 8, '+cooldown':  ['300', '*', [100, '/', [100, '+', '{intelligence}']]],
                               '+duration': [2, '+', ['{dexterity}' , '/', '200']], '$buff': buffEffect({}, {
                                    '$invulnerable': 'Invulnerability',
                                    '+healthRegen': ['{intelligence}', '/', 10],
                                    '%critChance': ['{dexterity}', '/', 500]})},
            'Play a ballade to inspire heroic feats granting all allies in range: {buff}'),
    // Spell actions
    'heal': spellAction('heal', {'target': 'allies'}, {'+cooldown': 10}, 'Cast a spell to restore {+power} health.'),
    'reflect': spellAction('reflect', {'target': 'allies'}, {'+cooldown': 20},
            'Create a magical barrier that will reflect projectile attacks until it breaks after taking {+power} damage. Further casting strengthens the barrier.'),
    'revive': spellAction('revive', {}, {'+cooldown': 120},
            'Upon receiving a lethal blow, cast a spell that brings you back to life with {+power} health.'),
    'protect': spellAction('effect', {'target': 'allies'}, {'+cooldown': 30, '$buff': buffEffect({}, {'+armor': ['{intelligence}'], '+duration': 20})},
                           'Create a magic barrier that grants: {$buff}'),
    'aegis': spellAction('criticalCounter', {}, {'+cooldown': 60, '+stopAttack': 1,
                '$buff': buffEffect({}, {'$maxBlock': 'Block checks are always perfect', '$maxMagicBlock': 'Magic Block checks are always perfect', '+duration': 5})},
                'If an attack would deal more than half of your remaining life, prevent it and cast an enchantment that grants you: {$buff}'),
    'fireball': spellAction('spell', {'tags': ['ranged'], 'animation': 'fireball', 'size': 32, 'color': 'red'},
                                    {'+range': 12, '+cooldown': 8, '$alwaysHits': 'Never misses', '+explode': 1, '+area': 3, '+areaCoefficient': .5},
                            'Conjure an explosive fireball to hurl at enemies dealing {power} damage.'),
    'freeze': spellAction('spell', {'tags': ['nova'], 'height': 20, 'color': 'white', 'alpha': .7},
                                    {'+power': ['{magicPower}', '/', 2], '+area': [4, '+', ['{magicPower}', '/', '50']],
                                    '+areaCoefficient': 1, '+cooldown': 10, '$alwaysHits': 'Never misses', '+slowOnHit': 1},
                'Emit a blast of icy air that deals {power} damage and slows enemies. The effect is less the further away the enemy is.'),
    'storm': spellAction('spell', {'tags': ['field'], 'height': 40, 'color': 'yellow', 'alpha': .2},
                         {'+hitsPerSecond': 2, '+duration': 5, '+power': ['{magicPower}', '/', 4],
                         '+area': [5, '+', ['{magicPower}', '/', '50']], '+cooldown': 20, '$alwaysHits': 'Never misses'},
                'Create a cloud of static electricity that randomly deals magic damage to nearby enemies.')
};
