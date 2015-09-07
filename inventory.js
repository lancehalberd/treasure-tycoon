function equipItem(character, item) {
    if (character.equipment[item.base.slot]) {
        console.log("Tried to equip an item without first unequiping!");
        return;
    }
    item.$item.detach();
    character.equipment[item.base.slot] = item;
    updateCharacter(character);
}
function sellValue(item) {
    return item.level * item.level * item.level;
}
function isEquiped(character, item) {
    return character.equipment[item.base.slot] === item;
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
        if (total < 2) points.push(sellValue(item) * total + ' MP');
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
        sections.push((100 * bonuses['%maxHealth']) + '% increased health');
    }
    if (ifdefor(bonuses['%attackSpeed'])) {
        sections.push((100 * bonuses['%attackSpeed']) + '% increased attack speed');
    }
    if (ifdefor(bonuses['+slowOnHit'])) {
        sections.push('Slows target by ' + (100 * bonuses['+slowOnHit']) + '%');
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
        sourceCharacter.equipment[item.base.slot] = null;
        updateCharacter(sourceCharacter);
    }
    item.$item.remove();
    item.$item = null;
    gain('IP', sellValue(item));
    var total = item.prefixes.length + item.suffixes.length;
    if (total) {
        if (total < 2) gain('MP', sellValue(item) * total);
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
                character.equipment[item.base.slot] = null;
                updateCharacter(character);
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
                    var current = targetCharacter.equipment[item.base.slot];
                    targetCharacter.equipment[item.base.slot] = null;
                    if (sourceCharacter) {
                        sourceCharacter.equipment[item.base.slot] = null;
                        if (!current) {
                            updateCharacter(sourceCharacter);
                        }
                    } else {
                        //unequip the existing item.
                        if (current) {
                            current.$item.detach();
                            $('.js-inventory').append(current.$item);
                        }
                    }
                    var $parent = $source.parent();
                    equipItem(targetCharacter, item);
                    if (sourceCharacter && current) {
                        equipItem(sourceCharacter, current);
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
                    character.equipment[item.base.slot] = null;
                    updateCharacter(character);
                }
                $source.detach();
                $target.before($source);
            }
        }
        if (!hit && collision($dragHelper, $('.js-inventory'))) {
            var character = $source.closest('.js-playerPanel').data('character');
            if (character) {
                character.equipment[item.base.slot] = null;
                updateCharacter(character);
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
var armorSlots = ['body', 'feet', 'head', 'offhand'];
var equipmentSlots = ['weapon', 'body', 'feet', 'head', 'offhand'];
var items = [
    [
        {'slot': 'weapon', 'type': 'axe',  'name': 'Axe', 'bonuses': {'+minDamage': 3, '+maxDamage': 6, '+range': 2, '+attackSpeed': 1.5}, 'icon': 'axe'},
        {'slot': 'weapon', 'type': 'sword', 'name': 'Dagger', 'bonuses': {'+minDamage': 2, '+maxDamage': 5, '+range': 2, '+attackSpeed': 2}, 'icon': 'sword'},
        {'slot': 'weapon', 'type': 'bow',  'name': 'Bow', 'bonuses': {'+minDamage': 3, '+maxDamage': 6, '+range': 10, '+attackSpeed': 1}, 'icon': 'bow'},
        {'slot': 'weapon', 'type': 'wand',  'name': 'Wand', 'bonuses': {'+minDamage': 0, '+maxDamage': 1, '+minMagicDamage': 1, '+maxMagicDamage': 2, '+range': 7, '+attackSpeed': 1.5}, 'icon': 'wand'},
        {'slot': 'offhand', 'type': 'shield',  'name': 'Small Shield', 'bonuses': {'+block': 2, '+armor': 2}, 'icon': 'shield'},
        {'slot': 'feet', 'type': 'boots',  'name': 'Steel Boots', 'bonuses': {'+speed': -50, '+armor': 1, '+block': 2}, 'offset': 8, icon: 'boots'},
        {'slot': 'body', 'type': 'tunic',  'name': 'Tunic', 'bonuses': {'+evasion': 2}, 'offset': 1, icon: 'armor'},
        {'slot': 'body', 'type': 'armor',  'name': 'Chainmail', 'bonuses': {'+armor': 2}, 'offset': 2, icon: 'armor'},
        {'slot': 'body', 'type': 'tunic',  'name': 'Leather Vest', 'bonuses': {'+maxHealth': 10}, 'offset': 3, icon: 'armor'},
        {'slot': 'head', 'type': 'helmet',  'name': 'Ribbon', 'bonuses': {'+evasion': 1}, icon: 'hat'},
    ],
    [
        {'slot': 'feet', 'type': 'boots',  'name': 'Swift Boots', 'bonuses': {'+speed': 25, '%attackSpeed': .1}, 'offset': 8, icon: 'boots'},
        {'slot': 'head', 'type': 'helmet',  'name': 'Helmet', 'bonuses': {'+armor': 1, '+block': 1, '+evasion': 1}, 'offset': 9, icon: 'hat', hideHair: true},
        {'slot': 'head', 'type': 'helmet',  'name': 'Oversized Helm', 'bonuses': {'+armor': 2, '+accuracy': -1}, 'offset': 10, icon: 'hat'},
        //Leon Made Main Hands
        {'slot': 'weapon', 'type': 'sword', 'name': 'Knife', 'bonuses': {'+minDamage': 4, '+maxDamage': 8, '+range': 2, '+attackSpeed': 1.85}, 'icon': 'sword'},
        {'slot': 'weapon', 'type': 'bow',  'name': 'Crossbow', 'bonuses': {'+minDamage': 5, '+maxDamage': 9, '+range': 9, '+attackSpeed': 1.2}, 'icon': 'bow'},
        {'slot': 'weapon', 'type': 'axe',  'name': 'Labrys', 'bonuses': {'+minDamage': 7, '+maxDamage': 10, '+range': 2, '+attackSpeed': 1.4}, 'icon': 'axe'},
        {'slot': 'weapon', 'type': 'wand',  'name': 'Carved Wand', 'bonuses': {'+minDamage': 1, '+maxDamage': 3, '+minMagicDamage': 2, '+maxMagicDamage': 5, '+range': 7, '+attackSpeed': 1.6}, 'icon': 'wand'},
        {'slot': 'weapon', 'type': 'sword', 'name': 'Short Sword', 'bonuses': {'+minDamage': 5, '+maxDamage': 8, '+range': 2, '+attackSpeed': 1.7}, 'icon': 'sword'},
        {'slot': 'weapon', 'type': 'bow',  'name': 'Blow Gun', 'bonuses': {'+minDamage': 3, '+maxDamage':  7, '+range': 8, '+attackSpeed': 1.6}, 'icon': 'bow'},
        {'slot': 'weapon', 'type': 'staff',  'name': 'Wooden Staff', 'bonuses': {'+minDamage': 3, '+maxDamage': 5, '+minMagicDamage': 1, '+maxMagicDamage': 3, '+range': 2, '+attackSpeed': 1.2}, 'icon': 'wand'},
        {'slot': 'weapon', 'type': 'glove',  'name': 'Brass Knuckles', 'bonuses': {'+minDamage': 4, '+maxDamage': 6, '+range': 1, '+attackSpeed': 2.2}, 'icon': 'glove'}
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
    $('.js-rarityCost').text('5 ' + craftingPointsType);
    var levelMultiplier = craftingLevel * craftingLevel * craftingLevel;
    $('.js-levelMultiplier').text('x ' + levelMultiplier);
    $('.js-typeMultiplier').text('x ' + typeMultiplier);
    itemTotalCost = Math.ceil(5 * levelMultiplier * typeMultiplier);
    $('.js-craftItem').text('Craft for ' + itemTotalCost + ' ' + craftingPointsType);
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
        case 'offhand':
            return item.slot === typeFilter;
        case 'armor':
            return armorSlots.indexOf(item.slot) >= 0;
        default:
            return true;
    }
}
