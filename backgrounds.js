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
    bgSources.rootsA = backgroundSource(images['gfx/forest.png'], 1, 210, 60, 60);
    bgSources.rootsB = backgroundSource(images['gfx/forest.png'], 2, 210, 60, 60);
    bgSources.denseLeaves = backgroundSource(images['gfx/forest.png'], 1, 150, 60, 120);
    bgSources.leavesAndStick = backgroundSource(images['gfx/forest.png'], 2, 150, 60, 120);
    bgSources.stick = backgroundSource(images['gfx/forest.png'], 3, 150, 60, 120);
    bgSources.leaf = backgroundSource(images['gfx/forest.png'], 4, 150, 60, 120);
    // Field sources
    bgSources.field = backgroundSource(images['gfx/grass.png'], 1);
    bgSources.grassEdge = backgroundSource(images['gfx/grass.png'], 2);
    bgSources.dirtCracks = backgroundSource(images['gfx/grass.png'], 3);
    bgSources.skinnyCloud = backgroundSource(images['gfx/grass.png'], 4);
    bgSources.mediumCloud = backgroundSource(images['gfx/grass.png'], 5);
    bgSources.tinyCloud = backgroundSource(images['gfx/grass.png'], 6);
    bgSources.grassA = backgroundSource(images['gfx/grass.png'], 8);
    bgSources.grassB = backgroundSource(images['gfx/grass.png'], 9);
    bgSources.grassC = backgroundSource(images['gfx/grass.png'], 10);
    // Cave sources
    bgSources.cave = backgroundSource(images['gfx/cave.png'], 1);
    bgSources.rocks = backgroundSource(images['gfx/cave.png'], 2);
    bgSources.spikesA = backgroundSource(images['gfx/cave.png'], 3);
    bgSources.spikesB = backgroundSource(images['gfx/cave.png'], 4);
    bgSources.spikesC = backgroundSource(images['gfx/cave.png'], 5);
    bgSources.tombstone = backgroundSource(images['gfx/cave.png'], 6);
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
        {'source': bgSources.dirtCracks},
        {'source': bgSources.grassEdge},
        {'source': bgSources.grassA},
        {'source': bgSources.grassB, 'spacing': 4},
        {'source': bgSources.grassC, 'spacing': 3}
    ];
    backgrounds.cemetery = [
        {'source': bgSources.cave},
        {'source': bgSources.shortTrees, 'parallax': .3, 'spacing': 2.5},
        {'source': bgSources.tallTrees, 'parallax': .5, 'spacing': 3},
        {'source': bgSources.tombstone, 'spacing': 7, 'y': 20},
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
}