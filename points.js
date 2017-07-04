// Utilities for dealing with different types of points: fame, divinity, coins and anima.

var pointsMap = {
    'fame': 'Fame',
    'coins': 'Coins',
    'anima': 'Anima'
};

function points(type, value) {
    if (type === 'coins') {
        return tag('span', 'inline-points', tag('span', 'icon coin') + ' ' + tag('span', 'value '+ pointsMap[type], value.abbreviate()));
    }
    return tag('span', 'inline-points', tag('span', 'icon anima') + ' ' + tag('span', 'value '+ pointsMap[type], value.abbreviate()));
}

// By default costs are assumed to be coins, but can be specified as any combination of points like {'coins': 10, 'anima': 100}
function canAffordCost(cost) {
    if (typeof cost === 'number') return cost <= state.coins;
    for (var points in cost) if (cost[points] > state[points]) return false;
    return true;
}
function previewCost(cost) {
    if (typeof cost === 'number') return previewPointsChange('coins', -cost);
    for (var points in cost) previewPointsChange(points, -cost[points]);
}
function attemptToApplyCost(cost) {
    if (!canAffordCost(cost)) return false;
    if (typeof cost === 'number') return spend('coins', cost);
    for (var points in cost) spend(points, cost[points]);
    return true;
}
function costHelpText(cost) {
    if (typeof cost === 'number') return points('coins', cost);
    var parts = [];
    for (var pointsKey in cost) parts.push(points(pointsKey, cost[pointsKey]));
    return parts.join(' and ');
}

function previewPointsChange(pointsType, amount) {
    if (amount === 0) return;
    var $pointsSpan = $('.js-global-' + pointsType);
    $pointsSpan.nextAll().show();
    var $amount = $pointsSpan.nextAll('.js-amount');
    $amount.toggleClass('cost', amount < 0);
    if (amount < 0) $amount.text('-' + Math.abs(amount).abbreviate());
    else $amount.text('+' + amount.abbreviate());
    if (pointsType === 'divinity') var balance = state.selectedCharacter.divinity + amount;
    else var balance = state[pointsType] + amount;
    var $balance = $pointsSpan.nextAll('.js-balance');
    $balance.toggleClass('cost', balance < 0);
    if (balance < 0) $balance.text('-' + Math.abs(balance).abbreviate());
    else $balance.text(balance.abbreviate());
}
function hidePointsPreview() {
    $('.js-amount, .js-bottomLine, .js-balance').hide();
}
function gain(pointsType, amount) {
    state[pointsType] += amount;
    changedPoints(pointsType);
}
function spend(pointsType, amount) {
    if (amount > state[pointsType]) return false;
    state[pointsType] -= amount;
    changedPoints(pointsType);
    return true;
}
function changedPoints(pointsType) {
    capPoints();
    if (pointsType == 'fame') updateHireButtons();
    if (pointsType == 'coins') state.coins = Math.min(state.coins, state.guildStats.maxCoins);
    else updateReforgeButton();
    $('.js-global-' + pointsType).text(state[pointsType].abbreviate());
}

function capPoints() {
    state.coins = Math.min(state.coins, state.guildStats.maxCoins);
    state.anima = Math.min(state.anima, state.guildStats.maxAnima);
}

// Add dynamic help text to coins+anima indicators.
$('.js-coinsContainer').data('helpMethod', () =>
    titleDiv( state.coins + ' / ' + state.guildStats.maxCoins.abbreviate() + ' coins')
        + bodyDiv('Coins are used to create brand new items.')
        + bodyDiv('Coins are found in chests and dropped from defeated enemies.')
);
$('.js-animaContainer').data('helpMethod', () =>
    titleDiv( state.anima + ' / ' + state.guildStats.maxAnima.abbreviate() + ' anima')
        + bodyDiv('Anima is used to enchant items with special powers.')
        + bodyDiv('Anima is absorbed from defeated enemies and salvaged from gems.')
);

var divider = tag('div', 'centered medium', tag('div', 'divider'));
var titleDiv = (titleMarkup) => titleMarkup && tag('div', 'title', titleMarkup);
var bodyDiv = (bodyMarkup) => bodyMarkup && tag('div', 'body', bodyMarkup);
