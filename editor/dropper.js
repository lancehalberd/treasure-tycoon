/**
 * This code controls the drawing interactions when the user has the brush tool
 * selected.
 */
toolHandlers.dropper = {
    'picking': false, // Indicates the user is in the middle of a drag and paint operation
    'pickColor': function (coords) {
        var imageData = sourceContext.getImageData(coords[0], coords[1], 1, 1);
        var newColor = [
            imageData.data[0],
            imageData.data[1],
            imageData.data[2],
            imageData.data[3]
        ];
        pickColor(newColor);
    },
    'mousedown': function (event, coords) {
        toolHandlers.dropper.picking = true;
        toolHandlers.dropper.pickColor(coords);
    },
    'mousemove': function (event, coords) {
        if (toolHandlers.dropper.picking) {
            toolHandlers.dropper.pickColor(coords);
        }
    },
    'mouseup': function (event, coords) {
        toolHandlers.dropper.picking = false;
    }
}
