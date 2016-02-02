var tolerance = .000001;

function polygon(x, y, angle, color, scale) {
    var self = {};
    var _ = {};
    self.points = [[x, y]];
    self.color = color;
    self.angles = [angle];
    self.lengths = [];
    self.center = [0, 0];
    _.scale = ifdefor(scale, 1);
    self.addVertex = function (length, nextAngle) {
        self.angles.push(nextAngle);
        self.lengths.push(length);
        var lastPoint = self.points[self.points.length - 1];
        var theta = angle * Math.PI / 180;
        self.points.push([lastPoint[0] + Math.cos(theta) * length * _.scale, lastPoint[1] + Math.sin(theta) * length * _.scale]);
        angle += (180 - nextAngle);
        return self;
    };
    self.updateCenter = function () {
        self.center = averagePoint(self.points);
        return self;
    }
    self.addVertices = function (angles) {
        for (var i = 0; i < angles.length; i++) {
            self.addVertex(1, angles[i]);
        }
        return self.updateCenter();
    };
    self.addVerticesAndLengths = function (lengths, angles) {
        for (var i = 0; i < angles.length && i < lengths.length; i++) {
            self.addVertex(lengths[i], angles[i]);
        }
        return self.updateCenter();
    };
    self.resetPoints = function () {
        self.points = [self.points[0]];
        angle = self.angles[0];
        var otherAngles = self.angles;
        var lengths = self.lengths;
        otherAngles.shift();
        self.angles = [angle];
        self.lengths = [];
        self.addVerticesAndLengths(lengths, otherAngles);
        return self.updateCenter();
    };
    self.clone = function () {
        var angles = self.angles.concat();
        var lengths = self.lengths.concat();
        var clone = new polygon(self.points[0][0], self.points[0][1], angles.shift(), color, _.scale);
        return clone.addVerticesAndLengths(lengths, angles);
    };
    self.setPosition = function (x, y) {
        return self.translate(x - self.points[0][0], y - self.points[0][1]);
    };
    self.setCenterPosition = function (x, y) {
        return self.translate(x - self.center[0], y - self.center[1]);
    };
    self.translate = function (x, y) {
        for (var i = 0; i < self.points.length; i++) {
            self.points[i][0] += x;
            self.points[i][1] += y;
        }
        self.center[0] += x;
        self.center[1] += y;
        return self;
    };
    self.scale = function (scale) {
        _.scale *= scale;
        for (var i = 0; i < self.points.length; i++) {
            self.points[i][0] *= scale;
            self.points[i][1] *= scale;
        }
        self.center[0] *= scale;
        self.center[1] *= scale;
        return self;
    };
    self.setRotation = function (degrees) {
        self.angles[0] = degrees;
        return self.resetPoints();
    };
    self.rotate = function (degrees) {
        var radians = degrees * Math.PI / 180;
        for (var i = 0; i < self.points.length; i++) {
            self.points[i] = rotatePoint(self.points[i], self.center, radians);
        }
        self.angles[0] += degrees;
        return self;
        //return self.resetPoints();
    };
    return self;
}

function angleBetweenVectors(vector1, vector2) {
    var dotProduct = vector1[0] * vector2[0] + vector1[1] * vector2[1];
    var mag1 = magnitude(vector1);
    var mag2 = magnitude(vector2);
    var cosine = dotProduct / mag1 / mag2;
    if (mag1 * mag2 < tolerance || cosine > 1) {
        return 0;
    }
    return Math.acos(cosine);
}
function allPoints(shapes) {
    var points = [];
    for (var i = 0; i < shapes.length; i++) {
        points = points.concat(shapes[i].points);
    }
    return points;
}
function pointsMatch(A, B) {
    return Math.abs(A[0] - B[0]) < tolerance && Math.abs(A[1] - B[1]) < tolerance;
}
function isPointInArray(point, points) {
    for (var i = 0; i < points.length; i++) {
        if (pointsMatch(point, points[i])) {
            return true;
        }
    }
    return false;
}
function isPointInPoints(point, points) {
    for (var i = 0; i < points.length; i++) {
        var A = [point[0] - points[i][0], point[1] - points[i][1]];
        if (A[0] * A[0] + A[1] * A[1] < tolerance) {
            return true;
        }
        var B = [points[(i + 1) % points.length][0] - point[0], points[(i + 1) % points.length][1] - point[1]];
        if (A[0] * B[1] - A[1] * B[0] > tolerance) {
            return false;
        }
    }
    return true;
}

function addShapeToHull(i, shapeDefinition) {
    var theta = atanPoints(hull[i], arrMod(hull, i - 1));
    var degrees = Math.round(theta * 180 / Math.PI);
    var shape = makeShape(hull[i][0], hull[i][1], degrees, shapeDefinition);
    if (checkForCollision([shape], shapes)) {
        return false;
    }
    var newPoints = shape.points.concat();
    newPoints.push(newPoints.shift());
    [].splice.apply(hull, [i, 0].concat(newPoints));
    shapes.push(shape);
    fixHull();
    return true;
}
// Removes duplicate and 0 angle points from the hull.
function fixHull() {
    for (var i = 0; i < hull.length; i++) {
        var A = arrMod(hull, i - 1), B = arrMod(hull, i), C = arrMod(hull, i + 1);
        // If the current point coincides with either adjacent point, remove it.
        if (pointsMatch(A, B) || pointsMatch(B, C)) {
            hull.splice(i, 1);
            i = -1;
            continue;
        }
        var theta = rightHandAngle(A, B, C);
        var degrees = Math.round(theta * 180 / Math.PI);
        //console.log(i+': ' + degrees);
        // If the angle at this vertex is degenerate, remove it.
        if (degrees === 0) {
            hull.splice(i, 1);
            i = -1;
        }
    }
}
// Definitions for each shape start at each distinct orientation. These are defined
// such that you can give the original point and direction and then pass in the edge
// lengths and angles so that the angle of the given size will appear at the original
// point. This is useful if you are trying to put a shape in a place to fill 60 degrees
// as you can choose any definition that starts with a 60 degree angle.
// Overall, it seems like an ugly solution that should be cleaned up at some point.
var triangleShape = [[1, 1], [60, 60], '#008800', 60, Math.sqrt(3) / 4];
var hexagonShape = [[1, 1, 1, 1, 1], [120, 120, 120, 120, 120],'#ffbb22', 120, 6 * Math.sqrt(3) / 4];
var squareShape = [[1, 1, 1], [90, 90, 90],'#ee7700', 90, 1];
var diamondShape60 = [[1, 1, 1], [120, 60, 120],'#0000ff', 60, Math.sqrt(3) / 2];
var diamondShape120 = [[1, 1, 1], [60, 120, 60],'#0000ff', 120, Math.sqrt(3) / 2];
var rhombusShape30 = [[1, 1, 1], [150, 30, 150],'#ffcccc', 30, .5];
var rhombusShape150 = [[1, 1, 1], [30, 150, 30],'#ffcccc', 150, .5];
var trapezoidShape60A = [[2, 1, 1], [60, 120, 120],'#ff0000', 60, 3 * Math.sqrt(3) / 4];
var trapezoidShape60B = [[1, 1, 1], [120, 120, 60],'#ff0000', 60, 3 * Math.sqrt(3) / 4];
var trapezoidShape120A = [[1, 1, 2], [120, 60, 60],'#ff0000', 120, 3 * Math.sqrt(3) / 4];
var trapezoidShape120B = [[1, 2, 1], [60, 60, 120],'#ff0000', 120, 3 * Math.sqrt(3) / 4];

var shapeDefinitions = {
    'triangle': [triangleShape],
    'square': [squareShape],
    'hexagon': [hexagonShape],
    'diamond': [diamondShape120, diamondShape60],
    'rhombus': [rhombusShape150, rhombusShape30],
    'trapezoid': [trapezoidShape120A,trapezoidShape120B,trapezoidShape60A,trapezoidShape60B]
};
var shapeTypes = [];
$.each(shapeDefinitions, function (key, shapes) {
    shapeTypes.push(key);
    for (var i = 0; i < shapes.length; i++) {
        shapes[i] = {
            'key': key,
            'lengths': shapes[i][0],
            'angles': shapes[i][1],
            'color': shapes[i][2],
            'angle': shapes[i][3],
            'area': shapes[i][4]
        }
    }
});

/**
 * Creates a shape at the given location and angle from the shape definition.
 */
function makeShape(x, y, angleInDegrees, shapeDefinition, scale) {
    return polygon(x, y, angleInDegrees, shapeDefinition.color, scale)
        .addVerticesAndLengths(shapeDefinition.lengths, shapeDefinition.angles);
}
function unshiftOrPush(array, value) {
    if (Math.random() < .5) {
        array.push(value);
    } else {
        array.unshift(value);
    }
}
function addNewPiece(shapes) {
    var originalVertices = [];
    var otherVertices = [];
    for (var i = 0; i < hull.length; i++) {
        var theta = rightHandAngle(arrMod(hull, i - 1), hull[i], arrMod(hull, i + 1));
        var degrees = Math.round(theta * 180 / Math.PI);
        if (degrees < 0) {
            degrees += 360;
        }
        if (isPointInArray(hull[i], originalShape.points)) {
            unshiftOrPush(originalVertices, {i: i, angle: degrees});
        } else {
            unshiftOrPush(otherVertices, {i: i, angle: degrees});
        }
    }
    var added = true;
    if (!addPieceToLargestConcaveVertex(originalVertices, shapes)) {
        if (!addPieceToLargestConcaveVertex(otherVertices, shapes)) {
            added = false;
        }
    }
}
function addPieceToLargestConcaveVertex(vertices, shapes) {
    if (!vertices.length) {
        return false;
    }
    var concaveVertices = [];
    var otherVertices = [];
    for (var i = 0; i < vertices.length; i++) {
        if (vertices[i].angle < 180) {
            unshiftOrPush(concaveVertices, vertices[i]);
        } else {
            unshiftOrPush(otherVertices, vertices[i]);
        }
    }
    // Try to fill largest concave angles first
    concaveVertices.sort(function (A, B) {
        return A.angle - B.angle;
    });
    // Try to fill smallest non-concave angles second
    otherVertices.sort(function (A, B) {
        return B.angle - A.angle;
    });
    var allVertices = concaveVertices.concat(otherVertices);
    while (allVertices.length) {
        var vertex = allVertices.shift();
        if (addLargestAngledPieceToVertex(vertex, shapes)) {
            return true;
        }
    }
    return false;
}
function addLargestAngledPieceToVertex(vertex, shapes) {
    var sortedChoices = getAvailablePiecesSortedByLargestAngle();
    for (var i = 0; i < sortedChoices.length; i++) {
        var shapeDefinition = sortedChoices[i];
        // Prefer not to use rhombus if it leaves an angle that can't be filled
        // with triangles.
        if (shapeDefinition.angle === 150 && !(vertex.angle % 60)) {
            continue;
        }
        if (shapeDefinition.angle > vertex.angle) {
            continue;
        }
        // Prefer not to leave 30 degree gaps when no rhombus shapes remain.
        if (!shapesLeft.rhombus && vertex.angle - shapeDefinition.angle === 30) {
            continue;
        }
        if (addShapeToHull(vertex.i, shapeDefinition)) {
            shapesLeft[shapeDefinition.key]--;
            if (!shapesLeft[shapeDefinition.key]) {
                delete shapesLeft[shapeDefinition.key];
            }
            return true;
        }
    }
    return false;
}

function getAvailablePiecesSortedByLargestAngle() {
    var shapeChoices = [];
    $.each(shapesLeft, function (key, value) {
        shapeChoices = shapeChoices.concat(shapeDefinitions[key]);
    });
    shapeChoices.sort(function (A, B) {
        // If the angle is the same, return the larger shape.
        if (B.angle === A.angle) {
            if (B.area === A.area) {
                return .5 - Math.random();
            }
            return B.area - A.area;
        }
        return B.angle - A.angle;
    });
    return shapeChoices;
}

function checkForCollision(shapesA, shapesB) {
    for (var i = 0; i < shapesA.length; i++) {
        for (var j = 0; j < shapesB.length; j++) {
            if (doShapesIntersect(shapesA[i], shapesB[j])) {
                return true;
            }
        }
    }
    return false;
}
function doShapesIntersect(shapeA, shapeB) {
    for (var i = 0; i < shapeA.points.length; i++) {
        if (isSeparatingLine(shapeA, shapeB, vector(shapeA.points[i], shapeA.points[(i+1) % shapeA.points.length]))) {
            return false;
        }
    }
    for (var i = 0; i < shapeB.points.length; i++) {
        if (isSeparatingLine(shapeA, shapeB, vector(shapeB.points[i], shapeB.points[(i+1) % shapeB.points.length]))) {
            return false;
        }
    }
    return true;
}
function isSeparatingLine(shapeA, shapeB, vector) {
    vector = [-vector[1], vector[0]];
    var minA = 1000000, minB = 1000000, maxA = -1000000, maxB = -1000000;
    for (var i = 0; i < shapeA.points.length; i++) {
        var projection = vector[0] * shapeA.points[i][0] + vector[1] * shapeA.points[i][1];
        minA = Math.min(minA, projection);
        maxA = Math.max(maxA, projection);
    }
    for (var i = 0; i < shapeB.points.length; i++) {
        var projection = vector[0] * shapeB.points[i][0] + vector[1] * shapeB.points[i][1];
        minB = Math.min(minB, projection);
        maxB = Math.max(maxB, projection);
    }
    return maxB < minA + tolerance || maxA < minB + tolerance;
}
function translateShapes(shapes, vector) {
    shapes.forEach(function (shape) {
        shape.translate(vector[0], vector[1]);
    });
}
function rotateShapes(shapes, center, radians) {
    var cos = Math.cos(radians), sin = Math.sin(radians);
    shapes.forEach(function (shape) {
        shape.points[0] = [shape.points[0][0] - center[0], shape.points[0][1] - center[1]];
        shape.points[0] = [shape.points[0][0] * cos - shape.points[0][1] * sin,
                           shape.points[0][0] * sin + shape.points[0][1] * cos];
        shape.points[0] = [shape.points[0][0] + center[0], shape.points[0][1] + center[1]];
        shape.angles[0] += Math.round(radians * 180 / Math.PI);
        shape.resetPoints();
    });
}
function rotatePoint(point, center, radians) {
    var cos = Math.cos(radians), sin = Math.sin(radians);
    point = [point[0] - center[0], point[1] - center[1]];
    point = [point[0] * cos - point[1] * sin, point[0] * sin + point[1] * cos];
    return [point[0] + center[0], point[1] + center[1]];
}

function pointsToRectangle(A, B) {
    var minX = Math.min(startBox[0], endBox[0]);
    var maxX = Math.max(startBox[0], endBox[0]);
    var minY = Math.min(startBox[1], endBox[1]);
    var maxY = Math.max(startBox[1], endBox[1]);
    return {left: minX, top: minY, width: maxX - minX, height: maxY - minY};
}

function arrMod(array, index) {
    return array[(index + array.length) % array.length];
}


function distanceSquared(p1, p2) {
    return (p1[0] - p2[0]) * (p1[0] - p2[0]) + (p1[1] - p2[1]) * (p1[1] - p2[1]);
}
function vector(p1, p2) {
    return [p2[0] - p1[0], p2[1] - p1[1]];
}
function dot2d(v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1];
}
function cross2d(v1, v2) {
    return v1[0] * v2[1] - v1[1] * v2[0];
}
/**
 * Returns the angle formed by ABC to the right when walking from A->B->C in
 * standard orientation +y up and +x to the right.
 */
function rightHandAngle(A, B, C) {
    var v1 = vector(B, A);
    var v2 = vector(B, C);
    return Math.atan2(cross2d(v1, v2), dot2d(v1, v2));
}
/**
 * Returns the angle formed by ABC to the left when walking from A->B->C in
 * standard orientation +y up and +x to the right.
 */
function leftHandAngle(A, B, C) {
    var v1 = vector(B, A);
    var v2 = vector(B, C);
    return Math.atan2(cross2d(v2, v1), dot2d(v1, v2));
}
function magnitude(vector) {
    return Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
}
function averagePoint(points) {
    var x = 0, y = 0;
    points.forEach(function (point) { x += point[0]; y += point[1];});
    return [x / points.length, y / points.length];
}
function normalize(vector) {
    var mag = magnitude(vector);
    return [vector[0] / mag, vector[1] / mag];
}
function atanPoints(p1, p2) {
    return Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
}
function fixInteger(value, tolerance) {
    return Math.abs(value - Math.round(value)) < tolerance ? Math.round(value) : value;
}
function getBounds(shapes) {
    var points = allPoints(shapes);
    var left = right = points[0][0], top = bottom = points[0][1];
    for (var i = 1; i < points.length; i++) {
        left = Math.min(left, points[i][0]);
        right = Math.max(right, points[i][0]);
        top = Math.min(top, points[i][1]);
        bottom = Math.max(bottom, points[i][1]);
    }
    return {left: left, top: top, width: right - left, height: bottom - top};
}
function centerShapesInRectangle(shapes, rectangle) {
    var bounds = getBounds(shapes);
    var targetLeft = rectangle.left + rectangle.width / 2 - bounds.width / 2;
    var targetTop = rectangle.top + rectangle.height / 2 - bounds.height / 2;
    translateShapes(shapes, [targetLeft - bounds.left, targetTop - bounds.top]);
}

function getIntersectionArea(shapeA, shapeB) {
    //console.log('intersection');
    try {
        //console.log(JSON.stringify(shapeA.points));
        //console.log(JSON.stringify(shapeB.points));
        if (!checkForCollision([shapeA], [shapeB])) {
            //console.log('No collision');
            return 0;
        }
        var intersection = {points: computeIntersection(shapeA, shapeB)};
        //console.log(JSON.stringify(intersection));
        return computeArea(intersection);
    } catch (e) {
        console.log('Failed to get intersection area: ' + e.message);
        return 0;
    }
}

function computeIntersection(shapeA, shapeB) {
    // Derived from https://en.wikipedia.org/wiki/Sutherland%E2%80%93Hodgman_algorithm
    var outputPoints = shapeA.points;
    for (var i = 0; i < shapeB.points.length; i++) {
        var p1 = shapeB.points[i];
        var p2 = arrMod(shapeB.points, i + 1);
        var inputPoints = outputPoints;
        outputPoints = [];
        var previousPoint = arrMod(inputPoints, - 1);
        for (var j = 0; j < inputPoints.length; j++) {
            var point = inputPoints[j];
            if (isPointRightOfEdge(point, p1, p2)) {
                if (!isPointRightOfEdge(previousPoint, p1, p2)) {
                    //console.log([previousPoint, point, p1, p2]);
                    outputPoints.push(computeLineIntersection(previousPoint, point, p1, p2));
                }
                outputPoints.push(point);
            } else if (isPointRightOfEdge(previousPoint, p1, p2)) {
                //console.log([previousPoint, point, p1, p2]);
                outputPoints.push(computeLineIntersection(previousPoint, point, p1, p2));
            }
            previousPoint = point;
        }
    }
    return outputPoints;
}
// Derived from http://www.mathwords.com/a/area_convex_polygon.htm
function computeArea(shape) {
    var area = 0;
    for (var i = 0; i < shape.points.length; i++) {
        var nextPoint = arrMod(shape.points, i + 1);
        area += shape.points[i][0] * nextPoint[1] - shape.points[i][1] * nextPoint[0];
    }
    return area / 2;
}
//console.log(computeArea({points: [[0, 0],[0, 2],[2, 2],[2, 0]]}));
//var points = computeIntersection({points: [[-1, -1],[-1, 1],[.5, 1],[1, .5],[1, -1]]},
//                    {points: [[0, 0],[0, 2],[2, 2],[2, 0]]})
//console.log(computeArea({points: points}));
//console.log(JSON.stringify(computeIntersection({points: [[-1, -1],[1, -1],[1, 1],[-1, 1]]},
//                    {points: [[-1, -1],[1, -1],[1, 1],[-1, 1]]})));
//console.log(isPointRightOfEdge([0,0], [-1, 0], [0, 1]));
//console.log(JSON.stringify(computeIntersection({points: [[-1, -1],[1, -1],[1, 1],[-1, 1]]},
//                    {points: [[0, 0],[2, 0],[2, 2],[0, 2]]})));
//console.log(JSON.stringify(computeIntersection({points: [[-1, -1],[1, -1],[1, 1],[-1, 1]]},
//                    {points: [[-1, -1],[2, -1],[2, 2],[-1, 2]]})));
//console.log(JSON.stringify(computeIntersection({points: [[-1, -1],[-1, 1],[.5, 1],[1, .5],[1, -1]]},
//                    {points: [[0, 0],[0, 2],[2, 2],[2, 0]]})));
//console.log(JSON.stringify(computeIntersection({points: [[-1, -1],[-1, 1],[1, 1],[1, -1]]},
//                    {points: [[1, 1],[1, 2],[2, 2],[2, 1]]})));
// derived from http://jsfiddle.net/justin_c_rounds/Gd2S2/
function computeLineIntersection(p1, p2, q1, q2) {
    var dx1 = p2[0] - p1[0];
    var dy1 = p2[1] - p1[1];
    var dx2 = q2[0] - q1[0];
    var dy2 = q2[1] - q1[1];
    var denominator = dy2 * dx1 - dx2 * dy1;
    if (denominator == 0) {
        throw new Error('Lines do not intersect: '+ JSON.stringify([p1, p2, q1, q2]));
        return false;
    }
    var a = (dx2 * (p1[1] - q1[1]) - dy2 * (p1[0] - q1[0])) / denominator;
    return [p1[0] + a * dx1, p1[1] + a * dy1];
};
//console.log(computeLineIntersection([0,0],[2,2],[0,0],[1,0]).join(','));
function isPointRightOfEdge(point, p1, p2) {
    var A = [point[0] - p1[0], point[1] - p1[1]];
    /*if (A[0] * A[0] + A[1] * A[1] < tolerance) {
        return false;
    }*/
    var B = [p2[0] - point[0], p2[1] - point[1]];
    if (A[0] * B[1] - A[1] * B[0] > 0) {
        return false;
    }
    return true;
}