
function initializeGuldArea(guildArea) {
    guildArea.isGuildArea = true;
    guildArea.allies = [];
    guildArea.enemies = [];
    guildArea.left = 0;
    guildArea.cameraX = 0;
    guildArea.time = 0;
    guildArea.projectiles = [];
    guildArea.effects = [];
    guildArea.textPopups = [];
    guildArea.treasurePopups = [];
    guildArea.objects = guildArea.objects || [];
    guildArea.objectsByKey = {};
    for (var object of guildArea.objects) {
        object.area = guildArea;
        guildArea.objectsByKey[object.key] = object;
    }
    guildArea.wallDecorations = guildArea.wallDecorations || [];
    for (var wallDecoration of guildArea.wallDecorations) {
        wallDecoration.area = guildArea;
    }
    guildArea.leftWallDecorations = guildArea.leftWallDecorations || [];
    for (var wallDecoration of guildArea.leftWallDecorations) {
        wallDecoration.area = guildArea;
    }
    guildArea.rightWallDecorations = guildArea.rightWallDecorations || [];
    for (var wallDecoration of guildArea.rightWallDecorations) {
        wallDecoration.area = guildArea;
    }
    return guildArea;
}
function spawner(spawner) {
    return spawner;
}
var wallZ = 180;
var guildAreas = {};
var guildFoyerFrontDoor = {'areaKey': 'guildFoyer', 'x': 120, 'z': 0};
var guildYardEntrance = {'areaKey': 'guildYard', 'x': 120, 'z': 0};
var allApplications = [];
var allBeds = [];
guildAreas.guildYard = initializeGuldArea({
    'key': 'guildYard',
    'width': 1000,
    'backgroundPatterns': {'0': 'forest'},
    'wallDecorations': [],
    'rightWallDecorations': [
        fixedObject('door', [970, 0, 0], {'exit': guildFoyerFrontDoor, 'scale': 2})
    ],
    'objects': [],
    'rightWall': 'oldGuild',
});
guildAreas.guildFoyer = initializeGuldArea({
    'key': 'guildFoyer',
    'width': 1000,
    'backgroundPatterns': {'0': 'oldGuild'},
    'wallDecorations': [
        fixedObject('heroApplication', [190, 50, wallZ]),
        fixedObject('heroApplication', [240, 50, wallZ]),
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
        fixedObject('coinStash', [450, 0, 165]),
        fixedObject('woodenAltar', [500, 0, 165], {'scale': 2}),
        fixedObject('animaOrb', [550, 0, 150], {'scale': 2}),
        fixedObject('trophyAltar', [600, 0, 0], {'scale': 2}),
        fixedObject('bed', [890, 0, 140], {'scale': 2, 'xScale': -1})
    ],
    'monsters': [
        {key: 'goblin', level: 1, location: [600, 0, 40]},
        {key: 'skeleton', level: 1, location: [880, 0, 0]},
    ],
    'leftWall': 'oldGuild',
    'rightWall': 'oldGuild',
});
guildAreas.guildFrontHall = initializeGuldArea({
    'key': 'guildFrontHall',
    'width': 1200,
    'backgroundPatterns': {'0': 'oldGuild'},
    'wallDecorations': [
        fixedObject('candles', [165, 50, wallZ], {'xScale': -1, 'scale': 1.5}),
        fixedObject('door', [250, 0, wallZ], {'exit': {'areaKey': 'guildGuestRoom', 'x': 400, 'z': 150}, 'scale': 2}),
        fixedObject('candles', [540, 70, wallZ], {'xScale': -1, 'scale': 1.5}),
        fixedObject('door', [600, 0, wallZ], {'exit': {'areaKey': 'guildKitchen', 'x': 150, 'z': 150}, 'scale': 2}),
        fixedObject('candles', [660, 70, wallZ], {'scale': 1.5}),
        fixedObject('candles', [1035, 50, wallZ], {'scale': 1.5}),
        fixedObject('downstairs', [800, 0, wallZ], {'exit': {'areaKey': 'guildBasement', 'x': 800, 'z': 150}, 'scale': 2}),
    ],
    'leftWallDecorations': [
        fixedObject('door', [30, 0, 0], {'exit': {'areaKey': 'guildFoyer', 'x': 880, 'z': 0}, 'scale': 2}),
    ],
    'objects': [
        fixedObject('jewelShrine', [120, 0, 150], {'scale': 2}),
        fixedObject('coinStash', [340, 0, 165], {'level': 1, 'key': 'coinStashA'}),
        fixedObject('coinStash', [400, 0, 165], {'level': 2, 'key': 'coinStashB'}),
        fixedObject('trophyAltar', [300, 0, 0], {'scale': 2, 'key': 'trophyAltarA'}),
        fixedObject('trophyAltar', [700, 0, 0], {'scale': 2, 'key': 'trophyAltarB'}),
    ],
    'leftWall': 'oldGuild',
    'rightWall': 'oldGuild',
});


guildAreas.guildGuestRoom = initializeGuldArea({
    'key': 'guildGuestRoom',
    'width': 800,
    'backgroundPatterns': {'0': 'oldGuild'},
    'wallDecorations': [
        fixedObject('candles', [340, 50, wallZ], {'xScale': -1, 'scale': 1.5}),
        fixedObject('candles', [460, 50, wallZ], {'scale': 1.5}),
        fixedObject('door', [400, 0, wallZ], {'exit': {'areaKey': 'guildFrontHall', 'x': 250, 'z': 150}, 'scale': 2}),
    ],
    'objects': [
        fixedObject('bed', [120, 0, 140], {'scale': 2, 'xScale': -1}),
        fixedObject('bed', [680, 0, 140], {'scale': 2, 'xScale': -1}),
        fixedObject('coinStash', [60, 0, -140], {'level': 1, 'key': 'coinStashA'}),
        fixedObject('coinStash', [740, 0, -140], {'level': 1, 'key': 'coinStashB'}),
    ],
    'leftWall': 'oldGuild',
    'rightWall': 'oldGuild',
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
    ],
    'leftWall': 'oldGuild',
    'rightWall': 'oldGuild',
});

guildAreas.guildBasement = initializeGuldArea({
    'key': 'guildBasement',
    'width': 1000,
    'backgroundPatterns': {'0': 'guildBasement'},
    'wallDecorations': [
        fixedObject('candles', [740, 50, wallZ], {'xScale': -1, 'scale': 1.5}),
        fixedObject('candles', [860, 50, wallZ], {'scale': 1.5}),
        fixedObject('upstairs', [800, 0, wallZ], {'exit': {'areaKey': 'guildFrontHall', 'x': 800, 'z': 150}, 'scale': 2}),
    ],
    'leftWallDecorations': [
        fixedObject('door', [30, 0, 0], {'exit': {'areaKey': 'guildVault', 'x': 600, 'z': 150}, 'scale': 2}),
    ],
    'objects': [
        fixedObject('trophyAltar', [600, 0, 0], {'scale': 2}),
    ],
    'leftWall': 'guildBasement',
    'rightWall': 'guildBasement',
});

guildAreas.guildVault = initializeGuldArea({
    'key': 'guildVault',
    'width': 800,
    'backgroundPatterns': {'0': 'guildBasement'},
    'wallDecorations': [
        fixedObject('candles', [215, 50, wallZ], {'xScale': -1, 'scale': 1.5}),
        fixedObject('candles', [585, 50, wallZ], {'scale': 1.5}),
    ],
    'rightWallDecorations': [
        fixedObject('door', [770, 0, 0], {'exit': {'areaKey': 'guildBasement', 'x': 120, 'z': 0}, 'scale': 2})
    ],
    'objects': [
        fixedObject('coinStash', [310, 0, -150], {'level': 1, 'key': 'coinStashA'}),
        fixedObject('coinStash', [310, 0, 150], {'level': 1, 'key': 'coinStashB'}),
        fixedObject('coinStash', [240, 0, -150], {'level': 1, 'key': 'coinStashC'}),
        fixedObject('coinStash', [240, 0, 150], {'level': 1, 'key': 'coinStashD'}),
        fixedObject('coinStash', [170, 0, -130], {'level': 2, 'key': 'coinStashE'}),
        fixedObject('coinStash', [170, 0, 130], {'level': 2, 'key': 'coinStashF'}),
        fixedObject('coinStash', [120, 0, -90], {'level': 3, 'key': 'coinStashH'}),
        fixedObject('coinStash', [120, 0, 90], {'level': 3, 'key': 'coinStashI'}),
        fixedObject('coinStash', [90, 0, 0], {'level': 4, 'key': 'coinStashJ'}),
    ],
    'leftWall': 'guildBasement',
    'rightWall': 'guildBasement',
});
var wallOriginCoords = [-71, 213];
var wallDepth = 120;
var wallHeight = 130;
var wallCanvas = createCanvas(wallDepth, wallHeight);
var wallContext = wallCanvas.getContext('2d');
//$('body').append(wallCanvas);
function drawRightWall(guildArea) {
    if (guildArea.cameraX + 800 < guildArea.width - 60) return;
    var source = {'left': 60, 'top': 20, 'width': 60, 'height': 130};
    var target = {'left': 0, 'top': 0, 'width': 60, 'height': 130};
    var background = backgrounds[guildArea.rightWall];
    drawWallBackground(wallContext, background);
    drawImage(wallContext, wallCanvas, target, $.extend({}, target, {'left': 60}));
    for (var decoration of guildArea.rightWallDecorations) {
        source = decoration.base.source;
        decoration.target = {
            'left': (wallDepth - (decoration.z + decoration.width) * wallDepth / 180) / 2,
            'top': wallHeight - decoration.y / 2 - decoration.height / 2,
            'width': decoration.width * wallDepth / 180, 'height': decoration.height / 2}
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
    var background = backgrounds[guildArea.leftWall];
    drawWallBackground(wallContext, background);
    drawImage(wallContext, wallCanvas, target, $.extend({}, target, {'left': 60}));
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

// This method is just used to draw the wall background for the left+right walls based on the first+last background patterns for the area.
function drawWallBackground(context, background) {
    for (section of background) {
        var parallax = ifdefor(section.parallax, 1);
        if (section.velocity || parallax !== 1) continue;
        var source = section.source;
        var sourceRectangle
        var target = rectangle(0, ifdefor(section.y, source.y) - 20,
            ifdefor(section.width, source.width), ifdefor(section.height, source.height)
        );
        context.save();
        context.globalAlpha = ifdefor(section.alpha, 1);
        drawImage(context, source.image, source, target);
        context.restore();
    }
}
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
function leaveCurrentArea(actor) {
    if (!actor.area) return;
    var allyIndex = actor.area.allies.indexOf(actor);
    if (allyIndex >= 0) actor.area.allies.splice(allyIndex, 1);
    actor.area = null;
}
function enterGuildArea(actor, door) {
    leaveCurrentArea(actor);
    var guildArea = guildAreas[door.areaKey];
    initializeActorForAdventure(actor);
    actor.area = guildArea;
    actor.x = door.x;
    actor.y = 0;
    actor.z = door.z;
    if (isNaN(actor.x) || isNaN(actor.z)) {
        debugger;
    }
    if (!guildArea.allies.length && !state.unlockedGuildAreas[guildArea.key]) {
        guildArea.enemies = [];
        for (var monsterData of (guildArea.monsters || [])) {
            var newMonster = makeMonster(monsterData.key, monsterData.level, [], 0);
            newMonster.heading = [-1, 0, 0]; // Monsters move right to left
            newMonster.x = monsterData.location[0];
            newMonster.y = monsterData.location[1];
            newMonster.z = monsterData.location[2];
            newMonster.area = guildArea;
            initializeActorForAdventure(newMonster);
            newMonster.time = 0;
            newMonster.allies = newMonster.area.enemies;
            newMonster.enemies = newMonster.area.allies;
            newMonster.allies.push(newMonster);
        }
    }
    guildArea.allies.push(actor);
    actor.allies = guildArea.allies;
    actor.enemies = guildArea.enemies;
    actor.activity = null;
    actor.actions.concat(actor.reactions).forEach(function (action) {
        action.readyAt = 0;
    });
    const character = actor.character;
    if (character) {
        character.context = 'guild'
        character.currentLevelKey = 'guild';
        character.guildAreaKey = guildArea.key;
        if (character === state.selectedCharacter) {
            guildArea.cameraX = Math.round(Math.max(guildArea.left, Math.min(guildArea.width - 800, actor.x - 400)));
            updateAdventureButtons();
            showContext('guild');
        }
    }
}

var guildBonusSources = [];