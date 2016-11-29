var prefixes = [];
var allEnchantments = [];
function addPrefix(level, name, tags, bonuses) {
    var affix = {name:name, tags:tags, bonuses: bonuses};
    prefixes[level] = ifdefor(prefixes[level], []);
    prefixes[level].push(affix);
    allEnchantments.push(affix)
}
var suffixes = [];
function addSuffix(level, name, tags, bonuses) {
    var affix = {name:name, tags:tags, bonuses: bonuses};
    suffixes[level] = ifdefor(suffixes[level], []);
    suffixes[level].push(affix);
    allEnchantments.push(affix)
}

addPrefix(2, 'Tricky', 'weapon', {'+damageOnMiss': [10, 20]});
addPrefix(12, 'Artful', 'weapon', {'+damageOnMiss': [20, 40]});
addPrefix(22, 'Subtle', 'weapon', {'+damageOnMiss': [40, 80]});
addPrefix(32, 'Wily', 'weapon', {'+damageOnMiss': [70, 120]});
addPrefix(42, 'Sly', 'weapon', {'+damageOnMiss': [100, 160]});
addPrefix(62, 'Devious', 'weapon', {'+damageOnMiss': [150, 200]});

addPrefix(1, 'Strong', 'weapon', {'+minPhysicalDamage': 1, '+maxPhysicalDamage': 2});
addPrefix(5, 'Brutal', 'weapon', {'+minPhysicalDamage': [4,6], '+maxPhysicalDamage': [8,10]});
addPrefix(15, 'Fierce', 'weapon', {'+minPhysicalDamage': [12, 14], '+maxPhysicalDamage': [20, 22]});
addPrefix(30, 'Savage', 'weapon', {'+minPhysicalDamage': [22, 24], '+maxPhysicalDamage': [30, 32]});
addPrefix(45, 'Cruel', 'weapon', {'+minPhysicalDamage': [32, 34], '+maxPhysicalDamage': [40, 42]});
addPrefix(60, 'Bloody', 'weapon', {'+minPhysicalDamage': [35, 40], '+maxPhysicalDamage': [45, 50]});

addPrefix(1, 'Priest\'s', 'weapon', {'+minMagicDamage': 1, '+maxMagicDamage': 2});
addPrefix(6, 'Magic', 'weapon', {'+minMagicDamage': [2,3], '+maxMagicDamage': [6,8]});
addPrefix(16, 'Wizard\'s', 'weapon', {'+minMagicDamage': [8, 10], '+maxMagicDamage': [12, 14]});
addPrefix(31, 'Imbued', 'weapon', {'+minMagicDamage': [14, 16], '+maxMagicDamage': [20, 22]});
addPrefix(46, 'Sorcerer\'s', 'weapon', {'+minMagicDamage': [20, 22], '+maxMagicDamage': [26, 28]});
addPrefix(61, 'Diabolic', 'weapon', {'+minMagicDamage': [25, 30], '+maxMagicDamage': [30, 35]});

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
addPrefix(23, 'Preciser', 'weapon', {'%critChance': [21, 40, 100], '+critAccuracy': [21, 40, 100]});
addPrefix(53, 'Precisest', 'weapon', {'%critChance': [41, 70, 100], '+critAccuracy': [41, 70, 100]});


addPrefix(11, 'Rough', armorSlots, {'%armor': [2, 6, 100]});
addPrefix(21, 'Thick', armorSlots, {'%armor': [5, 10, 100]});
addPrefix(31, 'Refined', armorSlots, {'%armor': [10, 15, 100]});
addPrefix(41, 'Hardened', armorSlots, {'%armor': [15, 20, 100]});
addPrefix(51, 'Petrified', armorSlots, {'%armor': [20, 25, 100]});
addPrefix(71, 'Indomitable', armorSlots, {'%armor': [25, 30, 100]});

addPrefix(11, 'E1', armorSlots, {'%evasion': [2, 6, 100]});
addPrefix(21, 'E2', armorSlots, {'%evasion': [5, 10, 100]});
addPrefix(31, 'E3', armorSlots, {'%evasion': [10, 15, 100]});
addPrefix(41, 'E4', armorSlots, {'%evasion': [15, 20, 100]});
addPrefix(51, 'E5', armorSlots, {'%evasion': [20, 25, 100]});
addPrefix(71, 'E6', armorSlots, {'%evasion': [25, 30, 100]});

addPrefix(11, 'B1', armorSlots, {'%block': [2, 6, 100]});
addPrefix(21, 'B2', armorSlots, {'%block': [5, 10, 100]});
addPrefix(31, 'B3', armorSlots, {'%block': [10, 15, 100]});
addPrefix(41, 'B4', armorSlots, {'%block': [15, 20, 100]});
addPrefix(51, 'B5', armorSlots, {'%block': [20, 25, 100]});
addPrefix(71, 'B6', armorSlots, {'%block': [25, 30, 100]});

addPrefix(11, 'M1', armorSlots, {'%magicBlock': [2, 6, 100]});
addPrefix(21, 'M2', armorSlots, {'%magicBlock': [5, 10, 100]});
addPrefix(31, 'M3', armorSlots, {'%magicBlock': [10, 15, 100]});
addPrefix(41, 'M4', armorSlots, {'%magicBlock': [15, 20, 100]});
addPrefix(51, 'M5', armorSlots, {'%magicBlock': [20, 25, 100]});
addPrefix(71, 'M6', armorSlots, {'%magicBlock': [25, 30, 100]});

addPrefix(1, 'Hardy', 'body', {'+maxHealth': [20, 30]});
addPrefix(10, 'Fit', 'body', {'+maxHealth': [40, 60]});
addPrefix(25, 'Powerful', 'body', {'+maxHealth': [70, 90]});
addPrefix(40, 'Robust', 'body', {'+maxHealth': [100, 120]});
addPrefix(55, 'Vigorous', 'body', {'+maxHealth': [140, 160]});
addPrefix(70, 'Stalwart', 'body', {'+maxHealth': [180, 200]});

addPrefix(1, 'Enlarged', smallArmorSlots.concat(accessorySlots), {'+maxHealth': [12, 18]});
addPrefix(10, 'Enhanced', smallArmorSlots.concat(accessorySlots), {'+maxHealth': [24, 36]});
addPrefix(25, 'Augmented', smallArmorSlots.concat(accessorySlots), {'+maxHealth': [42, 54]});
addPrefix(40, 'Boosted', smallArmorSlots.concat(accessorySlots), {'+maxHealth': [60, 72]});
addPrefix(55, 'Amplified', smallArmorSlots.concat(accessorySlots), {'+maxHealth': [84, 96]});
addPrefix(70, 'Maximized', smallArmorSlots.concat(accessorySlots), {'+maxHealth': [108, 120]});

addPrefix(1, 'Relaxing', smallArmorSlots.concat(accessorySlots), {'+healthRegen': [10, 20, 10]});
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

addSuffix(1, 'Shininess', armorSlots, {'+magicBlock': [1, 3]});
addSuffix(9, 'Brightness', armorSlots, {'+magicBlock': [4, 6]});
addSuffix(24, 'Lustrousness', armorSlots, {'+magicBlock': [7, 10]});
addSuffix(39, 'Glory', armorSlots, {'+magicBlock': [11, 15]});
addSuffix(54, 'The Moon', armorSlots, {'+magicBlock': [16, 22]});
addSuffix(69, 'The Sun', armorSlots, {'+magicBlock': [23, 30]});

addSuffix(1, 'Toughness', armorSlots, {'+armor': [2, 6]});
addSuffix(10, 'Durability', armorSlots, {'+armor': [8, 12]});
addSuffix(20, 'Permanence', armorSlots, {'+armor': [14, 20]});
addSuffix(30, 'The Mountain', armorSlots, {'+armor': [22, 30]});
addSuffix(40, 'The Paladin', armorSlots, {'+armor': [32, 44]});
addSuffix(50, 'Indestructibility', armorSlots, {'+armor': [46, 60]});

addSuffix(1, 'Deflecting', armorSlots, {'+block': [2, 6]});
addSuffix(11, 'Intercepting', armorSlots, {'+block': [8, 12]});
addSuffix(21, 'Blocking', armorSlots, {'+block': [14, 20]});
addSuffix(31, 'Guarding', armorSlots, {'+block': [22, 30]});
addSuffix(41, 'Protecting', armorSlots, {'+block': [32, 44]});
addSuffix(51, 'The Wall', armorSlots, {'+block': [46, 60]});

addSuffix(1, 'Mitigation', armorSlots, {'+evasion': [2, 6]});
addSuffix(12, 'Dodging', armorSlots, {'+evasion': [8, 12]});
addSuffix(22, 'Evasion', armorSlots, {'+evasion': [14, 20]});
addSuffix(32, 'Avoidance', armorSlots, {'+evasion': [22, 30]});
addSuffix(42, 'Illusion', armorSlots, {'+evasion': [32, 44]});
addSuffix(52, 'Vanishing', armorSlots, {'+evasion': [46, 60]});

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
addSuffix(61, 'Unsurpassed Dexterity', accessorySlots, {'+dexterity': [31, 50]});
addSuffix(61, 'Unsurpassed Intelligence', accessorySlots, {'+intelligence': [31, 50]});

var affixesByKey = {};
$.each(prefixes, function (level, levelAffixes) {
    ifdefor(levelAffixes, []).forEach(function (affix) {
        var key = affix.name.replace(/\s*/g, '').toLowerCase();
        if (affixesByKey[key]) {
            throw new Error('affix key ' + key + ' is already used.');
        }
        affixesByKey[key] = affix;
        affix.level = level;
        affix.prefix = true;
        affix.key = key;
    });
});
$.each(suffixes, function (level, levelAffixes) {
    ifdefor(levelAffixes, []).forEach(function (affix) {
        var key = affix.name.replace(/\s*/g, '').toLowerCase();
        if (affixesByKey[key]) {
            throw new Error('affix key ' + key + ' is already used.');
        }
        affixesByKey[key] = affix;
        affix.level = level;
        affix.suffix = true;
        affix.key = key;
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
    var possibleAffixes = matchingAffixes(prefixes, item, alreadyUsed);
    if (possibleAffixes.length === 0) {
        console.log('No prefixes available for this item:');
        console.log(item);
        return;
    }
    var newAffix = makeAffix(Random.element(possibleAffixes));
    item.prefixes.push(newAffix);
}
function addSuffixToItem(item) {
    var alreadyUsed = [];
    item.suffixes.forEach(function (affix) {alreadyUsed.push(affix.base);});
    var possibleAffixes = matchingAffixes(suffixes, item, alreadyUsed);
    if (possibleAffixes.length === 0) {
        console.log('No suffixes available for this item:');
        console.log(item);
        return;
    }
    var newAffix = makeAffix(Random.element(possibleAffixes));
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
    if (!tags.length) return true;
    for (var tag of tags) if (baseItem.tags[tag]) return true;
    return false;
}
$('.js-resetEnchantments').on('click', resetItem);
$('.js-enchant').on('click', enchantItem);
$('.js-imbue').on('click', imbueItem);
$('.js-augment').on('click', augmentItem);
$('.js-mutate').on('click', mutateItem);

function updateEnchantmentOptions() {
    var item =  $('.js-enchantmentSlot').find('.js-item').data('item');
    if (!item && $dragHelper) {
        item = $dragHelper.data('$source').data('item');
    }
    if (!item) {
        return;
    }
    var prefixes = item.prefixes.length;
    var suffixes = item.suffixes.length;
    var total = prefixes + suffixes;
    var value = sellValue(item);
    if (total > 0) {
        $('.js-resetEnchantments').toggleClass('disabled', state.coins < resetCost(item))
            .attr('helptext', 'Offer ' + points('coins', resetCost(item)) + ' to remove all enchantments from an item.<br/>This will allow you to enchant it again differently.');
    } else {
        $('.js-resetEnchantments').addClass('disabled').attr('helptext', 'This item has no enchantments on it.');
    }
    $('.js-enchant,.js-imbue').show();
    $('.js-augment,.js-mutate').hide();
    if (item.unique) {
        $('.js-enchant,.js-imbue').addClass('disabled').attr('helptext', 'This item is unique and cannot be further enchanted.');
        return;
    }
    if (total == 0) {
        $('.js-enchant').toggleClass('disabled', state.anima < enchantCost(item))
            .attr('helptext', 'Offer ' + points('anima', enchantCost(item)) + ' to add up to two magical properties to this item');
        $('.js-imbue').toggleClass('disabled', state.anima < imbueCost(item))
            .attr('helptext', 'Offer ' + points('anima', imbueCost(item)) + ' to add three to four magical properties to this item');
        return;
    }
    $('.js-enchant,.js-imbue').hide();
    $('.js-augment,.js-mutate').show();
    if (total < 4) {
        var augmentPrice = augmentCost(item);
        $('.js-augment').toggleClass('disabled', state.anima < augmentPrice)
            .attr('helptext', 'Offer ' + points('anima', augmentPrice) + ' to add another magical property to this item.');
    } else {
        $('.js-augment').addClass('disabled').attr('helptext', 'This item cannot hold any more enchantments.');
    }
    var mutationPrice = mutateCost(item);
    $('.js-mutate').toggleClass('disabled', state.anima < mutationPrice)
        .attr('helptext', 'Offer ' + points('anima', mutationPrice) + ' to randomize the magical properties of this item.');
}
function resetCost(item) {
    return sellValue(item) * 10;
}
function enchantCost(item) {
    return sellValue(item) * 5;
}
function imbueCost(item) {
    return sellValue(item) * 25;
}
function augmentCost(item) {
    return sellValue(item) * ((item.prefixes.length && item.suffixes.length) ? 50 : 10);
}
function mutateCost(item) {
    return sellValue(item) * ((item.prefixes.length < 2 && item.suffixes.length < 2) ? 6 : 30);
}
function resetItem() {
    var item = $('.js-enchantmentSlot').find('.js-item').data('item');
    if (!spend('coins', resetCost(item))) {
        return;
    }
    item.prefixes = [];
    item.suffixes = [];
    delete item.displayName;
    item.unique = false;
    updateItem(item);
    updateEnchantmentOptions();
    saveGame();
}
function enchantItem() {
    var item = $('.js-enchantmentSlot').find('.js-item').data('item');
    if (!spend('anima', enchantCost(item))) return;
    enchantItemProper(item);
    saveGame();
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
    if (!spend('anima', imbueCost(item))) return;
    imbueItemProper(item);
    saveGame();
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
    if (item.prefixes.length + item.suffixes.length >= 4) return;
    if (!spend('anima', augmentCost(item))) return;
    augmentItemProper(item);
    updateEnchantmentOptions();
    saveGame();
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
    if (!spend('anima', mutateCost(item))) {
        return;
    }
    if (item.prefixes.length < 2 && item.suffixes.length < 2) enchantItemProper(item);
    else imbueItemProper(item);
    saveGame();
}
