function instantiateLevel(levelData, completed) {
    var waves = [];
    var level = levelData.level;
    var numberOfWaves = 3 + Math.min(20, Math.floor(2 * Math.sqrt(level)));
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
        if ((wavesLeft === 1 || eventsLeft.length > 1) && Math.random() < eventsLeft.length / wavesLeft) {
            wave = eventsLeft.shift();
            waves.push(!eventsLeft.length ? bossWave(wave) : eventWave(wave));
        } else {
            // Don't add random mobs to boss waves.
            while (wave.length < waveSize) {
                wave.push(Random.element(levelData.monsters));
            }
            waves.push(monsterWave(wave));
        }

    };
    var loot = [];
    var pointsFactor = completed ? 1 : 4;
    // coins are granted at the end of each level, but diminished after the first completion.
    loot.push(coinsLoot([pointsFactor * level * level * 10, pointsFactor * level * level * 15]));
    // Special Loot drops are given only the first time an adventurer complets an area.
    if (!completed) {
        loot = levelData.specialLoot.map(function (lootKey) { return loots[lootKey];}).concat(loot);
        waves.push(chestWave(firstChest(loot)));
    } else {
        waves.push(chestWave(backupChest(loot)));
    }

    return {
        'base': levelData,
        'level': level,
        'enemySkills': ifdefor(levelData.enemySkills, []).map(function (abilityKey) { return abilities[abilityKey];}),
        'waves': waves,
        'background': levelData.background
    };
}
function createEndlessLevel(key, level) {
    var tier = 1;
    if (level >= jewelTierLevels[5]) tier = 5
    else if (level >= jewelTierLevels[4]) tier = 4
    else if (level >= jewelTierLevels[3]) tier = 3
    else if (level >= jewelTierLevels[2]) tier = 2
    var componentBonus = (10 + tier) * (level - jewelTierLevels[tier]);
    var name, background, monsters, events;
    switch (key) {
        case 'eternalfields':
            name = 'Eternal Fields';
            background = backgrounds.field;
            components = [[80 + componentBonus, 100 + componentBonus], [5,20], [5, 20]];
            monsters = ['skeleton', 'caterpillar'];
            events = [['butcher'], ['dragon'], ['butcher', 'giantSkeleton', 'dragon']];
            break;
        case 'bottomlessdepths':
            name = 'Bottomless Depths';
            background = backgrounds.cave;
            components = [[5,20], [5, 20], [80 + componentBonus, 100 + componentBonus]];
            monsters = ['skeleton', 'gnome'];
            events = [['giantSkeleton'], ['butcher', 'butterfly', 'butterfly'], ['motherfly', 'gnomecromancer', 'gnomecromancer']];
            break;
        case 'oceanoftrees':
            name = 'Ocean of Trees';
            background = backgrounds.forest;
            components = [[5,20], [80 + componentBonus, 100 + componentBonus], [5, 20]];
            monsters = ['gnome', 'caterpillar'];
            events = [['motherfly'], ['dragon'], ['motherfly', 'dragon', 'motherfly']];
    }
    addLevel({'name': name, 'level': level, 'background': background, 'specialLoot': [jewelLoot(basicShapeTypes, [tier, tier], components, false)], 'next': [key + (level + 1)],
             'enemySkills': [], 'monsters': monsters, 'events': events, 'key' : key + level});
}
function basicWave(monsters, objects, letter, extraBonuses) {
    return {
        'monsters': monsters,
        'objects': objects,
        'extraBonuses': ifdefor(extraBonuses, {}),
        'draw': function (context, completed, x, y) {
            if (!completed) drawLetter(context, letter, x, y);
        }
    };
}
function monsterWave(monsters) {
    if (editingLevel) {
        return basicWave(monsters, [], 'M');
    }
    return eventWave(monsters);
}
function eventWave(monsters) {
    var self =  basicWave(monsters, [], 'M');
    self.draw = function (context, completed, x, y) {
        var source = {'image': images['gfx/militaryIcons.png'], 'xOffset': 136, 'yOffset': 23, 'width': 16, 'height': 16};
        if (completed) {
            source = {'image': images['gfx/militaryIcons.png'], 'xOffset': 68, 'yOffset': 90, 'width': 16, 'height': 16};
            context.drawImage(source.image, source.xOffset, source.yOffset, source.width, source.height,
                              x - 16, y - 18, 32, 32);
        } else {
            context.drawImage(source.image, source.xOffset, source.yOffset, source.width, source.height,
                              x - 16, y - 14, 32, 32);
        }
    }
    return self;
}
function bossWave(monsters) {
    var self =  basicWave(monsters, [], 'B', bossMonsterBonuses);
    self.draw = function (context, completed, x, y) {
        var source = {'image': images['gfx/militaryIcons.png'], 'xOffset': 119, 'yOffset': 23, 'width': 16, 'height': 16};
        context.drawImage(source.image, source.xOffset, source.yOffset, source.width, source.height,
                          x - 16, y - 18, 32, 32);
        if (completed) {
            source = {'image': images['gfx/militaryIcons.png'], 'xOffset': 51, 'yOffset': 90, 'width': 16, 'height': 16};
            context.drawImage(source.image, source.xOffset, source.yOffset, source.width, source.height,
                              x - 16, y - 18, 32, 32);
        }
    }
    return self;
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