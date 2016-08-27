var map = {
    'assassin10': {
        'name': "assassin10",
        'level': 39,
        'x': 39, 'y': -11,
        'coords': [178,-247,517],
        'background': "field",
        'unlocks': ["ninja9"],
        'specialLoot': [],
        'skill': "cripple",
        'board': "pieBoard",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'assassin5': {
        'name': "assassin5",
        'level': 16,
        'x': 16, 'y': -11,
        'coords': [436,-411,-27],
        'background': "field",
        'unlocks': ["assassin6","ninja5"],
        'specialLoot': [],
        'skill': "cull",
        'board': "halfHexBoard",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'assassin6': {
        'name': "assassin6",
        'level': 20,
        'x': 20, 'y': -11,
        'coords': [392,-449,69],
        'background': "field",
        'unlocks': ["assassin7"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'assassin7': {
        'name': "assassin7",
        'level': 24,
        'x': 24, 'y': -11,
        'coords': [366,-429,205],
        'background': "field",
        'unlocks': ["ninja6","assassin8"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'assassin8': {
        'name': "assassin8",
        'level': 29,
        'x': 29, 'y': -11,
        'coords': [307,-406,317],
        'background': "field",
        'unlocks': ["juggler10","ninja7"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'assassin9': {
        'name': "assassin9",
        'level': 34,
        'x': 34, 'y': -11,
        'coords': [256,-330,431],
        'background': "field",
        'unlocks': ["ninja8"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'bayou': {
        'name': "Bayou",
        'level': 4,
        'x': 5, 'y': 4,
        'coords': [-297,-149,-499],
        'background': "forest",
        'unlocks': ["cemetery"],
        'specialLoot': ["simpleEmeraldLoot"],
        'skill': "attackSong",
        'board': "petalBoard",
        'enemySkills': ["protect","majorIntelligence"],
        'monsters': ["butterfly","bat"],
        'events': [
            ["butterfly","butterfly"],
            ["bat","bat","bat","bat"],
            ["lightningBug","lightningBug"]
        ]
    },
    'canopy': {
        'name': "Canopy",
        'level': 14,
        'x': 14, 'y': -14,
        'coords': [128,-574,-118],
        'background': "field",
        'unlocks': ["sniper4","mossbed"],
        'specialLoot': [],
        'skill': "throwingPrecision",
        'board': "tripleTriangles",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'cave': {
        'name': "Cave",
        'level': 1,
        'x': 8, 'y': 1,
        'coords': [-187,96,-562],
        'background': "cave",
        'unlocks': ["temple","bayou","crypt"],
        'specialLoot': ["simpleSaphireLoot"],
        'skill': "heal",
        'board': "tripleTriangles",
        'enemySkills': ["minorIntelligence"],
        'monsters': ["gnome","bat"],
        'events': [
            ["bat","gnome"],
            ["bat","bat"],
            ["gnome","gnome"],
            ["giantSkeleton"]
        ]
    },
    'cemetery': {
        'name': "Cemetery",
        'level': 5,
        'x': 6, 'y': 1,
        'coords': [-424,-10,-424],
        'background': "cemetery",
        'unlocks': ["dungeon"],
        'specialLoot': ["simpleRubyLoot"],
        'skill': "raiseDead",
        'board': "doubleDiamonds",
        'enemySkills': [],
        'monsters': ["bat"],
        'events': [
            ["gnomecromancer","gnomecromancer"],
            ["skeleton","skeleton"],
            ["skeleton","skeleton"],
            ["gnomecromancer"],
            ["skeleton","skeleton","skeleton","skeleton"],
            ["gnomecromancer","gnomecromancer"]
        ]
    },
    'channel': {
        'name': "Channel",
        'level': 15,
        'x': 15, 'y': -9,
        'coords': [504,-317,-78],
        'background': "field",
        'unlocks': ["assassin5","corsair6"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'cliff': {
        'name': "Cliff",
        'level': 25,
        'x': 0, 'y': -5,
        'coords': [560,190,104],
        'background': "field",
        'unlocks': [],
        'specialLoot': ["simpleJewelLoot"],
        'skill': "majorDexterity",
        'board': "crownBoard",
        'enemySkills': ["heal","protect","majorDexterity"],
        'monsters': ["motherfly","gnomecromancer"],
        'events': [
            ["motherfly","motherfly"],
            ["gnomecromancer","gnomecromancer"],
            ["gnomecromancer","gnomeWizard","gnomecromancer"]
        ]
    },
    'confluence': {
        'name': "Confluence",
        'level': 12,
        'x': 12, 'y': -9,
        'coords': [447,-365,-165],
        'background': "field",
        'unlocks': ["channel","ravine"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'corsair10': {
        'name': "corsair10",
        'level': 33,
        'x': 33, 'y': -13,
        'coords': [399,-127,430],
        'background': "field",
        'unlocks': ["ninja8"],
        'specialLoot': [],
        'skill': "plunder",
        'board': "tripleTriangles",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'corsair6': {
        'name': "corsair6",
        'level': 16,
        'x': 16, 'y': -13,
        'coords': [565,-198,-33],
        'background': "field",
        'unlocks': ["ninja5","corsair7"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'corsair7': {
        'name': "corsair7",
        'level': 21,
        'x': 21, 'y': -13,
        'coords': [564,-178,100],
        'background': "field",
        'unlocks': ["corsair8"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'corsair8': {
        'name': "corsair8",
        'level': 24,
        'x': 25, 'y': -13,
        'coords': [535,-168,212],
        'background': "field",
        'unlocks': ["ninja6","corsair9"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'corsair9': {
        'name': "corsair9",
        'level': 29,
        'x': 29, 'y': -13,
        'coords': [473,-141,341],
        'background': "field",
        'unlocks': ["corsair10","ninja7"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'crevice': {
        'name': "Crevice",
        'level': 10,
        'x': 12, 'y': -5,
        'coords': [203,-501,-261],
        'background': "cave",
        'unlocks': ["emergents","meander"],
        'specialLoot': ["simpleSaphireLoot"],
        'skill': "dodge",
        'board': "fangBoard",
        'enemySkills': ["dodge"],
        'monsters': ["gnome","butterfly"],
        'events': [
            ["dragon"]
        ]
    },
    'crypt': {
        'name': "Crypt",
        'level': 3,
        'x': 4, 'y': 2,
        'coords': [-332,157,-474],
        'background': "cemetery",
        'unlocks': ["cemetery"],
        'specialLoot': ["simpleSaphireLoot"],
        'skill': "resonance",
        'board': "triforceBoard",
        'enemySkills': ["resonance"],
        'monsters': ["gnome","butterfly"],
        'events': [
            ["dragon"],
            ["gnomeWizard"]
        ]
    },
    'dungeon': {
        'name': "Dungeon",
        'level': 20,
        'x': 3, 'y': 4,
        'coords': [-461,233,-305],
        'background': "cave",
        'unlocks': [],
        'specialLoot': ["simpleSaphireLoot"],
        'skill': "majorIntelligence",
        'board': "helmBoard",
        'enemySkills': ["majorIntelligence"],
        'monsters': ["gnome","gnomecromancer"],
        'events': [
            ["frostGiant","lightningBug","dragon"]
        ]
    },
    'emergents': {
        'name': "Emergents",
        'level': 11,
        'x': 11, 'y': -10,
        'coords': [83,-556,-209],
        'background': "forest",
        'unlocks': ["canopy"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'floodplains': {
        'name': "Floodplains",
        'level': 6,
        'x': 6, 'y': -13,
        'coords': [424,-167,-390],
        'background': "field",
        'unlocks': ["levee","oceanside"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'fool1': {
        'name': "fool1",
        'level': 7,
        'x': 7, 'y': -7,
        'coords': [-107,-180,-562],
        'background': "field",
        'unlocks': [],
        'specialLoot': [],
        'skill': "tomFoolery",
        'board': "tripleTriangles",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'fool10': {
        'name': "fool10",
        'level': 70,
        'x': 55, 'y': -7,
        'coords': [-7,-29,-599],
        'background': "field",
        'unlocks': [],
        'specialLoot': [],
        'skill': "mimic",
        'board': "pieBoard",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'fool2': {
        'name': "fool2",
        'level': 14,
        'x': 14, 'y': -7,
        'coords': [78,-180,-567],
        'background': "field",
        'unlocks': [],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'fool3': {
        'name': "fool3",
        'level': 21,
        'x': 21, 'y': -7,
        'coords': [171,-26,-575],
        'background': "field",
        'unlocks': [],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'fool4': {
        'name': "fool4",
        'level': 28,
        'x': 28, 'y': -7,
        'coords': [99,31,-591],
        'background': "field",
        'unlocks': [],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'fool5': {
        'name': "fool5",
        'level': 35,
        'x': 35, 'y': -7,
        'coords': [-7,76,-595],
        'background': "field",
        'unlocks': [],
        'specialLoot': [],
        'skill': "decoy",
        'board': "halfHexBoard",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'fool6': {
        'name': "fool6",
        'level': 42,
        'x': 42, 'y': -7,
        'coords': [-89,20,-593],
        'background': "field",
        'unlocks': [],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'fool7': {
        'name': "fool7",
        'level': 49,
        'x': 49, 'y': -7,
        'coords': [-102,-88,-585],
        'background': "field",
        'unlocks': [],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'fool8': {
        'name': "fool8",
        'level': 56,
        'x': 51, 'y': -7,
        'coords': [-1,-130,-586],
        'background': "field",
        'unlocks': [],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'fool9': {
        'name': "fool9",
        'level': 63,
        'x': 53, 'y': -7,
        'coords': [78,-73,-590],
        'background': "field",
        'unlocks': [],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'forestfloor': {
        'name': "Forest Floor",
        'level': 5,
        'x': 5, 'y': -10,
        'coords': [-102,-405,-431],
        'background': "forest",
        'unlocks': ["shrubbery","range"],
        'specialLoot': [],
        'skill': "powerShot",
        'board': "tripleTriangles",
        'enemySkills': ["powerShot"],
        'monsters': ["gnome","butterfly"],
        'events': [
            ["butterfly","butterfly","motherfly"]
        ]
    },
    'garden': {
        'name': "Garden",
        'level': 3,
        'x': 14, 'y': 3,
        'coords': [324,6,-505],
        'background': "garden",
        'unlocks': ["road","tributaries"],
        'specialLoot': ["simpleEmeraldLoot"],
        'skill': "fistMastery",
        'board': "doubleDiamonds",
        'enemySkills': ["ninja"],
        'monsters': ["caterpillar","gnome","butterfly","skeleton"],
        'events': [
            ["butterfly"],
            ["giantSkeleton"],
            ["dragon"]
        ]
    },
    'grove': {
        'name': "Grove",
        'level': 1,
        'x': 10, 'y': -2,
        'coords': [-22,-253,-543],
        'background': "forest",
        'unlocks': ["savannah","orchard","tunnel"],
        'specialLoot': ["simpleEmeraldLoot"],
        'skill': "sap",
        'board': "doubleDiamonds",
        'enemySkills': ["minorDexterity"],
        'monsters': ["caterpillar","spider"],
        'events': [
            ["caterpillar","spider"],
            ["spider","spider"],
            ["caterpillar","caterpillar"],
            ["butterfly"]
        ]
    },
    'headwaters': {
        'name': "Headwaters",
        'level': 9,
        'x': 9, 'y': -9,
        'coords': [468,-288,-242],
        'background': "field",
        'unlocks': ["shore","confluence"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'juggler10': {
        'name': "juggler10",
        'level': 30,
        'x': 30, 'y': -14,
        'coords': [140,-444,378],
        'background': "field",
        'unlocks': ["assassin9","sniper8"],
        'specialLoot': [],
        'skill': "bullseye",
        'board': "pieBoard",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'juggler9': {
        'name': "juggler9",
        'level': 26,
        'x': 26, 'y': -14,
        'coords': [148,-515,269],
        'background': "field",
        'unlocks': ["sniper7","assassin8"],
        'specialLoot': [],
        'skill': "dualThrowing",
        'board': "tripleTriangles",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'levee': {
        'name': "Levee",
        'level': 6,
        'x': 6, 'y': -9,
        'coords': [311,-327,-396],
        'background': "field",
        'unlocks': ["riverbank","floodplains"],
        'specialLoot': [],
        'skill': "smokeBomb",
        'board': "tripleTriangles",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'master1': {
        'name': "master1",
        'level': 5,
        'x': 5, 'y': -8,
        'coords': [-26,-174,574],
        'background': "field",
        'unlocks': ["master7"],
        'specialLoot': [],
        'skill': "equipmentMastery",
        'board': "tripleTriangles",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'master10': {
        'name': "master10",
        'level': 50,
        'x': 50, 'y': -8,
        'coords': [-73,88,589],
        'background': "field",
        'unlocks': [],
        'specialLoot': [],
        'skill': "abilityMastery",
        'board': "pieBoard",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'master2': {
        'name': "master2",
        'level': 10,
        'x': 10, 'y': -8,
        'coords': [126,-84,581],
        'background': "field",
        'unlocks': ["master8"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'master3': {
        'name': "master3",
        'level': 15,
        'x': 15, 'y': -8,
        'coords': [129,99,578],
        'background': "field",
        'unlocks': ["master9"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'master30': {
        'name': "master30",
        'level': 30,
        'x': 30, 'y': -8,
        'coords': [-186,-89,563],
        'background': "field",
        'unlocks': [],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'master4': {
        'name': "master4",
        'level': 20,
        'x': 20, 'y': -8,
        'coords': [-24,194,567],
        'background': "field",
        'unlocks': ["master10"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'master5': {
        'name': "master5",
        'level': 25,
        'x': 25, 'y': -8,
        'coords': [-190,96,561],
        'background': "field",
        'unlocks': [],
        'specialLoot': [],
        'skill': "abilityMastery",
        'board': "halfHexBoard",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'master7': {
        'name': "master7",
        'level': 35,
        'x': 35, 'y': -8,
        'coords': [23,-83,594],
        'background': "field",
        'unlocks': [],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'master8': {
        'name': "master8",
        'level': 40,
        'x': 40, 'y': -8,
        'coords': [67,7,596],
        'background': "field",
        'unlocks': [],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'master9': {
        'name': "master9",
        'level': 45,
        'x': 45, 'y': -8,
        'coords': [22,89,593],
        'background': "field",
        'unlocks': [],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'meadow': {
        'name': "Meadow",
        'level': 1,
        'x': 12, 'y': 1,
        'coords': [198,134,-550],
        'background': "field",
        'unlocks': ["garden","temple"],
        'specialLoot': ["simpleRubyLoot"],
        'skill': "minorStrength",
        'board': "smallFangBoard",
        'enemySkills': ["minorStrength"],
        'monsters': ["caterpillar","skeleton"],
        'events': [
            ["skeleton","caterpillar"],
            ["caterpillar","caterpillar"],
            ["skeleton","skeleton"],
            ["dragon"]
        ]
    },
    'meander': {
        'name': "Meander",
        'level': 10,
        'x': 10, 'y': -11,
        'coords': [327,-465,-192],
        'background': "field",
        'unlocks': ["ravine"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'mossbed': {
        'name': "Mossbed",
        'level': 17,
        'x': 18, 'y': -14,
        'coords': [222,-557,-16],
        'background': "field",
        'unlocks': ["assassin6","valley"],
        'specialLoot': [],
        'skill': "acrobatics",
        'board': "tripleTriangles",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'mountain': {
        'name': "Mountain",
        'level': 15,
        'x': 17, 'y': 5,
        'coords': [573,173,-47],
        'background': "field",
        'unlocks': ["cliff"],
        'specialLoot': ["simpleRubyLoot"],
        'skill': "majorStrength",
        'board': "pieBoard",
        'enemySkills': ["majorStrength"],
        'monsters': ["dragon","giantSkeleton"],
        'events': [
            ["undeadWarrior","undeadWarrior"],
            ["butcher"],
            ["undeadWarrior","undeadWarrior","dragon"],
            ["butcher","dragon","gnomeWizard"]
        ]
    },
    'ninja10': {
        'name': "ninja10",
        'level': 45,
        'x': 45, 'y': -9,
        'coords': [190,-118,557],
        'background': "field",
        'unlocks': ["master2"],
        'specialLoot': [],
        'skill': "shadowClone",
        'board': "pieBoard",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'ninja5': {
        'name': "ninja5",
        'level': 20,
        'x': 20, 'y': -9,
        'coords': [505,-317,65],
        'background': "field",
        'unlocks': ["ninja6"],
        'specialLoot': [],
        'skill': "throwWeapon",
        'board': "halfHexBoard",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'ninja6': {
        'name': "ninja6",
        'level': 25,
        'x': 25, 'y': -9,
        'coords': [462,-292,247],
        'background': "field",
        'unlocks': ["ninja7"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'ninja7': {
        'name': "ninja7",
        'level': 30,
        'x': 30, 'y': -9,
        'coords': [398,-256,369],
        'background': "field",
        'unlocks': ["corsair10","assassin9"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'ninja8': {
        'name': "ninja8",
        'level': 35,
        'x': 35, 'y': -9,
        'coords': [304,-195,479],
        'background': "field",
        'unlocks': ["assassin10"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'ninja9': {
        'name': "ninja9",
        'level': 40,
        'x': 40, 'y': -9,
        'coords': [258,-154,520],
        'background': "field",
        'unlocks': ["ninja10"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'oceanside': {
        'name': "Oceanside",
        'level': 8,
        'x': 8, 'y': -13,
        'coords': [506,-150,-285],
        'background': "field",
        'unlocks': ["headwaters"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'orchard': {
        'name': "Orchard",
        'level': 3,
        'x': 12, 'y': -3,
        'coords': [78,-342,-487],
        'background': "orchard",
        'unlocks': ["shrubbery","wetlands"],
        'specialLoot': ["simpleEmeraldLoot"],
        'skill': "throwingPower",
        'board': "spikeBoard",
        'enemySkills': ["sap","rangeAndAttackSpeed"],
        'monsters': ["butterfly","gnome"],
        'events': [
            ["butterfly","butterfly"],
            ["gnome","gnome"],
            ["dragon"]
        ]
    },
    'range': {
        'name': "Range",
        'level': 6,
        'x': 10, 'y': -4,
        'coords': [-148,-474,-336],
        'background': "forest",
        'unlocks': ["ranger3","sniper2"],
        'specialLoot': ["simpleEmeraldLoot"],
        'skill': "finesse",
        'board': "spikeBoard",
        'enemySkills': ["finesse"],
        'monsters': ["butterfly","gnome"],
        'events': [
            ["butterfly","butterfly"],
            ["gnome","gnome"],
            ["dragon"]
        ]
    },
    'ranger10': {
        'name': "ranger10",
        'level': 36,
        'x': 36, 'y': -12,
        'coords': [-114,-340,481],
        'background': "field",
        'unlocks': ["sniper9"],
        'specialLoot': [],
        'skill': "sicem",
        'board': "pieBoard",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'ranger3': {
        'name': "ranger3",
        'level': 9,
        'x': 9, 'y': -12,
        'coords': [-230,-488,-263],
        'background': "field",
        'unlocks': ["ranger4"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'ranger4': {
        'name': "ranger4",
        'level': 11,
        'x': 11, 'y': -12,
        'coords': [-133,-551,-197],
        'background': "field",
        'unlocks': ["ranger5"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'ranger5': {
        'name': "ranger5",
        'level': 14,
        'x': 14, 'y': -12,
        'coords': [-173,-563,-112],
        'background': "field",
        'unlocks': ["sniper4","ranger6"],
        'specialLoot': [],
        'skill': "net",
        'board': "halfHexBoard",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'ranger6': {
        'name': "ranger6",
        'level': 18,
        'x': 19, 'y': -12,
        'coords': [-176,-573,24],
        'background': "field",
        'unlocks': ["ranger7"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'ranger7': {
        'name': "ranger7",
        'level': 23,
        'x': 23, 'y': -12,
        'coords': [-154,-560,151],
        'background': "field",
        'unlocks': ["sniper6"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'ranger8': {
        'name': "ranger8",
        'level': 27,
        'x': 27, 'y': -12,
        'coords': [-159,-498,294],
        'background': "field",
        'unlocks': ["sniper7"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'ranger9': {
        'name': "ranger9",
        'level': 32,
        'x': 31, 'y': -12,
        'coords': [-123,-435,395],
        'background': "field",
        'unlocks': ["ranger10"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'ravine': {
        'name': "Ravine",
        'level': 13,
        'x': 13, 'y': -11,
        'coords': [370,-459,-112],
        'background': "cave",
        'unlocks': ["mossbed","assassin5"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'riverbank': {
        'name': "River Bank",
        'level': 7,
        'x': 7, 'y': -11,
        'coords': [357,-383,-293],
        'background': "field",
        'unlocks': ["meander","headwaters","crevice"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'road': {
        'name': "Road",
        'level': 6,
        'x': 12, 'y': 3,
        'coords': [451,102,-382],
        'background': "field",
        'unlocks': ["trail"],
        'specialLoot': ["simpleRubyLoot"],
        'skill': "vitality",
        'board': "halfHexBoard",
        'enemySkills': ["vitality"],
        'monsters': ["skeleton"],
        'events': [
            ["skeleton","undeadWarrior"],
            ["dragon"],
            ["skeleton","undeadWarrior","skeleton","undeadWarrior"],
            ["frostGiant"]
        ]
    },
    'ruins': {
        'name': "Ruins",
        'level': 12,
        'x': -1, 'y': -3,
        'coords': [-27,392,-454],
        'background': "cemetery",
        'unlocks': [],
        'specialLoot': ["simpleJewelLoot"],
        'skill': "banishingStrike",
        'board': "fangBoard",
        'enemySkills': ["heal","protect","majorDexterity"],
        'monsters': ["motherfly","gnomecromancer"],
        'events': [
            ["motherfly","motherfly"],
            ["gnomecromancer","gnomecromancer"],
            ["gnomecromancer","gnomeWizard","gnomecromancer"]
        ]
    },
    'savannah': {
        'name': "Savannah",
        'level': 3,
        'x': 8, 'y': -3,
        'coords': [-105,-319,-497],
        'background': "field",
        'unlocks': ["forestfloor","bayou"],
        'specialLoot': ["simpleRubyLoot"],
        'skill': "pet",
        'board': "smallFangBoard",
        'enemySkills': [],
        'monsters': ["butterfly"],
        'events': [
            ["caterpillar","caterpillar","caterpillar"],
            ["caterpillar","caterpillar","motherfly"]
        ]
    },
    'shore': {
        'name': "Shore",
        'level': 12,
        'x': 12, 'y': -13,
        'coords': [541,-192,-175],
        'background': "field",
        'unlocks': ["corsair6","channel"],
        'specialLoot': [],
        'skill': "deflect",
        'board': "halfHexBoard",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'shrubbery': {
        'name': "Shrubbery",
        'level': 5,
        'x': 5, 'y': -14,
        'coords': [39,-440,-406],
        'background': "orchard",
        'unlocks': ["forestfloor","understory"],
        'specialLoot': [],
        'skill': "evasion",
        'board': "doubleDiamonds",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'sniper10': {
        'name': "sniper10",
        'level': 42,
        'x': 42, 'y': -10,
        'coords': [32,-239,549],
        'background': "field",
        'unlocks': ["master1"],
        'specialLoot': [],
        'skill': "snipe",
        'board': "pieBoard",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'sniper2': {
        'name': "sniper2",
        'level': 8,
        'x': 8, 'y': -10,
        'coords': [-36,-524,-290],
        'background': "field",
        'unlocks': ["ranger4","emergents"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'sniper4': {
        'name': "sniper4",
        'level': 16,
        'x': 14, 'y': -10,
        'coords': [-19,-597,-60],
        'background': "field",
        'unlocks': ["sniper5"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'sniper5': {
        'name': "sniper5",
        'level': 18,
        'x': 18, 'y': -10,
        'coords': [-17,-594,82],
        'background': "field",
        'unlocks': ["sniper6"],
        'specialLoot': [],
        'skill': "aiming",
        'board': "halfHexBoard",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'sniper6': {
        'name': "sniper6",
        'level': 23,
        'x': 23, 'y': -10,
        'coords': [-18,-563,207],
        'background': "field",
        'unlocks': ["ranger8","juggler9"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'sniper7': {
        'name': "sniper7",
        'level': 28,
        'x': 28, 'y': -10,
        'coords': [-21,-507,321],
        'background': "field",
        'unlocks': ["ranger9","juggler10","sniper8"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'sniper8': {
        'name': "sniper8",
        'level': 33,
        'x': 33, 'y': -10,
        'coords': [-21,-425,423],
        'background': "field",
        'unlocks': ["ranger10"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'sniper9': {
        'name': "sniper9",
        'level': 38,
        'x': 38, 'y': -10,
        'coords': [50,-330,499],
        'background': "field",
        'unlocks': ["sniper10","assassin10"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'temple': {
        'name': "Temple",
        'level': 2,
        'x': 7, 'y': 3,
        'coords': [-29,249,-545],
        'background': "cave",
        'unlocks': ["ruins"],
        'specialLoot': ["simpleSaphireLoot"],
        'skill': "protect",
        'board': "halfHexBoard",
        'enemySkills': ["heal"],
        'monsters': ["gnome","butterfly"],
        'events': [
            ["dragon"]
        ]
    },
    'trail': {
        'name': "Trail",
        'level': 10,
        'x': 16, 'y': 3,
        'coords': [538,146,-221],
        'background': "field",
        'unlocks': ["mountain"],
        'specialLoot': ["simpleRubyLoot"],
        'skill': "ferocity",
        'board': "halfHexBoard",
        'enemySkills': ["ferocity"],
        'monsters': ["caterpillar","butterfly"],
        'events': [
            ["caterpillar","caterpillar"],
            ["motherfly"],
            ["caterpillar","caterpillar","caterpillar","caterpillar"],
            ["lightningBug","motherfly"]
        ]
    },
    'tributaries': {
        'name': "Tributaries",
        'level': 4,
        'x': 20, 'y': -4,
        'coords': [363,-115,-464],
        'background': "field",
        'unlocks': ["floodplains"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': ["freeze"],
        'monsters': ["butterfly","motherfly"],
        'events': [
            ["frostGiant"]
        ]
    },
    'tunnel': {
        'name': "Tunnel",
        'level': 2,
        'x': 14, 'y': 5,
        'coords': [231,-168,-528],
        'background': "cave",
        'unlocks': ["garden","wetlands","tributaries"],
        'specialLoot': ["simpleSaphireLoot"],
        'skill': "hook",
        'board': "doubleDiamonds",
        'enemySkills': [],
        'monsters': ["undeadWarrior","giantSkeleton"],
        'events': [
            ["skeleton","undeadWarrior"],
            ["giantSkeleton","giantSkeleton"],
            ["undeadWarrior","undeadWarrior","dragon"],
            ["frostGiant","frostGiant"]
        ]
    },
    'understory': {
        'name': "Understory",
        'level': 7,
        'x': 7, 'y': -14,
        'coords': [75,-506,-313],
        'background': "forest",
        'unlocks': ["sniper2","crevice"],
        'specialLoot': [],
        'skill': "throwingMastery",
        'board': "doubleDiamonds",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'valley': {
        'name': "Valley",
        'level': 22,
        'x': 10, 'y': -6,
        'coords': [173,-562,121],
        'background': "forest",
        'unlocks': ["juggler9","sniper6"],
        'specialLoot': ["simpleEmeraldLoot"],
        'skill': "majorDexterity",
        'board': "crownBoard",
        'enemySkills': ["heal","protect","majorDexterity"],
        'monsters': ["motherfly","gnomecromancer"],
        'events': [
            ["motherfly","motherfly"],
            ["gnomecromancer","gnomecromancer"],
            ["gnomecromancer","gnomeWizard","gnomecromancer"]
        ]
    },
    'wetlands': {
        'name': "Wetlands",
        'level': 4,
        'x': 17, 'y': -4,
        'coords': [238,-278,-475],
        'background': "garden",
        'unlocks': ["levee"],
        'specialLoot': [],
        'skill': "blinkStrike",
        'board': "tripleTriangles",
        'enemySkills': ["blinkStrike"],
        'monsters': ["spider","skeleton","caterpillar"],
        'events': [
            ["giantSkeleton"]
        ]
    }
};
