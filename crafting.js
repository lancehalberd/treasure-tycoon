
var overCraftingItem = null;
var craftingCanvasYOffset = 0;
var lastCraftedItem = null;
var totalColumns;
var slotCraftingOffsets;
function initializeCraftingImage() {
    var offset = 0
    var offsets = {'weapon': offset, 'offhand': offset+=3, 'head': offset+=2,
        'body': offset+=2, 'arms': offset+=2, 'legs': offset+=2, 'feet': offset+=2,
        'back': offset+=2, 'ring': offset += 2};
    slotCraftingOffsets = offsets;
    totalColumns = offset + 2;
    state.craftingContext.fillStyle = '#888';
    $.each(offsets, function (slot, offset) {
        for (var i = 0; i < items.length; i++) {
            var y = 2 + (i - 1) * 11;
            for (var j = 0; j < ifdefor(itemsBySlotAndLevel[slot][i], []).length; j++) {
                var x = 2 + (offset + j) * 11;
                state.craftingContext.fillRect(x, y, 10, 10);
                var item = itemsBySlotAndLevel[slot][i][j];
                item.craftingX = x;
                item.craftingY = y;
            }
        }
    });
    $(state.craftingViewCanvas).on('mousemove', function () {
        var offset = relativeMousePosition($(this));
        var tx = Math.floor((offset[0] - 2) / 11);
        var level = Math.floor((offset[1] - 2) / 11) + 1;
        var slotOffset = 0;
        var overSlot = 'weapon';
        $.each(offsets, function (slot, offset) {
            if (tx >= offset) {
                slotOffset = offset;
                overSlot = slot;
            }
            return tx >= offset;
        });
        var items = ifdefor(ifdefor(itemsBySlotAndLevel[overSlot], [])[level], []);
        var index = tx - slotOffset;
        var maxLevel = $('.js-levelSelect option').last().attr('value');
        if (level <= maxLevel && index < items.length) {
            overCraftingItem = items[index];
        } else {
            overCraftingItem = null
        }
        if (mouseDown) {
            setCraftingLevel(level);
        }
    });
    $(state.craftingViewCanvas).on('click', function () {
        var offset = relativeMousePosition($(this));
        var tx = Math.floor((offset[0] - 2) / 11);
        var level = Math.floor((offset[1] - 2) / 11) + 1;
        var slotOffset = 0;
        var overSlot = 'weapon';
        $.each(offsets, function (slot, offset) {
            if (tx >= offset) {
                slotOffset = offset;
                overSlot = slot;
            }
            return tx >= offset;
        });
        var items = ifdefor(ifdefor(itemsBySlotAndLevel[overSlot], [])[level], []);
        var index = tx - slotOffset;
        setCraftingLevel(level);
    });
    $(state.craftingViewCanvas).on('mouseout', function () {
        overCraftingItem = null
    });
    drawCraftingViewCanvas();
}
function setCraftingLevel(level) {
    var maxLevel = $('.js-levelSelect option').last().attr('value');
    $('.js-levelSelect').val(Math.min(maxLevel, level));
    updateItemCrafting();
}
function drawCraftingViewCanvas() {
    var canvas = state.craftingViewCanvas;
    var context = state.craftingViewContext;
    var offset = 0;
    var columns = totalColumns;
    switch (craftingTypeFilter) {
        case 'all':
            break;
        case 'weapon':
            columns = 3;
            break;
        case 'armor':
            offset = slotCraftingOffsets['offhand'];
            columns = slotCraftingOffsets['feet'] - offset + 2;
            break;
        case 'accessory':
            offset = slotCraftingOffsets['back'];
            columns = slotCraftingOffsets['ring'] - offset + 2;
            break
        default:
            offset = slotCraftingOffsets[craftingTypeFilter];
            columns = 2;
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#8F8';
    context.fillRect(offset * 11, 0, 2 + columns * 11, 2 + 11 * craftingLevel);
    var maxLevel = $('.js-levelSelect option').last().attr('value');
    context.fillStyle = '#000';
    context.fillRect(0, 2 + 11 * maxLevel, canvas.width, canvas.height - (2 + 11 * maxLevel));
    context.drawImage(state.craftingCanvas, 0, 0, state.craftingCanvas.width, Math.min(state.craftingCanvas.height, 2 + 11 * maxLevel),
                      0, 0, state.craftingCanvas.width, Math.min(state.craftingCanvas.height, 2 + 11 * maxLevel));
}

$('.js-raritySelect').on('change', updateItemCrafting);
$('.js-levelSelect').on('change', updateItemCrafting);
$('.js-typeSelect').on('change', updateItemCrafting);
var craftingPointsType = 'coins';
var itemsFilteredByType = [];
var selectedCraftingWeight = 0;
var itemTotalCost = 5;
var craftingLevel = 1;
var craftingTypeFilter = 'all';
function updateItemCrafting() {
    var rarity = $('.js-raritySelect').val();
    craftingLevel = $('.js-levelSelect').val();
    craftingTypeFilter = $('.js-typeSelect').val();
    var playerCurrency = 0;
    var rarityMultiplier = (rarity === 'imbued') ? 5 : 1;
    if (rarity == 'plain') {
        craftingPointsType = 'coins'
    } else {
        craftingPointsType = 'anima'
    }

    var itemsFilteredByLevel = [];
    itemsFilteredByType = [];
    for (var itemLevel = 0; itemLevel <= craftingLevel && itemLevel < items.length; itemLevel++) {
        items[itemLevel].forEach(function (item) {
            itemsFilteredByLevel.push(item);
            if (itemMatchesFilter(item, craftingTypeFilter)) {
                itemsFilteredByType.push(item);
            }
        });
    }
    var typeMultiplier = (itemsFilteredByLevel.length / itemsFilteredByType.length).toFixed(2);
    $('.js-rarityCost').html(points(craftingPointsType, 5 * rarityMultiplier));
    var levelMultiplier = craftingLevel * craftingLevel * craftingLevel;
    $('.js-levelMultiplier').text('x ' + levelMultiplier);
    $('.js-typeMultiplier').text('x ' + typeMultiplier);
    itemTotalCost = Math.ceil(5 * levelMultiplier * typeMultiplier * rarityMultiplier);
    $('.js-craftItem').html('Craft for ' + points(craftingPointsType, itemTotalCost));
    updateCraftButton();
    updateSelectedCraftingWeight();
    drawCraftingViewCanvas();
}
function updateSelectedCraftingWeight() {
    selectedCraftingWeight = 0;
    itemsFilteredByType.forEach(function (item) {
        selectedCraftingWeight += item.craftingWeight;
    });
}
$('.js-craftItem').on('click', function () {
    if (!spend(craftingPointsType, itemTotalCost)) {
        return;
    }
    var craftingRoll = Math.floor(Math.random() * selectedCraftingWeight);
    var index = 0;
    while (craftingRoll > itemsFilteredByType[index].craftingWeight) {
        craftingRoll -= itemsFilteredByType[index].craftingWeight;
        index++;
    }
    if (lastCraftedItem) {
        state.craftingContext.fillStyle = ifdefor(lastCraftedItem.craftedUnique ? '#44ccff' : 'green');
        state.craftingContext.fillRect(lastCraftedItem.craftingX, lastCraftedItem.craftingY, 10, 10);
    }
    var craftedItem = itemsFilteredByType[index];
    itemsFilteredByType.forEach(function (item) {
        item.craftingWeight += item.level * item.level * 5;
    });
    craftedItem.craftingWeight /= 2;
    updateSelectedCraftingWeight();
    var item = makeItem(craftedItem, craftingLevel);
    var rarity = $('.js-raritySelect').val();
    if (rarity === 'enchanted') {
        enchantItemProper(item);
    } else if (rarity === 'imbued') {
        imbueItemProper(item);
    } else {
        // Rolling a plain item has a chance to create a unique if one exists for
        // this base type.
        checkToMakeItemUnique(item);
        if (item.unique) {
            craftedItem.craftedUnique = true;
        }
    }
    craftedItem.crafted = true;
    state.craftingContext.fillStyle = ifdefor(craftedItem.craftedUnique) ? '#0088ff' : 'orange';
    state.craftingContext.fillRect(craftedItem.craftingX, craftedItem.craftingY, 10, 10);
    drawCraftingViewCanvas();
    updateItem(item);
    $('.js-inventory').prepend(item.$item);
    lastCraftedItem = craftedItem;
});
function updateCraftButton() {
    $('.js-craftItem').prop('disabled', itemTotalCost > state[craftingPointsType]);
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
    if (overCraftingItem.crafted) {
        sections = [overCraftingItem.name, 'Requires level ' + overCraftingItem.level, ''];
        sections.push(bonusHelpText(overCraftingItem.bonuses, true));
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