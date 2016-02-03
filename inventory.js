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
function evaluateForDisplay(value) {
    if (typeof value === 'number') {
        return value;
    }
    if (typeof value === 'string' && value.charAt(0) === '{') {
        return tag('span', 'formulaStat', value.substring(1, value.length - 1));
    }
    if (value.constructor !== Array && value.stats) {
        return bonusHelpText(value.stats);
    }
    var formula = value;
    if (!formula || !formula.length) {
        throw new Error('Expected "formula" to be an array, but value is: ' + formula);
    }
    formula = formula.slice();
    value = evaluateForDisplay(formula.shift());
    while (formula.length > 1) {
        value += ' ' + formula.shift() + ' ' + evaluateForDisplay(formula.shift());
        if (formula.length > 1) {
            value = '(' + value + ')';
        }
    }
    return value;
}
function bonusHelpText(rawBonuses, implicit) {
    var bonuses = {};
    $.each(rawBonuses, function (key, value) {
        bonuses[key] = evaluateForDisplay(value);
    });
    var sections = [];
    if (ifdefor(bonuses['+minDamage']) != null) {
        if (implicit) sections.push('Damage: ' + bonuses['+minDamage'] + ' to ' + bonuses['+maxDamage']);
        else sections.push(bonuses['+minDamage'] + ' to ' + bonuses['+maxDamage'] + ' increased damage');
    }
    if (ifdefor(bonuses['+minMagicDamage'] != null)) {
        if (implicit) sections.push('Magic: ' + bonuses['+minMagicDamage'] + ' to ' + bonuses['+maxMagicDamage']);
        else sections.push(bonuses['+minMagicDamage'] + ' to ' + bonuses['+maxMagicDamage'] + ' increased magic damage');
    }
    if (ifdefor(bonuses['%damage'] != null)) {
        sections.push((100 * bonuses['%damage']).format(1) + '% increased damage');
    }
    if (ifdefor(bonuses['%magicDamage'] != null)) {
        sections.push((100 * bonuses['%magicDamage']).format(1) + '% increased magic damage');
    }
    if (ifdefor(bonuses['+dexterity']) != null) {
        sections.push('+' + bonuses['+dexterity'].format(1) + ' Dexterity');
    }
    if (ifdefor(bonuses['+strength']) != null) {
        sections.push('+' + bonuses['+strength'].format(1) + ' Strength');
    }
    if (ifdefor(bonuses['+intelligence']) != null) {
        sections.push('+' + bonuses['+intelligence'].format(1) + ' Intelligence');
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
    if (ifdefor(bonuses['%evasion'] != null)) {
        sections.push((100 * bonuses['%evasion']).format(1) + '% increased evasion');
    }
    if (ifdefor(bonuses['+evasion'])) {
        if (implicit) sections.push('Evasion: ' + bonuses['+evasion']);
        else sections.push(bonuses['+evasion'] + ' increased evasion');
    }
    if (ifdefor(bonuses['+block'])) {
        if (implicit) sections.push('Block: ' + bonuses['+block']);
        else sections.push(bonuses['+block'] + ' increased block');
    }
    if (ifdefor(bonuses['+magicBlock'])) {
        if (implicit) sections.push('Magic Block: ' + bonuses['+magicBlock']);
        else sections.push(bonuses['+magicBlock'] + ' increased magic block');
    }
    if (ifdefor(bonuses['+maxHealth'])) {
        sections.push('+' + bonuses['+maxHealth'] + ' health');
    }
    if (ifdefor(bonuses['+healthGainOnHit'])) {
        sections.push('Gain ' + bonuses['+healthGainOnHit'] + ' health on hit');
    }
    if (ifdefor(bonuses['+healthRegen'])) {
        sections.push('Regenerates ' + bonuses['+healthRegen'].format(1) + ' health per second');
    }
    if (ifdefor(bonuses['%maxHealth'])) {
        sections.push((100 * bonuses['%maxHealth']).format(1) + '% increased health');
    }
    if (ifdefor(bonuses['%attackSpeed'])) {
        sections.push((100 * bonuses['%attackSpeed']).format(1) + '% increased attack speed');
    }
    if (ifdefor(bonuses['+critChance'])) {
        if (implicit) sections.push((100 * bonuses['+critChance']).format(0) + '% critical strike chance');
        else sections.push('Additional ' + (100 * bonuses['+critChance']).format(0) + '% chance to critical strike');
    }
    if (ifdefor(bonuses['%critChance'])) {
        sections.push((100 * bonuses['%critChance']).format(1) + '% increased critical chance');
    }
    if (ifdefor(bonuses['+critDamage'])) {
        sections.push((100 * bonuses['+critDamage']).format(1) + '% increased critical damage');
    }
    if (ifdefor(bonuses['+critAccuracy'])) {
        sections.push((100 * bonuses['+critAccuracy']).format(1) + '% increased critical accuracy');
    }
    if (ifdefor(bonuses['%accuracy'])) {
        sections.push((100 * bonuses['%accuracy']).format(1) + '% increased accuracy');
    }
    if (ifdefor(bonuses['+slowOnHit'])) {
        sections.push('Slows target by ' + (100 * bonuses['+slowOnHit']).format(0) + '%');
    }
    if (ifdefor(bonuses['+speed'])) {
        sections.push((bonuses['+speed'] > 0 ? '+' : '') + bonuses['+speed'] + ' speed');
    }
    if (ifdefor(bonuses['+accuracy'])) {
        sections.push((bonuses['+accuracy'] > 0 ? '+' : '') + bonuses['+accuracy'] + ' accuracy');
    }
    if (ifdefor(bonuses['duration'])) { // Buffs/debuffs only.
        sections.push('For ' + bonuses.duration + ' seconds');
        return tag('div', 'buffText', sections.join('<br/>'));
    }
    return sections.join('<br/>');
}
// Wrapper for toFixed that strips trailing '0's and '.'s.
// Foundt at http://stackoverflow.com/questions/7312468/javascript-round-to-a-number-of-decimal-places-but-strip-extra-zeros
Number.prototype.format = function (digits) {
    return parseFloat(this.toFixed(digits));
}
String.prototype.format = function (digits) {
    return this;
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
    $('.js-mouseContainer').append($dragHelper);
    updateDragHelper();
    dragged = false;
    var item = $(this).data('item');
    $('.js-equipment .js-' + item.base.slot).addClass('active');
    $('.js-enchantmentSlot').addClass('active');
});

function updateDragHelper() {
    if (!$dragHelper) {
        return;
    }
    $dragHelper.css('left', (mousePosition[0] - $dragHelper.width() / 2) + 'px');
    $dragHelper.css('top', (mousePosition[1] - $dragHelper.height() / 2) + 'px');
    dragged = true;
}

$(document).on("mousemove", function (event) {
    updateDragHelper();
});

function stopDrag() {
    if ($dragHelper) {
        var $source = $dragHelper.data('$source');
        // If this doesn't have item data, it must be a jewel.
        if (!$source) {
            stopJewelDrag();
            return;
        }
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
    $('.js-itemSlot.active').removeClass('active');
}
var armorSlots = ['body', 'feet', 'head', 'offhand', 'arms', 'legs'];
var equipmentSlots = ['weapon', 'body', 'feet', 'head', 'offhand', 'arms', 'legs', 'back', 'ring'];
var accessorySlots = ['back', 'ring'];
var items = [
    [
        {'slot': 'weapon', 'type': 'axe',  'name': 'Axe', 'bonuses': {'+minDamage': 3, '+maxDamage': 6, '+range': 1.5, '+attackSpeed': 1.5, '+critChance': .05 }, 'icon': 'axe'},
        {'slot': 'weapon', 'type': 'bow',  'name': 'Bow', 'bonuses': {'+minDamage': 3, '+maxDamage': 4, '+range': 8, '+attackSpeed': 1}, 'icon': 'bow', '+critChance': .05},
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

$(document).on('keydown', function(event) {
    if (event.which == 83) { // 's'
        if (overJewel) {
            sellJewel(overJewel);
            overJewel = null;
            return;
        }
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
        state.characters.forEach(function (character) {
            $.each(levels, function (key) {
                if (!character.$panel.find('.js-area-' + key).length) {
                    var $div = $levelDiv(key);
                    character.$panel.find('.js-map').append($div);
                    //$div.append($tag('button','js-learnSkill', '+skill'));
                }
            });
            //updateSkillButtons(character);
        });
    }
    if (event.which == 76) { // 'l'
        state.characters.forEach(function (character) {
            gainXP(character.adventurer, character.adventurer.xpToLevel);
            updateAdventurer(character.adventurer);
            $.each(levels, function (key) {
                character.currentLevelIndex = key
                completeArea(character);
            });
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
