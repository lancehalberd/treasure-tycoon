
var levels = {};

function addLevel(levelData, level) {
    var key = levelData.name.replace(/\s*/g, '').toLowerCase() + level;
    levels[key] = {'base': levelData, 'level' : level, 'name': levelData.name + ' ' + level};
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
    var levelData = currentLevel.base;
    var key = levelData.name.replace(/\s*/g, '').toLowerCase() + (currentLevel.level + 1);
    if (!levels[key]) {
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
                          x - 10, y - 10, 20, 20);
    }
    return self;
}
function drawLetter(context, letter, x, y) {
    context.fillStyle = 'black';
    context.font = "20px sans-serif";
    context.textAlign = 'center'
    context.fillText(letter, x, y + 7);
}
function firstChest(loot) {
    return treasureChest(loot, closedChestSource, openChestSource);
}
function backupChest(loot) {
    return treasureChest(loot, openChestSource, openChestSource);
}
var closedChestSource, openChestSource; // initialized in initializeLevels
function treasureChest(loot, closedImage, openImage) {
    var self = {
        'x': 0,
        'type': 'chest',
        'width': 64,
        'loot': loot,
        'closedImage': closedImage,
        'openImage': openImage,
        'open': false,
        'update': function (character) {
            if (!self.open && character.adventurer.x + character.adventurer.width >= self.x) {
                if (character.adventurer.stunned) {
                    character.adventurer.x = self.x - character.adventurer.width;
                } else {
                    character.adventurer.stunned = character.time + .5;
                    self.open = true;
                    // the loot array is an array of objects that can generate
                    // specific loot drops. Iterate over each one, generate a
                    // drop and then give the loot to the player and
                    // display it on the screen.
                    var thetaRange = Math.min(2 * Math.PI / 3, (loot.length - 1) * Math.PI / 6);
                    var theta = (Math.PI - thetaRange) / 2;
                    var delay = 0;
                    self.loot.forEach(function (loot) {
                        var drop = loot.generateLootDrop();
                        drop.gainLoot();
                        var vx =  Math.cos(theta);
                        var vy = -Math.sin(theta);
                        drop.addTreasurePopup(character, self.x + 32 + vx * 40, 240 - 80 + vy * 40, vx, vy, delay += 5);
                        theta += thetaRange / Math.max(1, self.loot.length - 1);
                    });
                }
            }
        },
        'draw': function (context, x, y) {
            var frameOffset = self.open ? 64 : 0;
            context.drawImage(images['gfx/treasureChest.png'], frameOffset, 0, 64, 64, x, y, 64, 64);
        },
        'clone': function() {
            return treasureChest(copy(loot), closedImage, openImage);
        }
    };
    return self;
}
