function addUnique(itemKey, initialChance, incrementChance, displayName, prefixes, suffixes) {
    var baseItem = itemsByKey[itemKey];
    baseItem.unique = {
        'initialChance': initialChance,
        'incrementChance': incrementChance,
        'chance': initialChance,
        'displayName': displayName,
        'prefixes': prefixes,
        'suffixes': suffixes
    };
}
function checkToMakeItemUnique(item) {
    var uniqueData = ifdefor(item.base.unique);
    if (!uniqueData) {
        return;
    }
    // If the user fails to roll the unique, increase the chance to roll it next time.
    if (Math.random() > uniqueData.chance) {
        uniqueData.chance += uniqueData.incrementChance;
        return;
    }
    // On success, reset the chance to roll the unique back to its original value.
    uniqueData.chance = uniqueData.initialChance;
    makeItemUnique(item);
}
function makeItemUnique(item) {
    var uniqueData = ifdefor(item.base.unique);
    if (!uniqueData) {
        return;
    }
    item.displayName = uniqueData.displayName;
    uniqueData.prefixes.forEach(function (affix) {
        affix = (typeof(affix) === 'string') ? affixesByKey[affix] : affix;
        item.suffixes.push(makeAffix(affix));
    });
    uniqueData.suffixes.forEach(function (affix) {
        affix = (typeof(affix) === 'string') ? affixesByKey[affix] : affix;
        item.suffixes.push(makeAffix(affix));
    });
    item.unique = true;
}
addUnique('primitivebow', .25, .25, 'Stick, Sticky Bow of Aiming and Leeching and Leeching and Aiming', ['sticky', 'sticky'], ['aiming','leeching','aiming','leeching']);