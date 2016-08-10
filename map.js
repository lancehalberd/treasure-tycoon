var editingMap = false;
var map = {
    'grove': {"x":10,"y":-1,"unlocks":["savannah","orchard","cave"]},
    'savannah': {"x":6,"y":-2,"unlocks":["range"]},
    'orchard': {"x":13,"y":-2,"unlocks":["crevice"]},
    'range': {"x":8,"y":-3,"unlocks":["valley"]},
    'crevice': {"x":15,"y":-3,"unlocks":["valley"]},
    'valley': {"x":10,"y":-4,"unlocks":[]},
    'meadow': {"x":21,"y":3,"unlocks":["garden","road","grove"]},
    'garden': {"x":23,"y":1,"unlocks":["trail"]},
    'road': {"x":24,"y":4,"unlocks":["tunnel"]},
    'trail': {"x":26,"y":1,"unlocks":["mountain"]},
    'tunnel': {"x":28,"y":3,"unlocks":["mountain"]},
    'mountain': {"x":31,"y":2,"unlocks":[]},
    'cave': {"x":-2,"y":3,"unlocks":["cemetery","temple","meadow"]},
    'cemetery': {"x":-4,"y":1,"unlocks":["crypt"]},
    'temple': {"x":-6,"y":4,"unlocks":["bayou"]},
    'crypt': {"x":-8,"y":1,"unlocks":["dungeon"]},
    'bayou': {"x":-10,"y":4,"unlocks":["dungeon"]},
    'dungeon': {"x":-12,"y":2,"unlocks":[]},
    'forestfloor': {"x":-2,"y":-2,"unlocks":["shrubbery","mossbed","cave","grove"]},
    'shrubbery': {"x":-6,"y":-4,"unlocks":["ruins"]},
    'mossbed': {"x":-4,"y":-1,"unlocks":["riverbank"]},
    'riverbank': {"x":-8,"y":-1,"unlocks":["ruins"]},
    'ruins': {"x":-10,"y":-3,"unlocks":["canopy","cliff","understorey"]},
    'understorey': {"x":-12,"y":-1,"unlocks":["canopy"]},
    'canopy': {"x":-14,"y":-2,"unlocks":["emergents"]},
    'cliff': {"x":-13,"y":-4,"unlocks":["emergents"]},
    'emergents': {"x":-16,"y":-3,"unlocks":["ravine"]},
    'ravine': {"x":-18,"y":-1,"unlocks":[]},
    'shore': {"x":22,"y":-2,"unlocks":["oceanside","meadow","grove"]},
    'oceanside': {"x":26,"y":-4,"unlocks":["wetlands","floodplain"]},
    'wetlands': {"x":24,"y":-1,"unlocks":["meander"]},
    'floodplain': {"x":28,"y":-1,"unlocks":["meander"]},
    'levee': {"x":30,"y":-3,"unlocks":["channel"]},
    'meander': {"x":32,"y":-1,"unlocks":["levee"]},
    'channel': {"x":34,"y":-2,"unlocks":["confluence"]},
    'confluence': {"x":33,"y":-4,"unlocks":["tributaries"]},
    'tributaries': {"x":36,"y":-5,"unlocks":["headwaters"]},
    'headwaters': {"x":38,"y":-1,"unlocks":[]}
};
$.each(map, function (levelKey, levelData) {
    levelData.levelKey = levelKey;
});

function exportMap() {
    var lines = [];
    $.each(map, function (levelKey, levelData) {
        lines.push("\t'" + levelKey+"': " + JSON.stringify({'x': levelData.x, 'y': levelData.y, 'unlocks': levelData.unlocks}));
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
        levelData.left = levelData.x * 40 - mapLeft;
        levelData.top = levelData.y * 40 - mapTop;
        levelData.width = levelData.height = 40;
        if (rectanglesOverlap(visibleRectangle, levelRectangle)) {
            visibleNodes[levelKey] = levelData;
        }
    });
    context.save();
    // Draw ovals for each node.
    $.each(visibleNodes, function (levelKey, levelData){
        context.fillStyle = 'white';
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
    context.strokeStyle = 'white';
    context.lineWidth = 5;
    context.beginPath();
    $.each(map, function (levelKey, levelData){
        levelData.unlocks.forEach(function (nextLevelKey) {
            if (visibleNodes[levelKey] || visibleNodes[nextLevelKey]) {
                var nextLevelData = map[nextLevelKey];
                context.moveTo(levelData.left + levelData.width / 2, levelData.top + levelData.height / 2);
                context.lineTo(nextLevelData.left + nextLevelData.width / 2, nextLevelData.top + nextLevelData.height / 2);
            }
        });
    });
    context.stroke();
    context.restore();
    // Draw treasure chests on each node.
    $.each(visibleNodes, function (levelKey, levelData){
        var level = levels[levelKey];
        var source = closedChestSource;
        context.drawImage(source.image, source.xOffset, 0, source.width, source.height,
                          levelData.left + levelData.width / 2 - 16, levelData.top + levelData.height / 2 - 18, 32, 32);
    });
    return;
}

var selectedMapNodes = [];
function getNewMapPopupTarget(x, y) {
    var newMapTarget = getMapTarget(x, y);
    if (newMapTarget) {
        var level = levels[newMapTarget.levelKey];
        if (!level) {
            newMapTarget.helptext = '<p>Undefined key ' + newMapTarget.levelKey + '</p><br/>';
        } else {
            newMapTarget.helptext = '<p>Level ' + level.level + ' ' + level.name +'</p><br/>';
        }
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

var mapDragX = mapDragY = null;
$('.js-mouseContainer').on('mousedown', '.js-mainCanvas', function (event) {
    var x = event.pageX - $(this).offset().left;
    var y = event.pageY - $(this).offset().top;
    mapDragX = x;
    mapDragY = y;
});
$(document).on('mouseup',function (event) {
    mapDragX = mouseDragY = null;
});

$('.js-mouseContainer').on('mousemove', '.js-mainCanvas', function (event) {
    if (!editingMap) return;
    var x = event.pageX - $(this).offset().left;
    var y = event.pageY - $(this).offset().top;
    if (mapDragX !== null && mapDragY !== null) {
        if (currentMapTarget) {
            console.log([currentMapTarget.x, currentMapTarget.y]);
            currentMapTarget.x = Math.floor((x + mapLeft) / currentMapTarget.width);
            currentMapTarget.y = Math.floor((y + mapTop) / currentMapTarget.height);
            console.log([currentMapTarget.x, currentMapTarget.y]);
            currentMapTarget.left = currentMapTarget.x * 40 - mapLeft;
            currentMapTarget.top = currentMapTarget.y * 40 - mapTop;
        } else {
            mapLeft += (mapDragX - x);
            mapTop += (mapDragY - y);
            mapDragX = x;
            mapDragY = y;
        }
        drawNewMap();
    }

});