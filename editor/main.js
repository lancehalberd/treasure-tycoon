
var drawingPanel = new cb.Panel('Drawing');
var animationPanel = new cb.Panel('Preview');
$('body').append(drawingPanel.$);
$('body').append(animationPanel.$);

var backgroundCanvas = createCanvas(160, 144);
var backgroundContext = backgroundCanvas.getContext("2d");
var sourceCanvas = createCanvas(160, 144);
drawingPanel.$content.append(backgroundCanvas);
drawingPanel.$content.append(sourceCanvas);
$(backgroundCanvas).css('opacity', .5);
var sourceContext = sourceCanvas.getContext("2d");

var cellWidth = 32;
var cellHeight = 48;
var frames = 5;
var layers = 1;
var selectedFrame = 0;
var selectedLayer = 0;
var cells = [];
var drawingScale = 10;
var previewScale = 4;
function updateCanvas(canvas, scale) {
    canvas.width = cellWidth;
    canvas.height = cellHeight;
    scaleCanvas(canvas, scale);
}
function scaleCanvas(canvas, scale) {
    resize(canvas, canvas.width* scale, canvas.height * scale)
}
function initializeCells() {
    for (var layer = 0; layer < layers; layer++) {
        cells[layer] = ifdefor(cells[layer], []);
        for (var frame = 0; frame < frames; frame++) {
            if (ifdefor(cells[layer][frame])) {
                cells[layer][frame].canvas.width = cellWidth;
                cells[layer][frame].canvas.height = cellHeight;
            } else {
                cells[layer][frame] = newCell();
            }
        }
    }
}
function newCell() {
    var canvas = createCanvas(cellWidth, cellHeight);
    return {'canvas': canvas, 'context': canvas.getContext("2d") };
}
function initializePanels() {
    updateDrawingPanel();
    updateFramesPanel();
    updateLayersPanel();
}
function updateDrawingPanel() {
    updateCanvas(sourceCanvas, drawingScale);
    updateCanvas(previewCanvas, drawingScale);
    updateCanvas(backgroundCanvas, drawingScale);
    sourceContext.drawImage(cells[selectedLayer][selectedFrame].canvas, 0, 0);
    for (var layer = layers - 1; layer > selectedLayer; layer--) {
        backgroundContext.drawImage(cells[layer][selectedFrame].canvas, 0, 0);
    }
}
function updateDrawingPanelScale() {
    resize(backgroundCanvas, cellWidth * drawingScale, cellHeight * drawingScale);
    resize(sourceCanvas, cellWidth * drawingScale, cellHeight * drawingScale);
    resize(previewCanvas, cellWidth * drawingScale, cellHeight * drawingScale);
    drawingPanel.contentWidth = cellWidth * drawingScale;
    drawingPanel.contentHeight = cellHeight * drawingScale;
    drawingPanel.refreshScrollBars();
}

var previewCanvas = createCanvas(160, 144);
drawingPanel.$content.append(previewCanvas);
[sourceCanvas, previewCanvas].forEach(function (canvas) {
    $(canvas).css('width', '640px', '576px').css('position', 'absolute').css('left', '0px');
})
var previewContext = previewCanvas.getContext("2d");

var animationCanvas = createCanvas(32, 48);
var animationContext = animationCanvas.getContext("2d");
updateCanvas(animationCanvas, previewScale);
animationPanel.$content.append(animationCanvas);
animationPanel.contentWidth = animationPanel.$content.outerWidth();
animationPanel.contentHeight = animationPanel.$content.outerHeight();

drawingPanel.$contentFrame.bind('mousewheel', function(e){
    var actualX = drawingPanel.contentX / drawingScale;
    var actualY = drawingPanel.contentY / drawingScale;
    if (e.originalEvent.wheelDelta > 0) {
        drawingScale = Math.min(drawingScale * 2, 20);
    } else{
        drawingScale = Math.max(drawingScale / 2, 4);
    }
    drawingPanel.contentX = Math.round(actualX * drawingScale);
    drawingPanel.contentY = Math.round(actualY * drawingScale);
    updateDrawingPanelScale();
});

resize(animationPanel.$, 220, 220, 0, 0);
resize(toolsPanel.$, 220, 380, 0, 220);
resize(drawingPanel.$, 600, 600, 220, 0);
resize(framesPanel.$, 160, 600, 220 + 600, 0);
resize(layersPanel.$, 160, 600, 220 + 600 + 160, 0);
initializeCells();
initializePanels();

var id1 = sourceContext.createImageData(1,1); // only do this once per page
var d  = id1.data;                        // only do this once per page
d[0]   = 0;
d[1]   = 0;
d[2]   = 0;
d[3]   = 255;
var id2 = sourceContext.createImageData(1,1); // only do this once per page
var d2  = id2.data;                        // only do this once per page
d2[0]   = 0;
d2[1]   = 0;
d2[2]   = 0;
d2[3]   = 0;
sourceContext.imageSmoothingEnabled = false;
var painting = false;
var brush = null;
drawingPanel.$content.on('mousedown', function (event) {
    painting = true;
    if (event.which == 1) {
        brush = id1;
    } else if (event.which == 3) {
        brush = id2;
    }
    drawPixel(getCoords(event));
    event.preventDefault();
    return false;
});
drawingPanel.$content.on('contextmenu', function (event) {
    event.preventDefault();
    return false;
});
drawingPanel.$content.on('mousemove', function (event) {
    previewContext.clearRect(0,0, 160, 144);
    if (painting) {
        drawPixel(getCoords(event));
    } else {
        var coords = getCoords(event);
        previewContext.putImageData(id1, coords[0], coords[1]);
    }
});
drawingPanel.$content.on('mouseout', function (event) {
    previewContext.clearRect(0,0, 160, 144);
});
$(document).on('mouseup', function (event) {
    painting = false;
});
function getCoords(event) {
    return [
        Math.floor((event.pageX - $(sourceCanvas).offset().left - 1) / drawingScale),
        Math.floor((event.pageY - $(sourceCanvas).offset().top - 2) / drawingScale)
    ]
}
function drawPixel(coords) {
    // Apply change to all context that are displaying the current graphics.
    [sourceContext, cells[selectedLayer][selectedFrame].context, previewFrameContext, previewLayerContext].forEach(function (context) {
        context.putImageData(brush, coords[0], coords[1]);
    });
}
$('.js-color').on('change', function (event) {
    var hexColor = $(this).val();
    d[0] = constrain(parseInt(hexColor.substring(0, 2), 16), 0, 255);
    d[1] = constrain(parseInt(hexColor.substring(2, 4), 16), 0, 255);
    d[2] = constrain(parseInt(hexColor.substring(4, 6), 16), 0, 255);
});
$('.js-opacity').on('change', function (event) {
    var percent = $(this).val();
    $('.js-opacityText').val(percent);
    d[3] = constrain(Math.floor((percent * 255) / 100), 0, 255);
});
function constrain(value, min, max) {
    return Math.min(max, Math.max(min, value));
}
var images = [];
function loadImage(source, callback) {
    images[source] = new Image();
    images[source].onload = function () {
        callback(images[source]);
    };
    images[source].src = source;
}
function animate() {
    var frame = Math.floor(now() / 150) % frames;
    animationContext.clearRect(0, 0, 32, 48);
    for (var i = layers - 1; i >= 0; i--) {
        animationContext.drawImage(cells[i][frame].canvas, 0, 0);
    }
}
setInterval(animate, 20);