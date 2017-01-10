var CRAFTED_NORMAL = 1;
var CRAFTED_UNIQUE = 2;
var overCraftingItem = null;
var lastCraftedItem = null;
// Same size as icons for equipment.
var craftingSlotSize = 32;
var craftingSlotSpacing = 2;
var craftingSlotTotal = craftingSlotSize + craftingSlotSpacing;
var craftingHeaderSize = 4 + craftingSlotSize / 2 + craftingSlotSpacing;
var craftingGrid = [];
var craftingCanvasMousePosition = null;
function initializeCraftingGrid() {
    craftingCanvas.width = 5 + 16 * craftingSlotTotal;
    craftingCanvas.height = craftingHeaderSize + 6 * craftingSlotTotal + 1;
    var offset = 0;
    var craftingSections = [
        {'height': 2, 'slots': ['weapon']},
        {'height': 3, 'slots': ['offhand', 'head', 'body', 'arms', 'legs', 'feet']},
        {'height': 1, 'slots': ['back', 'ring']}
    ];
    var iconSources = {};
    var row = 0, column = 0;
    for (var craftingSection of craftingSections) {
        for (var i = 1; i < items.length; i++) {
            column = 2 * (i - 1);
            var subColumn = 0, subRow = 0;
            for (var slot of craftingSection.slots) {
                for (var item of ifdefor(itemsBySlotAndLevel[slot][i], [])) {
                    if (subColumn > 1) {
                        console.log(craftingSection.slots);
                        console.log(new Error("Too many items in crafting section at level " + i));
                    }
                    var x = 2 + (column + subColumn) * craftingSlotTotal;
                    var y = craftingHeaderSize + (row + subRow) * craftingSlotTotal;
                    item.craftingX = x;
                    item.craftingY = y;
                    craftingGrid[row + subRow] = ifdefor(craftingGrid[row + subRow], []);
                    craftingGrid[row + subRow][column + subColumn] = item;
                    subRow++;
                    if (subRow >= craftingSection.height) {
                        subRow = 0;
                        subColumn++;
                    }
                    // Some hacky code to read the icon from the css styles. Make a div for the item,
                    // briefly add to the page and then read the background image/position info and translate
                    // into values I can use.
                    var icon = item.icon;
                    if (!iconSources[icon]) {
                        var $itemDiv = $tag('div', 'icon ' + icon);
                        $itemDiv.appendTo($('body'));
                        var imageFileName = 'gfx/' + $itemDiv.css('background-image').split('/gfx/')[1].split('"')[0];
                        if (!images[imageFileName]) {
                            console.log("Need to preload " + imageFile + " for crafting icons.");
                            continue;
                        }
                        var image = images[imageFileName];
                        var backgroundSizeValue = $itemDiv.css('background-size');
                        var scale = 1;
                        if (backgroundSizeValue && backgroundSizeValue != 'initial') {
                            var sizes = backgroundSizeValue.split(' ').map(function (string) { return parseInt(string);});
                            scale = sizes[0] / image.width;
                        }
                        var offsets = $itemDiv.css('background-position').split(' ').map(function (string) { return -parseInt(string);});
                        // console.log([imageFile, offsets.join(',')]);
                        $itemDiv.remove();
                        iconSources[icon] = {
                            'image': image,
                            'left': offsets[0] / scale,
                            'top': offsets[1] / scale,
                            'width': craftingSlotSize / scale,
                            'height': craftingSlotSize / scale
                        };
                    }
                    item.iconSource = iconSources[icon];
                }
            }
        }
        row += craftingSection.height;
    }
    $(craftingCanvas).on('mousemove', function () {
        craftingCanvasMousePosition = relativeMousePosition($(this));
        updateOverCraftingItem();
        checkToShowCraftingToopTip();
    });
    $(craftingCanvas).on('mousedown', function (event) {
        if (event.shiftKey && overCraftingItem) { //check if 'shift' key is held down
            addToInventory(makeItem(overCraftingItem, 1));
            return;
        }
        craftNewItems();
    });
    $(craftingCanvas).on('mouseout', function () {
        overCraftingItem = null;
        if (!$('.js-craftingSelectOptions:visible').length) {
            state.craftingLevel = null;
            state.craftingTypeFilter = null;
        }
        craftingCanvasMousePosition = null;
        hidePointsPreview();
    });
}
function updateOverCraftingItem() {
    var x = craftingCanvasMousePosition[0] + state.craftingXOffset;
    var y = craftingCanvasMousePosition[1];
    var column = Math.floor((x - 2) / craftingSlotTotal);
    var row = Math.floor((y - craftingHeaderSize) / craftingSlotTotal);
    state.craftingLevel = Math.min(state.maxCraftingLevel, Math.floor(column / 2) + 1);
    if (row < 0) {
        state.craftingTypeFilter = 'all';
    } else if (row < 2) {
        state.craftingTypeFilter = 'weapon';
    } else if (row < 5) {
        state.craftingTypeFilter = 'armor';
    } else {
        state.craftingTypeFilter = 'accessory';
    }
    updateItemsThatWillBeCrafted();
    previewPointsChange('coins', -getCurrentCraftingCost());
    var craftingRow = ifdefor(craftingGrid[row], []);
    var item = craftingRow[column];
    if (!item || item.level > state.maxCraftingLevel) {
        overCraftingItem = null;
        return;
    }
    x -= item.craftingX;
    y -= item.craftingY;
    if (x < 0 || x > craftingSlotSize || y < 0|| y > craftingSlotSize) {
        overCraftingItem = null;
        return;
    }
    overCraftingItem = item;
}
function craftNewItems() {
    var totalCost = getCurrentCraftingCost();
    if (!spend('coins', totalCost)) {
        return;
    }
    $('.js-craftingSelectOptions').show();
    $('.js-craftingSelectOptions .js-itemSlot').each(function () {
        var item = craftItem();
        $(this).append(item.$item);
    });
    saveGame();
}
function updateCraftingCanvas() {
    if (!state.selectedCharacter) return;
    if (!craftingCanvasMousePosition) return;
    var maxX = state.maxCraftingLevel * 2 * craftingSlotTotal + 4 - craftingCanvas.width;
    var x = craftingCanvasMousePosition[0];
    var vx = 0;
    if (x < 100) vx = (x - 100) / 5;
    else if (x > craftingCanvas.width - 100) vx = (100 - (craftingCanvas.width - x)) / 5;
    if (vx) {
        state.craftingXOffset = Math.max(0, Math.min(maxX, state.craftingXOffset + vx));
        updateOverCraftingItem();
    }
}
function drawCraftingCanvas() {
    if (!state.selectedCharacter) return;
    var context = craftingContext;
    context.clearRect(0, 0, craftingCanvas.width, craftingCanvas.height);
    context.save();
    context.textBaseline = "middle";
    context.textAlign = 'center'
    context.translate(-state.craftingXOffset, 0);

    var firstColumn = Math.floor(state.craftingXOffset / craftingSlotTotal);
    for (var column = firstColumn; column < firstColumn + 17; column++) {
        if (column % 4 > 1) {
            context.fillStyle = '#ededed';
            context.fillRect(1 + column * craftingSlotTotal, 0, craftingSlotTotal, craftingCanvas.height);
        }
    }

    // Highlight the crafting items if the user has their mouse over the crafting canvas.
    if (state.craftingLevel && state.craftingTypeFilter) {
        var offset = 0;
        var rows = 6;
        switch (state.craftingTypeFilter) {
            case 'all':
                offset = -1;
                rows = 7;
                break;
            case 'weapon':
                rows = 2;
                break;
            case 'armor':
                offset = 2;
                rows = 3;
                break;
            case 'accessory':
                offset = 5;
                rows = 1;
                break
        }
        context.fillStyle = '#8F8';
        context.fillRect(0, craftingHeaderSize + offset * craftingSlotTotal, 4 + 2 * craftingSlotTotal * Math.min(state.selectedCharacter.adventurer.level, state.craftingLevel), 3 + rows * craftingSlotTotal);
        var levelsOverCurrent = state.craftingLevel - state.selectedCharacter.adventurer.level
        if (levelsOverCurrent > 0) {
            context.fillStyle = '#F88';
            context.fillRect(2 + 2 * craftingSlotTotal * state.selectedCharacter.adventurer.level, craftingHeaderSize + offset * craftingSlotTotal, 2 * craftingSlotTotal * levelsOverCurrent, 3 + rows * craftingSlotTotal);
        }
    }

    context.fillStyle = '#444';
    context.font = "20px sans-serif";
    for (var column = firstColumn; column < firstColumn + 17; column++) {
        var level = Math.floor(column / 2) + 1;
        context.fillText(level, 2 + (2 * level - 1.5) * craftingSlotTotal + craftingSlotSize / 2,  12);
    }


    context.font = (craftingSlotSize - 5) + "px sans-serif";
    for (var column = firstColumn; column < firstColumn + 17; column++) {
        var level = Math.floor(column / 2) + 1;
        if (level > state.maxCraftingLevel) continue;

        for (var row = 0; row < 6; row++) {
            var gridRow = ifdefor(craftingGrid[row], []);
            var item = gridRow[column];
            if (!item) continue;
            if (!state.craftedItems[item.key]) {
                context.fillStyle = '#888';
                context.beginPath();
                context.arc(item.craftingX + craftingSlotSize / 2, item.craftingY + craftingSlotSize / 2, craftingSlotSize / 2, 0, 2 * Math.PI);
                context.fill();
                context.fillStyle = 'white';
                context.fillText('?', item.craftingX + craftingSlotSize / 2, item.craftingY + craftingSlotSize / 2);
            } else if (item.iconSource) {
                context.fillStyle = '#aaa';
                context.beginPath();
                context.arc(item.craftingX + craftingSlotSize / 2, item.craftingY + craftingSlotSize / 2, craftingSlotSize / 2, 0, 2 * Math.PI);
                context.fill();
                context.fillStyle = '#ccc';
                context.beginPath();
                context.arc(item.craftingX + craftingSlotSize / 2, item.craftingY + craftingSlotSize / 2, craftingSlotSize / 2 - 2, 0, 2 * Math.PI);
                context.fill();
                var color = (state.craftedItems[item.key] & CRAFTED_UNIQUE) ? '#4af' : '#4c4';
                var tint = (state.craftedItems[item.key] & CRAFTED_UNIQUE) ? .7 : 0;
                drawTintedImage(context, item.iconSource.image, color, tint,
                            item.iconSource,
                            {'left': item.craftingX, 'top': item.craftingY, 'width': craftingSlotSize, 'height': craftingSlotSize});
                //context.drawImage(item.iconSource.image, item.iconSource.left, item.iconSource.top, item.iconSource.width, item.iconSource.height,
                 //               item.craftingX, item.craftingY, craftingSlotSize, craftingSlotSize);
            } else {
                context.fillStyle = '#080';
                context.fillRect(item.craftingX, item.craftingY, craftingSlotSize, craftingSlotSize);
            }
        }
    }
    context.restore();
}

var itemsFilteredByType = [];
var selectedCraftingWeight = 0;
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
function updateReforgeButton() {
    $('.js-reforge').toggleClass('disabled', state.coins < getReforgeCost());
    var text = ['Offer ' + points('coins', Math.floor(getCurrentCraftingCost() / 5)) + ' to try again.', '',
        'You can type \'r\' as a shortcut for clicking this button.'];
    $('.js-reforge').attr('helptext', text.join('<br/>'));
}
function updateItemsThatWillBeCrafted() {
    itemsFilteredByType = [];
    for (var itemLevel = 1; itemLevel <= state.craftingLevel && itemLevel < items.length; itemLevel++) {
        for (var item of ifdefor(items[itemLevel], [])) {
            if (itemMatchesFilter(item, state.craftingTypeFilter)) {
                itemsFilteredByType.push(item);
            }
        }
    }
    selectedCraftingWeight = 0;
    itemsFilteredByType.forEach(function (item) {
        selectedCraftingWeight += item.craftingWeight;
    });
}
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
    updateReforgeButton();
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
    updateItemsThatWillBeCrafted();
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

    updateItem(item);
    lastCraftedItem = craftedItem;
    return item;
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
        if (state.craftedItems[overCraftingItem.key] & CRAFTED_UNIQUE) {
            sections.push(tag('div', 'uniqueText', 'Unique Variant: </br>' + overCraftingItem.unique.displayName + '<br/>' + (100 * overCraftingItem.unique.chance).format(1) + '% chance for unique'));
        }
    } else {
        sections = ['??? ' + overCraftingItem.slot, 'Requires level ' + overCraftingItem.level, ''];
    }
    if (itemsFilteredByType.indexOf(overCraftingItem) >= 0) {
        sections.push('');
        sections.push((100 * overCraftingItem.craftingWeight / selectedCraftingWeight).format(1) + '% chance to obtain');
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
}
