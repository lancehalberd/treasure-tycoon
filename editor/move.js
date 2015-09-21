/**
 * This code controls the drawing interactions when the user has the move tool
 * selected.
 */
var moveCanvas = createCanvas(1, 1);
var moveContext = moveCanvas.getContext("2d");
toolHandlers.move = {
    'dragging': false, // Indicates the user is in the middle of a drag selection operation.
    'dragCoords': null,
    'drawCoords': null,
    'setMoveCanvas': function () {
        var rectangle = ifdefor(toolHandlers.select.getRectangle(), {'left': 0, 'top': 0, 'width': cellWidth, 'height': cellHeight});
        moveCanvas.width = rectangle.width;
        moveCanvas.height = rectangle.height;
        moveContext.drawImage(sourceCanvas, rectangle.left, rectangle.top, rectangle.width, rectangle.height, 0, 0, rectangle.width, rectangle.height);
    },
    'mousedown': function (event, coords) {
        if (!isPointActive(coords)) return;
        var rectangle = ifdefor(toolHandlers.select.getRectangle(), {'left': 0, 'top': 0, 'width': cellWidth, 'height': cellHeight});
        toolHandlers.move.setMoveCanvas();
        toolHandlers.move.dragging = true;
        toolHandlers.move.dragCoords = coords;
        toolHandlers.move.drawCoords = [rectangle.left, rectangle.top];
        sourceContext.clearRect(rectangle.left, rectangle.top, rectangle.width, rectangle.height);
        cells[selectedLayer][selectedFrame].context.clearRect(rectangle.left, rectangle.top, rectangle.width, rectangle.height);
        previewContext.clearRect(0, 0, cellWidth, cellHeight);
        previewContext.drawImage(moveCanvas, toolHandlers.move.drawCoords[0], toolHandlers.move.drawCoords[1]);
    },
    'mousemove': function (event, coords) {
        drawingPanel.$content.css('cursor', 'pointer');
        if (toolHandlers.move.dragging) {
            var dx = coords[0] - toolHandlers.move.dragCoords[0];
            var dy = coords[1] - toolHandlers.move.dragCoords[1];
            toolHandlers.move.drawCoords[0] += dx;
            toolHandlers.move.drawCoords[1] += dy;
            var rectangle = ifdefor(toolHandlers.select.getRectangle(), {'left': 0, 'top': 0, 'width': cellWidth, 'height': cellHeight});
            sourceContext.clearRect(0, 0, cellWidth, cellHeight);
            sourceContext.drawImage(cells[selectedLayer][selectedFrame].canvas, 0, 0);
            sourceContext.clearRect(rectangle.left, rectangle.top, rectangle.width, rectangle.height);
            previewContext.clearRect(0, 0, cellWidth, cellHeight);
            previewContext.drawImage(moveCanvas, toolHandlers.move.drawCoords[0], toolHandlers.move.drawCoords[1]);
            // Update selection area if present
            if (toolHandlers.select.startingCoords) {
                toolHandlers.select.startingCoords[0] += dx;
                toolHandlers.select.endingCoords[0] += dx;
                toolHandlers.select.startingCoords[1] += dy;
                toolHandlers.select.endingCoords[1] += dy;
                toolHandlers.select.redrawSelection();
            }
            toolHandlers.move.dragCoords = coords;
        } else {
            if (!isPointActive(coords)) {
                drawingPanel.$content.css('cursor', 'default');
            }
        }
    },
    'mouseup': function (event, coords) {
        if (toolHandlers.move.dragging) {
            var rectangle = ifdefor(toolHandlers.select.getRectangle(), {'left': 0, 'top': 0, 'width': cellWidth, 'height': cellHeight});
            // Actually change the source
            sourceContext.clearRect(rectangle.left, rectangle.top, rectangle.width, rectangle.height);
            sourceContext.drawImage(moveCanvas, toolHandlers.move.drawCoords[0], toolHandlers.move.drawCoords[1]);
            // Update the cell and preview frames to match the source.
            [cells[selectedLayer][selectedFrame].context, previewFrameContext, previewLayerContext].forEach(function (context) {
                context.clearRect(0, 0, cellWidth, cellHeight);
                context.drawImage(sourceCanvas, 0, 0);
            });
            toolHandlers.move.dragging = false;
        }
    }
};
//Unused currently
/*function moveImage(dx, dy) {
    sourceContext.clearRect(0, 0, cellWidth, cellHeight);
    sourceContext.drawImage(cells[selectedLayer][selectedFrame].canvas, 0, 0, cellWidth, cellHeight, dx, dy, cellWidth, cellHeight);
    // Apply change to all context that are displaying the current graphics.
    [cells[selectedLayer][selectedFrame].context, previewFrameContext, previewLayerContext].forEach(function (context) {
        context.clearRect(0, 0, cellWidth, cellHeight);
        context.drawImage(sourceCanvas, 0, 0);
    });
}*/
