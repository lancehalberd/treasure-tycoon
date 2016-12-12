function drawShapesPath(context, shapes, fill, stroke) {
    for (var shape of shapes) {
        var points = shape.points;
        context.beginPath();
        context.moveTo(points[0][0], points[0][1]);
        for (var j = 1; j < points.length; j++) {
            context.lineTo(points[j][0], points[j][1]);
        }
        context.closePath();
        if (fill) context.fill();
        if (stroke) context.stroke();
    }
}

function drawBoardBackground(context, board) {
    context.lineWidth = 5;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.fillStyle = '#888888';
    context.strokeStyle = '#888888';
    drawShapesPath(context, board.spaces, true, true);
    // This 1 pixel edge keeps gaps from appearing between sections
    context.lineWidth = 1;
    context.fillStyle = '#555555';
    context.strokeStyle = '#555555';
    drawShapesPath(context, board.spaces, true, true);
}
function drawBoardJewels(character, canvas) {
    var context = canvas.getContext('2d');
    var board = character.board;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(character.boardCanvas, 0, 0, character.boardCanvas.width, character.boardCanvas.height);
    // Show open spaces as green or red when the player is dragging a jewel, indicating the character can equip the jewel or not.
    if (draggedJewel && !overVertex) {
        var fillColor = (jewelTierLevels[draggedJewel.tier] > character.adventurer.level) ? '#FF0000' : '#00FF00';
        context.fillStyle = fillColor;
        context.globalAlpha = .5;
        drawShapesPath(context, board.spaces, true, false);
        context.globalAlpha = 1;
    }
    drawBoardJewelsProper(context, relativeMousePosition(canvas), board);
}
function drawBoardJewelsProper(context, lightSource, board) {
    var focusedJewelIsOnBoard = false;
    var fixedJewels = board.fixed;
    for (var i = 0; i < fixedJewels.length; i++) {
        var jewel = fixedJewels[i];
        if (ifdefor(jewel.disabled)) {
            context.save();
            context.globalAlpha = .3;
            jewel.shape.color = '#fff';
            drawJewel(context, jewel.shape, lightSource);
            context.restore();
        } else {
            jewel.shape.color = '#333';
            drawJewel(context, jewel.shape, lightSource);
        }
    }
    if (board.boardPreview) {
        context.globalAlpha = .5;
        context.lineWidth = 5;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.fillStyle = '#888888';
        context.strokeStyle = '#888888';
        drawShapesPath(context, board.boardPreview.spaces, true, true);
        context.lineWidth = 1;
        context.fillStyle = '#555555';
        context.strokeStyle = '#555555';
        drawShapesPath(context, board.boardPreview.spaces, true, true);
        var fixedJewel = board.boardPreview.fixed[0];
        context.globalAlpha = 1;
        drawJewel(context, fixedJewel.shape, lightSource);
        focusedJewelIsOnBoard = focusedJewelIsOnBoard || draggingBoardJewel == fixedJewel || overJewel == fixedJewel;

        context.globalAlpha = .5 + .2 * Math.sin(now() / 150);
        context.fillStyle = '#ff0';
        drawShapesPath(context, [fixedJewel.shape], true, false);
        context.globalAlpha = 1;
    }
    for (var i = 0; i < board.jewels.length; i++) {
        var jewel = board.jewels[i];
        drawJewel(context, jewel.shape, lightSource);
        focusedJewelIsOnBoard = focusedJewelIsOnBoard || draggedJewel == jewel || overJewel == jewel;
    }
    if (overVertex && focusedJewelIsOnBoard) {
        context.strokeStyle = 'black';
        context.lineWidth = 1;
        context.beginPath();
        context.arc(overVertex[0], overVertex[1], 4, 0, Math.PI * 2);
        context.stroke();
    }
}