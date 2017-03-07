var backgrounds = {}; // fully defined background composed of sections.
var bgSections = {}; // fully defined section with source, parallax, etc. Currently unused.
var bgSources = {}; // single rectangle from an image.
function backgroundSource(image, xFrame, y, width, height) {
    return { image: image, x: xFrame * 60, y: ifdefor(y, 0), width: ifdefor(width, 60), height: ifdefor(height, 300)};
}
(function initializeBackground() {
    var forestImage = requireImage('gfx/forest.png')
    bgSources.forest = backgroundSource(forestImage, 0);
    bgSources.treeTops = backgroundSource(forestImage, 1, 0, 60, 150);
    bgSources.tallTrees = backgroundSource(forestImage, 2, 0, 60, 150);
    bgSources.shortTrees = backgroundSource(forestImage, 3, 0, 60, 150);
    bgSources.roses = backgroundSource(forestImage, 4, 0, 60, 150);
    bgSources.rootsA = backgroundSource(forestImage, 1, 240, 60, 60);
    bgSources.rootsB = backgroundSource(forestImage, 2, 240, 60, 60);
    bgSources.denseLeaves = backgroundSource(forestImage, 1, 150, 60, 90);
    bgSources.leavesAndStick = backgroundSource(forestImage, 2, 150, 60, 90);
    bgSources.stick = backgroundSource(forestImage, 3, 150, 60, 90);
    bgSources.leaf = backgroundSource(forestImage, 4, 150, 60, 90);
    var fieldImage = requireImage('gfx/grass.png')
    bgSources.field = backgroundSource(fieldImage, 0);
    bgSources.skinnyCloud = backgroundSource(fieldImage, 1, 0, 60, 150)
    bgSources.tinyCloud = backgroundSource(fieldImage, 2, 0, 60, 150)
    bgSources.mediumCloud = backgroundSource(fieldImage, 3, 0, 60, 150)
    bgSources.grassEdge = backgroundSource(fieldImage, 1, 150, 60, 90);
    bgSources.grassA = backgroundSource(fieldImage, 2, 150, 60, 90);
    bgSources.grassB = backgroundSource(fieldImage, 3, 150, 60, 90);
    bgSources.grassC = backgroundSource(fieldImage, 4, 150, 60, 90);
    bgSources.dirtCracksA = backgroundSource(fieldImage, 1, 240, 60, 60);
    bgSources.dirtCracksB = backgroundSource(fieldImage, 2, 240, 60, 60);
    var caveImage = requireImage('gfx/cave.png')
    bgSources.cave = backgroundSource(caveImage, 0);
    bgSources.rocks = backgroundSource(caveImage, 1, 210, 60, 60);
    bgSources.spikesA = backgroundSource(caveImage, 1, 0, 60, 60);
    bgSources.spikesB = backgroundSource(caveImage, 2, 0, 60, 60);
    bgSources.spikesC = backgroundSource(caveImage, 3, 0, 60, 60);
    bgSources.tombstone = backgroundSource(caveImage, 1, 60, 60, 150);
    var beachImage = requireImage('gfx/beach.png')
    // underground: y240; floor: y150; sky: y0; floor: height=90
    bgSources.beach = backgroundSource(beachImage, 0);
    bgSources.water1 = backgroundSource(beachImage, 1, 150, 60, 60);
    bgSources.water2 = backgroundSource(beachImage, 2, 150, 60, 60);
    bgSources.shells1 = backgroundSource(beachImage, 3, 240, 60, 60);
    bgSources.shells2 = backgroundSource(beachImage, 4, 240, 60, 60);
    var townImage = requireImage('gfx/town.png')
    // underground: y240; floor: y150; sky: y0; floor: height=90; sky: height=150
    bgSources.town = backgroundSource(townImage, 0);
    bgSources.cobblestone = backgroundSource(townImage, 1, 150, 60, 90);
    bgSources.houseCurtains = backgroundSource(townImage, 2, 0, 60, 150);
    bgSources.houseTiles = backgroundSource(townImage, 3, 0, 60, 150);
    bgSources.fountain = backgroundSource(townImage, 4, 0, 60, 150);
    var guildImage = requireImage('gfx/guildhall.png');
    bgSources.crackedWall = backgroundSource(guildImage, 1, 0, 60, 150);
    bgSources.oldFloorBoards = backgroundSource(guildImage, 1, 150, 60, 90);
    bgSources.woodFloorEdge = backgroundSource(guildImage, 0, 240, 60, 60);
    backgrounds.oldGuild = [
        {'source': bgSources.crackedWall},
        {'source': bgSources.oldFloorBoards},
        {'source': bgSources.woodFloorEdge}
    ];
    backgrounds.forest = [
        {'source': bgSources.forest},
        {'source': bgSources.treeTops, 'parallax': .2},
        {'source': bgSources.shortTrees, 'parallax': .3, 'spacing': 2},
        {'source': bgSources.tallTrees, 'parallax': .5, 'spacing': 3},
        {'source': bgSources.roses, 'parallax': .65, 'spacing': 4},
        {'source': bgSources.leavesAndStick, 'spacing': 2},
        {'source': bgSources.denseLeaves, 'spacing': 3},
        {'source': bgSources.stick, 'spacing': 5},
        {'source': bgSources.rootsA, 'spacing': 4},
        {'source': bgSources.rootsB, 'spacing': 3}
    ];
    backgrounds.garden = [
        {'source': bgSources.field},
        {'source': bgSources.roses, 'parallax': .4, 'spacing': 3.5},
        {'source': bgSources.roses, 'parallax': .65, 'spacing': 2},
        {'source': bgSources.denseLeaves, 'spacing': 3},
        {'source': bgSources.stick, 'spacing': 5},
        {'source': bgSources.rootsA, 'spacing': 4},
        {'source': bgSources.rootsB, 'spacing': 3}
    ];
    backgrounds.orchard = [
        {'source': bgSources.forest},
        {'source': bgSources.treeTops, 'parallax': .2},
        {'source': bgSources.shortTrees, 'parallax': .3, 'spacing': 1},
        {'source': bgSources.tallTrees, 'parallax': .5, 'spacing': 1.5},
        {'source': bgSources.leavesAndStick, 'spacing': 2},
        {'source': bgSources.denseLeaves, 'spacing': 1},
        {'source': bgSources.rootsA, 'spacing': 4},
        {'source': bgSources.rootsB, 'spacing': 3}
    ];
    backgrounds.field = [
        {'source': bgSources.field},
        {'source': bgSources.skinnyCloud, 'parallax': .2, 'spacing': 3, 'velocity': -50, 'alpha': .4},
        {'source': bgSources.tinyCloud, 'parallax': .3, 'spacing': 2, 'velocity': -50, 'alpha': .4},
        {'source': bgSources.mediumCloud, 'parallax': .5, 'spacing': 3, 'velocity': -50, 'alpha': .4},
        {'source': bgSources.dirtCracksA},
        {'source': bgSources.dirtCracksB},
        {'source': bgSources.grassEdge},
        {'source': bgSources.grassA},
        {'source': bgSources.grassB, 'spacing': 4},
        {'source': bgSources.grassC, 'spacing': 3}
    ];
    backgrounds.cemetery = [
        {'source': bgSources.cave},
        {'source': bgSources.shortTrees, 'parallax': .3, 'spacing': 2.5},
        {'source': bgSources.tallTrees, 'parallax': .5, 'spacing': 3},
        {'source': bgSources.tombstone, 'spacing': 5},
        {'source': bgSources.stick, 'spacing': 4},
        {'source': bgSources.rootsA, 'spacing': 4},
        {'source': bgSources.rootsB, 'spacing': 3}
    ];
    backgrounds.cave = [
        {'source': bgSources.cave},
        {'source': bgSources.spikesA, 'parallax': .2, 'spacing': 1.5},
        {'source': bgSources.spikesC, 'parallax': .3, 'spacing': 2},
        {'source': bgSources.spikesB, 'parallax': .5, 'spacing': 3},
        {'source': bgSources.rocks}
    ];
    backgrounds.beach = [
        {'source': bgSources.beach},
        {'source': bgSources.water1},
        {'source': bgSources.water2, 'spacing': 3},
        {'source': bgSources.shells1, 'spacing': 3},
        {'source': bgSources.shells2, 'spacing': 2}
    ];
    backgrounds.town = [
        {'source': bgSources.town},
        {'source': bgSources.cobblestone},
        {'source': bgSources.fountain, 'spacing': 5},
        {'source': bgSources.houseCurtains, 'spacing': 3},
        {'source': bgSources.houseTiles, 'spacing': 2},
    ];
})();