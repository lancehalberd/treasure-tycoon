
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
]

function makeMonster(level, baseMonster, x) {
    var monster = {
        'level': level,
        'x': x,
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
    $.each(baseMonster, function (stat, value) {
        if (stat == 'abilities') {
            monster.base[stat] = value;
            return;
        }
        if (Array.isArray(value)) {
            monster.base[stat] = Random.range(Math.floor(value[0] + (level - 1) * value[2]), Math.ceil(value[1] + (level - 1) * value[3]));
        } else {
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
        monster.bonuses.push(ability.bonuses);
    });
    monster.prefixes.forEach(function (affix) {
        monster.bonuses.push(affix.bonuses);
        prefixNames.push(affix.base.name);
    });
    if (prefixNames.length) {
        name = prefixNames.join(', ') + ' ' + name;
    }
    var suffixNames = []
    monster.suffixes.forEach(function (affix) {
        monster.bonuses.push(affix.bonuses);
        suffixNames.push(affix.base.name);
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
        if (equipment.base.bonuses) {
            monster.bonuses.push(equipment.base.bonuses);
        }
        equipment.prefixes.forEach(function (affix) {
            monster.bonuses.push(affix.bonuses);
        })
        equipment.suffixes.forEach(function (affix) {
            monster.bonuses.push(affix.bonuses);
        })
    });
    allComputedStats.forEach(function (stat) {
        monster[stat] = getStat(monster, stat);
    });
    allFlooredStats.forEach(function (stat) {
        monster[stat] = Math.floor(monster[stat]);
    });
    allFixed2Stats.forEach(function (stat) {
        monster[stat] = monster[stat].toFixed(2);
    });
    monster.health = monster.maxHealth;
    monster.maxDamage = Math.max(monster.minDamage, monster.maxDamage);
    monster.minMagicDamage = Math.max(monster.minMagicDamage, monster.maxMagicDamage);
    //console.log(monster);
}
var monsters = {};
function addMonsters(key, data) {
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
    addMonsters('caterpillar', {
        'name': 'Caterpillar',
        'health': [9, 10, 4, 4.5],
        'range': 2,
        'minDamage': [2, 2, 1, 1],
        'maxDamage': [2, 3, 1, 1],
        'minMagicDamage': 0,
        'maxMagicDamage': 0,
        'attackSpeed': 1,
        'speed': 50,
        'accuracy': [2, 2, 1.5, 2],
        'evasion': [1, 1, .8, 1],
        'block': [0, 0, .5, 1],
        'magicBlock': [4, 4, 1.8, 2],
        'armor': [1, 1, .5, 1],
        'magicResist': .5,
        'source': {'image': enemySheet('gfx/caterpillar.png'), 'offset': 0, 'width': 48, 'flipped': true, frames: 4},
        'abilities': []
    });
    addMonsters('gnome', {
        'name': 'Gnome',
        'health': [8, 9, 4, 5],
        'range': 1,
        'minDamage': [4, 4, 1, 1.2],
        'maxDamage': [5, 5, 1.2, 1.5],
        'minMagicDamage': [2, 2, 1, 1],
        'maxMagicDamage': [3, 3, 1.5, 1.5],
        'fpsMultiplier': 1.5,
        'attackSpeed': 1.5,
        'speed': 30,
        'accuracy': [2, 3, 1, 1.5],
        'evasion': [0, 0, .5, 1],
        'block': [0, 0, .8, 1.5],
        'magicBlock': [0, 0, 0, 0],
        'armor': [2, 3, 1, 1.5],
        'magicResist': 0,
        'source': {'image': enemySheet('gfx/gnome.png'), 'offset': 0, 'width': 32, 'flipped': false, frames: 4},
        'abilities': []
    });
    addMonsters('skeleton', {
        'name': 'Skeleton',
        'health': [7, 8, 3, 4.5],
        'range': 1,
        'minDamage': [2, 2, .5, 1],
        'maxDamage': [2, 2, .75, 1.5],
        'minMagicDamage': 0,
        'maxMagicDamage': 0,
        'attackSpeed': [2, 2, .05, .05],
        'speed': 200,
        'accuracy': [3, 4, 1.5, 2.5],
        'evasion': [0, 0, .5, 1],
        'block': 2,
        'magicBlock': 0,
        'armor': [1, 1, .5, .8],
        'magicResist': 0,
        'source': {'image': enemySheet('gfx/skeletonSmall.png'), 'offset': 0, 'width': 48, 'flipped': true, frames: 7},
        'abilities': []
    });
    addMonsters('butterfly', {
        'name': 'Butterfly',
        'health': [12, 15, 3, 4],
        'range': 5,
        'minDamage': [2, 3, 1, 1.5],
        'maxDamage': [3, 4, 1.5, 2],
        'minMagicDamage': [1, 1, 1, 1],
        'maxMagicDamage': [2, 2, 1.5, 1.5],
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
    addMonsters('giantSkeleton', {
        'name': 'Skelegiant',
        'health': [15, 20, 6, 7],
        'range': 2,
        'minDamage': [2, 3, 1, 2],
        'maxDamage': [3, 4, 1.5, 3],
        'minMagicDamage': 0,
        'maxMagicDamage': 0,
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
    addMonsters('dragon', {
        'name': 'Dragon',
        'health': [14, 16, 7, 8],
        'range': 4,
        'minDamage': [1, 1, 1, 1],
        'maxDamage': [2, 2, 1.5, 2],
        'minMagicDamage': [0, 0, 1, 1],
        'maxMagicDamage': [1, 1, 1.5, 1.5],
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