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

function Animal(index, frames) {
    this.index = index;
    this.frames = frames;
}

var fps = 6;
var personFrames = 4;
var clothes = [1, 3];
var hair = [clothes[1] + 1, clothes[1] + 4];
var characters = [];
var names = ['Chris', 'Leon', 'Hillary', 'Michelle', 'Rob', 'Reuben', 'Kingston', 'Silver'];
var itemPoints = 10;

function newCharacter() {
    if (!spendItemPoints(1)) {
        return;
    }
    var hairFrame =Math.random() < .05 ? 0 : Random.range(hair[0], hair[1]);
    var shirtFrame = Math.random() < .05 ? 0 :Random.range(clothes[0], clothes[1]);
    var personCanvas = createCanvas(128, 64);
    var personContext = personCanvas.getContext("2d");
    personContext.imageSmoothingEnabled= false;
    var $newPlayerPanel = $('.js-playerPanelTemplate').clone()
        .removeClass('js-playerPanelTemplate').addClass('js-playerPanel').show();
    $('.js-newPlayer').after($newPlayerPanel);
    var canvas = $newPlayerPanel.find('.js-adventureMode .js-canvas')[0];
    var context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    var character = {
        'x': 0,
        'equipment': {
            'boots': null,
            'armor': null,
            'hat': null,
        },
        'base': {
            'maxHealth': 20,
            'armor': 0,
            'speed': 8,
            'evasion': 1
        },
        'bonuses': [],
        'name': Random.element(names),
        'level': 0,
        'xp': 0,
        'xpToLevel': xpToLevel(0),
        'enemies': [],
        'personCanvas': personCanvas,
        'personContext': personContext,
        '$panel': $newPlayerPanel,
        'context': context,
        'canvasWidth': canvas.width,
        'canvasHeight': canvas.height,
        'area': null
    };
    /*for (var i = 0; i < 2; i++) {
        var item = Random.element(items[0]);
        if (!character.equipment[item.type]) {
            equipItem(character, makeItem(item));
        }
    }*/
    updateCharacter(character);
    var canvas = $newPlayerPanel.find('.js-infoMode .js-canvas')[0];
    var context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    characters.push(character);
    $newPlayerPanel.data('character', character);
    resetCharacter(character);
}
function resetCharacter(character) {
    character.health = character.maxHealth;
    character.$panel.find('.js-adventureMode').hide();
    var $infoPanel = character.$panel.find('.js-infoMode');
    $infoPanel.show();
    character.area = null;
    refreshStatsPanel(character);
}
function refreshStatsPanel(character) {
    var $statsPanel = character.$panel.find('.js-infoMode .js-stats');
    $statsPanel.find('.js-name').text(character.name);
    $statsPanel.find('.js-level').text(character.level);
    $statsPanel.find('.js-toLevel').text(character.xpToLevel - character.xp);
    $statsPanel.find('.js-maxHealth').text(character.maxHealth);
    $statsPanel.find('.js-armor').text(character.armor);
    $statsPanel.find('.js-evasion').text(character.evasion);
    $statsPanel.find('.js-speed').text(character.speed);
}
function startArea(character, area) {
    character.$panel.find('.js-infoMode').hide();
    character.$panel.find('.js-adventureMode').show();
    character.area = area;
    character.x = 0;
    character.enemies = [];
}
function xpToLevel(level) {
    return (level + 1) * (level + 2) * 5;
}
function gainIp(amount) {
    itemPoints += amount;
    $('.js-itemPoints').text(itemPoints);
}
function spendItemPoints(amount) {
    if (amount > itemPoints) {
        return false;
    }
    itemPoints -= amount;
    $('.js-itemPoints').text(itemPoints);
    return true;
}
function updateCharacter(character) {
    // Clear the character's bonuses and graphics.
    character.bonuses = [];
    character.personContext.clearRect(0, 0, 128, 64);
    for (var i = 0; i < 4; i++) {
        character.personContext.drawImage(images['gfx/person.png'], i * 32, 0 , 32, 64, i * 32, 0, 32, 64);
    }
    // Add the character's current equipment to bonuses and graphics
    ['boots', 'armor', 'hat'].forEach(function (type) {
        var equipment = character.equipment[type];
        var $equipmentPanel = character.$panel.find('.js-infoMode .js-equipment');
        var $equipmentSlot = $equipmentPanel.find('.js-' + type);
        if (!equipment) {
            return;
        }
        if (equipment.base.bonuses) {
            character.bonuses.push(equipment.base.bonuses);
        }
        if (equipment.base.offset) {
            for (var i = 0; i < 4; i++) {
                character.personContext.drawImage(images['gfx/person.png'], i * 32 + equipment.base.offset * 128, 0 , 32, 64, i * 32, 0, 32, 64);
            }
        }
        $equipmentSlot.append(equipment.$item);
    });
    updateStats(character);
}
function updateStats(character) {
    ['maxHealth', 'armor', 'speed', 'evasion'].forEach(function (stat) {
        character[stat] = getStat(character, stat);
    });
    character.health = character.maxHealth;
    refreshStatsPanel(character);
}
function getStat(character, stat) {
    var base = character.base[stat];
    var plus = 0;
    var percent = 1;
    var multiplier = 1;
    character.bonuses.forEach(function (bonus) {
        plus += ifdefor(bonus['+' + stat], 0);
        percent += ifdefor(bonus['%' + stat], 0);
        multiplier *= ifdefor(bonus['*' + stat], 1);
    });
    return Math.floor((base + plus) * percent * multiplier);
}
function gainXp(character, amount) {
    character.xp += amount;
    while (character.xp >= character.xpToLevel) {
        character.level++;
        character.maxHealth += 5;
        character.health = character.maxHealth;
        character.xp -= character.xpToLevel;
        character.xpToLevel = xpToLevel(character.level);
        updateStats(character);
    }
}
function applyArmorToDamage(damage, armor) {
    //This equation looks a bit funny but is designed to have the following properties:
    //100% damage at 0 armor
    //50% damage when armor is 1/3 of base damage
    //25% damage when armor is 2/3 of base damage
    //1/(2^N) damage when armor is N/3 of base damage
    return Math.max(1, Math.round(damage / Math.pow(2, 3 * armor / damage)));
}
function equipItem(character, item) {
    if (character.equipment[item.base.type]) {
        console.log("Tried to equip an item without first unequiping!");
        return;
    }
    item.$item.detach();
    character.equipment[item.base.type] = item;
    updateCharacter(character);
}
function isEquiped(character, item) {
    return character.equipment[item.base.type] === item;
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
            var damage = Math.floor(x / 200);
            character.enemies.push({
                'x': x,
                'speed': Random.range(1, 2),
                'damage': damage,
                'accuracy': (damage / 5),
                'xp': damage,
                'ip': Math.floor(damage / 10),
                'offset': damage < 10 ? 0 : 4 * 48
            });
        }
        character.x += character.speed;
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
            // Remove the enemy if it goes past the character
            if (enemy.x < character.x) {
                if (Random.range(0, enemy.accuracy) >= Random.range(0, character.evasion)) {
                    character.health -= applyArmorToDamage(enemy.damage, character.armor);
                }
                character.enemies.splice(i--, 1);
                if (character.health > 0) {
                    gainXp(character, enemy.xp);
                    gainIp(enemy.ip);
                }
                continue;
            }
            enemy.x -= enemy.speed;
            context.translate((enemy.x - cameraX + 48), 0);
            context.scale(-1, 1);
            context.drawImage(images['gfx/caterpillar.png'], enemyFrame * 48 + enemy.offset, 0 , 48, 64, -48, 240 - 128 - 72, 96, 128);
            context.scale(-1, 1);
            context.translate(-(enemy.x - cameraX + 48), 0);
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

$('.js-newPlayer').on('click', newCharacter);


$('.js-newItem').on('click', function (event) {
    if (characters.length <= 0) {
        return;
    }
    if (!spendItemPoints(1)) {
        return;
    }
    var item = makeItem(Random.element(items[0]));
    $('.js-inventory').prepend(item.$item);
});

function makeItem(base) {
    var item = {
        'base': base
    };
    item.$item = $tag('div', 'js-item item', tag('div', 'icon ' + base.icon));
    item.$item.data('item', item);
    return item;
}

$('body').on('click', '.js-level1', function (event) {
    var $panel = $(this).closest('.js-playerPanel');
    var character = $panel.data('character');
    startArea(character, 'Adventure');
});

var $dragHelper = null;
var dragged = false;
$('body').on('mouseup', function (event) {
    if (dragged) {
        stopDrag();
    }
});
$('body').on('mousedown', '.js-item', function (event) {
    if ($dragHelper) {
        stopDrag();
        return;
    }
    $dragHelper = $(this).clone();
    $dragHelper.data('$source', $(this));
    $(this).css('opacity', '.3');
    $dragHelper.css('position', 'absolute');
    updateDragHelper();
    $('.js-mouseContainer').append($dragHelper);
    dragged = false;
});

function updateDragHelper() {
    if (!$dragHelper) {
        return;
    }
    $dragHelper.css('left', (mousePosition[0] - 10) + 'px');
    $dragHelper.css('top', (mousePosition[1] - 10) + 'px');
    dragged = true;
}

$(document).on("mousemove", function (event) {
    updateDragHelper();
});

function stopDrag() {
    if ($dragHelper) {
        var $source = $dragHelper.data('$source');
        var item = $source.data('item');
        var hit = false;
        $('.js-equipment .js-' + item.base.type).each(function (index, element) {
            if (collision($dragHelper, $(element))) {
                var sourceCharacter = $source.closest('.js-playerPanel').data('character');
                hit = true
                var targetCharacter = $(element).closest('.js-playerPanel').data('character');
                var current = targetCharacter.equipment[item.base.type];
                targetCharacter.equipment[item.base.type] = null;
                if (sourceCharacter) {
                    sourceCharacter.equipment[item.base.type] = null;
                    if (!current) {
                        updateCharacter(sourceCharacter);
                    }
                } else {
                    //unequip the existing item.
                    if (current) {
                        current.$item.detach();
                        $('.js-inventory').append(current.$item);
                    }
                }
                var $parent = $source.parent();
                equipItem(targetCharacter, item);
                if (sourceCharacter && current) {
                    equipItem(sourceCharacter, current);
                }
            }
        });
        if (!hit) {
            var $target = null;
            $('.js-inventory .js-item').each(function (index, element) {
                var $element = $(element);
                if (collision($dragHelper, $element) && !$element.is($source)) {
                    $target = $element;
                }
            });
            if ($target) {
                hit = true;
                var character = $source.closest('.js-playerPanel').data('character');
                if (character) {
                    character.equipment[item.base.type] = null;
                    updateCharacter(character);
                }
                $source.detach();
                $target.before($source);
            }
        }
        if (!hit && collision($dragHelper, $('.js-inventory'))) {
            var character = $source.closest('.js-playerPanel').data('character');
            if (character) {
                character.equipment[item.base.type] = null;
                updateCharacter(character);
            }
            $source.detach();
            $('.js-inventory').append($source);
        }
        $source.css('opacity', '1');
        $dragHelper.remove();
        $dragHelper = null;
    }
}

var items = [
    [
        {'type': 'boots', 'name': 'swift boots', 'bonuses': {'+speed': 1}, icon: 'boots'},
        {'type': 'boots', 'name': 'steel boots', 'bonuses': {'+speed': -1, '+armor': 1}, icon: 'boots'},
        {'type': 'armor', 'name': 'green tunic', 'bonuses': {'+evasion': 2}, 'offset': 1, icon: 'armor'},
        {'type': 'armor', 'name': 'purple tunic', 'bonuses': {'+armor': 2}, 'offset': 2, icon: 'armor'},
        {'type': 'armor', 'name': 'black tunic', 'bonuses': {'+maxHealth': 10}, 'offset': 3, icon: 'armor'},
        {'type': 'hat', 'name': 'brown hair', 'bonuses': {'+evasion': 1}, 'offset': 4, icon: 'hat'},
        {'type': 'hat', 'name': 'blond hair', 'bonuses': {'+speed': 1}, 'offset': 5, icon: 'hat'},
        {'type': 'hat', 'name': 'purple hair', 'bonuses': {'+armor': 1}, 'offset': 6, icon: 'hat'},
        {'type': 'hat', 'name': 'black hair', 'bonuses': {'%maxHealth': .1}, 'offset': 7, icon: 'hat'}
    ]
];