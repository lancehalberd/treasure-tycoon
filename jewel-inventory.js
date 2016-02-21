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
    var sections = [name];
    if (!jewel.fixed) {
        sections.push('Requires level ' + jewelTierLevels[jewel.tier]);
    }
    sections.push('');
    sections.push('Quality ' + jewel.quality.format(2));
    sections.push('Balance ' + [(300 * jewel.components[0]).format(0), (300 * jewel.components[1]).format(0), (300 * jewel.components[2]).format(0)].join('/'));
    sections.push('');
    sections.push(bonusHelpText(jewel.bonuses, false, null));
    sections.push('');
    var adjacencyBonusText = bonusHelpText(jewel.adjacencyBonuses, false, null);
    if (adjacencyBonusText.length) {
        sections.push(adjacencyBonusText);
        sections.push('');
    }
    var sellValues = [points('coins',jewel.price), points('anima', jewel.price)];
    sections.push('Sell for ' + sellValues.join(' '));
    return sections.join('<br/>');
}
function sellJewel(jewel) {
    if (jewel.fixed) return;
    if ($dragHelper && jewel !== draggedJewel) {
        return;
    }
    // unequip and deletes the jewel.
    destroyJewel(jewel);
    gain('coins', jewel.price);
    gain('anima', jewel.price);
    updateJewelCraftingOptions();
}

var overVertex = null;
var overJewel = null;
var draggedJewel = null;
var draggingBoardJewel = null;
$('body').on('mousedown', function (event) {
    if (draggedJewel || draggingBoardJewel) {
        stopJewelDrag();
        return;
    }
    if (!overJewel) {
        return;
    }
    if (overJewel.fixed) {
        // Don't allow users to rotate the entire board. This can be confusing,
        // and they may accidentally trigger this trying to rotate other jewels.
        if (overVertex && overJewel.confirmed) {
            return;
        }
        draggingBoardJewel = overJewel;
        return;
    }
    draggedJewel = overJewel;
    clearAdjacentJewels(draggedJewel);
    updateAdjacencyBonuses(draggedJewel);
    if ($popup) {
        $popup.remove();
        checkToShowJewelToolTip();
    }
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
    redrawInventoryJewel(draggedJewel);
    updateDragHelper();
    dragged = false;
});
$('body').on('mousemove', '.js-jewel', function (event) {
    if (draggedJewel || $dragHelper || draggingBoardJewel) {
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
            return;
        }
    }
    if (isPointInPoints(relativePosition, points)) {
        overJewel = jewel;
    }
});
$('body').on('mousemove', '.js-skillCanvas', function (event) {
    if (draggedJewel || $dragHelper || draggingBoardJewel) {
        return;
    }
    overJewel = null;
    overVertex = null;
    var character = $(this).closest('.js-playerPanel').data('character');
    var relativePosition = relativeMousePosition(this);
    var jewels = character.board.jewels;
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
    var jewels = character.board.fixed.concat();
    if (character.board.boardPreview) {
        jewels = jewels.concat(character.board.boardPreview.fixed);
    }
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
    if (draggingBoardJewel) dragBoard();
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
});
function dragBoard() {
    var character = draggingBoardJewel.character;
    var boardShapes = [];
    if (character.board.boardPreview) {
        boardShapes = character.board.boardPreview.fixed.map(jewelToShape).concat(character.board.boardPreview.spaces);
    }
    if (draggingBoardJewel.confirmed) {
        boardShapes = boardShapes.concat(character.board.jewels.map(jewelToShape)).concat(character.board.fixed.map(jewelToShape)).concat(character.board.spaces);
    }
    var mousePosition = relativeMousePosition(character.jewelsCanvas);
    // Translate the board so the fixed jewel is centered under the mouse.
    if (overVertex === null) {
        var v = vector(draggingBoardJewel.shape.center, mousePosition);
        if (draggingBoardJewel.confirmed) {
            var bounds = getBounds(allPoints(boardShapes));
            v[0] = Math.min(character.boardCanvas.width / 2 - bounds.left, v[0]);
            v[0] = Math.max(character.boardCanvas.width / 2 - bounds.left - bounds.width, v[0]);
            v[1] = Math.min(character.boardCanvas.height / 2 - bounds.top, v[1]);
            v[1] = Math.max(character.boardCanvas.height / 2 - bounds.top - bounds.height, v[1]);
        }
        translateShapes(boardShapes, v);
        dragged = true;
        if (draggingBoardJewel.confirmed) {
            character.boardContext.clearRect(0, 0, character.boardCanvas.width, character.boardCanvas.height);
            drawBoardBackground(character.boardContext, character.board);
        }
        return;
    }
    // Rotate the board
    var points = draggingBoardJewel.shape.points;
    var center = draggingBoardJewel.shape.center;
    var centerToMouse = vector(center, mousePosition);
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
            rotateShapes(boardShapes, center, theta * Math.PI / 6);
            overVertex = rotatePoint(overVertex, center, theta * Math.PI / 6);
            if (draggingBoardJewel.confirmed) {
                character.boardContext.clearRect(0, 0, character.boardCanvas.width, character.boardCanvas.height);
                drawBoardBackground(character.boardContext, character.board);
            }
        }
    }
}
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
    var jewels = jewel.character.board.jewels;
    var index = jewels.indexOf(jewel);
    if (index >= 0) {
        jewels.splice(index, 1);
        updateAdventurer(jewel.character.adventurer);
    }
}

function stopJewelDrag() {
    if (draggingBoardJewel) stopBoardDrag();
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
    if (collision(draggedJewel.$canvas, $('.js-sellItem'))) {
        sellJewel(draggedJewel);
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

function stopBoardDrag() {
    var character = draggingBoardJewel.character;
    if (!draggingBoardJewel.confirmed) {
        snapBoardToBoard(character.board.boardPreview, character.board);
    }
    draggingBoardJewel = null;
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
    if (jewelTierLevels[draggedJewel.tier] <= character.adventurer.level
        && snapToBoard(draggedJewel.shape, character.board)) {
        draggedJewel.character = character;
        draggedJewel.$item.detach();
        draggedJewel.$canvas.detach();
        character.board.jewels.push(draggedJewel);
        overJewel = draggedJewel;
        updateAdjacentJewels(draggedJewel);
        draggedJewel = null;
        $dragHelper = null;
        updateAdventurer(character.adventurer);
        return true;
    }
    updateAdjacentJewels(draggedJewel);
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
    removeFromBoard(jewel);
    jewel.character = null;
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
    var otherShapes = board.fixed.map(jewelToShape).concat(board.jewels.map(jewelToShape));
    var vectors = [];
    var checkedPoints = shape.points;
    var otherPoints = allPoints(otherShapes);
    for (var rotation = 0; rotation < 360; rotation += 30) {
        shape.rotate(rotation);
        for (var i = 0; i < checkedPoints.length; i++) {
            for (var j = 0; j < otherPoints.length; j++) {
                var d2 = distanceSquared(checkedPoints[i], otherPoints[j]);
                if (rotation) d2 += 100;
                if (rotation % 60) d2 += 200;
                vectors.push({d2: d2, vector: vector(checkedPoints[i], otherPoints[j]), rotation: rotation});
            }
        }
        shape.rotate(-rotation);
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
        shape.rotate(vectors[i].rotation);
        shape.translate(vectors[i].vector[0], vectors[i].vector[1]);
        if (checkForCollision([shape], otherShapes) || !isOnBoard(shape, board)) {
            shape.translate(-vectors[i].vector[0], -vectors[i].vector[1]);
            shape.rotate(-vectors[i].rotation);
        } else {
            return true;
        }
    }
    return false;
}
function snapBoardToBoard(boardA, boardB) {
    var shapesA = boardA.spaces;
    var shapesB = boardB.spaces;
    var vectors = [];
    var checkedPoints = allPoints(shapesA);
    var otherPoints = allPoints(shapesB);
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
    for (var i = 0; i < vectors.length; i++) {
        translateShapes(shapesA, vectors[i].vector);
        if (checkForCollision(shapesA, shapesB)) {
            translateShapes(shapesA, [-vectors[i].vector[0], -vectors[i].vector[1]]);
        } else {
            translateShapes(boardA.fixed.map(jewelToShape), vectors[i].vector);
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