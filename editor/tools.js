
var toolsPanel = new cb.Panel('Tools');
$('body').append(toolsPanel.$);
toolsPanel.$content.append($('.js-tools'));
toolsPanel.contentWidth = toolsPanel.$content.outerWidth();
toolsPanel.contentHeight = toolsPanel.$content.outerHeight();

var tool = null;
var toolHandlers = {};

function setTool(type) {
    tool = type;
    $('.js-tool').prop('checked', false);
    $('.js-tool[value="' + type + '"').prop('checked', true);
}

$('.js-tool').on('click', function (event) {
    setTool($(this).val());
})
setTool('select');

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

// Add the paste event listener
window.addEventListener("paste", pasteHandler);

/* Handle paste events */
function pasteHandler(e) {
    console.log("paste");
   // We need to check if event.clipboardData is supported (Chrome)
   if (e.clipboardData) {
      // Get the items from the clipboard
      var items = e.clipboardData.items;
      if (items) {
         // Loop through all items, looking for any kind of image
         for (var i = 0; i < items.length; i++) {
            console.log(items[i].type);
            if (items[i].type.indexOf("image") !== -1) {
               // We need to represent the image as a file,
               var blob = items[i].getAsFile();
               // and use a URL or webkitURL (whichever is available to the browser)
               // to create a temporary URL to the object
               var URLObj = window.URL || window.webkitURL;
               var source = URLObj.createObjectURL(blob);

               // The URL can then be used as the source of an image
               loadImage(source, function (image) {
                    // Apply change to all context that are displaying the current graphics.
                    [sourceContext, cells[selectedLayer][selectedFrame].context, previewFrameContext, previewLayerContext].forEach(function (context) {
                        context.drawImage(image, 0, 0);
                    });
                    setSelection(0, 0, image.width, image.height);
               });
            }
         }
      }
   // If we can't handle clipboard data directly (Firefox),
   // we need to read what was pasted from the contenteditable element
   } else {
      // This is a cheap trick to make sure we read the data
      // AFTER it has been inserted.
      setTimeout(checkInput, 1);
   }
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