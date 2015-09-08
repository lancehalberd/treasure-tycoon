'use strict';

var images = {};
function loadImage(source, callback) {
    images[source] = new Image();
    images[source].onload = function () {
        callback();
    };
    images[source].src = source;
}
/**
 * @param {Number} width
 * @param {Number} height
 * @return {Element}
 */
function createCanvas(width, height, classes) {
    classes = ifdefor(classes, '');
    return $('<canvas class="' + classes + '"width="' + width + '" height="' + height + '"></canvas>')[0];
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
    character.enemies = [];
    character.textPopups = [];
    character.$panel.find('.js-recall').prop('disabled', false);
}
async.mapSeries(['gfx/person.png', 'gfx/grass.png', 'gfx/caterpillar.png', 'gfx/gnome.png', 'gfx/skeletonGiant.png', 'gfx/skeletonSmall.png', 'gfx/dragonEastern.png'], loadImage, function(err, results){
    ['gfx/caterpillar.png', 'gfx/gnome.png', 'gfx/skeletonGiant.png', 'gfx/skeletonSmall.png', 'gfx/dragonEastern.png'].forEach(function (imageKey) {
        images[imageKey + '-enchanted'] = makeTintedImage(images[imageKey], '#af0');
        images[imageKey + '-imbued'] = makeTintedImage(images[imageKey], '#c6f');
    });
    initializeJobs();
    initalizeMonsters();
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
    if ($adventureButton.data('levelIndex') == character.area.index) {
        var nextLevel = $adventureButton.data('levelIndex') + 1;
        gain('AP', nextLevel);
        if (levels.length <= nextLevel) {
            var nextLevelMonsters = levels[nextLevel - 1].monsters.slice();
            var wave = [];
            while (wave.length < 10) {
                wave.push(Math.random() > .4 ? monsters['caterpillar'] : monsters['butterfly']);
            }
            nextLevelMonsters.push(wave);
            levels[nextLevel] = {'level': nextLevel + 1, 'monsters': nextLevelMonsters, 'index': nextLevel};
        }
        var $nextAdventureButton = $adventureButton.clone().data('levelIndex', nextLevel).text('Lvl ' + levels[nextLevel].level + ' Adventure!');
        $adventureButton.after($nextAdventureButton);
    }
    for (var itemLevel = $('.js-levelSelect').find('option').length + 1; itemLevel <= character.area.level + 1 && itemLevel <= items.length; itemLevel++) {
        $('.js-levelSelect').append($tag('option', '', 'Level ' + itemLevel).attr('value', itemLevel));
    }
    resetCharacter(character);
}
var lastTime = now();
function mainLoop() {
    var time = now();
    var delta = time - lastTime;
    lastTime = time;
    state.characters.forEach(function (character) {
        character.time += delta * character.gameSpeed;
        if (character.area == null) {
            if (!character.previewContext) {
                var canvas = character.$panel.find('.js-infoMode .js-canvas')[0];
                character.previewContext = canvas.getContext("2d");
            }
            var fps = Math.floor(3 * 5 / 3);
            var frame = Math.floor(character.time * fps / 1000) % walkLoop.length;
            character.previewContext.clearRect(0, 0, 64, 128);
            character.previewContext.drawImage(character.personCanvas, walkLoop[frame] * 32, 0 , 32, 64, 0, -20, 64, 128);
            return;
        }
        var width = character.canvasWidth;
        var height = character.canvasHeight;
        var context = character.context;
        if (character.enemies.length == 0) {
            if (character.monsterIndex >= character.area.monsters.length) {
                // Victory!
                completeArea(character);
                return;
            }
            var monsters = character.area.monsters[character.monsterIndex];
            monsters = Array.isArray(monsters) ? monsters : [monsters]
            var x = character.x + 800;
            monsters.forEach(function (monster) {
                var newMonster = makeMonster(character.area.level, monster, x);
                newMonster.character = character;
                character.enemies.push(newMonster);
                x += Random.range(50, 150);
            });
            character.monsterIndex++;
        }
        var hit;
        if (character.target) {
            if (character.target.health > 0) {
                hit = checkToAttack(character, character.target, 0);
                if (hit != null){
                    character.textPopups.push(
                        {value: hit, x: character.target.x + 32, y: 240 - 128, color: 'red'}
                    )
                }
            } else {
                character.target = null;
            }
        }
        for (var i = 0; i < character.enemies.length; i++) {
            var enemy = character.enemies[i];
            if (enemy.health <= 0) {
                character.enemies.splice(i--, 1);
                if (character.health > 0) {
                    gainXP(character, enemy.xp);
                    gain('IP', enemy.ip);
                    if (enemy.ip) {
                        character.textPopups.push(
                            {value: '+' + enemy.ip, x: enemy.x + 35, y: 240 - 140, color: 'white', font: "20px sans-serif"}
                        );
                    }
                    gain('MP', enemy.mp);
                    if (enemy.mp) {
                        character.textPopups.push(
                            {value: '+' + enemy.mp, x: enemy.x + 45, y: 240 - 145, color: '#fc4', font: "22px sans-serif"}
                        )
                    }
                    gain('RP', enemy.rp);
                    if (enemy.rp) {
                        character.textPopups.push(
                            {value: '+' + enemy.rp, x: enemy.x + 55, y: 240 - 150, color: '#c4f', font: "24px sans-serif"}
                        );
                    }
                    gain('UP', enemy.up);
                    if (enemy.up) {
                        character.textPopups.push(
                            {value: '+' + enemy.up, x: enemy.x + 65, y: 240 - 155, color: '#4cf', font: "26px sans-serif"}
                        );
                    }
                }
                continue;
            }
            var distance = Math.abs(enemy.x - (character.x + 32));
            hit = checkToAttack(character, enemy, distance);
            if (hit != null){
                character.textPopups.push(
                    {value: hit, x: enemy.x + 32, y: 240 - 128, color: 'red'}
                )
            }
            hit = checkToAttack(enemy, character, distance);
            if (hit != null){
                character.textPopups.push(
                    {value: hit, x: character.x + 32, y: 240 - 128, color: 'red'}
                )
            }
            if (!enemy.target && !ifdefor(enemy.stationary)) {
                enemy.x -= enemy.speed * Math.max(0, (1 - enemy.slow)) * delta * character.gameSpeed / 1000;
            }
            // Don't let enemy move past the character
            if (enemy.x < character.x + 32) {
                enemy.x = character.x + 32;
            }
            if (ifdefor(enemy.healthRegen)) {
                enemy.health += enemy.healthRegen * delta * character.gameSpeed / 1000;
            }
            enemy.health = Math.min(enemy.maxHealth, Math.max(0, enemy.health));
            enemy.slow = Math.max(0, enemy.slow - .1 * delta * character.gameSpeed / 1000);
        }
        // apply health regen to character, but only if it is alive.
        if (character.health > 0) {
            if (ifdefor(character.healthRegen)) {
                character.health += character.healthRegen * delta * character.gameSpeed / 1000;
            }
            character.slow = Math.max(0, character.slow - .1 * delta * character.gameSpeed / 1000);
            character.health = Math.min(character.maxHealth, Math.max(0, character.health));
        }
        if (!character.target) {
            character.x += character.speed * Math.max(0, (1 - character.slow)) * delta * character.gameSpeed / 1000;
        }
        var cameraX = character.x - 10;
        context.clearRect(0, 0, width, height);
        // Draw background
        for (var i = 0; i <= 768; i += 64) {
            var x = (784 + (i - character.x) % 768) % 768 - 64;
            context.drawImage(images['gfx/grass.png'], 0, 0 , 64, 240,
                                  x, 0, 64, 240);
        }
        for (var i = 0; i < character.enemies.length; i++) {
            var enemy = character.enemies[i];
            var enemyFps = Math.floor(3 * enemy.speed / 100);
            var source = enemy.base.source;
            var enemyFrame = Math.floor(character.time * enemyFps / 1000) % source.frames;
            if (source.flipped) {
                context.translate((enemy.x - cameraX + source.width), 0);
                context.scale(-1, 1);
                context.drawImage(enemy.image, enemyFrame * source.width + source.offset, 0 , source.width, 64, -source.width, 240 - 128 - 72, source.width * 2, 128);
                context.scale(-1, 1);
                context.translate(-(enemy.x - cameraX + source.width), 0);

            } else {
                context.translate((enemy.x - cameraX + source.width), 0);
                context.drawImage(enemy.image, enemyFrame * source.width + source.offset, 0 , source.width, 64, -source.width, 240 - 128 - 72, source.width * 2, 128);
                context.translate(-(enemy.x - cameraX + source.width), 0);
            }
            enemy.left = enemy.x - cameraX;
            enemy.top = 240 - 128 - 72;
            enemy.width = source.width * 2;
            enemy.height = 128;
            // Uncomment to draw a reference of the character to show where left side of enemy should be
            //context.drawImage(character.personCanvas, 0 * 32, 0 , 32, 64, enemy.x - cameraX, 240 - 128 - 72, 64, 128);
            // life bar
            drawBar(context, enemy.x - cameraX + 20, 240 - 128 - 36 - 5 * i, 64, 4, 'white', enemy.color, enemy.health / enemy.maxHealth);
        }
        // Draw enemies
        for (var i = 0; i <= 768; i += 64) {
            var x = (784 + (i - character.x) % 768) % 768 - 64;
        }
        if (character.target) {
            var attackFps = 1000 / ((1000 / character.attackSpeed) / fightLoop.length);
            var frame = Math.floor(Math.abs(character.time - character.attackCooldown) * attackFps / 1000) % fightLoop.length;
            context.drawImage(character.personCanvas, fightLoop[frame] * 32, 0 , 32, 64,
                            character.x - cameraX, 240 - 128 - 72, 64, 128);
        } else {
            var fps = Math.floor(3 * character.speed / 100);
            var frame = Math.floor(character.time * fps / 1000) % walkLoop.length;
            context.drawImage(character.personCanvas, walkLoop[frame] * 32, 0 , 32, 64,
                            character.x - cameraX, 240 - 128 - 72, 64, 128);
        }
        // life bar
        drawBar(context, character.x - cameraX, 240 - 128 - 72, 64, 4, 'white', 'red', character.health / character.maxHealth);
        // xp bar
        drawBar(context, 35, 240 - 15, 400, 6, 'white', '#00C000', character.xp / character.xpToLevel);
        context.font = "20px sans-serif";
        context.textAlign = 'right'
        context.fillText(character.level, 30, 240 - 5);
        // Draw damage indicators
        context.fillStyle = 'red';
        for (var i = 0; i < character.textPopups.length; i++) {
            var textPopup = character.textPopups[i];
            context.fillStyle = ifdefor(textPopup.color, "red");
            context.font = ifdefor(textPopup.font, "20px sans-serif");
            context.textAlign = 'center'
            context.fillText(textPopup.value, textPopup.x - cameraX, textPopup.y);
            textPopup.y--;
            if (textPopup.y < 60) {
                character.textPopups.splice(i--, 1);
            }
        }
        if (character.health <= 0) {
            resetCharacter(character);
        }
    });
    checkRemoveToolTip();
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