function drawBoardBackground(context, board) {
    for (var i = 0; i < board.spaces.length; i++) {
        var points = board.spaces[i].points;
        context.beginPath();
        context.moveTo(points[0][0], points[0][1]);
        for (var j = 1; j < points.length; j++) {
            context.lineTo(points[j][0], points[j][1]);
        }
        context.closePath();
        context.lineWidth = 5;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = '#888888';
        context.stroke();
    }
    for (var i = 0; i < board.spaces.length; i++) {
        var points = board.spaces[i].points;
        context.beginPath();
        context.moveTo(points[0][0], points[0][1]);
        for (var j = 1; j < points.length; j++) {
            context.lineTo(points[j][0], points[j][1]);
        }
        context.closePath();
        context.lineWidth = 1;
        context.fillStyle = '#555555';
        context.strokeStyle = '#555555';
        context.fill();
        context.stroke();
    }
}
function drawBoardJewels(character) {
    var canvas = character.jewelsCanvas;
    var lightSource = relativeMousePosition(canvas);
    var context = character.jewelsContext
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(character.boardCanvas, 0, 0, canvas.width, canvas.height);
    var board = character.adventurer.board;
    var focusedJewelIsOnBoard = false;
    for (var i = 0; i < board.fixed.length; i++) {
        var jewel = board.fixed[i];
        drawJewel(context, jewel.shape, lightSource);
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