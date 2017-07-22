
function createScaledFrame(r, frame, scale = 1) {
    // We want to scale the frame Nx its normal thickness, but we get bad smoothing if we do
    // this as we stretch pieces, so we stretch the edges at 1x scale, then draw the whole thing scaled
    // up at the very end.
    var smallCanvas = createCanvas(r.width / scale, r.height / scale);
    var smallContext = smallCanvas.getContext('2d');
    smallContext.imageSmoothingEnabled = false;
    // return bigFrameCanvas;
    var canvas = createCanvas(r.width, r.height);
    var context = canvas.getContext('2d');
    context.imageSmoothingEnabled = false;
    drawImage(smallContext, frame, rectangle(0, 0, 12, 12), rectangle(0, 0, 12, 12));
    drawImage(smallContext, frame, rectangle(28, 0, 12, 12), rectangle(r.width / scale - 12, 0, 12, 12));
    drawImage(smallContext, frame, rectangle(0, 28, 12, 12), rectangle(0, r.height / scale - 12, 12, 12));
    drawImage(smallContext, frame, rectangle(28, 28, 12, 12), rectangle(r.width / scale - 12, r.height / scale - 12, 12, 12));
    if (r.width > 24 * scale) {
        drawImage(smallContext, frame, rectangle(12, 0, 16, 12),
            rectangle(12, 0, r.width / scale - 24, 12));
        drawImage(smallContext, frame, rectangle(12, 28, 16, 12),
            rectangle(12, r.height / scale - 12, r.width / 2 - 24, 12));
    }
    if (r.height > 24 * scale) {
        drawImage(smallContext, frame, rectangle(0, 12, 12, 16),
            rectangle(0, 12, 12, r.height / 2 - 24));
        drawImage(smallContext, frame, rectangle(28, 12, 12, 16),
            rectangle(r.width / 2 - 12, 12, 12, r.height / 2 - 24));
    }
    drawImage(context, smallCanvas, rectangle(0, 0, r.width / scale, r.height / scale), r);
    return canvas;
}
var goldFrame, silverFrame;
var tinyGoldFrame, tinySilverFrame;
var actionShortcuts = {};
var actionKeyCodes = '1234567890'.split('').map(character => {return character.charCodeAt(0)});
function drawSkills(actor) {
    var context = mainContext;
    context.font = "10px Arial";
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    var frameSize = 10;
    var size = 40;
    var tinySize = 20;
    var totalSize = size + 2 * frameSize;
    if (!goldFrame) goldFrame = createScaledFrame(rectangle(0, 0, totalSize, totalSize), requireImage('gfx/goldFrame.png'), 2);
    if (!silverFrame) silverFrame = createScaledFrame(rectangle(0, 0, totalSize, totalSize), requireImage('gfx/silverFrame.png'), 2);
    if (!tinyGoldFrame) tinyGoldFrame = createScaledFrame(rectangle(0, 0, tinySize, tinySize), requireImage('gfx/goldFrame.png'));
    if (!tinySilverFrame) tinySilverFrame = createScaledFrame(rectangle(0, 0, tinySize, tinySize), requireImage('gfx/silverFrame.png'));
    var margin = 20;
    var padding = 2;
    var top = mainCanvas.height - 30 - margin - totalSize; // 30 is the height of the minimap.
    var left = 60 + margin; // 60 pixels to make room for the return to map button.
    actionShortcuts = {};
    var keysLeft = actionKeyCodes.slice();
    for (var action of actor.actions) {
        if (action.tags.basic) continue;
        action.target = rectangle(left, top, totalSize, totalSize);
        action.onClick = onClickSkill;
        var iconSource = getAbilityIconSource(action.ability);
        context.fillStyle = 'white';
        fillRectangle(context, shrinkRectangle(action.target, 2));
        drawAbilityIcon(context, iconSource, shrinkRectangle(action.target, frameSize));
        var frame = silverFrame;
        var tinyFrame = tinySilverFrame;
        if (isSkillActive(action)) {
            frame = goldFrame;
            tinyFrame = tinyGoldFrame;
        }
        var cooldown = action.readyAt - actor.time;
        if (cooldown > 0) {
            var percent = cooldown / action.cooldown;
            context.save();
            context.globalAlpha = .7;
            context.fillStyle = 'black';
            //fillRectangle(context, shrinkRectangle(action.target, totalSize * percent / 2));
            context.beginPath();
            var r = action.target;
            if (percent < 1) context.moveTo(r.left + r.width / 2, r.top + r.height / 2);
            context.arc(r.left + r.width / 2, r.top + r.height / 2, totalSize / 2, -Math.PI / 2 - percent * 2 * Math.PI, -Math.PI / 2);
            if (percent < 1) context.closePath();
            //drawRectangle(context, shrinkRectangle(action.target, frameSize));
            context.fill('evenodd');

            context.restore();
        }
        drawImage(context, frame, rectangle(0, 0, totalSize, totalSize), action.target);
        var actionKeyCode = keysLeft.length ? keysLeft.shift() : null;
        if (actionKeyCode) {
            actionShortcuts[actionKeyCode] = action;
            var tinyTarget = rectangle(
                    action.target.left + action.target.width - frameSize - 6,
                    action.target.top + action.target.height - frameSize - 6, tinySize, tinySize);
            context.fillStyle = 'white';
            fillRectangle(context, shrinkRectangle(tinyTarget, 1));
            drawImage(context, tinyFrame, rectangle(0, 0, tinySize, tinySize), tinyTarget);
            context.fillStyle = 'black';
            context.fillText(String.fromCharCode(actionKeyCode), tinyTarget.left + tinyTarget.width / 2, tinyTarget.top + tinyTarget.height / 2);
            action.shortcutTarget = tinyTarget;
        } else {
            action.shortcutTarget = null;
        }
        // Display the Manual/Auto indicator.
        var tinyTarget = rectangle(action.target.left + frameSize + 6 - tinySize, action.target.top + frameSize + 6 - tinySize, tinySize, tinySize);
        context.fillStyle = 'white';
        fillRectangle(context, shrinkRectangle(tinyTarget, 1));
        context.fillStyle = 'black';
        var letter;
        if (actor.character.autoplay) letter = actor.character.manualActions[action.base.key] ? 'M' : 'A';
        else letter = actor.character.autoActions[action.base.key] ? 'A' : 'M';
        drawImage(context, ((letter === 'M') ? tinySilverFrame : tinyGoldFrame), rectangle(0, 0, tinySize, tinySize), tinyTarget);
        context.fillText(letter, tinyTarget.left + tinyTarget.width / 2, tinyTarget.top + tinyTarget.height / 2);
        if (!action.toggleButton) {
            action.toggleButton = {
                'onClick': onClickAutoToggle,
                action,
                'helpMethod': autoToggleHelpMethod
            };
        }
        action.toggleButton.target = tinyTarget;
        left += totalSize + padding;
    }
}

var selectedAction = null, hoverAction = null;
function onClickSkill(character, action) {
    activateAction(action);
}

function onClickAutoToggle(character, toggleButton) {
    var action = this.action;
    if (character.autoplay) {
        character.manualActions[action.base.key] = !ifdefor(character.manualActions[action.base.key], false);
    } else {
        character.autoActions[action.base.key] = !ifdefor(character.autoActions[action.base.key], false);
    }
}
function autoToggleHelpMethod() {
    var action = this.action;
    var character = action.actor.character;
    if (character.autoplay) {
        if (character.manualActions[action.base.key]) {
            return 'Manual';
        } else {
            return 'Auto'
        }
    } else {
        if (character.autoActions[action.base.key]) {
            return 'Auto';
        } else {
            return 'Manual'
        }
    }
}

function getAbilityPopupTarget(x, y) {
    hoverAction = null;
    for (var action of state.selectedCharacter.adventurer.actions) {
        if (action.tags.basic) continue;
        // toggleButton doesn't get set until the ability is drawn the first time.
        if (isPointInRectObject(x, y, action.toggleButton && action.toggleButton.target)) {
            return action.toggleButton;
        }
        if (isPointInRectObject(x, y, action.target) || isPointInRectObject(x, y, action.shortcutTarget)) {
            hoverAction = action;
            action.helpMethod = actionHelptText;
            return action;
        }
    }
    return null;
}

function actionHelptText(action) {
    return abilityHelpText(action.ability, action.actor);
}

// Skill is active if it is selected, or if the hero is performing/attempting to perform the skill.
function isSkillActive(action) {
    var hero = state.selectedCharacter.hero;
    return action == selectedAction
        || action == hero.skillInUse
        || (hero.activity && hero.activity.action == action);
}

function handleSkillKeyInput(keyCode) {
    var action = actionShortcuts[keyCode];
    if (!action) return false;
    activateAction(action);
    return true;
}

function activateAction(action) {
    if (action.readyAt > action.actor.time) return;
    // If a skill has no target, trigger it as soon as they click the skill button.
    if (action.base.target === 'none') {
        if (canUseSkillOnTarget(action.actor, action, action.actor)) {
            prepareToUseSkillOnTarget(action.actor, action, action.actor);
        }
    } else {
        if (selectedAction === action) selectedAction = null;
        else selectedAction = action;
    }
}
function drawTargetCircle(context, area, x, z, radius, alpha) {
    var centerY = groundY - z / 2;
    var centerX = x - area.cameraX;
    context.save();
    context.translate(centerX, centerY);
    context.scale(1, .5);
    context.globalAlpha = alpha;
    context.fillStyle = '#0FF';
    context.beginPath();
    context.arc(0, 0, radius * 32 + 32, 0, 2 * Math.PI);
    context.fill();
    context.globalAlpha = 1;
    context.lineWidth = 5;
    context.strokeStyle = '#0FF';
    context.stroke();
    context.restore();
}

function drawActionTargetCircle(targetContext) {
    var action = hoverAction;
    if (!action) action = selectedAction;
    if (!action) {
        var hero = state.selectedCharacter.hero;
        action = hero.activity ? hero.activity.action : null;
    }
    if (!action) return;
    var context = bufferContext;
    context.clearRect(0,0, bufferCanvas.width, bufferCanvas.height);
    var area = editingLevelInstance ? editingLevelInstance : action.actor.area;
    drawTargetCircle(context, area, action.actor.x, ifdefor(action.actor.z), ifdefor(action.range, action.area), .1);
    var targetLocation = getTargetLocation(area, canvasCoords[0], canvasCoords[1]);
    //console.log([targetLocation, targetLocation && canUseSkillOnTarget(action.actor, action, targetLocation)]);
    if (targetLocation && canUseSkillOnTarget(action.actor, action, targetLocation)) {
        drawTargetCircle(context, area, targetLocation.x, targetLocation.z, action.area || .5, .3);
    }
    drawImage(targetContext, bufferCanvas, rectangle(0, 300, bufferCanvas.width, 180), rectangle(0, 300, bufferCanvas.width, 180));
}
