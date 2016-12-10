var prefixes = [];
var allEnchantments = [];
function addPrefix(level, name, tags, bonuses) {
    var affix = {level: level, name:name, tags:tags, bonuses: bonuses, prefix: true};
    prefixes[level] = ifdefor(prefixes[level], []);
    prefixes[level].push(affix);
    allEnchantments.push(affix)
}
var suffixes = [];
function addSuffix(level, name, tags, bonuses) {
    var affix = {level: level, name:name, tags:tags, bonuses: bonuses, suffix: true};
    suffixes[level] = ifdefor(suffixes[level], []);
    suffixes[level].push(affix);
    allEnchantments.push(affix)
}

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

addPrefix(1, 'Hardy', 'body', {'%maxHealth': [3, 9, 100]});
addPrefix(12, 'Staunch', 'body', {'%maxHealth': [7, 15, 100]});
addPrefix(22, 'Steadfast', 'body', {'%maxHealth': [15, 21, 100]});
addPrefix(32, 'Resilient', 'body', {'%maxHealth': [21, 30, 100]});
addPrefix(52, 'Enduring', 'body', {'%maxHealth': [30, 37, 100]});
addPrefix(72, 'Perpetual', 'body', {'%maxHealth': [37, 45, 100]});

addPrefix(1, 'Sound', smallArmorSlots.concat(accessorySlots), {'%maxHealth': [2, 6, 100]});
addPrefix(11, 'Hale', smallArmorSlots.concat(accessorySlots), {'%maxHealth': [5, 10, 100]});
addPrefix(21, 'Robust', smallArmorSlots.concat(accessorySlots), {'%maxHealth': [10, 15, 100]});
addPrefix(31, 'Invigorating', smallArmorSlots.concat(accessorySlots), {'%maxHealth': [15, 20, 100]});
addPrefix(51, 'Abiding', smallArmorSlots.concat(accessorySlots), {'%maxHealth': [20, 25, 100]});
addPrefix(71, 'Everlasting', smallArmorSlots.concat(accessorySlots), {'%maxHealth': [25, 30, 100]});

addPrefix(11, 'Rough', armorSlots, {'%armor': [2, 6, 100]});
addPrefix(21, 'Thick', armorSlots, {'%armor': [5, 10, 100]});
addPrefix(31, 'Refined', armorSlots, {'%armor': [10, 15, 100]});
addPrefix(41, 'Hardened', armorSlots, {'%armor': [15, 20, 100]});
addPrefix(51, 'Petrified', armorSlots, {'%armor': [20, 25, 100]});
addPrefix(71, 'Indomitable', armorSlots, {'%armor': [25, 30, 100]});

addPrefix(11, 'Circumspect', armorSlots, {'%evasion': [2, 6, 100]});
addPrefix(21, 'Disguised', armorSlots, {'%evasion': [5, 10, 100]});
addPrefix(31, 'Evasive', armorSlots, {'%evasion': [10, 15, 100]});
addPrefix(41, 'Elusive', armorSlots, {'%evasion': [15, 20, 100]});
addPrefix(51, 'Hidden', armorSlots, {'%evasion': [20, 25, 100]});
addPrefix(71, 'Invisible', armorSlots, {'%evasion': [25, 30, 100]});

addPrefix(11, 'Hindering', armorSlots, {'%block': [2, 6, 100]});
addPrefix(21, 'Impeding', armorSlots, {'%block': [5, 10, 100]});
addPrefix(31, 'Obstructing', armorSlots, {'%block': [10, 15, 100]});
addPrefix(41, 'Halting', armorSlots, {'%block': [15, 20, 100]});
addPrefix(51, 'Arresting', armorSlots, {'%block': [20, 25, 100]});
addPrefix(71, 'Sequestering', armorSlots, {'%block': [25, 30, 100]});

addPrefix(11, 'Annoying', armorSlots, {'%magicBlock': [2, 6, 100]});
addPrefix(21, 'Distracting', armorSlots, {'%magicBlock': [5, 10, 100]});
addPrefix(31, 'Disconcerting', armorSlots, {'%magicBlock': [10, 15, 100]});
addPrefix(41, 'Baffling', armorSlots, {'%magicBlock': [15, 20, 100]});
addPrefix(51, 'Bewildering', armorSlots, {'%magicBlock': [20, 25, 100]});
addPrefix(71, 'Confounding', armorSlots, {'%magicBlock': [25, 30, 100]});

addPrefix(1, 'Relaxing', armorSlots.concat(accessorySlots), {'+healthRegen': [10, 20, 10]});
addPrefix(12, 'Relieving', armorSlots.concat(accessorySlots), {'+healthRegen': [20, 50, 10]});
addPrefix(24, 'Soothing', armorSlots.concat(accessorySlots), {'+healthRegen': [50, 80, 10]});
addPrefix(36, 'Restoring', armorSlots.concat(accessorySlots), {'+healthRegen': [80, 120, 10]});
addPrefix(48, 'Healing', armorSlots.concat(accessorySlots), {'+healthRegen': [120, 160, 10]});
addPrefix(60, 'Reviving', armorSlots.concat(accessorySlots), {'+healthRegen': [160, 200, 10]});

addPrefix(1, 'Warding', accessorySlots, {'+magicResist': [10, 20, 1000]});
addPrefix(8, 'Charmed', accessorySlots, {'+magicResist': [20, 50, 1000]});
addPrefix(18, 'Cloaking', accessorySlots, {'+magicResist': [50, 80, 1000]});
addPrefix(38, 'Enchanted', accessorySlots, {'+magicResist': [80, 120, 1000]});
addPrefix(48, 'Shielding', accessorySlots, {'+magicResist': [120, 160, 1000]});
addPrefix(68, 'Blessed', accessorySlots, {'+magicResist': [160, 200, 1000]});

addPrefix(10, 'Immense', 'heavyArmor', {'%strength': [10, 30, 1000]});
addPrefix(40, 'Gigantic', 'heavyArmor', {'%strength': [40, 60, 1000]});
addPrefix(80, 'Colossal', 'heavyArmor', {'%strength': [80, 100, 1000]});

addPrefix(10, 'Duplicitous', 'lightArmor', {'%dexterity': [10, 30, 1000]});
addPrefix(40, 'Perfidious', 'lightArmor', {'%dexterity': [40, 60, 1000]});
addPrefix(80, 'Machiavellian', 'lightArmor', {'%dexterity': [80, 100, 1000]});

addPrefix(10, 'Gifted', 'clothArmor', {'%intelligence': [10, 30, 1000]});
addPrefix(40, 'Brilliant', 'clothArmor', {'%intelligence': [40, 60, 1000]});
addPrefix(80, 'Unsurpassed', 'clothArmor', {'%intelligence': [80, 100, 1000]});

addSuffix(3, 'Range', 'ranged', {'+range': [5, 10, 10]});
addSuffix(13, 'The Owl', 'ranged', {'+range': [11, 15, 10]});
addSuffix(23, 'Farsight', 'ranged', {'+range': [16, 20, 10]});
addSuffix(43, 'The Hawk', 'ranged', {'+range': [21, 25, 10]});
addSuffix(53, 'Sniping', 'ranged', {'+range': [26, 30, 10]});
addSuffix(63, 'The Eagle', 'ranged', {'+range': [31, 35, 10]});

addSuffix(3, 'Deflecting', 'melee', {'+block': [2, 6]});
addSuffix(13, 'Diverting', 'melee', {'+block': [2, 6]});
addSuffix(23, 'Anticipation', 'melee', {'+block': [2, 6]});
addSuffix(43, 'Parrying', 'melee', {'+block': [2, 6]});
addSuffix(53, 'Fencing', 'melee', {'+block': [2, 6]});
addSuffix(63, 'Aviodance', 'melee', {'+block': [2, 6]});

addSuffix(1, 'Trickery', 'weapon', {'+damageOnMiss': [10, 20]});
addSuffix(11, 'Artfullness', 'weapon', {'+damageOnMiss': [20, 40]});
addSuffix(21, 'Subtly', 'weapon', {'+damageOnMiss': [40, 80]});
addSuffix(31, 'Wiliness', 'weapon', {'+damageOnMiss': [70, 120]});
addSuffix(41, 'Slyness', 'weapon', {'+damageOnMiss': [100, 160]});
addSuffix(61, 'Deviousness', 'weapon', {'+damageOnMiss': [150, 200]});

addSuffix(1, 'Soaking', 'weapon', {'+healthGainOnHit': [1, 2]});
addSuffix(11, 'Leaching', 'weapon', {'+healthGainOnHit': [2, 5]});
addSuffix(21, 'Draining', 'weapon', {'+healthGainOnHit': [5, 8]});
addSuffix(31, 'Feeding', 'weapon', {'+healthGainOnHit': [8, 12]});
addSuffix(41, 'Feasting', 'weapon', {'+healthGainOnHit': [12, 16]});
addSuffix(51, 'The Parasite', 'weapon', {'+healthGainOnHit': [16, 20]});

addSuffix(1, 'Aiming', 'weapon', {'+accuracy': [3, 5]});
addSuffix(12, 'The Archer', 'weapon', {'+accuracy': [6, 9]});
addSuffix(22, 'Accuracy', 'weapon', {'+accuracy': [10, 14]});
addSuffix(32, 'The Marksman', 'weapon', {'+accuracy': [15, 21]});
addSuffix(42, 'Precision', 'weapon', {'+accuracy': [22, 29]});
addSuffix(52, 'The Sniper', 'weapon', {'+accuracy': [30, 40]});

addSuffix(4, 'Tempo', 'weapon', {'+cooldownReduction': [10, 15, 1000]});
addSuffix(19, 'Cadence', 'weapon', {'+cooldownReduction': [20, 25, 1000]});
addSuffix(34, 'Rythum', 'weapon', {'+cooldownReduction': [30, 35, 1000]});
addSuffix(49, 'Haste', 'weapon', {'+cooldownReduction': [40, 50, 1000]});
addSuffix(64, 'The Bard', 'weapon', {'+cooldownReduction': [60, 70, 1000]});
addSuffix(74, 'The Sage', 'weapon', {'+cooldownReduction': [80, 100, 1000]});

addSuffix(15, 'The Vampire', 'weapon', {'+lifeSteal': [10, 15, 1000]});
addSuffix(40, 'The Dark Knight', 'weapon', {'+lifeSteal': [18, 23, 1000]});
addSuffix(75, 'The Dread Lord', 'weapon', {'+lifeSteal': [25, 30, 1000]});

addSuffix(1, 'Health', 'body', {'+maxHealth': [20, 30]});
addSuffix(10, 'Fitness', 'body', {'+maxHealth': [40, 60]});
addSuffix(25, 'Power', 'body', {'+maxHealth': [70, 90]});
addSuffix(40, 'Robustness', 'body', {'+maxHealth': [100, 120]});
addSuffix(55, 'Vigor', 'body', {'+maxHealth': [140, 160]});
addSuffix(70, 'Stalwartness', 'body', {'+maxHealth': [180, 200]});

addSuffix(1, 'Enlarging', smallArmorSlots.concat(accessorySlots), {'+maxHealth': [12, 18]});
addSuffix(10, 'Enhancing', smallArmorSlots.concat(accessorySlots), {'+maxHealth': [24, 36]});
addSuffix(25, 'Augmenting', smallArmorSlots.concat(accessorySlots), {'+maxHealth': [42, 54]});
addSuffix(40, 'Boosting', smallArmorSlots.concat(accessorySlots), {'+maxHealth': [60, 72]});
addSuffix(55, 'Amplifcation', smallArmorSlots.concat(accessorySlots), {'+maxHealth': [84, 96]});
addSuffix(70, 'Maximization', smallArmorSlots.concat(accessorySlots), {'+maxHealth': [108, 120]});

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

addSuffix(1, 'Delaying', armorSlots, {'+block': [2, 6]});
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

addSuffix(5, 'Courage', 'heavyArmor', {'+strength': [3, 6]});
addSuffix(25, 'Valor', 'heavyArmor', {'+strength': [10, 20]});
addSuffix(55, 'Heroism', 'heavyArmor', {'+strength': [30, 40]});

addSuffix(5, 'Finesse', 'lightArmor', {'+dexterity': [3, 6]});
addSuffix(25, 'Skill', 'lightArmor', {'+dexterity': [10, 20]});
addSuffix(55, 'Mastery', 'lightArmor', {'+dexterity': [30, 40]});

addSuffix(5, 'Insight', 'clothArmor', {'+intelligence': [3, 6]});
addSuffix(25, 'Comprehension', 'clothArmor', {'+intelligence': [10, 20]});
addSuffix(55, 'Genius', 'clothArmor', {'+intelligence': [30, 40]});

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
for (var affix of allEnchantments) {
    var key = affix.name.replace(/\s*/g, '').toLowerCase();
    if (affixesByKey[key]) throw new Error('affix key ' + key + ' is already used.');
    affixesByKey[key] = affix;
    affix.key = key;
}
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
