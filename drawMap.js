
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
        var lineColors = ['#0ff', '#08f', '#00f', '#80f', '#f0f', '#f08', '#f00','#f80','#ff0','#8f0','#0f0', '#0f8'];
        var renderedLines = [];
        var latitudes = [];
        for (var rho = 0; rho < Math.PI + .1; rho += Math.PI / 10) {
            latitudes.push(rho);
        }
        // Poles look bad so add one more point just before the poles on both ends.
        latitudes.splice(1, 0, Math.PI / 50);
        latitudes.splice(latitudes.length - 1, 0, Math.PI  - Math.PI / 50);
        for (var theta = 0; theta < Math.PI * 2 + .1; theta += Math.PI / 6) {
            var renderedLine = [];
            for (var rho of latitudes) {
                var newPoint = {};
                var z = Math.cos(rho) * world.radius;
                var r = Math.sin(rho) * world.radius;
                var x = Math.cos(theta - 4 * Math.PI / 6) * r;
                var y = Math.sin(theta - 4 * Math.PI / 6) * r;
                var visible = (new Vector([x, y, z]).dotProduct(camera.forward) <= 0);
                newPoint = {visible: visible};
                renderedLine.push(newPoint);
                //console.log([theta / Math.PI, rho / Math.PI, x,y,z]);
                if (!visible) continue;
                var point = camera.projectPoint([x, y, z]);
                newPoint.x = point[0] - mapLeft;
                newPoint.y = point[1] - mapTop;
                newPoint.u = 800 - Math.round(800 * (theta) / (2 * Math.PI));
                newPoint.v = 400 - Math.round(400 * rho / Math.PI);
            }
            renderedLines.push(renderedLine);
        }
        for (var i = 0; i < renderedLines.length - 1; i++) {
            var lineA = renderedLines[i];
            var lineB = renderedLines[i + 1];
            for (var j = 1; j < lineA.length - 1; j++) {
                var A = lineB[j ];
                var B = lineB[j - 1];
                var C = lineA[j];
                if (A.visible && B.visible && C.visible) {
                    textureMap(context, images['gfx/squareMap.bmp'], [A, B, C]);
                }
                var A = lineB[j];
                var B = lineA[j];
                var C = lineA[j + 1];
                if (A.visible && B.visible && C.visible) {
                    textureMap(context, images['gfx/squareMap.bmp'], [A, B, C]);
                }
            }
        }
        for (var i = 0; i < renderedLines.length - 1; i++) {
            var lastPoint = null;
            var line = renderedLines[i];
            context.beginPath();
            context.strokeStyle = lineColors.pop();
            for (var j = 0; j < line.length; j++) {
                var point = line[j];
                if (!point.visible) {
                    lastPoint = null;
                    continue;
                }
                if (lastPoint) context.lineTo(point.x, point.y);
                else context.moveTo(point.x, point.y);
                lastPoint = point;
            }
            context.stroke();
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
                } /*else {
                    context.moveTo(levelData.left + levelData.width / 2, levelData.top + levelData.height / 2);
                    context.lineTo(nextLevelData.left + nextLevelData.width / 2, nextLevelData.top + nextLevelData.height / 2);
                    context.stroke();
                }*/
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
            var skillLearned = state.selectedCharacter.adventurer.unlockedAbilities[skill.key];
            var canAffordSkill = state.selectedCharacter.divinity >= totalCostForNextLevel(state.selectedCharacter, levelData);
            // Disable shrine if the character did not just complete this area.
            if (!skillLearned && !canAffordSkill) {
                context.globalAlpha = .7;
            } else {
                context.globalAlpha = 1;
            }
            var abilitySource = getAbilityIconSource(skill, shrineSource);
            // Make the shrine flash if the player can currently activate it.
            if (levelCompleted && !skillLearned && canAffordSkill && state.selectedCharacter.adventurer.level < maxLevel) {
                drawTintedImage(context, abilitySource.image, '#ff0', .5 + Math.cos(now() / 100) / 5,
                            {'left': abilitySource.xOffset, 'top' :abilitySource.yOffset, 'width': abilitySource.width, 'height': abilitySource.height},
                            shrine);
            } else {
                context.drawImage(abilitySource.image, abilitySource.xOffset, abilitySource.yOffset, abilitySource.width, abilitySource.height,
                                shrine.left, shrine.top, shrine.width, shrine.height);
            }
            if (skillLearned) {
                // If the character has learned the ability for this level, draw a check mark on the shrine.
                context.drawImage(checkSource.image, checkSource.xOffset, checkSource.yOffset, checkSource.width, checkSource.height,
                                    shrine.left, shrine.top, shrine.width, shrine.height);
            } else if (!canAffordSkill) {
                // If the character can't afford the ability for this leve, draw a red circle around the shrine.
                //context.drawImage(circleSource.image, circleSource.xOffset, circleSource.yOffset, circleSource.width, circleSource.height,
                //                    shrine.left, shrine.top, shrine.width, shrine.height);
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

        var times = ifdefor(state.selectedCharacter.levelTimes[levelKey], {});
        var source = (times['easy'] && times['normal'] && times['hard']) ? openChestSource : closedChestSource;
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
            if (divinityScore >= Math.round(difficultyBonusMap.hard * 1.2 * baseDivinity(levelData.level))) {
                source = goldSource;
            } else if (divinityScore >= Math.round(baseDivinity(levelData.level))) {
                source = silverSource;
            } else {
                source = bronzeSource;
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
        drawMapArrow(context, clickedMapNode, {'left': arrowTargetLeft, 'top': arrowTargetTop, 'width': 0, 'height': 0});
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

function textureMap(ctx, texture, pts) {
    var x0 = pts[0].x, x1 = pts[1].x, x2 = pts[2].x;
    var y0 = pts[0].y, y1 = pts[1].y, y2 = pts[2].y;
    var u0 = pts[0].u, u1 = pts[1].u, u2 = pts[2].u;
    var v0 = pts[0].v, v1 = pts[1].v, v2 = pts[2].v;

    // Set clipping area so that only pixels inside the triangle will
    // be affected by the image drawing operation
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2); ctx.closePath(); ctx.clip();

    // Compute matrix transform
    var delta = u0*v1 + v0*u2 + u1*v2 - v1*u2 - v0*u1 - u0*v2;
    var delta_a = x0*v1 + v0*x2 + x1*v2 - v1*x2 - v0*x1 - x0*v2;
    var delta_b = u0*x1 + x0*u2 + u1*x2 - x1*u2 - x0*u1 - u0*x2;
    var delta_c = u0*v1*x2 + v0*x1*u2 + x0*u1*v2 - x0*v1*u2
                  - v0*u1*x2 - u0*x1*v2;
    var delta_d = y0*v1 + v0*y2 + y1*v2 - v1*y2 - v0*y1 - y0*v2;
    var delta_e = u0*y1 + y0*u2 + u1*y2 - y1*u2 - y0*u1 - u0*y2;
    var delta_f = u0*v1*y2 + v0*y1*u2 + y0*u1*v2 - y0*v1*u2
                  - v0*u1*y2 - u0*y1*v2;

    // Draw the transformed image
    ctx.transform(delta_a/delta, delta_d/delta,
                  delta_b/delta, delta_e/delta,
                  delta_c/delta, delta_f/delta);
    ctx.drawImage(texture, 0, 0);
    ctx.restore();
}
