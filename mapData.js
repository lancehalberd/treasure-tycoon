var map = {
    'bayou': {
        'name': "Bayou",
        'level': 4,
        'x': 5, 'y': 4,
        'background': "forest",
        'unlocks': ["dungeon"],
        'specialLoot': ["simpleEmeraldLoot"],
        'skill': "protect",
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
        'level': 21,
        'x': -5, 'y': -3,
        'background': "forest",
        'unlocks': ["emergents"],
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
    'cave': {
        'name': "Cave",
        'level': 1,
        'x': 8, 'y': 1,
        'background': "cave",
        'unlocks': ["cemetery","temple","meadow"],
        'specialLoot': ["simpleSaphireLoot"],
        'skill': "minorIntelligence",
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
        'level': 1,
        'x': 6, 'y': 1,
        'background': "cemetery",
        'unlocks': ["crypt"],
        'specialLoot': ["simpleRubyLoot"],
        'skill': "raiseDead",
        'board': "smallFangBoard",
        'enemySkills': undefined,
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
        'level': 1,
        'x': 20, 'y': 0,
        'background': "field",
        'unlocks': ["confluence"],
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
        'background': "field",
        'unlocks': ["emergents"],
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
        'level': 1,
        'x': 21, 'y': -2,
        'background': "field",
        'unlocks': ["tributaries"],
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
        'level': 4,
        'x': 12, 'y': -5,
        'background': "cave",
        'unlocks': ["valley"],
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
        'background': "cemetery",
        'unlocks': ["dungeon"],
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
        'level': 5,
        'x': 3, 'y': 4,
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
        'level': 29,
        'x': -3, 'y': -5,
        'background': "field",
        'unlocks': ["ravine"],
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
    'floodplain': {
        'name': "Floodplain",
        'level': 1,
        'x': 17, 'y': -2,
        'background': "field",
        'unlocks': ["meander"],
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
        'level': 2,
        'x': 5, 'y': -2,
        'background': "forest",
        'unlocks': ["shrubbery","mossbed","cave","grove"],
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
    'garden': {
        'name': "Garden",
        'level': 1,
        'x': 14, 'y': 3,
        'background': "garden",
        'unlocks': ["trail"],
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
        'background': "forest",
        'unlocks': ["savannah","orchard","cave"],
        'specialLoot': ["simpleEmeraldLoot"],
        'skill': "minorDexterity",
        'board': "doubleDiamonds",
        'enemySkills': ["minorDexterity"],
        'monsters': ["caterpillar", "spider"],
        'events': [
            ["caterpillar","spider"],
            ["spider","spider"],
            ["caterpillar","caterpillar"],
            ["butterfly"]
        ]
    },
    'headwaters': {
        'name': "Headwaters",
        'level': 1,
        'x': 23, 'y': -4,
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
    'levee': {
        'name': "Levee",
        'level': 1,
        'x': 17, 'y': 0,
        'background': "field",
        'unlocks': ["channel"],
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
        'background': "field",
        'unlocks': ["garden","road","grove"],
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
        'level': 1,
        'x': 19, 'y': -2,
        'background': "field",
        'unlocks': ["levee"],
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
        'level': 6,
        'x': 3, 'y': -1,
        'background': "field",
        'unlocks': ["riverbank"],
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
    'mountain': {
        'name': "Mountain",
        'level': 5,
        'x': 17, 'y': 5,
        'background': "field",
        'unlocks': [],
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
    'oceanside': {
        'name': "Oceanside",
        'level': 1,
        'x': 15, 'y': -4,
        'background': "field",
        'unlocks': ["wetlands","floodplain"],
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
        'level': 2,
        'x': 12, 'y': -3,
        'background': "orchard",
        'unlocks': ["crevice"],
        'specialLoot': ["simpleEmeraldLoot"],
        'skill': "sap",
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
        'level': 3,
        'x': 10, 'y': -4,
        'background': "forest",
        'unlocks': ["valley"],
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
    'ravine': {
        'name': "Ravine",
        'level': 33,
        'x': -1, 'y': -7,
        'background': "garden",
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
    'riverbank': {
        'name': "Riverbank",
        'level': 8,
        'x': 1, 'y': -1,
        'background': "field",
        'unlocks': ["ruins"],
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
    'road': {
        'name': "Road",
        'level': 2,
        'x': 12, 'y': 3,
        'background': "field",
        'unlocks': ["tunnel"],
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
        'background': "cemetery",
        'unlocks': ["canopy","cliff","understory"],
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
    'savannah': {
        'name': "Savannah",
        'level': 1,
        'x': 8, 'y': -3,
        'background': "field",
        'unlocks': ["range"],
        'specialLoot': ["simpleRubyLoot"],
        'skill': "pet",
        'board': "smallFangBoard",
        'enemySkills': undefined,
        'monsters': ["butterfly"],
        'events': [
            ["caterpillar","caterpillar","caterpillar"],
            ["caterpillar","caterpillar","motherfly"]
        ]
    },
    'shore': {
        'name': "Shore",
        'level': 1,
        'x': 15, 'y': -2,
        'background': "field",
        'unlocks': ["oceanside","meadow","grove"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'shrubbery': {
        'name': "Shrubbery",
        'level': 4,
        'x': 3, 'y': -3,
        'background': "field",
        'unlocks': ["ruins"],
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
    'temple': {
        'name': "Temple",
        'level': 2,
        'x': 7, 'y': 3,
        'background': "cave",
        'unlocks': ["bayou"],
        'specialLoot': ["simpleSaphireLoot"],
        'skill': "heal",
        'board': "triforceBoard",
        'enemySkills': ["heal"],
        'monsters': ["gnome","butterfly"],
        'events': [
            ["dragon"]
        ]
    },
    'trail': {
        'name': "Trail",
        'level': 3,
        'x': 16, 'y': 3,
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
        'level': 1,
        'x': 20, 'y': -4,
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
    'tunnel': {
        'name': "Tunnel",
        'level': 4,
        'x': 14, 'y': 5,
        'background': "cave",
        'unlocks': ["mountain"],
        'specialLoot': ["simpleSaphireLoot"],
        'skill': "hook",
        'board': "thirdHexBoard",
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
        'level': 16,
        'x': -3, 'y': -1,
        'background': "field",
        'unlocks': ["canopy"],
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
    'valley': {
        'name': "Valley",
        'level': 5,
        'x': 10, 'y': -6,
        'background': "forest",
        'unlocks': [],
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
        'level': 1,
        'x': 17, 'y': -4,
        'background': "field",
        'unlocks': ["meander"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    }
};
$.each(map, function (levelKey, levelData) {
    levelData.levelKey = levelKey;
});