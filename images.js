
var assetVersion = ifdefor(assetVersion, '0.4');
var images = {};
function loadImage(source, callback) {
    images[source] = new Image();
    images[source].onload = function () {
        callback();
    };
    images[source].src = source + '?v=' + assetVersion;
    return images[source];
}

var numberOfImagesLeftToLoad = 0;
function requireImage(imageFile) {
    if (images[imageFile]) return images[imageFile];
    numberOfImagesLeftToLoad++;
    return loadImage(imageFile, function () {
        numberOfImagesLeftToLoad--;
    });
}
var initialImagesToLoad = [
    // Original images from project contributors:
    'gfx/personSprite.png', 'gfx/hair.png', 'gfx/equipment.png', 'gfx/weapons.png',
    'gfx/grass.png', 'gfx/cave.png', 'gfx/forest.png', 'gfx/beach.png', 'gfx/town.png',
    'gfx/caterpillar.png', 'gfx/gnome.png', 'gfx/skeletonGiant.png', 'gfx/skeletonSmall.png', 'gfx/dragonEastern.png',
    'gfx/turtle.png', 'gfx/monarchButterfly.png', 'gfx/yellowButterfly.png',
    'gfx/treasureChest.png', 'gfx/moneyIcon.png', 'gfx/projectiles.png',
    'gfx/iconSet.png',
    'gfx/monsterPeople.png',
    /**
     * Job Icons by Abhimanyu Sandal created specifically for this project. He does not
     * wish for his to work to be in the public domain so do not reuse these images without
     * his consent.
     */
    'gfx/jobIcons.png',
    /* 'game-icons.png' from http://game-icons.net/about.html */
    'gfx/game-icons.png',
    /* nielsenIcons.png from Søren Nielsen at http://opengameart.org/content/grayscale-icons */
    'gfx/nielsenIcons.png',
    // Public domain images from https://opengameart.org/content/40x56-card-frames-without-the-art
    'gfx/goldFrame.png',
    'gfx/silverFrame.png',
    // http://opengameart.org/content/496-pixel-art-icons-for-medievalfantasy-rpg
    'gfx/496RpgIcons/abilityCharm.png',
    'gfx/496RpgIcons/abilityConsume.png',
    'gfx/496RpgIcons/abilityDivineBlessing.png',
    'gfx/496RpgIcons/abilityPowerShot.png',
    'gfx/496RpgIcons/abilityShadowClone.png',
    'gfx/496RpgIcons/abilityThrowWeapon.png',
    'gfx/496RpgIcons/abilityVenom.png',
    'gfx/496RpgIcons/auraAttack.png',
    'gfx/496RpgIcons/auraDefense.png',
    'gfx/496RpgIcons/buffAxe.png',
    'gfx/496RpgIcons/buffBow.png',
    'gfx/496RpgIcons/buffDagger.png',
    'gfx/496RpgIcons/buffFist.png',
    'gfx/496RpgIcons/buffGreatSword.png',
    'gfx/496RpgIcons/buffPolearm.png',
    'gfx/496RpgIcons/buffShield.png',
    'gfx/496RpgIcons/buffStaff.png',
    'gfx/496RpgIcons/buffSword.png',
    'gfx/496RpgIcons/buffThrown.png',
    'gfx/496RpgIcons/buffWand.png',
    'gfx/496RpgIcons/clock.png',
    'gfx/496RpgIcons/openScroll.png',
    'gfx/496RpgIcons/scroll.png',
    'gfx/496RpgIcons/spellFire.png',
    'gfx/496RpgIcons/spellFreeze.png',
    'gfx/496RpgIcons/spellHeal.png',
    'gfx/496RpgIcons/spellMeteor.png',
    'gfx/496RpgIcons/spellPlague.png',
    'gfx/496RpgIcons/spellProtect.png',
    'gfx/496RpgIcons/spellRevive.png',
    'gfx/496RpgIcons/spellStorm.png',
    'gfx/496RpgIcons/target.png',
    'gfx/squareMap.bmp', // http://topps.diku.dk/torbenm/maps.msp
    'gfx/chest-closed.png', 'gfx/chest-open.png', // http://opengameart.org/content/treasure-chests
    'gfx/bat.png', // http://opengameart.org/content/bat-32x32
    'gfx/militaryIcons.png', // http://opengameart.org/content/140-military-icons-set-fixed
    'gfx/spider.png', // Stephen "Redshrike" Challener as graphic artist and William.Thompsonj as contributor. If reasonable link to this page or the OGA homepage. http://opengameart.org/content/lpc-spider
    'gfx/wolf.png', // Stephen "Redshrike" Challener as graphic artist and William.Thompsonj as contributor. If reasonable link back to this page or the OGA homepage. http://opengameart.org/content/lpc-wolf-animation
    'gfx/explosion.png', //https://opengameart.org/content/pixel-explosion-12-frames
    'gfx/musicNote.png', //http://www.animatedimages.org/img-animated-music-note-image-0044-154574.htm
    'gfx/hook.png', //https://www.flaticon.com/free-icon/hook_91034
];
for (var initialImageToLoad of initialImagesToLoad) {
    requireImage(initialImageToLoad);
}


var coins, animaDrops;
var projectileAnimations = [];
var effectAnimations = [];
function initializeCoins() {
    var coinImage = images['gfx/moneyIcon.png'];
    coins = [
        {'value': 1, 'image': coinImage, 'x': 0, 'y': 0, 'width': 16, 'height': 16},
        {'value': 5, 'image': coinImage, 'x': 0, 'y': 32, 'width': 20, 'height': 20},
        {'value': 20, 'image': coinImage, 'x': 0, 'y': 64, 'width': 24, 'height': 24},
        {'value': 100, 'image': coinImage, 'x': 32, 'y': 0, 'width': 16, 'height': 16},
        {'value': 500, 'image': coinImage, 'x': 32, 'y': 32, 'width': 20, 'height': 20},
        {'value': 2000, 'image': coinImage, 'x': 32, 'y': 64, 'width': 24, 'height': 24},
        {'value': 10000, 'image': coinImage, 'x': 64, 'y': 0, 'width': 16, 'height': 16},
        {'value': 50000, 'image': coinImage, 'x': 64, 'y': 32, 'width': 20, 'height': 20},
        {'value': 200000, 'image': coinImage, 'x': 64, 'y': 64, 'width': 24, 'height': 24},
    ];
    animaDrops = [
        {'value': 1, 'image': coinImage, 'x': 96, 'y': 0, 'width': 16, 'height': 16},
        {'value': 5, 'image': coinImage, 'x': 96, 'y': 32, 'width': 20, 'height': 20},
        {'value': 20, 'image': coinImage, 'x': 96, 'y': 64, 'width': 24, 'height': 24},
        {'value': 100, 'image': coinImage, 'x': 128, 'y': 0, 'width': 16, 'height': 16},
        {'value': 500, 'image': coinImage, 'x': 128, 'y': 32, 'width': 20, 'height': 20},
        {'value': 2000, 'image': coinImage, 'x': 128, 'y': 64, 'width': 24, 'height': 24},
        {'value': 10000, 'image': coinImage, 'x': 160, 'y': 0, 'width': 16, 'height': 16},
        {'value': 50000, 'image': coinImage, 'x': 160, 'y': 32, 'width': 20, 'height': 20},
        {'value': 200000, 'image': coinImage, 'x': 160, 'y': 64, 'width': 24, 'height': 24},
    ];
}
function staticAnimation(image, frame) {
    return {image, frames: [frame]};
}
function makeFrames(length, size, origin = [0, 0], padding = 0, frameRepeat = 1, columns = 0) {
    columns = columns || length;
    var frames = [];
    for (var r = 0; r < Math.ceil(length / columns); r++) {
        for (var i = 0; i < columns; i++) {
            if (r * columns + i >= length) break;
            for (var j = 0; j < frameRepeat; j++) {
                frames.push([origin[0] + (size[0] + padding) * i, origin[1] + (size[1] + padding) * r, size[0], size[1]]);
            }
        }
    }
    return frames;
}
function initializeProjectileAnimations() {
    projectileAnimations['fireball'] = {'image': requireImage('gfx/projectiles.png'), 'frames': [[0, 0, 20, 20], [32, 0, 20, 20], [64, 0, 20, 20]]};
    effectAnimations.explosion = {image: requireImage('gfx/explosion.png'),
        frames: makeFrames(5, [96, 96], [0, 0], 0, 3),
        endFrames: makeFrames(7, [96, 96], [5 * 96, 0], 0, 3),
        // The graphic doesn't fill the frame, so it must be scaled this much to match a given size.
        scale: 1.5};
    effectAnimations.heal = {image: requireImage('gfx/heal.png'), frames: makeFrames(6, [64, 64], [0, 0], 0, 3)};
    effectAnimations.song = {image: requireImage('gfx/musicNote.png'), frames: makeFrames(15, [30, 60])};
    var projectileCanvas = createCanvas(96, 96);
    projectileCanvas.imageSmoothingEnabled = false;
    var context = projectileCanvas.getContext('2d');
    prepareTintedImage();
    var tintedRow = getTintedImage(images['gfx/projectiles.png'], 'green', .5, {'left':96, 'top':32, 'width': 96, 'height': 32});
    context.drawImage(tintedRow, 0, 0, 96, 32, 0, 0, 96, 32);
    context.save();
    context.translate(32 + 10, 10);
    context.rotate(Math.PI / 8);
    context.clearRect(-10, -10, 20, 20);
    context.drawImage(tintedRow, 32, 0, 20, 20, -10, -10, 20, 20);
    projectileAnimations['wandHealing'] = {'image': projectileCanvas, 'frames': [[0, 0, 20, 20], [32, 0, 20, 20], [64, 0, 20, 20], [32, 0, 20, 20]], 'fps': 20};
    context.restore();
    context.save();
    prepareTintedImage();
    tintedRow = getTintedImage(images['gfx/projectiles.png'], 'orange', .5, {'left':96, 'top':32, 'width': 96, 'height': 32});
    context.drawImage(tintedRow, 0, 0, 96, 32, 0, 32, 96, 32);
    context.translate(32 + 10, 32 + 10);
    context.rotate(Math.PI / 8);
    context.clearRect(-10, -10, 20, 20);
    context.drawImage(tintedRow, 32, 0, 20, 20, -10, -10, 20, 20);
    projectileAnimations['wandAttack'] = {'image': projectileCanvas, 'frames': [[0, 32, 20, 20], [32, 32, 20, 20], [64, 32, 20, 20], [32, 32, 20, 20]], 'fps': 20};
    context.restore();
    context.drawImage(images['gfx/weapons.png'], 38, 363, 10, 10, 0, 64, 20, 20);
    projectileAnimations['throwingAttack'] = {'image': projectileCanvas, 'frames': [[0, 64, 20, 20]]};
    context.fillStyle = 'brown';
    context.fillRect(32, 72, 15, 1);
    context.fillRect(32, 73, 20, 1);
    context.fillStyle = 'white';
    context.fillRect(32, 71, 5, 1);
    context.fillRect(32, 74, 5, 1);
    projectileAnimations['bowAttack'] = {'image': projectileCanvas, 'frames': [[32, 64, 20, 20]]};
    //$('body').append(projectileCanvas);
}

function drawImage(context, image, source, target) {
    context.save();
    context.translate(target.left + target.width / 2, target.top + target.height / 2);
    if (target.xScale || target.yScale) {
        context.scale(ifdefor(target.xScale, 1), ifdefor(target.yScale, 1));
    }
    context.drawImage(image, source.left, source.top, source.width, source.height, -target.width / 2, -target.height / 2, target.width, target.height);
    context.restore();
}

function drawSolidTintedImage(context, image, tint, source, target) {
    // First make a solid color in the shape of the image to tint.
    globalTintContext.save();
    globalTintContext.fillStyle = tint;
    globalTintContext.clearRect(0, 0, source.width, source.height);
    var tintRectangle = {'left': 0, 'top': 0, 'width': source.width, 'height': source.height};
    drawImage(globalTintContext, image, source, tintRectangle)
    globalTintContext.globalCompositeOperation = "source-in";
    globalTintContext.fillRect(0, 0, source.width, source.height);
    drawImage(context, globalTintCanvas, tintRectangle, target);
    globalTintContext.restore();
}

function makeTintedImage(image, tint) {
    var tintCanvas = createCanvas(image.width, image.height);
    var tintContext = tintCanvas.getContext('2d');
    tintContext.clearRect(0, 0, image.width, image.height);
    tintContext.fillStyle = tint;
    tintContext.fillRect(0,0, image.width, image.height);
    tintContext.globalCompositeOperation = "destination-atop";
    tintContext.drawImage(image, 0, 0, image.width, image.height, 0, 0, image.width, image.height);
    var resultCanvas = createCanvas(image.width, image.height);
    var resultContext = resultCanvas.getContext('2d');
    resultContext.drawImage(image, 0, 0, image.width, image.height, 0, 0, image.width, image.height);
    resultContext.globalAlpha = 0.3;
    resultContext.drawImage(tintCanvas, 0, 0, image.width, image.height, 0, 0, image.width, image.height);
    resultContext.globalAlpha = 1;
    return resultCanvas;
}
var globalTintCanvas = createCanvas(400, 300);
var globalTintContext = globalTintCanvas.getContext('2d');
globalTintContext.imageSmoothingEnabled = false;
function drawTintedImage(context, image, tint, amount, source, target) {
    context.save();
    // First make a solid color in the shape of the image to tint.
    globalTintContext.save();
    globalTintContext.fillStyle = tint;
    globalTintContext.clearRect(0, 0, source.width, source.height);
    globalTintContext.drawImage(image, source.left, source.top, source.width, source.height, 0, 0, source.width, source.height);
    globalTintContext.globalCompositeOperation = "source-in";
    globalTintContext.fillRect(0, 0, source.width, source.height);
    globalTintContext.restore();
    // Next draw the untinted image to the target.
    context.drawImage(image, source.left, source.top, source.width, source.height, target.left, target.top, target.width, target.height);
    // Finally draw the tint color on top of the target with the desired opacity.
    context.globalAlpha *= amount; // This needs to be multiplicative since we might be drawing a partially transparent image already.
    context.drawImage(globalTintCanvas, 0, 0, source.width, source.height, target.left, target.top, target.width, target.height);
    context.restore();
}
var globalCompositeCanvas = createCanvas(150, 150);
var globalCompositeContext = globalCompositeCanvas.getContext('2d');
function prepareTintedImage() {
    globalCompositeContext.clearRect(0, 0, globalCompositeCanvas.width, globalCompositeCanvas.height);
}
function getTintedImage(image, tint, amount, sourceRectangle) {
    drawTintedImage(globalCompositeContext, image, tint, amount, sourceRectangle, {'left': 0, 'top': 0, 'width': sourceRectangle.width, 'height': sourceRectangle.height});
    return globalCompositeCanvas;
}

function drawSourceWithOutline(context, source, color, thickness, target) {
    if (source.drawWithOutline) {
        source.drawWithOutline(context, color, thickness, target);
        return;
    }
    context.save();
    var smallTarget = $.extend({}, target);
    for (var dy = -1; dy < 2; dy++) {
        for (var dx = -1; dx < 2; dx++) {
            if (dy == 0 && dx == 0) continue;
            smallTarget.left = target.left + dx * thickness;
            smallTarget.top = target.top + dy * thickness;
            drawSourceAsSolidTint(context, source, color, smallTarget);
        }
    }
    source.draw(context, target);
}
function drawSourceAsSolidTint(context, source, tint, target) {
    // First make a solid color in the shape of the image to tint.
    globalTintContext.save();
    globalTintContext.fillStyle = tint;
    globalTintContext.clearRect(0, 0, source.width, source.height);
    var tintRectangle = {'left': 0, 'top': 0, 'width': source.width, 'height': source.height};
    source.draw(globalTintContext, tintRectangle);
    globalTintContext.globalCompositeOperation = "source-in";
    globalTintContext.fillRect(0, 0, source.width, source.height);
    drawImage(context, globalTintCanvas, tintRectangle, target);
    globalTintContext.restore();
}
function drawOutlinedImage(context, image, color, thickness, source, target) {
    context.save();
    var smallTarget = $.extend({}, target);
    for (var dy = -1; dy < 2; dy++) {
        for (var dx = -1; dx < 2; dx++) {
            if (dy == 0 && dx == 0) continue;
            smallTarget.left = target.left + dx * thickness;
            smallTarget.top = target.top + dy * thickness;
            drawSolidTintedImage(context, image, color, source, smallTarget);
        }
    }
    drawImage(context, image, source, target);
}
function logPixel(context, x, y) {
    var imgd = context.getImageData(x, y, 1, 1);
    console.log(imgd.data)
}
function setupSource(source) {
    source.width = ifdefor(source.width, 48);
    source.height = ifdefor(source.height, 64);
    source.actualHeight = ifdefor(source.actualHeight, source.height);
    source.actualWidth = ifdefor(source.actualWidth, source.width);
    source.xOffset = ifdefor(source.xOffset, 0);
    source.yOffset = ifdefor(source.yOffset, 0);
    source.xCenter = ifdefor(source.xCenter, source.actualWidth / 2 + source.xOffset);
    source.yCenter = ifdefor(source.yCenter, source.actualHeight / 2 + source.yOffset);
    return source;
}

function drawBar(context, x, y, width, height, background, color, percent) {
    percent = Math.max(0, Math.min(1, percent));
    if (background) {
        context.fillStyle = background;
        context.fillRect(x, y, width, height);
    }
    context.fillStyle = color;
    context.fillRect(x + 1, y + 1, Math.floor((width - 2) * percent), height - 2);
}

function drawAbilityIcon(context, icon, target) {
    if (!icon) return;
    // Don't scale up ability icons.
    var width = Math.min(icon.width, target.width);
    var hPadding = (target.width - width) / 2;
    var height = Math.min(icon.height, target.height);
    var vPadding = (target.height - height) / 2;
    var drawTarget = {'left': target.left + Math.ceil(hPadding), 'top': target.top + Math.ceil(vPadding), width, height};
    if (icon.draw) {
        icon.draw(context, drawTarget);
        return;
    }
    // Default icon style is: {'image': images[icon], 'left': 0, 'top': 0, 'width': 34, 'height': 34};
    drawImage(context, icon.image, icon, drawTarget);
}

function drawRectangleBackground(context, rectangle) {
    context.save();
    context.beginPath();
    context.globalAlpha = .9;
    context.fillStyle = 'black';
    fillRectangle(context, rectangle);
    context.globalAlpha = 1;
    context.fillStyle = 'white';
    context.beginPath();
    drawRectangle(context, rectangle);
    drawRectangle(context, shrinkRectangle(rectangle, 1));
    context.fill('evenodd');
    context.restore();
}

function drawTitleRectangle(context, rectangle) {
    context.save();
    context.beginPath();
    context.globalAlpha = .5;
    context.fillStyle = '#999';
    fillRectangle(context, rectangle);
    context.globalAlpha = 1;
    context.beginPath();
    drawRectangle(context, rectangle);
    drawRectangle(context, shrinkRectangle(rectangle, 2));
    context.fill('evenodd');
    context.restore();
}

function jobIcon(column, row) {
    return {'image': requireImage('gfx/jobIcons.png'), 'width': 40, 'height': 40,
        'left': column * 41, 'top': row * 41,
        'draw': drawJobIcon};
}
function drawJobIcon(context, target) {
    drawImage(context, this.image, this, target);
}
var jobIcons = {};
var foolIcon = jobIcons.fool = jobIcon(0, 2);

var blackbeltIcon = jobIcons.blackbelt = jobIcon(0, 1);
var warriorIcon = jobIcons.warrior = jobIcon(1, 1);
var samuraiIcon = jobIcons.samurai = jobIcon(2, 1);

var jugglerIcon = jobIcons.juggler = jobIcon(4, 0);
var rangerIcon = jobIcons.ranger = jobIcon(4, 2);
var sniperIcon = jobIcons.sniper = jobIcon(0, 0);

var priestIcon = jobIcons.priest = jobIcon(0, 3);
var wizardIcon = jobIcons.wizard = jobIcon(4, 3);
var sorcererIcon = jobIcons.sorcerer = jobIcon(1, 3);

var corsairIcon = jobIcons.corsair = jobIcon(2, 3);
var assassinIcon = jobIcons.assassin = jobIcon(3, 1);
var ninjaIcon = jobIcons.ninja = jobIcon(4, 1);

var dancerIcon = jobIcons.dancer = jobIcon(3, 0);
var bardIcon = jobIcons.bard = jobIcon(2, 0);
var sageIcon = jobIcons.sage = jobIcon(1, 0);

var paladinIcon = jobIcons.paladin = jobIcon(2, 2);
var darkknightIcon = jobIcons.darkknight = jobIcon(3, 2);
var enhancerIcon = jobIcons.enhancer = jobIcon(3, 3);

var masterIcon = jobIcons.master = jobIcon(1, 2);
