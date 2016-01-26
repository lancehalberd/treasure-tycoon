
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
function relativeMousePosition(element) {
    var elementOffset = $(element).offset();
    var containerOffset = $('.js-mouseContainer').offset();
    return [mousePosition[0] - (elementOffset.left - containerOffset.left),
            mousePosition[1] - (elementOffset.top - containerOffset.top)];
}