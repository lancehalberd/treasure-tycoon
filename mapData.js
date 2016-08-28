var map = {
    'academy': {
        'name': "Academy",
        'level': 6,
        'x': 0, 'y': 0,
        'coords': [-292,-297,-432],
        'background': "cave",
        'unlocks': ["camp"],
        'specialLoot': [],
        'skill': "stopTime",
        'board': "tripleTriangles",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'ancientlibrary': {
        'name': "Ancient Library",
        'level': 24,
        'x': 4, 'y': 2,
        'coords': [-494,286,184],
        'background': "cemetery",
        'unlocks': ["holyland"],
        'specialLoot': ["simpleSaphireLoot"],
        'skill': "resonance",
        'board': "helmBoard",
        'enemySkills': ["resonance"],
        'monsters': ["gnome","butterfly"],
        'events': [
            ["dragon"],
            ["gnomeWizard"]
        ]
    },
    'assassin10': {
        'name': "assassin10",
        'level': 39,
        'x': 39, 'y': -11,
        'coords': [203,-234,514],
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
        'coords': [333,-379,325],
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
        'coords': [284,-315,424],
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
    'barracks': {
        'name': "Barracks",
        'level': 4,
        'x': 0, 'y': 0,
        'coords': [122,394,-436],
        'background': "field",
        'unlocks': ["dojo"],
        'specialLoot': [],
        'skill': "consume",
        'board': "tripleTriangles",
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
        'coords': [-298,-98,-511],
        'background': "forest",
        'unlocks': ["cemetery","academy"],
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
    'camp': {
        'name': "Camp",
        'level': 12,
        'x': 0, 'y': 0,
        'coords': [-492,-286,-190],
        'background': "forest",
        'unlocks': ["memorial"],
        'specialLoot': [],
        'skill': "charm",
        'board': "fangBoard",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
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
    'carnival': {
        'name': "Carnival",
        'level': 33,
        'x': 0, 'y': 0,
        'coords': [-368,-207,426],
        'background': "garden",
        'unlocks': ["castle"],
        'specialLoot': [],
        'skill': "dervish",
        'board': "pieBoard",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'castle': {
        'name': "Castle",
        'level': 39,
        'x': 0, 'y': 0,
        'coords': [-226,-208,516],
        'background': "cave",
        'unlocks': ["ziggurat"],
        'specialLoot': [],
        'skill': "heroSong",
        'board': "pieBoard",
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
        'coords': [-159,93,-571],
        'background': "cave",
        'unlocks': ["temple","traininggrounds","village"],
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
        'coords': [-423,96,-415],
        'background': "cemetery",
        'unlocks': ["cloister"],
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
        'coords': [515,-296,-82],
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
        'level': 30,
        'x': 0, 'y': -5,
        'coords': [419,241,355],
        'background': "field",
        'unlocks': ["tundra"],
        'specialLoot': ["simpleJewelLoot"],
        'skill': "dragonPunch",
        'board': "crownBoard",
        'enemySkills': ["heal","protect","majorDexterity"],
        'monsters': ["motherfly","gnomecromancer"],
        'events': [
            ["motherfly","motherfly"],
            ["gnomecromancer","gnomecromancer"],
            ["gnomecromancer","gnomeWizard","gnomecromancer"]
        ]
    },
    'cloister': {
        'name': "Cloister",
        'level': 10,
        'x': 0, 'y': 0,
        'coords': [-450,265,-296],
        'background': "cave",
        'unlocks': ["tomb"],
        'specialLoot': [],
        'skill': "reflect",
        'board': "fangBoard",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'confluence': {
        'name': "Confluence",
        'level': 12,
        'x': 12, 'y': -9,
        'coords': [425,-380,-185],
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
        'coords': [395,-92,442],
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
        'coords': [560,-100,190],
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
        'coords': [495,-80,329],
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
    'desert': {
        'name': "Desert",
        'level': 10,
        'x': 0, 'y': 0,
        'coords': [504,174,-276],
        'background': "field",
        'unlocks': ["foothills"],
        'specialLoot': [],
        'skill': "counterAttack",
        'board': "fangBoard",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'dojo': {
        'name': "Dojo",
        'level': 6,
        'x': 0, 'y': 0,
        'coords': [-1,485,-353],
        'background': "cave",
        'unlocks': ["ruins"],
        'specialLoot': [],
        'skill': "enhanceWeapon",
        'board': "tripleTriangles",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'dungeon': {
        'name': "Dungeon",
        'level': 18,
        'x': 3, 'y': 4,
        'coords': [-519,301,-4],
        'background': "cave",
        'unlocks': ["ancientlibrary"],
        'specialLoot': ["simpleSaphireLoot"],
        'skill': "drainLife",
        'board': "helmBoard",
        'enemySkills': ["drainLife"],
        'monsters': ["gnome","gnomecromancer"],
        'events': [
            ["bat","bat","bat","bat"],
            ["spider","spider","spider","spider"],
            ["gnomeWizard","gnomecromancer"]
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
        'coords': [-58,-106,-588],
        'background': "field",
        'unlocks': ["fool2"],
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
        'coords': [0,-2,-600],
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
        'coords': [65,-114,-585],
        'background': "field",
        'unlocks': ["fool3"],
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
        'coords': [128,-5,-586],
        'background': "field",
        'unlocks': ["fool4"],
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
        'coords': [68,34,-595],
        'background': "field",
        'unlocks': ["fool5"],
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
        'coords': [-1,74,-595],
        'background': "field",
        'unlocks': ["fool6"],
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
        'coords': [-69,35,-595],
        'background': "field",
        'unlocks': ["fool7"],
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
        'coords': [-75,-44,-594],
        'background': "field",
        'unlocks': ["fool8"],
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
        'coords': [-3,-80,-595],
        'background': "field",
        'unlocks': ["fool9"],
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
        'coords': [74,-45,-594],
        'background': "field",
        'unlocks': ["fool10"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'foothills': {
        'name': "Foothills",
        'level': 14,
        'x': 0, 'y': 0,
        'coords': [464,364,-109],
        'background': "field",
        'unlocks': ["mountain"],
        'specialLoot': [],
        'skill': "overpower",
        'board': "crownBoard",
        'enemySkills': ["overpower"],
        'monsters': ["skeleton","butterfly"],
        'events': [
            ["dragon"]
        ]
    },
    'forbiddenarchive': {
        'name': "Forbidden Archive",
        'level': 42,
        'x': 0, 'y': 0,
        'coords': [-243,136,531],
        'background': "cave",
        'unlocks': ["master5","ziggurat","peak"],
        'specialLoot': [],
        'skill': "plague",
        'board': "pieBoard",
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
        'coords': [-92,-390,-447],
        'background': "forest",
        'unlocks': ["shrubbery","range","academy"],
        'specialLoot': [],
        'skill': "powerShot",
        'board': "tripleTriangles",
        'enemySkills': ["powerShot"],
        'monsters': ["gnome","butterfly"],
        'events': [
            ["butterfly","butterfly","motherfly"]
        ]
    },
    'fortress': {
        'name': "Fortress",
        'level': 16,
        'x': 0, 'y': 0,
        'coords': [133,581,-70],
        'background': "field",
        'unlocks': ["waterfall"],
        'specialLoot': [],
        'skill': "soulStrike",
        'board': "fangBoard",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'gallows': {
        'name': "Gallows",
        'level': 39,
        'x': 0, 'y': 0,
        'coords': [155,272,512],
        'background': "field",
        'unlocks': ["peak","wasteland"],
        'specialLoot': [],
        'skill': "reaper",
        'board': "pieBoard",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'garden': {
        'name': "Garden",
        'level': 3,
        'x': 14, 'y': 3,
        'coords': [350,-3,-487],
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
    'grandcathedral': {
        'name': "Grand Cathedral",
        'level': 33,
        'x': 0, 'y': 0,
        'coords': [-1,420,429],
        'background': "cave",
        'unlocks': ["gallows"],
        'specialLoot': [],
        'skill': "aegis",
        'board': "pieBoard",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'grove': {
        'name': "Grove",
        'level': 1,
        'x': 10, 'y': -2,
        'coords': [-2,-183,-571],
        'background': "forest",
        'unlocks': ["savannah","orchard","tunnel","village"],
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
        'coords': [473,-273,-249],
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
    'holyland': {
        'name': "Holy Land",
        'level': 30,
        'x': 0, 'y': 0,
        'coords': [-420,244,352],
        'background': "garden",
        'unlocks': ["tower"],
        'specialLoot': [],
        'skill': "revive",
        'board': "pieBoard",
        'enemySkills': [],
        'monsters': ["gnome","wolf","caterpillar","butterfly"],
        'events': [
            ["dragon"],
            ["dragon","giantSpider"],
            ["dragon","lightningBug"]
        ]
    },
    'juggler10': {
        'name': "juggler10",
        'level': 30,
        'x': 30, 'y': -14,
        'coords': [123,-463,362],
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
    'library': {
        'name': "Library",
        'level': 20,
        'x': 0, 'y': 0,
        'coords': [-507,-295,125],
        'background': "field",
        'unlocks': ["university"],
        'specialLoot': [],
        'skill': "dispell",
        'board': "fangBoard",
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
        'coords': [1,-183,571],
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
        'coords': [-51,91,591],
        'background': "field",
        'unlocks': ["master13"],
        'specialLoot': [],
        'skill': "abilityMastery",
        'board': "pieBoard",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'master11': {
        'name': "master11",
        'level': 55,
        'x': 0, 'y': 0,
        'coords': [-114,1,589],
        'background': "field",
        'unlocks': ["master13"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'master12': {
        'name': "master12",
        'level': 60,
        'x': 0, 'y': 0,
        'coords': [-48,-79,593],
        'background': "field",
        'unlocks': ["master13"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'master13': {
        'name': "master13",
        'level': 65,
        'x': 0, 'y': 0,
        'coords': [0,1,600],
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
    'master2': {
        'name': "master2",
        'level': 10,
        'x': 10, 'y': -8,
        'coords': [154,-87,573],
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
        'coords': [158,92,572],
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
        'coords': [-156,-90,572],
        'background': "field",
        'unlocks': ["master12"],
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
        'coords': [5,180,572],
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
        'coords': [-157,93,571],
        'background': "field",
        'unlocks': ["master11"],
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
        'coords': [42,-76,594],
        'background': "field",
        'unlocks': ["master13"],
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
        'coords': [91,-3,593],
        'background': "field",
        'unlocks': ["master13"],
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
        'coords': [46,84,592],
        'background': "field",
        'unlocks': ["master13"],
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
        'coords': [162,96,-570],
        'background': "field",
        'unlocks': ["garden","temple","trail","tunnel"],
        'specialLoot': ["simpleRubyLoot"],
        'skill': "vitality",
        'board': "tripleTriangles",
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
        'coords': [316,-462,-216],
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
    'memorial': {
        'name': "Memorial",
        'level': 16,
        'x': 0, 'y': 0,
        'coords': [-517,-298,-63],
        'background': "cemetery",
        'unlocks': ["library"],
        'specialLoot': [],
        'skill': "defenseSong",
        'board': "fangBoard",
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
        'coords': [229,-554,-30],
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
        'level': 18,
        'x': 17, 'y': 5,
        'coords': [521,298,4],
        'background': "field",
        'unlocks': ["oldbattlefield"],
        'specialLoot': ["simpleRubyLoot"],
        'skill': "dragonSlayer",
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
        'coords': [242,-51,546],
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
        'coords': [517,-298,65],
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
        'coords': [479,-274,237],
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
        'coords': [421,-236,356],
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
        'coords': [326,-189,467],
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
        'coords': [249,-141,527],
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
    'oldbattlefield': {
        'name': "Old Battlefield",
        'level': 24,
        'x': 0, 'y': 0,
        'coords': [453,344,191],
        'background': "cemetery",
        'unlocks': ["cliff"],
        'specialLoot': [],
        'skill': "ferocity",
        'board': "crownBoard",
        'enemySkills': ["ferocity"],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'orchard': {
        'name': "Orchard",
        'level': 3,
        'x': 12, 'y': -3,
        'coords': [71,-265,-534],
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
    'peak': {
        'name': "Peak",
        'level': 45,
        'x': 0, 'y': 0,
        'coords': [-87,268,530],
        'background': "field",
        'unlocks': ["master4"],
        'specialLoot': [],
        'skill': "enhanceAbility",
        'board': "pieBoard",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'range': {
        'name': "Range",
        'level': 6,
        'x': 10, 'y': -4,
        'coords': [-136,-457,-365],
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
        'coords': [-108,-331,489],
        'background': "field",
        'unlocks': ["sniper9","castle"],
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
        'coords': [-177,-573,-1],
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
        'level': 5,
        'x': 12, 'y': 3,
        'coords': [380,217,-411],
        'background': "field",
        'unlocks': ["desert"],
        'specialLoot': ["simpleRubyLoot"],
        'skill': "sideStep",
        'board': "tripleTriangles",
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
        'coords': [-133,554,-189],
        'background': "cemetery",
        'unlocks': ["fortress"],
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
        'coords': [-78,-270,-530],
        'background': "field",
        'unlocks': ["forestfloor"],
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
        'coords': [539,-192,-182],
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
        'coords': [104,-390,-444],
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
        'coords': [67,-237,547],
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
        'coords': [-1,-595,-80],
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
        'coords': [-2,-598,51],
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
        'coords': [1,-570,189],
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
        'coords': [-1,-506,323],
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
        'coords': [0,-421,428],
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
        'coords': [63,-319,504],
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
        'coords': [1,212,-561],
        'background': "cave",
        'unlocks': ["trail","traininggrounds","barracks"],
        'specialLoot': ["simpleSaphireLoot"],
        'skill': "protect",
        'board': "halfHexBoard",
        'enemySkills': ["heal"],
        'monsters': ["gnome","butterfly"],
        'events': [
            ["dragon"]
        ]
    },
    'tomb': {
        'name': "Tomb",
        'level': 14,
        'x': 0, 'y': 0,
        'coords': [-444,373,-154],
        'background': "cemetery",
        'unlocks': ["dungeon"],
        'specialLoot': [],
        'skill': "freeze",
        'board': "fangBoard",
        'enemySkills': ["freeze","majorIntelligence"],
        'monsters': ["skeleton"],
        'events': [
            ["frostGiant"]
        ]
    },
    'tower': {
        'name': "Tower",
        'level': 36,
        'x': 0, 'y': 0,
        'coords': [-305,177,485],
        'background': "cave",
        'unlocks': ["forbiddenarchive"],
        'specialLoot': [],
        'skill': "storm",
        'board': "pieBoard",
        'enemySkills': ["storm"],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'trail': {
        'name': "Trail",
        'level': 3,
        'x': 16, 'y': 3,
        'coords': [204,283,-488],
        'background': "field",
        'unlocks': ["road","barracks"],
        'specialLoot': ["simpleRubyLoot"],
        'skill': "charge",
        'board': "tripleTriangles",
        'enemySkills': ["ferocity"],
        'monsters': ["caterpillar","butterfly"],
        'events': [
            ["caterpillar","caterpillar"],
            ["motherfly"],
            ["caterpillar","caterpillar","caterpillar","caterpillar"],
            ["lightningBug","motherfly"]
        ]
    },
    'traininggrounds': {
        'name': "Training Grounds",
        'level': 3,
        'x': 0, 'y': 0,
        'coords': [-141,240,-532],
        'background': "cave",
        'unlocks': ["cemetery"],
        'specialLoot': [],
        'skill': "fireball",
        'board': "tripleTriangles",
        'enemySkills': ["fireball"],
        'monsters': ["gnome"],
        'events': [
            ["gnomeWizard"],
            ["gnomecromancer"],
            ["gnomecromancer","gnomeWizard"]
        ]
    },
    'tributaries': {
        'name': "Tributaries",
        'level': 4,
        'x': 20, 'y': -4,
        'coords': [377,-109,-454],
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
    'tundra': {
        'name': "Tundra",
        'level': 36,
        'x': 0, 'y': 0,
        'coords': [343,63,488],
        'background': "field",
        'unlocks': ["wasteland","ninja9"],
        'specialLoot': [],
        'skill': "armorBreak",
        'board': "crownBoard",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'tunnel': {
        'name': "Tunnel",
        'level': 2,
        'x': 14, 'y': 5,
        'coords': [183,-105,-561],
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
    'university': {
        'name': "University",
        'level': 27,
        'x': 0, 'y': 0,
        'coords': [-462,-262,278],
        'background': "field",
        'unlocks': ["carnival"],
        'specialLoot': [],
        'skill': "majorIntelligence",
        'board': "crownBoard",
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
    'village': {
        'name': "Village",
        'level': 2,
        'x': 0, 'y': 0,
        'coords': [-183,-103,-562],
        'background': "cave",
        'unlocks': ["bayou","savannah"],
        'specialLoot': [],
        'skill': "distract",
        'board': "tripleTriangles",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'wasteland': {
        'name': "Wasteland",
        'level': 42,
        'x': 0, 'y': 0,
        'coords': [230,133,538],
        'background': "field",
        'unlocks': ["master3"],
        'specialLoot': [],
        'skill': "armorPenetration",
        'board': "crownBoard",
        'enemySkills': ["armorPenetration"],
        'monsters': ["butcher","giantSkeleton"],
        'events': [
            ["frostGiant","motherfly"]
        ]
    },
    'waterfall': {
        'name': "Waterfall",
        'level': 20,
        'x': 0, 'y': 0,
        'coords': [-2,585,133],
        'background': "forest",
        'unlocks': ["grandcathedral"],
        'specialLoot': [],
        'skill': "enhanceArmor",
        'board': "fangBoard",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
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
    },
    'ziggurat': {
        'name': "Ziggurat",
        'level': 45,
        'x': 0, 'y': 0,
        'coords': [-256,-51,540],
        'background': "cave",
        'unlocks': ["master30"],
        'specialLoot': [],
        'skill': "meteor",
        'board': "crownBoard",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    }
};
