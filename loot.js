/*function treasurePopup(x, y, vx, vy, delay, text, color, font) {
    var self = {
        'x': x, 'y': y, 'vx': vx, 'vy': vy, 't': 0, 'done': false, 'delay': delay,
        'update': function (character) {
            if (delay-- > 0) return;
            self.x += self.vx;
            self.y += self.vy;
            self.t += 1
            self.done = self.t > 30;
        },
        'draw': function (character) {
            if (delay > 0) return
            mainContext.fillStyle = ifdefor(color, "yellow");
            mainContext.font = ifdefor(font, "20px sans-serif");
            mainContext.textAlign = 'center'
            mainContext.fillText(text, self.x - character.cameraX, self.y);
        }
    };
    return self;
}*/

function coinTreasurePopup(coin, x, y, vx, vy, delay) {
    var self = {
        'x': x, 'y': y, 'vx': vx, 'vy': vy, 't': 0, 'done': false, 'delay': delay,
        'update': function (character) {
            if (delay-- > 0) return
            self.x += self.vx;
            self.y += self.vy;
            self.vy--;
            self.t += 1;
            self.done = self.t > 40;
        },
        'draw': function (character) {
            if (delay > 0) return
            mainContext.drawImage(coin.image, coin.x, coin.y, coin.width, coin.height,
                self.x - coin.width / 2 - character.cameraX, groundY - self.y - coin.height / 2, coin.width, coin.height);
        }
    };
    return self;
}

function coinsLootDrop(amount) {
    return {
        'gainLoot': function (character) {
            gain('coins', Math.round(amount * (1 + character.adventurer.increasedDrops)));
        },
        'addTreasurePopup': function (character, x, y, vx, vy, delay) {
            var total = Math.round(amount * (1 + character.adventurer.increasedDrops));
            var nextDelay = delay;
            var index = coins.length - 1;
            var drops = 0;
            while (total > 0 && index >= 0) {
                // Getting a single large coin drop feels underwhelming, so if no coins have dropped yet
                // break single coins into smaller drops.
                while (coins[index].value <= total && (drops || coins[index].value < total || total < 5) && drops < 50) {
                    total -= coins[index].value;
                    character.treasurePopups.push(coinTreasurePopup(coins[index], x, y, Math.random() * 10 - 5, 10, nextDelay));
                    nextDelay += 5;
                    drops++;
                }
                index--;
            }
        }
    }
}
function coinsLoot(range) {
    return {
        'type': 'coinsLoot',
        'generateLootDrop': function () {
        return coinsLootDrop(Random.range(range[0], range[1]));
    }};
}

function animaTreasurePopup(coin, x, y, vx, vy, delay) {
    var self = {
        'x': x, 'y': y, 'vx': vx, 'vy': vy, 't': 0, 'done': false, 'delay': delay,
        'update': function (character) {
            if (delay-- > 0) return
            self.x += self.vx;
            self.y += self.vy;
            if (self.y > (character.adventurer.height / 2)) {
                self.vy--;
            } else {
                self.vy++;
            }
            if (self.x > character.adventurer.x) {
                self.vx--;
            } else {
                self.vx++;
            }
            self.t += 1;
            self.done = self.t > 40;
        },
        'draw': function (character) {
            if (delay > 0 || self.x < character.adventurer.x + 16) return
            mainContext.drawImage(coin.image, coin.x, coin.y, coin.width, coin.height,
                self.x - coin.width / 2 - character.cameraX, groundY - self.y - coin.height / 2, coin.width, coin.height);
        }
    };
    return self;
}
function animaLootDrop(amount) {
    return {
        'gainLoot': function (character) {
            gain('anima', Math.round(amount * (1 + character.adventurer.increasedDrops)));
        },
        'addTreasurePopup': function (character, x, y, vx, vy, delay) {
            var total = Math.round(amount * (1 + character.adventurer.increasedDrops));
            var nextDelay = delay;
            var index = animaDrops.length - 1;
            var drops = 0;
            while (total > 0 && index >= 0) {
                // Getting a single large anima drop feels underwhelming, so if no anima has dropped yet
                // break single anima into smaller drops.
                while (animaDrops[index].value <= total && (drops || animaDrops[index].value < total || total < 5) && drops < 50) {
                    total -= animaDrops[index].value;
                    character.treasurePopups.push(animaTreasurePopup(animaDrops[index], x, y, 10 + Math.random() * 5, Math.random() * 10 - 5, nextDelay));
                    nextDelay += 5;
                    drops++;
                }
                index--;
            }
        }
    }
}

function jewelTreasurePopup(jewel, x, y, vx, vy, delay) {
    // We need to duplicate the shape so we can draw it on the adventure panel
    // independent of drawing it in the inventory.
    var popupShape = jewel.shape.clone().scale(.5);
    popupShape.color = jewel.shape.color;
    var self = {
        'x': x, 'y': y, 'vx': vx, 'vy': vy, 't': 0, 'done': false, 'delay': delay,
        'update': function (character) {
            if (delay-- > 0) return
            self.x += self.vx;
            self.y += self.vy;
            self.t += 1;
            self.done = self.t > 40;
        },
        'draw': function (character) {
            if (delay > 0) return
            popupShape.setCenterPosition(self.x - character.cameraX, groundY - self.y);
            var lightSource = relativeMousePosition(mainCanvas);
            drawJewel(mainContext, popupShape, lightSource, 'white');
        }
    };
    return self;
}

function jewelLootDrop(jewel) {
    return {
        'gainLoot': function (character) {
            gainJewel(jewel);
            return jewel;
        },
        'addTreasurePopup': function (character, x, y, vx, vy, delay) {
            character.treasurePopups.push(jewelTreasurePopup(jewel, x, y, vx, vy, delay));
        }
    }
}
function gainJewel(jewel) {
    addJewelToInventory(jewel.$item);
}

function jewelLoot(shapes, tiers, components, permute) {
    return {
        'type': 'jewelLoot',
        'generateLootDrop': function () {
        return jewelLootDrop(createRandomJewel(shapes, tiers, components, permute));
    }};
}
function createRandomJewel(shapes, tiers, components, permute) {
    var shapeType = Random.element(shapes);
    var tier = Random.range(tiers[0], tiers[1]);
    var tierDefinition = jewelTierDefinitions[tier]
    var quality = tierDefinition[0] - tierDefinition[1] + Math.random() * 2 * tierDefinition[1];
    components = components.map(function (component) { return Random.range(component[0], component[1]);});
    return makeJewel(tier, shapeType, permute ? Random.shuffle(components) : components, quality);
}
var smallJewelLoot = jewelLoot(['triangle'], [1, 1], [[90, 90], [16, 20], [7, 10]], true);
var simpleJewelLoot = jewelLoot(basicShapeTypes, [1, 1], [[90, 90], [16, 20], [7, 10]], true);
var simpleRubyLoot = jewelLoot(basicShapeTypes, [1, 1], [[90, 100], [5, 10], [5, 10]], false);
var simpleEmeraldLoot = jewelLoot(basicShapeTypes, [1, 1], [[5, 10], [90,100], [5, 10]], false);
var simpleSaphireLoot = jewelLoot(basicShapeTypes, [1, 1], [[5, 10], [5, 10], [90, 100]], false);

var loots = {
    'smallJewelLoot': smallJewelLoot,
    'simpleJewelLoot': simpleJewelLoot,
    'simpleRubyLoot': simpleRubyLoot,
    'simpleEmeraldLoot': simpleEmeraldLoot,
    'simpleSaphireLoot': simpleSaphireLoot
};

function firstChest(loot) {
    return treasureChest(loot, closedChestSource, openChestSource);
}
function backupChest(loot) {
    return treasureChest(loot, openChestSource, openChestSource);
}
var closedChestSource, openChestSource; // initialized when images load.
function treasureChest(loot, closedImage, openImage) {
    var self = {
        'x': 0,
        'y': 0,
        'type': 'chest',
        'width': 64,
        'loot': loot,
        'closedImage': closedImage,
        'openImage': openImage,
        'open': false,
        'update': function (character) {
            if (!self.open && character.adventurer.x + character.adventurer.width >= self.x) {
                if (character.adventurer.stunned) {
                    character.adventurer.x = self.x - character.adventurer.width;
                } else {
                    character.adventurer.stunned = character.adventurer.time + 1;
                    self.open = true;
                    // the loot array is an array of objects that can generate
                    // specific loot drops. Iterate over each one, generate a
                    // drop and then give the loot to the player and
                    // display it on the screen.
                    var thetaRange = Math.min(2 * Math.PI / 3, (loot.length - 1) * Math.PI / 6);
                    var theta = (Math.PI - thetaRange) / 2;
                    var delay = 0;
                    self.loot.forEach(function (loot) {
                        var drop = loot.generateLootDrop();
                        drop.gainLoot(character);
                        var vx =  Math.cos(theta) * 2;
                        var vy = Math.sin(theta) * 2;
                        drop.addTreasurePopup(character, self.x + vx * 20, self.y + 64, vx, vy, delay += 5);
                        theta += thetaRange / Math.max(1, self.loot.length - 1);
                    });
                }
            }
        },
        'draw': function (character) {
            var frameOffset = self.open ? 64 : 0;
            mainContext.drawImage(images['gfx/treasureChest.png'], frameOffset, 0, 64, 64,
                (self.x - 32) - character.cameraX, groundY - self.y - 64, 64, 64);
        },
        'clone': function() {
            return treasureChest(copy(loot), closedImage, openImage);
        }
    };
    return self;
}
