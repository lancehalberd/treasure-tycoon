
function coinTreasurePopup(coin, x, y, vx, vy, delay) {
    var self = {
        'x': x, 'y': y, 'vx': vx, 'vy': vy, 't': 0, 'done': false, 'delay': delay,
        'update': function (area) {
            if (delay-- > 0) return
            self.x += self.vx;
            self.y += self.vy;
            self.vy--;
            self.t += 1;
            self.done = self.t > 40;
        },
        'draw': function (area) {
            if (delay > 0) return
            mainContext.drawImage(coin.image, coin.x, coin.y, coin.width, coin.height,
                self.x - coin.width / 2 - area.cameraX, groundY - self.y - coin.height / 2, coin.width, coin.height);
        }
    };
    return self;
}

function coinsLootDrop(amount) {
    return {
        'gainLoot': function (hero) {
            gain('coins', Math.round(amount * (1 + hero.increasedDrops)));
        },
        'addTreasurePopup': function (hero, x, y, vx, vy, delay) {
            var total = Math.round(amount * (1 + hero.increasedDrops));
            var nextDelay = delay;
            var index = coins.length - 1;
            var drops = 0;
            while (total > 0 && index >= 0) {
                // Getting a single large coin drop feels underwhelming, so if no coins have dropped yet
                // break single coins into smaller drops.
                while (coins[index].value <= total && (drops || coins[index].value < total || total < 5) && drops < 50) {
                    total -= coins[index].value;
                    hero.area.treasurePopups.push(coinTreasurePopup(coins[index], x, y, Math.random() * 10 - 5, 10, nextDelay));
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

function animaTreasurePopup(hero, coin, x, y, vx, vy, delay) {
    var self = {
        'x': x, 'y': y, 'vx': vx, 'vy': vy, 't': 0, 'done': false, 'delay': delay,
        'update': function (area) {
            if (delay-- > 0) return
            self.x += self.vx;
            self.y += self.vy;
            if (self.y > (hero.height / 2)) {
                self.vy--;
            } else {
                self.vy++;
            }
            if (self.x > hero.x) {
                self.vx--;
            } else {
                self.vx++;
            }
            self.t += 1;
            self.done = self.t > 40;
        },
        'draw': function (area) {
            if (delay > 0 || self.x < hero.x + 16) return
            mainContext.drawImage(coin.image, coin.x, coin.y, coin.width, coin.height,
                self.x - coin.width / 2 - area.cameraX, groundY - self.y - coin.height / 2, coin.width, coin.height);
        }
    };
    return self;
}
function animaLootDrop(amount) {
    return {
        'gainLoot': function (hero) {
            gain('anima', Math.round(amount * (1 + hero.increasedDrops)));
        },
        'addTreasurePopup': function (hero, x, y, vx, vy, delay) {
            var total = Math.round(amount * (1 + hero.increasedDrops));
            var nextDelay = delay;
            var index = animaDrops.length - 1;
            var drops = 0;
            while (total > 0 && index >= 0) {
                // Getting a single large anima drop feels underwhelming, so if no anima has dropped yet
                // break single anima into smaller drops.
                while (animaDrops[index].value <= total && (drops || animaDrops[index].value < total || total < 5) && drops < 50) {
                    total -= animaDrops[index].value;
                    hero.area.treasurePopups.push(animaTreasurePopup(hero, animaDrops[index], x, y, 10 + Math.random() * 5, Math.random() * 10 - 5, nextDelay));
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
        'update': function (area) {
            if (delay-- > 0) return
            self.x += self.vx;
            self.y += self.vy;
            self.t += 1;
            self.done = self.t > 40;
        },
        'draw': function (area) {
            if (delay > 0) return
            popupShape.setCenterPosition(self.x - area.cameraX, groundY - self.y);
            var lightSource = relativeMousePosition(mainCanvas);
            drawJewel(mainContext, popupShape, lightSource, 'white');
        }
    };
    return self;
}

function jewelLootDrop(jewel) {
    return {
        'gainLoot': function (hero) {
            gainJewel(jewel);
            return jewel;
        },
        'addTreasurePopup': function (hero, x, y, vx, vy, delay) {
            hero.area.treasurePopups.push(jewelTreasurePopup(jewel, x, y, vx, vy, delay));
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

function messageCharacter(character, text) {
    var actor = character.adventurer;
    appendTextPopup(character.area, {'value': text, 'duration': 70, 'x': actor.x + 32, y: actor.height, z: actor.z, color: 'white', fontSize: 15, 'vx': 0, 'vy': .5, 'gravity': .05}, true);
}

function adventureBoardPreview(boardPreview, character) {
    var self = {
        'x': 0,
        'y': 0,
        'type': 'button',
        'width': 150,
        'height': 150,
        'boardPreview': boardPreview,
        'update': function (area) {
        },
        'isOver': function (x, y) {
            for (var shape of self.boardPreview.fixed.map(jewelToShape).concat(self.boardPreview.spaces)) {
                if (isPointInPoints([x, y], shape.points)) {
                    return true;
                }
            }
            return false;
        },
        'onClick': function (character) {
            centerShapesInRectangle(self.boardPreview.fixed.map(jewelToShape).concat(self.boardPreview.spaces), rectangle(0, 0, character.boardCanvas.width, character.boardCanvas.height));
            snapBoardToBoard(self.boardPreview, character.board);
            character.board.boardPreview = self.boardPreview;
            // This will show the confirm skill button if this character is selected.
            updateConfirmSkillConfirmationButtons();
            setContext('jewel');
        },
        'draw': function (area) {
            // Remove the preview from the character if we draw it to the adventure screen since they both use the same coordinate variables
            // and displaying it in the adventure screen will mess up the display of it on the character's board. I think this will be okay
            // since they can't look at both screens at once.
            character.board.boardPreview = null;
            updateConfirmSkillConfirmationButtons();
            centerShapesInRectangle(self.boardPreview.fixed.map(jewelToShape).concat(self.boardPreview.spaces), rectangle(self.x - area.cameraX - 5, groundY - self.y -5, 10, 10));
            drawBoardPreview(mainContext, [0, 0], self.boardPreview, true);
        },
        'helpMethod': function () {
            return "<b>Divine Blessing</b><hr><p>Click on this Jewel Board Augmentation to preview adding it to this hero's Jewel Board.</p><p>A hero must augment their Jewel Board to learn new abilities and Level Up</p>";
        }
    };
    return self;
}

function iconButton(iconSource, width, height, onClick, helpText) {
    var self = {
        'x': 0,
        'y': 0,
        'type': 'button',
        'width': width,
        'height': height,
        'update': function (area) {
            self.left = self.x - area.cameraX - self.width / 2;
            self.top = groundY - self.y - self.height / 2;
        },
        'onClick': onClick,
        'draw': function (area) {
            drawImage(mainContext, iconSource.image, iconSource, self);
        },
        'helpMethod': function () {
            return ifdefor(helpText, '');
        }
    };
    return self;
}

function objectText(text) {
    var self = {
        'x': 0,
        'y': 0,
        'type': 'text',
        'isOver': function (x, y) {return false;},
        'update': function (area) {},
        'draw': function (area) {
            mainContext.fillStyle = 'white';
            mainContext.textBaseline = "middle";
            mainContext.textAlign = 'center'
            mainContext.font = "30px sans-serif";
            mainContext.fillText(text, self.x - area.cameraX, groundY - self.y);
        }
    };
    return self;
}
