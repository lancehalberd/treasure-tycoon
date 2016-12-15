var maxIndex = 9;
var groundY = 390;
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
    ifdefor(character.objects, []).forEach(function (object, index) {
        object.draw(context, object.x - cameraX, 600 - 256);
    });
    ifdefor(character.enemies, []).forEach(function (actor, index) {
        drawActor(character, actor, 1 + character.enemies.length - index)
    });
    drawActor(character, adventurer, 0);
    ifdefor(character.allies, []).forEach(function (actor, index) {
        if (actor == adventurer) return;
        drawActor(character, actor, -index)
    });
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
function drawActor(character, actor, index) {
    mainContext.save();
    if (actor.personCanvas) {
        if (actor.isDead) {
            actor.animationTime = actor.timeOfDeath;
            mainContext.globalAlpha = 1 - (actor.time - actor.timeOfDeath);
        }
        drawAdventurer(character, actor, index);
    } else drawMonster(character, actor, index);
    if (!actor.isDead && actor.stunned) {
        for (var i = 0; i < 3; i++ ) {
            var theta = 2 * Math.PI * (i + 3 * actor.time) / 3;
            var shrineSource = {'image': images['gfx/militaryIcons.png'], 'xOffset': 102, 'yOffset': 125, 'width': 16, 'height': 16};
            var yPosition = 600 - 256 - 36 - 2 * (index % maxIndex);
            if (actor.source) yPosition -= ifdefor(actor.source.y, 0) * 2;
            mainContext.drawImage(shrineSource.image, shrineSource.xOffset, shrineSource.yOffset, shrineSource.width, shrineSource.height,
                                    actor.left + (actor.width - shrineSource.width) / 2 + Math.cos(theta) * 30,
                                    yPosition + Math.sin(theta) * 10, shrineSource.width, shrineSource.height);
        }
    }
    mainContext.restore();
}
function drawMonster(character, monster, index) {
    if (!monster.image) {
        console.log("Found monster without an image. Last time this happened was because the -enchanged/-imbued version of the image was not being created at load time.");
        console.log(monster);
        return;
    }
    var cameraX = character.cameraX;
    var context = mainContext;
    var source = monster.base.source;
    var scale = ifdefor(monster.scale, 1);
    var frame;
    context.save();
    if (monster.cloaked) {
        context.globalAlpha = .2;
    }
    monster.width = source.width * scale;
    monster.height = ifdefor(source.height, 64) * scale;
    monster.left = monster.x - cameraX;
    monster.top = groundY - monster.height - ifdefor(source.y, 0) * scale - 2 * (index % maxIndex);
    var xCenter = ifdefor(source.xCenter, source.width / 2) * scale;
    var yCenter = ifdefor(source.yCenter, ifdefor(source.height, 64) / 2) * scale;
    context.translate(monster.left + xCenter, monster.top + yCenter);
    if (ifdefor(monster.rotation)) {
        context.rotate(monster.rotation * Math.PI/180);
    }
    if ((source.flipped && monster.direction < 0) || (!source.flipped && monster.direction > 0)) {
        context.scale(-1, 1);
    }
    if (monster.isDead && !ifdefor(source.deathFrames)) {
        monster.animationTime = monster.timeOfDeath;
        mainContext.globalAlpha = 1 - (monster.time - monster.timeOfDeath);
    }
    if (monster.pull) {
        frame = 0;
    } else if (monster.isDead && ifdefor(source.deathFrames)) {
        var deathFps = 1.5 * source.deathFrames.length;
        frame = Math.min(source.deathFrames.length - 1, Math.floor((monster.time - monster.timeOfDeath) * deathFps));
        frame = arrMod(source.deathFrames, frame);
    } else if (ifdefor(source.attackFrames) && monster.target && monster.lastAction && monster.lastAction.attackSpeed) { // attacking loop
        var attackFps = 1 / ((1 / monster.lastAction.attackSpeed) / source.attackFrames.length);
        var frame = Math.floor(Math.abs(monster.animationTime - monster.attackCooldown) * attackFps);
        frame = arrMod(source.attackFrames, frame);
    } else {
        var walkFps = ifdefor(monster.base.fpsMultiplier, 1) * 3 * monster.speed / 100;
        frame = Math.floor(monster.animationTime * walkFps);
        if (ifdefor(source.walkFrames)) frame = arrMod(source.walkFrames, frame);
        else frame = frame % source.frames;
    }
    var xFrame = frame;
    var yFrame = 0;
    // Some images wrap every N frames and will have framesPerRow set on the source.
    if (ifdefor(source.framesPerRow)) {
        xFrame = frame % source.framesPerRow;
        yFrame = Math.floor(frame / source.framesPerRow);
    }
    var frameSource = {'left': xFrame * source.width + source.xOffset, 'top': yFrame * ifdefor(source.height, 64) + ifdefor(source.yOffset, 0), 'width': source.width, 'height': ifdefor(source.height, 64)};
    var target = {'left': -xCenter, 'top': -yCenter, 'width': monster.width, 'height': monster.height};

    var tints = getActorTints(monster), sourceRectangle;
    if (tints.length) {
        prepareTintedImage();
        var tint = tints.pop();
        var tintedImage = getTintedImage(monster.image, tint[0], tint[1], frameSource);
        for (var tint of tints) {
            tintedImage = getTintedImage(tintedImage, tint[0], tint[1], {'left': 0, 'top': 0, 'width': frameSource.width, 'height': frameSource.height});
        }
        mainContext.drawImage(tintedImage,
                    0, 0, frameSource.width, frameSource.height,
                    target.left, target.top, target.width, target.height);
    } else {
        context.drawImage(monster.image, frameSource.left, frameSource.top, frameSource.width, frameSource.height,
                                         target.left, target.top, target.width, target.height);
    }
    context.restore();
    // life bar
    if (monster.isDead) return;
    var x = monster.x - cameraX + monster.width / 2 - 32;
    var y = monster.top + scale * ifdefor(source.yTop, 0) -5;
    drawBar(context, x, y, 64, 4, 'white', ifdefor(monster.color, 'red'), monster.health / monster.maxHealth);
    if (monster.bonusMaxHealth >= 1 && monster.health >= monster.maxHealth - monster.bonusMaxHealth) {
        // This logic is kind of a mess but it is to make sure the % of the bar that is due to bonusMaxHealth
        // is drawn as orange instead of red.
        var totalWidth = 62 * monster.health / monster.maxHealth;
        var normalWidth = Math.floor(62 * (monster.maxHealth - monster.bonusMaxHealth) / monster.maxHealth);
        var bonusWidth = Math.min(totalWidth - normalWidth,
                                  Math.ceil((totalWidth - normalWidth) * (monster.bonusMaxHealth - (monster.health - monster.maxHealth)) / monster.bonusMaxHealth));
        mainContext.fillStyle = 'orange';
        mainContext.fillRect(x + 1 + normalWidth, y + 1, bonusWidth, 2);
    }
    if (ifdefor(monster.reflectBarrier, 0) > 0) {
        var width = Math.ceil(Math.min(1, monster.maxReflectBarrier / monster.maxHealth) * 64);
        drawBar(context, x, y - 2, width, 4, 'white', 'blue', monster.reflectBarrier / monster.maxReflectBarrier);
    }
    drawEffectIcons(monster, x, y);
}
// Get array of tint effects to apply when drawing the given actor.
function getActorTints(actor) {
    var tints = [];
    if (ifdefor(actor.tint)) {
        var min = ifdefor(actor.tintMinAlpha, .5);
        var max = ifdefor(actor.tintMaxAlpha, .5);
        var center = (min + max) / 2;
        var radius = (max - min) / 2;
        tints.push([actor.tint, center + Math.cos(actor.animationTime * 5) * radius]);
    }
    if (actor.slow > 0) tints.push(['#fff', Math.min(1, actor.slow)]);
    return tints;
}
function drawImage(context, image, source, target) {
    context.drawImage(image, source.left, source.top, source.width, source.height, target.left, target.top, target.width, target.height);
}
function drawAdventurer(character, adventurer, index) {
    var scale = ifdefor(adventurer.scale, 1);
    var cameraX = character.cameraX;
    var context = mainContext;
    adventurer.left = adventurer.x - cameraX;
    adventurer.width = 32 * scale;
    adventurer.height = 64 * scale;
    adventurer.top = groundY - adventurer.height - 2 * (index % maxIndex);
    var xCenter = adventurer.source.xCenter * scale;
    var yCenter = adventurer.source.yCenter * scale;
    context.translate(adventurer.left + xCenter, adventurer.top + yCenter);
    if (ifdefor(adventurer.rotation)) {
        context.rotate(adventurer.rotation * Math.PI/180);
    }
    if (adventurer.direction < 0) {
        context.scale(-1, 1);
    }
    // console.log([adventurer.left, adventurer.top, adventurer.width, adventurer.height]);
    //draw character
    var tints = getActorTints(adventurer), sourceRectangle;
    if (adventurer.target && adventurer.lastAction && adventurer.lastAction.attackSpeed) { // attacking loop
        var attackSpeed = adventurer.lastAction.attackSpeed;
        var attackFps = 1 / ((1 / attackSpeed) / fightLoop.length);
        var frame = Math.floor(Math.abs(adventurer.animationTime - adventurer.attackCooldown) * attackFps) % fightLoop.length;
        sourceRectangle = {'left': fightLoop[frame] * 32, 'top': 0 , 'width': 32, 'height': 64};
    } else { // walking loop
        if (adventurer.cloaked) mainContext.globalAlpha = .2;
        var fps = Math.floor(3 * adventurer.speed / 100);
        var frame = Math.floor(adventurer.animationTime * fps) % walkLoop.length;
        if (adventurer.pull || adventurer.stunned) frame = 0;
        sourceRectangle = {'left': walkLoop[frame] * 32, 'top': 0 , 'width': 32, 'height': 64};
    }
    if (tints.length) {
        prepareTintedImage();
        var tint = tints.pop();
        var tintedImage = getTintedImage(adventurer.personCanvas, tint[0], tint[1], sourceRectangle);
        for (var tint of tints) {
            tintedImage = getTintedImage(tintedImage, tint[0], tint[1], {'left': 0, 'top': 0, 'width': sourceRectangle.width, 'height': sourceRectangle.height});
        }
        mainContext.drawImage(tintedImage,
                    0, 0, sourceRectangle.width, sourceRectangle.height,
                    -xCenter, -yCenter, adventurer.width, adventurer.height);
    } else {
        mainContext.drawImage(adventurer.personCanvas,
                    sourceRectangle.left, sourceRectangle.top , sourceRectangle.width, sourceRectangle.height,
                    -xCenter, -yCenter, adventurer.width, adventurer.height);
    }
    context.restore();
    // life bar
    if (adventurer.isDead) return;
    var x = adventurer.x - cameraX;
    var y = adventurer.top + scale * ifdefor(adventurer.source.yTop, 0) - 5;
    drawBar(mainContext, x, y, 64, 4, 'white', 'red', adventurer.health / adventurer.maxHealth);
    if (adventurer.bonusMaxHealth >= 1 && adventurer.health >= adventurer.maxHealth - adventurer.bonusMaxHealth) {
        // This logic is kind of a mess but it is to make sure the % of the bar that is due to bonusMaxHealth
        // is drawn as orange instead of red.
        var totalWidth = 62 * adventurer.health / adventurer.maxHealth;
        var normalWidth = Math.floor(62 * (adventurer.maxHealth - adventurer.bonusMaxHealth) / adventurer.maxHealth);
        var bonusWidth = Math.min(totalWidth - normalWidth,
                                  Math.ceil((totalWidth - normalWidth) * (adventurer.bonusMaxHealth - (adventurer.health - adventurer.maxHealth)) / adventurer.bonusMaxHealth));
        mainContext.fillStyle = 'orange';
        mainContext.fillRect(x + 1 + normalWidth, y + 1, bonusWidth, 2);
    }
    if (ifdefor(adventurer.reflectBarrier, 0) > 0) {
        var width = Math.ceil(Math.min(1, adventurer.maxReflectBarrier / adventurer.maxHealth) * 64);
        drawBar(mainContext, x, y - 2, width, 4, 'white', 'blue', adventurer.reflectBarrier / adventurer.maxReflectBarrier);
    }
    drawEffectIcons(adventurer, x, y);
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
    var y = 600 - 40;
    var height = 6;
    var x = 10;
    var width = 750;
    var context = mainContext;
    var area = editingLevelInstance ? editingLevelInstance : character.area;
    //context.fillStyle = 'black';
    //context.fillRect(0, 560, mainCanvas.width, 30);
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