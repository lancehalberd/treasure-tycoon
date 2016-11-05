function getNameWithAffixes(name, prefixes, suffixes) {
    var prefixNames = prefixes.map(function (affix) { return affix.base.name;});
    if (prefixNames.length) name = prefixNames.join(', ') + ' ' + name;
    var suffixNames = suffixes.map(function (affix) { return affix.base.name;});
    if (suffixNames.length) name = name + ' of ' + suffixNames.join(' and ');
    return name;
}

function getItemHelpText($item) {
    var item = $item.data('item');
    var sections = [];
    // Unique items have a distinct display name that is used instead of the affix generated name.
    if (ifdefor(item.displayName)) sections.push(item.displayName);
    else sections.push(getNameWithAffixes(item.base.name, item.prefixes, item.suffixes));
    if (item.base.tags) sections.push(Object.keys(item.base.tags).map(tagToDisplayName).join(', '));
    if (item.level > state.selectedCharacter.adventurer.level) {
        sections.push('<span style="color: #f00;">Requires level ' + item.level + '</span>');
    } else {
        sections.push('Requires level ' + item.level);
    }
    sections.push('');
    sections.push(bonusSourceHelpText(item.base, state.selectedCharacter.adventurer));

    if (item.prefixes.length || item.suffixes.length) {
        sections.push('');
        item.prefixes.forEach(function (affix) {
            sections.push(bonusSourceHelpText(affix, state.selectedCharacter.adventurer));
        });
        item.suffixes.forEach(function (affix) {
            sections.push(bonusSourceHelpText(affix, state.selectedCharacter.adventurer));
        });
    }
    sections.push('');

    var sellValues = [points('coins', sellValue(item))];
    var total = item.prefixes.length + item.suffixes.length;
    if (total) {
        var animaValue = item.base.level * item.base.level * item.base.level;
        if (total <= 2) sellValues.push(points('anima', animaValue * total));
        else sellValues.push(points('anima', animaValue * total));
    }
    sections.push('Sell for ' + sellValues.join(' '));
    return sections.join('<br/>');
}

function bonusSourceHelpText(bonusSource, actor, localObject) {
    localObject = ifdefor(localObject, bonusSource);
    if (!bonusSource.bonuses) {
        console.log(bonusSource);
        throw new Error('bonusSource must have field called bonuses');
    }
    // Implicit bonuses are on: equipment, actions, effects and buffs.
    var isImplicit = bonusSource.hasImplictBonuses ||
                    (bonusSource.variableObjectType &&
                     (bonusSource.variableObjectType === 'action'
                      || bonusSource.variableObjectType === 'effect'));
    //console.log(isImplicit);
    //console.log(bonusSource);
    // Some stats are displayed in the helptext. In this case, we don't display
    // them a second time as implicit/regular bonuses.
    var displayedStats = {};
    var sections = [];
    if (bonusSource.helpText) {
        sections.push(bonusSource.helpText.replace(/\{(.+)\}/, function (match, key) {
            displayedStats[key] = true;
            return evaluateForDisplay(bonusSource.bonuses[key], actor, localObject);
        }));
        //sections.push(bonusSource.helpText);
    }
    for (var bonus in bonusMap) {
        if (displayedStats[bonus]) continue;
        // If this is an implicit bonus, don't display it as a regular bonus.
        if (isImplicit && implicitBonusMap[bonus]) continue;
        if (!bonusSource.bonuses[bonus]) continue;
        var textOrFunction = bonusMap[bonus];
        if (typeof textOrFunction === 'function') {
            sections.push(textOrFunction(bonusSource, actor));
            continue;
        }
        var text = textOrFunction;
        var wildcard = text.match(/(\$|\%)\d/)[0];
        if (!wildcard) throw new Error('No wildcard found in ' + text);
        var value = evaluateForDisplay(bonusSource.bonuses[bonus], actor, localObject);
        var digits = Number(wildcard[1]);
        if (wildcard[0] === '%') value = value.percent(digits);
        else value = value.format(digits);
        sections.push(text.split(wildcard).join(value));
    }
    if (isImplicit) {
        for (var bonus in implicitBonusMap) {
            if (displayedStats[bonus]) continue;
            if (!bonusSource.bonuses[bonus]) continue;
            var textOrFunction = implicitBonusMap[bonus];
            if (typeof textOrFunction === 'function') {
                sections.push(textOrFunction(bonusSource, actor));
                continue;
            }
            var text = textOrFunction;
            var wildcard = text.match(/(\$|\%)\d/)[0];
            if (!wildcard) throw new Error('No wildcard found in ' + text);
            var value = evaluateForDisplay(bonusSource.bonuses[bonus], actor, localObject);
            var digits = Number(wildcard[1]);
            if (wildcard[0] === '%') value = value.percent(digits);
            else value = value.format(digits);
            sections.push(text.split(wildcard).join(value));
        }
    }
    var tagBonusSources = {};
    $.each(bonusSource.bonuses, function (key, value) {
        // Transform things like {'+bow:magic:minPhysicalDamage': 1} => 'bow:magic': {'+minPhysicalDamage': 1}
        // so that we can display per tag bonuses.
        if (key.indexOf(':') >= 0) {
            var parts = key.split(':');
            var statKey = key.charAt(0) + parts.pop();
            var tagKey = parts.join(':').substring(1);
            // console.log([key,statKey,tagKey]);
            tagBonusSources[tagKey] = ifdefor(tagBonusSources[tagKey], {'bonuses': {}});
            tagBonusSources[tagKey].bonuses[statKey] = value;
        }
    });
    $.each(tagBonusSources, function (tags, tagBonusSource) {
        sections.push(tag('div', 'tagText', tags.split(':').map(tagToCategoryDisplayName).join(',') + ':<br/>' + bonusSourceHelpText(tagBonusSource, actor)));
    });
    if (bonusSource.variableObjectType === 'effect') {
        return tag('div', 'effectText', sections.join('<br/>'));
    }
    return sections.join('<br/>');
}
function abilityHelpText(ability, actor) {
    var sections = [ability.name, ''];
    if (ability.bonuses) sections.push(bonusSourceHelpText(ability, actor));
    var action = ifdefor(ability.action, ability.reaction);
    if (action) {
        var actionInstance = initializeVariableObject({}, action, actor);
        applyParentToVariableChild(actor, actionInstance);
        // TODO: display action restrictions, if any.
        sections.push(tag('div', 'abilityText', bonusSourceHelpText(action, actor, actionInstance)));
    }
    return sections.join('<br/>');
}
var implicitBonusMap = {
    // Gear implicits
    '+minPhysicalDamage': function (bonusSource, actor) {
        return 'Damage: ' + bonusSource.bonuses['+minPhysicalDamage'].format(1) + ' to ' + bonusSource.bonuses['+maxPhysicalDamage'].format(1);
    },
    '+minMagicDamage': function (bonusSource, actor) {
        return 'Magic: ' + bonusSource.bonuses['+minMagicDamage'].format(1) + ' to ' + bonusSource.bonuses['+maxMagicDamage'].format(1);
    },
    '+range': 'Range: $1',
    '+attackSpeed': 'Attack Speed: $1',
    '+critChance': '%1 critical strike chance',
    '+armor': 'Armor: $1',
    '+evasion': 'Evasion: $1',
    '+block': 'Block: $1',
    '+magicBlock': 'Magic Block: $1',
    // Ability implicits
    '$monsterKey': 'Summons a $',
    '+area': 'Area: $1',
    '+chance': '%1 chance',
    '+consumeRatio': 'Absorb %1 of the target\'s max health',
    '+cooldown': 'Cooldown: $1 seconds',
    '+duration': 'Lasts $1 seconds'
};
// Use this mapping for stats that are not implicity on an item or ability.
var bonusMap = {
    // Offensive stats
    '*damage': '$1x damage',
    '%damage': '%1 increased damage',
    '+minPhysicalDamage': function (bonusSource, actor) {
        return bonusSource.bonuses['+minPhysicalDamage'].format(1) + ' to ' + bonusSource.bonuses['+maxPhysicalDamage'].format(1) + ' increased physical damage';
    },
    '+minMagicDamage': function (bonusSource, actor) {
        return bonusSource.bonuses['+minMagicDamage'].format(1) + ' to ' + bonusSource.bonuses['+maxMagicDamage'].format(1) + ' increased magic damage';
    },
    '*physicalDamage': '$1x physical damage',
    '%physicalDamage': '%1 increased physical damage',
    '*magicDamage': '$1x magic damage',
    '%magicDamageamage': '%1 increased magic damage',
    '*attackSpeed': '$1x attack speed',
    '%attackSpeed': '%1 increased attack speed',
    '+critChance': '+%1 chance to critical strike',
    '*critChance': '$1x critical chance',
    '%critChance': '%1 increased critical chance',
    '+critDamage': '+%1 critical damage',
    '*critDamage': '$1x critical damage',
    '+critAccuracy': '+%1 critical accuracy',
    '*critAccuracy': '$1x critical accuracy',
    '+range': '+$1 range',
    '+accuracy': '+$1 accuracy',
    '*accuracy': '$1x accuracy',
    '%accuracy': '%1 increased accuracy',
    // Defensive stats
    '+armor': '+$1 armor',
    '-armor': '$1 decreased armor',
    '%armor': '%1 increased armor',
    '+evasion': '+$1 evasion',
    '%evasion': '%1 increased evasion',
    '+block': '+$1 block',
    '-block': '$1 decreased block',
    '%block': '%1 increased block',
    '+magicBlock': '+$1 magic block',
    '%magicBlock': '%1 increased magic block',
    '+magicResist': 'Reduces magic damage received by %1',
    '+maxHealth': '+$1 health',
    '*maxHealth': '$1x health',
    '%maxHealth': '%1 increased health',
    // Miscellaneous Stats
    '+dexterity': '+$1 Dexterity',
    '+strength': '+$1 Strength',
    '+intelligence': '+$1 Intelligence',
    '+healthGainOnHit': 'Gain $2 health on hit',
    '*healthGainOnHit': '$1x health gained on hit',
    '+healthRegen': 'Regenerate $1 health per second',
    '*healthRegen': '$1x health regenerated per second',
    '+damageOnMiss': 'Deals $1 true damage to enemy on miss',
    '+slowOnHit': 'Slow targets by %0 on hit',
    '+speed': '+$1 speed',
    '+increasedDrops': 'Gain %1 more coins and anima',
    // Ability specific bonuses
    '+area': '+$1 area offect',
    '*area': '$1x increased area of effect',
    '*power': '$1x more effective',
    '+cooldown': 'Cooldown increased by $1 seconds',
    '-cooldown': 'Cooldown decreased by $1 seconds',
    '*cooldown': '$1x cooldown time',
    '+limit': '+$0 maximum minions',
    '+armorPenetration': '+%1 armor penetration',
    '+dragDamage': '%1 of initial damage is dealth per distance dragged',
    '+dragStun': 'Target is stunned for $1 seconds per distance dragged',
    '+rangeDamage': '%1 increased damage per distance the attack travels',
    '*distance': '$1x distance',
    '+chance': '+%1 chance',
    '+cleave': '%1 splash damage to all enemies in range',
    '+cleaveRange': '+$1 range for splash damage',
    '+knockbackChance': '%1 chance to knock back enemies on hit',
    '+knockbackDistance': '+$1 knock back distance',
    '+cull': 'Instantly kill enemies with less than %1 health',
    '+overHeal': '%1 of health gained beyond your max health is gained as additional max health',
    '+lifeSteal': '%1 of damage dealt is gained as life',
    '+duration': '+$1s duration',
    '*duration': '$1x duration',
    '+count': '+$1 enchantment(s) stolen'
};