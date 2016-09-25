
// Parses a hash key+value like {"+melee:damage": 25} into a fully defined bonus object.
function parseBonus(bonusKeyString, bonusValue) {
    if (typeof bonusKeyString !== 'string') {
        console.log('Expected string for bonusKeyString, found:');
        console.log(bonusKeyString);
        throw Error('bonusKeyString must be a string');
    }
    var operator = bonusKeyString[0];
    var tags = bonusKeyString.substr(1).split(':');
    var stat = tags.pop(), stats;
    // There are a few statKeys that effect multiple values on the object.
    if (stat === 'damage') {
        stats = ['minPhysicalDamage', 'maxPhysicalDamage', 'minMagicDamage', 'maxMagicDamage'];
    } else if (stat === 'physicalDamage') {
        stats = ['minPhysicalDamage', 'maxPhysicalDamage'];
    } else if (stat === 'magicDamage') {
        stats = ['minMagicDamage', 'maxMagicDamage'];
    } else {
        stats = [stat];
    }
    var statDependencies = getStatDependencies(bonusValue, {});
    return {'operator': operator, 'tags': tags, 'stats': stats, 'value': bonusValue, 'statDependencies': statDependencies, 'shortHand': operator + tags.join(':') + ':' + stat + ':' + bonusValue};
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
function initializeVariableObject(object, baseObject) {
    if (!baseObject) throw new Error('No base object provided for new variable object');
    if (!baseObject.variableObjectType) throw new Error('variableObjectType was not set on a variable object base object');
    object.base = baseObject;
    object.tags = {};
    for (var tag of ifdefor(object.base.tags, [])) {
        object.tags[tag] = true;
    }
    object.bonusSources = [];
    object.bonusesByTag = {};
    object.bonusesDependingOn = {};
    object.dirtyStats = {};
    switch (baseObject.variableObjectType){
        case 'actor':
            for (var actorStat of Object.keys(allActorVariables)) {
                object.dirtyStats[actorStat] = true;
            }
            break;
        case 'action':
            for (var actionStat of Object.keys(commonActionVariables)) {
                object.dirtyStats[actionStat] = true;
            }
            break;
    }
    object.variableChildren = [];
    if (object.base.bonuses) {

        addBonusSourceToObject(object, object.base,
            // Trigger computation so that implicit bonus will set stats it defines as targetable.
            // Otherwise bonuses that target stats on the implicitBonuses but are not otherwise
            // commonly defined stats won't apply since they check if that stat is null on the object.
            true,
            // Setting isImplicit to true will apply all bonuses, without checking if they are valid
            // for the object. Implicit bonuses are only defined if they are intended to be used on
            // the object. They also indicate that the stat should be targetable on this object in general.
            // Finally, isImplicit prevents these bonuses from being applied to children. Implicit bonuses
            // are intended only to be used as the basic stats for the object.
            true);
    }
    return object;
}
function addBonusSourceToObject(object, bonusSource, triggerComputation, isImplicit) {
    if (!bonusSource.bonuses) return;
    // Nonimplicit bonuses apply recursively to all the children of this object (actions of actors, buffs on actions, bonuses on buffs, etc).
    if (!isImplicit) {
        for (var variableChild of object.variableChildren) {
            addBonusSourceToObject(variableChild, bonusSource, triggerComputation);
        }
        object.bonusSources.push(bonusSource);
    }
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
        addBonusToObject(object, bonus, isImplicit);
    }
    if (ifdefor(triggerComputation)) {
        recomputeDirtyStats(object);
    }
}
function removeBonusSourceFromObject(object, bonusSource, triggerComputation) {
    if (!bonusSource.bonuses) return;
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
        removeBonusFromObject(object, bonus);
    }
    if (ifdefor(triggerComputation)) {
        recomputeDirtyStats(object);
    }
}
function addBonusToObject(object, bonus, isImplicit) {
    // Ignore stats that don't apply to the object.
    if (!isImplicit && object['isActor'] && !allActorVariables[bonus.stats[0]]) return;
    // A stat applies to an action if it is already on the action stats or it is a common action variable.
    if (!isImplicit && object['isAction'] && !(ifdefor(object[bonus.stats[0]]) !== null || commonActionVariables[bonus.stats[0]])) return;
    // Do nothing if bonus tags are not all present on the object.
    if (!object.tags)console.log(object);
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
    for (var variableChild of object.variableChildren) {
        recomputeDirtyStats(variableChild);
    }
}
function recomputeStat(object, statKey) {
    var statOps = ifdefor(object[statKey + 'Ops'], {'stat': statKey});
    // Typically objects like actions and buffs have some initial values for stats
    // which are either base totals for something like range or duration or strings
    // for special flags like 'alwaysHits'.
    var newValue = ifdefor(ifdefor(object.base.stats, {})[statKey], 0);
    // Special values override all of the normal arithmetic for stats.
    if (ifdefor(statOps['$'], []).length) {
        newValue = statOps['$'][statOps['$'].length - 1];
        // If this value is a baseObject for a variable object, set it as a new
        // variable obejct with the value as its base instead.
        if (newValue.variableObjectType) {
            if (object.bonusSources.length > 100) {
                throw new Error('too many bonus sources on object');
            }
            newValue = initializeVariableObject({}, newValue);
        }
    } else if (typeof(newValue) === 'number') {
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
    // If the old value was a variable child, remove it since it is either gone or
    // going to be replaced by a new version of the variable child.
    if (typeof object[statKey] === 'object' && object[statKey].base) {
        var index = object.variableChildren.indexOf(object[statKey]);
        if (index < 0) {
            console.log(object[statKey]);
            console.log(object.variableChildren);
            throw Error("Variable child was not found on parent object.");
        }
        object.variableChildren.splice(index, 1);
    }
    for (var dependency of ifdefor(object.bonusesDependingOn[statKey], [])) {
        removeBonusFromObject(dependency.object, dependency.bonus);
    }
    object[statKey] = newValue;
    // If the new value is a variable object, add it to variable children.
    if (typeof object[statKey] === 'object' && object[statKey].base) {
        addVariableChildToObject(object, object[statKey], true);
    }
    for (var dependency of ifdefor(object.bonusesDependingOn[statKey], [])) {
        addBonusToObject(dependency.object, dependency.bonus);
        for (var dependentStat of dependency.bonus.stats) {
            recomputeStat(dependency.object, dependentStat);
        }
    }
}

function findVariableChildForBaseObject(parentObject, baseObject) {
    for (var variableChild of parentObject.variableChildren) {
        if (variableChild.base === baseObject) return variableChild;
    }
    throw Error("Variable child was not found for given base object");
}

function addVariableChildToObject(parentObject, child, triggerComputation) {
    parentObject.variableChildren.push(child);
    child.tags = recomputeChildTags(parentObject, child);
    for (var bonusSource of parentObject.bonusSources) {
        addBonusSourceToObject(child, bonusSource);
    }
    if (triggerComputation) {
        recomputeDirtyStats(child);
    }
}

// Adding and removing tags from an object is not a reversible procedure since
// the previous state is not tracked. Therefore when something changes to update
// a tag (typically equiping an item on a character), we have to recompute the new
// set of tags for the actor from scratch and similarly for each action/buff/etc.
// Once the new set is determined, this method can be called to adjust all bonuses
// appropriately.
function updateTags(object, newTags, triggerComputation) {
    var lostTags = [];
    for (var oldTag of Object.keys(object.tags)) {
        if (!newTags[oldTag]) lostTags.push(oldTag);
    }
    for (var lostTag of lostTags) {
        for (var lostBonus of ifdefor(object.bonusesByTag[lostTag], [])) {
            // console.log("losing bonus from " + lostTag + " " + lostBonus.shortHand);
            removeBonusFromObject(object, lostBonus);
        }
    }
    var addedTags = [];
    for (var newTag of Object.keys(newTags)) {
        if (!object.tags[newTag]) addedTags.push(newTag);
    }
    // The new tags must be set after removing old bonuses, but before adding new bonuses,
    // since those methods will expect the tags to match in order to apply.
    object.tags = newTags;
    for (var addedTag of addedTags) {
        for (var addedBonus of ifdefor(object.bonusesByTag[addedTag], [])) {
            // console.log("gaining bonus from " + addedTag + " " + addedBonus.shortHand);
            addBonusToObject(object, addedBonus);
        }
    }
    for (var variableChild of object.variableChildren) {
        updateTags(variableChild, recomputeChildTags(object, variableChild), false);
    }
    if (triggerComputation) {
        recomputeDirtyStats(object);
    }
}

function recomputeChildTags(parentObject, child) {
    var tags = {};
    for (var tag of ifdefor(child.base.tags, [])) {
        tags[tag] = true;
    }
    // Child objects inherit tags from parent objects.
    for (var parentTag of Object.keys(parentObject.tags)) {
        // melee and ranged tags are exclusive. If a child has one set, it should
        // not inherit the opposite one from the parent.
        if (parentTag === 'melee' && tags['ranged']) continue;
        if (parentTag === 'ranged' && tags['melee']) continue;
        // If we want to prevent a child from inheriting other tags, we could
        // check if it is explicitly set to false.
        tags[parentTag] = true;
    }
    return tags;
}

/*
These methods were designed with an old version of updateTags and don't work with
the new version. Probably we don't need them, but I'm keeping them around for a bit
just in case I want to ressurect them.
function addTagToObject(object, tag, triggerComputation) {
    if (object.tags[tag]) return;
    var newTags = copy(object.tags);
    newTags[tag] = true;
    if (tag === 'melee') delete newTags['ranged'];
    if (tag === 'ranged') delete newTags['melee'];
    updateTags(object, newTags, false);
    for (var variableChild of object.variableChildren) {
        addTagToObject(variableChild, tag, false);
    }
    if (triggerComputation) {
        recomputeDirtyStats(object);
    }
}

function removeTagFromObject(object, tag, triggerComputation) {
    if (!object.tags[tag]) return;
    var newTags = copy(object.tags);
    delete newTags[tag];
    // Everything is either melee or ranged. If neither is set, default to melee.
    if (!newTags.melee && !newTags.ranged) newTags.melee = true;
    updateTags(object, newTags, false);
    for (var variableChild of object.variableChildren) {
        removeTagFromObject(variableChild, tag, false);
    }
    if (triggerComputation) {
        recomputeDirtyStats(object);
    }
}*/