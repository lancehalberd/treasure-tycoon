
var world = {radius: 600};
var camera = new Camera(world, 800, 600);
var mapLocation = new SphereVector(world);
var movedMap = true;

function drawMap() {
    var context = mainContext;

    if (true) {
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
        if (editingMap) {
            context.strokeStyle = '#000';
            context.globalAlpha = .5;
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
            context.globalAlpha = 1;
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
                    levelData.shrine = rectangle(levelData.left - 16, levelData.top - 16, 32, 32);
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
    // Draw lines connecting connected nodes.
    context.save();
    if (!editingMap) {
        context.strokeStyle = 'black';
        context.setLineDash([8, 12]);
        context.lineWidth = 1;
        context.globalAlpha = .5;
    } else {
        context.lineWidth = 5;
    }
    $.each(visibleNodes, function (levelKey, levelData){
        levelData.unlocks.forEach(function (nextLevelKey) {
            if ((editingMap || (state.visibleLevels[levelKey] && state.visibleLevels[nextLevelKey])) && (visibleNodes[levelKey] && visibleNodes[nextLevelKey])) {
                var nextLevelData = map[nextLevelKey];
                context.beginPath();
                // Draw a triangle while editing the map so it is obvious which levels are unlocked by completing a level.
                if (editingMap) {
                    context.strokeStyle = 'white';
                    if (editingMap && (selectedMapNodes.indexOf(levelData) >= 0 || selectedMapNodes.indexOf(nextLevelData) >= 0)) {
                        context.strokeStyle = '#f00';
                    }
                    drawMapArrow(context, levelData, nextLevelData);
                } else {
                    drawMapPath(context, levelData, nextLevelData);
                    context.moveTo(levelData.left + levelData.width / 2, levelData.top + levelData.height / 2);
                    context.lineTo(nextLevelData.left + nextLevelData.width / 2, nextLevelData.top + nextLevelData.height / 2);
                    context.stroke();
                }
            }
        });
    });
    context.restore();
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
    // Draw treasure chests on each node.
    var checkSource = {'image': images['gfx/militaryIcons.png'], 'left': 68, 'top': 90, 'width': 16, 'height': 16};
    var bronzeSource = {'image': images['gfx/militaryIcons.png'], 'left': 102, 'top': 40, 'width': 16, 'height': 16};
    var silverSource = {'image': images['gfx/militaryIcons.png'], 'left': 85, 'top': 40, 'width': 16, 'height': 16};
    var goldSource = {'image': images['gfx/militaryIcons.png'], 'left': 68, 'top': 40, 'width': 16, 'height': 16};
    $.each(visibleNodes, function (levelKey, levelData){
        if (editingMap) {
            var source = closedChestSource;
            context.drawImage(source.image, source.left, source.top, source.width, source.height,
                              levelData.left + levelData.width / 2 - 16, levelData.top + levelData.height / 2 - 18, 32, 32);
            context.fillStyle = new Vector(levelData.coords).dotProduct(camera.forward) >= 0 ? 'red' : 'black';
            context.fillRect(levelData.left - 30, levelData.top + 19, 100, 15);
            context.fillStyle = 'white';
            context.font = '10px sans-serif';
            context.textAlign = 'center'
            context.textBaseline = 'middle';
            //context.fillText(levelData.coords.map(function (number) { return number.toFixed(0);}).join(', '), levelData.left + 20, levelData.top + 45);
            context.fillText(levelData.level + ' ' + levelData.name, levelData.left + 20, levelData.top + 27);
            if (levelData.skill) {
                context.fillStyle = new Vector(levelData.coords).dotProduct(camera.forward) >= 0 ? 'red' : 'black';
                context.fillRect(levelData.left - 30, levelData.top + 34, 100, 15);
                context.fillStyle = 'white';
                context.fillText(levelData.skill, levelData.left + 20, levelData.top + 41);
            }
            var skill = abilities[levelData.skill];
            if (skill) drawAbilityIcon(context, getAbilityIconSource(skill, shrineSource), levelData.shrine);
            return true;
        }
        var divinityScore = ifdefor(state.selectedCharacter.divinityScores[levelKey], 0);

        var skill = abilities[levelData.skill];
        if (skill) {
            // Draw the shrine only if the level grants a skill.
            context.save();
            var skillLearned = state.selectedCharacter.adventurer.unlockedAbilities[skill.key];
            var canAffordSkill = state.selectedCharacter.divinity >= totalCostForNextLevel(state.selectedCharacter, levelData);
            // Draw she shrine partially tansparent if the character needs more divinity to learn this skill.
            if (!skillLearned && !canAffordSkill) context.globalAlpha = .5;
            else context.globalAlpha = 1;
            drawAbilityIcon(context, getAbilityIconSource(skill, shrineSource), levelData.shrine);
            // If the character has learned the ability for this level, draw a check mark on the shrine.
            context.globalAlpha = .7;
            if (skillLearned) drawImage(context, checkSource.image, checkSource, levelData.shrine);
            context.restore();
        }
        if (state.selectedCharacter.currentLevelKey === levelKey) {
            context.save();
            context.translate(levelData.left + 25, levelData.top - 40);
            context.drawImage(state.selectedCharacter.adventurer.personCanvas, state.selectedCharacter.adventurer.source.walkFrames[1] * 96, 0 , 96, 64, -32, 0, 96, 64);
            context.restore();
        }

        var times = ifdefor(state.selectedCharacter.levelTimes[levelKey], {});
        var source = (times['easy'] && times['normal'] && times['hard']) ? openChestSource : closedChestSource;
        context.drawImage(source.image, source.left, source.top, source.width, source.height,
                            levelData.left + levelData.width / 2 - 16, levelData.top + levelData.height / 2 - 18, 32, 32);

        context.save();
        context.fillStyle = 'black';
        context.globalAlpha = .3;
        context.fillRect(levelData.left + 9, levelData.top + 19, 22, 15);
        context.restore();

        context.fillStyle = '#fff';
        context.font = 'bold 16px sans-serif';
        context.textAlign = 'center'
        context.textBaseline = 'middle';
        context.fillText(levelData.level, levelData.left + 20, levelData.top + 26);
        if (divinityScore > 0) {
            context.fillStyle = 'black';
            context.fillRect(levelData.left, levelData.top + 34, 40, 15);
            context.fillStyle = 'white';
            context.font = '10px sans-serif';
            context.textAlign = 'center'
            context.fillText(divinityScore.abbreviate(), levelData.left + 20, levelData.top + 42);
            if (divinityScore >= Math.round(difficultyBonusMap.hard * 1.2 * baseDivinity(levelData.level))) {
                source = goldSource;
            } else if (divinityScore >= Math.round(baseDivinity(levelData.level))) {
                source = silverSource;
            } else {
                source = bronzeSource;
            }
            context.drawImage(source.image, source.left, source.top, source.width, source.height,
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
function drawMapPath(context, targetA, targetB) {
    var sx = targetA.left + targetA.width / 2;
    var sy = targetA.top + targetA.height / 2;
    var tx = targetB.left + targetB.width / 2;
    var ty = targetB.top + targetB.height / 2;
    context.beginPath();
    context.moveTo(sx, sy);
    context.lineTo(tx, ty);
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
    // If we draw the triangles exactly, a small sliver of empty space is rendered between them.
    // To get around this, we draw each triangle centered at [0, 0] scaled up to 101% to
    // overlap the gap.
    var center = [(x0 + x1 + x2) / 2, (y0 + y1 + y2) / 2];
    x0 -= center[0];
    x1 -= center[0];
    x2 -= center[0];
    y0 -= center[1];
    y1 -= center[1];
    y2 -= center[1];
    ctx.translate(center[0], center[1]);
    ctx.scale(1.01, 1.01);
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
