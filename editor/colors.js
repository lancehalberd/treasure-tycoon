
var colorsPanel = new cb.Panel('Palette');
$('body').append(colorsPanel.$);
var defaultColors = [
    [0, 0, 0, 255], [0, 0, 0, 196], [0, 0, 0, 170], [0, 0, 0, 128], [0, 0, 0, 85], [0, 0, 0, 64],
    [255, 255, 255, 255], [255, 255, 255, 196], [255, 255, 255, 170], [255, 255, 255, 128], [255, 255, 255, 85], [255, 255, 255, 64],
    [255, 0, 0, 255], [196, 0, 0, 255], [180, 0, 0, 255], [128, 0, 0, 255], [85, 0, 0, 255], [64, 0, 0, 255],
    [0, 255, 0, 255], [0, 196, 0, 255], [0, 180,  0, 255], [0, 128, 0, 255], [0, 85, 0, 255], [0, 64, 0, 255],
    [0, 0, 255, 255], [0, 0, 196, 255], [0, 0, 180, 255], [0, 0, 128, 255], [0, 0, 85, 255], [0, 0, 64, 255]
];
function toColorHex(decimal) {
    var hex = decimal.toString(16);
    return hex.length == 2 ? hex : '0' + hex;
}
function colorToHexValue(color) {
    return '#' + toColorHex(color[0]) + toColorHex(color[1]) + toColorHex(color[2]);
}
function colorToAlphaValue(color) {
    return (color[3] / 255).toFixed(2);
}
function addNewColor(color) {
    color = [color[0], color[1], color[2], color[3]];
    $tile = $tag('div', 'js-colorTile colorTile').append(
            $tag('div', 'js-colorSquare colorSquare').css('background-color',  colorToHexValue(color)).css('opacity',  colorToAlphaValue(color))
        ).data('color', color);
    $('.js-newColor').before($tile);
}
var $colorPalette = $tag('div', 'palette').css('width', 34 * 6 + 'px');
$colorPalette.append($tag('div', 'js-newColor colorTile newColor', '+'));
colorsPanel.$content.append($colorPalette);
defaultColors.forEach(addNewColor);
$('.js-newColor').on('click', function (event) {
    addNewColor(drawBrush.data);
    $('.js-colorTile').removeClass('selected');
    $('.js-colorTile').last().addClass('selected');
    var rows = Math.ceil(($('.js-colorTile').length + 1) / 6);
    colorsPanel.contentHeight = rows * 34
    colorsPanel.refreshScrollBars();
});


$colorPalette.on('click', '.js-colorTile', function (event) {
    $('.js-colorTile').removeClass('selected');
    pickColor($(this).data('color'));
});
$colorPalette.on('dblclick', '.js-colorTile', function (event) {
    $('.js-colorTile').removeClass('selected');
    $(this).addClass('selected');
    pickColor($(this).data('color'));
    setTool('dropper');
});
function pickColor(color) {
    $('.js-color')[0].color.fromRGB(color[0] / 255, color[1] / 255, color[2] / 255);
    $('.js-opacity').val(color[3]);
    $('.js-opacityText').val(color[3]);
    updateBrush();
}

colorsPanel.$contentFrame.bind('mousewheel', function(e){
    colorsPanel.scrollVertical(-e.originalEvent.wheelDelta);
});
colorsPanel.contentWidth = 34 * 6;
colorsPanel.contentHeight = 34 * 6;
colorsPanel.refreshScrollBars();
