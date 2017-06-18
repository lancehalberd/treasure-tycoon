const getDefaultState = () => {
    return {
        anima: 0,
        characters: [],
        coins: 0,
        completedLevels: {},
        craftedItems: {},
        craftingLevel: null,
        craftingTypeFilter: null,
        craftingXOffset: 0,
        fame: 0,
        guildAreas: {},
        guildStats: {}, // This isn't actually saved, it just stores the computed guild stats.
        jewelCraftingLevel: 1,
        jewelCraftingExperience: 0,
        maxAnimaJewelMultiplier: 1,
        maxCraftingLevel: 1,
        selectedCharacter: null,
        skipShrinesEnabled: false,
        visibleLevels: {}, // This isn't stored, it is computed from completedLevels on load.
    }
};

function exportState({
    anima, characters, coins, completedLevels, craftedItems, craftingLevel, craftingTypeFilter, craftingXOffset,
    fame, guildAreas, jewelCraftingLevel, jewelCraftingExperience, maxAnimaJewelMultiplier, maxCraftingLevel,
    selectedCharacter, skipShrinesEnabled,
}) {
    var data = {
        fame, coins, anima,
        craftingXOffset, craftedItems, craftingLevel, craftingTypeFilter,
        jewelCraftingLevel, jewelCraftingExperience, maxAnimaJewelMultiplier, skipShrinesEnabled,
        applications: allApplications.filter(application => application.character)
            .map(application => exportCharacter(application.character)),
        characters: characters.map(exportCharacter),
        completedLevels: copy(completedLevels),
        items: [],
        guildAreas: {},
        jewels: [],
        maxCraftingLevel: Math.min(maxCraftingLevel, 80),
        selectedCharacterIndex: state.characters.indexOf(state.selectedCharacter),
        trophies: {},
    };
    $('.js-jewelInventory .js-jewel').each(function () {
        data.jewels.push(exportJewel($(this).data('jewel')));
    })
    $('.js-jewelCraftingSlot .js-jewel').each(function () {
        data.jewels.push(exportJewel($(this).data('jewel')));
    })
    $('.js-inventory .js-item').each(function () {
        data.items.push(exportItem($(this).data('item')));
    });
    if ($('.js-craftingSelectOptions:visible').length) {
        data.craftingItems = [];
        $('.js-craftingSelectOptions .js-itemSlot .js-item').each(function () {
            data.craftingItems.push(exportItem($(this).data('item')));
        })
    } else if ($('.js-enchantmentSlot .js-item').length) {
        data.enchantmentItem = exportItem($('.js-enchantmentSlot .js-item').data('item'));
    }
    for (var trophyKey in altarTrophies) {
        var trophy = altarTrophies[trophyKey];
        data.trophies[trophyKey] = {
            'level': trophy.level,
            'value': trophy.value,
            'areaKey': trophy.areaKey,
            'objectKey': trophy.objectKey
        };
    }
    for (var areaKey in state.guildAreas) {
        var area = state.guildAreas[areaKey];
        data.guildAreas[areaKey] = {'objects': {}};
        for (var object of area.objects) {
            if (object.key && object.level) {
                data.guildAreas[areaKey].objects[object.key] = {'level': object.level};
            }
        }
    }
    return data;
}

function importState({
        anima, applications, characters, coins, completedLevels,
        craftingXOffset, craftedItems, craftingItems, craftingLevel, craftingTypeFilter,
        enchantmentItem, fame, guildAreas, items, jewels,
        jewelCraftingLevel, jewelCraftingExperience, maxAnimaJewelMultiplier,
        maxCraftingLevel, selectedCharacterIndex, skipShrinesEnabled, trophies,
}, globalGuildAreas) {
    var $helperSlot = $('.js-inventory .js-inventorySlot').detach();
    $('.js-inventory').empty().append($helperSlot);
    $('.js-jewelInventory').empty();
    state = {
        anima,
        characters: [],
        coins,
        completedLevels: copy(completedLevels || {}),
        craftingLevel, craftingTypeFilter,
        craftingXOffset: craftingXOffset || 0,
        craftedItems: craftedItems || {},
        fame,
        guildAreas: {},
        guildStats: {},
        jewelCraftingLevel, jewelCraftingExperience, maxCraftingLevel,
        skipShrinesEnabled,
        visibleLevels: {},
    };
    initializeVariableObject(state.guildStats, {'variableObjectType': 'guild'}, state.guildStats);
    guildAreas = guildAreas || {};
    for (var areaKey in ifdefor(globalGuildAreas, {})) {
        state.guildAreas[areaKey] = globalGuildAreas[areaKey];
        var savedAreaData = guildAreas[areaKey] || {};
        for (var objectKey in savedAreaData.objects) {
            var savedObjectData = savedAreaData.objects[objectKey];
            try {
            globalGuildAreas[areaKey].objectsByKey[objectKey].level = savedObjectData.level;
        } catch (e) {
            debugger;
        }
        }
    }
    var applications = ifdefor(applications, []).map(importCharacter);
    for (var i = 0; i < applications.length; i++) allApplications[i].character = applications[i];
    setMaxAnimaJewelBonus(ifdefor(maxAnimaJewelMultiplier, 1));
    // Read trophy data before characters so that their bonuses will be applied when
    // we first initialize the characters.
    trophies = trophies || {};
    for (var trophyKey in altarTrophies) {
        if (!trophies[trophyKey]) continue;
        var trophy = altarTrophies[trophyKey];
        var trophyData = trophies[trophyKey];
        trophy.level = trophyData.level;
        trophy.value = trophyData.value;
        var area = globalGuildAreas[trophyData.areaKey];
        if (!area) continue;
        var altar = area.objectsByKey[trophyData.objectKey];
        if (!altar) continue;
        addTrophyToAltar(altar, trophy);
    }
    addAllUnlockedFurnitureBonuses();
    // This might happen if we changed how much each holder contains during an update.
    characters.map(importCharacter).forEach(character => {
        if (isNaN(character.divinity) || typeof(character.divinity) !== "number") {
            character.divinity = 0;
        }
        state.characters.push(character);
        updateTrophy('level-' + character.adventurer.job.key, character.adventurer.level);
        for (var levelKey of Object.keys(character.divinityScores)) {
            var level = map[levelKey];
            if (!level) {
                delete character.divinityScores[levelKey];
                continue;
            }
            if (isNaN(character.divinityScores[levelKey])) {
                delete character.divinityScores[levelKey];
            }
            state.completedLevels[levelKey] = true;
        }
        var bed = allBeds[state.characters.length - 1];
        if (bed) enterGuildArea(character, {'areaKey': bed.area.key, 'x': (bed.x > 400) ? bed.x - 80 : bed.x + 80, 'z': bed.z});
        else enterGuildArea(character, guildYardEntrance);
        $('.js-charactersBox').append(character.$characterCanvas);
    });
    for (var completedLevelKey in state.completedLevels) {
        var level = map[completedLevelKey];
        if (!level) delete state.completedLevels[completedLevelKey];
        state.visibleLevels[completedLevelKey] = true;
        for (var nextLevelKey of level.unlocks) state.visibleLevels[nextLevelKey] = true;
    }
    jewels.map(importJewel).forEach(jewel => {
        jewel.shape.setCenterPosition(jewel.canvas.width / 2, jewel.canvas.height / 2);
        addJewelToInventory(jewel.$item);
    });
    items.map(importItem).filter(item => item).forEach(addToInventory);
    if (craftingItems && craftingItems.length) {
        $('.js-craftingSelectOptions .js-itemSlot').each(function (index) {
            // Don't throw errors just because there are only 1-2 items when
            // we expect 3. Just show however many we have.
            if (!craftingItems[index]) return;
            var item = importItem(craftingItems[index]);
            if (item) $(this).append(item.$item);
        });
        $('.js-craftingSelectOptions').show();
        $('.js-craftingOptions').hide();
    } else if (enchantmentItem) {
        var item = importItem(enchantmentItem);
        if (item) {
            $('.js-enchantmentSlot').append(item.$item);
            $('.js-enchantmentOptions').show();
            $('.js-craftingOptions').hide();
            updateEnchantmentOptions();
        }
    }
    const defaultState = getDefaultState();
    for (var key in defaultState) {
        state[key] = ifdefor(state[key], defaultState[key]);
    }
    changedPoints('coins');
    changedPoints('anima');
    changedPoints('fame');
    updateRetireButtons();
    var selectedCharacterIndex = Math.max(0, Math.min(ifdefor(selectedCharacterIndex, 0), state.characters.length - 1));
    setSelectedCharacter(state.characters[selectedCharacterIndex]);
    checkIfAltarTrophyIsAvailable();
    return state;
}

var state = getDefaultState();