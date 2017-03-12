/**
 * The achievement system allows player to unlock decorations for their guild by meeting
 * certain criteria, like leveling a job a certain amount or killing a certain number of enemies.
 *
 * The decorations are either wall decorations that can be hung in specified locations on walls,
 * or trophies that can be placed on specific pedestals.
 */
var achievements = {
    'level-juggler': jobAchievement([{'+accuracy': 1}, {'%attackSpeed': 0.1}, {'+attackSpeed': 0.1}, {'*attackSpeed': 1.1}]),
    'level-ranger': jobAchievement([{'+accuracy': 2}, {'+ranged:range': 0.5}, {'+ranged:range': 0.5, '+ranged:physicalDamage': 5}, {'*ranged:damage': 1.1}]),
    'level-sniper': jobAchievement([{'+accuracy': 3}, {'+healthRegen': ['{maxHealth}', '/', 100]}, {'%healthRegen': 0.1}, {'*healthRegen': 1.1}]),

    'level-priest': jobAchievement([{'+healthRegen': 2}, {'+healthRegen': ['{maxHealth}', '/', 100]}, {'%healthRegen': 0.1}, {'*healthRegen': 1.1}]),
    'level-wizard': jobAchievement([{'+healthRegen': 2}, {'+healthRegen': ['{maxHealth}', '/', 100]}, {'%healthRegen': 0.1}, {'*healthRegen': 1.1}]),
    'level-sorcerer': jobAchievement([{'+healthRegen': 2}, {'+healthRegen': ['{maxHealth}', '/', 100]}, {'%healthRegen': 0.1}, {'*healthRegen': 1.1}]),

    'level-blackbelt': jobAchievement([{'+maxHealth': 15}, {'%maxHealth': 0.1}, {'+maxHealth': ['{level}', '*', 3]}, {'*maxHealth': 1.1}]),
    'level-warrior': jobAchievement([{'+armor': 2}, {'%armor': 0.1}, {'+armor': ['{level}', '/', 2]}, {'*armor': 1.1}]),
    'level-samurai': jobAchievement([{'+physicalDamage': 2}, {'%physicalDamage': 0.1}, {'+physicalDamage': ['{level}', '/', 4]}, {'*physicalDamage': 1.1}]),

    'level-corsair': jobAchievement([{'+healthRegen': 2}, {'+healthRegen': ['{maxHealth}', '/', 100]}, {'%healthRegen': 0.1}, {'*healthRegen': 1.1}]),
    'level-assassin': jobAchievement([{'+healthRegen': 2}, {'+healthRegen': ['{maxHealth}', '/', 100]}, {'%healthRegen': 0.1}, {'*healthRegen': 1.1}]),
    'level-ninja': jobAchievement([{'+healthRegen': 2}, {'+healthRegen': ['{maxHealth}', '/', 100]}, {'%healthRegen': 0.1}, {'*healthRegen': 1.1}]),

    'level-paladin': jobAchievement([{'+block': 2, '+magicBlock': 1}, {'%block': 0.1, '%magicBlock': 0.1}, {'+block': ['{level}', '/', 2], '+magicBlock': ['{level}', '/', 4]}, {'*block': 1.1, '*magicBlock': 1.1}]),
    'level-darkknight': jobAchievement([{'+healthRegen': 2}, {'+healthRegen': ['{maxHealth}', '/', 100]}, {'%healthRegen': 0.1}, {'*healthRegen': 1.1}]),
    'level-enhancer': jobAchievement([{'+healthRegen': 2}, {'+healthRegen': ['{maxHealth}', '/', 100]}, {'%healthRegen': 0.1}, {'*healthRegen': 1.1}]),

    'level-dancer': jobAchievement([{'+evasion': 2}, {'%evasion': 0.1}, {'+evasion': ['{level}', '/', 2]}, {'*evasion': 1.1}]),
    'level-bard': jobAchievement([{'+healthRegen': 2}, {'+healthRegen': ['{maxHealth}', '/', 100]}, {'%healthRegen': 0.1}, {'*healthRegen': 1.1}]),
    'level-sage': jobAchievement([{'+healthRegen': 2}, {'+healthRegen': ['{maxHealth}', '/', 100]}, {'%healthRegen': 0.1}, {'*healthRegen': 1.1}]),

    'level-fool': jobAchievement([{'+healthRegen': 2}, {'+healthRegen': ['{maxHealth}', '/', 100]}, {'%healthRegen': 0.1}, {'*healthRegen': 1.1}]),
    'level-master': jobAchievement([{'+healthRegen': 2}, {'+healthRegen': ['{maxHealth}', '/', 100]}, {'%healthRegen': 0.1}, {'*healthRegen': 1.1}]),
};
function jobAchievement(bonusesArray) {
    return [
        {'targetLevel': 2, 'bonuses': bonusesArray[0]},
        {'targetLevel': 10, 'bonuses': bonusesArray[0]},
        {'targetLevel': 30, 'bonuses': bonusesArray[0]},
        {'targetLevel': 60, 'bonuses': bonusesArray[0]},
    ]
}
