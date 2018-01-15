function board(shapes) {
    return {'fixed': [shapes.shift()], 'spaces': shapes};
}
// 3 triangle boards
var triforceBoard = {
    'fixed' : [{"k":"triangle","p":[136,79],"t":0}], 'spaces' : [{"k":"triangle","p":[151,104.98076211353316],"t":-60},{"k":"triangle","p":[121,104.98076211353316],"t":-60},{"k":"triangle","p":[136,79],"t":-60}]
};
var halfHexBoard = {
    'fixed' : [{"k":"trapezoid","p":[383,172.96152422706632],"t":-180}], 'spaces': [{"k":"trapezoid","p":[353,121],"t":0}]
};
var spikeBoard = {
    'fixed': [{"k":"trapezoid","p":[295,236.96152422706632],"t":0}],
    'spaces': [{"k":"triangle","p":[295,236.96152422706632],"t":-60},{"k":"triangle","p":[280,262.9422863405995],"t":-120},{"k":"triangle","p":[340,262.9422863405995],"t":-120}]
};
// 4 triangle boards
var thirdHexBoard = {
    'fixed': [{"k":"diamond","p":[197.5048094716167,130.22114317029974],"t":-120}], 'spaces': [{"k":"diamond","p":[212.5048094716167,104.24038105676658],"t":-60},{"k":"diamond","p":[197.5048094716167,78.2596189432334],"t":0}]
}
var hourGlassBoard = {
    'fixed': [{"k":"diamond","p":[232.5,212.99038105676658],"t":-60}], 'spaces': [{"k":"triangle","p":[232.5,212.99038105676658],"t":60},{"k":"triangle","p":[262.5,212.99038105676658],"t":60},{"k":"triangle","p":[217.5,187.00961894323342],"t":0},{"k":"triangle","p":[247.5,187.00961894323342],"t":0}]
}
var fangBoard = {'fixed': [{"k":"triangle","p":[414.00000000000006,103.78729582162231],"t":-120}], 'spaces': [{"k":"diamond","p":[444.00000000000006,103.78729582162231],"t":-240},{"k":"diamond","p":[414.00000000000006,103.78729582162231],"t":-240}]};
var petalBoard = {'fixed': [{"k":"diamond","p":[270.5,77.99038105676658],"t":-60}], 'spaces': [{"k":"diamond","p":[255.5,103.97114317029974],"t":-120},{"k":"diamond","p":[315.5,103.97114317029974],"t":-180}]};
// 5 triangle board
var pieBoard = board([{"k":"triangle","p":[90,148.03847577293365],"t":60}, {"k":"triangle","p":[60,148.03847577293365],"t":0},{"k":"trapezoid","p":[90,200],"t":180},{"k":"triangle","p":[60,148.03847577293365],"t":60}]);
var helmBoard = board([{"k":"trapezoid","p":[151,87],"t":0},{"k":"diamond","p":[151,87],"t":-240},{"k":"diamond","p":[181,87],"t":-60},{"k":"triangle","p":[166,61.01923788646684],"t":60}]);
var crownBoard = board([{"k":"triangle","p":[443,326.1346123343714],"t":-60},{"k":"diamond","p":[488,352.11537444790457],"t":-540},{"k":"triangle","p":[458,352.11537444790457],"t":-120},{"k":"diamond","p":[428,352.11537444790457],"t":-120}]);

var squareBoard = {
    'fixed': [{"k":"square","p":[89,76],"t":0}],
    'spaces': [{"k":"hexagon","p":[89,106],"t":0},{"k":"hexagon","p":[89,24.03847577293368],"t":0},
        {"k":"hexagon","p":[144.98076211353316,61],"t":30},{"k":"hexagon","p":[63.01923788646684,61],"t":30},
        {"k":"rhombus","p":[134,50.01923788646684],"t":-30},{"k":"rhombus","p":[63.019237886466826,121],"t":-30},
        {"k":"rhombus","p":[144.98076211353316,121],"t":60},{"k":"rhombus","p":[73.99999999999999,50.01923788646685],"t":60}]
};

var basicTemplateBoards = [
    {'size': 4, 'shapes': [{"k":"triangle","p":[70,185.01923788646684],"t":-60},{"k":"triangle","p":[55,211],"t":-60},{"k":"triangle","p":[70,185.01923788646684],"t":0},{"k":"triangle","p":[85,211],"t":-60}]},
    {'size': 6, 'shapes': [{"k":"triangle","p":[199.51923788646684,208.99038105676658],"t":-60},{"k":"triangle","p":[214.51923788646684,183.00961894323342],"t":-60},{"k":"triangle","p":[199.51923788646684,157.02885682970026],"t":0},{"k":"triangle","p":[184.51923788646684,183.00961894323342],"t":-60},{"k":"triangle","p":[214.51923788646684,183.00961894323342],"t":0},{"k":"triangle","p":[184.51923788646684,183.00961894323342],"t":0}]},
    {'size': 6, 'shapes': [{"k":"triangle","p":[155,79],"t":120},{"k":"triangle","p":[155,79],"t":180},{"k":"diamond","p":[155,79],"t":0},{"k":"triangle","p":[170,53.01923788646684],"t":120},{"k":"triangle","p":[155,79],"t":300}]},
    {'size': 9, 'shapes': [{"k":"triangle","p":[327.01923788646684,211],"t":-60},{"k":"diamond","p":[357.01923788646684,159.03847577293368],"t":120},{"k":"diamond","p":[327.01923788646684,211],"t":-180},{"k":"triangle","p":[312.01923788646684,185.01923788646684],"t":-60},{"k":"diamond","p":[372.01923788646684,185.01923788646684],"t":60},{"k":"triangle","p":[342.01923788646684,185.01923788646684],"t":-60}]},
    {'size': 10, 'shapes': [{"k":"diamond","p":[150,60.01923788646684],"t":-60},{"k":"triangle","p":[165,86],"t":300},{"k":"triangle","p":[165,86],"t":120},{"k":"diamond","p":[150,111.98076211353316],"t":-60},{"k":"diamond","p":[180,111.98076211353316],"t":-120},{"k":"diamond","p":[135,86],"t":-120}]}
];
var complexTemplateBoards = [
    {'size': 5, 'shapes': [{"k":"triangle","p":[509.9615242270663,226.96152422706632],"t":210},{"k":"square","p":[509.9615242270663,196.9615242270663],"t":0},{"k":"triangle","p":[509.9615242270663,196.96152422706632],"t":300},{"k":"rhombus","p":[498.98076211353316,185.98076211353316],"t":-30}]},
    {'size': 5, 'shapes': [{"k":"rhombus","p":[579.9615242270664,109.99999999999969],"t":-240},{"k":"square","p":[534.9615242270663,105.98076211353316],"t":0},{"k":"triangle","p":[579.9615242270664,79.99999999999973],"t":480},{"k":"triangle","p":[534.9615242270664,105.98076211353299],"t":300}]},
    {'size': 7, 'shapes': [{"k":"diamond","p":[525.9615242270663,201.94228634059948],"t":-210},{"k":"square","p":[525.9615242270663,171.94228634059948],"t":0},{"k":"rhombus","p":[514.9807621135332,160.96152422706632],"t":-30},{"k":"diamond","p":[555.9615242270663,171.94228634059948],"t":-180}]},
    {'size': 7, 'shapes': [{"k":"rhombus","p":[211.05771365940052,197],"t":-30},{"k":"triangle","p":[211.05771365940052,167],"t":30},{"k":"triangle","p":[222.03847577293368,207.98076211353316],"t":300},{"k":"triangle","p":[267.0384757729337,182],"t":120},{"k":"square","p":[237.03847577293368,152],"t":0},{"k":"triangle","p":[237.03847577293368,182],"t":210}]},
    {'size': 8, 'shapes': [{"k":"triangle","p":[339,52],"t":30},{"k":"diamond","p":[309,82],"t":0},{"k":"square","p":[309,52],"t":0},{"k":"square","p":[339,82],"t":30},{"k":"triangle","p":[339,82],"t":-30}]},
    {'size': 8, 'shapes': [{"k":"triangle","p":[58.057713659400406,53.999999999999886],"t":30},{"k":"rhombus","p":[58.05771365940046,53.99999999999983],"t":-120},{"k":"triangle","p":[84.03847577293357,68.99999999999989],"t":-30},{"k":"rhombus","p":[99.03847577293357,94.98076211353305],"t":-120},{"k":"rhombus","p":[69.03847577293357,94.98076211353305],"t":150},{"k":"triangle","p":[69.03847577293357,94.98076211353305],"t":-60},{"k":"rhombus","p":[110.01923788646684,53.99999999999983],"t":-210},{"k":"triangle","p":[69.03847577293368,43.01923788646667],"t":0}]},
    {'size': 8, 'shapes': [{"k":"triangle","p":[206.05771365940052,78],"t":-30},{"k":"rhombus","p":[258.01923788646684,48],"t":0},{"k":"triangle","p":[232.03847577293368,33],"t":30},{"k":"square","p":[202.03847577293368,63],"t":-90},{"k":"square","p":[232.03847577293368,63],"t":0},{"k":"rhombus","p":[202.03847577293368,63],"t":0}]},
    {'size': 9, 'shapes': [{"k":"rhombus","p":[359,37.01923788646684],"t":-30},{"k":"rhombus","p":[318.01923788646684,48],"t":30},{"k":"square","p":[318.01923788646684,48],"t":-60},{"k":"rhombus","p":[359,88.98076211353316],"t":90},{"k":"square","p":[344,63],"t":-30},{"k":"square","p":[314,63],"t":0}]}
];
function getBoardDataForLevel(level) {
    var safety = 0;
    var levelDegrees = 180 * Math.atan2(level.coords[1], level.coords[0]) / Math.PI;
    // 30 degrees = red leyline, 150 degrees = blue leyline, 270 degrees = green leyline.
    var minLeylineDistance = Math.min(getThetaDistance(30, levelDegrees), getThetaDistance(150, levelDegrees), getThetaDistance(270, levelDegrees));
    // Use basic templates (triangle based) for levels close to primary leylines and complex templates (square based) for levels close to intermediate leylines.
    var templates = ((minLeylineDistance <= 30) ? basicTemplateBoards : complexTemplateBoards).slice();
    // Each shape is worth roughly the number of triangles in it.
    var shapeValues = {'triangle': 1, 'rhombus': 1, 'diamond': 2, 'square': 2, 'trapezoid': 3, 'hexagon': 6};
    // Starts at 2 and gets as high as 7 by level 99.
    var totalValue =  Math.ceil(1 + Math.sqrt(level.level / 3));
    var chosenTemplate = Random.element(templates);
    removeElementFromArray(templates, chosenTemplate, true);
    while (templates.length && chosenTemplate.size <= totalValue && safety++ < 100) {
        chosenTemplate = Random.element(templates);
        removeElementFromArray(templates, chosenTemplate, true);
    }
    if (safety >= 100) console.log("failed first loop");
    if (chosenTemplate.size <= totalValue) {
        throw new Exception('No template found for a board of size ' + totalValue);
    }
    var currentSize = chosenTemplate.size;
    var shapesToKeep = chosenTemplate.shapes.slice();
    var removedShapes = [];
    // This loop randomly adds and removes shapes until we get to the right value. Since some shapes are worth 2 points, and others worth 1,
    // it may overshoot, but eventually it will hit the target.
    while (currentSize !== totalValue && safety++ < 100) {
        if (currentSize > totalValue) {
            // Get rid of a shape to keep if the board is too large.
            removedShapes = removedShapes.concat(shapesToKeep.splice(Math.floor(Math.random() * shapesToKeep.length), 1));
            currentSize -= shapeValues[removedShapes[removedShapes.length - 1].k]
        } else {
            // Add a shape back in if the board is too small.
            shapesToKeep = shapesToKeep.concat(removedShapes.splice(Math.floor(Math.random() * removedShapes.length), 1));
            currentSize += shapeValues[shapesToKeep[shapesToKeep.length - 1].k]
        }
    }
    if (safety >= 100) console.log("failed second loop");
    // Select one of the removed shapes to be the fixed jewel for the board.
    var fixedShape = Random.element(removedShapes);
    return {'fixed':[fixedShape], 'spaces': shapesToKeep};
}


var classBoards = {
    'juggler': board([{"k":"triangle","p":[274,113],"t":60},{"k":"diamond","p":[274,113],"t":-60},{"k":"diamond","p":[244,113],"t":0},{"k":"diamond","p":[289,138.98076211353316],"t":60}]),
    'ranger': board([{"k":"triangle","p":[274,113],"t":60},{"k":"diamond","p":[244,164.96152422706632],"t":-60},{"k":"diamond","p":[304,113],"t":0},{"k":"diamond","p":[274,113],"t":-60},
                     {"k":"diamond","p":[289,138.98076211353316],"t":60},{"k":"diamond","p":[259,87.01923788646684],"t":60},{"k":"diamond","p":[244,113],"t":0}]),
    'sniper': board([{"k":"triangle","p":[75,191.33974596215563],"t":60},{"k":"hexagon","p":[90,165.35898384862247],"t":0},{"k":"hexagon","p":[29.999999999999986,165.35898384862247],"t":0},
                     {"k":"hexagon","p":[59.99999999999999,217.3205080756888],"t":0}]),
    'corsair': board([{"k":"square","p":[422,80],"t":0},{"k":"diamond","p":[437,54.01923788646684],"t":0},{"k":"diamond","p":[422,110],"t":0},
                      {"k":"diamond","p":[396.01923788646684,95],"t":-90},{"k":"diamond","p":[452,110],"t":-90}]),
    'assassin': board([{"k":"square","p":[422,80],"t":0},{"k":"diamond","p":[437,54.01923788646684],"t":0},{"k":"diamond","p":[452,110],"t":-90},
                       {"k":"diamond","p":[396.01923788646684,95],"t":-90},{"k":"diamond","p":[477.98076211353316,65],"t":30},{"k":"diamond","p":[396.01923788646684,95],"t":30},
                       {"k":"diamond","p":[422,110],"t":0},{"k":"diamond","p":[437,135.98076211353316],"t":-60},{"k":"diamond","p":[407,54.01923788646684],"t":-60}]),
    'ninja': board([{"k":"square","p":[422,80],"t":0},{"k":"hexagon","p":[422,110],"t":0},{"k":"hexagon","p":[422,28.03847577293368],"t":0},
                    {"k":"hexagon","p":[477.98076211353316,65],"t":30},{"k":"hexagon","p":[396.01923788646684,65],"t":30}]),
    'blackbelt': board([{"k":"diamond","p":[466,326.9615242270663],"t":-60},{"k":"diamond","p":[481,352.9422863405995],"t":-60},{"k":"triangle","p":[481,300.98076211353316],"t":0},
                        {"k":"diamond","p":[451,300.98076211353316],"t":-60},{"k":"triangle","p":[466,326.9615242270663],"t":60}]),
    'warrior': board([{"k":"diamond","p":[206,264.9615242270663],"t":-60},{"k":"trapezoid","p":[266,264.9615242270663],"t":-180},{"k":"trapezoid","p":[176,264.9615242270663],"t":0},
                      {"k":"trapezoid","p":[236,316.92304845413264],"t":-120},{"k":"trapezoid","p":[206,213],"t":60}]),
    'samurai': {
        'fixed': [{"k":"diamond","p":[442.51923788646684,283.9519052838329],"t":-240}],
        'spaces': [{"k":"hexagon","p":[382.51923788646684,231.99038105676658],"t":0},{"k":"hexagon","p":[442.51923788646684,283.9519052838329],"t":0},{"k":"trapezoid","p":[472.51923788646684,283.9519052838329],"t":-180},{"k":"trapezoid","p":[382.51923788646684,283.9519052838329],"t":-360}]
    },
    'paladin': board([{"k":"trapezoid","p":[121,100.96152422706632],"t":0},{"k":"diamond","p":[181,100.96152422706632],"t":60},{"k":"diamond","p":[91,100.96152422706632],"t":0},
                      {"k":"trapezoid","p":[151,152.92304845413264],"t":-180},{"k":"triangle","p":[136,74.98076211353316],"t":60}]),
    'darkknight': board([{"k":"trapezoid","p":[121,100.96152422706632],"t":0},{"k":"trapezoid","p":[151,100.96152422706632],"t":-180},{"k":"trapezoid","p":[166,126.94228634059948],"t":-120},{"k":"trapezoid","p":[181,152.92304845413264],"t":-180},
                         {"k":"triangle","p":[136,126.94228634059948],"t":60},{"k":"trapezoid","p":[121,152.92304845413264],"t":-180},
                         {"k":"trapezoid","p":[121,100.96152422706632],"t":-240}]),
    'enhancer': board([{"k":"trapezoid","p":[259.01923788646684,159.01923788646684],"t":0},{"k":"trapezoid","p":[244.01923788646684,133.03847577293368],"t":60},
                       {"k":"trapezoid","p":[229.01923788646684,210.98076211353316],"t":-120},{"k":"trapezoid","p":[289.01923788646684,210.98076211353316],"t":-180},
                       {"k":"trapezoid","p":[334.01923788646684,185],"t":-240},{"k":"trapezoid","p":[319.01923788646684,159.01923788646684],"t":-60},
                       {"k":"trapezoid","p":[289.01923788646684,159.01923788646684],"t":-60},{"k":"trapezoid","p":[289.01923788646684,159.01923788646684],"t":-180},
                       {"k":"trapezoid","p":[214.0192378864668,133.03847577293368],"t":60}]),
    'priest': board([{"k":"hexagon","p":[105,174.01923788646684],"t":0},{"k":"triangle","p":[105,225.98076211353316],"t":0},{"k":"triangle","p":[135,174.01923788646684],"t":0},{"k":"triangle","p":[150,200],"t":60},
                    {"k":"triangle","p":[120,148.03847577293368],"t":60},{"k":"triangle","p":[90,200],"t":60},{"k":"triangle","p":[75,174.01923788646684],"t":0}]),
    'wizard': board([{"k":"hexagon","p":[84,207.01923788646684],"t":0},{"k":"diamond","p":[99,181.03847577293368],"t":0},{"k":"diamond","p":[114,258.98076211353316],"t":-60},
                     {"k":"diamond","p":[114,207.01923788646684],"t":-60},{"k":"diamond","p":[69,233],"t":60},{"k":"diamond","p":[114,258.98076211353316],"t":60},
                     {"k":"diamond","p":[54,207.01923788646684],"t":0}]),
    'sorcerer': {
        'fixed': [{"k":"hexagon","p":[195,80],"t":0}],
        'spaces': [{"k":"trapezoid","p":[195,131.96152422706632],"t":0},{"k":"trapezoid","p":[225,80],"t":180},
                   {"k":"trapezoid","p":[240,105.98076211353316],"t":240},{"k":"trapezoid","p":[225,131.96152422706632],"t":300},
                   {"k":"trapezoid","p":[195,80],"t": 120},{"k":"trapezoid","p":[180,105.98076211353316],"t":60}]
    },
    'dancer': board([{"k":"rhombus","p":[327,143],"t":-60},{"k":"diamond","p":[301.01923788646684,158],"t":-30},{"k":"diamond","p":[342,117.01923788646684],"t":-30},
                     {"k":"diamond","p":[327,173],"t":-60},{"k":"diamond","p":[312,117.01923788646684],"t":-60}]),
    'bard': board([{"k":"rhombus","p":[327,143],"t":-60},{"k":"diamond","p":[342,117.01923788646684],"t":-30},{"k":"diamond","p":[327,173],"t":-60},{"k":"diamond","p":[312,117.01923788646684],"t":-60},
                   {"k":"square","p":[342,147.01923788646684],"t":-30},{"k":"square","p":[327,91.03847577293368],"t":-30},{"k":"square","p":[286.01923788646684,132.01923788646684],"t":-30},
                   {"k":"square","p":[301.01923788646684,188],"t":-30},{"k":"diamond","p":[301.01923788646684,158],"t":-30}]),
    'sage': board([{"k":"rhombus","p":[132,129],"t":-60},{"k":"diamond","p":[147.00000000000006,103.01923788646684],"t":-30},{"k":"square","p":[91.01923788646684,118.01923788646684],"t":-30},
                   {"k":"diamond","p":[117.00000000000006,103.01923788646684],"t":-60},{"k":"triangle","p":[132.00000000000006,47.03847577293368],"t":30},
                   {"k":"triangle","p":[91.0192378864669,88.01923788646684],"t":30},{"k":"triangle","p":[91.01923788646684,118.01923788646684],"t":60},
                   {"k":"diamond","p":[106.01923788646684,144],"t":-30},{"k":"square","p":[132.00000000000006,77.03847577293368],"t":-30},
                   {"k":"triangle","p":[157.98076211353322,62.03847577293368],"t":0},{"k":"triangle","p":[172.98076211353316,118.01923788646684],"t":0},
                   {"k":"square","p":[147,133.01923788646684],"t":-30},{"k":"diamond","p":[132,159],"t":-60},{"k":"square","p":[106.01923788646684,174],"t":-30},
                   {"k":"triangle","p":[106.01923788646684,174],"t":60},{"k":"triangle","p":[147,184.98076211353316],"t":90},{"k":"triangle","p":[187.98076211353316,144],"t":90}]),
    'master': {
        'fixed': [{"k":"diamond","p":[375,174.01923788646684],"t":120},{"k":"diamond","p":[375,225.98076211353316],"t":120},{"k":"diamond","p":[390,200],"t":180},
                  {"k":"diamond","p":[375,225.98076211353316],"t":240},{"k":"diamond","p":[330,200],"t":240},{"k":"diamond","p":[345,225.98076211353316],"t":180}],
        'spaces': [{"k":"hexagon","p":[315,225.98076211353316],"t":0},{"k":"hexagon","p":[375,225.98076211353316],"t":0},{"k":"hexagon","p":[405,174.01923788646684],"t":0},
                   {"k":"hexagon","p":[375,122.05771365940052],"t":0},{"k":"hexagon","p":[315,122.05771365940052],"t":0},{"k":"hexagon","p":[285,174.01923788646684],"t":0}]
    }
};

var boards = {
    'tripleTriangles': { 'fixed' : [{"k":"triangle","p":[105,68],"t":60}],'spaces' : [{"k":"triangle","p":[75,68],"t":0},{"k":"triangle","p":[120,93.98076211353316],"t":120}] },
    'radiationBoard': { 'fixed' : [{"k":"triangle","p":[60,200],"t":0}], 'spaces' : [{"k":"triangle","p":[30,200],"t":0},{"k":"triangle","p":[45,174.01923788646684],"t":0}]},
    'smallFangBoard': {'fixed' : [{"k":"diamond","p":[134.75,120.47595264191645],"t":-120}],'spaces' : [{"k":"triangle","p":[104.75,120.47595264191645],"t":-60},{"k":"triangle","p":[134.75,120.47595264191645],"t":0}]},
    'doubleDiamonds': {'fixed' : [{"k":"diamond","p":[161,75],"t":0}],'spaces' : [{"k":"diamond","p":[131,75],"t":-60}]},
    'parallelDiamonds': {'fixed': [{"k":"diamond","p":[240,200],"t":0}], 'spaces': [{"k":"diamond","p":[225,174.01923788646684],"t":0}]},
    triforceBoard,
    halfHexBoard,
    spikeBoard,
    thirdHexBoard,
    hourGlassBoard,
    fangBoard,
    petalBoard,
    pieBoard,
    helmBoard,
    crownBoard,
    squareBoard,
    'juggler': classBoards.juggler,
    'ranger': classBoards.ranger,
    'sniper': classBoards.sniper,
    'corsair': classBoards.corsair,
    'assassin': classBoards.assassin,
    'ninja': classBoards.ninja,
    'blackbelt': classBoards.blackbelt,
    'warrior': classBoards.warrior,
    'samurai': classBoards.samurai,
    'paladin': classBoards.paladin,
    'darkknight': classBoards.darkknight,
    'enhancer': classBoards.enhancer,
    'priest': classBoards.priest,
    'wizard': classBoards.wizard,
    'sorcerer': classBoards.sorcerer,
    'dancer': classBoards.dancer,
    'bard': classBoards.bard,
    'sage': classBoards.sage,
    'master': classBoards.master
};
