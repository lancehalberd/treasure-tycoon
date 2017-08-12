
var closedChestSource = {image: requireImage('gfx/chest-closed.png'), source: rectangle(0, 0, 32, 32)};
var openChestSource = {image: requireImage('gfx/chest-open.png'), source: rectangle(0, 0, 32, 32)};

function instantiateLevel(levelData, levelDifficulty, difficultyCompleted, level) {
    level = ifdefor(level, levelData.level);
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
    var minMonstersPerArea = Math.ceil(Math.min(4, 1.5 * level / events.length));
    var maxMonstersPerArea = Math.floor(Math.min(10, 4 * level / events.length));

    var eventsLeft = events;
    var areas = new Map();
    var lastArea;
    var levelBonuses = (levelData.enemySkills || []).map(abilityKey => abilities[abilityKey]);
    if (levelDifficulty === 'easy') levelBonuses.push(easyBonuses);
    else if (levelDifficulty === 'hard' || levelDifficulty === 'endless') levelBonuses.push(hardBonuses);
    var maxLoops = 2000;
    // most objects are always enabled in levels.
    var isEnabled = () => true;
    while (true) {
        var area = {
            key: `area${areas.size}`,
            left: 0,
            width: 800,
            backgroundPatterns: {0: levelData.background},
            objects: [],
            drawMinimapIcon: eventsLeft.length > 1 ? drawMinimapMonsterIcon : drawMinimapBossIcon,
            areas,
            time: 0,
            projectiles: [],
            effects: [],
            cameraX: 0,
            allies: [],
            enemies: [],
            treasurePopups: [],
            textPopups: [],
        };
        if (lastArea) {
            area.objects.push(fixedObject('woodBridge', [-60, 0, 0], {isEnabled, exit: {areaKey: lastArea.key, x: lastArea.width - 150, z: 0}}));
        } else {
            area.objects.push(fixedObject('stoneBridge', [-20, 0, 0], {isEnabled, exit: {areaKey: 'worldMap'}}));
        }
        areas.set(area.key, area);
        lastArea = area;
        if (!eventsLeft.length) break;
        var eventMonsters = eventsLeft.shift().slice();
        area.isBossArea = !eventsLeft.length;
        var numberOfMonsters = Random.range(minMonstersPerArea, maxMonstersPerArea);
        var areaMonsters = [];
        // Add random monsters to the beginning of the area to fill it up the desired amount.
        while (areaMonsters.length < numberOfMonsters - eventMonsters.length) {
            var monster = {key: Random.element(possibleMonsters), level, location: [area.width + Random.range(0, 200), 0, 40]};
            areaMonsters.push(monster);
            area.width = monster.location[0] + 50;
            if (maxLoops-- < 0) debugger;
        }
        // Add the predtermined monsters towards the end of the area.
        while (eventMonsters.length) {
            var bonusSources = eventsLeft.length ? [] : [bossMonsterBonuses];
            var monster = {key: eventMonsters.shift(), level, location: [area.width + Random.range(0, 200), 0, 40]};
            if (area.isBossArea) {
                monster.bonusSources = [bossMonsterBonuses];
                monster.rarity = 0; // Bosses cannot be enchanted or imbued.
            }
            areaMonsters.push(monster);
            area.width = monster.location[0] + 50;
            if (maxLoops-- < 0) debugger;
        }
        addMonstersToArea(area, areaMonsters, levelBonuses);
        area.width += 600;
        area.objects.push(fixedObject('woodBridge', [area.width + 60, 0, 0], {isEnabled() {
            return !this.area.isBossArea || !this.area.enemies.length;
        }, exit: {areaKey: `area${areas.size}`, x: 150, z: 0}}));
        if (maxLoops-- < 0) debugger;
    };
    // lastArea is now an empty area for adding the treasure chest + shrine.
    lastArea.isShrineArea = true;
    var loot = [];
    var pointsFactor = difficultyCompleted ? 1 : 4;
    var maxCoinsPerNormalEnemy = Math.floor(level * Math.pow(1.15, level));
    // coins are granted at the end of each level, but diminished after the first completion.
    loot.push(coinsLoot([pointsFactor * maxCoinsPerNormalEnemy * 10, pointsFactor * maxCoinsPerNormalEnemy * 15]));

    var chest, initialChestIcon, completedChestIcon;
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
            if (levelDifficulty !== 'easy') shapeTypes.push('square');
            if (levelDifficulty === 'hard') shapeTypes.push('trapezoid');
        } else {
            var shapeTypes = ['triangle'];
            if (levelDifficulty !== 'easy') shapeTypes.push('diamond');
            if (levelDifficulty === 'hard') shapeTypes.push('trapezoid');
        }
        // console.log(tier);
        // console.log(shapeTypes.join(','));
        // console.log(components.join(','));
        loot.push(jewelLoot(shapeTypes, [tier, tier], components, false));
        chest = fixedObject('closedChest', [0, 0, 0], {isEnabled, scale: 1, loot});
        initialChestIcon = closedChestSource;
        completedChestIcon = openChestSource;
    } else {
        chest = fixedObject('closedChest', [0, 0, 0], {isEnabled, scale: .8, loot});
        // When the area has already been completed on this difficulty, we always draw the chest mini map icon as open
        // so the player can tell at a glance that they are replaying the difficulty.
        initialChestIcon = completedChestIcon = openChestSource;
    }
    lastArea.objects.push(chest);
    chest.x = lastArea.width + Random.range(0, 100);
    chest.z = Random.range(-140, -160);
    lastArea.width = chest.x + 100;
    lastArea.drawMinimapIcon = function (context, completed, x, y) {
        var source = this.chestOpened ? completedChestIcon : initialChestIcon;
        drawImage(context, source.image, source.source, rectangle(x - 16, y - 18, 32, 32));
    }
    if (levelData.skill && abilities[levelData.skill]) {
        var shrine = fixedObject('skillShrine', [lastArea.width + Random.range(0, 100), 20, 0], {isEnabled, scale: 3, helpMethod(actor) {
            return titleDiv('Divine Shrine')
                + bodyDiv('Offer divinity at these shrines to be blessed by the Gods with new powers.');
        }});
        lastArea.objects.push(shrine);
        lastArea.width = shrine.x + 100;
    }
    lastArea.width += 250;
    lastArea.objects.push(fixedObject('stoneBridge', [lastArea.width + 20, 0, 0], {isEnabled, exit: {areaKey: 'worldMap'}}));
    areas.forEach(area => {
        for (object of area.objects)
            object.area = area;
    });
    return {
        'base': levelData,
        level,
        levelDifficulty,
        entrance: {areaKey: 'area0', x: 120, z: 0},
        areas,
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

var militaryIcons = requireImage('gfx/militaryIcons.png');
var drawMinimapMonsterIcon = (context, completed, x, y) => {
    var target = rectangle(x - 16, y - 18, 32, 32);
    if (completed) drawImage(context, militaryIcons, rectangle(68, 90, 16, 16), target);
    else drawImage(context, militaryIcons, rectangle(136, 23, 16, 16), target);
};
var drawMinimapBossIcon = (context, completed, x, y) => {
    var target = rectangle(x - 16, y - 18, 32, 32);
    drawImage(context, militaryIcons, rectangle(119, 23, 16, 16), target);
    if (completed) drawImage(context, militaryIcons, rectangle(51, 90, 16, 16), target);
};
var drawLetter = (context, letter, x, y) => {
    context.fillStyle = 'black';
    context.font = "20px sans-serif";
    context.textAlign = 'center'
    context.fillText(letter, x, y + 7);
};

function activateShrine(actor) {
    var character = actor.character;
    // Don't activate the shrine a second time.
    if (character.isStuckAtShrine) return;
    var area = actor.area;
    var level = map[character.currentLevelKey];
    if (character.adventurer.level >= maxLevel) {
        messageCharacter(character, character.adventurer.name + ' is already max level');
        return;
    }
    if (character.adventurer.unlockedAbilities[level.skill]) {
        messageCharacter(character, 'Ability already learned');
        return;
    }
    var divinityNeeded = totalCostForNextLevel(character, level) - character.divinity;
    if (divinityNeeded > 0) {
        messageCharacter(character, 'Still need ' + divinityNeeded.abbreviate() + ' Divinity');
        return;
    }
    // TBD: Make this number depend on the game state so it can be improved over time.
    var boardOptions = 2;
    for (var i = 0; i < boardOptions; i++) {
        var boardData = getBoardDataForLevel(level);
        var boardPreview = readBoardFromData(boardData, character, abilities[level.skill]);
        var boardPreviewSprite = adventureBoardPreview(boardPreview, character);
        boardPreviewSprite.x = this.x - (boardOptions * 150 - 150) / 2 + 150 * i;
        boardPreviewSprite.y = 250;
        area.objects.push(boardPreviewSprite);
    }
    var blessingText = objectText('Choose Your Blessing');
    blessingText.x = this.x;
    blessingText.y = 330;
    area.objects.push(blessingText);
    character.isStuckAtShrine = true;
}
function finishShrine(character) {
    var objects = character.hero.area.objects;
    for (var i = 0; i < objects.length; i++) {
        var object = objects[i];
        if (object.type === 'button' || object.type === 'text') {
            objects.splice(i--, 1);
        } else if (object.type === 'shrine') {
            object.done = true;
        }
    }
    character.isStuckAtShrine = false;
}
function openChest(actor) {
    // The loot array is an array of objects that can generate specific loot drops. Iterate over each one, generate a
    // drop and then give the loot to the player and display it on the screen.
    var delay = 0;
    for (var i = 0; i < this.loot.length; i++) {
        var drop = this.loot[i].generateLootDrop();
        drop.gainLoot(actor);
        var xOffset = (this.loot.length > 1) ? - 50 + 100 * i / (this.loot.length - 1) : 0;
        drop.addTreasurePopup(actor, this.x + xOffset, this.y + 64, this.z, delay += 5);
    }
    // Replace this chest with an opened chest in the same location.
    var openedChest = fixedObject('openChest', [this.x, this.y, this.z], {isEnabled: () => true, 'scale': ifdefor(this.scale, 1)});
    openedChest.area = this.area;
    this.area.objects[this.area.objects.indexOf(this)] = openedChest;
    this.area.chestOpened = true;
}

function iconButton(iconSource, width, height, onClick, helpText) {
    var self = {
        'x': 0,
        'y': 0,
        'type': 'button',
        'solid': false,
        width,
        height,
        update(area) {
            self.left = Math.round(self.x - area.cameraX - self.width / 2);
            self.top = Math.round(groundY - self.y - self.height / 2);
        },
        onClick,
        draw(area) {
            drawImage(mainContext, iconSource.image, iconSource, self);
        },
        helpMethod() {
            return ifdefor(helpText, '');
        }
    };
    return self;
}

function objectText(text) {
    var self = {
        'x': 0,
        'y': 0,
        'type': 'text',
        'solid': false,
        isOver(x, y) {return false;},
        update(area) {},
        draw(area) {
            mainContext.fillStyle = 'white';
            mainContext.textBaseline = "middle";
            mainContext.textAlign = 'center'
            mainContext.font = "30px sans-serif";
            mainContext.fillText(text, self.x - area.cameraX, groundY - self.y);
        }
    };
    return self;
}
