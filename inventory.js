function equipItem(adventurer, item) {
    if (adventurer.equipment[item.base.slot]) {
        console.log("Tried to equip an item without first unequiping!");
        return;
    }
    if (item.base.slot === 'offhand' && isTwoHandedWeapon(adventurer.equipment.weapon)) {
        console.log("Tried to equip an offhand while wielding a two handed weapon!");
        return;
    }
    item.$item.detach();
    adventurer.equipment[item.base.slot] = item;
    updateAdventurer(adventurer);
}
function isTwoHandedWeapon(item) {
    return item && ifdefor(item.base.tags, []).indexOf('twoHanded') >= 0;
}
function sellValue(item) {
    return 4 * item.itemLevel * item.itemLevel * item.itemLevel;
}
function makeItem(base, level) {
    var item = {
        'base': base,
        'prefixes': [],
        'suffixes': [],
        // level is used to represent the required level, itemLevel is used
        // to calculate available enchantments and sell value.
        'itemLevel': level,
        'unique': false
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
    item.$item.removeClass('imbued').removeClass('enchanted').removeClass('unique');
    var enchantments = item.prefixes.length + item.suffixes.length;
    if (item.unique) {
        item.$item.addClass('unique');
    } else if (enchantments > 2) {
        item.$item.addClass('imbued');
    } else if (enchantments) {
        item.$item.addClass('enchanted');
    }
}
var tagToDisplayNameMap = {
    'twoHanded': '2-handed',
    'oneHanded': '1-handed',
    'ranged': 'Ranged',
    'melee': 'Melee',
    'magic': 'Magic',
    'throwing': 'Throwing',
    'skill': 'Skills'
};
function tagToDisplayName(tag) {
    return ifdefor(tagToDisplayNameMap[tag], properCase(tag));
}
var tagToCategoryMap = {
    'twoHanded': '2-handed Weapons',
    'oneHanded': '1-handed Weapons',
    'ranged': 'Ranged Attacks',
    'melee': 'Melee Attacks',
    'magic': 'Magic Attacks',
    'throwing': 'Throwing Weapons',
    'skill': 'Skills',
    'unarmed': 'While Unarmed',
    'fist': 'Fist Weapons',
    'minion': 'Minions'
};
function tagToCategoryDisplayName(tag) {
    return ifdefor(tagToCategoryMap[tag], properCase(tag));
}
function itemHelpText(item) {
    // Unique items have a distinct display name that is used instead of the
    // affix generated name.
    var name;
    if (ifdefor(item.displayName)) {
        name = item.displayName;
    } else {
        name = item.base.name;
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
    }
    var sections = [name];
    if (item.base.tags) {
        sections.push(item.base.tags.map(tagToDisplayName).join(', '));
    }
    sections.push('Requires level ' + item.level);
    sections.push('');
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

    var sellValues = [points('coins', sellValue(item))];
    var total = item.prefixes.length + item.suffixes.length;
    if (total) {
        var animaValue = item.base.level * item.base.level * item.base.level;
        if (total <= 2) sellValues.push(points('anima', animaValue * total));
        else sellValues.push(points('anima', animaValue * total));
    }
    sections.push('Sell for ' + sellValues.join(' '));
    return sections.join('<br/>');
}
function evaluateForDisplay(value, actor) {
    if (typeof value === 'number') {
        return value;
    }
    if (typeof value === 'string' && value.charAt(0) === '{') {
        return tag('span', 'formulaStat', value.substring(1, value.length - 1));
    }
    if (typeof value === 'string' || typeof value === 'boolean') {
        return value;
    }
    if (value.constructor !== Array) {
        if (value.stats) {
            return bonusHelpText(value.stats, false, actor);
        }
        return value;
    }
    var fullFormula = value;
    if (!fullFormula || !fullFormula.length) {
        throw new Error('Expected "formula" to be an array, but value is: ' + JSON.stringify(fullFormula));
    }
    formula = fullFormula.slice();
    value = evaluateForDisplay(formula.shift());
    while (formula.length > 1) {
        value += ' ' + formula.shift() + ' ' + evaluateForDisplay(formula.shift());
        if (formula.length > 1) {
            value = '(' + value + ')';
        }
    }
    if (actor) {
        value += ' ' + tag('span', 'formulaStat', '[' +  evaluateValue(actor, fullFormula) +  ']');
    }
    return value;
}
function bonusHelpText(rawBonuses, implicit, actor) {
    var bonuses = {};
    var tagBonuses = {};
    $.each(rawBonuses, function (key, value) {
        // Transform things like {'+bow:minDamage': 1} => 'bow': {'+minDamage': 1}
        // so that we can display per tag bonuses.
        if (key.indexOf(':') >= 0) {
            var parts = key.split(':');
            // skill is a required key word for anything that targets a tagged ability
            // but shouldn't be considered a seperate tag.
            if (parts[1] === 'skill' && parts.length > 2) {
                parts.splice(1, 1);
                parts[0] += ' skills';
            }
            var tag = parts[0].substring(1);
            tagBonuses[tag] = ifdefor(tagBonuses[tag], {});
            tagBonuses[tag][parts[0].charAt(0) + parts[1]] = value;
        }
        bonuses[key] = evaluateForDisplay(value, actor);
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
    if (ifdefor(bonuses['+magicBlock'])) {
        if (implicit) sections.push('Magic Block: ' + bonuses['+magicBlock'].format(1));
        else sections.push(bonuses['+magicBlock'].format(1) + ' increased magic block');
    }
    if (ifdefor(bonuses['%armor'])) {
        sections.push(bonuses['%armor'].percent(1) + ' increased armor');
    }
    if (ifdefor(bonuses['%evasion'])) {
        sections.push(bonuses['%evasion'].percent(1) + ' increased evasion');
    }
    if (ifdefor(bonuses['%block'])) {
        sections.push(bonuses['%block'].percent(1) + ' increased block');
    }
    if (ifdefor(bonuses['%magicBlock'])) {
        sections.push(bonuses['%magicBlock'].percent(1) + ' increased magic block');
    }
    if (ifdefor(bonuses['+damageOnMiss'])) {
        sections.push('Deals ' + bonuses['+damageOnMiss'] + ' true damage to enemy on miss');
    }
    if (ifdefor(bonuses['%damage'])) {
        sections.push(bonuses['%damage'].percent(1) + ' increased physical damage');
    }
    if (ifdefor(bonuses['*damage'])) {
        sections.push(bonuses['*damage'].format(1) + 'x more physical damage');
    }
    if (ifdefor(bonuses['%magicDamage'])) {
        sections.push(bonuses['%magicDamage'].percent(1) + ' increased magic damage');
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
    if (ifdefor(bonuses['+maxHealth'])) {
        sections.push('+' + bonuses['+maxHealth'].format(1) + ' health');
    }
    if (ifdefor(bonuses['+healthGainOnHit'])) {
        sections.push('Gain ' + bonuses['+healthGainOnHit'].format(1) + ' health on hit');
    }
    if (ifdefor(bonuses['*healthGainOnHit'])) {
        sections.push('Gain ' + bonuses['*healthGainOnHit'].format(1) + 'x more health on hit');
    }
    if (ifdefor(bonuses['+healthRegen'])) {
        sections.push('Regenerate ' + bonuses['+healthRegen'].format(1) + ' health per second');
    }
    if (ifdefor(bonuses['*healthRegen'])) {
        sections.push('Regenerate ' + bonuses['*healthRegen'].format(1) + 'x more health per second');
    }
    if (ifdefor(bonuses['%maxHealth'])) {
        sections.push(bonuses['%maxHealth'].percent(1) + ' increased health');
    }
    if (ifdefor(bonuses['%attackSpeed'])) {
        sections.push(bonuses['%attackSpeed'].percent(1) + ' increased attack speed');
    }
    if (ifdefor(bonuses['*attackSpeed'])) {
        sections.push(bonuses['*attackSpeed'].format(1) + 'x attack speed');
    }
    if (ifdefor(bonuses['+critChance'])) {
        if (implicit) sections.push(bonuses['+critChance'].percent(0) + ' critical strike chance');
        else sections.push('Additional ' + bonuses['+critChance'].percent(0) + ' chance to critical strike');
    }
    if (ifdefor(bonuses['%critChance'])) {
        sections.push(bonuses['%critChance'].percent(1) + ' increased critical chance');
    }
    if (ifdefor(bonuses['*critChance'])) {
        sections.push(bonuses['*critChance'].format(1) + 'x critical chance');
    }
    if (ifdefor(bonuses['+critDamage'])) {
        sections.push(bonuses['+critDamage'].percent(1) + ' increased critical damage');
    }
    if (ifdefor(bonuses['*critDamage'])) {
        sections.push(bonuses['*critDamage'].format(1) + 'x critical damage');
    }
    if (ifdefor(bonuses['+critAccuracy'])) {
        sections.push(bonuses['+critAccuracy'].percent(1) + ' increased critical accuracy');
    }
    if (ifdefor(bonuses['*critAccuracy'])) {
        sections.push(bonuses['*critAccuracy'].format(1) + 'x critical accuracy');
    }
    if (ifdefor(bonuses['+magicResist'])) {
        sections.push('Reduces magic damage received by ' + bonuses['+magicResist'].percent(0));
    }
    if (ifdefor(bonuses['+slowOnHit'])) {
        sections.push('Slow target by ' + bonuses['+slowOnHit'].percent(0));
    }
    if (ifdefor(bonuses['+accuracy'])) {
        sections.push((bonuses['+accuracy'] > 0 ? '+' : '') + bonuses['+accuracy'].format(1) + ' accuracy');
    }
    if (ifdefor(bonuses['%accuracy'])) {
        sections.push(bonuses['%accuracy'].percent(1) + ' increased accuracy');
    }
    if (ifdefor(bonuses['+speed'])) {
        sections.push((bonuses['+speed'] > 0 ? '+' : '') + bonuses['+speed'].format(1) + ' speed');
    }
    if (ifdefor(bonuses['+increasedDrops'])) {
        sections.push('Gain ' + bonuses['+increasedDrops'].percent(1) + ' more coins and anima');
    }
    if (ifdefor(bonuses['+increasedExperience'])) {
        sections.push('Gain ' + bonuses['+increasedExperience'].percent(1) + ' more experience');
    }
    if (ifdefor(bonuses['*amount'])) {
        sections.push(bonuses['*amount'].format(1) + 'x more effective');
    }
    if (ifdefor(bonuses['*healthBonus'])) {
        sections.push(bonuses['*healthBonus'].format(1) + 'x health');
    }
    if (ifdefor(bonuses['*damageBonus'])) {
        sections.push(bonuses['*damageBonus'].format(1) + 'x damage');
    }
    if (ifdefor(bonuses['*attackSpeedBonus'])) {
        sections.push(bonuses['*attackSpeedBonus'].format(1) + 'x attack speed');
    }
    if (ifdefor(bonuses['*speedBonus'])) {
        sections.push(bonuses['*speedBonus'].format(1) + 'x movement speed');
    }
    // Some unique abilities just map 'key' => 'help text' directly.
    $.each(rawBonuses, function (key, value) {
        if (key.indexOf(':') < 0 && typeof(value) === 'string') {
            sections.push(value);
        }
    });

    $.each(tagBonuses, function (tagName, bonuses) {
        sections.push(tag('div', 'tagText', tagToCategoryDisplayName(tagName) + ':<br/>' + bonusHelpText(bonuses, false, actor)));
    });

    // Special effects
    if (ifdefor(bonuses['$buff'])) {
        sections.push('Gain:');
        sections.push(bonusHelpText(bonuses['$buff'], false, actor));
    }
    if (ifdefor(bonuses['+dragDamage'])) {
        sections.push(bonuses['+dragDamage'].percent(1) + ' of initial damage is dealt per distance dragged');
    }
    if (ifdefor(bonuses['+dragStun'])) {
        sections.push('Target is stunned for ' + bonuses['+dragStun'].format(1) + ' seconds per distance dragged');
    }
    if (ifdefor(bonuses['+rangeDamage'])) {
        sections.push(bonuses['+rangeDamage'].percent(1) + ' increased damage the further the attack travels');
    }
    if (ifdefor(bonuses['+cooldown'])) {
        if (bonuses['+cooldown'] > 0) {
            sections.push('Cooldown increased by ' + bonuses['+cooldown'] + ' seconds');
        }
        if (bonuses['+cooldown'] < 0) {
            sections.push('Cooldown reduced by ' + -bonuses['+cooldown'] + ' seconds');
        }
    }
    if (ifdefor(bonuses['+distance'])) {
        if (bonuses['+distance'] > 0) {
            sections.push('Distance increased by ' + (bonuses['+distance'] / 32).format(1));
        }
        if (bonuses['+distance'] < 0) {
            sections.push('Distance reduced by ' + (-bonuses['+distance'] / 32).format(1));
        }
    }
    if (ifdefor(bonuses['+attackPower'])) {
        sections.push(bonuses['+attackPower'].percent() + ' increased attack power');
    }
    if (ifdefor(bonuses['+chance'])) {
        sections.push(bonuses['+chance'].percent() + ' increased chance');
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
Number.prototype.percent = function (digits) {
    return parseFloat((100 * this).toFixed(digits)) + '%';
}
String.prototype.percent = function (digits) {
    return this + '%';
}
Number.prototype.coins = function () {
    return tag('span', 'icon coin') + ' ' + tag('span', 'value coins', this);
}
String.prototype.coins = function () {
    return tag('span', 'icon coin') + ' ' + tag('span', 'value coins', this);
}
Number.prototype.anima = function () {
    return tag('span', 'icon anima') + ' ' + tag('span', 'value anima', this);
}
String.prototype.anima = function () {
    return tag('span', 'icon anima') + ' ' + tag('span', 'value anima', this);
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
    gain('coins', sellValue(item));
    destroyItem(item);
    var total = item.prefixes.length + item.suffixes.length;
    if (total) {
        var animaValue = item.base.level * item.base.level * item.base.level;
        if (total <= 2) gain('anima', animaValue * total);
        else gain('anima', animaValue * total);
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
                    var currentMain = targetCharacter.adventurer.equipment[item.base.slot];
                    var currentSub = null;
                    if (isTwoHandedWeapon(item)) {
                        currentSub = targetCharacter.adventurer.equipment.offhand;
                        targetCharacter.adventurer.equipment.offhand = null;
                    }
                    targetCharacter.adventurer.equipment[item.base.slot] = null;
                   if (sourceCharacter && sourceCharacter !== targetCharacter) {
                        sourceCharacter.adventurer.equipment[item.base.slot] = null;
                        if (!currentMain && !currentSub) {
                            updateAdventurer(sourceCharacter.adventurer);
                        } else {
                            if (currentMain && currentMain.level <= sourceCharacter.adventurer.level) {
                                // Swap the item back to the source character if they can equip it.
                                equipItem(sourceCharacter.adventurer, currentMain);
                                currentMain = null;
                            }
                            if (currentSub && currentSub.level <= sourceCharacter.adventurer.level) {
                                // Swap the item back to the source character if they can equip it.
                                equipItem(sourceCharacter.adventurer, currentSub);
                                currentSub = null;
                            }
                        }
                    }
                    //unequip the existing item if it hasn't already been swapped.
                    if (currentMain) {
                        currentMain.$item.detach();
                        $('.js-inventory').append(currentMain.$item);
                    }
                    if (currentSub) {
                        currentSub.$item.detach();
                        $('.js-inventory').append(currentSub.$item);
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
var smallArmorSlots = ['feet', 'head', 'offhand', 'arms', 'legs'];
var equipmentSlots = ['weapon', 'body', 'feet', 'head', 'offhand', 'arms', 'legs', 'back', 'ring'];
var accessorySlots = ['back', 'ring'];
var nonWeapons = ['body', 'feet', 'head', 'offhand', 'arms', 'legs', 'back', 'ring'];
var items = [[]];
var itemsByKey = {};
var itemsBySlotAndLevel = {};
equipmentSlots.forEach(function (slot) {
    itemsBySlotAndLevel[slot] = [];
});

function addItem(level, data) {
    data.tags = ifdefor(data.tags, []);
    // Assume weapons are one handed melee if not specified
    if (data.slot === 'weapon') {
        if (data.tags.indexOf('ranged') < 0 && data.tags.indexOf('melee') < 0) {
            data.tags.unshift('melee');
        }
        if (data.tags.indexOf('twoHanded') < 0 && data.tags.indexOf('oneHanded') < 0) {
            data.tags.unshift('oneHanded');
        }
    }
    items[level] = ifdefor(items[level], []);
    itemsBySlotAndLevel[data.slot][level] = ifdefor(itemsBySlotAndLevel[data.slot][level], []);
    data.level = level;
    data.craftingWeight = 5 * level * level;
    data.crafted = false;
    items[level].push(data);
    itemsBySlotAndLevel[data.slot][level].push(data);
    var key = data.name.replace(/\s*/g, '').toLowerCase();
    itemsByKey[key] = data;
}
addItem(1, {'slot': 'back', 'type': 'quiver', 'name': 'Quiver', 'bonuses': {'+bow:minDamage': 1, '+bow:maxDamage': 2}, icon: 'bag'});
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
        gain('fame', 1000);
        gain('coins', 1000);
        gain('anima', 1000);
        $.each(itemsByKey, function (key, item) {
            item.crafted = true;
        });
        unlockItemLevel(100);
        state.characters.forEach(function (character) {
            $.each(levels, function (key) {
                if (!character.$panel.find('.js-area-' + key).length) {
                    var $div = $levelDiv(key);
                    character.$panel.find('.js-map').append($div);
                }
            });
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
    //console.log(event.which);
});
