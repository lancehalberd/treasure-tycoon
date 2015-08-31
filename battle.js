
function checkToAttack(attacker, target, distance) {
    if (!attacker.attack && distance <=  attacker.range * 32) {
        setAttack(attacker, target);
    }
}
function applyArmorToDamage(damage, armor) {
    //This equation looks a bit funny but is designed to have the following properties:
    //100% damage at 0 armor
    //50% damage when armor is 1/3 of base damage
    //25% damage when armor is 2/3 of base damage
    //1/(2^N) damage when armor is N/3 of base damage
    return Math.max(1, Math.round(damage / Math.pow(2, 3 * armor / damage)));
}


function setAttack(attacker, target) {
    attacker.attack = {
        'attacker': attacker,
        'target': target,
        'time': now() + 1000 / attacker.attackSpeed
    };
}
function performAttack(attack) {
    var attacker = attack.attacker;
    var target = attack.target;
    var damage = Random.range(attacker.minDamage, attacker.maxDamage);
    var magicDamage = Random.range(attacker.minMagicDamage, attacker.maxMagicDamage);
    var accuracyRoll = Random.range(0, attacker.accuracy);
    var evasionRoll = Random.range(0, target.evasion);
    if (accuracyRoll < evasionRoll) {
        // Target has evaded the attack.
        return;
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
}

function makeMonster(powerLevel, x) {
    return {
        'x': x,
        'health': powerLevel * 2,
        'maxHealth': powerLevel * 2,
        'range': 1,
        'minDamage': powerLevel + 1,
        'maxDamage': (powerLevel + 1) * 2,
        'minMagicDamage': 0,
        'maxMagicDamage': 0,
        'attackSpeed': 1,
        'speed': Random.range(1, 2),
        'accuracy': 1 + Math.floor(powerLevel / 5),
        'evasion': 1 + Math.floor(powerLevel / 5),
        'block': 1 + Math.floor(powerLevel / 5),
        'magicBlock': 0,
        'armor': 1 + Math.floor(powerLevel / 5),
        'magicResist': 0,
        'xp': 2 * powerLevel,
        'ip': Math.floor(powerLevel / 5),
        'offset': powerLevel < 10 ? 0 : 4 * 48
    };
}