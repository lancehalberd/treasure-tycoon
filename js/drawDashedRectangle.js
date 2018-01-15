
/**
 * Draws an animated dashed rectangle to the given context.
 */
function drawDashedRectangle(context, rectangle) {
    context.save();
    context.lineWidth = 1;
    context.strokeStyle = 'black';
    var frame = Math.floor(now() / 80) % 10;
    if (frame < 5) {
        context.setLineDash([frame, 5, 5 - frame, 0]);
    } else {
        context.setLineDash([0, frame - 5, 5, 10 - frame]);
    }
    context.strokeRect(rectangle.left, rectangle.top, rectangle.width, rectangle.height);
    context.strokeStyle = 'white';
    frame = (frame + 5) % 10;
    if (frame < 5) {
        context.setLineDash([frame, 5, 5 - frame, 0]);
    } else {
        context.setLineDash([0, frame - 5, 5, 10 - frame]);
    }
    context.strokeRect(rectangle.left, rectangle.top, rectangle.width, rectangle.height);
    context.restore();
}
