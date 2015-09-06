
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
    attacker.attackCooldown = now() + 1000 / (attacker.attackSpeed * Math.max(.1, (1 - attacker.slow)));
    return performAttack(attacker, target);
}
function applyArmorToDamage(damage, armor) {
    if (damage <= 0) {
        return 0;
    }
    //This equation looks a bit funny but is designed to have the following properties:
    //100% damage at 0 armor
    //50% damage when armor is 1/3 of base damage
    //25% damage when armor is 2/3 of base damage
    //1/(2^N) damage when armor is N/3 of base damage
    return Math.max(1, Math.round(damage / Math.pow(2, 3 * armor / damage)));
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
        'x': x,
        'slow': 0,
        'ip': Random.range(0, level * 2),
        'xp': level * 2,
        'attackColldown': 0
    };
    $.each(baseMonster, function (stat, value) {
        if (Array.isArray(value)) {
            monster[stat] = Random.range(Math.floor(value[0] + level * value[2]), Math.ceil(value[1] + level * value[3]));
        } else {
            monster[stat] = value;
        }
    });
    monster.maxHealth = monster.health;
    monster.maxDamage = Math.max(monster.minDamage, monster.maxDamage);
    monster.minMagicDamage = Math.max(monster.minMagicDamage, monster.maxMagicDamage);
    return monster;
}
var levels = [];
var monsters = {};
function addMonsters(key, data) {
    monsters[key] = data;
}
function initalizeMonsters() {
    var caterpillar = {
        'health': [3, 4, 2, 2.5],
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
        'source': {'image': images['gfx/caterpillar.png'], 'offset': 0, 'width': 48, 'flipped': true, frames: 4}
    };
    var butterfly = {
        'health': [2, 4, 1, 1.5],
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
        'health': [300, 400, 2, 2.5],
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
        'health': [200, 400, 1, 1.5],
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
}