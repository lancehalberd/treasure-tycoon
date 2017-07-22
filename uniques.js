function addUnique(itemKey, initialChance, incrementChance, displayName, prefixes, suffixes) {
    for (var prefix of prefixes) {
        if (!prefixesByKey[prefix]) throw new Error("no prefix called " + prefix);
    }
    for (var suffix of suffixes) {
        if (!suffixesByKey[suffix]) throw new Error("no prefix called " + suffix);
    }
    var baseItem = itemsByKey[itemKey];
    baseItem.unique = {
        initialChance,
        incrementChance,
        'chance': initialChance,
        displayName,
        prefixes,
        suffixes
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

// leeching got renamed to soaking, but I don't want to change the name or the level, so I'm just kind of lying now.
addUnique('primitivebow', .25, .25, 'Stick, Sticky Bow of Aiming and Leeching and Leeching and Aiming', ['sticky', 'sticky'], ['aiming','soaking','aiming','soaking']);