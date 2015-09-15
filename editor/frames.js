
var framesPanel = new cb.Panel('Frames');
$('body').append(framesPanel.$);
framesPanel.$content.addClass('canvasList');
var previewFrameCanvas = createCanvas(160, 144);
$(previewFrameCanvas).addClass('selected');
var previewFrameContext = previewFrameCanvas.getContext("2d");
function updateFramesPanel() {
    updateCanvas(previewFrameCanvas, previewScale);
    framesPanel.$content.empty();
    framesPanel.$content.append($tag('button', 'js-addFrame', 'Add Frame'));
    for (var frame = 0; frame < frames; frame++) {
        if (frame == selectedFrame) {
            framesPanel.$content.append(previewFrameCanvas);
            previewFrameContext.drawImage(cells[selectedLayer][selectedFrame].canvas, 0, 0);
            continue;
        }
        framesPanel.$content.append(cells[selectedLayer][frame].canvas);
        scaleCanvas(cells[selectedLayer][frame].canvas, previewScale);
    }
    framesPanel.$content.append($tag('button', 'js-deleteFrame', 'Delete Frame'));
    framesPanel.contentHeight = framesPanel.$content.outerHeight();
    framesPanel.contentWidth = framesPanel.$content.outerWidth();
    framesPanel.refreshScrollBars();
}
framesPanel.$content.on('click', 'canvas', function (event) {
    selectedFrame = $(this).prevAll().filter('canvas').length;
    initializePanels();
});
framesPanel.$content.on('click', '.js-addFrame', function (event) {
    for (var layer = 0; layer < layers; layer++) {
        cells[layer].unshift(newCell());
    }
    frames++;
    selectedFrame = 0;
    initializePanels();
});
framesPanel.$content.on('click', '.js-deleteFrame', function (event) {
    if (frames <= 1) {
        return;
    }
    for (var layer = 0; layer < layers; layer++) {
        cells[layer].pop();
    }
    frames--;
    selectedFrame = Math.min(selectedFrame, frames - 1);
    initializePanels();
});

framesPanel.$contentFrame.bind('mousewheel', function(e){
    framesPanel.scrollVertical(-e.originalEvent.wheelDelta);
});