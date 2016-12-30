var originalJewelScale = 30;
var displayJewelShapeScale = 30;
var jewelShapeScale = 30;

function makeJewel(tier, shapeType, components, quality) {
    var shapeDefinition = shapeDefinitions[shapeType][0];
    var shape = makeShape(0, 0, 0, shapeDefinition).scale(displayJewelShapeScale)
    jewel = makeJewelProper(tier, shape, components, quality);
    jewel.shape.setCenterPosition(jewel.canvas.width / 2, jewel.canvas.height / 2);
    return jewel;
}
function makeJewelProper(tier, shape, components, quality) {
    var componentsSum = 0;
    var componentBonuses = {};
    var jewelType = 0;
    var savedComponents = [];
    var normalize = false;
    for (var i = 0; i < 3; i++) {
        componentsSum += components[i];
        savedComponents[i] = components[i];
        if (components[i] > 1) normalize = true;
    }
    var RGB = [0, 0, 0];
    var minActiveComponent = 1;
    var maxActiveComponent = 0;
    var totalActiveCompontent = 0;
    var numberOfActiveComponents = 0;
    for (var i = 0; i < 3; i++) {
        components[i] /= componentsSum;
        if (normalize) savedComponents[i] /= componentsSum;
        // A component is not activy if it is less than 30% of the jewel.
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
            RGB[i] = Math.min(255, Math.max(0, RGB[i] + [50, 10, 5, 0, -10][qualifierIndex]));
        } else {
            RGB[i] = Math.min(255, Math.max(0, RGB[i] + [0, 40, 45, 50, 70][qualifierIndex]));
        }
    }
    var shapeDefinition = shapeDefinitions[shape.key][0];
    var area = shapeDefinition.area;
    var jewel = {
        'tier': tier,
        'shapeType': shape.key,
        'components': savedComponents,
        'componentBonuses': componentBonuses,
        'qualifierName': ['Perfect', 'Brilliant', 'Shining', '', 'Dull'][qualifierIndex],
        'qualifierBonus': qualifierBonus,
        'jewelType': jewelType,
        'quality': quality,
        'shape': shape,
        'area': area,
        'price': Math.round(10 * Math.pow(quality, 6) * (5 - qualifierIndex) * area),
        'adjacentJewels': [],
        'adjacencyBonuses': {}
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
    var bonusMultiplier = jewel.quality * shapeDefinition.area * jewel.qualifierBonus;
    jewel.bonuses = copy(jewel.componentBonuses);
    $.each(jewel.bonuses, function (key, value) {
        jewel.bonuses[key] = value * bonusMultiplier;
    });
    jewel.helpMethod = jewelHelpText;
    return jewel;
}
function clearAdjacentJewels(jewel) {
    while (jewel.adjacentJewels.length) {
        var adjacentJewel = jewel.adjacentJewels.pop();
        var jewelIndex = adjacentJewel.adjacentJewels.indexOf(jewel);
        if (jewelIndex >= 0) {
            adjacentJewel.adjacentJewels.splice(jewelIndex, 1);
        }
        updateAdjacencyBonuses(adjacentJewel);
    }
}
function updateAdjacentJewels(jewel) {
    clearAdjacentJewels(jewel);
    if (!jewel.character) {
        updateAdjacencyBonuses(jewel);
        return;
    }
    var jewels = jewel.character.board.jewels.concat(jewel.character.board.fixed);
    for (var i = 0; i < jewels.length; i++) {
        if (jewels[i] === jewel) continue;
        var count = 0;
        for (var j = 0; j < jewel.shape.points.length && count < 2; j++) {
            if (isPointInPoints(jewel.shape.points[j], jewels[i].shape.points)) {
                count++
            }
        }
        if (count < 2) {
            count = 0;
            for (var j = 0; j < jewels[i].shape.points.length && count < 2; j++) {
                if (isPointInPoints(jewels[i].shape.points[j], jewel.shape.points)) {
                    count++
                }
            }
        }
        if (count == 2) {
            jewel.adjacentJewels.push(jewels[i]);
            jewels[i].adjacentJewels.push(jewel);
            updateAdjacencyBonuses(jewels[i]);
        }
    }
    updateAdjacencyBonuses(jewel);
    removeToolTip();
}
function updateAdjacencyBonuses(jewel) {
    jewel.adjacencyBonuses = {};
    var matches = 0;
    var typesSeen = {};
    typesSeen[jewel.jewelType] = true;
    var uniqueTypes = 0;
    var shapeDefinition = shapeDefinitions[jewel.shapeType][0];
    var coefficient = jewel.quality * shapeDefinition.area;
    // Pure gems qualifier bonus is applied to their own adjacency bonuses
    if (jewel.jewelType === 1 || jewel.jewelType === 2 || jewel.jewelType === 4) {
        coefficient *= jewel.qualifierBonus;
    }
    var adjacentQualifierBonus = 1;
    for (var i = 0; i < jewel.adjacentJewels.length; i++) {
        var adjacent = jewel.adjacentJewels[i];
        if (adjacent.jewelType === jewel.jewelType) {
            matches++;
        }
        if (!typesSeen[adjacent.jewelType]) {
            typesSeen[adjacent.jewelType] = true;
            uniqueTypes++;
        }
        // Dual gems qualifier bonus is applied to adjacent gems' adjacency bonuses
        if (adjacent.jewelType === 3 || adjacent.jewelType === 5 || adjacent.jewelType === 6) {
            // These are additive, otherwise they could result in 3x multiplier on hexagons.
            adjacentQualifierBonus += (adjacent.qualifierBonus - 1);
        }
    }
    coefficient *= adjacentQualifierBonus;
    var resonanceBonus = coefficient * [0, 1, 2, 3, 5, 8, 13, 21, 34][matches];
    var contrastBonus = coefficient * [0, 1, 2, 3, 5, 8, 13, 21, 34][uniqueTypes];
    switch(jewel.jewelType) {
        case 0:
            if (resonanceBonus) {
                jewel.adjacencyBonuses['+reducedDivinityCost'] = resonanceBonus / 100;
            }
            if (contrastBonus) {
                jewel.adjacencyBonuses['+strength'] = contrastBonus;
                jewel.adjacencyBonuses['+dexterity'] = contrastBonus;
                jewel.adjacencyBonuses['+intelligence'] = contrastBonus;
            }
            break;
        case 1:
            if (resonanceBonus) jewel.adjacencyBonuses['%maxHealth'] = resonanceBonus / 100;
            if (contrastBonus) jewel.adjacencyBonuses['%weaponDamage'] = contrastBonus / 100;
            break;
        case 2:
            if (resonanceBonus) jewel.adjacencyBonuses['%evasion'] = resonanceBonus / 100;
            if (contrastBonus) jewel.adjacencyBonuses['%attackSpeed'] = contrastBonus / 100;
            break;
        case 4:
            if (resonanceBonus) {
                jewel.adjacencyBonuses['%block'] = resonanceBonus / 100;
                jewel.adjacencyBonuses['%magicBlock'] = resonanceBonus / 100;
            }
            if (contrastBonus) jewel.adjacencyBonuses['%accuracy'] = contrastBonus / 100;
            break;
        case 3:
            if (resonanceBonus) jewel.adjacencyBonuses['%critChance'] = resonanceBonus / 100;
            if (contrastBonus) jewel.adjacencyBonuses['+critDamage'] = contrastBonus / 100;
            break;
        case 5:
            if (resonanceBonus) jewel.adjacencyBonuses['+healthRegen'] = resonanceBonus / 10;
            if (contrastBonus) jewel.adjacencyBonuses['+healthGainOnHit'] = contrastBonus / 10;
            break;
        case 6:
            if (resonanceBonus) jewel.adjacencyBonuses['+magicBlock'] = resonanceBonus / 10;
            if (contrastBonus) jewel.adjacencyBonuses['+weaponMagicDamage'] = contrastBonus / 10;
            break;
        case 7:
            // This used to be increased experience, but we don't have xp any more
            if (resonanceBonus || contrastBonus) jewel.adjacencyBonuses['+increasedDrops'] = (ifdefor(resonanceBonus, 0) + ifdefor(contrastBonus, 0)) / 100;
            break;
    }
}
function updateJewelBonuses(character) {
    character.jewelBonuses = {'bonuses': {}};
    character.board.jewels.concat(character.board.fixed).forEach(function (jewel) {
        if (jewel.bonuses) {
            $.each(jewel.bonuses, function (bonusKey, bonusValue) {
                character.jewelBonuses.bonuses[bonusKey] = bonusValue + ifdefor(character.jewelBonuses.bonuses[bonusKey], 0);
            })
        }
        $.each(jewel.adjacencyBonuses, function (bonusKey, bonusValue) {
            character.jewelBonuses.bonuses[bonusKey] = bonusValue + ifdefor(character.jewelBonuses.bonuses[bonusKey], 0);
        })
    });
    if (character === state.selectedCharacter) {
        $('.js-jewelBonuses .js-content').empty().append(bonusSourceHelpText(character.jewelBonuses, character.adventurer));
    }
}
function makeFixedJewel(shape, character, ability) {
    shape.color = '#333333';
    return {
        'shape': shape,
        'shapeType': shape.key,
        'quality': 1,
        'jewelType': 0,
        'fixed': true,
        'disabled': false,
        'character': character,
        'ability': ability,
        'helpMethod': function () {
            var coreHelpText = abilityHelpText(ability, character.adventurer);
            var bonusText = bonusSourceHelpText({'bonuses': this.adjacencyBonuses}, state.selectedCharacter.adventurer);
            if (bonusText) coreHelpText += '<br/><br/>' + bonusText;
            if (!this.confirmed) return coreHelpText;
            if (this.disabled) {
                return 'Disabled <br> Double click to enable <br><br> ' + coreHelpText;
            }
            return coreHelpText + '<br><br>Double click to disable this ability.';
        },
        'adjacentJewels': [],
        'adjacencyBonuses': {}
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
