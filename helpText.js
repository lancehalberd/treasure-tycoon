function getNameWithAffixes(name, prefixes, suffixes) {
    var prefixNames = prefixes.map(function (affix) { return affix.base.name;});
    if (prefixNames.length) name = prefixNames.join(', ') + ' ' + name;
    var suffixNames = suffixes.map(function (affix) { return affix.base.name;});
    if (suffixNames.length) name = name + ' of ' + suffixNames.join(' and ');
    return name;
}

function itemHelpText(item) {
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
    sections.push(bonusHelpText(item.base.bonuses, true, null));

    if (item.prefixes.length || item.suffixes.length) {
        sections.push('');
        item.prefixes.forEach(function (affix) {
            sections.push(bonusHelpText(affix.bonuses, false, null));
        });
        item.suffixes.forEach(function (affix) {
            sections.push(bonusHelpText(affix.bonuses, false, null));
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

function bonusHelpText(rawBonuses, implicit, actor, localObject) {
    localObject = ifdefor(localObject, actor);
    if (!actor && actor !== null) {
        throw new Error('Forgot to pass actor to bonusHelpText.');
    }
    var bonuses = {};
    var tagBonuses = {};
    $.each(rawBonuses, function (key, value) {
        // Transform things like {'+bow:minPhysicalDamage': 1} => 'bow': {'+minPhysicalDamage': 1}
        // so that we can display per tag bonuses.
        if (key.indexOf(':') >= 0) {
            var parts = key.split(':');
            // skill is a required key word for anything that targets a tagged ability
            // but shouldn't be considered a seperate tag.
            if (parts[1] === 'skill' && parts.length > 2) {
                parts.splice(1, 1);
                parts[0] += ' skills';
            }
            var tag = parts[0].substring(1);
            tagBonuses[tag] = ifdefor(tagBonuses[tag], {});
            tagBonuses[tag][parts[0].charAt(0) + parts[1]] = value;
        }
        bonuses[key] = evaluateForDisplay(value, actor, localObject);
    });
    var sections = [];
    if (ifdefor(bonuses['+minPhysicalDamage'])) {
        if (implicit) sections.push('Damage: ' + bonuses['+minPhysicalDamage'].format(1) + ' to ' + bonuses['+maxPhysicalDamage'].format(1));
        else sections.push(bonuses['+minPhysicalDamage'] + ' to ' + bonuses['+maxPhysicalDamage'] + ' increased damage');
    }
    if (ifdefor(bonuses['+minMagicDamage'])) {
        if (implicit) sections.push('Magic: ' + bonuses['+minMagicDamage'].format(1) + ' to ' + bonuses['+maxMagicDamage'].format(1));
        else sections.push(bonuses['+minMagicDamage'] + ' to ' + bonuses['+maxMagicDamage'] + ' increased magic damage');
    }
    if (ifdefor(bonuses['+range'])) {
        if (implicit) sections.push('Range: ' + bonuses['+range'].format(1));
        else sections.push(bonuses['+range'] + ' increased range');
    }
    if (ifdefor(bonuses['+attackSpeed'])) {
        sections.push('Attack Speed: ' + bonuses['+attackSpeed'].format(1));
    }
    if (ifdefor(bonuses['+armor'])) {
        if (implicit) sections.push('Armor: ' + bonuses['+armor'].format(1));
        else sections.push(bonuses['+armor'].format(1) + ' increased armor');
    }
    if (ifdefor(bonuses['-armor'])) {
        sections.push(bonuses['-armor'].format(1) + ' decreased armor');
    }
    if (ifdefor(bonuses['+evasion'])) {
        if (implicit) sections.push('Evasion: ' + bonuses['+evasion'].format(1));
        else sections.push(bonuses['+evasion'].format(1) + ' increased evasion');
    }
    if (ifdefor(bonuses['+block'])) {
        if (implicit) sections.push('Block: ' + bonuses['+block'].format(1));
        else sections.push(bonuses['+block'].format(1) + ' increased block');
    }
    if (ifdefor(bonuses['-block'])) {
        sections.push(bonuses['-block'].format(1) + ' decreased block');
    }
    if (ifdefor(bonuses['+magicBlock'])) {
        if (implicit) sections.push('Magic Block: ' + bonuses['+magicBlock'].format(1));
        else sections.push(bonuses['+magicBlock'].format(1) + ' increased magic block');
    }
    if (ifdefor(bonuses['%armor'])) {
        sections.push(bonuses['%armor'].percent(1) + ' increased armor');
    }
    if (ifdefor(bonuses['%evasion'])) {
        sections.push(bonuses['%evasion'].percent(1) + ' increased evasion');
    }
    if (ifdefor(bonuses['%block'])) {
        sections.push(bonuses['%block'].percent(1) + ' increased block');
    }
    if (ifdefor(bonuses['%magicBlock'])) {
        sections.push(bonuses['%magicBlock'].percent(1) + ' increased magic block');
    }
    if (ifdefor(bonuses['+damageOnMiss'])) {
        sections.push('Deals ' + bonuses['+damageOnMiss'] + ' true damage to enemy on miss');
    }
    if (ifdefor(bonuses['%damage'])) {
        sections.push(bonuses['%damage'].percent(1) + ' increased damage');
    }
    if (ifdefor(bonuses['*damage'], 1) !== 1) {
        sections.push(bonuses['*damage'].format(1) + 'x damage');
    }
    if (ifdefor(bonuses['%physicalDamage'])) {
        sections.push(bonuses['%physicalDamage'].percent(1) + ' increased physical damage');
    }
    if (ifdefor(bonuses['*physicalDamage'], 1) !== 1) {
        sections.push(bonuses['*physicalDamage'].format(1) + 'x physical damage');
    }
    if (ifdefor(bonuses['%magicDamage'])) {
        sections.push(bonuses['%magicDamage'].percent(1) + ' increased magic damage');
    }
    if (ifdefor(bonuses['*magicDamage'], 1) !== 1) {
        sections.push(bonuses['*magicDamage'].format(1) + 'x magic damage');
    }
    if (ifdefor(bonuses['+dexterity'])) {
        sections.push('+' + bonuses['+dexterity'].format(1) + ' Dexterity');
    }
    if (ifdefor(bonuses['+strength'])) {
        sections.push('+' + bonuses['+strength'].format(1) + ' Strength');
    }
    if (ifdefor(bonuses['+intelligence'])) {
        sections.push('+' + bonuses['+intelligence'].format(1) + ' Intelligence');
    }
    if (ifdefor(bonuses['+maxHealth'])) {
        sections.push('+' + bonuses['+maxHealth'].format(1) + ' health');
    }
    if (ifdefor(bonuses['*maxHealth'])) {
        sections.push(bonuses['*maxHealth'].format(1) + 'x health');
    }
    if (ifdefor(bonuses['+healthGainOnHit'])) {
        sections.push('Gain ' + bonuses['+healthGainOnHit'].format(1) + ' health on hit');
    }
    if (ifdefor(bonuses['*healthGainOnHit'], 1) !== 1) {
        sections.push('Gain ' + bonuses['*healthGainOnHit'].format(1) + 'x health gained on hit');
    }
    if (ifdefor(bonuses['+healthRegen'])) {
        sections.push('Regenerate ' + bonuses['+healthRegen'].format(1) + ' health per second');
    }
    if (ifdefor(bonuses['*healthRegen'], 1) !== 1) {
        sections.push('Regenerate ' + bonuses['*healthRegen'].format(1) + 'x health regenerated per second');
    }
    if (ifdefor(bonuses['%maxHealth'])) {
        sections.push(bonuses['%maxHealth'].percent(1) + ' increased health');
    }
    if (ifdefor(bonuses['%attackSpeed'])) {
        sections.push(bonuses['%attackSpeed'].percent(1) + ' increased attack speed');
    }
    if (ifdefor(bonuses['*attackSpeed'], 1) !== 1) {
        sections.push(bonuses['*attackSpeed'].format(1) + 'x attack speed');
    }
    if (ifdefor(bonuses['+critChance'])) {
        if (implicit) sections.push(bonuses['+critChance'].percent(0) + ' critical strike chance');
        else sections.push('Additional ' + bonuses['+critChance'].percent(0) + ' chance to critical strike');
    }
    if (ifdefor(bonuses['%critChance'])) {
        sections.push(bonuses['%critChance'].percent(1) + ' increased critical chance');
    }
    if (ifdefor(bonuses['*critChance'], 1) !== 1) {
        sections.push(bonuses['*critChance'].format(1) + 'x critical chance');
    }
    if (ifdefor(bonuses['+critDamage'])) {
        sections.push(bonuses['+critDamage'].percent(1) + ' increased critical damage');
    }
    if (ifdefor(bonuses['*critDamage'], 1) !== 1) {
        sections.push(bonuses['*critDamage'].format(1) + 'x critical damage');
    }
    if (ifdefor(bonuses['+critAccuracy'])) {
        sections.push(bonuses['+critAccuracy'].percent(1) + ' increased critical accuracy');
    }
    if (ifdefor(bonuses['*critAccuracy'], 1) !== 1) {
        sections.push(bonuses['*critAccuracy'].format(1) + 'x critical accuracy');
    }
    if (ifdefor(bonuses['+magicResist'])) {
        sections.push('Reduces magic damage received by ' + bonuses['+magicResist'].percent(0));
    }
    if (ifdefor(bonuses['+slowOnHit'])) {
        sections.push('Slow target by ' + bonuses['+slowOnHit'].percent(0));
    }
    if (ifdefor(bonuses['+accuracy'])) {
        sections.push((bonuses['+accuracy'] > 0 ? '+' : '') + bonuses['+accuracy'].format(1) + ' accuracy');
    }
    if (ifdefor(bonuses['%accuracy'])) {
        sections.push(bonuses['%accuracy'].percent(1) + ' increased accuracy');
    }
    if (ifdefor(bonuses['*accuracy'], 1) !== 1) {
        sections.push(bonuses['*accuracy'].format(1) + 'x accuracy');
    }
    if (ifdefor(bonuses['+speed'])) {
        sections.push((bonuses['+speed'] > 0 ? '+' : '') + bonuses['+speed'].format(1) + ' speed');
    }
    if (ifdefor(bonuses['+increasedDrops'])) {
        sections.push('Gain ' + bonuses['+increasedDrops'].percent(1) + ' more coins and anima');
    }
    if (ifdefor(bonuses['*area'], 1) !== 1) {
        sections.push(bonuses['*area'].format(1) + 'x increased area of effect');
    }
    if (ifdefor(bonuses['*power'], 1) !== 1) {
        sections.push(bonuses['*power'].format(1) + 'x more effective');
    }
    if (ifdefor(bonuses['*healthBonus'], 1) !== 1) {
        sections.push(bonuses['*healthBonus'].format(1) + 'x health');
    }
    if (ifdefor(bonuses['*damageBonus'], 1) !== 1) {
        sections.push(bonuses['*damageBonus'].format(1) + 'x damage');
    }
    if (ifdefor(bonuses['*attackSpeedBonus'], 1) !== 1) {
        sections.push(bonuses['*attackSpeedBonus'].format(1) + 'x attack speed');
    }
    if (ifdefor(bonuses['*speedBonus'], 1) !== 1) {
        sections.push(bonuses['*speedBonus'].format(1) + 'x movement speed');
    }
    if (ifdefor(bonuses['*cooldown'], 1) !== 1) {
        sections.push(bonuses['*cooldown'].format(1) + 'x cooldown time');
    }
    if (ifdefor(bonuses['+limit'])) {
        sections.push('+' + bonuses['+limit'].format() + ' maximum minions');
    }
    if (ifdefor(bonuses['+armorPenetration'])) {
        sections.push('+' + bonuses['+armorPenetration'].percent() + ' armor penetration');
    }

    // Some unique abilities just map 'key' => 'help text' directly.
    $.each(rawBonuses, function (key, value) {
        if (key.indexOf(':') < 0 && typeof(value) === 'string') {
            sections.push(value);
        }
    });

    $.each(tagBonuses, function (tagName, bonuses) {
        if (tagName === 'skill') {
            // The tagName 'skill' applies to all attacks, so don't breka it out into a special section.
            sections.push(bonusHelpText(bonuses, false, actor));
        } else {
            sections.push(tag('div', 'tagText', tagToCategoryDisplayName(tagName) + ':<br/>' + bonusHelpText(bonuses, false, actor)));
        }
    });

    // Special effects
    if (ifdefor(bonuses['$buff'])) {
        sections.push('Gain:');
        sections.push(bonusHelpText(bonuses['$buff'], false, actor));
    }
    if (ifdefor(bonuses['+dragDamage'])) {
        sections.push(bonuses['+dragDamage'].percent(1) + ' of initial damage is dealt per distance dragged');
    }
    if (ifdefor(bonuses['+dragStun'])) {
        sections.push('Target is stunned for ' + bonuses['+dragStun'].format(1) + ' seconds per distance dragged');
    }
    if (ifdefor(bonuses['+rangeDamage'])) {
        sections.push(bonuses['+rangeDamage'].percent(1) + ' increased damage the further the attack travels');
    }
    if (ifdefor(bonuses['+area'])) {
        sections.push(bonuses['+area'].format(1) + ' increased area of effect');
    }
    if (ifdefor(bonuses['+cooldown'])) {
        if (bonuses['+cooldown'] > 0) {
            sections.push('Cooldown increased by ' + bonuses['+cooldown'] + ' seconds');
        }
        if (bonuses['+cooldown'] < 0) {
            sections.push('Cooldown reduced by ' + -bonuses['+cooldown'] + ' seconds');
        }
    }
    if (ifdefor(bonuses['*distance'])) {
        sections.push((bonuses['*distance']).format(1) + 'x distance');
    }
    if (ifdefor(bonuses['+chance'])) {
        sections.push(bonuses['+chance'].percent() + ' increased chance');
    }
    if (ifdefor(bonuses['+cleave'])) {
        sections.push(bonuses['+cleave'].percent() + ' splash damage to all enemies in range');
    }
    if (ifdefor(bonuses['+cleaveRange'])) {
        sections.push(bonuses['+cleaveRange'].format(1) + ' increased range for splash damage');
    }
    if (ifdefor(bonuses['+knockbackChance'])) {
        sections.push(bonuses['+knockbackChance'].percent() + ' to knock back enemies on hit');
    }
    if (ifdefor(bonuses['+knockbackDistance'])) {
        sections.push(bonuses['+knockbackDistance'].format(1) + ' increased knockback distance');
    }
    if (ifdefor(bonuses['+cull'])) {
        sections.push('Instantly kill enemies with less than ' + bonuses['+cull'].percent() + ' health');
    }
    if (ifdefor(bonuses['+overHeal'])) {
        sections.push(bonuses['+overHeal'].percent() + ' of health gained beyond your max health is gained as additional max health');
    }
    if (ifdefor(bonuses['+lifeSteal'])) {
        sections.push(bonuses['+lifeSteal'].percent() + ' of damage dealt is gained as life');
    }

    if (ifdefor(bonuses['*duration'])) {
        sections.push(bonuses['*duration'].format(1) + 'x increased duration');
    }
    if (ifdefor(bonuses['+count'])) {
        sections.push('+' + bonuses['+count'].format() + ' enchantment(s) stolen');
    }
    if (ifdefor(bonuses['+duration'])) {
        sections.push(bonuses['+duration'].format(1) + 's increased duration');
    }
    if (ifdefor(bonuses['duration'])) { // Buffs/debuffs only.
        sections.push('For ' + bonuses.duration.format(1) + ' seconds');
    }
    if (ifdefor(bonuses['duration']) !== null) { // Buffs/debuffs only.
        return tag('div', 'effectText', sections.join('<br/>'));
    }
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
    console.log(isImplicit);
    console.log(bonusSource);
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
        sections.push(tag('div', 'abilityText', bonusSourceHelpText(action, actor, actionInstance)));
    }
    return sections.join('<br/>');
}
/*
function abilityHelpText(ability, character) {
    var action = ifdefor(ability.action, ability.reaction);
    function evaluateActionStat(key) {
        return evaluateForDisplay(action.bonuses[key], character.adventurer, action);
    }
    var sections = [ability.name, ''];
    if (ifdefor(ability.helpText)) {
        sections.push(ability.helpText.replace(/\{(.+)\}/, function (match, key) {
            return evaluateForDisplay(ability.bonuses[key], character.adventurer, ability);
        }));
        sections.push('');
    }
    var helpText = bonusHelpText(ifdefor(ability.bonuses, {}, ability), false, character.adventurer);
    if (helpText) {
        sections.push(helpText);
        sections.push('');
    }
    if (action) {
        var actionSections = [];
        if (ifdefor(action.helpText)) {
            actionSections.push(action.helpText.replace(/\{(.+)\}/, function (match, key) {
                return evaluateActionStat(key);
            }));
        }
        for (var i = 0; i < ifdefor(action.restrictions, []).length; i++) {
            actionSections.push(properCase(action.restrictions[i]) + ' only');
        }
        $.each(action.bonuses, function (key, value) {
            if (key.charAt(0) === '$') {
                actionSections.push(value);
            }
        });
        if (ifdefor(action.monsterKey)) {
            actionSections.push('Summons a ' + monsters[action.monsterKey].name);
        }
        if (ifdefor(action.bonuses.healthBonus, 1) !== 1) {
            actionSections.push(evaluateActionStat('healthBonus').format(1) + 'x health');
        }
        if (ifdefor(action.bonuses.damageBonus, 1) !== 1) {
            actionSections.push(evaluateActionStat('damageBonus').format(1) + 'x damage');
        }
        if (ifdefor(action.bonuses.attackSpeedBonus, 1) !== 1) {
            actionSections.push(evaluateActionStat('attackSpeedBonus').format(1) + 'x attack speed');
        }
        if (ifdefor(action.bonuses.speedBonus, 1) !== 1) {
            actionSections.push(evaluateActionStat('speedBonus').format(1) + 'x movement speed');
        }
        if (ifdefor(action.bonuses.range)) {
            actionSections.push('Range ' + evaluateActionStat('range').format(1));
        }
        if (ifdefor(action.bonuses.area)) {
            actionSections.push('Area ' + evaluateActionStat('area').format(1));
        }
        if (ifdefor(action.bonuses.cleave)) {
            actionSections.push(evaluateActionStat('cleave').percent() + ' splash damage to all enemies in range');
        }
        if (ifdefor(action.bonuses.cleaveRange)) {
            actionSections.push(evaluateActionStat('cleaveRange').format(1) + ' increased range for splash damage');
        }
        if (ifdefor(action.bonuses.chance)) {
            actionSections.push(evaluateActionStat('chance').percent() + ' chance');
        }
        if (ifdefor(action.bonuses.consumeRatio)) {
            actionSections.push('Absorb '  + evaluateActionStat('consumeRatio').percent() + ' of the target\'s max health');
        }
        if (ifdefor(action.bonuses.duration)) {
            actionSections.push('lasts ' + evaluateActionStat('duration').format(1) + ' seconds');
        }
        if (ifdefor(action.bonuses.cooldown)) {
            actionSections.push('Cooldown: ' + evaluateActionStat('cooldown').format(1) + ' seconds');
        }
        sections.push(tag('div', 'abilityText', actionSections.join('<br/>')));
    }
    return sections.join('<br/>');
}*/
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
    '+critChance': '$1 critical strike chance',
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
    '*attackSpeed': '%1x attack speed',
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
    '+healthGainOnHit': 'Gain $1 health on hit',
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
    '+count': '+$1 enchantment(s) stolen',
    '$buff': function (bonusSource, actor) {
        return 'Gain: foo';// + bonusSourceHelpText(bonusSource.bonuses['$buff'], actor);
    }
};