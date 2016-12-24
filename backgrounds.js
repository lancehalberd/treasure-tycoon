var backgrounds = {}; // fully defined background composed of sections.
var bgSections = {}; // fully defined section with source, parallax, etc.
var bgSources = {}; // single rectangle from an image.
function backgroundSource(image, xFrame, y, width, height) {
    return { image: image, x: xFrame * 60, y: ifdefor(y, 0), width: ifdefor(width, 60), height: ifdefor(height, 300)};
}
function initializeBackground() {
    // Forest sources
    bgSources.forest = backgroundSource(images['gfx/forest.png'], 0);
    bgSources.treeTops = backgroundSource(images['gfx/forest.png'], 1, 0, 60, 150);
    bgSources.tallTrees = backgroundSource(images['gfx/forest.png'], 2, 0, 60, 150);
    bgSources.shortTrees = backgroundSource(images['gfx/forest.png'], 3, 0, 60, 150);
    bgSources.roses = backgroundSource(images['gfx/forest.png'], 4, 0, 60, 150);
    bgSources.rootsA = backgroundSource(images['gfx/forest.png'], 1, 240, 60, 60);
    bgSources.rootsB = backgroundSource(images['gfx/forest.png'], 2, 240, 60, 60);
    bgSources.denseLeaves = backgroundSource(images['gfx/forest.png'], 1, 150, 60, 90);
    bgSources.leavesAndStick = backgroundSource(images['gfx/forest.png'], 2, 150, 60, 90);
    bgSources.stick = backgroundSource(images['gfx/forest.png'], 3, 150, 60, 90);
    bgSources.leaf = backgroundSource(images['gfx/forest.png'], 4, 150, 60, 90);
    // Field sources
    bgSources.field = backgroundSource(images['gfx/grass.png'], 0);
    bgSources.skinnyCloud = backgroundSource(images['gfx/grass.png'], 1, 0, 60, 150)
    bgSources.tinyCloud = backgroundSource(images['gfx/grass.png'], 2, 0, 60, 150)
    bgSources.mediumCloud = backgroundSource(images['gfx/grass.png'], 3, 0, 60, 150)
    bgSources.grassEdge = backgroundSource(images['gfx/grass.png'], 1, 150, 60, 90);
    bgSources.grassA = backgroundSource(images['gfx/grass.png'], 2, 150, 60, 90);
    bgSources.grassB = backgroundSource(images['gfx/grass.png'], 3, 150, 60, 90);
    bgSources.grassC = backgroundSource(images['gfx/grass.png'], 4, 150, 60, 90);
    bgSources.dirtCracksA = backgroundSource(images['gfx/grass.png'], 1, 240, 60, 60);
    bgSources.dirtCracksB = backgroundSource(images['gfx/grass.png'], 2, 240, 60, 60);
    // Cave sources
    bgSources.cave = backgroundSource(images['gfx/cave.png'], 0);
    bgSources.rocks = backgroundSource(images['gfx/cave.png'], 1, 210, 60, 60);
    bgSources.spikesA = backgroundSource(images['gfx/cave.png'], 1, 0, 60, 60);
    bgSources.spikesB = backgroundSource(images['gfx/cave.png'], 2, 0, 60, 60);
    bgSources.spikesC = backgroundSource(images['gfx/cave.png'], 3, 0, 60, 60);
    bgSources.tombstone = backgroundSource(images['gfx/cave.png'], 1, 60, 60, 150);
    // Beach sources
    // underground: y240; floor: y150; sky: y0; floor: height=90
    bgSources.beach = backgroundSource(images['gfx/beach.png'], 0);
    bgSources.water1 = backgroundSource(images['gfx/beach.png'], 1, 150, 60, 60);
    bgSources.water2 = backgroundSource(images['gfx/beach.png'], 2, 150, 60, 60);
    bgSources.shells1 = backgroundSource(images['gfx/beach.png'], 3, 240, 60, 60);
    bgSources.shells2 = backgroundSource(images['gfx/beach.png'], 4, 240, 60, 60);
    // Town sources
    // underground: y240; floor: y150; sky: y0; floor: height=90; sky: height=150
    bgSources.town = backgroundSource(images['gfx/town.png'], 0);
    bgSources.cobblestone = backgroundSource(images['gfx/town.png'], 1, 150, 60, 90);
    bgSources.houseCurtains = backgroundSource(images['gfx/town.png'], 2, 0, 60, 150);
    bgSources.houseTiles = backgroundSource(images['gfx/town.png'], 3, 0, 60, 150);
    bgSources.fountain = backgroundSource(images['gfx/town.png'], 4, 0, 60, 150);
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
}