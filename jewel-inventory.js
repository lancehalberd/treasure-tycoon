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
            RGB[i] = 50 + Math.round(200 * components[i]);
        } else if (numberOfActiveComponents == 2) {
            RGB[i] = 50 + Math.round(290 * components[i]);
        } else {
            RGB[i] = 50 + Math.round(500 * components[i]);
        }
        RGB[i] = Math.min(255, Math.max(0, RGB[i] - [0, 5, 10, 20, 40][qualifierIndex]));
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
    jewel.$item.attr('helpText', jewelHelpText(jewel));
    jewel.shape.setCenterPosition(jewel.canvas.width / 2, jewel.canvas.height / 2);
}
function redrawInventoryJewel(jewel) {
    //centerShapesInRectangle([jewel.shape], rectangle(0, 0, jewel.canvas.width, jewel.canvas.height));
    jewel.context.clearRect(0, 0, jewel.canvas.width, jewel.canvas.height);
    drawJewel(jewel.context, jewel.shape, relativeMousePosition(jewel.canvas));
    if (overVertex && (draggedJewel == jewel || overJewel == jewel)) {
        jewel.context.strokeStyle = 'black';
        jewel.context.lineWidth = 1;
        jewel.context.beginPath();
        jewel.context.arc(overVertex[0], overVertex[1], 4, 0, Math.PI * 2);
        jewel.context.stroke();
    }
}
function redrawInventoryJewels() {
    $('.js-jewel').each(function (index, element) {
        redrawInventoryJewel($(element).data('jewel'));
    });
}
function jewelHelpText(jewel) {
    var jewelDefinition = jewelDefinitions[jewel.jewelType];
    var name = jewelDefinition.name;
    if (jewel.qualifierName) {
        name = jewel.qualifierName + ' ' + name;
    }
    name = 'Tier ' + jewel.tier + ' ' + name;
    var sections = [name, ''];
    sections.push('Quality ' + jewel.quality.format(2));
    sections.push('Balance ' + [(300 * jewel.components[0]).format(0), (300 * jewel.components[1]).format(0), (300 * jewel.components[2]).format(0)].join('/'));
    sections.push('');
    sections.push(bonusHelpText(jewel.bonuses, true));
    sections.push('');
    points = [jewel.price + ' IP', jewel.price + ' MP'];
    sections.push('Sell for ' + points.join(' '));
    return sections.join('<br/>');
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
var jewelTypes = [];

var basicShapeTypes = ['triangle', 'diamond', 'trapezoid'];
var triangleShapes = ['triangle', 'diamond', 'trapezoid', 'hexagon'];
function jewelDrop(shapes, tiers, components) {
    return {'shapes': shapes, 'tiers': tiers, 'components': components};
}
function createJewelFromJewelDrop(jewelDrop) {
    var shapeType = Random.element(jewelDrop.shapes);
    var tier = Random.range(jewelDrop.tiers[0], jewelDrop.tiers[1]);
    var tierDefinition = jewelTierDefinitions[tier]
    var quality = tierDefinition[0] - tierDefinition[1] + Math.random() * 2 * tierDefinition[1];
    var components = jewelDrop.components.map(function (component) { return Random.range(component[0], component[1]);});
    return makeJewel(tier, shapeType, Random.shuffle(components), quality);
}

var simpleJewelDrop = jewelDrop(basicShapeTypes, [1, 1], [[80, 100],[5,20],[5, 20]]);
//simpleJewelDrop = jewelDrop(basicShapeTypes, [1, 1], [[80, 100],[0,1],[0, 1]]);
//simpleJewelDrop = jewelDrop(basicShapeTypes, [1, 5], [[1, 100],[1,100],[1, 100]]);
function addJewelToInventory() {
    var jewel = createJewelFromJewelDrop(simpleJewelDrop);
    $('.js-jewel-inventory').prepend(jewel.$item);
}

var overVertex = null;
var overJewel = null;
var draggedJewel = null;
$('body').on('mousedown', function (event) {
    if (draggedJewel) {
        stopJewelDrag();
        return;
    }
    if (!overJewel) {
        return;
    }
    draggedJewel = overJewel;
    if (overVertex) {
        return;
    }
    overJewel = null;
    // Remove this jewel from the board it is in while dragging.
    removeFromBoard(draggedJewel);
    $dragHelper = draggedJewel.$canvas;
    draggedJewel.$item.detach();
    draggedJewel.shape.setCenterPosition(draggedJewel.canvas.width / 2, draggedJewel.canvas.height / 2);
    $dragHelper.css('position', 'absolute');
    $('.js-mouseContainer').append($dragHelper);
    updateDragHelper();
    redrawInventoryJewel(draggedJewel);
    dragged = false;
});
$('body').on('mousemove', '.js-jewel', function (event) {
    if (draggedJewel || $dragHelper) {
        return;
    }
    overJewel = null;
    overVertex = null;
    var jewel = $(this).data('jewel');
    var points = jewel.shape.points;
    var relativePosition = relativeMousePosition(jewel.canvas);
    for (var j = 0; j < points.length; j++) {
        if (distanceSquared(points[j], relativePosition) < 25) {
            overJewel = jewel;
            overVertex = points[j].concat();
            redrawInventoryJewel(jewel);
            return;
        }
    }
    if (isPointInPoints(relativePosition, points)) {
        overJewel = jewel;
        redrawInventoryJewel(jewel);
    }
});
$('body').on('mousemove', '.js-skillCanvas', function (event) {
    if (draggedJewel || $dragHelper) {
        return;
    }
    overJewel = null;
    overVertex = null;
    var character = $(this).closest('.js-playerPanel').data('character');
    var relativePosition = relativeMousePosition(this);
    var jewels = character.adventurer.board.jewels;
    for (var i = 0; i < jewels.length; i++) {
        var jewel = jewels[i];
        var points = jewel.shape.points;
        for (var j = 0; j < points.length; j++) {
            if (distanceSquared(points[j], relativePosition) < 25) {
                overJewel = jewel;
                overVertex = points[j].concat();
                return;
            }
        }
        if (isPointInPoints(relativePosition, points)) {
            overJewel = jewel;
        }
    }
});
$('body').on('mousemove', function () {
    checkIfStillOverJewel();
    if (!draggedJewel) {
        return;
    }
    if (overVertex !== null) {
        var points = draggedJewel.shape.points;
        var center = draggedJewel.shape.center;
        var centerToMouse = null;
        if (draggedJewel.character) {
            centerToMouse = vector(center, relativeMousePosition(draggedJewel.character.jewelsCanvas));
        } else {
            centerToMouse = vector(center, relativeMousePosition(draggedJewel.canvas));
        }
        var centerToVertex = vector(center, overVertex);
        var dotProduct = centerToVertex[0] * centerToMouse[0] + centerToVertex[1] * centerToMouse[1];
        var mag1 = magnitude(centerToVertex);
        var mag2 = magnitude(centerToMouse);
        var cosine = dotProduct / mag1 / mag2;
        if (mag1 * mag2 > tolerance && cosine <= 1) {
            var theta = Math.acos(cosine);
            if (centerToVertex[0] * centerToMouse[1] - centerToVertex[1] * centerToMouse[0] < 0) {
                theta = -theta;
            }
            theta = Math.round(theta / (Math.PI / 6));
            if (theta != 0) {
                draggedJewel.shape.rotate(theta * 30);
                //rotateShapes([draggedJewel.shape], center, theta * Math.PI / 6);
                overVertex = rotatePoint(overVertex, center, theta * Math.PI / 6);
            }
        }
    }
})
function checkIfStillOverJewel() {
    if (!overJewel) return;
    var relativePosition
    if (overJewel.character) {
        relativePosition = relativeMousePosition(overJewel.character.jewelsCanvas);
    } else {
        relativePosition = relativeMousePosition(overJewel.canvas);
    }
    var points = overJewel.shape.points;
    for (var j = 0; j < points.length; j++) {
        if (distanceSquared(points[j], relativePosition) < 25) {
            return;
        }
    }
    if (isPointInPoints(relativePosition, overJewel.shape.points)) {
        return;
    }
    overJewel = null;
}
$('body').on('mouseout', '.js-jewel', function (event) {
    redrawInventoryJewel($(this).data('jewel'));
});
$('body').on('mouseup', function (event) {
    if (overVertex || dragged) {
        stopJewelDrag();
    }
});

function removeFromBoard(jewel) {
    if (!jewel.character) return;
    var jewels = jewel.character.adventurer.board.jewels;
    jewels.splice(jewels.indexOf(jewel), 1);
    updateAdventurer(jewel.character.adventurer);
}

function stopJewelDrag() {
    if (!draggedJewel) return;
    if (overVertex) {
        overVertex = null;
        if (draggedJewel.character) {
            removeFromBoard(draggedJewel);
            if (equipJewel(draggedJewel.character)) {
                checkToShowJewelToolTip();
                return;
            }
            draggedJewel.shape.setCenterPosition(draggedJewel.canvas.width / 2, draggedJewel.canvas.height / 2);
            draggedJewel.$canvas.css('position', '');
            draggedJewel.$item.append(draggedJewel.$canvas);
            $('.js-jewel-inventory').append(draggedJewel.$item);
            draggedJewel.character = null;
        }
        overJewel = draggedJewel;
        draggedJewel = null;
        $dragHelper = null;
        return;
    }
    draggedJewel.character = null;
    // Drop the jewel on a skill board if it is over one.
    $('.js-skillCanvas').each(function (index, element) {
        if (collision(draggedJewel.$canvas, $(element))) {
            var targetCharacter = $(element).closest('.js-playerPanel').data('character');
            var relativePosition = relativeMousePosition(targetCharacter.jewelsCanvas);
            draggedJewel.shape.setCenterPosition(relativePosition[0], relativePosition[1]);
            if (equipJewel(targetCharacter)) {
                checkToShowJewelToolTip();
                updateJewelCraftingOptions();
                return false;
            }
        }
        return true;
    });
    if (!draggedJewel) return;
    $craftingSlot = $getClosestElement(draggedJewel.$canvas, $('.js-jewelCraftingSlot'), 60);
    if ($craftingSlot) {
        var $existingItem = $craftingSlot.find('.js-jewel');
        if ($existingItem.length) {
            $existingItem.detach();
            $('.js-jewel-inventory').append($existingItem);
        }
        appendDraggedJewelToElement($craftingSlot);
    }
    appendDraggedJewelToElement($('.js-jewel-inventory'));
}
function appendDraggedJewelToElement($element) {
    if (!draggedJewel) return;
    appendJewelToElement(draggedJewel, $element);
    overJewel = draggedJewel;
    draggedJewel = null;
    $dragHelper = null;
    updateJewelCraftingOptions();
}
function appendJewelToElement(jewel, $element) {
    jewel.shape.setCenterPosition(jewel.canvas.width / 2, jewel.canvas.height / 2);
    jewel.$item.append(jewel.$canvas);
    $element.append(jewel.$item);
    jewel.$canvas.css('position', '');
}
function equipJewel(character) {
    if (snapToBoard(draggedJewel.shape, character.adventurer.board)) {
        draggedJewel.character = character;
        draggedJewel.$item.detach();
        draggedJewel.$canvas.detach();
        character.adventurer.board.jewels.push(draggedJewel);
        overJewel = draggedJewel;
        draggedJewel = null;
        $dragHelper = null;
        updateAdventurer(character.adventurer);
        return true;
    }
    return false;
}
function updateJewelCraftingOptions() {
    var jewelA = $('.js-jewelCraftingSlot').first().find('.js-jewel').data('jewel');
    var jewelB = $('.js-jewelCraftingSlot').last().find('.js-jewel').data('jewel');
    if (!jewelA && !jewelB) {
        $('.js-jewelCraftingButton').hide();
        return;
    }
    if (jewelA && jewelB) {
        $('.js-jewelCraftingButton').html('Fuse Jewels').show();
        var fusedShape = getFusedShape(jewelA, jewelB);
        if (fusedShape) {
            $('.js-jewelCraftingButton').attr('helptext', 'Click to fuse these jewels together').removeClass('disabled');
        } else {
            $('.js-jewelCraftingButton').attr('helptext', 'These jewels cannot be fused.').addClass('disabled');
        }
        return;
    }
    var jewel = jewelA || jewelB;
    $('.js-jewelCraftingButton').html('Split Jewel').show();
    if (jewel.shapeType == 'triangle' || jewel.shapeType == 'rhombus') {
        $('.js-jewelCraftingButton').attr('helptext', 'This jewel cannot be split.').addClass('disabled');
    } else {
        $('.js-jewelCraftingButton').attr('helptext', 'Click to split this jewel into smaller jewels').removeClass('disabled');
    }
}

function getFusedShape(jewelA, jewelB) {
    var totalArea = jewelA.area + jewelB.area;
    var fusedKey = null;
    $.each(shapeDefinitions, function (key, data) {
        if (Math.abs(data[0].area - totalArea) < tolerance) {
            fusedKey = key;
            return false;
        }
        return true;
    });
    return fusedKey ? shapeDefinitions[fusedKey][0] : null;
}

$('.js-jewelCraftingButton').on('click', function () {
    var jewelA = $('.js-jewelCraftingSlot').first().find('.js-jewel').data('jewel');
    var jewelB = $('.js-jewelCraftingSlot').last().find('.js-jewel').data('jewel');
    if (!jewelA && !jewelB) return;
    if (jewelA && jewelB) fuseJewels(jewelA, jewelB);
    else splitJewel(jewelA || jewelB);
});
function fuseJewels(jewelA, jewelB) {
    var fusedShape = getFusedShape(jewelA, jewelB);
    if (!fusedShape) return; // No fused shape exists for this combination of jewels.
    var tier = Math.max(jewelA.tier, jewelB.tier);
    var quality = (jewelA.quality * jewelA.area + jewelB.quality * jewelB.area) / fusedShape.area;
    var components = [];
    for (var i = 0;i < 3; i++) {
        components[i] = jewelA.components[i] * jewelA.area + jewelB.components[i] * jewelB.area;
    }
    var newJewel = makeJewel(tier, fusedShape.key, components, quality);
    destroyJewel(jewelA);
    destroyJewel(jewelB);
    appendJewelToElement(newJewel, $('.js-jewelCraftingSlot').first());
    updateJewelCraftingOptions();
}
function destroyJewel(jewel) {
    jewel.$item.data('jewel', null).remove();
    jewel.$canvas.data('jewel', null).remove();
}
function splitJewel(jewel) {
    if (jewel.shapeType === 'triangle' || jewel.shapeType === 'rhombus') return; // Jewels are too small to split
    var shapeDefinitionA, shapeDefinitionB;
    if (jewel.shapeType === 'hexagon') {
        shapeDefinitionA = shapeDefinitionB = shapeDefinitions['trapezoid'][0];
    } else if (jewel.shapeType === 'trapezoid') {
        shapeDefinitionA = shapeDefinitions['diamond'][0];
        shapeDefinitionB = shapeDefinitions['triangle'][0];
    } else if (jewel.shapeType === 'diamond') {
        shapeDefinitionA = shapeDefinitionB = shapeDefinitions['triangle'][0];
    } else {
        shapeDefinitionA = shapeDefinitionB = shapeDefinitions['rhombus'][0];
    }
    var qualityA, qualityB;
    if (Math.random() < .5) {
        var qualityA = jewel.quality * .99 * (1.1 + Math.random() * .1);
        var qualityB = (jewel.quality * .99 * jewel.area - qualityA * shapeDefinitionA.area ) / shapeDefinitionB.area;
    } else {
        var qualityB = jewel.quality * .99 * (1.1 + Math.random() * .1);
        var qualityA = (jewel.quality * .99 * jewel.area - qualityB * shapeDefinitionB.area ) / shapeDefinitionA.area;
    }
    var componentsA = [];
    var componentsB = [];
    for (var i = 0;i < 3; i++) {
        componentsA[i] = jewel.components[i] * (.9 + Math.random() * .2);
        componentsB[i] = (jewel.components[i] * jewel.area - componentsA[i] * shapeDefinitionA.area) / shapeDefinitionB.area;
    }
    var newJewelA = makeJewel(jewel.tier, shapeDefinitionA.key, componentsA, qualityA);
    var newJewelB = makeJewel(jewel.tier, shapeDefinitionB.key, componentsB, qualityB);
    destroyJewel(jewel);
    appendJewelToElement(newJewelA, $('.js-jewelCraftingSlot').first());
    appendJewelToElement(newJewelB, $('.js-jewelCraftingSlot').last());
    updateJewelCraftingOptions();
}
function snapToBoard(shape, board) {
    var otherShapes = board.fixed.concat(board.jewels.map(function (jewel) { return jewel.shape;}));
    var vectors = [];
    var checkedPoints = shape.points;
    var otherPoints = allPoints(otherShapes);
    for (var i = 0; i < checkedPoints.length; i++) {
        for (var j = 0; j < otherPoints.length; j++) {
            var d2 = distanceSquared(checkedPoints[i], otherPoints[j]);
            vectors.push({d2: d2, vector: vector(checkedPoints[i], otherPoints[j])});
        }
    }
    if (!vectors.length) {
        return false;
    }
    vectors.sort(function (a, b) { return a.d2 - b.d2;});
    // If we aren't close to other shapes and there is no collision, don't
    // move this shape.
    if (vectors[0].d2 > 1000 && !checkForCollision([shape], otherShapes)) {
        return false;
    }
    for (var i = 0; i < vectors.length; i++) {
        shape.translate(vectors[i].vector[0], vectors[i].vector[1]);
        if (checkForCollision([shape], otherShapes) || !isOnBoard(shape, board)) {
            shape.translate(-vectors[i].vector[0], -vectors[i].vector[1]);
        } else {
            return true;
        }
    }
    return false;
}
/**
 * Checks if the given shape is entirely on the spaces provided by the board.
 *
 * Currently this is done by intersecting the shape with each space and adding
 * up the areas of all such intersections. If that sums to the area of the shape,
 * it must entirely be on the board.
 */
function isOnBoard(shape, board) {
    var area = computeArea(shape);
    var areaOnBoard = 0;
    for (var i = 0; i < board.spaces.length; i++) {
        areaOnBoard += getIntersectionArea(shape, board.spaces[i]);
        if (areaOnBoard + tolerance >= area) {
            return true;
        }
    }
    return false;
}