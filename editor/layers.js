
var layersPanel = new cb.Panel('Layers');
$('body').append(layersPanel.$);
layersPanel.$content.addClass('canvasList');
function updateLayersPanel() {
    updateCanvas(previewLayerCanvas, previewScale);
    layersPanel.$content.empty();
    layersPanel.$content.append($tag('button', 'js-addLayer', 'Add Layer'));
    for (var layer = 0; layer < layers; layer++) {
        if (layer == selectedLayer) {
            layersPanel.$content.append(previewLayerCanvas);
            previewLayerContext.drawImage(cells[selectedLayer][selectedFrame].canvas, 0, 0);
            continue;
        }
        layersPanel.$content.append(cells[layer][selectedFrame].canvas);
        scaleCanvas(cells[layer][selectedFrame].canvas, previewScale);
    }
    layersPanel.$content.append($tag('button', 'js-deleteLayer', 'Delete Layer'));
    layersPanel.contentHeight = layersPanel.$content.outerHeight();
    layersPanel.contentWidth = layersPanel.$content.outerWidth();
    layersPanel.refreshScrollBars();
}
layersPanel.$content.on('click', 'canvas', function (event) {
    selectedLayer = $(this).prevAll().filter('canvas').length;
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
layersPanel.$content.on('click', '.js-addLayer', function (event) {
    var newLayer = [];
    for (var frame = 0; frame < frames; frame++) {
        newLayer.push(newCell());
    }
    cells.unshift(newLayer);
    layers++;
    selectedLayer = 0;
    initializePanels();
});
layersPanel.$content.on('click', '.js-deleteLayer', function (event) {
    if (layers <= 1) {
        return;
    }
    cells.pop();
    layers--;
    selectedLayer = Math.min(selectedLayer, layers - 1);
    initializePanels();
});