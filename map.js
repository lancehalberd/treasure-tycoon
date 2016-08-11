var editingMap = false;
var emptyLevelData = ({'name': '-', 'level': 1, 'background': 'field', 'specialLoot': [], 'skill': null, 'board': null, 'enemySkills': [], 'monsters': ['skeleton'], 'events': [['dragon']]});
var map = {
    'grove': {"x":10,"y":-1,"unlocks":["savannah","orchard","cave"],"name":"Grove","level":1,"specialLoot":["simpleEmeraldLoot"],"skill":"minorDexterity","board":"doubleDiamonds","enemySkills":["minorDexterity"],"monsters":["caterpillar","gnome"],"events":[["caterpillar","gnome"],["gnome","gnome"],["caterpillar","caterpillar"],["butterfly"]],"background":"field"},
    'savannah': {"x":8,"y":-2,"unlocks":["range"],"name":"Savannah","level":1,"specialLoot":["simpleRubyLoot"],"skill":"pet","board":"smallFangBoard","monsters":["butterfly"],"events":[["caterpillar","caterpillar","caterpillar"],["caterpillar","caterpillar","motherfly"]],"background":"field"},
    'orchard': {"x":12,"y":-2,"unlocks":["crevice"],"name":"Orchard","level":2,"specialLoot":["simpleEmeraldLoot"],"skill":"sap","board":"spikeBoard","enemySkills":["sap",null],"monsters":["butterfly","gnome"],"events":[["butterfly","butterfly"],["gnome","gnome"],["dragon"]],"background":"field"},
    'range': {"x":8,"y":-4,"unlocks":["valley"],"name":"Range","level":3,"specialLoot":["simpleEmeraldLoot"],"skill":"finesse","board":"spikeBoard","enemySkills":["finesse"],"monsters":["butterfly","gnome"],"events":[["butterfly","butterfly"],["gnome","gnome"],["dragon"]],"background":"field"},
    'crevice': {"x":13,"y":-4,"unlocks":["valley"],"name":"Crevice","level":4,"specialLoot":["simpleSaphireLoot"],"skill":"dodge","board":"fangBoard","enemySkills":["dodge"],"monsters":["gnome","butterfly"],"events":[["dragon"]],"background":"field"},
    'valley': {"x":11,"y":-5,"unlocks":[],"name":"Valley","level":5,"specialLoot":["simpleEmeraldLoot"],"skill":"majorDexterity","board":"crownBoard","enemySkills":["heal","protect","majorDexterity"],"monsters":["motherfly","gnomecromancer"],"events":[["motherfly","motherfly"],["gnomecromancer","gnomecromancer"],["gnomecromancer","gnomeWizard","gnomecromancer"]],"background":"field"},
    'meadow': {"x":11,"y":2,"unlocks":["garden","road","grove"],"name":"Meadow","level":1,"specialLoot":["simpleRubyLoot"],"skill":"minorStrength","board":"smallFangBoard","enemySkills":["minorStrength"],"monsters":["caterpillar","skeleton"],"events":[["skeleton","caterpillar"],["caterpillar","caterpillar"],["skeleton","skeleton"],["dragon"]],"background":"field"},
    'garden': {"x":14,"y":3,"unlocks":["trail"],"name":"Garden","level":1,"specialLoot":["simpleEmeraldLoot"],"skill":"fistMastery","board":"doubleDiamonds","enemySkills":["ninja"],"monsters":["caterpillar","gnome","butterfly","skeleton"],"events":[["butterfly"],["giantSkeleton"],["dragon"]],"background":"field"},
    'road': {"x":12,"y":4,"unlocks":["tunnel"],"name":"Road","level":2,"specialLoot":["simpleRubyLoot"],"skill":"vitality","board":"halfHexBoard","enemySkills":["vitality"],"monsters":["skeleton"],"events":[["skeleton","undeadWarrior"],["dragon"],["skeleton","undeadWarrior","skeleton","undeadWarrior"],["frostGiant"]],"background":"field"},
    'trail': {"x":16,"y":4,"unlocks":["mountain"],"name":"Trail","level":3,"specialLoot":["simpleRubyLoot"],"skill":"ferocity","board":"halfHexBoard","enemySkills":["ferocity"],"monsters":["caterpillar","butterfly"],"events":[["caterpillar","caterpillar"],["motherfly"],["caterpillar","caterpillar","caterpillar","caterpillar"],["lightningBug","motherfly"]],"background":"field"},
    'tunnel': {"x":14,"y":6,"unlocks":["mountain"],"name":"Tunnel","level":4,"specialLoot":["simpleSaphireLoot"],"skill":"hook","board":"thirdHexBoard","enemySkills":[],"monsters":["undeadWarrior","giantSkeleton"],"events":[["skeleton","undeadWarrior"],["giantSkeleton","giantSkeleton"],["undeadWarrior","undeadWarrior","dragon"],["frostGiant","frostGiant"]],"background":"field"},
    'mountain': {"x":17,"y":6,"unlocks":[],"name":"Mountain","level":5,"specialLoot":["simpleRubyLoot"],"skill":"majorStrength","board":"pieBoard","enemySkills":["majorStrength"],"monsters":["dragon","giantSkeleton"],"events":[["undeadWarrior","undeadWarrior"],["butcher"],["undeadWarrior","undeadWarrior","dragon"],["butcher","dragon","gnomeWizard"]],"background":"field"},
    'cave': {"x":8,"y":1,"unlocks":["cemetery","temple","meadow"],"name":"Cave","level":1,"specialLoot":["simpleSaphireLoot"],"skill":"minorIntelligence","board":null,"enemySkills":["minorIntelligence"],"monsters":["gnome","bat"],"events":[["bat","gnome"],["bat","bat"],["gnome","gnome"],["giantSkeleton"]],"background":"field"},
    'cemetery': {"x":4,"y":1,"unlocks":["crypt"],"name":"Cemetery","level":1,"specialLoot":["simpleRubyLoot"],"skill":"raiseDead","board":"smallFangBoard","monsters":["bat"],"events":[["gnomecromancer","gnomecromancer"],["skeleton","skeleton"],["skeleton","skeleton"],["gnomecromancer"],["skeleton","skeleton","skeleton","skeleton"],["gnomecromancer","gnomecromancer"]],"background":"field"},
    'temple': {"x":6,"y":3,"unlocks":["bayou"],"name":"Temple","level":2,"specialLoot":["simpleSaphireLoot"],"skill":"heal","board":"triforceBoard","enemySkills":["heal"],"monsters":["gnome","butterfly"],"events":[["dragon"]],"background":"field"},
    'crypt': {"x":0,"y":1,"unlocks":["dungeon"],"name":"Crypt","level":3,"specialLoot":["simpleSaphireLoot"],"skill":"resonance","board":"triforceBoard","enemySkills":["resonance"],"monsters":["gnome","butterfly"],"events":[["dragon"],["gnomeWizard"]],"background":"field"},
    'bayou': {"x":2,"y":4,"unlocks":["dungeon"],"name":"Bayou","level":4,"specialLoot":["simpleEmeraldLoot"],"skill":"protect","board":"petalBoard","enemySkills":["protect","majorIntelligence"],"monsters":["butterfly","bat"],"events":[["butterfly","butterfly"],["bat","bat","bat","bat"],["lightningBug","lightningBug"]],"background":"field"},
    'dungeon': {"x":-2,"y":3,"unlocks":[],"name":"Dungeon","level":5,"specialLoot":["simpleSaphireLoot"],"skill":"majorIntelligence","board":"helmBoard","enemySkills":["majorIntelligence"],"monsters":["gnome","gnomecromancer"],"events":[["frostGiant","lightningBug","dragon"]],"background":"field"},
    'forestfloor': {"x":6,"y":-1,"unlocks":["shrubbery","mossbed","cave","grove"],"name":"Forest Floor","level":2,"specialLoot":["simpleJewelLoot"],"skill":"majorDexterity","board":"crownBoard","enemySkills":["heal","protect","majorDexterity"],"monsters":["motherfly","gnomecromancer"],"events":[["motherfly","motherfly"],["gnomecromancer","gnomecromancer"],["gnomecromancer","gnomeWizard","gnomecromancer"]],"background":"field"},
    'shrubbery': {"x":4,"y":-4,"unlocks":["ruins"],"name":"Shrubbery","level":4,"specialLoot":["simpleJewelLoot"],"skill":"majorDexterity","board":"crownBoard","enemySkills":["heal","protect","majorDexterity"],"monsters":["motherfly","gnomecromancer"],"events":[["motherfly","motherfly"],["gnomecromancer","gnomecromancer"],["gnomecromancer","gnomeWizard","gnomecromancer"]],"background":"field"},
    'mossbed': {"x":3,"y":0,"unlocks":["riverbank"],"name":"Mossbed","level":6,"specialLoot":["simpleJewelLoot"],"skill":"majorDexterity","board":"crownBoard","enemySkills":["heal","protect","majorDexterity"],"monsters":["motherfly","gnomecromancer"],"events":[["motherfly","motherfly"],["gnomecromancer","gnomecromancer"],["gnomecromancer","gnomeWizard","gnomecromancer"]],"background":"field"},
    'riverbank': {"x":-1,"y":0,"unlocks":["ruins"],"name":"Riverbank","level":8,"specialLoot":["simpleJewelLoot"],"skill":"majorDexterity","board":"crownBoard","enemySkills":["heal","protect","majorDexterity"],"monsters":["motherfly","gnomecromancer"],"events":[["motherfly","motherfly"],["gnomecromancer","gnomecromancer"],["gnomecromancer","gnomeWizard","gnomecromancer"]],"background":"field"},
    'ruins': {"x":-1,"y":-3,"unlocks":["canopy","cliff","understorey"],"name":"Ruins","level":12,"specialLoot":["simpleJewelLoot"],"skill":"majorDexterity","board":"crownBoard","enemySkills":["heal","protect","majorDexterity"],"monsters":["motherfly","gnomecromancer"],"events":[["motherfly","motherfly"],["gnomecromancer","gnomecromancer"],["gnomecromancer","gnomeWizard","gnomecromancer"]],"background":"field"},
    'understorey': {"x":-3,"y":-1,"unlocks":["canopy"],"name":"Understorey","level":16,"specialLoot":["simpleJewelLoot"],"skill":"majorDexterity","board":"crownBoard","enemySkills":["heal","protect","majorDexterity"],"monsters":["motherfly","gnomecromancer"],"events":[["motherfly","motherfly"],["gnomecromancer","gnomecromancer"],["gnomecromancer","gnomeWizard","gnomecromancer"]],"background":"field"},
    'canopy': {"x":-5,"y":-2,"unlocks":["emergents"],"name":"Canopy","level":21,"specialLoot":["simpleJewelLoot"],"skill":"majorDexterity","board":"crownBoard","enemySkills":["heal","protect","majorDexterity"],"monsters":["motherfly","gnomecromancer"],"events":[["motherfly","motherfly"],["gnomecromancer","gnomecromancer"],["gnomecromancer","gnomeWizard","gnomecromancer"]],"background":"field"},
    'cliff': {"x":-3,"y":-5,"unlocks":["emergents"],"name":"Cliff","level":25,"specialLoot":["simpleJewelLoot"],"skill":"majorDexterity","board":"crownBoard","enemySkills":["heal","protect","majorDexterity"],"monsters":["motherfly","gnomecromancer"],"events":[["motherfly","motherfly"],["gnomecromancer","gnomecromancer"],["gnomecromancer","gnomeWizard","gnomecromancer"]],"background":"field"},
    'emergents': {"x":-7,"y":-4,"unlocks":["ravine"],"name":"Emergents","level":29,"specialLoot":["simpleJewelLoot"],"skill":"majorDexterity","board":"crownBoard","enemySkills":["heal","protect","majorDexterity"],"monsters":["motherfly","gnomecromancer"],"events":[["motherfly","motherfly"],["gnomecromancer","gnomecromancer"],["gnomecromancer","gnomeWizard","gnomecromancer"]],"background":"field"},
    'ravine': {"x":-9,"y":-3,"unlocks":[],"name":"Ravine","level":33,"specialLoot":["simpleJewelLoot"],"skill":"majorDexterity","board":"crownBoard","enemySkills":["heal","protect","majorDexterity"],"monsters":["motherfly","gnomecromancer"],"events":[["motherfly","motherfly"],["gnomecromancer","gnomecromancer"],["gnomecromancer","gnomeWizard","gnomecromancer"]],"background":"field"},
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

var mapLeft = -400, mapTop = -120, mapWidth = 800, mapHeight = 800;
var visibleNodes = {};
function drawNewMap() {

    var context = mainContext;
    var currentArea = maps[state.currentArea];
    // Draw parchment backdrop.
    var pattern = context.createPattern(images['gfx/oldMap.png'], 'repeat');
    context.fillStyle = pattern;
    context.fillRect(0, 0, mapWidth, mapHeight);
    var visibleRectangle = rectangle(mapLeft, mapTop, mapWidth, mapHeight);

    visibleNodes = {};
    $.each(map, function (levelKey, levelData) {
        var levelRectangle = rectangle(levelData.x * 40, levelData.y * 40, 40, 40);
        $.extend(levelData, rectangle(levelData.x * 40 - mapLeft, levelData.y * 40 - mapTop, 40, 40));
        if (rectanglesOverlap(visibleRectangle, levelRectangle)) {
            visibleNodes[levelKey] = levelData;
        }
    });
    context.save();
    // Draw ovals for each node.
    $.each(visibleNodes, function (levelKey, levelData){
        context.fillStyle = 'white';
        if (selectedMapNodes.indexOf(levelData) >= 0) {
            context.fillStyle = '#f00';
        }
        context.beginPath();
        context.save();
        context.translate(levelData.left + levelData.width / 2, levelData.top + levelData.height / 2);
        context.scale(1, .5);
        context.arc(0, 0, 22, 0, 2 * Math.PI);
        context.fill();
        context.restore();
    });

    // Draw lines connecting connected nodes.
    context.save();
    context.lineWidth = 5;
    $.each(map, function (levelKey, levelData){
        levelData.unlocks.forEach(function (nextLevelKey) {
            if (visibleNodes[levelKey] || visibleNodes[nextLevelKey]) {
                var nextLevelData = map[nextLevelKey];
                context.beginPath();
                context.strokeStyle = 'white';
                if (selectedMapNodes.indexOf(levelData) >= 0 || selectedMapNodes.indexOf(nextLevelData) >= 0) {
                    context.strokeStyle = '#f00';
                }
                var v = [nextLevelData.left - levelData.left, nextLevelData.top - levelData.top];
                var mag = Math.sqrt(v[0]*v[0]+v[1] * v[1]);
                v[0] /= mag;
                v[1] /= mag;
                context.moveTo(levelData.left + levelData.width / 2, levelData.top + levelData.height / 2);
                context.lineTo(nextLevelData.left + nextLevelData.width / 2 - v[0] * 20, nextLevelData.top + nextLevelData.height / 2 - v[1] * 20);
                context.lineTo(nextLevelData.left + nextLevelData.width / 2 - v[0] * 30 - v[1] * 5, nextLevelData.top + nextLevelData.height / 2 - v[1] * 30 + v[0] * 5);
                context.lineTo(nextLevelData.left + nextLevelData.width / 2 - v[0] * 30 + v[1] * 5, nextLevelData.top + nextLevelData.height / 2 - v[1] * 30 - v[0] * 5);
                context.lineTo(nextLevelData.left + nextLevelData.width / 2 - v[0] * 20, nextLevelData.top + nextLevelData.height / 2 - v[1] * 20);
                context.stroke();
            }
        });
    });
    context.restore();
    // Draw treasure chests on each node.
    $.each(visibleNodes, function (levelKey, levelData){
        var source = closedChestSource;
        context.drawImage(source.image, source.xOffset, 0, source.width, source.height,
                          levelData.left + levelData.width / 2 - 16, levelData.top + levelData.height / 2 - 18, 32, 32);
    });
    return;
}

var selectedMapNodes = [];
var clickedMapNode = null;
function getNewMapPopupTarget(x, y) {
    var newMapTarget = getMapTarget(x, y);
    if (newMapTarget) {
        newMapTarget.helptext = '<p>Level ' + newMapTarget.level + ' ' + newMapTarget.name +'</p><br/>';
    }
    return newMapTarget;
}
function getMapTarget(x, y) {
    var target = null;
    $.each(visibleNodes, function (levelKey, levelData){
        if (isPointInRect(x, y, levelData.left, levelData.top, levelData.width, levelData.height)) {
            target = levelData;
            return false;
        }
        return true;
    });
    return target;
}
function clickNewMapHandler(x, y) {
    if (!currentMapTarget) {
        return;
    }
}

var mapDragX = mapDragY = null, draggedMap = false;
var selectionStartPoint = null;
var originalSelectedNodes = [];
$('.js-mouseContainer').on('mousedown', '.js-mainCanvas', function (event) {
    if (!editingMap) return;
    var x = event.pageX - $(this).offset().left;
    var y = event.pageY - $(this).offset().top;
    draggedMap = false;
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
    mapDragX = x;
    mapDragY = y;
});
$(document).on('mouseup',function (event) {
    if (!editingMap) return;
    selectionStartPoint = null;
    mapDragX = mouseDragY = null;
    clickedMapNode = null;
    drawNewMap();
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
    drawNewMap();
});
$('.js-mouseContainer').on('mousemove', '.js-mainCanvas', function (event) {
    if (!editingMap) return;
    draggedMap = true;
    var x = event.pageX - $(this).offset().left;
    var y = event.pageY - $(this).offset().top;
    if (selectionStartPoint) {
        var endPoint = {'x': x, 'y': y};
        var selectedRectangle = (rectangleFromPoints(selectionStartPoint, endPoint));
        selectedMapNodes = originalSelectedNodes.slice();
        $.each(visibleNodes, function (levelKey, levelData) {
            if (selectedMapNodes.indexOf(levelData) < 0 && rectanglesOverlap(selectedRectangle, levelData)) {
                selectedMapNodes.push(levelData);
            }
        });
        drawNewMap();
        drawRunningAnts(mainContext, selectedRectangle);
    } else if (mapDragX !== null && mapDragY !== null) {
        if (clickedMapNode) {
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
        drawNewMap();
    }

});