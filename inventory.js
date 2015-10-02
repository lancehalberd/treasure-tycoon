function equipItem(adventurer, item) {
    if (adventurer.equipment[item.base.slot]) {
        console.log("Tried to equip an item without first unequiping!");
        return;
    }
    item.$item.detach();
    adventurer.equipment[item.base.slot] = item;
    updateAdventurer(adventurer);
}
function sellValue(item) {
    return item.level * item.level * item.level;
}
function makeItem(base, level) {
    var item = {
        'base': base,
        'prefixes': [],
        'suffixes': [],
        'level': level
    };
    item.$item = $tag('div', 'js-item item', tag('div', 'icon ' + base.icon));
    updateItem(item);
    item.$item.data('item', item);
    return item;
}
function updateItem(item) {
    item.$item.attr('helpText', itemHelpText(item));
    item.$item.removeClass('imbued').removeClass('enchanted');
    var enchantments = item.prefixes.length + item.suffixes.length;
    if (enchantments > 2) {
        item.$item.addClass('imbued');
    } else if (enchantments) {
        item.$item.addClass('enchanted');
    }
}
function itemHelpText(item) {
    var name = item.base.name;
    var prefixNames = [];
    item.prefixes.forEach(function (affix) {
        prefixNames.unshift(affix.base.name);
    });
    if (prefixNames.length) {
        name = prefixNames.join(', ') + ' ' + name;
    }
    var suffixNames = [];
    item.suffixes.forEach(function (affix) {
        suffixNames.push(affix.base.name);
    });
    if (suffixNames.length) {
        name = name + ' of ' + suffixNames.join(' and ');
    }
    var sections = [name, ''];
    sections.push(bonusHelpText(item.base.bonuses, true));

    if (item.prefixes.length || item.suffixes.length) {
        sections.push('');
        item.prefixes.forEach(function (affix) {
            sections.push(bonusHelpText(affix.bonuses, false));
        });
        item.suffixes.forEach(function (affix) {
            sections.push(bonusHelpText(affix.bonuses, false));
        });
    }
    sections.push('');

    var points = [sellValue(item) + ' IP'];
    var total = item.prefixes.length + item.suffixes.length;
    if (total) {
        if (total <= 2) points.push(sellValue(item) * total + ' MP');
        else points.push(sellValue(item) * (total - 2) + ' RP');
    }
    sections.push('Sell for ' + points.join(' '));
    return sections.join('<br/>');
}
function bonusHelpText(bonuses, implicit) {
    var sections = [];
    if (ifdefor(bonuses['+minDamage']) != null) {
        if (implicit) sections.push('Damage: ' + bonuses['+minDamage'] + ' to ' + bonuses['+maxDamage']);
        else sections.push(bonuses['+minDamage'] + ' to ' + bonuses['+maxDamage'] + ' increased damage');
    }
    if (ifdefor(bonuses['+minMagicDamage'] != null)) {
        if (implicit) sections.push('Magic: ' + bonuses['+minMagicDamage'] + ' to ' + bonuses['+maxMagicDamage']);
        else sections.push(bonuses['+minMagicDamage'] + ' to ' + bonuses['+maxMagicDamage'] + ' increased magic damage');
    }
    if (ifdefor(bonuses['+dexterity']) != null) {
        sections.push('+' + bonuses['+dexterity'] + ' Dexterity');
    }
    if (ifdefor(bonuses['+strength']) != null) {
        sections.push('+' + bonuses['+strength'] + ' Strength');
    }
    if (ifdefor(bonuses['+intelligence']) != null) {
        sections.push('+' + bonuses['+intelligence'] + ' Intelligence');
    }
    if (ifdefor(bonuses['+range'])) {
        if (implicit) sections.push('Range: ' + bonuses['+range']);
        else sections.push(bonuses['+range'] + ' increased range');
    }
    if (ifdefor(bonuses['+attackSpeed'])) {
        sections.push('Attack Speed: ' + bonuses['+attackSpeed']);
    }
    if (ifdefor(bonuses['+damageOnMiss'])) {
        sections.push('Deals ' + bonuses['+damageOnMiss'] + ' to enemy on miss');
    }
    if (ifdefor(bonuses['+armor'])) {
        if (implicit) sections.push('Armor: ' + bonuses['+armor']);
        else sections.push(bonuses['+armor'] + ' increased armor');
    }
    if (ifdefor(bonuses['+evasion'])) {
        if (implicit) sections.push('Evasion: ' + bonuses['+evasion']);
        else sections.push(bonuses['+evasion'] + ' increased evasion');
    }
    if (ifdefor(bonuses['+block'])) {
        if (implicit) sections.push('Block: ' + bonuses['+block']);
        else sections.push(bonuses['+block'] + ' increased block');
    }
    if (ifdefor(bonuses['+maxHealth'])) {
        sections.push('+' + bonuses['+maxHealth'] + ' health');
    }
    if (ifdefor(bonuses['+healthGainOnHit'])) {
        sections.push('Gain ' + bonuses['+healthGainOnHit'] + ' health on hit');
    }
    if (ifdefor(bonuses['+healthRegen'])) {
        sections.push('Regenerates ' + bonuses['+healthRegen'] + ' health per second');
    }
    if (ifdefor(bonuses['%maxHealth'])) {
        sections.push((100 * bonuses['%maxHealth']).toFixed(0) + '% increased health');
    }
    if (ifdefor(bonuses['%attackSpeed'])) {
        sections.push((100 * bonuses['%attackSpeed']).toFixed(0) + '% increased attack speed');
    }
    if (ifdefor(bonuses['%damage'])) {
        sections.push((100 * bonuses['%damage']).toFixed(0) + '% increased damage');
    }
    if (ifdefor(bonuses['+critChance'])) {
        if (implicit) sections.push((100 * bonuses['+critChance']).toFixed(0) + '% critical strike chance');
        else sections.push('Additional ' + (100 * bonuses['+critChance']).toFixed(0) + '% chance to critical strike');
    }
    if (ifdefor(bonuses['%critChance'])) {
        sections.push((100 * bonuses['%critChance']).toFixed(0) + '% increased critical chance');
    }
    if (ifdefor(bonuses['+critDamage'])) {
        sections.push((100 * bonuses['+critDamage']).toFixed(0) + '% increased critical damage');
    }
    if (ifdefor(bonuses['+critAccuracy'])) {
        sections.push((100 * bonuses['+critAccuracy']).toFixed(0) + '% increased critical accuracy');
    }
    if (ifdefor(bonuses['%accuracy'])) {
        sections.push((100 * bonuses['%accuracy']).toFixed(0) + '% increased accuracy');
    }
    if (ifdefor(bonuses['+slowOnHit'])) {
        sections.push('Slows target by ' + (100 * bonuses['+slowOnHit']).toFixed(0) + '%');
    }
    if (ifdefor(bonuses['+speed'])) {
        sections.push((bonuses['+speed'] > 0 ? '+' : '') + bonuses['+speed'] + ' speed');
    }
    if (ifdefor(bonuses['+accuracy'])) {
        sections.push((bonuses['+accuracy'] > 0 ? '+' : '') + bonuses['+accuracy'] + ' accuracy');
    }
    return sections.join('<br/>');
}
function sellItem(item) {
    var sourceCharacter = item.$item.closest('.js-playerPanel').data('character');
    if (sourceCharacter) {
        sourceCharacter.adventurer.equipment[item.base.slot] = null;
        updateAdventurer(sourceCharacter.adventurer);
    }
    item.$item.remove();
    item.$item = null;
    gain('IP', sellValue(item));
    var total = item.prefixes.length + item.suffixes.length;
    if (total) {
        if (total <= 2) gain('MP', sellValue(item) * total);
        else gain('RP', sellValue(item) * (total - 2));
    }
}

var $dragHelper = null;
var dragged = false;
$('body').on('mouseup', function (event) {
    if (dragged) {
        stopDrag();
    }
});
$('body').on('mousedown', '.js-item', function (event) {
    if ($dragHelper) {
        stopDrag();
        return;
    }
    $dragHelper = $(this).clone();
    $dragHelper.data('$source', $(this));
    $(this).css('opacity', '.3');
    $dragHelper.css('position', 'absolute');
    updateDragHelper();
    $('.js-mouseContainer').append($dragHelper);
    dragged = false;
});

function updateDragHelper() {
    if (!$dragHelper) {
        return;
    }
    $dragHelper.css('left', (mousePosition[0] - 10) + 'px');
    $dragHelper.css('top', (mousePosition[1] - 10) + 'px');
    dragged = true;
}

$(document).on("mousemove", function (event) {
    updateDragHelper();
});

function stopDrag() {
    if ($dragHelper) {
        var $source = $dragHelper.data('$source');
        var item = $source.data('item');
        var hit = false;
        if (collision($dragHelper, $('.js-sellItem'))) {
            sellItem(item);
            hit = true;
        }
        if (!hit && collision($dragHelper, $('.js-enchantmentSlot'))) {
            var $otherItem = $('.js-enchantmentSlot').find('.js-item');
            // If there is an item already in the enchantment slot, place it
            // back in the inventory.
            if ($otherItem.length) {
                $('.js-inventory').append($otherItem);
            }
            var character = $source.closest('.js-playerPanel').data('character');
            if (character) {
                character.adventurer.equipment[item.base.slot] = null;
                updateAdventurer(character.adventurer);
            }
            $('.js-enchantmentSlot').append($source);
            updateEnchantmentOptions();
            hit = true;
        }
        if (!hit) {
            $('.js-equipment .js-' + item.base.slot).each(function (index, element) {
                if (collision($dragHelper, $(element))) {
                    var sourceCharacter = $source.closest('.js-playerPanel').data('character');
                    hit = true
                    var targetCharacter = $(element).closest('.js-playerPanel').data('character');
                    var current = targetCharacter.adventurer.equipment[item.base.slot];
                    targetCharacter.adventurer.equipment[item.base.slot] = null;
                    if (sourceCharacter) {
                        sourceCharacter.adventurer.equipment[item.base.slot] = null;
                        if (!current) {
                            updateAdventurer(sourceCharacter.adventurer);
                        }
                    } else {
                        //unequip the existing item.
                        if (current) {
                            current.$item.detach();
                            $('.js-inventory').append(current.$item);
                        }
                    }
                    var $parent = $source.parent();
                    equipItem(targetCharacter.adventurer, item);
                    if (sourceCharacter && current) {
                        equipItem(sourceCharacter.adventurer, current);
                    }
                }
            });
        }
        if (!hit) {
            var $target = null;
            $('.js-inventory .js-item').each(function (index, element) {
                var $element = $(element);
                if (collision($dragHelper, $element) && !$element.is($source)) {
                    $target = $element;
                }
            });
            if ($target) {
                hit = true;
                var character = $source.closest('.js-playerPanel').data('character');
                if (character) {
                    character.adventurer.equipment[item.base.slot] = null;
                    updateAdventurer(character.adventurer);
                }
                $source.detach();
                $target.before($source);
            }
        }
        if (!hit && collision($dragHelper, $('.js-inventory'))) {
            var character = $source.closest('.js-playerPanel').data('character');
            if (character) {
                character.adventurer.equipment[item.base.slot] = null;
                updateAdventurer(character.adventurer);
            }
            $source.detach();
            $('.js-inventory').append($source);
        }
        $source.css('opacity', '1');
        $dragHelper.remove();
        $dragHelper = null;
        updateEnchantmentOptions();
    }
}
var armorSlots = ['body', 'feet', 'head', 'offhand', 'arms', 'legs'];
var equipmentSlots = ['weapon', 'body', 'feet', 'head', 'offhand', 'arms', 'legs', 'back', 'ring'];
var accessorySlots = ['back', 'ring'];
var items = [
    [
        {'slot': 'weapon', 'type': 'axe',  'name': 'Axe', 'bonuses': {'+minDamage': 3, '+maxDamage': 6, '+range': 1.5, '+attackSpeed': 1.5, '+critChance': .05 }, 'icon': 'axe'},
        {'slot': 'weapon', 'type': 'sword', 'name': 'Dagger', 'bonuses': {'+minDamage': 2, '+maxDamage': 4, '+range': 1, '+attackSpeed': 2, '+critChance': .06}, 'icon': 'sword'},
        {'slot': 'weapon', 'type': 'bow',  'name': 'Bow', 'bonuses': {'+minDamage': 2, '+maxDamage': 4, '+range': 10, '+attackSpeed': 1}, 'icon': 'bow', '+critChance': .05},
        {'slot': 'weapon', 'type': 'wand',  'name': 'Wand', 'bonuses': {'+minDamage': 0, '+maxDamage': 0, '+minMagicDamage': 2, '+maxMagicDamage': 3, '+range': 6, '+attackSpeed': 1.5, '+critChance': .05}, 'icon': 'wand'},
        {'slot': 'offhand', 'type': 'shield',  'name': 'Small Shield', 'bonuses': {'+block': 2, '+armor': 2}, 'icon': 'shield'},
        {'slot': 'feet', 'type': 'boots',  'name': 'Steel Boots', 'bonuses': {'+speed': -50, '+armor': 1, '+block': 2}, 'offset': 8, icon: 'boots'},
        {'slot': 'head', 'type': 'helmet',  'name': 'Ribbon', 'bonuses': {'+evasion': 1}, icon: 'hat'},
    ],
    [
        {'slot': 'feet', 'type': 'boots',  'name': 'Swift Boots', 'bonuses': {'+speed': 25, '%attackSpeed': .1}, 'offset': 8, icon: 'boots'},
        {'slot': 'head', 'type': 'helmet',  'name': 'Helmet', 'bonuses': {'+armor': 1, '+block': 1, '+evasion': 1}, 'offset': 9, icon: 'hat', hideHair: true},
        {'slot': 'head', 'type': 'helmet',  'name': 'Oversized Helm', 'bonuses': {'+armor': 2, '+accuracy': -1}, 'offset': 10, icon: 'hat'},
        //Leon Made Main Hands
        {'slot': 'weapon', 'type': 'sword', 'name': 'Knife', 'bonuses': {'+minDamage': 4, '+maxDamage': 8, '+range': 1, '+attackSpeed': 1.85, '+critChance': .06}, 'icon': 'sword'},
        {'slot': 'weapon', 'type': 'bow',  'name': 'Crossbow', 'bonuses': {'+minDamage': 5, '+maxDamage': 9, '+range': 9, '+attackSpeed': 1.2, '+critChance': .05}, 'icon': 'bow'},
        {'slot': 'weapon', 'type': 'axe',  'name': 'Labrys', 'bonuses': {'+minDamage': 7, '+maxDamage': 10, '+range': 1.5, '+attackSpeed': 1.4, '+critChance': .05}, 'icon': 'axe'},
        {'slot': 'weapon', 'type': 'wand',  'name': 'Carved Wand', 'bonuses': {'+minDamage': 1, '+maxDamage': 3, '+minMagicDamage': 2, '+maxMagicDamage': 5, '+range': 7, '+attackSpeed': 1.6, '+critChance': .05}, 'icon': 'wand'},
        {'slot': 'weapon', 'type': 'sword', 'name': 'Short Sword', 'bonuses': {'+minDamage': 5, '+maxDamage': 8, '+range': 2, '+attackSpeed': 1.7, '+critChance': .04}, 'icon': 'sword'},
        {'slot': 'weapon', 'type': 'bow',  'name': 'Blow Gun', 'bonuses': {'+minDamage': 3, '+maxDamage':  7, '+range': 8, '+attackSpeed': 1.6}, 'icon': 'bow', '+critChance': .05},
        {'slot': 'weapon', 'type': 'staff',  'name': 'Wooden Staff', 'bonuses': {'+minDamage': 3, '+maxDamage': 5, '+minMagicDamage': 1, '+maxMagicDamage': 3, '+range': 2, '+attackSpeed': 1.2, '+critChance': .03}, 'icon': 'wand'},
        {'slot': 'weapon', 'type': 'glove',  'name': 'Brass Knuckles', 'bonuses': {'+minDamage': 4, '+maxDamage': 6, '+range': 1, '+attackSpeed': 2.2, '+critChance': .04}, 'icon': 'glove'}
    ],
    [
	//Leon made Boots
        {'slot': 'feet', 'type': 'boots',  'name': 'Sandals', 'bonuses': {'+speed': 15, '+maxHealth': 15}, 'offset': 8, icon: 'boots'},
        {'slot': 'feet', 'type': 'boots',  'name': 'Leather Boots', 'bonuses': {'+speed': 15, '+armor': 1, '+evasion': 2}, 'offset': 8, icon: 'boots'},
        {'slot': 'feet', 'type': 'boots',  'name': 'Cleets', 'bonuses': {'+speed': 45}, 'offset': 8, icon: 'boots'},
        {'slot': 'feet', 'type': 'boots',  'name': 'Feet Wrappings', 'bonuses': {'+speed': 25, '+accuracy': +2}, 'offset': 8, icon: 'boots'},
    ],
    [
        //Leon Made Off Hands
        {'slot': 'offhand', 'type': 'shield',  'name': 'Heavy Shield', 'bonuses': {'+block': 4, '+armor': 2, '+speed': -50}, 'icon': 'shield'},
        {'slot': 'offhand', 'type': 'shield',  'name': 'Wooden Shield', 'bonuses': {'+block': 2, '+evasion': 2}, 'icon': 'shield'},
        {'slot': 'offhand', 'type': 'orb',  'name': 'Glowing Orb', 'bonuses': {'+minMagicDamage': 2, '+maxMagicDamage': 4, '%maxHealth': 0.1}, 'icon': 'shield'},
        {'slot': 'offhand', 'type': 'book',  'name': 'Spell Book', 'bonuses': {'+minMagicDamage': 1, '+maxMagicDamage': 4, '%attackSpeed': 0.1}, 'icon': 'shield'},
        {'slot': 'offhand', 'type': 'quiver',  'name': 'Quiver', 'bonuses': {'%attackSpeed': 0.25, '+minDamage': 2, '+maxDamage': 4}, 'icon': 'shield'},
    ]
];
function addItem(level, data) {
    items[level - 1] = ifdefor(items[level - 1], []);
    items[level - 1].push(data);
}
addItem(1, {'slot': 'arms', 'type': 'gauntlet', 'name': 'Gauntlet', 'bonuses': {'+armor': 1, '+minDamage': 1, '+maxDamage': 1}, icon: 'bag'});
addItem(1, {'slot': 'legs', 'type': 'leggings', 'name': 'Leggings', 'bonuses': {'+armor': 1, '+maxHealth': 5}, icon: 'bag'});
addItem(1, {'slot': 'back', 'type': 'quiver', 'name': 'Quiver', 'bonuses': {'+minDamage': 1, '+maxDamage': 2}, icon: 'bag'});
addItem(1, {'slot': 'ring', 'type': 'ring', 'name': 'Ring', 'bonuses': {'+armor': 1}, icon: 'bag'});

//Heavy Helmets gives armor and health
addItem(1, {'slot': 'head', 'type': 'heavyArmor', 'name': 'Dented Bucket', 'bonuses': {'+armor': 2, '+maxHealth': 10}, 'offset': 10, icon: 'hat'});
addItem(2, {'slot': 'head', 'type': 'heavyArmor', 'name': 'Oversized Helmet', 'bonuses': {'+armor': 10, '+maxHealth': 50}, 'offset': 10, icon: 'hat'});
addItem(7, {'slot': 'head', 'type': 'heavyArmor', 'name': 'Copper Helmet', 'bonuses': {'+armor': 18, '+maxHealth': 90}, 'offset': 10, icon: 'hat'});
addItem(12, {'slot': 'head', 'type': 'heavyArmor', 'name': 'Bronze Helmet', 'bonuses': {'+armor': 26, '+maxHealth': 130}, 'offset': 10, icon: 'hat'});
addItem(17, {'slot': 'head', 'type': 'heavyArmor', 'name': 'Iron Helmet', 'bonuses': {'+armor': 34, '+maxHealth': 170}, 'offset': 10, icon: 'hat'});
addItem(22, {'slot': 'head', 'type': 'heavyArmor', 'name': 'Steel Helmet', 'bonuses': {'+armor': 42, '+maxHealth': 210}, 'offset': 10, icon: 'hat'});
addItem(27, {'slot': 'head', 'type': 'heavyArmor', 'name': 'Chainmail Coif', 'bonuses': {'+armor': 50, '+maxHealth': 250}, 'offset': 10, icon: 'hat'});
addItem(32, {'slot': 'head', 'type': 'heavyArmor', 'name': 'Scalemail Coif', 'bonuses': {'+armor': 58, '+maxHealth': 290}, 'offset': 10, icon: 'hat'});
addItem(37, {'slot': 'head', 'type': 'heavyArmor', 'name': 'Platemail Coif', 'bonuses': {'+armor': 66, '+maxHealth': 330}, 'offset': 10, icon: 'hat'});
addItem(42, {'slot': 'head', 'type': 'heavyArmor', 'name': 'Iron Great Helm', 'bonuses': {'+armor': 74, '+maxHealth': 370}, 'offset': 10, icon: 'hat'});
addItem(47, {'slot': 'head', 'type': 'heavyArmor', 'name': 'Steel Great Helm', 'bonuses': {'+armor': 82, '+maxHealth': 410}, 'offset': 10, icon: 'hat'});
addItem(52, {'slot': 'head', 'type': 'heavyArmor', 'name': 'Adamantium Great Helm', 'bonuses': {'+armor': 110, '+maxHealth': 500, '+evasion': 10, '+block': 10, '+magicBlock': 5, '%speed': -0.05}, 'offset': 10, icon: 'hat'});
addItem(57, {'slot': 'head', 'type': 'heavyArmor', 'name': 'Orichalcum Great Helm', 'bonuses': {'+armor': 100, '+maxHealth': 550, '+evasion': 10, '+block': 10, '+magicBlock': 10}, 'offset': 10, icon: 'hat'});

//Light Helmets gives armor and evasion
addItem(1, {'slot': 'head', 'type': 'lightArmor', 'name': 'Rotten Bucket', 'bonuses': {'+armor': 1, '+evasion': 3}, 'offset': 10, icon: 'hat'});
addItem(2, {'slot': 'head', 'type': 'lightArmor', 'name': 'Leather Cap', 'bonuses': {'+armor': 7, '+evasion': 13}, 'offset': 10, icon: 'hat'});
addItem(7, {'slot': 'head', 'type': 'lightArmor', 'name': 'Hide Cap', 'bonuses': {'+armor': 13, '+evasion': 23}, 'offset': 10, icon: 'hat'});
addItem(12, {'slot': 'head', 'type': 'lightArmor', 'name': 'Leather Helmet', 'bonuses': {'+armor': 19, '+evasion': 33}, 'offset': 10, icon: 'hat'});
addItem(17, {'slot': 'head', 'type': 'lightArmor', 'name': 'Studded Helmet', 'bonuses': {'+armor': 25, '+evasion': 43}, 'offset': 10, icon: 'hat'});
addItem(22, {'slot': 'head', 'type': 'lightArmor', 'name': 'Hide Helmet', 'bonuses': {'+armor': 31, '+evasion': 53}, 'offset': 10, icon: 'hat'});
addItem(27, {'slot': 'head', 'type': 'lightArmor', 'name': 'Shell Helmet', 'bonuses': {'+armor': 37, '+evasion': 63}, 'offset': 10, icon: 'hat'});
addItem(32, {'slot': 'head', 'type': 'lightArmor', 'name': 'Leather Hood', 'bonuses': {'+armor': 43, '+evasion': 73}, 'offset': 10, icon: 'hat'});
addItem(37, {'slot': 'head', 'type': 'lightArmor', 'name': 'Horned Helmet', 'bonuses': {'+armor': 49, '+evasion': 83}, 'offset': 10, icon: 'hat'});
addItem(42, {'slot': 'head', 'type': 'lightArmor', 'name': 'Scale Helmet', 'bonuses': {'+armor': 55, '+evasion': 93}, 'offset': 10, icon: 'hat'});
addItem(47, {'slot': 'head', 'type': 'lightArmor', 'name': 'Composite Helmet', 'bonuses': {'+armor': 61, '+evasion': 103}, 'offset': 10, icon: 'hat'});
addItem(52, {'slot': 'head', 'type': 'lightArmor', 'name': 'Runed Helmet', 'bonuses': {'+armor': 70, '+evasion': 110, '+maxHealth': 25, '+block': 5, '+magicBlock': 5}, 'offset': 10, icon: 'hat'});
addItem(57, {'slot': 'head', 'type': 'lightArmor', 'name': 'Dragon Helmet', 'bonuses': {'+armor': 80, '+evasion': 120, '+maxHealth': 100, '+block': 10, '+magicBlock': 10}, 'offset': 10, icon: 'hat'});

//Hoods gives block and magic block
addItem(1, {'slot': 'head', 'type': 'clothArmor', 'name': 'Straw Hat', 'bonuses': {'+block': 2, '+magicBlock': 1}, 'offset': 10, icon: 'hat'});
addItem(2, {'slot': 'head', 'type': 'clothArmor', 'name': 'Wool Cap', 'bonuses': {'+block': 10, '+magicBlock': 5}, 'offset': 10, icon: 'hat'});
addItem(7, {'slot': 'head', 'type': 'clothArmor', 'name': 'Winged Cap', 'bonuses': {'+block': 18, '+magicBlock': 9}, 'offset': 10, icon: 'hat'});
addItem(12, {'slot': 'head', 'type': 'clothArmor', 'name': 'Cotten Hood', 'bonuses': {'+block': 26, '+magicBlock': 13}, 'offset': 10, icon: 'hat'});
addItem(17, {'slot': 'head', 'type': 'clothArmor', 'name': 'Fur Hood', 'bonuses': {'+block': 34, '+magicBlock': 17}, 'offset': 10, icon: 'hat'});
addItem(22, {'slot': 'head', 'type': 'clothArmor', 'name': 'Cashmere Hood', 'bonuses': {'+block': 42, '+magicBlock': 21}, 'offset': 10, icon: 'hat'});
addItem(27, {'slot': 'head', 'type': 'clothArmor', 'name': 'Silk Hood', 'bonuses': {'+block': 50, '+magicBlock': 25}, 'offset': 10, icon: 'hat'});
addItem(32, {'slot': 'head', 'type': 'clothArmor', 'name': 'Angora Hood', 'bonuses': {'+block': 58, '+magicBlock': 29}, 'offset': 10, icon: 'hat'});
addItem(37, {'slot': 'head', 'type': 'clothArmor', 'name': 'Velvet Hood', 'bonuses': {'+block': 66, '+magicBlock': 33}, 'offset': 10, icon: 'hat'});
addItem(42, {'slot': 'head', 'type': 'clothArmor', 'name': 'Embroidered Hat', 'bonuses': {'+block': 74, '+magicBlock': 37}, 'offset': 10, icon: 'hat'});
addItem(47, {'slot': 'head', 'type': 'clothArmor', 'name': 'Wizards Hat', 'bonuses': {'+block': 82, '+magicBlock': 41}, 'offset': 10, icon: 'hat'});
addItem(52, {'slot': 'head', 'type': 'clothArmor', 'name': 'Blessed Cowl', 'bonuses': {'+block': 85, '+magicBlock': 50, '+armor': 5, '+evasion': 5, '+maxHealth': 25}, 'offset': 10, icon: 'hat'});
addItem(57, {'slot': 'head', 'type': 'clothArmor', 'name': 'Divine Cowl', 'bonuses': {'+block': 100, '+magicBlock': 60, '+armor': 10, '+evasion': 10, '+maxHealth': 50}, 'offset': 10, icon: 'hat'});

//Heavy Armor gives armor + health
addItem(1, {'slot': 'body', 'type': 'heavyArmor', 'name': 'Lamellar', 'bonuses': {'+armor': 3, '+maxHealth': 15}, 'offset': 3, icon: 'armor'});
addItem(6, {'slot': 'body', 'type': 'heavyArmor', 'name': 'Bamboo Armor', 'bonuses': {'+armor': 13, '+maxHealth': 65}, 'offset': 3, icon: 'armor'});
addItem(11, {'slot': 'body', 'type': 'heavyArmor', 'name': 'Panoply', 'bonuses': {'+armor': 23, '+maxHealth': 115}, 'offset': 3, icon: 'armor'});
addItem(16, {'slot': 'body', 'type': 'heavyArmor', 'name': 'Plated Coat', 'bonuses': {'+armor': 33, '+maxHealth': 165}, 'offset': 3, icon: 'armor'});
addItem(21, {'slot': 'body', 'type': 'heavyArmor', 'name': 'Brigandine', 'bonuses': {'+armor': 43, '+maxHealth': 215}, 'offset': 3, icon: 'armor'});
addItem(26, {'slot': 'body', 'type': 'heavyArmor', 'name': 'Cuirass', 'bonuses': {'+armor': 53, '+maxHealth': 265}, 'offset': 3, icon: 'armor'});
addItem(31, {'slot': 'body', 'type': 'heavyArmor', 'name': 'Chainmall', 'bonuses': {'+armor': 63, '+maxHealth': 315}, 'offset': 3, icon: 'armor'});
addItem(36, {'slot': 'body', 'type': 'heavyArmor', 'name': 'Scalemail', 'bonuses': {'+armor': 73, '+maxHealth': 365}, 'offset': 3, icon: 'armor'});
addItem(41, {'slot': 'body', 'type': 'heavyArmor', 'name': 'Platemail', 'bonuses': {'+armor': 83, '+maxHealth': 415}, 'offset': 3, icon: 'armor'});
addItem(46, {'slot': 'body', 'type': 'heavyArmor', 'name': 'Half Plate', 'bonuses': {'+armor': 93, '+maxHealth': 465}, 'offset': 3, icon: 'armor'});
addItem(51, {'slot': 'body', 'type': 'heavyArmor', 'name': 'Full Plate', 'bonuses': {'+armor': 103, '+maxHealth': 515}, 'offset': 3, icon: 'armor'});
addItem(61, {'slot': 'body', 'type': 'heavyArmor', 'name': 'Adamantium Plate', 'bonuses': {'+armor': 130, '+maxHealth': 700, '+evasion': 20, '+block': 20, '+magicBlock': 10, '%speed': -0.2}, 'offset': 3, icon: 'armor'});
addItem(71, {'slot': 'body', 'type': 'heavyArmor', 'name': 'Orichalcum Plate', 'bonuses': {'+armor': 120, '+maxHealth': 700, '+evasion': 20, '+block': 20, '+magicBlock': 20}, 'offset': 3, icon: 'armor'});

//Light Armor gives armor and evasion
addItem(1, {'slot': 'body', 'type': 'lightArmor', 'name': 'Cloth Tunic', 'bonuses': {'+armor': 2, '+evasion': 4}, 'offset': 3, icon: 'armor'});
addItem(6, {'slot': 'body', 'type': 'lightArmor', 'name': 'Leather Tunic', 'bonuses': {'+armor': 7, '+evasion': 19}, 'offset': 3, icon: 'armor'});
addItem(11, {'slot': 'body', 'type': 'lightArmor', 'name': 'Hide Tunic', 'bonuses': {'+armor': 12, '+evasion': 34}, 'offset': 3, icon: 'armor'});
addItem(16, {'slot': 'body', 'type': 'lightArmor', 'name': 'Leather Armor', 'bonuses': {'+armor': 17, '+evasion': 49}, 'offset': 3, icon: 'armor'});
addItem(21, {'slot': 'body', 'type': 'lightArmor', 'name': 'Studded Armor', 'bonuses': {'+armor': 22, '+evasion': 64}, 'offset': 3, icon: 'armor'});
addItem(26, {'slot': 'body', 'type': 'lightArmor', 'name': 'Hide Armor', 'bonuses': {'+armor': 27, '+evasion': 79}, 'offset': 3, icon: 'armor'});
addItem(31, {'slot': 'body', 'type': 'lightArmor', 'name': 'Carapace Armor', 'bonuses': {'+armor': 32, '+evasion': 94}, 'offset': 3, icon: 'armor'});
addItem(36, {'slot': 'body', 'type': 'lightArmor', 'name': 'Treated Armor', 'bonuses': {'+armor': 37, '+evasion': 109}, 'offset': 3, icon: 'armor'});
addItem(41, {'slot': 'body', 'type': 'lightArmor', 'name': 'Splint Armor', 'bonuses': {'+armor': 42, '+evasion': 124}, 'offset': 3, icon: 'armor'});
addItem(46, {'slot': 'body', 'type': 'lightArmor', 'name': 'Scale Armor', 'bonuses': {'+armor': 47, '+evasion': 139}, 'offset': 3, icon: 'armor'});
addItem(51, {'slot': 'body', 'type': 'lightArmor', 'name': 'Composite Armor', 'bonuses': {'+armor': 52, '+evasion': 154}, 'offset': 3, icon: 'armor'});
addItem(61, {'slot': 'body', 'type': 'lightArmor', 'name': 'Runed Armor', 'bonuses': {'+armor': 55, '+evasion': 155, '+maxHealth': 50, '+block': 10, '+magicBlock': 10}, 'offset': 3, icon: 'armor'});
addItem(71, {'slot': 'body', 'type': 'lightArmor', 'name': 'Dragon Armor', 'bonuses': {'+armor': 70, '+evasion': 170, '+maxHealth': 200, '+block': 20, '+magicBlock': 20}, 'offset': 3, icon: 'armor'});

// Cloth Armor gives armor, block and magic block
addItem(1, {'slot': 'body', 'type': 'clothArmor', 'name': 'Wool Shirt', 'bonuses': {'+armor': 1, '+block': 3, '+magicBlock': 1}, 'offset': 3, icon: 'armor'});
addItem(6, {'slot': 'body', 'type': 'clothArmor', 'name': 'Hemp Frock', 'bonuses': {'+armor': 4, '+block': 10, '+magicBlock': 6}, 'offset': 3, icon: 'armor'});
addItem(11, {'slot': 'body', 'type': 'clothArmor', 'name': 'Linen Frock', 'bonuses': {'+armor': 7, '+block': 17, '+magicBlock': 11}, 'offset': 3, icon: 'armor'});
addItem(16, {'slot': 'body', 'type': 'clothArmor', 'name': 'Cotten Frock', 'bonuses': {'+armor': 10, '+block': 24, '+magicBlock': 16}, 'offset': 3, icon: 'armor'});
addItem(21, {'slot': 'body', 'type': 'clothArmor', 'name': 'Fur Coat', 'bonuses': {'+armor': 13, '+block': 31, '+magicBlock': 21}, 'offset': 3, icon: 'armor'});
addItem(26, {'slot': 'body', 'type': 'clothArmor', 'name': 'Cashmere Robe', 'bonuses': {'+armor': 16, '+block': 38, '+magicBlock': 26}, 'offset': 3, icon: 'armor'});
addItem(31, {'slot': 'body', 'type': 'clothArmor', 'name': 'Silk Robe', 'bonuses': {'+armor': 19, '+block': 45, '+magicBlock': 31}, 'offset': 3, icon: 'armor'});
addItem(36, {'slot': 'body', 'type': 'clothArmor', 'name': 'Angora Robe', 'bonuses': {'+armor': 22, '+block': 52, '+magicBlock': 36}, 'offset': 3, icon: 'armor'});
addItem(41, {'slot': 'body', 'type': 'clothArmor', 'name': 'Velvet Robe', 'bonuses': {'+armor': 25, '+block': 59, '+magicBlock': 41}, 'offset': 3, icon: 'armor'});
addItem(46, {'slot': 'body', 'type': 'clothArmor', 'name': 'Embroidered Robe', 'bonuses': {'+armor': 28, '+block': 66, '+magicBlock': 46}, 'offset': 3, icon: 'armor'});
addItem(51, {'slot': 'body', 'type': 'clothArmor', 'name': 'Sorcerous Vestment', 'bonuses': {'+armor': 31, '+block': 73, '+magicBlock': 51}, 'offset': 3, icon: 'armor'});
addItem(61, {'slot': 'body', 'type': 'clothArmor', 'name': 'Blessed Vestment', 'bonuses': {'+armor': 40, '+block': 80, '+magicBlock': 56, '+evasion': 10, '+maxHealth': 50}, 'offset': 3, icon: 'armor'});
addItem(71, {'slot': 'body', 'type': 'clothArmor', 'name': 'Divine Vestment', 'bonuses': {'+armor': 50, '+block': 100, '+magicBlock': 75, '+evasion': 20, '+maxHealth': 100}, 'offset': 3, icon: 'armor'});

//Vambracers gives armor and health
addItem(1, {'slot': 'arms', 'type': 'heavyArmor', 'name': 'Corroded Vambracers', 'bonuses': {'+armor': 2, '+maxHealth': 10}, icon: 'item'});
addItem(3, {'slot': 'arms', 'type': 'heavyArmor', 'name': 'Bamboo Vambracers', 'bonuses': {'+armor': 10, '+maxHealth': 50}, icon: 'item'});
addItem(8, {'slot': 'arms', 'type': 'heavyArmor', 'name': 'Copper Vambracers', 'bonuses': {'+armor': 18, '+maxHealth': 90}, icon: 'item'});
addItem(13, {'slot': 'arms', 'type': 'heavyArmor', 'name': 'Bronze Vambracers', 'bonuses': {'+armor': 26, '+maxHealth': 130}, icon: 'item'});
addItem(18, {'slot': 'arms', 'type': 'heavyArmor', 'name': 'Iron Vambracers', 'bonuses': {'+armor': 34, '+maxHealth': 170}, icon: 'item'});
addItem(23, {'slot': 'arms', 'type': 'heavyArmor', 'name': 'Black Vambracers', 'bonuses': {'+armor': 42, '+maxHealth': 210}, icon: 'item'});
addItem(28, {'slot': 'arms', 'type': 'heavyArmor', 'name': 'Forged Vambracers', 'bonuses': {'+armor': 50, '+maxHealth': 250}, icon: 'item'});
addItem(33, {'slot': 'arms', 'type': 'heavyArmor', 'name': 'Steel Vambracers', 'bonuses': {'+armor': 58, '+maxHealth': 290}, icon: 'item'});
addItem(38, {'slot': 'arms', 'type': 'heavyArmor', 'name': 'Stainless Vambracers', 'bonuses': {'+armor': 66, '+maxHealth': 330}, icon: 'item'});
addItem(43, {'slot': 'arms', 'type': 'heavyArmor', 'name': 'Engraved Vambracers', 'bonuses': {'+armor': 74, '+maxHealth': 370}, icon: 'item'});
addItem(48, {'slot': 'arms', 'type': 'heavyArmor', 'name': 'Meteoric Vambracers', 'bonuses': {'+armor': 82, '+maxHealth': 410}, icon: 'item'});
addItem(58, {'slot': 'arms', 'type': 'heavyArmor', 'name': 'Adamantium Vambracers', 'bonuses': {'+armor': 110, '+maxHealth': 500, '+evasion': 10, '+block': 10, '+magicBlock': 5, '%speed': -0.05}, icon: 'item'});
addItem(68, {'slot': 'arms', 'type': 'heavyArmor', 'name': 'Orichalcum Vambracers', 'bonuses': {'+armor': 100, '+maxHealth': 550, '+evasion': 10, '+block': 10, '+magicBlock': 10}, icon: 'item'});

//Bracers gives armor and evasion
addItem(1, {'slot': 'arms', 'type': 'lightArmor', 'name': 'Rotting Bracelets', 'bonuses': {'+armor': 1, '+evasion': 3}, icon: 'item'});
addItem(3, {'slot': 'arms', 'type': 'lightArmor', 'name': 'Leather Bracelets', 'bonuses': {'+armor': 7, '+evasion': 13}, icon: 'item'});
addItem(8, {'slot': 'arms', 'type': 'lightArmor', 'name': 'Hide Bracelets', 'bonuses': {'+armor': 13, '+evasion': 23}, icon: 'item'});
addItem(13, {'slot': 'arms', 'type': 'lightArmor', 'name': 'Leather Bracers', 'bonuses': {'+armor': 19, '+evasion': 33}, icon: 'item'});
addItem(18, {'slot': 'arms', 'type': 'lightArmor', 'name': 'Hide Bracers', 'bonuses': {'+armor': 25, '+evasion': 43}, icon: 'item'});
addItem(23, {'slot': 'arms', 'type': 'lightArmor', 'name': 'Leather Bracers', 'bonuses': {'+armor': 31, '+evasion': 53}, icon: 'item'});
addItem(28, {'slot': 'arms', 'type': 'lightArmor', 'name': 'Carapace Bracers', 'bonuses': {'+armor': 37, '+evasion': 63}, icon: 'item'});
addItem(33, {'slot': 'arms', 'type': 'lightArmor', 'name': 'Padded Bracers', 'bonuses': {'+armor': 43, '+evasion': 73}, icon: 'item'});
addItem(38, {'slot': 'arms', 'type': 'lightArmor', 'name': 'Plated Bracers', 'bonuses': {'+armor': 49, '+evasion': 83}, icon: 'item'});
addItem(43, {'slot': 'arms', 'type': 'lightArmor', 'name': 'Scale Bracers', 'bonuses': {'+armor': 55, '+evasion': 93}, icon: 'item'});
addItem(48, {'slot': 'arms', 'type': 'lightArmor', 'name': 'Composite Bracers', 'bonuses': {'+armor': 61, '+evasion': 103}, icon: 'item'});
addItem(58, {'slot': 'arms', 'type': 'lightArmor', 'name': 'Runed Bracers', 'bonuses': {'+armor': 70, '+evasion': 110, '+maxHealth': 25, '+block': 5, '+magicBlock': 5}, icon: 'item'});
addItem(68, {'slot': 'arms', 'type': 'lightArmor', 'name': 'Dragon Bracers', 'bonuses': {'+armor': 80, '+evasion': 120, '+maxHealth': 100, '+block': 10, '+magicBlock': 10}, icon: 'item'});

//Gloves gives block and magic block
addItem(1, {'slot': 'arms', 'type': 'clothArmor', 'name': 'Torn Mittens', 'bonuses': {'+block': 2, '+magicBlock': 1}, icon: 'item'});
addItem(3, {'slot': 'arms', 'type': 'clothArmor', 'name': 'Hemp Mittens', 'bonuses': {'+block': 10, '+magicBlock': 5}, icon: 'item'});
addItem(8, {'slot': 'arms', 'type': 'clothArmor', 'name': 'Linen Mittens', 'bonuses': {'+block': 18, '+magicBlock': 9}, icon: 'item'});
addItem(13, {'slot': 'arms', 'type': 'clothArmor', 'name': 'Cotten Mittens', 'bonuses': {'+block': 26, '+magicBlock': 13}, icon: 'item'});
addItem(18, {'slot': 'arms', 'type': 'clothArmor', 'name': 'Fur Gloves', 'bonuses': {'+block': 34, '+magicBlock': 17}, icon: 'item'});
addItem(23, {'slot': 'arms', 'type': 'clothArmor', 'name': 'Cashmere Gloves', 'bonuses': {'+block': 42, '+magicBlock': 21}, icon: 'item'});
addItem(28, {'slot': 'arms', 'type': 'clothArmor', 'name': 'Silk Gloves', 'bonuses': {'+block': 50, '+magicBlock': 25}, icon: 'item'});
addItem(33, {'slot': 'arms', 'type': 'clothArmor', 'name': 'Angora Gloves', 'bonuses': {'+block': 58, '+magicBlock': 29}, icon: 'item'});
addItem(38, {'slot': 'arms', 'type': 'clothArmor', 'name': 'Velvet Gloves', 'bonuses': {'+block': 66, '+magicBlock': 33}, icon: 'item'});
addItem(43, {'slot': 'arms', 'type': 'clothArmor', 'name': 'Embroidered Gloves', 'bonuses': {'+block': 74, '+magicBlock': 37}, icon: 'item'});
addItem(48, {'slot': 'arms', 'type': 'clothArmor', 'name': 'Sorcerous Gloves', 'bonuses': {'+block':82, '+magicBlock': 41}, icon: 'item'});
addItem(58, {'slot': 'arms', 'type': 'clothArmor', 'name': 'Blessed Gloves', 'bonuses': {'+block': 85, '+magicBlock': 50, '+armor': 5, '+evasion': 5, '+maxHealth': 25}, icon: 'item'});
addItem(68, {'slot': 'arms', 'type': 'clothArmor', 'name': 'Divine Gloves', 'bonuses': {'+block': 100, '+magicBlock': 60, '+armor': 10, '+evasion': 10, '+maxHealth': 50}, icon: 'item'});

//Greaves gives armor and health
addItem(1, {'slot': 'legs', 'type': 'heavyArmor', 'name': 'Corroded Skirt', 'bonuses': {'+armor': 3, '+maxHealth': 10}, icon: 'item'});
addItem(4, {'slot': 'legs', 'type': 'heavyArmor', 'name': 'Bamboo Skirt', 'bonuses': {'+armor': 12, '+maxHealth': 55}, icon: 'item'});
addItem(9, {'slot': 'legs', 'type': 'heavyArmor', 'name': 'Copper Skirt', 'bonuses': {'+armor': 21, '+maxHealth': 100}, icon: 'item'});
addItem(14, {'slot': 'legs', 'type': 'heavyArmor', 'name': 'Bronze Greaves', 'bonuses': {'+armor': 30, '+maxHealth': 145}, icon: 'item'});
addItem(19, {'slot': 'legs', 'type': 'heavyArmor', 'name': 'Iron Greaves', 'bonuses': {'+armor': 39, '+maxHealth': 190}, icon: 'item'});
addItem(24, {'slot': 'legs', 'type': 'heavyArmor', 'name': 'Black Greaves', 'bonuses': {'+armor': 48, '+maxHealth': 235}, icon: 'item'});
addItem(29, {'slot': 'legs', 'type': 'heavyArmor', 'name': 'Forged Greaves', 'bonuses': {'+armor': 57, '+maxHealth': 280}, icon: 'item'});
addItem(34, {'slot': 'legs', 'type': 'heavyArmor', 'name': 'Steel Greaves', 'bonuses': {'+armor': 66, '+maxHealth': 325}, icon: 'item'});
addItem(39, {'slot': 'legs', 'type': 'heavyArmor', 'name': 'Stainless Greaves', 'bonuses': {'+armor': 75, '+maxHealth': 370}, icon: 'item'});
addItem(44, {'slot': 'legs', 'type': 'heavyArmor', 'name': 'Engraved Greaves', 'bonuses': {'+armor': 84, '+maxHealth': 415}, icon: 'item'});
addItem(49, {'slot': 'legs', 'type': 'heavyArmor', 'name': 'Meteoric Greaves', 'bonuses': {'+armor': 93, '+maxHealth': 460}, icon: 'item'});
addItem(59, {'slot': 'legs', 'type': 'heavyArmor', 'name': 'Adamantium Greaves', 'bonuses': {'+armor': 110, '+maxHealth': 550, '+evasion': 20, '+block': 20, '+magicBlock': 10, '%speed': -0.1}, icon: 'item'});
addItem(69, {'slot': 'legs', 'type': 'heavyArmor', 'name': 'Orichalcum Greaves', 'bonuses': {'+armor': 100, '+maxHealth': 550, '+evasion': 20, '+block': 20, '+magicBlock': 20}, icon: 'item'});

//Pants gives evasion and armor
addItem(1, {'slot': 'legs', 'type': 'lightArmor', 'name': 'Worn Kilt', 'bonuses': {'+armor': 2, '+evasion': 3}, icon: 'item'});
addItem(4, {'slot': 'legs', 'type': 'lightArmor', 'name': 'Leather Kilt', 'bonuses': {'+armor': 10, '+evasion': 13}, icon: 'item'});
addItem(9, {'slot': 'legs', 'type': 'lightArmor', 'name': 'Hide Kilt', 'bonuses': {'+armor': 18, '+evasion': 23}, icon: 'item'});
addItem(14, {'slot': 'legs', 'type': 'lightArmor', 'name': 'Leather Pants', 'bonuses': {'+armor': 26, '+evasion': 33}, icon: 'item'});
addItem(19, {'slot': 'legs', 'type': 'lightArmor', 'name': 'Studded Pants', 'bonuses': {'+armor': 34, '+evasion': 43}, icon: 'item'});
addItem(24, {'slot': 'legs', 'type': 'lightArmor', 'name': 'Hide Pants', 'bonuses': {'+armor': 42, '+evasion': 53}, icon: 'item'});
addItem(29, {'slot': 'legs', 'type': 'lightArmor', 'name': 'Carapace Pants', 'bonuses': {'+armor': 50, '+evasion': 63}, icon: 'item'});
addItem(34, {'slot': 'legs', 'type': 'lightArmor', 'name': 'Padded Pants', 'bonuses': {'+armor': 58, '+evasion': 73}, icon: 'item'});
addItem(39, {'slot': 'legs', 'type': 'lightArmor', 'name': 'Plated Pants', 'bonuses': {'+armor': 66, '+evasion': 83}, icon: 'item'});
addItem(44, {'slot': 'legs', 'type': 'lightArmor', 'name': 'Scale Pants', 'bonuses': {'+armor': 74, '+evasion': 93}, icon: 'item'});
addItem(49, {'slot': 'legs', 'type': 'lightArmor', 'name': 'Composite Pants', 'bonuses': {'+armor': 82, '+evasion': 103}, icon: 'item'});
addItem(59, {'slot': 'legs', 'type': 'lightArmor', 'name': 'Runed Pants', 'bonuses': {'+armor': 85, '+evasion': 115, '+maxHealth': 50, '+block': 10, '+magicBlock': 10}, icon: 'item'});
addItem(69, {'slot': 'legs', 'type': 'lightArmor', 'name': 'Dragon Pants', 'bonuses': {'+armor': 90, '+evasion': 120, '+maxHealth': 100, '+block': 20, '+magicBlock': 20}, icon: 'item'});

//Tights gives block and magic block
addItem(1, {'slot': 'legs', 'type': 'clothArmor', 'name': 'Tattered Shorts', 'bonuses': {'+block': 3, '+magicBlock': 1}, icon: 'item'});
addItem(4, {'slot': 'legs', 'type': 'clothArmor', 'name': 'Hemp Shorts', 'bonuses': {'+block': 11, '+magicBlock': 6}, icon: 'item'});
addItem(9, {'slot': 'legs', 'type': 'clothArmor', 'name': 'Linen Shorts', 'bonuses': {'+block': 19, '+magicBlock': 11}, icon: 'item'});
addItem(14, {'slot': 'legs', 'type': 'clothArmor', 'name': 'Cotten Shorts', 'bonuses': {'+block': 27, '+magicBlock': 16}, icon: 'item'});
addItem(19, {'slot': 'legs', 'type': 'clothArmor', 'name': 'Fur Tights', 'bonuses': {'+block': 35, '+magicBlock': 21}, icon: 'item'});
addItem(24, {'slot': 'legs', 'type': 'clothArmor', 'name': 'Cashmere Tights', 'bonuses': {'+block': 43, '+magicBlock': 26}, icon: 'item'});
addItem(29, {'slot': 'legs', 'type': 'clothArmor', 'name': 'Silk Tights', 'bonuses': {'+block': 51, '+magicBlock': 31}, icon: 'item'});
addItem(34, {'slot': 'legs', 'type': 'clothArmor', 'name': 'Angora Tights', 'bonuses': {'+block': 59, '+magicBlock': 36}, icon: 'item'});
addItem(39, {'slot': 'legs', 'type': 'clothArmor', 'name': 'Velvet Tights', 'bonuses': {'+block': 67, '+magicBlock': 41}, icon: 'item'});
addItem(44, {'slot': 'legs', 'type': 'clothArmor', 'name': 'Embroidered Tights', 'bonuses': {'+block': 75, '+magicBlock': 46}, icon: 'item'});
addItem(49, {'slot': 'legs', 'type': 'clothArmor', 'name': 'Sorcerous Tights', 'bonuses': {'+block': 83, '+magicBlock': 51}, icon: 'item'});
addItem(59, {'slot': 'legs', 'type': 'clothArmor', 'name': 'Blessed Tights', 'bonuses': {'+block': 90, '+magicBlock': 60, '+armor': 10, '+evasion': 10, '+maxHealth': 50}, icon: 'item'});
addItem(69, {'slot': 'legs', 'type': 'clothArmor', 'name': 'Divine Tights', 'bonuses': {'+block': 100, '+magicBlock': 70, '+armor': 20, '+evasion': 20, '+maxHealth': 50}, icon: 'item'});


//Sabatons gives armor and health
addItem(1, {'slot': 'feet', 'type': 'heavyArmor', 'name': 'Corroded Sabatons', 'bonuses': {'+armor': 2, '+maxHealth': 5, '+speed': -50}, 'offset': 8, icon: 'boots'});
addItem(5, {'slot': 'feet', 'type': 'heavyArmor', 'name': 'Bamboo Sabatons', 'bonuses': {'+armor': 9, '+maxHealth': 45, '+speed': -25}, 'offset': 8, icon: 'boots'});
addItem(10, {'slot': 'feet', 'type': 'heavyArmor', 'name': 'Copper Sabatons', 'bonuses': {'+armor': 16, '+maxHealth': 85, '+speed': -50}, 'offset': 8, icon: 'boots'});
addItem(15, {'slot': 'feet', 'type': 'heavyArmor', 'name': 'Bronze Sabatons', 'bonuses': {'+armor': 23, '+maxHealth': 125, '+speed': -60}, 'offset': 8, icon: 'boots'});
addItem(20, {'slot': 'feet', 'type': 'heavyArmor', 'name': 'Iron Sabatons', 'bonuses': {'+armor': 30, '+maxHealth': 165, '+speed': -70}, 'offset': 8, icon: 'boots'});
addItem(25, {'slot': 'feet', 'type': 'heavyArmor', 'name': 'Black Sabatons', 'bonuses': {'+armor': 37, '+maxHealth': 205, '+speed': -80}, 'offset': 8, icon: 'boots'});
addItem(30, {'slot': 'feet', 'type': 'heavyArmor', 'name': 'Forged Sabatons', 'bonuses': {'+armor': 44, '+maxHealth': 245, '+speed': -90}, 'offset': 8, icon: 'boots'});
addItem(35, {'slot': 'feet', 'type': 'heavyArmor', 'name': 'Steel Sabatons', 'bonuses': {'+armor': 51, '+maxHealth': 285, '+speed': -100}, 'offset': 8, icon: 'boots'});
addItem(40, {'slot': 'feet', 'type': 'heavyArmor', 'name': 'Stainless Sabatons', 'bonuses': {'+armor': 58, '+maxHealth': 325, '+speed': -100}, 'offset': 8, icon: 'boots'});
addItem(45, {'slot': 'feet', 'type': 'heavyArmor', 'name': 'Engraved Sabatons', 'bonuses': {'+armor': 65, '+maxHealth': 365, '+speed': -100}, 'offset': 8, icon: 'boots'});
addItem(50, {'slot': 'feet', 'type': 'heavyArmor', 'name': 'Meteoric Sabatons', 'bonuses': {'+armor': 72, '+maxHealth': 405, '+speed': -100}, 'offset': 8, icon: 'boots'});
addItem(55, {'slot': 'feet', 'type': 'heavyArmor', 'name': 'Adamantium Sabatons', 'bonuses': {'+armor': 100, '+maxHealth': 500, '+evasion': 10, '+block': 10, '+magicBlock': 10, '%speed': -0.1}, 'offset': 8, icon: 'boots'});
addItem(60, {'slot': 'feet', 'type': 'heavyArmor', 'name': 'Orichalcum Sabatons', 'bonuses': {'+armor': 90, '+maxHealth': 500, '+evasion': 10, '+block': 10, '+magicBlock': 20}, 'offset': 8, icon: 'boots'});

//Boots gives armor and evasion
addItem(1, {'slot': 'feet', 'type': 'lightArmor', 'name': 'Worn Shoes', 'bonuses': {'+armor': 1, '+evasion': 2, '+speed': -25}, 'offset': 8, icon: 'boots'});
addItem(5, {'slot': 'feet', 'type': 'lightArmor', 'name': 'Leather Shoes', 'bonuses': {'+armor': 6, '+evasion': 10, '+speed': -10}, 'offset': 8, icon: 'boots'});
addItem(10, {'slot': 'feet', 'type': 'lightArmor', 'name': 'Hide Shoes', 'bonuses': {'+armor': 11, '+evasion': 18, '+speed': -20}, 'offset': 8, icon: 'boots'});
addItem(15, {'slot': 'feet', 'type': 'lightArmor', 'name': 'Leather Boots', 'bonuses': {'+armor': 16, '+evasion': 26, '+speed': -30}, 'offset': 8, icon: 'boots'});
addItem(20, {'slot': 'feet', 'type': 'lightArmor', 'name': 'Studded Boots', 'bonuses': {'+armor': 21, '+evasion': 34, '+speed': -40}, 'offset': 8, icon: 'boots'});
addItem(25, {'slot': 'feet', 'type': 'lightArmor', 'name': 'Hide Boots', 'bonuses': {'+armor': 26, '+evasion': 42, '+speed': -50}, 'offset': 8, icon: 'boots'});
addItem(30, {'slot': 'feet', 'type': 'lightArmor', 'name': 'Carapace Boots', 'bonuses': {'+armor': 31, '+evasion': 50, '+speed': -50}, 'offset': 8, icon: 'boots'});
addItem(35, {'slot': 'feet', 'type': 'lightArmor', 'name': 'Padded Boots', 'bonuses': {'+armor': 36, '+evasion': 58, '+speed': -50}, 'offset': 8, icon: 'boots'});
addItem(40, {'slot': 'feet', 'type': 'lightArmor', 'name': 'Plated Boots', 'bonuses': {'+armor': 41, '+evasion': 66, '+speed': -50}, 'offset': 8, icon: 'boots'});
addItem(45, {'slot': 'feet', 'type': 'lightArmor', 'name': 'Scale Boots', 'bonuses': {'+armor': 46, '+evasion': 74, '+speed': -50}, 'offset': 8, icon: 'boots'});
addItem(50, {'slot': 'feet', 'type': 'lightArmor', 'name': 'Composite Boots', 'bonuses': {'+armor': 51, '+evasion': 82, '+speed': -50}, 'offset': 8, icon: 'boots'});
addItem(55, {'slot': 'feet', 'type': 'lightArmor', 'name': 'Runed Boots', 'bonuses': {'+armor': 60, '+evasion': 90, '+maxHealth': 25, '+block': 5, '+magicBlock': 5, '+speed': -50}, 'offset': 8, icon: 'boots'});
addItem(60, {'slot': 'feet', 'type': 'lightArmor', 'name': 'Dragon Boots', 'bonuses': {'+armor': 70, '+evasion': 110,'+maxHealth': 100, '+block': 10, '+magicBlock': 20}, 'offset': 8, icon: 'boots'});

//Sandlals/Slippers gives block and magic block
addItem(1, {'slot': 'feet', 'type': 'clothArmor', 'name': 'Broken Sandals', 'bonuses': {'+block': 1, '+magicBlock': 1, '+speed': -10}, 'offset': 8, icon: 'boots'});
addItem(5, {'slot': 'feet', 'type': 'clothArmor', 'name': 'Leather Sandals', 'bonuses': {'+block': 5, '+magicBlock': 5, '+speed': 10}, 'offset': 8, icon: 'boots'});
addItem(10, {'slot': 'feet', 'type': 'clothArmor', 'name': 'Winged Sandals', 'bonuses': {'+block': 9, '+magicBlock': 9, '+speed': 50}, 'offset': 8, icon: 'boots'});
addItem(15, {'slot': 'feet', 'type': 'clothArmor', 'name': 'Cotton Slippers', 'bonuses': {'+block': 13, '+magicBlock': 13, '+speed': 40}, 'offset': 8, icon: 'boots'});
addItem(20, {'slot': 'feet', 'type': 'clothArmor', 'name': 'Fur Slippers', 'bonuses': {'+block': 17, '+magicBlock': 17, '+speed': 50}, 'offset': 8, icon: 'boots'});
addItem(25, {'slot': 'feet', 'type': 'clothArmor', 'name': 'Cashmere Slippers', 'bonuses': {'+block': 21, '+magicBlock': 21, '+speed': 60}, 'offset': 8, icon: 'boots'});
addItem(30, {'slot': 'feet', 'type': 'clothArmor', 'name': 'Silk Slippers', 'bonuses': {'+block': 25, '+magicBlock': 25, '+speed': 70}, 'offset': 8, icon: 'boots'});
addItem(35, {'slot': 'feet', 'type': 'clothArmor', 'name': 'Angora Slippers', 'bonuses': {'+block': 29, '+magicBlock': 29, '+speed': 80}, 'offset': 8, icon: 'boots'});
addItem(40, {'slot': 'feet', 'type': 'clothArmor', 'name': 'Velvet Slippers', 'bonuses': {'+block': 33, '+magicBlock': 33, '+speed': 90}, 'offset': 8, icon: 'boots'});
addItem(45, {'slot': 'feet', 'type': 'clothArmor', 'name': 'Embroidered Slippers', 'bonuses': {'+block': 37, '+magicBlock': 37, '+speed': 100}, 'offset': 8, icon: 'boots'});
addItem(50, {'slot': 'feet', 'type': 'clothArmor', 'name': 'Sourcerous Slippers', 'bonuses': {'+block': 41, '+magicBlock': 41, '+speed': 110}, 'offset': 8, icon: 'boots'});
addItem(55, {'slot': 'feet', 'type': 'clothArmor', 'name': 'Blessed Sandals', 'bonuses': {'+block': 50, '+magicBlock': 50, '+armor': 5, '+evasion': 5, '+maxHealth': 25, '+speed': 150}, 'offset': 8, icon: 'boots'});
addItem(60, {'slot': 'feet', 'type': 'clothArmor', 'name': 'Divine Sandals', 'bonuses': {'+block': 70, '+magicBlock': 60, '+armor': 10, '+evasion': 10, '+maxHealth': 50, '%speed': 0.25}, 'offset': 8, icon: 'boots'});

// TODO: Add unique "Sticky, Sticky Bow of Aiming and Leeching and Leeching and Aiming"
var itemsByKey = {};
items[0].forEach(function (item) {
    var key = item.name.replace(/\s*/g, '').toLowerCase();
    itemsByKey[key] = item;
});

$(document).on('keydown', function(event) {
    if (event.which == 83) { // 's'
        if (isMouseOver($('.js-inventory'))) {
            $('.js-inventory .js-item').each(function (index) {
                if (isMouseOver($(this))) {
                    var item = $(this).data('item');
                    sellItem(item);
                    return false;
                }
                return true;
            });
        }
    }
    if (event.which == 68) { // 'd'
        gain('AP', 1000);
        gain('IP', 1000);
        gain('MP', 1000);
        gain('RP', 1000);
        gain('UP', 1000);
    }
    if (event.which == 76) { // 'l'
        state.characters.forEach(function (character) {
            gainXP(character.adventurer, character.adventurer.xpToLevel);
        });
    }
    console.log(event.which);
});

$('.js-raritySelect').on('change', updateItemCrafting);
$('.js-levelSelect').on('change', updateItemCrafting);
$('.js-typeSelect').on('change', updateItemCrafting);
var craftingPointsType = 'IP';
var itemsFilteredByType = [];
var itemTotalCost = 5;
var craftingLevel = 1;
function updateItemCrafting() {
    var rarity = $('.js-raritySelect').val();
    craftingLevel = $('.js-levelSelect').val();
    var type = $('.js-typeSelect').val();
    var playerCurrency = 0;
    if (rarity == 'plain') {
        craftingPointsType = 'IP'
    } else if (rarity === 'enchanted') {
        craftingPointsType = 'MP'
    } else if (rarity === 'imbued') {
        craftingPointsType = 'RP'
    }
    var itemsFilteredByLevel = [];
    itemsFilteredByType = [];
    for (var itemLevel = 0; itemLevel < craftingLevel && itemLevel < items.length; itemLevel++) {
        items[itemLevel].forEach(function (item) {
            itemsFilteredByLevel.push(item);
            if (itemMatchesFilter(item, type)) {
                itemsFilteredByType.push(item);
            }
        });
    }
    var typeMultiplier = (itemsFilteredByLevel.length / itemsFilteredByType.length).toFixed(2);
    $('.js-rarityCost').html(points(craftingPointsType, 5));
    var levelMultiplier = craftingLevel * craftingLevel * craftingLevel;
    $('.js-levelMultiplier').text('x ' + levelMultiplier);
    $('.js-typeMultiplier').text('x ' + typeMultiplier);
    itemTotalCost = Math.ceil(5 * levelMultiplier * typeMultiplier);
    $('.js-craftItem').html('Craft for ' + points(craftingPointsType, itemTotalCost));
    updateCraftButton();
}
$('.js-craftItem').on('click', function () {
    if (!spend(craftingPointsType, itemTotalCost)) {
        return;
    }
    var item = makeItem(Random.element(itemsFilteredByType), craftingLevel);
    if (craftingPointsType == 'MP') {
        enchantItemProper(item);
    } else if (craftingPointsType == 'RP') {
        imbueItemProper(item);
    }
    updateItem(item);
    $('.js-inventory').prepend(item.$item);
});
function updateCraftButton() {
    $('.js-craftItem').prop('disabled', itemTotalCost > state[craftingPointsType]);
}

function itemMatchesFilter(item, typeFilter) {
    switch (typeFilter) {
        case 'all':
            return true;
        case 'weapon':
        case 'head':
        case 'body':
        case 'feet':
        case 'arms':
        case 'legs':
        case 'ring':
        case 'back':
        case 'offhand':
            return item.slot === typeFilter;
        case 'armor':
            return armorSlots.indexOf(item.slot) >= 0;
        case 'accessory':
            return item.slot == 'ring' || item.slot == 'back';
        default:
            return false;
    }
}
