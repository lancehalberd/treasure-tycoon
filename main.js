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
var personFrames = 4;
var clothes = [1, 3];
var hair = [clothes[1] + 1, clothes[1] + 4];
var characters = [];
var names = ['Chris', 'Leon', 'Hillary', 'Michelle', 'Rob', 'Reuben', 'Kingston', 'Silver'];
var itemPoints = 10;

function startArea(character, area) {
    character.$panel.find('.js-infoMode').hide();
    character.$panel.find('.js-adventureMode').show();
    character.area = area;
    character.x = 0;
    character.enemies = [];
}

async.mapSeries(['gfx/person.png', 'gfx/grass.png', 'gfx/caterpillar.png'], loadImage, function(err, results){
    newCharacter();
    gainIp(0);
    setInterval(mainLoop, 20);
});

function mainLoop() {
    characters.forEach(function (character) {
        if (character.area == null) {
            var canvas = character.$panel.find('.js-infoMode .js-canvas')[0];
            var context = canvas.getContext("2d");
            var fps = Math.floor(3 * 5 / 3);
            var frame = Math.floor(now() * fps / 1000) % personFrames;
            context.clearRect(0, 0, 64, 128);
            context.drawImage(character.personCanvas, frame * 32, 0 , 32, 64, 0, -20, 64, 128);
            return;
        }
        var width = character.canvasWidth;
        var height = character.canvasHeight;
        var context = character.context;
        var fps = Math.floor(3 * character.speed / 3);
        var frame = Math.floor(now() * fps / 1000) % personFrames;
        while (character.enemies.length < 4) {
            var x = character.enemies.length === 0 ? character.x + 800 : character.enemies[character.enemies.length - 1].x + Random.range(200, 500);
            var powerLevel = Math.floor(x / 500);
            character.enemies.push(makeMonster(powerLevel, x));
        }
        if (character.attack) {
            if (character.attack.time <= now()) {
                performAttack(character.attack);
                character.attack = null;
            }
            if (character.attack && character.attack.target.health <= 0) {
                character.attack = null;
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
            if (enemy.attack && enemy.attack.time <= now()) {
                performAttack(enemy.attack);
                enemy.attack = null;
            }
            var distance = Math.abs(enemy.x - (character.x + 32));
            checkToAttack(character, enemy, distance);
            checkToAttack(enemy, character, distance);
            if (!enemy.attack) {
                enemy.x -= enemy.speed;
            }
            // Don't let enemy move past the character
            if (enemy.x < character.x + 32) {
                enemy.x = character.x + 32;
            }
        }
        if (!character.attack) {
            character.x += character.speed;
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
            var enemyFps = Math.floor(3 * enemy.speed);
            var enemyFrame = Math.floor(now() * enemyFps / 1000) % personFrames;
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
        context.drawImage(character.personCanvas, frame * 32, 0 , 32, 64,
                        character.x - cameraX, 240 - 128 - 72, 64, 128);
        // life bar
        drawBar(context, character.x - cameraX, 240 - 128 - 72, 64, 4, 'white', 'red', character.health / character.maxHealth);
        // xp bar
        drawBar(context, 35, 240 - 15, 400, 6, 'white', '#00C000', character.xp / character.xpToLevel);
        context.font = "20px sans-serif";
        context.textAlign = 'right'
        context.fillText(character.level, 30, 240 - 5);
        if (character.health <= 0) {
            resetCharacter(character);
        }
    });
}

function drawBar(context, x, y, width, height, background, color, percent) {
    context.fillStyle = background;
    context.fillRect(x, y, width, height);
    context.fillStyle = color;
    context.fillRect(x + 1, y + 1, Math.floor((width - 2) * percent), height - 2);
}
