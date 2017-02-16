
var animationPanel = new cb.Panel('Preview');
$('body').append(animationPanel.$);

var cellWidth = 32;
var cellHeight = 48;
var frames = 1;
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
    updateAnimationPanel();
}

function updateAnimationPanel() {
    updateCanvas(animationCanvas, previewScale);
}


var animationCanvas = createCanvas(32, 48, 'animation');
var animationContext = animationCanvas.getContext("2d");
animationPanel.$content.append(animationCanvas);
animationPanel.contentWidth = animationPanel.$content.outerWidth();
animationPanel.contentHeight = animationPanel.$content.outerHeight();

resize(animationPanel.$, 220, 220, 0, 0);
resize(colorsPanel.$, 220, 236, 0, 220);
resize(toolsPanel.$, 220, 280, 0, 456);
resize(drawingPanel.$, 600, 600, 220, 0);
resize(framesPanel.$, 160, 600, 220 + 600, 0);
resize(layersPanel.$, 160, 600, 220 + 600 + 160, 0);
colorsPanel.refreshScrollBars();
initializeCells();
initializePanels();

function loadImage(source, callback) {
    var image = new Image();
    image.onload = function () {
        callback(image);
    };
    image.src = source;
}
function animate() {
    var frame = Math.floor(now() / 150) % frames;
    animationContext.clearRect(0, 0, cellWidth, cellHeight);
    for (var i = layers - 1; i >= 0; i--) {
        animationContext.drawImage(cells[i][frame].canvas, 0, 0);
    }
    var handler = toolHandlers[tool]['tick'];
    if (handler) {
        return handler(event);
    }
    if (toolHandlers.select.startingCoords && toolHandlers.select.endingCoords) {
        toolHandlers.select.redrawSelection();
    }
    return null;
}
setInterval(animate, 20);
