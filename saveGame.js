function loadSavedData() {
    /** @type Object */
    var importedSaveData = $.jStorage.get("savedGame");
    if (importedSaveData) {
        importState(importedSaveData);
        return true;
    }
    return false;
}

function saveGame() {
    $.jStorage.set("savedGame", exportState(state));
}

function exportState(state) {
    var data = {};
    data.fame = state.fame;
    data.coins = state.coins;
    data.anima = state.anima;
    data.characters = state.characters.map(exportCharacter);
    data.visibleLevels = copy(state.visibleLevels);
    data.maxCraftingLevel = Math.min(80, state.maxCraftingLevel);
    data.craftedItems = state.craftedItems;
    data.craftingLevel = state.craftingLevel;
    data.applications = [];
    $('.js-heroApplication').each(function () {
        var application = $(this).data('character');
        data.applications.push(exportCharacter(application));
    });
    data.jewels = [];
    $('.js-jewelInventory .js-jewel').each(function () {
        data.jewels.push(exportJewel($(this).data('jewel')));
    })
    $('.js-jewelCraftingSlot .js-jewel').each(function () {
        data.jewels.push(exportJewel($(this).data('jewel')));
    })
    data.items = [];
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
    data.craftingTypeFilter = state.craftingTypeFilter;
    data.selectedCharacterIndex = state.characters.indexOf(state.selectedCharacter);
    return data;
}
function fixNumber(number) {
    number = parseInt(number);
    return isNaN(number) ? 0 : number;
}
function importState(stateData) {
    var $helperSlot = $('.js-inventory .js-inventorySlot').detach();
    $('.js-inventory').empty().append($helperSlot);
    $('.js-jewelInventory').empty();
    state = {};
    state.fame = fixNumber(stateData.fame);
    state.coins = fixNumber(stateData.coins);
    state.anima = fixNumber(stateData.anima);
    // Grab one slot to serve as the template for the applications we will add.
    var $slot = $('.js-heroApplication').first().detach();
    // Clean up all the slots on the page.
    $('.js-heroApplication').data('character', null).remove();
    var applications = ifdefor(stateData.applications, []).map(importCharacter);
    while ($('.js-heroApplication').length + applications.length < 2) {
        var $applicationPanel = $slot.clone();
        $('.js-recruitmentColumn').append($applicationPanel);
        createNewHeroApplicant($applicationPanel);
    }
    applications.forEach(function (application) {
        var $applicationPanel = $slot.clone();
        $('.js-recruitmentColumn').append($applicationPanel);
        setHeroApplication($applicationPanel, application);
    });
    // Clean up the last slot.
    $slot.data('character', null).remove();
    state.characters = [];
    state.visibleLevels = copy(ifdefor(stateData.visibleLevels, {}));
    state.maxCraftingLevel = stateData.maxCraftingLevel;
    state.craftedItems = ifdefor(stateData.craftedItems, {});
    redrawCraftingContext();
    $('.js-charactersBox').empty();
    var characters = stateData.characters.map(importCharacter);
    characters.forEach(function (character) {
        if (isNaN(character.divinity) || typeof(character.divinity) !== "number") {
            character.divinity = 0;
        }
        state.characters.push(character);
        for (var levelKey of Object.keys(character.divinityScores)) {
            var level = map[levelKey];
            if (!level) {
                delete character.divinityScores[levelKey];
                continue;
            }
            if (isNaN(character.divinityScores[levelKey])) {
                delete character.divinityScores[levelKey];
            }
            state.visibleLevels[levelKey] = true;
            for (var nextLevelKey of level.unlocks) {
                state.visibleLevels[nextLevelKey] = true;
            }
        }
        $('.js-charactersBox').append(character.$characterCanvas);
    });

    stateData.jewels.forEach(function (jewelData) {
        var jewel = importJewel(jewelData);
        jewel.shape.setCenterPosition(jewel.canvas.width / 2, jewel.canvas.height / 2);
        addJewelToInventory(jewel.$item);
    });
    stateData.items.forEach(function (itemData) {
        var item = importItem(itemData);
        if (item) addToInventory(item);
    });
    if (stateData.craftingItems && stateData.craftingItems.length) {
        $('.js-craftingSelectOptions .js-itemSlot').each(function (index) {
            // Don't throw errors just because there are only 1-2 items when
            // we expect 3. Just show however many we have.
            if (!stateData.craftingItems[index]) return;
            var item = importItem(stateData.craftingItems[index]);
            if (item) $(this).append(item.$item);
        });
        $('.js-craftingSelectOptions').show();
        $('.js-craftingOptions').hide();
    } else if (stateData.enchantmentItem) {
        var item = importItem(stateData.enchantmentItem);
        if (item) {
            $('.js-enchantmentSlot').append(item.$item);
            $('.js-enchantmentOptions').show();
            $('.js-craftingOptions').hide();
            updateEnchantmentOptions();
        }
    }
    state.craftingLevel = stateData.craftingLevel;
    state.craftingTypeFilter = stateData.craftingTypeFilter;
    drawCraftingViewCanvas();
    changedPoints('coins');
    changedPoints('anima');
    changedPoints('fame');
    updateItemCrafting();
    updateRetireButtons();
    var selectedCharacterIndex = Math.max(0, Math.min(ifdefor(stateData.selectedCharacterIndex, 0), state.characters.length - 1));
    setSelectedCharacter(state.characters[selectedCharacterIndex]);
    // Update crafting view canvas in case new items were imported.
    drawCraftingViewCanvas();
    return state;
}
function exportCharacter(character) {
    var data = {};
    data.adventurer = exportAdventurer(character.adventurer);
    data.board = exportJewelBoard(character.board);
    data.gameSpeed = character.gameSpeed;
    data.divinityScores = character.divinityScores;
    data.levelTimes = character.levelTimes;
    data.fame = character.fame;
    data.divinity = character.divinity;
    data.currentLevelKey = character.currentLevelKey;
    data.levelCompleted = character.levelCompleted;
    data.applicationAge = ifdefor(character.applicationAge, 0);
    return data;
}
function importCharacter(characterData) {
    var character = {};
    character.adventurer = importAdventurer(characterData.adventurer);
    character.adventurer.character = character;
    character.adventurer.direction = 1; // Character moves left to right.
    character.adventurer.isMainCharacter = true;
    character.adventurer.bonusMaxHealth = 0;
    character.adventurer.percentHealth = 1;
    character.adventurer.health = character.adventurer.maxHealth;
    var characterCanvas = createCanvas(32, 64);
    character.$characterCanvas = $(characterCanvas);
    character.$characterCanvas.addClass('js-character character')
        .attr('helptext', character.adventurer.job.name + ' ' + character.adventurer.name)
        .data('character', character);
    character.characterContext = characterCanvas.getContext("2d");
    character.boardCanvas = createCanvas(jewelsCanvas.width, jewelsCanvas.height);
    character.boardContext = character.boardCanvas.getContext("2d");
    character.time = now();
    character.gameSpeed = characterData.gameSpeed;
    character.replay = false;
    character.divinityScores = ifdefor(characterData.divinityScores, {});
    character.levelTimes = ifdefor(characterData.levelTimes, {});
    character.divinity = ifdefor(characterData.divinity, 0);
    character.currentLevelKey = ifdefor(characterData.currentLevelKey, ifdefor(character.adventurer.job.levelKey, 'meadow'));
    character.levelCompleted = ifdefor(characterData.levelCompleted, false);
    if (!map[character.currentLevelKey]) {
        character.currentLevelKey = ifdefor(character.adventurer.job.levelKey, 'meadow');
        character.levelCompleted = false;
    }
    character.board = importJewelBoard(characterData.board, character);
    character.fame = ifdefor(characterData.fame, Math.ceil(character.divinity / 10));
    character.applicationAge = ifdefor(characterData.applicationAge, 0);
    // Equiping the jewels cannot be done until character.board is actually set.
    character.board.jewels.concat(character.board.fixed).forEach(function (jewel) {
        jewel.character = character;
        updateAdjacentJewels(jewel);
    });
    // centerShapesInRectangle(character.board.fixed.map(jewelToShape).concat(character.board.spaces), rectangle(0, 0, character.boardCanvas.width, character.boardCanvas.height));
    drawBoardBackground(character.boardContext, character.board);
    updateAdventurer(character.adventurer);
    return character;
}
function exportAdventurer(adventurer) {
    var data = {};
    data.equipment = {};
    $.each(adventurer.equipment, function (key, item) {
        data.equipment[key] = item ? exportItem(item) : null;
    });
    data.hairOffset = adventurer.hairOffset;
    data.skinColorOffset = adventurer.skinColorOffset;
    data.jobKey = adventurer.job.key;
    data.level = adventurer.level;
    data.name = adventurer.name;
    return data;
}
function importAdventurer(adventurerData) {
    var adventurer = makeAdventurerFromData(adventurerData);
    for (var i = 0; i < ifdefor(window.testAbilities, []).length; i++) {
        adventurer.abilities.push(testAbilities[i]);
    }
    $.each(adventurerData.equipment, function (key, itemData) {
        if (itemData) {
            var item = importItem(itemData);
            if (item) equipItem(adventurer, item, false);
        }
    });
    return adventurer;
}
function exportItem(item) {
    var data = {};
    data.itemKey = item.base.key;
    data.itemLevel = item.itemLevel;
    data.prefixes = item.prefixes.map(exportAffix);
    data.suffixes = item.suffixes.map(exportAffix);
    data.unique = item.unique;
    return data;
}
function importItem(itemData) {
    var baseItem = itemsByKey[itemData.itemKey];
    // This can happen if a base item was removed since they last saved the game.
    if (!baseItem) return null;
    var item = {
        'base': baseItem,
        'itemLevel': itemData.itemLevel,
        'unique': itemData.unique
    };
    item.prefixes = itemData.prefixes.map(importAffix).filter(function (value) { return value;});
    item.suffixes = itemData.suffixes.map(importAffix).filter(function (value) { return value;});
    item.$item = $tag('div', 'js-item item', tag('div', 'icon ' + baseItem.icon) + tag('div', 'itemLevel', baseItem.level));
    updateItem(item);
    item.$item.data('item', item);
    item.$item.attr('helptext', '-').data('helpMethod', getItemHelpText);
    return item;
}
function exportAffix(affix) {
    var data = {};
    data.affixKey = affix.base.key;
    data.bonuses = copy(affix.bonuses);
    return data;
}
function importAffix(affixData) {
    var baseAffix = affixesByKey[affixData.affixKey];
    if (!baseAffix) return null;
    var affix = {
        'base': baseAffix,
        'bonuses': affixData.bonuses
    };
    return affix;
}
function exportJewelBoard(board) {
    var data = {};
    data.fixed = [];
    board.fixed.forEach(function (fixedJewel) {
        var fixedData = {
            'abilityKey': fixedJewel.ability.key,
            'shape': exportShape(fixedJewel.shape),
            'confirmed': fixedJewel.confirmed,
            'disabled': ifdefor(fixedJewel.disabled, false)
        }
        data.fixed.push(fixedData);
    });
    data.jewels = board.jewels.map(exportJewel);
    data.spaces = board.spaces.map(exportShape);
    if (board.boardPreview) {
        data.boardPreview = exportJewelBoard(board.boardPreview);
    }
    return data;
}
// In addition to creating the jewel board, it also applies abilities to the adventurer.
function importJewelBoard(jewelBoardData, character) {
    var jewelBoard = {};
    jewelBoard.fixed = [];
    jewelBoardData.fixed.forEach(function (fixedJewelData) {
        var ability = abilities[fixedJewelData.abilityKey];
        if (fixedJewelData.confirmed) {
            character.adventurer.unlockedAbilities[fixedJewelData.abilityKey] = true;
        }
        if (!ability) {
            return;
        }
        var shape = importShape(fixedJewelData.shape);
        var fixedJewel = makeFixedJewel(shape, character, ability);
        fixedJewel.confirmed = fixedJewelData.confirmed;
        fixedJewel.disabled = ifdefor(fixedJewelData.disabled, false);
        if (fixedJewel.confirmed && !fixedJewel.disabled) {
            character.adventurer.abilities.push(ability);
        }
        jewelBoard.fixed.push(fixedJewel);
    });
    jewelBoard.jewels = jewelBoardData.jewels.map(importJewel);
    jewelBoard.spaces = jewelBoardData.spaces.map(importShape);
    if (jewelBoardData.boardPreview) {
        jewelBoard.boardPreview = importJewelBoard(jewelBoardData.boardPreview, character);
    }
    return jewelBoard;
}
function exportJewel(jewel) {
    return {
        'tier': jewel.tier,
        'quality': jewel.quality,
        'components': jewel.components.slice(),
        'shape': exportShape(jewel.shape)
    }
}
function importJewel(jewelData) {
    return makeJewelProper(jewelData.tier, importShape(jewelData.shape), jewelData.components, jewelData.quality);
}
function exportShape(shape) {
    return {'shapeKey': shape.key, 'x': shape.points[0][0] * originalJewelScale / displayJewelShapeScale, 'y': shape.points[0][1] * originalJewelScale / displayJewelShapeScale, 'rotation': shape.angles[0]};
}
function importShape(shapeData) {
    return makeShape(shapeData.x * displayJewelShapeScale / originalJewelScale, shapeData.y * displayJewelShapeScale / originalJewelScale, shapeData.rotation, shapeDefinitions[shapeData.shapeKey][0], displayJewelShapeScale);
}
