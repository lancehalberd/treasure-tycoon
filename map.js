var editingMap = false;
$.each(map, function (levelKey, levelData) {
    levelData.levelKey = levelKey;
});

function exportMap() {
    var lines = [];
    Object.keys(map).sort().forEach(function (levelKey) {
        var levelData = map[levelKey];
        var levelLines = ["    '" + levelKey+"': {"];
        levelLines.push("        'name': " + JSON.stringify(levelData.name) + ",");
        levelLines.push("        'description': " + JSON.stringify(ifdefor(levelData.description, '')) + ",");
        levelLines.push("        'level': " + JSON.stringify(levelData.level) + ",");
        levelLines.push("        'x': " + JSON.stringify(levelData.x) + ", 'y': " + JSON.stringify(levelData.y) + ",");
        levelLines.push("        'coords': " + JSON.stringify(levelData.coords.map(function (number) { return Number(number.toFixed(0));})) + ",");
        for (var key of ['background', 'unlocks', 'skill', 'enemySkills', 'monsters']) {
            levelLines.push("        '" + key + "': " + JSON.stringify(levelData[key]) + ",");
        }
        var eventLines = [];
        for (var event of levelData.events) {
            eventLines.push("            " + JSON.stringify(event));
        }
        if (eventLines.length) {
            levelLines.push("        'events': [");
            levelLines.push(eventLines.join(",\n"));
            levelLines.push("        ]");
        } else {
            levelLines.push("        'events': []");
        }
        levelLines.push("    }");
        lines.push(levelLines.join("\n"));
    });
    return "var map = {\n" + lines.join(",\n") + "\n};\nvar mapKeys = Object.keys(map);\n";
}
function exportMapToTextArea() {
    if (!$('textarea').length) {
        $('body').append($tag('textarea').attr('rows', '5').attr('cols', 30));
    }
    $('textarea').val(exportMap());

}
function exportMapToClipboard() {
    var $textarea = $tag('textarea');
    $('body').append($textarea);
    $textarea.val(exportMap());
    $textarea[0].select();
    console.log('Attempting to export map to clipboard: ' + document.execCommand('copy'));
    $textarea.remove();
}

var mapCenteringTarget = null, centerInstantly = false;
function updateMap() {
    if (draggedMap) {
        return;
    }
    if (mapCenteringTarget) {
        var differenceVector = new Vector(mapCenteringTarget.coords).subtract(mapLocation.position);
        var distance = differenceVector.magnitude();
        if (distance < 40) {
            mapCenteringTarget = null;
            return;
        }
        differenceVector = differenceVector.orthoganalize(mapLocation.position);
        // In the unlikely event differenceVector is parallel to mapLocation.position,
        // it will not be valid and we need to choose a random vector
        if (isNaN(differenceVector.getCoordinate(1))) {
            differenceVector.orthoganalize(new Vector([Math.random(), Math.random(), Math.random()]));
        }
        // This should never happen, so if it does, it probably means I did something wrong.
        if (isNaN(differenceVector.getCoordinate(1))) {
            console.log("failed to generate valid difference vector.");
            return;
        }
        differenceVector = differenceVector.normalize(5);
        var iterations = centerInstantly ? distance / 5 : distance / 50;
        for (var i = 0; i < iterations; i++) {
            mapLocation.moveByVector(differenceVector);
            // Fix the camera position each step, otherwise the up/right vectors
            // may not match what is being displayed any more.
            camera.position = mapLocation.position.normalize(world.radius * 2);
            camera.forward = camera.position.normalize(-1);
            camera.fixRightAndUp();
            camera.updateRotationMatrix();
        }
    }
  /*  var minX = minY = 1000000, maxX = maxY = -10000000;

    $.each(map, function (levelKey, levelData){
        if (!editingMap && !state.visibleLevels[levelKey]) {
            return;
        }
        minX = Math.min(levelData.x * 40, minX);
        minY = Math.min(levelData.y * 40, minY);
        maxX = Math.max(levelData.x * 40 + 40, maxX);
        maxY = Math.max(levelData.y * 40 + 40, maxY);
    });
    if (mapLeft < minX - mapWidth / 2) {
        mapLeft = (mapLeft * 5 + minX - mapWidth / 2) / 6;
        movedMap = true;
    }
    if (mapLeft > maxX - mapWidth / 2) {
        mapLeft = (mapLeft * 5 + maxX - mapWidth / 2) / 6;
        movedMap = true;
    }
    if (mapTop < minY - mapHeight / 2) {
        mapTop = (mapTop * 5 + minY - mapHeight / 2) / 6;
        movedMap = true;
    }
    if (mapTop > maxY - mapHeight / 2) {
        mapTop = (mapTop * 5 + maxY - mapHeight / 2) / 6;
        movedMap = true;
    }*/
}
function centerMapOnLevel(levelData, instant) {
    centerInstantly = instant;
    mapCenteringTarget = levelData;
    movedMap = true;
}

var mapLeft = -400, mapTop = -300, mapWidth = 800, mapHeight = 600;
var visibleNodes = {};
var selectedMapNodes = [];
var clickedMapNode = null;
var currentMapTarget = null;
function getMapPopupTarget(x, y) {
    var newMapTarget = null;
    if (!draggedMap) {
        newMapTarget = getMapPopupTargetProper(x, y);
    }
    if (newMapTarget !== currentMapTarget) {
        var level = newMapTarget ? (newMapTarget.isShrine ? newMapTarget.level.level : newMapTarget.level) : undefined;
        updateDamageInfo(state.selectedCharacter, $('.js-characterColumn .js-stats'), level);
    }
    if ((currentMapTarget && currentMapTarget.isShrine) && !(newMapTarget && newMapTarget.isShrine)) {
        hidePointsPreview();
    }
    currentMapTarget = newMapTarget;
    $('.js-mainCanvas').toggleClass('clickable', !!currentMapTarget);
    return currentMapTarget;
}
function getMapPopupTargetProper(x, y) {
    if (editingLevel) {
        return null;
    }
    var newMapTarget = getMapTarget(x, y);
    if (!newMapTarget) {
        return null;
    }
    if (ifdefor(newMapTarget.isShrine)) {
        newMapTarget.helpMethod = getMapShrineHelpText;
        var skill = abilities[newMapTarget.level.skill];
        if (!state.selectedCharacter.adventurer.unlockedAbilities[skill.key]) {
            var totalCost = totalCostForNextLevel(state.selectedCharacter, newMapTarget.level);
            previewPointsChange('divinity', -totalCost);
        }
    } else {
        newMapTarget.helpMethod = getMapLevelHelpText;
    }
    return newMapTarget;
}

function getMapLevelHelpText(level) {
    var helpText;
    if (!editingMap) {
        helpText = '<p style="font-weight: bold">Level ' + level.level + ' ' + level.name + '</p>';
    } else {
        helpText = '<p style="font-weight: bold">Level ' + level.level + ' ' + level.name +'(' + level.background +  ')</p><br/>';
        helpText += '<p><span style="font-weight: bold">Enemies:</span> ' + level.monsters.map(function (monsterKey) { return monsters[monsterKey].name;}).join(', ') + '</p>';
        if (level.events) {
            helpText += '<p><span style="font-weight: bold"># Events: </span> ' + level.events.length + '</p>';
            if (level.events.length) {
                helpText += '<p><span style="font-weight: bold">Boss Event: </span> ' + level.events[level.events.length - 1].map(function (monsterKey) { return monsters[monsterKey].name;}).join(', ') + '</p>';
            }
        } else {
            helpText += '<p style="font-weight: bold; color: red;">No Events!</p>';
        }
        helpText += '<p><span style="font-weight: bold">Enemy Skills:</span> ' + ifdefor(level.enemySkills, []).map(function (skillKey) { return abilities[skillKey].name;}).join(', ') + '</p>';
        helpText += '<br/><p style="font-weight: bold">Teaches:</p>';
        var skill = abilities[level.skill];
        if (skill) {
            helpText += abilityHelpText(skill, state.selectedCharacter.adventurer);
        } else {
            helpText += '<p>No Skill</p>';
        }
    }
    return helpText;
}
function getMapShrineHelpText(shrine) {
    var skill = abilities[shrine.level.skill];
    var totalCost = totalCostForNextLevel(state.selectedCharacter, shrine.level);
    var helpText = ''
    if (state.selectedCharacter.currentLevelKey !== shrine.level.levelKey || !state.selectedCharacter.levelCompleted) {
        helpText += '<p style="font-size: 12">An adventurer can only visit the shrine for the last adventure they completed.</p><br/>';
    }
    var skillAlreadyLearned = state.selectedCharacter.adventurer.unlockedAbilities[skill.key];
    if (!skillAlreadyLearned && state.selectedCharacter.adventurer.level >= maxLevel) {
        helpText += '<p style="font-size: 12">' + state.selectedCharacter.adventurer.name + ' has reached the maximum level and can no longer learn new abilities.</p><br/>';
    } else if (!skillAlreadyLearned && state.selectedCharacter.divinity < totalCost) {
        helpText += '<p style="font-size: 12">' + state.selectedCharacter.adventurer.name + ' does not have enough divinity to learn the skill from this shrine.</p><br/>';
    }
    if (!skillAlreadyLearned) {
        helpText += '<p style="font-weight: bold">Spend ' + totalCost + ' divinity at this shrine to level up and learn:</p>' + abilityHelpText(skill, state.selectedCharacter.adventurer);
    } else {
        helpText += '<p style="font-size: 12px">' + state.selectedCharacter.adventurer.name + ' has already learned:</p>' + abilityHelpText(skill, state.selectedCharacter.adventurer);
    }
    return helpText;
}

function getMapTarget(x, y) {
    var target = null;
    $.each(visibleNodes, function (levelKey, levelData){
        if (isPointInRect(x, y, levelData.left, levelData.top, levelData.width, levelData.height)) {
            target = levelData;
            return false;
        }
        if (!editingMap && levelData.shrine && isPointInRect(x, y, levelData.shrine.left, levelData.shrine.top, levelData.shrine.width, levelData.shrine.height)) {
            target = levelData.shrine;
            return false;
        }
        return true;
    });
    return target;
}

function updateMapKey(oldKey, newKey) {
    if (!map[oldKey]) return;
    $.each(map, function (key, level) {
        level.unlocks.forEach(function (value, index) {
            if (value === oldKey) {
                level.unlocks[index] = newKey;
            }
        })
    });
    var level = map[oldKey];
    level.levelKey = newKey;
    delete map[oldKey];
    map[newKey] = level;
}
function updateLevelKey(level) {
    if (!level) return;
    updateMapKey(level.levelKey, level.x + '_' + level.y);
}

function createNewLevel(coords) {
    var key = coords.map(function (number) {return number.toFixed(0);}).join('_');
    newMapTarget = {'x': 0, 'y': 0, 'coords': coords, 'levelKey': key, 'name': key, 'unlocks': [], 'level': 1, 'background': 'field', 'specialLoot': [], 'skill': null, 'board': null, 'enemySkills': [], 'monsters': ['skeleton'], 'events': [['dragon']]};
    // If there already happens to be a level with this key, update it.
    updateLevelKey(map[key]);
    map[key] = newMapTarget;
    selectedMapNodes = [newMapTarget];
}
function toggleLevelLink(levelA, levelB) {
    var index = levelA.unlocks.indexOf(levelB.levelKey);
    if (index >= 0) {
        levelA.unlocks.splice(index, 1);
    } else {
        levelA.unlocks.push(levelB.levelKey);
    }
}

var mapDragX = mapDragY = null, draggedMap = false;
var selectionStartPoint = null;
var originalSelectedNodes = [];

// Disable context menu while editing the map because the right click is used for making nodes and edges.
$('.js-mouseContainer').on('contextmenu', '.js-mainCanvas', function (event) {
    return !editingMap;
});
$('.js-mouseContainer').on('mousedown', '.js-mainCanvas', function (event) {
    if (state.selectedCharacter.area) return;
    var x = event.pageX - $(this).offset().left;
    var y = event.pageY - $(this).offset().top;
    //console.log(camera.unprojectPoint(x + mapLeft, y + mapTop, world.radius));

    var newMapTarget = getMapTarget(x, y);
    if (editingMap) {
        if (event.which === 3) {
            if (!newMapTarget) {
                createNewLevel(camera.unprojectPoint(x + mapLeft, y + mapTop, world.radius));
            } else {
                clickedMapNode = newMapTarget;
                selectedMapNodes = [newMapTarget];
            }
        } else if (!event.shiftKey) {
            if (newMapTarget) {
                clickedMapNode = newMapTarget;
                if (selectedMapNodes.indexOf(newMapTarget) < 0) {
                    selectedMapNodes = [newMapTarget];
                }
            }
        } else {
            originalSelectedNodes = selectedMapNodes;
            selectionStartPoint = {'x': x, 'y': y};
        }
    }
    if (event.which != 1) return; // Handle only left click.
    if (!editingMap && newMapTarget) {
        if (currentMapTarget.isShrine) {
            // Show them the area menu if they click on the shrine from a different area.
            state.selectedCharacter.selectedLevelKey = currentMapTarget.level.levelKey;
            displayAreaMenu();
            currentMapTarget = null;
            $('.js-mainCanvas').toggleClass('clickable', false);
            return;
        } else if (currentMapTarget.levelKey) {
            state.selectedCharacter.selectedLevelKey = currentMapTarget.levelKey;
            displayAreaMenu();
            currentMapTarget = null;
            $('.js-mainCanvas').toggleClass('clickable', false);
            return;
        }
    }
    draggedMap = false;
    mapDragX = x;
    mapDragY = y;
});
$('.js-mouseContainer').on('dblclick', '.js-mainCanvas', function (event) {
    var x = event.pageX - $(this).offset().left;
    var y = event.pageY - $(this).offset().top;
    if (editingMap) {
        startEditingLevel(getMapTarget(x, y));
    }
});
/*$('.js-mouseContainer').on('click', '.js-mainCanvas', function (event) {
    console.log('click');
});*/
$(document).on('mouseup',function (event) {
    var x = event.pageX - $('.js-mainCanvas').offset().left;
    var y = event.pageY - $('.js-mainCanvas').offset().top;
    mapDragX = mouseDragY = null;
    arrowTargetLeft = arrowTargetTop = null;
    if (editingMap) {
        if (event.which === 3 && clickedMapNode && draggedMap) {
            var unlockedLevel = getMapTarget(x, y);
            if (unlockedLevel) {
                toggleLevelLink(clickedMapNode, unlockedLevel);
            }
        }
        selectionStartPoint = null;
        clickedMapNode = null;
    }
    if (draggedMap) {
        draggedMap = false;
        return;
    }
    if (!editingMap) return;
    var x = event.pageX - $('.js-mainCanvas').offset().left;
    var y = event.pageY - $('.js-mainCanvas').offset().top;
    var newMapTarget = getMapTarget(x, y);
    if (newMapTarget) {
        if (event.shiftKey) {
            var index = selectedMapNodes.indexOf(newMapTarget);
            if (index >= 0) {
                selectedMapNodes.splice(index, 1);
            } else {
                selectedMapNodes.push(newMapTarget);
            }
        } else {
            selectedMapNodes = [newMapTarget];
        }
    } else {
        if (!event.shiftKey) {
            selectedMapNodes = [];
        }
    }
});
var arrowTargetLeft, arrowTargetTop;
$('.js-mouseContainer').on('mousemove', function (event) {
    if (!mouseDown && !rightMouseDown) return;
    draggedMap = true;
    var x = event.pageX - $(this).offset().left;
    var y = event.pageY - $(this).offset().top;
    if (editingMap) {
        if (selectionStartPoint) {
            var endPoint = {'x': x, 'y': y};
            var selectedRectangle = (rectangleFromPoints(selectionStartPoint, endPoint));
            selectedMapNodes = originalSelectedNodes.slice();
            $.each(visibleNodes, function (levelKey, levelData) {
                if (selectedMapNodes.indexOf(levelData) < 0 && rectanglesOverlap(selectedRectangle, levelData)) {
                    selectedMapNodes.push(levelData);
                }
            });
            drawRunningAnts(mainContext, selectedRectangle);
        } else if (event.which === 3 && clickedMapNode) {
            arrowTargetLeft = x;
            arrowTargetTop = y;
        } else if (mapDragX !== null && mapDragY !== null) {
            if (clickedMapNode) {
                var dx = x - (clickedMapNode.left);
                var dy = y - (clickedMapNode.top);
                selectedMapNodes.forEach(function (mapNode) {
                    mapNode.left += dx;
                    mapNode.top += dy;
                    mapNode.coords = camera.unprojectPoint(mapNode.left + mapLeft, mapNode.top + mapTop, world.radius);
                })
                movedMap = true;
            } else {
                mapLocation.moveRight((mapDragX - x));
                mapLocation.moveUp(-(mapDragY - y));
                movedMap = true;
                mapDragX = x;
                mapDragY = y;
            }
        }
    } else if (mapDragX !== null && mapDragY !== null) {
        mapLocation.moveRight((mapDragX - x));
        mapLocation.moveUp(-(mapDragY - y));
        movedMap = true;
        mapDragX = x;
        mapDragY = y;
    }
});

var difficultyBonusMap = {'easy': 0.8, 'normal': 1, 'hard': 1.5, 'challenge': 2};
function displayAreaMenu() {
    selectedLevel = map[state.selectedCharacter.selectedLevelKey];
    centerMapOnLevel(selectedLevel);
    // Do this in timeout so that it happens after the check for hiding the areaMenu...
    setTimeout(function () {
        $('.js-areaMenu').show();
        $('.js-areaMenu .js-areaMedal').hide();
        var times = ifdefor(state.selectedCharacter.levelTimes[selectedLevel.levelKey], {});
        for (var difficulty of ['easy', 'normal', 'hard', 'challenge']) {
            if (!times[difficulty]) continue;
            var $medal = $('.js-areaMenu .js-' + difficulty + 'Difficulty .js-areaMedal');
            if (times[difficulty] < getGoldTimeLimit(selectedLevel, difficultyBonusMap[difficulty])) {
                $medal.removeClass('bronzeMedal silverMedal').addClass('goldMedal');
            } else if (times[difficulty] < getSilverTimeLimit(selectedLevel, difficultyBonusMap[difficulty])) {
                $medal.removeClass('bronzeMedal goldMedal').addClass('silverMedal');
            } else {
                $medal.removeClass('silverMedal goldMedal').addClass('bronzeMedal');
            }
            $medal.show();
        }
        $('.js-areaMenu .js-hardDifficulty').toggle(!!state.completedLevels[selectedLevel.levelKey]);
        $('.js-areaMenu .js-challengeDifficulty').hide();
        if (times['hard']) {
            $('.js-areaMenu .js-endlessDifficulty').text('Endless -' + getEndlessLevel(state.selectedCharacter, selectedLevel) + '-').show();
        } else {
            $('.js-areaMenu .js-endlessDifficulty').hide();
        }
        $('.js-areaMenu .js-areaTitle').text('Lv ' + selectedLevel.level + ' ' + selectedLevel.name);
        $('.js-areaMenu .js-areaDescription').html(ifdefor(selectedLevel.description, 'No description'));
    },0);
}

$('.js-easyDifficulty').on('click', function (event) {
    $('.js-areaMenu').hide();
    state.selectedCharacter.levelDifficulty = 'easy';
    startArea(state.selectedCharacter, state.selectedCharacter.selectedLevelKey);
    // Sometimes divinity points preview is stuck open at beginning of level, not sure how.
    hidePointsPreview();
});
$('.js-normalDifficulty').on('click', function (event) {
    $('.js-areaMenu').hide();
    state.selectedCharacter.levelDifficulty = 'normal';
    startArea(state.selectedCharacter, state.selectedCharacter.selectedLevelKey);
    // Sometimes divinity points preview is stuck open at beginning of level, not sure how.
    hidePointsPreview();
});
$('.js-hardDifficulty').on('click', function (event) {
    $('.js-areaMenu').hide();
    state.selectedCharacter.levelDifficulty = 'hard';
    startArea(state.selectedCharacter, state.selectedCharacter.selectedLevelKey);
    // Sometimes divinity points preview is stuck open at beginning of level, not sure how.
    hidePointsPreview();
});
$('.js-challengeDifficulty').on('click', function (event) {
    $('.js-areaMenu').hide();
    state.selectedCharacter.levelDifficulty = 'challenge';
    startArea(state.selectedCharacter, state.selectedCharacter.selectedLevelKey);
    // Sometimes divinity points preview is stuck open at beginning of level, not sure how.
    hidePointsPreview();
});
$('.js-endlessDifficulty').on('click', function (event) {
    $('.js-areaMenu').hide();
    state.selectedCharacter.levelDifficulty = 'endless';
    startArea(state.selectedCharacter, state.selectedCharacter.selectedLevelKey);
    // Sometimes divinity points preview is stuck open at beginning of level, not sure how.
    hidePointsPreview();
});

function getEndlessLevel(character, level) {
    var times = ifdefor(character.levelTimes[level.levelKey], {});
    return ifdefor(times['endless'], level.level + 5);
}

$(document).on('mousedown', function (event) {
    if (!$(event.target).closest('.js-areaMenu').length) {
        $('.js-areaMenu').hide();
    }
});
function getGoldTimeLimit(level, difficultyMultiplier) {
    var numberOfWaves = Math.max(level.events.length,  Math.floor(5 * Math.sqrt(level.level))) + 1; // Count the chest as a wave.
    return difficultyMultiplier * numberOfWaves * (5 + level.level / 2);
}
function getSilverTimeLimit(level, difficultyMultiplier) {
    var numberOfWaves = Math.max(level.events.length,  Math.floor(5 * Math.sqrt(level.level))) + 1; // Count the chest as a wave.
    return difficultyMultiplier * numberOfWaves * (10 + level.level);
}
function completeLevel(character) {
    // If the character beat the last adventure open to them, unlock the next one
    var level = map[character.currentLevelKey];
    increaseAgeOfApplications();
    var oldDivinityScore = ifdefor(character.divinityScores[character.currentLevelKey], 0);
    if (oldDivinityScore === 0) {
        character.fame += level.level;
        gain('fame', level.level);
        // Unlock the next areas.
        var levelData = map[character.currentLevelKey];
        state.completedLevels[character.currentLevelKey] = true;
        levelData.unlocks.forEach(function (levelKey) {
            unlockMapLevel(levelKey);
        });
    }
    var newDivinityScore;
    var currentEndlessLevel = getEndlessLevel(character, level);
    if (character.levelDifficulty === 'endless') {
        newDivinityScore = Math.max(10, Math.round(baseDivinity(currentEndlessLevel)));
    } else {
        var difficultyBonus = difficultyBonusMap[character.levelDifficulty];
        var timeBonus = .8;
        if (character.completionTime <= getGoldTimeLimit(level, difficultyBonus)) timeBonus = 1.2;
        else if (character.completionTime <= getSilverTimeLimit(level, difficultyBonus)) timeBonus = 1;
        newDivinityScore = Math.max(10, Math.round(difficultyBonus * timeBonus * baseDivinity(level.level)));
    }
    character.divinity += Math.max(0, newDivinityScore - oldDivinityScore);
    character.divinityScores[character.currentLevelKey] = Math.max(oldDivinityScore, newDivinityScore);
    // Initialize level times for this level if not yet set.
    character.levelTimes[character.currentLevelKey] = ifdefor(character.levelTimes[character.currentLevelKey], {});
    if (character.levelDifficulty === 'endless') {
        unlockItemLevel(currentEndlessLevel + 1);
        character.levelTimes[character.currentLevelKey][character.levelDifficulty] = currentEndlessLevel + 5;
    } else {
        unlockItemLevel(level.level + 1);
        var oldTime = ifdefor(character.levelTimes[character.currentLevelKey][character.levelDifficulty], 99999);
        character.levelTimes[character.currentLevelKey][character.levelDifficulty] = Math.min(character.completionTime, oldTime);
        character.levelCompleted = true;
    }
    saveGame();
}
$('body').on('click', '.js-confirmSkill', function (event) {
    var character = state.selectedCharacter;
    var level = map[character.currentLevelKey];
    var skill = character.board.boardPreview.fixed[0].ability;
    character.divinity -= totalCostForNextLevel(character, level);
    character.adventurer.abilities.push(skill);
    character.adventurer.unlockedAbilities[skill.key] = true;
    character.board.spaces = character.board.spaces.concat(character.board.boardPreview.spaces);
    character.board.fixed = character.board.fixed.concat(character.board.boardPreview.fixed);
    character.board.boardPreview.fixed.forEach(function (jewel) {
        jewel.confirmed = true;
        removeBonusSourceFromObject(character.adventurer, character.jewelBonuses, false);
        updateAdjacentJewels(jewel);
        updateJewelBonuses(character);
        addBonusSourceToObject(character.adventurer, character.jewelBonuses, true);
    });
    character.board.boardPreview = null;
    drawBoardBackground(character.boardContext, character.board);
    gainLevel(character.adventurer);
    updateConfirmSkillConfirmationButtons();
    saveGame();
    setTimeout(function () {
        showContext('adventure');
        finishShrine(character);
    }, 500);
});
$('body').on('click', '.js-cancelSkill', function (event) {
    showContext('adventure');
});
function unlockMapLevel(levelKey) {
    state.visibleLevels[levelKey] = true;
}

function deleteLevel(level) {
    $.each(map, function (levelKey, otherLevel) {
        var index = otherLevel.unlocks.indexOf(level.levelKey);
        if (index >= 0) {
            otherLevel.unlocks.splice(index, 1);
        }
    });
    delete map[level.levelKey];
}
function startMapEditing() {
    movedMap = true;
    editingMap = true;
    updateEditingState();
}
function stopMapEditing() {
    movedMap = true;
    editingMap = false;
    updateEditingState();
}
function updateEditingState() {
    var isEditing = editingLevel || editingMap;
    // This is true if not editing or testing a level.
    var inAdventureMode = !!testingLevel || !editingLevel;
    $('.js-pointsBar, .js-divinityPoints').toggle(inAdventureMode);
    //$('.js-mainCanvasContainer').css('height', '600px');
    $('.js-mainCanvas').attr('height', mapHeight);
    // Image smoothing seems to get enabled again after changing the canvas size, so disable it again.
    $('.js-mainCanvas')[0].getContext('2d').imageSmoothingEnabled = false;
    // Use !! to cast testingLevel to boolean, otherwise jquery will do something strange with the value.
    $('.js-controlBar').toggle(inAdventureMode);
    $('.js-charactersBox').toggle(!isEditing);
    $('.js-recruitmentColumn').toggle(!isEditing);
    $('.js-mainCanvasContainer').css('top', inAdventureMode ? 'auto' : '-330px');
}

$(document).on('keydown', function(event) {
    if (event.which === 8) { // delete key
        if (editingMap) {
            event.preventDefault();
            selectedMapNodes.forEach(function (level) {
                deleteLevel(level);
            });
            selectedMapNodes = [];
        }
    }
    if (event.which === 27) { // escape key
        event.preventDefault();
        if (editingMap) {
            stopMapEditing();
        } else if (!testingLevel) {
            if (currentContext !== 'adventure') {
                showContext('adventure');
            } else if (state.selectedCharacter.area) {
                recallSelectedCharacter();
            } else {
                $('.js-areaMenu').hide();
            }
        }
    }
    if (editingMap && event.which === 67) { // 'c'
        event.preventDefault();
        exportMapToClipboard();
    }
    if (!editingMap && !editingLevel && event.which === 67) { // 'c'
        pasteCharacterToClipBoard(state.selectedCharacter);
    }
    if (window.location.search.substr(1) === 'edit' && event.which === 69) { // 'e'
        if (currentContext !== 'adventure' || state.selectedCharacter.area) {
            return;
        }
        if (currentMapTarget) {
            startEditingLevel(currentMapTarget);
            return;
        }
        if (!editingLevel) {
            if (!editingMap) startMapEditing();
            else stopMapEditing();
        }
    }
    if (window.location.search.substr(1) === 'edit' && event.which === 76) { // 'l'
        if (currentMapTarget && currentMapTarget.levelKey) {
            state.selectedCharacter.currentLevelKey = currentMapTarget.levelKey;
            if (!state.selectedCharacter.completionTime) {
                state.selectedCharacter.completionTime = 100;
            } else {
                state.selectedCharacter.completionTime -= 10;
            }
            completeLevel(state.selectedCharacter);
        }
    }
});

// Return the minimum angle between two angles, specified in degrees.
function getThetaDistance(angle1, angle2) {
    var diff = Math.abs(angle1 - angle2) % 360;
    return Math.min(diff, 360 - diff);
}