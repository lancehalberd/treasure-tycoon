/**
 * The achievement system allows player to unlock decorations for their guild by meeting
 * certain criteria, like leveling a job a certain amount or killing a certain number of enemies.
 *
 * The decorations are either wall decorations that can be hung in specified locations on walls,
 * or trophies that can be placed on specific pedestals.
 */
var choosingTrophyAltar = false;
var trophySize = 50;
var altarTrophies = {
    'level-juggler': jobAchievement('juggler',
        [{'+accuracy': 1}, {'%attackSpeed': 0.1}, {'+attackSpeed': 0.1}, {'*attackSpeed': 1.1}]),
    'level-ranger': jobAchievement('ranger',
        [{'+accuracy': 2}, {'+ranged:range': 0.5}, {'+ranged:range': 0.5, '+ranged:physicalDamage': 5}, {'*ranged:damage': 1.1}]),
    'level-sniper': jobAchievement('sniper',
        [{'+accuracy': 3}, {'%critChance': 0.1}, {'+critChance': 0.02}, {'*critChance': 1.1}]),

    'level-priest': jobAchievement('priest',
        [{'+healthRegen': 2}, {'+healthRegen': ['{maxHealth}', '/', 100]}, {'%healthRegen': 0.1}, {'*healthRegen': 1.1}]),
    'level-wizard': jobAchievement('wizard',
        [{'+magicPower': 2}, {'+spell:area': 0.5}, {'%spell:area': 0.1}, {'*spell:area': 1.1}]),
    'level-sorcerer': jobAchievement('sorcerer',
        [{'+magicDamage': 1}, {'%magicDamage': 0.1}, {'+magicDamage': ['{level}', '/', 8]}, {'*magicDamage': 1.1}]),

    'level-blackbelt': jobAchievement('blackbelt',
        [{'+maxHealth': 15}, {'%maxHealth': 0.1}, {'+maxHealth': ['{level}', '*', 3]}, {'*maxHealth': 1.1}]),
    'level-warrior': jobAchievement('warrior',
        [{'+armor': 2}, {'%armor': 0.1}, {'+armor': ['{level}', '/', 2]}, {'*armor': 1.1}]),
    'level-samurai': jobAchievement('samurai',
        [{'+physicalDamage': 2}, {'%physicalDamage': 0.1}, {'+physicalDamage': ['{level}', '/', 4]}, {'*physicalDamage': 1.1}]),

    'level-corsair': jobAchievement('corsair',
        [{'+critAccuracy': .1}, {'%critAccuracy': 0.1}, {'+critAccuracy': 0.2}, {'*critAccuracy': 1.1}]),
    'level-assassin': jobAchievement('assassin',
        [{'+critDamage': .05}, {'%critDamage': 0.1}, {'+critDamage': 0.1}, {'*critDamage': 1.1}]),
    'level-ninja': jobAchievement('ninja',
        [{'+speed': 5}, {'%speed': 0.1}, {'+speed': 10}, {'*speed': 1.1}]),

    'level-paladin': jobAchievement('paladin',
        [{'+block': 2, '+magicBlock': 1}, {'%block': 0.1, '%magicBlock': 0.1}, {'+block': ['{level}', '/', 2], '+magicBlock': ['{level}', '/', 4]}, {'*block': 1.1, '*magicBlock': 1.1}]),
    'level-darkknight': jobAchievement('darkknight',
        [{'+magicResist': .01}, {'%magicResist': 0.1}, {'+magicResist': 0.02}, {'*magicResist': 1.1}]),
    'level-enhancer': jobAchievement('enhancer',
        [{'+dexterity': 1, '+strength': 1, '+intelligence': 1}, {'%dexterity': 1.05, '%strength': 1.05, '%intelligence': 1.05},
         {'+dexterity': 2, '+strength': 2, '+intelligence': 2}, {'*dexterity': 1.05, '*strength': 1.05, '*intelligence': 1.05}]),

    'level-dancer': jobAchievement('dancer',
        [{'+evasion': 2}, {'%evasion': 0.1}, {'+evasion': ['{level}', '/', 2]}, {'*evasion': 1.1}]),
    'level-bard': jobAchievement('bard',
        [{'+duration': 0.5}, {'%duration': 0.1}, {'+duration': 1}, {'*duration': 1.1}]),
    'level-sage': jobAchievement('sage',
        [{'+magicPower': 5}, {'%magicPower': .1}, {'+magicPower': 10}, {'*magicPower': 1.1}]),

    'level-fool': jobAchievement('fool',
        [{'+critDamage': 0.2, '-critChance': 0.01}, {'%critDamage': 0.4, '%critChance': -0.4},
        {'+critDamage': 1, '-critChance': 0.05}, {'*critDamage': 1.2, '*critChance': 0.8}]),
    'level-master': jobAchievement('master',
        [{'+weaponRange': 0.5}, {'%weaponRange': 0.1}, {'+weaponRange': 1}, {'*weaponRange': 1.1}]),
};
function jobAchievement(jobKey, bonusesArray) {
    var job = characterClasses[jobKey];
    return {jobKey, 'title': job.name + ' Trophy', 'level': 0, 'value': 0, 'width': trophySize, 'height': trophySize, 'bonusesArray': [
                {'target': 2, 'bonuses': bonusesArray[0]},
                {'target': 10, 'bonuses': bonusesArray[1]},
                {'target': 30, 'bonuses': bonusesArray[2]},
                {'target': 60, 'bonuses': bonusesArray[3]},
            ], 'draw': drawJobAchievement, 'drawWithOutline': drawJobAchievementWithOutline,
                'helpMethod': getJobAchievementHelpText, 'onClick': selectTrophy};
}
function drawJobAchievement(context, target) {
    var jobTrophyImage = characterClasses[this.jobKey].achievementImage;
    var level = this.level;
    if (level === 0 ) {
        context.save();
        drawSolidTintedImage(context, jobTrophyImage, '#666', {'left': 0, 'top': 0, 'width': 40, 'height': 40}, target);
        context.restore();
        return;
    }
    var color;
    if (level === 5) {
        // glow based on cursor distance
        var g = '30';
        if (canvasCoords && canvasCoords.length) {
            var dx = canvasCoords[0] - (target.left + target.width / 2);
            var dy = canvasCoords[1] - (target.top + target.height / 2);
            g = Math.max(48, Math.round(112 - Math.max(0, (dx * dx + dy * dy) / 100 - 20))).toString(16);
        }
        // glow in time
        //var g = Math.round(64 + 32 * (1 + Math.sin(now() / 400)) / 2).toString(16);
        if (g.length < 2) g = '0' + g;
        color ='#FF' + g + 'FF';
    } else {
        color = ['#C22', '#F84', '#CCD', '#FC0', '#F4F'][level - 1];
    }
    drawSolidTintedImage(context, jobTrophyImage, color, {'left': 0, 'top': 0, 'width': 40, 'height': 40}, target);
    drawImage(context, jobTrophyImage, {'left': 41, 'top': 0, 'width': 40, 'height': 40}, target);
}
function drawJobAchievementWithOutline(context, color, thickness, target) {
    var jobTrophyImage = characterClasses[this.jobKey].achievementImage;
    drawOutlinedImage(context, jobTrophyImage, 'white', 2, {'left': 0, 'top': 0, 'width': 40, 'height': 40}, target);
    //drawSourceWithOutline(context, jobIcons[this.jobKey], color, thickness, target);
    this.draw(context, target);
}
function getJobAchievementHelpText() {
    if (this.value === 0) return titleDiv('Mysterious Trophy') + bodyDiv('???');
    var parts = [];
    for (var i = 0; i < this.bonusesArray.length; i++) {
        var textColor = (this.level > i) ? 'white' : '#888';
        var levelData = this.bonusesArray[i];
        var levelText = '<div style="color: ' + textColor + ';">Level ' + levelData.target + ':<div>'
            + bonusSourceHelpText(levelData, state.selectedCharacter.adventurer)
            + '</div></div>';
        parts.push(levelText);
    }
    return titleDiv(this.title) + bodyDiv('Highest Level: ' + this.value + divider + parts.join('<br />'));
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

var trophyRectangle = rectangle(195, 100, 410, 300);
function drawTrophySelection() {
    drawRectangleBackground(mainContext, trophyRectangle);
    var trophySpacing = 5;
    var checkSource = {'left': 68, 'top': 90, 'width': 16, 'height': 16};
    var left = 10;
    var top = 10;
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
        if (left + trophySize + trophySpacing > trophyRectangle.width - 10) {
            left = 10;
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
    if (trophy.areaKey) {
        removeTrophyBonuses(trophy);
    }
    trophy.level = i;
    if (trophy.areaKey) {
        addTrophyBonuses(trophy, true);
    }
    // This may be a newly available trophy, so update trophy availability.
    checkIfAltarTrophyIsAvailable();
    showTrophyPopup(trophy);
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
    recomputeDirtyStats(state.guildStats);
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

function showTrophyPopup(trophy) {
    var lastPopup;
    if (trophyPopups.length) {
        lastPopup = trophyPopups[trophyPopups.length - 1];
    }
    trophyPopups.push({
        'left': Math.min(800, (lastPopup ? lastPopup.left : 800)) - 5 - trophyPopupWidth,
        'top': 600,
        'width': trophyPopupWidth, 'height': trophyPopupHeight,
        trophy,
        'time': 0,
        onClick() {
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
        } else if (trophyPopup.time < 5) {
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
        mainContext.textAlign = 'left'
        mainContext.textBaseline = 'middle';
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
