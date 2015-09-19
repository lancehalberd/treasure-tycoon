
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
    console.log(color);
    color = [color[0], color[1], color[2], color[3]];
    $('.js-newColor').before($tag('div', 'js-colorTile colorTile')
        .css('background-color',  colorToHexValue(color))
        .css('opacity',  colorToAlphaValue(color))
        .data('color', color));
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
    $(this).addClass('selected');
    var color = $(this).data('color');
    console.log(color);
    setColor(drawBrush.data, color[0], color[1], color[2], color[3]);
    updateColorsControls();
});
$('.js-colorTile').first().addClass('selected');

colorsPanel.$contentFrame.bind('mousewheel', function(e){
    colorsPanel.scrollVertical(-e.originalEvent.wheelDelta);
});
colorsPanel.contentWidth = 34 * 6;
colorsPanel.contentHeight = 34 * 6;
colorsPanel.refreshScrollBars();

