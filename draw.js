
function drawPlayer() {
    spriteContext.clearRect(0, 0, screenSize[0], screenSize[1])
    drawAnimalSprite(spriteContext, x - screenX, y - screenY, playerAnimal, now(), rotation);
}
function drawMap() {
    var grid = level.grid;
    var tileSize = getTileSize();
    mapContext.clearRect(0, 0, screenSize[0], screenSize[1]);
    var cornerX = Math.floor(screenX / tileSize);
    var cornerY = Math.floor(screenY / tileSize);
    for (var ty = 0; ty < Math.max(screenSize[1] / tileSize) + 1; ty ++) {
        for (var tx = 0; tx < Math.max(screenSize[0] / tileSize) + 1; tx ++) {
            if (cornerY + ty >= grid.length || cornerX + tx >= grid[0].length) {
                break;
            }
            var value = grid[cornerY + ty][cornerX + tx];
            var xOffset = (value % 4)* tileSourceSize[0];
            var yOffset = Math.floor(value / 4) * tileSourceSize[1];
            /** @type context */
            mapContext.drawImage(pathCanvas, xOffset, yOffset , tileSourceSize[0], tileSourceSize[1],
                              tx * tileSize - (screenX % tileSize), ty * tileSize - (screenY % tileSize), tileSize, tileSize);
        }
    }
    mapContext.globalCompositeOperation = 'source-in';
    if (level.backLevel) {
        drawGrid(backContext, level.backLevel, '#888');
        mapContext.drawImage(backCanvas, 0, 0 , screenSize[0], screenSize[1], 0, 0, screenSize[0], screenSize[1]);
    } else {
        mapContext.fillStyle = '#FFF';
        mapContext.fillRect(0, 0, screenSize[0], screenSize[1]);
    }
    mapContext.globalCompositeOperation = 'source-over';
    var pt = tileSize / 4;
    level.portals.forEach(function (portal) {
        mapContext.fillStyle = portal.color;
        if (portal.dy == -1) {
            mapContext.fillRect(portal.x * tileSize - screenX + pt, portal.y * tileSize - screenY, tileSize - 2 * pt, pt);
        }
        if (portal.dy == 1) {
            mapContext.fillRect(portal.x * tileSize - screenX + pt, (portal.y + 1) * tileSize - pt - screenY, tileSize - 2 * pt, pt);
        }
        if (portal.dx == -1) {
            mapContext.fillRect(portal.x * tileSize - screenX, portal.y * tileSize + pt - screenY, pt, tileSize - 2 * pt);
        }
        if (portal.dx == 1) {
            mapContext.fillRect((portal.x + 1) * tileSize - pt - screenX, portal.y * tileSize + pt - screenY, pt, tileSize - 2 * pt);
        }
    });
    mapContext.fillStyle = '#822';
    mapContext.strokeStyle = '#242';
    mapContext.lineWidth = 5;
    mapContext.beginPath();
    stones.forEach(function (stone) {
        mapContext.rect(stone.x + 5, stone.y + 5, baseTileSize * stone.l.scale - 10, baseTileSize * stone.l.scale - 10);
    });
    mapContext.fill();
    mapContext.stroke();
}
function drawGrid(context, level, color) {
    var grid = level.grid;
    var tileSize = baseTileSize * level.scale;
    context.fillStyle = color;
    context.fillRect(0, 0, screenSize[0], screenSize[1]);
    context.globalAlpha = 1;
    var cornerX = Math.floor(screenX / tileSize);
    var cornerY = Math.floor(screenY / tileSize);
    for (var ty = 0; ty < Math.max(screenSize[1] / tileSize) + 1; ty ++) {
        for (var tx = 0; tx < Math.max(screenSize[0] / tileSize) + 1; tx ++) {
            if (cornerY + ty >= grid.length || cornerX + tx >= grid[0].length) {
                break;
            }
            var value = grid[cornerY + ty][cornerX + tx];
            var xOffset = (value % 4)* tileSourceSize[0];
            var yOffset = Math.floor(value / 4) * tileSourceSize[1];
            /** @type context */
            context.drawImage(colorPathCanvas, xOffset, yOffset , tileSourceSize[0], tileSourceSize[1],
                              tx * tileSize - (screenX % tileSize), ty * tileSize - (screenY % tileSize), tileSize, tileSize);
        }
    }
    context.globalAlpha = 0.2;
    var pt = tileSize / 4;
    level.portals.forEach(function (portal) {
        context.fillStyle = portal.color;
        if (portal.dy == -1) {
            context.fillRect(portal.x * tileSize - screenX + pt, portal.y * tileSize - screenY, tileSize - 2 * pt, pt);
        }
        if (portal.dy == 1) {
            context.fillRect(portal.x * tileSize - screenX + pt, (portal.y + 1) * tileSize - pt - screenY, tileSize - 2 * pt, pt);
        }
        if (portal.dx == -1) {
            context.fillRect(portal.x * tileSize - screenX, portal.y * tileSize + pt - screenY, pt, tileSize - 2 * pt);
        }
        if (portal.dx == 1) {
            context.fillRect((portal.x + 1) * tileSize - pt - screenX, portal.y * tileSize + pt - screenY, pt, tileSize - 2 * pt);
        }
    });
}

/**
 * Draw an animal sprite to a given context.
 *
 * @param {context} context  The context to draw to
 * @param {Number} x  The x coordinate to draw to
 * @param {Number} y  The y coordinate to draw to
 * @param {TileSource} tileSource  The row to grab the sprite from the creatureSprite sheet
 * @param {Number} width  How wide to draw the sprite.
 * @param {Number} height  How tall to draw the sprite.
 * @param {Number} rotation  The rotation to draw the sprite at
 */
function drawTileRotated(context, x, y, tileSource, size, rotation) {
    var tileSize = tileSource.tileSize;
    context.translate(x + size / 2, y + size / 2);
    context.rotate(rotation);
    context.drawImage(tileSource.image,
        tileSource.tileX * tileSize, tileSource.tileY * tileSize, tileSize, tileSize,
        -size / 2, -size / 2, size, size);
    context.rotate(-rotation);
    context.translate(-x - size / 2, -y - size / 2);
}

/**
 * Draw an animal sprite to a given context.
 *
 * @param {context} context  The context to draw to
 * @param {Number} x  The x coordinate to draw to
 * @param {Number} y  The y coordinate to draw to
 * @param {Animal} animal  The animal to draw
 * @param {Number} time  The time in milliseconds
 * @param {Number} rotation  The rotation to draw the sprite at
 */
function drawAnimalSprite(context, x, y, animal, time, rotation){ //temporarily just the penguin. srcY determines what row (0 is penguin)
    var frameDuration = 200;
    var sourceX = (Math.floor(time / frameDuration) % animal.frames);
    var playerSize = basePlayerSize * level.scale;
    drawTileRotated(context, x, y, new TileSource(images['creatureSprites.png'], sourceX, animal.index, playerSourceSize), playerSize, rotation);
}


/**
 * Class that holds information for the source of a tile.
 *
 * @param {Image} image  Canvas or Image element that can be drawn from
 * @param {Number} tileX
 * @param {Number} tileY
 * @param {Number} tileSize
 */
function TileSource(image, tileX, tileY, tileSize) {
    this.image = image;
    this.tileX = tileX;
    this.tileY = tileY;
    this.tileSize = tileSize ? tileSize : tileSourceSize[0];
}