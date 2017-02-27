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
var mainLoopId = setInterval(mainLoop, 20);
// Load any graphic assets needed by the game here.
function initializeGame() {
    gameHasBeenInitialized = true;
    initalizeMonsters();
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
    if (window.location.search.substr(1) === 'new') {
        if (confirm('Are you sure you want to clear your saved data? This cannot be undone.')) {
            eraseSave();
        }
    }
    if (loadSavedData()) {
        showContext(state.selectedCharacter.context);
    } else {
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
        enterGuildArea(state.selectedCharacter, guildFrontDoor);
    }
    state.visibleLevels['guild'] = true;
    for (var levelKey of map.guild.unlocks) {
        state.visibleLevels[levelKey] = true;
    }
    if (state.skipShrinesEnabled) {
        $('.js-shrineButton').show();
    }
    updateItemsThatWillBeCrafted();
    updateEnchantmentOptions();
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
    try {
    var time = now();
    if ($('.js-jewelInventory').is(":visible")) {
        redrawInventoryJewels();
    }
    var fps = Math.floor(3 * 5 / 3);
    var characters = testingLevel ? [state.selectedCharacter] : state.characters;
    var mousePosition = relativeMousePosition($(mainCanvas));
    var activeGuildAreaHash = {};
    for (var character of characters) {
        if ((character.context === 'adventure' && !character.paused) || character.context === 'guild') {
            character.loopCount = ifdefor(character.loopCount) + 1;
            if (character.loopCount % ifdefor(character.loopSkip)) {
                return;
            }
            for (var i = 0; i < character.gameSpeed && character.area; i++) {
                character.time += frameMilliseconds / 1000;
                if (character.context === 'adventure') adventureLoop(character, frameMilliseconds / 1000);
                else if (character.context === 'guild') activeGuildAreaHash[character.guildAreaKey] = true;
                if (character.context !== 'adventure' && character.context !== 'guild') {
                    return;
                }
                var area = character.area;
                // Only update the camera for the guild for the selected character, but
                // always update the camera for characters in adventure areas.
                if (character === state.selectedCharacter || !area.isGuildArea) {
                    // By default center the camera slightly ahead of the character.
                    var centerX = character.adventurer.x;
                    var cameraX = area.cameraX;
                    var mouseX = cameraX + Math.max(0, Math.min(800, mousePosition[0]));
                    if (character.adventurer.activity && character.adventurer.activity.type === 'move') {
                        centerX = (centerX + character.adventurer.activity.x) / 2;
                    } else if (mouseX > centerX + 200) {
                        centerX = (centerX + mouseX - 200) / 2;
                    } else if (mouseX < centerX - 200) {
                        centerX = (centerX + mouseX + 200) / 2;
                    }
                    if (Math.abs(cameraX - (centerX - 400)) < 200) cameraX = (cameraX * 20 + centerX - 400) / 21;
                    else cameraX = (cameraX * 10 + centerX - 400) / 11;
                    character.area.cameraX = Math.max(ifdefor(character.area.left, 0), cameraX);
                    if (character.area.width) {
                        character.area.cameraX = Math.min(character.area.width - 800, character.area.cameraX);
                    }
                }
            }
        }
        var frame = arrMod(character.adventurer.source.walkFrames, Math.floor(now() * fps / 1000));
        character.characterContext.clearRect(0, 0, 40, 20);
        if (state.selectedCharacter === character) {
            previewContext.clearRect(0, 0, 64, 128);
            previewContext.drawImage(character.adventurer.personCanvas, frame * 96, 0 , 96, 64, -64, -20, 192, 128);
            character.characterContext.globalAlpha = 1;
        } else {
            character.characterContext.globalAlpha = .5;
        }
        var jobSource = character.adventurer.job.iconSource;
        drawImage(character.characterContext, jobSource.image, jobSource, {'left': 0, 'top': 0, 'width': 20, 'height': 20});
        //character.characterContext.fillStyle = 'white';
        character.characterContext.drawImage(character.adventurer.personCanvas, frame * 96, 0 , 96, 64, -20, -18, 96, 64);
        character.characterContext.globalAlpha = 1;
        if (state.selectedCharacter !== character) {
            if (ifdefor(character.isStuckAtShrine)) {
                drawImage(character.characterContext, shrineSource.image, shrineSource, rectangle(0, 0, 16, 16));
            } else if (!character.area) {
                drawImage(character.characterContext, homeSource.image, homeSource, rectangle(0, 0, 16, 16));
            }
        }
    }
    for (var guildAreaKey in activeGuildAreaHash) {
        guildAreaLoop(guildAreas[guildAreaKey]);
    }
    if (state.selectedCharacter.context === 'adventure' || state.selectedCharacter.context === 'guild') {
        if (editingLevel && !testingLevel) {
            drawAdventure(state.selectedCharacter);
            if (editingLevel && editingLevel.board) {
                var board = boards[editingLevel.board];
                board = readBoardFromData(board, state.selectedCharacter, abilities[editingLevel.skill], true);
                centerShapesInRectangle(board.fixed.map(jewelToShape).concat(board.spaces), rectangle(600, 0, 150, 150));
                drawBoardBackground(mainContext, board);
                drawBoardJewelsProper(mainContext, [0, 0], board);
            }
        } else {
            if (state.selectedCharacter.context === 'guild') drawGuildArea(state.selectedCharacter.area);
            else drawAdventure(state.selectedCharacter);
        }
        var hero = state.selectedCharacter.adventurer;
        if (mouseDown && state.selectedCharacter.area && clickedToMove) {
            var targetZ = -(mousePosition[1] - groundY) * 2;
            if (targetZ >= -200 || targetZ <= 200) {
                setActorDestination(hero, {'x': hero.area.cameraX + mousePosition[0], 'z': targetZ});
            }
        }
    }
    if (state.selectedCharacter.context === 'map') {
        updateMap();
        drawMap();
    }
    if (state.selectedCharacter.context === 'item') {
        updateCraftingCanvas();
        drawCraftingCanvas();
    }
    if (state.selectedCharacter.context === 'jewel') {
        drawBoardJewels(state.selectedCharacter, jewelsCanvas);
    }
    if ($('.js-mainCanvas').is(':visible')) {
        drawHud();
    }
    if (state.selectedCharacter.area) {
        refreshStatsPanel(state.selectedCharacter, $('.js-characterColumn .js-stats'))
    }
    $('.js-inventorySlot').toggle($('.js-inventory .js-item').length === 0);
    checkRemoveToolTip();
    } catch (e) {
        console.log(e);
        killMainLoop();
    }
}
function killMainLoop() {
    clearInterval(mainLoopId);
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
    checkToShowMainCanvasToolTip(x, y);
});
var clickedToMove = false;
$('.js-mouseContainer').on('mousedown', '.js-mainCanvas', function (event) {
    var x = event.pageX - $(this).offset().left;
    var y = event.pageY - $(this).offset().top;
    canvasCoords = [x, y];
    switch (state.selectedCharacter.context) {
        case 'adventure':
        case 'guild':
            handleAdventureClick(x, y, event);
            break;
        case 'map':
            handleMapClick(x, y, event);
            break;
    }
});
function handleAdventureClick(x, y, event) {
    var hero = state.selectedCharacter.adventurer;
    if (canvasPopupTarget) {
        if (canvasPopupTarget.onClick) {
            canvasPopupTarget.onClick(state.selectedCharacter);
        } else if (hero.enemies.indexOf(canvasPopupTarget) >= 0) {
            setActorAttackTarget(hero, canvasPopupTarget);
        } else {
            setActorInteractionTarget(hero, canvasPopupTarget);
        }
    } else {
        var targetZ = -(y - groundY) * 2;
        if (targetZ >= -200 || targetZ <= 200) {
            setActorDestination(hero, {'x': hero.area.cameraX + x, 'z': targetZ});
            clickedToMove = true;
        }
    }
}
$(document).on('mouseup',function (event) {
    clickedToMove = false;
});
function setActorDestination(actor, target) {
    var activity = {
        'type': 'move',
        'x': target.x,
        'y': 0,
        'z': Math.max(-180 + actor.width / 2, Math.min(180 - actor.width / 2, target.z))
    };
    if (getDistanceBetweenPointsSquared(actor, activity) > 200) {
        if (!actor.activity) {
            actor.walkFrame = 1;
        }
        actor.activity = activity;
    }
}
function setActorAttackTarget(actor, target) {
    actor.activity = {
        'type': 'attack',
        'target': target
    };
}
function setActorInteractionTarget(actor, target) {
    actor.activity = {
        'type': 'interact',
        'target': target
    };
}
$('.js-mouseContainer').on('mouseout', '.js-mainCanvas', function (event) {
    canvasCoords = [];
});

function drawHudElement() {
    if (canvasPopupTarget === this) drawOutlinedImage(mainContext, this.source.image, '#fff', 2, this.source, this);
    else if (this.flashColor) drawTintedImage(mainContext, this.source.image, this.flashColor, .5 + .2 * Math.sin(now() / 150), this.source, this)
    else drawImage(mainContext, this.source.image, this.source, this);
}

function drawMapButton() {
    this.flashColor = state.selectedCharacter.area.completed ? 'white' : null;
    drawHudElement.call(this);
}

var returnToMapButton = {'source': {'image': requireImage('gfx/worldIcon.png'), 'top': 0, 'left': 0, 'width': 72, 'height': 72},
    'isVisible': function () {
        return state.selectedCharacter.context === 'adventure';
    },
    'draw': drawMapButton,
    'top': 500, 'left': 20, 'width': 54, 'height': 54, 'helpText': 'Return to Map', 'onClick': returnToMap}

var globalHud = [
    returnToMapButton
];

function checkToShowMainCanvasToolTip(x, y) {
    if (ifdefor(x) === null) return;
    if ($popup || !$('.js-mainCanvas').is(':visible')) return;
    canvasPopupTarget = null;
    var area = state.selectedCharacter.area;
    if (state.selectedCharacter.context === 'map') canvasPopupTarget = getMapPopupTarget(x, y);
    else if (area) {
        for (var actor of area.allies.concat(area.enemies)) {
            if (!actor.isDead && isPointInRect(x, y, actor.left, actor.top, actor.width, actor.height)) {
                canvasPopupTarget = actor;
                break;
            }
        }
        if (!canvasPopupTarget) {
            for (var object of area.objects.concat(globalHud)) {
                // (x,y) of objects is the bottom middle of their graphic.
                var left = ifdefor(object.left, object.x - area.cameraX - object.width / 2);
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
    }
    $('.js-mainCanvas').toggleClass('clickable', !!canvasPopupTarget);
    if (!canvasPopupTarget) {
        return;
    }
    var popupText = canvasPopupTarget.helpMethod ? canvasPopupTarget.helpMethod(canvasPopupTarget) : canvasPopupTarget.helpText;
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
    if (!$popup && !canvasPopupTarget && !$popupTarget) {
        return;
    }
    if (overJewel || draggedJewel || draggingBoardJewel || overCraftingItem || $dragHelper) {
        return;
    }
    if (draggedMap) {
        removeToolTip();
        return;
    }
    if ($('.js-mainCanvas').is(':visible')) {
        if (canvasPopupTarget && !ifdefor(canvasPopupTarget.isDead)
            && (canvasPopupTarget.area === state.selectedCharacter.area
             || (canvasPopupTarget.character && canvasPopupTarget.character.area))) {
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
    checkToShowMainCanvasToolTip(canvasCoords[0], canvasCoords[1]);
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
    var removedCharacter = state.selectedCharacter;
    var index = state.characters.indexOf(removedCharacter);
    state.characters.splice(index, 1);
    state.selectedCharacter = state.characters[Math.min(index, state.characters.length)];
    setSelectedCharacter(state.characters[Math.min(index, state.characters.length - 1)]);
    removedCharacter.$characterCanvas.remove();
    saveGame();
    updateRetireButtons();
});
$('body').on('click', '.js-showJewelsPanel', function (event) {
    setContext('jewel');
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

function setContext(context) {
    state.selectedCharacter.context = context;
    // If the player is not already in the guild when we return to the guild context, move them to the foyer.
    if (context === 'guild' && (!state.selectedCharacter.area || !state.selectedCharacter.area.isGuildArea)) {
        enterGuildArea(state.selectedCharacter, guildFrontDoor);
    }
    showContext(context);
}
function showContext(context) {
    hidePointsPreview();
    canvasPopupTarget = null;
    if (context === 'jewel') drawBoardJewels(state.selectedCharacter, jewelsCanvas);
    $('.js-adventureContext, .js-jewelContext, .js-itemContext, .js-guildContext, .js-mapContext').hide();
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
    return character.area && !character.area.isGuildArea && character.waveIndex < character.area.waves.length;
}
function updateConfirmSkillConfirmationButtons() {
    $('.js-augmentConfirmationButtons').toggle(!!state.selectedCharacter.board.boardPreview);
}
$('.js-divinityPoints').on('click', '.js-character', function () {
    setSelectedCharacter($(this).data('character'));
})
