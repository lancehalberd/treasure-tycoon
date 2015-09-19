
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
setTool('brush');

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

function copyHandler(e) {
    // In order to set the clipboard, we create a temporary text field with the
    // text we want to copy, then select and execute the copy command.
    toolHandlers.move.setMoveCanvas();
    // We copy the image as text (I don't think we can copy as a binary image).
    // The paste handler has code to handle pasting these strings.
    var $helper = $tag('input').val(moveCanvas.toDataURL('image/png'));
    $('body').append($helper);
    $helper.select();
    var successful = document.execCommand('copy');
    // Copy will fail if we remove the helper immediately. Instead, make it invisible
    // and then remove it momentarily
    $helper.css('opacity', 0);
    setTimeout(function () {
        $helper.remove();
    }, 0);
}

/* Handle paste events */
function pasteHandler(e) {
   // We need to check if event.clipboardData is supported (Chrome)
   if (e.clipboardData) {
      // Get the items from the clipboard
      var items = e.clipboardData.items;
      if (items) {
         // Loop through all items, looking for any kind of image
         for (var i = 0; i < items.length; i++) {
            console.log(items[i].type);

            if (items[i].type.indexOf("text/plain") !== -1) {
                items[i].getAsString(function (result) {
                    // When a user copies an image internally, we set the clipboard
                    // to image data that starts with these characters, so if we see
                    // them, attempt to interpret the string as a png for pasting.
                    if (result.substring(0, 15) === 'data:image/png;') {
                        pasteImageFromSource(result);
                    }
                });
            }
            if (items[i].type.indexOf("image") !== -1) {
               // We need to represent the image as a file,
               var blob = items[i].getAsFile();
               // and use a URL or webkitURL (whichever is available to the browser)
               // to create a temporary URL to the object
               var URLObj = window.URL || window.webkitURL;
               var source = URLObj.createObjectURL(blob);
               // The URL can then be used as the source of an image
               pasteImageFromSource(source);

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

function pasteImageFromSource(source) {
    try {
        loadImage(source, function (image) {
             // Apply change to all context that are displaying the current graphics.
             [sourceContext, cells[selectedLayer][selectedFrame].context, previewFrameContext, previewLayerContext].forEach(function (context) {
                 context.drawImage(image, 0, 0);
             });
             setSelection(0, 0, image.width, image.height);
             setTool('move');
        });
    }catch(error) {
        console.log(error);
    }
}

$('.js-color').on('change', updateBrush);
$('.js-opacity').on('change', function (event) {
    $('.js-opacityText').val($('.js-opacity').val());
    updateBrush();
});
$('.js-opacityText').on('change,keyup,click,keypress,mouseover,mousedown', function (event) {
    console.log('?');
    $('.js-opacity').val(constrain($('.js-opacityText').val(), 0, 255));
    updateBrush();
});
function updateBrush() {
    var hexColor = $('.js-color').val();
    setColor(drawBrush.data,
        constrain(parseInt(hexColor.substring(0, 2), 16), 0, 255),
        constrain(parseInt(hexColor.substring(2, 4), 16), 0, 255),
        constrain(parseInt(hexColor.substring(4, 6), 16), 0, 255),
        constrain($('.js-opacity').val(), 0, 255)
    );
    var color = $('.js-colorTile.selected').data('color');
    color[0] = drawBrush.data[0];
    color[1] = drawBrush.data[1];
    color[2] = drawBrush.data[2];
    color[3] = drawBrush.data[3];
     $('.js-colorTile.selected')
        .css('background-color',  colorToHexValue(color))
        .css('opacity',  colorToAlphaValue(color))
        .data('color', color);
}
function updateColorsControls() {
    $('.js-color')[0].color.fromRGB(drawBrush.data[0] / 255, drawBrush.data[1] / 255, drawBrush.data[2] / 255);
    $('.js-opacity').val(drawBrush.data[3]);
    $('.js-opacityText').val(drawBrush.data[3]);
}

// Add the paste event listener
window.addEventListener("paste", pasteHandler);

// Add the paste event listener
window.addEventListener("copy", copyHandler);