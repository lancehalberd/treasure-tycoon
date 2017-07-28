'use strict';

var toolTipColor = '#AAA';
var craftingCanvas = $('.js-craftingCanvas')[0];
var craftingContext = craftingCanvas.getContext('2d');
var gameHasBeenInitialized = false;
var mainCanvas, mainContext, jewelsCanvas, jewelsContext, previewContext;
var bufferCanvas, bufferContext;
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
    bufferCanvas = createCanvas(mainCanvas.width, mainCanvas.height);
    bufferContext = bufferCanvas.getContext('2d');
    bufferContext.imageSmoothingEnabled = false;
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
        initializeVariableObject(state.guildStats, {'variableObjectType': 'guild'}, state.guildStats);
        addBonusSourceToObject(state.guildStats, implicitGuildBonusSource);
        addAllUnlockedFurnitureBonuses();
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
        var otherKeys = jobRanks[0].slice();
        removeElementFromArray(otherKeys, jobKey, true);
        for (var i = 0; i < allApplications.length && otherKeys.length; i++) {
            allApplications[i].character = createNewHeroApplicant(otherKeys.pop());
        }
        enterArea(state.selectedCharacter.hero, guildYardEntrance);
    }
    state.visibleLevels['guild'] = true;
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
    playTrack(soundTrack.map);
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
        if (selectedAction) {
            if (canvasPopupTarget.isActor && canUseSkillOnTarget(hero, selectedAction, canvasPopupTarget)) {
                setActionTarget(hero, selectedAction, canvasPopupTarget);
                selectedAction = null;
                return;
            }
        }
        if (canvasPopupTarget.onClick) {
            canvasPopupTarget.onClick(state.selectedCharacter, canvasPopupTarget);
        } else if (hero.enemies.indexOf(canvasPopupTarget) >= 0) {
            setActorAttackTarget(hero, canvasPopupTarget);
        } else if (canvasPopupTarget.area) {
            setActorInteractionTarget(hero, canvasPopupTarget);
        }
    } else if (!upgradingObject && !choosingTrophyAltar) {
        var targetLocation = getTargetLocation(hero.area, x, y);
        if (!targetLocation) return;
        if (selectedAction && canUseSkillOnTarget(hero, selectedAction, targetLocation)) {
            setActionTarget(hero, selectedAction, targetLocation);
            selectedAction = null;
        } else {
            setActorDestination(hero, targetLocation);
            clickedToMove = true;
        }
    }
}
function getTargetLocation(area, canvasX, canvasY) {
    var z = -(canvasY - groundY) * 2;
    if (z < -190 || z > 190) return null;
    z = Math.max(-180, Math.min(180, z));
    return {'x': area.cameraX + canvasX, y: 0, z, width:0, height: 0};
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
        target
    };
}
function setActionTarget(actor, action, target) {
    actor.activity = {
        'type': 'action',
        action,
        target
    };
}
function setActorInteractionTarget(actor, target) {
    actor.activity = {
        'type': 'interact',
        target
    };
}
$('.js-mouseContainer').on('mouseout', '.js-mainCanvas', function (event) {
    canvasCoords = [];
});

function drawHudElement() {
    if (canvasPopupTarget === this) drawOutlinedImage(mainContext, this.source.image, '#fff', 2, this.source, this);
    else if (this.flashColor) drawTintedImage(mainContext, this.source.image, this.flashColor, .5 + .2 * Math.sin(now() / 150), this.source, this);
    else drawImage(mainContext, this.source.image, this.source, this);
}

function drawMapButton() {
    this.flashColor = state.selectedCharacter.hero.area.completed ? 'white' : null;
    drawHudElement.call(this);
}

var returnToMapButton = {'source': {'image': requireImage('gfx/worldIcon.png'), 'top': 0, 'left': 0, 'width': 72, 'height': 72},
    isVisible() {
        return state.selectedCharacter.context === 'adventure';
    },
    'draw': drawMapButton,
    'top': 500, 'left': 20, 'width': 54, 'height': 54, 'helpText': 'Return to Map', onClick() {
        state.selectedCharacter.replay = false;
        returnToMap(state.selectedCharacter);
}};

var globalHud = [
    returnToMapButton,
    upgradeButton
];
var wallMouseCoords = null;
function checkToShowMainCanvasToolTip(x, y) {
    if (ifdefor(x) === null) return;
    if ($popup || !$('.js-mainCanvas').is(':visible') || canvasPopupTarget) return;
    canvasPopupTarget = getMainCanvasMouseTarget(x, y);
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
// Return the canvas object under the mouse with highest priority, if any.
function getMainCanvasMouseTarget(x, y) {
    if (state.selectedCharacter.context === 'map') return getMapPopupTarget(x, y);
    var area = state.selectedCharacter.hero.area;
    if (!area) return null;
    if (choosingTrophyAltar) return getTrophyPopupTarget(x, y);
    if (upgradingObject) {
        if (isPointInRectObject(x, y, upgradeButton)) {
            return upgradeButton;
        }
        return null;
    }
    var abilityTarget = getAbilityPopupTarget(x, y);
    if (abilityTarget) return abilityTarget;
    // Actors (heroes and enemies) have highest priority in the main game context during fights.
    for (var actor of area.allies.concat(area.enemies)) {
        if (!actor.isDead && isPointInRect(x, y, actor.left, actor.top, actor.width, actor.height)) {
            return actor;
        }
    }
    var sortedObjects = area.objects.slice().sort(function (spriteA, spriteB) {
        return spriteA.z - spriteB.z;
    });
    for (var object of sortedObjects.concat(ifdefor(area.wallDecorations, [])).concat(globalHud)) {
        if (!isCanvasTargetActive(object)) continue;
        // (x,y) of objects is the bottom middle of their graphic.
        var targetRectangle = ifdefor(object.target, object);
        var left = ifdefor(targetRectangle.left, object.x - area.cameraX - object.width / 2);
        var top = ifdefor(targetRectangle.top, groundY - object.y - object.height);
        if (object.isOver) {
            if (object.isOver(x, y)) return object;
        } else if (isPointInRect(x, y, left, top, targetRectangle.width, targetRectangle.height)) return object;
    }
    if (area.cameraX + x < 60) {
        var coords = unprojectLeftWallCoords(area, x, y);
        // wallMouseCoords = coords;
        for (var leftWallDecoration of ifdefor(area.leftWallDecorations, [])) {
            if (!isCanvasTargetActive(leftWallDecoration)) continue;
            // decoration.target stores the rectangle that the decoration was drawn to on the wallCanvas before
            // it is projected to the wall trapezoid and uses the same coordinates the unprojectRightWallCoords returns in.
            var target = leftWallDecoration.target;
            // console.log([coords[0], coords[1], target.left, target.top, target.width, target.height]);
            if (isPointInRect(coords[0], coords[1], target.left, target.top, target.width, target.height)) {
                return leftWallDecoration;
            }
        }
    }
    if (area.cameraX + x > area.width - 60) {
        var coords = unprojectRightWallCoords(area, x, y);
        // wallMouseCoords = coords;
        for (var rightWallDecoration of ifdefor(area.rightWallDecorations, [])) {
            if (!isCanvasTargetActive(rightWallDecoration)) continue;
            // decoration.target stores the rectangle that the decoration was drawn to on the wallCanvas before
            // it is projected to the wall trapezoid and uses the same coordinates the unprojectRightWallCoords returns in.
            var target = rightWallDecoration.target;
            // console.log([coords[0], coords[1], target.left, target.top, target.width, target.height]);
            if (isPointInRect(coords[0], coords[1], target.left, target.top, target.width, target.height)) {
                return rightWallDecoration;
            }
        }
    }
    return null;
}
function isCanvasTargetActive(canvasTarget) {
    if (!canvasTarget.action && !canvasTarget.onClick) return false;
    if (canvasTarget.isVisible && !canvasTarget.isVisible()) return false;
    if (canvasTarget.isEnabled && !canvasTarget.isEnabled()) return false;
    return true;
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
        if (canvasPopupTarget && !ifdefor(canvasPopupTarget.isDead) && canvasPopupTarget.area === state.selectedCharacter.hero.area &&
            isMouseOverCanvasElement(canvasCoords[0], canvasCoords[1], canvasPopupTarget)) {
            return;
        }
        if (currentMapTarget && !state.selectedCharacter.hero.area) {
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
function isMouseOverCanvasElement(x, y, element) {
    if (element.isVisible && !element.isVisible()) return false;
    if (element.isOver) return element.isOver(x, y);
    if (element.target) return isPointInRectObject(x, y, element.target);
    if (currentMapTarget && ifdefor(currentMapTarget.top) !== null) return isPointInRectObject(x, y, element);
    return false;
}
function removeToolTip() {
    $('.js-toolTip').remove();
    $popup = null;
    if (canvasPopupTarget && canvasPopupTarget.onMouseOut) {
        canvasPopupTarget.onMouseOut();
    }
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
    leaveCurrentArea(state.selectedCharacter.hero);
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
$('body').on('click', '.js-autoplayButton', function (event) {
    state.selectedCharacter.autoplay = !state.selectedCharacter.autoplay;
    updateAdventureButtons();
});
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
    if (state.selectedCharacter.context === 'item') {
        stopDrag();
        removeToolTip();
    }
    if (state.selectedCharacter.context === 'jewel') {
        stopJewelDrag();
        removeToolTip();
    }
    state.selectedCharacter.context = context;
    // If the player is not already in the guild when we return to the guild context, move them to the foyer.
    if (context === 'guild' && (!state.selectedCharacter.hero.area || !state.selectedCharacter.hero.area.isGuildArea)) {
        enterArea(state.selectedCharacter.hero, guildYardEntrance);
    }
    showContext(context);
}
function showContext(context) {
    hidePointsPreview();
    $('.js-areaMenu').hide();
    canvasPopupTarget = null;
    if (context === 'jewel') drawBoardJewels(state.selectedCharacter, jewelsCanvas);
    $('.js-adventureContext, .js-jewelContext, .js-itemContext, .js-guildContext, .js-mapContext').hide();
    $('.js-' + context + 'Context').show();
}
function updateAdventureButtons() {
    var character = state.selectedCharacter;
    $('.js-autoplayButton').toggleClass('disabled', !character.autoplay);
    if (character.autoplay) {
        $('.js-repeatButton, .js-fastforwardButton, .js-slowMotionButton, .js-shrineButton').show();
        $('.js-repeatButton').toggleClass('disabled', !character.replay);
        $('.js-fastforwardButton').toggleClass('disabled', character.gameSpeed !== 3);
        $('.js-slowMotionButton').toggleClass('disabled', character.loopSkip !== 5);
        $('.js-shrineButton').toggleClass('disabled', !!character.skipShrines);
    } else {
        $('.js-repeatButton, .js-fastforwardButton, .js-slowMotionButton, .js-shrineButton').hide();
    }
    $('.js-pauseButton').toggleClass('disabled', !character.paused);
}
function updateConfirmSkillConfirmationButtons() {
    $('.js-augmentConfirmationButtons').toggle(!!state.selectedCharacter.board.boardPreview);
}
$('.js-charactersBox').on('click', '.js-character', function () {
    setSelectedCharacter($(this).data('character'));
})


