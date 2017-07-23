function equipItemProper(actor, item, update) {
    //console.log("equip " + item.base.slot);
    if (actor.equipment[item.base.slot]) {
        console.log("Tried to equip an item without first unequiping!");
        return;
    }
    if (item.base.slot === 'offhand' && isTwoHandedWeapon(actor.equipment.weapon) && !ifdefor(actor.twoToOneHanded)) {
        console.log("Tried to equip an offhand while wielding a two handed weapon!");
        return;
    }
    item.$item.detach();
    if (actor.character === state.selectedCharacter) {
        $('.js-equipment .js-' + item.base.slot).append(item.$item);
        $('.js-equipment .js-' + item.base.slot + ' .js-placeholder').hide();
    }
    item.actor = actor;
    actor.equipment[item.base.slot] = item;
    addActions(actor, item.base);
    addBonusSourceToObject(actor, item.base, false);
    item.prefixes.forEach(function (affix) {
        addActions(actor, affix);
        addBonusSourceToObject(actor, affix, false);
    })
    item.suffixes.forEach(function (affix) {
        addActions(actor, affix);
        addBonusSourceToObject(actor, affix, false);
    })
    if (update) {
        updateTags(actor, recomputActorTags(actor), true);
        if (actor.character === state.selectedCharacter) {
            refreshStatsPanel(actor.character, $('.js-characterColumn .js-stats'));
        }
        updateAdventurerGraphics(actor);
        updateOffhandDisplay();
        unequipRestrictedGear();
        updateEquipableItems();
    }
}
function unequipSlot(actor, slotKey, update) {
    //console.log(new Error("unequip " + slotKey));
    if (actor.equipment[slotKey]) {
        var item = actor.equipment[slotKey];
        item.$item.detach();
        item.actor = null;
        actor.equipment[slotKey] = null;
        removeActions(actor, item.base);
        removeBonusSourceFromObject(actor, item.base, false);
        item.prefixes.forEach(function (affix) {
            removeActions(actor, affix);
            removeBonusSourceFromObject(actor, affix, false);
        })
        item.suffixes.forEach(function (affix) {
            removeActions(actor, affix);
            removeBonusSourceFromObject(actor, affix, false);
        })
        if (update) {
            updateTags(actor, recomputActorTags(actor), true);
            if (state.selectedCharacter === actor.character) {
                refreshStatsPanel(actor.character, $('.js-characterColumn .js-stats'));
                $('.js-equipment .js-' + slotKey + ' .js-placeholder').show();
            }
            updateAdventurerGraphics(actor);
            updateOffhandDisplay();
            unequipRestrictedGear();
            updateEquipableItems();
        }
    }
}
function unequipRestrictedGear() {
    var actor = state.selectedCharacter.adventurer;
    for (var slotKey in actor.equipment) {
        var item = actor.equipment[slotKey];
        if (!item) continue;
        if (!canEquipItem(actor, item)) {
            unequipSlot(actor, slotKey, true);
            addToInventory(item);
            // This method will get called again as a consequence of unequiping
            // the invalid item, so we don't need to do any further processing
            // in this call.
            break;
        }
    }
}
function updateOffhandDisplay() {
    var adventurer = state.selectedCharacter.adventurer;
    // Don't show the offhand slot if equipped with a two handed weapon unless they have a special ability to allow off hand with two handed weapons.
    $('.js-offhand').toggle(!isTwoHandedWeapon(adventurer.equipment.weapon) || !!ifdefor(adventurer.twoToOneHanded));
}
function isTwoHandedWeapon(item) {
    return item && item.base.tags['twoHanded'];
}
function sellValue(item) {
    return Math.floor(4 * baseItemLevelCost(item.itemLevel));
}
function baseItemLevelCost(itemLevel) {
    return itemLevel * itemLevel * Math.pow(1.15, itemLevel);
}
function makeItem(base, level) {
    var item = {
        base,
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
        item.$item.toggleClass('equipable', canEquipItem(state.selectedCharacter.adventurer, item));
    }
    return item;
}
function updateEquipableItems() {
    $('.js-item').each(function () {
        var item = $(this).data('item');
        $(this).toggleClass('equipable', canEquipItem(state.selectedCharacter.adventurer, item));
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
    'unarmed': 'While Unarmed',
    'fist': 'Fist Weapons',
    'noOffhand': 'With No Offhand'
};
function tagToCategoryDisplayName(tag) {
    return ifdefor(tagToCategoryMap[tag], properCase(tag));
}
var restrictionToCategoryMap = {
    'oneHanded': '1-handed Weapons',
    'twoHanded': '2-handed Weapons',
    'melee': 'Melee Weapons',
    'ranged': 'Ranged Weapons',
    'physical': 'Physical Weapons',
    'magic': 'Magic Weapons',
    'throwing': 'Throwing Weapons',
    'fist': 'Fist Weapons',
    'unarmed': 'Unarmed',
    'noOffhand': 'With No Offhand'
};
function restrictionToCategoryDisplayName(tag) {
    return ifdefor(restrictionToCategoryMap[tag], properCase(tag));
}
// Wrapper for toFixed that strips trailing '0's and '.'s.
// Foundt at http://stackoverflow.com/questions/7312468/javascript-round-to-a-number-of-decimal-places-but-strip-extra-zeros
Number.prototype.abbreviate = function () {
    if (this >= 1000000000000) {
        return (this / 1000000000000 + '').slice(0, 5) + 'T';
    }
    if (this >= 1000000000) {
        return (this / 1000000000 + '').slice(0, 5) + 'B';
    }
    if (this >= 1000000) {
        return (this / 1000000 + '').slice(0, 5) + 'M';
    }
    if (this >= 10000) {
        return (this / 1000 + '').slice(0, 5) + 'K';
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
    if (overVertex || dragged) {
        stopJewelDrag();
    }
    dragged = false;
});
$('body').on('mousedown', '.js-item', function (event) {
    if (event.which != 1) return; // Handle only left click.
    if ($dragHelper) {
        stopDrag();
        return;
    }
    $dragHelper = $(this).clone();
    $dragHelper.data('item', $(this).data('item'));
    $dragHelper.data('helpMethod', $(this).data('helpMethod'));
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
    if (item.actor) unequipSlot(item.actor, item.base.slot, true);
    $('.js-equipment .js-' + item.base.slot).addClass(!canEquipItem(state.selectedCharacter.adventurer, item) ? 'invalid' : 'active');
    $('.js-enchantmentSlot').addClass('active');
    $('.js-inventorySlot').addClass('active');
});

function canEquipItem(actor, item) {
    if (item.level > actor.level) {
        return false;
    }
    if (item.base.slot === 'offhand' && isTwoHandedWeapon(actor.equipment.weapon) && !ifdefor(actor.twoToOneHanded)) {
        return false;
    }
    for (var requiredTag of ifdefor(item.base.restrictions, [])) {
        if (!actor.tags[requiredTag]) {
            return false;
        }
    }
    return true;
}

function updateDragHelper() {
    if (!$dragHelper) {
        return;
    }
    $dragHelper.css('left', (mousePosition[0] - $dragHelper.width() / 2) + 'px');
    $dragHelper.css('top', (mousePosition[1] - $dragHelper.height() / 2) + 'px');
    dragged = true;
}

$(document).on('mousemove', function (event) {
    updateDragHelper();
});
function stopDrag() {
    applyDragResults();
    // Check if the player has claimed an item from the craftingSelectOptions
    if ($('.js-craftingSelectOptions:visible').length) {
        if ($('.js-craftingSelectOptions .js-itemSlot').length > $('.js-craftingSelectOptions .js-itemSlot .js-item').length) {
            $('.js-craftingSelectOptions .js-itemSlot').empty();
            $('.js-craftingSelectOptions').hide();
            state.craftingLevel = null;
            state.craftingTypeFilter = null;
            saveGame();
        }
    }
    stopInventoryDrag();
}
function equipItem(actor, item) {
    if (!canEquipItem(actor, item)) return false;
    // Unequip anything that might be currently equipped in the target character.
    var currentMain = actor.equipment[item.base.slot];
    unequipSlot(actor, item.base.slot, false);
    if (currentMain) addToInventory(currentMain);
    // Now equip the item on the target character and update stats so we can
    // tell if they can still equip an offhand.
    equipItemProper(actor, item, true);
    // Unequip the offhand if the equipping character can no longer hold an offhand.
    if (isTwoHandedWeapon(item) && !ifdefor(actor.twoToOneHanded)) {
        var currentSub = actor.equipment.offhand;
        unequipSlot(actor, 'offhand', true);
        if (currentSub) addToInventory(currentSub);
    }
    return true;
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
        $('.js-enchantmentSlot').append($source);
        return;
    }
    var hit = false;
    $('.js-equipment .js-' + item.base.slot).each(function (index, element) {
        if (!collision($dragHelper, $(element))) return true;
        hit = true;
        equipItem(state.selectedCharacter.adventurer, item)
        return false;
    });
    if (hit) return;
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
    // Not need to do anything if the item was dropped where it started.
    if ($target && $target.is($source)) return;
    if ($target) {
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
        return;
    }
    // By default, if no other action is taken, we place the item at the end of the inventory.
    addToInventory(item);
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
    var key = data.name.replace(/\s*/g, '').toLowerCase();
    var tags = ifdefor(data.tags, []);
    data.tags = {};
    for (var tag of tags) {
        data.tags[tag] = true;
    }
    // Assume weapons are one handed melee if not specified
    if (data.slot === 'weapon') {
        if (!data.tags['ranged']) data.tags['melee'] = true;
        if (!data.tags['twoHanded']) data.tags['oneHanded'] = true;
        if (!data.tags['magic']) data.tags['physical'] = true;
    }
    data.tags[data.slot] = true;
    data.tags[data.type] = true;
    items[level] = ifdefor(items[level], []);
    itemsBySlotAndLevel[data.slot][level] = ifdefor(itemsBySlotAndLevel[data.slot][level], []);
    data.level = level;
    data.craftingWeight = 5 * level * level;
    data.crafted = false;
    data.hasImplictBonuses = true;
    items[level].push(data);
    itemsBySlotAndLevel[data.slot][level].push(data);
    data.key = key;
    itemsByKey[key] = data;
}

$(document).on('keydown', function(event) {
    if (event.which == 82 && !$dragHelper && !(event.metaKey || event.ctrlKey)) { // 'r' without ctrl/cmd while not dragging an item.
        // If they are looking at the item screen and the reforge option is available.
        if (state.selectedCharacter.context === 'item' && $('.js-craftingSelectOptions:visible').length) {
            reforgeItems();
            return;
        }
    }
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
    if (isEditingAllowed() && !editingLevel && event.which == 68 && event.shiftKey) { // 'd'
        gain('coins', 1000);
        gain('anima', 1000);
        $.each(itemsByKey, function (key, item) {
            state.craftedItems[key] |= CRAFTED_NORMAL;
            if (item.unique) {
                state.craftedItems[key] |= CRAFTED_UNIQUE;
            }
        });
        unlockItemLevel(73);
        state.characters.forEach(function (character) {
            $.each(map, function (key) {
                unlockMapLevel(key);
            });
        });
    }
    if (event.which == 69) { // 'e'
        if (!$popupTarget || $popupTarget.closest('.js-inventory').length === 0) {
            return;
        }
        var actor = state.selectedCharacter.adventurer;
        var item = $popupTarget.data('item');
        if (item) equipItem(actor, item);
        return;
    }
    if (isEditingAllowed() && event.which == 76) { // 'l'
        if (overCraftingItem) {
            state.craftedItems[overCraftingItem.key] |= CRAFTED_NORMAL;
            var item = makeItem(overCraftingItem, overCraftingItem.level);
            updateItem(item);
            $('.js-inventory').prepend(item.$item);
            if (item.base.unique) {
                item = makeItem(overCraftingItem, overCraftingItem.level);
                makeItemUnique(item);
                updateItem(item);
                $('.js-inventory').prepend(item.$item);
                state.craftedItems[overCraftingItem.key] |= CRAFTED_UNIQUE;
            }
            $('.js-inventorySlot').hide();
            lastCraftedItem = overCraftingItem;
        }
    }
    //console.log(event.which);
});
