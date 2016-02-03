
var levels = {};

function addLevel(levelData) {
    levels[levelData.name.replace(/\s*/g, '').toLowerCase()] = levelData;
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
        }
        while (wave.length < waveSize) {
            wave.push(Random.element(levelData.monsters));
        }
        waves.push(isBossWave ? bossWave(wave) : monsterWave(wave));
    };
    var loot = [];
    var pointsFactor = completed ? 1 : 4;
    // IP/MP/RP are granted at the end of each level
    loot.push(pointLoot('IP', [pointsFactor * level * level * 10, pointsFactor * level * level * 15]));
    if (level > 2) {
        loot.push(pointLoot('MP', [pointsFactor * (level - 2) * (level - 2) * 10,
                                    pointsFactor * (level - 2) * (level - 2) * 15]));
    }
    if (level > 4) {
        loot.push(pointLoot('RP', [pointsFactor * (level - 4) * (level - 4) * 10,
                                    pointsFactor * (level - 4) * (level - 4) * 15]));
    }
    // UP/AP/Special Loot are given only the first time an adventurer complets an area.
    if (!completed) {
        if (level > 6) {
            loot.push(pointLoot('UP', [pointsFactor * (level - 6) * (level - 6) * 5,
                                        pointsFactor * (level - 6) * (level - 6) * 10]));
        }
        loot.unshift(pointLoot('AP', [level, level]));
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
        'backgroundImage': levelData.backgroundImage
    };
}
function $levelDiv(key) {
    if (!levels[key]) {
        throw new Error('Level ' + key + ' not found');
    }
    var $levelButton = $tag('button', 'js-adventureButton adventureButton' , 'Lv' + levels[key].level + ' ' + levels[key].name).data('levelIndex', key);
    var $confirmButton = $tag('button','js-confirmSkill', 'Apply').attr('helptext', 'Finalize augmentation and level this character.').hide();
    var $cancelButton = $tag('button','js-cancelSkill', 'Abort').attr('helptext', 'Cancel augmentation.').hide();
    return $tag('div', 'js-adventure adventure js-area-' + key).data('levelIndex', key).append($levelButton).append($confirmButton).append($cancelButton);
}
function updateSkillButtons(character) {
    character.$panel.find('.js-learnSkill').each(function (index, element) {
        var areaKey = $(element).closest('.js-adventure').data('levelIndex');
        var level = levels[areaKey];
        var sections = [];
        if (character.adventurer.xpToLevel > character.adventurer.xp) {
            $(element).addClass('disabled');
            sections.push(character.adventurer.name + ' still needs ' + (character.adventurer.xpToLevel - character.adventurer.xp) + ' XP before learning a new skill.');
            sections.push('');
        } else {
            $(element).removeClass('disabled');
        }
        sections.push(abilityHelpText(level.skill));
        $(element).attr('helptext', sections.join('<br/>'));
    });
}
function $nextLevelButton(currentLevel) {
    var levelData = copy(currentLevel.base);
    var level = currentLevel.level + 1;
    var key = levelData.name.replace(/\s*/g, '').toLowerCase() + level;
    if (!levels[key]) {
        var tier = 1;
        if (level >= jewelTierLevels[5]) {
            tier = 5
        } else if (level >= jewelTierLevels[4]) {
            tier = 4
        } else if (level >= jewelTierLevels[3]) {
            tier = 3
        } else if (level >= jewelTierLevels[2]) {
            tier = 2
        }
        var componentBonus = (10 + tier) * (level - jewelTierLevels[tier]);
        if (levelData.name === 'Forest') {
            components = [[5,20], [80 + componentBonus, 100 + componentBonus], [5, 20]];
        } else if (levelData.name === 'Cave') {
            components = [[5,20], [5, 20], [80 + componentBonus, 100 + componentBonus]];
        } else {
            components = [[80 + componentBonus, 100 + componentBonus], [5,20], [5, 20]];
        }
        levelData.firstChest = firstChest([
                        jewelLoot(basicShapeTypes, [tier, tier], components, false),
                        pointLoot('AP', [level * level, level * level]),
                        pointLoot('IP', [50 * level, 55 * level + 50]),
                        pointLoot('MP', [Math.floor(10 * level), Math.floor(11 * level + 10)]),
                        pointLoot('RP', [5 * level, 5.5 * level])]);
        levelData.backupChest = backupChest([pointLoot('IP', [10 * level, 11 * level + 10]),
                                             pointLoot('MP', [Math.floor(2 * level), Math.floor(2.2 * level + 2)]),
                                             pointLoot('RP', [level, 1.1 * level])]);
        addLevel(levelData, currentLevel.level + 1);
    }
    return $levelDiv(key);
}
// 3 triangle boards
var triforceBoard = {
    'fixed' : [{"k":"triangle","p":[136,79],"t":0}], 'spaces' : [{"k":"triangle","p":[151,104.98076211353316],"t":-60},{"k":"triangle","p":[121,104.98076211353316],"t":-60},{"k":"triangle","p":[136,79],"t":-60}]
};
var halfHexBoard = {
    'fixed' : [{"k":"trapezoid","p":[383,172.96152422706632],"t":-180}], 'spaces': [{"k":"trapezoid","p":[353,121],"t":0}]
};
var spikeBoard = {
    'fixed': [{"k":"trapezoid","p":[295,236.96152422706632],"t":0}],
    'spaces': [{"k":"triangle","p":[295,236.96152422706632],"t":-60},{"k":"triangle","p":[280,262.9422863405995],"t":-120},{"k":"triangle","p":[340,262.9422863405995],"t":-120}]
};
// 4 triangle boards
var thirdHexBoard = {
    'fixed': [{"k":"diamond","p":[197.5048094716167,130.22114317029974],"t":-120}], 'spaces': [{"k":"diamond","p":[212.5048094716167,104.24038105676658],"t":-60},{"k":"diamond","p":[197.5048094716167,78.2596189432334],"t":0}]
}
var hourGlassBoard = {
    'fixed': [{"k":"diamond","p":[232.5,212.99038105676658],"t":-60}], 'spaces': [{"k":"triangle","p":[232.5,212.99038105676658],"t":60},{"k":"triangle","p":[262.5,212.99038105676658],"t":60},{"k":"triangle","p":[217.5,187.00961894323342],"t":0},{"k":"triangle","p":[247.5,187.00961894323342],"t":0}]
}
var fangBoard = {
    'fixed': [{"k":"triangle","p":[414.00000000000006,103.78729582162231],"t":-120}], 'spaces': [{"k":"diamond","p":[444.00000000000006,103.78729582162231],"t":-240},{"k":"diamond","p":[414.00000000000006,103.78729582162231],"t":-240}]
}
function initializeLevels() {
    closedChestSource = {'image': images['gfx/chest-closed.png'], 'xOffset': 0, 'width': 32, 'height': 32};
    openChestSource = {'image': images['gfx/chest-open.png'], 'xOffset': 0, 'width': 32, 'height': 32};
    // monsters are random monsters that can be added to any waves or present in random waves.
    // events are predefined sets of monsters that will appear in order throughout the level.
    // Initial levels
    addLevel({'name': 'Meadow', 'level': 1, 'backgroundImage': images['gfx/grass.png'], 'specialLoot': [simpleRubyLoot],'next': ['cave', 'garden', 'road'],'skill': {'name': 'Minor Strength', 'bonuses': {'+strength': 5}},
             'board': {'fixed' : [{"k":"diamond","p":[134.75,120.47595264191645],"t":-120}],'spaces' : [{"k":"triangle","p":[104.75,120.47595264191645],"t":-60},{"k":"triangle","p":[134.75,120.47595264191645],"t":0}]},
             'enemySkills': [{'bonuses': {'+strength': 5}}],
             'monsters': ['caterpillar', 'skeleton'],
             'events': [['skeleton', 'caterpillar'], ['caterpillar', 'caterpillar'], ['skeleton', 'skeleton'], ['dragon']]});
    addLevel({'name': 'Cave', 'level': 1, 'backgroundImage': images['gfx/cave.png'], 'specialLoot': [simpleSaphireLoot], 'next': ['grove', 'cemetery', 'temple'],'skill': {'name': 'Minor Intelligence', 'bonuses': {'+intelligence': 5}},
             'board': { 'fixed' : [{"k":"triangle","p":[105,68],"t":60}],'spaces' : [{"k":"triangle","p":[75,68],"t":0},{"k":"triangle","p":[120,93.98076211353316],"t":120}] },
             'enemySkills': [{'bonuses': {'+intelligence': 5}}],
             'monsters': ['gnome', 'skeleton'],
             'events': [['skeleton', 'gnome'], ['skeleton', 'skeleton'], ['gnome', 'gnome'], ['giantSkeleton']]});
    addLevel({'name': 'Grove', 'level': 1, 'backgroundImage': images['gfx/forest.png'], 'specialLoot': [simpleEmeraldLoot], 'next': ['meadow', 'savannah', 'orchard'],'skill': {'name': 'Minor Dexterity', 'bonuses': {'+dexterity': 5}},
             'board': {'fixed' : [{"k":"diamond","p":[161,75],"t":0}],'spaces' : [{"k":"diamond","p":[131,75],"t":-60}]},
             'enemySkills': [{'bonuses': {'+dexterity': 5}}],
             'monsters': ['caterpillar', 'gnome'],
             'events': [['caterpillar', 'gnome'], ['gnome', 'gnome'], ['caterpillar', 'caterpillar'], ['butterfly']]});
    // Level 1 Utility
    addLevel({'name': 'Cemetery', 'level': 1, 'backgroundImage': images['gfx/grass.png'], 'specialLoot': [simpleRubyLoot], 'next': ['crypt'], 'skill': abilities['raiseDead'],
             'board': {'fixed' : [{"k":"diamond","p":[134.75,120.47595264191645],"t":-120}], 'spaces' : [{"k":"triangle","p":[104.75,120.47595264191645],"t":-60},{"k":"triangle","p":[134.75,120.47595264191645],"t":0}]},
             'monsters': ['skeleton'],
             'events': [['skeleton', 'skeleton'], ['gnomecromancer'], ['skeleton', 'skeleton', 'skeleton', 'skeleton'], ['gnomecromancer', 'gnomecromancer']]});
    addLevel({'name': 'Savannah', 'level': 1, 'backgroundImage': images['gfx/grass.png'], 'specialLoot': [simpleRubyLoot], 'next': ['range'], 'skill': abilities['pet'],
             'board': {'fixed' : [{"k":"diamond","p":[134.75,120.47595264191645],"t":-120}],'spaces' : [{"k":"triangle","p":[104.75,120.47595264191645],"t":-60},{"k":"triangle","p":[134.75,120.47595264191645],"t":0}]},
             'monsters': ['butterfly'],
             'events': [['caterpillar', 'caterpillar', 'caterpillar'], ['caterpillar', 'caterpillar', 'motherfly']]});
    addLevel({'name': 'Garden', 'level': 1, 'backgroundImage': images['gfx/forest.png'], 'specialLoot': [simpleEmeraldLoot], 'next': ['trail'], 'skill': abilities['stealth'],
             'board': {'fixed' : [{"k":"diamond","p":[161,75],"t":0}],'spaces' : [{"k":"diamond","p":[131,75],"t":-60}]},
             'enemySkills': [abilities['stealth']],
             'monsters': ['caterpillar', 'gnome', 'butterfly', 'skeleton'],
             'events': [['butterfly'], ['giantSkeleton'], ['dragon']]});
    // Level 2 Healing
    addLevel({'name': 'Temple', 'level': 2, 'backgroundImage': images['gfx/cave.png'], 'specialLoot': [simpleSaphireLoot], 'next': ['bayou'],
             'skill': abilities['heal'], 'board': triforceBoard,
             'enemySkills': [abilities['heal']],
             'monsters': ['gnome', 'butterfly'],
             'events': [['dragon']]});
    addLevel({'name': 'Orchard', 'level': 2, 'backgroundImage': images['gfx/forest.png'], 'specialLoot': [simpleEmeraldLoot], 'next': ['crevice'],
             'skill': abilities['sap'],'board': spikeBoard,
             'enemySkills': [abilities['sap'], {'bonuses': {'+range': 2, '+attackSpeed': .5}}],
             'monsters': ['butterfly', 'gnome'],
             'events': [['butterfly', 'butterfly'], ['gnome', 'gnome'],  ['dragon']]});
    addLevel({'name': 'Road', 'level': 2, 'backgroundImage': images['gfx/grass.png'], 'specialLoot': [simpleRubyLoot], 'next': ['tunnel'],
             'skill': abilities['vitality'],'board': halfHexBoard,
             'enemySkills': [abilities['vitality']],
             'monsters': ['skeleton'],
             'events': [['skeleton', 'skeleton'], ['gnomecromancer'], ['skeleton', 'skeleton', 'skeleton', 'skeleton'], ['gnomecromancer', 'gnomecromancer']]});
    // Level 3 Offense
    addLevel({'name': 'Crypt', 'level': 3, 'backgroundImage': images['gfx/cave.png'], 'specialLoot': [simpleSaphireLoot],'next': [],
             'skill': {'name': 'Resonance', 'bonuses': {'%magicDamage': .2}}, 'board': triforceBoard,
             'enemySkills': [{'name': 'Resonance', 'bonuses': {'%magicDamage': .2}}],
             'monsters': ['gnome', 'butterfly'],
             'events': [['dragon']]});
    addLevel({'name': 'Range', 'level': 3, 'backgroundImage': images['gfx/forest.png'], 'specialLoot': [simpleEmeraldLoot], 'next': [],
             'skill':  {'name': 'Finesse', 'bonuses': {'%attackSpeed': .2}},'board': spikeBoard,
             'enemySkills': [{'name': 'Finesse', 'bonuses': {'%attackSpeed': .2}}],
             'monsters': ['butterfly', 'gnome'],
             'events': [['butterfly', 'butterfly'], ['gnome', 'gnome'],  ['dragon']]});
    addLevel({'name': 'Trail', 'level': 3, 'backgroundImage': images['gfx/grass.png'], 'specialLoot': [simpleRubyLoot],'next': [],
             'skill':  {'name': 'Ferocity', 'bonuses': {'%damage': .2}},'board': halfHexBoard,
             'enemySkills': [{'name': 'Ferocity', 'bonuses': {'%damage': .2}}],
             'monsters': ['skeleton'],
             'events': [['skeleton', 'skeleton'], ['gnomecromancer'], ['skeleton', 'skeleton', 'skeleton', 'skeleton'], ['gnomecromancer', 'gnomecromancer']]});
    // Level 4 Utility
    addLevel({'name': 'Tunnel', 'level': 4, 'backgroundImage': images['gfx/cave.png'], 'specialLoot': [simpleSaphireLoot],'next': [],
             'skill': abilities['hook'],'board': thirdHexBoard,
             'enemySkills': [],
             'monsters': ['dragon', 'skeleton'],
             'events': [['skeleton', 'skeleton'],['butcher'], ['skeleton', 'skeleton', 'dragon'], ['butcher', 'dragon']]});
    addLevel({'name': 'Crevice', 'level': 4, 'backgroundImage': images['gfx/cave.png'], 'specialLoot': [simpleSaphireLoot],'next': [],
             'skill': abilities['dodge'],'board': fangBoard,
             'enemySkills': [abilities['dodge']],
             'monsters': ['gnome', 'butterfly'],
             'events': [['dragon']]});
    addLevel({'name': 'Bayou', 'level': 4, 'backgroundImage': images['gfx/forest.png'], 'specialLoot': [simpleEmeraldLoot], 'next': [],
             'skill':  abilities['protect'],'board': hourGlassBoard,
             'enemySkills': [abilities['sap'], {'bonuses': {'+range': 2, '+attackSpeed': .5}}],
             'monsters': ['butterfly', 'gnome'],
             'events': [['butterfly', 'butterfly'], ['gnome', 'gnome'],  ['dragon']]});

    /*addLevel({'name': 'Forest', 'backgroundImage': images['gfx/forest.png'],
             'monsters': ['caterpillar', 'gnome'],
             'events': [['gnome', 'gnome'], ['caterpillar', 'caterpillar'], ['butterfly']],
             'firstChest': firstChest([simpleEmeraldLoot, pointLoot('AP', [1, 1]), pointLoot('IP', [40, 50])]),
             'backupChest': backupChest([pointLoot('IP', [10, 20])])
             }, 1);
    addLevel({'name': 'Cave', 'backgroundImage': images['gfx/cave.png'],
             'monsters': ['gnome', 'skeleton'],
             'events': [['skeleton', 'skeleton'], ['gnome', 'gnome'], ['giantSkeleton']],
             'firstChest': firstChest([simpleSaphireLoot, pointLoot('AP', [1, 1]), pointLoot('IP', [40, 50])]),
             'backupChest': backupChest([pointLoot('IP', [10, 20])])
             }, 1);
    addLevel({'name': 'Field', 'backgroundImage': images['gfx/grass.png'],
             'monsters': ['caterpillar', 'skeleton'],
             'events': [['caterpillar', 'caterpillar'], ['skeleton', 'skeleton'], ['dragon']],
             'firstChest': firstChest([simpleRubyLoot, pointLoot('AP', [1, 1]), pointLoot('IP', [40, 50])]),
             'backupChest': backupChest([pointLoot('IP', [10, 20])])
             }, 1);*/
}
function basicWave(monsters, objects, letter) {
    return {
        'monsters': monsters,
        'objects': objects,
        'draw': function (context, completed, x, y) {
            if (!completed) drawLetter(context, letter, x, y);
        }
    };
}
function monsterWave(monsters) {
    return basicWave(monsters, [], 'M');
}
function bossWave(monsters) {
    return basicWave(monsters, [], 'B');
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