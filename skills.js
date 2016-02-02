var abilities = {
    'archer': {'name': 'Soul of Archer', 'next': ['sap'], 'bonuses': {'+dexterity': 5, '+evasion': 2, '%attackSpeed': .05}},

    'sap': {'name': 'Sap', 'next': ['pet'], 'bonuses': {'+slowOnHit': .2, '+healthGainOnHit': 1}},

    'pet': {'name': 'Pet', 'next': ['blackbelt', 'petFood', 'petTraining'], 'attacks': [{'type': 'monster', 'tags': ['pet'], 'key': 'caterpillar', 'stats': {'limit': 1, 'cooldown': 30, 'healthBonus': 1, 'damageBonus': 1}}], 'helpText': 'Call up to 1 pet to fight with you.'},
    'petFood': {'name': 'Pet Food', 'next': ['whistle'], 'bonuses': {'+pet:cooldown': -3, '+pet:healthBonus': 1}, 'helpText': 'Pet has 50% more health and can be called more frequently.'},
    'petTraining': {'name': 'Pet Training', 'next': ['whistle'], 'bonuses': {'+pet:cooldown': -3, '+pet:damageBonus': .5}, 'helpText': 'Pet deals 50% more damage and can be called more frequently.'},
    'whistle': {'name': 'Whistle', 'next': [], 'bonuses': {'+pet:cooldown': -10}, 'helpText': 'Greatly reduces the cooldown for calling your pet.'},

    'blackbelt': {'name': 'Soul of Black Belt', 'next': ['stealth'], 'bonuses': {'+strength': 5, '+maxHealth': 10, '%damage': .05}},

    'stealth': {'name': 'Stealth', 'next': ['hook'], 'bonuses':{'+cloaking': 1}, 'helpText': 'Become invisible while moving.'},

    'hook': {'name': 'Grappling Hook', 'next': ['priest', 'hookRange1', 'hookDrag1'], 'attacks': [{'type': 'hook', 'stats': {'cooldown': 5, 'abilityRange': 10, 'dragDamage': 0, 'dragStun': 0, 'rangeDamage': 0}}], 'helpText': 'Throw a hook to damage and pull enemies closer.'},
    'hookRange1': {'name': 'Long Shot', 'next': ['hookRange2'], 'bonuses': {'+hook:abilityRange': 2, '+hook:cooldown': -1}, 'helpText': 'Increase the range of the hook and reduce the cooldown time.'},
    'hookRange2': {'name': 'Longer Shot', 'next': ['hookPower'], 'bonuses': {'+hook:abilityRange': 3, '+hook:cooldown': -2}, 'helpText': 'Further improve the range of the hook and cooldown time.'},
    'hookDrag1': {'name': 'Barbed Wire', 'next': ['hookDrag2'], 'bonuses': {'+hook:dragDamage': .05}, 'helpText': 'Damage hooked enemies the further you drag them.'},
    'hookDrag2': {'name': 'Tazer Wire', 'next': ['hookPower'], 'bonuses': {'+hook:dragDamage': .05, '+hook:dragStun': .1}, 'helpText': 'Damage hooked enemies more and stun them based on how far you dragged them.'},
    'hookPower': {'name': 'Power Shot', 'next': ['stealth'], 'bonuses': {'+hook:rangeDamage': .1}, 'helpText': 'The hook deals more damage the further away the enemy is.'},



    'priest': {'name': 'Soul of Priest', 'next': ['healing'], 'bonuses': {'+intelligence': 5, '+block': 2, '%accuracy': .05}},

    'healing': {'name': 'Healing', 'next': ['raiseDead'], 'bonuses': {'+healthRegen': 2}},

    'raiseDead': {'name': 'Raise Dead', 'next': ['archer'], 'attacks': [{'type': 'monster',  'tags': ['skeleton'], 'key': 'skeleton', 'stats': {'limit': 1, 'cooldown': 10, 'healthBonus': .5}}], 'helpText': 'Raise a skeleton to fight for you.'},
};

function unlockAbility(character, key) {
    if (ifdefor(character.adventurer.unlockedAbilities[key], 0) > 0) {
        return;
    }
    character.adventurer.unlockedAbilities[key] = 1;
    var helpText = abilityHelpText(abilities[key]);
    character.$panel.find('.js-infoMode .js-skilltree').append(
        $tag('button', 'js-skill skill', abilities[key].name).data('key', key).attr('helptext', helpText)
    );
}

function learnAbility(character, key) {
    if (ifdefor(character.adventurer.unlockedAbilities[key], 0) > 1) {
        return;
    }
    character.adventurer.unlockedAbilities[key] = 2;
    character.adventurer.abilities.push(abilities[key]);
    updateAdventurer(character.adventurer);
    ifdefor(abilities[key].next, []).forEach(function (key) {
        unlockAbility(character, key);
    })
    var helpText = abilityHelpText(abilities[key]);
    character.$panel.find('.js-infoMode .js-skilltree').prepend(
        $tag('div', 'js-learnedSkill learnedSkill', abilities[key].name).attr('helptext', helpText)
    );
}
/*
$(document).on('click', '.js-skill', function (event) {
    var character = $(this).closest('.js-playerPanel').data('character');
    learnAbility(character, $(this).data('key'));
    $(this).remove();
    updateSkillTree(character);
});
*/
function updateSkillTree(character) {
}
function abilityHelpText(ability) {
    var sections = [ability.name, ''];
    if (ifdefor(ability.helpText)) {
        sections.push(ability.helpText);
    }
    var helpText = bonusHelpText(ifdefor(ability.bonuses, {}), false);
    if (helpText) {
        sections.push(helpText);
    }
    return sections.join('<br/>');
}