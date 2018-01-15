var maxIndex = 9;
// Indicates where the ground is. This will be replaced once we allow a range of y values for the ground.
var groundY = 390;
// Indicates how much to shift drawing the map/level based on the needs of other UI elements.
var screenYOffset = 0;

function drawAnimation(context, animation, target) {
    var frame = Math.floor(Date.now() * 20 / 1000) % animation.frames.length;
    var frameData = animation.frames[frame];
    drawImage(context, animation.image, rectangle(frameData[0], frameData[1], frameData[2], frameData[3]), target);
}

function drawOnGround(draw) {
    var context = bufferContext;
    context.clearRect(0,0, bufferCanvas.width, bufferCanvas.height);
    draw(context);
    drawImage(mainContext, bufferCanvas, rectangle(0, 300, bufferCanvas.width, 180), rectangle(0, 300, bufferCanvas.width, 180));
}

function drawArea(area) {
    var context = mainContext;
    var cameraX = area.cameraX;
    context.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    context.save();
    var firstPattern = true;
    for (var xOffset in area.backgroundPatterns) {
        xOffset = parseInt(xOffset);
        var backgroundKey = area.backgroundPatterns[xOffset];
        var background = ifdefor(backgrounds[backgroundKey], backgrounds.field);
        var tileWidth = 120;
        var fullDrawingWidth = Math.ceil(mainCanvas.width / tileWidth) * tileWidth + tileWidth;
        for (var section of background) {
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
                var x = Math.round((fullDrawingWidth + (i - (cameraX - area.time * velocity) * parallax) % fullDrawingWidth) % fullDrawingWidth - tileWidth);
                var realX = area.cameraX + x;
                if (!firstPattern && realX + tileWidth < xOffset) continue;
                context.drawImage(source.image, source.x, source.y, source.width, source.height,
                                      x, y, width, height);
                if (x !== Math.round(x) || y !== Math.round(y) || width != Math.round(width) || height != Math.round(height)) {
                    console.log(JSON.stringify([[source.x, x], [source.y, source.z, y], width, height]));
                }
            }
        }
        firstPattern = false;
    }
    context.restore();
    var allSprites = area.allies.concat(area.enemies).concat(area.objects)
        .concat(area.projectiles).concat(area.treasurePopups).concat(area.effects);
    var sortedSprites = allSprites.slice().sort(function (spriteA, spriteB) {
        return (spriteB.z || 0) - (spriteA.z || 0);
    });
    // Draw effects that appear underneath sprites. Do not sort these, rather, just draw them in
    // the order they are present in the arrays.
    for (var sprite of allSprites) if (sprite.drawGround) sprite.drawGround(area);
    for (var actor of area.allies.concat(area.enemies)) drawActorGroundEffects(actor);
    drawActionTargetCircle(context);
    if (area.leftWall) drawLeftWall(area);
    if (area.rightWall) drawRightWall(area);
    if (area.wallDecorations) for (var object of area.wallDecorations) object.draw(area);
    for (var sprite of sortedSprites) {
        if (sprite.draw) sprite.draw(area);
        else if (sprite.isActor) drawActor(sprite);
    }
    //for (var effect of ifdefor(area.effects, [])) effect.draw(area);
    // Draw actor lifebar/status effects on top of effects/projectiles
    area.allies.concat(area.enemies).forEach(drawActorEffects);
    // Draw text popups such as damage dealt, item points gained, and so on.
    for (var textPopup of ifdefor(area.textPopups, [])) {
        context.fillStyle = ifdefor(textPopup.color, "red");
        var scale = Math.max(0, Math.min(1.5, ifdefor(textPopup.duration, 0) / 10));
        context.font = 'bold ' + Math.round(scale * ifdefor(textPopup.fontSize, 20)) + "px 'Cormorant SC', Georgia, serif";
        context.textAlign = 'center'
        context.fillText(textPopup.value, textPopup.x - cameraX, groundY - textPopup.y - textPopup.z / 2);
    }
    if (area.areas) drawMinimap(area);
}
function updateActorAnimationFrame(actor) {
    if (actor.pull || actor.stunned || actor.isDead ) {
        actor.walkFrame = 0;
    } else if (actor.skillInUse && actor.recoveryTime < Math.min(actor.totalRecoveryTime, .3)) { // attacking loop
        if (actor.recoveryTime === 0) {
            actor.attackFrame = actor.preparationTime / actor.skillInUse.totalPreparationTime * (actor.source.attackPreparationFrames.length - 1);
        } else {
            actor.attackFrame = actor.recoveryTime / actor.totalRecoveryTime * (actor.source.attackRecoveryFrames.length - 1);
        }
        actor.walkFrame = 0;
    } else if (actor.isMoving) {
        var walkFps = ifdefor(actor.base.fpsMultiplier, 1) * 3 * actor.speed / 100;
        actor.walkFrame = ifdefor(actor.walkFrame, 0) + walkFps * frameMilliseconds * Math.max(MIN_SLOW, 1 - actor.slow) * (actor.skillInUse ? .25 : 1) / 1000;
    } else {
        actor.walkFrame = 0;
    }
}
function drawRune(context, actor, animation, frame) {
    var size = [Math.max(actor.width, 128), Math.max(actor.width / 2, 64)];
    context.save();
    context.translate((actor.x - actor.area.cameraX), groundY - actor.z / 2);
    var frame = animation.frames[frame];
    context.drawImage(animation.image, frame[0], frame[1], frame[2], frame[3], -size[0] / 2, -size[1] / 2, size[0], size[1]);
    context.restore();
}
function drawActorGroundEffects(actor) {
    var usedEffects = new Set();
    for (var effect of actor.allEffects) {
        if (!effect.base.drawGround) continue;
        // Don't draw the same effect animation twice on the same character.
        if (usedEffects.has(effect.base)) continue;
        usedEffects.add(effect.base);
        effect.base.drawGround(actor);
    }
    if (!actor.pull && !actor.stunned && !actor.isDead && actor.skillInUse && actor.recoveryTime === 0) {
        if (actor.skillInUse.tags['spell']) {
            var castAnimation = effectAnimations.cast;
            var castFrame = Math.floor(actor.preparationTime / actor.skillInUse.totalPreparationTime * castAnimation.frames.length);
            if (castFrame < castAnimation.frames.length) {
                drawOnGround((context) => {
                    drawRune(context, actor, castAnimation, castFrame);
                });
            }
        }
    }
}
function drawActor(actor) {
    var cameraX = actor.area.cameraX;
    var context = mainContext;
    var source = actor.source;
    var scale = ifdefor(actor.scale, 1);
    var frame;
    context.save();
    if (actor.cloaked) {
        context.globalAlpha = .2;
    }
    var top = Math.round(groundY - actor.height - ifdefor(actor.y, 0) - ifdefor(actor.z, 0) / 2);
    var left = Math.round(actor.x - actor.width / 2 - cameraX);
    // These values are used for determining when the mouse is hovering over the actor.
    // We only need these when the screen is displayed, so we can set them only on draw.
    actor.top = top;
    actor.left = left;
    var xCenterOnMap = left + (source.xCenter - source.xOffset) * scale;
    var yCenterOnMap = top + (source.yCenter - source.yOffset) * scale;
    /*if (mouseDown) {
        console.log(actor.base.name ? actor.base.name : actor.name);
        console.log([actor.x, actor.y]);
        console.log(['xCenter', source.xCenter, 'actualWidth', source.actualWidth,  'width', source.width, 'xOffset', source.xOffset, 'scale', scale]);
        console.log(['yCenter', source.yCenter, 'actualHeight', source.actualHeight,  'height', source.height, 'yOffset', source.yOffset, 'scale', scale]);
        console.log([left, top, actor.width, actor.height]);
        console.log([source.xCenter, source.yCenter]);
        console.log([xCenterOnMap, yCenterOnMap]);
    }*/
    context.translate(xCenterOnMap, yCenterOnMap);
    if (ifdefor(actor.rotation)) {
        context.rotate(actor.rotation * Math.PI/180);
    }
    if ((!source.flipped && actor.heading[0] < 0) || (source.flipped && actor.heading[0] > 0)) {
        context.scale(-1, 1);
    }
    if (actor.isDead && !ifdefor(source.deathFrames)) {
        context.globalAlpha = Math.max(0, 1 - (actor.time - actor.timeOfDeath));
    }
    if (actor.pull || actor.stunned || (actor.isDead && !ifdefor(source.deathFrames))) {
        frame = 0;
    } else if (actor.isDead && ifdefor(source.deathFrames)) {
        var deathFps = 1.5 * source.deathFrames.length;
        frame = Math.min(source.deathFrames.length - 1, Math.floor((actor.time - actor.timeOfDeath) * deathFps));
        frame = arrMod(source.deathFrames, frame);
    } else if (actor.skillInUse && actor.recoveryTime < Math.min(actor.totalRecoveryTime, .3)) { // attacking loop
        if (actor.recoveryTime === 0) {
            frame = arrMod(source.attackPreparationFrames, Math.floor(actor.attackFrame));
        } else {
            frame = arrMod(source.attackRecoveryFrames, Math.floor(actor.attackFrame));
        }
    } else if (actor.isMoving) {
        frame = arrMod(source.walkFrames, Math.floor(actor.walkFrame));
    } else {
        // actor does not animate by default (unless we add an idling animation).
        frame = 0;
    }
    var xFrame = frame;
    var yFrame = 0;
    // Some images wrap every N frames and will have framesPerRow set on the source.
    if (ifdefor(source.framesPerRow)) {
        xFrame = frame % source.framesPerRow;
        yFrame = Math.floor(frame / source.framesPerRow);
    }
    var frameSource = {'left': xFrame * source.width, 'top': yFrame * source.height, 'width': source.width, 'height': source.height};
    var target = {'left': -source.xCenter * scale, 'top': -source.yCenter * scale, 'width': source.width * scale, 'height': source.height * scale};

    var tints = getActorTints(actor);
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
    /*context.globalAlpha = .5;
    context.fillStyle = 'red';
    context.fillRect(target.left, target.top, target.width, target.height);*/
    context.restore();
}
function drawActorEffects(actor) {
    var context = mainContext;
    // life bar
    if (actor.isDead) return;
    // if (!actor.area.enemies.length) return;
    var x = actor.left + actor.width / 2 - 32;
    // Don't allow the main character's life bar to fall off the edges of the screen.
    if (actor.character === state.selectedCharacter) {
        x = Math.min(800 - 5 - 64, Math.max(5, x));
    }
    var y = actor.top - 5;
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
    mainContext.save();
    mainContext.fillStyle = 'white';
    mainContext.globalAlpha = .7;
    var targetSize = Math.floor(62 * Math.max(0, actor.targetHealth) / actor.maxHealth);
    mainContext.fillRect(x + 1 + targetSize, y + 1, 62 - targetSize, 2);
    mainContext.restore();

    if (ifdefor(actor.reflectBarrier, 0) > 0) {
        y -= 3;
        var width = Math.ceil(Math.min(1, actor.maxReflectBarrier / actor.maxHealth) * 64);
        drawBar(context, x, y, width, 4, 'white', 'blue', actor.reflectBarrier / actor.maxReflectBarrier);
    }
    if (ifdefor(actor.temporalShield, 0) > 0) {
        y -= 3;
        drawBar(context, x, y, 64, 4, 'white', '#aaa', actor.temporalShield / actor.maxTemporalShield);
    }
    var y = actor.top - 5;
    drawEffectIcons(actor, x, y);
    if (!actor.isDead && actor.stunned) {
        var target =  {'left': 0, 'top': 0, 'width': shrineSource.width, 'height': shrineSource.height}
        for (var i = 0; i < 3; i++ ) {
            var theta = 2 * Math.PI * (i + 3 * actor.time) / 3;
            var scale = ifdefor(actor.scale, 1);
            target.left = actor.left + (actor.width - shrineSource.width) / 2 + Math.cos(theta) * 30;
            target.top = actor.top - 5 + Math.sin(theta) * 10;
            drawImage(context, shrineSource.image, shrineSource, target);
        }
    }
}
// Get array of tint effects to apply when drawing the given actor.
function getActorTints(actor) {
    var tints = [];
    if (actor.base.tint) {
        tints.push(actor.base.tint);
    }
    if (ifdefor(actor.tint)) {
        var min = ifdefor(actor.tintMinAlpha, .5);
        var max = ifdefor(actor.tintMaxAlpha, .5);
        var center = (min + max) / 2;
        var radius = (max - min) / 2;
        tints.push([actor.tint, center + Math.cos(actor.time * 5) * radius]);
    }
    if (actor.slow > 0) tints.push(['#fff', Math.min(1, actor.slow)]);
    return tints;
}
function drawEffectIcons(actor, x, y) {
    var effectXOffset = 0;
    var effectYOffset = 2;
    var seenEffects = {};
    for (var effect of actor.allEffects) {
        var effectText = bonusSourceHelpText(effect, actor);
        // Don't show icons for stacks of the same effect.
        if (seenEffects[effectText]) continue;
        seenEffects[effectText] = true;
        var icons = effect.base ? ifdefor(effect.base.icons, []) : [];
        if (!icons.length) continue;
        for (var iconData of icons) {
            var source = {'image': images[iconData[0]], 'left': iconData[1], 'top': iconData[2], 'width': iconData[3], 'height': iconData[4]};
            var xOffset = effectXOffset + iconData[5], yOffset = effectYOffset + iconData[6];
            drawImage(mainContext, source.image, source, {'left': x + xOffset, 'top': y + yOffset, 'width': source.width, 'height': source.height});
        }
        effectXOffset += 16;
        if (effectXOffset + 16 > Math.max(actor.width, 64)) {
            effectXOffset = 0;
            effectYOffset += 20;
        }
    }
}
function drawMinimap(area) {
    var y = 600 - 30;
    var height = 6;
    var x = 10;
    var width = 750;
    var context = mainContext;
    var areaIndex = 0;
    var numberOfAreas = area.areas.size;
    var i = 0;
    area.areas.forEach(mapArea => {
        if (mapArea === area) areaIndex = i + 1;
        i++;
    });
    drawBar(context, x, y, width, height, 'white', 'white', areaIndex / numberOfAreas);
    var i = 0;
    area.areas.forEach(mapArea => {
        var centerX = x + (i + 1) * width / area.areas.size;
        var centerY = y + height / 2;
        context.fillStyle = 'white';
        context.beginPath();
            context.arc(centerX, centerY, 11, 0, 2 * Math.PI);
        context.fill();
        i++;
    });
    context.fillStyle = 'orange';
    context.fillRect(x + 1, y + 1, (width - 2) * (areaIndex / numberOfAreas) - 10, height - 2);
    i = 0;
    area.areas.forEach(mapArea => {
        var centerX = x + (i + 1) * width / numberOfAreas;
        var centerY = y + height / 2;
        if (i < areaIndex) {
            context.fillStyle = 'orange';
            context.beginPath();
            context.arc(centerX, centerY, 10, 0, 2 * Math.PI);
            context.fill();
        }
        var areaCompleted = !(mapArea.enemies || []).length;
        mapArea.drawMinimapIcon(context, areaCompleted, centerX, centerY);
        i++;
    });
}


function drawHud() {
    for (var element of globalHud) {
        if (element.isVisible && !element.isVisible()) continue;
        element.draw();
    }
}

function setFontSize(context, size) {
    context.font = size +"px 'Cormorant SC', Georgia, serif";
}
