
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
    state.craftingContext.font = (craftingSlotSize - 2) + "px sans-serif";
    state.craftingContext.textBaseline = "middle";
    state.craftingContext.textAlign = 'center'
    $.each(offsets, function (slot, offset) {
        for (var i = 0; i < items.length; i++) {
            var x = 2 + (i - 1) * craftingSlotTotal;
            for (var j = 0; j < ifdefor(itemsBySlotAndLevel[slot][i], []).length; j++) {
                var y = 2 + (offset + j) * craftingSlotTotal;
                state.craftingContext.fillStyle = '#888';
                state.craftingContext.fillRect(x, y, craftingSlotSize, craftingSlotSize);
                state.craftingContext.fillStyle = 'white';
                state.craftingContext.fillText('?', x + craftingSlotSize / 2, y + craftingSlotSize / 2);
                var item = itemsBySlotAndLevel[slot][i][j];
                item.craftingX = x;
                item.craftingY = y;
            }
        }
    });
    $(state.craftingViewCanvas).on('mousemove', function () {
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
        var maxLevel = $('.js-levelSelect option').last().attr('value');
        // subX/subY values are used to make sure we don't show hover when mouse
        // is actually in between crafting tiles.
        if (level <= maxLevel && index < items.length && subY <= 16 && subX <= 16) {
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
        var ty = Math.floor((offset[1] - 2) / craftingSlotTotal);
        var level = Math.floor((offset[0] - 2) / craftingSlotTotal) + 1;
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
    var maxLevel = $('.js-levelSelect option').last().attr('value');
    canvas.width = 4 + craftingSlotTotal * maxLevel;
    canvas.height = 4 + craftingSlotTotal * (totalRows - 1);
    var context = state.craftingViewContext;
    var offset = 0;
    var rows = totalRows;
    switch (craftingTypeFilter) {
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
            offset = slotCraftingOffsets[craftingTypeFilter];
            rows = 1;
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#8F8';
    context.fillRect(0, offset * craftingSlotTotal, 4 + craftingSlotTotal * craftingLevel, 4 + rows * craftingSlotTotal);
    context.drawImage(state.craftingCanvas, 0, 0, Math.min(state.craftingCanvas.width, 2 + craftingSlotTotal * maxLevel), state.craftingCanvas.height,
                      0, 0, Math.min(state.craftingCanvas.width, 2 + craftingSlotTotal * maxLevel), state.craftingCanvas.height);
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
        state.craftingContext.fillRect(lastCraftedItem.craftingX, lastCraftedItem.craftingY, craftingSlotSize, craftingSlotSize);
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
    state.craftingContext.fillRect(craftedItem.craftingX, craftedItem.craftingY, craftingSlotSize, craftingSlotSize);
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