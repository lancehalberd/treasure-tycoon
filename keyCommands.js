
function isEditingAllowed() {
    return window.location.search.substr(1) === 'edit';
}

$(document).on('keydown', function(event) {
    if (handleSkillKeyInput(event.which)) return;
    if (event.which === 8) { // delete key
        if (editingMap) {
            event.preventDefault();
            selectedMapNodes.forEach(function (level) {
                deleteLevel(level);
            });
            selectedMapNodes = [];
        }
    }
    if (event.which === 27) { // escape key
        event.preventDefault();
        if (editingMap) {
            stopMapEditing();
        } else if (!testingLevel) {
            if (state.selectedCharacter.context === 'map') {
                if ($('.js-areaMenu').is(':visible')) $('.js-areaMenu').hide();
                else if (!state.selectedCharacter.hero.area) {
                    enterArea(state.selectedCharacter.hero, guildFoyerFrontDoor);
                } else {
                    setContext('guild');
                }
            } else if (state.selectedCharacter.context === 'jewel' || state.selectedCharacter.context === 'item') {
                if (state.selectedCharacter.hero.area && !state.selectedCharacter.hero.area.isGuildArea) {
                    setContext('adventure');
                } else {
                    setContext('guild');
                }
            }
            /*if (state.selectedCharacter.context !== 'adventure') {
                setContext('adventure');
            } else if (state.selectedCharacter.hero.area) {
                recallSelectedCharacter();
            } else {
                $('.js-areaMenu').hide();
            }*/
        }
    }
    if (isEditingAllowed()) {
        if (editingMap && event.which === 67) { // 'c'
            event.preventDefault();
            exportMapToClipboard();
        }
        if (!editingMap && !editingLevel && event.which === 67) { // 'c'
            ipasteCharacterToClipBoard(state.selectedCharacter);
        }
        if (event.which === 69) { // 'e'
            if (state.selectedCharacter.context !== 'map') return;
            if (currentMapTarget) {
                startEditingLevel(currentMapTarget);
                return;
            }
            if (!editingLevel) {
                if (!editingMap) startMapEditing();
                else stopMapEditing();
            }
        }
        if (event.which === 76) { // 'l'
            if (currentMapTarget && currentMapTarget.levelKey) {
                state.selectedCharacter.currentLevelKey = currentMapTarget.levelKey;
                if (!state.selectedCharacter.completionTime) {
                    state.selectedCharacter.completionTime = 100;
                } else {
                    state.selectedCharacter.completionTime -= 10;
                }
                completeLevel(state.selectedCharacter.hero, state.selectedCharacter.completionTime);
            }
        }
    }
    if (!editingMap && !editingLevel && (event.which === 67 || event.which === 73)  && state.guildStats.hasItemCrafting) { // 'c'|'i'
        if (state.selectedCharacter.context === 'item') setContext('guild');
        else if (state.selectedCharacter.context !== 'adventure') setContext('item');
    }
    if (!editingMap && !editingLevel && event.which === 74 && state.guildStats.hasJewelCrafting) { // 'j'
        if (state.selectedCharacter.context === 'jewel') setContext('guild');
        else if (state.selectedCharacter.context !== 'adventure') setContext('jewel');
    }
    if (event.which === 77 && state.guildStats.hasMap) { // 'm'
        if (state.selectedCharacter.context === 'map') {
            if (!state.selectedCharacter.hero.area) {
                enterArea(state.selectedCharacter.hero, guildFoyerFrontDoor);
            } else {
                setContext('guild');
            }
        } else if (state.selectedCharacter.context !== 'adventure') openWorldMap(state.selectedCharacter.adventurer);
    }
});