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
    var actor = state.selectedCharacter.adventurer;
    // Unique items have a distinct display name that is used instead of the affix generated name.
    if (ifdefor(item.displayName)) sections.push(item.displayName);
    else sections.push(getNameWithAffixes(item.base.name, item.prefixes, item.suffixes));
    if (item.base.tags) {
        var tagParts = [];
        for (var tag in item.base.tags) {
            if (tag === 'offhand' && isTwoHandedWeapon(actor.equipment.weapon) && !ifdefor(actor.twoToOneHanded)) {
                tagParts.push('<span style="color: #c00;">' + tagToDisplayName(tag) + '</span>');
            } else {
                tagParts.push(tagToDisplayName(tag));
            }
        }
        sections.push(tagParts.join(', '));
    }

    if (item.level > state.selectedCharacter.adventurer.level) {
        sections.push('<span style="color: #c00;">Requires level ' + item.level + '</span>');
    } else {
        sections.push('Requires level ' + item.level);
    }
    sections.push('Crafting level ' + item.itemLevel);
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
                     (bonusSource.variableObjectType === 'action'));
    //console.log(isImplicit);
    //console.log(bonusSource);
    // Some stats are displayed in the helptext. In this case, we don't display
    // them a second time as implicit/regular bonuses.
    var displayedStats = {};
    // Hack to prevent effect area/duration from being displayed as non-implicit.
    // Basically we want +armor/+damage to show as non-implicit on effects, but
    // duration should be implicit, so we have to split it into both implicit
    // and non-implicit somehow.
    if (bonusSource.variableObjectType === 'effect') {
        displayedStats['+area'] = true;
        displayedStats['+duration'] = true;
    }
    var sections = [];
    for (var restriction of ifdefor(bonusSource.restrictions, [])) {
        var style = '';
        if (!state.selectedCharacter.adventurer.tags[restriction]) {
            style = ' style="color: #c00;"';
        }
        sections.push('<u' + style + '>' + restrictionToCategoryDisplayName(restriction) + ' Only</u>');
    }
    if (bonusSource.helpText) {
        sections.push(bonusSource.helpText.replace(/\{([^\}]+)\}/g, function (match, key) {
            displayedStats[key] = true;
            if (typeof bonusSource.bonuses[key] === 'undefined') {
                console.log(bonusSource);
                throw new Error('helpText contained ' + key + ' but was not found among bonuses');
            }
            return evaluateForDisplay(bonusSource.bonuses[key], actor, localObject);
        }));
        //sections.push(bonusSource.helpText);
    }
    for (var bonus in bonusMap) {
        if (displayedStats[bonus]) continue;
        // If this is an implicit bonus, don't display it as a regular bonus.
        if (isImplicit && implicitBonusMap[bonus]) continue;
        var bonusText = renderBonusText(bonusMap, bonus, bonusSource, actor, localObject);
        if (bonusText) sections.push(bonusText);
    }
    if (isImplicit) {
        for (var bonus in implicitBonusMap) {
            // implicit bonuses marked true are displayed as part of another implicit bonus.
            if (displayedStats[bonus] || implicitBonusMap[bonus] === true) continue;
            var implicitBonusText = renderBonusText(implicitBonusMap, bonus, bonusSource, actor, localObject);
            if (implicitBonusText) sections.push(implicitBonusText);
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
        } else if (!displayedStats[key] && typeof value === 'string') {
            sections.push(value);
        }
    });
    $.each(tagBonusSources, function (tags, tagBonusSource) {
        var tagBonusHelpText = bonusSourceHelpText(tagBonusSource, actor);
        if (tagBonusHelpText) {
            sections.push(tag('div', 'tagText', tags.split(':').map(tagToCategoryDisplayName).join(', ') + ':<br/>' + tagBonusHelpText));
        }
    });
    if (bonusSource.variableObjectType === 'effect') {
        if (bonusSource.bonuses['+area']) sections.push(renderBonusText(implicitBonusMap, '+area', bonusSource, actor, localObject));
        if (bonusSource.bonuses['+duration']) sections.push(renderBonusText(implicitBonusMap, '+duration', bonusSource, actor, localObject));

        return tag('div', 'effectText', sections.join('<br/>'));
    }
    return sections.join('<br/>');
}
function renderBonusText(bonusMap, bonusKey, bonusSource, actor, localObject) {
    var rawValue = ifdefor(bonusSource.bonuses[bonusKey], bonusSource.bonuses['+' + bonusKey]);
    // Don't show help text like +0 accuracy or 0% increased accuracy, but do show 0x accuracy.
    if (rawValue === 0 && bonusKey.charAt(0) !== '*') return null;
    if (rawValue === null) return null;
    var textOrFunction = bonusMap[bonusKey];
    if (typeof textOrFunction === 'function') return textOrFunction(bonusSource, actor);
    var text = textOrFunction;
    var matches = text.match(/(\$|\%)\d/);
    if (matches) {
        var wildcard = matches[0];
        var renderedValue = evaluateForDisplay(rawValue, actor, localObject);
        var digits = Number(wildcard[1]);
        if (wildcard[0] === '%') renderedValue = renderedValue.percent(digits);
        else renderedValue = renderedValue.format(digits);
    }
    return text.split(wildcard).join(renderedValue);
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
    if (ability.minionBonuses) {
        sections.push(tag('div', 'tagText', 'Minions:<br/>' + bonusSourceHelpText({'bonuses': ability.minionBonuses}, actor)));
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
    '+minWeaponPhysicalDamage': function (bonusSource, actor) {
        return 'Damage: ' + bonusSource.bonuses['+minWeaponPhysicalDamage'].format(1) + ' to ' + bonusSource.bonuses['+maxWeaponPhysicalDamage'].format(1);
    },
    '+minWeaponMagicDamage': function (bonusSource, actor) {
        return 'Magic: ' + bonusSource.bonuses['+minWeaponMagicDamage'].format(1) + ' to ' + bonusSource.bonuses['+maxWeaponMagicDamage'].format(1);
    },
    '+weaponRange': 'Range: $1',
    '+range': 'Range: $1',
    '+attackSpeed': 'Attack Speed: $1',
    '+critChance': '%1 critical strike chance',
    '+armor': 'Armor: $1',
    '+evasion': 'Evasion: $1',
    '+block': 'Block: $1',
    '+magicBlock': 'Magic Block: $1',
    '+speed': 'Movement Speed: $1',
    '-speed': 'Movement Speed: -$1',
    // Ability implicits
    '$monsterKey': 'Summons a $',
    '+area': 'Area: $1',
    '+chance': '%1 chance',
    '+consumeRatio': 'Absorb %1 of the target\'s max health',
    '+teleport': 'Distance: $1',
    '+limit': 'Limit: $1',
    '+cooldown': 'Cooldown: $1 seconds',
    '+duration': 'Lasts $1 seconds'
};
// Use this mapping for stats that are not implicity on an item or ability.
var bonusMap = {
    '$setRange': function (bonusSource, actor) {
        if (bonusSource.bonuses['$setRange'] === 'melee') return 'Attacks become melee';
        if (bonusSource.bonuses['$setRange'] === 'ranged') return 'Attacks become ranged';
        throw new Error('unexpected value ' + bonusSource.bonuses['$setRange']);
    },
    '$weaponRange': 'Weapon range is always $1',
    '*weaponRange': '$1x weapon range',
    // Offensive stats
    '+damage': '+$1 damage',
    '*damage': '$3x damage',
    '%damage': '%1 increased damage',
    '+weaponDamage': '+$1 damage',
    '*weaponDamage': '$3x damage',
    '%weaponDamage': '%1 increased damage',
    '+minPhysicalDamage': function (bonusSource, actor) {
        return bonusSource.bonuses['+minPhysicalDamage'].format(1) + ' to ' + bonusSource.bonuses['+maxPhysicalDamage'].format(1) + ' increased physical damage';
    },
    '+minMagicDamage': function (bonusSource, actor) {
        return bonusSource.bonuses['+minMagicDamage'].format(1) + ' to ' + bonusSource.bonuses['+maxMagicDamage'].format(1) + ' increased magic damage';
    },
    '+minWeaponPhysicalDamage': function (bonusSource, actor) {
        return bonusSource.bonuses['+minWeaponPhysicalDamage'].format(1) + ' to ' + bonusSource.bonuses['+maxWeaponPhysicalDamage'].format(1) + ' increased physical damage';
    },
    '+minWeaponMagicDamage': function (bonusSource, actor) {
        return bonusSource.bonuses['+minWeaponMagicDamage'].format(1) + ' to ' + bonusSource.bonuses['+maxWeaponMagicDamage'].format(1) + ' increased magic damage';
    },
    '+physicalDamage': '+$1 physical damage',
    '*physicalDamage': '$3x physical damage',
    '%physicalDamage': '%1 increased physical damage',
    '+magicDamage': '+$1 magic damage',
    '*magicDamage': '$3x magic damage',
    '%magicDamage': '%1 increased magic damage',
    '+weaponPhysicalDamage': '+$1 physical damage',
    '*weaponPhysicalDamage': '$3x physical damage',
    '%weaponPhysicalDamage': '%1 increased physical damage',
    '+weaponMagicDamage': '+$1 magic damage',
    '*weaponMagicDamage': '$3x magic damage',
    '%weaponMagicDamage': '%1 increased magic damage',
    '+magicPower': '+$1 magic power',
    '*magicPower': '$1x magic power',
    '%magicPower': '%1 increased magic power',
    '+attackSpeed': '+$1 attacks per second',
    '*attackSpeed': '$1x attack speed',
    '%attackSpeed': '%1 increased attack speed',
    '+critChance': '+%1 chance to critical strike',
    '*critChance': '$1x critical chance',
    '%critChance': '%1 increased critical chance',
    '+critDamage': '+%1 critical damage',
    '*critDamage': '$1x critical damage',
    '%critDamage': '%1 increased critical damage',
    '+critAccuracy': '+%1 critical accuracy',
    '*critAccuracy': '$1x critical accuracy',
    '%critAccuracy': '%1 increased critical accuracy',
    '+range': '+$1 range',
    '*range': '$1x range',
    '+accuracy': '+$1 accuracy',
    '*accuracy': '$1x accuracy',
    '%accuracy': '%1 increased accuracy',
    // Defensive stats
    '+armor': '+$1 armor',
    '-armor': '$1 decreased armor',
    '%armor': '%1 increased armor',
    '+evasion': '+$1 evasion',
    '*evasion': '$1x evasion',
    '%evasion': '%1 increased evasion',
    '+block': '+$1 block',
    '-block': '$1 decreased block',
    '%block': '%1 increased block',
    '+magicBlock': '+$1 magic block',
    '*magicBlock': '$1x magic block',
    '%magicBlock': '%1 increased magic block',
    '+magicResist': 'Reduces magic damage received by %1',
    '*magicResist': '$1x magic resist',
    '+maxHealth': '+$1 health',
    '*maxHealth': '$1x health',
    '%maxHealth': '%1 increased health',
    // Miscellaneous Stats
    '+dexterity': '+$1 Dexterity',
    '%dexterity': '%1 increased Dexterity',
    '+strength': '+$1 Strength',
    '%strength': '%1 increased Strength',
    '+intelligence': '+$1 Intelligence',
    '%intelligence': '%1 increased Intelligence',
    '+healthGainOnHit': 'Gain $2 health on hit',
    '*healthGainOnHit': '$1x health gained on hit',
    '+healthRegen': 'Regenerate $1 health per second',
    '*healthRegen': '$1x health regenerated per second',
    '%healthRegen': '%1 increased health regenerated per second',
    '+damageOnMiss': 'Deals $1 true damage to enemy on miss',
    '+slowOnHit': 'Slow targets by %0 on hit',
    '-speed': '$1 reduced movement speed',
    '+speed': '+$1 movement speed',
    '%speed': '%1 increased movement speed',
    '*speed': '$1x movement speed',
    '+increasedDrops': 'Gain %1 more coins and anima',
    // Ability specific bonuses
    '+area': '+$1 area offect',
    '*area': '$1x increased area of effect',
    '%area': '%1 increased area of effect',
    '*power': '$1x more effective',
    '+cooldown': 'Cooldown increased by $1 seconds',
    '-cooldown': 'Cooldown decreased by $1 seconds',
    '%cooldown': '%1 cooldown time',
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
    '+castKnockBack': 'Knock nearby enemies away on spell cast',
    '+healOnCast': 'Recover %1 of your max health on spell cast',
    '+overHeal': '%1 of health gained beyond your max becomes additional max health',
    '+overHealReflection': '%1 of health gained beyond your max becomes a reflective barrier',
    '+lifeSteal': '%1 of damage dealt is gained as life',
    '+duration': '+$1s duration',
    '*duration': '$1x duration',
    '%duration': '%1 increased duration',
    '+count': '+$1 enchantment(s) stolen',
    '+weaponRange': '+$1 increased range',
    '+damageOverTime': 'Taking $1 damage per second',
    '+reducedDivinityCost': '%1 reduced divinity cost at shrines',
    '+maxAnima': '+$1 max anima',
    '+maxCoins': '+$1 max coins'
};
