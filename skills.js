var abilities = {
    'archer': {'name': 'Soul of Archer', 'bonuses': {'+dexterity': 5, '+evasion': 2, '%attackSpeed': .05}},

    'pet': {'name': 'Pet', 'attacks': [
            {'type': 'monster', 'tags': ['pet'], 'key': 'caterpillar', 'stats': {'limit': 1, 'cooldown': 30, 'healthBonus': 1, 'damageBonus': 1}, 'helpText': 'Call up to 1 pet to fight with you.'}]},
    'petFood': {'name': 'Pet Food', 'bonuses': {'+pet:cooldown': -3, '+pet:healthBonus': 1}, 'helpText': 'Pet has 50% more health and can be called more frequently.'},
    'petTraining': {'name': 'Pet Training', 'next': ['whistle'], 'bonuses': {'+pet:cooldown': -3, '+pet:damageBonus': .5}, 'helpText': 'Pet deals 50% more damage and can be called more frequently.'},
    'whistle': {'name': 'Whistle', 'bonuses': {'+pet:cooldown': -10}, 'helpText': 'Greatly reduces the cooldown for calling your pet.'},

    'sap': {'name': 'Sap', 'bonuses': {'+slowOnHit': .2, '+healthGainOnHit': 1}},

    'dodge': {'name': 'Dodge', 'bonuses': {'+evasion': 2}, 'attacks': [
             {'type': 'dodge', 'stats': {'cooldown': 10, 'distance': 128, 'buff': {'stats': {'%evasion': .5, 'duration': 5}}}, 'helpText': 'Leap back to dodge an attack and gain: {buff}'}]},


    'blackbelt': {'name': 'Soul of Black Belt', 'bonuses': {'+strength': 5, '+maxHealth': 10, '%damage': .05}},

    'vitality': {'name': 'Vitality', 'bonuses': {'+healthRegen': ['{strength}', '/', 10], '+strength': 5}},

    'stealth': {'name': 'Stealth', 'bonuses':{'+cloaking': 1}, 'helpText': 'Become invisible while moving.'},

    'hook': {'name': 'Grappling Hook', 'attacks': [
            {'type': 'hook', 'stats': {'cooldown': 5, 'abilityRange': 10, 'dragDamage': 0, 'dragStun': 0, 'rangeDamage': 0}, 'helpText': 'Throw a hook to damage and pull enemies closer.'}]},
    'hookRange1': {'name': 'Long Shot', 'bonuses': {'+hook:abilityRange': 2, '+hook:cooldown': -1}, 'helpText': 'Increase the range of the hook and reduce the cooldown time.'},
    'hookRange2': {'name': 'Longer Shot', 'bonuses': {'+hook:abilityRange': 3, '+hook:cooldown': -2}, 'helpText': 'Further improve the range of the hook and cooldown time.'},
    'hookDrag1': {'name': 'Barbed Wire', 'bonuses': {'+hook:dragDamage': .05}, 'helpText': 'Damage hooked enemies the further you drag them.'},
    'hookDrag2': {'name': 'Tazer Wire', 'bonuses': {'+hook:dragDamage': .05, '+hook:dragStun': .1}, 'helpText': 'Damage hooked enemies more and stun them based on how far you dragged them.'},
    'hookPower': {'name': 'Power Shot', 'bonuses': {'+hook:rangeDamage': .1}, 'helpText': 'The hook deals more damage the further away the enemy is.'},


    'priest': {'name': 'Soul of Priest', 'bonuses': {'+intelligence': 5, '+block': 2, '%accuracy': .05}},

    'heal': {'name': 'Heal', 'bonuses': {'+intelligence': 5}, 'attacks': [
            {'type': 'heal', 'stats': {'amount': ['{intelligence}'], 'cooldown': 10}, 'helpText': 'Cast a spell to restore {amount} health.'}]},

    'raiseDead': {'name': 'Raise Dead', 'attacks': [
            {'type': 'monster',  'tags': ['skeleton'], 'key': 'skeleton', 'stats': {'limit': 1, 'cooldown': 10, 'healthBonus': .5}, 'helpText': 'Raise a skeleton to fight for you.'}]},

    'protect': {'name': 'Protect', 'bonuses': {'+intelligence': 5}, 'attacks': [
            {'type': 'buff', 'stats': {'cooldown': 30, 'buff': {'stats': {'+armor': ['{intelligence}'], 'duration': 20}}}, 'helpText': 'Create a magic barrier that grants: {buff}'}]},
};

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