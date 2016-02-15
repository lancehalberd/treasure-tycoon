var prefixes = [];
function addPrefix(level, name, tags, bonuses) {
    prefixes[level] = ifdefor(prefixes[level], []);
    prefixes[level].push({name:name, tags:tags, bonuses: bonuses});
}
var suffixes = [];
function addSuffix(level, name, tags, bonuses) {
    suffixes[level] = ifdefor(suffixes[level], []);
    suffixes[level].push({name:name, tags:tags, bonuses: bonuses});
}

addPrefix(2, 'Tricky', 'weapon', {'+damageOnMiss': [10, 20]});
addPrefix(12, 'Artful', 'weapon', {'+damageOnMiss': [20, 40]});
addPrefix(22, 'Subtle', 'weapon', {'+damageOnMiss': [40, 80]});
addPrefix(32, 'Wily', 'weapon', {'+damageOnMiss': [70, 120]});
addPrefix(42, 'Sly', 'weapon', {'+damageOnMiss': [100, 160]});
addPrefix(62, 'Devious', 'weapon', {'+damageOnMiss': [150, 200]});

addPrefix(1, 'Strong', 'weapon', {'+minDamage': 1, '+maxDamage': 2});
addPrefix(5, 'Brutal', 'weapon', {'+minDamage': [4,6], '+maxDamage': [8,10]});
addPrefix(15, 'Fierce', 'weapon', {'+minDamage': [12, 14], '+maxDamage': 20});
addPrefix(30, 'Savage', 'weapon', {'+minDamage': 22, '+maxDamage': 30});
addPrefix(45, 'Cruel', 'weapon', {'+minDamage': 30, '+maxDamage': 40});
addPrefix(60, 'Bloody', 'weapon', {'+minDamage': 36, '+maxDamage': [45-50]});

addPrefix(7, 'Angry', 'weapon', {'*damage': [102, 105, 100]});
addPrefix(17, 'Irate', 'weapon', {'*damage': [106, 112, 100]});
addPrefix(27, 'Infuriated', 'weapon', {'*damage': [113, 120, 100]});
addPrefix(37, 'Seething', 'weapon', {'*damage': [121, 129, 100]});
addPrefix(47, 'Enraged', 'weapon', {'*damage': [130, 139, 100]});
addPrefix(67, 'Wrathful', 'weapon', {'*damage': [140, 150, 100]});

addPrefix(1, 'Brisk', 'weapon', {'%attackSpeed': [3, 6, 100]});
addPrefix(4, 'Swift', 'weapon', {'%attackSpeed': [7, 12, 100]});
addPrefix(14, 'Quick', 'weapon', {'%attackSpeed': [13, 20, 100]});
addPrefix(24, 'Rapid', 'weapon', {'%attackSpeed': [21, 30, 100]});
addPrefix(34, 'Fleet', 'weapon', {'%attackSpeed': [31, 42, 100]});
addPrefix(50, 'Hyper', 'weapon', {'%attackSpeed': [43, 56, 100]});

addPrefix(1, 'Sticky', 'weapon', {'+slowOnHit': [7, 10, 100]});
addPrefix(8, 'Gooey', 'weapon', {'+slowOnHit': [11, 15, 100]});
addPrefix(18, 'Viscuous', 'weapon', {'+slowOnHit': [16, 21, 100]});
addPrefix(33, 'Hobbling', 'weapon', {'+slowOnHit': [22, 27, 100]});
addPrefix(43, 'Crippling', 'weapon', {'+slowOnHit': [28, 36, 100]});
addPrefix(58, 'Paralyzing', 'weapon', {'+slowOnHit': [37, 45, 100]});

addPrefix(13, 'Keen', 'weapon', {'+critDamage': [10, 20, 100]});
addPrefix(33, 'Sharp', 'weapon', {'+critDamage': [21, 40, 100]});
addPrefix(63, 'Deadly', 'weapon', {'+critDamage': [41, 70, 100]});

addPrefix(3, 'Precise', 'weapon', {'%critChance': [10, 20, 100], '+critAccuracy': [10, 20, 100]});
addPrefix(23, 'Precise', 'weapon', {'%critChance': [21, 40, 100], '+critAccuracy': [21, 40, 100]});
addPrefix(53, 'Precise', 'weapon', {'%critChance': [41, 70, 100], '+critAccuracy': [41, 70, 100]});


addPrefix(11, 'Hardy', armorSlots, {'%armor': [2, 6, 100]});
addPrefix(21, 'Thick', armorSlots, {'%armor': [5, 10, 100]});
addPrefix(31, 'Refined', armorSlots, {'%armor': [10, 15, 100]});
addPrefix(41, 'Hardened', armorSlots, {'%armor': [15, 20, 100]});
addPrefix(51, 'Petrified', armorSlots, {'%armor': [20, 25, 100]});
addPrefix(71, 'Indomitable', armorSlots, {'%armor': [25, 30, 100]});

addPrefix(1, 'Polished', armorSlots, {'+magicBlock': [3, 5]});
addPrefix(9, 'Glowing', armorSlots, {'+magicBlock': [6, 9]});
addPrefix(24, 'Lustrous', armorSlots, {'+magicBlock': [10, 14]});
addPrefix(39, 'Shining', armorSlots, {'+magicBlock': [15, 21]});
addPrefix(54, 'Glorious', armorSlots, {'+magicBlock': [22, 29]});
addPrefix(69, 'Radiant', armorSlots, {'+magicBlock': [30, 40]});

addPrefix(1, 'Hardy', 'body', {'+maxHealth': [20, 30]});
addPrefix(10, 'Fit', 'body', {'+maxHealth': [40, 60]});
addPrefix(25, 'Strong', 'body', {'+maxHealth': [70, 90]});
addPrefix(40, 'Robust', 'body', {'+maxHealth': [100, 120]});
addPrefix(55, 'Vigorous', 'body', {'+maxHealth': [140, 160]});
addPrefix(70, 'Stalwart', 'body', {'+maxHealth': [180, 200]});

addPrefix(1, 'Enlarged', smallArmorSlots.concat(accessorySlots), {'+maxHealth': [12, 18]});
addPrefix(10, 'Enhanced', smallArmorSlots.concat(accessorySlots), {'+maxHealth': [24, 36]});
addPrefix(25, 'Augmented', smallArmorSlots.concat(accessorySlots), {'+maxHealth': [42, 54]});
addPrefix(40, 'Boosted', smallArmorSlots.concat(accessorySlots), {'+maxHealth': [60, 72]});
addPrefix(55, 'Amplified', smallArmorSlots.concat(accessorySlots), {'+maxHealth': [84, 96]});
addPrefix(70, 'Maximized', smallArmorSlots.concat(accessorySlots), {'+maxHealth': [108, 120]});

addPrefix(2, 'Relaxing', smallArmorSlots.concat(accessorySlots), {'+healthRegen': [10, 20, 10]});
addPrefix(12, 'Relieving', smallArmorSlots.concat(accessorySlots), {'+healthRegen': [20, 50, 10]});
addPrefix(24, 'Soothing', smallArmorSlots.concat(accessorySlots), {'+healthRegen': [50, 80, 10]});
addPrefix(36, 'Restoring', smallArmorSlots.concat(accessorySlots), {'+healthRegen': [80, 120, 10]});
addPrefix(48, 'Healing', smallArmorSlots.concat(accessorySlots), {'+healthRegen': [120, 160, 10]});
addPrefix(60, 'Reviving', smallArmorSlots.concat(accessorySlots), {'+healthRegen': [160, 200, 10]});

addPrefix(1, 'Warding', accessorySlots, {'+magicResist': [10, 20, 1000]});
addPrefix(8, 'Charmed', accessorySlots, {'+magicResist': [20, 50, 1000]});
addPrefix(18, 'Cloaking', accessorySlots, {'+magicResist': [50, 80, 1000]});
addPrefix(38, 'Enchanted', accessorySlots, {'+magicResist': [80, 120, 1000]});
addPrefix(48, 'Shielding', accessorySlots, {'+magicResist': [120, 160, 1000]});
addPrefix(68, 'Blessed', accessorySlots, {'+magicResist': [160, 200, 1000]});

addSuffix(3, 'Range', 'ranged', {'+range': [5, 10, 10]});
addSuffix(13, 'The Owl', 'ranged', {'+range': [11, 15, 10]});
addSuffix(23, 'Farsight', 'ranged', {'+range': [16, 20, 10]});
addSuffix(43, 'The Hawk', 'ranged', {'+range': [21, 25, 10]});
addSuffix(53, 'Sniping', 'ranged', {'+range': [26, 30, 10]});
addSuffix(63, 'The Eagle', 'ranged', {'+range': [31, 35, 10]});

addSuffix(1, 'Leeching', 'weapon', {'+healthGainOnHit': [1, 2]});
addSuffix(11, 'The Sponge', 'weapon', {'+healthGainOnHit': [2, 5]});
addSuffix(21, 'Feeding', 'weapon', {'+healthGainOnHit': [5, 8]});
addSuffix(31, 'The Parasite', 'weapon', {'+healthGainOnHit': [8, 12]});
addSuffix(41, 'Draining', 'weapon', {'+healthGainOnHit': [12, 16]});
addSuffix(51, 'The Vampire', 'weapon', {'+healthGainOnHit': [16, 20]});

addSuffix(1, 'Aiming', 'weapon', {'+accuracy': [3, 5]});
addSuffix(11, 'The Archer', 'weapon', {'+accuracy': [6, 9]});
addSuffix(21, 'Accuracy', 'weapon', {'+accuracy': [10, 14]});
addSuffix(31, 'The Marksman', 'weapon', {'+accuracy': [15, 21]});
addSuffix(41, 'Precision', 'weapon', {'+accuracy': [22, 29]});
addSuffix(51, 'The Sniper', 'weapon', {'+accuracy': [30, 40]});

addSuffix(1, 'Toughness', armorSlots, {'+armor': [3, 5]});
addSuffix(1, 'Deflecting', armorSlots, {'+block': [3, 5]});
addSuffix(1, 'Evasion', armorSlots, {'+evasion': [3, 6]});

addSuffix(1, 'Minor Strength', accessorySlots, {'+strength': [3, 6]});
addSuffix(1, 'Minor Dexterity', accessorySlots, {'+dexterity': [3, 6]});
addSuffix(1, 'Minor Intelligence', accessorySlots, {'+intelligence': [3, 6]});
addSuffix(11, 'Strength', accessorySlots, {'+strength': [7, 15]});
addSuffix(11, 'Dexterity', accessorySlots, {'+dexterity': [7, 15]});
addSuffix(11, 'Intelligence', accessorySlots, {'+intelligence': [7, 15]});
addSuffix(31, 'Major Strength', accessorySlots, {'+strength': [16, 30]});
addSuffix(31, 'Major Dexterity', accessorySlots, {'+dexterity': [16, 30]});
addSuffix(31, 'Major Intelligence', accessorySlots, {'+intelligence': [16, 30]});
addSuffix(61, 'Unsurpassed Strength', accessorySlots, {'+strength': [31, 50]});
addSuffix(61, 'Unsurpassed  Dexterity', accessorySlots, {'+dexterity': [31, 50]});
addSuffix(61, 'Unsurpassed  Intelligence', accessorySlots, {'+intelligence': [31, 50]});

var affixesByKey = {};
$.each(prefixes, function (level, levelAffixes) {
    ifdefor(levelAffixes, []).forEach(function (affix) {
        var key = affix.name.replace(/\s*/g, '').toLowerCase();
        affixesByKey[key] = affix;
        affix.level = level;
        affix.prefix = true;
    });
});
$.each(suffixes, function (level, levelAffixes) {
    ifdefor(levelAffixes, []).forEach(function (affix) {
        var key = affix.name.replace(/\s*/g, '').toLowerCase();
        affixesByKey[key] = affix;
        affix.level = level;
        affix.suffix = true;
    });
});
function makeAffix(baseAffix) {
    var affix = {
        'base': baseAffix,
        'bonuses': {}
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
function addPrefixToItem(item) {
    var alreadyUsed = [];
    item.prefixes.forEach(function (affix) {alreadyUsed.push(affix.base);});
    var newAffix = makeAffix(Random.element(matchingAffixes(prefixes, item, alreadyUsed)));
    item.prefixes.push(newAffix);
}
function addSuffixToItem(item) {
    var alreadyUsed = [];
    item.suffixes.forEach(function (affix) {alreadyUsed.push(affix.base);});
    var newAffix = makeAffix(Random.element(matchingAffixes(suffixes, item, alreadyUsed)));
    item.suffixes.push(newAffix);
}
function matchingAffixes(list, item, alreadyUsed) {
    var choices = [];
    for (var level = 0; level <= item.itemLevel && level < list.length; level++) {
        ifdefor(list[level], []).forEach(function (affix) {
            if (alreadyUsed.indexOf(affix) < 0 && affixMatchesItem(item.base, affix)) {
                choices.push(affix);
            }
        });
    }
    return choices;
}
function affixMatchesItem(baseItem, affix) {
    var tags = ifdefor(affix.tags, []);
    tags = Array.isArray(tags) ? tags : [tags];
    if (!tags.length) {
        return true;
    }
    var itemTags = ifdefor(baseItem.tags, []).concat([baseItem.slot, baseItem.type]);
    for (var i = 0; i < tags.length; i++) {
        if (itemTags.indexOf(tags[i]) >= 0) {
            return true;
        }
    }
    return false;
}
$('.js-enchantmentOption.js-reset').on('click', resetItem);
$('.js-enchantmentOption.js-enchant').on('click', enchantItem);
$('.js-enchantmentOption.js-imbue').on('click', imbueItem);
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
        $('.js-enchantmentOption.js-reset').show().html('Reset: ' + points('coins', value * 10));
    }
    if (item.unique) {
        return;
    }
    if (total == 0) {
        $('.js-enchantmentOption.js-enchant').show().html('Enchant: ' + points('anima', (value * 10)));
        $('.js-enchantmentOption.js-imbue').show().html('Imbue: ' + points('anima', (value * 50)));
    }
    if (total == 1) {
        $('.js-enchantmentOption.js-augment').show().html('Augment: ' + points('anima', (value * 20)));
    }
    if (total == 2 || total == 3) {
        $('.js-enchantmentOption.js-augment').show().html('Augment: ' + points('anima', (value * 100)));
    }
    if (total == 1 || total == 2) {
        $('.js-enchantmentOption.js-mutate').show().html('Mutate: ' + points('anima', (value * 12)));
    }
    if (total == 3 || total == 4) {
        $('.js-enchantmentOption.js-mutate').show().html('Mutate: ' + points('anima', (value * 60)));
    }
}
function resetItem() {
    var item = $('.js-enchantmentSlot').find('.js-item').data('item');
    if (!spend('coins', sellValue(item) * 10)) {
        return;
    }
    item.prefixes = [];
    item.suffixes = [];
    delete item.displayName;
    item.unique = false;
    updateItem(item);
    updateEnchantmentOptions();
}
function enchantItem() {
    var item = $('.js-enchantmentSlot').find('.js-item').data('item');
    if (!spend('anima', sellValue(item) * 10)) {
        return;
    }
    enchantItemProper(item);
}
function enchantItemProper(item) {
    item.prefixes = [];
    item.suffixes = [];
    if (Math.random() < .5) {
        addPrefixToItem(item);
        if (Math.random() < .5) addSuffixToItem(item);
    } else {
        addSuffixToItem(item);
        if (Math.random() < .5) addPrefixToItem(item);
    }
    updateItem(item);
    updateEnchantmentOptions();
}
function imbueItem() {
    var item = $('.js-enchantmentSlot').find('.js-item').data('item');
    if (!spend('anima', sellValue(item) * 50)) {
        return;
    }
    imbueItemProper(item);
}
function imbueItemProper(item) {
    item.prefixes = [];
    item.suffixes = [];
    addPrefixToItem(item);
    addSuffixToItem(item);
    if (Math.random() < .5) {
        addPrefixToItem(item);
        if (Math.random() < .5) addSuffixToItem(item);
    } else {
        addSuffixToItem(item);
        if (Math.random() < .5) addPrefixToItem(item);
    }
    updateItem(item);
    updateEnchantmentOptions();
}
function augmentItem() {
    var item = $('.js-enchantmentSlot').find('.js-item').data('item');
    if (item.prefixes.length + item.suffixes.length >= 4) {
        return;
    }
    if (!item.prefixes.length || !item.suffixes.length) {
        if (spend('anima', sellValue(item) * 20)) {
            augmentItemProper(item);
            updateEnchantmentOptions();
        }
        return;
    }
    if (spend('anima', sellValue(item) * 100)) {
        augmentItemProper(item);
        updateEnchantmentOptions();
    }
}
function augmentItemProper(item) {
    if (!item.prefixes.length && !item.suffixes.length) {
        if (Math.random() > .5) {
            addPrefixToItem(item);
        } else {
            addSuffixToItem(item);
        }
    } else if (!item.prefixes.length) {
        addPrefixToItem(item);
    } else if (!item.suffixes.length) {
        addSuffixToItem(item);
    } else {
        if (item.suffixes.length == 2) {
            addPrefixToItem(item);
        } else if (item.prefixes.length == 2) {
            addSuffixToItem(item);
        } else if (Math.random() > .5) {
            addPrefixToItem(item);
        } else {
            addSuffixToItem(item);
        }
    }
    updateItem(item);
}
function mutateItem() {
    var item = $('.js-enchantmentSlot').find('.js-item').data('item');
    if (item.prefixes.length < 2 && item.suffixes.length < 2) {
        if (!spend('anima', sellValue(item) * 12)) {
            return;
        }
        enchantItemProper(item);
    } else {
        if (!spend('anima', sellValue(item) * 60)) {
            return;
        }
        imbueItemProper(item);
    }
}