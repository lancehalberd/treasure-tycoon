
function initializeLevelEditing() {
    for (var level = 1; level < 100; level++) {
        $('.js-levelSelect').append($tag('option','', 'Lv ' + level).val(level));
    }
    $.each(backgrounds, function (backgroundKey) {
        $('.js-levelBackgroundSelect').append($tag('option','', backgroundKey).val(backgroundKey));
    });
    $('.js-levelSelect').on('change', function () {
        editingLevel.level = Number($(this).val());
    });
    $('.js-levelBackgroundSelect').on('change', function () {
        editingLevelInstance.background = editingLevel.background = $(this).val();
    });

}

function startEditingLevel(level) {
    if (!level) return
    editingLevel = level
    currentMapTarget = null;
    editingMap = false;
    editingLevelInstance = instantiateLevel(editingLevel, false);
    state.selectedCharacter.x = 0;
    state.selectedCharacter.cameraX = -60;
    state.selectedCharacter.startTime = state.selectedCharacter.time;
    state.selectedCharacter.adventurer.animationTime = 0;
    state.selectedCharacter.adventurer.isDead = false;
    state.selectedCharacter.adventurer.timeOfDeath = undefined;
    state.selectedCharacter.finishTime = false;
    state.selectedCharacter.waveIndex = 0;
    $('.js-editingControls').show();
    $('.js-levelSelect option').eq(editingLevel.level - 1).prop('selected', true);
    $('.js-levelNameInput').val(editingLevel.name);
    updateEditingState();
}

$(document).on('keydown', function(event) {
    if (event.which === 27) { // escape key
        event.preventDefault();
        if (editingLevel) {
            $('.js-editingControls').hide();
            editingLevel = editingLevelInstance = undefined;
            editingMap = true;
        }
    }
});