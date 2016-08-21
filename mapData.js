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
    'corsair1': {
        'name': "corsair1",
        'level': 2,
        'x': 2, 'y': -13,
        'background': "field",
        'unlocks': ["ranger1","juggler2"],
        'specialLoot': [],
        'skill': "hook",
        'board': "tripleTriangles",
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
        'background': "field",
        'unlocks': ["ranger10"],
        'specialLoot': [],
        'skill': "plunder",
        'board': "tripleTriangles",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'corsair2': {
        'name': "corsair2",
        'level': 4,
        'x': 4, 'y': -13,
        'background': "field",
        'unlocks': ["ranger2","juggler3"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'corsair3': {
        'name': "corsair3",
        'level': 6,
        'x': 6, 'y': -13,
        'background': "field",
        'unlocks': ["juggler4"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'corsair4': {
        'name': "corsair4",
        'level': 8,
        'x': 8, 'y': -13,
        'background': "field",
        'unlocks': ["ranger3","juggler5"],
        'specialLoot': [],
        'skill': null,
        'board': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'corsair5': {
        'name': "corsair5",
        'level': 12,
        'x': 12, 'y': -13,
        'background': "field",
        'unlocks': ["juggler6","ranger5"],
        'specialLoot': [],
        'skill': "deflect",
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
        'background': "field",
        'unlocks': ["juggler7","ranger6"],
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
        'background': "field",
        'unlocks': ["juggler8","ranger7"],
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
        'level': 25,
        'x': 25, 'y': -13,
        'background': "field",
        'unlocks': ["juggler9","ranger8"],
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
        'background': "field",
        'unlocks': ["juggler10","ranger9"],
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
    'juggler1': {
        'name': "juggler1",
        'level': 1,
        'x': 1, 'y': -14,
        'background': "field",
        'unlocks': ["corsair1"],
        'specialLoot': [],
        'skill': "sap",
        'board': "tripleTriangles",
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
        'background': "field",
        'unlocks': ["corsair10"],
        'specialLoot': [],
        'skill': "bullseye",
        'board': "tripleTriangles",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'juggler2': {
        'name': "juggler2",
        'level': 3,
        'x': 3, 'y': -14,
        'background': "field",
        'unlocks': ["corsair2"],
        'specialLoot': [],
        'skill': "throwingPower",
        'board': "tripleTriangles",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'juggler3': {
        'name': "juggler3",
        'level': 5,
        'x': 5, 'y': -14,
        'background': "field",
        'unlocks': ["corsair3"],
        'specialLoot': [],
        'skill': "evasion",
        'board': "tripleTriangles",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'juggler4': {
        'name': "juggler4",
        'level': 7,
        'x': 7, 'y': -14,
        'background': "field",
        'unlocks': ["corsair4"],
        'specialLoot': [],
        'skill': "throwingMastery",
        'board': "tripleTriangles",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'juggler5': {
        'name': "juggler5",
        'level': 10,
        'x': 10, 'y': -14,
        'background': "field",
        'unlocks': ["corsair5"],
        'specialLoot': [],
        'skill': "dodge",
        'board': "tripleTriangles",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'juggler6': {
        'name': "juggler6",
        'level': 14,
        'x': 14, 'y': -14,
        'background': "field",
        'unlocks': ["corsair6"],
        'specialLoot': [],
        'skill': "throwingPrecision",
        'board': "tripleTriangles",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'juggler7': {
        'name': "juggler7",
        'level': 18,
        'x': 18, 'y': -14,
        'background': "field",
        'unlocks': ["ranger6"],
        'specialLoot': [],
        'skill': "acrobatics",
        'board': "tripleTriangles",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'juggler8': {
        'name': "juggler8",
        'level': 22,
        'x': 22, 'y': -14,
        'background': "field",
        'unlocks': ["corsair8"],
        'specialLoot': [],
        'skill': "majorDexterity",
        'board': "tripleTriangles",
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
        'background': "field",
        'unlocks': ["corsair9"],
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
    'ranger1': {
        'name': "ranger1",
        'level': 3,
        'x': 3, 'y': -12,
        'background': "field",
        'unlocks': ["corsair2"],
        'specialLoot': [],
        'skill': "pet",
        'board': "tripleTriangles",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'ranger10': {
        'name': "ranger10",
        'level': 36,
        'x': 36, 'y': -12,
        'background': "field",
        'unlocks': [],
        'specialLoot': [],
        'skill': "sicem",
        'board': "tripleTriangles",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'ranger2': {
        'name': "ranger2",
        'level': 6,
        'x': 6, 'y': -12,
        'background': "field",
        'unlocks': ["corsair4"],
        'specialLoot': [],
        'skill': null,
        'board': null,
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
        'background': "field",
        'unlocks': ["corsair5"],
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
        'background': "field",
        'unlocks': ["corsair6"],
        'specialLoot': [],
        'skill': "net",
        'board': "tripleTriangles",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'ranger6': {
        'name': "ranger6",
        'level': 19,
        'x': 19, 'y': -12,
        'background': "field",
        'unlocks': ["corsair7"],
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
    'ranger8': {
        'name': "ranger8",
        'level': 27,
        'x': 27, 'y': -12,
        'background': "field",
        'unlocks': ["corsair9"],
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
        'x': 32, 'y': -12,
        'background': "field",
        'unlocks': ["corsair10"],
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
