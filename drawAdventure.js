var maxIndex = 9;
function drawAdventure(character) {
    var adventurer = character.adventurer;
    var context = mainContext;
    var cameraX = character.cameraX;
    context.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    var area = editingLevelInstance ? editingLevelInstance : character.area;
    var background = ifdefor(backgrounds[area.background], backgrounds.field);
    var cloudX = cameraX + character.time * .5;
    var fullDrawingWidth = Math.ceil(mainCanvas.width / 64) * 64 + 64;
    background.forEach(function(section) {
        var source = section.source;
        var y = ifdefor(section.y, 0);
        var height = ifdefor(section.height, 240 - y);
        var width = ifdefor(section.width, 64);
        var parallax = ifdefor(section.parallax, 1);
        var spacing = ifdefor(section.spacing, 1);
        var velocity = ifdefor(section.velocity, 0);
        var alpha = ifdefor(section.alpha, 1);
        context.globalAlpha = alpha;
        for (var i = 0; i <= fullDrawingWidth; i += 64 * spacing) {
            var x = (fullDrawingWidth + (i - (cameraX - character.time * velocity) * parallax) % fullDrawingWidth) % fullDrawingWidth - 64;
            context.drawImage(source.image, source.x, source.y, source.width, source.height,
                                  x, y, width, height);
        }
        context.globalAlpha = 1;
    });
    ifdefor(character.objects, []).forEach(function (object, index) {
        object.draw(context, object.x - cameraX, 240 - 128);
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
            var yPosition = 240 - 128 - 36 - 2 * (index % maxIndex);
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
    var frame;
    context.save();
    if (monster.cloaked) {
        context.globalAlpha = .2;
    }
    monster.width = source.width * 2 * ifdefor(monster.scale, 1);
    monster.height = ifdefor(source.height, 64) * 2 * ifdefor(monster.scale, 1);
    monster.left = monster.x - cameraX;
    monster.top = 240 - monster.height - 72 - ifdefor(source.y, 0) * 2 * ifdefor(monster.scale, 1) - 2 * (index % maxIndex);
    context.translate(monster.left + monster.width / 2, 0);
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
    var frameSource = {'left': xFrame * source.width + source.offset, 'top': yFrame * ifdefor(source.height, 64), 'width': source.width, 'height': ifdefor(source.height, 64)};
    var target = {'left': -monster.width / 2, 'top': monster.top, 'width': monster.width, 'height': monster.height};
    if (ifdefor(monster.tint) && !(monster.slow > .3)) {
        drawTintedImage(context, monster.image, monster.tint, .2 + Math.cos(monster.animationTime * 5) / 10, frameSource, target);
    } else if (monster.slow > 0) {
        drawTintedImage(context, monster.image, '#fff', Math.min(1, monster.slow), frameSource, target);
    } else {
        context.drawImage(monster.image, frameSource.left, frameSource.top, frameSource.width, frameSource.height,
                                         target.left, target.top, target.width, target.height);
    }
    context.restore();
    // Uncomment to draw a reference of the character to show where left side of monster should be
    // context.drawImage(character.personCanvas, 0 * 32, 0 , 32, 64, monster.x - cameraX, 240 - 128 - 72, 64, 128);
    //context.fillRect(monster.x - cameraX, 240 - 128 - 72, 64, 128);
    // life bar
    if (monster.isDead) return;
    drawBar(context, monster.x - cameraX + monster.width / 2 - 32, 240 - 128 - 36 - 2 * (index % maxIndex) - ifdefor(source.y, 0) * 2, 64, 4, 'white', ifdefor(monster.color, 'red'), monster.health / monster.maxHealth);
    if (ifdefor(monster.reflectBarrier, 0) >= 1) {
        var width = Math.ceil(Math.min(1, monster.maxReflectBarrier / monster.maxHealth) * 64);
        drawBar(context, monster.x - cameraX + monster.width / 2 - 32, 240 - 128 - 36 - 2 * (index % maxIndex) - 2 - ifdefor(source.y, 0) * 2, width, 4, 'white', 'blue', monster.reflectBarrier / monster.maxReflectBarrier);
    }
}
function drawAdventurer(character, adventurer, index) {
    var cameraX = character.cameraX;
    adventurer.left = adventurer.x - cameraX;
    adventurer.top = 240 - 128 - 72 - 2 * (index % maxIndex);
    adventurer.width = 64;
    adventurer.height = 128;
    //draw character
    if (adventurer.target && adventurer.lastAction && adventurer.lastAction.attackSpeed) { // attacking loop
        var attackSpeed = adventurer.lastAction.attackSpeed;
        var attackFps = 1 / ((1 / attackSpeed) / fightLoop.length);
        var frame = Math.floor(Math.abs(adventurer.animationTime - adventurer.attackCooldown) * attackFps) % fightLoop.length;
        if (adventurer.slow > 0) {
            drawTintedImage(mainContext, adventurer.personCanvas, '#fff', Math.min(1, adventurer.slow),
                        {'left': fightLoop[frame] * 32, 'top': 0 , 'width': 32, 'height': 64},
                        {'left': adventurer.x - cameraX, 'top': 240 - 128 - 72, 'width': 64, 'height': 128});
        } else {
            mainContext.drawImage(adventurer.personCanvas, fightLoop[frame] * 32, 0 , 32, 64,
                            adventurer.x - cameraX, 240 - 128 - 72, 64, 128);
        }
    } else { // walking loop
        if (adventurer.cloaked) {
            mainContext.globalAlpha = .2;
        }
        var fps = Math.floor(3 * adventurer.speed / 100);
        var frame = Math.floor(adventurer.animationTime * fps) % walkLoop.length;
        if (adventurer.pull || adventurer.stunned) {
            frame = 0;
        }
        if (adventurer.slow > 0) {
            drawTintedImage(mainContext, adventurer.personCanvas, '#fff', Math.min(1, adventurer.slow),
                        {'left': walkLoop[frame] * 32, 'top': 0 , 'width': 32, 'height': 64},
                        {'left': adventurer.x - cameraX, 'top': 240 - 128 - 72, 'width': 64, 'height': 128});
        } else {
            mainContext.drawImage(adventurer.personCanvas, walkLoop[frame] * 32, 0 , 32, 64,
                        adventurer.x - cameraX, 240 - 128 - 72, 64, 128);
        }
    }
    //mainContext.fillRect(adventurer.x - cameraX, 240 - 128 - 72, 64, 128);
    // life bar
    if (adventurer.isDead) return;
    drawBar(mainContext, adventurer.x - cameraX, 240 - 128 - 36 - 2 * (index % maxIndex), 64, 4, 'white', 'red', adventurer.health / adventurer.maxHealth);
    if (ifdefor(adventurer.reflectBarrier, 0) >= 1) {
        var width = Math.ceil(Math.min(1, adventurer.maxReflectBarrier / adventurer.maxHealth) * 64);
        drawBar(mainContext, adventurer.x - cameraX, 240 - 128 - 36 - 2 * (index % maxIndex) - 2, width, 4, 'white', 'blue', adventurer.reflectBarrier / adventurer.maxReflectBarrier);
    }
}
function drawMinimap(character) {
    var y = 270 - 20;
    var height = 6;
    var x = 10;
    var width = 750;
    var context = mainContext;
    var area = editingLevelInstance ? editingLevelInstance : character.area;
    context.fillStyle = 'black';
    context.fillRect(0, 240, mainCanvas.width, 30);
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