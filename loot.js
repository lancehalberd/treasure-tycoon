function treasurePopup(x, y, vx, vy, delay, text, color, font) {
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
            var context = character.context;
            context.fillStyle = ifdefor(color, "yellow");
            context.font = ifdefor(font, "20px sans-serif");
            context.textAlign = 'center'
            context.fillText(text, self.x - character.cameraX, self.y);
        }
    };
    return self;
}

function coinTreasurePopup(coin, x, y, vx, vy, delay) {
    var self = {
        'x': x, 'y': y, 'vx': vx, 'vy': vy, 't': 0, 'done': false, 'delay': delay,
        'update': function (character) {
            if (delay-- > 0) return
            self.x += self.vx;
            self.y += self.vy;
            self.vy++;
            self.t += 1;
            self.done = self.t > 40;
        },
        'draw': function (character) {
            if (delay > 0) return
            character.context.drawImage(coin.image, coin.x, coin.y, coin.width, coin.height,
                self.x - coin.width / 2 - character.cameraX, self.y - coin.height / 2, coin.width, coin.height);
        }
    };
    return self;
}

function pointsLootDrop(type, amount) {
    var index = ['coins', 'MP', 'RP'].indexOf(type);
    var color = ['#fff', '#fc4', '#c4f'][index];
    var font = (20 + 2* index) + 'px sans-serif';
    return {
        'gainLoot': function (character) {
            gain(type, Math.round(amount * (1 + character.adventurer.increasedItems)));
        },
        'addTreasurePopup': function (character, x, y, vx, vy, delay) {
            if (type === 'coins') {
                var total = amount;
                var nextDelay = delay;
                var index = coins.length - 1;
                while (total > 0 && index >= 0) {
                    while (coins[index].value <= total) {
                        total -= coins[index].value;
                        character.treasurePopups.push(coinTreasurePopup(coins[index], x, y, Math.random() * 10 - 5, -10, nextDelay));
                        nextDelay += 5;
                    }
                    index--;
                }
            } else {
                character.treasurePopups.push(treasurePopup(x, y, vx, vy, delay, '+' + amount, color, font));
            }
        }
    }
}

function pointLoot(type, range) {
    return {
        'type': 'pointLoot',
        'pointType': type,
        'generateLootDrop': function () {
        return pointsLootDrop(type, Random.range(range[0], range[1]));
    }};
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
            popupShape.setCenterPosition(self.x - character.cameraX, self.y);
            var lightSource = relativeMousePosition(character.canvas);
            drawJewel(character.context, popupShape, lightSource, 'white');
        }
    };
    return self;
}

function jewelLootDrop(jewel) {
    return {
        'gainLoot': function (character) {
            gainJewel(jewel);
        },
        'addTreasurePopup': function (character, x, y, vx, vy, delay) {
            character.treasurePopups.push(jewelTreasurePopup(jewel, x, y, vx, vy, delay));
        }
    }
}
function gainJewel(jewel) {
    $('.js-jewel-inventory').append(jewel.$item);
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
var simpleJewelLoot = jewelLoot(basicShapeTypes, [1, 1], [[90, 90], [16, 20], [7, 10]], true);
var simpleRubyLoot = jewelLoot(basicShapeTypes, [1, 1], [[90, 100], [5, 10], [5, 10]], false);
var simpleEmeraldLoot = jewelLoot(basicShapeTypes, [1, 1], [[5, 10], [90,100], [5, 10]], false);
var simpleSaphireLoot = jewelLoot(basicShapeTypes, [1, 1], [[5, 10], [5, 10], [90, 100]], false);


function firstChest(loot) {
    return treasureChest(loot, closedChestSource, openChestSource);
}
function backupChest(loot) {
    return treasureChest(loot, openChestSource, openChestSource);
}
var closedChestSource, openChestSource; // initialized in initializeLevels
function treasureChest(loot, closedImage, openImage) {
    var self = {
        'x': 0,
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
                    character.adventurer.stunned = character.time + 1;
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
                        var vy = -Math.sin(theta) * 2;
                        drop.addTreasurePopup(character, self.x + 32 + vx * 20, 240 - 80 + vy * 20, vx, vy, delay += 5);
                        theta += thetaRange / Math.max(1, self.loot.length - 1);
                    });
                }
            }
        },
        'draw': function (context, x, y) {
            var frameOffset = self.open ? 64 : 0;
            context.drawImage(images['gfx/treasureChest.png'], frameOffset, 0, 64, 64, x, y, 64, 64);
        },
        'clone': function() {
            return treasureChest(copy(loot), closedImage, openImage);
        }
    };
    return self;
}
