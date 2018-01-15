'use strict';

var fps = 6;
var homeSource = {'image': requireImage('gfx/nielsenIcons.png'), 'left': 32, 'top': 128, 'width': 32, 'height': 32};
var shrineSource = {'image': requireImage('gfx/militaryIcons.png'), 'left': 102, 'top': 125, 'width': 16, 'height': 16};
const render = () => {
    try {
    window.requestAnimationFrame(render);
    if (!gameHasBeenInitialized) {
        return;
    }
    if ($('.js-jewelInventory').is(":visible")) redrawInventoryJewels();
    var fps = Math.floor(3 * 5 / 3);
    var characters = testingLevel ? [state.selectedCharacter] : state.characters;
    for (var character of characters) {
        var hero = character.hero;
        var frame = arrMod(hero.source.walkFrames, Math.floor(now() * fps / 1000));
        character.characterContext.clearRect(0, 0, 40, 20);
        if (state.selectedCharacter === character) {
            previewContext.clearRect(0, 0, 64, 128);
            previewContext.drawImage(hero.personCanvas, frame * 96, 0 , 96, 64, -64, -20, 192, 128);
            character.characterContext.globalAlpha = 1;
        } else {
            character.characterContext.globalAlpha = .5;
        }
        var jobSource = hero.job.iconSource;
        drawImage(character.characterContext, jobSource.image, jobSource, {'left': 0, 'top': 0, 'width': 20, 'height': 20});
        character.characterContext.drawImage(hero.personCanvas, frame * 96, 0 , 96, 64, -20, -18, 96, 64);
        character.characterContext.globalAlpha = 1;
        if (state.selectedCharacter !== character) {
            if (ifdefor(character.isStuckAtShrine)) drawImage(character.characterContext, shrineSource.image, shrineSource, rectangle(0, 0, 16, 16));
            else if (!character.adventurer.area) drawImage(character.characterContext, homeSource.image, homeSource, rectangle(0, 0, 16, 16));
        }
    }
    if (state.selectedCharacter.context === 'adventure' || state.selectedCharacter.context === 'guild') {
        if (editingLevel && !testingLevel) {
            drawArea(editingLevel);
            if (editingLevel && editingLevel.board) {
                var board = boards[editingLevel.board];
                board = readBoardFromData(board, state.selectedCharacter, abilities[editingLevel.skill], true);
                centerShapesInRectangle(board.fixed.map(jewelToShape).concat(board.spaces), rectangle(600, 0, 150, 150));
                drawBoardBackground(mainContext, board);
                drawBoardJewelsProper(mainContext, [0, 0], board);
            }
        } else drawArea(state.selectedCharacter.hero.area);
        drawSkills(state.selectedCharacter.hero);
    }
    if (state.selectedCharacter.context === 'map') drawMap();
    if (state.selectedCharacter.context === 'item') drawCraftingCanvas();
    if (state.selectedCharacter.context === 'jewel') drawBoardJewels(state.selectedCharacter, jewelsCanvas);
    if (choosingTrophyAltar) drawTrophySelection();
    if (upgradingObject) drawUpgradeBox();
    if ($('.js-mainCanvas').is(':visible')) {
        drawHud();
    }
    drawTrophyPopups();
    } catch (e) {
        console.log(e);
        debugger;
    }
};
render();
