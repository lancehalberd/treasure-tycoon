
var jobRanks = [
    ['juggler', 'blackbelt', 'priest'],
    ['corsair', 'paladin', 'dancer'],
    ['ranger', 'warrior', 'wizard'],
    ['assassin', 'darkknight', 'bard'],
    ['sniper', 'samurai', 'sorcerer'],
    ['ninja', 'enhancer', 'sage']
    //['master', 'fool']
];

function createNewHeroApplicant($applicationPanel, jobKey) {
    var fameRoll = Math.round(state.fame / 3 + Math.random() * state.fame * 5 / 6);
    if (!jobKey) {
        // Log is base e, so we need to divide by log(10) to get log10 value.
        var maxRank = Math.min(Math.log(fameRoll) / Math.log(10), jobRanks.length);
        var jobRank = Math.floor(Math.random() * maxRank);
        jobKey = Random.element(jobRanks[jobRank]);
    }
    var character = newCharacter(characterClasses[jobKey]);
    character.fame = fameRoll;
    character.applicationAge = 0;
    updateAdventurer(character.adventurer);
    setHeroApplication($applicationPanel, character);
}

function setHeroApplication($applicationPanel, character) {
    $applicationPanel.data('character', character);
    $applicationPanel.find('.js-skillCanvas').data('character', character);
    var $statsPanel = $applicationPanel.find('.js-stats');
    refreshStatsPanel(character, $statsPanel);
    $statsPanel.find('.js-dexterityGrowth').empty();
    $statsPanel.find('.js-strengthGrowth').empty();
    $statsPanel.find('.js-intelligenceGrowth').empty();
    for (var i = 0; i < character.adventurer.job.dexterityBonus; i++) {
        $statsPanel.find('.js-dexterityGrowth').append($tag('div', 'statGrowthFill'));
    }
    for (var i = 0; i < character.adventurer.job.strengthBonus; i++) {
        $statsPanel.find('.js-strengthGrowth').append($tag('div', 'statGrowthFill'));
    }
    for (var i = 0; i < character.adventurer.job.intelligenceBonus; i++) {
        $statsPanel.find('.js-intelligenceGrowth').append($tag('div', 'statGrowthFill'));
    }
    character.jewelsCanvas = $applicationPanel.find('.js-skillCanvas')[0];
    updateHireButtonsForApplication($applicationPanel);
    var applicantPreviewContext = $applicationPanel.find('.js-previewCanvas')[0].getContext("2d");
    applicantPreviewContext.imageSmoothingEnabled = false;
    applicantPreviewContext.clearRect(0, 0, 64, 128);
    applicantPreviewContext.globalAlpha = 1;
    var jobSource = character.adventurer.job.iconSource;
    drawImage(applicantPreviewContext, jobSource.image, jobSource, {'left': 0, 'top': 0, 'width': 32, 'height': 32});
    applicantPreviewContext.globalAlpha = .6;
    applicantPreviewContext.drawImage(character.adventurer.personCanvas, character.adventurer.source.walkFrames[0] * 96, 0, 96, 64, -64, 0, 192, 128);
    drawBoardJewels(character, $applicationPanel.find('.js-skillCanvas')[0]);
}

function increaseAgeOfApplications() {
    $('.js-heroApplication').each(function () {
        var $applicationPanel = $(this);
        var character = $applicationPanel.data('character');
        character.applicationAge++;
        updateHireButtonsForApplication($(this));
    });
}

function updateHireButtons() {
    $('.js-heroApplication').each(function () {
        updateHireButtonsForApplication($(this));
    });
}
function updateHireButtonsForApplication($applicationPanel) {
    var character = $applicationPanel.data('character');
    if (!character) return;
    $applicationPanel.find('.js-hirePrice').html(points('coins', getApplicationCost(character)));
    var newApplicationCost = getNewApplicationCost(character);
    $applicationPanel.find('.js-seekPrice').html(newApplicationCost ? points('coins', newApplicationCost) : ' Free!');
}

function getApplicationCost(character) {
    return Math.max(100, Math.round(character.fame * 100 * Math.max(.01, character.fame / state.fame)));
}

function getNewApplicationCost(character) {
    return Math.max(0, Math.round(getApplicationCost(character)* (10 - character.applicationAge) / 100));
}

$('body').on('click', '.js-hireApplicant', function () {
    if (state.characters.length >= 8) return;
    var $applicationPanel = $(this).closest('.js-heroApplication');
    var character = $applicationPanel.data('character');
    if (!spend('coins', getApplicationCost(character))) {
        return;
    }
    hireCharacter(character);
    createNewHeroApplicant($applicationPanel);
    updateRetireButtons();
    saveGame();
});
$('body').on('mouseover', '.js-hireApplicant', function () {
    var $applicationPanel = $(this).closest('.js-heroApplication');
    var character = $applicationPanel.data('character');
    previewPointsChange('coins', -getApplicationCost(character));
});
$('body').on('mouseout', '.js-hireApplicant', function () {
    hidePointsPreview();
});
$('body').on('click', '.js-seekNewApplicant', function () {
    var $applicationPanel = $(this).closest('.js-heroApplication');
    var character = $applicationPanel.data('character');
    if (!spend('coins', getNewApplicationCost(character))) {
        return;
    }
    createNewHeroApplicant($applicationPanel);
    saveGame();
});
$('body').on('mouseover', '.js-seekNewApplicant', function () {
    var $applicationPanel = $(this).closest('.js-heroApplication');
    var character = $applicationPanel.data('character');
    previewPointsChange('coins', -getNewApplicationCost(character));
});
$('body').on('mouseout', '.js-seekNewApplicant', function () {
    hidePointsPreview();
});

function hireCharacter(character) {
    if (state.characters.length >= 8) return;
    unlockMapLevel(character.currentLevelKey);
    gain('fame', character.fame);
    state.characters.push(character);
    setSelectedCharacter(character);
    $('.js-charactersBox').append(character.$characterCanvas);
}