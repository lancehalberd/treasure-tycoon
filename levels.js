
var levels = {};

function addLevel(levelData, level) {
    var key = levelData.name.replace(/\s*/g, '').toLowerCase() + level;
    levels[key] = {'base': levelData, 'level' : level, 'name': 'Level ' + level +': ' + levelData.name};
}
function instantiateLevel(levelData, completed) {
    var waves = [];
    var level = levelData.level;
    levelData = levelData.base;
    var numberOfWaves = Math.floor(5 * Math.sqrt(level));
    // Make sure we have at least enough waves for the required events
    numberOfWaves = Math.max(levelData.events.length, numberOfWaves);
    var minWaveSize = Math.floor(Math.min(4, Math.sqrt(level)) * 10);
    var maxWaveSize = Math.floor(Math.min(10, 2.2 * Math.sqrt(level)) * 10);
    var eventsLeft = levelData.events.slice();
    while (waves.length < numberOfWaves) {
        var waveSize = Math.max(1, Math.floor(Random.range(minWaveSize, maxWaveSize) / 10));
        var wave = [];
        // The probability of including an event is the number of events over the number
        // of open waves left (ex)
        var wavesLeft = numberOfWaves - waves.length;
        // This will be 100% chance to include event wave once # events = # waves left
        var isBossWave = false;
        if (Math.random() < eventsLeft.length / wavesLeft) {
            wave = eventsLeft.shift();
            isBossWave = !eventsLeft.length;
        }
        while (wave.length < waveSize) {
            wave.push(Random.element(levelData.monsters));
        }
        waves.push(isBossWave ? bossWave(wave) : monsterWave(wave));
    };
    waves.push(chestWave((completed ? levelData.backupChest : levelData.firstChest).clone()));
    return {
        'base': levelData,
        'level': level,
        'waves': waves,
        'backgroundImage': levelData.backgroundImage
    };
}
function $levelButton(key) {
    return $tag('button', 'js-adventure adventure', levels[key].name).data('levelIndex', key);
}
function $nextLevelButton(currentLevel) {
    var levelData = copy(currentLevel.base);
    var level = currentLevel.level + 1;
    var key = levelData.name.replace(/\s*/g, '').toLowerCase() + level;
    if (!levels[key]) {
        var tier = 1;
        if (level >= jewelTierLevels[5]) {
            tier = 5
        } else if (level >= jewelTierLevels[4]) {
            tier = 4
        } else if (level >= jewelTierLevels[3]) {
            tier = 3
        } else if (level >= jewelTierLevels[2]) {
            tier = 2
        }
        var componentBonus = (10 + tier) * (level - jewelTierLevels[tier]);
        if (levelData.name === 'Forest') {
            components = [[5,20], [80 + componentBonus, 100 + componentBonus], [5, 20]];
        } else if (levelData.name === 'Cave') {
            components = [[5,20], [5, 20], [80 + componentBonus, 100 + componentBonus]];
        } else {
            components = [[80 + componentBonus, 100 + componentBonus], [5,20], [5, 20]];
        }
        levelData.firstChest = firstChest([
                        jewelLoot(basicShapeTypes, [tier, tier], components, false),
                        pointLoot('AP', [level * level, level * level]),
                        pointLoot('IP', [50 * level, 55 * level + 50]),
                        pointLoot('MP', [Math.floor(10 * level), Math.floor(11 * level + 10)]),
                        pointLoot('RP', [5 * level, 5.5 * level])]);
        levelData.backupChest = backupChest([pointLoot('IP', [10 * level, 11 * level + 10]),
                                             pointLoot('MP', [Math.floor(2 * level), Math.floor(2.2 * level + 2)]),
                                             pointLoot('RP', [level, 1.1 * level])]);
        addLevel(levelData, currentLevel.level + 1);
    }
    return $levelButton(key);
}
function initializeLevels() {
    closedChestSource = {'image': images['gfx/chest-closed.png'], 'xOffset': 0, 'width': 32, 'height': 32};
    openChestSource = {'image': images['gfx/chest-open.png'], 'xOffset': 0, 'width': 32, 'height': 32};
    // monsters are random monsters that can be added to any waves or present in random waves.
    // events are predefined sets of monsters that will appear in order throughout the level.
    addLevel({'name': 'Forest', 'backgroundImage': images['gfx/forest.png'],
             'monsters': ['caterpillar', 'gnome'],
             'events': [['gnome', 'gnome'], ['caterpillar', 'caterpillar'], ['butterfly']],
             'firstChest': firstChest([simpleEmeraldLoot, pointLoot('AP', [1, 1]), pointLoot('IP', [40, 50])]),
             'backupChest': backupChest([pointLoot('IP', [10, 20])])
             }, 1);
    addLevel({'name': 'Cave', 'backgroundImage': images['gfx/cave.png'],
             'monsters': ['gnome', 'skeleton'],
             'events': [['skeleton', 'skeleton'], ['gnome', 'gnome'], ['giantSkeleton']],
             'firstChest': firstChest([simpleSaphireLoot, pointLoot('AP', [1, 1]), pointLoot('IP', [40, 50])]),
             'backupChest': backupChest([pointLoot('IP', [10, 20])])
             }, 1);
    addLevel({'name': 'Field', 'backgroundImage': images['gfx/grass.png'],
             'monsters': ['caterpillar', 'skeleton'],
             'events': [['caterpillar', 'caterpillar'], ['skeleton', 'skeleton'], ['dragon']],
             'firstChest': firstChest([simpleRubyLoot, pointLoot('AP', [1, 1]), pointLoot('IP', [40, 50])]),
             'backupChest': backupChest([pointLoot('IP', [10, 20])])
             }, 1);
}
function basicWave(monsters, objects, letter) {
    return {
        'monsters': monsters,
        'objects': objects,
        'draw': function (context, completed, x, y) {
            if (!completed) drawLetter(context, letter, x, y);
        }
    };
}
function monsterWave(monsters) {
    return basicWave(monsters, [], 'M');
}
function bossWave(monsters) {
    return basicWave(monsters, [], 'B');
}
function chestWave(chest) {
    var self =  basicWave([], [chest], 'T');
    self.draw = function (context, completed, x, y) {
        var source = (completed || chest.open) ? chest.openImage : chest.closedImage;
        context.drawImage(source.image, source.xOffset, 0, source.width, source.height,
                          x - 16, y - 18, 32, 32);
    }
    return self;
}
function drawLetter(context, letter, x, y) {
    context.fillStyle = 'black';
    context.font = "20px sans-serif";
    context.textAlign = 'center'
    context.fillText(letter, x, y + 7);
}