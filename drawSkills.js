
function createScaledFrame(r, frame) {
    // We want to scale the frame 2x its normal thickness, but we get bad smoothing if we do
    // this as we skew pieces, so we skew the edges at 1x scale, then draw the whole thing scaled
    // up at the very end.
    var smallCanvas = createCanvas(r.width / 2, r.height / 2);
    var smallContext = smallCanvas.getContext('2d');
    smallContext.imageSmoothingEnabled = false
    // return bigFrameCanvas;
    var canvas = createCanvas(r.width, r.height);
    var context = canvas.getContext('2d');
    context.imageSmoothingEnabled = false
    drawImage(smallContext, frame, rectangle(0, 0, 12, 12), rectangle(0, 0, 12, 12));
    drawImage(smallContext, frame, rectangle(28, 0, 12, 12), rectangle(r.width / 2 - 12, 0, 12, 12));
    drawImage(smallContext, frame, rectangle(0, 28, 12, 12), rectangle(0, r.height / 2 - 12, 12, 12));
    drawImage(smallContext, frame, rectangle(28, 28, 12, 12), rectangle(r.width / 2 - 12, r.height / 2 - 12, 12, 12));
    if (r.width > 48) {
        drawImage(smallContext, frame, rectangle(12, 0, 16, 12),
            rectangle(12, 0, r.width / 2 - 24, 12));
        drawImage(smallContext, frame, rectangle(12, 28, 16, 12),
            rectangle(12, r.height / 2 - 12, r.width / 2 - 24, 12));
    }
    if (r.height > 48) {
        drawImage(smallContext, frame, rectangle(0, 12, 12, 16),
            rectangle(0, 12, 12, r.height / 2 - 24));
        drawImage(smallContext, frame, rectangle(28, 12, 12, 16),
            rectangle(r.width / 2 - 12, 12, 12, r.height / 2 - 24));
    }
    drawImage(context, smallCanvas, rectangle(0, 0, r.width / 2, r.height / 2), r);
    return canvas;
}
var goldFrame, silverFrame;

function drawSkills(actor) {
    var context = mainContext;
    var frameSize = 10;
    var size = 40;
    var totalSize = size + 2 * frameSize;
    if (!goldFrame) goldFrame = createScaledFrame(rectangle(0, 0, totalSize, totalSize), requireImage('gfx/goldFrame.png'));
    if (!silverFrame) silverFrame = createScaledFrame(rectangle(0, 0, totalSize, totalSize), requireImage('gfx/silverFrame.png'));
    var margin = 20;
    var padding = 2;
    var top = mainCanvas.height - 30 - margin - totalSize; // 30 is the height of the minimap.
    var left = 60 + margin; // 60 pixels to make room for the return to map button.
    for (var action of actor.actions) {
        if (action.tags.basic) continue;
        action.target = rectangle(left, top, totalSize, totalSize);
        action.onClick = onClickSkill;
        var iconSource = getAbilityIconSource(action.ability);
        context.fillStyle = 'white';
        fillRectangle(context, shrinkRectangle(action.target, 2));
        drawAbilityIcon(context, iconSource, shrinkRectangle(action.target, frameSize));
        var frame = silverFrame;
        if (isSkillActive(action)) {
            frame = goldFrame;
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
        left += totalSize + padding;
    }
}

var selectedAction = null;
function onClickSkill(character, action) {
    // If a skill has no target, trigger it as soon as they click the skill button.
    if (action.base.target === 'none') {
        if (canUseSkillOnTarget(action.actor, action, action.actor)) {
            prepareToUseSkillOnTarget(action.actor, action, action.actor);
        }
    } else {
        selectedAction = action;
    }
}


function getAbilityPopupTarget(x, y) {
    for (var action of state.selectedCharacter.adventurer.actions) {
        if (action.tags.basic) continue;
        if (isPointInRectObject(x, y, action.target)) {
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