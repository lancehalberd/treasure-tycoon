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
$('.js-mouseContainer').on('mousedown', function (event) {
    var x = event.pageX - $('.js-mainCanvas').offset().left;
    var y = event.pageY - $('.js-mainCanvas').offset().top;
    if (!$(event.target).closest('.js-heroApplication').length) $('.js-heroApplication').hide();
    if (!isPointInRectObject(x, y, trophyRectangle)) choosingTrophyAltar = null;
});

/*
stoneAltar: (440, 161, 20, 30)
woodDoor: (675, 100, 26, 51)
*/
var areaObjects = {
    'mapTable': {'name': 'World Map', 'source': objectSource(guildImage, [360, 130], [60, 27, 30]), 'action': openWorldMap},
    'crackedOrb': {'name': 'Cracked Anima Orb', 'source': objectSource(guildImage, [260, 130], [18, 27, 15])},
    'crackedPot': {'name': 'Cracked Pot', 'source': objectSource(guildImage, [320, 130], [22, 28, 15])},
    'woodenAltar': {'name': 'Shrine of Fortune', 'source': objectSource(guildImage, [500, 131], [20, 30, 20]), 'action': openCrafting},
    'trophyAltar': {'name': 'Trophy Altar', 'source': objectSource(guildImage, [440, 131], [20, 30, 20]), 'action': openTrophySelection,
        'getTrophyRectangle': function () {
            return {'left': this.left + (this.width - this.trophy.width) / 2, 'top': this.top - this.trophy.height + 20, 'width': this.trophy.width, 'height': this.trophy.height};
        },
        'draw': function (area) {
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
            return this.name;
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
    guildArea.leftWallDecorations = guildArea.leftWallDecorations || [];
    guildArea.rightWallDecorations = guildArea.rightWallDecorations || [];
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
                    'helpMethod': properties.helpMethod || fixedObjectHelpText}, base, properties || {});
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
    if (canvasPopupTarget === this) drawOutlinedImage(mainContext, imageSource.image, '#fff', 2, imageSource, this);
    else drawImage(mainContext, imageSource.image, imageSource, this);
}
var guildAreas = {};
var guildFoyerFrontDoor = {'areaKey': 'guildFoyer', 'x': 120, 'z': 0};
var guildYardEntrance = {'areaKey': 'guildYard', 'x': 120, 'z': 0};
var allApplications = [
    fixedObject('heroApplication', [190, 50, wallZ]),
    fixedObject('heroApplication', [240, 50, wallZ])
];
var allBeds = [
    fixedObject('bed', [890, 0, 140], {'scale': 2, 'xScale': -1}),
    fixedObject('bed', [1090, 0, 140], {'scale': 2, 'xScale': -1}),
    fixedObject('bed', [1140, 0, -140], {'scale': 2, 'xScale': -1})
];
guildAreas.guildYard = initializeGuldArea({
    'key': 'guildYard',
    'width': 1000,
    'backgroundPatterns': {'0': 'forest'},
    'wallDecorations': [],
    'rightWallDecorations': [
        fixedObject('door', [970, 0, 0], {'exit': guildFoyerFrontDoor, 'scale': 2})
    ],
    'objects': [],
    'leftWall': null
});
guildAreas.guildFoyer = initializeGuldArea({
    'key': 'guildFoyer',
    'width': 1000,
    'backgroundPatterns': {'0': 'oldGuild'},
    'wallDecorations': [
        allApplications[0],
        allApplications[1],
        fixedObject('candles', [135, 50, wallZ], {'xScale': -1, 'scale': 1.5}),
        fixedObject('candles', [440, 70, wallZ], {'xScale': -1, 'scale': 1.5}),
        fixedObject('candles', [560, 70, wallZ], {'scale': 1.5}),
        fixedObject('candles', [835, 50, wallZ], {'scale': 1.5}),
    ],
    'leftWallDecorations': [
        fixedObject('door', [30, 0, 0], {'exit': {'areaKey': 'guildYard', 'x': 880, 'z': 0}, 'scale': 2}),
    ],
    'rightWallDecorations': [
        fixedObject('door', [970, 0, 0], {'exit': {'areaKey': 'guildFrontHall', 'x': 120, 'z': 0}, 'scale': 2})
    ],
    'objects': [
        fixedObject('mapTable', [250, 0, 90], {'scale': 2}),
        fixedObject('crackedPot', [455, 0, 150], {'scale': 2}),
        fixedObject('woodenAltar', [500, 0, 150], {'scale': 2}),
        fixedObject('crackedOrb', [545, 0, 150], {'scale': 2}),
        fixedObject('trophyAltar', [600, 0, 0], {'scale': 2}),
        allBeds[0]
    ],
    'level': 1,
    'waves': [
        ['goblin', 'goblin', 'goblin'],
        ['skeleton', 'skeleton']
    ]
});
guildAreas.guildFrontHall = initializeGuldArea({
    'key': 'guildFrontHall',
    'width': 1200,
    'backgroundPatterns': {'0': 'oldGuild'},
    'wallDecorations': [
        fixedObject('candles', [165, 50, wallZ], {'xScale': -1, 'scale': 1.5}),
        fixedObject('candles', [540, 70, wallZ], {'xScale': -1, 'scale': 1.5}),
        fixedObject('candles', [660, 70, wallZ], {'scale': 1.5}),
        fixedObject('candles', [1035, 50, wallZ], {'scale': 1.5}),
        fixedObject('door', [600, 0, wallZ], {'exit': {'areaKey': 'guildKitchen', 'x': 150, 'z': 150}, 'scale': 2}),
    ],
    'leftWallDecorations': [
        fixedObject('door', [30, 0, 0], {'exit': {'areaKey': 'guildFoyer', 'x': 880, 'z': 0}, 'scale': 2}),
    ],
    'objects': [
        fixedObject('jewelShrine', [120, 0, 150], {'scale': 6}),
        fixedObject('crackedPot', [350, 0, 150], {'scale': 2}),
        fixedObject('crackedPot', [400, 0, 150], {'scale': 2}),
        fixedObject('trophyAltar', [300, 0, 0], {'scale': 2}),
        fixedObject('trophyAltar', [700, 0, 0], {'scale': 2}),
        allBeds[1],
        allBeds[2]
    ]
});

guildAreas.guildKitchen = initializeGuldArea({
    'key': 'guildKitchen',
    'width': 1200,
    'backgroundPatterns': {'0': 'oldGuild'},
    'wallDecorations': [
        fixedObject('candles', [215, 50, wallZ], {'xScale': -1, 'scale': 1.5}),
        fixedObject('candles', [835, 50, wallZ], {'scale': 1.5}),
        fixedObject('door', [150, 0, wallZ], {'exit': {'areaKey': 'guildFrontHall', 'x': 600, 'z': 150}, 'scale': 2}),
    ],
    'leftWallDecorations': [
    ],
    'objects': [
        fixedObject('trophyAltar', [600, 0, 0], {'scale': 2}),
    ]
});
var wallOriginCoords = [-71, 213];
var wallDepth = 120;
var wallHeight = 130;
var wallCanvas = createCanvas(wallDepth, wallHeight);
var wallContext = wallCanvas.getContext('2d');
// $('body').append(wallCanvas);
function drawRightWall(guildArea) {
    if (guildArea.cameraX + 800 < guildArea.width - 60) return;
    var source = {'left': 60, 'top': 20, 'width': 60, 'height': 130};
    var target = {'left': 0, 'top': 0, 'width': 60, 'height': 130};
    drawImage(wallContext, requireImage('gfx/guildhall.png'), source, target);
    drawImage(wallContext, requireImage('gfx/guildhall.png'), source, $.extend(target, {'left': 60}));
    for (var decoration of guildArea.rightWallDecorations) {
        source = decoration.base.source;
        decoration.target = {'left': (wallDepth - (decoration.z + decoration.width) * wallDepth / 180) / 2, 'top': wallHeight - decoration.y / 2 - decoration.height / 2, 'width': decoration.width * wallDepth / 180, 'height': decoration.height / 2}
        if (decoration === canvasPopupTarget) drawOutlinedImage(wallContext, source.image, '#fff', 2, source, decoration.target);
        else drawImage(wallContext, source.image, source, decoration.target);
    }
    if (wallMouseCoords) {
        wallContext.fillStyle = 'red';
        wallContext.fillRect(wallMouseCoords[0] - 1, wallMouseCoords[1] - 1, 2, 2);
    }
    wallContext.save();
    wallContext.fillStyle = 'black';
    wallContext.globalAlpha = .5;
    wallContext.fillRect(0, 0, 5, 130);
    wallContext.fillRect(175, 0, 5, 130);
    wallContext.restore();
    var xOffset = guildArea.width - guildArea.cameraX;
    var rows = 5; cols = 3;
    for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
            var TL = projectRightWallCoords(xOffset, 260 * row / rows, 180 - 360 * col / cols);
            var TR = projectRightWallCoords(xOffset, 260 * row / rows, 180 - 360 * (col + 1) / cols);
            var BR = projectRightWallCoords(xOffset, 260 * (row + 1) / rows, 180 - 360 * (col + 1) / cols);
            var BL = projectRightWallCoords(xOffset, 260 * (row + 1) / rows, 180 - 360 * col / cols);
            textureMap(mainContext, wallCanvas, [TL,TR,BL], 0);
            textureMap(mainContext, wallCanvas, [BL,TR,BR], 0);
            textureMap(mainContext, wallCanvas, [TL,TR,BR], 0);
            textureMap(mainContext, wallCanvas, [BL,TL,BR], 0);
        }
    }
}
function drawLeftWall(guildArea) {
    if (guildArea.cameraX > 60) return;
    var source = {'left': 60, 'top': 20, 'width': 60, 'height': 130};
    var target = {'left': 0, 'top': 0, 'width': 60, 'height': 130};
    drawImage(wallContext, requireImage('gfx/guildhall.png'), source, target);
    drawImage(wallContext, requireImage('gfx/guildhall.png'), source, $.extend(target, {'left': 60}));
    wallContext.save();
    wallContext.fillStyle = 'black';
    //wallContext.fillRect(0, 0, wallDepth, wallHeight);
    wallContext.globalAlpha = .5;
    wallContext.fillRect(0, 0, 5, wallHeight);
    wallContext.fillRect(175, 0, 5, wallHeight);
    wallContext.restore();
    for (var decoration of guildArea.leftWallDecorations) {
        source = decoration.base.source;
        decoration.target = {'left': (wallDepth - (decoration.z + decoration.width) * wallDepth / 180) / 2, 'top': wallHeight - decoration.y / 2 - decoration.height / 2, 'width': decoration.width * wallDepth / 180, 'height': decoration.height / 2}
        if (decoration === canvasPopupTarget) drawOutlinedImage(wallContext, source.image, '#fff', 2, source, decoration.target);
        else drawImage(wallContext, source.image, source, decoration.target);
    }
    if (wallMouseCoords) {
        wallContext.fillStyle = 'red';
        wallContext.fillRect(wallMouseCoords[0] - 1, wallMouseCoords[1] - 1, 2, 2);
    }
    var rows = 5; cols = 3;
    for (var row = 0; row < rows; row++) {
        for (var col = 0; col < cols; col++) {
            var TL = projectLeftWallCoords(-guildArea.cameraX, 260 * row / rows, 180 - 360 * col / cols);
            var TR = projectLeftWallCoords(-guildArea.cameraX, 260 * row / rows, 180 - 360 * (col + 1) / cols);
            var BR = projectLeftWallCoords(-guildArea.cameraX, 260 * (row + 1) / rows, 180 - 360 * (col + 1) / cols);
            var BL = projectLeftWallCoords(-guildArea.cameraX, 260 * (row + 1) / rows, 180 - 360 * col / cols);
            textureMap(mainContext, wallCanvas, [TL,TR,BL], 0);
            textureMap(mainContext, wallCanvas, [BL,TR,BR], 0);
            textureMap(mainContext, wallCanvas, [TL,TR,BR], 0);
            textureMap(mainContext, wallCanvas, [BL,TL,BR], 0);
        }
    }
}
/*function drawRightWallRectangle(guildArea, color, y, z, height, depth) {
    var offset = guildArea.width - guildArea.cameraX;
    A = projectWallCoords(y + height, z + depth / 2);
    B = projectWallCoords(y + height, z - depth / 2);
    C = projectWallCoords(y, z - depth / 2);
    D = projectWallCoords(y, z + depth / 2);
    mainContext.fillStyle = color;
    mainContext.beginPath();
    mainContext.moveTo(A[0] + offset, A[1]);
    mainContext.lineTo(B[0] + offset, B[1]);
    mainContext.lineTo(C[0] + offset, C[1]);
    mainContext.lineTo(D[0] + offset, D[1]);
    mainContext.closePath();
    mainContext.fill();
}*/
function projectLeftWallCoords(xOffset, y, z) {
    var slope = (y - wallOriginCoords[1]) / (0 - wallOriginCoords[0]);
    var u = 30 + z * 30 / 180;
    var v = 300 - wallOriginCoords[1] - slope * (60 - u - wallOriginCoords[0]);
    return {'x': u + xOffset, 'y': v, 'u': 60 - z / 3, 'v': 130 - y / 2};
}
function unprojectLeftWallCoords(area, left, top) {
    var vanishingPoint = [60 - wallOriginCoords[0], 300 - wallOriginCoords[1]];
    var mousePoint = [left + area.cameraX, top];
    var slope = (mousePoint[1] - vanishingPoint[1]) / (mousePoint[0] - vanishingPoint[0]);
    var x = (60 - mousePoint[0]) * wallDepth / 60;
    var y = wallHeight - (wallOriginCoords[1] - slope * wallOriginCoords[0]) * wallHeight / 260;
    //console.log([vanishingPoint.join(','), mousePoint.join(','), slope, x, y]);
    return [x, y];
}
function projectRightWallCoords(xOffset, y, z) {
    var slope = (y - wallOriginCoords[1]) / (0 - wallOriginCoords[0]);
    var u = -30 - z * 30 / 180;
    var v = 300 - wallOriginCoords[1] - slope * (60 + u - wallOriginCoords[0]);
    return {'x': u + xOffset, 'y': v, 'u': 60 - z / 3, 'v': 130 - y / 2};
}
function unprojectRightWallCoords(area, left, top) {
    var vanishingPoint = [area.width - 60 + wallOriginCoords[0], 300 - wallOriginCoords[1]];
    var mousePoint = [left + area.cameraX, top];
    var slope = (mousePoint[1] - vanishingPoint[1]) / (mousePoint[0] - vanishingPoint[0]);
    var x = (mousePoint[0] - (area.width - 60))  * wallDepth / 60;
    var y = wallHeight - (wallOriginCoords[1] + slope * wallOriginCoords[0]) * wallHeight / 260;
    //console.log([vanishingPoint.join(','), mousePoint.join(','), slope, x, y]);
    return [x, y];
}
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
    if (guildArea.leftWall) {
        //guildArea.leftWall.draw(guildArea);
        drawLeftWall(guildArea)
    }
    if (guildArea.rightWall) {
        //guildArea.rightWall.draw(guildArea);
        drawRightWall(guildArea);
    }
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