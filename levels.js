
var levels = {};
var abilitiesUsed = {};
function addLevel(levelData) {
    var key = ifdefor(levelData.key, levelData.name.replace(/\s*/g, '').toLowerCase());
    levels[key] = levelData;
    if (levelData.skill) {
        abilitiesUsed[levelData.skill.key] = true;
    }
}
function instantiateLevel(levelData, completed) {
    var waves = [];
    var level = levelData.level;
    var numberOfWaves = Math.floor(5 * Math.sqrt(level));
    // Make sure we have at least enough waves for the required events
    numberOfWaves = Math.max(levelData.events.length, numberOfWaves);
    var minWaveSize = Math.floor(Math.min(4, Math.sqrt(level)) * 10);
    var maxWaveSize = Math.floor(Math.min(10, 2.2 * Math.sqrt(level)) * 10);
    var eventsLeft = levelData.events.slice();
    while (waves.length < numberOfWaves) {
        var waveSize = Math.max(1, Math.floor(Random.range(minWaveSize, maxWaveSize) / 10));
        var wave = [];
        // The probability of including an event is the number of events over the number
        // of open waves left (ex)
        var wavesLeft = numberOfWaves - waves.length;
        // This will be 100% chance to include event wave once # events = # waves left
        var isBossWave = false;
        if (Math.random() < eventsLeft.length / wavesLeft) {
            wave = eventsLeft.shift();
            isBossWave = !eventsLeft.length;
        } else {
            // Don't add random mobs to boss waves.
            while (wave.length < waveSize) {
                wave.push(Random.element(levelData.monsters));
            }
        }

        waves.push(isBossWave ? bossWave(wave) : monsterWave(wave));
    };
    var loot = [];
    var pointsFactor = completed ? 1 : 4;
    // coins are granted at the end of each level, but diminished after the first completion.
    loot.push(coinsLoot([pointsFactor * level * level * 10, pointsFactor * level * level * 15]));
    // Special Loot drops are given only the first time an adventurer complets an area.
    if (!completed) {
        loot = levelData.specialLoot.concat(loot);
        waves.push(chestWave(firstChest(loot)));
    } else {
        waves.push(chestWave(backupChest(loot)));
    }

    return {
        'base': levelData,
        'level': level,
        'enemySkills': levelData.enemySkills,
        'waves': waves,
        'background': levelData.background
    };
}
function createEndlessLevel(key, level) {
    var tier = 1;
    if (level >= jewelTierLevels[5]) tier = 5
    else if (level >= jewelTierLevels[4]) tier = 4
    else if (level >= jewelTierLevels[3]) tier = 3
    else if (level >= jewelTierLevels[2]) tier = 2
    var componentBonus = (10 + tier) * (level - jewelTierLevels[tier]);
    var name, background, monsters, events;
    switch (key) {
        case 'eternalfields':
            name = 'Eternal Fields';
            background = backgrounds.field;
            components = [[80 + componentBonus, 100 + componentBonus], [5,20], [5, 20]];
            monsters = ['skeleton', 'caterpillar'];
            events = [['butcher'], ['dragon'], ['butcher', 'giantSkeleton', 'dragon']];
            break;
        case 'bottomlessdepths':
            name = 'Bottomless Depths';
            background = backgrounds.cave;
            components = [[5,20], [5, 20], [80 + componentBonus, 100 + componentBonus]];
            monsters = ['skeleton', 'gnome'];
            events = [['giantSkeleton'], ['butcher', 'butterfly', 'butterfly'], ['motherfly', 'gnomecromancer', 'gnomecromancer']];
            break;
        case 'oceanoftrees':
            name = 'Ocean of Trees';
            background = backgrounds.forest;
            components = [[5,20], [80 + componentBonus, 100 + componentBonus], [5, 20]];
            monsters = ['gnome', 'caterpillar'];
            events = [['motherfly'], ['dragon'], ['motherfly', 'dragon', 'motherfly']];
    }
    addLevel({'name': name, 'level': level, 'background': background, 'specialLoot': [jewelLoot(basicShapeTypes, [tier, tier], components, false)], 'next': [key + (level + 1)],
             'enemySkills': [], 'monsters': monsters, 'events': events, 'key' : key + level});
}
function initializeLevels() {
    // monsters are random monsters that can be added to any waves or present in random waves.
    // events are predefined sets of monsters that will appear in order throughout the level.
    // Initial levels
    addLevel({'name': 'Meadow', 'level': 1, 'background': backgrounds.field, 'specialLoot': [simpleRubyLoot],'next': ['cave', 'garden', 'road'],'skill': abilities.minorStrength,
             'board': {'fixed' : [{"k":"diamond","p":[134.75,120.47595264191645],"t":-120}],'spaces' : [{"k":"triangle","p":[104.75,120.47595264191645],"t":-60},{"k":"triangle","p":[134.75,120.47595264191645],"t":0}]},
             'enemySkills': [abilities.minorStrength],
             'monsters': ['caterpillar', 'skeleton'],
             'events': [['skeleton', 'caterpillar'], ['caterpillar', 'caterpillar'], ['skeleton', 'skeleton'], ['dragon']]});
    addLevel({'name': 'Cave', 'level': 1, 'background': backgrounds.cave, 'specialLoot': [simpleSaphireLoot], 'next': ['grove', 'cemetery', 'temple'],'skill': abilities.minorIntelligence,
             'board': { 'fixed' : [{"k":"triangle","p":[105,68],"t":60}],'spaces' : [{"k":"triangle","p":[75,68],"t":0},{"k":"triangle","p":[120,93.98076211353316],"t":120}] },
             'enemySkills': [abilities.minorIntelligence],
             'monsters': ['gnome', 'bat'],
             'events': [['bat', 'gnome'], ['bat', 'bat'], ['gnome', 'gnome'], ['giantSkeleton']]});
    addLevel({'name': 'Grove', 'level': 1, 'background': backgrounds.forest, 'specialLoot': [simpleEmeraldLoot], 'next': ['meadow', 'savannah', 'orchard'], 'skill': abilities.minorDexterity,
             'board': {'fixed' : [{"k":"diamond","p":[161,75],"t":0}],'spaces' : [{"k":"diamond","p":[131,75],"t":-60}]},
             'enemySkills': [abilities.minorDexterity],
             'monsters': ['caterpillar', 'gnome'],
             'events': [['caterpillar', 'gnome'], ['gnome', 'gnome'], ['caterpillar', 'caterpillar'], ['butterfly']]});
    // Level 1 Utility
    addLevel({'name': 'Cemetery', 'level': 1, 'background': backgrounds.cemetery, 'specialLoot': [simpleRubyLoot], 'next': ['crypt'], 'skill': abilities.raiseDead,
             'board': {'fixed' : [{"k":"diamond","p":[134.75,120.47595264191645],"t":-120}], 'spaces' : [{"k":"triangle","p":[104.75,120.47595264191645],"t":-60},{"k":"triangle","p":[134.75,120.47595264191645],"t":0}]},
             'monsters': ['bat'],
             'events': [['gnomecromancer', 'gnomecromancer'], ['skeleton', 'skeleton'], ['skeleton', 'skeleton'], ['gnomecromancer'], ['skeleton', 'skeleton', 'skeleton', 'skeleton'], ['gnomecromancer', 'gnomecromancer']]});
    addLevel({'name': 'Savannah', 'level': 1, 'background': backgrounds.field, 'specialLoot': [simpleRubyLoot], 'next': ['range'], 'skill': abilities.pet,
             'board': {'fixed' : [{"k":"diamond","p":[134.75,120.47595264191645],"t":-120}],'spaces' : [{"k":"triangle","p":[104.75,120.47595264191645],"t":-60},{"k":"triangle","p":[134.75,120.47595264191645],"t":0}]},
             'monsters': ['butterfly'],
             'events': [['caterpillar', 'caterpillar', 'caterpillar'], ['caterpillar', 'caterpillar', 'motherfly']]});
    addLevel({'name': 'Garden', 'level': 1, 'background': backgrounds.garden, 'specialLoot': [simpleEmeraldLoot], 'next': ['trail'], 'skill': abilities.fistMastery,
             'board': {'fixed' : [{"k":"diamond","p":[161,75],"t":0}],'spaces' : [{"k":"diamond","p":[131,75],"t":-60}]},
             'enemySkills': [abilities.ninja],
             'monsters': ['caterpillar', 'gnome', 'butterfly', 'skeleton'],
             'events': [['butterfly'], ['giantSkeleton'], ['dragon']]});
    // Level 2 Healing
    addLevel({'name': 'Temple', 'level': 2, 'background': backgrounds.cave, 'specialLoot': [simpleSaphireLoot], 'next': ['bayou'],
             'skill': abilities.heal, 'board': triforceBoard,
             'enemySkills': [abilities.heal],
             'monsters': ['gnome', 'butterfly'],
             'events': [['dragon']]});
    addLevel({'name': 'Orchard', 'level': 2, 'background': backgrounds.orchard, 'specialLoot': [simpleEmeraldLoot], 'next': ['crevice'],
             'skill': abilities.sap,'board': spikeBoard,
             'enemySkills': [abilities.sap, {'bonuses': {'+range': 2, '+attackSpeed': .5}}],
             'monsters': ['butterfly', 'gnome'],
             'events': [['butterfly', 'butterfly'], ['gnome', 'gnome'],  ['dragon']]});
    addLevel({'name': 'Road', 'level': 2, 'background': backgrounds.field, 'specialLoot': [simpleRubyLoot], 'next': ['tunnel'],
             'skill': abilities.vitality,'board': halfHexBoard,
             'enemySkills': [abilities.vitality],
             'monsters': ['skeleton'],
             'events': [['skeleton', 'undeadWarrior'], ['dragon'], ['skeleton', 'undeadWarrior', 'skeleton', 'undeadWarrior'], ['frostGiant']]});
    // Level 3 Offense
    addLevel({'name': 'Crypt', 'level': 3, 'background': backgrounds.cave, 'specialLoot': [simpleSaphireLoot],'next': ['dungeon'],
             'skill': abilities.resonance, 'board': triforceBoard,
             'enemySkills': [abilities.resonance],
             'monsters': ['gnome', 'butterfly'],
             'events': [['dragon'], ['gnomeWizard']]});
    addLevel({'name': 'Range', 'level': 3, 'background': backgrounds.forest, 'specialLoot': [simpleEmeraldLoot], 'next': ['valley'],
             'skill': abilities.finesse,'board': spikeBoard,
             'enemySkills': [abilities.finesse],
             'monsters': ['butterfly', 'gnome'],
             'events': [['butterfly', 'butterfly'], ['gnome', 'gnome'],  ['dragon']]});
    addLevel({'name': 'Trail', 'level': 3, 'background': backgrounds.field, 'specialLoot': [simpleRubyLoot],'next': ['mountain'],
             'skill': abilities.ferocity,'board': halfHexBoard,
             'enemySkills': [abilities.ferocity],
             'monsters': ['caterpillar', 'butterfly'],
             'events': [['caterpillar', 'caterpillar'], ['motherfly'], ['caterpillar', 'caterpillar', 'caterpillar', 'caterpillar'], ['lightningBug', 'motherfly']]});
    // Level 4 Utility
    addLevel({'name': 'Tunnel', 'level': 4, 'background': backgrounds.cave, 'specialLoot': [simpleSaphireLoot],'next': ['mountain'],
             'skill': abilities.hook,'board': thirdHexBoard,
             'enemySkills': [],
             'monsters': ['undeadWarrior', 'giantSkeleton'],
             'events': [['skeleton', 'undeadWarrior'], ['giantSkeleton', 'giantSkeleton'], ['undeadWarrior', 'undeadWarrior', 'dragon'], ['frostGiant', 'frostGiant']]});
    addLevel({'name': 'Crevice', 'level': 4, 'background': backgrounds.cave, 'specialLoot': [simpleSaphireLoot],'next': ['valley'],
             'skill': abilities.dodge,'board': fangBoard,
             'enemySkills': [abilities.dodge],
             'monsters': ['gnome', 'butterfly'],
             'events': [['dragon']]});
    addLevel({'name': 'Bayou', 'level': 4, 'background': backgrounds.forest, 'specialLoot': [simpleEmeraldLoot], 'next': ['dungeon'],
             'skill':  abilities.protect,'board': petalBoard,
             'enemySkills': [abilities.protect, abilities.majorIntelligence],
             'monsters': ['butterfly', 'bat'],
             'events': [['butterfly', 'butterfly'], ['bat', 'bat', 'bat', 'bat'],  ['lightningBug', 'lightningBug']]});
    // Level 5 Core Stat Boost
    addLevel({'name': 'Mountain', 'level': 5, 'background': backgrounds.field, 'specialLoot': [simpleRubyLoot],'next': ['eternalfields6'],
             'skill': abilities.majorStrength, 'board': pieBoard,
             'enemySkills': [abilities.majorStrength],
             'monsters': ['dragon', 'giantSkeleton'],
             'events': [['undeadWarrior', 'undeadWarrior'],['butcher'], ['undeadWarrior', 'undeadWarrior', 'dragon'], ['butcher', 'dragon', 'gnomeWizard']]});
    addLevel({'name': 'Dungeon', 'level': 5, 'background': backgrounds.cave, 'specialLoot': [simpleSaphireLoot],'next': ['bottomlessdepths6'],
             'skill': abilities.majorIntelligence, 'board': helmBoard,
             'enemySkills': [abilities.majorIntelligence],
             'monsters': ['gnome', 'gnomecromancer'],
             'events': [['frostGiant', 'lightningBug', 'dragon']]});
    addLevel({'name': 'Valley', 'level': 5, 'background': backgrounds.forest, 'specialLoot': [simpleEmeraldLoot], 'next': ['oceanoftrees6'],
             'skill':  abilities.majorDexterity, 'board': crownBoard,
             'enemySkills': [abilities.heal, abilities.protect, abilities.majorDexterity],
             'monsters': ['motherfly', 'gnomecromancer'],
             'events': [['motherfly', 'motherfly'], ['gnomecromancer', 'gnomecromancer'],  ['gnomecromancer', 'gnomeWizard', 'gnomecromancer']]});

    // Corsair levels
    addLevel({'name': 'Forest Floor', 'level': 2, 'background': backgrounds.forest, 'specialLoot': [simpleJewelLoot],
             'skill':  abilities.majorDexterity, 'board': crownBoard,
             'enemySkills': [abilities.heal, abilities.protect, abilities.majorDexterity],
             'monsters': ['motherfly', 'gnomecromancer'],
             'events': [['motherfly', 'motherfly'], ['gnomecromancer', 'gnomecromancer'],  ['gnomecromancer', 'gnomeWizard', 'gnomecromancer']]});
    addLevel({'name': 'Shrubbery', 'level': 4, 'background': backgrounds.forest, 'specialLoot': [simpleJewelLoot],
             'skill':  abilities.majorDexterity, 'board': crownBoard,
             'enemySkills': [abilities.heal, abilities.protect, abilities.majorDexterity],
             'monsters': ['motherfly', 'gnomecromancer'],
             'events': [['motherfly', 'motherfly'], ['gnomecromancer', 'gnomecromancer'],  ['gnomecromancer', 'gnomeWizard', 'gnomecromancer']]});
    addLevel({'name': 'Understorey', 'level': 16, 'background': backgrounds.forest, 'specialLoot': [simpleJewelLoot],
             'skill':  abilities.majorDexterity, 'board': crownBoard,
             'enemySkills': [abilities.heal, abilities.protect, abilities.majorDexterity],
             'monsters': ['motherfly', 'gnomecromancer'],
             'events': [['motherfly', 'motherfly'], ['gnomecromancer', 'gnomecromancer'],  ['gnomecromancer', 'gnomeWizard', 'gnomecromancer']]});
    addLevel({'name': 'Ravine', 'level': 33, 'background': backgrounds.forest, 'specialLoot': [simpleJewelLoot],
             'skill':  abilities.majorDexterity, 'board': crownBoard,
             'enemySkills': [abilities.heal, abilities.protect, abilities.majorDexterity],
             'monsters': ['motherfly', 'gnomecromancer'],
             'events': [['motherfly', 'motherfly'], ['gnomecromancer', 'gnomecromancer'],  ['gnomecromancer', 'gnomeWizard', 'gnomecromancer']]});
    addLevel({'name': 'Canopy', 'level': 21, 'background': backgrounds.forest, 'specialLoot': [simpleJewelLoot],
             'skill':  abilities.majorDexterity, 'board': crownBoard,
             'enemySkills': [abilities.heal, abilities.protect, abilities.majorDexterity],
             'monsters': ['motherfly', 'gnomecromancer'],
             'events': [['motherfly', 'motherfly'], ['gnomecromancer', 'gnomecromancer'],  ['gnomecromancer', 'gnomeWizard', 'gnomecromancer']]});
    addLevel({'name': 'Emergents', 'level': 29, 'background': backgrounds.forest, 'specialLoot': [simpleJewelLoot],
             'skill':  abilities.majorDexterity, 'board': crownBoard,
             'enemySkills': [abilities.heal, abilities.protect, abilities.majorDexterity],
             'monsters': ['motherfly', 'gnomecromancer'],
             'events': [['motherfly', 'motherfly'], ['gnomecromancer', 'gnomecromancer'],  ['gnomecromancer', 'gnomeWizard', 'gnomecromancer']]});
    addLevel({'name': 'Mossbed', 'level': 6, 'background': backgrounds.forest, 'specialLoot': [simpleJewelLoot],
             'skill':  abilities.majorDexterity, 'board': crownBoard,
             'enemySkills': [abilities.heal, abilities.protect, abilities.majorDexterity],
             'monsters': ['motherfly', 'gnomecromancer'],
             'events': [['motherfly', 'motherfly'], ['gnomecromancer', 'gnomecromancer'],  ['gnomecromancer', 'gnomeWizard', 'gnomecromancer']]});
    addLevel({'name': 'Riverbank', 'level': 8, 'background': backgrounds.forest, 'specialLoot': [simpleJewelLoot],
             'skill':  abilities.majorDexterity, 'board': crownBoard,
             'enemySkills': [abilities.heal, abilities.protect, abilities.majorDexterity],
             'monsters': ['motherfly', 'gnomecromancer'],
             'events': [['motherfly', 'motherfly'], ['gnomecromancer', 'gnomecromancer'],  ['gnomecromancer', 'gnomeWizard', 'gnomecromancer']]});
    addLevel({'name': 'Ruins', 'level': 12, 'background': backgrounds.forest, 'specialLoot': [simpleJewelLoot],
             'skill':  abilities.majorDexterity, 'board': crownBoard,
             'enemySkills': [abilities.heal, abilities.protect, abilities.majorDexterity],
             'monsters': ['motherfly', 'gnomecromancer'],
             'events': [['motherfly', 'motherfly'], ['gnomecromancer', 'gnomecromancer'],  ['gnomecromancer', 'gnomeWizard', 'gnomecromancer']]});
    addLevel({'name': 'Cliff', 'level': 25, 'background': backgrounds.forest, 'specialLoot': [simpleJewelLoot],
             'skill':  abilities.majorDexterity, 'board': crownBoard,
             'enemySkills': [abilities.heal, abilities.protect, abilities.majorDexterity],
             'monsters': ['motherfly', 'gnomecromancer'],
             'events': [['motherfly', 'motherfly'], ['gnomecromancer', 'gnomecromancer'],  ['gnomecromancer', 'gnomeWizard', 'gnomecromancer']]});


    var index = 0;
    $.each(abilities, function (key, ability) {
        if (!abilitiesUsed[key] && ability.name) {
            addLevel({'name': 'test-' + (index++), 'level': index, 'background': backgrounds.forest, 'specialLoot': [simpleJewelLoot], 'next': [],
                     'skill':  ability, 'board': { 'fixed' : [{"k":"triangle","p":[105,68],"t":60}], 'spaces' : [] },
                     'enemySkills': [ability],
                     'monsters': ['butterfly', 'skeleton', 'gnome', 'caterpillar', 'dragon'],
                     'events': [['motherfly'], ['giantSkeleton'], ['dragon'], ['gnomecromancer', 'gnomecromancer'], ['undeadWarrior', 'undeadWarrior'], ['lightningBug'], ['frostGiant'], ['gnomeWizard'], ['butcher']]});
        }
    });
}
function basicWave(monsters, objects, letter, extraBonuses) {
    return {
        'monsters': monsters,
        'objects': objects,
        'extraBonuses': ifdefor(extraBonuses, {}),
        'draw': function (context, completed, x, y) {
            if (!completed) drawLetter(context, letter, x, y);
        }
    };
}
function monsterWave(monsters) {
    return basicWave(monsters, [], 'M');
}
function bossWave(monsters) {
    return basicWave(monsters, [], 'B', bossMonsterBonuses);
}
function chestWave(chest) {
    var self =  basicWave([], [chest], 'T');
    self.draw = function (context, completed, x, y) {
        var source = (completed || chest.open) ? chest.openImage : chest.closedImage;
        context.drawImage(source.image, source.xOffset, 0, source.width, source.height,
                          x - 16, y - 18, 32, 32);
    }
    return self;
}
function drawLetter(context, letter, x, y) {
    context.fillStyle = 'black';
    context.font = "20px sans-serif";
    context.textAlign = 'center'
    context.fillText(letter, x, y + 7);
}