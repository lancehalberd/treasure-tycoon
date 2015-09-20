
var framesPanel = new cb.Panel('Frames');
$('body').append(framesPanel.$);
framesPanel.$content.addClass('canvasList');
var previewFrameCanvas = createCanvas(160, 144);
$(previewFrameCanvas).addClass('selected');
var previewFrameContext = previewFrameCanvas.getContext("2d");

function $previewTile(content) {
    return $tag('div', 'js-previewTile previewTile')
        .append($tag('div', 'js-newUp js-option option newItem', '+'))
        .append($tag('div', 'js-moveUp js-option option moveUp', '^'))
        .append($tag('div', 'js-delete js-option option delete', 'x'))
        .append($tag('div', 'js-newDown js-option option newItem', '+'))
        .append($tag('div', 'js-moveDown js-option option moveDown', 'v'))
        .append($tag('div', 'js-copy js-option option copyItem', 'C'))
        .append(content);
}
function updateFramesPanel() {
    updateCanvas(previewFrameCanvas, previewScale);
    framesPanel.$content.empty();
    for (var frame = 0; frame < frames; frame++) {
        if (frame == selectedFrame) {
            framesPanel.$content.append($previewTile(previewFrameCanvas));
            previewFrameContext.drawImage(cells[selectedLayer][selectedFrame].canvas, 0, 0);
            continue;
        }
        framesPanel.$content.append($previewTile(cells[selectedLayer][frame].canvas));
        scaleCanvas(cells[selectedLayer][frame].canvas, previewScale);
    }
    framesPanel.contentHeight = framesPanel.$content.outerHeight();
    framesPanel.contentWidth = framesPanel.$content.outerWidth();
    framesPanel.refreshScrollBars();
}
framesPanel.$content.on('click', '.js-previewTile', function (event) {
    if ($(event.target).closest('.js-option').length) {
        return;
    }
    selectedFrame = $(this).prevAll().filter('.js-previewTile').length;
    initializePanels();
});
function getIndex($element) {
    return $element.closest('.js-previewTile').prevAll().filter('.js-previewTile').length;
}
framesPanel.$content.on('click', '.js-newUp', function (event) {
    addFrame(getIndex($(this)));
});
framesPanel.$content.on('click', '.js-newDown', function (event) {
    addFrame(getIndex($(this)) + 1);
});
framesPanel.$content.on('click', '.js-delete', function (event) {
    deleteFrame(getIndex($(this)));
});
framesPanel.$content.on('click', '.js-moveUp', function (event) {
    var index = getIndex($(this));
    swapFrames(index, index - 1);
});
framesPanel.$content.on('click', '.js-moveDown', function (event) {
    var index = getIndex($(this));
    swapFrames(index, index + 1);
});
framesPanel.$content.on('click', '.js-copy', function (event) {
    copyFrame(getIndex($(this)));
});
function addFrame(index) {
    for (var layer = 0; layer < layers; layer++) {
        cells[layer].splice(index, 0, newCell());
    }
    frames++;
    selectedFrame = index;
    initializePanels();
}
function deleteFrame(index) {
    if (frames <= 1) {
        return;
    }
    for (var layer = 0; layer < layers; layer++) {
        cells[layer].splice(index, 1);
    }
    frames--;
    selectedFrame = Math.min(index, frames - 1);
    initializePanels();
}
function swapFrames(indexA, indexB) {
    if (indexA < 0 || indexB < 0 || indexA >= frames || indexB >= frames) {
        return;
    }
    for (var layer = 0; layer < layers; layer++) {
        var tmp = cells[layer][indexA];
        cells[layer][indexA] = cells[layer][indexB];
        cells[layer][indexB] = tmp;
    }
    if (selectedFrame == indexA) {
        selectedFrame = indexB;
    } else if (selectedFrame == indexB) {
        selectedFrame = indexA;
    }
    initializePanels();
}
function copyFrame(index) {
    for (var layer = 0; layer < layers; layer++) {
        var copy = newCell();
        copy.context.drawImage(cells[layer][index].canvas, 0, 0);
        cells[layer].splice(index + 1, 0, copy);
    }
    frames++;
    selectedFrame = index + 1;
    initializePanels();
}

framesPanel.$contentFrame.bind('mousewheel', function(e){
    framesPanel.scrollVertical(-e.originalEvent.wheelDelta);
});