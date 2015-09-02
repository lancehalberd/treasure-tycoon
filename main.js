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

var fps = 6;
var characters = [];
var itemPoints = 10;

function startArea(character, index) {
    character.$panel.find('.js-infoMode').hide();
    character.$panel.find('.js-adventureMode').show();
    character.areaIndex = index;
    character.area = levels[index];
    character.monsterIndex = 0;
    character.x = 0;
    character.enemies = [];
    character.damageNumbers = [];
}

async.mapSeries(['gfx/person.png', 'gfx/grass.png', 'gfx/caterpillar.png'], loadImage, function(err, results){
    newCharacter();
    gainIp(100);
    setInterval(mainLoop, 20);
});

function completeArea(character) {
    var $adventureButton = character.$panel.find('.js-infoMode').find('.js-adventure').last();
    // If the character beat the last adventure open to them, unlock the next one
    if ($adventureButton.data('levelIndex') == character.areaIndex) {
        var nextLevel = $adventureButton.data('levelIndex') + 1;
        if (levels.length <= nextLevel) {
            var monsters = levels[nextLevel - 1].monsters.slice();
            var wave = [];
            while (wave.length < 10) {
                wave.push(Math.random() > .4 ? caterpillar : butterfly);
            }
            monsters.push(wave);
            levels[nextLevel] = {'level': nextLevel + 1, 'monsters': monsters};
        }
        var $nextAdventureButton = $adventureButton.clone().data('levelIndex', nextLevel).text('Lvl ' + levels[nextLevel].level + ' Adventure!');
        $adventureButton.after($nextAdventureButton);
    }
    resetCharacter(character);
}

function mainLoop() {
    var time = now();
    characters.forEach(function (character) {
        var delta = time - character.lastTime;
        if (character.area == null) {
            var canvas = character.$panel.find('.js-infoMode .js-canvas')[0];
            var context = canvas.getContext("2d");
            var fps = Math.floor(3 * 5 / 3);
            var frame = Math.floor(time * fps / 1000) % walkLoop.length;
            context.clearRect(0, 0, 64, 128);
            context.drawImage(character.personCanvas, walkLoop[frame] * 32, 0 , 32, 64, 0, -20, 64, 128);
            character.lastTime = time;
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
                character.enemies.push(makeMonster(character.area.level, monster, x));
                x += Random.range(50, 150);
            });
            character.monsterIndex++;
        }
        var hit;
        if (character.target) {
            if (character.target.health > 0) {
                hit = checkToAttack(character, character.target, 0);
                if (hit != null){
                    character.damageNumbers.push(
                        {value: hit, x: character.target.x + 32, y: 240 - 128}
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
                    gainXp(character, enemy.xp);
                    gainIp(enemy.ip);
                }
                continue;
            }
            var distance = Math.abs(enemy.x - (character.x + 32));
            hit = checkToAttack(character, enemy, distance);
            if (hit != null){
                character.damageNumbers.push(
                    {value: hit, x: enemy.x + 32, y: 240 - 128}
                )
            }
            hit = checkToAttack(enemy, character, distance);
            if (hit != null){
                character.damageNumbers.push(
                    {value: hit, x: character.x + 32, y: 240 - 128}
                )
            }
            if (!enemy.target) {
                enemy.x -= enemy.speed * delta / 1000;
            }
            // Don't let enemy move past the character
            if (enemy.x < character.x + 32) {
                enemy.x = character.x + 32;
            }
            enemy.health = Math.max(0, enemy.health);
        }
        if (!character.target) {
            character.x += character.speed * delta / 1000;
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
            var enemyFrame = Math.floor(time * enemyFps / 1000) % 4;
            context.translate((enemy.x - cameraX + 48), 0);
            context.scale(-1, 1);
            context.drawImage(images['gfx/caterpillar.png'], enemyFrame * 48 + enemy.offset, 0 , 48, 64, -48, 240 - 128 - 72, 96, 128);
            context.scale(-1, 1);
            context.translate(-(enemy.x - cameraX + 48), 0);
            // life bar
            drawBar(context, enemy.x - cameraX + 20, 240 - 128 - 36 - 5 * i, 64, 4, 'white', 'red', enemy.health / enemy.maxHealth);
        }
        // Draw enemies
        for (var i = 0; i <= 768; i += 64) {
            var x = (784 + (i - character.x) % 768) % 768 - 64;
        }
        if (character.target) {
            var attackFps = 1000 / ((1000 / character.attackSpeed) / fightLoop.length);
            var frame = Math.floor(Math.abs(time - character.attackCooldown) * attackFps / 1000) % fightLoop.length;
            context.drawImage(character.personCanvas, fightLoop[frame] * 32, 0 , 32, 64,
                            character.x - cameraX, 240 - 128 - 72, 64, 128);
        } else {
            var fps = Math.floor(3 * character.speed / 100);
            var frame = Math.floor(time * fps / 1000) % walkLoop.length;
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
        for (var i = 0; i < character.damageNumbers.length; i++) {
            var damageNumber = character.damageNumbers[i];
            context.font = "20px sans-serif";
            context.textAlign = 'center'
            context.fillText(damageNumber.value, damageNumber.x - cameraX, damageNumber.y);
            damageNumber.y--;
            if (damageNumber.y < 60) {
                character.damageNumbers.splice(i--, 1);
            }
        }
        if (character.health <= 0) {
            resetCharacter(character);
        }
        character.lastTime = time;
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
$('.js-mouseContainer').on('mousemove', function (event) {
    if (!$popup) {
        return;
    }
    var x = event.pageX - $('.js-mouseContainer').offset().left;
    var y = event.pageY - $('.js-mouseContainer').offset().top;
    updateToolTip(x, y, $popup);
});

function checkRemoveToolTip() {
    if (!$popupTarget || !$popupTarget.closest('body').length) {
        removeToolTip();
    }
}
function removeToolTip() {
    $('.js-toolTip').remove();
    $popup = null;
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


$('body').on('click', '.js-adventure', function (event) {
    var index = $(this).data('levelIndex');
    var $panel = $(this).closest('.js-playerPanel');
    var character = $panel.data('character');
    startArea(character, index);
});