'use strict';

var assetVersion = '0.1';
var images = {};
function loadImage(source, callback) {
    images[source] = new Image();
    images[source].onload = function () {
        callback();
    };
    images[source].src = source + '?v=' + assetVersion;
}

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
    visibleLevels: {}, // {'grove': true, 'orchard': true}
    characters: [],
    fame: 0,
    coins: 0,
    anima: 0,
    maxCraftingLevel: 1,
    craftedItems: {},
    craftingLevel: 1,
    craftingTypeFilter: 'all',
    applicationSlots: 2
};
var craftingViewCanvas = $('.js-craftingCanvas')[0];
var craftingViewContext = craftingViewCanvas.getContext('2d');
var craftingCanvas = createCanvas(craftingViewCanvas.width, craftingViewCanvas.height);
var craftingContext = craftingCanvas.getContext('2d');
var coins, animaDrops;
var projectileAnimations = [];
function initializeCoins() {
    var coinImage = images['gfx/moneyIcon.png'];
    coins = [
        {'value': 1, 'image': coinImage, 'x': 0, 'y': 0, 'width': 16, 'height': 16},
        {'value': 5, 'image': coinImage, 'x': 0, 'y': 32, 'width': 20, 'height': 20},
        {'value': 20, 'image': coinImage, 'x': 0, 'y': 64, 'width': 24, 'height': 24},
        {'value': 100, 'image': coinImage, 'x': 32, 'y': 0, 'width': 16, 'height': 16},
        {'value': 500, 'image': coinImage, 'x': 32, 'y': 32, 'width': 20, 'height': 20},
        {'value': 2000, 'image': coinImage, 'x': 32, 'y': 64, 'width': 24, 'height': 24},
        {'value': 10000, 'image': coinImage, 'x': 64, 'y': 0, 'width': 16, 'height': 16},
        {'value': 50000, 'image': coinImage, 'x': 64, 'y': 32, 'width': 20, 'height': 20},
        {'value': 200000, 'image': coinImage, 'x': 64, 'y': 64, 'width': 24, 'height': 24},
    ];
    animaDrops = [
        {'value': 1, 'image': coinImage, 'x': 96, 'y': 0, 'width': 16, 'height': 16},
        {'value': 5, 'image': coinImage, 'x': 96, 'y': 32, 'width': 20, 'height': 20},
        {'value': 20, 'image': coinImage, 'x': 96, 'y': 64, 'width': 24, 'height': 24},
        {'value': 100, 'image': coinImage, 'x': 128, 'y': 0, 'width': 16, 'height': 16},
        {'value': 500, 'image': coinImage, 'x': 128, 'y': 32, 'width': 20, 'height': 20},
        {'value': 2000, 'image': coinImage, 'x': 128, 'y': 64, 'width': 24, 'height': 24},
        {'value': 10000, 'image': coinImage, 'x': 160, 'y': 0, 'width': 16, 'height': 16},
        {'value': 50000, 'image': coinImage, 'x': 160, 'y': 32, 'width': 20, 'height': 20},
        {'value': 200000, 'image': coinImage, 'x': 160, 'y': 64, 'width': 24, 'height': 24},
    ];
}
function initializeProjectileAnimations() {
    projectileAnimations['fireball'] = {'image': images['gfx/projectiles.png'], frames:[[0, 0, 20, 20], [32, 0, 20, 20], [64, 0, 20, 20]]}
}
var mainCanvas, mainContext, jewelsCanvas, jewelsContext, previewContext;
// Load any graphic assets needed by the game here.
async.mapSeries([
    // Original images from project contributors:
    'gfx/person.png', 'gfx/grass.png', 'gfx/cave.png', 'gfx/forest.png', 'gfx/caterpillar.png', 'gfx/gnome.png', 'gfx/skeletonGiant.png', 'gfx/skeletonSmall.png', 'gfx/dragonEastern.png',
    'gfx/treasureChest.png', 'gfx/moneyIcon.png', 'gfx/projectiles.png',
    // Public domain images:
    'gfx/chest-closed.png', 'gfx/chest-open.png', // http://opengameart.org/content/treasure-chests
    'gfx/bat.png', // http://opengameart.org/content/bat-32x32
    'gfx/militaryIcons.png', // http://opengameart.org/content/140-military-icons-set-fixed
    'gfx/oldMap.png', // http://subtlepatterns.com/old-map/
    'gfx/spider.png', // Stephen "Redshrike" Challener as graphic artist and William.Thompsonj as contributor. If reasonable link to this page or the OGA homepage. http://opengameart.org/content/lpc-spider
    'gfx/wolf.png' // Stephen "Redshrike" Challener as graphic artist and William.Thompsonj as contributor. If reasonable link back to this page or the OGA homepage. http://opengameart.org/content/lpc-wolf-animation
], loadImage, function(err, results){
    /*['gfx/bat.png', 'gfx/caterpillar.png', 'gfx/gnome.png', 'gfx/skeletonGiant.png', 'gfx/skeletonSmall.png', 'gfx/dragonEastern.png', 'gfx/spider.png', 'gfx/wolf.png'].forEach(function (imageKey) {
        images[imageKey + '-enchanted'] = makeTintedImage(images[imageKey], '#af0');
        images[imageKey + '-imbued'] = makeTintedImage(images[imageKey], '#c6f');
    });*/
    closedChestSource = {'image': images['gfx/chest-closed.png'], 'xOffset': 0, 'width': 32, 'height': 32};
    openChestSource = {'image': images['gfx/chest-open.png'], 'xOffset': 0, 'width': 32, 'height': 32};
    showContext('adventure');
    initalizeMonsters();
    initializeBackground();
    initializeCraftingImage();
    initializeCoins();
    initializeProjectileAnimations();
    updateItemCrafting();
    var jobKey = Random.element(jobRanks[0]);
    jobKey = ifdefor(testJob, jobKey);
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
    var testShape = makeShape(0, 0, 0, shapeDefinitions.triangle[0]).scale(jewelShapeScale);
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
        var startingCharacter = newCharacter(characterClasses[jobKey]);
        updateAdventurer(startingCharacter.adventurer);
        hireCharacter(startingCharacter);
        $('.js-heroApplication').after($('.js-heroApplication').clone());
        $('.js-heroApplication').each(function () {
            createNewHeroApplicant($(this));
        });
    }
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
    setInterval(mainLoop, 20);
    //mainLoop();
});
function makeTintedImage(image, tint) {
    var tintCanvas = createCanvas(image.width, image.height);
    var tintContext = tintCanvas.getContext('2d');
    tintContext.clearRect(0, 0, image.width, image.height);
    tintContext.fillStyle = tint;
    tintContext.fillRect(0,0, image.width, image.height);
    tintContext.globalCompositeOperation = "destination-atop";
    tintContext.drawImage(image, 0, 0, image.width, image.height, 0, 0, image.width, image.height);
    var resultCanvas = createCanvas(image.width, image.height);
    var resultContext = resultCanvas.getContext('2d');
    resultContext.drawImage(image, 0, 0, image.width, image.height, 0, 0, image.width, image.height);
    resultContext.globalAlpha = 0.3;
    resultContext.drawImage(tintCanvas, 0, 0, image.width, image.height, 0, 0, image.width, image.height);
    resultContext.globalAlpha = 1;
    return resultCanvas;
}
var globalTintCanvas = createCanvas(150, 150);
var globalTintContext = globalTintCanvas.getContext('2d');
globalTintContext.imageSmoothingEnabled = false;
function drawTintedImage(context, image, tint, amount, source, target) {
    context.save();
    // First make a solid color in the shape of the image to tint.
    globalTintContext.save();
    globalTintContext.fillStyle = tint;
    globalTintContext.clearRect(0, 0, source.width, source.height);
    globalTintContext.drawImage(image, source.left, source.top, source.width, source.height, 0, 0, source.width, source.height);
    globalTintContext.globalCompositeOperation = "source-in";
    globalTintContext.fillRect(0, 0, source.width, source.height);
    globalTintContext.restore();
    // Next draw the untinted image to the target.
    context.drawImage(image, source.left, source.top, source.width, source.height, target.left, target.top, target.width, target.height);
    // Finally draw the tint color on top of the target with the desired opacity.
    context.globalAlpha *= amount; // This needs to be multiplicative since we might be drawing a partially transparent image already.
    context.drawImage(globalTintCanvas, 0, 0, source.width, source.height, target.left, target.top, target.width, target.height);
    context.restore();
}
var globalCompositeCanvas = createCanvas(150, 150);
var globalCompositeContext = globalCompositeCanvas.getContext('2d');
function prepareTintedImage() {
    globalCompositeContext.clearRect(0, 0, globalCompositeCanvas.width, globalCompositeCanvas.height);
}
function getTintedImage(image, tint, amount, sourceRectangle) {
    drawTintedImage(globalCompositeContext, image, tint, amount, sourceRectangle, {'left': 0, 'top': 0, 'width': sourceRectangle.width, 'height': sourceRectangle.height});
    return globalCompositeCanvas;
}
function logPixel(context, x, y) {
    var imgd = context.getImageData(x, y, 1, 1);
    console.log(imgd.data)
}
function mainLoop() {
    var time = now();
    var delta = 20;
    if ($('.js-jewel-inventory').is(":visible")) {
        redrawInventoryJewels();
    }
    var fps = Math.floor(3 * 5 / 3);
    var frame = Math.floor(now() * fps / 1000) % walkLoop.length;
    var characters = testingLevel ? [state.selectedCharacter] : state.characters;
    for (var character of characters) {
        if (character.area && !character.paused) {
            character.loopCount = ifdefor(character.loopCount) + 1;
            if (character.loopCount % ifdefor(character.loopSkip)) {
                return;
            }
            for (var i = 0; i < character.gameSpeed && character.area; i++) {
                character.time += delta / 1000;
                adventureLoop(character, delta / 1000);
                if (!character.area) {
                    return
                }
                // Original this branch was designed to make the camera change for opening the treasure
                // But it actually applies to both the chest and the boss, which turned out to be fine.
                if (character.waveIndex < character.area.waves.length - 1) {
                    character.cameraX = (character.cameraX * 10 + character.adventurer.x - 100) / 11;
                } else if (character.cameraX < character.adventurer.x - 200 || character.cameraX > character.adventurer.x) {
                    character.cameraX = (character.cameraX * 10 + character.adventurer.x - 200) / 11;
                }
            }
        }
        if (state.selectedCharacter === character) {
            previewContext.clearRect(0, 0, 64, 128);
            previewContext.drawImage(character.adventurer.personCanvas, walkLoop[frame] * 32, 0 , 32, 64, 0, -20, 64, 128);
            character.characterContext.globalAlpha = 1;
        } else {
            character.characterContext.globalAlpha = .3;
        }
        //character.characterContext.fillStyle = 'white';
        character.characterContext.clearRect(0, 0, 32, 64);
        character.characterContext.drawImage(character.adventurer.personCanvas, walkLoop[frame] * 32, 0 , 32, 64, 0, -10, 32, 64);
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

function drawBar(context, x, y, width, height, background, color, percent) {
    percent = Math.max(0, Math.min(1, percent));
    if (background) {
        context.fillStyle = background;
        context.fillRect(x, y, width, height);
    }
    context.fillStyle = color;
    context.fillRect(x + 1, y + 1, Math.floor((width - 2) * percent), height - 2);
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
    if (!state.selectedCharacter.area) {
        clickMapHandler(x, y);
    }
});
$('.js-mouseContainer').on('mouseover mousemove', checkToShowJewelToolTip);
function checkToShowAdventureToolTip(x, y) {
    if (ifdefor(x) === null) return;
    if ($popup || currentContext !== 'adventure') {
        return;
    }
    canvasPopupTarget = null;
    if (state.selectedCharacter.area) {
        state.selectedCharacter.allies.concat(state.selectedCharacter.enemies).forEach(function (actor) {
            if (!actor.isDead && isPointInRect(x, y, actor.left, actor.top, actor.width, actor.height)) {
                canvasPopupTarget = actor;
                return false;
            }
            return true;
        });
    } else {
        canvasPopupTarget = getMapPopupTarget(x, y);
    }
    if (!canvasPopupTarget) {
        return;
    }
    $popup = $tag('div', 'toolTip js-toolTip', canvasPopupTarget.helpMethod ? canvasPopupTarget.helpMethod(canvasPopupTarget) : canvasPopupTarget.helptext);
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
    updateToolTip(mousePosition[0], mousePosition[1], $popup);
    $('.js-mouseContainer').append($popup);
}
$('.js-mouseContainer').on('mousemove', function (event) {
    if (!$popup) {
        return;
    }
    updateToolTip(mousePosition[0], mousePosition[1], $popup);
});

function checkRemoveToolTip() {
    if (overJewel || draggedJewel || overCraftingItem) {
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
        top = Math.max(0, y - 10 - $popup.outerHeight());
    }
    var left = x - 10 - $popup.outerWidth();
    if (left < 5) {
        left = x + 10;
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
    // gain('fame', state.selectedCharacter.fame);
    $panel.remove();
    var index = state.characters.indexOf(state.selectedCharacter);
    state.characters.splice(index, 1);
    state.selectedCharacter = state.characters[Math.min(index, state.characters.length)];
    $($('.js-charactersBox .js-character')[index]).remove();
    setSelectedCharacter(state.characters[Math.min(index, state.characters.length - 1)]);
    saveGame();
    updateRetireButtons();
});
$('.js-showAdventurePanel').on('click', function (event) {
    showContext('adventure');
});
$('.js-showCraftingPanel').on('click', function (event) {
    showContext('item');
});
$('.js-showJewelsPanel').on('click', function (event) {
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
$('body').on('click', '.js-pauseButton', function (event) {
    state.selectedCharacter.paused = !state.selectedCharacter.paused;
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

var currentContext;
function showContext(context) {
    currentContext = context;
    if (context !== 'adventure') {
        $('.js-mainCanvasContainer').slideUp('fast');
    } else {
        $('.js-mainCanvasContainer').slideDown('fast');
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
}
function canRecall(character) {
    return character.area && character.waveIndex < character.area.waves.length;
}
function updateConfirmSkillButton() {
    $('.js-confirmSkill').toggle(!!state.selectedCharacter.board.boardPreview);
}
$('.js-charactersBox').on('click', '.js-character', function () {
    setSelectedCharacter($(this).data('character'));
})