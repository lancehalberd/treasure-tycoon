var guildImage = requireImage('gfx/guildhall.png');
/*
 Fixed object properties are a little different than the properties used for actors at the moment.
 I'm not sure which is better. Actors support defining a center point to rotate around, which is not
 supported here yet (not sure  if I'll use this). On the other hand, actors use xOffset/yOffset in
 a way that I'm not quite comfortable with at the moment.
 Here we have:
 source = {'image', 'width', 'height', 'top', 'left', 'actualWidth', 'actualHeight', 'xOffset', 'yOffset'}
 Then on the object itself we have defined 'scale'
 width/height/top/left define the rectangle to read from the source image, and the default dimensions to draw the target
 to. Scale set on the object can scale up/down the target rectangle. actualWidth/actualHeight are an optional sub rectangle
 which define the dimensions the object should have in terms of actual collision in the game, which is sometimes smaller than
 the image. For example, the goddess statue has a wing span of 60px, but only the base registers for hit detection, so we set
 actualWidth to 30px.
 xOffset/yOffset are a number of pixels to move the image to the right or up if the default positioning doesn't match the
 actual position. For example, by default the bottom of an image will be drawn at the center of the floor, but objects with depths
 should have their perceived center at this position, which means offsetting the images by half of their depth pixels.
 */
function objectSource(image, coords, size, additionalProperties) {
    var source = $.extend({'image': image, 'left': coords[0], 'top': coords[1],
            'width': size[0], 'height': size[1], 'depth': ifdefor(size[2], size[0])}, ifdefor(additionalProperties, {}));
    if (!source.actualWidth) source.actualWidth = source.width;
    if (!source.actualHeight) source.actualHeight = source.height;
    if (!source.xOffset) source.xOffset = 0;
    if (!source.yOffset) source.yOffset = 0;
    return source;
}
function openWorldMap(actor) {
    setContext('map');
}
function openCrafting(actor) {
    setContext('item');
}
function openJewels(actor) {
    setContext('jewel');
}
function useDoor(actor) {
    enterGuildArea(actor, this.exit);
}
function showApplication(actor) {
    setHeroApplication($('.js-heroApplication'), this);
    $('.js-heroApplication').show();
}
function openTrophySelection(actor) {
    removeToolTip();
    choosingTrophyAltar = this;
}
$('.js-mouseContainer').on('mousedown', function (event) {
    var x = event.pageX - $('.js-mainCanvas').offset().left;
    var y = event.pageY - $('.js-mainCanvas').offset().top;
    if (!$(event.target).closest('.js-heroApplication').length) $('.js-heroApplication').hide();
    if (!isPointInRectObject(x, y, trophyRectangle)) choosingTrophyAltar = null;
    if (!isPointInRectObject(x, y, upgradeRectangle)) upgradingObject = null;
});

var coinStashTiers = [
    {'name': 'Cracked Pot', 'bonuses': {'+maxCoins': 500}, 'upgradeCost': 500, 'source': objectSource(guildImage, [300, 150], [30, 30], {'yOffset': -6}), 'scale': 2},
    {'name': 'Large Jar', 'bonuses': {'+maxCoins': 4000}, 'upgradeCost': 10000, 'source': objectSource(guildImage, [330, 150], [30, 30], {'yOffset': -6}), 'scale': 2},
    {'name': 'Piggy Bank', 'bonuses': {'+maxCoins': 30000}, 'upgradeCost': 150000, 'requires': 'workshop', 'source': objectSource(guildImage, [300, 180], [30, 30], {'yOffset': -6}), 'scale': 2},
    {'name': 'Chest', 'bonuses': {'+maxCoins': 200000}, 'upgradeCost': 1.5e6, 'requires': 'workshop', 'source': objectSource(requireImage('gfx/chest-closed.png'), [0, 0], [32, 32], {'yOffset': -6}), 'scale': 2},
    {'name': 'Safe', 'bonuses': {'+maxCoins': 1e6}, 'upgradeCost': 10e6, 'requires': 'magicWorkshop', 'source': objectSource(guildImage, [330, 180], [30, 30], {'yOffset': -6}), 'scale': 2},
    {'name': 'Bag of Holding', 'bonuses': {'+maxCoins': 30e6}, 'upgradeCost': 500e6, 'requires': 'magicWorkshop', 'source': objectSource(guildImage, [300, 210], [30, 30], {'yOffset': -6}), 'scale': 2},
    {'name': 'Chest of Holding', 'bonuses': {'+maxCoins': 500e6}, 'upgradeCost': 15e9, 'requires': 'magicWorkshop', 'source': objectSource(requireImage('gfx/chest-closed.png'), [0, 0], [32, 32], {'yOffset': -6}), 'scale': 2},
    {'name': 'Safe of Hoarding', 'bonuses': {'+maxCoins': 10e9}, 'source': objectSource(guildImage, [330, 180], [30, 30], {'yOffset': -6}), 'scale': 2},
];

var animaOrbTiers = [
    {'name': 'Cracked Anima Orb', 'bonuses': {'+maxAnima': 100}, 'upgradeCost': {'coins': 1000, 'anima': 50}, 'source': objectSource(guildImage, [240, 150], [30, 30], {'yOffset': -6}), 'scale': 2},
    {'name': '"Fixed" Anima Orb', 'bonuses': {'+maxAnima': 2500}, 'upgradeCost': {'coins': 10000, 'anima': 5000}, 'source': objectSource(guildImage, [240, 150], [30, 30], {'yOffset': -6}), 'scale': 2},
    {'name': 'Restored Anima Orb', 'bonuses': {'+maxAnima': 50000}, 'upgradeCost': {'coins': 10e6, 'anima': 250000}, 'requires': 'workshop', 'source': objectSource(guildImage, [270, 150], [30, 30], {'yOffset': -6}), 'scale': 2},
    {'name': 'Enchanted Anima Orb', 'bonuses': {'+maxAnima': 5e6}, 'upgradeCost': {'coins': 10e9, 'anima': 50e6}, 'requires': 'magicWorkshop', 'source': objectSource(guildImage, [270, 150], [30, 30], {'yOffset': -6}), 'scale': 2},
    {'name': 'Perfected Anima Orb', 'bonuses': {'+maxAnima': 500e6}, 'requires': 'magicWorkshop', 'source': objectSource(guildImage, [270, 150], [30, 30], {'yOffset': -6}), 'scale': 2},
];

function drawMapButton() {
    this.flashColor = state.selectedCharacter.hero.area.completed ? 'white' : null;
    drawHudElement.call(this);
}

var upgradeButton = {
    'isVisible': function () {
        return !!upgradingObject;
    },
    'draw': function () {
        var currentTier = upgradingObject.getCurrentTier();
        var canUpgrade = canAffordCost(currentTier.upgradeCost);
        mainContext.textAlign = 'center'
        mainContext.textBaseline = 'middle';
        setFontSize(mainContext, 18);
        mainContext.strokeStyle = canUpgrade ? 'white' : '#AAA';
        mainContext.lineWidth = 2;
        mainContext.fillStyle = canUpgrade ? '#6C6' : '#CCC';
        var padding = 7;
        var metrics = mainContext.measureText('Upgrade to...');
        this.width = metrics.width + 2 * padding;
        this.height = 20 + 2 * padding;
        this.left = upgradeRectangle.left + (upgradeRectangle.width - this.width) / 2;
        this.top = upgradeRectangle.top + (upgradeRectangle.height - this.height) / 2;
        drawTitleRectangle(mainContext, this)
        mainContext.fillStyle = canUpgrade ? 'white' : '#AAA';
        mainContext.fillText('Upgrade to...', this.left + this.width / 2, this.top + this.height / 2);
    },
    'helpMethod': function () {
        var currentTier = upgradingObject.getCurrentTier();
        previewCost(currentTier.upgradeCost);
        return null;
    },
    'onMouseOut': function () {
        hidePointsPreview();
    },
    'onClick': function () {
        var currentTier = upgradingObject.getCurrentTier();
        if (!attemptToApplyCost(currentTier.upgradeCost)) return;
        removeFurnitureBonuses(upgradingObject, false);
        upgradingObject.level++;
        addFurnitureBonuses(upgradingObject, true);
        if (!state.guildAreas[upgradingObject.area.key]) {
            state.guildAreas[upgradingObject.area.key] = upgradingObject.area;
        }
        saveGame();
        upgradingObject = null;
    }
};

var upgradingObject = null;
var upgradeRectangle = rectangle(250, 150, 300, 180);
function drawUpgradeBox() {
    drawRectangleBackground(mainContext, upgradeRectangle);
    var currentTier = upgradingObject.getCurrentTier();
    var nextTier = upgradingObject.getNextTier();
    drawImage(mainContext, currentTier.source.image, currentTier.source, {'left': upgradeRectangle.left + 10, 'top': upgradeRectangle.top + 6, 'width': 60, 'height': 60});
    drawImage(mainContext, nextTier.source.image, nextTier.source, {'left': upgradeRectangle.left + 10, 'top': upgradeRectangle.top + 105, 'width': 60, 'height': 60});
    mainContext.textAlign = 'left'
    mainContext.textBaseline = 'middle';
    mainContext.fillStyle = 'white';
    setFontSize(mainContext, 18);
    mainContext.fillText(currentTier.name, upgradeRectangle.left + 80, upgradeRectangle.top + 25);
    mainContext.fillText(nextTier.name, upgradeRectangle.left + 80, upgradeRectangle.top + 125);
    mainContext.fillStyle = toolTipColor;
    mainContext.fillText(bonusSourceHelpText(currentTier, state.selectedCharacter.adventurer).replace(/<br ?\/?>/g, "\n"), upgradeRectangle.left + 80, upgradeRectangle.top + 45);
    mainContext.fillText(bonusSourceHelpText(nextTier, state.selectedCharacter.adventurer).replace(/<br ?\/?>/g, "\n"), upgradeRectangle.left + 80, upgradeRectangle.top + 145);
}

var areaObjects = {
    'mapTable': {'name': 'World Map', 'source': objectSource(guildImage, [360, 150], [60, 27, 30], {'yOffset': -6}), 'action': openWorldMap,
        'getActiveBonusSources': () => [{'bonuses': {'$hasMap': true}}],
    },
    'crackedOrb': {'name': 'Cracked Anima Orb', 'source': objectSource(guildImage, [240, 150], [30, 29, 15])},
    'animaOrb': {
        'action': function () {
            removeToolTip();
            upgradingObject = this;
        },
        'level': 1, 'source': animaOrbTiers[0].source,
        'getActiveBonusSources': function () {
            return [this.getCurrentTier()];
        },
        'getCurrentTier': function () {
            return animaOrbTiers[this.level - 1];
        },
        'getNextTier': function () {
            return ifdefor(animaOrbTiers[this.level]);
        },
        'width': 60, 'height': 60, 'depth': 60,
        'draw': function (area) {
            var animaOrbTier = animaOrbTiers[this.level - 1];
            this.scale = ifdefor(animaOrbTier.scale, 1);
            this.source = animaOrbTier.source;
            // Make this coin stash flash if it can be upgraded.
            this.flashColor = (animaOrbTier.upgradeCost && canAffordCost(animaOrbTier.upgradeCost)) ? 'white' : null;
            drawFixedObject.call(this, area);
        },
        'helpMethod': function (object) {
            var animaOrbTier = animaOrbTiers[this.level - 1];
            var parts = [];
            parts.push(bonusSourceHelpText(animaOrbTier, state.selectedCharacter.adventurer));
            if (animaOrbTier.upgradeCost) {
                previewCost(animaOrbTier.upgradeCost);
                parts.push('Upgrade for ' + costHelpText(animaOrbTier.upgradeCost));
            }
            return titleDiv(animaOrbTier.name) + parts.join('<br/><br/>');
        },
        'onMouseOut': function () {
            hidePointsPreview();
        }
    },
    'coinStash': {
        'action':  function () {
            removeToolTip();
            upgradingObject = this;
        },
        'level': 1, 'source': coinStashTiers[0].source,
        'getActiveBonusSources': function () {
            return [this.getCurrentTier()];
        },
        'getCurrentTier': function () {
            return coinStashTiers[this.level - 1];
        },
        'getNextTier': function () {
            return ifdefor(coinStashTiers[this.level]);
        },
        'width': 60, 'height': 60, 'depth': 60,
        'draw': function (area) {
            var coinStashTier = coinStashTiers[this.level - 1];
            this.scale = ifdefor(coinStashTier.scale, 1);
            this.source = coinStashTier.source;
            // Make this coin stash flash if it can be upgraded.
            this.flashColor = (coinStashTier.upgradeCost && canAffordCost(coinStashTier.upgradeCost)) ? 'white' : null;
            drawFixedObject.call(this, area);
        },
        'helpMethod': function (object) {
            var coinStashTier = coinStashTiers[this.level - 1];
            var parts = [];
            parts.push(bonusSourceHelpText(coinStashTier, state.selectedCharacter.adventurer));
            if (coinStashTier.upgradeCost) {
                previewCost(coinStashTier.upgradeCost);
                parts.push('Upgrade for ' + costHelpText(coinStashTier.upgradeCost));
            }
            return titleDiv(coinStashTier.name) + parts.join('<br/><br/>');
        },
        'onMouseOut': function () {
            hidePointsPreview();
        }
    },
    'woodenAltar': {'name': 'Shrine of Fortune', 'source': objectSource(guildImage, [450, 150], [30, 30, 20], {'yOffset': -6}), 'action': openCrafting,
        'getActiveBonusSources': () => [{'bonuses': {'$hasItemCrafting': true}}],
    },
    'trophyAltar': {'name': 'Trophy Altar', 'source': objectSource(guildImage, [420, 180], [30, 30, 20], {'yOffset': -6}), 'action': openTrophySelection,
        'getTrophyRectangle': function () {
            return {'left': this.target.left + (this.target.width - this.trophy.width) / 2,
                    'top': this.target.top - this.trophy.height + 10, 'width': this.trophy.width, 'height': this.trophy.height};
        },
        'draw': function (area) {
            // Make this altar flash if it is open and there is an unused trophy available to place on it.
            this.flashColor = (!this.trophy && isAltarTrophyAvailable) ? 'white' : null;
            drawFixedObject.call(this, area);
            if (this.trophy) {
                if (canvasPopupTarget === this) drawSourceWithOutline(mainContext, this.trophy, '#fff', 2, this.getTrophyRectangle());
                else this.trophy.draw(mainContext, this.getTrophyRectangle());
            }
        }, 'isOver': function (x, y) {
            return isPointInRectObject(x, y, this.target) || (this.trophy && isPointInRectObject(x,y, this.getTrophyRectangle()));
        },
        'helpMethod': function (object) {
            if (this.trophy) return this.trophy.helpMethod();
            return titleDiv('Trophy Altar');
        }
    },
    'candles': {'source': objectSource(guildImage, [540, 145], [25, 40, 0])},
    'bed': {'name': 'Worn Cot', 'source': objectSource(guildImage, [480, 210], [60, 24, 30], {'yOffset': -6}),
        'getActiveBonusSources': function () {
            return [{'bonuses': {'+maxHeroes': 1}}];
        }
    },
    'jewelShrine': {'name': 'Shrine of Creation', 'source': objectSource(guildImage, [360, 180], [60, 60, 4], {'actualWidth': 30, 'yOffset': -6}), 'action': openJewels,
        'getActiveBonusSources': () => [{'bonuses': {'$hasJewelCrafting': true}}],
    },
    'heroApplication': {'name': 'Application', 'source': {'width': 40, 'height': 60, 'depth': 0}, 'action': showApplication, 'draw': function (area) {
        this.target.left = this.x - this.width / 2 - area.cameraX;
        this.target.top = groundY - this.y - this.height - this.z / 2;
        if (canvasPopupTarget === this) {
            mainContext.fillStyle = 'white';
            fillRectangle(mainContext, shrinkRectangle(this.target, -2));
        }
        mainContext.fillStyle = '#fc8';
        fillRectangle(mainContext, this.target);
        if (!this.character) {
            this.character = createNewHeroApplicant();
        }
        var jobSource = this.character.adventurer.job.iconSource;
        mainContext.save();
        mainContext.globalAlpha = 0.6;
        drawImage(mainContext, jobSource.image, jobSource, {'left': this.target.left + 4, 'top': this.target.top + 14, 'width': 32, 'height': 32});
        mainContext.restore();
    }},

    'door': {'source': objectSource(guildImage, [240, 94], [30, 51, 0]), 'action': useDoor, 'isEnabled': isGuildExitEnabled},
    'upstairs': {'source': objectSource(guildImage, [270, 94], [30, 51, 0]), 'action': useDoor, 'isEnabled': isGuildExitEnabled},
    'downstairs': {'source': objectSource(guildImage, [300, 94], [30, 51, 0]), 'action': useDoor, 'isEnabled': isGuildExitEnabled},

    'skillShrine': {'name': 'Shrine of Divinity', 'source': objectSource(guildImage, [360, 180], [60, 60, 4], {'actualWidth': 30, 'yOffset': -6}), 'action': activateShrine},
    'closedChest': {'name': 'Treasure Chest', 'source': objectSource(requireImage('gfx/treasureChest.png'), [0, 0], [64, 64, 64], {'yOffset': -6}), 'action': openChest},
    'openChest': {'name': 'Opened Treasure Chest', 'source': objectSource(requireImage('gfx/treasureChest.png'), [64, 0], [64, 64, 64], {'yOffset': -6}), 'action': function (actor) {
        messageCharacter(actor.character, 'Empty');
    }},
}

function drawFixedObject(area) {
    var imageSource = this.source;
    if (this.lastScale !== this.scale) {
        this.width = ifdefor(imageSource.actualWidth, imageSource.width) * this.scale;
        this.height = ifdefor(imageSource.actualHeight, imageSource.height) * this.scale;
        this.target.width = imageSource.width * this.scale;
        this.target.height = imageSource.height * this.scale;
        this.lastScale = this.scale;
    }
    // Calculate the left/top values from x/y/z coords, which drawImage will use.
    this.target.left = this.x - this.target.width / 2 - area.cameraX + imageSource.xOffset * this.scale;
    this.target.top = groundY - this.y - this.target.height - this.z / 2 - imageSource.yOffset * this.scale;
    if (canvasPopupTarget === this) drawOutlinedImage(mainContext, imageSource.image, '#fff', 2, imageSource, this.target);
    else if (this.flashColor) drawTintedImage(mainContext, imageSource.image, this.flashColor, .5 + .2 * Math.sin(now() / 150), imageSource, this.target);
    else drawImage(mainContext, imageSource.image, imageSource, this.target);
}
function isGuildObjectEnabled() {
    if (!this.area) debugger;
    return state.unlockedGuildAreas[this.area.key] && !this.area.enemies.length;
}
function isGuildExitEnabled() {
    //if (this.area.key === 'guildFoyer') debugger;
    // A door can be used if the are is unlocked.
    if (isGuildObjectEnabled.call(this)) return true;
    //if (this.area.key === 'guildFoyer') debugger;
    // It can also be used if the area it is connected to is unlocked.
    return state.unlockedGuildAreas[this.exit.areaKey];
}

function fixedObject(baseObjectKey, coords, properties) {
    properties = ifdefor(properties, {});
    var base = areaObjects[baseObjectKey];
    var scale = ifdefor(properties.scale, ifdefor(base.scale, 1));
    var imageSource = base.source;
    var newFixedObject = $.extend({
                    'key': properties.key || baseObjectKey,
                    'scale': scale,
                    'fixed': true, 'base': base, 'x': coords[0], 'y': coords[1], 'z': coords[2],
                    'width': ifdefor(properties.width, ifdefor(base.width, ifdefor(imageSource.actualWidth, imageSource.width))) * scale,
                    'height': ifdefor(properties.height, ifdefor(base.height, ifdefor(imageSource.actualHeight, imageSource.height))) * scale,
                    'target': {
                        'width': imageSource.width * scale,
                        'height': imageSource.height * scale
                    },
                    'depth': ifdefor(properties.depth, ifdefor(base.depth, imageSource.depth)),
                    'isEnabled': base.isEnabled || isGuildObjectEnabled,
                    'action': properties.action || base.action,
                    'draw': properties.draw || base.draw || drawFixedObject,
                    'helpMethod': properties.helpMethod || fixedObjectHelpText
    }, base, properties || {});
    if (baseObjectKey === 'heroApplication') {
        allApplications.push(newFixedObject);
    }
    if (baseObjectKey === 'bed') {
        allBeds.push(newFixedObject);
    }
    return newFixedObject;
}
function fixedObjectHelpText(object) {
    return object.base.name && titleDiv(object.base.name);
}

function addFurnitureBonuses(furniture, recompute) {
    if (!furniture.getActiveBonusSources) return;
    var bonusSources = furniture.getActiveBonusSources();
    for (var bonusSource of bonusSources) {
        // Multiple copies of the same furniture will have the same bonus source, so this check is not valid.
        /*if (guildBonusSources.indexOf(bonusSource) >= 0) {
            console.log(bonusSource);
            console.log(guildBonusSources);
            throw new Error('bonus source was already present in guildBonusSources!');
        }*/
        guildBonusSources.push(bonusSource);
        addBonusSourceToObject(state.guildStats, bonusSource);
        for (var character of state.characters) {
            addBonusSourceToObject(character.adventurer, bonusSource);
        }
    }
    if (recompute) recomputeAllCharacterDirtyStats();
}
function removeFurnitureBonuses(furniture, recompute) {
    if (!furniture.getActiveBonusSources) return;
    var bonusSources = furniture.getActiveBonusSources();
    for (var bonusSource of bonusSources) {
        if (guildBonusSources.indexOf(bonusSource) < 0) {
            console.log(bonusSource);
            console.log(guildBonusSources);
            throw new Error('bonus source was not found in guildBonusSources!');
        }
        guildBonusSources.splice(guildBonusSources.indexOf(bonusSource), 1);
        removeBonusSourceFromObject(state.guildStats, bonusSource);
        for (var character of state.characters) {
            removeBonusSourceFromObject(character.adventurer, bonusSource);
        }
    }
    if (recompute) recomputeAllCharacterDirtyStats();
}

function addAllUnlockedFurnitureBonuses() {
    for (var areaKey in state.unlockedGuildAreas) addAreaFurnitureBonuses(guildAreas[areaKey]);
    recomputeAllCharacterDirtyStats();
}

function addAreaFurnitureBonuses(guildArea, recompute) {
    for (var object of guildArea.objects) addFurnitureBonuses(object, false);
    if (recompute) recomputeAllCharacterDirtyStats();
}
