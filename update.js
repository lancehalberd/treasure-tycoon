'use strict';

var frameMilliseconds = 20;
setInterval(() => {
    // Initially we don't do any of the main game logic until preloading finishes
    // then we initialize the game and start running the main game loop.
    if (!gameHasBeenInitialized) {
        if (numberOfImagesLeftToLoad <= 0 && numberOfSoundsLeftToLoad <= 0)  {
            initializeGame();
        } else return;
    }
    try {
    var characters = testingLevel ? [state.selectedCharacter] : state.characters;
    var mousePosition = relativeMousePosition($(mainCanvas));
    var activeGuildAreaHash = {};
    for (var character of characters) {
        var hero = character.hero;
        if (character.context === 'guild' ||
            (character.context === 'adventure' && !isCharacterPaused(character))
        ) {
            character.loopCount = ifdefor(character.loopCount) + 1;
            var loopSkip = (character.autoplay) ? ifdefor(character.loopSkip, 1) : 1;
            if (character.loopCount % loopSkip) break;
            var gameSpeed = (character.autoplay) ? character.gameSpeed : 1;
            for (var i = 0; i < gameSpeed  && character.adventurer.area; i++) {
                character.time += frameMilliseconds / 1000;
                if (character.context === 'adventure') {
                    updateAreaCamera(hero.area, hero);
                    updateArea(hero.area, frameMilliseconds / 1000);
                } else if (character.context === 'guild') activeGuildAreaHash[character.guildAreaKey] = true;
            }
        }
    }
    for (var guildAreaKey in activeGuildAreaHash) {
        updateAreaCamera(guildAreas[guildAreaKey], state.selectedCharacter.hero);
        updateArea(guildAreas[guildAreaKey]);
    }
    if (state.selectedCharacter.context === 'adventure' || state.selectedCharacter.context === 'guild') {
        var hero = state.selectedCharacter.adventurer;
        if (mouseDown && state.selectedCharacter.hero.area && clickedToMove) {
            var targetZ = -(mousePosition[1] - groundY) * 2;
            if (targetZ >= -200 || targetZ <= 200) {
                setActorDestination(hero, {'x': hero.area.cameraX + mousePosition[0], 'z': targetZ});
            }
        }
    }
    if (state.selectedCharacter.context === 'map') updateMap();
    if (state.selectedCharacter.context === 'item') updateCraftingCanvas();
    if (state.selectedCharacter.hero.area) refreshStatsPanel(state.selectedCharacter, $('.js-characterColumn .js-stats'))
    $('.js-inventorySlot').toggle($('.js-inventory .js-item').length === 0);
    checkRemoveToolTip();
    updateTrophyPopups();
    } catch (e) {
        console.log(e.stack);
        debugger;
    }
}, frameMilliseconds);

function updateAreaCamera(area, hero) {
    // Only update the camera for the guild for the selected character, but
    // always update the camera for characters in adventure areas.
    if (hero.area === area || (area && !area.isGuildArea)) {
        var targetCameraX = getTargetCameraX(hero);
        area.cameraX = Math.round((area.cameraX * 15 + targetCameraX) / 16);
    }
}

const getTargetCameraX = (actor) => {
    var mousePosition = relativeMousePosition($(mainCanvas));
    var area = actor.area;
    var centerX = actor.x;
    var mouseX = Math.max(0, Math.min(800, mousePosition[0]));
    if (actor.activity && actor.activity.type === 'move') {
        centerX = (centerX + actor.activity.x) / 2;
    } else if (actor.goalTarget && !actor.goalTarget.isDead) {
        centerX = (centerX + actor.goalTarget.x) / 2;
    }
    if (mouseX > 700) centerX = centerX + (mouseX - 700) / 2;
    else if (mouseX < 100) centerX = centerX + (mouseX - 100) / 2;
    var target = Math.min(actor.x - 20, centerX - 400);
    target = Math.max(area.left || 0, target);
    if (area.width) target = Math.min(area.width - 800, target);
    // If a timestop is in effect, the caster must be in the frame.
    if (area.timeStopEffect) {
        var focusTarget = area.timeStopEffect.actor;
        target = Math.max(focusTarget.x + focusTarget.width + 64 - 800, target);
        target = Math.min(focusTarget.x - 64, target);
    }
    return Math.round(target);
};

function isCharacterPaused(character) {
    const hero = character.hero;
    if (!character.paused) return false;
    if (hero.activity || hero.skillInUse) return false;
    if (hero.chargeEffect) return false;
    if (!hero.area.enemies) return false;
    return true;
}
