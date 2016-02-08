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
    return item.itemLevel * item.itemLevel * item.itemLevel;
}
function makeItem(base, level) {
    var item = {
        'base': base,
        'prefixes': [],
        'suffixes': [],
        // level is used to represent the required level, itemLevel is used
        // to calculate available enchantments and sell value.
        'itemLevel': level
    };
    item.$item = $tag('div', 'js-item item', tag('div', 'icon ' + base.icon) + tag('div', 'itemLevel', base.level));
    updateItem(item);
    item.$item.data('item', item);
    return item;
}
function updateItem(item) {
    var levelRequirement = item.base.level;
    item.prefixes.concat(item.suffixes).forEach(function (affix) {
        levelRequirement = Math.max(levelRequirement, affix.base.level);
    });
    item.level = levelRequirement;
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
    var sections = [name, 'Requires level ' + item.level, ''];
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
    if (ifdefor(bonuses['+minDamage'])) {
        if (implicit) sections.push('Damage: ' + bonuses['+minDamage'].format(1) + ' to ' + bonuses['+maxDamage'].format(1));
        else sections.push(bonuses['+minDamage'] + ' to ' + bonuses['+maxDamage'] + ' increased damage');
    }
    if (ifdefor(bonuses['+minMagicDamage'])) {
        if (implicit) sections.push('Magic: ' + bonuses['+minMagicDamage'].format(1) + ' to ' + bonuses['+maxMagicDamage'].format(1));
        else sections.push(bonuses['+minMagicDamage'] + ' to ' + bonuses['+maxMagicDamage'] + ' increased magic damage');
    }
    if (ifdefor(bonuses['+range'])) {
        if (implicit) sections.push('Range: ' + bonuses['+range'].format(1));
        else sections.push(bonuses['+range'] + ' increased range');
    }
    if (ifdefor(bonuses['+attackSpeed'])) {
        sections.push('Attack Speed: ' + bonuses['+attackSpeed'].format(1));
    }
    if (ifdefor(bonuses['+armor'])) {
        if (implicit) sections.push('Armor: ' + bonuses['+armor'].format(1));
        else sections.push(bonuses['+armor'] + ' increased armor');
    }
    if (ifdefor(bonuses['+evasion'])) {
        if (implicit) sections.push('Evasion: ' + bonuses['+evasion'].format(1));
        else sections.push(bonuses['+evasion'].format(1) + ' increased evasion');
    }
    if (ifdefor(bonuses['+block'])) {
        if (implicit) sections.push('Block: ' + bonuses['+block'].format(1));
        else sections.push(bonuses['+block'].format(1) + ' increased block');
    }
    if (ifdefor(bonuses['%block'])) {
        sections.push((100 * bonuses['%block']).format(1) + '% increased block');
    }
    if (ifdefor(bonuses['+magicBlock'])) {
        if (implicit) sections.push('Magic Block: ' + bonuses['+magicBlock'].format(1));
        else sections.push(bonuses['+magicBlock'].format(1) + ' increased magic block');
    }
    if (ifdefor(bonuses['+damageOnMiss'])) {
        sections.push('Deals ' + bonuses['+damageOnMiss'] + ' to enemy on miss');
    }
    if (ifdefor(bonuses['%damage'])) {
        sections.push((100 * bonuses['%damage']).format(1) + '% increased physical damage');
    }
    if (ifdefor(bonuses['%magicDamage'])) {
        sections.push((100 * bonuses['%magicDamage']).format(1) + '% increased magic damage');
    }
    if (ifdefor(bonuses['+dexterity'])) {
        sections.push('+' + bonuses['+dexterity'].format(1) + ' Dexterity');
    }
    if (ifdefor(bonuses['+strength'])) {
        sections.push('+' + bonuses['+strength'].format(1) + ' Strength');
    }
    if (ifdefor(bonuses['+intelligence'])) {
        sections.push('+' + bonuses['+intelligence'].format(1) + ' Intelligence');
    }
    if (ifdefor(bonuses['%evasion'])) {
        sections.push((100 * bonuses['%evasion']).format(1) + '% increased evasion');
    }
    if (ifdefor(bonuses['%magicBlock'])) {
        sections.push((100 * bonuses['%magicBlock']).format(1) + '% increased magic block');
    }
    if (ifdefor(bonuses['+maxHealth'])) {
        sections.push('+' + bonuses['+maxHealth'].format(1) + ' health');
    }
    if (ifdefor(bonuses['+healthGainOnHit'])) {
        sections.push('Gain ' + bonuses['+healthGainOnHit'].format(1) + ' health on hit');
    }
    if (ifdefor(bonuses['+healthRegen'])) {
        sections.push('Regenerate ' + bonuses['+healthRegen'].format(1) + ' health per second');
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
    if (ifdefor(bonuses['+slowOnHit'])) {
        sections.push('Slow target by ' + (100 * bonuses['+slowOnHit']).format(0) + '%');
    }
    if (ifdefor(bonuses['+accuracy'])) {
        sections.push((bonuses['+accuracy'] > 0 ? '+' : '') + bonuses['+accuracy'].format(1) + ' accuracy');
    }
    if (ifdefor(bonuses['%accuracy'])) {
        sections.push((100 * bonuses['%accuracy']).format(1) + '% increased accuracy');
    }
    if (ifdefor(bonuses['+speed'])) {
        sections.push((bonuses['+speed'] > 0 ? '+' : '') + bonuses['+speed'].format(1) + ' speed');
    }
    if (ifdefor(bonuses['+increasedItems'])) {
        sections.push('Gain ' + (100 * bonuses['+increasedItems']).format(1) + '% more item points.');
    }
    if (ifdefor(bonuses['+increasedExperience'])) {
        sections.push('Gain ' + (100 * bonuses['+increasedExperience']).format(1) + '% more experience.');
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
    if ($dragHelper && (!$dragHelper.data('$source') || $dragHelper.data('$source').data('item') !== item)) {
        return;
    }
    var sourceCharacter = item.$item.closest('.js-playerPanel').data('character');
    if (sourceCharacter) {
        sourceCharacter.adventurer.equipment[item.base.slot] = null;
        updateAdventurer(sourceCharacter.adventurer);
    }
    gain('IP', sellValue(item));
    destroyItem(item);
    var total = item.prefixes.length + item.suffixes.length;
    if (total) {
        if (total <= 2) gain('MP', sellValue(item) * total);
        else gain('RP', sellValue(item) * (total - 2));
    }
}
function destroyItem(item) {
    if ($dragHelper) {
        var $source = $dragHelper.data('$source');
        if ($source && $source.data('item') === item) {
            $source.data('item', null);
            $dragHelper.data('$source', null);
            $dragHelper.remove();
            $dragHelper = null;
            $('.js-itemSlot.active').removeClass('active');
            $('.js-itemSlot.invalid').removeClass('invalid');
        }
    }
    item.$item.data('item', null);
    item.$item.remove();
    item.$item = null;
    updateEnchantmentOptions();
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
    state.characters.forEach(function (character) {
        character.$panel.find('.js-equipment .js-' + item.base.slot).addClass(item.level > character.adventurer.level ? 'invalid' : 'active');
    });
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
            return;
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
                    var targetCharacter = $(element).closest('.js-playerPanel').data('character');
                    if (targetCharacter.adventurer.level < item.level) {
                        return false;
                    }
                    var sourceCharacter = $source.closest('.js-playerPanel').data('character');
                    hit = true
                    var current = targetCharacter.adventurer.equipment[item.base.slot];
                    targetCharacter.adventurer.equipment[item.base.slot] = null;
                    if (sourceCharacter) {
                        sourceCharacter.adventurer.equipment[item.base.slot] = null;
                        if (!current) {
                            updateAdventurer(sourceCharacter.adventurer);
                        } else if (current.level <= sourceCharacter.adventurer.level) {
                            // Swap the item back to the source character if they can equip it.
                            equipItem(sourceCharacter.adventurer, current);
                            current = null;
                        }
                    }
                    //unequip the existing item if it hasn't already been swapped.
                    if (current) {
                        current.$item.detach();
                        $('.js-inventory').append(current.$item);
                    }
                    equipItem(targetCharacter.adventurer, item);
                    return false;
                }
                return true;
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
    $('.js-itemSlot.invalid').removeClass('invalid');
}
var armorSlots = ['body', 'feet', 'head', 'offhand', 'arms', 'legs'];
var equipmentSlots = ['weapon', 'body', 'feet', 'head', 'offhand', 'arms', 'legs', 'back', 'ring'];
var accessorySlots = ['back', 'ring'];
var items = [[]];
var itemsByKey = {};
var itemsBySlotAndLevel = {};
var maxItemsInSlot = {}
equipmentSlots.forEach(function (slot) {
    itemsBySlotAndLevel[slot] = [];
    maxItemsInSlot[slot] = 0;
});
var maxItemWidth = 0;
// TODO: Add unique "Sticky, Sticky Bow of Aiming and Leeching and Leeching and Aiming"
function addItem(level, data) {
    items[level] = ifdefor(items[level], []);
    itemsBySlotAndLevel[data.slot][level] = ifdefor(itemsBySlotAndLevel[data.slot][level], []);
    data.level = level;
    data.craftingWeight = 5 * level * level;
    data.crafted = false;
    items[level].push(data);
    itemsBySlotAndLevel[data.slot][level].push(data);
    var key = data.name.replace(/\s*/g, '').toLowerCase();
    itemsByKey[key] = data;
    maxItemsInSlot[data.slot] = Math.max(itemsBySlotAndLevel[data.slot][level].length, maxItemsInSlot[data.slot]);
    maxItemWidth = 0;
    $.each(maxItemsInSlot, function (key) {
        maxItemWidth+=maxItemsInSlot[key];
    });
}
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
    if (event.which == 67) { // 'c'
        $('.js-craftingCanvas').toggle();
    }
    if (event.which == 68) { // 'd'
        gain('AP', 1000);
        gain('IP', 1000);
        gain('MP', 1000);
        gain('RP', 1000);
        gain('UP', 1000);
        $('.js-craftingCanvas').show();
        $.each(itemsByKey, function (key, item) {
            item.crafted = true;
        });
        unlockItemLevel(100);
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
            var visibleLevels = {};
            $.each(levels, function (key) {
                if (character.$panel.find('.js-area-' + key).length) {
                    visibleLevels[key] = true;
                }
            });
            gainXP(character.adventurer, character.adventurer.xpToLevel);
            updateAdventurer(character.adventurer);
            $.each(levels, function (key) {
                if (visibleLevels[key]) {
                    character.currentLevelIndex = key
                    completeArea(character);
                }
            });
        });
    }
    console.log(event.which);
});
