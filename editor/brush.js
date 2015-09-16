/**
 * This code controls the drawing interactions when the user has the brush tool
 * selected.
 */
toolHandlers.brush = {
    'painting': false, // Indicates the user is in the middle of a drag and paint operation
    'brush': null, // Indicates which brush data should be used for the current paint operation
    'mousedown': function (event, coords) {
        toolHandlers.brush.painting = true;
        if (event.which == 1) toolHandlers.brush.brush = drawBrush;
        else if (event.which == 3) toolHandlers.brush.brush = eraseBrush;
        drawPixel(coords, toolHandlers.brush.brush);
    },
    'mousemove': function (event, coords) {
        previewContext.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        if (toolHandlers.brush.painting) drawPixel(coords, toolHandlers.brush.brush);
        else previewContext.putImageData(drawBrush, coords[0], coords[1]);
    },
    'mouseout': function (event, coords) {
        previewContext.clearRect(0,0, previewCanvas.width, previewCanvas.height);
    },
    'mouseup': function (event, coords) {
        toolHandlers.brush.painting = false;
    }
}
