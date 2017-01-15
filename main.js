'use strict';

var pointsMap = {
    'fame': 'Fame',
    'coins': 'Coins',
    'anima': 'Anima'
}
function points(type, value) {
    if (type === 'coins') {
        return tag('span', 'icon coin') + ' ' + tag('span', 'value '+ pointsMap[type], value.abbreviate());
    }
    return tag('span', 'icon anima') + ' ' + tag('span', 'value '+ pointsMap[type], value.abbreviate());
}

var fps = 6;
var state = {
    selectedCharacter: null,
    completedLevels: {},
    visibleLevels: {}, // {'grove': true, 'orchard': true}
    characters: [],
    fame: 0,
    coins: 0,
    anima: 0,
    maxCraftingLevel: 1,
    craftingXOffset: 0,
    craftedItems: {},
    craftingLevel: null,
    craftingTypeFilter: null,
    applicationSlots: 2,
    skipShrinesEnabled: false
};
var craftingCanvas = $('.js-craftingCanvas')[0];
var craftingContext = craftingCanvas.getContext('2d');
var gameHasBeenInitialized = false;
var mainCanvas, mainContext, jewelsCanvas, jewelsContext, previewContext;
setInterval(mainLoop, 20);
// Load any graphic assets needed by the game here.
function initializeGame() {
    gameHasBeenInitialized = true;
    closedChestSource = {'image': images['gfx/chest-closed.png'], 'left': 0, 'top': 0, 'width': 32, 'height': 32};
    openChestSource = {'image': images['gfx/chest-open.png'], 'left': 0, 'top': 0, 'width': 32, 'height': 32};
    showContext('adventure');
    initalizeMonsters();
    initializeBackground();
    initializeCraftingGrid();
    initializeCoins();
    initializeProjectileAnimations();
    mainCanvas = $('.js-mainCanvas')[0];
    mainContext = mainCanvas.getContext('2d');
    mainContext.imageSmoothingEnabled = false;
    jewelsCanvas = $('.js-skillCanvas')[0];
    jewelsContext = jewelsCanvas.getContext("2d");
    previewContext = $('.js-characterColumn .js-previewCanvas')[0].getContext("2d")
    previewContext.imageSmoothingEnabled = false;
    $('.js-loading').hide();
    $('.js-gameContent').show();
    initializeLevelEditing();
    var testShape = makeShape(0, 0, 0, shapeDefinitions.triangle[0]).scale(originalJewelScale);
    var jewelButtonCanvas = $('.js-jewelButtonCanvas')[0];
    centerShapesInRectangle([testShape], rectangle(0, 0, jewelButtonCanvas.width, jewelButtonCanvas.height));
    drawJewel(jewelButtonCanvas.getContext('2d'), testShape, [0, 0], 'black');
    if (!loadSavedData()) {
        gainJewel(makeJewel(1, 'triangle', [90, 5, 5], 1.1));
        gainJewel(makeJewel(1, 'triangle', [5, 90, 5], 1.1));
        gainJewel(makeJewel(1, 'triangle', [5, 5, 90], 1.1));
        gain('fame', 1);
        gain('coins', 50);
        gain('anima', 0);
        var jobKey = Random.element(jobRanks[0]);
        jobKey = ifdefor(testJob, jobKey);
        var startingCharacter = newCharacter(characterClasses[jobKey]);
        updateAdventurer(startingCharacter.adventurer);
        hireCharacter(startingCharacter);
        $('.js-heroApplication').after($('.js-heroApplication').clone());
        var otherKeys = jobRanks[0].slice();
        removeElementFromArray(otherKeys, jobKey, true);
        $('.js-heroApplication').each(function () {
            createNewHeroApplicant($(this), otherKeys.pop());
        });
    }
    if (state.skipShrinesEnabled) {
        $('.js-shrineButton').show();
    }
    updateItemsThatWillBeCrafted();
    updateEnchantmentOptions();
    for (var tier1JobKey of jobRanks[0]) {
        var job = characterClasses[tier1JobKey];
        unlockMapLevel(job.levelKey);
    }
    centerMapOnLevel(map[state.selectedCharacter.currentLevelKey], true);
    drawMap();
    // The main loop will throw errors constantly if an error prevented selectedCharacter
    // from being set, so instead, just throw an error before running setInterval.
    if (!state.selectedCharacter) {
        throw new Error('No selected character found');
    }
}
var frameMilliseconds = 20;
var homeSource = {'image': requireImage('gfx/nielsenIcons.png'), 'left': 32, 'top': 128, 'width': 32, 'height': 32};
var shrineSource = {'image': requireImage('gfx/militaryIcons.png'), 'left': 102, 'top': 125, 'width': 16, 'height': 16};
function mainLoop() {
    // Initially we don't do any of the main game logic until preloading finishes
    // then we initialize the game and start running the main game loop.
    if (!gameHasBeenInitialized) {
        if (numberOfImagesLeftToLoad <= 0) {
            initializeGame();
        } else {
            return;
        }
    }
    var time = now();
    if ($('.js-jewelInventory').is(":visible")) {
        redrawInventoryJewels();
    }
    var fps = Math.floor(3 * 5 / 3);
    var characters = testingLevel ? [state.selectedCharacter] : state.characters;
    for (var character of characters) {
        if (character.area && !character.paused) {
            character.loopCount = ifdefor(character.loopCount) + 1;
            if (character.loopCount % ifdefor(character.loopSkip)) {
                return;
            }
            for (var i = 0; i < character.gameSpeed && character.area; i++) {
                character.time += frameMilliseconds / 1000;
                // Original this branch was designed to make the camera change for opening the treasure
                // But it actually applies to both the chest and the boss, which turned out to be fine.
                var centerX = character.adventurer.x + 200 * character.adventurer.direction;
                //if (character.cameraX < centerX - 400 || character.cameraX > centerX - 400) {
                    character.cameraX = (character.cameraX * 10 + centerX - 400) / 11;
                //}
                adventureLoop(character, frameMilliseconds / 1000);
                if (!character.area) {
                    return
                }
            }
        }
        var frame = arrMod(character.adventurer.source.walkFrames, Math.floor(now() * fps / 1000));
        if (state.selectedCharacter === character) {
            previewContext.clearRect(0, 0, 64, 128);
            previewContext.drawImage(character.adventurer.personCanvas, frame * 96, 0 , 96, 64, -64, -20, 192, 128);
            character.characterContext.globalAlpha = 1;
        } else {
            character.characterContext.globalAlpha = .3;
        }
        //character.characterContext.fillStyle = 'white';
        character.characterContext.clearRect(0, 0, 32, 64);
        character.characterContext.drawImage(character.adventurer.personCanvas, frame * 96, 0 , 96, 64, -32, -10, 96, 64);
        character.characterContext.globalAlpha = 1;
        if (state.selectedCharacter !== character) {
            if (ifdefor(character.isStuckAtShrine)) {
                drawImage(character.characterContext, shrineSource.image, shrineSource, rectangle(0, 0, 16, 16));
            } else if (!character.area) {
                drawImage(character.characterContext, homeSource.image, homeSource, rectangle(0, 0, 16, 16));
            }
        }
    }
    if (currentContext === 'adventure') {
        if (editingLevel && !testingLevel) {
            drawAdventure(state.selectedCharacter);
            if (editingLevel && editingLevel.board) {
                var board = boards[editingLevel.board];
                board = readBoardFromData(board, state.selectedCharacter, abilities[editingLevel.skill], true);
                centerShapesInRectangle(board.fixed.map(jewelToShape).concat(board.spaces), rectangle(600, 0, 150, 150));
                drawBoardBackground(mainContext, board);
                drawBoardJewelsProper(mainContext, [0, 0], board);
            }
        } else if (state.selectedCharacter.area) {
            drawAdventure(state.selectedCharacter);
        } else {
            updateMap();
            drawMap();
        }
    }
    if (currentContext === 'item') {
        updateCraftingCanvas();
        drawCraftingCanvas();
    }
    if (editingMap && distributingMapNodes) {
        /*for (var selectedNode of selectedMapNodes) {
            var coordinateSum = [0, 0, 0];
            var sumCount = 0;
            for (var key in map) {
                var otherNode = map[key];
                var delta = [otherNode.coords[0] - selectedNode.coords[0], otherNode.coords[1] - selectedNode.coords[1], otherNode.coords[2] - selectedNode.coords[2]];
                if (delta[0] * delta[0] + delta[1] * delta[1] + delta[2] * delta[2] < 20000) {
                    coordinateSum[0] += otherNode.coords[0];
                    coordinateSum[1] += otherNode.coords[1];
                    coordinateSum[2] += otherNode.coords[2];
                    sumCount++;
                }
            }
            console.log(sumCount);
            if (sumCount > 3) {
                selectedNode.coords[0] = coordinateSum[0] / sumCount;
                selectedNode.coords[1] = coordinateSum[1] / sumCount;
                selectedNode.coords[2] = coordinateSum[2] / sumCount;
                var C = 600 / Math.sqrt(selectedNode.coords[0] * selectedNode.coords[0] + selectedNode.coords[1]*selectedNode.coords[1] + selectedNode.coords[2]*selectedNode.coords[2]);
                selectedNode.coords[0] *= C;
                selectedNode.coords[1] *= C;
                selectedNode.coords[2] *= C;
            }
        }*/
        /*for (var key in map) {
            var level = map[key];
            if (selectedMapNodes.indexOf(level) >= 0 && level.v) {
                level.coords[0] += level.v[0];
                level.coords[1] += level.v[1];
                level.coords[2] += level.v[2];
                var C = 600 / Math.sqrt(level.coords[0] * level.coords[0] + level.coords[1]*level.coords[1] + level.coords[2]*level.coords[2]);
                level.coords[0] *= C;
                level.coords[1] *= C;
                level.coords[2] *= C;
            }
            level.v = [0, 0, 0];
        }
        for (var i = 0; i < mapKeys.length; i++) {
            var level1 = map[mapKeys[i]];
            for (var j = i + 1; j < mapKeys.length; j++) {
                var level2 = map[mapKeys[j]];
                var delta = [level2.coords[0] - level1.coords[0], level2.coords[1] - level1.coords[1], level2.coords[2] - level1.coords[2]];
                var mag = (delta[0] * delta[0] * delta[0] + delta[1] * delta[1] * delta[1] + delta[2] * delta[2] * delta[2]) / 500;
                level1.v[0] -= delta[0] / mag;
                level1.v[1] -= delta[1] / mag;
                level1.v[2] -= delta[2] / mag;
                level2.v[0] += delta[0] / mag;
                level2.v[1] += delta[1] / mag;
                level2.v[2] += delta[2] / mag;
            }
        }*/
    }
    if (state.selectedCharacter.area) {
        refreshStatsPanel(state.selectedCharacter, $('.js-characterColumn .js-stats'))
    }
    if (currentContext === 'jewel') {
        drawBoardJewels(state.selectedCharacter, jewelsCanvas);
    }
    $('.js-inventorySlot').toggle($('.js-inventory .js-item').length === 0);
    checkRemoveToolTip();
}

var $popup = null;
var $popupTarget = null;
var canvasPopupTarget = null;
var canvasCoords = [];
$('.js-mouseContainer').on('mouseover mousemove', '[helpText]', function (event) {
    if ($popup) {
        return;
    }
    removeToolTip();
    $popupTarget = $(this);
    var x = event.pageX - $('.js-mouseContainer').offset().left;
    var y = event.pageY - $('.js-mouseContainer').offset().top;
    //console.log([event.pageX,event.pageY]);
    $popup = $tag('div', 'toolTip js-toolTip', getHelpText($popupTarget));
    updateToolTip(x, y, $popup);
    $('.js-mouseContainer').append($popup);
});
$('.js-mouseContainer').on('mouseout', '[helpText]', function (event) {
    removeToolTip();
});
$('.js-mouseContainer').on('mouseout', '.js-mainCanvas', function (event) {
    removeToolTip();
});
$('.js-mouseContainer').on('mouseover mousemove', '.js-mainCanvas', function (event) {
    var x = event.pageX - $(this).offset().left;
    var y = event.pageY - $(this).offset().top;
    canvasCoords = [x, y];
    checkToShowAdventureToolTip(x, y);
});
$('.js-mouseContainer').on('click', '.js-mainCanvas', function (event) {
    var x = event.pageX - $(this).offset().left;
    var y = event.pageY - $(this).offset().top;
    canvasCoords = [x, y];
    if (canvasPopupTarget && canvasPopupTarget.onClick) {
        canvasPopupTarget.onClick(state.selectedCharacter);
    }
});
$('.js-mouseContainer').on('mouseout', '.js-mainCanvas', function (event) {
    canvasCoords = [];
});
$('.js-mouseContainer').on('mouseover mousemove', checkToShowJewelToolTip);
function checkToShowAdventureToolTip(x, y) {
    if (ifdefor(x) === null) return;
    if ($popup || currentContext !== 'adventure') {
        return;
    }
    canvasPopupTarget = null;
    if (state.selectedCharacter.area) {
        for (var actor of state.selectedCharacter.allies.concat(state.selectedCharacter.enemies)) {
            if (!actor.isDead && isPointInRect(x, y, actor.left, actor.top, actor.width, actor.height)) {
                canvasPopupTarget = actor;
                break;
            }
        }
        if (!canvasPopupTarget) {
            for (var object of state.selectedCharacter.objects) {
                // (x,y) of objects is the bottom middle of their graphic.
                var left = ifdefor(object.left, object.x - state.selectedCharacter.cameraX - object.width / 2);
                var top = ifdefor(object.top, groundY - object.y - object.height);
                if (object.isOver) {
                    if (object.isOver(x, y)) {
                        canvasPopupTarget = object;
                        break;
                    }
                } else if (isPointInRect(x, y, left, top, object.width, object.height)) {
                    canvasPopupTarget = object;
                    break;
                }
            }
        }
    } else {
        canvasPopupTarget = getMapPopupTarget(x, y);
    }
    if (!canvasPopupTarget) {
        return;
    }
    var popupText = canvasPopupTarget.helpMethod ? canvasPopupTarget.helpMethod(canvasPopupTarget) : canvasPopupTarget.helptext;
    if (!popupText) return;
    $popup = $tag('div', 'toolTip js-toolTip', popupText);
    $popup.data('canvasTarget', canvasPopupTarget);
    $('.js-mouseContainer').append($popup);
    updateToolTip(mousePosition[0], mousePosition[1], $popup);
}
function checkToShowJewelToolTip() {
    var jewel = draggedJewel || overJewel;
    if (!jewel) {
        return;
    }
    if ($popup) {
        if ($popup.data('jewel') === jewel) {
            return;
        } else {
            $popup.remove();
        }
    }
    //console.log([event.pageX,event.pageY]);
    var helpText = jewel.helpMethod ? jewel.helpMethod(jewel) : jewel.helpText;
    if (jewel.fixed && !jewel.confirmed) {
        $popup = $tag('div', 'toolTip js-toolTip', 'Drag and rotate to adjust this augmentation.<br/><br/> Click the "Apply" button above when you are done.<br/><br/>' + helpText);
    } else {
        $popup = $tag('div', 'toolTip js-toolTip', helpText);
    }
    $popup.data('jewel', jewel);
    $popupTarget = null;
    $('.js-mouseContainer').append($popup);
    updateToolTip(mousePosition[0], mousePosition[1], $popup);
}
$('.js-mouseContainer').on('mousemove', function (event) {
    if (!$popup) {
        return;
    }
    updateToolTip(mousePosition[0], mousePosition[1], $popup);
});

function checkRemoveToolTip() {
    if (overJewel || draggedJewel || draggingBoardJewel || overCraftingItem || $dragHelper) {
        return;
    }
    if (draggedMap) {
        removeToolTip();
        return;
    }
    if (currentContext === 'adventure') {
        if (canvasPopupTarget && !ifdefor(canvasPopupTarget.isDead) && (canvasPopupTarget.character && canvasPopupTarget.character.area)) {
            if (isPointInRect(canvasCoords[0], canvasCoords[1], canvasPopupTarget.left, canvasPopupTarget.top, canvasPopupTarget.width, canvasPopupTarget.height)) {
                return;
            }
        }
        if (currentMapTarget && !state.selectedCharacter.area) {
            if (ifdefor(currentMapTarget.top) !== null) {
                if (isPointInRect(canvasCoords[0], canvasCoords[1], currentMapTarget.left, currentMapTarget.top, currentMapTarget.width, currentMapTarget.height)) {
                    return;
                }
            }
        }
    }
    if ($popupTarget && $popupTarget.closest('body').length && isMouseOverElement($popupTarget)) {
        return;
    }
    removeToolTip();
    checkToShowAdventureToolTip(canvasCoords[0], canvasCoords[1]);
}
function removeToolTip() {
    $('.js-toolTip').remove();
    $popup = null;
    canvasPopupTarget = null;
    $popupTarget = null;
}
function getHelpText($popupTarget) {
    if ($popupTarget.data('helpMethod')) {
        return $popupTarget.data('helpMethod')($popupTarget);
    }
    return $popupTarget.attr('helpText');
}

function updateToolTip(x, y, $popup) {
    var top = y + 10;
    if (top + $popup.outerHeight() >= 600) {
        top = Math.max(40, y - 10 - $popup.outerHeight());
    }
    var left = x - 10 - $popup.outerWidth();
    if (left < 5) {
        left = x + 10;
    }
    if (draggingBoardJewel) {
        left = $('.js-jewelInventory').position().left;
        top = 30;
    }
    $popup.css('left', left + "px").css('top', top + "px");
}
function updateRetireButtons() {
    $('.js-retire').toggle(state.characters.length > 1);
}

$('body').on('click', '.js-retire', function (event) {
    if (state.characters.length < 2) {
        return;
    }
    if (!confirm('Are you sure you want to retire ' + state.selectedCharacter.adventurer.name + '?')) {
        return;
    }
    var $panel = $(this).closest('.js-playerPanel');
    $panel.remove();
    var index = state.characters.indexOf(state.selectedCharacter);
    state.characters.splice(index, 1);
    state.selectedCharacter = state.characters[Math.min(index, state.characters.length)];
    $($('.js-charactersBox .js-character')[index]).remove();
    setSelectedCharacter(state.characters[Math.min(index, state.characters.length - 1)]);
    saveGame();
    updateRetireButtons();
});
// World Map button doubles for recall button now.
$('body').on('click', '.js-showAdventurePanel', function (event) {
    if (currentContext !== 'adventure') showContext('adventure');
    else if (state.selectedCharacter.area) recallSelectedCharacter();
});
$('body').on('click', '.js-showCraftingPanel', function (event) {
    showContext('item');
});
$('body').on('click', '.js-showJewelsPanel', function (event) {
    showContext('jewel');
});
$('body').on('click', '.js-recallButton', recallSelectedCharacter);
function recallSelectedCharacter() {
    var character = state.selectedCharacter;
    // The last wave of an area is always the bonus treasure chest. In order to prevent
    // the player from missing this chest or opening it without clearing the level,
    // which would allow them to claim the reward again, we disable recall during
    // this wave.
    if (!canRecall(character)) {
        return;
    }
    character.replay = false;
    updateAdventureButtons();
    returnToMap(character);
}
$('body').on('click', '.js-repeatButton', function (event) {
    state.selectedCharacter.replay = !state.selectedCharacter.replay;
    updateAdventureButtons();
});
$('body').on('click', '.js-pauseButton', togglePause);
function togglePause() {
    state.selectedCharacter.paused = !state.selectedCharacter.paused;
    updateAdventureButtons();
}
function pause() {
    state.selectedCharacter.paused = true;
    updateAdventureButtons();
}
$('body').on('click', '.js-fastforwardButton', function (event) {
    if (state.selectedCharacter.gameSpeed !== 3) {
        state.selectedCharacter.gameSpeed = 3;
        state.selectedCharacter.loopSkip = 1;
    } else {
        state.selectedCharacter.gameSpeed = 1;
    }
    updateAdventureButtons();
});
$('body').on('click', '.js-slowMotionButton', function (event) {
    if (state.selectedCharacter.loopSkip !== 5) {
        state.selectedCharacter.loopSkip = 5;
        state.selectedCharacter.gameSpeed = 1;
    } else {
        state.selectedCharacter.loopSkip = 1;
    }
    updateAdventureButtons();
});
$('body').on('click', '.js-shrineButton', function (event) {
    state.selectedCharacter.skipShrines = !state.selectedCharacter.skipShrines;
    updateAdventureButtons();
});

var currentContext;
function showContext(context) {
    hidePointsPreview();
    currentContext = context;
    if (context !== 'adventure') {
        $('.js-mainCanvasContainer').hide();
        $('.js-areaMenu').hide();
    } else {
        $('.js-mainCanvasContainer').show();
    }
    if (context === 'jewel') {
        drawBoardJewels(state.selectedCharacter, jewelsCanvas);
    }
    $('.js-adventureContext, .js-jewelContext, .js-itemContext').not('.js-' + context + 'Context').hide();
    $('.js-' + context + 'Context').show();
}
function updateAdventureButtons() {
    var character = state.selectedCharacter;
    $('.js-adventureControls').toggle(!!character.area);
    $('.js-recallButton').toggleClass('disabled', !canRecall(character));
    $('.js-repeatButton').toggleClass('disabled', !character.replay);
    $('.js-pauseButton').toggleClass('disabled', !character.paused);
    $('.js-fastforwardButton').toggleClass('disabled', character.gameSpeed !== 3);
    $('.js-slowMotionButton').toggleClass('disabled', character.loopSkip !== 5);
    $('.js-shrineButton').toggleClass('disabled', !!character.skipShrines);
}
function canRecall(character) {
    return character.area && character.waveIndex < character.area.waves.length;
}
function updateConfirmSkillConfirmationButtons() {
    $('.js-augmentConfirmationButtons').toggle(!!state.selectedCharacter.board.boardPreview);
}
$('.js-charactersBox').on('click', '.js-character', function () {
    setSelectedCharacter($(this).data('character'));
})