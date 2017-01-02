var CRAFTED_NORMAL = 1;
var CRAFTED_UNIQUE = 2;
var overCraftingItem = null;
var craftingCanvasYOffset = 0;
var lastCraftedItem = null;
var totalRows;
var slotCraftingOffsets;
var craftingSlotSize = 16;
var craftingSlotSpacing = 1;
var craftingSlotTotal = craftingSlotSize + craftingSlotSpacing;
function initializeCraftingImage() {
    var offset = 0
    var offsets = {'weapon': offset, 'offhand': offset+=3, 'head': offset+=1,
        'body': offset+=1, 'arms': offset+=1, 'legs': offset+=1, 'feet': offset+=1,
        'back': offset+=1, 'ring': offset += 1};
    slotCraftingOffsets = offsets;
    totalRows = offset + 2;
    craftingCanvas.width = 4 + craftingSlotTotal * 74;
    craftingCanvas.height = 4 + craftingSlotTotal * (totalRows - 1);
    craftingContext.font = (craftingSlotSize - 2) + "px sans-serif";
    craftingContext.textBaseline = "middle";
    craftingContext.textAlign = 'center'
    $.each(offsets, function (slot, offset) {
        for (var i = 0; i < items.length; i++) {
            var x = 2 + (i - 1) * craftingSlotTotal;
            for (var j = 0; j < ifdefor(itemsBySlotAndLevel[slot][i], []).length; j++) {
                var y = 2 + (offset + j) * craftingSlotTotal;
                craftingContext.fillStyle = '#888';
                craftingContext.fillRect(x, y, craftingSlotSize, craftingSlotSize);
                craftingContext.fillStyle = 'white';
                craftingContext.fillText('?', x + craftingSlotSize / 2, y + craftingSlotSize / 2);
                var item = itemsBySlotAndLevel[slot][i][j];
                item.craftingX = x;
                item.craftingY = y;
            }
        }
    });
    $(craftingViewCanvas).on('mousemove', function () {
        var offset = relativeMousePosition($(this));
        var tx = Math.floor((offset[0] - 2) / craftingSlotTotal);
        var subX = offset[0] - tx * craftingSlotTotal - 2;
        var ty = Math.floor((offset[1] - 2) / craftingSlotTotal);
        var subY = offset[1] - ty * craftingSlotTotal - 2;
        var level = tx + 1;
        var slotOffset = 0;
        var overSlot = 'weapon';
        $.each(offsets, function (slot, offset) {
            if (ty >= offset) {
                slotOffset = offset;
                overSlot = slot;
            }
            return ty >= offset;
        });
        var items = ifdefor(ifdefor(itemsBySlotAndLevel[overSlot], [])[level], []);
        var index = ty - slotOffset;
        // subX/subY values are used to make sure we don't show hover when mouse
        // is actually in between crafting tiles.
        if (level <= state.maxCraftingLevel && index < items.length && subY <= 16 && subX <= 16) {
            overCraftingItem = items[index];
        } else {
            overCraftingItem = null
        }
        if (mouseDown) {
            setCraftingLevel(level);
        }
    });
    $(craftingViewCanvas).on('mousedown', function (event) {
        var offset = relativeMousePosition($(this));
        var level = Math.floor((offset[0] - 2) / craftingSlotTotal) + 1;
        if (event.shiftKey) { //check if 'shift' key is held down
            addToInventory(makeItem(overCraftingItem, 1));
            return;
        }
        setCraftingLevel(level);
    });
    $(craftingViewCanvas).on('mouseout', function () {
        overCraftingItem = null
    });
    drawCraftingViewCanvas();
}
function setCraftingLevel(level) {
    if (!$('.js-craftingOptions:visible').length) {
        return;
    }
    state.craftingLevel = Math.max(1, Math.min(state.maxCraftingLevel, level));
    updateItemCrafting();
}
function drawCraftingViewCanvas() {
    if (!state.selectedCharacter) return;
    var canvas = craftingViewCanvas;
    var maxLevel = state.maxCraftingLevel;
    canvas.width = Math.max(390, 4 + craftingSlotTotal * maxLevel);
    canvas.height = 4 + craftingSlotTotal * (totalRows - 1);
    var context = craftingViewContext;
    var offset = 0;
    var rows = totalRows;
    switch (state.craftingTypeFilter) {
        case 'all':
            break;
        case 'weapon':
            rows = 3;
            break;
        case 'armor':
            offset = slotCraftingOffsets['offhand'];
            rows = slotCraftingOffsets['feet'] - offset + 1;
            break;
        case 'accessory':
            offset = slotCraftingOffsets['back'];
            rows = slotCraftingOffsets['ring'] - offset + 1;
            break
        default:
            offset = slotCraftingOffsets[state.craftingTypeFilter];
            rows = 1;
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#8F8';
    context.fillRect(0, offset * craftingSlotTotal, 4 + craftingSlotTotal * Math.min(state.selectedCharacter.adventurer.level, state.craftingLevel), 3 + rows * craftingSlotTotal);
    var levelsOverCurrent = state.craftingLevel - state.selectedCharacter.adventurer.level
    if (levelsOverCurrent > 0) {
        context.fillStyle = '#F88';
        context.fillRect(2 + craftingSlotTotal * state.selectedCharacter.adventurer.level, offset * craftingSlotTotal, craftingSlotTotal * levelsOverCurrent, 3 + rows * craftingSlotTotal);
    }
    context.drawImage(craftingCanvas, 0, 0, Math.min(craftingCanvas.width, 2 + craftingSlotTotal * maxLevel), craftingCanvas.height,
                      0, 0, Math.min(craftingCanvas.width, 2 + craftingSlotTotal * maxLevel), craftingCanvas.height);
}

var itemsFilteredByType = [];
var selectedCraftingWeight = 0;
function updateItemCrafting() {
    /*$('.js-itemCraftingOption.js-allOption').attr('helptext', 'For an item of any type, offer ' + points('coins', getForgeItemCost()));
    $('.js-itemCraftingOption.js-armorOption').attr('helptext', 'For armor, offer ' + points('coins', getForgeArmorCost()));
    $('.js-itemCraftingOption.js-weaponOption').attr('helptext', 'For a weapon, offer ' + points('coins', getForgeWeaponCost()));
    $('.js-itemCraftingOption.js-accessoryOption').attr('helptext', 'For an accessory, offer ' + points('coins', getForgeAccessoryCost()));*/
    var text = ['Drag one of the 3 items to your inventory or click here to offer ' + points('coins', Math.floor(getCurrentCraftingCost() / 5)) + ' for 3 new choices.',
        'You can type \'r\' as a shortcut for clicking this button.'];
    $('.js-reforge').attr('helptext', text.join('<br/>'));
    updateCraftingButtons();
    var itemsFilteredByLevel = [];
    itemsFilteredByType = [];
    for (var itemLevel = 0; itemLevel <= state.craftingLevel && itemLevel < items.length; itemLevel++) {
        ifdefor(items[itemLevel], []).forEach(function (item) {
            itemsFilteredByLevel.push(item);
            if (itemMatchesFilter(item, state.craftingTypeFilter)) {
                itemsFilteredByType.push(item);
            }
        });
    }
    $('.js-craftingLevel').text(state.craftingLevel);
    $('.js-levelMultiplier').html((getForgeItemCost()).coins());
    updateSelectedCraftingWeight();
    drawCraftingViewCanvas();
}
function getReforgeCost() {
    return Math.floor(getCurrentCraftingCost() / 5);
}
function getForgeItemCost() {
    return Math.floor(5 * baseItemLevelCost(state.craftingLevel));
}
function getForgeArmorCost() {
    return getForgeItemCost() * 2;
}
function getForgeWeaponCost() {
    return getForgeItemCost() * 3;
}
function getForgeAccessoryCost() {
    return getForgeItemCost() * 5;
}
function getCurrentCraftingCost(filter) {
    switch (state.craftingTypeFilter) {
        case 'weapon': return getForgeWeaponCost();
        case 'armor': return getForgeArmorCost();
        case 'accessory': return getForgeAccessoryCost();
        default: return getForgeItemCost();
    }
}
function updateCraftingButtons() {
    $('.js-itemCraftingOption.js-allOption').toggleClass('disabled', state.coins < getForgeItemCost());
    $('.js-itemCraftingOption.js-armorOption').toggleClass('disabled', state.coins < getForgeArmorCost());
    $('.js-itemCraftingOption.js-weaponOption').toggleClass('disabled', state.coins < getForgeWeaponCost());
    $('.js-itemCraftingOption.js-accessoryOption').toggleClass('disabled', state.coins < getForgeAccessoryCost());
    $('.js-reforge').toggleClass('disabled', state.coins < getReforgeCost());
}
function updateSelectedCraftingWeight() {
    selectedCraftingWeight = 0;
    itemsFilteredByType.forEach(function (item) {
        selectedCraftingWeight += item.craftingWeight;
    });
}
$('.js-itemCraftingOption').on('mouseover', function () {
    state.craftingTypeFilter = $(this).data('filter');
    updateItemCrafting();
});
$('.js-itemCraftingOption').on('mouseout', function () {
    // Don't reset the state.craftingTypeFilter if crafting options aren't being displayed,
    // otherwise we lose the filter during the item selection step.
    if ($('.js-craftingOptions:visible').length) {
        state.craftingTypeFilter = 'all';
        updateItemCrafting();
    }
});
$('.js-itemCraftingOption').on('click', function () {
    state.craftingTypeFilter = $(this).data('filter');
    var totalCost = getCurrentCraftingCost();
    if (!spend('coins', totalCost)) {
        return;
    }
    $('.js-craftingOptions').hide();
    $('.js-craftingSelectOptions').show();
    $('.js-craftingSelectOptions .js-itemSlot').each(function () {
        var item = craftItem();
        $(this).append(item.$item);
    });
    updateItemCrafting();
    saveGame();
});
$('.js-itemCraftingOption').on('mouseover', function () { previewPointsChange('coins', -getCurrentCraftingCost());});
$('.js-itemCraftingOption').on('mouseout', hidePointsPreview);
$('.js-reforge').on('click', reforgeItems);
$('.js-reforge').on('mouseover', function () { previewPointsChange('coins', -getReforgeCost());});
$('.js-reforge').on('mouseout', hidePointsPreview);
function reforgeItems() {
    if (!spend('coins', Math.floor(getCurrentCraftingCost() / 5))) {
        return;
    }
    $('.js-craftingSelectOptions .js-itemSlot').empty();
    $('.js-craftingSelectOptions .js-itemSlot').each(function () {
        var item = craftItem();
        $(this).append(item.$item);
    });
    updateCraftingButtons();
    saveGame();
}

function craftItem() {
    var craftingRoll = Math.floor(Math.random() * selectedCraftingWeight);
    var index = 0;
    while (craftingRoll > itemsFilteredByType[index].craftingWeight) {
        craftingRoll -= itemsFilteredByType[index].craftingWeight;
        index++;
    }
    var craftedItem = itemsFilteredByType[index];
    // This is used to determine what proportion of the crafting weight goes to which item.
    var totalCraftingWeight = 0;
    itemsFilteredByType.forEach(function (item) {
        totalCraftingWeight += item.level * item.level * 5;
    });
    // Remove crafting weight from the crafted item and distribute it out proportionally
    // to other items that could have been crafted. This leaves the crafting weight of
    // the selected group the same while decreasing the odds of crafting the same item
    // again and increasing the odds of the highest level items the most.
    var distributedCraftingWeight = craftedItem.craftingWeight / 2;
    craftedItem.craftingWeight -= distributedCraftingWeight;
    itemsFilteredByType.forEach(function (item) {
        item.craftingWeight += distributedCraftingWeight * item.level * item.level * 5 / totalCraftingWeight;
    });
    updateSelectedCraftingWeight();
    var item = makeItem(craftedItem, state.craftingLevel);
    // Rolling a plain item has a chance to create a unique if one exists for
    // this base type.
    checkToMakeItemUnique(item);
    if (item.unique) {
        state.craftedItems[craftedItem.key] |= ifdefor(state.craftedItems[craftedItem.key], 0) | CRAFTED_UNIQUE;
    } else {
        // Items created below the specified crafting level are automatically enchanted.
        // This way getting low level items is less disappointing.
        if (craftedItem.level < state.craftingLevel) {
            // Always get at least 1 enchantment.
            augmentItemProper(item);
            // Get up to 4 enchantments with higher chance the greater the disparity is.
            var buffChance = .1 * (state.craftingLevel - craftedItem.level);
            while (Math.random() < buffChance && item.prefixes.length + item.suffixes.length < 4){
                augmentItemProper(item);
            }
        }
    }
    state.craftedItems[craftedItem.key] |= ifdefor(state.craftedItems[craftedItem.key], 0) | CRAFTED_NORMAL;
    updateCraftingContext(craftedItem);
    drawCraftingViewCanvas();
    updateItem(item);
    lastCraftedItem = craftedItem;
    return item;
}

function redrawCraftingContext() {
    for (var itemKey of Object.keys(state.craftedItems)) {
        updateCraftingContext(itemsByKey[itemKey]);
    }
}
function updateCraftingContext(craftedItem) {
    // Sometimes old saves have invalid item types in them.
    if (!craftedItem) return;
    craftingContext.fillStyle = (state.craftedItems[craftedItem.key] & CRAFTED_UNIQUE) ? '#44ccff' : 'green';
    craftingContext.fillRect(craftedItem.craftingX, craftedItem.craftingY, craftingSlotSize, craftingSlotSize);
}

function itemMatchesFilter(item, typeFilter) {
    switch (typeFilter) {
        case 'all':
            return true;
        case 'armor':
            return armorSlots.indexOf(item.slot) >= 0;
        case 'accessory':
            return item.slot == 'ring' || item.slot == 'back';
        default:
            return item.slot === typeFilter;
    }
}

$('.js-mouseContainer').on('mouseover mousemove', checkToShowCraftingToopTip);
function checkToShowCraftingToopTip() {
    if (!overCraftingItem) {
        return;
    }
    if ($popup) {
        if ($popup.data('item') === overCraftingItem) return;
        else $popup.remove();
    }
    var sections;
    if (state.craftedItems[overCraftingItem.key]) {
        sections = [overCraftingItem.name];
        if (overCraftingItem.tags) {
            sections.push(Object.keys(overCraftingItem.tags).map(tagToDisplayName).join(', '));
        }
        sections.push('Requires level ' + overCraftingItem.level);
        sections.push('');
        sections.push(bonusSourceHelpText(overCraftingItem, state.selectedCharacter.adventurer));
        if (ifdefor(overCraftingItem.craftedUnique)) {
            sections.push(tag('div', 'uniqueText', 'Unique Variant: </br>' + overCraftingItem.unique.displayName + '<br/>' + (100 * overCraftingItem.unique.chance).format(1) + '% chance'));
        }
    } else {
        sections = ['??? ' + overCraftingItem.slot, 'Requires level ' + overCraftingItem.level, ''];
    }
    if (itemsFilteredByType.indexOf(overCraftingItem) >= 0) {
        sections.push('');
        sections.push((100 * overCraftingItem.craftingWeight / selectedCraftingWeight).format(1) + '% chance to craft');
    }
    $popup = $tag('div', 'toolTip js-toolTip', sections.join('<br/>'));
    $popup.data('item', overCraftingItem);
    $popupTarget = null;
    updateToolTip(mousePosition[0], mousePosition[1], $popup);
    $('.js-mouseContainer').append($popup);
}

function unlockItemLevel(level) {
    if (level <= state.maxCraftingLevel) {
        return
    }
    state.maxCraftingLevel = Math.min(80, level);
    // Don't set the current crafting level if the player might be in the middle of crafting.
    // It might make them accidentally buy something they don't intend.
    if (currentContext !== 'item') {
        setCraftingLevel(level);
    }
    updateItemCrafting();
}
