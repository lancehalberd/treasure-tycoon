'use strict';

var images = {};
function loadImage(source, callback) {
    images[source] = new Image();
    images[source].onload = function () {
        callback();
    };
    images[source].src = source;
}
/**
 * @param {Number} width
 * @param {Number} height
 * @return {Element}
 */
function createCanvas(width, height, classes) {
    classes = ifdefor(classes, '');
    return $('<canvas class="' + classes + '"width="' + width + '" height="' + height + '"></canvas>')[0];
}

function Animal(index, frames) {
    this.index = index;
    this.frames = frames;
}

var fps = 6;

async.mapSeries(['gfx/man.png'], loadImage, function(err, results){
    setInterval(mainLoop, 20);
});

function mainLoop() {
    $('.js-playerPanel').each(function (index, element) {
        var canvas = $(element).find('.js-canvas')[0];
        var width = canvas.width;
        var height = canvas.height;
        var context = canvas.getContext("2d");
        var frames = 4;
        var frame = Math.floor(now() * fps / 1000) % frames;
        context.clearRect(0, 0, width, height);
        context.imageSmoothingEnabled= false;
        context.drawImage(images['gfx/man.png'], frame * 32, 0 , 32, 64,
                              50, 240 - 128, 64, 128);
    });
    //drawPlayer();
}

$('.js-newPlayer').on('click', function (event) {
    var $newPlayerPanel = $('.js-playerPanelTemplate').clone()
        .removeClass('js-playerPanelTemplate').addClass('js-playerPanel').show();

    $(this).after($newPlayerPanel);
    //$('.js-playerColumn').animate({ scrollTop: $('.js-playerColumn').prop('scrollHeight') }, "slow");
});


$('.js-newItem').on('click', function (event) {
    $('.js-inventory').prepend($tag('div', 'item', $('.item').length)); // $('<div class="playerPanel"></div>');
});