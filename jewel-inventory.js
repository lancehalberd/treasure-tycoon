function makeJewel(shapeType, jewelType, quality) {
    var jewel = {
        'shapeType': shapeType,
        'jewelType': jewelType,
        'quality': quality,
        'shape': makeShape(0, 0, 0, shapeDefinitions[shapeType][0]).scale(30)
    };
    jewel.shape.color = jewelDefinitions[jewelType].color;
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
function updateJewel(jewel) {
    var shapeDefinition = shapeDefinitions[jewel.shapeType][0];
    var jewelDefinition = jewelDefinitions[jewel.jewelType];
    var bonusMultiplier = jewel.quality * shapeDefinition.area;
    jewel.bonuses = copy(jewelDefinition.bonuses);
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
    var name = jewelDefinition.name + ' Jewel';
    var sections = [name, ''];
    sections.push(bonusHelpText(jewel.bonuses, true));
    /*var points = [sellValue(item) + ' IP'];
    var total = item.prefixes.length + item.suffixes.length;
    if (total) {
        if (total <= 2) points.push(sellValue(item) * total + ' MP');
        else points.push(sellValue(item) * (total - 2) + ' RP');
    }
    sections.push('Sell for ' + points.join(' '));*/
    return sections.join('<br/>');
}

var jewelDefinitions = {
    'ruby': {'name': 'Ruby', 'color': 'red', 'bonuses': {'+strength': 1}},
    'emerald': {'name': 'Emerald', 'color': 'green', 'bonuses': {'+dexterity': 1}},
    'saphire': {'name': 'Saphire', 'color': 'blue', 'bonuses': {'+intelligence': 1}},
    'amethyst': {'name': 'Amethyst', 'color': 'purple', 'bonuses': {'+healthRegen': 1}},
    'diamond': {'name': 'Diamond', 'color': '#bbdddd', 'bonuses': {'+critDamage': .1}},
    'topaz': {'name': 'Topaz', 'color': 'orange', 'bonuses': {'%attackSpeed': .01}}
}
var jewelTypes = [];
$.each(jewelDefinitions, function (key) {
    jewelTypes.push(key);
});

function addJewelToInventory() {
    var jewel = makeJewel(Random.element(shapeTypes), Random.element(jewelTypes), 1);
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
    updateDragHelper();
    $('.js-mouseContainer').append($dragHelper);
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
                return false;
            }
        }
        return true;
    });
    if (!draggedJewel) return;
    draggedJewel.shape.setCenterPosition(draggedJewel.canvas.width / 2, draggedJewel.canvas.height / 2);
    // Return the jewel to the inventory slot if it was not placed in a valid location.
    $dragHelper.css('position', '');
    draggedJewel.$item.append(draggedJewel.$canvas);
    $('.js-jewel-inventory').append(draggedJewel.$item);
    overJewel = draggedJewel;
    draggedJewel = null;
    $dragHelper = null;
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