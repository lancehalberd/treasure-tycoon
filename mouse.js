
var mousePosition = [140, 20];

$(document).on("mousemove", function (event) {
    mousePosition = [event.pageX - $('.js-mouseContainer').offset().left,
                     event.pageY - $(".js-mouseContainer").offset().top];
});
var mouseDown = false;
$(document).on('mousedown', function() {
    mouseDown = true;
});
$(document).on('mouseup', function() {
    mouseDown = false;
});