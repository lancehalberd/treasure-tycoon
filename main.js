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
        return tag('span', 'icon coin') + ' ' + tag('span', 'value '+ pointsMap[type], value);
    }
    return tag('span', 'icon anima') + ' ' + tag('span', 'value '+ pointsMap[type], value);
}

var fps = 6;
var state = {
    selectedCharacter: null,
    currentArea: null,
    areas: {}, // {'northernWilderness': {'grove': true, 'orchard': true}}
    characters: [],
    fame: 0,
    coins: 0,
    anima: 0,
    maxCraftingLevel: 1,
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
    'gfx/oldMap.png' // http://subtlepatterns.com/old-map/
], loadImage, function(err, results){
    ['gfx/caterpillar.png', 'gfx/gnome.png', 'gfx/skeletonGiant.png', 'gfx/skeletonSmall.png', 'gfx/dragonEastern.png'].forEach(function (imageKey) {
        images[imageKey + '-enchanted'] = makeTintedImage(images[imageKey], '#af0');
        images[imageKey + '-imbued'] = makeTintedImage(images[imageKey], '#c6f');
    });
    closedChestSource = {'image': images['gfx/chest-closed.png'], 'xOffset': 0, 'width': 32, 'height': 32};
    openChestSource = {'image': images['gfx/chest-open.png'], 'xOffset': 0, 'width': 32, 'height': 32};
    showContext('adventure');
    initalizeMonsters();
    initializeBackground();
    initializeLevels();
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
    gainJewel(makeJewel(1, 'triangle', [90, 5, 5], 1.1));
    gainJewel(makeJewel(1, 'triangle', [5, 90, 5], 1.1));
    gainJewel(makeJewel(1, 'triangle', [5, 5, 90], 1.1));
    gain('fame', 1);
    gain('coins', 50);
    gain('anima', 0);
    hireCharacter(newCharacter(characterClasses[jobKey]));
    $('.js-heroApplication').after($('.js-heroApplication').clone());
    $('.js-heroApplication').each(function () {
        createNewHeroApplicant($(this));
    });
    setInterval(mainLoop, 20);
    $('.js-loading').hide();
    $('.js-gameContent').show();
    var testShape = makeShape(0, 0, 0, shapeDefinitions.triangle[0]).scale(jewelShapeScale);
    var jewelButtonCanvas = $('.js-jewelButtonCanvas')[0];
    centerShapesInRectangle([testShape], rectangle(0, 0, jewelButtonCanvas.width, jewelButtonCanvas.height));
    drawJewel(jewelButtonCanvas.getContext('2d'), testShape, [0, 0], 'black');
    loadOrCreateSavedData();
    drawMap();
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
function mainLoop() {
    var time = now();
    var delta = 20;
    if ($('.js-jewel-inventory').is(":visible")) {
        redrawInventoryJewels();
    }
    var fps = Math.floor(3 * 5 / 3);
    var frame = Math.floor(now() * fps / 1000) % walkLoop.length;
    state.characters.forEach(function (character) {
        if (character.area) {
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
                if (character.waveIndex < character.area.waves.length - 1) {
                    character.cameraX = (character.cameraX * 10 + character.adventurer.x - 50) / 11;
                } else if (character.cameraX < character.adventurer.x - 200) {
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
    });
    if (currentContext === 'adventure' && state.selectedCharacter.area) {
        drawAdventure(state.selectedCharacter);
    }
    if (currentContext === 'adventure') {
        $('.js-heroApplication').each(function () {
            var $applicationPanel = $(this);
            var applicantPreviewContext = $applicationPanel.find('.js-previewCanvas')[0].getContext("2d");
            var character = $applicationPanel.data('character');
            applicantPreviewContext.imageSmoothingEnabled = false;
            applicantPreviewContext.clearRect(0, 0, 64, 128);
            applicantPreviewContext.drawImage(character.adventurer.personCanvas, walkLoop[frame] * 32, 0 , 32, 64, 0, -20, 64, 128);
            drawBoardJewels(character, $applicationPanel.find('.js-skillCanvas')[0]);
        })
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
    if ($popup) {
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
    x = event.pageX - $('.js-mouseContainer').offset().left;
    y = event.pageY - $('.js-mouseContainer').offset().top;
    //console.log([event.pageX,event.pageY]);
    $popup = $tag('div', 'toolTip js-toolTip', canvasPopupTarget.helptext);
    $popup.data('canvasTarget', canvasPopupTarget);
    updateToolTip(x, y, $popup);
    $('.js-mouseContainer').append($popup);
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
    var helpText = jewel.helpMethod ? jewel.helpMethod() : jewel.helpText;
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
    var x = event.pageX - $('.js-mouseContainer').offset().left;
    var y = event.pageY - $('.js-mouseContainer').offset().top;
    updateToolTip(x, y, $popup);
});

function checkRemoveToolTip() {
    if (overJewel || draggedJewel || overCraftingItem) {
        return;
    }
    if (canvasPopupTarget && !canvasPopupTarget.isDead && (canvasPopupTarget.character && canvasPopupTarget.character.area)) {
        if (isPointInRect(canvasCoords[0], canvasCoords[1], canvasPopupTarget.left, canvasPopupTarget.top, canvasPopupTarget.width, canvasPopupTarget.height)) {
            return;
        }
    }
    if (canvasPopupTarget && !canvasPopupTarget.character) {
        if (!canvasPopupTarget.overShrine && isPointInRect(canvasCoords[0], canvasCoords[1], canvasPopupTarget.x * 40, canvasPopupTarget.y * 40, 40, 40)) {
            return;
        }
        if (canvasPopupTarget.overShrine && isPointInRect(canvasCoords[0], canvasCoords[1], canvasPopupTarget.x * 40 - 12, canvasPopupTarget.y * 40 - 12, 24, 24)) {
            return;
        }
    }
    if ($popupTarget && $popupTarget.closest('body').length && isMouseOverElement($popupTarget)) {
        return;
    }
    removeToolTip();
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
$('body').on('click', '.js-recall', function (event) {
    var $panel = $(this).closest('.js-playerPanel');
    var character = state.selectedCharacter;
    // The last wave of an area is always the bonus treasure chest. In order to prevent
    // the player from missing this chest or opening it without clearing the level,
    // which would allow them to claim the reward again, we disable recall during
    // this wave.
    if (character.area && character.waveIndex >= character.area.waves.length) {
        return;
    }
    $panel.find('.js-repeat').prop('checked', false);
    character.replay = false;
    returnToMap(character);
});
$('body').on('click', '.js-repeat', function (event) {
    var $panel = $(this).closest('.js-playerPanel');
    state.selectedCharacter.replay = $(this).is(':checked');
});
$('body').on('click', '.js-fastforward', function (event) {
    var $panel = $(this).closest('.js-playerPanel');
    state.selectedCharacter.gameSpeed = $(this).is(':checked') ? 3 : 1;
});
$('body').on('click', '.js-slowMotion', function (event) {
    var $panel = $(this).closest('.js-playerPanel');
    state.selectedCharacter.loopSkip = $(this).is(':checked') ? 5 : 1;
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

function setSelectedCharacter(character) {
    if (state.selectedCharacter === character) {
        return;
    }
    state.selectedCharacter = character;
    state.currentArea = levelsToAreas[character.currentLevelKey];
    var adventurer = character.adventurer;
    updateAdventurer(adventurer);
    // update the map.
    drawMap();
    // update the equipment displayed.
    equipmentSlots.forEach(function (type) {
        //detach any existing item
        $('.js-equipment .js-' + type + ' .js-item').detach();
        var equipment = adventurer.equipment[type];
        if (equipment) {
            $('.js-equipment .js-' + type).append(equipment.$item);
        }
    });
    // update stats panel.
    refreshStatsPanel(character, $('.js-characterColumn .js-stats'))
    // update controls:
    $('.js-repeat').prop('checked', character.replay);
    $('.js-fastforward').prop('checked', character.gameSpeed === 3);
    $('.js-slowMotion').prop('checked', character.loopSkip === 5);
    $('.js-confirmSkill').toggle(!!character.board.boardPreview);
    $('.js-jewelBoard .js-skillCanvas').data('character', character);
    character.jewelsCanvas = $('.js-jewelBoard .js-skillCanvas')[0];
}
$('.js-charactersBox').on('click', '.js-character', function () {
    setSelectedCharacter($(this).data('character'));
})