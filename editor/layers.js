
var layersPanel = new cb.Panel('Layers');
$('body').append(layersPanel.$);
layersPanel.$content.addClass('canvasList');
var previewLayerCanvas = createCanvas(160, 144);
$(previewLayerCanvas).addClass('selected');
var previewLayerContext = previewLayerCanvas.getContext("2d");
function updateLayersPanel() {
    updateCanvas(previewLayerCanvas, previewScale);
    layersPanel.$content.empty();
    for (var layer = 0; layer < layers; layer++) {
        if (layer == selectedLayer) {
            layersPanel.$content.append($previewTile(previewLayerCanvas));
            previewLayerContext.drawImage(cells[selectedLayer][selectedFrame].canvas, 0, 0);
            continue;
        }
        layersPanel.$content.append($previewTile(cells[layer][selectedFrame].canvas));
        scaleCanvas(cells[layer][selectedFrame].canvas, previewScale);
    }
    layersPanel.contentHeight = layersPanel.$content.outerHeight();
    layersPanel.contentWidth = layersPanel.$content.outerWidth();
    layersPanel.refreshScrollBars();
}
layersPanel.$content.on('click', '.js-previewTile', function (event) {
    if ($(event.target).closest('.js-option').length) {
        return;
    }
    selectedLayer = $(this).prevAll().filter('.js-previewTile').length;
    initializePanels();
});
$('body').on('keydown', function (event) {
    if (event.which == 38) { //up
        selectedLayer = Math.max(0, selectedLayer - 1);
        initializePanels();
    }
    if (event.which == 40) { //down
        selectedLayer = Math.min(layers - 1, selectedLayer + 1);
        initializePanels();
    }
});
layersPanel.$content.on('click', '.js-newUp', function (event) {
    addLayer(getIndex($(this)));
});
layersPanel.$content.on('click', '.js-newDown', function (event) {
    addLayer(getIndex($(this)) + 1);
});
layersPanel.$content.on('click', '.js-delete', function (event) {
    deleteLayer(getIndex($(this)));
});
layersPanel.$content.on('click', '.js-moveUp', function (event) {
    var index = getIndex($(this));
    swapLayers(index, index - 1);
});
layersPanel.$content.on('click', '.js-moveDown', function (event) {
    var index = getIndex($(this));
    swapLayers(index, index + 1);
});
layersPanel.$content.on('click', '.js-copy', function (event) {
    copyLayer(getIndex($(this)));
});
function addLayer(index) {
    var newLayer = [];
    for (var frame = 0; frame < frames; frame++) {
        newLayer.push(newCell());
    }
    cells.splice(index, 0, newLayer);
    layers++;
    selectedLayer = index;
    initializePanels();
}
function deleteLayer(index) {
    if (layers <= 1) {
        return;
    }
    cells.splice(index, 1);
    layers--;
    selectedLayer = Math.min(index, layers - 1);
    initializePanels();
}
function swapLayers(indexA, indexB) {
    if (indexA < 0 || indexB < 0 || indexA >= layers || indexB >= layers) {
        return;
    }
    var tmp = cells[indexA];
    cells[indexA] = cells[indexB];
    cells[indexB] = tmp;
    if (selectedLayer == indexA) {
        selectedLayer = indexB;
    } else if (selectedLayer == indexB) {
        selectedLayer = indexA;
    }
    initializePanels();
}
function copyLayer(index) {
    var newLayer = [];
    for (var frame = 0; frame < frames; frame++) {
        var copy = newCell();
        copy.context.drawImage(cells[index][frame].canvas, 0, 0);
        newLayer.push(copy);
    }
    cells.splice(index + 1, 0, newLayer);
    layers++;
    selectedLayer = index + 1;
    initializePanels();
}
layersPanel.$contentFrame.bind('mousewheel', function(e){
    layersPanel.scrollVertical(-e.originalEvent.wheelDelta);
});
