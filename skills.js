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
        bonuses['+range'] = '{weaponRange}';
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

var skills = {
    // Movement actions
    'dodge': movementAction('dodge', {}, {'+cooldown': 10, '+distance': -128, '$buff': buffEffect({}, {'%evasion': .5, '+duration': 5})},
                            'Leap back to dodge an attack and gain: {buff}'),

    // Attack actions
    'basicAttack': attackAction('attack', {'tags': ['basic']}, {}, 'A basic attack'),
    'bullseye': attackAction('attack', {}, {'*damage': 2, '+cooldown': 15, '$alwaysHits': 'Never misses', '$undodgeable': 'Cannot be dodged'}),
    'counterAttack': attackAction('counterAttack', {}, {'*damage': 1.5, '+chance': .1},
                            'Perform a powerful counter attack.<br/>The chance to counter is lower the further away the attacker is.'),
    'dragonPunch': attackAction('attack', {'restrictions': ['fist']},
                              {'*damage': 3, '+cooldown': 30, '$alwaysHits': 'Never misses', '$undodgeable': 'Cannot be dodged',
                                        '+distance': 256, '$domino': 'Knocks target away possibly damaging other enemies.'}),
    // Spell actions
    'heal': spellAction('heal', {'target': 'allies'}, {'+cooldown': 10}, 'Cast a spell to restore {power} health.'),
    'reflect': spellAction('reflect', {'target': 'self'}, {'+cooldown': 20},
            'Create a magical barrier that will reflect projectile attacks until it breaks after taking {power} damage. Further casting strengthens the barrier.'),
    'revive': spellAction('revive', {}, {'+cooldown': 120},
            'Upon receiving a lethal blow, cast a spell that brings you back to life with {power} health.')
};
