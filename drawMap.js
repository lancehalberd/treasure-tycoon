
var world = {radius: 600};
var camera = new Camera(world, 800, 600);
var mapLocation = new SphereVector(world);
var movedMap = true;

function drawMap() {
    var context = mainContext;

    if (true) {
        // Draw parchment backdrop.
        /*var width = images['gfx/oldMap.png'].width;
        var height = images['gfx/oldMap.png'].height;
        for (var x = -mapLeft % width - width; x < mapWidth; x += width) {
            if (x <= -width) continue;
            for (var y = -mapTop % height - height; y < mapHeight; y += height) {
                if (y <= -height) continue;
                context.drawImage(images['gfx/oldMap.png'], 0, 0, width, height,
                                  x, y, width, height);
            }
        }*/
        context.fillStyle = '#fea';
        context.fillRect(0, 0, mapWidth, mapHeight);
        var visibleRectangle = rectangle(mapLeft - 20, mapTop - 20, mapWidth + 40, mapHeight + 50);
        camera.position = mapLocation.position.normalize(world.radius * 2);
        camera.forward = camera.position.normalize(-1);
        //camera.position = snake.position.normalize(world.radius / 2);
        //camera.forward = snake.position.normalize(1);
        camera.fixRightAndUp();
        camera.updateRotationMatrix();
        if (true) {
            var lineColors = [,'#ff0','#8f0','#0f0','#0f8', '#0ff', '#08f', '#00f', '#80f', '#f0f', '#f08', '#f00','#f80'];
            for (var theta = 0; theta < Math.PI * 2; theta += Math.PI / 6) {
                context.beginPath();
                context.strokeStyle = lineColors.pop();
                var lastPoint = null;
                for (var rho = 0; rho < Math.PI + .1; rho += Math.PI / 10) {
                    var z = Math.cos(rho) * world.radius;
                    var r = Math.sin(rho) * world.radius;
                    var x = Math.cos(theta) * r;
                    var y = Math.sin(theta) * r;
                    //console.log([theta / Math.PI, rho / Math.PI, x,y,z]);
                    if (new Vector([x, y, z]).dotProduct(camera.forward) > 0) {
                        lastPoint = null;
                        continue;
                    }
                    var point = camera.projectPoint([x, y, z]);
                    if (lastPoint) {
                        context.lineTo(point[0] - mapLeft, point[1] - mapTop);
                        context.stroke();
                    } else {
                        lastPoint = point;
                        context.moveTo(point[0] - mapLeft, point[1] - mapTop);
                    }
                }
            }
            context.strokeStyle = '#000';
            context.beginPath();
            for (var rho = Math.PI / 10; rho < Math.PI; rho += Math.PI / 10) {
                var lastPoint = null;
                for (var theta = 0; theta < Math.PI * 2 + .1; theta += Math.PI / 6) {
                    var z = Math.cos(rho) * world.radius;
                    var r = Math.sin(rho) * world.radius;
                    var x = Math.cos(theta) * r;
                    var y = Math.sin(theta) * r;
                    //console.log(point);
                    if (new Vector([x, y, z]).dotProduct(camera.forward) > 0) {
                        lastPoint = null;
                        continue;
                    }
                    var point = camera.projectPoint([x, y, z]);
                    if (lastPoint) {
                        context.lineTo(point[0] - mapLeft, point[1] - mapTop);
                    } else {
                        lastPoint = point;
                        context.moveTo(point[0] - mapLeft, point[1] - mapTop);
                    }
                }
            }
            context.stroke();
        }
        visibleNodes = {};
        $.each(map, function (levelKey, levelData) {
            if (!editingMap && !state.visibleLevels[levelKey]) {
                return;
            }
            if (new Vector(levelData.coords).dotProduct(camera.forward) <= 0) {
                var projectedPoint = camera.projectPoint(levelData.coords);
                levelData.left = projectedPoint[0] - 20 - mapLeft;
                levelData.top = projectedPoint[1] - 20 - mapTop;
                visibleNodes[levelKey] = levelData;
                var skill = abilities[levelData.skill];
                if (skill) {
                    levelData.shrine = rectangle(levelData.left - 12, levelData.top - 12, 24, 24);
                    levelData.shrine.isShrine = true;
                    levelData.shrine.level = levelData;
                }
            } else {
                // Put nodes on the reverse of the sphere
                levelData.left = levelData.top = 4000;
            }
            levelData.width = levelData.height = 40;
            levelData.right = levelData.left + 40;
            levelData.bottom = levelData.top + 40;
        });
        movedMap = false;
    }
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
    $.each(visibleNodes, function (levelKey, levelData){
        levelData.unlocks.forEach(function (nextLevelKey) {
            if ((editingMap || (state.visibleLevels[levelKey] && state.visibleLevels[nextLevelKey])) && (visibleNodes[levelKey] && visibleNodes[nextLevelKey])) {
                var nextLevelData = map[nextLevelKey];
                context.beginPath();
                context.strokeStyle = 'white';
                if (editingMap && (selectedMapNodes.indexOf(levelData) >= 0 || selectedMapNodes.indexOf(nextLevelData) >= 0)) {
                    context.strokeStyle = '#f00';
                }
                // Draw a triangle while editing the map so it is obvious which levels are unlocked by completing a level.
                if (editingMap) {
                    drawMapArrow(context, levelData, nextLevelData);
                } else {
                    context.moveTo(levelData.left + levelData.width / 2, levelData.top + levelData.height / 2);
                    context.lineTo(nextLevelData.left + nextLevelData.width / 2, nextLevelData.top + nextLevelData.height / 2);
                    context.stroke();
                }
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
            context.fillStyle = new Vector(levelData.coords).dotProduct(camera.forward) >= 0 ? 'red' : 'black';
            context.fillRect(levelData.left - 30, levelData.top + 19, 100, 15);
            context.fillStyle = 'white';
            context.font = '10px sans-serif';
            context.textAlign = 'center'
            //context.fillText(levelData.coords.map(function (number) { return number.toFixed(0);}).join(', '), levelData.left + 20, levelData.top + 45);
            context.fillText(levelData.level + ' ' + levelData.name, levelData.left + 20, levelData.top + 30);
            if (levelData.skill) {
                context.fillStyle = new Vector(levelData.coords).dotProduct(camera.forward) >= 0 ? 'red' : 'black';
                context.fillRect(levelData.left - 30, levelData.top + 34, 100, 15);
                context.fillStyle = 'white';
                context.fillText(levelData.skill, levelData.left + 20, levelData.top + 45);
            }
            return true;
        }
        var divinityScore = ifdefor(state.selectedCharacter.divinityScores[levelKey], 0);

        var skill = abilities[levelData.skill];
        if (skill) {
            // Draw the shrine only if the level grants a skill.
            context.save();
            var shrine = levelData.shrine;
            var levelCompleted = (state.selectedCharacter.currentLevelKey === levelKey) && state.selectedCharacter.levelCompleted;
            var skillLearned = state.selectedCharacter.adventurer.abilities.indexOf(skill) >= 0;
            var canAffordSkill = state.selectedCharacter.divinity >= totalCostForNextLevel(state.selectedCharacter, levelData);
            // Disable shrine if the character did not just complete this area.
            if (!levelCompleted) {
                context.globalAlpha = .5;
            } else {
                context.globalAlpha = 1;
            }
            // Make the shrine flash if the player can currently activate it.
            if (levelCompleted && !skillLearned && canAffordSkill) {
                drawTintedImage(context, shrineSource.image, '#ff0', .5 + Math.cos(now() / 100) / 5,
                            {'left': shrineSource.xOffset, 'top' :shrineSource.yOffset, 'width': shrineSource.width, 'height': shrineSource.height},
                            shrine);
            } else {
                context.drawImage(shrineSource.image, shrineSource.xOffset, shrineSource.yOffset, shrineSource.width, shrineSource.height,
                                shrine.left, shrine.top, shrine.width, shrine.height);
            }
            if (skillLearned) {
                // If the character has learned the ability for this level, draw a check mark on the shrine.
                context.drawImage(checkSource.image, checkSource.xOffset, checkSource.yOffset, checkSource.width, checkSource.height,
                                    shrine.left, shrine.top, shrine.width, shrine.height);
            } else if (!canAffordSkill) {
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

        context.save();
        context.fillStyle = 'black';
        context.globalAlpha = .3;
        context.fillRect(levelData.left + 9, levelData.top + 19, 22, 15);
        context.restore();

        context.fillStyle = '#fff';
        context.font = 'bold 16px sans-serif';
        context.textAlign = 'center'
        context.fillText(levelData.level, levelData.left + 20, levelData.top + 32);
        if (divinityScore > 0) {
            context.fillStyle = 'black';
            context.fillRect(levelData.left, levelData.top + 34, 40, 15);
            context.fillStyle = 'white';
            context.font = '10px sans-serif';
            context.textAlign = 'center'
            context.fillText(divinityScore.abbreviate(), levelData.left + 20, levelData.top + 45);
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
    if (draggedMap && ifdefor(arrowTargetLeft) !== null && ifdefor(arrowTargetTop) !== null && clickedMapNode) {
        //if (clickedMapNode.x === arrowTargetX && clickedMapNode.y === arrowTargetY) return;
        context.save();
        context.lineWidth = 5;
        context.strokeStyle = '#0f0';
        drawMapArrow(context, clickedMapNode, {'left': arrowTargetLeft, 'top': arrowTargetTop, 'width': 40, 'height': 40});
        context.restore();
    }
}

function drawMapArrow(context, targetA, targetB) {
    var sx = targetA.left + targetA.width / 2;
    var sy = targetA.top + targetA.height / 2;
    var tx = targetB.left + targetB.width / 2;
    var ty = targetB.top + targetB.height / 2;
    var v = [tx - sx, ty - sy];
    var mag = Math.sqrt(v[0]*v[0]+v[1] * v[1]);
    v[0] /= mag;
    v[1] /= mag;
    context.beginPath();
    context.moveTo(sx, sy);
    context.lineTo(tx - v[0] * 17, ty - v[1] * 17);
    context.moveTo(tx - v[0] * 20, ty - v[1] * 20);
    context.lineTo(tx - v[0] * 30 - v[1] * 5, ty - v[1] * 30 + v[0] * 5);
    context.lineTo(tx - v[0] * 30 + v[1] * 5, ty - v[1] * 30 - v[0] * 5);
    context.lineTo(tx - v[0] * 20, ty - v[1] * 20);
    context.stroke();
}