
function checkToAttack(attacker, target, distance) {
    if (distance > attacker.range * 32) {
        return null;
    }
    if (!attacker.target) {
        // Store last target so we will keep attacking the same target until it is dead.
        attacker.target = target;
    }
    if (ifdefor(attacker.attackCooldown, 0) > now()) {
        return null;
    }
    attacker.attackCooldown = now() + 1000 / (attacker.attackSpeed * attacker.character.gameSpeed * Math.max(.1, (1 - attacker.slow)));
    return performAttack(attacker, target);
}
function applyArmorToDamage(damage, armor) {
    if (damage <= 0) {
        return 0;
    }
    //This equation looks a bit funny but is designed to have the following properties:
    //100% damage at 0 armor
    //50% damage when armor is equal to base damage
    //25% damage when armor is double base damage
    //1/(2^N) damage when armor is N times base damage
    return Math.max(1, Math.round(damage / Math.pow(2, armor / damage)));
}

function performAttack(attacker, target) {
    var damage = Random.range(attacker.minDamage, attacker.maxDamage);
    var magicDamage = Random.range(attacker.minMagicDamage, attacker.maxMagicDamage);
    var accuracyRoll = Random.range(0, attacker.accuracy);
    var evasionRoll = Random.range(0, target.evasion);
    if (accuracyRoll < evasionRoll) {
        if (ifdefor(attacker.damageOnMiss)) {
            target.health -= attacker.damageOnMiss;
            return 'miss (' + attacker.damageOnMiss + ')';
        }
        // Target has evaded the attack.
        return 'miss';
    }
    if (ifdefor(attacker.healthGainOnHit)) {
        attacker.health += attacker.healthGainOnHit;
    }
    if (ifdefor(attacker.slowOnHit)) {
        target.slow = Math.max(target.slow, attacker.slowOnHit);
    }
    // Apply block reduction
    var blockRoll = Random.range(0, target.block);
    var magicBlockRoll = Random.range(0, target.magicBlock);
    damage = Math.max(0, damage - blockRoll);
    magicDamage = Math.max(0, magicDamage - magicBlockRoll);
    // Apply armor and magic resistance mitigation
    // TODO: Implement armor penetration here.
    damage = applyArmorToDamage(damage, target.armor);
    magicDamage = magicDamage * Math.max(0, (1 - target.magicResist));
    // TODO: Implement flat damage reduction here.
    target.health -= (damage + magicDamage);
    return (damage + magicDamage) > 0 ? (damage + magicDamage) : 'blocked';
}

function makeMonster(level, baseMonster, x) {
    var monster = {
        'level': level,
        'x': x,
        'slow': 0,
        'equipment': {},
        'attackColldown': 0,
        'base': {
            'level': level,
            'ip': Random.range(0, level * 2),
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
        if (Array.isArray(value)) {
            monster.base[stat] = Random.range(Math.floor(value[0] + level * value[2]), Math.ceil(value[1] + level * value[3]));
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
    monster.color = 'red';
    if (enchantments > 2) {
        monster.bonuses.push(imbuedMonsterBonuses);
        monster.color = '#c6f';
    } else if (enchantments) {
        monster.bonuses.push(enchantedMonsterBonuses);
        monster.color = '#af0';
    }
    var name = monster.base.name;
    var prefixNames = []
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
    ['dexterity', 'strength', 'intelligence', 'maxHealth', 'speed', 'ip', 'xp', 'mp', 'rp', 'up',
     'evasion', 'block', 'magicBlock', 'armor', 'magicResist', 'accuracy', 'range', 'attackSpeed',
     'minDamage', 'maxDamage', 'minMagicDamage', 'maxMagicDamage',
     'damageOnMiss', 'slowOnHit', 'healthRegen', 'healthGainOnHit'].forEach(function (stat) {
        monster[stat] = getStat(monster, stat);
    });
    ['dexterity', 'strength', 'intelligence', 'maxHealth', 'speed',
     'evasion', 'block', 'magicBlock', 'armor', 'magicResist', 'accuracy',
     'minDamage', 'maxDamage', 'minMagicDamage', 'maxMagicDamage'].forEach(function (stat) {
        monster[stat] = Math.floor(monster[stat]);
    });
    ['range', 'attackSpeed'].forEach(function (stat) {
        monster[stat] = monster[stat].toFixed(2);
    });
    monster.health = monster.maxHealth;
    monster.maxDamage = Math.max(monster.minDamage, monster.maxDamage);
    monster.minMagicDamage = Math.max(monster.minMagicDamage, monster.maxMagicDamage);
    //console.log(monster);
}
var levels = [];
var monsters = {};
function addMonsters(key, data) {
    monsters[key] = data;
}
function initalizeMonsters() {
    var caterpillar = {
        'name': 'Caterpillar',
        'health': [5, 6, 2, 2.5],
        'range': 1,
        'minDamage': [1, 2, 1, 1],
        'maxDamage': [3, 4, 1, 1],
        'minMagicDamage': 0,
        'maxMagicDamage': 0,
        'attackSpeed': 1,
        'speed': 100,
        'accuracy': [0, 0, 1, 2],
        'evasion': [0, 0, 0, 1],
        'block': [0, 0, .5, 1.5],
        'magicBlock': [0, 0, .5, 1],
        'armor': [0, 0, 1, 2],
        'magicResist': 0,
        'source': {'image': images['gfx/caterpillar.png'], 'offset': 0, 'width': 48, 'flipped': true, frames: 4}
    };
    var butterfly = {
        'name': 'Butterfly',
        'health': [3, 5, 1, 1.5],
        'range': 2,
        'minDamage': [1, 3, 1, 1],
        'maxDamage': [3, 4, 1, 1],
        'minMagicDamage': [1, 1, 1, 1],
        'maxMagicDamage': [2, 2, 2, 2],
        'attackSpeed': [1, 1, .1, .1],
        'speed': 200,
        'accuracy': [1, 2, 1, 2],
        'evasion': [1, 2, 1, 2],
        'block': 0,
        'magicBlock': 0,
        'armor': [0, 1, .5, .8],
        'magicResist': 0,
        'source': {'image': images['gfx/caterpillar.png'], 'offset': 4 * 48, 'width': 48, 'flipped': true, frames: 4}
    };
    var gnome = {
        'name': 'Gnome',
        'health': [30, 40, 2, 2.5],
        'range': 1,
        'minDamage': [1, 2, 1, 1],
        'maxDamage': [3, 4, 1, 1],
        'minMagicDamage': 0,
        'maxMagicDamage': 0,
        'attackSpeed': 1,
        'speed': 100,
        'accuracy': [0, 0, 1, 2],
        'evasion': [0, 0, 0, 1],
        'block': [0, 0, .5, 1.5],
        'magicBlock': [1, 1, .5, 1],
        'armor': [0, 0, .5, 1.5],
        'magicResist': 0,
        'source': {'image': images['gfx/gnome.png'], 'offset': 0, 'width': 32, 'flipped': false, frames: 4}
    };
    var skeleton = {
        'name': 'Skeleton',
        'health': [20, 40, 1, 1.5],
        'range': 2,
        'minDamage': [1, 3, 1, 1],
        'maxDamage': [3, 4, 1, 1],
        'minMagicDamage': [1, 1, 1, 1],
        'maxMagicDamage': [2, 2, 2, 2],
        'attackSpeed': [1, 1, .1, .1],
        'speed': 200,
        'accuracy': [1, 2, 1, 2],
        'evasion': [1, 2, 1, 2],
        'block': 0,
        'magicBlock': 0,
        'armor': [0, 1, .5, .8],
        'magicResist': 0,
        'source': {'image': images['gfx/skeletonSmall.png'], 'offset': 0, 'width': 48, 'flipped': true, frames: 7}
    };
    var giantSkeleton = {
        'name': 'Skelegiant',
        'health': [100, 200, 2, 2.5],
        'range': 1,
        'minDamage': [1, 2, 1, 1],
        'maxDamage': [3, 4, 1, 1],
        'minMagicDamage': 0,
        'maxMagicDamage': 0,
        'attackSpeed': 1,
        'speed': 100,
        'accuracy': [0, 0, 1, 2],
        'evasion': [0, 0, 0, 1],
        'block': [0, 0, .5, 1.5],
        'magicBlock': [1, 1, .5, 1],
        'armor': [0, 0, .5, 1.5],
        'magicResist': 0,
        'source': {'image': images['gfx/skeletonGiant.png'], 'offset': 0, 'width': 48, 'flipped': true, frames: 7}
    };
    var dragon = {
        'name': 'Dragon',
        'health': [150, 250, 1, 1.5],
        'range': 2,
        'minDamage': [1, 3, 1, 1],
        'maxDamage': [3, 4, 1, 1],
        'minMagicDamage': [1, 1, 1, 1],
        'maxMagicDamage': [2, 2, 2, 2],
        'attackSpeed': [1, 1, .1, .1],
        'speed': 150,
        'accuracy': [1, 2, 1, 2],
        'evasion': [1, 2, 1, 2],
        'block': 0,
        'magicBlock': 0,
        'armor': [0, 1, .5, .8],
        'magicResist': 0,
        'stationary': true,
        'source': {'image': images['gfx/dragonEastern.png'], 'offset': 0, 'width': 48, 'flipped': false, frames: 5}
    };
    addMonsters('caterpillar', caterpillar);
    addMonsters('butterfly', butterfly);
    addMonsters('gnome', gnome);
    addMonsters('skeleton', skeleton);
    addMonsters('giantSkeleton', giantSkeleton);
    addMonsters('dragon', dragon);
    levels =[
        {'level': 1, 'monsters': [caterpillar, caterpillar, [caterpillar, caterpillar], caterpillar, [caterpillar, caterpillar], [caterpillar, caterpillar], caterpillar, [caterpillar, caterpillar, caterpillar, caterpillar, caterpillar]]},
        {'level': 2, 'monsters': [[caterpillar, caterpillar], [caterpillar, caterpillar], [caterpillar, caterpillar, caterpillar], [caterpillar, caterpillar], [caterpillar, caterpillar, caterpillar], [caterpillar, caterpillar, butterfly], gnome]},
        {'level': 3, 'monsters': [[caterpillar, caterpillar], [butterfly, caterpillar], [butterfly, butterfly], [caterpillar, caterpillar, caterpillar, caterpillar, butterfly], [caterpillar, butterfly, caterpillar, butterfly, caterpillar], skeleton]},
        {'level': 4, 'monsters': [[caterpillar, caterpillar, butterfly, caterpillar], [caterpillar, caterpillar, butterfly, butterfly, caterpillar, caterpillar], [butterfly, butterfly, butterfly], giantSkeleton]},
        {'level': 5, 'monsters': [[caterpillar, caterpillar, butterfly, caterpillar, butterfly], [caterpillar, caterpillar, butterfly, caterpillar, butterfly, caterpillar, butterfly, caterpillar, butterfly], dragon]},
    ];
    levels.forEach(function (level, index) { level.index = index;});
}
var enchantedMonsterBonuses = {'*maxHealth': 3, '*minDamge': 2, '*maxDamage': 2, '*xp': 3, '*ip': 3};
var imbuedMonsterBonuses = {'*maxHealth': 10, '*minDamge': 4, '*maxDamage': 4, '*xp': 10, '*ip': 10};
var monsterPrefixes = [
    [
        {'name': 'Frenzied', 'bonuses': {'*speed': [1.5, 2], '*attackSpeed': [1.5, 2]}},
        {'name': 'Eldritch', 'bonuses': {'+minMagicDamage': [1, 2], '*maxMagicDamage': [2, 3]}},
        {'name': 'Hawkeye', 'bonuses': {'+accuracy': [5, 10]}},
        {'name': 'Telekenetic', 'bonuses': {'+range': [3, 5]}}
    ]
];
var monsterSuffixes = [
    [
        {'name': 'Healing', 'bonuses': {'+healthRegen': [1, 2]}},
        {'name': 'Shadows', 'bonuses': {'+evasion': [3, 5]}},
        {'name': 'Frost', 'bonuses': {'+slowOnHit': [.1, .2]}},
        {'name': 'Confusion', 'bonuses': {'+damageOnMiss': [2, 3]}},
    ]
]