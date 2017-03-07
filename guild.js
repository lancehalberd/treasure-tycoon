var guildImage = requireImage('gfx/guildhall.png');
function objectSource(image, coords, size) {
    return {'image': image, 'left': coords[0], 'top': coords[1],
            'width': size[0], 'height': size[1], 'depth': size[2]};
}
function openWorldMap(actor) {
    setContext('map');
}
function openCrafting(actor) {
    setContext('item');
}
function useDoor(actor) {
    enterGuildArea(actor.character, this.exit);
}
function showApplication(actor) {
    setHeroApplication($('.js-heroApplication'), this);
    $('.js-heroApplication').show();
}
$('.js-mouseContainer').on('mousedown', function (event) {
    if (!$(event.target).closest('.js-heroApplication').length) $('.js-heroApplication').hide();
});
var areaObjects = {
    'mapTable': {'name': 'World Map', 'source': objectSource(guildImage, [360, 120], [120, 50, 60]), 'action': openWorldMap},
    'crackedOrb': {'name': 'Cracked Anima Orb', 'source': objectSource(guildImage, [240, 100], [60, 60, 30])},
    'crackedPot': {'name': 'Cracked Pot', 'source': objectSource(guildImage, [300, 100], [60, 60, 30])},
    'woodenShrine': {'name': 'Shrine of Fortune', 'source': objectSource(guildImage, [540, 100], [60, 70, 40]), 'action': openCrafting},
    'candles': {'source': objectSource(guildImage, [240, 30], [60, 70, 0])},

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
    'door': {'source': objectSource(guildImage, [660, 90], [60, 120, 90]), 'action': useDoor},

    'skillShrine': {'name': 'Shrine of Divinity', 'source': objectSource(requireImage('gfx/militaryIcons.png'), [102, 125], [16, 16, 4]), 'action': activateShrine},
    'closedChest': {'name': 'Treasure Chest', 'source': objectSource(requireImage('gfx/treasureChest.png'), [0, 0], [64, 64, 64]), 'action': openChest},
    'openChest': {'name': 'Opened Treasure Chest', 'source': objectSource(requireImage('gfx/treasureChest.png'), [64, 0], [64, 64, 64]), 'action': function (actor) {
        messageCharacter(actor.character, 'Empty');
    }},
}
var wallZ = 180;
function initializeGuldArea(guildArea) {
    guildArea.isGuildArea = true;
    guildArea.allies = [];
    guildArea.enemies = [];
    guildArea.left = 0;
    guildArea.cameraX = 0;
    guildArea.time = 0;
    guildArea.textPopups = [];
    guildArea.treasurePopups = [];
    guildArea.objects = guildArea.objects || [];
    for (var object of guildArea.objects) {
        object.area = guildArea;
    }
    guildArea.wallDecorations = guildArea.wallDecorations || [];
    for (var wallDecoration of guildArea.wallDecorations) {
        wallDecoration.area = guildArea;
    }
    guildArea.leftWall = ifdefor(guildArea.leftWall, fixedObject('wall', [10, 0, 15], {'scale': 2.2, 'xScale': -1}));
    guildArea.rightWall = ifdefor(guildArea.rightWall, fixedObject('wall', [guildArea.width - 10, 0, 15], {'scale': 2.2}));
    return guildArea;
}
function fixedObject(objectKey, coords, properties) {
    properties = ifdefor(properties, {});
    var scale = ifdefor(properties.scale, 1);
    var base = areaObjects[objectKey];
    var imageSource = base.source;
    return $.extend({'key': objectKey, 'fixed': true, 'base': areaObjects[objectKey], 'x': coords[0], 'y': coords[1], 'z': coords[2],
                    'width': imageSource.width * scale, 'height': imageSource.height * scale, 'depth': imageSource.depth * scale,
                    'action': properties.action || base.action,
                    'draw': properties.draw || base.draw || drawFixedObject,
                    'helpMethod': properties.helpMethod || fixedObjectHelpText}, properties || {});
}
function fixedObjectHelpText(object) {
    return object.base.name;
}
function drawFixedObject(area) {
    var imageSource = areaObjects[this.key].source;
    // Calculate the left/top values from x/y/z coords, which drawImage will use.
    this.left = this.x - this.width / 2 - area.cameraX;
    // The object height is shorter than the image height because the image height includes height from depicting the depth of the object.
    var objectHeight = this.height - this.depth / 2;
    this.top = groundY - this.y - objectHeight - (this.z + this.depth / 2) / 2;
    /*if (this.y === 0) {
        mainContext.fillStyle = '#f0f';
        mainContext.fillRect(this.left, this.top, this.width, this.height);
        mainContext.fillStyle = '#00f';
        mainContext.fillRect(this.left, groundY - this.y - objectHeight - (this.z + this.depth / 2) / 2, this.width, this.depth / 2);
    }*/
    if (canvasPopupTarget === this) drawOutlinedImage(mainContext, imageSource.image, '#fff', 2, imageSource, this)
    else drawImage(mainContext, imageSource.image, imageSource, this);
}
var guildAreas = {};
var guildFoyerFrontDoor = {'areaKey': 'guildFoyer', 'x': 120, 'z': 0};
var allApplications = [
    fixedObject('heroApplication', [190, 50, wallZ]),
    fixedObject('heroApplication', [240, 50, wallZ])
];
guildAreas.guildYard = initializeGuldArea({
    'key': 'guildYard',
    'width': 1000,
    'backgroundPatterns': {'0': 'forest'},
    'wallDecorations': [],
    'objects': [
        fixedObject('door', [1000, 0, 0], {'scale': 2, 'exit': guildFoyerFrontDoor})
    ],
    'leftWall': null
});
guildAreas.guildFoyer = initializeGuldArea({
    'key': 'guildFoyer',
    'width': 1000,
    'backgroundPatterns': {'0': 'oldGuild'},
    'wallDecorations': [
        allApplications[0],
        allApplications[1],
        fixedObject('candles', [140, 50, wallZ], {'xScale': -1}),
        fixedObject('candles', [440, 70, wallZ], {'xScale': -1}),
        fixedObject('candles', [560, 70, wallZ]),
        fixedObject('candles', [860, 50, wallZ]),
    ],
    'objects': [
        fixedObject('mapTable', [250, 0, 90]),
        fixedObject('crackedPot', [455, 0, 150]),
        fixedObject('woodenShrine', [500, 0, 150]),
        fixedObject('crackedOrb', [545, 0, 150]),
        fixedObject('door', [0, 0, 0], {'scale': 2, 'xScale': -1, 'exit': {'areaKey': 'guildYard', 'x': 900, 'z': 0}}),
        fixedObject('door', [1000, 0, 0], {'scale': 2, 'exit': {'areaKey': 'guildFrontHall', 'x': 120, 'z': 0}})
    ]
});
guildAreas.guildFrontHall = initializeGuldArea({
    'key': 'guildFrontHall',
    'width': 1000,
    'backgroundPatterns': {'0': 'oldGuild'},
    'wallDecorations': [
        fixedObject('candles', [165, 50, wallZ], {'xScale': -1}),
        fixedObject('candles', [440, 70, wallZ], {'xScale': -1}),
        fixedObject('candles', [560, 70, wallZ]),
        fixedObject('candles', [835, 50, wallZ]),
    ],
    'objects': [
        fixedObject('door', [0, 0, 0], {'scale': 2, 'xScale': -1, 'exit': {'areaKey': 'guildFoyer', 'x': 900, 'z': 0}}),
    ]
});
function leaveCurrentArea(character) {
    if (!character.area) return;
    var allyIndex = character.area.allies.indexOf(character.adventurer);
    if (allyIndex >= 0) character.area.allies.splice(allyIndex, 1);
    character.area = null;
}
function enterGuildArea(character, door) {
    leaveCurrentArea(character);
    character.context = 'guild'
    character.currentLevelKey = 'guild';
    character.guildAreaKey = door.areaKey;
    var guildArea = guildAreas[door.areaKey];
    initializeActorForAdventure(character.adventurer);
    var hero = character.adventurer;
    hero.area = character.area = guildArea;
    hero.x = door.x;
    hero.y = 0;
    hero.z = door.z;
    guildArea.allies.push(hero);
    character.allies = hero.allies = guildArea.allies;
    character.enemies = hero.enemies = guildArea.enemies;
    character.objects = guildArea.objects;
    hero.activity = null;
    hero.actions.concat(hero.reactions).forEach(function (action) {
        action.readyAt = 0;
    });
    if (state.selectedCharacter === character) {
        guildArea.cameraX = Math.max(guildArea.left, Math.min(guildArea.width - 800, hero.x - 400));
        updateAdventureButtons();
        showContext('guild');
    }
}

function guildAreaLoop(guildArea) {
    var everybody = guildArea.allies.concat(guildArea.enemies);
    for (var object of guildArea.objects) if (object.updated) object.update(guildArea);
    everybody.forEach(moveActor);
    for (var i = 0; i < guildArea.treasurePopups.length; i++) {
        guildArea.treasurePopups[i].update(guildArea);
        if (guildArea.treasurePopups[i].done) {
            guildArea.treasurePopups.splice(i--, 1);
        }
    }
    for (var i = 0; i < guildArea.textPopups.length; i++) {
        var textPopup = guildArea.textPopups[i];
        textPopup.y += ifdefor(textPopup.vy, -1);
        textPopup.x += ifdefor(textPopup.vx, 0);
        textPopup.duration = ifdefor(textPopup.duration, 35);
        textPopup.vy += ifdefor(textPopup.gravity, -.5);
        if (textPopup.duration-- < 0) {
            guildArea.textPopups.splice(i--, 1);
        }
    }
    everybody.forEach(function (actor) {
        // Since damage can be dealt at various points in the frame, it is difficult to pin point what damage was dealt
        // since the last action check. To this end, we keep track of their health over the last five frames and use
        // these values to determine how much damage has accrued recently for abilities that trigger when a character
        // is in danger.
        capHealth(actor);
        // This updates the text displayed to the user if they are currently viewing the help text for the actor.
        updateActorHelpText(actor);
        if ((actor.time * 1000) % 100 < 20) {
            if (!actor.healthValues) {
                actor.healthValues = [];
            }
            actor.healthValues.unshift(actor.health);
            while (actor.healthValues.length > 10) {
                actor.healthValues.pop();
            }
        }
    });
    everybody.forEach(updateActorDimensions);
    everybody.forEach(updateActorAnimationFrame);
}

function drawGuildArea(guildArea) {
    mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    for (var xOffset in guildArea.backgroundPatterns) {
        xOffset = parseInt(xOffset);
        if (xOffset < guildArea.cameraX) {
            //code
        }
        var backgroundKey = guildArea.backgroundPatterns[xOffset];
        var background = backgrounds[backgroundKey];
        var tileWidth = 120;
        var fullDrawingWidth = Math.ceil(mainCanvas.width / tileWidth) * tileWidth + tileWidth;
        background.forEach(function(section) {
            var source = section.source;
            var y = ifdefor(section.y, source.y) * 2;
            var height = ifdefor(section.height, source.height) * 2;
            var width = ifdefor(section.width, source.width) * 2;
            var parallax = ifdefor(section.parallax, 1);
            var spacing = ifdefor(section.spacing, 1);
            var velocity = ifdefor(section.velocity, 0);
            var alpha = ifdefor(section.alpha, 1);
            mainContext.globalAlpha = alpha;
            for (var i = 0; i <= fullDrawingWidth; i += tileWidth * spacing) {
                var x = Math.round((fullDrawingWidth + (i - (guildArea.cameraX - guildArea.time * velocity) * parallax) % fullDrawingWidth) % fullDrawingWidth - tileWidth);
                var realX = guildArea.cameraX + x;
                if (realX + tileWidth < xOffset) continue;
                mainContext.drawImage(source.image, source.x, source.y, source.width, source.height,
                                      x, y, width, height);
                if (x !== Math.round(x) || y !== Math.round(y) || width != Math.round(width) || height != Math.round(height)) {
                    console.log(JSON.stringify([[source.x, x], [source.y, source.z, y], width, height]));
                }
            }
            mainContext.globalAlpha = 1;
        });
    }
    if (guildArea.leftWall) guildArea.leftWall.draw(guildArea);
    if (guildArea.rightWall) guildArea.rightWall.draw(guildArea);
    for (var object of guildArea.wallDecorations) {
        object.draw(guildArea);
    }
    guildArea.time += frameMilliseconds / 1000;
    var sortedSprites = guildArea.allies.concat(guildArea.enemies).concat(guildArea.objects).sort(function (spriteA, spriteB) {
        return spriteB.z - spriteA.z;
    });
    for (var sprite of sortedSprites) {
        if (sprite.draw) sprite.draw(guildArea);
        else drawActor(sprite);
    }
    for (var treasurePopup of ifdefor(guildArea.treasurePopups, [])) treasurePopup.draw(guildArea);
    for (var projectile of ifdefor(guildArea.projectiles, [])) projectile.draw(guildArea);
    for (var effect of ifdefor(guildArea.effects, [])) effect.draw(guildArea);
    // Draw text popups such as damage dealt, item points gained, and so on.
    for (var textPopup of ifdefor(guildArea.textPopups, [])) {
        mainContext.fillStyle = ifdefor(textPopup.color, "red");
        var scale = Math.max(0, Math.min(1.5, ifdefor(textPopup.duration, 0) / 10));
        mainContext.font = Math.round(scale * ifdefor(textPopup.fontSize, 20)) + 'px sans-serif';
        mainContext.textAlign = 'center'
        mainContext.fillText(textPopup.value, textPopup.x - guildArea.cameraX, groundY - textPopup.y - textPopup.z / 2);
    }
}