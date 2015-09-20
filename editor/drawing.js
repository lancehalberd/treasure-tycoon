
var drawingPanel = new cb.Panel('Drawing');
$('body').append(drawingPanel.$);

var backgroundCanvas = createCanvas(160, 144, 'background');
var backgroundContext = backgroundCanvas.getContext("2d");
var sourceCanvas = createCanvas(160, 144);
var sourceContext = sourceCanvas.getContext("2d");
var previewCanvas = createCanvas(160, 144);
var previewContext = previewCanvas.getContext("2d");
var overlayCanvas = createCanvas(160, 144);
var overlayContext = overlayCanvas.getContext("2d");

drawingPanel.$content.append(backgroundCanvas);
drawingPanel.$content.append(sourceCanvas);
drawingPanel.$content.append(previewCanvas);
drawingPanel.$content.append(overlayCanvas);
//$(backgroundCanvas).css('opacity', .5);
[sourceCanvas, previewCanvas, overlayCanvas].forEach(function (canvas) {
    $(canvas).css('position', 'absolute').css('left', '0px');
});
function updateDrawingPanel() {
    updateCanvas(sourceCanvas, drawingScale);
    updateCanvas(previewCanvas, drawingScale);
    updateCanvas(backgroundCanvas, drawingScale);
    overlayCanvas.width = cellWidth * drawingScale;
    overlayCanvas.height = cellHeight * drawingScale;
    sourceContext.drawImage(cells[selectedLayer][selectedFrame].canvas, 0, 0);
    for (var layer = layers - 1; layer > selectedLayer; layer--) {
        backgroundContext.drawImage(cells[layer][selectedFrame].canvas, 0, 0);
    }
}
function updateDrawingPanelScale() {
    resize(backgroundCanvas, cellWidth * drawingScale, cellHeight * drawingScale);
    resize(sourceCanvas, cellWidth * drawingScale, cellHeight * drawingScale);
    resize(previewCanvas, cellWidth * drawingScale, cellHeight * drawingScale);
    overlayCanvas.width = cellWidth * drawingScale;
    overlayCanvas.height = cellHeight * drawingScale;
    drawingPanel.contentWidth = cellWidth * drawingScale;
    drawingPanel.contentHeight = cellHeight * drawingScale;
    drawingPanel.refreshScrollBars();
}
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

function setColor(data, r, g, b, a) {
    data[0] = r; data[1] = g; data[2] = b; data[3] = a;
}

var drawBrush = sourceContext.createImageData(1,1);
setColor(drawBrush.data, 0, 0, 0, 255);
var eraseBrush = sourceContext.createImageData(1,1);
setColor(eraseBrush.data, 0, 0, 0, 0);
sourceContext.imageSmoothingEnabled = false;
drawingPanel.$content.on('contextmenu', function (event) {
    event.preventDefault();
    return false;
});
drawingPanel.$content.on('mousedown', function (event) {
    var handler = toolHandlers[tool]['mousedown'];
    if (handler) {
        return handler(event, getCoords(event));
    }
    return null;
});
$(document).on('mousemove', function (event) {
    var handler = toolHandlers[tool]['mousemove'];
    if (handler) {
        return handler(event, getCoords(event));
    }
    return null;
});
drawingPanel.$content.on('mouseout', function (event) {
    var handler = toolHandlers[tool]['mouseout'];
    if (handler) {
        return handler(event, getCoords(event));
    }
    return null;
});
$(document).on('mouseup', function (event) {
    var handler = toolHandlers[tool]['mouseup'];
    if (handler) {
        return handler(event, getCoords(event));
    }
    return null;
});
function getCoords(event) {
    return [
        Math.floor((event.pageX - $(sourceCanvas).offset().left - 1) / drawingScale),
        Math.floor((event.pageY - $(sourceCanvas).offset().top - 2) / drawingScale)
    ]
}
function drawPixel(coords, brush) {
    if (toolHandlers.select.startingCoords && !toolHandlers.select.pointInRectangle(coords)) {
        return;
    }
    // Apply change to all context that are displaying the current graphics.
    [sourceContext, cells[selectedLayer][selectedFrame].context, previewFrameContext, previewLayerContext].forEach(function (context) {
        context.putImageData(brush, coords[0], coords[1]);
    });
}
