
var editingLevel = null, editingLevelInstance = null, testingLevel = false;
function initializeLevelEditing() {
    for (var level = 1; level < 100; level++) {
        $('.js-levelSelect').append($tag('option','', 'Lv ' + level).val(level));
    }
    $.each(backgrounds, function (backgroundKey) {
        $('.js-levelBackgroundSelect').append($tag('option','', backgroundKey).val(backgroundKey));
    });
    $('.js-levelSkillSelect').append($tag('option','', 'none').val(''));
    $.each(abilities, function (skillKey, ability) {
        $('.js-levelSkillSelect').append($tag('option','', ability.name).val(skillKey));
        $('.js-enemySkillSelect').append($tag('option','', ability.name).val(skillKey));
    });
    $.each(monsters, function (monsterKey, monster) {
        $('.js-monsterSelect').append($tag('option','', monster.name).val(monsterKey));
    });
    $('.js-levelSelect').on('change', function () {
        editingLevel.level = Number($(this).val());
        // Make a new instance since all the enemies and # waves need to be updated.
        editingLevelInstance = instantiateLevel(editingLevel);
    });
    $('.js-levelNameInput').on('change', function () {
        var newName = $(this).val();
        var newKey = newName.replace(/\s*/g, '').toLowerCase();
        while (map[newKey] && map[newKey] !== editingLevel) {
            newName += '+';
            newKey = newName.replace(/\s*/g, '').toLowerCase();
        }
        editingLevel.name = newName;
        $(this).val(newName);
        updateMapKey(editingLevel.levelKey, newKey);
    });
    $('.js-levelDescriptionInput').on('change', updateLevelDescription);
    $('.js-levelBackgroundSelect').on('change', function () {
        editingLevelInstance.background = editingLevel.background = $(this).val();
    });
    $('.js-levelSkillSelect').on('change', function () {
        var value = $(this).val();
        if (!value) {
            editingLevel.skill = null;
        } else {
            editingLevel.skill = value;
        }
    });
    $('.js-levelSkillSelect').attr('helpText', '-').data('helpMethod', function ($element) {
        var value = $element.val();
        if (!value) return 'No skill selected';
        return abilityHelpText(abilities[value], state.selectedCharacter.adventurer);
    });
    $('.js-enemySkillSelect').on('change', function () {
        var newSkill = $(this).val();
        editingLevel.enemySkills.push(newSkill);
        updateEnemySkills();
    });
    $(document).on('change', '.js-monsterSelect', function () {
        var monsterKey = $(this).val();
        if ($(this).closest('.js-monsters').length) {
            editingLevel.monsters.push(monsterKey);
            updateMonsters();
        } else {
            var eventIndex = $(this).closest('.js-levelEvent').index();
            editingLevel.events[eventIndex].push(monsterKey);
            updateEventMonsters();
        }
    });
    $(document).on('click', '.js-enemySkill', function () {
        var index = $(this).index();
        $(this).remove();
        editingLevel.enemySkills.splice(index, 1);
    });
    $(document).on('click', '.js-monster', function () {
        var monsterIndex = $(this).index();
        if ($(this).closest('.js-monsters').length) {
            editingLevel.monsters.splice(monsterIndex, 1);
        } else {
            var $eventDiv = $(this).closest('.js-levelEvent');
            var eventIndex = $eventDiv.index();
            editingLevel.events[eventIndex].splice(monsterIndex, 1);
        }
        $(this).remove();
    });
    $(document).on('click', '.js-addLevelEvent', function () {
        var $event = $(this).closest('.js-levelEvent');
        if ($event.length) {
            var eventIndex = $event.index();
            editingLevel.events.splice(eventIndex, 0, []);
        } else {
            editingLevel.events.push([]);
        }
        updateEventMonsters();
        // Make a new instance to show updated waves.
        editingLevelInstance = instantiateLevel(editingLevel);
    });
    $(document).on('click', '.js-removeLevelEvent', function () {
        var eventIndex = $(this).closest('.js-levelEvent').index();
        editingLevel.events.splice(eventIndex, 1);
        updateEventMonsters();
        // Make a new instance to show updated waves.
        editingLevelInstance = instantiateLevel(editingLevel);
    });
    $(document).on('click', '.js-moveLevelEventUp', function () {
        var eventIndex = $(this).closest('.js-levelEvent').index();
        if (eventIndex === 0) return;
        var tempEvent = editingLevel.events[eventIndex];
        editingLevel.events[eventIndex] = editingLevel.events[eventIndex - 1];
        editingLevel.events[eventIndex - 1] = tempEvent;
        updateEventMonsters();
    });
    $(document).on('click', '.js-moveLevelEventDown', function () {
        var eventIndex = $(this).closest('.js-levelEvent').index();
        if (eventIndex >= editingLevel.events.length - 1) return;
        var tempEvent = editingLevel.events[eventIndex];
        editingLevel.events[eventIndex] = editingLevel.events[eventIndex + 1];
        editingLevel.events[eventIndex + 1] = tempEvent;
        updateEventMonsters();
    });
    $(document).on('click', '.js-testLevel', function(event) {
        var characterJson = $('.js-testCharacters').val();
        if (!characterJson) return;
        var character = importCharacter(JSON.parse(characterJson));
        startTestingLevel(character);
    });
}
function updateLevelDescription() {
    if (editingLevel) editingLevel.description = $('.js-levelDescriptionInput').val();
}

function updateMonsters() {
    $('.js-monsters .js-monsterSelect').prevAll().remove();
    editingLevel.monsters = ifdefor(editingLevel.monsters, []);
    editingLevel.monsters.forEach(function (monsterKey) {
        var $monster = $tag('span', 'js-monster monster', monsters[monsterKey].name);
        /*$enemySkill.attr('helpText', '-');
        $enemySkill.data('helpMethod', function () {
            return abilityHelpText(abilities[skillKey], state.selectedCharacter.adventurer);
        })*/
        $('.js-monsters .js-monsterSelect').before($monster);
    });
}

function updateEventMonsters() {
    $('.js-levelEvents').empty();
    editingLevel.events = ifdefor(editingLevel.events, []);
    editingLevel.events.forEach(function (event) {
        var $eventMonsterSelect = $('.js-monsterSelect').first().clone();
        var $event = $tag('li', 'js-levelEvent').append($tag('span', 'js-eventMonsters')
                .append($eventMonsterSelect)
                .append($tag('button', 'js-moveLevelEventUp editEventButton', ' ^ '))
                .append($tag('button', 'js-moveLevelEventDown editEventButton', ' V '))
                .append($tag('button', 'js-removeLevelEvent editEventButton', ' - ')));
        event.forEach(function (monsterKey) {
            var $monster = $tag('span', 'js-monster monster', monsters[monsterKey].name);
            $eventMonsterSelect.before($monster);
        });
        $('.js-levelEvents').append($event);
    });

    // <div class="js-levelEvent"><span class="js-eventMonsters"><select class="js-monsterSelect"></select></span></div>
}

function updateEnemySkills() {
    $('.js-enemySkillSelect').prevAll().remove();
    editingLevel.enemySkills = ifdefor(editingLevel.enemySkills, []);
    editingLevel.enemySkills.forEach(function (skillKey) {
        var $enemySkill = $tag('span', 'js-enemySkill enemySkill', abilities[skillKey].name);
        $enemySkill.attr('helpText', '-');
        $enemySkill.data('helpMethod', function () {
            return abilityHelpText(abilities[skillKey], state.selectedCharacter.adventurer);
        })
        $('.js-enemySkillSelect').before($enemySkill);
    });
}


function startEditingLevel(level) {
    if (!level) return
    editingLevel = level
    editingEventIndex = 0;
    currentMapTarget = null;
    editingMap = false;
    editingLevelInstance = instantiateLevel(editingLevel, 'normal', false);
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
    $('.js-levelBackgroundSelect option[value="' + editingLevel.background + '"]').prop('selected', true);

    $('.js-levelSkillSelect option').show();
    $('.js-testCharacters').empty();
    for (var characterData of testCharacters) {
        var job = characterClasses[characterData.adventurer.jobKey];
        $('.js-testCharacters').append($tag('option','', ['Lv',characterData.adventurer.level, job.name, characterData.adventurer.name].join(' ')).val(JSON.stringify(characterData)));
    }
    $('.js-testCharacters').append($tag('option','', '--Characters from Save--').val(null));
    for (var character of state.characters) {
        $('.js-testCharacters').append($tag('option','', ['Lv',character.adventurer.level, character.adventurer.job.name, character.adventurer.name].join(' ')).val(JSON.stringify(exportCharacter(character))));
    }
    // Hide skills already used by other levels.
    for (var otherLevel of Object.values(map)) {
        if (otherLevel.skill) $('.js-levelSkillSelect option[value="' + otherLevel.skill + '"]').hide();
    }
    // Hide class skills, they cannot be granted by levels.
    for (var classSkill in characterClasses) {
        $('.js-levelSkillSelect option[value="' + classSkill + '"]').hide();
    }
    if (editingLevel.skill) {
        $('.js-levelSkillSelect option[value="' + editingLevel.skill + '"]').show().prop('selected', true);
    } else {
        $('.js-levelSkillSelect option').first().prop('selected', true);
    }
    $('.js-levelNameInput').val(editingLevel.name);
    $('.js-levelDescriptionInput').val(ifdefor(editingLevel.description, ''));
    updateEnemySkills();
    updateMonsters();
    updateEventMonsters();
    updateEditingState();
}
function stopEditingLevel() {
    $('.js-levelNameInput').blur();
    $('.js-editingControls').hide();
    selectedMapNodes = [editingLevel];
    updateLevelDescription();
    editingLevel = editingLevelInstance = undefined;
    editingMap = true;
    updateEditingState();
}

$(document).on('keydown', function(event) {
    if (event.which === 27) { // escape key
        event.preventDefault();
        if (testingLevel) {
            stopTestingLevel();
        } else if (editingLevel) {
            stopEditingLevel();
        }
    }
});
function startTestingLevel(character) {
    $('.js-editingControls').hide();
    state.lastSelectedCharacter = state.selectedCharacter;
    setSelectedCharacter(character);
    startArea(state.selectedCharacter, editingLevel.levelKey);
    testingLevel = true;
    updateEditingState();
}
function stopTestingLevel() {
    $('.js-editingControls').show();
    state.selectedCharacter = state.lastSelectedCharacter;
    testingLevel = false;
    updateEditingState();
    updateAdventureButtons();
}
