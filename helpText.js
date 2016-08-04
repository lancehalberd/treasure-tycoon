function itemHelpText(item) {
    // Unique items have a distinct display name that is used instead of the
    // affix generated name.
    var name;
    if (ifdefor(item.displayName)) {
        name = item.displayName;
    } else {
        name = item.base.name;
        var prefixNames = [];
        item.prefixes.forEach(function (affix) {
            prefixNames.unshift(affix.base.name);
        });
        if (prefixNames.length) {
            name = prefixNames.join(', ') + ' ' + name;
        }
        var suffixNames = [];
        item.suffixes.forEach(function (affix) {
            suffixNames.push(affix.base.name);
        });
        if (suffixNames.length) {
            name = name + ' of ' + suffixNames.join(' and ');
        }
    }
    var sections = [name];
    if (item.base.tags) {
        sections.push(item.base.tags.map(tagToDisplayName).join(', '));
    }
    sections.push('Requires level ' + item.level);
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
        // Transform things like {'+bow:minDamage': 1} => 'bow': {'+minDamage': 1}
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
    if (ifdefor(bonuses['+minDamage'])) {
        if (implicit) sections.push('Damage: ' + bonuses['+minDamage'].format(1) + ' to ' + bonuses['+maxDamage'].format(1));
        else sections.push(bonuses['+minDamage'] + ' to ' + bonuses['+maxDamage'] + ' increased damage');
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
        sections.push(bonuses['%damage'].percent(1) + ' increased physical damage');
    }
    if (ifdefor(bonuses['*damage'], 1) !== 1) {
        sections.push(bonuses['*damage'].format(1) + 'x physical damage');
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
    if (ifdefor(bonuses['+increasedExperience'])) {
        sections.push('Gain ' + bonuses['+increasedExperience'].percent(1) + ' more experience');
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
    if (ifdefor(bonuses['+attackPower'])) {
        sections.push(bonuses['+attackPower'].format(2) + 'x increased attack power');
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
        return tag('div', 'buffText', sections.join('<br/>'));
    }
    return sections.join('<br/>');
}

function abilityHelpText(ability, character) {
    function evaluateActionStat(key) {
        return evaluateForDisplay(action.stats[key], character.adventurer, action);
    }
    var action = ifdefor(ability.action, ability.reaction);
    var sections = [ability.name, ''];
    if (ifdefor(ability.helpText)) {
        sections.push(ability.helpText.replace(/\{(\w+)\}/, function (match, key) {
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
            actionSections.push(action.helpText.replace(/\{(\w+)\}/, function (match, key) {
                return evaluateActionStat(key);
            }));
        }
        for (var i = 0; i < ifdefor(action.restrictions, []).length; i++) {
            actionSections.push(properCase(action.restrictions[i]) + ' only');
        }
        if (ifdefor(action.stats.attackPower)) {
            actionSections.push(evaluateForDisplay(action.stats.attackPower, character.adventurer, action).format(2) + 'x power');
        }
        $.each(action.stats, function (key, value) {
            if (key.charAt(0) === '$') {
                actionSections.push(value);
            }
        });
        if (ifdefor(action.monsterKey)) {
            actionSections.push('Summons a ' + monsters[action.monsterKey].name);
        }
        if (ifdefor(action.stats.healthBonus, 1) !== 1) {
            actionSections.push(evaluateActionStat('healthBonus').format(1) + 'x health');
        }
        if (ifdefor(action.stats.damageBonus, 1) !== 1) {
            actionSections.push(evaluateActionStat('damageBonus').format(1) + 'x damage');
        }
        if (ifdefor(action.stats.attackSpeedBonus, 1) !== 1) {
            actionSections.push(evaluateActionStat('attackSpeedBonus').format(1) + 'x attack speed');
        }
        if (ifdefor(action.stats.speedBonus, 1) !== 1) {
            actionSections.push(evaluateActionStat('speedBonus').format(1) + 'x movement speed');
        }
        if (ifdefor(action.stats.range)) {
            actionSections.push('Range ' + evaluateActionStat('range').format(1));
        }
        if (ifdefor(action.stats.area)) {
            actionSections.push('Area ' + evaluateActionStat('area').format(1));
        }
        if (ifdefor(action.stats.cleave)) {
            actionSections.push(evaluateActionStat('cleave').percent() + ' splash damage to all enemies in range');
        }
        if (ifdefor(action.stats.cleaveRange)) {
            actionSections.push(evaluateActionStat('cleaveRange').format(1) + ' increased range for splash damage');
        }
        if (ifdefor(action.stats.chance)) {
            actionSections.push(evaluateActionStat('chance').percent() + ' chance');
        }
        if (ifdefor(action.stats.consumeRatio)) {
            actionSections.push('Absorb '  + evaluateActionStat('consumeRatio').percent() + ' of the target\'s max health');
        }
        if (ifdefor(action.stats.duration)) {
            actionSections.push('lasts ' + evaluateActionStat('duration').format(1) + ' seconds');
        }
        if (ifdefor(action.stats.cooldown)) {
            actionSections.push('Cooldown: ' + evaluateActionStat('cooldown').format(1) + ' seconds');
        }
        sections.push(tag('div', 'abilityText', actionSections.join('<br/>')));
    }
    return sections.join('<br/>');
}