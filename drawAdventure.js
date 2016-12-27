var maxIndex = 9;
// Indicates where the ground is. This will be replaced once we allow a range of y values for the ground.
var groundY = 390;
// Indicates how much to shift drawing the map/level based on the needs of other UI elements.
var screenYOffset = 0;
function drawAdventure(character) {
    var adventurer = character.adventurer;
    var context = mainContext;
    var cameraX = character.cameraX;
    context.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    var area = editingLevelInstance ? editingLevelInstance : character.area;
    var background = ifdefor(backgrounds[area.background], backgrounds.field);
    var cloudX = cameraX + character.time * .5;
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
        context.globalAlpha = alpha;
        for (var i = 0; i <= fullDrawingWidth; i += tileWidth * spacing) {
            var x = Math.round((fullDrawingWidth + (i - (cameraX - character.time * velocity) * parallax) % fullDrawingWidth) % fullDrawingWidth - tileWidth);
            context.drawImage(source.image, source.x, source.y, source.width, source.height,
                                  x, y, width, height);
            if (x !== Math.round(x) || y !== Math.round(y) || width != Math.round(width) || height != Math.round(height)) {
                console.log([x, y, width, height]);
            }
        }
        context.globalAlpha = 1;
    });
    ifdefor(character.objects, []).forEach(function (object) {
        object.draw(character);
    });
    ifdefor(character.enemies, []).forEach(drawActor);
    ifdefor(character.allies, []).forEach(drawActor);
    // Draw text popups such as damage dealt, item points gained, and so on.
    context.fillStyle = 'red';
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
        context.font = ifdefor(textPopup.font, "20px sans-serif");
        context.textAlign = 'center'
        context.fillText(textPopup.value, textPopup.x - cameraX, textPopup.y);
    }
    drawMinimap(character);
}
function updateActorAnimationFrame(actor) {
    if (actor.pull || actor.stunned || actor.isDead ) {
        actor.walkFrame = actor.attackFrame = 0;
    } else if (actor.target && actor.lastAction && actor.lastAction.attackSpeed) { // attacking loop
        var attackFps = 1 / ((1 / actor.lastAction.attackSpeed) / actor.source.attackFrames.length);
        actor.attackFrame = ifdefor(actor.attackFrame, 0) + attackFps * frameMilliseconds / 1000;
        actor.walkFrame = 0;
    } else {
        var walkFps = ifdefor(actor.base.fpsMultiplier, 1) * 3 * actor.speed / 100;
        actor.walkFrame = ifdefor(actor.walkFrame, 0) + walkFps * frameMilliseconds * Math.max(.1, 1 - actor.slow) / 1000;
        actor.attackFrame = 0;
    }
}
function drawActor(actor) {
    var cameraX = actor.character.cameraX;
    var context = mainContext;
    var source = actor.source;
    var scale = ifdefor(actor.scale, 1);
    var frame;
    context.save();
    if (actor.cloaked) {
        context.globalAlpha = .2;
    }
    var xCenter = ifdefor(source.xCenter, source.width / 2) * scale;
    var yCenter = ifdefor(source.yCenter, ifdefor(source.height, 64) / 2) * scale;
    context.translate(actor.left + xCenter, actor.top + yCenter);
    if (ifdefor(actor.rotation)) {
        context.rotate(actor.rotation * Math.PI/180);
    }
    if ((!source.flipped && actor.direction < 0) || (source.flipped && actor.direction > 0)) {
        context.scale(-1, 1);
    }
    if (actor.isDead && !ifdefor(source.deathFrames)) {
        mainContext.globalAlpha = 1 - (actor.time - actor.timeOfDeath);
    }
    if (actor.pull || actor.stunned || (actor.isDead && !ifdefor(source.deathFrames))) {
        frame = 0;
    } else if (actor.isDead && ifdefor(source.deathFrames)) {
        var deathFps = 1.5 * source.deathFrames.length;
        frame = Math.min(source.deathFrames.length - 1, Math.floor((actor.time - actor.timeOfDeath) * deathFps));
        frame = arrMod(source.deathFrames, frame);
    } else if (actor.target && actor.lastAction && actor.lastAction.attackSpeed) { // attacking loop
        frame = arrMod(source.attackFrames, Math.floor(actor.attackFrame));
    } else {
        frame = arrMod(source.walkFrames, Math.floor(actor.walkFrame));
    }
    var xFrame = frame;
    var yFrame = 0;
    // Some images wrap every N frames and will have framesPerRow set on the source.
    if (ifdefor(source.framesPerRow)) {
        xFrame = frame % source.framesPerRow;
        yFrame = Math.floor(frame / source.framesPerRow);
    }
    var frameSource = {'left': xFrame * source.width + ifdefor(source.xOffset, 0), 'top': yFrame * ifdefor(source.height, 64) + ifdefor(source.yOffset, 0), 'width': source.width, 'height': ifdefor(source.height, 64)};
    var target = {'left': -xCenter, 'top': -yCenter, 'width': actor.width, 'height': actor.height};

    var tints = getActorTints(actor), sourceRectangle;
    if (tints.length) {
        prepareTintedImage();
        var tint = tints.pop();
        var tintedImage = getTintedImage(actor.image, tint[0], tint[1], frameSource);
        var tintSource = {'left': 0, 'top': 0, 'width': frameSource.width, 'height': frameSource.height};
        for (var tint of tints) {
            tintedImage = getTintedImage(tintedImage, tint[0], tint[1], tintSource);
        }
        drawImage(context, tintedImage, tintSource, target);
    } else {
        drawImage(context, actor.image, frameSource, target);
    }
    context.restore();

    // life bar
    if (actor.isDead) return;
    var x = actor.x - cameraX + actor.width / 2 - 32;
    var y = actor.top + scale * ifdefor(source.yTop, 0) - 5;
    drawBar(context, x, y, 64, 4, 'white', ifdefor(actor.lifeBarColor, 'red'), actor.health / actor.maxHealth);
    if (actor.bonusMaxHealth >= 1 && actor.health >= actor.maxHealth - actor.bonusMaxHealth) {
        // This logic is kind of a mess but it is to make sure the % of the bar that is due to bonusMaxHealth
        // is drawn as orange instead of red.
        var totalWidth = 62 * actor.health / actor.maxHealth;
        var normalWidth = Math.floor(62 * (actor.maxHealth - actor.bonusMaxHealth) / actor.maxHealth);
        var bonusWidth = Math.min(totalWidth - normalWidth,
                                  Math.ceil((totalWidth - normalWidth) * (actor.bonusMaxHealth - (actor.health - actor.maxHealth)) / actor.bonusMaxHealth));
        mainContext.fillStyle = 'orange';
        mainContext.fillRect(x + 1 + normalWidth, y + 1, bonusWidth, 2);
    }
    if (ifdefor(actor.reflectBarrier, 0) > 0) {
        var width = Math.ceil(Math.min(1, actor.maxReflectBarrier / actor.maxHealth) * 64);
        drawBar(context, x, y - 2, width, 4, 'white', 'blue', actor.reflectBarrier / actor.maxReflectBarrier);
    }
    drawEffectIcons(actor, x, y);
    if (!actor.isDead && actor.stunned) {
        var shrineSource = {'left': 102, 'top': 125, 'width': 16, 'height': 16};
        var target =  {'left': 0, 'top': 0, 'width': shrineSource.width, 'height': shrineSource.height}
        for (var i = 0; i < 3; i++ ) {
            var theta = 2 * Math.PI * (i + 3 * actor.time) / 3;
            var scale = ifdefor(actor.scale, 1);
            target.left = actor.left + (actor.width - shrineSource.width) / 2 + Math.cos(theta) * 30;
            target.top = actor.top + scale * ifdefor(actor.source.yTop, 0) - 5 + Math.sin(theta) * 10;
            drawImage(context, images['gfx/militaryIcons.png'], shrineSource, target);
        }
    }
}
// Get array of tint effects to apply when drawing the given actor.
function getActorTints(actor) {
    var tints = [];
    if (ifdefor(actor.tint)) {
        var min = ifdefor(actor.tintMinAlpha, .5);
        var max = ifdefor(actor.tintMaxAlpha, .5);
        var center = (min + max) / 2;
        var radius = (max - min) / 2;
        tints.push([actor.tint, center + Math.cos(actor.time * 5) * radius]);
    }
    if (actor.slow > 0) tints.push(['#fff', Math.min(1, actor.slow)]);
    if (mouseDown) {
        if (actor === state.selectedCharacter.adventurer.target) tints.push(['#00f', .5]);
    }
    return tints;
}
function drawImage(context, image, source, target) {
    context.drawImage(image, source.left, source.top, source.width, source.height, target.left, target.top, target.width, target.height);
}
function drawEffectIcons(actor, x, y) {
    var effectXOffset = 0;
    var effectYOffset = 2;
    for (var effect of actor.allEffects) {
        var icons = effect.base ? ifdefor(effect.base.icons, []) : [];
        if (!icons.length) continue;
        for (var iconData of icons) {
            var source = {'image': images[iconData[0]], 'left': iconData[1], 'top': iconData[2], 'width': iconData[3], 'height': iconData[4]};
            var xOffset = effectXOffset + iconData[5], yOffset = effectYOffset + iconData[6];
            drawImage(mainContext, source.image, source, {'left': x + xOffset, 'top': y + yOffset, 'width': source.width, 'height': source.height});
        }
        effectXOffset += 16;
        if (effectXOffset + 16 > Math.min(actor.width, 64)) {
            effectXOffset = 0;
            effectYOffset += 20;
        }
    }
}
function drawMinimap(character) {
    var y = 600 - 65;
    var height = 6;
    var x = 10;
    var width = 750;
    var context = mainContext;
    var area = editingLevelInstance ? editingLevelInstance : character.area;
    drawBar(context, x, y, width, height, 'white', 'white', character.waveIndex / area.waves.length);
    for (var i = 0; i < area.waves.length; i++) {
        var centerX = x + (i + 1) * width / area.waves.length;
        var centerY = y + height / 2;
        context.fillStyle = 'white';
        context.beginPath();
            context.arc(centerX, centerY, 11, 0, 2 * Math.PI);
        context.fill();
    }
    context.fillStyle = 'orange';
    context.fillRect(x + 1, y + 1, (width - 2) * (character.waveIndex / area.waves.length) - 10, height - 2);
    for (var i = 0; i < area.waves.length; i++) {
        var centerX = x + (i + 1) * width / area.waves.length;
        var centerY = y + height / 2;
        if (i < character.waveIndex) {
            context.fillStyle = 'orange';
            context.beginPath();
            context.arc(centerX, centerY, 10, 0, 2 * Math.PI);
            context.fill();
        }
        var waveCompleted = (i < character.waveIndex - 1)  || (i <= character.waveIndex - 1 && (ifdefor(character.enemies, []).length + ifdefor(character.objects, []).length) === 0);
        area.waves[i].draw(context, waveCompleted, centerX, centerY);
    }
}