var backgrounds = {}; // fully defined background composed of sections.
var bgSections = {}; // fully defined section with source, parallax, etc.
var bgSources = {}; // single rectangle from an image.
function backgroundSource(image, xFrame, y, width, height) {
    return { image: image, x: xFrame * 64, y: ifdefor(width, 0), width: ifdefor(width, 64), height: ifdefor(width, 240)};
}
function initializeBackground() {
    // Forest sources
    bgSources.forest = backgroundSource(images['gfx/forest.png'], 1);
    bgSources.bedrock = backgroundSource(images['gfx/forest.png'], 3);
    bgSources.treeTops = backgroundSource(images['gfx/forest.png'], 4);
    bgSources.tallTrees = backgroundSource(images['gfx/forest.png'], 5);
    bgSources.shortTrees = backgroundSource(images['gfx/forest.png'], 6);
    bgSources.roses = backgroundSource(images['gfx/forest.png'], 7);
    bgSources.rootsA = backgroundSource(images['gfx/forest.png'], 9);
    bgSources.rootsB = backgroundSource(images['gfx/forest.png'], 10);
    bgSources.denseFallenLeaves = backgroundSource(images['gfx/forest.png'], 11);
    bgSources.sparseLeaves = backgroundSource(images['gfx/forest.png'], 12);
    bgSources.stick = backgroundSource(images['gfx/forest.png'], 13);
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
    bgSources.rocks = backgroundSource(images['gfx/cave.png'], 3);
    bgSources.spikesA = backgroundSource(images['gfx/cave.png'], 4);
    bgSources.spikesB = backgroundSource(images['gfx/cave.png'], 5);
    bgSources.spikesC = backgroundSource(images['gfx/cave.png'], 6);
    backgrounds.forest = [
        {'source': bgSources.forest},
        {'source': bgSources.treeTops, 'parallax': .2},
        {'source': bgSources.shortTrees, 'parallax': .3, 'spacing': 2},
        {'source': bgSources.tallTrees, 'parallax': .5, 'spacing': 3},
        {'source': bgSources.roses, 'parallax': .65, 'spacing': 4},
        {'source': bgSources.denseFallenLeaves, 'spacing': 2},
        {'source': bgSources.sparseLeaves, 'spacing': 3},
        {'source': bgSources.stick, 'spacing': 5},
        {'source': bgSources.bedrock},
        {'source': bgSources.rootsA, 'spacing': 4},
        {'source': bgSources.rootsB, 'spacing': 3}
    ];
    backgrounds.field = [
        {'source': bgSources.field},
        {'source': bgSources.skinnyCloud, 'parallax': .2, 'spacing': 3, 'velocity': -50},
        {'source': bgSources.tinyCloud, 'parallax': .3, 'spacing': 2, 'velocity': -50},
        {'source': bgSources.mediumCloud, 'parallax': .5, 'spacing': 3, 'velocity': -50},
        {'source': bgSources.dirtCracks},
        {'source': bgSources.grassEdge},
        {'source': bgSources.grassA},
        {'source': bgSources.grassB, 'spacing': 4},
        {'source': bgSources.grassC, 'spacing': 3}
    ];
    backgrounds.cave = [
        {'source': bgSources.cave},
        {'source': bgSources.spikesA, 'parallax': .2, 'spacing': 1.5},
        {'source': bgSources.spikesC, 'parallax': .3, 'spacing': 2},
        {'source': bgSources.spikesB, 'parallax': .5, 'spacing': 3},
        {'source': bgSources.rocks}
    ];
}