var editingMap = false;
var emptyLevelData = ({'name': '-', 'level': 1, 'background': 'field', 'specialLoot': [], 'skill': null, 'board': null, 'enemySkills': [], 'monsters': ['skeleton'], 'events': [['dragon']]});
var map = {
    'grove': {"x":10,"y":-1,"unlocks":["savannah","orchard","cave"],"name":"Grove","level":1,"specialLoot":["simpleEmeraldLoot"],"skill":"minorDexterity","board":"doubleDiamonds","enemySkills":["minorDexterity"],"monsters":["caterpillar","gnome"],"events":[["caterpillar","gnome"],["gnome","gnome"],["caterpillar","caterpillar"],["butterfly"]],"background":"forest"},
    'savannah': {"x":8,"y":-2,"unlocks":["range"],"name":"Savannah","level":1,"specialLoot":["simpleRubyLoot"],"skill":"pet","board":"smallFangBoard","monsters":["butterfly"],"events":[["caterpillar","caterpillar","caterpillar"],["caterpillar","caterpillar","motherfly"]],"background":"field"},
    'orchard': {"x":12,"y":-2,"unlocks":["crevice"],"name":"Orchard","level":2,"specialLoot":["simpleEmeraldLoot"],"skill":"sap","board":"spikeBoard","enemySkills":["sap","rangeAndAttackSpeed"],"monsters":["butterfly","gnome"],"events":[["butterfly","butterfly"],["gnome","gnome"],["dragon"]],"background":"orchard"},
    'range': {"x":8,"y":-4,"unlocks":["valley"],"name":"Range","level":3,"specialLoot":["simpleEmeraldLoot"],"skill":"finesse","board":"spikeBoard","enemySkills":["finesse"],"monsters":["butterfly","gnome"],"events":[["butterfly","butterfly"],["gnome","gnome"],["dragon"]],"background":"forest"},
    'crevice': {"x":13,"y":-4,"unlocks":["valley"],"name":"Crevice","level":4,"specialLoot":["simpleSaphireLoot"],"skill":"dodge","board":"fangBoard","enemySkills":["dodge"],"monsters":["gnome","butterfly"],"events":[["dragon"]],"background":"cave"},
    'valley': {"x":11,"y":-5,"unlocks":[],"name":"Valley","level":5,"specialLoot":["simpleEmeraldLoot"],"skill":"majorDexterity","board":"crownBoard","enemySkills":["heal","protect","majorDexterity"],"monsters":["motherfly","gnomecromancer"],"events":[["motherfly","motherfly"],["gnomecromancer","gnomecromancer"],["gnomecromancer","gnomeWizard","gnomecromancer"]],"background":"forest"},
    'meadow': {"x":11,"y":2,"unlocks":["garden","road","grove"],"name":"Meadow","level":1,"specialLoot":["simpleRubyLoot"],"skill":"minorStrength","board":"smallFangBoard","enemySkills":["minorStrength"],"monsters":["caterpillar","skeleton"],"events":[["skeleton","caterpillar"],["caterpillar","caterpillar"],["skeleton","skeleton"],["dragon"]],"background":"field"},
    'garden': {"x":14,"y":3,"unlocks":["trail"],"name":"Garden","level":1,"specialLoot":["simpleEmeraldLoot"],"skill":"fistMastery","board":"doubleDiamonds","enemySkills":["ninja"],"monsters":["caterpillar","gnome","butterfly","skeleton"],"events":[["butterfly"],["giantSkeleton"],["dragon"]],"background":"garden"},
    'road': {"x":12,"y":4,"unlocks":["tunnel"],"name":"Road","level":2,"specialLoot":["simpleRubyLoot"],"skill":"vitality","board":"halfHexBoard","enemySkills":["vitality"],"monsters":["skeleton"],"events":[["skeleton","undeadWarrior"],["dragon"],["skeleton","undeadWarrior","skeleton","undeadWarrior"],["frostGiant"]],"background":"field"},
    'trail': {"x":16,"y":4,"unlocks":["mountain"],"name":"Trail","level":3,"specialLoot":["simpleRubyLoot"],"skill":"ferocity","board":"halfHexBoard","enemySkills":["ferocity"],"monsters":["caterpillar","butterfly"],"events":[["caterpillar","caterpillar"],["motherfly"],["caterpillar","caterpillar","caterpillar","caterpillar"],["lightningBug","motherfly"]],"background":"field"},
    'tunnel': {"x":14,"y":6,"unlocks":["mountain"],"name":"Tunnel","level":4,"specialLoot":["simpleSaphireLoot"],"skill":"hook","board":"thirdHexBoard","enemySkills":[],"monsters":["undeadWarrior","giantSkeleton"],"events":[["skeleton","undeadWarrior"],["giantSkeleton","giantSkeleton"],["undeadWarrior","undeadWarrior","dragon"],["frostGiant","frostGiant"]],"background":"cave"},
    'mountain': {"x":17,"y":6,"unlocks":[],"name":"Mountain","level":5,"specialLoot":["simpleRubyLoot"],"skill":"majorStrength","board":"pieBoard","enemySkills":["majorStrength"],"monsters":["dragon","giantSkeleton"],"events":[["undeadWarrior","undeadWarrior"],["butcher"],["undeadWarrior","undeadWarrior","dragon"],["butcher","dragon","gnomeWizard"]],"background":"field"},
    'cave': {"x":8,"y":1,"unlocks":["cemetery","temple","meadow"],"name":"Cave","level":1,"specialLoot":["simpleSaphireLoot"],"skill":"minorIntelligence","board":null,"enemySkills":["minorIntelligence"],"monsters":["gnome","bat"],"events":[["bat","gnome"],["bat","bat"],["gnome","gnome"],["giantSkeleton"]],"background":"cave"},
    'cemetery': {"x":4,"y":1,"unlocks":["crypt"],"name":"Cemetery","level":1,"specialLoot":["simpleRubyLoot"],"skill":"raiseDead","board":"smallFangBoard","monsters":["bat"],"events":[["gnomecromancer","gnomecromancer"],["skeleton","skeleton"],["skeleton","skeleton"],["gnomecromancer"],["skeleton","skeleton","skeleton","skeleton"],["gnomecromancer","gnomecromancer"]],"background":"cemetery"},
    'temple': {"x":6,"y":3,"unlocks":["bayou"],"name":"Temple","level":2,"specialLoot":["simpleSaphireLoot"],"skill":"heal","board":"triforceBoard","enemySkills":["heal"],"monsters":["gnome","butterfly"],"events":[["dragon"]],"background":"cave"},
    'crypt': {"x":0,"y":1,"unlocks":["dungeon"],"name":"Crypt","level":3,"specialLoot":["simpleSaphireLoot"],"skill":"resonance","board":"triforceBoard","enemySkills":["resonance"],"monsters":["gnome","butterfly"],"events":[["dragon"],["gnomeWizard"]],"background":"cemetery"},
    'bayou': {"x":2,"y":4,"unlocks":["dungeon"],"name":"Bayou","level":4,"specialLoot":["simpleEmeraldLoot"],"skill":"protect","board":"petalBoard","enemySkills":["protect","majorIntelligence"],"monsters":["butterfly","bat"],"events":[["butterfly","butterfly"],["bat","bat","bat","bat"],["lightningBug","lightningBug"]],"background":"forest"},
    'dungeon': {"x":-2,"y":3,"unlocks":[],"name":"Dungeon","level":5,"specialLoot":["simpleSaphireLoot"],"skill":"majorIntelligence","board":"helmBoard","enemySkills":["majorIntelligence"],"monsters":["gnome","gnomecromancer"],"events":[["frostGiant","lightningBug","dragon"]],"background":"cave"},
    'forestfloor': {"x":6,"y":-1,"unlocks":["shrubbery","mossbed","cave","grove"],"name":"Forest Floor","level":2,"specialLoot":["simpleJewelLoot"],"skill":"majorDexterity","board":"crownBoard","enemySkills":["heal","protect","majorDexterity"],"monsters":["motherfly","gnomecromancer"],"events":[["motherfly","motherfly"],["gnomecromancer","gnomecromancer"],["gnomecromancer","gnomeWizard","gnomecromancer"]],"background":"forest"},
    'shrubbery': {"x":4,"y":-4,"unlocks":["ruins"],"name":"Shrubbery","level":4,"specialLoot":["simpleJewelLoot"],"skill":"majorDexterity","board":"crownBoard","enemySkills":["heal","protect","majorDexterity"],"monsters":["motherfly","gnomecromancer"],"events":[["motherfly","motherfly"],["gnomecromancer","gnomecromancer"],["gnomecromancer","gnomeWizard","gnomecromancer"]],"background":"field"},
    'mossbed': {"x":3,"y":0,"unlocks":["riverbank"],"name":"Mossbed","level":6,"specialLoot":["simpleJewelLoot"],"skill":"majorDexterity","board":"crownBoard","enemySkills":["heal","protect","majorDexterity"],"monsters":["motherfly","gnomecromancer"],"events":[["motherfly","motherfly"],["gnomecromancer","gnomecromancer"],["gnomecromancer","gnomeWizard","gnomecromancer"]],"background":"field"},
    'riverbank': {"x":-1,"y":0,"unlocks":["ruins"],"name":"Riverbank","level":8,"specialLoot":["simpleJewelLoot"],"skill":"majorDexterity","board":"crownBoard","enemySkills":["heal","protect","majorDexterity"],"monsters":["motherfly","gnomecromancer"],"events":[["motherfly","motherfly"],["gnomecromancer","gnomecromancer"],["gnomecromancer","gnomeWizard","gnomecromancer"]],"background":"field"},
    'ruins': {"x":-1,"y":-3,"unlocks":["canopy","cliff","understory"],"name":"Ruins","level":12,"specialLoot":["simpleJewelLoot"],"skill":"majorDexterity","board":"crownBoard","enemySkills":["heal","protect","majorDexterity"],"monsters":["motherfly","gnomecromancer"],"events":[["motherfly","motherfly"],["gnomecromancer","gnomecromancer"],["gnomecromancer","gnomeWizard","gnomecromancer"]],"background":"cemetery"},
    'understory': {"x":-3,"y":-1,"unlocks":["canopy"],"name":"Understory","level":16,"specialLoot":["simpleJewelLoot"],"skill":"majorDexterity","board":"crownBoard","enemySkills":["heal","protect","majorDexterity"],"monsters":["motherfly","gnomecromancer"],"events":[["motherfly","motherfly"],["gnomecromancer","gnomecromancer"],["gnomecromancer","gnomeWizard","gnomecromancer"]],"background":"field"},
    'canopy': {"x":-5,"y":-2,"unlocks":["emergents"],"name":"Canopy","level":21,"specialLoot":["simpleJewelLoot"],"skill":"majorDexterity","board":"crownBoard","enemySkills":["heal","protect","majorDexterity"],"monsters":["motherfly","gnomecromancer"],"events":[["motherfly","motherfly"],["gnomecromancer","gnomecromancer"],["gnomecromancer","gnomeWizard","gnomecromancer"]],"background":"forest"},
    'cliff': {"x":-3,"y":-5,"unlocks":["emergents"],"name":"Cliff","level":25,"specialLoot":["simpleJewelLoot"],"skill":"majorDexterity","board":"crownBoard","enemySkills":["heal","protect","majorDexterity"],"monsters":["motherfly","gnomecromancer"],"events":[["motherfly","motherfly"],["gnomecromancer","gnomecromancer"],["gnomecromancer","gnomeWizard","gnomecromancer"]],"background":"field"},
    'emergents': {"x":-7,"y":-4,"unlocks":["ravine"],"name":"Emergents","level":29,"specialLoot":["simpleJewelLoot"],"skill":"majorDexterity","board":"crownBoard","enemySkills":["heal","protect","majorDexterity"],"monsters":["motherfly","gnomecromancer"],"events":[["motherfly","motherfly"],["gnomecromancer","gnomecromancer"],["gnomecromancer","gnomeWizard","gnomecromancer"]],"background":"field"},
    'ravine': {"x":-9,"y":-3,"unlocks":[],"name":"Ravine","level":33,"specialLoot":["simpleJewelLoot"],"skill":"majorDexterity","board":"crownBoard","enemySkills":["heal","protect","majorDexterity"],"monsters":["motherfly","gnomecromancer"],"events":[["motherfly","motherfly"],["gnomecromancer","gnomecromancer"],["gnomecromancer","gnomeWizard","gnomecromancer"]],"background":"garden"},
    'shore': {"x":13,"y":0,"unlocks":["oceanside","meadow","grove"],"name":"Shore","level":1,"specialLoot":[],"skill":null,"board":null,"enemySkills":[],"monsters":["skeleton"],"events":[["dragon"]],"background":"field"},
    'oceanside': {"x":15,"y":-2,"unlocks":["wetlands","floodplain"],"name":"Oceanside","level":1,"specialLoot":[],"skill":null,"board":null,"enemySkills":[],"monsters":["skeleton"],"events":[["dragon"]],"background":"field"},
    'wetlands': {"x":17,"y":-3,"unlocks":["meander"],"name":"Wetlands","level":1,"specialLoot":[],"skill":null,"board":null,"enemySkills":[],"monsters":["skeleton"],"events":[["dragon"]],"background":"field"},
    'floodplain': {"x":16,"y":0,"unlocks":["meander"],"name":"Floodplain","level":1,"specialLoot":[],"skill":null,"board":null,"enemySkills":[],"monsters":["skeleton"],"events":[["dragon"]],"background":"field"},
    'levee': {"x":22,"y":-3,"unlocks":["channel"],"name":"Levee","level":1,"specialLoot":[],"skill":null,"board":null,"enemySkills":[],"monsters":["skeleton"],"events":[["dragon"]],"background":"field"},
    'meander': {"x":20,"y":-1,"unlocks":["levee"],"name":"Meander","level":1,"specialLoot":[],"skill":null,"board":null,"enemySkills":[],"monsters":["skeleton"],"events":[["dragon"]],"background":"field"},
    'channel': {"x":21,"y":1,"unlocks":["confluence"],"name":"Channel","level":1,"specialLoot":[],"skill":null,"board":null,"enemySkills":[],"monsters":["skeleton"],"events":[["dragon"]],"background":"field"},
    'confluence': {"x":23,"y":1,"unlocks":["tributaries"],"name":"Confluence","level":1,"specialLoot":[],"skill":null,"board":null,"enemySkills":[],"monsters":["skeleton"],"events":[["dragon"]],"background":"field"},
    'tributaries': {"x":24,"y":-2,"unlocks":["headwaters"],"name":"Tributaries","level":1,"specialLoot":[],"skill":null,"board":null,"enemySkills":[],"monsters":["skeleton"],"events":[["dragon"]],"background":"field"},
    'headwaters': {"x":26,"y":-1,"unlocks":[],"name":"Headwaters","level":1,"specialLoot":[],"skill":null,"board":null,"enemySkills":[],"monsters":["skeleton"],"events":[["dragon"]],"background":"field"}
};
$.each(map, function (levelKey, levelData) {
    levelData.levelKey = levelKey;
});

var levelExportProperties = ['x', 'y', 'unlocks', 'name', 'level', 'specialLoot', 'skill', 'board', 'enemySkills', 'monsters', 'events']
function exportMap() {
    var lines = [];
    $.each(map, function (levelKey, levelData) {
        var exportData = {};
        for (var key of levelExportProperties) {
            exportData[key] = levelData[key];
        }
        lines.push("    '" + levelKey+"': " + JSON.stringify(exportData));
    });
    return lines.join(",\n");
}

var mapCenteringTarget = null;
function updateMap() {
    if (draggedMap) {
        return;
    }
    var minX = minY = 1000000, maxX = maxY = -10000000;
    if (mapCenteringTarget) {
        minX = mapCenteringTarget.x * 40;
        maxX = minX + 40;
        minY = mapCenteringTarget.y * 40;
        maxY = minY + 40;
        // remove the mapTarget once we get close enough.
        if (mapCenteringTarget.left > mapWidth / 2 - 100
            && mapCenteringTarget.right < mapWidth / 2 + 100
            && mapCenteringTarget.top > mapHeight / 2 - 100
            && mapCenteringTarget.bottom < mapHeight / 2 + 100) {
            mapCenteringTarget = null;
        }
    } else {
        $.each(map, function (levelKey, levelData){
            if (!editingMap && !state.visibleLevels[levelKey]) {
                return;
            }
            minX = Math.min(levelData.x * 40, minX);
            minY = Math.min(levelData.y * 40, minY);
            maxX = Math.max(levelData.x * 40 + 40, maxX);
            maxY = Math.max(levelData.y * 40 + 40, maxY);
        });
    }
    if (mapLeft < minX - mapWidth / 2) {
        mapLeft = (mapLeft * 5 + minX - mapWidth / 2) / 6;
    }
    if (mapLeft > maxX - mapWidth / 2) {
        mapLeft = (mapLeft * 5 + maxX - mapWidth / 2) / 6;
    }
    if (mapTop < minY - mapHeight / 2) {
        mapTop = (mapTop * 5 + minY - mapHeight / 2) / 6;
    }
    if (mapTop > maxY - mapHeight / 2) {
        mapTop = (mapTop * 5 + maxY - mapHeight / 2) / 6;
    }
}
function centerMapOnLevel(levelData, instant) {
    if (ifdefor(instant)) {
        mapLeft = levelData.x * 40 + 20 - mapWidth / 2;
        mapTop = levelData.y * 40 + 20 - mapHeight / 2;
    } else {
        mapCenteringTarget = levelData;
    }
}

var mapLeft = -400, mapTop = -120, mapWidth = 800, mapHeight = 240;
var visibleNodes = {};
var selectedMapNodes = [];
var clickedMapNode = null;
var currentMapTarget = null;
function getMapPopupTarget(x, y) {
    if (draggedMap) {
        currentMapTarget = null;
        return null;
    }
    currentMapTarget = getMapPopupTargetProper(x, y);
    return currentMapTarget;
}
function getMapPopupTargetProper(x, y) {
    var newMapTarget = getMapTarget(x, y);
    if (!newMapTarget) {
        return null;
    }
    if (editingMap) {
        newMapTarget.helptext = '<p>Level ' + newMapTarget.level + ' ' + newMapTarget.name +'</p><br/>';
        return newMapTarget;
    }
    if (!ifdefor(newMapTarget.isShrine)) {
        newMapTarget.helptext = '<p>Level ' + newMapTarget.level + ' ' + newMapTarget.name +'</p><br/>';
        var skill = abilities[newMapTarget.skill];
        if (skill) {
            if (state.selectedCharacter.adventurer.abilities.indexOf(skill) < 0) {
                newMapTarget.helptext += '<p style="font-weight: bold">Visit shrine to learn: ' + skill.name + '</p>';
            } else {
                newMapTarget.helptext += '<p style="font-size: 12">' + state.selectedCharacter.adventurer.name + ' has already learned:</p>' + skill.name + '</p>';
            }
        }
        return newMapTarget;
    }
    if (!ifdefor(newMapTarget.isShrine)) {
        return null;
    }
    var shrine = newMapTarget;
    var divinityScore = ifdefor(state.selectedCharacter.divinityScores[shrine.level.levelKey], 0);
    if (!(divinityScore > 0)) {
        return null;
    }
    shrine.helptext = ''
    if (state.selectedCharacter.currentLevelKey !== shrine.level.levelKey || !state.selectedCharacter.levelCompleted) {
        shrine.helptext += '<p style="font-size: 12">An adventurer can only visit the shrine for the last adventure they completed.</p><br/>';
    }
    var totalCost = totalCostForNextLevel(state.selectedCharacter, shrine.level);
    var skill = abilities[shrine.level.skill];
    if (skill) {
        if (state.selectedCharacter.adventurer.abilities.indexOf(skill) < 0  && state.selectedCharacter.divinity < totalCost) {
            shrine.helptext += '<p style="font-size: 12">' + state.selectedCharacter.adventurer.name + ' does not have enough divinity to learn the skill from this shrine.</p><br/>';
        }
        if (state.selectedCharacter.adventurer.abilities.indexOf(skill) < 0) {
            shrine.helptext += '<p style="font-weight: bold">Spend ' + totalCost + ' divinity at this shrine to learn:</p>' + abilityHelpText(skill, state.selectedCharacter);
        } else {
            shrine.helptext += '<p style="font-size: 12px">' + state.selectedCharacter.adventurer.name + ' has already learned:</p>' + abilityHelpText(skill, state.selectedCharacter);
        }
    }
    return shrine;
}

function getMapTarget(x, y) {
    var target = null;
    $.each(visibleNodes, function (levelKey, levelData){
        if (isPointInRect(x, y, levelData.left, levelData.top, levelData.width, levelData.height)) {
            target = levelData;
            return false;
        }
        if (!editingMap && isPointInRect(x, y, levelData.shrine.left, levelData.shrine.top, levelData.shrine.width, levelData.shrine.height)) {
            target = levelData.shrine;
            return false;
        }
        return true;
    });
    return target;
}

var mapDragX = mapDragY = null, draggedMap = false;
var selectionStartPoint = null;
var originalSelectedNodes = [];
$('.js-mouseContainer').on('mousedown', '.js-mainCanvas', function (event) {
    var x = event.pageX - $(this).offset().left;
    var y = event.pageY - $(this).offset().top;
    draggedMap = false;
    if (editingMap) {
        var newMapTarget = getMapTarget(x, y);
        if (!event.shiftKey) {
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
    mapDragX = x;
    mapDragY = y;
});
$(document).on('mouseup',function (event) {
    mapDragX = mouseDragY = null;
    draggedMap = false;
    if (editingMap) {
        selectionStartPoint = null;
        clickedMapNode = null;
    }
});
$('.js-mouseContainer').on('click', '.js-mainCanvas', function (event) {
    if (!editingMap) return;
    if (draggedMap) return;
    var x = event.pageX - $(this).offset().left;
    var y = event.pageY - $(this).offset().top;
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
$('.js-mouseContainer').on('mousemove', '.js-mainCanvas', function (event) {
    if (!mouseDown) return;
    draggedMap = true;
    var x = event.pageX - $(this).offset().left;
    var y = event.pageY - $(this).offset().top;
    if (editingMap && selectionStartPoint) {
        var endPoint = {'x': x, 'y': y};
        var selectedRectangle = (rectangleFromPoints(selectionStartPoint, endPoint));
        selectedMapNodes = originalSelectedNodes.slice();
        $.each(visibleNodes, function (levelKey, levelData) {
            if (selectedMapNodes.indexOf(levelData) < 0 && rectanglesOverlap(selectedRectangle, levelData)) {
                selectedMapNodes.push(levelData);
            }
        });
        drawRunningAnts(mainContext, selectedRectangle);
    } else if (mapDragX !== null && mapDragY !== null) {
        if (editingMap && clickedMapNode) {
            var nx = Math.floor((x + mapLeft) / clickedMapNode.width);
            var ny = Math.floor((y + mapTop) / clickedMapNode.height);
            var dx = nx - clickedMapNode.x;
            var dy = ny - clickedMapNode.y;
            selectedMapNodes.forEach(function (mapNode) {
                mapNode.x += dx;
                mapNode.y += dy;
                $.extend(mapNode, rectangle(mapNode.x * 40 - mapLeft, mapNode.y * 40 - mapTop, 40, 40));
            })
        } else {
            mapLeft += (mapDragX - x);
            mapTop += (mapDragY - y);
            mapDragX = x;
            mapDragY = y;
        }
    }
});

function clickMapHandler(x, y) {
    if (editingMap) return;
    if (draggedMap) return;
    if (!currentMapTarget) return;
    if (currentMapTarget.isShrine && state.selectedCharacter.currentLevelKey === currentMapTarget.level.levelKey && state.selectedCharacter.board.boardPreview) {
        showContext('jewel');
    } else if (!currentMapTarget.isShrine && currentMapTarget.levelKey) {
        startArea(state.selectedCharacter, currentMapTarget.levelKey);
    }
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
    state.visibleLevels[levelKey] = true;
}