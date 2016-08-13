

function drawMap() {
    var context = mainContext;
    // Draw parchment backdrop.
    var width = images['gfx/oldMap.png'].width;
    var height = images['gfx/oldMap.png'].height;
    for (var x = -mapLeft % width - width; x < mapWidth; x += width) {
        if (x <= -width) continue;
        for (var y = -mapTop % height - height; y < mapHeight; y += height) {
            if (y <= -height) continue;
            context.drawImage(images['gfx/oldMap.png'], 0, 0, width, height,
                              x, y, width, height);
        }
    }
    var visibleRectangle = rectangle(mapLeft - 20, mapTop - 20, mapWidth + 40, mapHeight + 50);

    visibleNodes = {};
    $.each(map, function (levelKey, levelData) {
        if (!editingMap && !state.visibleLevels[levelKey]) {
            return;
        }
        var levelRectangle = rectangle(levelData.x * 40, levelData.y * 40, 40, 40);
        $.extend(levelData, rectangle(levelData.x * 40 - mapLeft, levelData.y * 40 - mapTop, 40, 40));
        levelData.shrine = rectangle(levelData.x * 40 - mapLeft - 12, levelData.y * 40 - mapTop - 12, 24, 24);
        levelData.shrine.isShrine = true;
        levelData.shrine.level = levelData;
        if (rectanglesOverlap(visibleRectangle, levelRectangle)) {
            visibleNodes[levelKey] = levelData;
        }
    });
    context.save();
    // Draw ovals for each node.
    $.each(visibleNodes, function (levelKey, levelData){
        context.fillStyle = 'white';
        if (editingMap && selectedMapNodes.indexOf(levelData) >= 0) {
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
            if ((editingMap || (state.visibleLevels[levelKey] && state.visibleLevels[nextLevelKey])) && (visibleNodes[levelKey] || visibleNodes[nextLevelKey])) {
                var nextLevelData = map[nextLevelKey];
                context.beginPath();
                context.strokeStyle = 'white';
                if (editingMap && (selectedMapNodes.indexOf(levelData) >= 0 || selectedMapNodes.indexOf(nextLevelData) >= 0)) {
                    context.strokeStyle = '#f00';
                }
                var v = [nextLevelData.left - levelData.left, nextLevelData.top - levelData.top];
                var mag = Math.sqrt(v[0]*v[0]+v[1] * v[1]);
                v[0] /= mag;
                v[1] /= mag;
                context.moveTo(levelData.left + levelData.width / 2, levelData.top + levelData.height / 2);
                context.lineTo(nextLevelData.left + nextLevelData.width / 2 - v[0] * 20, nextLevelData.top + nextLevelData.height / 2 - v[1] * 20);
                // Draw a triangle while editing the map so it is obvious which levels are unlocked by completing a level.
                if (editingMap) {
                    context.lineTo(nextLevelData.left + nextLevelData.width / 2 - v[0] * 30 - v[1] * 5, nextLevelData.top + nextLevelData.height / 2 - v[1] * 30 + v[0] * 5);
                    context.lineTo(nextLevelData.left + nextLevelData.width / 2 - v[0] * 30 + v[1] * 5, nextLevelData.top + nextLevelData.height / 2 - v[1] * 30 - v[0] * 5);
                    context.lineTo(nextLevelData.left + nextLevelData.width / 2 - v[0] * 20, nextLevelData.top + nextLevelData.height / 2 - v[1] * 20);
                }
                context.stroke();
            }
        });
    });
    context.restore();
    // Draw treasure chests on each node.
    var shrineSource = {'image': images['gfx/militaryIcons.png'], 'xOffset': 102, 'yOffset': 125, 'width': 16, 'height': 16};
    var circleSource = {'image': images['gfx/militaryIcons.png'], 'xOffset': 51, 'yOffset': 90, 'width': 16, 'height': 16};
    var checkSource = {'image': images['gfx/militaryIcons.png'], 'xOffset': 68, 'yOffset': 90, 'width': 16, 'height': 16};
    var bronzeSource = {'image': images['gfx/militaryIcons.png'], 'xOffset': 102, 'yOffset': 40, 'width': 16, 'height': 16};
    var silverSource = {'image': images['gfx/militaryIcons.png'], 'xOffset': 85, 'yOffset': 40, 'width': 16, 'height': 16};
    var goldSource = {'image': images['gfx/militaryIcons.png'], 'xOffset': 68, 'yOffset': 40, 'width': 16, 'height': 16};
    $.each(visibleNodes, function (levelKey, levelData){
        if (editingMap) {
            var source = closedChestSource;
            context.drawImage(source.image, source.xOffset, 0, source.width, source.height,
                              levelData.left + levelData.width / 2 - 16, levelData.top + levelData.height / 2 - 18, 32, 32);
            return true;
        }
        var divinityScore = ifdefor(state.selectedCharacter.divinityScores[levelKey], 0);

        var skill = abilities[levelData.skill];
        if (skill && (divinityScore !== 0)) {
            // Draw the shrine only if the character has completed this level and the level grants a skill.
            context.save();
            // Disable shrine if the character did not just complete this area.
            if (state.selectedCharacter.currentLevelKey !== levelKey || !state.selectedCharacter.levelCompleted) {
                context.globalAlpha = .5;
            }
            var shrine = levelData.shrine;
            context.drawImage(shrineSource.image, shrineSource.xOffset, shrineSource.yOffset, shrineSource.width, shrineSource.height,
                              shrine.left, shrine.top, shrine.width, shrine.height);
            if (state.selectedCharacter.adventurer.abilities.indexOf(skill) >= 0) {
                // If the character has learned the ability for this level, draw a check mark on the shrine.
                context.drawImage(checkSource.image, checkSource.xOffset, checkSource.yOffset, checkSource.width, checkSource.height,
                                    shrine.left, shrine.top, shrine.width, shrine.height);
            } else if (state.selectedCharacter.divinity < totalCostForNextLevel(state.selectedCharacter, levelData)) {
                // If the character can't afford the ability for this leve, draw a red circle around the shrine.
                context.drawImage(circleSource.image, circleSource.xOffset, circleSource.yOffset, circleSource.width, circleSource.height,
                                    shrine.left, shrine.top, shrine.width, shrine.height);
            }
            context.restore();
        }
        if (state.selectedCharacter.currentLevelKey === levelKey) {
            //var fps = Math.floor(3 * 5 / 3);
            var frame = 1;//Math.floor(now() * fps / 1000) % walkLoop.length;
            context.save();
            context.translate(levelData.left + 25, levelData.top - 40);
            context.drawImage(state.selectedCharacter.adventurer.personCanvas, walkLoop[frame] * 32, 0 , 32, 64, 0, -0, 32, 64);
            context.restore();
        }


        var source = (divinityScore !== 0) ? openChestSource : closedChestSource;
        context.drawImage(source.image, source.xOffset, 0, source.width, source.height,
                            levelData.left + levelData.width / 2 - 16, levelData.top + levelData.height / 2 - 18, 32, 32);


        if (divinityScore > 0) {
            context.fillStyle = 'black';
            context.fillRect(levelData.left, levelData.top + 34, 40, 15);
            context.fillStyle = 'white';
            context.font = '10px sans-serif';
            context.textAlign = 'center'
            context.fillText(abbreviateDivinity(divinityScore), levelData.left + 20, levelData.top + 45);
            source = silverSource;
            var baseScore = Math.round(baseDivinity(levelData.level));
            if (baseScore > divinityScore) {
                source = bronzeSource;
            } else if (baseScore < divinityScore) {
                source = goldSource;
            }
            context.drawImage(source.image, source.xOffset, source.yOffset, source.width, source.height,
                              levelData.left - 10, levelData.top + 34, 16, 16);
        }
        return true;
    });
    return;
}