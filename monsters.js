
var enchantedMonsterBonuses = {'*maxHealth': 1.5, '*minDamge': 1.5, '*maxDamage': 1.5, '*xp': 3, '*ip': 3};
var imbuedMonsterBonuses = {'*maxHealth': 5, '*minDamge': 5, '*maxDamage': 5, '*xp': 10, '*ip': 10};
var monsterPrefixes = [
    [
        {'name': 'Hawkeye', 'bonuses': {'+accuracy': [5, 10]}}
    ],
    [
        {'name': 'Eldritch', 'bonuses': {'+minMagicDamage': [1, 2], '*maxMagicDamage': [2, 3]}}
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
        {'name': 'Stealth', 'bonuses': {'+cloaking': 1}}
    ]
];

function makeMonster(monsterData, level) {
    var monster = {
        'level': level,
        'slow': 0,
        'equipment': {},
        'attackColldown': 0,
        'base': {
            'level': level,
            'ip': Random.range(0, level * level * 4),
            'mp': 0,
            'rp': 0,
            'up': 0,
            'xp': level * 2,
        },
        'bonuses': [],
        'prefixes': [],
        'suffixes': []
    };
    var baseMonster;
    if (typeof(monsterData) == 'string') {
        baseMonster = monsters[monsterData];
    } else if (typeof(monsterData) == 'object') {
        baseMonster = monsters[monsterData.key];
        if (monsterData.bonuses) {
            monster.bonuses = monsterData.bonuses;
        }
    }
    $.each(baseMonster, function (stat, value) {
        if (stat == 'abilities') {
            monster[stat] = value;
            monster.base[stat] = value;
            return;
        }
        if (Array.isArray(value)) {
            monster[stat] = value;
            monster.base[stat] = Random.range(Math.floor(value[0] + (level - 1) * value[2]), Math.ceil(value[1] + (level - 1) * value[3]));
        } else {
            monster[stat] = value;
            monster.base[stat] = value;
        }
    });
    var rarity = (Math.random() < .25) ? (Math.random() * level * .6) : 0;
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
    monster.base.maxHealth = monster.base.health;
    updateMonster(monster);
    if (monster.ip > 1) {
        monster.mp = Random.range(0, monster.ip - 1);
        monster.ip -= monster.mp;
    }
    if (rarity >= 1 && monster.mp > 1) {
        monster.rp = Random.range(0, monster.mp - 1);
        monster.mp -= monster.rp;
    }
    if (Math.random() < .1 && monster.ip > 1 && monster.mp > 1 && monster.rp > 1) {
        monster.up = Random.range(0, Math.min(monster.ip, monster.mp, monster.rp) - 1);
        monster.ip -= monster.up;
        monster.mp -= monster.mp;
        monster.rp -= monster.rp;
    }
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
    monster.bonuses = [];
    monster.attacks = [];
    var enchantments = monster.prefixes.length + monster.suffixes.length;
    if (enchantments > 2) {
        monster.bonuses.push(imbuedMonsterBonuses);
        monster.color = '#c6f';
        monster.image = monster.base.source.image.imbued;
    } else if (enchantments) {
        monster.bonuses.push(enchantedMonsterBonuses);
        monster.color = '#af0';
        monster.image = monster.base.source.image.enchanted;
    } else {
        monster.color = 'red';
        monster.image = monster.base.source.image.normal;
    }
    var name = monster.base.name;
    var prefixNames = []
    monster.base.abilities.forEach(function (ability) {
        addBonusesAndAttacks(monster, ability);
    });
    monster.prefixes.forEach(function (affix) {
        prefixNames.push(affix.base.name);
        addBonusesAndAttacks(monster, affix);
    });
    if (prefixNames.length) {
        name = prefixNames.join(', ') + ' ' + name;
    }
    var suffixNames = []
    monster.suffixes.forEach(function (affix) {
        suffixNames.push(affix.base.name);
        addBonusesAndAttacks(monster, affix);
    });
    if (suffixNames.length) {
        name = name + ' of ' + suffixNames.join(' and ');
    }
    monster.helptext = name;
    // Add the character's current equipment to bonuses and graphics
    equipmentSlots.forEach(function (type) {
        var equipment = ifdefor(monster.equipment[type]);
        if (!equipment) {
            return;
        }
        addBonusesAndAttacks(monster, equipment.base);
        equipment.prefixes.forEach(function (affix) {
            addBonusesAndAttacks(monster, affix);
        })
        equipment.suffixes.forEach(function (affix) {
            addBonusesAndAttacks(monster, affix);
        })
    });
    allComputedStats.forEach(function (stat) {
        monster[stat] = getStat(monster, stat);
    });
    allRoundedStats.forEach(function (stat) {
        monster[stat] = Math.round(monster[stat]);
    });
    allFixed2Stats.forEach(function (stat) {
        monster[stat] = monster[stat].toFixed(2);
    });
    monster.health = monster.maxHealth;
    monster.maxDamage = Math.max(monster.minDamage, monster.maxDamage);
    monster.minMagicDamage = Math.max(monster.minMagicDamage, monster.maxMagicDamage);
    monster.attacks.forEach(function (attack) {
        $.each(attack.base.stats, function (stat) {
            attack[stat] = getStatForAttack(monster, attack, stat);
        })
    });
    //console.log(monster);
}
var monsters = {};
function addMonster(key, data) {
    monsters[key] = data;
}
function enemySheet(key) {
    return {
        'normal': images[key],
        'enchanted': images[key + '-enchanted'],
        'imbued': images[key + '-imbued'],
    }
}
function initalizeMonsters() {
    addMonster('caterpillar', {
        'name': 'Caterpillar',
        'health': [9, 10, 4, 4.5],
        'range': 1,
        'minDamage': [3, 3, 1, 1],
        'maxDamage': [4, 4, 1, 1],
        'critChance': 0,
        'critDamage': .5,
        'critAccuracy': 1,
        'minMagicDamage': 0,
        'maxMagicDamage': 0,
        'attackSpeed': 1,
        'speed': 50,
        'accuracy': [3, 3, 1.5, 2],
        'evasion': [1, 1, .8, 1],
        'block': [0, 0, .5, 1],
        'magicBlock': [4, 4, 1.8, 2],
        'armor': [1, 1, .5, 1],
        'magicResist': .5,
        'source': {'image': enemySheet('gfx/caterpillar.png'), 'offset': 0, 'width': 48, 'flipped': true, frames: 4},
        'abilities': []
    });
    addMonster('gnome', {
        'name': 'Gnome',
        'health': [8, 8, 4, 5],
        'range': 1.5,
        'minDamage': [5, 5, 1, 1.2],
        'maxDamage': [5, 5, 1.2, 1.5],
        'minMagicDamage': [3, 3, 1, 1],
        'maxMagicDamage': [3, 3, 1.5, 1.5],
        'critChance': 0,
        'critDamage': .5,
        'critAccuracy': 1,
        'fpsMultiplier': 1.5,
        'attackSpeed': 1.5,
        'speed': 30,
        'accuracy': [2, 3, 1, 1.5],
        'evasion': [0, 0, .5, 1],
        'block': [0, 0, .8, 1.5],
        'magicBlock': [0, 0, 0, 0],
        'armor': [3, 3, 1, 1.5],
        'magicResist': 0,
        'source': {'image': enemySheet('gfx/gnome.png'), 'offset': 0, 'width': 32, 'flipped': false, frames: 4},
        'abilities': []
    });
    addMonster('skeleton', {
        'name': 'Skeleton',
        'health': [9, 10, 7, 7.5],
        'range': .5,
        'minDamage': [2, 2, .5, 1],
        'maxDamage': [2, 2, .75, 1.5],
        'critChance': .05,
        'critDamage': .5,
        'critAccuracy': 1,
        'minMagicDamage': 0,
        'maxMagicDamage': 0,
        'attackSpeed': [2, 2, .05, .05],
        'speed': 200,
        'accuracy': [3, 4, 1.5, 2.5],
        'evasion': [0, 0, .5, 1],
        'block': 0,
        'magicBlock': 0,
        'armor': [0, 0, .5, .8],
        'magicResist': 0,
        'source': {'image': enemySheet('gfx/skeletonSmall.png'), 'offset': 0, 'width': 48, 'flipped': true, frames: 7},
        'abilities': []
    });
    addMonster('butterfly', {
        'name': 'Butterfly',
        'health': [12, 15, 6, 7],
        'range': 5,
        'minDamage': [2, 3, 1, 1.5],
        'maxDamage': [3, 4, 1.5, 2],
        'minMagicDamage': [1, 1, 1, 1],
        'maxMagicDamage': [2, 2, 1.5, 1.5],
        'critChance': .1,
        'critDamage': .6,
        'critAccuracy': 1.5,
        'attackSpeed': [.5, .5, .02, .02],
        'speed': 60,
        'accuracy': [1, 2, 1, 2],
        'evasion': [0, 0, .5, 1],
        'block': 0,
        'magicBlock': [1, 2, 1, 1.5],
        'armor': [0, 0, .5, .8],
        'magicResist': 0,
        'source': {'image': enemySheet('gfx/caterpillar.png'), 'offset': 4 * 48, 'width': 48, 'flipped': true, frames: 4},
        'abilities': []
    });
    addMonster('giantSkeleton', {
        'name': 'Skelegiant',
        'health': [15, 20, 10, 11],
        'range': 1,
        'minDamage': [2, 3, 1, 2],
        'maxDamage': [3, 4, 1.5, 3],
        'minMagicDamage': 0,
        'maxMagicDamage': 0,
        'critChance': .05,
        'critDamage': 1,
        'critAccuracy': 1,
        'attackSpeed': 1,
        'speed': 100,
        'accuracy': [0, 0, 1.5, 2.5],
        'evasion': [0, 0, .5, .75],
        'block': 3,
        'magicBlock': 0,
        'armor': [0, 0, .5, .8],
        'magicResist': 0,
        'source': {'image': enemySheet('gfx/skeletonGiant.png'), 'offset': 0, 'width': 48, 'flipped': true, frames: 7},
        'abilities': []
    });
    addMonster('dragon', {
        'name': 'Dragon',
        'health': [14, 16, 9, 12],
        'range': 3,
        'minDamage': [1, 1, 1, 1],
        'maxDamage': [2, 2, 1.5, 2],
        'minMagicDamage': [0, 0, 1, 1],
        'maxMagicDamage': [1, 1, 1.5, 1.5],
        'critChance': .2,
        'critDamage': .5,
        'critAccuracy': 1,
        'attackSpeed': [1, 1, .05, .05],
        'speed': 200, //controls speed of animation, not forward movement
        'accuracy': [1, 2, 1, 2],
        'evasion': [0, 0, 1, 2],
        'block': [1, 1, 1, 2],
        'magicBlock': [1, 1, 1, 2],
        'armor': [0, 0, .75, 1],
        'magicResist': .5,
        'stationary': true,
        'source': {'image': enemySheet('gfx/dragonEastern.png'), 'offset': 0, 'width': 48, 'flipped': false, frames: 5},
        'abilities': []
    });
}