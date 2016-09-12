
// Parses a hash key+value like {"+melee:damage": 25} into a fully defined bonus object.
function parseBonus(bonusKeyString, bonusValue) {
    if (typeof bonusKeyString !== 'string') {
        console.log('Expected string for bonusKeyString, found:');
        console.log(bonusKeyString);
        throw Exception('bonusKeyString must be a string');
    }
    var operator = bonusKeyString[0];
    var tags = bonusKeyString.substr(1).split(':');
    var stats = tags.pop();
    // There are a few statKeys that effect multiple values on the object.
    if (stats === 'damage') {
        stats = ['minPhysicalDamage', 'maxPhysicalDamage', 'minMagicDamage', 'maxMagicDamage'];
    } else if (stats === 'physicalDamage') {
        stats = ['minPhysicalDamage', 'maxPhysicalDamage'];
    } else if (stats === 'magicDamage') {
        stats = ['minMagicDamage', 'maxMagicDamage'];
    } else {
        stats = [stats];
    }
    var statDependencies = getStatDependencies(bonusValue, {});
    return {'operator': operator, 'tags': tags, 'stats': stats, 'value': bonusValue, 'statDependencies': statDependencies};
}
function getStatDependencies(bonusValue, dependencies) {
    if (ifdefor(bonusValue, null) === null) throw Error('bonusValue was null or undefined');
    if (typeof bonusValue === 'number') return dependencies;
    if (typeof bonusValue === 'string') {
        if (bonusValue[0] !== '{') return dependencies; // this is just a string.
        dependencies[bonusValue.substring(1, bonusValue.length - 1)] = true;
        return dependencies
    }
    if (bonusValue.constructor !== Array) return dependencies;
    switch (bonusValue.length) {
        case 2: // Unary operators like ['-', '{intelligence}']
            return getStatDependencies(bonusValue[1], dependencies);
            break;
        case 3: // Binary operators like [20, '+', '{strength}']
            dependencies = getStatDependencies(bonusValue[0], dependencies);
            return getStatDependencies(bonusValue[2], dependencies);
        default:
            console.log(bonusValue);
            throw new Error('bonusValue formula must have exactly 2 or 3 entries, found ' + bonusValue.length);
    }
    return dependencies;
}
function parseBonuses(bonusSource) {
    if (bonusSource.parsedBonuses) return bonusSource.parsedBonuses; // Use memoized value if available. Otherwise, populate memoized value below.
    bonusSource.parsedBonuses = [];
    for (var bonusKeyString of Object.keys(bonusSource.bonuses)) {
        var bonus = parseBonus(bonusKeyString, bonusSource.bonuses[bonusKeyString]);
        bonusSource.parsedBonuses.push(bonus);
    }
    return bonusSource.parsedBonuses;
}
function initializeVariableObject(object) {
    object.bonusSources = [];
    object.bonusesByTag = {};
    object.bonusesDependingOn = {};
    object.dirtyStats = {};
    object.variableChildren = [];
    for (var baseStat of Object.keys(ifdefor(object.base, {}))) {
        object[baseStat] = object.base[baseStat];
    }
}
function addBonusSourceToObject(object, bonusSource, triggerComputation) {
    // Bonuses apply recursively to all the children of this object (actions of actors, buffs on actions, bonuses on buffs, etc).
    for (var variableChild of object.variableChildren) {
        addBonusSourceToObject(variableChild, bonusSource, triggerComputation);
    }
    // Throw an error if bonusSource has already been applied to object. Each bonusSource on an object should be unique.
    object.bonusSources.push(bonusSource);
    var bonuses = parseBonuses(bonusSource);
    for (var bonus of bonuses) {
        for (var tag of bonus.tags) {
            object.bonusesByTag[tag] = ifdefor(object.bonusesByTag[tag], []);
            object.bonusesByTag[tag].push(bonus);
        }
        for (var dependencyString of Object.keys(bonus.statDependencies)) {
            if (dependencyString.indexOf('this.') === 0) {
                var stat = dependencyString.substring(5);
                object.bonusesDependingOn[stat] = ifdefor(object.bonusesDependingOn[stat], []);
                object.bonusesDependingOn[stat].push({'object': object, 'bonus': bonus});
            } else {
                var stat = dependencyString;
                var dependencySource = ifdefor(object.actor, object);
                dependencySource.bonusesDependingOn[stat] = ifdefor(dependencySource.bonusesDependingOn[stat], []);
                dependencySource.bonusesDependingOn[stat].push({'object': object, 'bonus': bonus});
            }
        }
        addBonusToObject(object, bonus);
    }
    if (ifdefor(triggerComputation)) {
        recomputeDirtyStats(object);
    }
}
function removeBonusSourceFromObject(object, bonusSource, triggerComputation) {
    // Bonuses apply recursively to all the children of this object (actions of actors, buffs on actions, bonuses on buffs, etc).
    for (var variableChild of object.variableChildren) {
        removeBonusSourceFromObject(variableChild, bonusSource, triggerComputation);
    }
    var index = object.bonusSources.indexOf(bonusSource);
    if (index < 0) {
        console.log('tried to remove bonusSource that was not found on object:');
        console.log(bonusSource);
        console.log(object);
        throw Error('Attempted to remove a bonus source from an object that it was not present on.');
    }
    object.bonusSources.splice(index, 1);
    var bonuses = parseBonuses(bonusSource);
    for (var bonus of bonuses) {
        for (var tag of bonus.tags) {
            var index = object.bonusesByTag[tag].indexOf(bonus);
            object.bonusesByTag[tag].splice(index, 1);
        }
        for (var dependencyString of Object.keys(bonus.statDependencies)) {
            if (dependencyString.indexOf('this.') === 0) {
                var stat = dependencyString.substring(5);
                for (var i = 0; i <  object.bonusesDependingOn[stat].length; i++) {
                    var dependency = object.bonusesDependingOn[stat][i];
                    if (dependency.object === object && dependency.bonus === bonus) {
                        object.bonusesDependingOn[stat].splice(i, 1);
                        break;
                    }
                }
            } else {
                var stat = dependencyString;
                var dependencySource = ifdefor(object.actor, object);
                for (var i = 0; i <  dependencySource.bonusesDependingOn[stat].length; i++) {
                    var dependency = dependencySource.bonusesDependingOn[stat][i];
                    if (dependency.object === object && dependency.bonus === bonus) {
                        dependencySource.bonusesDependingOn[stat].splice(i, 1);
                        break;
                    }
                }
            }
        }
        addBonusToObject(object, bonus);
    }
    if (ifdefor(triggerComputation)) {
        recomputeDirtyStats(object);
    }
}
function addBonusToObject(object, bonus) {
    // Ignore stats that don't apply to the object.
    if (object['isActor'] && !allActorVariables[bonus.stats[0]]) return;
    // A stat applies to an action if it is already on the action stats or it is a common action variable.
    if (!object['isActor'] && !(ifdefor(object[bonus.stats[0]]) !== null || commonActionVariables[bonus.stats[0]])) return;
    // Do nothing if bonus tags are not all present on the object.
    for (var tag of bonus.tags) if (!object.tags[tag]) return;
    var value = evaluateValue(ifdefor(object.actor, object), bonus.value, object);
    for (var statKey of bonus.stats) {
        var statOps = object[statKey + 'Ops'] = ifdefor(object[statKey + 'Ops'], {'stat': statKey});
        //console.log([bonus.operator, bonus.tags.join(':'), statKey, JSON.stringify(bonus.value), value]);
        switch (bonus.operator) {
            case '+':
                statOps['+'] = ifdefor(statOps['+'], 0) + value;
                break;
            case '-':
                statOps['+'] = ifdefor(statOps['+'], 0) - value;
                break;
            case '&':
                statOps['&'] = ifdefor(statOps['&'], 0) + value;
                break;
            case '%':
                statOps['%'] = ifdefor(statOps['%'], 1) + value;
                break;
            case '*':
                statOps['*'] = ifdefor(statOps['*'], 1) * value;
                break;
            case '$':
                statOps['$'] = ifdefor(statOps['$'], []);
                statOps['$'].push(value);
                break;
        }
        object.dirtyStats[statKey] = true;
    }
}
function removeBonusFromObject(object, bonus) {
    // Ignore stats that don't apply to the object.
    if (object['isActor'] && !allActorVariables[bonus.stats[0]]) return;
    // A stat applies to an action if it is already on the action stats or it is a common action variable.
    if (!object['isActor'] && !(ifdefor(object[bonus.stats[0]]) !== null || commonActionVariables[bonus.stats[0]])) return;
    // Do nothing if bonus tags are not all present on the object.
    for (var tag of bonus.tags) if (!object.tags[tag]) return;
    var value = evaluateValue(ifdefor(object.actor, object), bonus.value, object);
    for (var statKey of bonus.stats) {
        var statOps = object[statKey + 'Ops'] = ifdefor(object[statKey + 'Ops'], {'stat': statKey});
        //console.log([operator, tags.join(':'), statKey, bonus.value, value]);
        switch (bonus.operator) {
            case '+':
                statOps['+'] = ifdefor(statOps['+'], 0) - value;
                break;
            case '-':
                statOps['+'] = ifdefor(statOps['+'], 0) + value;
                break;
            case '&':
                statOps['&'] = ifdefor(statOps['&'], 0) - value;
                break;
            case '%':
                statOps['%'] = ifdefor(statOps['%'], 1) - value;
                break;
            case '*':
                statOps['*'] = ifdefor(statOps['*'], 1) / value;
                break;
            case '$':
                var index = statOps['$'].indexOf(value);
                statOps['$'].splice(index, 1);
                break;
        }
        object.dirtyStats[statKey] = true;
    }
}
function recomputeDirtyStats(object) {
    for (var statKey of Object.keys(object.dirtyStats)) {
        recomputeStat(object, statKey);
    }
}
function recomputeStat(object, statKey) {
    var statOps = ifdefor(object[statKey + 'Ops'], {'stat': statKey});
    // Typically objects like actions and buffs have some initial values for stats
    // which are either base totals for something like range or duration or strings
    // for special flags like 'alwaysHits'.
    var newValue = ifdefor(ifdefor(object.base, {})[statKey], 0);
    // Special values override all of the normal arithmetic for stats.
    if (ifdefor(statOps['$'], []).length) {
        newValue = statOps['$'][statOps['$'].length - 1];
    } else {
        //console.log(statOps);
        newValue = (newValue + ifdefor(statOps['+'], 0)) * ifdefor(statOps['%'], 1) * ifdefor(statOps['*'], 1) + ifdefor(statOps['&'], 0);
        if (allRoundedVariables[statKey]) {
            newValue = Math.round(newValue);
        }
    }
    setStat(object, statKey, newValue);
    //console.log(object[statKey]);
}
function setStat(object, statKey, newValue) {
    delete object.dirtyStats[statKey];
    if (object[statKey] === newValue) return;
    for (var dependency of ifdefor(object.bonusesDependingOn[statKey], [])) {
        removeBonusFromObject(dependency.object, dependency.bonus);
    }
    object[statKey] = newValue;
    for (var dependency of ifdefor(object.bonusesDependingOn[statKey], [])) {
        addBonusToObject(dependency.object, dependency.bonus);
        for (var dependentStat of dependency.bonus.stats) {
            recomputeStat(dependency.object, dependentStat);
        }
    }
}