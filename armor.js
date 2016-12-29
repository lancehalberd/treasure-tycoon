var arm = hand = 1;
var body = head = 0;
var feet = legs = 2;
// equipmentSource function must be declared before the contents of: armor.js, weapons.js, accessories.js
function equipmentSource(column, row) {
    return {'xOffset': column * 32, 'yOffset': row * 64}
}
var equipmentSources = {
    // Pirate <3
    'strawHat': equipmentSource(head, 2),
    'vest': equipmentSource(body, 3),
    'shorts': equipmentSource(legs, 2),
    'sandals': equipmentSource(feet, 3),
    // Knight
    'heavyHelmet': equipmentSource(head, 1),
    'heavyArmor': equipmentSource(body, 0),
    'heavySleeves': equipmentSource(arm, 0),
    'heavyPants': equipmentSource(legs, 0),
    'heavyBoots': equipmentSource(feet, 1),
    // Wizard
    'wizardHat': equipmentSource(head, 9),
    'wizardRobe': equipmentSource(body, 10),
    'wizardSleeves': equipmentSource(arm, 10),
    'wizardPants': equipmentSource(legs, 9),
    'wizardSandals': equipmentSource(feet, 10),
    // Peter Pan
    'featherCap': equipmentSource(head, 12),
    'leatherVest': equipmentSource(body, 13),
    'leatherLongGloves': equipmentSource(arm, 12),
    'leatherPants': equipmentSource(legs, 12),
    'leatherBoots': equipmentSource(feet, 13),
    // Robes
    'blueRobe': equipmentSource(body, 6),
    'purpleRobe': equipmentSource(body, 7),
    // Other Helmets
    'devilHelmet': equipmentSource(head, 4),
    'oversizedHelmet': equipmentSource(head, 5),
    // Other Shoes
    'redShoes': equipmentSource(feet, 5),
    // Other Gloves
    'leatherGloves': equipmentSource(hand, 6),
    // Weapons
    'sword': equipmentSource(hand, 7),
    // Accesories
    'bracelet': equipmentSource(hand, 1),
};

//Heavy Helmets gives armor and health
//addItem(1, {'slot': 'head', 'type': 'heavyArmor', 'name': 'Dented Bucket', 'bonuses': {'+armor': 2, '+maxHealth': 10}, 'offset': 10, icon: 'helmet'});
addItem(2, {'slot': 'head', 'type': 'heavyArmor', 'name': 'Oversized Helmet', 'bonuses': {'+armor': 5, '+maxHealth': 35}, 'source': equipmentSources.oversizedHelmet, icon: 'helmet'});
addItem(9, {'slot': 'head', 'type': 'heavyArmor', 'name': 'Copper Helmet', 'bonuses': {'+armor': 18, '+maxHealth': 90}, 'source': equipmentSources.heavyHelmet, 'hideHair': true, icon: 'helmet'});
addItem(14, {'slot': 'head', 'type': 'heavyArmor', 'name': 'Bronze Helmet', 'bonuses': {'+armor': 26, '+maxHealth': 130}, 'source': equipmentSources.heavyHelmet, 'hideHair': true, icon: 'helmet'});
addItem(19, {'slot': 'head', 'type': 'heavyArmor', 'name': 'Iron Helmet', 'bonuses': {'+armor': 34, '+maxHealth': 170}, 'source': equipmentSources.heavyHelmet, 'hideHair': true, icon: 'helmet'});
addItem(24, {'slot': 'head', 'type': 'heavyArmor', 'name': 'Steel Helmet', 'bonuses': {'+armor': 42, '+maxHealth': 210}, 'source': equipmentSources.heavyHelmet, 'hideHair': true, icon: 'helmet'});
addItem(29, {'slot': 'head', 'type': 'heavyArmor', 'name': 'Chainmail Coif', 'bonuses': {'+armor': 50, '+maxHealth': 250}, 'source': equipmentSources.heavyHelmet, 'hideHair': true, icon: 'helmet'});
addItem(34, {'slot': 'head', 'type': 'heavyArmor', 'name': 'Scalemail Coif', 'bonuses': {'+armor': 58, '+maxHealth': 290}, 'source': equipmentSources.heavyHelmet, 'hideHair': true, icon: 'helmet'});
addItem(39, {'slot': 'head', 'type': 'heavyArmor', 'name': 'Platemail Coif', 'bonuses': {'+armor': 66, '+maxHealth': 330}, 'source': equipmentSources.heavyHelmet, 'hideHair': true, icon: 'helmet'});
addItem(44, {'slot': 'head', 'type': 'heavyArmor', 'name': 'Iron Great Helm', 'bonuses': {'+armor': 74, '+maxHealth': 370}, 'source': equipmentSources.heavyHelmet, 'hideHair': true, icon: 'helmet'});
addItem(49, {'slot': 'head', 'type': 'heavyArmor', 'name': 'Steel Great Helm', 'bonuses': {'+armor': 82, '+maxHealth': 410}, 'source': equipmentSources.heavyHelmet, 'hideHair': true, icon: 'helmet'});
addItem(59, {'slot': 'head', 'type': 'heavyArmor', 'name': 'Adamantium Great Helm', 'bonuses': {'+armor': 110, '+maxHealth': 500, '+evasion': 10, '+block': 10, '+magicBlock': 5, '%speed': -0.05}, 'source': equipmentSources.heavyHelmet, 'hideHair': true, icon: 'helmet'});
addItem(69, {'slot': 'head', 'type': 'heavyArmor', 'name': 'Orichalcum Great Helm', 'bonuses': {'+armor': 100, '+maxHealth': 550, '+evasion': 10, '+block': 10, '+magicBlock': 10}, 'source': equipmentSources.heavyHelmet, 'hideHair': true, icon: 'helmet'});

//Light Helmets gives armor and evasion
//addItem(1, {'slot': 'head', 'type': 'lightArmor', 'name': 'Rotten Bucket', 'bonuses': {'+armor': 1, '+evasion': 3}, 'offset': 10, icon: 'featherHat'});
addItem(4, {'slot': 'head', 'type': 'lightArmor', 'name': 'Leather Cap', 'bonuses': {'+armor': 7, '+evasion': 13}, 'source': equipmentSources.featherCap, icon: 'featherHat'});
addItem(8, {'slot': 'head', 'type': 'lightArmor', 'name': 'Hide Cap', 'bonuses': {'+armor': 13, '+evasion': 23}, 'source': equipmentSources.featherCap, icon: 'featherHat'});
addItem(13, {'slot': 'head', 'type': 'lightArmor', 'name': 'Leather Helmet', 'bonuses': {'+armor': 19, '+evasion': 33}, 'source': equipmentSources.featherCap, icon: 'featherHat'});
addItem(18, {'slot': 'head', 'type': 'lightArmor', 'name': 'Studded Helmet', 'bonuses': {'+armor': 25, '+evasion': 43}, 'source': equipmentSources.featherCap, icon: 'featherHat'});
addItem(23, {'slot': 'head', 'type': 'lightArmor', 'name': 'Hide Helmet', 'bonuses': {'+armor': 31, '+evasion': 53}, 'source': equipmentSources.featherCap, icon: 'featherHat'});
addItem(28, {'slot': 'head', 'type': 'lightArmor', 'name': 'Shell Helmet', 'bonuses': {'+armor': 37, '+evasion': 63}, 'source': equipmentSources.featherCap, icon: 'featherHat'});
addItem(33, {'slot': 'head', 'type': 'lightArmor', 'name': 'Leather Hood', 'bonuses': {'+armor': 43, '+evasion': 73}, 'source': equipmentSources.featherCap, icon: 'featherHat'});
addItem(38, {'slot': 'head', 'type': 'lightArmor', 'name': 'Horned Helmet', 'bonuses': {'+armor': 49, '+evasion': 83}, 'source': equipmentSources.featherCap, icon: 'featherHat'});
addItem(43, {'slot': 'head', 'type': 'lightArmor', 'name': 'Scale Helmet', 'bonuses': {'+armor': 55, '+evasion': 93}, 'source': equipmentSources.featherCap, icon: 'featherHat'});
addItem(48, {'slot': 'head', 'type': 'lightArmor', 'name': 'Composite Helmet', 'bonuses': {'+armor': 61, '+evasion': 103}, 'source': equipmentSources.featherCap, icon: 'featherHat'});
addItem(58, {'slot': 'head', 'type': 'lightArmor', 'name': 'Runed Helmet', 'bonuses': {'+armor': 70, '+evasion': 110, '+maxHealth': 35, '+block': 5, '+magicBlock': 5}, 'source': equipmentSources.featherCap, icon: 'featherHat'});
addItem(68, {'slot': 'head', 'type': 'lightArmor', 'name': 'Dragon Helmet', 'bonuses': {'+armor': 80, '+evasion': 120, '+maxHealth': 100, '+block': 10, '+magicBlock': 10}, 'source': equipmentSources.featherCap, icon: 'featherHat'});

//Hoods gives block and magic block
addItem(1, {'slot': 'head', 'type': 'clothArmor', 'name': 'Straw Hat', 'bonuses': {'+block': 2, '+magicBlock': 1}, 'source': equipmentSources.strawHat, 'hideHair': true, icon: 'mageHat'});
addItem(3, {'slot': 'head', 'type': 'clothArmor', 'name': 'Wool Cap', 'bonuses': {'+block': 10, '+magicBlock': 5}, 'source': equipmentSources.strawHat, 'hideHair': true, icon: 'mageHat'});
addItem(7, {'slot': 'head', 'type': 'clothArmor', 'name': 'Winged Cap', 'bonuses': {'+block': 18, '+magicBlock': 9}, 'source': equipmentSources.strawHat, 'hideHair': true, icon: 'mageHat'});
addItem(12, {'slot': 'head', 'type': 'clothArmor', 'name': 'Cotten Hood', 'bonuses': {'+block': 26, '+magicBlock': 13}, 'source': equipmentSources.strawHat, 'hideHair': true, icon: 'mageHat'});
addItem(17, {'slot': 'head', 'type': 'clothArmor', 'name': 'Fur Hood', 'bonuses': {'+block': 34, '+magicBlock': 17}, 'source': equipmentSources.strawHat, 'hideHair': true,icon: 'mageHat'});
addItem(22, {'slot': 'head', 'type': 'clothArmor', 'name': 'Cashmere Hood', 'bonuses': {'+block': 42, '+magicBlock': 21}, 'source': equipmentSources.strawHat, 'hideHair': true, icon: 'mageHat'});
addItem(27, {'slot': 'head', 'type': 'clothArmor', 'name': 'Silk Hood', 'bonuses': {'+block': 50, '+magicBlock': 25}, 'source': equipmentSources.strawHat, 'hideHair': true, icon: 'mageHat'});
addItem(32, {'slot': 'head', 'type': 'clothArmor', 'name': 'Angora Hood', 'bonuses': {'+block': 58, '+magicBlock': 29}, 'source': equipmentSources.strawHat, 'hideHair': true, icon: 'mageHat'});
addItem(37, {'slot': 'head', 'type': 'clothArmor', 'name': 'Velvet Hood', 'bonuses': {'+block': 66, '+magicBlock': 33}, 'source': equipmentSources.wizardHat, 'hideHair': true, icon: 'mageHat'});
addItem(42, {'slot': 'head', 'type': 'clothArmor', 'name': 'Embroidered Hat', 'bonuses': {'+block': 74, '+magicBlock': 37}, 'source': equipmentSources.wizardHat, 'hideHair': true, icon: 'mageHat'});
addItem(47, {'slot': 'head', 'type': 'clothArmor', 'name': 'Wizards Hat', 'bonuses': {'+block': 82, '+magicBlock': 41}, 'source': equipmentSources.wizardHat, 'hideHair': true, icon: 'mageHat'});
addItem(57, {'slot': 'head', 'type': 'clothArmor', 'name': 'Blessed Cowl', 'bonuses': {'+block': 85, '+magicBlock': 50, '+armor': 5, '+evasion': 5, '+maxHealth': 35}, 'source': equipmentSources.wizardHat, 'hideHair': true, icon: 'mageHat'});
addItem(67, {'slot': 'head', 'type': 'clothArmor', 'name': 'Divine Cowl', 'bonuses': {'+block': 100, '+magicBlock': 60, '+armor': 10, '+evasion': 10, '+maxHealth': 50}, 'source': equipmentSources.wizardHat, 'hideHair': true, icon: 'mageHat'});

//Heavy Armor gives armor + health
addItem(3, {'slot': 'body', 'type': 'heavyArmor', 'name': 'Lamellar', 'bonuses': {'+armor': 8, '+maxHealth': 40}, 'source': equipmentSources.heavyArmor, icon: 'heavyArmor'});
addItem(8, {'slot': 'body', 'type': 'heavyArmor', 'name': 'Bamboo Armor', 'bonuses': {'+armor': 13, '+maxHealth': 65}, 'source': equipmentSources.heavyArmor, icon: 'heavyArmor'});
addItem(13, {'slot': 'body', 'type': 'heavyArmor', 'name': 'Panoply', 'bonuses': {'+armor': 23, '+maxHealth': 115}, 'source': equipmentSources.heavyArmor, icon: 'heavyArmor'});
addItem(18, {'slot': 'body', 'type': 'heavyArmor', 'name': 'Plated Coat', 'bonuses': {'+armor': 33, '+maxHealth': 165}, 'source': equipmentSources.heavyArmor, icon: 'heavyArmor'});
addItem(23, {'slot': 'body', 'type': 'heavyArmor', 'name': 'Brigandine', 'bonuses': {'+armor': 43, '+maxHealth': 215}, 'source': equipmentSources.heavyArmor, icon: 'heavyArmor'});
addItem(28, {'slot': 'body', 'type': 'heavyArmor', 'name': 'Cuirass', 'bonuses': {'+armor': 53, '+maxHealth': 265}, 'source': equipmentSources.heavyArmor, icon: 'heavyArmor'});
addItem(33, {'slot': 'body', 'type': 'heavyArmor', 'name': 'Chainmall', 'bonuses': {'+armor': 63, '+maxHealth': 315}, 'source': equipmentSources.heavyArmor, icon: 'heavyArmor'});
addItem(38, {'slot': 'body', 'type': 'heavyArmor', 'name': 'Scalemail', 'bonuses': {'+armor': 73, '+maxHealth': 365}, 'source': equipmentSources.heavyArmor, icon: 'heavyArmor'});
addItem(43, {'slot': 'body', 'type': 'heavyArmor', 'name': 'Platemail', 'bonuses': {'+armor': 83, '+maxHealth': 415}, 'source': equipmentSources.heavyArmor, icon: 'heavyArmor'});
addItem(48, {'slot': 'body', 'type': 'heavyArmor', 'name': 'Half Plate', 'bonuses': {'+armor': 93, '+maxHealth': 465}, 'source': equipmentSources.heavyArmor, icon: 'heavyArmor'});
addItem(53, {'slot': 'body', 'type': 'heavyArmor', 'name': 'Full Plate', 'bonuses': {'+armor': 103, '+maxHealth': 515}, 'source': equipmentSources.heavyArmor, icon: 'heavyArmor'});
addItem(63, {'slot': 'body', 'type': 'heavyArmor', 'name': 'Adamantium Plate', 'bonuses': {'+armor': 130, '+maxHealth': 700, '+evasion': 20, '+block': 20, '+magicBlock': 10, '%speed': -0.2}, 'source': equipmentSources.heavyArmor, icon: 'heavyArmor'});
addItem(73, {'slot': 'body', 'type': 'heavyArmor', 'name': 'Orichalcum Plate', 'bonuses': {'+armor': 120, '+maxHealth': 700, '+evasion': 20, '+block': 20, '+magicBlock': 20}, 'source': equipmentSources.heavyArmor, icon: 'heavyArmor'});

//Light Armor gives armor and evasion
addItem(2, {'slot': 'body', 'type': 'lightArmor', 'name': 'Cloth Tunic', 'bonuses': {'+armor': 2, '+evasion': 4}, 'source': equipmentSources.leatherVest, icon: 'lightArmor'});
addItem(7, {'slot': 'body', 'type': 'lightArmor', 'name': 'Leather Tunic', 'bonuses': {'+armor': 7, '+evasion': 19}, 'source': equipmentSources.leatherVest, icon: 'lightArmor'});
addItem(12, {'slot': 'body', 'type': 'lightArmor', 'name': 'Hide Tunic', 'bonuses': {'+armor': 12, '+evasion': 34}, 'source': equipmentSources.leatherVest, icon: 'lightArmor'});
addItem(17, {'slot': 'body', 'type': 'lightArmor', 'name': 'Leather Armor', 'bonuses': {'+armor': 17, '+evasion': 49}, 'source': equipmentSources.leatherVest, icon: 'lightArmor'});
addItem(22, {'slot': 'body', 'type': 'lightArmor', 'name': 'Studded Armor', 'bonuses': {'+armor': 22, '+evasion': 64}, 'source': equipmentSources.leatherVest, icon: 'lightArmor'});
addItem(27, {'slot': 'body', 'type': 'lightArmor', 'name': 'Hide Armor', 'bonuses': {'+armor': 27, '+evasion': 79}, 'source': equipmentSources.leatherVest, icon: 'lightArmor'});
addItem(32, {'slot': 'body', 'type': 'lightArmor', 'name': 'Carapace Armor', 'bonuses': {'+armor': 32, '+evasion': 94}, 'source': equipmentSources.leatherVest, icon: 'lightArmor'});
addItem(37, {'slot': 'body', 'type': 'lightArmor', 'name': 'Treated Armor', 'bonuses': {'+armor': 37, '+evasion': 109}, 'source': equipmentSources.leatherVest, icon: 'lightArmor'});
addItem(42, {'slot': 'body', 'type': 'lightArmor', 'name': 'Splint Armor', 'bonuses': {'+armor': 42, '+evasion': 124}, 'source': equipmentSources.leatherVest, icon: 'lightArmor'});
addItem(47, {'slot': 'body', 'type': 'lightArmor', 'name': 'Scale Armor', 'bonuses': {'+armor': 47, '+evasion': 139}, 'source': equipmentSources.leatherVest, icon: 'lightArmor'});
addItem(52, {'slot': 'body', 'type': 'lightArmor', 'name': 'Composite Armor', 'bonuses': {'+armor': 52, '+evasion': 154}, 'source': equipmentSources.leatherVest, icon: 'lightArmor'});
addItem(62, {'slot': 'body', 'type': 'lightArmor', 'name': 'Runed Armor', 'bonuses': {'+armor': 55, '+evasion': 155, '+maxHealth': 60, '+block': 10, '+magicBlock': 10}, 'source': equipmentSources.leatherVest, icon: 'lightArmor'});
addItem(72, {'slot': 'body', 'type': 'lightArmor', 'name': 'Dragon Armor', 'bonuses': {'+armor': 70, '+evasion': 170, '+maxHealth': 200, '+block': 20, '+magicBlock': 20}, 'source': equipmentSources.leatherVest, icon: 'lightArmor'});

// Cloth Armor gives armor, block and magic block
addItem(1, {'slot': 'body', 'type': 'clothArmor', 'name': 'Wool Shirt', 'bonuses': {'+armor': 2, '+block': 4, '+magicBlock': 2}, 'source': equipmentSources.vest, icon: 'clothArmor'});
addItem(6, {'slot': 'body', 'type': 'clothArmor', 'name': 'Hemp Frock', 'bonuses': {'+armor': 4, '+block': 10, '+magicBlock': 6}, 'source': equipmentSources.vest, icon: 'clothArmor'});
addItem(11, {'slot': 'body', 'type': 'clothArmor', 'name': 'Linen Frock', 'bonuses': {'+armor': 7, '+block': 17, '+magicBlock': 11}, 'source': equipmentSources.vest, icon: 'clothArmor'});
addItem(16, {'slot': 'body', 'type': 'clothArmor', 'name': 'Cotten Frock', 'bonuses': {'+armor': 10, '+block': 24, '+magicBlock': 16}, 'source': equipmentSources.vest, icon: 'clothArmor'});
addItem(21, {'slot': 'body', 'type': 'clothArmor', 'name': 'Fur Coat', 'bonuses': {'+armor': 13, '+block': 31, '+magicBlock': 21}, 'source': equipmentSources.vest, icon: 'clothArmor'});
addItem(26, {'slot': 'body', 'type': 'clothArmor', 'name': 'Cashmere Robe', 'bonuses': {'+armor': 16, '+block': 38, '+magicBlock': 26}, 'source': equipmentSources.blueRobe, icon: 'clothArmor'});
addItem(31, {'slot': 'body', 'type': 'clothArmor', 'name': 'Silk Robe', 'bonuses': {'+armor': 19, '+block': 45, '+magicBlock': 31}, 'source': equipmentSources.blueRobe, icon: 'clothArmor'});
addItem(36, {'slot': 'body', 'type': 'clothArmor', 'name': 'Angora Robe', 'bonuses': {'+armor': 22, '+block': 52, '+magicBlock': 36}, 'source': equipmentSources.purpleRobe, icon: 'clothArmor'});
addItem(41, {'slot': 'body', 'type': 'clothArmor', 'name': 'Velvet Robe', 'bonuses': {'+armor': 25, '+block': 59, '+magicBlock': 41}, 'source': equipmentSources.purpleRobe, icon: 'clothArmor'});
addItem(46, {'slot': 'body', 'type': 'clothArmor', 'name': 'Embroidered Robe', 'bonuses': {'+armor': 28, '+block': 66, '+magicBlock': 46}, 'source': equipmentSources.wizardRobe, icon: 'clothArmor'});
addItem(51, {'slot': 'body', 'type': 'clothArmor', 'name': 'Sorcerous Vestment', 'bonuses': {'+armor': 31, '+block': 73, '+magicBlock': 51}, 'source': equipmentSources.wizardRobe, icon: 'clothArmor'});
addItem(61, {'slot': 'body', 'type': 'clothArmor', 'name': 'Blessed Vestment', 'bonuses': {'+armor': 40, '+block': 80, '+magicBlock': 56, '+evasion': 10, '+maxHealth': 60}, 'source': equipmentSources.wizardRobe, icon: 'clothArmor'});
addItem(71, {'slot': 'body', 'type': 'clothArmor', 'name': 'Divine Vestment', 'bonuses': {'+armor': 50, '+block': 100, '+magicBlock': 75, '+evasion': 20, '+maxHealth': 100}, 'source': equipmentSources.wizardRobe, icon: 'clothArmor'});

//Vambracers gives armor and health
//addItem(1, {'slot': 'arms', 'type': 'heavyArmor', 'name': 'Corroded Vambracers', 'bonuses': {'+armor': 2, '+maxHealth': 10}, icon: 'vambracers'});
addItem(5, {'slot': 'arms', 'type': 'heavyArmor', 'name': 'Bamboo Vambracers', 'bonuses': {'+armor': 10, '+maxHealth': 60}, 'source': equipmentSources.heavySleeves, icon: 'vambracers'});
addItem(10, {'slot': 'arms', 'type': 'heavyArmor', 'name': 'Copper Vambracers', 'bonuses': {'+armor': 18, '+maxHealth': 90}, 'source': equipmentSources.heavySleeves, icon: 'vambracers'});
addItem(15, {'slot': 'arms', 'type': 'heavyArmor', 'name': 'Bronze Vambracers', 'bonuses': {'+armor': 26, '+maxHealth': 130}, 'source': equipmentSources.heavySleeves, icon: 'vambracers'});
addItem(20, {'slot': 'arms', 'type': 'heavyArmor', 'name': 'Iron Vambracers', 'bonuses': {'+armor': 34, '+maxHealth': 170}, 'source': equipmentSources.heavySleeves, icon: 'vambracers'});
addItem(25, {'slot': 'arms', 'type': 'heavyArmor', 'name': 'Black Vambracers', 'bonuses': {'+armor': 42, '+maxHealth': 210}, 'source': equipmentSources.heavySleeves, icon: 'vambracers'});
addItem(30, {'slot': 'arms', 'type': 'heavyArmor', 'name': 'Forged Vambracers', 'bonuses': {'+armor': 50, '+maxHealth': 250}, 'source': equipmentSources.heavySleeves, icon: 'vambracers'});
addItem(35, {'slot': 'arms', 'type': 'heavyArmor', 'name': 'Steel Vambracers', 'bonuses': {'+armor': 58, '+maxHealth': 290}, 'source': equipmentSources.heavySleeves, icon: 'vambracers'});
addItem(40, {'slot': 'arms', 'type': 'heavyArmor', 'name': 'Stainless Vambracers', 'bonuses': {'+armor': 66, '+maxHealth': 330}, 'source': equipmentSources.heavySleeves, icon: 'vambracers'});
addItem(45, {'slot': 'arms', 'type': 'heavyArmor', 'name': 'Engraved Vambracers', 'bonuses': {'+armor': 74, '+maxHealth': 370}, 'source': equipmentSources.heavySleeves, icon: 'vambracers'});
addItem(50, {'slot': 'arms', 'type': 'heavyArmor', 'name': 'Meteoric Vambracers', 'bonuses': {'+armor': 82, '+maxHealth': 410}, 'source': equipmentSources.heavySleeves, icon: 'vambracers'});
addItem(60, {'slot': 'arms', 'type': 'heavyArmor', 'name': 'Adamantium Vambracers', 'bonuses': {'+armor': 110, '+maxHealth': 500, '+evasion': 10, '+block': 10, '+magicBlock': 5, '%speed': -0.05}, 'source': equipmentSources.heavySleeves, icon: 'vambracers'});
addItem(70, {'slot': 'arms', 'type': 'heavyArmor', 'name': 'Orichalcum Vambracers', 'bonuses': {'+armor': 100, '+maxHealth': 550, '+evasion': 10, '+block': 10, '+magicBlock': 10}, 'source': equipmentSources.heavySleeves, icon: 'vambracers'});

//Bracers gives armor and evasion
//addItem(1, {'slot': 'arms', 'type': 'lightArmor', 'name': 'Rotting Bracelets', 'bonuses': {'+armor': 1, '+evasion': 3}, icon: 'bracers'});
addItem(4, {'slot': 'arms', 'type': 'lightArmor', 'name': 'Leather Bracelets', 'bonuses': {'+armor': 7, '+evasion': 13}, 'source': equipmentSources.leatherLongGloves, icon: 'bracers'});
addItem(9, {'slot': 'arms', 'type': 'lightArmor', 'name': 'Hide Bracelets', 'bonuses': {'+armor': 13, '+evasion': 23}, 'source': equipmentSources.leatherLongGloves, icon: 'bracers'});
addItem(14, {'slot': 'arms', 'type': 'lightArmor', 'name': 'Leather Bracers', 'bonuses': {'+armor': 19, '+evasion': 33}, 'source': equipmentSources.leatherLongGloves, icon: 'bracers'});
addItem(19, {'slot': 'arms', 'type': 'lightArmor', 'name': 'Studded Bracers', 'bonuses': {'+armor': 25, '+evasion': 43}, 'source': equipmentSources.leatherLongGloves, icon: 'bracers'});
addItem(24, {'slot': 'arms', 'type': 'lightArmor', 'name': 'Hide Bracers', 'bonuses': {'+armor': 31, '+evasion': 53}, 'source': equipmentSources.leatherLongGloves, icon: 'bracers'});
addItem(29, {'slot': 'arms', 'type': 'lightArmor', 'name': 'Carapace Bracers', 'bonuses': {'+armor': 37, '+evasion': 63}, 'source': equipmentSources.leatherLongGloves, icon: 'bracers'});
addItem(34, {'slot': 'arms', 'type': 'lightArmor', 'name': 'Padded Bracers', 'bonuses': {'+armor': 43, '+evasion': 73}, 'source': equipmentSources.leatherLongGloves, icon: 'bracers'});
addItem(39, {'slot': 'arms', 'type': 'lightArmor', 'name': 'Plated Bracers', 'bonuses': {'+armor': 49, '+evasion': 83}, 'source': equipmentSources.leatherLongGloves, icon: 'bracers'});
addItem(44, {'slot': 'arms', 'type': 'lightArmor', 'name': 'Scale Bracers', 'bonuses': {'+armor': 55, '+evasion': 93}, 'source': equipmentSources.leatherLongGloves, icon: 'bracers'});
addItem(49, {'slot': 'arms', 'type': 'lightArmor', 'name': 'Composite Bracers', 'bonuses': {'+armor': 61, '+evasion': 103}, 'source': equipmentSources.leatherLongGloves, icon: 'bracers'});
addItem(59, {'slot': 'arms', 'type': 'lightArmor', 'name': 'Runed Bracers', 'bonuses': {'+armor': 70, '+evasion': 110, '+maxHealth': 35, '+block': 5, '+magicBlock': 5}, 'source': equipmentSources.leatherLongGloves, icon: 'bracers'});
addItem(69, {'slot': 'arms', 'type': 'lightArmor', 'name': 'Dragon Bracers', 'bonuses': {'+armor': 80, '+evasion': 120, '+maxHealth': 100, '+block': 10, '+magicBlock': 10}, 'source': equipmentSources.leatherLongGloves, icon: 'bracers'});

//Gloves gives block and magic block
addItem(1, {'slot': 'arms', 'type': 'clothArmor', 'name': 'Torn Mittens', 'bonuses': {'+block': 2, '+magicBlock': 1}, 'source': equipmentSources.leatherGloves, icon: 'gloves'});
addItem(3, {'slot': 'arms', 'type': 'clothArmor', 'name': 'Hemp Mittens', 'bonuses': {'+block': 10, '+magicBlock': 5}, 'source': equipmentSources.leatherGloves, icon: 'gloves'});
addItem(8, {'slot': 'arms', 'type': 'clothArmor', 'name': 'Linen Mittens', 'bonuses': {'+block': 18, '+magicBlock': 9}, 'source': equipmentSources.leatherGloves, icon: 'gloves'});
addItem(13, {'slot': 'arms', 'type': 'clothArmor', 'name': 'Cotten Mittens', 'bonuses': {'+block': 26, '+magicBlock': 13}, 'source': equipmentSources.leatherGloves, icon: 'gloves'});
addItem(18, {'slot': 'arms', 'type': 'clothArmor', 'name': 'Fur Gloves', 'bonuses': {'+block': 34, '+magicBlock': 17}, 'source': equipmentSources.leatherGloves, icon: 'gloves'});
addItem(23, {'slot': 'arms', 'type': 'clothArmor', 'name': 'Cashmere Gloves', 'bonuses': {'+block': 42, '+magicBlock': 21}, 'source': equipmentSources.leatherGloves, icon: 'gloves'});
addItem(28, {'slot': 'arms', 'type': 'clothArmor', 'name': 'Silk Gloves', 'bonuses': {'+block': 50, '+magicBlock': 25}, 'source': equipmentSources.leatherGloves, icon: 'gloves'});
addItem(33, {'slot': 'arms', 'type': 'clothArmor', 'name': 'Angora Gloves', 'bonuses': {'+block': 58, '+magicBlock': 29}, 'source': equipmentSources.wizardSleeves, icon: 'gloves'});
addItem(38, {'slot': 'arms', 'type': 'clothArmor', 'name': 'Velvet Gloves', 'bonuses': {'+block': 66, '+magicBlock': 33}, 'source': equipmentSources.wizardSleeves, icon: 'gloves'});
addItem(43, {'slot': 'arms', 'type': 'clothArmor', 'name': 'Embroidered Gloves', 'bonuses': {'+block': 74, '+magicBlock': 37}, 'source': equipmentSources.wizardSleeves, icon: 'gloves'});
addItem(48, {'slot': 'arms', 'type': 'clothArmor', 'name': 'Sorcerous Gloves', 'bonuses': {'+block':82, '+magicBlock': 41}, 'source': equipmentSources.wizardSleeves, icon: 'gloves'});
addItem(58, {'slot': 'arms', 'type': 'clothArmor', 'name': 'Blessed Gloves', 'bonuses': {'+block': 85, '+magicBlock': 50, '+armor': 5, '+evasion': 5, '+maxHealth': 35}, 'source': equipmentSources.wizardSleeves, icon: 'gloves'});
addItem(68, {'slot': 'arms', 'type': 'clothArmor', 'name': 'Divine Gloves', 'bonuses': {'+block': 100, '+magicBlock': 60, '+armor': 10, '+evasion': 10, '+maxHealth': 60}, 'source': equipmentSources.wizardSleeves, icon: 'gloves'});

//Greaves gives armor and health
//addItem(1, {'slot': 'legs', 'type': 'heavyArmor', 'name': 'Corroded Skirt', 'bonuses': {'+armor': 3, '+maxHealth': 10}, icon: 'greaves'});
addItem(6, {'slot': 'legs', 'type': 'heavyArmor', 'name': 'Bamboo Skirt', 'bonuses': {'+armor': 12, '+maxHealth': 65}, 'source': equipmentSources.heavyPants, icon: 'greaves'});
addItem(11, {'slot': 'legs', 'type': 'heavyArmor', 'name': 'Copper Skirt', 'bonuses': {'+armor': 21, '+maxHealth': 100}, 'source': equipmentSources.heavyPants, icon: 'greaves'});
addItem(16, {'slot': 'legs', 'type': 'heavyArmor', 'name': 'Bronze Greaves', 'bonuses': {'+armor': 30, '+maxHealth': 145}, 'source': equipmentSources.heavyPants, icon: 'greaves'});
addItem(21, {'slot': 'legs', 'type': 'heavyArmor', 'name': 'Iron Greaves', 'bonuses': {'+armor': 39, '+maxHealth': 190}, 'source': equipmentSources.heavyPants, icon: 'greaves'});
addItem(26, {'slot': 'legs', 'type': 'heavyArmor', 'name': 'Black Greaves', 'bonuses': {'+armor': 48, '+maxHealth': 235}, 'source': equipmentSources.heavyPants, icon: 'greaves'});
addItem(31, {'slot': 'legs', 'type': 'heavyArmor', 'name': 'Forged Greaves', 'bonuses': {'+armor': 57, '+maxHealth': 280}, 'source': equipmentSources.heavyPants, icon: 'greaves'});
addItem(36, {'slot': 'legs', 'type': 'heavyArmor', 'name': 'Steel Greaves', 'bonuses': {'+armor': 66, '+maxHealth': 325}, 'source': equipmentSources.heavyPants, icon: 'greaves'});
addItem(41, {'slot': 'legs', 'type': 'heavyArmor', 'name': 'Stainless Greaves', 'bonuses': {'+armor': 75, '+maxHealth': 370}, 'source': equipmentSources.heavyPants, icon: 'greaves'});
addItem(46, {'slot': 'legs', 'type': 'heavyArmor', 'name': 'Engraved Greaves', 'bonuses': {'+armor': 84, '+maxHealth': 415}, 'source': equipmentSources.heavyPants, icon: 'greaves'});
addItem(51, {'slot': 'legs', 'type': 'heavyArmor', 'name': 'Meteoric Greaves', 'bonuses': {'+armor': 93, '+maxHealth': 460}, 'source': equipmentSources.heavyPants, icon: 'greaves'});
addItem(61, {'slot': 'legs', 'type': 'heavyArmor', 'name': 'Adamantium Greaves', 'bonuses': {'+armor': 110, '+maxHealth': 550, '+evasion': 20, '+block': 20, '+magicBlock': 10, '%speed': -0.1}, 'source': equipmentSources.heavyPants, icon: 'greaves'});
addItem(71, {'slot': 'legs', 'type': 'heavyArmor', 'name': 'Orichalcum Greaves', 'bonuses': {'+armor': 100, '+maxHealth': 550, '+evasion': 20, '+block': 20, '+magicBlock': 20}, 'source': equipmentSources.heavyPants, icon: 'greaves'});

//Pants gives evasion and armor
//addItem(1, {'slot': 'legs', 'type': 'lightArmor', 'name': 'Worn Kilt', 'bonuses': {'+armor': 2, '+evasion': 3}, icon: 'pants'});
addItem(5, {'slot': 'legs', 'type': 'lightArmor', 'name': 'Leather Kilt', 'bonuses': {'+armor': 10, '+evasion': 13}, 'source': equipmentSources.leatherPants, icon: 'pants'});
addItem(10, {'slot': 'legs', 'type': 'lightArmor', 'name': 'Hide Kilt', 'bonuses': {'+armor': 18, '+evasion': 23}, 'source': equipmentSources.leatherPants, icon: 'pants'});
addItem(15, {'slot': 'legs', 'type': 'lightArmor', 'name': 'Leather Pants', 'bonuses': {'+armor': 26, '+evasion': 33}, 'source': equipmentSources.leatherPants, icon: 'pants'});
addItem(20, {'slot': 'legs', 'type': 'lightArmor', 'name': 'Studded Pants', 'bonuses': {'+armor': 34, '+evasion': 43}, 'source': equipmentSources.leatherPants, icon: 'pants'});
addItem(25, {'slot': 'legs', 'type': 'lightArmor', 'name': 'Hide Pants', 'bonuses': {'+armor': 42, '+evasion': 53}, 'source': equipmentSources.leatherPants, icon: 'pants'});
addItem(30, {'slot': 'legs', 'type': 'lightArmor', 'name': 'Carapace Pants', 'bonuses': {'+armor': 50, '+evasion': 63}, 'source': equipmentSources.leatherPants, icon: 'pants'});
addItem(35, {'slot': 'legs', 'type': 'lightArmor', 'name': 'Padded Pants', 'bonuses': {'+armor': 58, '+evasion': 73}, 'source': equipmentSources.leatherPants, icon: 'pants'});
addItem(40, {'slot': 'legs', 'type': 'lightArmor', 'name': 'Plated Pants', 'bonuses': {'+armor': 66, '+evasion': 83}, 'source': equipmentSources.leatherPants, icon: 'pants'});
addItem(45, {'slot': 'legs', 'type': 'lightArmor', 'name': 'Scale Pants', 'bonuses': {'+armor': 74, '+evasion': 93}, 'source': equipmentSources.leatherPants, icon: 'pants'});
addItem(50, {'slot': 'legs', 'type': 'lightArmor', 'name': 'Composite Pants', 'bonuses': {'+armor': 82, '+evasion': 103}, icon: 'pants'});
addItem(60, {'slot': 'legs', 'type': 'lightArmor', 'name': 'Runed Pants', 'bonuses': {'+armor': 85, '+evasion': 115, '+maxHealth': 60, '+block': 10, '+magicBlock': 10}, 'source': equipmentSources.leatherPants, icon: 'pants'});
addItem(70, {'slot': 'legs', 'type': 'lightArmor', 'name': 'Dragon Pants', 'bonuses': {'+armor': 90, '+evasion': 120, '+maxHealth': 100, '+block': 20, '+magicBlock': 20}, 'source': equipmentSources.leatherPants, icon: 'pants'});

//Tights gives block and magic block
addItem(1, {'slot': 'legs', 'type': 'clothArmor', 'name': 'Tattered Shorts', 'bonuses': {'+block': 3, '+magicBlock': 1}, source: equipmentSources.shorts, icon: 'tights'});
addItem(4, {'slot': 'legs', 'type': 'clothArmor', 'name': 'Hemp Shorts', 'bonuses': {'+block': 11, '+magicBlock': 6}, source: equipmentSources.shorts, icon: 'tights'});
addItem(9, {'slot': 'legs', 'type': 'clothArmor', 'name': 'Linen Shorts', 'bonuses': {'+block': 19, '+magicBlock': 11}, source: equipmentSources.shorts, icon: 'tights'});
addItem(14, {'slot': 'legs', 'type': 'clothArmor', 'name': 'Cotten Shorts', 'bonuses': {'+block': 27, '+magicBlock': 16}, source: equipmentSources.shorts, icon: 'tights'});
addItem(19, {'slot': 'legs', 'type': 'clothArmor', 'name': 'Fur Tights', 'bonuses': {'+block': 35, '+magicBlock': 21}, source: equipmentSources.shorts, icon: 'tights'});
addItem(24, {'slot': 'legs', 'type': 'clothArmor', 'name': 'Cashmere Tights', 'bonuses': {'+block': 43, '+magicBlock': 26}, source: equipmentSources.shorts, icon: 'tights'});
addItem(29, {'slot': 'legs', 'type': 'clothArmor', 'name': 'Silk Tights', 'bonuses': {'+block': 51, '+magicBlock': 31}, source: equipmentSources.wizardPants, icon: 'tights'});
addItem(34, {'slot': 'legs', 'type': 'clothArmor', 'name': 'Angora Tights', 'bonuses': {'+block': 59, '+magicBlock': 36}, source: equipmentSources.wizardPants, icon: 'tights'});
addItem(39, {'slot': 'legs', 'type': 'clothArmor', 'name': 'Velvet Tights', 'bonuses': {'+block': 67, '+magicBlock': 41}, source: equipmentSources.wizardPants, icon: 'tights'});
addItem(44, {'slot': 'legs', 'type': 'clothArmor', 'name': 'Embroidered Tights', 'bonuses': {'+block': 75, '+magicBlock': 46}, source: equipmentSources.wizardPants, icon: 'tights'});
addItem(49, {'slot': 'legs', 'type': 'clothArmor', 'name': 'Sorcerous Tights', 'bonuses': {'+block': 83, '+magicBlock': 51}, source: equipmentSources.wizardPants, icon: 'tights'});
addItem(59, {'slot': 'legs', 'type': 'clothArmor', 'name': 'Blessed Tights', 'bonuses': {'+block': 90, '+magicBlock': 60, '+armor': 10, '+evasion': 10, '+maxHealth': 60}, source: equipmentSources.wizardPants, icon: 'tights'});
addItem(69, {'slot': 'legs', 'type': 'clothArmor', 'name': 'Divine Tights', 'bonuses': {'+block': 100, '+magicBlock': 70, '+armor': 20, '+evasion': 20, '+maxHealth': 60}, source: equipmentSources.wizardPants, icon: 'tights'});

//Sabatons gives armor and health
//addItem(1, {'slot': 'feet', 'type': 'heavyArmor', 'name': 'Corroded Sabatons', 'bonuses': {'+armor': 2, '+maxHealth': 5, '-speed': 50}, 'offset': 8, icon: 'sabatons'});
addItem(7, {'slot': 'feet', 'type': 'heavyArmor', 'name': 'Bamboo Sabatons', 'bonuses': {'+armor': 9, '+maxHealth': 55, '-speed': 50}, 'source': equipmentSources.heavyBoots, icon: 'sabatons'});
addItem(12, {'slot': 'feet', 'type': 'heavyArmor', 'name': 'Copper Sabatons', 'bonuses': {'+armor': 16, '+maxHealth': 85, '-speed': 50}, 'source': equipmentSources.heavyBoots, icon: 'sabatons'});
addItem(17, {'slot': 'feet', 'type': 'heavyArmor', 'name': 'Bronze Sabatons', 'bonuses': {'+armor': 23, '+maxHealth': 125, '-speed': 50}, 'source': equipmentSources.heavyBoots, icon: 'sabatons'});
addItem(22, {'slot': 'feet', 'type': 'heavyArmor', 'name': 'Iron Sabatons', 'bonuses': {'+armor': 30, '+maxHealth': 165, '-speed': 50}, 'source': equipmentSources.heavyBoots, icon: 'sabatons'});
addItem(27, {'slot': 'feet', 'type': 'heavyArmor', 'name': 'Black Sabatons', 'bonuses': {'+armor': 37, '+maxHealth': 205, '-speed': 50}, 'source': equipmentSources.heavyBoots, icon: 'sabatons'});
addItem(32, {'slot': 'feet', 'type': 'heavyArmor', 'name': 'Forged Sabatons', 'bonuses': {'+armor': 44, '+maxHealth': 245, '-speed': 50}, 'source': equipmentSources.heavyBoots, icon: 'sabatons'});
addItem(37, {'slot': 'feet', 'type': 'heavyArmor', 'name': 'Steel Sabatons', 'bonuses': {'+armor': 51, '+maxHealth': 285, '-speed': 50}, 'source': equipmentSources.heavyBoots, icon: 'sabatons'});
addItem(42, {'slot': 'feet', 'type': 'heavyArmor', 'name': 'Stainless Sabatons', 'bonuses': {'+armor': 58, '+maxHealth': 325, '-speed': 50}, 'source': equipmentSources.heavyBoots, icon: 'sabatons'});
addItem(47, {'slot': 'feet', 'type': 'heavyArmor', 'name': 'Engraved Sabatons', 'bonuses': {'+armor': 65, '+maxHealth': 365, '-speed': 50}, 'source': equipmentSources.heavyBoots, icon: 'sabatons'});
addItem(52, {'slot': 'feet', 'type': 'heavyArmor', 'name': 'Meteoric Sabatons', 'bonuses': {'+armor': 72, '+maxHealth': 405, '-speed': 50}, 'source': equipmentSources.heavyBoots, icon: 'sabatons'});
addItem(62, {'slot': 'feet', 'type': 'heavyArmor', 'name': 'Adamantium Sabatons', 'bonuses': {'+armor': 100, '+maxHealth': 500, '+evasion': 10, '+block': 10, '+magicBlock': 10, '%speed': -0.1}, 'source': equipmentSources.heavyBoots, icon: 'sabatons'});
addItem(72, {'slot': 'feet', 'type': 'heavyArmor', 'name': 'Orichalcum Sabatons', 'bonuses': {'+armor': 90, '+maxHealth': 500, '+evasion': 10, '+block': 10, '+magicBlock': 20}, 'source': equipmentSources.heavyBoots, icon: 'sabatons'});

//Boots gives armor and evasion
//addItem(1, {'slot': 'feet', 'type': 'lightArmor', 'name': 'Worn Shoes', 'bonuses': {'+armor': 1, '+evasion': 2, '-speed': 25}, 'offset': 8, icon: 'boots'});
addItem(6, {'slot': 'feet', 'type': 'lightArmor', 'name': 'Leather Shoes', 'bonuses': {'+armor': 6, '+evasion': 10, '-speed': 25}, 'source': equipmentSources.leatherBoots, icon: 'boots'});
addItem(11, {'slot': 'feet', 'type': 'lightArmor', 'name': 'Hide Shoes', 'bonuses': {'+armor': 11, '+evasion': 18, '-speed': 25}, 'source': equipmentSources.leatherBoots, icon: 'boots'});
addItem(16, {'slot': 'feet', 'type': 'lightArmor', 'name': 'Leather Boots', 'bonuses': {'+armor': 16, '+evasion': 26, '-speed': 25}, 'source': equipmentSources.leatherBoots, icon: 'boots'});
addItem(21, {'slot': 'feet', 'type': 'lightArmor', 'name': 'Studded Boots', 'bonuses': {'+armor': 21, '+evasion': 34, '-speed': 25}, 'source': equipmentSources.leatherBoots, icon: 'boots'});
addItem(26, {'slot': 'feet', 'type': 'lightArmor', 'name': 'Hide Boots', 'bonuses': {'+armor': 26, '+evasion': 42, '-speed': 25}, 'source': equipmentSources.leatherBoots, icon: 'boots'});
addItem(31, {'slot': 'feet', 'type': 'lightArmor', 'name': 'Carapace Boots', 'bonuses': {'+armor': 31, '+evasion': 50, '-speed': 25}, 'source': equipmentSources.leatherBoots, icon: 'boots'});
addItem(36, {'slot': 'feet', 'type': 'lightArmor', 'name': 'Padded Boots', 'bonuses': {'+armor': 36, '+evasion': 58, '-speed': 25}, 'source': equipmentSources.redShoes, icon: 'boots'});
addItem(41, {'slot': 'feet', 'type': 'lightArmor', 'name': 'Plated Boots', 'bonuses': {'+armor': 41, '+evasion': 66, '-speed': 25}, 'source': equipmentSources.redShoes, icon: 'boots'});
addItem(46, {'slot': 'feet', 'type': 'lightArmor', 'name': 'Scale Boots', 'bonuses': {'+armor': 46, '+evasion': 74, '-speed': 25}, 'source': equipmentSources.redShoes, icon: 'boots'});
addItem(51, {'slot': 'feet', 'type': 'lightArmor', 'name': 'Composite Boots', 'bonuses': {'+armor': 51, '+evasion': 82, '-speed': 25}, 'source': equipmentSources.redShoes, icon: 'boots'});
addItem(61, {'slot': 'feet', 'type': 'lightArmor', 'name': 'Runed Boots', 'bonuses': {'+armor': 60, '+evasion': 90, '+maxHealth': 35, '+block': 5, '+magicBlock': 5, '-speed': 25}, 'source': equipmentSources.redShoes, icon: 'boots'});
addItem(71, {'slot': 'feet', 'type': 'lightArmor', 'name': 'Dragon Boots', 'bonuses': {'+armor': 70, '+evasion': 110,'+maxHealth': 100, '+block': 10, '+magicBlock': 20}, 'source': equipmentSources.redShoes, icon: 'boots'});

//Sandals/Slippers gives block and magic block
addItem(1, {'slot': 'feet', 'type': 'clothArmor', 'name': 'Broken Sandals', 'bonuses': {'+block': 1, '+magicBlock': 1, '-speed': 10}, 'source': equipmentSources.sandals, icon: 'shoes'});
addItem(5, {'slot': 'feet', 'type': 'clothArmor', 'name': 'Leather Sandals', 'bonuses': {'+block': 5, '+magicBlock': 5, '+speed': 10}, 'source': equipmentSources.sandals, icon: 'shoes'});
addItem(10, {'slot': 'feet', 'type': 'clothArmor', 'name': 'Winged Sandals', 'bonuses': {'+block': 9, '+magicBlock': 9, '+speed': 50}, 'source': equipmentSources.sandals, icon: 'shoes'});
addItem(15, {'slot': 'feet', 'type': 'clothArmor', 'name': 'Cotton Slippers', 'bonuses': {'+block': 13, '+magicBlock': 13, '+speed': 40}, 'source': equipmentSources.sandals, icon: 'shoes'});
addItem(20, {'slot': 'feet', 'type': 'clothArmor', 'name': 'Fur Slippers', 'bonuses': {'+block': 17, '+magicBlock': 17, '+speed': 50}, 'source': equipmentSources.sandals, icon: 'shoes'});
addItem(25, {'slot': 'feet', 'type': 'clothArmor', 'name': 'Cashmere Slippers', 'bonuses': {'+block': 21, '+magicBlock': 21, '+speed': 60}, 'source': equipmentSources.sandals, icon: 'shoes'});
addItem(30, {'slot': 'feet', 'type': 'clothArmor', 'name': 'Silk Slippers', 'bonuses': {'+block': 25, '+magicBlock': 25, '+speed': 70}, 'source': equipmentSources.wizardSandals, icon: 'shoes'});
addItem(35, {'slot': 'feet', 'type': 'clothArmor', 'name': 'Angora Slippers', 'bonuses': {'+block': 29, '+magicBlock': 29, '+speed': 80}, 'source': equipmentSources.wizardSandals, icon: 'shoes'});
addItem(40, {'slot': 'feet', 'type': 'clothArmor', 'name': 'Velvet Slippers', 'bonuses': {'+block': 33, '+magicBlock': 33, '+speed': 90}, 'source': equipmentSources.wizardSandals, icon: 'shoes'});
addItem(45, {'slot': 'feet', 'type': 'clothArmor', 'name': 'Embroidered Slippers', 'bonuses': {'+block': 37, '+magicBlock': 37, '+speed': 100}, 'source': equipmentSources.wizardSandals, icon: 'shoes'});
addItem(50, {'slot': 'feet', 'type': 'clothArmor', 'name': 'Sourcerous Slippers', 'bonuses': {'+block': 41, '+magicBlock': 41, '+speed': 110}, 'source': equipmentSources.wizardSandals, icon: 'shoes'});
addItem(60, {'slot': 'feet', 'type': 'clothArmor', 'name': 'Blessed Sandals', 'bonuses': {'+block': 50, '+magicBlock': 50, '+armor': 5, '+evasion': 5, '+maxHealth': 35, '+speed': 120}, 'source': equipmentSources.wizardSandals, icon: 'shoes'});
addItem(70, {'slot': 'feet', 'type': 'clothArmor', 'name': 'Divine Sandals', 'bonuses': {'+block': 70, '+magicBlock': 60, '+armor': 10, '+evasion': 10, '+maxHealth': 60, '*speed': 1.2, '+speed': 50}, 'source': equipmentSources.wizardSandals, icon: 'shoes'});

//Heavy Shields
addItem(2, {'slot': 'offhand', 'type': 'heavyShield', 'tags': ['shield'], 'name': 'Wooden Board', 'bonuses': {'+maxHealth': 20, '+block': 3}, 'icon': 'heavyShield'});
addItem(4, {'slot': 'offhand', 'type': 'heavyShield', 'tags': ['shield'], 'name': 'Scuta', 'bonuses': {'+maxHealth': 60, '+block': 10}, 'icon': 'heavyShield'});
addItem(9, {'slot': 'offhand', 'type': 'heavyShield', 'tags': ['shield'], 'name': 'Wooden Kite Shield', 'bonuses': {'+maxHealth': 90, '+block': 17}, 'icon': 'heavyShield'});
addItem(14, {'slot': 'offhand', 'type': 'heavyShield', 'tags': ['shield'], 'name': 'Iron Kite Shield', 'bonuses': {'+maxHealth': 130, '+block': 24}, 'icon': 'heavyShield'});
addItem(19, {'slot': 'offhand', 'type': 'heavyShield', 'tags': ['shield'], 'name': 'Wooden Heater Shield', 'bonuses': {'+maxHealth': 170, '+block': 31}, 'icon': 'heavyShield'});
addItem(24, {'slot': 'offhand', 'type': 'heavyShield', 'tags': ['shield'], 'name': 'Iron Heater Shield', 'bonuses': {'+maxHealth': 210, '+block': 39}, 'icon': 'heavyShield'});
addItem(29, {'slot': 'offhand', 'type': 'heavyShield', 'tags': ['shield'], 'name': 'Steel Heater Shield', 'bonuses': {'+maxHealth': 250, '+block': 46}, 'icon': 'heavyShield'});
addItem(34, {'slot': 'offhand', 'type': 'heavyShield', 'tags': ['shield'], 'name': 'Iron Tower Shield', 'bonuses': {'+maxHealth': 290, '+block': 53}, 'icon': 'heavyShield'});
addItem(39, {'slot': 'offhand', 'type': 'heavyShield', 'tags': ['shield'], 'name': 'Steel Tower Shield', 'bonuses': {'+maxHealth': 330, '+block': 60}, 'icon': 'heavyShield'});
addItem(44, {'slot': 'offhand', 'type': 'heavyShield', 'tags': ['shield'], 'name': 'Stainless Tower Shield', 'bonuses': {'+maxHealth': 370, '+block': 67}, 'icon': 'heavyShield'});
addItem(49, {'slot': 'offhand', 'type': 'heavyShield', 'tags': ['shield'], 'name': 'Meteoric Tower Shield', 'bonuses': {'+maxHealth': 400, '+block': 75}, 'icon': 'heavyShield'});
addItem(59, {'slot': 'offhand', 'type': 'heavyShield', 'tags': ['shield'], 'name': 'Adamantium Tower Shield', 'bonuses': {'+maxHealth': 400, '+block': 120, '+armor': 5, '+evasion': 5, '+magicBlock': 10, '%speed': -0.1}, 'icon': 'heavyShield'});
addItem(69, {'slot': 'offhand', 'type': 'heavyShield', 'tags': ['shield'], 'name': 'Orichalcum Tower Shield', 'bonuses': {'+maxHealth': 400, '+block': 110, '+armor': 10, '+evasion': 10, '+magicBlock': 20}, 'icon': 'heavyShield'});

//Light Shields
addItem(1, {'slot': 'offhand', 'type': 'lightShield', 'tags': ['shield'], 'name': 'Wooden Bowl', 'bonuses': {'+evasion': 3, '+block': 2}, 'icon': 'lightShield'});
addItem(3, {'slot': 'offhand', 'type': 'lightShield', 'tags': ['shield'], 'name': 'Parma', 'bonuses': {'+evasion': 11, '+block': 9}, 'icon': 'lightShield'});
addItem(8, {'slot': 'offhand', 'type': 'lightShield', 'tags': ['shield'], 'name': 'Wooden Round Shield', 'bonuses': {'+evasion': 19, '+block': 16}, 'icon': 'lightShield'});
addItem(13, {'slot': 'offhand', 'type': 'lightShield', 'tags': ['shield'], 'name': 'Leather Round Shield', 'bonuses': {'+evasion': 27, '+block': 23}, 'icon': 'lightShield'});
addItem(18, {'slot': 'offhand', 'type': 'lightShield', 'tags': ['shield'], 'name': 'Hide Round Shield', 'bonuses': {'+evasion': 35, '+block': 30}, 'icon': 'lightShield'});
addItem(23, {'slot': 'offhand', 'type': 'lightShield', 'tags': ['shield'], 'name': 'Iron Round Shield', 'bonuses': {'+evasion': 43, '+block': 37}, 'icon': 'lightShield'});
addItem(28, {'slot': 'offhand', 'type': 'lightShield', 'tags': ['shield'], 'name': 'Steel Round Shield', 'bonuses': {'+evasion': 51, '+block': 44}, 'icon': 'lightShield'});
addItem(33, {'slot': 'offhand', 'type': 'lightShield', 'tags': ['shield'], 'name': 'Iron Buckler', 'bonuses': {'+evasion': 59, '+block': 51}, 'icon': 'lightShield'});
addItem(38, {'slot': 'offhand', 'type': 'lightShield', 'tags': ['shield'], 'name': 'Steel Buckler', 'bonuses': {'+evasion': 67, '+block': 58}, 'icon': 'lightShield'});
addItem(43, {'slot': 'offhand', 'type': 'lightShield', 'tags': ['shield'], 'name': 'Stainless Buckler', 'bonuses': {'+evasion': 75, '+block': 65}, 'icon': 'lightShield'});
addItem(48, {'slot': 'offhand', 'type': 'lightShield', 'tags': ['shield'], 'name': 'Meteoric Buckler', 'bonuses': {'+evasion': 83, '+block': 72}, 'icon': 'lightShield'});
addItem(58, {'slot': 'offhand', 'type': 'lightShield', 'tags': ['shield'], 'name': 'Runed Buckler', 'bonuses': {'+evasion': 90, '+block': 80, '+armor': 5, '+maxHealth': 35, '+magicBlock': 10}, 'icon': 'magicShield'});
addItem(68, {'slot': 'offhand', 'type': 'lightShield', 'tags': ['shield'], 'name': 'Dragon Buckler', 'bonuses': {'+evasion': 100, '+block': 90, '+armor': 10, '+maxHealth': 60, '+magicBlock': 20}, 'icon': 'magicShield'});