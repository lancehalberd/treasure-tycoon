/**
 * This code controls the drawing interactions when the user has the brush tool
 * selected.
 */
toolHandlers.brush = {
    'painting': false, // Indicates the user is in the middle of a drag and paint operation
    'brush': null, // Indicates which brush data should be used for the current paint operation
    'brushSize': 1,
    'mousedown': function (event, coords) {
        toolHandlers.brush.painting = true;
        if (event.which == 1) toolHandlers.brush.brush = drawBrush;
        else if (event.which == 3) toolHandlers.brush.brush = eraseBrush;
        var drawCoords = [
            coords[0] - Math.floor(toolHandlers.brush.brushSize / 2),
            coords[1] - Math.floor(toolHandlers.brush.brushSize / 2)
        ];
        drawPixel(drawCoords, toolHandlers.brush.brush);
    },
    'mousemove': function (event, coords) {
        previewContext.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        var drawCoords = [
            coords[0] - Math.floor(toolHandlers.brush.brushSize / 2),
            coords[1] - Math.floor(toolHandlers.brush.brushSize / 2)
        ];
        if (toolHandlers.brush.painting) drawPixel(drawCoords, toolHandlers.brush.brush);
        else previewContext.putImageData(drawBrush, drawCoords[0], drawCoords[1]);
    },
    'mouseout': function (event, coords) {
        previewContext.clearRect(0,0, previewCanvas.width, previewCanvas.height);
    },
    'mouseup': function (event, coords) {
        toolHandlers.brush.painting = false;
        previewContext.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        var drawCoords = [
            coords[0] - Math.floor(toolHandlers.brush.brushSize / 2),
            coords[1] - Math.floor(toolHandlers.brush.brushSize / 2)
        ];
        previewContext.putImageData(drawBrush, drawCoords[0], drawCoords[1]);
    }
}
