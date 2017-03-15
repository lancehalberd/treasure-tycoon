var guildImage = requireImage('gfx/guildhall.png');
function objectSource(image, coords, size) {
    return {'image': image, 'left': coords[0], 'top': coords[1],
            'width': size[0], 'height': size[1], 'depth': ifdefor(size[2], size[0])};
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
    enterGuildArea(actor.character, this.exit);
}
function showApplication(actor) {
    setHeroApplication($('.js-heroApplication'), this);
    $('.js-heroApplication').show();
}
function openTrophySelection(actor) {
    removeToolTip();
    choosingTrophyAltar = this;
}
function openCoinStashUpgrade(actor) {

}
$('.js-mouseContainer').on('mousedown', function (event) {
    var x = event.pageX - $('.js-mainCanvas').offset().left;
    var y = event.pageY - $('.js-mainCanvas').offset().top;
    if (!$(event.target).closest('.js-heroApplication').length) $('.js-heroApplication').hide();
    if (!isPointInRectObject(x, y, trophyRectangle)) choosingTrophyAltar = null;
});

var coinStashTiers = [
    {'name': 'Cracked Pot', 'guildBonuses': {'+maxCoins': 500}, 'upgradeCost': 500, 'source': objectSource(guildImage, [316, 130], [30, 30])},
    {'name': 'Large Jar', 'guildBonuses': {'+maxCoins': 4000}, 'upgradeCost': 10000, 'source': objectSource(guildImage, [316, 130], [30, 30])},
    {'name': 'Piggy Bank', 'guildBonuses': {'+maxCoins': 30000}, 'upgradeCost': 10000, 'requires': 'workshop', 'source': objectSource(guildImage, [316, 130], [30, 30])},
    {'name': 'Chest', 'guildBonuses': {'+maxCoins': 200000}, 'upgradeCost': 150000, 'requires': 'workshop', 'source': objectSource(requireImage('gfx/chest-closed.png'), [0, 0], [32, 32])},
    {'name': 'Safe', 'guildBonuses': {'+maxCoins': 1e6}, 'upgradeCost': 1.5e6, 'requires': 'magicWorkshop', 'source': objectSource(requireImage('gfx/chest-open.png'), [0, 0], [32, 32])},
    {'name': 'Bag of Holding', 'guildBonuses': {'+maxCoins': 30e6}, 'upgradeCost': 10e6, 'requires': 'magicWorkshop', 'source': objectSource(guildImage, [316, 130], [30, 30])},
    {'name': 'Safe of Holding', 'guildBonuses': {'+maxCoins': 500e6}, 'upgradeCost': 500e6, 'requires': 'magicWorkshop', 'source': objectSource(requireImage('gfx/chest-closed.png'), [0, 0], [32, 32])},
    {'name': 'Safe of Hoarding', 'guildBonuses': {'+maxCoins': 10e9}, 'source': objectSource(requireImage('gfx/chest-open.png'), [0, 0], [32, 32])},
];

var areaObjects = {
    'mapTable': {'name': 'World Map', 'source': objectSource(guildImage, [360, 130], [60, 27, 30]), 'action': openWorldMap},
    'crackedOrb': {'name': 'Cracked Anima Orb', 'source': objectSource(guildImage, [260, 130], [18, 27, 15])},
    'crackedPot': {'name': 'Cracked Pot', 'source': objectSource(guildImage, [320, 130], [22, 28, 15])},
    'coinStash': {'action': openCoinStashUpgrade, 'level': 1, 'source': coinStashTiers[0].source,
        'width': 60, 'height': 60, 'depth': 60,
        'draw': function (area) {
            var coinStashTier = coinStashTiers[this.level - 1];
            this.source = coinStashTier.source;
            // Make this coin stash flash if it can be upgraded.
            this.flashColor = (coinStashTier.upgradeCost && state.coins >= coinStashTier.upgradeCost) ? 'white' : null;
            drawFixedObject.call(this, area);
        },
        'helpMethod': function (object) {
            var coinStashTier = coinStashTiers[this.level - 1];
            return coinStashTier.name;
    }},
    'woodenAltar': {'name': 'Shrine of Fortune', 'source': objectSource(guildImage, [500, 131], [20, 30, 20]), 'action': openCrafting},
    'trophyAltar': {'name': 'Trophy Altar', 'source': objectSource(guildImage, [440, 131], [20, 30, 20]), 'action': openTrophySelection,
        'getTrophyRectangle': function () {
            return {'left': this.left + (this.width - this.trophy.width) / 2, 'top': this.top - this.trophy.height + 20, 'width': this.trophy.width, 'height': this.trophy.height};
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
            return isPointInRectObject(x, y, this) || (this.trophy && isPointInRectObject(x,y, this.getTrophyRectangle()));
        },
        'helpMethod': function (object) {
            if (this.trophy) return this.trophy.helpMethod();
            return null;
        }
    },
    'candles': {'source': objectSource(guildImage, [260, 98-40], [25, 40, 0])},
    'bed': {'name': 'Worn Cot', 'source': objectSource(guildImage, [541, 160-24], [58, 24, 30])},
    'jewelShrine': {'name': 'Shrine of Creation', 'source': objectSource(requireImage('gfx/militaryIcons.png'), [102, 125], [16, 16, 4]), 'action': openJewels},

    'heroApplication': {'name': 'Application', 'source': {'width': 40, 'height': 60, 'depth': 0}, 'action': showApplication, 'draw': function (area) {
        this.left = this.x - this.width / 2 - area.cameraX;
        this.top = groundY - this.y - this.height - this.z / 2;
        if (canvasPopupTarget === this) {
            mainContext.fillStyle = 'white';
            mainContext.fillRect(this.left - 2, this.top - 2, this.width + 4, this.height + 4);
        }
        mainContext.fillStyle = '#fc8';
        mainContext.fillRect(this.left, this.top, this.width, this.height);
        if (!this.character) {
            this.character = createNewHeroApplicant();
        }
        var jobSource = this.character.adventurer.job.iconSource;
        mainContext.save();
        mainContext.globalAlpha = .6;
        drawImage(mainContext, jobSource.image, jobSource, {'left': this.left + 4, 'top': this.top + 14, 'width': 32, 'height': 32});
        mainContext.restore();
    }},

    'wall': {'source': objectSource(guildImage, [600, 0], [60, 240, 180])},
    'door': {'source': objectSource(guildImage, [675, 99], [27, 51, 0]), 'action': useDoor},

    'skillShrine': {'name': 'Shrine of Divinity', 'source': objectSource(requireImage('gfx/militaryIcons.png'), [102, 125], [16, 16, 4]), 'action': activateShrine},
    'closedChest': {'name': 'Treasure Chest', 'source': objectSource(requireImage('gfx/treasureChest.png'), [0, 0], [64, 64, 64]), 'action': openChest},
    'openChest': {'name': 'Opened Treasure Chest', 'source': objectSource(requireImage('gfx/treasureChest.png'), [64, 0], [64, 64, 64]), 'action': function (actor) {
        messageCharacter(actor.character, 'Empty');
    }},
}

function drawFixedObject(area) {
    var imageSource = this.source;
    // Calculate the left/top values from x/y/z coords, which drawImage will use.
    this.left = this.x - this.width / 2 - area.cameraX;
    // The object height is shorter than the image height because the image height includes height from depicting the depth of the object.
    var objectHeight = this.height - this.depth / 2;
    this.top = groundY - this.y - objectHeight - (this.z + this.depth / 2) / 2;
    if (canvasPopupTarget === this) drawOutlinedImage(mainContext, imageSource.image, '#fff', 2, imageSource, this);
    else if (this.flashColor) drawTintedImage(mainContext, imageSource.image, this.flashColor, .5 + .2 * Math.sin(now() / 150), imageSource, this);
    else drawImage(mainContext, imageSource.image, imageSource, this);
}

function fixedObject(baseObjectKey, coords, properties) {
    properties = ifdefor(properties, {});
    var scale = ifdefor(properties.scale, 1);
    var base = areaObjects[baseObjectKey];
    var imageSource = base.source;
    var newFixedObject = $.extend({'key': properties.key || baseObjectKey, 'fixed': true, 'base': base, 'x': coords[0], 'y': coords[1], 'z': coords[2],
                    'width': ifdefor(properties.width, ifdefor(base.width, imageSource.width * scale)),
                    'height': ifdefor(properties.height, ifdefor(base.height, imageSource.height * scale)),
                    'depth': ifdefor(properties.depth, ifdefor(base.depth, imageSource.depth * scale)),
                    'action': properties.action || base.action,
                    'draw': properties.draw || base.draw || drawFixedObject,
                    'helpMethod': properties.helpMethod || fixedObjectHelpText}, base, properties || {});
    if (baseObjectKey === 'heroApplication') {
        allApplications.push(newFixedObject);
    }
    if (baseObjectKey === 'bed') {
        allBeds.push(newFixedObject);
    }
    return newFixedObject;
}
function fixedObjectHelpText(object) {
    return object.base.name;
}
