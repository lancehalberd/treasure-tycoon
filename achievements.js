/**
 * The achievement system allows player to unlock decorations for their guild by meeting
 * certain criteria, like leveling a job a certain amount or killing a certain number of enemies.
 *
 * The decorations are either wall decorations that can be hung in specified locations on walls,
 * or trophies that can be placed on specific pedestals.
 */
var choosingTrophyAltar = false;
var trophySize = 50;
var trophyRectangle = rectangle(200, 100, 400, 300);
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
    var job = characterClasses[jobKey];
    return {'jobKey': jobKey, 'title': job.name + ' Trophy', 'level': 0, 'value': 0, 'width': trophySize, 'height': trophySize, 'bonusesArray': [
                {'target': 2, 'bonuses': bonusesArray[0]},
                {'target': 10, 'bonuses': bonusesArray[1]},
                {'target': 30, 'bonuses': bonusesArray[2]},
                {'target': 60, 'bonuses': bonusesArray[3]},
            ], 'draw': drawJobAchievement, 'drawWithOutline': drawJobAchievementWithOutline,
                'helpMethod': getJobAchievementHelpText, 'onClick': selectTrophy};
}
function drawJobAchievement(context, target) {
    if (this.level === 0 ) {
        context.save();
        context.globalAlpha = .5;
        drawSourceAsSolidTint(context, jobIcons[this.jobKey], 'black', target);
        context.restore();
        return;
    }
    var color = ['#F84', '#EA4', '#CCD', '#FF8', '#EEE'][this.level - 1];
    drawSourceAsSolidTint(context, jobIcons[this.jobKey], color, target);
    context.save();
    context.globalAlpha = .1;
    jobIcons[this.jobKey].draw(context, target);
    context.restore();
}
function drawJobAchievementWithOutline(context, color, thickness, target) {
    drawSourceWithOutline(context, jobIcons[this.jobKey], color, thickness, target);
    this.draw(context, target);
}
function getJobAchievementHelpText() {
    if (this.value === 0) return '??? Trophy';
    var parts = [this.title, 'Highest Level: ' + this.value];
    for (var i = 0; i < this.bonusesArray.length; i++) {
        var textColor = (this.level > i) ? 'white' : '#888';
        var levelData = this.bonusesArray[i];
        var levelText = '<div style="color: ' + textColor + ';">Level ' + levelData.target + ':<div style="margin-left: 20px;">'
            + bonusSourceHelpText(levelData, state.selectedCharacter.adventurer)
            + '</div></div>';
        parts.push(levelText);
    }
    return parts.join('<br/>');
}
function selectTrophy(character) {
    // A trophy must be at least level 1 to be used.
    if (!(this.level > 0)) return;
    // If this trophy is already placed somewhere, remove it.
    var oldAltar = null;
    var currentTrophy = choosingTrophyAltar.trophy;
    if (this.areaKey) {
        oldAltar = guildAreas[this.areaKey].objectsByKey[this.objectKey];
        oldAltar.trophy = null;
        this.areaKey = null;
        this.objectKey = null;
        removeTrophyBonuses(this);
    }
    // remove whatever trophy is currently there, if any.
    if (currentTrophy && currentTrophy !== this) {
        // If we moved another trophy to replace this trophy, move this trophy
        // back to the old trophies altar.
        if (oldAltar) {
            currentTrophy.areaKey = oldAltar.area.key;
            currentTrophy.objectKey = oldAltar.key;
            oldAltar.trophy = currentTrophy;
        } else {
            currentTrophy.areaKey = null;
            currentTrophy.objectKey = null;
            choosingTrophyAltar.trophy = null;
            removeTrophyBonuses(currentTrophy);
        }
    }
    // If this is not the removed trophy, add this trophy to the altar.
    if (currentTrophy !== this) {
        addTrophyToAltar(choosingTrophyAltar, this);
    }
    choosingTrophyAltar = null;
    recomputeAllCharacterDirtyStats();
    checkIfAltarTrophyIsAvailable();
    saveGame();
}
function addTrophyToAltar(altar, trophy) {
    trophy.areaKey = altar.area.key;
    trophy.objectKey = altar.key;
    altar.trophy = trophy;
    addTrophyBonuses(trophy);
}

function drawTrophySelection() {
    mainContext.fillStyle = '#888';
    mainContext.fillRect(trophyRectangle.left, trophyRectangle.top, trophyRectangle.width, trophyRectangle.height);
    var trophySpacing = 5;
    var checkSource = {'left': 68, 'top': 90, 'width': 16, 'height': 16};
    var left = 5;
    var top = 5;
    for (var trophyKey in altarTrophies) {
        var trophy = altarTrophies[trophyKey];
        trophy.left = trophyRectangle.left + left;
        trophy.top = trophyRectangle.top + top;
        trophy.draw(mainContext, trophy);
        if (trophy.areaKey) {
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

function updateTrophy(trophyKey, value) {
    var trophy = altarTrophies[trophyKey];
    trophy.value = Math.max(trophy.value, value);
    for (var i = 0; i < trophy.bonusesArray.length; i++) {
        if (trophy.bonusesArray[i].target > trophy.value) {
            break;
        }
    }
    if (i === trophy.level) return;
    // If we are changing the level of the trophy, and the trophy is on display, we need to
    // remove its bonuses, then add them again after changing the level.
    if (trophy.area) removeTrophyBonuses(trophy);
    trophy.level = i;
    if (trophy.area) addTrophyBonuses(trophy);
    // This may be a newly available trophy, so update trophy availability.
    checkIfAltarTrophyIsAvailable();
    showTophyPopup(trophy);
}

function addTrophyBonuses(trophy, recompute) {
    for (var i = 0; i < trophy.bonusesArray.length && i < trophy.level; i++) {
        var bonusSource = trophy.bonusesArray[i];
        if (guildBonusSources.indexOf(bonusSource) >= 0) {
            console.log(bonusSource);
            console.log(guildBonusSources);
            throw new Error('bonus source was already present in guildBonusSources!');
        }
        guildBonusSources.push(bonusSource);
        for (var character of state.characters) {
            addBonusSourceToObject(character.adventurer, bonusSource);
            //console.log(bonusSource.bonuses);
        }
    }
    if (recompute) recomputeAllCharacterDirtyStats();
}
function removeTrophyBonuses(trophy, recompute) {
    for (var i = 0; i < trophy.bonusesArray.length && i < trophy.level; i++) {
        var bonusSource = trophy.bonusesArray[i];
        if (guildBonusSources.indexOf(bonusSource) < 0) {
            console.log(bonusSource);
            console.log(guildBonusSources);
            throw new Error('bonus source was not found in guildBonusSources!');
        }
        guildBonusSources.splice(guildBonusSources.indexOf(bonusSource), 1);
        for (var character of state.characters) {
            removeBonusSourceFromObject(character.adventurer, bonusSource);
            //console.log(bonusSource.bonuses);
        }
    }
    if (recompute) recomputeAllCharacterDirtyStats();
}

function recomputeAllCharacterDirtyStats() {
    for (var character of state.characters) recomputeDirtyStats(character.adventurer);
}

var isAltarTrophyAvailable = false;
function checkIfAltarTrophyIsAvailable() {
    isAltarTrophyAvailable = false;
    for (var trophyKey in altarTrophies) {
        var trophy = altarTrophies[trophyKey];
        if (trophy.level >0 && !trophy.areaKey) {
            isAltarTrophyAvailable = true;
            break;
        }
    }
}

var trophyPopups = [];
var trophyPopupWidth = 160;
var trophyPopupHeight = 80;

function showTophyPopup(trophy) {
    var lastPopup;
    if (trophyPopups.length) {
        lastPopup = trophyPopups[trophyPopups.length - 1];
    }
    trophyPopups.push({
        'left': Math.min(800, (lastPopup ? lastPopup.left : 800)) - 5 - trophyPopupWidth,
        'top': 600,
        'width': trophyPopupWidth, 'height': trophyPopupHeight,
        'trophy': trophy,
        'time': 0,
        'onClick': function () {
            this.dismissed = true;
        }
    });
}
function updateTrophyPopups() {
    var previousPopup;
    for (var trophyPopup of trophyPopups) {
        if (!trophyPopup.dismissed && previousPopup && trophyPopup.left < previousPopup.left - 5 - trophyPopupWidth) {
            trophyPopup.left = Math.min(trophyPopup.left + 10, 800 - 5 - trophyPopupWidth);
        }
        previousPopup = trophyPopup;
        if (trophyPopup.dismissed) {
            if (trophyPopup.left < 800) {
                trophyPopup.left += 10;
            } else {
                trophyPopups.splice(trophyPopups.indexOf(trophyPopup), 1);
            }
            continue;
        } else {

        }
        if (trophyPopup.top > 600 - 5 - trophyPopupHeight) {
            trophyPopup.top -= 10;
        } else if (trophyPopup.time < 3) {
            trophyPopup.time += .02;
        } else {
            trophyPopup.dismissed = true;
        }
    }
}

function drawTrophyPopups() {
    for (var trophyPopup of trophyPopups) {
        mainContext.save();
        mainContext.globalAlpha = .4;
        mainContext.fillStyle = 'black';
        mainContext.fillRect(trophyPopup.left, trophyPopup.top, trophyPopup.width, trophyPopup.height);
        mainContext.restore();
        mainContext.strokeStyle = 'white';
        mainContext.strokeRect(trophyPopup.left, trophyPopup.top, trophyPopup.width, trophyPopup.height);
        trophyPopup.trophy.draw(mainContext, {'left': trophyPopup.left + 5, 'top': trophyPopup.top + (trophyPopupHeight - trophySize) / 2, 'width': trophySize, 'height': trophySize});
        mainContext.fillStyle = '#999';
        mainContext.font = '16px sans-serif';
        mainContext.textAlign = 'left'
        mainContext.textBaseline = 'middle';
        //context.fillText(levelData.coords.map(function (number) { return number.toFixed(0);}).join(', '), levelData.left + 20, levelData.top + 45);
        mainContext.fillText('Unlocked', trophyPopup.left + 5 + trophySize + 5, trophyPopup.top + 20);
        mainContext.fillStyle = 'white';
        mainContext.font = '18px sans-serif';
        var titleParts = trophyPopup.trophy.title.split(' ');
        var line = titleParts.shift();
        var textLeft = trophyPopup.left + 5 + trophySize + 5;
        var textBaseLine = trophyPopup.top + 40;
        while (titleParts.length) {
            var metrics = mainContext.measureText(line + ' ' + titleParts[0]);
            if (textLeft + metrics.width + 5 > trophyPopup.left + trophyPopup.width) {
                mainContext.fillText(line, textLeft, textBaseLine);
                textBaseLine += 20;
                line = titleParts.shift();
            } else {
                line += ' ' + titleParts.shift();
            }
        }
        if (line) mainContext.fillText(line, textLeft, textBaseLine);
    }
}
