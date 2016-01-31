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

function pointsLootDrop(type, amount) {
    var index = ['IP', 'MP', 'RP', 'UP'].indexOf(type);
    var color = ['#fff', '#fc4', '#c4f', '#4cf'][index];
    var font = (20 + 2* index) + 'px sans-serif';
    return {
        'gainLoot': function () {
            gain(type, amount);
        },
        'addTreasurePopup': function (character, x, y, vx, vy, delay) {
            character.treasurePopups.push(treasurePopup(x, y, vx, vy, delay, '+' + amount, color, font));
        }
    }
}

function pointLoot(type, range) {
    return {'generateLootDrop': function () {
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
        'gainLoot': function () {
            $('.js-jewel-inventory').append(jewel.$item);
        },
        'addTreasurePopup': function (character, x, y, vx, vy, delay) {
            character.treasurePopups.push(jewelTreasurePopup(jewel, x, y, vx, vy, delay));
        }
    }
}

function jewelLoot(shapes, tiers, components, permute) {
    return {'generateLootDrop': function () {
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
var simpleJewelLoot = jewelLoot(basicShapeTypes, [1, 1], [[80, 100], [5,20], [5, 20]], true);
var simpleRubyLoot = jewelLoot(basicShapeTypes, [1, 1], [[80, 100], [5,20], [5, 20]], false);
var simpleEmeraldLoot = jewelLoot(basicShapeTypes, [1, 1], [[5, 20], [80,100], [5, 20]], false);
var simpleSaphireLoot = jewelLoot(basicShapeTypes, [1, 1], [[5, 20], [5,20], [80, 100]], false);