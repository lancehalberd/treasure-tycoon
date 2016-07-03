var personFrames = 7;
var clothes = [1, 3];
var hair = [clothes[1] + 1, clothes[1] + 4];
var names = ['Chris', 'Leon', 'Hillary', 'Michelle', 'Rob', 'Reuben', 'Kingston', 'Silver'];
var walkLoop = [0, 1, 2, 3];
var fightLoop = [4, 5, 6];
var pointsTypes = ['coins', 'anima', 'fame'];
var allComputedStats = ['dexterity', 'strength', 'intelligence', 'maxHealth', 'speed',
     'coins', 'xpValue', 'anima',
     'evasion', 'block', 'magicBlock', 'armor', 'magicResist', 'accuracy', 'range', 'attackSpeed',
     'minDamage', 'maxDamage', 'minMagicDamage', 'maxMagicDamage', 'poison',
     'critChance', 'critDamage', 'critAccuracy',
     'damageOnMiss', 'slowOnHit', 'healthRegen', 'healthGainOnHit',
     'increasedDrops', 'increasedExperience', 'cooldownReduction', 'damageOverTime'];
var allRoundedStats = ['dexterity', 'strength', 'intelligence', 'maxHealth', 'speed',
     'coins', 'xpValue', 'anima',
     'evasion', 'block', 'magicBlock', 'armor', 'accuracy',
     'minDamage', 'maxDamage', 'minMagicDamage', 'maxMagicDamage'];

function displayInfoMode(character) {
    character.adventurer.percentHealth = 1;
    character.adventurer.health = character.adventurer.maxHealth;
    character.adventurer.attackCooldown = 0;
    character.adventurer.target = null;
    character.adventurer.slow = 0;
    character.$panel.find('.js-adventureMode').hide();
    var $infoPanel = character.$panel.find('.js-infoMode');
    $infoPanel.show();
    var currentLevelIndex = character.currentLevelIndex;
    character.area = null;
    character.currentLevelIndex = null;
    refreshStatsPanel(character);
    character.$panel.find('.js-recall').prop('disabled', true);
    if (character.replay) {
        startArea(character, currentLevelIndex);
    }
}
function refreshStatsPanel(character) {
    var adventurer = character.adventurer;
    var $statsPanel = character.$panel.find('.js-infoMode .js-stats');
    character.$panel.find('.js-name').text(adventurer.job.name + ' ' + adventurer.name);
    character.$panel.find('.js-level').text(adventurer.level);
    character.$panel.find('.js-infoMode .js-dexterity').text(adventurer.dexterity.format(0));
    character.$panel.find('.js-infoMode .js-strength').text(adventurer.strength.format(0));
    character.$panel.find('.js-infoMode .js-intelligence').text(adventurer.intelligence.format(0));
    $statsPanel.find('.js-toLevel').text(adventurer.xpToLevel - adventurer.xp);
    $statsPanel.find('.js-maxHealth').text(adventurer.maxHealth.format(0));
    $statsPanel.find('.js-range').text(adventurer.range.format(2));
    $statsPanel.find('.js-speed').text(adventurer.speed.format(1));
    $statsPanel.find('.js-healthRegen').text(adventurer.healthRegen.format(1));
    updateDamageInfo(character);
    if (character.board) {
        for (var i = 0; i < character.board.fixed.length; i++) {
            var jewel = character.board.fixed[i];
            jewel.helpText =  abilityHelpText(jewel.ability, character);
        }
    }
    updateSkillButtons(character);
}
function newCharacter(job) {
    var personCanvas = createCanvas(personFrames * 32, 64);
    var personContext = personCanvas.getContext("2d");
    personContext.imageSmoothingEnabled = false;
    var $newPlayerPanel = $('.js-playerPanelTemplate').clone()
        .removeClass('js-playerPanelTemplate').addClass('js-playerPanel').show();
    // The player template will be between the adventure panels and the hire adventure controls.
    $('.js-playerColumn .js-playerPanelTemplate').before($newPlayerPanel);
    var character = {};
    character.adventurer = makeAdventurer(job, 1, ifdefor(job.startingEquipment, {}));
    character.adventurer.character = character;
    character.adventurer.direction = 1; // Character moves left to right.
    character.adventurer.isMainCharacter = true;
    character.$panel = $newPlayerPanel;
    character.canvas = $newPlayerPanel.find('.js-adventureMode .js-canvas')[0];
    character.context = character.canvas.getContext("2d");
    character.context.imageSmoothingEnabled = false;
    character.previewContext = $newPlayerPanel.find('.js-infoMode .js-canvas')[0].getContext("2d"),
    character.previewContext.imageSmoothingEnabled = false;
    character.jewelsCanvas = $newPlayerPanel.find('.js-skillCanvas')[0];
    character.jewelsContext = character.jewelsCanvas.getContext("2d");
    character.boardCanvas = createCanvas(character.jewelsCanvas.width, character.jewelsCanvas.height);
    character.boardContext = character.boardCanvas.getContext("2d");
    character.time = now();
    character.gameSpeed = 1;
    character.replay = false;
    character.levelsCompleted = {};
    character.previewContext.imageSmoothingEnabled = false;
    state.characters.push(character);
    $newPlayerPanel.data('character', character);
    $newPlayerPanel.find('.js-map').append($levelDiv(ifdefor(job.areaKey, 'meadow')));
    displayInfoMode(character);
    var abilityKey = ifdefor(abilities[job.key]) ? job.key : 'heal';
    character.adventurer.abilities.push(abilities[abilityKey]);
    for (var i = 0; i < ifdefor(window.testAbilities, []).length; i++) {
        character.adventurer.abilities.push(testAbilities[i]);
        console.log(abilityHelpText(testAbilities[i], character));
    }
    character.board = readBoardFromData(job.startingBoard, character, abilities[abilityKey], true);
    centerShapesInRectangle(character.board.fixed.map(jewelToShape).concat(character.board.spaces), rectangle(0, 0, character.boardCanvas.width, character.boardCanvas.height));
    drawBoardBackground(character.boardContext, character.board);
    updateAdventurer(character.adventurer);
    ifdefor(job.jewelLoot, [smallJewelLoot, smallJewelLoot, smallJewelLoot]).forEach(function (loot) {
        draggedJewel = loot.generateLootDrop().gainLoot(character);
        draggedJewel.shape.setCenterPosition(character.jewelsCanvas.width / 2, character.jewelsCanvas.width / 2);
        if (!equipJewel(character)) {
            console.log("Failed to place jewel on starting board.");
        }
    });
    draggedJewel = null;
    overJewel = null;
    for (var i = 0; i < character.adventurer.actions.length; i++) {
        console.log(getTargetsForAction(character.adventurer, character.adventurer.actions[i]));
    }
}
function getTargetsForAction(actor, action) {
    var keys = [];
    var seen = {};
    $.each(action.base.stats, function (stat) {
        if (stat.charAt(0) === '$') {
            stat = stat.substring(1);
        }
        getTargetsForActionStat(actor, action.base, stat, action).forEach(function (newKey) {
            if (seen[newKey]) return;
            seen[newKey] = true;
            keys.push(newKey);
        });
    });
    return keys;
}
function getTargetsForActionStat(actor, dataObject, stat, action) {
    var keys = [];
    var base = evaluateValue(actor, ifdefor(dataObject.stats[stat], 0), action);
    if (typeof base === 'object' && base.constructor != Array) {
        var subObject = {};
        if (!base.stats) {
            console.log(base);
            throw new Error("Found buff with undefined stats");
        }
        $.each(base.stats, function (key, value) {
            if (key.charAt(0) === '$') {
                key = key.substring(1);
            }
            keys = keys.concat(getTargetsForActionStat(actor, base, key, action));
        });
        return keys;
    }
    keys.push('skill:' + stat);
    var extraTags = [];
    if (dataObject.type) {
        extraTags.push(dataObject.type);
    }
    if (dataObject.key && dataObject.type !== dataObject.key) {
        extraTags.push(dataObject.key);
    }
    ifdefor(dataObject.tags, []).concat(extraTags).forEach(function (prefix) {
        keys.push(prefix + ':skill:' + stat);
    });
    return keys;
}
function convertShapeDataToShape(shapeData) {
    return makeShape(shapeData.p[0], shapeData.p[1], (shapeData.t % 360 + 360) % 360, shapeDefinitions[shapeData.k][0], 30);
}
function makeAdventurer(job, level, equipment) {
    var personCanvas = createCanvas(personFrames * 32, 64);
    var personContext = personCanvas.getContext("2d");
    personContext.imageSmoothingEnabled = false;
    var adventurer = {
        'x': 0,
        'equipment': {},
        'job': job,
        'base': {
            'maxHealth': 20,
            'armor': 0,
            'speed': 250,
            'evasion': 1,
            'block': 1,
        },
        'width': 64,
        'bonuses': [],
        'unlockedAbilities': {},
        'abilities': [], //abilities.hook, abilities.hookRange1, abilities.hookRange2, abilities.hookDrag1, abilities.hookDrag2, abilities.hookPower
        'name': Random.element(names),
        'hairOffset': Random.range(hair[0], hair[1]),
        'level': level,
        'xp': 0,
        'xpToLevel': xpToLevel(0),
        'personCanvas': personCanvas,
        'personContext': personContext,
        'attackCooldown': 0,
        'percentHealth': 1
    };
    equipmentSlots.forEach(function (type) {
        adventurer.equipment[type] = null;
    });
    $.each(equipment, function (key, item) {
        item.crafted = true;
        state.craftingContext.fillStyle = 'green';
        state.craftingContext.fillRect(item.craftingX, item.craftingY, craftingSlotSize, craftingSlotSize);
        equipItem(adventurer, makeItem(item, 1));
    });
    drawCraftingViewCanvas();
    return adventurer;
}
function readBoardFromData(boardData, character, ability, confirmed) {
    return {
        'fixed': boardData.fixed.map(convertShapeDataToShape)
            .map(function(fixedJewelData) {
                var fixedJewel = makeFixedJewel(fixedJewelData, character, ability);
                fixedJewel.confirmed = ifdefor(confirmed, false);
                return fixedJewel;
            }),
        'spaces': boardData.fixed.concat(boardData.spaces).map(convertShapeDataToShape),
        'jewels': []
    };
}

function xpToLevel(level) {
    return (level + 1) * (level + 2) * 5;
}
function gain(pointsType, amount) {
    state[pointsType] += amount;
    changedPoints(pointsType);
}
function spend(pointsType, amount) {
    if (amount > state[pointsType]) {
        return false;
    }
    state[pointsType] -= amount;
    changedPoints(pointsType);
    return true;
}
function changedPoints(pointsType) {
    if (pointsType == 'fame') updateHireButton();
    else updateCraftButton();
    $('.js-' + pointsType).text(state[pointsType]);
}
function addBonusesAndActions(actor, source) {
    if (ifdefor(source.bonuses)) {
        actor.bonuses.push(source.bonuses);
    }
    if (ifdefor(source.onHitEffect)) {
        actor.onHitEffects.push(source.onHitEffect);
    }
    if (ifdefor(source.action)) {
        var action = {'base': createAction(source.action)}
        if (source.action.type === 'attack') {
            action.base.tags = action.base.tags.concat(actor.tags);
        }
        actor.actions.push(action);
    }
    if (ifdefor(source.reaction)) {
        var action = {'base': createAction(source.reaction)}
        if (source.reaction.type === 'attack') {
            action.base.tags = action.base.tags.concat(actor.tags);
        }
        actor.reactions.push(action);
    }
}
var inheritedActionStats = ['range', 'minDamage', 'maxDamage', 'minMagicDamage', 'maxMagicDamage', 'poison',
    'accuracy', 'attackSpeed', 'critChance', 'critDamage', 'critAccuracy', 'damageOnMiss', 'slowOnHit', 'healthGainOnHit'];
function createAction(data) {
    var stats = ifdefor(data.stats, {});
    var action =  {'type': 'attack', 'tags': [], 'helpText': 'A basic attack.', 'stats': {'cooldown': 0}};
    $.each(data, function (key, value) {
        action[key] = copy(value);
    });
    // Inherit stats from the base character stats by default.
    inheritedActionStats.forEach(function (stat) {
        action.stats[stat] = ['{' + stat + '}'];
    });
    $.each(stats, function (stat, value) {
        action.stats[stat] = value;
    });
    return action;
}
function updateAdventurer(adventurer) {
    // Clear the character's bonuses and graphics.
    adventurer.bonuses = [];
    adventurer.actions = [];
    adventurer.reactions = [];
    adventurer.tags = [];
    adventurer.onHitEffects = [];
    if (!adventurer.equipment.weapon) {
        // Fighting unarmed is considered using a fist weapon.
        adventurer.tags = ['fist', 'melee'];

        // You gain the unarmed tag if both hands are free.
        if (!adventurer.equipment.offhand) {
            adventurer.tags.push('unarmed');
        }
    } else {
        adventurer.tags.push(adventurer.equipment.weapon.base.type);
        adventurer.tags = adventurer.tags.concat(ifdefor(adventurer.equipment.weapon.base.tags, []));
    }

    var sectionWidth = personFrames * 32;
    var hat = adventurer.equipment.head;
    var hideHair = hat ? ifdefor(hat.base.hideHair, false) : false;
    adventurer.personContext.clearRect(0, 0, sectionWidth, 64);
    for (var i = 0; i < personFrames; i++) {
        adventurer.personContext.drawImage(images['gfx/person.png'], i * 32, 0 , 32, 64, i * 32, 0, 32, 64);
        if (!hideHair) {
            adventurer.personContext.drawImage(images['gfx/person.png'], i * 32 + adventurer.hairOffset * sectionWidth, 0 , 32, 64, i * 32, 0, 32, 64);
        }
    }
    adventurer.abilities.forEach(function (ability) {
        addBonusesAndActions(adventurer, ability);
    });
    if (adventurer.character) {
        adventurer.character.board.jewels.forEach(function (jewel) {
            adventurer.bonuses.push(jewel.bonuses);
            adventurer.bonuses.push(jewel.adjacencyBonuses);
        });
        // Don't show the offhand slot if equipped with a two handed weapon.
        adventurer.character.$panel.find('.js-offhand').toggle(!isTwoHandedWeapon(adventurer.equipment.weapon));
    }
    // Add the adventurer's current equipment to bonuses and graphics
    equipmentSlots.forEach(function (type) {
        var equipment = adventurer.equipment[type];
        if (!equipment) {
            return;
        }
        addBonusesAndActions(adventurer, equipment.base);
        equipment.prefixes.forEach(function (affix) {
            addBonusesAndActions(adventurer, affix);
        })
        equipment.suffixes.forEach(function (affix) {
            addBonusesAndActions(adventurer, affix);
        })
        if (equipment.base.offset) {
            for (var i = 0; i < personFrames; i++) {
                adventurer.personContext.drawImage(images['gfx/person.png'], i * 32 + equipment.base.offset * sectionWidth, 0 , 32, 64, i * 32, 0, 32, 64);
            }
        }
        if (ifdefor(adventurer.isMainCharacter)) {
            adventurer.character.$panel.find('.js-infoMode .js-equipment .js-' + type).append(equipment.$item);
        }
    });
    adventurer.actions.push({'base': createAction({'tags': adventurer.tags.concat(['basic'])})});
    updateActorStats(adventurer);
}
function updateActorStats(actor) {
    actor.percentHealth = ifdefor(actor.health, 1) / ifdefor(actor.maxHealth, 1);
    if (actor.personCanvas) {
        actor.base.maxHealth = 10 * (actor.level + actor.job.dexterityBonus + actor.job.strengthBonus + actor.job.intelligenceBonus);
        actor.base.accuracy = 2 * actor.level;
        actor.base.evasion = actor.level;
        actor.base.block = actor.level;
        actor.base.magicBlock = actor.level / 2;
        actor.base.dexterity = actor.level * actor.job.dexterityBonus;
        actor.base.strength = actor.level * actor.job.strengthBonus;
        actor.base.intelligence = actor.level * actor.job.intelligenceBonus;
        actor.base.minDamage = 0;
        actor.base.maxDamage = 0;
        actor.base.range = 0;
        actor.base.attackSpeed = 0;
        actor.base.critChance = 0;
        actor.base.critDamage = .5;
        actor.base.critAccuracy = .5;
        if (!actor.equipment.weapon) {
            actor.base.minDamage = actor.level;
            actor.base.maxDamage = actor.level;
            actor.base.range = .5;
            actor.base.attackSpeed = 1;
            actor.base.critChance = .01;
        }
    }
    allComputedStats.forEach(function (stat) {
        actor[stat] = getStat(actor, stat);
    });
    $.each(specialTraits, function (stat) {
        actor[stat] = getStat(actor, stat);
    });
    allRoundedStats.forEach(function (stat) {
        actor[stat] = Math.round(actor[stat]);
    });
    var sections = [actor.name, ''];
    ifdefor(actor.timedEffects, []).forEach(function (timedEffect) {
        sections.push(bonusHelpText(timedEffect, false, actor));
    });
    ifdefor(actor.fieldEffects, []).forEach(function (fieldEffect) {
        sections.push(bonusHelpText(fieldEffect, false, actor));
    });
    ifdefor(actor.prefixes, []).forEach(function (affix) {
        sections.push(bonusHelpText(affix.bonuses, false, actor));
    });
    ifdefor(actor.suffixes, []).forEach(function (affix) {
        sections.push(bonusHelpText(affix.bonuses, false, actor));
    });
    actor.helptext = sections.join('<br/>');
    actor.actions.concat(actor.reactions).forEach(function (action) {
        $.each(action.base.stats, function (stat) {
            if (stat.charAt(0) === '$') {
                stat = stat.substring(1);
            }
            action[stat] = getStatForAction(actor, action.base, stat, action);
        })
        $.each(specialTraits, function (stat) {
            action[stat] = getStatForAction(actor, action.base, stat, action);
        });
    });
    actor.health = actor.percentHealth * actor.maxHealth;
    if (ifdefor(actor.isMainCharacter)) {
        refreshStatsPanel(actor.character);
    }
}
function getStat(actor, stat) {
    var base = ifdefor(actor.base[stat], 0), plus = 0, percent = 1, multiplier = 1, specialValue = ifdefor(actor.base['$' + stat], false);
    var baseKeys = [stat];
    if (stat === 'evasion' || stat === 'attackSpeed') {
        percent += .002 * actor.dexterity;
    }
    if (stat === 'maxHealth') {
        percent += .002 * actor.strength;
    }
    if (stat === 'block' || stat === 'magicBlock' || stat === 'accuracy') {
        percent += .002 * actor.intelligence;
    }
    if (stat === 'minDamage' || stat === 'maxDamage') {
        baseKeys.push('damage');
        percent += .002 * actor.strength;
        if (actor.tags.indexOf('ranged') >= 0) {
            plus += actor.dexterity / 10;
        } else {
            plus += actor.strength / 10;
        }
    }
    if (stat === 'healthRegen') {
        plus += .01 * actor.maxHealth;
    }
    if ((stat === 'minMagicDamage' || stat === 'maxMagicDamage')) {
        baseKeys.push('magicDamage');
        // Int boost to magic damage, but only for weapons/monsters tagged 'magic'.
        if (actor.tags.indexOf('magic') >= 0) {
            plus += actor.intelligence / 10;
        }
    }
    // For example, when calculating min magic damage for a wand user, we check for all the following:
    // minMagicDamage, magicDamage, wand:minMagicDamage, wand:magicDamage, ranged:minMagicDamage, ranged:magicDamage, etc
    var keys = baseKeys.slice();
    ifdefor(actor.tags, []).forEach(function (tagPrefix) {
        baseKeys.forEach(function(baseKey) {
            keys.push(tagPrefix + ':' + baseKey);
        });
    });
    actor.bonuses.concat(ifdefor(actor.timedEffects, [])).concat(ifdefor(actor.fieldEffects, [])).forEach(function (bonus) {
        keys.forEach(function (key) {
            plus += evaluateValue(actor, ifdefor(bonus['+' + key], 0), actor);
            plus -= evaluateValue(actor, ifdefor(bonus['-' + key], 0), actor);
            percent += evaluateValue(actor, ifdefor(bonus['%' + key], 0), actor);
            multiplier *= evaluateValue(actor, ifdefor(bonus['*' + key], 1), actor);
            if (ifdefor(bonus['$' + key])) {
                specialValue = evaluateValue(actor, bonus['$' + key], actor);
            }
            if (ifdefor(bonus[key])) {
                specialValue = evaluateValue(actor, bonus[key], actor);
            }
        });
    });
    if (specialValue) {
        return specialValue;
    }
    //console.log(stat +": " + ['(',base, '+', plus,') *', percent, '*', multiplier]);
    return (base + plus) * percent * multiplier;
}
function getStatForAction(actor, dataObject, stat, action) {
    action.foo;
    var base = evaluateValue(actor, ifdefor(dataObject.stats[stat], 0), action), plus = 0, percent = 1, multiplier = 1, specialValue = ifdefor(dataObject.stats['$' + stat], false);
    if (typeof base === 'object' && base.constructor != Array) {
        var subObject = {};
        if (!base.stats) {
            console.log(base);
            throw new Error("Found buff with undefined stats");
        }
        $.each(base.stats, function (key, value) {
            if (key.charAt(0) === '$') {
                key = key.substring(1);
            }
            subObject[key] = getStatForAction(actor, base, key, action);
        });
        return subObject;
    }
    // stats from skills are prefixed with 'skill:' always so they won't be effected
    // by bonuses to global characters stats. For instance, skill.attackSpeed: ['attackSpeed']
    // inherits the attackSpeed value from the skill user, so we don't want to apply
    // '*attackSpeed': 2 to it as this has already been applied to the base attackSpeed.
    var keys = ['skill:' + stat];
    var extraTags = [];
    if (dataObject.type) {
        extraTags.push(dataObject.type);
    }
    if (dataObject.key && dataObject.type !== dataObject.key) {
        extraTags.push(dataObject.key)
    }
    ifdefor(dataObject.tags, []).concat(extraTags).forEach(function (prefix) {
        keys.push(prefix + ':skill:' + stat);
    });
    if (stat === 'power' && dataObject.tags.indexOf('spell') >= 0) {
        plus = (actor.minMagicDamage + actor.maxMagicDamage) / 2;
    }
    // sometimes we get duplicate keys, so we use this to avoid processing the same
    // buff twice. This seems a little better than just trying to remove the keys
    // and is less work than making sure they aren't added in the first place.
    actor.bonuses.concat(ifdefor(dataObject.bonuses, [])).concat(ifdefor(actor.timedEffects, [])).concat(ifdefor(actor.fieldEffects, [])).forEach(function (bonus) {
        var usedKeys = {};
        keys.forEach(function (key) {
            if (usedKeys[key]) return;
            usedKeys[key] = true;
            plus += evaluateValue(actor, ifdefor(bonus['+' + key], 0), action);
            plus -= evaluateValue(actor, ifdefor(bonus['-' + key], 0), action);
            percent += evaluateValue(actor, ifdefor(bonus['%' + key], 0), action);
            multiplier *= evaluateValue(actor, ifdefor(bonus['*' + key], 1), action);
            if (ifdefor(bonus['$' + key])) {
                specialValue = evaluateValue(actor, bonus['$' + key], action);
            }
            if (ifdefor(bonus[key])) {
                specialValue = evaluateValue(actor, bonus[key], action);
            }
        });
    });
    if (specialTraits[stat]) {
        return specialValue;
    }
    return (base + plus) * percent * multiplier;
}
function evaluateValue(actor, value, localObject) {
    if (typeof value === 'number') {
        return value;
    }
    if (typeof value === 'string' && value.charAt(0) === '{') {
        if (value.indexOf('this.') >= 0) {
            return localObject[value.substring(6, value.length - 1)];
        }
        return actor[value.substring(1, value.length - 1)];
    }
    // If this is an object, just return it for further processing.
    if (value.constructor !== Array) {
        return value;
    }
    var formula = value;
    if (!formula || !formula.length) {
        throw new Error('Expected "formula" to be an array, but value is: ' + formula);
    }
    formula = formula.slice();

    if (formula.length == 2 && formula[0] === '-') {
        formula.shift()
        value = -1 * evaluateValue(actor, formula.shift(), localObject);
    } else {
        value = evaluateValue(actor, formula.shift(), localObject);
    }
    if (formula.length > 1) {
        var operator = formula.shift();
        var operand = evaluateValue(actor, formula.shift(), localObject);
        if (operator == '+') {
            value += operand;
        } else if (operator == '-') {
            value -= operand;
        } else if (operator == '*') {
            value *= operand;
        } else if (operator == '/') {
            value /= operand;
        }
    }
    return value;
}
function gainXP(adventurer, amount) {
    amount *= (1 + adventurer.increasedExperience);
    adventurer.xp = Math.min(adventurer.xp + amount, adventurer.xpToLevel);
}
function gainLevel(adventurer) {
    adventurer.level++;
    gain('fame', adventurer.level);
    adventurer.xp = 0;
    adventurer.xpToLevel = xpToLevel(adventurer.level);
    updateActorStats(adventurer);
}
function addCharacterClass(name, dexterityBonus, strengthBonus, intelligenceBonus, startingEquipment, jewelLoot, areaKey) {
    var key = name.replace(/\s*/g, '').toLowerCase();
    startingEquipment = ifdefor(startingEquipment, {});
    startingEquipment.body = ifdefor(startingEquipment.body, itemsByKey.woolshirt);
    characterClasses[key] = {
        'key': key,
        'name': name,
        'dexterityBonus': dexterityBonus,
        'strengthBonus': strengthBonus,
        'intelligenceBonus': intelligenceBonus,
        'startingEquipment': startingEquipment,
        'startingBoard': ifdefor(classBoards[key], squareBoard),
        'jewelLoot': jewelLoot,
        'areaKey': ifdefor(areaKey, 'meadow')
    };
}


var characterClasses = {};
addCharacterClass('Fool', 0, 0, 0);

addCharacterClass('Juggler', 2, 1, 0, {'weapon': itemsByKey.ball},
    [jewelLoot(['triangle'], [1, 1], [[10,15], [90, 100], [5, 10]], false), smallJewelLoot, smallJewelLoot], 'grove');
addCharacterClass('Black Belt', 0, 2, 1, {},
    [jewelLoot(['triangle'], [1, 1], [[90, 100], [10,15], [5, 10]], false), smallJewelLoot, smallJewelLoot], 'meadow');
addCharacterClass('Priest', 1, 0, 2, {'weapon': itemsByKey.stick},
    [jewelLoot(['triangle'], [1, 1], [[10,15], [5, 10], [90, 100]], false), smallJewelLoot, smallJewelLoot], 'cave');

addCharacterClass('Corsair', 2, 2, 1, {'weapon': itemsByKey.rock});
addCharacterClass('Paladin', 1, 2, 2, {'weapon': itemsByKey.stick});
addCharacterClass('Dancer', 2, 1, 2, {'weapon': itemsByKey.ball});

addCharacterClass('Ranger', 3, 1, 1, {'weapon': itemsByKey.ball},
    [jewelLoot(['diamond'], [1, 1], [[10,15], [90, 100], [5, 10]], false), simpleJewelLoot, simpleJewelLoot], 'savannah');
addCharacterClass('Warrior', 1, 3, 1, {'weapon': itemsByKey.rock});
addCharacterClass('Wizard', 1, 1, 3, {'weapon': itemsByKey.stick},
    [jewelLoot(['diamond'], [1, 1], [[10,15], [5, 10], [90, 100]], false), simpleJewelLoot, simpleJewelLoot], 'savannah');

addCharacterClass('Assassin', 3, 2, 1, {'weapon': itemsByKey.ball});
addCharacterClass('Dark Knight', 1, 3, 2, {'weapon': itemsByKey.rock});
addCharacterClass('Bard', 2, 1, 3, {'weapon': itemsByKey.stick});

addCharacterClass('Sniper', 4, 1, 2, {'weapon': itemsByKey.ball});
addCharacterClass('Samurai', 2, 4, 1, {'weapon': itemsByKey.rock});
addCharacterClass('Sorcerer', 1, 2, 4, {'weapon': itemsByKey.stick});

addCharacterClass('Ninja', 4, 4, 2, {'weapon': itemsByKey.rock});
addCharacterClass('Enhancer', 2, 4, 4, {'weapon': itemsByKey.rock});
addCharacterClass('Sage', 4, 2, 4, {'weapon': itemsByKey.stick});

addCharacterClass('Master', 4, 4, 4);

var ranks = [
    ['juggler', 'blackbelt', 'priest'],
    ['corsair', 'paladin', 'dancer'],
    ['ranger', 'warrior', 'wizard'],
    ['assassin', 'darkknight', 'bard'],
    ['sniper', 'samurai', 'sorcerer'],
    ['ninja', 'enhancer', 'sage'],
    ['master', 'fool']
];
function initializeJobs() {
    var $jobSelect = $('.js-jobSelect');
    var cost = 10;
    ranks.forEach(function (rankJobs, index) {
        $jobSelect.append($tag('option', '', 'Rank ' + (index + 1) + ' Adventurer').data('jobs', rankJobs).data('cost', cost));
        rankJobs.forEach(function (jobKey) {
            var jobData = characterClasses[jobKey];
            jobData.cost = cost;
            $jobSelect.append($tag('option', '', jobData.name).data('jobs', [jobKey]).data('cost', cost * rankJobs.length));
        });
        cost *= 10;
    });
    updateHireButton();
}
$('.js-jobSelect').on('change', updateHireButton);
function updateHireButton() {
    var $jobOption = $('.js-jobSelect').find(':selected');
    var cost = $jobOption.data('cost');
    $('.js-hire').text('Hire for ' + $jobOption.data('cost') + ' Fame!');
    $('.js-hire').toggleClass('disabled', (cost > state.fame));
}
$('.js-hire').on('click', function () {
    var $jobOption = $('.js-jobSelect').find(':selected');
    var cost = $jobOption.data('cost');
    if (!spend('fame', cost)) {
        return;
    }
    var jobKey = Random.element($jobOption.data('jobs'));
    newCharacter(characterClasses[jobKey]);
    updateRetireButtons();
});