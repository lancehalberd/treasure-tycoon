
var LEFT = 37;
var UP = 38;
var RIGHT = 39;
var DOWN = 40;
var WEB = 32;
var SPACE = 32;
var keys = [LEFT, UP, RIGHT, DOWN, WEB, SPACE];
var keyDown = {};
var logDown = true;
$(document).on('keydown', function(event) {
    if (keys.indexOf(event.which) >= 0) {
        event.preventDefault();
        keyDown[event.which] = true;
    }
    if (event.keyCode == SPACE) {
        logDown = true;
    }
});
$(document).on('keyup', function(event) {
    if (keys.indexOf(event.which) >= 0) {
        event.preventDefault();
        keyDown[event.which] = false;
    }
    if (event.keyCode == SPACE) {
        logDown = false;
    }
});