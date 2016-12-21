var map = {
    'academy': {
        'name': "Academy",
        'description': "",
        'level': 6,
        'x': 0, 'y': 0,
        'coords': [-443,-152,-375],
        'background': "cave",
        'unlocks': ["sage2"],
        'skill': "stopTime",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'ancientforest': {
        'name': "Ancient Forest",
        'description': "",
        'level': 8,
        'x': 27, 'y': -12,
        'coords': [86,-483,-345],
        'background': "forest",
        'unlocks': ["ancientforest","sniper2","understory"],
        'skill': "rangedAttackSpeed",
        'enemySkills': ["rangedDamage","rangedAccuracy","rangedAttackSpeed"],
        'monsters': ["caterpillar","spider","giantSpider","butterfly"],
        'events': [
            ["battlefly","motherfly"]
        ]
    },
    'ancientlibrary': {
        'name': "Ancient Library",
        'description': "",
        'level': 25,
        'x': 4, 'y': 2,
        'coords': [-553,86,216],
        'background': "cemetery",
        'unlocks': ["bard7"],
        'skill': "percentMagicDamage",
        'enemySkills': ["percentMagicDamage"],
        'monsters': ["gnome","butterfly"],
        'events': [
            ["dragon"],
            ["gnomeWizard"]
        ]
    },
    'assassin10': {
        'name': "assassin10",
        'description': "",
        'level': 39,
        'x': 39, 'y': -11,
        'coords': [300,-69,515],
        'background': "field",
        'unlocks': ["fool9"],
        'skill': "cripple",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'assassin5': {
        'name': "assassin5",
        'description': "",
        'level': 17,
        'x': 16, 'y': -11,
        'coords': [552,-234,-29],
        'background': "field",
        'unlocks': ["corsair7"],
        'skill': "cull",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'assassin6': {
        'name': "assassin6",
        'description': "",
        'level': 20,
        'x': 20, 'y': -11,
        'coords': [386,-455,66],
        'background': "field",
        'unlocks': ["ninja5","ninja6"],
        'skill': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'assassin7': {
        'name': "assassin7",
        'description': "",
        'level': 27,
        'x': 24, 'y': -11,
        'coords': [338,-423,258],
        'background': "field",
        'unlocks': ["ninja7","juggler10"],
        'skill': "criticalAccuracy",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'assassin9': {
        'name': "assassin9",
        'description': "",
        'level': 32,
        'x': 34, 'y': -11,
        'coords': [321,-287,418],
        'background': "field",
        'unlocks': ["corsair10"],
        'skill': "criticalDamage",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'bard2': {
        'name': "Bard 2",
        'description': "",
        'level': 5,
        'x': 0, 'y': 0,
        'coords': [-294,-363,-377],
        'background': "field",
        'unlocks': ["range"],
        'skill': "flatDuration",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'bard3': {
        'name': "Bard 3",
        'description': "",
        'level': 10,
        'x': 0, 'y': 0,
        'coords': [-541,-151,-212],
        'background': "field",
        'unlocks': ["sage3"],
        'skill': "minionToughness",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'bard6': {
        'name': "Bard 6",
        'description': "",
        'level': 22,
        'x': 0, 'y': 0,
        'coords': [-509,-292,125],
        'background': "field",
        'unlocks': ["charisma5","sage6"],
        'skill': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'bard7': {
        'name': "Bard 7",
        'description': "",
        'level': 27,
        'x': 0, 'y': 0,
        'coords': [-534,-70,264],
        'background': "field",
        'unlocks': ["sage7","holyland"],
        'skill': "minionFerocity",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'bard9': {
        'name': "Bard 9",
        'description': "",
        'level': 32,
        'x': 0, 'y': 0,
        'coords': [-427,-90,412],
        'background': "field",
        'unlocks': ["carnival"],
        'skill': "minionDamage",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'barracks': {
        'name': "Barracks",
        'description': "These Gnomes have practiced dark arts that allow them to consume the souls of fallen friends and foes alike.",
        'level': 3,
        'x': 0, 'y': 0,
        'coords': [103,330,-490],
        'background': "field",
        'unlocks': ["paladin2","barracks"],
        'skill': "consume",
        'enemySkills': [],
        'monsters': ["spider","gnome"],
        'events': [
            ["gnomecromancer"],
            ["vampireBat","vampireBat","gnomecromancer"],
            ["gnomecromancer","gnomecromancer"],
            ["necrognomekhan"]
        ]
    },
    'batcave': {
        'name': "Bat Cave",
        'description': "These bats will be tough opponents if your accuracy is too low.\n\nYou will need to visit the <span class=\"js-showCraftingPanel action\">Temple of Fortune</span> to make and equip stronger gear to complete harder areas.\n\nThe Distract ability gives 100% chance to dodge an attack every 10 seconds.",
        'level': 2,
        'x': 0, 'y': 0,
        'coords': [-189,-105,-560],
        'background': "cave",
        'unlocks': ["savannah","dancer2"],
        'skill': "distract",
        'enemySkills': ["sap","meleeDamage","enemyDancing","flatEvasion"],
        'monsters': ["bat"],
        'events': [
            ["vampireBat"]
        ]
    },
    'bayou': {
        'name': "Bayou",
        'description': "The howls from the Bayou keep all but the most adventurous at bay.",
        'level': 3,
        'x': 5, 'y': 4,
        'coords': [-337,-55,-494],
        'background': "forest",
        'unlocks': ["dancer2"],
        'skill': "attackSong",
        'enemySkills': [],
        'monsters': ["wolf"],
        'events': [
            ["wolf","alphaWolf"],
            ["wolf","wolf","wolf","alphaWolf"],
            ["wolf","wolf","packLeader"]
        ]
    },
    'camp': {
        'name': "Camp",
        'description': "",
        'level': 12,
        'x': 0, 'y': 0,
        'coords': [-366,-437,-188],
        'background': "forest",
        'unlocks': ["canopy","dancer6"],
        'skill': "charm",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'canopy': {
        'name': "Canopy",
        'description': "",
        'level': 14,
        'x': 14, 'y': -14,
        'coords': [-199,-548,-141],
        'background': "field",
        'unlocks': ["ranger5","dancer6","valley"],
        'skill': "throwingParadigmShift",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'carnival': {
        'name': "Carnival",
        'description': "",
        'level': 34,
        'x': 0, 'y': 0,
        'coords': [-314,-269,434],
        'background': "garden",
        'unlocks': ["ranger10","sage8"],
        'skill': "dervish",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'castle': {
        'name': "Castle",
        'description': "",
        'level': 39,
        'x': 0, 'y': 0,
        'coords': [-196,-220,523],
        'background': "cave",
        'unlocks': ["master7"],
        'skill': "heroSong",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'cave': {
        'name': "Cave",
        'description': "Magical gnomes are up to something in this cave.\n\nOnce you complete an area, you can click on the shrine to learn an ability and level up--if you have enough divinity.\n\nThe Heal spell will increase in power when you raise your intelligence and magic attack values.",
        'level': 1,
        'x': 8, 'y': 1,
        'coords': [-159,93,-571],
        'background': "cave",
        'unlocks': ["traininggrounds","gnometemple","batcave"],
        'skill': "heal",
        'enemySkills': ["minorIntelligence"],
        'monsters': ["gnome","bat"],
        'events': [
            ["gnome"],
            ["gnome","bat"],
            ["gnome","bat","bat"],
            ["giantSkeleton"]
        ]
    },
    'cemetery': {
        'name': "Cemetery",
        'description': "",
        'level': 4,
        'x': 6, 'y': 1,
        'coords': [-358,209,-434],
        'background': "cemetery",
        'unlocks': ["wizard2"],
        'skill': "raiseDead",
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
        'description': "",
        'level': 12,
        'x': 15, 'y': -9,
        'coords': [560,-96,-192],
        'background': "field",
        'unlocks': ["monk6","corsair6"],
        'skill': "deflect",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'charisma5': {
        'name': "Charisma5",
        'description': "",
        'level': 24,
        'x': 0, 'y': 0,
        'coords': [-375,-429,189],
        'background': "field",
        'unlocks': ["juggler9"],
        'skill': "percentAreaOfEffect",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'cliff': {
        'name': "Cliff",
        'description': "",
        'level': 30,
        'x': 0, 'y': -5,
        'coords': [295,379,359],
        'background': "field",
        'unlocks': ["darkknight9"],
        'skill': "dragonPunch",
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
        'description': "",
        'level': 11,
        'x': 0, 'y': 0,
        'coords': [-414,378,-214],
        'background': "cave",
        'unlocks': ["priest6"],
        'skill': "reflect",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'confluence': {
        'name': "Confluence",
        'description': "",
        'level': 13,
        'x': 12, 'y': -9,
        'coords': [344,-468,-149],
        'background': "field",
        'unlocks': ["shore","impenetrableforest"],
        'skill': "oneHandedDamage",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'corsair10': {
        'name': "corsair10",
        'description': "",
        'level': 34,
        'x': 33, 'y': -13,
        'coords': [386,-132,440],
        'background': "field",
        'unlocks': ["tundra","ninja8"],
        'skill': "plunder",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'corsair6': {
        'name': "corsair6",
        'description': "",
        'level': 16,
        'x': 16, 'y': -13,
        'coords': [585,-96,-94],
        'background': "field",
        'unlocks': ["assassin5","corsair7"],
        'skill': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'corsair7': {
        'name': "corsair7",
        'description': "",
        'level': 19,
        'x': 21, 'y': -13,
        'coords': [592,-88,34],
        'background': "field",
        'unlocks': ["warrior7","ninja5"],
        'skill': "axeAttackSpeed",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'corsair8': {
        'name': "corsair8",
        'description': "",
        'level': 24,
        'x': 25, 'y': -13,
        'coords': [560,-100,190],
        'background': "field",
        'unlocks': ["monk9"],
        'skill': "percentCriticalChance",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'corsair9': {
        'name': "corsair9",
        'description': "",
        'level': 31,
        'x': 29, 'y': -13,
        'coords': [454,-105,378],
        'background': "field",
        'unlocks': ["warrior9"],
        'skill': "axeCritDamage",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'crevice': {
        'name': "Crevice",
        'description': "",
        'level': 11,
        'x': 12, 'y': -5,
        'coords': [-98,-551,-216],
        'background': "cave",
        'unlocks': ["canopy","mossbed"],
        'skill': "dodge",
        'enemySkills': ["dodge"],
        'monsters': ["gnome","butterfly"],
        'events': [
            ["dragon"]
        ]
    },
    'dancer2': {
        'name': "Dancer 2",
        'description': "",
        'level': 4,
        'x': 0, 'y': 0,
        'coords': [-349,-217,-437],
        'background': "field",
        'unlocks': ["academy","bard2"],
        'skill': "minorCharisma",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'dancer3': {
        'name': "Dancer 3",
        'description': "",
        'level': 10,
        'x': 0, 'y': 0,
        'coords': [-477,-273,-241],
        'background': "field",
        'unlocks': ["camp"],
        'skill': "movementCDR",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'dancer6': {
        'name': "Dancer6",
        'description': "",
        'level': 16,
        'x': 0, 'y': 0,
        'coords': [-366,-468,-83],
        'background': "field",
        'unlocks': ["memorial","dancer7"],
        'skill': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'dancer7': {
        'name': "Dancer 7",
        'description': "",
        'level': 19,
        'x': 0, 'y': 0,
        'coords': [-362,-477,37],
        'background': "field",
        'unlocks': ["forestlair","bard6"],
        'skill': "movementPrecision",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'dancer9': {
        'name': "Dancer 9",
        'description': "",
        'level': 31,
        'x': 0, 'y': 0,
        'coords': [-282,-369,380],
        'background': "field",
        'unlocks': ["oldforest"],
        'skill': "movementDamage",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'darkknight2': {
        'name': "Dark Knight 2",
        'description': "",
        'level': 5,
        'x': 0, 'y': 0,
        'coords': [-165,412,-404],
        'background': "field",
        'unlocks': ["priest3"],
        'skill': "flatMagicBlock",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'darkknight3': {
        'name': "Dark Knight 3",
        'description': "",
        'level': 10,
        'x': 0, 'y': 0,
        'coords': [141,538,-226],
        'background': "field",
        'unlocks': ["enhancer3"],
        'skill': "polearmCritDamage",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'darkknight4': {
        'name': "Dark Knight 4",
        'description': "",
        'level': 15,
        'x': 0, 'y': 0,
        'coords': [99,583,-101],
        'background': "field",
        'unlocks': ["fortress"],
        'skill': "percentMagicBlock",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'darkknight6': {
        'name': "Dark Knight 6",
        'description': "",
        'level': 20,
        'x': 0, 'y': 0,
        'coords': [179,568,75],
        'background': "field",
        'unlocks': ["waterfall","enhancer6"],
        'skill': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'darkknight7': {
        'name': "Dark Knight 7",
        'description': "",
        'level': 27,
        'x': 0, 'y': 0,
        'coords': [174,506,272],
        'background': "field",
        'unlocks': ["enhancer7","cliff"],
        'skill': "polearmAccuracy",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'darkknight9': {
        'name': "Dark Knight 9",
        'description': "",
        'level': 32,
        'x': 0, 'y': 0,
        'coords': [104,421,414],
        'background': "field",
        'unlocks': ["grandcathedral"],
        'skill': "polearmRange",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'desert': {
        'name': "Desert",
        'description': "",
        'level': 11,
        'x': 0, 'y': 0,
        'coords': [533,179,-209],
        'background': "field",
        'unlocks': ["monk6"],
        'skill': "counterAttack",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'dojo': {
        'name': "Dojo",
        'description': "",
        'level': 6,
        'x': 0, 'y': 0,
        'coords': [82,445,-394],
        'background': "cave",
        'unlocks': ["enhancer2"],
        'skill': "enhanceWeapon",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'dungeon': {
        'name': "Dungeon",
        'description': "",
        'level': 18,
        'x': 3, 'y': 4,
        'coords': [-592,100,0],
        'background': "cave",
        'unlocks': ["library","wizard4"],
        'skill': "drainLife",
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
        'description': "",
        'level': 20,
        'x': 11, 'y': -10,
        'coords': [104,-587,67],
        'background': "forest",
        'unlocks': ["sniper6"],
        'skill': "percentEvasion",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'enhancer2': {
        'name': "Enhancer 2",
        'description': "",
        'level': 8,
        'x': 0, 'y': 0,
        'coords': [170,478,-321],
        'background': "field",
        'unlocks': ["paladin3","darkknight3"],
        'skill': "flatMagicPower",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'enhancer3': {
        'name': "Enhancer 3",
        'description': "",
        'level': 13,
        'x': 0, 'y': 0,
        'coords': [234,531,-153],
        'background': "field",
        'unlocks': ["darkknight4","warrior6"],
        'skill': "meleeAttackSpeed",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'enhancer4': {
        'name': "Enhancer 4",
        'description': "",
        'level': 24,
        'x': 0, 'y': 0,
        'coords': [-189,536,191],
        'background': "field",
        'unlocks': ["priest9"],
        'skill': "percentMagicPower",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'enhancer6': {
        'name': "Enhancer 6",
        'description': "",
        'level': 25,
        'x': 0, 'y': 0,
        'coords': [103,554,205],
        'background': "field",
        'unlocks': ["enhancer7","darkknight7"],
        'skill': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'enhancer7': {
        'name': "Enhancer 7",
        'description': "",
        'level': 29,
        'x': 0, 'y': 0,
        'coords': [-5,498,334],
        'background': "field",
        'unlocks': ["paladin9"],
        'skill': "meleeCritChance",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'enhancer8': {
        'name': "Enhancer 8",
        'description': "",
        'level': 36,
        'x': 0, 'y': 0,
        'coords': [-12,351,486],
        'background': "field",
        'unlocks': ["enhancer9","gallows"],
        'skill': "majorWill",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'enhancer9': {
        'name': "Enhancer 9",
        'description': "",
        'level': 39,
        'x': 0, 'y': 0,
        'coords': [64,256,539],
        'background': "field",
        'unlocks': ["master5"],
        'skill': "meleeDamage",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'floodplains': {
        'name': "Floodplains",
        'description': "",
        'level': 5,
        'x': 6, 'y': -13,
        'coords': [442,-70,-400],
        'background': "field",
        'unlocks': ["monastery"],
        'skill': "flatMovementSpeed",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'fool1': {
        'name': "fool1",
        'description': "",
        'level': 4,
        'x': 7, 'y': -7,
        'coords': [152,-367,-449],
        'background': "field",
        'unlocks': ["shrubbery"],
        'skill': "tomFoolery",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'fool10': {
        'name': "fool10",
        'description': "",
        'level': 50,
        'x': 55, 'y': -7,
        'coords': [-1,0,600],
        'background': "field",
        'unlocks': [],
        'skill': "mimic",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'fool3': {
        'name': "fool3",
        'description': "",
        'level': 13,
        'x': 21, 'y': -7,
        'coords': [464,354,-137],
        'background': "field",
        'unlocks': ["foothills"],
        'skill': "daggerDamage",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'fool5': {
        'name': "fool5",
        'description': "",
        'level': 24,
        'x': 35, 'y': -7,
        'coords': [-428,367,206],
        'background': "field",
        'unlocks': ["priest9","sorcerer7"],
        'skill': "decoy",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'fool6': {
        'name': "fool6",
        'description': "",
        'level': 24,
        'x': 42, 'y': -7,
        'coords': [-119,-554,197],
        'background': "field",
        'unlocks': ["juggler9","sniper7"],
        'skill': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'fool7': {
        'name': "fool7",
        'description': "",
        'level': 30,
        'x': 49, 'y': -7,
        'coords': [450,155,365],
        'background': "field",
        'unlocks': ["warrior9","ruinedfortress"],
        'skill': "daggerAttackSpeed",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'fool9': {
        'name': "fool9",
        'description': "",
        'level': 42,
        'x': 53, 'y': -7,
        'coords': [196,-34,566],
        'background': "field",
        'unlocks': ["ninja10"],
        'skill': "daggerCritChance",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'foothills': {
        'name': "Foothills",
        'description': "",
        'level': 16,
        'x': 0, 'y': 0,
        'coords': [518,296,-68],
        'background': "field",
        'unlocks': ["mountain","monk7"],
        'skill': "overpower",
        'enemySkills': ["overpower"],
        'monsters': ["skeleton","butterfly"],
        'events': [
            ["dragon"]
        ]
    },
    'forbiddenarchive': {
        'name': "Forbidden Archive",
        'description': "",
        'level': 41,
        'x': 0, 'y': 0,
        'coords': [-206,34,562],
        'background': "cave",
        'unlocks': ["ziggurat"],
        'skill': "plague",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'forestfloor': {
        'name': "Forest Floor",
        'description': "",
        'level': 4,
        'x': 5, 'y': -10,
        'coords': [3,-400,-447],
        'background': "forest",
        'unlocks': ["shrubbery"],
        'skill': "powerShot",
        'enemySkills': [],
        'monsters': ["caterpillar","spongeyCateripllar","butterfly"],
        'events': [
            ["battlefly"],
            ["spongeyCateripllar","battlefly"],
            ["spongeyCateripllar","battlefly","battlefly"],
            ["spongeyCateripllar","spongeyCateripllar","battlefly","battlefly"],
            ["skeletonOgre","battlefly"]
        ]
    },
    'forestlair': {
        'name': "Forest Lair",
        'description': "",
        'level': 21,
        'x': 9, 'y': -12,
        'coords': [-177,-567,84],
        'background': "forest",
        'unlocks': ["sniper6","fool6"],
        'skill': "rangedAccuracy",
        'enemySkills': ["rangedAccuracy"],
        'monsters': ["caterpillar","butterfly","gnome"],
        'events': [
            ["caterpillar","caterpillar","gnomeWizard"],
            ["caterpillar","caterpillar","dragon"]
        ]
    },
    'fortress': {
        'name': "Fortress",
        'description': "",
        'level': 17,
        'x': 0, 'y': 0,
        'coords': [-61,596,-29],
        'background': "field",
        'unlocks': ["paladin7"],
        'skill': "soulStrike",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'gallows': {
        'name': "Gallows",
        'description': "",
        'level': 39,
        'x': 0, 'y': 0,
        'coords': [-126,270,521],
        'background': "field",
        'unlocks': ["master5"],
        'skill': "reaper",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'garden': {
        'name': "Garden",
        'description': "",
        'level': 3,
        'x': 14, 'y': 3,
        'coords': [349,39,-486],
        'background': "garden",
        'unlocks': ["road"],
        'skill': "minorStrength",
        'enemySkills': ["minorStrength"],
        'monsters': ["caterpillar","skeletalBuccaneer","skeleton"],
        'events': [
            ["caterpillar","caterpillar","skeleton","skeleton"],
            ["skeletalBuccaneer","caterpillar","caterpillar"],
            ["caterpillar","caterpillar","skeletalBuccaneer"],
            ["caterpillar","skeletalBuccaneer","caterpillar","skeleton"],
            ["skeletalBuccaneer","skeletalBuccaneer","caterpillar","caterpillar"],
            ["caterpillar","skeletalBuccaneer"]
        ]
    },
    'gnometemple': {
        'name': "Gnome Temple",
        'description': "The Gnome Clerics specialize in defensive and healing magic. Try equipping a magic wand or staff to defeat them.\n\nYou will need to visit the <span class=\"js-showCraftingPanel action\">Temple of Fortune</span> to make and equip stronger gear to complete harder areas.\n\nThe Protect spell gives a powerful armor buff to spell casters but only while it lasts!",
        'level': 2,
        'x': 7, 'y': 3,
        'coords': [0,219,-559],
        'background': "cave",
        'unlocks': ["lostshrine","paladin2","master2"],
        'skill': "protect",
        'enemySkills': ["slowSpells","slowSpells"],
        'monsters': ["bat","gnome"],
        'events': [
            ["bat","bat","gnomeCleric"],
            ["skeleton","skeleton","gnomeCleric"],
            ["wolf","wolf","gnomeCleric"],
            ["gnomeCleric","gnomeCleric"]
        ]
    },
    'grandcathedral': {
        'name': "Grand Cathedral",
        'description': "",
        'level': 34,
        'x': 0, 'y': 0,
        'coords': [-115,391,440],
        'background': "cave",
        'unlocks': ["tower","enhancer8"],
        'skill': "aegis",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'grove': {
        'name': "Grove",
        'description': "These woods are full of magic resistant caterpillars and venomous spiders. Weak melee adventurers and magic users may have a tough time here.\n\nOnce you complete an area, you can click on the shrine to learn an ability and level up--if you have enough divinity.\n\nThe Sap ability can be powerful on adventurers with high attack speed.",
        'level': 1,
        'x': 10, 'y': -2,
        'coords': [-2,-183,-571],
        'background': "forest",
        'unlocks': ["orchard","batcave","shipgraveyard"],
        'skill': "sap",
        'enemySkills': ["minorDexterity"],
        'monsters': ["spider"],
        'events': [
            ["caterpillar","spider","spider"],
            ["spider","spider","spider"],
            ["caterpillar","caterpillar","spider"],
            ["butterfly"]
        ]
    },
    'headwaters': {
        'name': "Headwaters",
        'description': "",
        'level': 10,
        'x': 9, 'y': -9,
        'coords': [472,-277,-246],
        'background': "field",
        'unlocks': ["channel"],
        'skill': "axePhysicalDamage",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'holyland': {
        'name': "Holy Land",
        'description': "",
        'level': 30,
        'x': 0, 'y': 0,
        'coords': [-474,84,359],
        'background': "garden",
        'unlocks': ["bard9"],
        'skill': "revive",
        'enemySkills': [],
        'monsters': ["gnome","wolf","caterpillar","butterfly"],
        'events': [
            ["dragon"],
            ["dragon","giantSpider"],
            ["dragon","lightningBug"]
        ]
    },
    'impenetrableforest': {
        'name': "Impenetrable Forest",
        'description': "",
        'level': 15,
        'x': 31, 'y': -12,
        'coords': [237,-540,-112],
        'background': "forest",
        'unlocks': ["sniper5"],
        'skill': "rangedParadigmShift",
        'enemySkills': ["rangedAccuracy","rangedDamage","rangedAttackSpeed","rangedParadigmShift"],
        'monsters': ["spider","jumpingSpider","giantSpider","motherfly"],
        'events': [
            ["jumpingSpider","jumpingSpider","giantSpider"]
        ]
    },
    'juggler10': {
        'name': "juggler10",
        'description': "",
        'level': 30,
        'x': 30, 'y': -14,
        'coords': [180,-446,359],
        'background': "field",
        'unlocks': ["assassin9"],
        'skill': "bullseye",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'juggler9': {
        'name': "juggler9",
        'description': "",
        'level': 25,
        'x': 26, 'y': -14,
        'coords': [-200,-509,246],
        'background': "field",
        'unlocks': ["sniper7"],
        'skill': "throwingCriticalChance",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'jungle': {
        'name': "Jungle",
        'description': "",
        'level': 25,
        'x': 0, 'y': 0,
        'coords': [176,-537,202],
        'background': "field",
        'unlocks': ["assassin7"],
        'skill': "percentAttackSpeed",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'killingfields': {
        'name': "Killing Fields",
        'description': "",
        'level': 35,
        'x': 28, 'y': -10,
        'coords': [0,-395,452],
        'background': "field",
        'unlocks': ["sniper9"],
        'skill': "majorDexterity",
        'enemySkills': ["majorDexterity"],
        'monsters': ["skeleton","gnome"],
        'events': [
            ["giantSkeleton","giantSkeleton","gnome","gnome","battlefly"],
            ["giantSkeleton","butterfly"]
        ]
    },
    'levee': {
        'name': "Levee",
        'description': "",
        'level': 6,
        'x': 6, 'y': -9,
        'coords': [345,-294,-393],
        'background': "field",
        'unlocks': ["oceanside"],
        'skill': "smokeBomb",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'library': {
        'name': "Library",
        'description': "",
        'level': 20,
        'x': 0, 'y': 0,
        'coords': [-589,-90,67],
        'background': "field",
        'unlocks': ["bard6","sage6"],
        'skill': "dispell",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'lostshrine': {
        'name': "Lost Shrine",
        'description': "",
        'level': 3,
        'x': 0, 'y': 0,
        'coords': [-213,276,-488],
        'background': "cave",
        'unlocks': ["cemetery","master2"],
        'skill': "minorIntelligence",
        'enemySkills': ["minorIntelligence"],
        'monsters': ["gnome","bat"],
        'events': [
            ["gnome","bat","bat"],
            ["gnome","gnome","bat"],
            ["gnome","bat","bat"],
            ["gnome","gnome","bat"],
            ["vampireBat","gnomeCleric"]
        ]
    },
    'master1': {
        'name': "master1",
        'description': "",
        'level': 1,
        'x': 5, 'y': -8,
        'coords': [-1,-2,-600],
        'background': "field",
        'unlocks': [],
        'skill': "equipmentMastery",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'master2': {
        'name': "master2",
        'description': "",
        'level': 4,
        'x': 10, 'y': -8,
        'coords': [-87,330,-493],
        'background': "field",
        'unlocks': [],
        'skill': "healthPerLevel",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'master3': {
        'name': "master3",
        'description': "",
        'level': 38,
        'x': 15, 'y': -8,
        'coords': [-41,-299,519],
        'background': "field",
        'unlocks': ["sniper10"],
        'skill': "flatRange",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'master4': {
        'name': "master4",
        'description': "",
        'level': 38,
        'x': 20, 'y': -8,
        'coords': [255,115,530],
        'background': "field",
        'unlocks': ["wasteland"],
        'skill': "percentHealth",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'master5': {
        'name': "master5",
        'description': "",
        'level': 42,
        'x': 25, 'y': -8,
        'coords': [-74,200,561],
        'background': "field",
        'unlocks': ["peak"],
        'skill': "abilityMastery",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'master6': {
        'name': "master6",
        'description': "",
        'level': 38,
        'x': 30, 'y': -8,
        'coords': [-238,144,532],
        'background': "field",
        'unlocks': ["forbiddenarchive"],
        'skill': "percentAccuracy",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'master7': {
        'name': "master7",
        'description': "",
        'level': 42,
        'x': 35, 'y': -8,
        'coords': [-129,-168,561],
        'background': "field",
        'unlocks': ["ziggurat"],
        'skill': "cooldownReduction",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'meadow': {
        'name': "Meadow",
        'description': "A small dragon is attracting monsters to this peaceful meadow.\n\nOnce you complete an area, you can click on the shrine to learn an ability and level up--if you have enough divinity.\n\nThe Vitality ability gives adventurers more health regeneration based on their strength.",
        'level': 1,
        'x': 12, 'y': 1,
        'coords': [162,96,-570],
        'background': "field",
        'unlocks': ["trail","meadow","shipgraveyard","gnometemple"],
        'skill': "vitality",
        'enemySkills': ["minorStrength"],
        'monsters': ["skeleton"],
        'events': [
            ["skeleton"],
            ["skeleton","caterpillar"],
            ["caterpillar","skeleton"],
            ["dragon"]
        ]
    },
    'meander': {
        'name': "Meander",
        'description': "",
        'level': 10,
        'x': 10, 'y': -11,
        'coords': [395,-388,-231],
        'background': "field",
        'unlocks': ["confluence"],
        'skill': "criticalStrikes",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'memorial': {
        'name': "Memorial",
        'description': "",
        'level': 17,
        'x': 0, 'y': 0,
        'coords': [-495,-337,-31],
        'background': "cemetery",
        'unlocks': ["dancer7"],
        'skill': "defenseSong",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'monastery': {
        'name': "Monastery",
        'description': "",
        'level': 7,
        'x': 0, 'y': 0,
        'coords': [498,96,-320],
        'background': "garden",
        'unlocks': ["samurai2","desert"],
        'skill': "fistAttackSpeed",
        'enemySkills': ["vitality","hook"],
        'monsters': ["skeletalBuccaneer","caterpillar"],
        'events': [
            ["caterpillar","caterpillar","skeletalBuccaneer","skeletalBuccaneer","caterpillar"],
            ["caterpillar","caterpillar","caterpillar","skeletalBuccaneer","skeletalBuccaneer"],
            ["caterpillar","caterpillar","skeletalBuccaneer","skeletalBuccaneer","skeletalBuccaneer"],
            ["caterpillar","skeletalBuccaneer","caterpillar","skeletalBuccaneer","caterpillar","skeletalBuccaneer"],
            ["caterpillar","caterpillar","skeletalBuccaneer","skeletalBuccaneer"],
            ["caterpillar","caterpillar","caterpillar","skeletalBuccaneer","skeletalBuccaneer","skeletalBuccaneer"],
            ["caterpillar","skeletalBuccaneer","dragon"]
        ]
    },
    'monk6': {
        'name': "monk6 ",
        'description': "",
        'level': 14,
        'x': 0, 'y': 0,
        'coords': [576,83,-147],
        'background': "field",
        'unlocks': ["foothills","corsair6","monk7"],
        'skill': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'monk7': {
        'name': "Monk 7",
        'description': "",
        'level': 18,
        'x': 0, 'y': 0,
        'coords': [592,90,-34],
        'background': "field",
        'unlocks': ["corsair7","warrior7"],
        'skill': "fistCriticalChance",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'monk9': {
        'name': "Monk 9",
        'description': "",
        'level': 26,
        'x': 0, 'y': 0,
        'coords': [543,62,248],
        'background': "field",
        'unlocks': ["samurai7","fool7"],
        'skill': "fistDamage",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'mossbed': {
        'name': "Mossbed",
        'description': "",
        'level': 18,
        'x': 18, 'y': -14,
        'coords': [9,-580,-155],
        'background': "field",
        'unlocks': [],
        'skill': "acrobatics",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'mountain': {
        'name': "Mountain",
        'description': "",
        'level': 18,
        'x': 17, 'y': 5,
        'coords': [390,456,2],
        'background': "field",
        'unlocks': ["darkknight6","warrior4"],
        'skill': "dragonSlayer",
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
        'description': "",
        'level': 45,
        'x': 45, 'y': -9,
        'coords': [97,-55,590],
        'background': "field",
        'unlocks': ["fool10"],
        'skill': "shadowClone",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'ninja5': {
        'name': "ninja5",
        'description': "",
        'level': 22,
        'x': 20, 'y': -9,
        'coords': [510,-291,124],
        'background': "field",
        'unlocks': ["corsair8","ninja6"],
        'skill': "throwWeapon",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'ninja6': {
        'name': "ninja6",
        'description': "",
        'level': 25,
        'x': 25, 'y': -9,
        'coords': [437,-357,203],
        'background': "field",
        'unlocks': ["ninja7","assassin7"],
        'skill': "oneHandedParadigmShift",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'ninja7': {
        'name': "ninja7",
        'description': "",
        'level': 29,
        'x': 30, 'y': -9,
        'coords': [435,-255,326],
        'background': "field",
        'unlocks': ["corsair9"],
        'skill': "oneHandedCritChance",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'ninja8': {
        'name': "ninja8",
        'description': "",
        'level': 36,
        'x': 35, 'y': -9,
        'coords': [305,-178,485],
        'background': "field",
        'unlocks': ["ninja9","assassin10"],
        'skill': "majorVigor",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'ninja9': {
        'name': "ninja9",
        'description': "",
        'level': 39,
        'x': 40, 'y': -9,
        'coords': [199,-190,533],
        'background': "field",
        'unlocks': ["fool9"],
        'skill': "oneHandedCritDamage",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'oceanside': {
        'name': "Oceanside",
        'description': "",
        'level': 8,
        'x': 8, 'y': -13,
        'coords': [322,-392,-320],
        'background': "field",
        'unlocks': ["headwaters","meander"],
        'skill': "flatCriticalChance",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'oldbattlefield': {
        'name': "Old Battlefield",
        'description': "",
        'level': 25,
        'x': 0, 'y': 0,
        'coords': [345,438,222],
        'background': "cemetery",
        'unlocks': ["darkknight7"],
        'skill': "percentPhysicalDamage",
        'enemySkills': ["percentPhysicalDamage"],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'oldforest': {
        'name': "Old Forest",
        'description': "",
        'level': 33,
        'x': 19, 'y': -12,
        'coords': [-129,-411,418],
        'background': "field",
        'unlocks': ["killingfields"],
        'skill': "rangedDamage",
        'enemySkills': ["rangedDamage","rangedAccuracy"],
        'monsters': ["caterpillar","gnome","gnomecromancer","butterfly"],
        'events': [
            ["dragon","dragon"]
        ]
    },
    'orchard': {
        'name': "Orchard",
        'description': "",
        'level': 2,
        'x': 12, 'y': -3,
        'coords': [76,-268,-531],
        'background': "orchard",
        'unlocks': ["wetlands","forestfloor","savannah"],
        'skill': "minorDexterity",
        'enemySkills': ["sap","rangeAndAttackSpeed"],
        'monsters': ["butterfly","gnome"],
        'events': [
            ["butterfly","butterfly"],
            ["gnome","gnome"],
            ["dragon"]
        ]
    },
    'paladin2': {
        'name': "Paladin 2",
        'description': "",
        'level': 4,
        'x': 0, 'y': 0,
        'coords': [-3,393,-454],
        'background': "field",
        'unlocks': ["darkknight2","dojo"],
        'skill': "minorWill",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'paladin3': {
        'name': "Paladin 3",
        'description': "",
        'level': 10,
        'x': 0, 'y': 0,
        'coords': [5,551,-237],
        'background': "field",
        'unlocks': ["ruins"],
        'skill': "shieldDexterity",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'paladin6': {
        'name': "Paladin 6",
        'description': "",
        'level': 16,
        'x': 0, 'y': 0,
        'coords': [-237,545,-80],
        'background': "field",
        'unlocks': ["fortress","paladin7"],
        'skill': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'paladin7': {
        'name': "Paladin 7",
        'description': "",
        'level': 19,
        'x': 0, 'y': 0,
        'coords': [-239,549,42],
        'background': "field",
        'unlocks': ["wizard7","waterfall"],
        'skill': "shieldIntelligence",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'paladin9': {
        'name': "Paladin 9",
        'description': "",
        'level': 31,
        'x': 0, 'y': 0,
        'coords': [-172,438,372],
        'background': "field",
        'unlocks': ["wizard9"],
        'skill': "shieldStrength",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'peak': {
        'name': "Peak",
        'description': "",
        'level': 45,
        'x': 0, 'y': 0,
        'coords': [2,104,591],
        'background': "field",
        'unlocks': ["fool10"],
        'skill': "enhanceAbility",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'priest3': {
        'name': "Priest 3",
        'description': "",
        'level': 7,
        'x': 0, 'y': 0,
        'coords': [-308,366,-362],
        'background': "field",
        'unlocks': ["priest4","cloister"],
        'skill': "wandCritChance",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'priest4': {
        'name': "Priest 4",
        'description': "",
        'level': 9,
        'x': 0, 'y': 0,
        'coords': [-468,261,-270],
        'background': "field",
        'unlocks': ["sorcerer3","cloister"],
        'skill': "flatMagicDamage",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'priest6': {
        'name': "Priest 6",
        'description': "",
        'level': 14,
        'x': 0, 'y': 0,
        'coords': [-378,451,-119],
        'background': "field",
        'unlocks': ["tomb","paladin6","priest7"],
        'skill': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'priest7': {
        'name': "Priest 7",
        'description': "",
        'level': 18,
        'x': 0, 'y': 0,
        'coords': [-392,454,-13],
        'background': "field",
        'unlocks': ["paladin7","wizard7"],
        'skill': "wandAttackSpeed",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'priest9': {
        'name': "Priest 9",
        'description': "",
        'level': 26,
        'x': 0, 'y': 0,
        'coords': [-342,426,247],
        'background': "field",
        'unlocks': ["sorcerer7"],
        'skill': "wandRange",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'range': {
        'name': "Range",
        'description': "",
        'level': 7,
        'x': 10, 'y': -4,
        'coords': [-149,-483,-324],
        'background': "forest",
        'unlocks': ["sniper2","crevice"],
        'skill': "flatEvasion",
        'enemySkills': ["flatEvasion"],
        'monsters': ["butterfly","gnome"],
        'events': [
            ["butterfly","butterfly"],
            ["gnome","gnome"],
            ["dragon"]
        ]
    },
    'ranger10': {
        'name': "ranger10",
        'description': "",
        'level': 36,
        'x': 36, 'y': -12,
        'coords': [-116,-324,492],
        'background': "field",
        'unlocks': ["master3","castle"],
        'skill': "sicem",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'ranger5': {
        'name': "ranger5",
        'description': "",
        'level': 16,
        'x': 14, 'y': -12,
        'coords': [-5,-596,-71],
        'background': "field",
        'unlocks': ["valley","sniper5"],
        'skill': "net",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'road': {
        'name': "Road",
        'description': "",
        'level': 4,
        'x': 12, 'y': 3,
        'coords': [362,209,-430],
        'background': "field",
        'unlocks': ["warrior2"],
        'skill': "sideStep",
        'enemySkills': ["vitality","sideStep"],
        'monsters': ["skeletalBuccaneer","giantSkeleton","undeadPaladin"],
        'events': [
            ["undeadWarrior","skeletalBuccaneer"],
            ["dragon","undeadPaladin","undeadPaladin"],
            ["undeadWarrior","skeletalBuccaneer","undeadWarrior","skeletalBuccaneer"],
            ["frostGiant"]
        ]
    },
    'ruinedfortress': {
        'name': "Ruined Fortress",
        'description': "",
        'level': 35,
        'x': 0, 'y': 0,
        'coords': [334,191,460],
        'background': "cemetery",
        'unlocks': ["samurai9"],
        'skill': "majorStrength",
        'enemySkills': ["majorStrength"],
        'monsters': ["undeadWarrior","skeleton"],
        'events': [
            ["skeletonOgre"],
            ["butcher"],
            ["frostGiant"]
        ]
    },
    'ruins': {
        'name': "Ruins",
        'description': "",
        'level': 12,
        'x': -1, 'y': -3,
        'coords': [-191,536,-190],
        'background': "cemetery",
        'unlocks': ["priest6","paladin6"],
        'skill': "banishingStrike",
        'enemySkills': ["heal","protect"],
        'monsters': ["butterfly","gnomeWizard"],
        'events': [
            ["motherfly","motherfly"],
            ["gnomecromancer","gnomecromancer"],
            ["gnomecromancer","gnomeWizard","gnomecromancer"]
        ]
    },
    'sage2': {
        'name': "Sage 2",
        'description': "",
        'level': 8,
        'x': 0, 'y': 0,
        'coords': [-508,-79,-309],
        'background': "field",
        'unlocks': ["dancer3","bard3"],
        'skill': "flatAreaOfEffect",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'sage3': {
        'name': "Sage 3",
        'description': "",
        'level': 13,
        'x': 0, 'y': 0,
        'coords': [-580,-52,-146],
        'background': "field",
        'unlocks': ["sage4","wizard6"],
        'skill': "magicMagicDamage",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'sage4': {
        'name': "Sage 4",
        'description': "",
        'level': 15,
        'x': 0, 'y': 0,
        'coords': [-560,-189,-102],
        'background': "field",
        'unlocks': ["memorial"],
        'skill': "percentDuration",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'sage6': {
        'name': "Sage6",
        'description': "",
        'level': 25,
        'x': 0, 'y': 0,
        'coords': [-539,-180,193],
        'background': "field",
        'unlocks': ["bard7","sage7"],
        'skill': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'sage7': {
        'name': "Sage 7",
        'description': "",
        'level': 29,
        'x': 0, 'y': 0,
        'coords': [-441,-249,322],
        'background': "field",
        'unlocks': ["dancer9"],
        'skill': "magicAttackSpeed",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'sage8': {
        'name': "Sage 8 ",
        'description': "",
        'level': 36,
        'x': 0, 'y': 0,
        'coords': [-311,-169,484],
        'background': "field",
        'unlocks': ["castle","sage9"],
        'skill': "majorCharisma",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'sage9': {
        'name': "Sage 9 ",
        'description': "",
        'level': 39,
        'x': 0, 'y': 0,
        'coords': [-269,-70,532],
        'background': "field",
        'unlocks': ["master7"],
        'skill': "magicDamage",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'samurai2': {
        'name': "Samurai 2",
        'description': "",
        'level': 9,
        'x': 0, 'y': 0,
        'coords': [467,270,-263],
        'background': "field",
        'unlocks': ["samurai3","desert","fool3"],
        'skill': "flatMeleeAttackDamage",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'samurai3': {
        'name': "Samurai 3",
        'description': "",
        'level': 11,
        'x': 0, 'y': 0,
        'coords': [391,410,-196],
        'background': "field",
        'unlocks': ["enhancer3","fool3"],
        'skill': "greatswordPhysicalDamage",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'samurai6': {
        'name': "Samurai 6",
        'description': "",
        'level': 23,
        'x': 0, 'y': 0,
        'coords': [501,297,143],
        'background': "field",
        'unlocks': ["oldbattlefield"],
        'skill': "greatswordParadigmShift",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'samurai7': {
        'name': "Samurai 7",
        'description': "",
        'level': 28,
        'x': 0, 'y': 0,
        'coords': [453,257,299],
        'background': "field",
        'unlocks': ["cliff","fool7"],
        'skill': "greatswordAccuracy",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'samurai9': {
        'name': "Samurai 9",
        'description': "",
        'level': 37,
        'x': 0, 'y': 0,
        'coords': [192,253,509],
        'background': "field",
        'unlocks': ["enhancer9"],
        'skill': "greatswordDamage",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'savannah': {
        'name': "Savannah",
        'description': "A plague of insects is ravaging all the plant life in the Savannah. Track down and destroy the source of the plague.",
        'level': 3,
        'x': 8, 'y': -3,
        'coords': [-132,-320,-490],
        'background': "field",
        'unlocks': ["forestfloor","bard2"],
        'skill': "pet",
        'enemySkills': [],
        'monsters': ["butterfly"],
        'events': [
            ["caterpillar","caterpillar","caterpillar"],
            ["caterpillar","caterpillar","motherfly"]
        ]
    },
    'shipgraveyard': {
        'name': "Ship Graveyard",
        'description': "These skeletal pirates specialize in countering ranged attacks.\n\nYou will need to visit the <span class=\"js-showCraftingPanel action\">Temple of Fortune</span> to make and equip stronger gear to complete harder areas.\n\nThe Hook ability learned here may give melee adventurers the edge they need against ranged foes.",
        'level': 2,
        'x': 14, 'y': 5,
        'coords': [188,-110,-559],
        'background': "cemetery",
        'unlocks': ["garden","tributaries"],
        'skill': "hook",
        'enemySkills': [],
        'monsters': ["bat","spider"],
        'events': [
            ["skeletalBuccaneer"],
            ["spider","spider","skeletalBuccaneer"],
            ["skeletalBuccaneer","skeletalBuccaneer"],
            ["skeletonOgre"]
        ]
    },
    'shore': {
        'name': "Shore",
        'description': "",
        'level': 15,
        'x': 12, 'y': -13,
        'coords': [464,-368,-96],
        'background': "field",
        'unlocks': ["assassin5"],
        'skill': "percentMovementSpeed",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'shrubbery': {
        'name': "Shrubbery",
        'description': "",
        'level': 6,
        'x': 5, 'y': -14,
        'coords': [171,-426,-387],
        'background': "orchard",
        'unlocks': ["oceanside","ancientforest"],
        'skill': "throwingPower",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'sniper10': {
        'name': "sniper10",
        'description': "",
        'level': 41,
        'x': 42, 'y': -10,
        'coords': [62,-211,558],
        'background': "field",
        'unlocks': ["ninja10"],
        'skill': "snipe",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'sniper2': {
        'name': "sniper2",
        'description': "",
        'level': 9,
        'x': 8, 'y': -10,
        'coords': [1,-531,-279],
        'background': "field",
        'unlocks': ["understory","crevice"],
        'skill': "flatRangedAttackDamage",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'sniper5': {
        'name': "sniper5",
        'description': "",
        'level': 18,
        'x': 18, 'y': -10,
        'coords': [200,-566,-8],
        'background': "field",
        'unlocks': ["emergents","assassin6"],
        'skill': "aiming",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'sniper6': {
        'name': "sniper6",
        'description': "",
        'level': 23,
        'x': 23, 'y': -10,
        'coords': [-2,-579,156],
        'background': "field",
        'unlocks': ["jungle","fool6"],
        'skill': "bowParadigmShift",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'sniper7': {
        'name': "sniper7",
        'description': "",
        'level': 28,
        'x': 33, 'y': -10,
        'coords': [-4,-515,307],
        'background': "field",
        'unlocks': ["juggler10","oldforest"],
        'skill': "bowRange",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'sniper9': {
        'name': "sniper9",
        'description': "",
        'level': 37,
        'x': 38, 'y': -10,
        'coords': [131,-295,506],
        'background': "field",
        'unlocks': ["ninja9"],
        'skill': "bowDamage",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'sorcerer3': {
        'name': "Sorcerer 3",
        'description': "",
        'level': 11,
        'x': 0, 'y': 0,
        'coords': [-536,134,-234],
        'background': "field",
        'unlocks': ["sage3"],
        'skill': "spellCDR",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'sorcerer6': {
        'name': "Sorcerer 6",
        'description': "",
        'level': 23,
        'x': 0, 'y': 0,
        'coords': [-505,291,142],
        'background': "field",
        'unlocks': ["ancientlibrary","fool5"],
        'skill': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'sorcerer7': {
        'name': "Sorcerer 7",
        'description': "",
        'level': 28,
        'x': 0, 'y': 0,
        'coords': [-435,257,323],
        'background': "field",
        'unlocks': ["holyland","wizard9"],
        'skill': "spellPrecision",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'sorcerer9': {
        'name': "Sorcerer 9",
        'description': "",
        'level': 37,
        'x': 0, 'y': 0,
        'coords': [-322,52,503],
        'background': "field",
        'unlocks': ["sage9"],
        'skill': "spellPower",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'tomb': {
        'name': "Tomb",
        'description': "",
        'level': 16,
        'x': 0, 'y': 0,
        'coords': [-512,307,-58],
        'background': "cemetery",
        'unlocks': ["dungeon","tomb","priest7"],
        'skill': "freeze",
        'enemySkills': ["freeze","majorIntelligence"],
        'monsters': ["skeleton"],
        'events': [
            ["frostGiant"]
        ]
    },
    'tower': {
        'name': "Tower",
        'description': "",
        'level': 36,
        'x': 0, 'y': 0,
        'coords': [-227,261,490],
        'background': "cave",
        'unlocks': ["master6","gallows"],
        'skill': "storm",
        'enemySkills': ["storm"],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'trail': {
        'name': "Trail",
        'description': "A band of living skeletons has been making raids on travelers recently.",
        'level': 2,
        'x': 16, 'y': 3,
        'coords': [181,231,-523],
        'background': "field",
        'unlocks': ["barracks","road","garden"],
        'skill': "charge",
        'enemySkills': ["charge","chargeKnockback"],
        'monsters': ["skeleton"],
        'events': [
            ["skeleton","skeletalBuccaneer"],
            ["skeleton","skeleton","skeletalBuccaneer"],
            ["skeleton","skeletalBuccaneer","skeletalBuccaneer"],
            ["undeadPaladin"]
        ]
    },
    'traininggrounds': {
        'name': "Training Grounds",
        'description': "The Training Grounds is where Gnomes are taught basic elemental magic.",
        'level': 2,
        'x': 0, 'y': 0,
        'coords': [-264,66,-535],
        'background': "cave",
        'unlocks': ["bayou","cemetery","lostshrine"],
        'skill': "fireball",
        'enemySkills': [],
        'monsters': ["skeleton","gnomeWizard"],
        'events': [
            ["gnomeWizard","gnomeCleric"],
            ["gnomeWizard","gnomecromancer"],
            ["gnomeWizard","gnomeWizard"],
            ["frostGiant","gnomeWizard"]
        ]
    },
    'tributaries': {
        'name': "Tributaries",
        'description': "",
        'level': 4,
        'x': 20, 'y': -4,
        'coords': [336,-189,-459],
        'background': "field",
        'unlocks': ["floodplains","levee"],
        'skill': "minorVigor",
        'enemySkills': ["freeze"],
        'monsters': ["butterfly","motherfly"],
        'events': [
            ["frostGiant"]
        ]
    },
    'tundra': {
        'name': "Tundra",
        'description': "",
        'level': 36,
        'x': 0, 'y': 0,
        'coords': [342,53,490],
        'background': "field",
        'unlocks': ["master4","assassin10"],
        'skill': "armorBreak",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'understory': {
        'name': "Understory",
        'description': "",
        'level': 11,
        'x': 7, 'y': -14,
        'coords': [177,-531,-217],
        'background': "forest",
        'unlocks': ["confluence"],
        'skill': "bowPhysicalDamage",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'university': {
        'name': "University",
        'description': "",
        'level': 35,
        'x': 0, 'y': 0,
        'coords': [-330,189,464],
        'background': "field",
        'unlocks': ["sorcerer9"],
        'skill': "majorIntelligence",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'valley': {
        'name': "Valley",
        'description': "",
        'level': 18,
        'x': 10, 'y': -6,
        'coords': [-173,-574,-21],
        'background': "forest",
        'unlocks': ["dancer7"],
        'skill': "throwingDamage",
        'enemySkills': ["heal"],
        'monsters': ["spider","wolf"],
        'events': [
            ["motherfly","motherfly"],
            ["gnomecromancer","gnomecromancer"],
            ["gnomecromancer","gnomeWizard","gnomecromancer"]
        ]
    },
    'warrior2': {
        'name': "Warrior 2",
        'description': "",
        'level': 6,
        'x': 0, 'y': 0,
        'coords': [311,367,-359],
        'background': "field",
        'unlocks': ["enhancer2","warrior3"],
        'skill': "flatArmor",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'warrior3': {
        'name': "Warrior 3",
        'description': "",
        'level': 8,
        'x': 0, 'y': 0,
        'coords': [392,310,-332],
        'background': "field",
        'unlocks': ["samurai3","samurai2"],
        'skill': "swordAttackSpeed",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'warrior4': {
        'name': "Warrior 4",
        'description': "",
        'level': 20,
        'x': 0, 'y': 0,
        'coords': [455,385,73],
        'background': "field",
        'unlocks': ["samurai6"],
        'skill': "percentArmor",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'warrior6': {
        'name': "Warrior 6",
        'description': "",
        'level': 15,
        'x': 0, 'y': 0,
        'coords': [353,475,-99],
        'background': "field",
        'unlocks': ["mountain"],
        'skill': "swordParadigmShift",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'warrior7': {
        'name': "Warrior 7",
        'description': "",
        'level': 21,
        'x': 0, 'y': 0,
        'coords': [584,110,84],
        'background': "field",
        'unlocks': ["samurai6"],
        'skill': "swordAccuracy",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'warrior9': {
        'name': "Warrior 9",
        'description': "",
        'level': 33,
        'x': 0, 'y': 0,
        'coords': [414,84,426],
        'background': "field",
        'unlocks': ["ruinedfortress"],
        'skill': "swordPhysicalDamage",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'wasteland': {
        'name': "Wasteland",
        'description': "",
        'level': 41,
        'x': 0, 'y': 0,
        'coords': [128,161,564],
        'background': "field",
        'unlocks': ["peak"],
        'skill': "armorPenetration",
        'enemySkills': ["armorPenetration"],
        'monsters': ["butcher","giantSkeleton"],
        'events': [
            ["frostGiant","motherfly"]
        ]
    },
    'waterfall': {
        'name': "Waterfall",
        'description': "",
        'level': 22,
        'x': 0, 'y': 0,
        'coords': [4,585,131],
        'background': "forest",
        'unlocks': ["enhancer4","enhancer6"],
        'skill': "enhanceArmor",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'wetlands': {
        'name': "Wetlands",
        'description': "Dense webs have appeared in the Wetlands recently...",
        'level': 3,
        'x': 17, 'y': -4,
        'coords': [220,-265,-491],
        'background': "garden",
        'unlocks': ["tributaries","fool1"],
        'skill': "blinkStrike",
        'enemySkills': [],
        'monsters': ["spider","jumpingSpider"],
        'events': [
            ["jumpingSpider","stealthyCateripllar"],
            ["jumpingSpider","jumpingSpider","stealthyCateripllar"],
            ["jumpingSpider","jumpingSpider","stealthyCateripllar","stealthyCateripllar"],
            ["giantSpider"]
        ]
    },
    'wizard2': {
        'name': "Wizard 2",
        'description': "",
        'level': 6,
        'x': 0, 'y': 0,
        'coords': [-477,59,-359],
        'background': "field",
        'unlocks': ["sage2","wizard3"],
        'skill': "flatBlock",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'wizard3': {
        'name': "Wizard 3",
        'description': "",
        'level': 8,
        'x': 0, 'y': 0,
        'coords': [-485,168,-310],
        'background': "field",
        'unlocks': ["priest4","sorcerer3"],
        'skill': "staffDamage",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'wizard4': {
        'name': "Wizard 4",
        'description': "",
        'level': 20,
        'x': 0, 'y': 0,
        'coords': [-560,202,75],
        'background': "field",
        'unlocks': ["sorcerer6"],
        'skill': "percentBlocking",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'wizard6': {
        'name': "Wizard6",
        'description': "",
        'level': 15,
        'x': 0, 'y': 0,
        'coords': [-585,78,-107],
        'background': "field",
        'unlocks': ["dungeon"],
        'skill': null,
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'wizard7': {
        'name': "Wizard 7",
        'description': "",
        'level': 21,
        'x': 0, 'y': 0,
        'coords': [-398,438,99],
        'background': "field",
        'unlocks': ["sorcerer6","fool5"],
        'skill': "staffAccuracy",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'wizard9': {
        'name': "Wizard 9",
        'description': "",
        'level': 33,
        'x': 0, 'y': 0,
        'coords': [-302,311,415],
        'background': "field",
        'unlocks': ["university"],
        'skill': "staffCritDamage",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    },
    'ziggurat': {
        'name': "Ziggurat",
        'description': "",
        'level': 45,
        'x': 0, 'y': 0,
        'coords': [-90,-53,591],
        'background': "cave",
        'unlocks': ["fool10"],
        'skill': "meteor",
        'enemySkills': [],
        'monsters': ["skeleton"],
        'events': [
            ["dragon"]
        ]
    }
};
var mapKeys = Object.keys(map);
