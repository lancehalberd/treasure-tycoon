var personFrames = 7;
var clothes = [1, 3];
var hair = [clothes[1] + 1, clothes[1] + 4];
var names = ['Chris', 'Leon', 'Hillary', 'Michelle', 'Rob', 'Reuben', 'Kingston', 'Silver'];
var walkLoop = [0, 1, 2, 3];
var fightLoop = [4, 5, 6];
var pointsTypes = ['coins', 'anima', 'fame'];
// These are the only variables on actors that can be targeted by effects.
var allActorVariables = {
    'dexterity': '.',
    'strength': '.',
    'intelligence': '.',
    'maxHealth': '.',
    'healthRegen': '.',
    'speed': '.',
    // defensive stats
    'evasion': '.',
    'block': '.', 'magicBlock': '.', 'armor': '.', 'magicResist': '.',
    // special traits
    'cloaking': '.', 'overHeal': '.', 'increasedDrops': '.', 'increasedExperience': '.', 'cooldownReduction': '.',
    'equipmentMastery': '.', 'invulnerable': '.', 'maxBlock': '.', 'maxMagicBlock': '.', 'maxEvasion': '.',
    'uncontrollable': '.', 'twoToOneHanded': '.',
    // tracked for debuffs that deal damage over time
    'damageOverTime': '.',
    // For enemy loot and color
    'coins': '.', 'anima': '.', 'tint': '.', 'color': '.'
};
// These are variables that can be targeted by effects on any action.
var commonActionVariables = {
    // core action stats
    'accuracy': 'Checked against target\'s evasion to determine if this will hit the target.',
    'range': 'How far away this ability can target something.',
    'attackSpeed': 'How many times can this ability be used in one second.',
    'minPhysicalDamage': 'The minimum physical damage of this skill.',
    'maxPhysicalDamage': 'The maximum physical damage of this skill.',
    'minMagicDamage': 'The minimum magic damage of this skill.',
    'maxMagicDamage': 'The maximum magic damage of this skill.',
    'critChance': 'The percent chance for this ability to strike critically.',
    'critDamage': 'The percentage of bonus damage critical strikes gain.',
    'critAccuracy': 'The percentage of bonus accuracy critical strikes gain.',
    // common skill stats
    'cooldown': 'How long you have to wait before this skill can be used again.',
    'duration': 'How long this effect lasts.',
    'area': 'The radius of this skill\'s effect.',
    'buff': 'Some skills buff the user or allies.',
    'debuff': 'Some skills debuff enemies.',
    // various effects on hit
    'poison': 'Percentage of damage to deal each second over time.',
    'damageOnMiss': '.',
    'slowOnHit': '.',
    'healthGainOnHit': '.',
    'cleave': '.',
    'cleaveRange': '.',
    'knockbackChance': '.',
    'knockbackDistance': '.',
    'cull': '.',
    'armorPenetration': '.',
    'instantCooldownChance': '.', // %chance to ignore cooldown for an action
    // special flags
    'alwaysHits': '.',
    'chaining': '.',
    'criticalPiercing': '.',
    'domino': '.',
    'doubleStrike': '.',
    'firstStrike': '.',
    'ignoreArmor': '.',
    'ignoreResistance': '.',
    'instantCooldown': '.',
    'pullsTarget': '.',
    'undodgeable': '.',
};

var allRoundedVariables = {
    'dexterity' : true, 'strength': true, 'intelligence': true,
    'maxHealth': true, 'speed': true,
    'coins': true, 'anima': true,
    'evasion': true, 'block': true, 'magicBlock': true, 'armor': true
};

// All actors receive these bonuses, which give various benefits based on the core stats:
// dexterity, strength, and intelligence. Bonuses for bonusMaxHealth and healthRegen are included
// here but they could probably be added separately. BonuseMaxHealth is used to track
// overhealing which increases maxHealth for the duration of one adventure, and healthRegen
// is the passive healthRegen that all actors are given.
var coreStatBonusSource = {'bonuses': {
    '%evasion': [.002, '*', '{dexterity}'],
    '%attackSpeed': [.002, '*', '{dexterity}'],
    '+ranged:damage': ['{dexterity}', '/', 10],
    '%maxHealth': [.002, '*', '{strength}'],
    '%damage': [.002, '*', '{strength}'],
    '+melee:damage': ['{strength}', '/', 10],
    '%block': [.002, '*', '{intelligence}'],
    '%magicBlock': [.002, '*', '{intelligence}'],
    '%accuracy': [.002, '*', '{intelligence}'],
    '+magic:magicDamage': ['{intelligence}', '/', 10],
    '&maxHealth': '{bonusMaxHealth}',
    '+healthRegen': ['{maxHealth}', '/', 100],
    '+spell:power': [['{this.minMagicDamage}', '+' ,'{this.maxMagicDamage}'], '/' , 2]
}};

function removeAdventureEffects(adventurer) {
    setStat(adventurer, 'bonusMaxHealth', 0);
    adventurer.percentHealth = 1;
    adventurer.health = adventurer.maxHealth;
    while (adventurer.allEffects.length) {
        removeEffectFromActor(adventurer, adventurer.allEffects.pop(), false);
    }
    adventurer.attackCooldown = 0;
    adventurer.target = null;
    adventurer.slow = 0;
    recomputeDirtyStats(adventurer);
}
function returnToMap(character) {
    removeAdventureEffects(character.adventurer);
    character.area = null;
    updateAdventureButtons();
    if (state.selectedCharacter === character) {
        refreshStatsPanel(character, $('.js-characterColumn .js-stats'));
    }
    if (character.replay) {
        startArea(character, character.currentLevelKey);
    }
}
function refreshStatsPanel(character, $statsPanel) {
    var adventurer = character.adventurer;
    $statsPanel.find('.js-playerName').text(adventurer.job.name + ' ' + adventurer.name);
    $statsPanel.find('.js-playerLevel').text(adventurer.level);
    $statsPanel.find('.js-fame').text(character.fame.format(1));
    $statsPanel.find('.js-dexterity').text(adventurer.dexterity.format(0));
    $statsPanel.find('.js-strength').text(adventurer.strength.format(0));
    $statsPanel.find('.js-intelligence').text(adventurer.intelligence.format(0));
    $statsPanel.find('.js-divinity').text(character.divinity);
    $statsPanel.find('.js-maxHealth').text(adventurer.maxHealth.format(0));
    if (adventurer.actions.length) {
        $statsPanel.find('.js-range').text(getBasicAttack(adventurer).range.format(2));
    }
    $statsPanel.find('.js-speed').text(adventurer.speed.format(1));
    $statsPanel.find('.js-healthRegen').text(adventurer.healthRegen.format(1));
    updateDamageInfo(character, $statsPanel);
}
function newCharacter(job) {
    var character = {};
    character.adventurer = makeAdventurer(job, 1, ifdefor(job.startingEquipment, {}));
    character.adventurer.character = character;
    character.adventurer.direction = 1; // Character moves left to right.
    character.adventurer.isMainCharacter = true;
    character.adventurer.bonusMaxHealth = 0;
    character.adventurer.percentHealth = 1;
    character.adventurer.health = character.adventurer.maxHealth;
    var characterCanvas = createCanvas(32, 64);
    character.$characterCanvas = $(characterCanvas);
    character.$characterCanvas.addClass('js-character character')
        .attr('helptext', character.adventurer.job.name + ' ' + character.adventurer.name)
        .data('character', character);
    character.characterContext = characterCanvas.getContext("2d");
    character.boardCanvas = createCanvas(jewelsCanvas.width, jewelsCanvas.height);
    character.boardContext = character.boardCanvas.getContext("2d");
    character.time = now();
    character.gameSpeed = 1;
    character.replay = false;
    character.divinityScores = {};
    character.divinity = 0;
    character.currentLevelKey = ifdefor(job.levelKey, 'meadow');
    character.levelCompleted = false;
    character.fame = 1;
    var abilityKey = ifdefor(abilities[job.key]) ? job.key : 'heal';
    character.adventurer.abilities.push(abilities[abilityKey]);
    for (var i = 0; i < ifdefor(window.testAbilities, []).length; i++) {
        character.adventurer.abilities.push(testAbilities[i]);
        console.log(abilityHelpText(testAbilities[i], character));
    }
    character.board = readBoardFromData(job.startingBoard, character, abilities[abilityKey], true);
    centerShapesInRectangle(character.board.fixed.map(jewelToShape).concat(character.board.spaces), rectangle(0, 0, character.boardCanvas.width, character.boardCanvas.height));
    drawBoardBackground(character.boardContext, character.board);
    ifdefor(job.jewelLoot, [smallJewelLoot, smallJewelLoot, smallJewelLoot]).forEach(function (loot) {
        // Technically this gives the player the jewel, which we don't want to do for characters
        // generated that they don't control, but it immediately assigns it to the character,
        // so as long as this doesn't fail, that should not matter.
        draggedJewel = loot.generateLootDrop().gainLoot(character);
        draggedJewel.shape.setCenterPosition(jewelsCanvas.width / 2, jewelsCanvas.width / 2);
        if (!equipJewel(character, false, true)) {
            console.log("Failed to place jewel on starting board.");
        }
    });
    draggedJewel = null;
    overJewel = null;
    removeAdventureEffects(character.adventurer);
    return character;
}
function convertShapeDataToShape(shapeData) {
    return makeShape(shapeData.p[0], shapeData.p[1], (shapeData.t % 360 + 360) % 360, shapeDefinitions[shapeData.k][0], jewelShapeScale);
}
function makeAdventurer(job, level, equipment) {
    var personCanvas = createCanvas(personFrames * 32, 64);
    var personContext = personCanvas.getContext("2d");
    personContext.imageSmoothingEnabled = false;
    var adventurer = {
        'x': 0,
        'equipment': {},
        'job': job,
        'width': 64,
        'bonuses': [],
        'unlockedAbilities': {},
        'abilities': [], //abilities.hook, abilities.hookRange1, abilities.hookRange2, abilities.hookDrag1, abilities.hookDrag2, abilities.hookPower
        'name': Random.element(names),
        'hairOffset': Random.range(hair[0], hair[1]),
        'level': level,
        'personCanvas': personCanvas,
        'personContext': personContext,
        'attackCooldown': 0,
        'percentHealth': 1,
        'isActor': true
    };
    equipmentSlots.forEach(function (type) {
        adventurer.equipment[type] = null;
    });
    $.each(equipment, function (key, item) {
        item.crafted = true;
        craftingContext.fillStyle = 'green';
        craftingContext.fillRect(item.craftingX, item.craftingY, craftingSlotSize, craftingSlotSize);
        equipItem(adventurer, makeItem(item, 1), true);
    });
    drawCraftingViewCanvas();
    updateAdventurer(adventurer);
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
    if (pointsType == 'fame') updateHireButtons();
    else updateCraftingButtons();
    $('.js-global-' + pointsType).text(state[pointsType].abbreviate());
}
function addActions(actor, source) {
    if (ifdefor(source.onHitEffect)) {
        actor.onHitEffects.push(source.onHitEffect);
    }
    if (ifdefor(source.onCritEffect)) {
        actor.onCritEffects.push(source.onCritEffect);
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
function createAction(data) {
    var stats = ifdefor(data.stats, {});
    var action =  {'type': 'attack', 'tags': [], 'helpText': 'A basic attack.', 'stats': {}};
    $.each(data, function (key, value) {
        action[key] = copy(value);
    });
    $.each(stats, function (stat, value) {
        action.stats[stat] = value;
    });
    return action;
}
function updateAdventurer(adventurer) {
    // Clear the character's bonuses and graphics.
    adventurer.bonusSources = [];
    adventurer.bonusesByTag = {};
    adventurer.bonusesDependingOn = {};
    adventurer.dirtyStats = {};
    adventurer.actions = [];
    adventurer.reactions = [];
    adventurer.tags = {};
    adventurer.onHitEffects = [];
    adventurer.onCritEffects = [];
    adventurer.allEffects = [];
    var adventurerBonuses = {
        '+maxHealth': 20 * (adventurer.level + adventurer.job.dexterityBonus + adventurer.job.strengthBonus + adventurer.job.intelligenceBonus),
        '+accuracy': 2 * adventurer.level,
        '+evasion': adventurer.level,
        '+block': adventurer.level,
        '+magicBlock': adventurer.level / 2,
        '+dexterity': adventurer.level * adventurer.job.dexterityBonus,
        '+strength': adventurer.level * adventurer.job.strengthBonus,
        '+intelligence': adventurer.level * adventurer.job.intelligenceBonus,
        '+critDamage': .5,
        '+critAccuracy': .5,
        '+speed': 250,
        '+unarmed:minPhysicalDamage': adventurer.level,
        '+unarmed:maxPhysicalDamage': adventurer.level,
        '+unarmed:range': .5,
        '+unarmed:attackSpeed': 1,
        '+unarmed:critChance': .01
    };
    if (!adventurer.equipment.weapon) {
        // Fighting unarmed is considered using a fist weapon.
        adventurer.tags['fist'] = true;
        adventurer.tags['melee'] = true;
        // You gain the unarmed tag if both hands are free.
        if (!adventurer.equipment.offhand) {
            adventurer.tags['unarmed'] = true;
        }
    } else {
        adventurer.tags[adventurer.equipment.weapon.base.type] = true;
        ifdefor(adventurer.equipment.weapon.base.tags, []).forEach(function (tag) {
            adventurer.tags[tag] = true;
        });
        // You gain the noOffhand tag if offhand is empty and you are using a one handed weapon.
        if (!adventurer.equipment.offhand && !adventurer.tags['twoHanded']) {
            adventurer.tags['noOffhand'] = true;
        }
    }
    if (adventurer.equipment.offhand) {
        adventurer.tags[adventurer.equipment.offhand.base.type] = true;
        ifdefor(adventurer.equipment.offhand.base.tags, []).forEach(function (tag) {
            adventurer.tags[tag] = true;
        });
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
        addActions(adventurer, ability);
    });
    if (adventurer.character) {
        updateJewelBonuses(adventurer.character);
        adventurer.bonuses.push(adventurer.character.jewelBonuses);
        if (adventurer.character === state.selectedCharacter) {
            // Don't show the offhand slot if equipped with a two handed weapon unless they have a special ability to allow off hand with two handed weapons.
            $('.js-offhand').toggle(!isTwoHandedWeapon(adventurer.equipment.weapon) || !!ifdefor(adventurer.twoToOneHanded));
        }
    }
    // Add the adventurer's current equipment to bonuses and graphics
    equipmentSlots.forEach(function (type) {
        var equipment = adventurer.equipment[type];
        if (!equipment) {
            return;
        }
        addActions(adventurer, equipment.base);
        equipment.prefixes.forEach(function (affix) {
            addActions(adventurer, affix);
        })
        equipment.suffixes.forEach(function (affix) {
            addActions(adventurer, affix);
        })
        if (equipment.base.offset) {
            for (var i = 0; i < personFrames; i++) {
                adventurer.personContext.drawImage(images['gfx/person.png'], i * 32 + equipment.base.offset * sectionWidth, 0 , 32, 64, i * 32, 0, 32, 64);
            }
        }
    });
    adventurer.actions.push({'base': createAction({'tags': $.extend(adventurer.tags, {'basic': true})})});
    addBonusSourceToObject(adventurer, {'bonuses': adventurerBonuses});
    addBonusSourceToObject(adventurer, coreStatBonusSource);
    adventurer.abilities.forEach(function (ability) {
        if (ability.bonuses) addBonusSourceToObject(adventurer, ability);
    });
    recomputeDirtyStats(adventurer);
    console.log(adventurer);
}
function updateActorStats(actor) {
    actor.percentHealth = ifdefor(actor.health, 1) / ifdefor(actor.maxHealth, 1);
    actor.actions.concat(actor.reactions).forEach(function (action) {
        $.each(commonActionVariables, function (stat) {
            action[stat] = getStatForAction(actor, action.base, stat, action);
        });
        // Make sure to compute stats that appear specifically on this action
        // but that aren't included on commonActionVariables. At some point we
        // may just do away with this entirely or split the variables more
        // efficiently between these two. Right now commonActionVariables includes
        // a lot of effects which will not often appear.
        $.each(action.base.stats, function (stat) {
            if (stat.charAt(0) === '$') {
                stat = stat.substring(1);
            }
            // don't recalculate stats that we have already computed.
            if (commonActionVariables[stat]) {
                return;
            }
            action[stat] = getStatForAction(actor, action.base, stat, action);
        })
    });
    // Collect all buffs/debuffs from onHit/onCritEffects
    var effects = [];
    actor.onHitEffects.concat(actor.onCritEffects).forEach(function (effect) {
        if (ifdefor(effect.buff)) effects.push(effect.buff);
        if (ifdefor(effect.debuff)) effects.push(effect.debuff);
    });
    // Calculate variables for all buff/debuffs from onHit/onCritEffects.
    effects.forEach(function (effect) {
        $.each(commonActionVariables, function (stat) {
            effect[stat] = getStatForAction(actor, effect, stat, effect);
        });
        $.each(effect.stats, function (stat) {
            if (stat.charAt(0) === '$') {
                stat = stat.substring(1);
            }
            // don't recalculate stats that we have already computed.
            if (commonActionVariables[stat]) {
                return;
            }
            effect[stat] = getStatForAction(actor, effect, stat, effect);
        });
    });
    actor.health = actor.percentHealth * actor.maxHealth;
    if (ifdefor(actor.isMainCharacter) && actor.character === state.selectedCharacter) {
        refreshStatsPanel(actor.character, $('.js-characterColumn .js-stats'));
    }
    updateActorHelpText(actor);
}
function updateActorHelpText(actor) {
    var sections = [actor.name + ' ' + Math.ceil(actor.health) + '/' + Math.ceil(actor.maxHealth), ''];
    ifdefor(actor.allEffects, []).forEach(function (effect) {
        sections.push(bonusHelpText(effect, false, actor));
    });
    ifdefor(actor.prefixes, []).forEach(function (affix) {
        sections.push(bonusHelpText(affix.bonuses, false, actor));
    });
    ifdefor(actor.suffixes, []).forEach(function (affix) {
        sections.push(bonusHelpText(affix.bonuses, false, actor));
    });
    actor.helptext = sections.join('<br/>');
    if ($popup && canvasPopupTarget === actor) {
        $popup.html(canvasPopupTarget.helptext);
    }
}
function getStatForAction(actor, dataObject, stat, action) {
    var base = evaluateValue(actor, ifdefor(dataObject.stats[stat], 0), action), plus = 0, flatBonus = 0, percent = 1, multiplier = 1, specialValue = ifdefor(dataObject.stats['$' + stat], false);
    var baseKeys = [stat];
    if (stat === 'minPhysicalDamage' || stat === 'maxPhysicalDamage') {
        baseKeys.push('physicalDamage');
        baseKeys.push('damage');
    }
    if (stat === 'minMagicDamage' || stat === 'maxMagicDamage') {
        baseKeys.push('magicDamage');
        baseKeys.push('damage');
    }
    if (typeof base === 'object' && base.constructor != Array) {
        var subObject = {};
        if (!base.stats) {
            console.log(base);
            throw new Error("Found buff with undefined stats");
        }
        // Don't think I need to do common action variables for buffs...
        /*$.each(commonActionVariables, function (key) {
            subObject[key] = getStatForAction(actor, base, key, action);
        });*/
        $.each(base.stats, function (key, value) {
            if (key.charAt(0) === '$') {
                key = key.substring(1);
            }
            subObject[key] = getStatForAction(actor, base, key, action);
        });
        return subObject;
    }
    var keys = baseKeys.slice();
    var extraTags = [];
    if (dataObject.type) {
        extraTags.push(dataObject.type);
    }
    if (dataObject.key && dataObject.type !== dataObject.key) {
        extraTags.push(dataObject.key)
    }
    ifdefor(dataObject.tags, []).concat(extraTags).forEach(function (prefix) {
        baseKeys.forEach(function(baseKey) {
            keys.push(prefix + ':' + baseKey);
        });
    });
    // sometimes we get duplicate keys, so we use this to avoid processing the same
    // buff twice. This seems a little better than just trying to remove the keys
    // and is less work than making sure they aren't added in the first place.
    actor.bonuses.concat(ifdefor(dataObject.bonuses, [])).concat(ifdefor(actor.allEffects, [])).forEach(function (bonus) {
        var usedKeys = {};
        keys.forEach(function (key) {
            if (usedKeys[key]) return;
            usedKeys[key] = true;
            plus += evaluateValue(actor, ifdefor(bonus['+' + key], 0), action);
            plus -= evaluateValue(actor, ifdefor(bonus['-' + key], 0), action);
            flatBonus += evaluateValue(actor, ifdefor(bonus['&' + key], 0), action);
            percent += evaluateValue(actor, ifdefor(bonus['%' + key], 0), action);
            multiplier *= evaluateValue(actor, ifdefor(bonus['*' + key], 1), action);
            if (ifdefor(bonus['$' + key])) {
                specialValue = evaluateValue(actor, bonus['$' + key], action);
            }
        });
    });
    if (specialValue) {
        return specialValue;
    }
    return (base + plus + flatBonus) * percent * multiplier + flatBonus;
}
function gainLevel(adventurer) {
    adventurer.level++;
    adventurer.fame += adventurer.level;
    gain('fame', adventurer.level);
    updateActorStats(adventurer);
    updateEquipableItems();
    drawCraftingViewCanvas();
}
function addCharacterClass(name, dexterityBonus, strengthBonus, intelligenceBonus, startingEquipment, jewelLoot, levelKey) {
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
        'levelKey': ifdefor(levelKey, 'meadow')
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

addCharacterClass('Corsair', 2, 2, 1, {'weapon': itemsByKey.rock},
    [jewelLoot(['triangle'], [1, 1], [[10,15], [90, 100], [5, 10]], false), smallJewelLoot, smallJewelLoot], 'forestfloor');
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

function divinityToLevelUp(currentLevel) {
    return Math.ceil(baseDivinity(currentLevel)*(1 + (currentLevel - 1) / 10));
}
function baseDivinity(level) {
    return 10 * Math.pow(1.25, level - 1);
}

function totalCostForNextLevel(character, level) {
    var totalDivinityCost = divinityToLevelUp(character.adventurer.level);
    if (character.adventurer.level > 1) {
        totalDivinityCost += Math.ceil(ifdefor(level.skill.costCoefficient, 1) * baseDivinity(level.level));
    }
    return totalDivinityCost;
}
