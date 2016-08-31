function drawJewel(context, shape, lightSource, borderColor, ambientLightLevel) {
    abmientLightLevel = ifdefor(ambientLightLevel, .3);
    var points = shape.points;
    context.beginPath();
    context.moveTo(points[0][0], points[0][1]);
    for (var i = 1; i < points.length; i++) {
        context.lineTo(points[i][0], points[i][1]);
    }
    context.closePath();
    context.fillStyle = shape.color;
    if (ifdefor(borderColor)) {
        context.strokeStyle = borderColor;
        context.stroke();
    }
    context.fill();
    var innerPoints = [];
    context.beginPath();
    for (var i = 0; i < points.length; i++) {
        var lastPoint = points[(i + points.length - 1) % points.length];
        var nextPoint = points[(i + 1) % points.length];
        var nextNextPoint = points[(i + 2) % points.length];
        var pointA = averagePoint([lastPoint,lastPoint,lastPoint,
            points[i],points[i],points[i],points[i], nextPoint]);
        var pointB = averagePoint([nextPoint,nextPoint,nextPoint,
            points[i],points[i],points[i],points[i], lastPoint]);
        innerPoints.push(pointA);
        innerPoints.push(pointB);
        context.beginPath();
        context.moveTo(points[i][0], points[i][1]);
        context.lineTo(pointA[0], pointA[1]);
        context.lineTo(pointB[0], pointB[1]);
        context.closePath();
        var distance = magnitude(vector(lightSource, averagePoint([points[i], pointA, pointB])));
        var ambientLight = Math.min(abmientLightLevel, Math.max(0, 1 - (distance * distance) / 2000));
        context.fillStyle = 'white';
        var lightVector = normalize(vector(lightSource, averagePoint([pointA, pointB])));
        var surfaceVector = normalize(vector(pointA, pointB));
        surfaceVector = [-surfaceVector[1], surfaceVector[0]];
        var intensity = (surfaceVector[0] * lightVector[0] +
                                surfaceVector[1] * lightVector[1]) * .8;
        if (intensity < 0) {
            intensity = intensity / 4;
        }
        intensity = Math.min(1, intensity + ambientLight);
        if (intensity < 0) {
            context.fillStyle = 'black';
            intensity = -intensity;
        }
        context.save();
        context.globalAlpha *= intensity;
        context.fill();
        context.restore();
        pointA = pointB;
        pointB = averagePoint([points[i], points[i], points[i], nextPoint, nextPoint, nextPoint, nextPoint, nextNextPoint]);
        lightVector = normalize(vector(lightSource, averagePoint([pointA, pointB])));
        context.beginPath();
        context.moveTo(points[i][0], points[i][1]);
        context.lineTo(nextPoint[0], nextPoint[1]);
        context.lineTo(pointB[0], pointB[1]);
        context.lineTo(pointA[0], pointA[1]);
        context.closePath();
        distance = magnitude(vector(lightSource, averagePoint([points[i], nextPoint, pointA, pointB])));
        ambientLight = Math.min(abmientLightLevel, Math.max(0, 1 - (distance * distance) / 2000));
        context.fillStyle = 'white';
        surfaceVector = normalize(vector(pointA, pointB));
        surfaceVector = [-surfaceVector[1], surfaceVector[0]];
        intensity = (surfaceVector[0] * lightVector[0] +
                                surfaceVector[1] * lightVector[1]) * .8;
        if (intensity < 0) {
            intensity = intensity / 4;
        }
        intensity = Math.min(1, intensity + ambientLight);
        if (intensity < 0) {
            context.fillStyle = 'black';
            intensity = -intensity;
        }
        context.save();
        context.globalAlpha *= intensity;
        context.fill();
        context.restore();

    }
    context.beginPath();
    context.moveTo(innerPoints[0][0], innerPoints[0][1]);
    for (var i = 1; i < innerPoints.length; i++) {
        context.lineTo(innerPoints[i][0], innerPoints[i][1]);
    }
    context.closePath();
    context.fillStyle = 'white';
    var distance = magnitude(vector(lightSource, averagePoint(points)));
    context.save();
    context.globalAlpha *= Math.min(.6, Math.max(.3, 1 - (distance * distance - 20) / 1000));
    context.fill();
    context.restore();
}