function loadSavedData() {
    if (window.location.search.substr(1) === 'reset' && confirm("Clear your saved data?")) {
        return false;
    }
    var importedSaveData = $.jStorage.get("savedGame");
    if (importedSaveData) {
        importState(importedSaveData, guildAreas);
        return true;
    }
    return false;
}

function saveGame() {
    $.jStorage.set("savedGame", exportState(state));
}
function eraseSave() {
    $.jStorage.set("savedGame", null);
}
function exportCharacter(character) {
    var data = {};
    data.hero = exportAdventurer(character.hero);
    data.autoActions = character.autoActions;
    data.manualActions = character.manualActions;
    data.board = exportJewelBoard(character.board);
    data.autoplay = character.autoplay;
    data.gameSpeed = character.gameSpeed;
    data.divinityScores = character.divinityScores;
    data.levelTimes = character.levelTimes;
    data.fame = character.fame;
    data.divinity = character.divinity;
    data.currentLevelKey = character.currentLevelKey;
    data.applicationAge = ifdefor(character.applicationAge, 0);
    return data;
}
function importCharacter(characterData) {
    var character = {};
    // Old saves used adventurer instead of hero.
    character.hero = character.adventurer = importAdventurer(characterData.hero || characterData.adventurer);
    character.autoActions = characterData.autoActions || {};
    character.manualActions = characterData.manualActions || {};
    character.adventurer.character = character;
    character.adventurer.heading = [1, 0, 0]; // Character moves left to right.
    character.adventurer.bonusMaxHealth = 0;
    character.adventurer.percentHealth = 1;
    character.adventurer.health = character.adventurer.maxHealth;
    var characterCanvas = createCanvas(40, 20);
    character.$characterCanvas = $(characterCanvas);
    character.$characterCanvas.addClass('js-character character')
        .attr('helptext', '').data('helpMethod', () => actorHelpText(character.hero))
        .data('character', character);
    character.characterContext = characterCanvas.getContext("2d");
    character.boardCanvas = createCanvas(jewelsCanvas.width, jewelsCanvas.height);
    character.boardContext = character.boardCanvas.getContext("2d");
    character.time = now();
    character.autoplay = characterData.autoplay;
    character.gameSpeed = characterData.gameSpeed;
    character.replay = false;
    character.divinityScores = ifdefor(characterData.divinityScores, {});
    character.levelTimes = ifdefor(characterData.levelTimes, {});
    character.divinity = ifdefor(characterData.divinity, 0);
    character.currentLevelKey = ifdefor(characterData.currentLevelKey, 'guild');
    if (!map[character.currentLevelKey]) character.currentLevelKey = 'guild';
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
            if (item) equipItemProper(adventurer, item, false);
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
