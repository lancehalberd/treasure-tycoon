var prefixes = [
    [
        {'slot': 'weapon', 'name': 'Tricky', 'bonuses': {'+damageOnMiss': [1, 2]}},
        {'slot': 'weapon', 'name': 'Strong', 'bonuses': {'+minDamage': 1, '+maxDamage': 2}},
        {'slot': 'weapon', 'name': 'Swift',  'bonuses': {'%attackSpeed': [5, 10, 100]}},
        {'slot': 'weapon', 'name': 'Sticky', 'bonuses': {'+slowOnHit': [5, 10, 100]}},
        {'slot': armorSlots, 'name': 'Hardy', 'bonuses': {'+maxHealth': [5, 10]}},
        {'slot': armorSlots, 'name': 'Soothing', 'bonuses': {'+healthRegen': [1, 2]}},
        {'slot': accessorySlots, 'name': 'Basic', 'bonuses': {}},
        {'slot': accessorySlots, 'name': 'Plain', 'bonuses': {}},
        {'slot': accessorySlots, 'name': 'Simple', 'bonuses': {}}
    ]
];
var suffixes = [
    [
        {'slot': 'weapon', 'type': ['bow', 'wand'], 'name': 'Farsight', 'bonuses': {'+range': [1, 2]}},
        {'slot': 'weapon', 'name': 'Leeching', 'bonuses': {'+healthGainOnHit': [1, 2]}},
        {'slot': 'weapon', 'name': 'Aiming', 'bonuses': {'+accuracy': [1, 5]}},
        {'slot': armorSlots, 'name': 'Toughness', 'bonuses': {'+armor': [1, 2]}},
        {'slot': armorSlots, 'name': 'Deflecting', 'bonuses': {'+block': [1, 2]}},
        {'slot': accessorySlots, 'name': 'Emptiness', 'bonuses': {}},
        {'slot': accessorySlots, 'name': 'Disappointment', 'bonuses': {}},
        {'slot': accessorySlots, 'name': 'Frustration', 'bonuses': {}}
    ]
];
function makeAffix(baseAffix) {
    var affix = {
        'base': baseAffix,
        'bonuses': []
    };
    $.each(baseAffix.bonuses, function (key, value) {
        if (Array.isArray(value)) {
            affix.bonuses[key] = Random.range(value[0], value[1]) / ifdefor(value[2], 1);
        } else {
            affix.bonuses[key] = value;
        }
    });
    return affix;
}
function addPrefix(item) {
    var alreadyUsed = [];
    item.prefixes.forEach(function (affix) {alreadyUsed.push(affix.base);});
    item.prefixes.push(makeAffix(Random.element(matchingAffixes(prefixes, item, alreadyUsed))));
}
function addSuffix(item) {
    var alreadyUsed = [];
    item.suffixes.forEach(function (affix) {alreadyUsed.push(affix.base);});
    item.suffixes.push(makeAffix(Random.element(matchingAffixes(suffixes, item, alreadyUsed))));
}
function matchingAffixes(list, item, alreadyUsed) {
    var choices = [];
    for (var level = 0; level < item.level && level < list.length; level++) {
        list[level].forEach(function (affix) {
            if (alreadyUsed.indexOf(affix) < 0 && affixMatchesItem(item.base, affix)) {
                choices.push(affix);
            }
        });
    }
    return choices;
}
function affixMatchesItem(baseItem, affix) {
    var slots = Array.isArray(affix.slot) ? affix.slot : [affix.slot];
    if (slots.indexOf(baseItem.slot) < 0) {
        return false;
    }
    if (!ifdefor(affix.type)) {
        return true;
    }
    var types = Array.isArray(affix.type) ? affix.type : [affix.type];
    if (types.indexOf(baseItem.type) < 0) {
        return false;
    }
    return true;
}
$('.js-enchantmentOption.js-reset').on('click', resetItem);
$('.js-enchantmentOption.js-enchant').on('click', enchantItem);
$('.js-enchantmentOption.js-imbue').on('click', imbueItem);
$('.js-enchantmentOption.js-gamble').on('click', gambleItem);
$('.js-enchantmentOption.js-augment').on('click', augmentItem);
$('.js-enchantmentOption.js-mutate').on('click', mutateItem);

function updateEnchantmentOptions() {
    $('.js-enchantmentOption').hide();
    var $item =  $('.js-enchantmentSlot').find('.js-item');
    if ($item.length == 0) {
        return;
    }
    var item = $item.data('item');
    var prefixes = item.prefixes.length;
    var suffixes = item.suffixes.length;
    var total = prefixes + suffixes;
    var value = sellValue(item);
    if (total > 0) {
        $('.js-enchantmentOption.js-reset').show().html('Reset: ' + points('IP', value * 10));
    }
    if (total == 0) {
        $('.js-enchantmentOption.js-enchant').show().html('Enchant: ' + points('MP', (value * 10)));
        $('.js-enchantmentOption.js-imbue').show().html('Imbue: ' + points('RP', (value * 10)));
        $('.js-enchantmentOption.js-gamble').show().html('Gamble: ' + points('MP', (value * 2)) + ' ' + points('RP', (value * 2)));
    }
    if (total == 1) {
        $('.js-enchantmentOption.js-augment').show().html('Augment: ' + points('MP', (value * 20)));
    }
    if (total == 2 || total == 3) {
        $('.js-enchantmentOption.js-augment').show().html('Augment: ' + points('RP', (value * 20)));
    }
    if (total == 1 || total == 2) {
        $('.js-enchantmentOption.js-mutate').show().html('Mutate: ' + points('MP', (value * 12)));
    }
    if (total == 3 || total == 4) {
        $('.js-enchantmentOption.js-mutate').show().html('Mutate: ' + points('RP', (value * 12)));
    }
}
function resetItem() {
    var item = $('.js-enchantmentSlot').find('.js-item').data('item');
    if (!spend('IP', sellValue(item) * 10)) {
        return;
    }
    item.prefixes = [];
    item.suffixes = [];
    updateItem(item);
    updateEnchantmentOptions();
}
function enchantItem() {
    var item = $('.js-enchantmentSlot').find('.js-item').data('item');
    if (!spend('MP', sellValue(item) * 10)) {
        return;
    }
    enchantItemProper(item);
}
function enchantItemProper(item) {
    item.prefixes = [];
    item.suffixes = [];
    if (Math.random() < .5) {
        addPrefix(item);
        if (Math.random() < .5) addSuffix(item);
    } else {
        addSuffix(item);
        if (Math.random() < .5) addPrefix(item);
    }
    updateItem(item);
    updateEnchantmentOptions();
}
function imbueItem() {
    var item = $('.js-enchantmentSlot').find('.js-item').data('item');
    if (!spend('RP', sellValue(item) * 10)) {
        return;
    }
    imbueItemProper(item);
}
function imbueItemProper(item) {
    item.prefixes = [];
    item.suffixes = [];
    addPrefix(item);
    addSuffix(item);
    if (Math.random() < .5) {
        addPrefix(item);
        if (Math.random() < .5) addSuffix(item);
    } else {
        addSuffix(item);
        if (Math.random() < .5) addPrefix(item);
    }
    updateItem(item);
    updateEnchantmentOptions();
}
function gambleItem() {
    var item = $('.js-enchantmentSlot').find('.js-item').data('item');
    var cost = sellValue(item) * 2;
    if (cost > state.MP || cost > state.RP) {
        return;
    }
    spend('MP', cost);
    spend('RP', cost);
    // TODO: Add chance of getting unique version of item here.
    if (Math.random() > .25) enchantItemProper(item);
    else imbueItemProper(item)
}
function augmentItem() {
    var item = $('.js-enchantmentSlot').find('.js-item').data('item');
    if (!item.prefixes.length) {
        if (!spend('MP', sellValue(item) * 20)) {
            return;
        }
        addPrefix(item);
    } else if (!item.suffixes.length) {
        if (!spend('MP', sellValue(item) * 20)) {
            return;
        }
        addSuffix(item);
    } else {
        if (!spend('RP', sellValue(item) * 20)) {
            return;
        }
        if (item.suffixes.length == 2) {
            addPrefix(item);
        } else if (item.prefixes.length == 2) {
            addSuffix(item);
        } else if (Math.random() > .5) {
            addPrefix(item);
        } else {
            addSuffix(item);
        }
    }
    updateItem(item);
    updateEnchantmentOptions();
}
function mutateItem() {
    var item = $('.js-enchantmentSlot').find('.js-item').data('item');
    if (item.prefixes.length < 2 && item.suffixes.length < 2) {
        if (!spend('MP', sellValue(item) * 12)) {
            return;
        }
        enchantItemProper(item);
    } else {
        if (!spend('RP', sellValue(item) * 12)) {
            return;
        }
        imbueItemProper(item);
    }
}