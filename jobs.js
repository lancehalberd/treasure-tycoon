var characterClasses = {};

addCharacterClass('Fool', 0, 0, 0, {}, [], foolIcon);

addCharacterClass('Black Belt', 0, 2, 1, {}, jobJewels(1,0,0), blackbeltIcon);
addCharacterClass('Warrior', 1, 3, 1, {'weapon': itemsByKey.stick}, jobJewels(1,0,0), warriorIcon);
addCharacterClass('Samurai', 2, 4, 1, {'weapon': itemsByKey.stick}, jobJewels(1,0,0), samuraiIcon);

addCharacterClass('Juggler', 2, 1, 0, {'weapon': itemsByKey.ball}, jobJewels(0,1,0),  jugglerIcon);
addCharacterClass('Ranger', 3, 1, 1, {'weapon': itemsByKey.ball}, jobJewels(0,1,0), rangerIcon);
addCharacterClass('Sniper', 4, 1, 2, {'weapon': itemsByKey.ball}, jobJewels(0,1,0), sniperIcon);

addCharacterClass('Priest', 1, 0, 2, {'weapon': itemsByKey.stick}, jobJewels(0,0,1), priestIcon);
addCharacterClass('Wizard', 1, 1, 3, {'weapon': itemsByKey.stick}, jobJewels(0,0,1), wizardIcon);
addCharacterClass('Sorcerer', 1, 2, 4, {'weapon': itemsByKey.stick}, jobJewels(0,0,1), sorcererIcon);

addCharacterClass('Corsair', 2, 2, 1, {'weapon': itemsByKey.rock}, jobJewels(1,1,0), corsairIcon);
addCharacterClass('Assassin', 3, 2, 1, {'weapon': itemsByKey.rock}, jobJewels(1,1,0), assassinIcon);
addCharacterClass('Ninja', 4, 4, 2, {'weapon': itemsByKey.rock}, jobJewels(1,1,0), ninjaIcon);

addCharacterClass('Dancer', 2, 1, 2, {'weapon': itemsByKey.rock}, jobJewels(0,1,1), dancerIcon);
addCharacterClass('Bard', 2, 1, 3, {'weapon': itemsByKey.stick}, jobJewels(1,0,1), bardIcon);
addCharacterClass('Sage', 4, 2, 4, {'weapon': itemsByKey.stick}, jobJewels(1,0,1), sageIcon);

addCharacterClass('Paladin', 1, 2, 2, {'weapon': itemsByKey.stick}, jobJewels(1,0,1), paladinIcon);
addCharacterClass('Dark Knight', 1, 3, 2, {'weapon': itemsByKey.ball}, jobJewels(0,1,1),  darkknightIcon);
addCharacterClass('Enhancer', 2, 4, 4, {'weapon': itemsByKey.ball}, jobJewels(0,1,1), enhancerIcon);

addCharacterClass('Master', 4, 4, 4, {'weapon': itemsByKey.rock}, jobJewels(0,1,1), masterIcon);

function addCharacterClass(name, dexterityBonus, strengthBonus, intelligenceBonus, startingEquipment, jewelLoot, iconSource) {
    var key = name.replace(/\s*/g, '').toLowerCase();
    startingEquipment = ifdefor(startingEquipment, {});
    startingEquipment.body = ifdefor(startingEquipment.body, itemsByKey.woolshirt);
    characterClasses[key] = {
        'key': key,
        'name': name,
        'dexterityBonus': dexterityBonus,
        'strengthBonus': strengthBonus,
        'intelligenceBonus': intelligenceBonus,
        'startingEquipment': startingEquipment,
        'startingBoard': ifdefor(classBoards[key], squareBoard),
        'jewelLoot': jewelLoot,
        'iconSource': iconSource
    };
}
function jobJewels(r,g,b) {
    var base = (r + g + b) * 5;
    return [jewelLoot(['triangle'], [1, 1],
            [r ? [90, 100] : [base, base + 5],
             g ? [90, 100] : [base, base + 5],
             b ? [90, 100] : [base, base + 5]], false), smallJewelLoot, smallJewelLoot];
}
