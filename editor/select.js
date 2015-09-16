/**
 * This code controls the drawing interactions when the user has the select tool
 * selected.
 */
toolHandlers.select = {
    'selecting': false, // Indicates the user is in the middle of a selection operation.
    'dragging': false, // Indicates the user is in the middle of a drag selection operation.
    'dragCoords': null,
    'startingCoords': null, // Coords of where the last/current selection started.
    'endingCoords': null, // Coords of where the last/current selection ended.
    'getRectangle': function () {
        if (!toolHandlers.select.startingCoords) {
            return undefined;
        }
        var l = Math.max(0, Math.min(toolHandlers.select.startingCoords[0], toolHandlers.select.endingCoords[0]));
        var r = Math.min(cellWidth, Math.max(toolHandlers.select.startingCoords[0], toolHandlers.select.endingCoords[0] ));
        var t = Math.max(0, Math.min(toolHandlers.select.startingCoords[1], toolHandlers.select.endingCoords[1]));
        var b = Math.min(cellHeight, Math.max(toolHandlers.select.startingCoords[1], toolHandlers.select.endingCoords[1]));
        return {'left':l, 'top': t, 'width': r - l, 'height': b - t};
    },
    'pointInRectangle': function (coords) {
        var rectangle = toolHandlers.select.getRectangle();
        return rectangle && isPointInRect(coords[0], coords[1], rectangle.left, rectangle.top, rectangle.width - 1, rectangle.height - 1);
    },
    'redrawSelection': function () {
        overlayContext.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        var rectangle = toolHandlers.select.getRectangle();
        if (!rectangle) {
            return;
        }
        overlayContext.strokeStyle = 'black';
        var frame = Math.floor(now() / 80) % 10;
        if (frame < 5) {
            overlayContext.setLineDash([frame, 5, 5 - frame, 0]);
        } else {
            overlayContext.setLineDash([0, frame - 5, 5, 10 - frame]);
        }
        overlayContext.strokeRect(rectangle.left * drawingScale, rectangle.top * drawingScale, rectangle.width * drawingScale, rectangle.height * drawingScale);
        overlayContext.strokeStyle = 'white';
        frame = (frame + 5) % 10;
        if (frame < 5) {
            overlayContext.setLineDash([frame, 5, 5 - frame, 0]);
        } else {
            overlayContext.setLineDash([0, frame - 5, 5, 10 - frame]);
        }
        overlayContext.strokeRect(rectangle.left * drawingScale, rectangle.top * drawingScale, rectangle.width * drawingScale, rectangle.height * drawingScale);
    },
    'mousedown': function (event, coords) {
        if (!toolHandlers.select.pointInRectangle(coords)) {
            toolHandlers.select.selecting = true;
            toolHandlers.select.startingCoords = coords;
            toolHandlers.select.endingCoords = coords;
        } else {
            toolHandlers.select.dragging = true;
            toolHandlers.select.dragCoords = coords;
        }
    },
    'mousemove': function (event, coords) {
        if (toolHandlers.select.selecting) {
            toolHandlers.select.endingCoords = coords;
        }
        if (toolHandlers.select.dragging) {
            var dx = coords[0] - toolHandlers.select.dragCoords[0];
            toolHandlers.select.startingCoords[0] += dx;
            toolHandlers.select.endingCoords[0] += dx;
            var dy = coords[1] - toolHandlers.select.dragCoords[1];
            toolHandlers.select.startingCoords[1] += dy;
            toolHandlers.select.endingCoords[1] += dy;
            toolHandlers.select.dragCoords = coords;
        }
        drawingPanel.$content.css('cursor', 'crosshair');
        if (!toolHandlers.select.selecting && toolHandlers.select.pointInRectangle(coords)) {
            drawingPanel.$content.css('cursor', 'pointer');
        }
    },
    'mouseup': function (event, coords) {
        toolHandlers.select.selecting = false;
        toolHandlers.select.dragging = false;
        if (toolHandlers.select.startingCoords && (toolHandlers.select.startingCoords[0] == toolHandlers.select.endingCoords[0]
            || toolHandlers.select.startingCoords[1] == toolHandlers.select.endingCoords[1])) {
            toolHandlers.select.startingCoords = null;
            toolHandlers.select.endingCoords = null;
        }
    }
};
function setSelection(left, top, width, height) {
    toolHandlers.select.startingCoords = [left, top];
    toolHandlers.select.endingCoords = [left + width, top + height];
}
function isPointActive(coords) {
    return !toolHandlers.select.startingCoords || toolHandlers.select.pointInRectangle(coords);
}
