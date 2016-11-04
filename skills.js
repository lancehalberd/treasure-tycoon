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
    // Generic actions:
    'deflect': genericAction('deflect', {}, {'+attackPower': [.5, '+', ['{strength}', '/', 100]], '+cooldown': ['20', '*', [100, '/', [100, '+', '{dexterity}']]], '+chance': 1},
                             'Deflect ranged attacks back at enemies.'),
    'plunder': genericAction('plunder', {}, {'+range': 2, '+count': 1, '+duration': ['{strength}', '/', 10], '+cooldown': ['40', '*', [100, '/', [100, '+', '{dexterity}']]]},
                             'Steal an enemies enchantment for yourself.'),
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
                'If an attack would deal more than half of your remaining life, prevent it and cast an enchantment that grants you: {$buff}')
};
