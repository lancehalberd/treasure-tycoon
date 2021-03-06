
var jobRanks = [
    ['juggler', 'blackbelt', 'priest'],
    ['corsair', 'paladin', 'dancer'],
    ['ranger', 'warrior', 'wizard'],
    ['assassin', 'darkknight', 'bard'],
    ['sniper', 'samurai', 'sorcerer'],
    ['ninja', 'enhancer', 'sage']
    //['master', 'fool']
];

function createNewHeroApplicant(jobKey) {
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
    return character;
}

function setHeroApplication($applicationPanel, application) {
    var character = application.character;
    $applicationPanel.data('application', application);
    var $jewelCanvas = $applicationPanel.find('.js-applicationSkillCanvas');
    $jewelCanvas.data('character', character);
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
    character.jewelsCanvas = $jewelCanvas[0];
    updateHireButtonsForApplication($applicationPanel);
    var applicantPreviewContext = $applicationPanel.find('.js-previewCanvas')[0].getContext("2d");
    applicantPreviewContext.imageSmoothingEnabled = false;
    applicantPreviewContext.clearRect(0, 0, 64, 128);
    applicantPreviewContext.globalAlpha = 1;
    var jobSource = character.adventurer.job.iconSource;
    drawImage(applicantPreviewContext, jobSource.image, jobSource, {'left': 0, 'top': 0, 'width': 32, 'height': 32});
    applicantPreviewContext.globalAlpha = .6;
    applicantPreviewContext.drawImage(character.adventurer.personCanvas, character.adventurer.source.walkFrames[0] * 96, 0, 96, 64, -64, 0, 192, 128);
    drawBoardJewels(character, $jewelCanvas[0]);
}

function increaseAgeOfApplications() {
    $('.js-heroApplication').each(function () {
        var $applicationPanel = $(this);
        var application = $applicationPanel.data('application');
        if (!application || !application.character) return;
        application.character.applicationAge++;
        updateHireButtonsForApplication($(this));
    });
}

function updateHireButtons() {
    $('.js-heroApplication').each(function () {
        updateHireButtonsForApplication($(this));
    });
}
function updateHireButtonsForApplication($applicationPanel) {
    var application = $applicationPanel.data('application');
    if (!application || !application.character) return;
    $applicationPanel.find('.js-hirePrice').html(points('coins', getApplicationCost(application.character)));
    var newApplicationCost = getNewApplicationCost(application.character);
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
    if (state.characters.length >= state.guildStats.maxHeroes) return;
    var $applicationPanel = $(this).closest('.js-heroApplication');
    var application = $applicationPanel.data('application');
    var character = application.character;
    if (!spend('coins', getApplicationCost(character))) {
        return;
    }
    hireCharacter(character);
    application.character = createNewHeroApplicant();
    updateRetireButtons();
    saveGame();
});
$('body').on('mouseover', '.js-hireApplicant', function () {
    var $applicationPanel = $(this).closest('.js-heroApplication');
    var application = $applicationPanel.data('application');
    previewPointsChange('coins', -getApplicationCost(application.character));
});
$('body').on('mouseout', '.js-hireApplicant', function () {
    hidePointsPreview();
});
$('body').on('click', '.js-seekNewApplicant', function () {
    var $applicationPanel = $(this).closest('.js-heroApplication');
    var application = $applicationPanel.data('application');
    if (!spend('coins', getNewApplicationCost(application.character))) {
        return;
    }
    application.character = createNewHeroApplicant();
    setHeroApplication($applicationPanel, application);
    saveGame();
});
$('body').on('mouseover', '.js-seekNewApplicant', function () {
    var $applicationPanel = $(this).closest('.js-heroApplication');
    var application = $applicationPanel.data('application');
    previewPointsChange('coins', -getNewApplicationCost(application.character));
});
$('body').on('mouseout', '.js-seekNewApplicant', function () {
    hidePointsPreview();
});
function hireHeroHelpMethod($button) {
    if (state.characters.length >= state.guildStats.maxHeroes) return 'You do not have enough beds to hire another hero. Dismiss a hero or explore the guild for more beds.';
    return 'Hire this hero. The more famous your guild is, the cheaper it is to hire heroes.';
}
$('.js-hireApplicant').data('helpMethod', hireHeroHelpMethod);

function hireCharacter(character) {
    if (state.characters.length > 0 && state.characters.length >= state.guildStats.maxHeroes) return;
    unlockMapLevel(character.currentLevelKey);
    gain('fame', character.fame);
    state.characters.push(character);
    // Update the adventurer because it may not have guild bonuses applied to it yet.
    updateAdventurer(character.hero);
    enterArea(character.hero, guildYardEntrance);
    updateTrophy('level-' + character.hero.job.key, character.hero.level);
    $('.js-charactersBox').append(character.$characterCanvas);
    $('.js-heroApplication').hide();
    setSelectedCharacter(character);
}