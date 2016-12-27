function instantiateLevel(levelData, difficulty, difficultyCompleted, level) {
    var waves = [];
    level = ifdefor(level, levelData.level);
    var numberOfWaves = Math.min(10, 3 + Math.floor(2 * Math.sqrt(level)));
    var minWaveSize = Math.floor(Math.min(4, Math.sqrt(level)) * 10);
    var maxWaveSize = Math.floor(Math.min(10, 2.2 * Math.sqrt(level)) * 10);
    var levelDegrees = (360 + 180 * Math.atan2(levelData.coords[1], levelData.coords[0]) / Math.PI) % 360;
    var possibleMonsters = levelData.monsters.slice();
    var strengthMonsters = ['skeleton','skeletalBuccaneer','undeadPaladin','undeadWarrior', 'stealthyCaterpillar'];
    var strengthEventMonsters = ['dragon','giantSkeleton', 'butcher', 'alphaWolf', 'battlefly', 'motherfly'];
    var strengthBosses = ['skeletonOgre', 'dragon', 'packLeader', 'necrognomekhan'];
    var intelligenceMonsters = ['gnome', 'gnomeCleric', 'gnomeWizard', 'bat', 'vampireBat'];
    var intelligenceEventMonsters = ['dragon','giantSkeleton', 'butcher', 'frostGiant', 'battlefly', 'gnomecromancer'];
    var intelligenceBosses = ['skeletonOgre', 'lightningBug', 'frostGiant', 'necrognomekhan', 'giantSpider'];
    var dexterityMonsters = ['spider', 'jumpingSpider', 'wolf', 'caterpillar', 'spongeyCaterpillar'];
    var dexterityEventMonsters = ['dragon','giantSkeleton', 'alphaWolf', 'motherfly', 'battlefly', 'gnomecromancer'];
    var dexterityBosses = ['lightningBug', 'dragon', 'frostGiant', 'packLeader', 'giantSpider'];
    var allMonsters = strengthMonsters.concat(strengthEventMonsters).concat(strengthBosses)
                        .concat(intelligenceMonsters).concat(intelligenceEventMonsters).concat(intelligenceBosses)
                        .concat(dexterityMonsters).concat(dexterityEventMonsters).concat(dexterityBosses);
    for (var monsterKey of allMonsters) {
        if (!monsters[monsterKey]) {
            throw new Error('Invalid monster key: ' + monsterKey);
        }
    }
    if (!possibleMonsters.length) {
        var desiredNumberOfMonsters = Math.min(4, Math.floor(Math.sqrt(level)));
        while (possibleMonsters.length < desiredNumberOfMonsters) {
            var roll = (360 + levelDegrees - 30 + Math.random() * 60) % 360;
            if (roll >= 330 || roll < 90) { // Strength
                possibleMonsters.push(Random.removeElement(strengthMonsters))
            } else if (roll < 210) { // Intelligence
                possibleMonsters.push(Random.removeElement(intelligenceMonsters))
            } else { //Dexterity
                possibleMonsters.push(Random.removeElement(dexterityMonsters))
            }
        }
        //console.log(JSON.stringify(monsters));
    }
    var events = levelData.events.slice();
    if (!events.length) {
        var eventMonsters, bossMonsters;
        var roll = (360 + levelDegrees - 30 + Math.random() * 60) % 360;
        if (roll >= 330 || roll < 90) { // strength
            eventMonsters = strengthEventMonsters;
            bossMonsters = strengthBosses;
        } else if (roll < 210) { // int
            eventMonsters = intelligenceEventMonsters;
            bossMonsters = intelligenceBosses;
        } else { //Dexterity
            eventMonsters = dexterityEventMonsters;
            bossMonsters = dexterityBosses;
        }
        events.push([Random.element(possibleMonsters), Random.element(possibleMonsters), Random.element(eventMonsters)]);
        events.push([Random.element(possibleMonsters), Random.element(possibleMonsters), Random.element(eventMonsters), Random.element(eventMonsters)]);
        events.push([Random.element(possibleMonsters), Random.element(eventMonsters), Random.element(eventMonsters), Random.element(eventMonsters)]);
        events.push([Random.element(possibleMonsters), Random.element(eventMonsters), Random.element(bossMonsters)]);
        //console.log(JSON.stringify(events));
    }
    // Make sure we have at least enough waves for the required events
    numberOfWaves = Math.max(events.length, numberOfWaves);
    // To keep endless levels from dragging on forever, they just have 1 random wave per event wave.
    if (difficulty === 'endless') {
        numberOfWaves = Math.min(Math.max(10, events.length), 2 * events.length);
    }
    var eventsLeft = events;
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
                wave.push(Random.element(possibleMonsters));
            }
            waves.push(monsterWave(wave));
        }

    };
    var loot = [];
    var pointsFactor = difficultyCompleted ? 1 : 4;
    // coins are granted at the end of each level, but diminished after the first completion.
    loot.push(coinsLoot([pointsFactor * level * level * 10, pointsFactor * level * level * 15]));

    if (!difficultyCompleted) {
        // Special Loot drops are given only the first time an adventurer complets an area on a given difficulty.
        // This is the minimum distance the level is from one of the main str/dex/int leylines.
        // Levels within 30 degrees of these leylines use 'basic'(triangle based) shapes for the jewels, other levels
        // will likely have non-triangle based shapes.
        var redComponent = Math.max(0, 120 - getThetaDistance(30, levelDegrees));
        var blueComponent = Math.max(0, 120 - getThetaDistance(150, levelDegrees));
        var greenComponent = Math.max(0, 120 - getThetaDistance(270, levelDegrees));
        var allComponent = Math.abs(levelData.coords[2]) / 60;
        // component can be as high as 120 so if it is at least 90 we are within 30 degrees of a primary leyline
        var maxComponent = Math.max(redComponent, blueComponent, greenComponent);
        var tier = getJewelTiewerForLevel(level);
        var components = [[(redComponent + allComponent) * 0.9, (redComponent + allComponent) * 1.1],
                          [(greenComponent + allComponent) * 0.9, (greenComponent + allComponent) * 1.1],
                          [(blueComponent + allComponent) * 0.9, (blueComponent + allComponent) * 1.1]];
        if (maxComponent < 90) {
            var shapeTypes = ['rhombus']
            if (difficulty !== 'easy') shapeTypes.push('square');
            if (difficulty === 'hard') shapeTypes.push('trapezoid');
        } else {
            var shapeTypes = ['triangle'];
            if (difficulty !== 'easy') shapeTypes.push('diamond');
            if (difficulty === 'hard') shapeTypes.push('trapezoid');
        }
        // console.log(tier);
        // console.log(shapeTypes.join(','));
        // console.log(components.join(','));
        loot.push(jewelLoot(shapeTypes, [tier, tier], components, false));
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
function getJewelTiewerForLevel(level) {
    var tier = 1;
    if (level >= jewelTierLevels[5]) tier = 5
    else if (level >= jewelTierLevels[4]) tier = 4
    else if (level >= jewelTierLevels[3]) tier = 3
    else if (level >= jewelTierLevels[2]) tier = 2
    return tier;
}
function createEndlessLevel(key, level) {
    tier = getJewelTiewerForLevel(level);
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
        'extraBonuses': extraBonuses,
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