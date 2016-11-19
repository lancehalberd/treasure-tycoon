
var jobRanks = [
    ['juggler', 'blackbelt', 'priest'],
    ['corsair', 'paladin', 'dancer'],
    ['ranger', 'warrior', 'wizard'],
    ['assassin', 'darkknight', 'bard'],
    ['sniper', 'samurai', 'sorcerer'],
    ['ninja', 'enhancer', 'sage'],
    ['master', 'fool']
];

function createNewHeroApplicant($applicationPanel) {
    var fameRoll = Math.round(state.fame / 2 + Math.random() * state.fame * 2 / 3);
    // Log is base e, so we need to divide by log(10) to get log10 value.
    var maxRank = Math.min(Math.log(fameRoll) / Math.log(10), jobRanks.length);
    var jobRank = Math.floor(Math.random() * maxRank);
    var jobKey = Random.element(jobRanks[jobRank]);
    var character = newCharacter(characterClasses[jobKey]);
    character.fame = fameRoll;
    character.applicationAge = 0;
    updateJewelBonuses(character);
    setHeroApplication($applicationPanel, character);
}

function setHeroApplication($applicationPanel, character) {
    $applicationPanel.data('character', character);
    $applicationPanel.find('.js-skillCanvas').data('character', character);
    refreshStatsPanel(character, $applicationPanel.find('.js-stats'));
    character.jewelsCanvas = $applicationPanel.find('.js-skillCanvas')[0];
    updateHireButtonsForApplication($applicationPanel);
    var applicantPreviewContext = $applicationPanel.find('.js-previewCanvas')[0].getContext("2d");
    applicantPreviewContext.imageSmoothingEnabled = false;
    applicantPreviewContext.clearRect(0, 0, 64, 128);
    applicantPreviewContext.drawImage(character.adventurer.personCanvas, walkLoop[0] * 32, 0 , 32, 64, 0, -20, 64, 128);
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
$('body').on('click', '.js-seekNewApplicant', function () {
    var $applicationPanel = $(this).closest('.js-heroApplication');
    var character = $applicationPanel.data('character');
    if (!spend('coins', getNewApplicationCost(character))) {
        return;
    }
    createNewHeroApplicant($applicationPanel);
    saveGame();
});

function hireCharacter(character) {
    unlockMapLevel(character.currentLevelKey);
    gain('fame', character.fame);
    state.characters.push(character);
    setSelectedCharacter(character);
    $('.js-charactersBox').append(character.$characterCanvas)
}