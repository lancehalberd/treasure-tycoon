var abilities = {
    // Tier 1 classes
    // Juggler
    // how to make chaining apply to basic attack but not double up *throwing:attackSpeed, etc.
    'juggler': {'name': 'Juggling', 'bonuses': {'$throwing:skill:chaining': 'Projectiles ricochet between targets until they miss.'}},
    'minorDexterity': {'name': 'Minor Dexterity', 'bonuses': {'+dexterity': 5}},
    'throwingPower': {'name': 'Throwing Power', 'bonuses': {'*throwing:damage': 1.4, '+throwing:range': 2}},
    'throwingMastery': {'name': 'Throwing Mastery', 'bonuses': {'*throwing:attackSpeed': 1.5}},
    'sap': {'name': 'Sap', 'bonuses': {'+slowOnHit': .1, '+healthGainOnHit': 1}},
    'dodge': {'name': 'Dodge', 'bonuses': {'+evasion': 2}, 'reaction':
             {'type': 'dodge', 'stats': {'cooldown': 10, 'distance': -128, 'buff': {'stats': {'%evasion': .5, 'duration': 5}}}, 'helpText': 'Leap back to dodge an attack and gain: {buff}'}},
    'acrobatics': {'name': 'Acrobatics', 'bonuses': {'+evasion': 2, '+dodge:skill:cooldown': -2, '*dodge:skill:distance': 2}},
    'bullseye': {'name': 'Bullseye', 'action': {'type': 'attack', 'stats': {'cooldown': 15, 'alwaysHits': true, 'undodgeable': true}}},
    'bullseyeCritical': {'name': 'Dead On', 'bonuses': {'+bullseye:skill:critChance': 1}, 'helpText': 'Bullseye always strikes critically.'},
    // Black Belt
    'blackbelt': {'name': 'Martial Arts', 'bonuses': {'*unarmed:damage': 3, '*unarmed:attackSpeed': 1.5,
                                                        '+unarmed:critChance': .15, '*unarmed:critDamage': 2, '*unarmed:critAccuracy': 2}},
    'fistMastery': {'name': 'Fist Mastery', 'bonuses': {'*fist:damage': 1.5}},
    'minorStrength': {'name': 'Minor Strength', 'bonuses': {'+strength': 5}},
    'vitality': {'name': 'Vitality', 'bonuses': {'+healthRegen': ['{strength}', '/', 10], '+strength': 5}},
    'counterAttack': {'name': 'Counter Attack', 'bonuses': {'+strength': 5}, 'reaction':
            {'type': 'counterAttack', 'stats': {'attackPower': 1.5, 'chance': .1}, 'helpText': 'Perform a powerful counter attack.<br/>The chance to counter is lower the further away the attacker is.'}},
    'counterPower': {'name': 'Improved Counter', 'bonuses': {'+strength': 5, '+counterAttack:skill:attackPower': .5, '*counterAttack:skill:accuracy': 1.5}},
    'counterChance': {'name': 'Heightened Reflexes', 'bonuses': {'+dexterity': 5, '+counterAttack:skill:chance': .1}},
    // Priest
    'priest': {'name': 'Divine Blessing', 'bonuses': {'*heal:amount': 2, '*healthRegen': 2, '*healthGainOnHit': 2}},
    'minorIntelligence': {'name': 'Minor Intelligence', 'bonuses': {'+intelligence': 5}},
    'heal': {'name': 'Heal', 'bonuses': {'+intelligence': 5}, 'action':
            {'type': 'heal', 'tags': ['spell'], 'stats': {'amount': ['{intelligence}'], 'cooldown': 10}, 'helpText': 'Cast a spell to restore {amount} health.'}},
    //'reflect': {'name': 'Reflect Magic', 'bonuses': {'+intelligence': 10}, 'attacks': [
    //        {'type': 'reflect', 'tags': ['spell'], 'stats': {'amount': ['{intelligence}', '*', 10], 'cooldown': 20},
    //        'helpText': 'Create a magical barrier that will reflect spell damage until it breaks after taking {amount} damage. Further casting strengthens the barrier.'}]},
    'revive': {'name': 'Revive', 'bonuses': {'+intelligence': 10}, 'reaction':
            {'type': 'revive', 'tags': ['spell'], 'stats': {'amount': ['{intelligence}'], 'cooldown': 120},
            'helpText': 'Upon receiving a lethal blow, cast a spell that brings you back to life with {amount} health.'}},
    'reviveInstantCooldown': {'name': 'Miracle', 'bonuses': {'$revive:skill:instantCooldown': 'Reset cooldowns of other abilities'}},
    'reviveInvulnerability': {'name': 'Halo', 'bonuses': {'$revive:skill:buff': {'duration': 2, '$invulnerable': 'Invulnerability'}}},
    // Tier 2 classes
    // Corsair
    'hook': {'name': 'Grappling Hook', 'action': {'type': 'attack',
                    'stats': {'cooldown': 10, 'range': 10, 'dragDamage': 0, 'dragStun': 0, 'rangeDamage': 0, 'alwaysHits': true, 'pullsTarget': true},
                    'helpText': 'Throw a hook to damage and pull enemies closer.'}},
    'hookRange': {'name': 'Long Shot', 'bonuses': {'+hook:skill:range': 5, '+hook:skill:cooldown': -3}},
    'hookDrag': {'name': 'Barbed Wire', 'bonuses': {'+hook:skill:dragDamage': .1}},
    'hookStun': {'name': 'Tazer Wire', 'bonuses': {'+hook:skill:dragStun': .1}},
    'hookPower': {'name': 'Power Shot', 'bonuses': {'+hook:skill:rangeDamage': .1}},
    'deflect': {'name': 'Deflect', 'bonuses': {'+dexterity': 5, '+strength': 5}, 'reaction':
            {'type': 'deflect', 'stats': {'attackPower': [.5, '+', ['{strength}', '/', 100]], 'cooldown': ['20', '*', [100, '/', [100, '+', '{dexterity}']]], 'chance': 1}, 'helpText': 'Deflect ranged attacks back at enemies.'}},
    // Paladin
    'protect': {'name': 'Protect', 'bonuses': {'+intelligence': 5}, 'action':
            {'type': 'buff', 'stats': {'cooldown': 30, 'buff': {'stats': {'+armor': ['{intelligence}'], 'duration': 20}}}, 'helpText': 'Create a magic barrier that grants: {buff}'}},
    // Dancer
    'dancer': {'name': 'Dancing', 'bonuses': {'+evasion': 3}, 'reaction':
            {'type': 'evadeAndCounter', 'stats': {'alwaysHits': true, 'range': 1}, 'helpText': 'Counter whenever you successfully evade an attack.'}},
    'distract': {'name': 'Distract', 'bonuses': {'+evasion': 3}, 'reaction':
            {'type': 'dodge', 'stats': {'globalDebuff': {'stats': {'*accuracy': .5, 'duration': 2}}, 'cooldown': 10}, 'helpText': 'Dodge an attack with a distracting flourish that inflicts: {globalDebuff} on all enemies.'}},
    // Tier 3 classes
    // Ranger
    'ranger': {'name': 'Taming', 'bonuses': {'*minion:healthBonus': 2, '*minion:attackSpeedBonus': 1.5, '*minion:speedBonus': 1.5}},
    'finesse':  {'name': 'Finesse', 'bonuses': {'%attackSpeed': .2}},
    'pet': {'name': 'Pet', 'action':
            {'type': 'minion', 'tags': ['pet'], 'monsterKey': 'caterpillar', 'stats': {'limit': 1, 'cooldown': 30, 'healthBonus': 1, 'damageBonus': 1, 'attackSpeedBonus': 1, 'speedBonus': 1.5},
            'helpText': 'Call up to 1 pet to fight with you.'}},
    //'petFood': {'name': 'Pet Food', 'bonuses': {'+pet:skill:cooldown': -3, '+pet:skill:healthBonus': 1}, 'helpText': 'Pet has 50% more health and can be called more frequently.'},
    //'petTraining': {'name': 'Pet Training', 'next': ['whistle'], 'bonuses': {'+pet:skill:cooldown': -3, '+pet:skill:damageBonus': .5}, 'helpText': 'Pet deals 50% more damage and can be called more frequently.'},
    //'whistle': {'name': 'Whistle', 'bonuses': {'+pet:skill:cooldown': -10}, 'helpText': 'Greatly reduces the cooldown for calling your pet.'},
    // Warrior
    'ferocity': {'name': 'Ferocity', 'bonuses': {'%damage': .2}},
    // Wizard
    'resonance': {'name': 'Resonance', 'bonuses': {'%magicDamage': .2}},
    // Tier 4 classes
    // Assassin
    // Dark Knight
    // Bard
    // Tier 5 classes
    // Sniper
    //'sniper': {'name': 'Sharp Shooter', 'bonuses': {'*bow:critChance': 1.5, '*bow:critMultiplier': 1.5, '$bow:criticalPiercing': 'Critical strikes hit multiple enemies.'}},
    'majorDexterity': {'name': 'Major Dexterity', 'bonuses': {'+dexterity': 20}},
    // Samurai
    'majorStrength': {'name': 'Major Strength', 'bonuses': {'+strength': 20}},
    'sideStep': {'name': 'Side Step', 'bonuses': {'+evasion': 2}, 'reaction':
             {'type': 'dodge', 'stats': {'cooldown': 10, 'rangedOnly': true, 'moveDuration': .05, 'distance': 64, 'buff': {'stats': {'+critChance': .2, 'duration': 2}}}, 'helpText': 'Side step a ranged attack and advance toward enemis gaining: {buff}'}},
    // Sorcerer
    'majorIntelligence': {'name': 'Major Intelligence', 'bonuses': {'+intelligence': 20}},
    'raiseDead': {'name': 'Raise Dead', 'action':
            {'type': 'minion', 'tags': ['spell', 'skeleton'], 'monsterKey': 'skeleton', 'stats': {'limit': 1, 'cooldown': 10, 'healthBonus': .5, 'damageBonus': 1, 'attackSpeedBonus': 1, 'speedBonus': 1},
            'helpText': 'Raise a skeleton to fight for you.'}},
    // Tier 6 classes
    // Ninja
    'ninja': {'name': 'Ninjutsu', 'bonuses':{'$cloaking': 'Invisible while moving', '$oneHanded:skill:doubleStrike': 'Attacks hit twice'}},
    'shadowClone': {'name': 'Shadow Clone', 'reaction':
            {'type': 'clone',  'tags': ['minion'], 'stats': {'limit': 10, 'chance': .1, 'healthBonus': .1, 'damageBonus': .1, 'speedBonus': 1.2},
            'helpText': 'Chance to summon a weak clone of yourself on taking damage'}},
    // Enhancer
    // Sage
    'stopTime': {'name': 'Stop Time', 'bonuses': {'+intelligence': 10}, 'reaction':
            {'type': 'stop', 'tags': ['spell'], 'stats': {'duration': ['{intelligence}' , '/', '50'], 'cooldown': 120},
            'helpText': 'If you would receiving a lethal blow, cast a spell that stops time for everyone else.'}},
    // Tier 7 classes
    // Master
    // Fool
    'tomFoolery': {'name': 'Tom Foolery', 'bonuses': {'+evasion': 5}, 'reaction':
             {'type': 'dodge', 'stats': {'cooldown': 30, 'buff': {'stats': {'*accuracy': 0, '$maxEvasion': 'Evasion checks are always perfect', 'duration': 5}}}, 'helpText': 'Dodge an attack and gain: {buff}'}},
    // Monster abilities
    'summoner': {'bonuses': {'*minion:skill:limit': 2, '*minion:skill:cooldown': .5, '*minion:skill:healthBonus': 2, '*minion:skill:damageBonus': 2}}
};
var testAbilities = [];
$.each(abilities, function (key, ability) {
    ability.key = key;
    if (ability.action) {
        ability.action.name = ability.name;
        ability.action.key = key;
    }
    if (ability.reaction) {
        ability.reaction.name = ability.name;
        ability.reaction.key = key;
    }
});
var specialTraits = {};
function findSpecialTraits(object) {
    $.each(object, function (key, value) {
        if (typeof(key) === 'string' && key.indexOf('$') >= 0) specialTraits[key.substring(1).split(':').pop()] = true;
        if (typeof(value) === 'object') findSpecialTraits(value);
    })
}
findSpecialTraits(abilities);

function abilityHelpText(ability, character) {
    var sections = [ability.name, ''];
    if (ifdefor(ability.helpText)) {
        sections.push(ability.helpText.replace(/\{(\w+)\}/, function (match, key) {
            return evaluateForDisplay(ability.bonuses[key], character.adventurer);
        }));
        sections.push('');
    }
    var helpText = bonusHelpText(ifdefor(ability.bonuses, {}), false, character.adventurer);
    if (helpText) {
        sections.push(helpText);
        sections.push('');
    }
    var action = ifdefor(ability.action, ability.reaction);
    if (action) {
        var actionSections = [];
        if (ifdefor(action.helpText)) {
            actionSections.push(action.helpText.replace(/\{(\w+)\}/, function (match, key) {
                return evaluateForDisplay(action.stats[key], character.adventurer);
            }));
        }
        if (ifdefor(action.stats.alwaysHits)) {
            actionSections.push('Never misses');
        }
        if (ifdefor(action.stats.undodgeable)) {
            actionSections.push('Cannot be dodged');
        }
        if (ifdefor(action.monsterKey)) {
            actionSections.push('Summons a ' + monsters[action.monsterKey].name);
        }
        if (ifdefor(action.stats.healthBonus, 1) !== 1) {
            actionSections.push(evaluateForDisplay(action.stats.healthBonus, character.adventurer).format(1) + 'x health');
        }
        if (ifdefor(action.stats.damageBonus, 1) !== 1) {
            actionSections.push(evaluateForDisplay(action.stats.damageBonus, character.adventurer).format(1) + 'x damage');
        }
        if (ifdefor(action.stats.attackSpeedBonus, 1) !== 1) {
            actionSections.push(evaluateForDisplay(action.stats.attackSpeedBonus, character.adventurer).format(1) + 'x attack speed');
        }
        if (ifdefor(action.stats.speedBonus, 1) !== 1) {
            actionSections.push(evaluateForDisplay(action.stats.speedBonus, character.adventurer).format(1) + 'x movement speed');
        }
        if (ifdefor(action.stats.attackPower)) {
            actionSections.push(evaluateForDisplay(action.stats.attackPower, character.adventurer).format(2) + 'x power');
        }
        if (ifdefor(action.stats.range)) {
            actionSections.push('Range ' + evaluateForDisplay(action.stats.range, character.adventurer).format(1));
        }
        if (ifdefor(action.stats.chance)) {
            actionSections.push(evaluateForDisplay(action.stats.chance, character.adventurer).percent() + ' chance');
        }
        if (ifdefor(action.stats.duration)) {
            actionSections.push('lasts ' + evaluateForDisplay(action.stats.duration, character.adventurer).format(1) + ' seconds');
        }
        if (ifdefor(action.stats.cooldown)) {
            actionSections.push('Cooldown: ' + evaluateForDisplay(action.stats.cooldown, character.adventurer).format(1) + ' seconds');
        }
        sections.push(tag('div', 'abilityText', actionSections.join('<br/>')));
    }
    return sections.join('<br/>');
}