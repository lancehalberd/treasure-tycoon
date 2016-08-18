
var editingLevel = null, editingLevelInstance = null, editingEventIndex = 0;
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
    $('.js-levelBackgroundSelect').on('change', function () {
        editingLevelInstance.background = editingLevel.background = $(this).val();
    });
    $('.js-levelSkillSelect').on('change', function () {
        editingLevel.skill = $(this).val();
    });
    $('.js-enemySkillSelect').on('change', function () {
        var newSkill = $(this).val();
        editingLevel.enemySkills.push(newSkill);
        updateEnemySkills();
    });
    $('.js-monsterSelect').on('change', function () {
        var monsterKey = $(this).val();
        if ($('.js-monsterSelect').closest('.js-monsters').length) {
            editingLevel.monsters.push(monsterKey);
            updateMonsters();
        } else {
            editingLevel.events[editingEventIndex].push(monsterKey);
            updateEventMonsters();
        }
    });
    $(document).on('click', '.js-enemySkill', function () {
        var index = $(this).index();
        $(this).remove();
        editingLevel.enemySkills.splice(index, 1);
    });
    $(document).on('click', '.js-monster', function () {
        var index = $(this).index();
        $(this).remove();
        if ($('.js-monsterSelect').closest('.js-monsters').length) {
            editingLevel.monsters.splice(index, 1);
        } else {
            editingLevel.events[editingEventIndex].splice(index, 1);
        }
    });
}

function updateMonsters() {
    $('.js-monsters .js-monsterSelect').prevAll().remove();
    editingLevel.monsters = ifdefor(editingLevel.monsters, []);
    editingLevel.monsters.forEach(function (monsterKey) {
        var $monster = $tag('span', 'js-monster monster', monsters[monsterKey].name);
        /*$enemySkill.attr('helpText', '-');
        $enemySkill.data('helpMethod', function () {
            return abilityHelpText(abilities[skillKey], state.selectedCharacter);
        })*/
        $('.js-monsters .js-monsterSelect').before($monster);
    });
}

function updateEventMonsters() {
    $('.js-eventMonsters .js-monsterSelect').prevAll().remove();
    editingLevel.events = ifdefor(editingLevel.events, []);
    editingLevel.events[editingEventIndex] = ifdefor(editingLevel.events[editingEventIndex], []);
    editingLevel.events[editingEventIndex].forEach(function (monsterKey) {
        var $monster = $tag('span', 'js-monster monster', monsters[monsterKey].name);
        $('.js-eventMonsters .js-monsterSelect').before($monster);
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
            return abilityHelpText(abilities[skillKey], state.selectedCharacter);
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
    $('.js-levelBackgroundSelect option[value="' + editingLevel.background + '"]').prop('selected', true);
    if (editingLevel.skill) {
        $('.js-levelSkillSelect option[value="' + editingLevel.skill + '"]').prop('selected', true);
    } else {
        $('.js-levelSkillSelect option').first().prop('selected', true);
    }
    $('.js-levelNameInput').val(editingLevel.name);
    updateEnemySkills();
    updateMonsters();
    updateEventMonsters();
    updateEditingState();
}
function stopEditingLevel() {
    $('.js-levelNameInput').blur();
    $('.js-editingControls').hide();
    selectedMapNodes = [editingLevel];
    editingLevel = editingLevelInstance = undefined;
    editingMap = true;
    updateEditingState();
}

$(document).on('keydown', function(event) {
    if (event.which === 27) { // escape key
        event.preventDefault();
        if (editingLevel) {
            stopEditingLevel();
        }
    }
});