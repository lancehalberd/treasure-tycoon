'use strict';

var images = {};
function loadImage(source, callback) {
    images[source] = new Image();
    images[source].onload = function () {
        callback();
    };
    images[source].src = source;
}

var pointsMap = {
    'AP': 'adventurePoints',
    'IP': 'itemPoints',
    'MP': 'magicPoints',
    'RP': 'rarePoints',
    'UP': 'uniquePoints',
}
function points(type, value) {
    return tag('span', pointsMap[type], value) + ' ' + type;
}

var fps = 6;
var state = {
    characters: [],
    jewels: [],
    AP: 0,
    IP: 0,
    MP: 0,
    RP: 0,
    UP: 0
}
// Load any graphic assets needed by the game here.
async.mapSeries([
    // Original images from project contributors:
    'gfx/person.png', 'gfx/grass.png', 'gfx/cave.png', 'gfx/forest.png', 'gfx/caterpillar.png', 'gfx/gnome.png', 'gfx/skeletonGiant.png', 'gfx/skeletonSmall.png', 'gfx/dragonEastern.png',
    'gfx/treasureChest.png',
    // Public domain images:
    'gfx/chest-closed.png', 'gfx/chest-open.png' // http://opengameart.org/content/treasure-chests
], loadImage, function(err, results){
    ['gfx/caterpillar.png', 'gfx/gnome.png', 'gfx/skeletonGiant.png', 'gfx/skeletonSmall.png', 'gfx/dragonEastern.png'].forEach(function (imageKey) {
        images[imageKey + '-enchanted'] = makeTintedImage(images[imageKey], '#af0');
        images[imageKey + '-imbued'] = makeTintedImage(images[imageKey], '#c6f');
    });
    initializeJobs();
    initalizeMonsters();
    initializeLevels();
    updateItemCrafting();
    var jobKey = Random.element(ranks[0]);
    newCharacter(characterClasses[jobKey]);
    gainJewel(makeJewel(1, 'diamond', [90, 5, 5], 1.1));
    gainJewel(makeJewel(1, 'diamond', [5, 90, 5], 1.1));
    gainJewel(makeJewel(1, 'diamond', [5, 5, 90], 1.1));
    gain('IP', 10);
    gain('AP', 20);
    gain('MP', 0);
    gain('RP', 0);
    gain('UP', 0);
    setInterval(mainLoop, 20);
    var $options = $('.js-toolbar').children();
    $options.detach();
    $('.js-toolbar').empty().append($options);
    $('.js-loading').hide();
    $('.js-gameContent').show();
    var testShape = makeShape(0, 0, 0, shapeDefinitions.triangle[0]).scale(30);
    var jewelButtonCanvas = $('.js-jewelButtonCanvas')[0];
    centerShapesInRectangle([testShape], rectangle(0, 0, jewelButtonCanvas.width, jewelButtonCanvas.height));
    drawJewel(jewelButtonCanvas.getContext('2d'), testShape, [0, 0], 'black');
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

function completeArea(character) {
    var $adventureDiv = character.$panel.find('.js-infoMode').find('.js-area-' + character.currentLevelIndex);
    // If the character beat the last adventure open to them, unlock the next one
    if (!character.levelsCompleted[character.currentLevelIndex]) {
        $adventureDiv.append($tag('button','js-learnSkill', '+skill'));
        character.levelsCompleted[character.currentLevelIndex] = true;
        character.area.base.next.forEach(function (areaKey) {
            // Add a button for the unlocked area only if no such button exists already.
            if (!character.$panel.find('.js-infoMode').find('.js-area-' + areaKey).length) {
                $adventureDiv.after($levelDiv(areaKey));
            }
        });
    }
    for (var itemLevel = $('.js-levelSelect').find('option').length + 1; itemLevel <= character.area.level + 1 && itemLevel <= items.length; itemLevel++) {
        var $newOption = $tag('option', '', 'Level ' + itemLevel).attr('value', itemLevel);
        items[itemLevel - 1] = ifdefor(items[itemLevel - 1], []);
        $newOption.toggle(items[itemLevel - 1].length > 0);
        $('.js-levelSelect').append($newOption);
    }
    displayInfoMode(character);
}
var lastTime = now();
function mainLoop() {
    var time = now();
    var delta = 20;
    lastTime = time;
    if ($('.js-jewel-inventory').is(":visible")) {
        redrawInventoryJewels();
    }
    state.characters.forEach(function (character) {
        if (character.area) {
            for (var i = 0; i < character.gameSpeed && character.area; i++) {
                character.time += delta / 1000;
                adventureLoop(character, delta / 1000);
            }
        } else {
            var characterDelta = delta * character.gameSpeed / 1000;
            character.time += characterDelta;
            infoLoop(character, characterDelta);
        }
    });
    checkRemoveToolTip();
}
function infoLoop(character, delta) {
    var fps = Math.floor(3 * 5 / 3);
    var frame = Math.floor(character.time * fps) % walkLoop.length;
    character.previewContext.clearRect(0, 0, 64, 128);
    character.previewContext.drawImage(character.adventurer.personCanvas, walkLoop[frame] * 32, 0 , 32, 64, 0, -20, 64, 128);
    if ($('.js-jewel-inventory').is(":visible")) {
        drawBoardJewels(character);
    }
}

function drawBar(context, x, y, width, height, background, color, percent) {
    context.fillStyle = background;
    context.fillRect(x, y, width, height);
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
$('.js-mouseContainer').on('mouseover mousemove', '.js-adventureMode .js-canvas', function (event) {
    var x = event.pageX - $(this).offset().left;
    var y = event.pageY - $(this).offset().top;
    canvasCoords = [x, y];
    if ($popup) {
        return;
    }
    var sourceCharacter = $(this).closest('.js-playerPanel').data('character');
    sourceCharacter.allies.concat(sourceCharacter.enemies).forEach(function (actor) {
        if (actor == sourceCharacter.adventurer) {
            return true; // not implemented yet
        }
        if (isPointInRect(x, y, actor.left, actor.top, actor.width, actor.height)) {
            canvasPopupTarget = actor;
            return false;
        }
        return true;
    });
    if (!canvasPopupTarget) {
        return;
    }
    x = event.pageX - $('.js-mouseContainer').offset().left;
    y = event.pageY - $('.js-mouseContainer').offset().top;
    //console.log([event.pageX,event.pageY]);
    $popup = $tag('div', 'toolTip js-toolTip', canvasPopupTarget.helptext);
    updateToolTip(x, y, $popup);
    $('.js-mouseContainer').append($popup);
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
    if (jewel.fixed && !jewel.confirmed) {
        $popup = $tag('div', 'toolTip js-toolTip', 'Drag and rotate to adjust this augmentation.<br/><br/> Click the "Apply" button to the right when you are done. <br/><br/>' + jewel.helpText);
    } else {
        $popup = $tag('div', 'toolTip js-toolTip', jewel.helpText);
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
    if (overJewel || draggedJewel) {
        return;
    }
    if (canvasPopupTarget && canvasPopupTarget.health > 0 && canvasPopupTarget.character.area) {
        if (isPointInRect(canvasCoords[0], canvasCoords[1], canvasPopupTarget.left, canvasPopupTarget.top, canvasPopupTarget.width, canvasPopupTarget.height)) {
            return;
        }
    }
    if ($popupTarget && $popupTarget.closest('body').length) {
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
    return $popupTarget.attr('helpText');
}

function updateToolTip(x, y, $popup) {
    var top = y + 10;
    if (top + $popup.outerHeight() >= 600) {
        top = y - 10 - $popup.outerHeight();
    }
    var left = x - 10 - $popup.outerWidth();
    if (left < 5) {
        left = x + 10;
    }
    $popup.css('left', left + "px").css('top', top + "px");
}
function updateRetireButtons() {
    $('.js-retire').toggle($('.js-playerPanel').length > 1);
}

$('body').on('click', '.js-adventureButton', function (event) {
    startArea($(this).closest('.js-playerPanel').data('character'), $(this).data('levelIndex'));
});
// When a player clicks the learn skill button, we add the board segment to their skill board
// as a preview, center it and then snap it to a valid position. From there they can move it
// around and either apply the change or cancel.
$('body').on('click', '.js-learnSkill', function (event) {
    var character = $(this).closest('.js-playerPanel').data('character');
    if (character.adventurer.xp < character.adventurer.xpToLevel) {
        return;
    }
    var areaKey = $(this).closest('.js-adventure').data('levelIndex');
    var level = levels[areaKey];
    var board = readBoardFromData(level.board, character, level.skill);
    $(this).closest('.js-adventure').find('.js-confirmSkill, .js-cancelSkill').show();
    character.$panel.find('.js-learnSkill').hide();
    centerShapesInRectangle(board.fixed.map(jewelToShape).concat(board.spaces), rectangle(0, 0, character.boardCanvas.width, character.boardCanvas.height));
    snapBoardToBoard(board, character.board);
    character.board.boardPreview = board;
    showJewels();
});
$('body').on('click', '.js-confirmSkill', function (event) {
    var character = $(this).closest('.js-playerPanel').data('character');
    var areaKey = $(this).closest('.js-adventure').data('levelIndex');
    var level = levels[areaKey];
    character.adventurer.abilities.push(level.skill);
    character.board.spaces = character.board.spaces.concat(character.board.boardPreview.spaces);
    character.board.boardPreview.fixed.forEach(function (jewel) {
        jewel.confirmed = true;
    });
    character.board.fixed = character.board.fixed.concat(character.board.boardPreview.fixed);
    character.board.boardPreview = null;
    drawBoardBackground(character.boardContext, character.board);
    showJewels();
    gainLevel(character.adventurer);
    updateSkillButtons(character);
    // Replace the skill buttons with a checkmark, they aren't used any more.
    $(this).closest('.js-adventure').find('.js-learnSkill, .js-confirmSkill, .js-cancelSkill').remove();
    $(this).closest('.js-adventure').append($tag('span','', '&#10003;'));
    character.$panel.find('.js-learnSkill').show();
});
$('body').on('click', '.js-cancelSkill', function (event) {
    var character = $(this).closest('.js-playerPanel').data('character');
    $(this).closest('.js-adventure').find('.js-confirmSkill, .js-cancelSkill').hide();
    character.$panel.find('.js-learnSkill').show();
    character.board.boardPreview = null;
    showJewels();
});

$('body').on('click', '.js-retire', function (event) {
    var $panel = $(this).closest('.js-playerPanel');
    var character = $panel.data('character');
    gain('AP', Math.ceil(character.adventurer.level * character.adventurer.job.cost / 10));
    $panel.remove();
    updateRetireButtons();
});

$('.js-showAdventurePanel').on('click', function (event) {
    showEquipment();
    $('.js-infoPanel').hide();
    $('.js-adventurePanel').show();
});
$('.js-showCraftingPanel').on('click', function (event) {
    showEquipment();
    $('.js-infoPanel').hide();
    $('.js-craftingPanel').show();
});
$('.js-showEnchantingPanel').on('click', function (event) {
    showEquipment();
    $('.js-infoPanel').hide();
    $('.js-enchantingPanel').show();
});
$('.js-showJewelsPanel').on('click', function (event) {
    showJewels();
});
function showJewels() {
    $('.js-equipment').hide();
    $('.js-inventory').hide();
    $('.js-jewelBoard').show();
    $('.js-jewel-inventory').show();
    $('.js-infoPanel').hide();
    $('.js-jewelPanel').show();
}
function showEquipment() {
    $('.js-equipment').show();
    $('.js-inventory').show();
    $('.js-jewelBoard').hide();
    $('.js-jewel-inventory').hide();
}
$('body').on('click', '.js-recall', function (event) {
    var $panel = $(this).closest('.js-playerPanel');
    var character = $panel.data('character');
    // The last wave of an area is always the bonus treasure chest. In order to prevent
    // the player from missing this chest or opening it without clearing the level,
    // which would allow them to claim the reward again, we disable recall during
    // this wave.
    if (character.area && character.waveIndex >= character.area.waves.length) {
        return;
    }
    $panel.find('.js-repeat').prop('checked', false);
    character.replay = false;
    displayInfoMode(character);
});
$('body').on('click', '.js-repeat', function (event) {
    var $panel = $(this).closest('.js-playerPanel');
    var character = $panel.data('character');
    character.replay = $(this).is(':checked');
});
$('body').on('click', '.js-fastforward', function (event) {
    var $panel = $(this).closest('.js-playerPanel');
    var character = $panel.data('character');
    character.gameSpeed = $(this).is(':checked') ? 4 : 1;
});
