/**
 * The achievement system allows player to unlock decorations for their guild by meeting
 * certain criteria, like leveling a job a certain amount or killing a certain number of enemies.
 *
 * The decorations are either wall decorations that can be hung in specified locations on walls,
 * or trophies that can be placed on specific pedestals.
 */
var altarTrophies = {
    'level-juggler': jobAchievement('juggler', [{'+accuracy': 1}, {'%attackSpeed': 0.1}, {'+attackSpeed': 0.1}, {'*attackSpeed': 1.1}]),
    'level-ranger': jobAchievement('ranger', [{'+accuracy': 2}, {'+ranged:range': 0.5}, {'+ranged:range': 0.5, '+ranged:physicalDamage': 5}, {'*ranged:damage': 1.1}]),
    'level-sniper': jobAchievement('sniper', [{'+accuracy': 3}, {'+healthRegen': ['{maxHealth}', '/', 100]}, {'%healthRegen': 0.1}, {'*healthRegen': 1.1}]),

    'level-priest': jobAchievement('priest', [{'+healthRegen': 2}, {'+healthRegen': ['{maxHealth}', '/', 100]}, {'%healthRegen': 0.1}, {'*healthRegen': 1.1}]),
    'level-wizard': jobAchievement('wizard', [{'+healthRegen': 2}, {'+healthRegen': ['{maxHealth}', '/', 100]}, {'%healthRegen': 0.1}, {'*healthRegen': 1.1}]),
    'level-sorcerer': jobAchievement('sorcerer', [{'+healthRegen': 2}, {'+healthRegen': ['{maxHealth}', '/', 100]}, {'%healthRegen': 0.1}, {'*healthRegen': 1.1}]),

    'level-blackbelt': jobAchievement('blackbelt', [{'+maxHealth': 15}, {'%maxHealth': 0.1}, {'+maxHealth': ['{level}', '*', 3]}, {'*maxHealth': 1.1}]),
    'level-warrior': jobAchievement('warrior', [{'+armor': 2}, {'%armor': 0.1}, {'+armor': ['{level}', '/', 2]}, {'*armor': 1.1}]),
    'level-samurai': jobAchievement('samurai', [{'+physicalDamage': 2}, {'%physicalDamage': 0.1}, {'+physicalDamage': ['{level}', '/', 4]}, {'*physicalDamage': 1.1}]),

    'level-corsair': jobAchievement('corsair', [{'+healthRegen': 2}, {'+healthRegen': ['{maxHealth}', '/', 100]}, {'%healthRegen': 0.1}, {'*healthRegen': 1.1}]),
    'level-assassin': jobAchievement('assassin', [{'+healthRegen': 2}, {'+healthRegen': ['{maxHealth}', '/', 100]}, {'%healthRegen': 0.1}, {'*healthRegen': 1.1}]),
    'level-ninja': jobAchievement('ninja', [{'+healthRegen': 2}, {'+healthRegen': ['{maxHealth}', '/', 100]}, {'%healthRegen': 0.1}, {'*healthRegen': 1.1}]),

    'level-paladin': jobAchievement('paladin', [{'+block': 2, '+magicBlock': 1}, {'%block': 0.1, '%magicBlock': 0.1}, {'+block': ['{level}', '/', 2], '+magicBlock': ['{level}', '/', 4]}, {'*block': 1.1, '*magicBlock': 1.1}]),
    'level-darkknight': jobAchievement('darkknight', [{'+healthRegen': 2}, {'+healthRegen': ['{maxHealth}', '/', 100]}, {'%healthRegen': 0.1}, {'*healthRegen': 1.1}]),
    'level-enhancer': jobAchievement('enhancer', [{'+healthRegen': 2}, {'+healthRegen': ['{maxHealth}', '/', 100]}, {'%healthRegen': 0.1}, {'*healthRegen': 1.1}]),

    'level-dancer': jobAchievement('dancer', [{'+evasion': 2}, {'%evasion': 0.1}, {'+evasion': ['{level}', '/', 2]}, {'*evasion': 1.1}]),
    'level-bard': jobAchievement('bard', [{'+healthRegen': 2}, {'+healthRegen': ['{maxHealth}', '/', 100]}, {'%healthRegen': 0.1}, {'*healthRegen': 1.1}]),
    'level-sage': jobAchievement('sage', [{'+healthRegen': 2}, {'+healthRegen': ['{maxHealth}', '/', 100]}, {'%healthRegen': 0.1}, {'*healthRegen': 1.1}]),

    'level-fool': jobAchievement('fool', [{'+healthRegen': 2}, {'+healthRegen': ['{maxHealth}', '/', 100]}, {'%healthRegen': 0.1}, {'*healthRegen': 1.1}]),
    'level-master': jobAchievement('master', [{'+healthRegen': 2}, {'+healthRegen': ['{maxHealth}', '/', 100]}, {'%healthRegen': 0.1}, {'*healthRegen': 1.1}]),
};
function jobAchievement(jobKey, bonusesArray) {
    return {'jobKey': jobKey, 'bonusesArray': [
                {'targetLevel': 2, 'bonuses': bonusesArray[0]},
                {'targetLevel': 10, 'bonuses': bonusesArray[0]},
                {'targetLevel': 30, 'bonuses': bonusesArray[0]},
                {'targetLevel': 60, 'bonuses': bonusesArray[0]},
            ], 'draw': drawJobAchievement, 'helpMethod': getJobAchievementHelpText, 'onClick': selectTrophy};
}
function drawJobAchievement(context, target) {
    jobIcons[this.jobKey].drawImage(context, target);
}
function getJobAchievementHelpText() {
    var job = characterClasses[this.jobKey];
    return 'Level ' + job.name;
}
function selectTrophy(character) {
    if (choosingTrophyAltar.trophy === this) choosingTrophyAltar.trophy = null;
    else choosingTrophyAltar.trophy = this;
    choosingTrophyAltar = null;
}
var choosingTrophyAltar = false;
var trophyRectangle = rectangle(200, 100, 400, 300);

function drawTrophySelection() {
    mainContext.fillStyle = '#888';
    mainContext.fillRect(trophyRectangle.left, trophyRectangle.top, trophyRectangle.width, trophyRectangle.height);
    var trophySize = 50;
    var trophySpacing = 5;
    var checkSource = {'left': 68, 'top': 90, 'width': 16, 'height': 16};
    var left = 5;
    var top = 5;
    for (var trophyKey in altarTrophies) {
        var trophy = altarTrophies[trophyKey];
        trophy.left = trophyRectangle.left + left;
        trophy.top = trophyRectangle.top + top;
        trophy.width = trophy.height = trophySize;
        trophy.draw(mainContext, trophy);
        if (choosingTrophyAltar.trophy && choosingTrophyAltar.trophy === trophy) {
            var target = {'left': trophy.left + trophy.width - 20, 'top': trophy.top + trophy.height - 20, 'width': 16, 'height': 16};
            mainContext.fillStyle = 'white';
            mainContext.strokeStyle = 'black';
            mainContext.lineThickness = 2;
            mainContext.beginPath();
            mainContext.arc(target.left + target.width / 2, target.top + target.height / 2, 10, 0, 2*Math.PI);
            mainContext.fill();
            mainContext.stroke();
            drawImage(mainContext, requireImage('gfx/militaryIcons.png'), checkSource, target);
        }
        left += trophySize + trophySpacing;
        if (left + trophySize + trophySpacing > trophyRectangle.width) {
            left = 5;
            top += trophySize + trophySpacing;
        }
    }
}
function getTrophyPopupTarget(x, y) {
    for (var trophyKey in altarTrophies) {
        var trophy = altarTrophies[trophyKey];
        if (isPointInRectObject(x, y, trophy)) return trophy;
    }
    return null;
}
