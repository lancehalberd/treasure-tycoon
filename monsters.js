
var enchantedMonsterBonuses = {'bonuses': {'*maxHealth': 1.5, '*tenacity': 2, '*weaponDamage': 1.5, '*coins': 2, '*anima': 3,
                                    '$tint': '#af0', '$tintMinAlpha': 0.2, '$tintMaxAlpha': 0.5, '$lifeBarColor': '#af0'}};
var imbuedMonsterBonuses = {'bonuses': {'*maxHealth': 2, '*tenacity': 4, '*weaponDamage': 2, '*coins': 6, '*anima': 10,
                                    '$tint': '#c6f', '$tintMinAlpha': 0.2, '$tintMaxAlpha': 0.5, '$lifeBarColor': '#c6f'}};


var easyBonuses = {'bonuses': {'*maxHealth': .8, '*strength': .8, '*dexterity': .8, '*intelligence': .8, '*speed': .8,
                                '*weaponDamage': .8, '*attackSpeed': .8, '*armor': .8, '*evasion': .8, '*block': .8, '*magicBlock': .8,
                                '*coins': .8, '*anima': .8}};
var hardBonuses = {'bonuses': {'*maxHealth': 1.3, '*strength': 1.3, '*dexterity': 1.3, '*intelligence': 1.3, '*speed': 1.3,
                                '*weaponDamage': 1.3, '*attackSpeed': 1.3, '*armor': 1.3, '*evasion': 1.3, '*block': 1.3, '*magicBlock': 1.3,
                                '*coins': 1.5, '*anima': 1.5}};
// To make bosses intimidating, give them lots of health and damage, but to keep them from being overwhelming,
// scale down their health regen, attack speed and critical multiplier.
var bossMonsterBonuses = {'bonuses': {'*maxHealth': [2.5, '+', ['{level}', '/', 2]], '*tenacity': 5, '*weaponDamage': 2, '*attackSpeed': .75, '*critDamage': .5, '*critChance': .5, '*evasion': .5,
                            '*healthRegen': [1, '/', [1.5, '+', ['{level}', '/', 2]]], '+coins': 2, '*coins': 4, '+anima': 1, '*anima': 4,
                            '$uncontrollable': 'Cannot be controlled.', '$tint': 'red', '$tintMinAlpha': 0.2, '$tintMaxAlpha': 0.5}};
var monsterPrefixes = [
    [
        {'name': 'Hawkeye', 'bonuses': {'+accuracy': [5, 10]}},
        {'name': 'Giant', 'bonuses': {'*maxHealth': 2, '*scale': 1.3}}
    ],
    [
        {'name': 'Eldritch', 'bonuses': {'+weaponMagicDamage': [1, 2], '*weaponMagicDamage': [2, 3]}}
    ],
    [
        {'name': 'Telekenetic', 'bonuses': {'+range': [3, 5]}}
    ],
    [
        {'name': 'Frenzied', 'bonuses': {'*speed': [15, 20, 10], '*attackSpeed': [15, 20, 10]}}
    ],
    [
        {'name': 'Lethal', 'bonuses': {'+critChance': [10, 20, 100], '+critDamage': [20, 50, 100], '+critAccuracy': [20, 50, 100]}}
    ]
];
var monsterSuffixes = [
    [
        {'name': 'Frost', 'bonuses': {'+slowOnHit': [1, 2, 10]}},
        {'name': 'Confusion', 'bonuses': {'+damageOnMiss': [2, 3]}}
    ],
    [
        {'name': 'Healing', 'bonuses': {'+healthRegen': [1, 2]}}
    ],
    [
        {'name': 'Shadows', 'bonuses': {'+evasion': [3, 5]}}
    ],
    [
        {'name': 'Stealth', 'bonuses': {'$cloaking': true}}
    ]
];

function makeMonster(monsterData, level, extraSkills, specifiedRarity) {
    var monster = {
        level,
        'slow': 0,
        'equipment': {},
        'attackCooldown': 0,
        'prefixes': [],
        'suffixes': [],
        'extraSkills': ifdefor(extraSkills, []),
        'aggroRadius': 600,
        percentHealth: 1,
        percentTargetHealth: 1,
        helpMethod: actorHelpText
    };
    var baseMonster;
    if (typeof(monsterData) == 'string') {
        baseMonster = monsters[monsterData];
        if (!baseMonster) {
            throw new Error('Invalid monster key ' + monsterData);
        }
    } else if (typeof(monsterData) == 'object') {
        baseMonster = monsters[monsterData.key];
        if (monsterData.bonuses) {
            monster.extraSkills.push({'bonuses': monsterData.bonuses});
        }
    }
    if (!baseMonster) {
        console.log(baseMonster);
        console.log(monsterData);
        throw new Error('could not determine base monster type');
    }
    monster.base = baseMonster;
    monster.source = baseMonster.source;
    monster.stationary = ifdefor(baseMonster.stationary);
    monster.noBasicAttack = ifdefor(baseMonster.noBasicAttack);
    monster.baseY = monster.y = ifdefor(monster.source.y, 0);

    var rarity = (ifdefor(specifiedRarity) !== null) // Note (null >= 0) is true...
        ? specifiedRarity
        : ((Math.random() < .25) ? (Math.random() * (level - 1) * .6) : 0);
    if (rarity < 1) {

    } else if (rarity < 3) {
        if (Math.random() > .5) addMonsterPrefix(monster);
        else addMonsterSuffix(monster);
    } else if (rarity < 10) {
        addMonsterPrefix(monster);
        addMonsterSuffix(monster);
    } else if (rarity < 20) {
        addMonsterPrefix(monster);
        addMonsterSuffix(monster);
        if (Math.random() > .5) addMonsterPrefix(monster);
        else addMonsterSuffix(monster);
    } else {
        addMonsterPrefix(monster);
        addMonsterSuffix(monster);
        addMonsterPrefix(monster);
        addMonsterSuffix(monster);
    }
    monster.allEffects = [];
    monster.minionBonusSources = [];
    updateMonster(monster);
    return monster;
}
function addMonsterPrefix(monster) {
    var alreadyUsed = [];
    monster.prefixes.forEach(function (affix) {alreadyUsed.push(affix.base);});
    monster.prefixes.push(makeAffix(Random.element(matchingMonsterAffixes(monsterPrefixes, monster, alreadyUsed))));
}
function addMonsterSuffix(monster) {
    var alreadyUsed = [];
    monster.suffixes.forEach(function (affix) {alreadyUsed.push(affix.base);});
    monster.suffixes.push(makeAffix(Random.element(matchingMonsterAffixes(monsterSuffixes, monster, alreadyUsed))));
}
function matchingMonsterAffixes(list, monster, alreadyUsed) {
    var choices = [];
    for (var level = 0; level < monster.level && level < list.length; level++) {
        list[level].forEach(function (affix) {
            if (alreadyUsed.indexOf(affix) < 0) {
                choices.push(affix);
            }
        });
    }
    return choices;
}
function updateMonster(monster) {
    // Clear the character's bonuses and graphics.
    initializeVariableObject(monster, monster.base, monster);
    monster.actions = [];
    monster.reactions = [];
    monster.onHitEffects = [];
    monster.onCritEffects = [];
    monster.onMissEffects = [];
    monster.tags = recomputActorTags(monster);
    addBonusSourceToObject(monster, {'bonuses': monster.base.implicitBonuses}, false);
    addBonusSourceToObject(monster, {'bonuses': getMonsterBonuses(monster)}, false);
    addBonusSourceToObject(monster, coreStatBonusSource, false);
    var enchantments = monster.prefixes.length + monster.suffixes.length;
    if (monster.base.source.image.normal) monster.image = monster.base.source.image.normal;
    else monster.image = monster.base.source.image;
    if (enchantments > 2) {
        addBonusSourceToObject(monster, imbuedMonsterBonuses, false);
    } else if (enchantments) {
        addBonusSourceToObject(monster, enchantedMonsterBonuses, false);
    }
    ifdefor(monster.extraSkills, []).concat(ifdefor(monster.base.abilities, [])).forEach(function (ability) {
        addBonusSourceToObject(monster, ability, false);
        addActions(monster, ability);
    });
    monster.prefixes.forEach(function (affix) {
        addBonusSourceToObject(monster, affix, false);
        addActions(monster, affix);
    });
    monster.suffixes.forEach(function (affix) {
        addBonusSourceToObject(monster, affix, false);
        addActions(monster, affix);
    });
    monster.name = monster.base.name;
    // Add the character's current equipment to bonuses and graphics
    equipmentSlots.forEach(function (type) {
        var equipment = ifdefor(monster.equipment[type]);
        if (!equipment) {
            return;
        }
        addBonusSourceToObject(monster, equipment.base, false);
        addActions(monster, equipment.base);
        equipment.prefixes.forEach(function (affix) {
            addBonusSourceToObject(monster, affix, false);
            addActions(monster, affix);
        })
        equipment.suffixes.forEach(function (affix) {
            addBonusSourceToObject(monster, affix, false);
            addActions(monster, affix);
        })
    });
    if (!monster.noBasicAttack) addActions(monster, abilities.basicAttack);
    recomputeDirtyStats(monster);
    //console.log(monster);
}
var monsters = {};
function addMonster(key, data, parent) {
    data.key = key;
    data.variableObjectType = 'actor';

    if (parent) {
        for (var property in parent) {
            console.log(`inheriting ${property} from parent`);
            switch (property) {
                case 'abilities':
                    data.abilities = parent.abilities.concat(data.abilities || []);
                    break;
                case 'implicitBonuses':
                    data.implicitBonuses = $.extend(parent.implicitBonuses, data.implicitBonuses || {});
                    break;
                default:
                    data[property] = ifdefor(data[property], parent[property]);
            }
        }
        console.log(data);
    }
    monsters[key] = data;
}
function getMonsterBonuses(monster) {
    var growth = monster.level - 1;
    var levelCoefficient = Math.pow(1.07, monster.level);
    return {
        // Health scales linearly to level 10, then 10% a level.
        '+maxHealth': (10 + 25 * growth),
        '+tenacity': 1 + growth / 100,
        '+levelCoefficient': levelCoefficient,
        '+range': 1,
        '+minWeaponPhysicalDamage': Math.round(.9 * (5 + 5 * growth)) * levelCoefficient,
        '+maxWeaponPhysicalDamage': Math.round(1.1 * (5 + 5 * growth)) * levelCoefficient,
        '+minWeaponMagicDamage': Math.round(.9 * (1 + 1.5 * growth)) * levelCoefficient,
        '+maxWeaponMagicDamage': Math.round(1.1 * (1 + 1.5 * growth)) * levelCoefficient,
        '+critChance': .05,
        '+critDamage': .5,
        '+critAccuracy': 1,
        '+attackSpeed': 1 + .02 * growth,
        '+speed': 100 + growth,
        '+accuracy': 4 + 5 * growth,
        '+evasion': 1 + growth,
        '+block': 1.5 * growth,
        '+magicBlock': .75 * growth,
        '+armor': 1.5 * growth,
        '+magicResist': .001 * growth,
        '+strength': 5 * growth,
        '+intelligence': 5 * growth,
        '+dexterity': 5 * growth,
        '*magicPower': .5,
        '+coins': Random.range(1, Math.floor((growth + 1) * Math.pow(1.15, growth + 1) * 4)),
        '+anima': Random.range(1, Math.floor((growth + 1) * Math.pow(1.15, growth + 1)))
    };
}
function setupActorSource(source) {
    if (!source.walkFrames) {
        source.walkFrames = [];
        for (var i = 0; i < source.frames; i++) source.walkFrames[i] = i;
    }
    source.attackPreparationFrames = ifdefor(source.attackPreparationFrames, source.walkFrames);
    // If attack recovery frames aren't specified, just play the prep frames backwards.
    source.attackRecoveryFrames = ifdefor(source.attackRecoveryFrames, source.attackPreparationFrames.slice().reverse());
    return setupSource(source);
}
function createEquippedActorSource(baseImage, row, equipment) {
    var actorCanvas = createCanvas(personFrames * 96, 64);
    var actorContext = actorCanvas.getContext('2d');
    //return baseImage;
    var hideHair = true;
    //var hairYOffset = actor.hairOffset;
    for (var frame = 0; frame < personFrames; frame++) {
        // Draw the person legs then body then hair then under garment then leg gear then body gear.
        actorContext.drawImage(baseImage, frame * 96 + 64, row * 64 , 32, 64, frame * 96 + 32, 0, 32, 64); //legs
        actorContext.drawImage(baseImage, frame * 96, row * 64 , 32, 64, frame * 96 + 32, 0, 32, 64); //body
        /*
        if (!hideHair) {
            actor.actorContext.drawImage(images['gfx/hair.png'], frame * 96, hairYOffset * 64, 32, 64, frame * 96 + 32, 0, 32, 64); //hair
        }
        */
        // To avoid drawing 'naked' characters, draw an undergarment (black dress?) if they
        // don't have both a pants and a shirt on.
        // But monsters can be naked! (I think?)
        /*
        if ((!actor.equipment.body || !actor.equipment.body.base.source)
                || (!actor.equipment.legs || !actor.equipment.legs.base.source)) {
            actorContext.drawImage(images['gfx/equipment.png'], frame * 96, 8 * 64 , 32, 64, frame * 96 + 32, 0, 32, 64); //undergarment
        }
        */
        // leg + body gear
        for (var subX of [64, 0]) {
            equipmentSlots.forEach(function (type) {
                var item = equipment[type];
                if (!item || !item.base.source) return;
                var source = item.base.source;
                if (source.xOffset !== subX) return;
                actorContext.drawImage(images['gfx/equipment.png'], frame * 96 + source.xOffset, source.yOffset, 32, 64, frame * 96 + 32, 0, 32, 64);
            });
        }
        // Draw the weapon under the arm
        var weapon = equipment.weapon;
        if (weapon && weapon.base.source) {
            var source = weapon.base.source;
            actorContext.drawImage(images['gfx/weapons.png'], frame * 96, source.yOffset, 96, 64, frame * 96, 0, 96, 64);
        }
        // Draw the person arm then arm gear
        actorContext.drawImage(baseImage, frame * 96 + 32, row * 64 , 32, 64, frame * 96 + 32, 0, 32, 64); // arm
        //arm gear
        equipmentSlots.forEach(function (type) {
            var item = equipment[type];
            if (!item || !item.base.source) return;
            var source = item.base.source;
            if (source.xOffset !== 32) return; // don't draw this if it isn't arm gear
            actorContext.drawImage(images['gfx/equipment.png'], frame * 96 + source.xOffset, source.yOffset, 32, 64, frame * 96 + 32, 0, 32, 64);
        });
    }
    return actorCanvas;
}
function initalizeMonsters() {
    var caterpillarSource = setupActorSource({'image': requireImage('gfx/caterpillar.png'), 'width': 48, 'height': 64, 'actualHeight': 24, 'yOffset': 40, frames: 4});
    var gnomeSource = setupActorSource({'image': requireImage('gfx/gnome.png'), 'width': 32, 'height': 64, 'actualHeight': 38, 'yOffset': 26, 'flipped': true, frames: 4});
    var skeletonSource = setupActorSource({'image': requireImage('gfx/skeletonSmall.png'), 'width': 48, 'height': 64, 'actualHeight': 38, 'yOffset': 26, frames: 7});
    var butterflySource = setupActorSource({'image': requireImage('gfx/yellowButterfly.png'), 'width': 64, 'actualWidth': 48, 'height': 64,
            framesPerRow: 7, walkFrames: [1, 2, 3, 4, 5, 6, 4, 2, 0], 'attackPreparationFrames': [7, 10, 11], deathFrames: [7, 8, 9, 9]});
    var skeletonGiantSource = setupActorSource({'image': requireImage('gfx/skeletonGiant.png'), 'width': 48, frames: 7});
    var dragonSource = setupActorSource({'image': requireImage('gfx/dragon.png'), 'width': 64, 'actualWidth': 48, 'height': 64,
            framesPerRow: 7, walkFrames: [1, 2, 3, 4], 'attackPreparationFrames': [5, 6, 7], deathFrames: [8, 9, 10]});
    var batSource = setupActorSource({'image': requireImage('gfx/bat.png'), 'width': 32, 'height': 32, 'flipped': true, frames: 5, 'y': 30});
    var spiderSource = setupActorSource({'image': requireImage('gfx/spider.png'), 'width': 48, 'height': 48, 'y': -10,
            framesPerRow: 10, walkFrames: [4, 5, 6, 7, 8, 9], 'attackPreparationFrames': [0, 1, 2, 3], deathFrames: [10, 11, 12, 13]});
    var wolfSource = setupActorSource({'image': requireImage('gfx/wolf.png'), 'width': 64, 'height': 32,
            framesPerRow: 7, walkFrames: [0, 1, 2, 3], 'attackPreparationFrames': [6, 4, 5, 0], deathFrames: [0, 7, 8, 9]});
    var turtleSource = {'image': requireImage('gfx/turtle.png'), 'xOffset': 0, 'width': 64, 'height': 64,
            framesPerRow: 5, walkFrames: [0, 1, 2, 3], 'attackPreparationFrames': [5, 6], deathFrames: [5, 7, 8, 9]};
    var monarchSource = setupActorSource({'image': requireImage('gfx/monarchButterfly.png'), 'width': 64, 'actualWidth': 48, 'height': 64,
            framesPerRow: 7, walkFrames: [1, 2, 3, 4, 5, 6, 4, 2, 0], 'attackPreparationFrames': [7, 10, 11], deathFrames: [7, 8, 9, 9]});
    var skeletonRow = 0;
    var goblinRow = 1;
    var vampireRow = 2;
    var skeletonWithHatCanvas = createEquippedActorSource(requireImage('gfx/monsterPeople.png'), skeletonRow, {'head': makeItem(itemsByKey.strawhat, 1)});
    var skeletonWithHelmetCanvas = createEquippedActorSource(requireImage('gfx/monsterPeople.png'), skeletonRow, {'head': makeItem(itemsByKey.copperhelmet, 1), 'weapon': makeItem(itemsByKey.gladius, 1)});
    var skeletonNakedCanvas = createEquippedActorSource(requireImage('gfx/monsterPeople.png'), skeletonRow, {});
    var skeletonWarriorCanvas = createEquippedActorSource(requireImage('gfx/monsterPeople.png'), skeletonRow, {'weapon': makeItem(itemsByKey.hatchet, 1), 'head': makeItem(itemsByKey.irongreathelm, 1)});
    var goblinWithHeavyArmorCanvas = createEquippedActorSource(requireImage('gfx/monsterPeople.png'), goblinRow, {'body': makeItem(itemsByKey.platedcoat, 1), 'legs': makeItem(itemsByKey.copperskirt, 1), 'head': makeItem(itemsByKey.copperhelmet, 1), 'feet': makeItem(itemsByKey.coppersabatons, 1)});
    var goblinTatteredShortsCanvas = createEquippedActorSource(requireImage('gfx/monsterPeople.png'), goblinRow, {'legs': makeItem(itemsByKey.leatherkilt, 1)});
    var humanoidMonsterBaseSource ={
        'width': 96,
        'height': 64,
        'yCenter': 44, // Measured from the top of the source
        'yOffset': 14, // Measured from the top of the source
        'actualHeight': 50,
        'xOffset': 39,
        'actualWidth': 18,
        'attackY': 19, // Measured from the bottom of the source
        'walkFrames': [0, 1, 0, 2],
        'attackPreparationFrames': [0, 3, 4],
        'attackRecoveryFrames': [4, 3]
    };

    var skeletonWithHatSource = setupActorSource($.extend(humanoidMonsterBaseSource, {'image': skeletonWithHatCanvas}));
    var skeletonWithHelmetSource = setupActorSource($.extend(humanoidMonsterBaseSource, {'image': skeletonWithHelmetCanvas}));
    var skeletonWarriorSource = setupActorSource($.extend(humanoidMonsterBaseSource, {'image': skeletonWarriorCanvas}));
    var skeletonNakedSource = setupActorSource($.extend(humanoidMonsterBaseSource, {'image': skeletonNakedSource}));
    var goblinWithHeavyArmorSource = setupActorSource($.extend(humanoidMonsterBaseSource, {'image': goblinWithHeavyArmorSource}));
    var goblinTatteredShortsSource = setupActorSource($.extend(humanoidMonsterBaseSource, {'image': goblinTatteredShortsSource}));

    addMonster('dummy', {
        'name': 'Dummy', 'source': caterpillarSource,
        'implicitBonuses': {}
    });
    addMonster('goblin', {
        'name': 'Goblin', 'source': goblinTatteredShortsSource, 'implicitBonuses': {}
    });
    addMonster('turtle', {
        'name': 'Turtle', 'source': turtleSource, 'fpsMultiplier': 2,
        'implicitBonuses': {}
    });
    addMonster('spider', {
        'name': 'Spider', 'source': spiderSource,
        'implicitBonuses': {'*evasion': 1.2, '*accuracy': .8, '*weaponDamage': 1.2, '+range': .5, '*speed': 1.3, '*scale': .75},
        'abilities': [abilities.poison]
    });
    addMonster('jumpingSpider', {
        'name': 'Jumping Spider', 'source': spiderSource,
        'implicitBonuses': {'*evasion': 1.2, '*accuracy': .8, '*weaponDamage': 1.4, '*speed': 1.5, '*scale': .75},
        'abilities': [abilities.blinkStrike]
    });
    addMonster('wolf', {
        'name': 'Wolf', 'source': wolfSource,
        'implicitBonuses': {'*maxHealth': 1.5, '*weaponMagicDamage': 0, '*accuracy': 1.5, '+critChance': .1, '*speed': 2, '*scale': .75}
    });
    addMonster('alphaWolf', {
        'name': 'Alpha Wolf', 'source': wolfSource,
        'implicitBonuses': {'+weaponRange': 1, '*maxHealth': 2, '*weaponMagicDamage': 0, '*accuracy': 1.5, '+critChance': .1, '*speed': 1.5, '*scale': .8},
        'abilities': [abilities.attackSong]
    });
    addMonster('packLeader', {
        'name': 'Pack Leader', 'source': wolfSource,
        'implicitBonuses': {'+weaponRange': 2, '*maxHealth': 2, '*weaponMagicDamage': 0, '*accuracy': 1.5, '+critChance': .1, '*speed': 1.5, '*scale': .8},
        'abilities': [abilities.majorDexterity, abilities.majorStrength, abilities.majorIntelligence,
                      abilities.howl, abilities.howl, abilities.attackSong, abilities.defenseSong, abilities.sicem, abilities.howlSingAttack]
    });
    addMonster('snowWolf', {'name': 'Snow Wolf', 'tint': ['white', 1]}, monsters.wolf);
    addMonster('frostBite', {name: 'Frost Bite', abilities: [abilities.secondWind]}, monsters.snowWolf);
    addMonster('giantSpider', {
        'name': 'Giant Spider', 'source': spiderSource,
        'implicitBonuses': {'+weaponRange': 12, '*evasion': .8, '*accuracy': .8, '*weaponDamage': 1.4, '+critChance': .25, '*scale': 1.15},
        'tags': ['ranged'],
        'abilities': [abilities.net, abilities.dodge, abilities.acrobatics, abilities.reflect, abilities.dodgeNetReflect, abilities.poison]
    });
    addMonster('bat', {
        'name': 'Bat', 'source': batSource,
        'implicitBonuses': {'*evasion': 1.2, '*accuracy': 1.2, '*weaponDamage': .6, '*speed': 2}
    });
    addMonster('vampireBat', {
        'name': 'Vampire Bat', 'source': batSource,
        'implicitBonuses': {'*evasion': 1.2, '*accuracy': 1.2, '*weaponDamage': .8, '*speed': 2, '*scale': 1.25},
        'abilities': [abilities.darkknight, abilities.distract, abilities.drainLife]
    });
    addMonster('caterpillar', {
        'name': 'Caterpillar', 'source': caterpillarSource,
        'implicitBonuses': {'*weaponMagicDamage': 0, '+weaponDamage': 1,
                            '*block': .5, '+magicBlock': 6, '*magicBlock': 2, '+magicResist': .66,
                            '*speed': 0.7}
    });
    addMonster('spongeyCaterpillar', {
        'name': 'Armorpede', 'source': caterpillarSource,
        'implicitBonuses': {'*weaponMagicDamage': 0, '*weaponDamage': 0.5, '*maxHealth': 3,
                            '*armor': 1.5, '+magicBlock': 6, '*magicBlock': 2, '+magicResist': 0.75,
                            '*speed': 0.7},
        'abilities': [abilities.vitality, abilities.majorStrength]
    });
    addMonster('stealthyCaterpillar', {
        'name': 'The Very Stealthy Caterpillar', 'source': caterpillarSource,
        'implicitBonuses': {'*weaponMagicDamage': 0, '*maxHealth': .5, '*scale': .15, '+scale': [40, '*', ['{bonusMaxHealth}', '/', '{maxHealth}']],
                            '*block': .5, '+magicBlock': 4, '*magicBlock': 2, '+magicResist': .5, '*healthRegen': 5,
                            '*speed': [.5, '+', [2, '*', ['{bonusMaxHealth}', '/', '{maxHealth}']]]},
        'abilities': [abilities.stealth, abilities.darkknight, abilities.darkknight]
    });
    // Gnomes are vulnerable to magic damage, strong against physical damage, and deal ranged magic damage.
    // Designed to favor mage classes.
    addMonster('gnome', {'name': 'Gnome', 'source': gnomeSource, 'fpsMultiplier': 1.5,
        'implicitBonuses': {'+weaponRange': 4, '*attackSpeed': 1, '+weaponMagicDamage': 4, '*weaponMagicDamage': 1.3,
                            '+block': 4, '+armor': 4, '*armor': 1.5, '*block': 1.5, '*magicBlock': 0.1, '*magicResist': 0.1,
                            '*speed': .6}, 'tags': ['ranged']
    });
    addMonster('gnomecromancer', {'name': 'Gnomecromancer', 'source': gnomeSource, 'fpsMultiplier': 1.5,
        'implicitBonuses': {'+weaponRange': 6, '*attackSpeed': 1, '+weaponMagicDamage': 4, '*weaponMagicDamage': 1.3,
                            '+block': 4, '+armor': 4, '*armor': 1.5, '*block': 1.5, '*magicBlock': 0.1, '*magicResist': 0.1,
                            '*speed': .6},
        'abilities': [abilities.summonSkeleton, abilities.summoner, abilities.darkknight, abilities.consume, abilities.consumeRange], 'tags': ['ranged']
    });
    addMonster('necrognomekhan', {'name': 'Necrognomekhan', 'source': gnomeSource, 'fpsMultiplier': 1.5,
        'implicitBonuses': {'+weaponRange': 6, '*attackSpeed': 1, '+weaponMagicDamage': 4, '*weaponMagicDamage': 1.3,
                            '+scale': [2, '*', ['{bonusMaxHealth}', '/', '{maxHealth}']],
                            '*cooldown': [.1, '+', ['{bonusMaxHealth}', '/', '{maxHealth}']],
                            '*weaponDamage': [1, '+', ['{bonusMaxHealth}', '/', '{maxHealth}']],
                            '+block': 4, '+armor': 4, '*armor': 1.5, '*block': 1.5, '*magicBlock': 0.1, '*magicResist': 0.1,
                            '*speed': .6},
        'abilities': [abilities.summonSkeleton, abilities.summoner, abilities.darkknight, abilities.consume, abilities.consumeRange, abilities.consumeRatio], 'tags': ['ranged']
    });
    addMonster('gnomeCleric', {'name': 'Gnome Cleric', 'source': gnomeSource, 'fpsMultiplier': 1.5,
        'implicitBonuses': {'+weaponRange': 4, '*attackSpeed': 1, '+weaponMagicDamage': 4, '*weaponMagicDamage': 1.3,
                            '*intelligence': 2,
                            '+block': 4, '+armor': 4, '*armor': 1.5, '*block': 1.5, '*magicBlock': 0.1, '*magicResist': 0.1,
                            '*speed': .6},
        'abilities': [abilities.spellAOE, abilities.protect, abilities.heal, abilities.minorIntelligence], 'tags': ['ranged']
    });
    addMonster('gnomeMage', {'name': 'Gnome Mage', 'source': gnomeSource, 'fpsMultiplier': 1.5,
        'implicitBonuses': {'+weaponRange': 4, '*attackSpeed': 1, '+weaponMagicDamage': 4, '*weaponMagicDamage': 1.3,
                            '+block': 4, '+armor': 4, '*armor': 1.5, '*block': 1.5, '*magicBlock': 0.1, '*magicResist': 0.1,
                            '*speed': .6},
        'abilities': [abilities.fireball, abilities.wizard], 'tags': ['ranged']
    });
    addMonster('gnomeWizard', {'name': 'Gnome Wizard', 'source': gnomeSource, 'fpsMultiplier': 1.5,
        'implicitBonuses': {'+weaponRange': 4, '*attackSpeed': 1, '+weaponMagicDamage': 4, '*weaponMagicDamage': 1.3,
                            '+block': 4, '+armor': 4, '*armor': 1.5, '*block': 1.5, '*magicBlock': 0.1, '*magicResist': 0.1,
                            '*speed': .6},
        'abilities': [abilities.fireball, abilities.freeze, abilities.wizard], 'tags': ['ranged']
    });
    addMonster('skeleton', {'name': 'Skeleton', 'source': skeletonNakedSource,
        // Fast to counter ranged heroes, low range+damage + fast attacks to be weak to armored heroes.
        'implicitBonuses': {'+weaponRange': -.5, '+accuracy': 2, '*attackSpeed': 2, '*weaponMagicDamage': 0,
                            '*evasion': 1.3, '*magicBlock': 0.1, '*magicResist': 0.1,
                            '*speed': 1.5},
        'abilities': [abilities.sideStep]
    });
    addMonster('skeletalBuccaneer', {'name': 'Skeletal Buccaneer', 'source': skeletonWithHatSource,
        // Deflect to counter ranged champions.
        'implicitBonuses': {'+weaponRange': -.5, '*minPhysicalDamage': .4, '*maxPhysicalDamage': .4, '+accuracy': 2, '*attackSpeed': 2, '*weaponMagicDamage': 0,
                            '*block': 0, '+armor': 2, '*magicBlock': 0.1, '*magicResist': 0.1,
                            '*speed': 1, 'scale': 1.5},
        'abilities': [abilities.deflect, abilities.deflectDamage, abilities.sage, abilities.majorDexterity]
    });
    addMonster('undeadPaladin', {'name': 'Undead Paladin', 'source': skeletonWithHelmetSource,
        // Deflect to counter ranged champions.
        'implicitBonuses': {'*minPhysicalDamage': .4, '*maxPhysicalDamage': .4, '+accuracy': 2, '*attackSpeed': 2,
                            '*block': 1.5, '+armor': 2, '*magicBlock': 1.5, '*magicResist': 0.1,
                            '*speed': 1, '*scale': 1.5},
        'abilities': [abilities.reflect, abilities.majorIntelligence, abilities.aegis, abilities.heal]
    });
    addMonster('undeadWarrior', {'name': 'Undead Warrior', 'source': skeletonWarriorSource,
        // Fast to counter ranged heroes, low range+damage + fast attacks to be weak to armored heroes.
        'implicitBonuses': {'+weaponRange': -.5, '*minPhysicalDamage': .4, '*maxPhysicalDamage': .4, '+accuracy': 2, '*attackSpeed': 2, '*weaponMagicDamage': 0,
                            '*block': 0, '+armor': 2, '*magicBlock': 0.1, '*magicResist': 0.1,
                            '*speed': 1.5},
        'abilities': [abilities.blinkStrike, abilities.soulStrike, abilities.majorStrength, abilities.vitality]
    });
    //console.log(JSON.stringify(makeMonster('skeleton', 1)));
    addMonster('butterfly', {'name': 'Butterfly', 'source': butterflySource, 'fpsMultiplier': 4,
        'implicitBonuses': {'*maxHealth': 1.5, '+weaponRange': 4, '+critChance': .05, '+critDamage': .1, '+critAccuracy': .5, '*accuracy': 2,
                            '*weaponMagicDamage': .4, '*weaponDamage': .8,
                            '*block': 0, '*armor': .5, '*magicBlock': 1.5, '*magicResist': 0.1,
                            '*speed': .8}, 'tags': ['ranged']
    });
    addMonster('battlefly', {'name': 'Battlefly', 'source': butterflySource, 'fpsMultiplier': 4,
        'implicitBonuses': {'*maxHealth': 2, '+weaponRange': 5, '+critChance': .05, '+critDamage': .1, '+critAccuracy': .5, '*accuracy': 2,
                            '*weaponMagicDamage': 0,
                            '*block': 0, '*armor': .5, '*magicBlock': 1.5, '*magicResist': 0.1,
                            '*speed': .8}, 'tags': ['ranged'],
        'abilities': [abilities.powerShot, abilities.powerShotKnockback]
    });
    addMonster('motherfly', {'name': 'Motherfly', 'source': monarchSource, 'fpsMultiplier': 4,
        'implicitBonuses': {'+maxHealth': 20, '*maxHealth': 3, '+weaponRange': 5, '+critChance': .05, '+critDamage': .1, '+critAccuracy': .5, '*accuracy': 2,
                            '*minPhysicalDamage': .8, '*maxPhysicalDamage': .8, '*attackSpeed': .5, '*weaponMagicDamage': .5,
                            '*block': 0, '*armor': .5, '*magicBlock': 1.5, '*magicResist': 0.1,
                            '*speed': .8}, 'tags': ['ranged'],
        'abilities': [abilities.summonCaterpillar, abilities.summoner]
    });
    addMonster('lightningBug', {'name': 'Lightning Bug', 'source': butterflySource, 'fpsMultiplier': 4,
        'implicitBonuses': {'*maxHealth': 1.5, '+weaponRange': 4, '+critChance': .05, '+critDamage': .1, '+critAccuracy': .5, '*accuracy': 2,
                            '*minPhysicalDamage': .8, '*maxPhysicalDamage': .8, '*attackSpeed': .5, '*weaponMagicDamage': .5,
                            '*block': 0, '*armor': .5, '*magicBlock': 1.5, '*magicResist': 0.1,
                            '*speed': .8}, 'tags': ['ranged'],
        'abilities': [abilities.storm]
    });
    addMonster('giantSkeleton', {'name': 'Skelegiant', 'source': skeletonGiantSource,
        'implicitBonuses': {'*maxHealth': 2, '+critDamage': .5, '*weaponMagicDamage': 0, '*accuracy': 2,
                            '*evasion': .5, '*block': 0, '*armor': .5, '*magicBlock': 0.1, '*magicResist': 0.1}
    });
    addMonster('skeletonOgre', {'name': 'Skeleton Ogre', 'source': skeletonGiantSource,
        'implicitBonuses': {'*maxHealth': 3, '+critDamage': .5, '*weaponMagicDamage': 0, '*accuracy': 2,
                            '*evasion': .5, '*block': 0, '*armor': .5, '*magicBlock': 0.1, '*magicResist': 0.1},
        'abilities': [abilities.hook, abilities.hookRange, abilities.hookStun, abilities.dodge, abilities.acrobatics, abilities.acrobatics, abilities.dodgeHook, abilities.deflect]
    });
    addMonster('butcher', {'name': 'Butcher', 'source': skeletonGiantSource,
        'implicitBonuses': {'*maxHealth': 3, '+critDamage': .5, '*weaponMagicDamage': 0, '*accuracy': 2,
                            '*evasion': .5, '*block': 0, '*armor': .5, '*magicBlock': 0.1, '*magicResist': 0.1},
        'abilities': [abilities.hook]
    });
    addMonster('frostGiant', {'name': 'Frost Giant', 'source': skeletonGiantSource,
        'implicitBonuses': {'*maxHealth': 2, '+critDamage': .5, '*weaponMagicDamage': 0, '*accuracy': 2,
                            '*evasion': .5, '*block': 0, '*armor': .5, '*magicBlock': 0.1, '*magicResist': 0.1},
        'abilities': [abilities.freeze]
    });
    addMonster('dragon', {'name': 'Dragon', 'source': dragonSource, 'stationary': true, // speed still effects animation
        'implicitBonuses': {'*maxHealth': 1.6, '+weaponRange': 12, '+critChance': .15, '*accuracy': 2,
                            '*evasion': .5, '*block': 0, '*armor': .5, '*magicBlock': 2, '+magicResist': .5,
                            '*speed': 2, '*scale': 2}, 'tags': ['ranged'],
        'abilities': [abilities.fireball, abilities.sideStep]
    });
}

map.testLevelData = {
    name: "Test Area", description: "Area for testing monsters", background: "cave", unlocks: [], coords: [-443,-152,-375],
    minMonstersPerArea: 1, maxMonstersPerArea: 1,
    level: 15,
    enemySkills: [],
    monsters: ['snowWolf'],
    events: [
        ['frostBite'],
    ]
};

