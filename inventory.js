function equipItem(adventurer, item, skipUpdate) {
    //console.log("equip " + item.base.slot);
    if (adventurer.equipment[item.base.slot]) {
        console.log("Tried to equip an item without first unequiping!");
        return;
    }
    if (item.base.slot === 'offhand' && isTwoHandedWeapon(adventurer.equipment.weapon)) {
        console.log("Tried to equip an offhand while wielding a two handed weapon!");
        return;
    }
    item.$item.detach();
    if (state.selectedCharacter && state.selectedCharacter.adventurer === adventurer) {
        $('.js-equipment .js-' + item.base.slot).append(item.$item);
    }
    item.actor = adventurer;
    adventurer.equipment[item.base.slot] = item;
    if (!ifdefor(skipUpdate))updateAdventurer(adventurer);
}
function unequipSlot(actor, slotKey, update) {
    //console.log(new Error("unequip " + slotKey));
    if (actor.equipment[slotKey]) {
        actor.equipment[slotKey].actor = null;
        actor.equipment[slotKey] = null;
        if (update) {
            updateAdventurer(actor);
        }
    }
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
    item.$item.attr('helptext', '-').data('helpMethod', getItemHelpText);
    if (state.selectedCharacter) {
        item.$item.toggleClass('equipable', item.level <= state.selectedCharacter.adventurer.level);
    }
    return item;
}
function updateEquipableItems() {
    $('.js-item').each(function () {
        var item = $(this).data('item');
        $(this).toggleClass('equipable', item.level <= state.selectedCharacter.adventurer.level);
    })
}
function updateItem(item) {
    var levelRequirement = item.base.level;
    item.prefixes.concat(item.suffixes).forEach(function (affix) {
        levelRequirement = Math.max(levelRequirement, affix.base.level);
    });
    item.level = levelRequirement;
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
function getItemHelpText($item) {
    var item = $item.data('item');
    return itemHelpText(item);
}
function addToInventory(item) {
    item.$item.detach();
    $('.js-inventorySlot').before(item.$item);
    $('.js-inventorySlot').hide();
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
    'minion': 'Minions',
    'noOffhand': 'With No Offhand'
};
function tagToCategoryDisplayName(tag) {
    return ifdefor(tagToCategoryMap[tag], properCase(tag));
}
// Wrapper for toFixed that strips trailing '0's and '.'s.
// Foundt at http://stackoverflow.com/questions/7312468/javascript-round-to-a-number-of-decimal-places-but-strip-extra-zeros
Number.prototype.abbreviate = function () {
    if (this > 1000000000) {
        return (this / 1000000000 + '').slice(0, 5) + ' B';
    }
    if (this > 1000000) {
        return (this / 1000000 + '').slice(0, 5) + ' M';
    }
    if (this >= 10000) {
        return (this / 1000 + '').slice(0, 5) + ' K';
    }
    return this;
}
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
    if (parseFloat(this) == this) {
        return parseFloat(this).percent(digits);
    }
    return this + ' x 100%'
    // Replace any numbers with n*100 since this is a percent.
    return this.replace(/[+-]?\d+(\.\d+)?/, function (number) {
        console.log("found number " + number);
        console.log("changed to: " + (parseFloat(number) * 100).format(digits));
        return (parseFloat(number) * 100).format(digits);
    }) + '%';
}
Number.prototype.coins = function () {
    return tag('span', 'icon coin') + ' ' + tag('span', 'value coins', this.abbreviate());
}
String.prototype.coins = function () {
    return tag('span', 'icon coin') + ' ' + tag('span', 'value coins', this);
}
Number.prototype.anima = function () {
    return tag('span', 'icon anima') + ' ' + tag('span', 'value anima', this.abbreviate());
}
String.prototype.anima = function () {
    return tag('span', 'icon anima') + ' ' + tag('span', 'value anima', this);
}
function sellItem(item) {
    if ($dragHelper && (!$dragHelper.data('$source') || $dragHelper.data('$source').data('item') !== item)) {
        return;
    }
    if (item.actor) {
        unequipSlot(item.actor, item.base.slot, true);
    }
    gain('coins', sellValue(item));
    destroyItem(item);
    var total = item.prefixes.length + item.suffixes.length;
    if (total) {
        var animaValue = item.base.level * item.base.level * item.base.level;
        if (total <= 2) gain('anima', animaValue * total);
        else gain('anima', animaValue * total);
    }
    saveGame();
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
    if (!$('.js-craftingSelectOptions .js-itemSlot:visible').length) {
        $('.js-enchantmentOptions').show();
        $('.js-craftingOptions').hide();
        $('.js-craftingSelectOptions').hide();
        updateEnchantmentOptions();
    }
    updateDragHelper();
    dragged = false;
    var item = $(this).data('item');
    $('.js-equipment .js-' + item.base.slot).addClass(item.level > state.selectedCharacter.adventurer.level ? 'invalid' : 'active');
    $('.js-enchantmentSlot').addClass('active');
    $('.js-inventorySlot').addClass('active');
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
    applyDragResults();
    // Check if the player has claimed an item from the craftingSelectOptions
    if ($('.js-craftingSelectOptions:visible').length) {
        if ($('.js-craftingSelectOptions .js-itemSlot').length > $('.js-craftingSelectOptions .js-itemSlot .js-item').length) {
            $('.js-craftingSelectOptions .js-itemSlot').empty();
            $('.js-craftingSelectOptions').hide();
            $('.js-craftingOptions').show();
            craftingTypeFilter = 'all';
            updateItemCrafting();
            saveGame();
        }
    } else {
        // Hide the enchantment options if there is no longer an item in the enchantment slot.
        if (!$('.js-enchantmentSlot').find('.js-item').length) {
            $('.js-enchantmentOptions').hide();
            $('.js-craftingOptions').show();
        }
    }
    stopInventoryDrag();
}
function applyDragResults() {
    if (!$dragHelper) {
        return;
    }
    var $source = $dragHelper.data('$source');
    // If this doesn't have item data, it must be a jewel.
    if (!$source) {
        stopJewelDrag();
        return;
    }
    var item = $source.data('item');
    if (collision($dragHelper, $('.js-sellItem:visible'))) {
        sellItem(item);
        return;
    }
    if (collision($dragHelper, $('.js-enchantmentSlot'))) {
        var $otherItem = $('.js-enchantmentSlot').find('.js-item');
        // If there is an item already in the enchantment slot, place it
        // back in the inventory.
        if ($otherItem.length) {
            addToInventory($otherItem.data('item'));
        }
        if (item.actor) {
            unequipSlot(item.actor, item.base.slot, true);
        }
        $('.js-enchantmentSlot').append($source);
        return;
    }
    var hit = false;
    $('.js-equipment .js-' + item.base.slot).each(function (index, element) {
        if (!collision($dragHelper, $(element))) {
            return true;
        }
        var targetCharacter = state.selectedCharacter;
        if (targetCharacter.adventurer.level < item.level) {
            return false;
        }
        var sourceCharacter = state.selectedCharacter;
        hit = true
        var currentMain = targetCharacter.adventurer.equipment[item.base.slot];
        var currentSub = null;
        if (isTwoHandedWeapon(item)) {
            currentSub = targetCharacter.adventurer.equipment.offhand;
            unequipSlot(targetCharacter.adventurer, 'offhand');
        }
        unequipSlot(targetCharacter.adventurer, item.base.slot);
        if (sourceCharacter && sourceCharacter !== targetCharacter) {
            unequipSlot(sourceCharacter.adventurer, item.base.slot);
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
            addToInventory(currentMain);
        }
        if (currentSub) {
            addToInventory(currentSub);
        }
        equipItem(targetCharacter.adventurer, item);
        return false;
    });
    if (!hit) {
        var $target = null;
        var largestCollision = 0;
        $('.js-inventory .js-item').each(function (index, element) {
            var $element = $(element);
            var collisionArea = getCollisionArea($dragHelper, $element);
            if (collisionArea > largestCollision) {
                $target = $element;
                largestCollision = collisionArea;
            }
        });
        if ($target.is($source)) {
            // Not need to do anything if the item was dropped where it started.
            hit = true;
        } else if ($target) {
            hit = true;
            if (item.actor) {
                unequipSlot(item.actor, item.base.slot, true);
            }
            // If an item is already in the inventory and it is before the item we are dropping
            // it onto, place it after, not before that item because that item will move
            // back one slot when the current item is removed, so the slot the player is hovering
            // over will be after that item.
            // Normally we want to place an item before the item they are hovering over since
            // that is what will move the hovered item into that slot.
            if ($source.closest('.js-inventory').length && $target.index() > $source.index()) {
                $target.after($source.detach());
            } else {
                $target.before($source.detach());
            }
        }
    }
    if (!hit && collision($dragHelper, $('.js-inventory'))) {
        if (item.actor) {
            unequipSlot(item.actor, item.base.slot, true);
        }
        addToInventory(item);
    }
}
function stopInventoryDrag() {
    if ($dragHelper) {
        $dragHelper.data('$source').css('opacity', '1');
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
    data.key = key;
    itemsByKey[key] = data;
}

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
    if (!editingLevel && event.which == 68 && event.shiftKey) { // 'd'
        gain('coins', 1000);
        gain('anima', 1000);
        $.each(itemsByKey, function (key, item) {
            item.crafted = true;
        });
        unlockItemLevel(73);
        state.characters.forEach(function (character) {
            $.each(map, function (key) {
                unlockMapLevel(key);
            });
        });
    }
    if (event.which == 76) { // 'l'
        updateAdventurer(state.selectedCharacter.adventurer);
        if (overCraftingItem) {
            if (lastCraftedItem) {
                craftingContext.fillStyle = ifdefor(lastCraftedItem.craftedUnique ? '#44ccff' : 'green');
                craftingContext.fillRect(lastCraftedItem.craftingX, lastCraftedItem.craftingY, craftingSlotSize, craftingSlotSize);
            }
            overCraftingItem.crafted = true;
            var item = makeItem(overCraftingItem, craftingLevel);
            updateItem(item);
            $('.js-inventory').prepend(item.$item);
            if (item.base.unique) {
                item = makeItem(overCraftingItem, craftingLevel);
                makeItemUnique(item);
                updateItem(item);
                $('.js-inventory').prepend(item.$item);
                overCraftingItem.craftedUnique = true;
            }
            craftingContext.fillStyle = ifdefor(overCraftingItem.craftedUnique) ? '#0088ff' : 'orange';
            craftingContext.fillRect(overCraftingItem.craftingX, overCraftingItem.craftingY, craftingSlotSize, craftingSlotSize);
            $('.js-inventorySlot').hide();
            drawCraftingViewCanvas();
            lastCraftedItem = overCraftingItem;
        }
    }
    //console.log(event.which);
});
