var maps = {};
maps.northernWilderness = {
    'name': 'Northern Wilderness',
    'levels': {
        'grove': {'x': 10, 'y': 4, 'unlocks': ['savannah', 'orchard', 'cave']},
        'savannah': { 'x': 6, 'y': 3, 'unlocks': ['range']},
        'orchard': { 'x': 13, 'y': 3, 'unlocks': ['crevice']},
        'range': { 'x': 8, 'y': 2, 'unlocks': ['valley']},
        'crevice': { 'x': 15, 'y': 2, 'unlocks': ['valley']},
        'valley': { 'x': 10, 'y': 1, 'unlocks': ['oceanoftrees6']},
    },
    'exits': {
        'easternHighway': {'x': 12, 'y': 5, 'degrees': -30},
        'westCoast': {'x': 8, 'y': 5, 'degrees': 210}
    }
};
maps.easternHighway = {
    'name': 'Eastern Highway',
    'levels': {
        'meadow': { 'x': 1, 'y': 3, 'unlocks': ['garden', 'road', 'grove']},
        'garden': { 'x': 3, 'y': 1, 'unlocks': ['trail']},
        'road': { 'x': 4, 'y': 4, 'unlocks': ['tunnel']},
        'trail': { 'x': 6, 'y': 1, 'unlocks': ['mountain']},
        'tunnel': { 'x': 8, 'y': 3, 'unlocks': ['mountain']},
        'mountain': { 'x': 11, 'y': 2, 'unlocks': ['eternalfields6']},
    },
    'exits': {
        'northernWilderness': {'x': 0, 'y': 0, 'degrees': 150},
        'westCoast': {'x': 0, 'y': 5, 'degrees': 180}
    }
};
maps.westCoast = {
    'name': 'West Coast',
    'levels': {
        'cave': { 'x': 18, 'y': 3, 'unlocks': ['cemetery', 'temple', 'meadow']},
        'cemetery': { 'x': 16, 'y': 1, 'unlocks': ['crypt']},
        'temple': { 'x': 14, 'y': 4, 'unlocks': ['bayou']},
        'crypt': { 'x': 12, 'y': 1, 'unlocks': ['dungeon']},
        'bayou': { 'x': 10, 'y': 4, 'unlocks': ['dungeon']},
        'dungeon': { 'x': 8, 'y': 2, 'unlocks': ['bottomlessdepths6']},
    },
    'exits': {
        'easternHighway': {'x': 19, 'y': 5, 'degrees': 0},
        'northernWilderness': {'x': 19, 'y': 0, 'degrees': 30}
    }
};
var levelsToAreas = {};
$.each(maps, function (areaKey, area) {
    area.areaKey = areaKey;
    $.each(area.levels, function (levelKey, data) {
        data.levelKey = levelKey;
        levelsToAreas[levelKey] = areaKey;
    });
    $.each(area.exits, function (areaKey, data) {
        data.areaKey = areaKey;
    });
});
function drawMap() {
    // don't draw the map if the character is currently on an adventure.
    if (state.selectedCharacter.area) {
        return;
    }
    var context = mainContext;
    var currentArea = maps[state.currentArea];
    // Draw parchment backdrop.
    var pattern = context.createPattern(images['gfx/oldMap.png'], 'repeat');
    context.fillStyle = pattern;
    context.fillRect(0, 0, 800, 240);
    // Draw ovals for each node.
    $.each(currentArea.levels, function (levelKey, levelData){
        // Don't draw levels that have not been unlocked yet.
        if (!state.areas[state.currentArea][levelKey]) {
            return;
        }
        context.fillStyle = 'white';
        context.beginPath();
        context.save();
        context.translate(levelData.x * 40 + 20, levelData.y * 40 + 25);
        context.scale(1, .5);
        context.arc(0, 0, 22, 0, 2 * Math.PI);
        context.fill();
        context.restore();
    });
    // Draw lines connecting connected nodes.
    context.save();
    context.strokeStyle = 'white';
    context.lineWidth = 5;
    context.beginPath();
    $.each(currentArea.levels, function (levelKey, levelData){
        levelData.unlocks.forEach(function (nextLevelKey) {
            // Don't draw links to levels outside of this area or to levels that have not been unlocked yet.
            if (currentArea.levels[nextLevelKey] && state.areas[state.currentArea][nextLevelKey]) {
                var nextLevelData = currentArea.levels[nextLevelKey];
                context.moveTo(levelData.x * 40 + 20, levelData.y * 40 + 25);
                context.lineTo(nextLevelData.x * 40 + 20, nextLevelData.y * 40 + 25);
            }
        });
    });
    context.stroke();
    context.restore();
    // Draw treasure chests on each node.
    $.each(currentArea.levels, function (levelKey, levelData){
        // Don't draw levels that have not been unlocked yet.
        if (!state.areas[state.currentArea][levelKey]) {
            return;
        }
        var source = state.selectedCharacter.levelsCompleted[levelKey] ? openChestSource : closedChestSource;
        context.drawImage(source.image, source.xOffset, 0, source.width, source.height,
                          levelData.x * 40 + 20 - 16, levelData.y * 40 + 20 - 18, 32, 32);
    });
    // Draw arrows pointing to other areas.
    // Images start at 0,6 and have 17 pixels between them.
    var arrowSource = {'image': images['gfx/militaryIcons.png'], 'xOffset': 0, 'yOffset': 6, 'width': 16, 'height': 16};
    $.each(currentArea.exits, function (areaKey, arrowData){
        // Don't draw exits to areas that have not been unlocked yet.
        if (!state.areas[arrowData.areaKey]) {
            return;
        }
        context.save();
        context.translate(arrowData.x * 40 + 20, arrowData.y * 40 + 20);
        context.rotate(-arrowData.degrees*Math.PI/180);
        context.drawImage(arrowSource.image, arrowSource.xOffset, arrowSource.yOffset, arrowSource.width, arrowSource.height,
                          -16, -16, 32, 32);
        context.restore();
    });
}

var currentMapTarget = null;
function getMapPopupTarget(x, y) {
    var currentArea = maps[state.currentArea];
    currentMapTarget = null;
    $.each(currentArea.levels, function (levelKey, levelData){
        if (!state.areas[state.currentArea][levelKey]) {
            return true;
        }
        if (isPointInRect(x, y, levelData.x * 40, levelData.y * 40, 40, 40)) {
            var level = levels[levelKey];
            levelData.helptext = '<p>Level ' + level.level + ' ' + level.name +'</p><br/>';
            if (state.selectedCharacter.adventurer.abilities.indexOf(level.skill) < 0) {
                levelData.helptext += '<p style="font-weight: bold">Visit shrine to learn:</p>' + abilityHelpText(level.skill, state.selectedCharacter);
            } else {
                levelData.helptext += '<p style="font-size: 10px">This character has already learned:</p>' + abilityHelpText(level.skill, state.selectedCharacter);
            }

            currentMapTarget = levelData;
            return false;
        }
        return true;
    });
    if (currentMapTarget) {
        return currentMapTarget;
    }
    $.each(currentArea.exits, function (areaKey, arrowData){
        if (!state.areas[areaKey]) {
            return true;
        }
        if (isPointInRect(x, y, arrowData.x * 40, arrowData.y * 40, 40, 40)) {
            arrowData.helptext = 'To ' + maps[areaKey].name;
            currentMapTarget = arrowData;
            return false;
        }
        return true;
    });
    return currentMapTarget;
}

function clickMapHandler(x, y) {
    if (!currentMapTarget) return;
    if (currentMapTarget.areaKey) {
        state.currentArea = currentMapTarget.areaKey;
        drawMap();
    } else if (currentMapTarget.levelKey) {
        startArea(state.selectedCharacter, currentMapTarget.levelKey);
    }
}

function completeLevel(character) {
    // If the character beat the last adventure open to them, unlock the next one
    var level = levels[character.currentLevelIndex];
    if (!character.levelsCompleted[character.currentLevelIndex]) {
        gain('fame', level.level);
        character.levelsCompleted[character.currentLevelIndex] = true;
        var areaKey = levelsToAreas[character.currentLevelIndex];
        if (!areaKey) {
            console.log('No area key for: ' + character.currentLevelIndex);
            return;
        }
        // Unlock the next areas.
        var levelData = maps[areaKey].levels[character.currentLevelIndex];
        levelData.unlocks.forEach(function (levelKey) {
            unlockMapLevel(levelKey);
        });
    }
    // If the character is able to learn a new skill, display the new skill segment on their skill board.
    // They can then apply it, or they can complete another area to try another piece. This is only applied
    // if they haven't learned the skill for the level they just completed.
    // The skill segment is added as a preview snapped to a valid position.
    // From there they can move it around and apply the change.
    if (character.adventurer.xpToLevel <= character.adventurer.xp && character.adventurer.abilities.indexOf(level.skill) < 0) {
        var previewBoard = readBoardFromData(level.board, character, level.skill);
        centerShapesInRectangle(previewBoard.fixed.map(jewelToShape).concat(previewBoard.spaces), rectangle(0, 0, character.boardCanvas.width, character.boardCanvas.height));
        snapBoardToBoard(previewBoard, character.board);
        character.board.boardPreview = previewBoard;
        // Only show them the jewel context if they don't have replay enabled.
        if (state.selectedCharacter === character && !character.replay) {
            showContext('jewel');
        }
        // Show the button that let's them confirm the skill board augmentation.
        $('.js-confirmSkill').show();
    }
    unlockItemLevel(level.level);
    if (character === state.selectedCharacter) {
        drawMap();
    }
}
$('body').on('click', '.js-confirmSkill', function (event) {
    var character = state.selectedCharacter;
    var skill = character.board.boardPreview.fixed[0].ability;
    character.adventurer.abilities.push(skill);
    character.board.spaces = character.board.spaces.concat(character.board.boardPreview.spaces);
    character.board.boardPreview.fixed.forEach(function (jewel) {
        jewel.confirmed = true;
    });
    character.board.fixed = character.board.fixed.concat(character.board.boardPreview.fixed);
    character.board.boardPreview = null;
    drawBoardBackground(character.boardContext, character.board);
    gainLevel(character.adventurer);
    updateAdventurer(character.adventurer);
    $('.js-confirmSkill').hide();
});
function unlockMapLevel(levelKey) {
    var areaKey = levelsToAreas[levelKey];
    if (!areaKey) {
        console.log('No area contains levelKey ' + levelKey);
        return;
    }
    state.areas[areaKey] = ifdefor(state.areas[areaKey], {});
    state.areas[areaKey][levelKey] = true;
}
