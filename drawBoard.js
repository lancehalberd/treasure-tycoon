function drawBoardBackground(context, board) {
    var spaces = board.spaces;
    context.lineWidth = 5;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.fillStyle = '#888888';
    context.strokeStyle = '#888888';
    for (var i = 0; i < spaces.length; i++) {
        var points = spaces[i].points;
        context.beginPath();
        context.moveTo(points[0][0], points[0][1]);
        for (var j = 1; j < points.length; j++) {
            context.lineTo(points[j][0], points[j][1]);
        }
        context.closePath();
        context.fill();
        context.stroke();
    }
    // This 1 pixel edge keeps gaps from appearing between sections
    context.lineWidth = 1;
    context.fillStyle = '#555555';
    context.strokeStyle = '#555555';
    for (var i = 0; i < board.spaces.length; i++) {
        var points = board.spaces[i].points;
        context.beginPath();
        context.moveTo(points[0][0], points[0][1]);
        for (var j = 1; j < points.length; j++) {
            context.lineTo(points[j][0], points[j][1]);
        }
        context.closePath();
        context.fill();
        context.stroke();
    }
}
function drawBoardJewels(character) {
    var lightSource = relativeMousePosition(jewelsCanvas);
    var context = jewelsContext
    var board = character.board;
    context.clearRect(0, 0, jewelsCanvas.width, jewelsCanvas.height);
    context.drawImage(character.boardCanvas, 0, 0, jewelsCanvas.width, jewelsCanvas.height);
    var focusedJewelIsOnBoard = false;
    var fixedJewels = board.fixed;
    if (draggedJewel && !overVertex) {
        var fillColor = (jewelTierLevels[draggedJewel.tier] > character.adventurer.level) ? '#FF0000' : '#00FF00';
        context.fillStyle = fillColor;
        context.globalAlpha = .5;
        for (var i = 0; i < board.spaces.length; i++) {
            var points = board.spaces[i].points;
            context.beginPath();
            context.moveTo(points[0][0], points[0][1]);
            for (var j = 1; j < points.length; j++) {
                context.lineTo(points[j][0], points[j][1]);
            }
            context.closePath();
            context.fill();
        }
        context.globalAlpha = 1;
    }
    for (var i = 0; i < fixedJewels.length; i++) {
        var jewel = fixedJewels[i];
        drawJewel(context, jewel.shape, lightSource);
    }
    if (board.boardPreview) {
        fixedJewels = board.boardPreview.fixed;
        for (var i = 0; i < fixedJewels.length; i++) {
            var jewel = fixedJewels[i];
            drawJewel(context, jewel.shape, lightSource);
            focusedJewelIsOnBoard = focusedJewelIsOnBoard || draggingBoardJewel == jewel || overJewel == jewel;
        }
        var spaces = board.boardPreview.spaces;
        context.globalAlpha = .5;
        context.fillStyle = 'green';
        for (var i = 0; i < spaces.length; i++) {
            var points = spaces[i].points;
            context.beginPath();
            context.moveTo(points[0][0], points[0][1]);
            for (var j = 1; j < points.length; j++) {
                context.lineTo(points[j][0], points[j][1]);
            }
            context.closePath();
            context.fill();
        }
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