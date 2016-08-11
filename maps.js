var maps = {};
maps.northernWilderness = {
    'name': 'Northern Wilderness',
    'levels': {
        'grove': {'x': 10, 'y': 4, 'unlocks': ['savannah', 'orchard', 'cave']},
        'savannah': { 'x': 6, 'y': 3, 'unlocks': ['range']},
        'orchard': { 'x': 13, 'y': 3, 'unlocks': ['crevice']},
        'range': { 'x': 8, 'y': 2, 'unlocks': ['valley']},
        'crevice': { 'x': 15, 'y': 2, 'unlocks': ['valley']},
        'valley': { 'x': 10, 'y': 1, 'unlocks': []},
    },
    'exits': {
        'easternHighway': {'x': 12, 'y': 5, 'degrees': -60},
        'westCoast': {'x': 8, 'y': 5, 'degrees': 210},
        'lushForest': {'x': 19, 'y': 3, 'degrees': -10},
        'fertileDelta': {'x': 0, 'y': 3, 'degrees': -10}
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
        'mountain': { 'x': 11, 'y': 2, 'unlocks': []},
    },
    'exits': {
        'northernWilderness': {'x': 0, 'y': 0, 'degrees': 150},
        'westCoast': {'x': 0, 'y': 5, 'degrees': 180},
        'lushForest': {'x': 10, 'y': 0, 'degrees': 110}
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
        'dungeon': { 'x': 8, 'y': 2, 'unlocks': []},
    },
    'exits': {
        'easternHighway': {'x': 19, 'y': 5, 'degrees': 0},
        'northernWilderness': {'x': 19, 'y': 0, 'degrees': 30},
        'fertileDelta': {'x': 0, 'y': 3, 'degrees': -10}
    }
};
maps.lushForest = {
    'name': 'Lush Forest',
    'levels': {
        'forestfloor': { 'x': 2, 'y': 3, 'unlocks': ['shrubbery', 'mossbed','meadow','grove']},
        'shrubbery': { 'x': 6, 'y': 1, 'unlocks': ['ruins']},
        'mossbed': { 'x': 4, 'y': 4, 'unlocks': ['riverbank']},
        'riverbank': { 'x': 8, 'y': 4, 'unlocks': ['ruins']},
        'ruins': { 'x': 10, 'y': 2, 'unlocks': ['canopy','cliff','understorey']},
        'understorey': { 'x': 12, 'y': 4, 'unlocks': ['canopy']},
        'canopy': { 'x': 14, 'y': 3, 'unlocks': ['emergents']},
        'cliff': { 'x': 13, 'y': 1, 'unlocks': ['emergents']},
        'emergents': { 'x': 16, 'y': 2, 'unlocks': ['ravine']},
        'ravine': { 'x': 18, 'y': 4, 'unlocks': []},
    },
    'exits': {
        'northernWilderness': {'x': 0, 'y': 3, 'degrees': 170},
        'easternHighway': {'x': 10, 'y': 5, 'degrees': -60}
    }
};
maps.fertileDelta = {
    'name': 'Fertile Delta',
    'levels': {
        'shore': { 'x': 2, 'y': 3, 'unlocks': ['oceanside','cave','grove']},
        'oceanside': { 'x': 6, 'y': 1, 'unlocks': ['wetlands','floodplain']},
        'wetlands': { 'x': 4, 'y': 4, 'unlocks': ['meander']},
        'floodplain': { 'x': 8, 'y': 4, 'unlocks': ['meander']},
        'levee': { 'x': 10, 'y': 2, 'unlocks': ['channel']},
        'meander': { 'x': 12, 'y': 4, 'unlocks': ['levee']},
        'channel': { 'x': 14, 'y': 3, 'unlocks': ['confluence']},
        'confluence': { 'x': 13, 'y': 1, 'unlocks': ['tributaries']},
        'tributaries': { 'x': 16, 'y': 2, 'unlocks': ['headwaters']},
        'headwaters': { 'x': 18, 'y': 4, 'unlocks': []},
        //needs levels created and rearrangement of areas
    },
    'exits': {
        'northernWilderness': {'x': 0, 'y': 3, 'degrees': 170},
        'westCoast': {'x': 10, 'y': 5, 'degrees': -60}
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
    if (editingMap) {
        drawNewMap();
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
            if (currentArea.levels[nextLevelKey] && state.areas[state.currentArea][nextLevelKey] && state.areas[state.currentArea][levelKey]) {
                var nextLevelData = currentArea.levels[nextLevelKey];
                context.moveTo(levelData.x * 40 + 20, levelData.y * 40 + 25);
                context.lineTo(nextLevelData.x * 40 + 20, nextLevelData.y * 40 + 25);
            }
        });
    });
    context.stroke();
    context.restore();
    // Draw treasure chests on each node.
    var shrineSource = {'image': images['gfx/militaryIcons.png'], 'xOffset': 102, 'yOffset': 125, 'width': 16, 'height': 16};
    var circleSource = {'image': images['gfx/militaryIcons.png'], 'xOffset': 51, 'yOffset': 90, 'width': 16, 'height': 16};
    var checkSource = {'image': images['gfx/militaryIcons.png'], 'xOffset': 68, 'yOffset': 90, 'width': 16, 'height': 16};
    var bronzeSource = {'image': images['gfx/militaryIcons.png'], 'xOffset': 102, 'yOffset': 40, 'width': 16, 'height': 16};
    var silverSource = {'image': images['gfx/militaryIcons.png'], 'xOffset': 85, 'yOffset': 40, 'width': 16, 'height': 16};
    var goldSource = {'image': images['gfx/militaryIcons.png'], 'xOffset': 68, 'yOffset': 40, 'width': 16, 'height': 16};
    $.each(currentArea.levels, function (levelKey, levelData){
        var level = map[levelKey];
        // Don't draw levels that have not been unlocked yet.
        if (!state.areas[state.currentArea][levelKey]) {
            return;
        }
        var divinityScore = ifdefor(state.selectedCharacter.divinityScores[levelKey], 0);

        if ((divinityScore !== 0)) {
            // Draw the shrine only if the character has completed this level.
            context.save();
            // Disable shrine if the character did not just complete this area.
            if (state.selectedCharacter.currentLevelKey !== levelKey || !state.selectedCharacter.levelCompleted) {
                context.globalAlpha = .5;
            }
            context.translate(levelData.x * 40, levelData.y * 40);
            context.drawImage(shrineSource.image, shrineSource.xOffset, shrineSource.yOffset, shrineSource.width, shrineSource.height,
                              -12, -12, 24, 24);
            if (state.selectedCharacter.adventurer.abilities.indexOf(level.skill) >= 0) {
                // If the character has learned the ability for this level, draw a check mark on the shrine.
                context.drawImage(checkSource.image, checkSource.xOffset, checkSource.yOffset, checkSource.width, checkSource.height,
                                    -12, -12, 24, 24);
            } else if (state.selectedCharacter.divinity < totalCostForNextLevel(state.selectedCharacter, level)) {
                // If the character can't afford the ability for this leve, draw a red circle around the shrine.
                context.drawImage(circleSource.image, circleSource.xOffset, circleSource.yOffset, circleSource.width, circleSource.height,
                                    -12, -12, 24, 24);
            }
            context.restore();
        }
        if (state.selectedCharacter.currentLevelKey === levelKey) {
            //var fps = Math.floor(3 * 5 / 3);
            var frame = 1;//Math.floor(now() * fps / 1000) % walkLoop.length;
            context.save();
            context.translate(levelData.x * 40 + 25, levelData.y * 40 - 40);
            context.drawImage(state.selectedCharacter.adventurer.personCanvas, walkLoop[frame] * 32, 0 , 32, 64, 0, -0, 32, 64);
            context.restore();
        }


        var source = (divinityScore !== 0) ? openChestSource : closedChestSource;
        context.drawImage(source.image, source.xOffset, 0, source.width, source.height,
                          levelData.x * 40 + 20 - 16, levelData.y * 40 + 20 - 18, 32, 32);


        if (divinityScore > 0) {
            context.fillStyle = 'black';
            context.fillRect(levelData.x * 40, levelData.y * 40 + 34, 40, 15);
            context.fillStyle = 'white';
            context.font = '10px sans-serif';
            context.textAlign = 'center'
            context.fillText(abbreviateDivinity(divinityScore), levelData.x * 40 + 20, levelData.y * 40 + 45);
            source = silverSource;
            var baseScore = Math.round(baseDivinity(level.level));
            if (baseScore > divinityScore) {
                source = bronzeSource;
            } else if (baseScore < divinityScore) {
                source = goldSource;
            }
            context.drawImage(source.image, source.xOffset, source.yOffset, source.width, source.height,
                              levelData.x * 40 - 10, levelData.y * 40 + 34, 16, 16);
        }
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
    if (editingMap) {
        return getNewMapPopupTarget(x, y);
    }
    var currentArea = maps[state.currentArea];
    currentMapTarget = null;
    $.each(currentArea.levels, function (levelKey, levelData){
        if (!state.areas[state.currentArea][levelKey]) {
            return true;
        }
        if (isPointInRect(x, y, levelData.x * 40, levelData.y * 40, 40, 40)) {
            var level = map[levelKey];
            levelData.helptext = '<p>Level ' + level.level + ' ' + level.name +'</p><br/>';
            var skill = abilities[level.skill];
            if (state.selectedCharacter.adventurer.abilities.indexOf(skill) < 0) {
                levelData.helptext += '<p style="font-weight: bold">Visit shrine to learn: ' + skill.name + '</p>';
            } else {
                levelData.helptext += '<p style="font-size: 12">' + state.selectedCharacter.adventurer.name + ' has already learned:</p>' + skill.name + '</p>';
            }

            currentMapTarget = levelData;
            currentMapTarget.overShrine = false;
            return false;
        }
        var divinityScore = ifdefor(state.selectedCharacter.divinityScores[levelKey], 0);
        if (divinityScore > 0 && isPointInRect(x, y, levelData.x * 40 - 12, levelData.y * 40 - 12, 24, 24)) {
            var level = map[levelKey];
            levelData.helptext = ''
            if (state.selectedCharacter.currentLevelKey !== levelKey || !state.selectedCharacter.levelCompleted) {
                levelData.helptext += '<p style="font-size: 12">An adventurer can only visit the shrine for the last adventure they completed.</p><br/>';
            }
            var totalCost = totalCostForNextLevel(state.selectedCharacter, level);
            if (state.selectedCharacter.adventurer.abilities.indexOf(level.skill) < 0  && state.selectedCharacter.divinity < totalCost) {
                levelData.helptext += '<p style="font-size: 12">' + state.selectedCharacter.adventurer.name + ' does not have enough divinity to learn the skill from this shrine.</p><br/>';
            }
            var skill = abilities[level.skill];
            if (state.selectedCharacter.adventurer.abilities.indexOf(level.skill) < 0) {
                levelData.helptext += '<p style="font-weight: bold">Spend ' + totalCost + ' divinity at this shrine to learn:</p>' + abilityHelpText(skill, state.selectedCharacter);
            } else {
                levelData.helptext += '<p style="font-size: 12px">' + state.selectedCharacter.adventurer.name + ' has already learned:</p>' + abilityHelpText(skill, state.selectedCharacter);
            }

            currentMapTarget = levelData;
            currentMapTarget.overShrine = true;
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
    if (editingMap) {
        return clickNewMapHandler(x, y);
    }
    if (!currentMapTarget) return;
    if (currentMapTarget.areaKey) {
        state.currentArea = currentMapTarget.areaKey;
        drawMap();
    } else if (currentMapTarget.overShrine && state.selectedCharacter.currentLevelKey === currentMapTarget.levelKey && state.selectedCharacter.board.boardPreview) {
        showContext('jewel');
    } else if (!currentMapTarget.overShrine && currentMapTarget.levelKey) {
        startArea(state.selectedCharacter, currentMapTarget.levelKey);
    }
}

function completeLevel(character) {
    // If the character beat the last adventure open to them, unlock the next one
    var level = map[character.currentLevelKey];
    increaseAgeOfApplications();
    var oldDivinityScore = ifdefor(state.selectedCharacter.divinityScores[character.currentLevelKey], 0);
    if (oldDivinityScore === 0) {
        character.fame += level.level;
        gain('fame', level.level);
        var areaKey = levelsToAreas[character.currentLevelKey];
        if (!areaKey) {
            console.log('No area key for: ' + character.currentLevelKey);
            return;
        }
        // Unlock the next areas.
        var levelData = maps[areaKey].levels[character.currentLevelKey];
        levelData.unlocks.forEach(function (levelKey) {
            unlockMapLevel(levelKey);
        });
    }
    var numberOfWaves = Math.max(level.events.length,  Math.floor(5 * Math.sqrt(level.level))) + 1; // Count the chest as a wave.
    var timeBonus = (character.completionTime <= numberOfWaves * (5 + level.level / 2)) ? 1.2 : (character.completionTime <= numberOfWaves * (10 + level.level / 2)) ? 1 : .8;
    var newDivinityScore = Math.round(timeBonus * baseDivinity(level.level));
    character.divinity += Math.max(0, newDivinityScore - oldDivinityScore);
    character.divinityScores[character.currentLevelKey] = Math.max(oldDivinityScore, newDivinityScore);
    character.levelCompleted = true;

    // This code will be used when they activate a shrine
    if (level.board && character.adventurer.abilities.indexOf(level.skill) < 0 && character.divinity >= totalCostForNextLevel(character, level)) {
        if (!boards[level.board]) {
            throw new Error("Could not find board: " + level.board);
        }
        if (!abilities[level.skill]) {
            throw new Error("Could not find ability: " + level.skill);
        }
        var boardPreview = readBoardFromData(boards[level.board], character, abilities[level.skill]);
        centerShapesInRectangle(boardPreview.fixed.map(jewelToShape).concat(boardPreview.spaces), rectangle(0, 0, character.boardCanvas.width, character.boardCanvas.height));
        snapBoardToBoard(boardPreview, character.board);
        character.board.boardPreview = boardPreview;
        // This will show the confirm skill button if this character is selected.
        updateConfirmSkillButton();
    }
    unlockItemLevel(level.level);
    if (character === state.selectedCharacter) {
        drawMap();
    }
    saveGame();
}
$('body').on('click', '.js-confirmSkill', function (event) {
    var character = state.selectedCharacter;
    var level = map[character.currentLevelKey];
    var skill = character.board.boardPreview.fixed[0].ability;
    character.divinity -= totalCostForNextLevel(character, level);
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
    updateConfirmSkillButton();
    drawMap();
    saveGame();
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
