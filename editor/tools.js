
var toolsPanel = new cb.Panel('Tools');
$('body').append(toolsPanel.$);
toolsPanel.$content.append($('.js-tools'));
toolsPanel.contentWidth = toolsPanel.$content.outerWidth();
toolsPanel.contentHeight = toolsPanel.$content.outerHeight();


// Solution from:
// http://stackoverflow.com/questions/12796513/html5-canvas-to-png-file
$('.js-save').on('click', function (event) {
    /*sourceCanvas.toBlob(function(blob) {
        saveAs(blob, "mmmmonster.png");
    });
    return false;*/
    var dt = sourceCanvas.toDataURL('image/png');
    /* Change MIME type to trick the browser to download the file instead of displaying it */
    dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
    this.download = "canvas.png"
    this.href = dt;
});
//http://stackoverflow.com/questions/3814231/loading-an-image-to-a-img-from-input-file
$('.js-load').on('change', function (event) {
    var target = event.target || window.event.srcElement, files = target.files;
    // FileReader support
    if (FileReader && files && files.length) {
        var fileReader = new FileReader();
        fileReader.onload = function () {
            var source = fileReader.result;
            loadImage(source, function (image) {
                frames = Math.floor(image.width / cellWidth);
                layers = Math.floor(image.height / cellHeight);
                initializeCells();
                for (var layer = 0; layer < layers; layer++) {
                    for (var frame = 0; frame < frames; frame++) {
                        cells[layer][frame].context.drawImage(image, frame * cellWidth, layer * cellHeight, cellWidth, cellHeight, 0, 0, cellWidth, cellHeight);
                    }
                }
                initializePanels();
            })
        }
        fileReader.readAsDataURL(files[0]);
    } else alert("Loading not supported by this browser.")
});