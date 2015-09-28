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
    AP: 0,
    IP: 0,
    MP: 0,
    RP: 0,
    UP: 0
}
function startArea(character, area) {
    character.$panel.find('.js-infoMode').hide();
    character.$panel.find('.js-adventureMode').show();
    character.area = area;
    character.monsterIndex = 0;
    character.x = 0;
    character.cameraX = -30;
    character.enemies = [];
    character.allies = [character];
    character.isAlly = true;
    character.textPopups = [];
    character.$panel.find('.js-recall').prop('disabled', false);
}
// Load any graphic assets needed by the game here.
async.mapSeries(['gfx/person.png', 'gfx/grass.png', 'gfx/cave.png', 'gfx/forest.png', 'gfx/caterpillar.png', 'gfx/gnome.png', 'gfx/skeletonGiant.png', 'gfx/skeletonSmall.png', 'gfx/dragonEastern.png'], loadImage, function(err, results){
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
    gain('IP', 10);
    gain('AP', 20);
    gain('MP', 0);
    gain('RP', 0);
    gain('UP', 0);
    setInterval(mainLoop, 20);
    $('.js-loading').hide();
    $('.js-gameContent').show();
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
    var $adventureButton = character.$panel.find('.js-infoMode').find('.js-adventure').last();
    // If the character beat the last adventure open to them, unlock the next one
    if (!character.levelsCompleted[character.area.key]) {
        character.levelsCompleted[character.area.key] = true;
        gain('AP', character.area.level);
        $adventureButton.after($nextLevelButton(character.area));
    }
    for (var itemLevel = $('.js-levelSelect').find('option').length + 1; itemLevel <= character.area.level + 1 && itemLevel <= items.length; itemLevel++) {
        var $newOption = $tag('option', '', 'Level ' + itemLevel).attr('value', itemLevel);
        items[itemLevel - 1] = ifdefor(items[itemLevel - 1], []);
        $newOption.toggle(items[itemLevel - 1].length > 0);
        $('.js-levelSelect').append($newOption);
    }
    resetCharacter(character);
}
var lastTime = now();
function mainLoop() {
    var time = now();
    var delta = time - lastTime;
    lastTime = time;
    state.characters.forEach(function (character) {
        var characterDelta = delta * character.gameSpeed / 1000;
        character.time += characterDelta;
        if (character.area) {
            adventureLoop(character, characterDelta);
        } else {
            infoLoop(character, characterDelta);
        }
    });
    checkRemoveToolTip();
}
function infoLoop(character, delta) {
    var fps = Math.floor(3 * 5 / 3);
    var frame = Math.floor(character.time * fps) % walkLoop.length;
    character.previewContext.clearRect(0, 0, 64, 128);
    character.previewContext.drawImage(character.personCanvas, walkLoop[frame] * 32, 0 , 32, 64, 0, -20, 64, 128);
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
    sourceCharacter.enemies.forEach(function (enemy) {
        if (isPointInRect(x, y, enemy.left, enemy.top, enemy.width, enemy.height)) {
            canvasPopupTarget = enemy;
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
$('.js-mouseContainer').on('mousemove', function (event) {
    if (!$popup) {
        return;
    }
    var x = event.pageX - $('.js-mouseContainer').offset().left;
    var y = event.pageY - $('.js-mouseContainer').offset().top;
    updateToolTip(x, y, $popup);
});

function checkRemoveToolTip() {
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

$('body').on('click', '.js-adventure', function (event) {
    var index = $(this).data('levelIndex');
    var $panel = $(this).closest('.js-playerPanel');
    var character = $panel.data('character');
    startArea(character, levels[index]);
});
$('body').on('click', '.js-retire', function (event) {
    var $panel = $(this).closest('.js-playerPanel');
    var character = $panel.data('character');
    gain('AP', Math.ceil(character.level * character.job.cost / 10));
    $panel.remove();
    updateRetireButtons();
});

$('.js-showAdventurePanel').on('click', function (event) {
    $('.js-infoPanel').hide();
    $('.js-adventurePanel').show();
});
$('.js-showCraftingPanel').on('click', function (event) {
    $('.js-infoPanel').hide();
    $('.js-craftingPanel').show();
});
$('.js-showEnchantingPanel').on('click', function (event) {
    $('.js-infoPanel').hide();
    $('.js-enchantingPanel').show();
});
$('body').on('click', '.js-recall', function (event) {
    var $panel = $(this).closest('.js-playerPanel');
    var character = $panel.data('character');
    $panel.find('.js-repeat').prop('checked', false);
    character.replay = false;
    resetCharacter(character);
});
$('body').on('click', '.js-repeat', function (event) {
    var $panel = $(this).closest('.js-playerPanel');
    var character = $panel.data('character');
    character.replay = $(this).is(':checked');
});
$('body').on('click', '.js-fastforward', function (event) {
    var $panel = $(this).closest('.js-playerPanel');
    var character = $panel.data('character');
    character.gameSpeed = $(this).is(':checked') ? 3 : 1;
});