var guildImage = requireImage('gfx/guildhall.png');
function objectSource(image, coords, size) {
    return {'image': image, 'left': coords[0], 'top': coords[1],
            'width': size[0], 'height': size[1], 'depth': size[2]};
}
var areaObjects = {
    'mapTable': {'name': 'World Map', 'source': objectSource(guildImage, [360, 120], [120, 50, 60])},
    'crackedOrb': {'name': 'Cracked Anima Orb', 'source': objectSource(guildImage, [240, 100], [60, 60, 30])},
    'crackedPot': {'name': 'Cracked Pot', 'source': objectSource(guildImage, [300, 100], [60, 60, 30])},
    'woodenShrine': {'name': 'Shrine of Fortune', 'source': objectSource(guildImage, [540, 100], [60, 70, 40])},
    'candles': {'source': objectSource(guildImage, [240, 30], [60, 70, 0])}
}
var wallZ = 180;
function initializeGuldArea(guildArea) {
    guildArea.isGuildArea = true;
    guildArea.allies = [];
    guildArea.enemies = [];
    guildArea.cameraX = 0;
    guildArea.time = 0;
    guildArea.textPopups = [];
    guildArea.treasurePopups = [];
    for (var object of guildArea.objects) {
        object.area = guildArea;
    }
    return guildArea;
}
function fixedObject(objectKey, coords, properties) {
    var imageSource = areaObjects[objectKey].source;
    return $.extend({'key': objectKey, 'fixed': true, 'base': areaObjects[objectKey], 'x': coords[0], 'y': coords[1], 'z': coords[2],
                    'width': imageSource.width, 'height': imageSource.height, 'depth': imageSource.depth,
                    'draw': drawFixedObject,
                    'helpMethod': fixedObjectHelpText}, ifdefor(properties, {}));
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
        mainContext.fillStyle = '#00f';
        mainContext.fillRect(this.left, groundY - (this.z + this.depth / 2) / 2, this.width, this.depth / 2);
        mainContext.fillStyle = '#f0f';
        mainContext.fillRect(this.left, this.top, this.width, this.height);
    }*/
    if (canvasPopupTarget === this) drawOutlinedImage(mainContext, imageSource.image, '#fff', 2, imageSource, this)
    else drawImage(mainContext, imageSource.image, imageSource, this);
}
map.guildFoyer = initializeGuldArea({
    'key': 'guildFoyer',
    'width': 1000,
    'backgroundPatterns': {'0': 'oldGuild'},
    'wallDecorations': [
        fixedObject('candles', [165, 50, wallZ], {'xScale': -1}),
        fixedObject('candles', [440, 70, wallZ], {'xScale': -1}),
        fixedObject('candles', [560, 70, wallZ]),
        fixedObject('candles', [835, 50, wallZ]),
    ],
    'objects': [
        fixedObject('mapTable', [250, 0, 90]),
        fixedObject('crackedPot', [455, 0, 150]),
        fixedObject('woodenShrine', [500, 0, 150]),
        fixedObject('crackedOrb', [545, 0, 150])
    ]
});


function enterGuildArea(character, door) {
    character.currentLevelKey = door.areaKey;
    var guildArea = map[door.areaKey];
    character.area = guildArea;
    character.cameraX = guildArea.cameraX;
    initializeActorForAdventure(character.adventurer);
    var hero = character.adventurer;
    hero.x = door.x;
    hero.y = 0;
    hero.z = door.z;
    guildArea.allies.push(hero);
    character.allies = hero.allies = guildArea.allies;
    character.enemies = hero.enemies = guildArea.enemies;
    character.objects = hero.objects = guildArea.objects;
    hero.activity = null;
    hero.actions.concat(hero.reactions).forEach(function (action) {
        action.readyAt = 0;
    });
    if (state.selectedCharacter === character) {
        guildArea.cameraX = hero.x - 300;
        updateAdventureButtons();
    }
    saveGame();
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
                mainContext.drawImage(source.image, source.x, source.y, source.width, source.height,
                                      x, y, width, height);
                if (x !== Math.round(x) || y !== Math.round(y) || width != Math.round(width) || height != Math.round(height)) {
                    console.log(JSON.stringify([[source.x, x], [source.y, source.z, y], width, height]));
                }
            }
            mainContext.globalAlpha = 1;
        });
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
        else {
            sprite.character.cameraX = guildArea.cameraX;
            drawActor(sprite);
        }
    }
    // Draw text popups such as damage dealt, item points gained, and so on.
    /*context.fillStyle = 'red';
    for (var i = 0; i < ifdefor(character.treasurePopups, []).length; i++) {
        character.treasurePopups[i].draw(character);
    }
    for (var i = 0; i < ifdefor(character.projectiles, []).length; i++) {
        character.projectiles[i].draw(character);
    }
    for (var i = 0; i < ifdefor(character.effects, []).length; i++) {
        character.effects[i].draw(character);
    }
    for (var i = 0; i < ifdefor(character.textPopups, []).length; i++) {
        var textPopup = character.textPopups[i];
        context.fillStyle = ifdefor(textPopup.color, "red");
        var scale = Math.max(0, Math.min(1.5, ifdefor(textPopup.duration, 0) / 10));
        context.font = Math.round(scale * ifdefor(textPopup.fontSize, 20)) + 'px sans-serif';
        context.textAlign = 'center'
        context.fillText(textPopup.value, textPopup.x - cameraX, groundY - textPopup.y - textPopup.z / 2);
    }
    drawMinimap(character);*/
}