var abilities = {
    'juggler': {'name': 'Juggling', 'bonuses': {'*throwing:attackSpeed': 1.5, '$throwing:chaining': 'Projectiles ricochet between targets until they miss.'}},
    'ranger': {'name': 'Taming', 'bonuses': {'*minion:health': 2, '*minion:attackSpeed': 1.5, '*minion:speed': 1.5}},
    'sniper': {'name': 'Sharp Shooter', 'bonuses': {'*bow:critChance': 1.5, '*bow:critMultiplier': 1.5, '$criticalPiercing': 'Critical strikes hit multiple enemies.'}},
    'blackbelt': {'name': 'Martial Arts', 'bonuses': {'*fist:damage': 1.5, '*unarmed:damage': 3, '*unarmed:attackSpeed': 1.5, '+unarmed:critChance': .15, '*unarmed:critDamage': 2, '*unarmed:critAccuracy': 2}},
    'priest': {'name': 'Divine Blessing', 'bonuses': {'*heal:skill:amount': 2, '*healthRegen': 2, '*healthGainOnHit': 2}},

    'pet': {'name': 'Pet', 'attacks': [
            {'type': 'minion', 'tags': ['pet'], 'key': 'caterpillar', 'stats': {'limit': 1, 'cooldown': 30, 'healthBonus': 1, 'damageBonus': 1}, 'helpText': 'Call up to 1 pet to fight with you.'}]},
    'petFood': {'name': 'Pet Food', 'bonuses': {'+pet:skill:cooldown': -3, '+pet:skill:healthBonus': 1}, 'helpText': 'Pet has 50% more health and can be called more frequently.'},
    'petTraining': {'name': 'Pet Training', 'next': ['whistle'], 'bonuses': {'+pet:skill:cooldown': -3, '+pet:skill:damageBonus': .5}, 'helpText': 'Pet deals 50% more damage and can be called more frequently.'},
    'whistle': {'name': 'Whistle', 'bonuses': {'+pet:skill:cooldown': -10}, 'helpText': 'Greatly reduces the cooldown for calling your pet.'},

    'sap': {'name': 'Sap', 'bonuses': {'+slowOnHit': .2, '+healthGainOnHit': 1}},

    'dodge': {'name': 'Dodge', 'bonuses': {'+evasion': 2}, 'attacks': [
             {'type': 'dodge', 'stats': {'cooldown': 10, 'distance': 128, 'buff': {'stats': {'%evasion': .5, 'duration': 5}}}, 'helpText': 'Leap back to dodge an attack and gain: {buff}'}]},



    'vitality': {'name': 'Vitality', 'bonuses': {'+healthRegen': ['{strength}', '/', 10], '+strength': 5}},

    'stealth': {'name': 'Stealth', 'bonuses':{'+cloaking': 1}, 'helpText': 'Become invisible while moving.'},

    'hook': {'name': 'Grappling Hook', 'attacks': [
            {'type': 'hook', 'alwaysHits': true, 'stats': {'cooldown': 5, 'range': 10, 'dragDamage': 0, 'dragStun': 0, 'rangeDamage': 0}, 'helpText': 'Throw a hook to damage and pull enemies closer.'}]},
    'hookRange1': {'name': 'Long Shot', 'bonuses': {'+hook:skill:range': 2, '+hook:skill:cooldown': -1}, 'helpText': 'Increase the range of the hook and reduce the cooldown time.'},
    'hookRange2': {'name': 'Longer Shot', 'bonuses': {'+hook:skill:range': 3, '+hook:skill:cooldown': -2}, 'helpText': 'Further improve the range of the hook and cooldown time.'},
    'hookDrag1': {'name': 'Barbed Wire', 'bonuses': {'+hook:skill:dragDamage': .05}, 'helpText': 'Damage hooked enemies the further you drag them.'},
    'hookDrag2': {'name': 'Tazer Wire', 'bonuses': {'+hook:skill:dragDamage': .05, '+hook:skill:dragStun': .1}, 'helpText': 'Damage hooked enemies more and stun them based on how far you dragged them.'},
    'hookPower': {'name': 'Power Shot', 'bonuses': {'+hook:skill:rangeDamage': .1}, 'helpText': 'The hook deals more damage the further away the enemy is.'},



    'heal': {'name': 'Heal', 'bonuses': {'+intelligence': 5}, 'attacks': [
            {'type': 'heal', 'stats': {'amount': ['{intelligence}'], 'cooldown': 10}, 'helpText': 'Cast a spell to restore {amount} health.'}]},

    'raiseDead': {'name': 'Raise Dead', 'attacks': [
            {'type': 'minion',  'tags': ['skeleton'], 'key': 'skeleton', 'stats': {'limit': 1, 'cooldown': 10, 'healthBonus': .5}, 'helpText': 'Raise a skeleton to fight for you.'}]},

    'protect': {'name': 'Protect', 'bonuses': {'+intelligence': 5}, 'attacks': [
            {'type': 'buff', 'stats': {'cooldown': 30, 'buff': {'stats': {'+armor': ['{intelligence}'], 'duration': 20}}}, 'helpText': 'Create a magic barrier that grants: {buff}'}]},
};
var specialTraits = {};
function findSpecialTraits(object) {
    $.each(object, function (key, value) {
        if (typeof(key) === 'string' && key.indexOf('$') >= 0) specialTraits[key.substring(1).split(':').pop()] = true;
        if (typeof(value) === 'object') findSpecialTraits(value);
    })
}
findSpecialTraits(abilities);

function abilityHelpText(ability) {
    var sections = [ability.name, ''];
    if (ifdefor(ability.helpText)) {
        sections.push(ability.helpText.replace(/\{(\w+)\}/, function (match, key) {
            return evaluteForDisplay(ability.bonuses[key]);
        }));
        sections.push('');
    }
    for (var i = 0; i < ifdefor(ability.attacks, []).length; i++) {
        var attackSections = [];
        var attack = ability.attacks[i];
        if (ifdefor(attack.helpText)) {
            attackSections.push(attack.helpText.replace(/\{(\w+)\}/, function (match, key) {
                return evaluateForDisplay(attack.stats[key]);
            }));
        }
        if (ifdefor(attack.stats.cooldown)) {
            attackSections.push('Cooldown: ' + attack.stats.cooldown + 's');
        }
        sections.push(tag('div', 'abilityText', attackSections.join('<br/>')));
    }
    var helpText = bonusHelpText(ifdefor(ability.bonuses, {}), false);
    if (helpText) {
        sections.push(helpText);
    }
    return sections.join('<br/>');
}