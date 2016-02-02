function makeJewel(tier, shapeType, components, quality) {
    var componentsSum = 0;
    var componentBonuses = {};
    var jewelType = 0;
    for (var i = 0; i < 3; i++) {
        componentsSum += components[i];
    }
    var RGB = [0, 0, 0];
    var minActiveComponent = 1;
    var maxActiveComponent = 0;
    var totalActiveCompontent = 0;
    var numberOfActiveComponents = 0;
    for (var i = 0; i < 3; i++) {
        components[i] /= componentsSum;
        // A compontent is not activy if it is less than 30% of the jewel.
        if (components[i] < .3) continue;
        numberOfActiveComponents++;
        if (i == 0) componentBonuses['+strength'] = components[i];
        else if (i == 1) componentBonuses['+dexterity'] = components[i];
        else componentBonuses['+intelligence'] = components[i];
        totalActiveCompontent += components[i];
        minActiveComponent = Math.min(minActiveComponent, components[i]);
        maxActiveComponent = Math.max(maxActiveComponent, components[i]);
        jewelType += (1 << i);
    }
    var qualifierIndex = 3;
    var qualifierBonus = 1;
    if (jewelType === 7) {
        // Diamonds quality is based on how evenly components are
        if (maxActiveComponent - minActiveComponent <= .01) {
            qualifierIndex = 0;
        } else {
            qualifierIndex = Math.min(4, Math.ceil((maxActiveComponent - minActiveComponent) / .02));
        }
        qualifierBonus = [3, 2, 1.5, 1, .5][qualifierIndex];
    } else {
        // Other jewels are based on the total % of active components
        if (totalActiveCompontent >= .99) {
            qualifierIndex = 0;
        } else if (totalActiveCompontent >= .95) {
            qualifierIndex = 1;
        } else if (totalActiveCompontent >= .9) {
            qualifierIndex = 2;
        } else if (totalActiveCompontent >= .8) {
            qualifierIndex = 3;
        } else {
            qualifierIndex = 4;
        }
        qualifierBonus = [1.2, 1.1, 1.05, 1, .9][qualifierIndex];
    }
    for (var i = 0; i < 3; i++) {
        if (numberOfActiveComponents == 1) {
            RGB[i] = Math.round(200 * components[i]);
        } else if (numberOfActiveComponents == 2) {
            RGB[i] = Math.round(290 * components[i]);
        } else {
            RGB[i] = Math.round(500 * components[i]);
        }
        if (components[i] >= .3) {
            RGB[i] = Math.min(255, Math.max(0, RGB[i] + [50, 30, 10, -10, -20][qualifierIndex]));
        } else {
            RGB[i] = Math.min(255, Math.max(0, RGB[i] + [0, 10, 20, 40, 60][qualifierIndex]));
        }
    }
    var shapeDefinition = shapeDefinitions[shapeType][0];
    var area = shapeDefinition.area;
    var jewel = {
        'tier': tier,
        'shapeType': shapeType,
        'components': components,
        'componentBonuses': componentBonuses,
        'qualifierName': ['Perfect', 'Brilliant', 'Shining', '', 'Dull'][qualifierIndex],
        'qualifierBonus': qualifierBonus,
        'jewelType': jewelType,
        'quality': quality,
        'shape': makeShape(0, 0, 0, shapeDefinition).scale(30),
        'area': area,
        'price': Math.round(Math.pow(10, tier) * quality * quality * (5 - qualifierIndex) * area)
    };
    var typeIndex = 0;
    jewel.shape.color = arrayToCssRGB(RGB);
    jewel.canvas = createCanvas(68, 68);
    jewel.context = jewel.canvas.getContext("2d");
    // Jewels can be displayed in 3 different states:
    // Drawn directly inside of the canvas for a character's jewel board.
    // Drawn on the jewel.$canvas canvas while being dragged by the user.
    // Drawn on the jewel.$canvas canvas while it is inside jewel.$item and
    // being displayed in grid in the jewel-inventory panel.
    jewel.$canvas = $(jewel.canvas);
    jewel.$canvas.data('jewel', jewel);
    jewel.$item = $tag('div', 'js-jewel jewel').append(jewel.canvas);
    jewel.$item.data('jewel', jewel);
    jewel.character = null;
    updateJewel(jewel);
    return jewel;
}
function makeFixedJewel(shape, character, ability) {
    shape.color = '#333333';
    return {
        'shape': shape,
        'fixed': true,
        'character': character,
        'helpText': abilityHelpText(ability)
    };
}
// Used like: arrayOfShapes = arrayOfJewels.map(jewelToShape)
function jewelToShape(jewel) {
    return jewel.shape;
}
function arrayToCssRGB(array) {
    return '#' + toHex(array[0]) + toHex(array[1]) + toHex(array[2]);
}
function toHex(d) {
    return  ("0"+(Number(d).toString(16))).slice(-2).toUpperCase();
}
function updateJewel(jewel) {
    var shapeDefinition = shapeDefinitions[jewel.shapeType][0];
    var bonusMultiplier = jewel.quality * shapeDefinition.area * jewel.qualifierBonus;
    jewel.bonuses = copy(jewel.componentBonuses);
    $.each(jewel.bonuses, function (key, value) {
        jewel.bonuses[key] = value * bonusMultiplier;
    });
    jewel.helpText = jewelHelpText(jewel);
    jewel.shape.setCenterPosition(jewel.canvas.width / 2, jewel.canvas.height / 2);
}

var jewelDefinitions = [
    {'name': 'Onyx'},
    {'name': 'Ruby'},
    {'name': 'Emerald'},
    {'name': 'Topaz'},
    {'name': 'Saphire'},
    {'name': 'Amethyst'},
    {'name': 'Aquamarine'},
    {'name': 'Diamond'}
];
var jewelTierDefinitions = [
    [0], [1.1, .1], [1.8, .2], [2.6, .3], [3.5, .4], [4.5, .5]
];
var jewelTierLevels = [0, 1, 10, 20, 40, 60];

var basicShapeTypes = ['triangle', 'diamond', 'trapezoid'];
var triangleShapes = ['triangle', 'diamond', 'trapezoid', 'hexagon'];
