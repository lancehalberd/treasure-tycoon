function exportCharacter(character) {
    var data = {};
    data.adventurer = exportAdventurer(character.adventurer);
    data.board = exportJewelBoard(character.board);
    data.gameSpeed = character.gameSpeed;
    data.levelsCompleted = character.levelsCompleted;
    data.replay = character.replay;
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
    $('.js-charactersBox').append(character.$characterCanvas)
    character.boardCanvas = createCanvas(jewelsCanvas.width, jewelsCanvas.height);
    character.boardContext = character.boardCanvas.getContext("2d");
    character.time = now();
    character.gameSpeed = characterData.gameSpeed;
    character.replay = characterData.replay;
    character.levelsCompleted = characterData.levelsCompleted;
    // Should probably show all next areas here.
    state.characters.push(character);
    character.board = importJewelBoard(characterData.board, character);
    // Equiping the jewels cannot be done until character.board is actually set.
    character.board.jewels.forEach(function (jewel) {
        jewel.character = character;
        updateAdjacentJewels(jewel);
    });
    // centerShapesInRectangle(character.board.fixed.map(jewelToShape).concat(character.board.spaces), rectangle(0, 0, character.boardCanvas.width, character.boardCanvas.height));
    drawBoardBackground(character.boardContext, character.board);
    updateAdventurer(character.adventurer);
    resetCharacterStats(character);
    setSelectedCharacter(character);
    // Update crafting view canvas in case new items were imported.
    drawCraftingViewCanvas();
    return character;
}
function exportAdventurer(adventurer) {
    var data = {};
    data.equipment = {};
    $.each(adventurer.equipment, function (key, item) {
        data.equipment[key] = item ? exportItem(item) : null;
    });
    data.hairOffset = adventurer.hairOffset;
    data.jobKey = adventurer.job.key;
    data.level = adventurer.level;
    data.name = adventurer.name;
    data.xp = adventurer.xp;
    return data;
}
function importAdventurer(adventurerData) {
    var personCanvas = createCanvas(personFrames * 32, 64);
    var personContext = personCanvas.getContext("2d");
    personContext.imageSmoothingEnabled = false;
    var adventurer = {
        'x': 0,
        'equipment': {},
        'job': characterClasses[adventurerData.jobKey],
        'width': 64,
        'bonuses': [],
        'unlockedAbilities': {},
        'abilities': [], //abilities.hook, abilities.hookRange1, abilities.hookRange2, abilities.hookDrag1, abilities.hookDrag2, abilities.hookPower
        'name': adventurerData.name,
        'hairOffset': adventurerData.hairOffset,
        'level': adventurerData.level,
        'xp': adventurerData.xp,
        'xpToLevel': xpToLevel(adventurerData.level - 1),
        'personCanvas': personCanvas,
        'personContext': personContext,
        'attackCooldown': 0,
        'percentHealth': 1
    };
    equipmentSlots.forEach(function (type) {
        adventurer.equipment[type] = null;
    });
    $.each(adventurerData.equipment, function (key, itemData) {
        if (itemData) {
            equipItem(adventurer, importItem(itemData), true);
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
    baseItem.crafted = true;
    state.craftingContext.fillStyle = 'green';
    state.craftingContext.fillRect(baseItem.craftingX, baseItem.craftingY, craftingSlotSize, craftingSlotSize);
    var item = {
        'base': baseItem,
        'itemLevel': itemData.itemLevel,
        'unique': itemData.unique
    };
    item.prefixes = itemData.prefixes.map(importAffix);
    item.suffixes = itemData.suffixes.map(importAffix);
    item.$item = $tag('div', 'js-item item', tag('div', 'icon ' + baseItem.icon) + tag('div', 'itemLevel', baseItem.level));
    updateItem(item);
    item.$item.data('item', item);
    return item;
}
function exportAffix(affix) {
    var data = {};
    data.affixKey = affix.base.key;
    data.bonuses = copy(affix.bonuses);
}
function importAffix(affixData) {
    var baseAffix = affixesByKey[affixData.affixKey];
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
            'shape': exportShape(fixedJewel.shape)
        }
        data.fixed.push(fixedData);
    });
    data.jewels = [];
    board.jewels.forEach(function (jewel) {
        var jewelData = {
            'tier': jewel.tier,
            'quality': jewel.quality,
            'components': jewel.components.slice(),
            'shape': exportShape(jewel.shape)
        }
        data.jewels.push(jewelData);
    });
    data.spaces = board.spaces.map(exportShape);
    return data;
}
// In addition to creating the jewel board, it also applies abilities to the adventurer.
function importJewelBoard(jewelBoardData, character) {
    var jewelBoard = {};
    jewelBoard.fixed = [];
    jewelBoardData.fixed.forEach(function (fixedJewelData) {
        var ability = abilities[fixedJewelData.abilityKey];
        var shape = importShape(fixedJewelData.shape);
        var fixedJewel = makeFixedJewel(shape, character, ability);
        character.adventurer.abilities.push(ability);
        jewelBoard.fixed.push(fixedJewel);
    });
    jewelBoard.jewels = [];
    jewelBoardData.jewels.forEach(function (jewelData) {
        var shape = importShape(jewelData.shape);
        var jewel = makeJewelProper(jewelData.tier, shape, jewelData.components, jewelData.quality);
        jewelBoard.jewels.push(jewel);
    });
    jewelBoard.spaces = jewelBoardData.spaces.map(importShape);
    return jewelBoard;
}
function exportShape(shape) {
    return {'shapeKey': shape.key, 'x': shape.points[0][0], 'y': shape.points[0][1], 'rotation': shape.angles[0]};
}
function importShape(shapeData) {
    return makeShape(shapeData.x, shapeData.y, shapeData.rotation, shapeDefinitions[shapeData.shapeKey][0], jewelShapeScale);
}
