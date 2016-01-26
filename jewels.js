
/*
var overShape = null;
var overVertex = null;
var draggedShapes = [];
var selectedShapes = [];
var lastPosition = [0, 0];
var startBox = null, endBox = null;
$('.js-mouseContainer').on('mousedown', function (event) {
    if (!overShape) {
        startBox = endBox = mousePosition.concat();
        selectedShapes = [];
        return;
    }
    if (selectedShapes.indexOf(overShape) < 0) {
        selectedShapes = [overShape];
    }
    if (event.which == 3) {
        for (var i = 0; i < selectedShapes.length; i++) {
            shapes.push(selectedShapes[i].clone());
        }
    }
    draggedShapes = selectedShapes;
});
$('.js-mouseContainer').on('mouseup', function() {
    if (draggedShapes.length) {
        snapToOtherShapes(draggedShapes);
    }
    endBox = startBox = null;
    draggedShapes = [];
    setMouseOver();
});
$('.js-mouseContainer').on('mousemove', function() {
    if (draggedShapes.length) {
        if (overVertex !== null) {
            var points = allPoints(draggedShapes).map(transformPoint);
            var center = averagePoint(points);
            var centerToVertex = vector(center, overVertex);
            var centerToMouse = vector(center, mousePosition);
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
                    rotateShapes(draggedShapes, untransformPoint(center), theta * Math.PI / 6);
                    overVertex = rotatePoint(overVertex, center, theta * Math.PI / 6);
                }
            }
        } else {
            translateShapes(draggedShapes, [(mousePosition[0] - lastPosition[0]) / scale, (mousePosition[1] - lastPosition[1]) / scale]);
        }
    } else if (!mouseDown) {
        setMouseOver();
    } else {
        endBox = mousePosition.concat();
        setSelected();
    }
    lastPosition = mousePosition.concat();
});
function setMouseOver() {
    overShape = null;
    overVertex = null;
    for (var i = shapes.length - 1; i >= 0; i--) {
        var points = shapes[i].points.map(transformPoint);
        for (var j = 0; j < points.length; j++) {
            if (distanceSquared(points[j], mousePosition) < 30) {
                overShape = shapes[i];
                overVertex = points[j].concat();
                return;
            }
        }
        if (isMouseOver(points)) {
            overShape = shapes[i];
            shapes.splice(i, 1);
            shapes.push(overShape);
            return;
        }
    }
}
function setSelected() {
    if (!startBox) {
        return;
    }
    var rectangle = pointsToRectangle(startBox, endBox);
    selectedShapes = [];
    for (var i = 0; i < shapes.length; i++) {
        for (var j = 0; j < shapes[i].points.length; j++) {
            var p = transformPoint(shapes[i].points[j]);
            if (p[0] >= rectangle.left && p[0] < rectangle.left + rectangle.width &&
                p[1] >= rectangle.top && p[1] < rectangle.top + rectangle.height) {
                selectedShapes.push(shapes[i]);
                break;
            }
        }
    }
}
*/