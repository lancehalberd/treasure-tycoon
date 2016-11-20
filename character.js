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
    'magicPower': '.',
    // This is not used directly, but is included as a factor in any skills based on the range of equipped weapon.
    'weaponRange': '.',
    // defensive stats
    'evasion': '.',
    'block': '.', 'magicBlock': '.', 'armor': '.', 'magicResist': '.',
    // special traits
    'cloaking': '.', 'overHeal': '.', 'increasedDrops': '.', 'cooldownReduction': '.',
    'equipmentMastery': '.', 'invulnerable': '.', 'maxBlock': '.', 'maxMagicBlock': '.', 'maxEvasion': '.',
    'uncontrollable': '.', 'twoToOneHanded': '.',
    // Used by Throwing Paradigm Shift which turns throwing weapons into melee weapons.
    'setRange': 'Override melee/ranged tags and weaponRange to specific values',
    // tracked for debuffs that deal damage over time
    'damageOverTime': '.',
    // For enemy loot and color
    'coins': '.', 'anima': '.', 'tint': '.', 'color': '.', 'scale': '.'
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
    'power': 'How powerful a spell is',
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
// here but they could probably be added separately. BonusMaxHealth is used to track
// overhealing which increases maxHealth for the duration of one adventure, and healthRegen
// is the passive healthRegen that all actors are given.
var coreStatBonusSource = {'bonuses': {
    '%evasion': [.002, '*', '{dexterity}'],
    '%attackSpeed': [.002, '*', '{dexterity}'],
    '+ranged:physicalDamage': ['{dexterity}', '/', 10],
    '%maxHealth': [.002, '*', '{strength}'],
    '%physicalDamage': [.002, '*', '{strength}'],
    '+melee:physicalDamage': ['{strength}', '/', 10],
    '%block': [.002, '*', '{intelligence}'],
    '%magicBlock': [.002, '*', '{intelligence}'],
    '%accuracy': [.002, '*', '{intelligence}'],
    '+magic:magicDamage': ['{intelligence}', '/', 10],
    '&maxHealth': '{bonusMaxHealth}',
    '+healthRegen': ['{maxHealth}', '/', 100],
    '+magicPower': ['{intelligence}', '+', [['{this.minMagicDamage}', '+' ,'{this.maxMagicDamage}'], '/' , 2]]
}};

function removeAdventureEffects(adventurer) {
    setStat(adventurer, 'bonusMaxHealth', 0);
    while (adventurer.allEffects.length) {
        var effect = adventurer.allEffects.pop();
        removeEffectFromActor(adventurer, effect, false);
    }
    initializeActorForAdventure(adventurer);
    recomputeDirtyStats(adventurer);
}
function initializeActorForAdventure(actor) {
    actor.percentHealth = 1;
    actor.health = actor.maxHealth;
    actor.stunned = 0;
    actor.pull = null;
    actor.time = 0;
    actor.animationTime = 0;
    actor.isDead = false;
    actor.timeOfDeath = undefined;
    actor.attackCooldown = 0;
    actor.target = null;
    actor.slow = 0;
}
function returnToMap(character) {
    removeAdventureEffects(character.adventurer);
    character.paused = false;
    character.area = null;
    updateAdventureButtons();
    if (state.selectedCharacter === character) {
        refreshStatsPanel(character, $('.js-characterColumn .js-stats'));
    }
    if (character.replay) {
        startArea(character, character.currentLevelKey);
    } else if (testingLevel) {
        stopTestingLevel();
    }
}
function refreshStatsPanel(character, $statsPanel) {
    character = ifdefor(character, state.selectedCharacter);
    $statsPanel = ifdefor($statsPanel, $('.js-characterColumn .js-stats'));
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
        console.log(abilityHelpText(testAbilities[i], character.adventurer));
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
        if (!equipJewel(character, false, false)) {
            console.log("Failed to place jewel on starting board.");
        }
    });
    draggedJewel = null;
    overJewel = null;
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
        'unlockedAbilities': {},
        'abilities': [], //abilities.hook, abilities.hookRange1, abilities.hookRange2, abilities.hookDrag1, abilities.hookDrag2, abilities.hookPower
        'name': Random.element(names),
        'hairOffset': Random.range(hair[0], hair[1]),
        'level': level,
        'personCanvas': personCanvas,
        'personContext': personContext,
        'attackCooldown': 0,
        'percentHealth': 1,
        'isActor': true,
        'actions': [],
        'reactions': [],
        'onHitEffects': [],
        'onCritEffects': [],
        'allEffects': [],
        'helpMethod': actorHelpText
    };
    initializeVariableObject(adventurer, {'variableObjectType': 'actor'}, adventurer);
    equipmentSlots.forEach(function (type) {
        adventurer.equipment[type] = null;
    });
    $.each(equipment, function (key, item) {
        item.crafted = true;
        craftingContext.fillStyle = 'green';
        craftingContext.fillRect(item.craftingX, item.craftingY, craftingSlotSize, craftingSlotSize);
        equipItem(adventurer, makeItem(item, 1), false);
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
    var effect, action;
    if (ifdefor(source.onHitEffect)) {
        effect = initializeVariableObject({}, source.onHitEffect, actor);
        actor.onHitEffects.push(effect);
        addVariableChildToObject(actor, effect);
    }
    if (ifdefor(source.onCritEffect)) {
        effect = initializeVariableObject({}, source.onCritEffect, actor);
        actor.onCritEffects.push(effect);
        addVariableChildToObject(actor, effect);
    }
    if (ifdefor(source.action)) {
        action = initializeVariableObject({}, source.action, actor);
        actor.actions.push(action);
        addVariableChildToObject(actor, action);
    }
    if (ifdefor(source.reaction)) {
        action = initializeVariableObject({}, source.reaction, actor);
        actor.reactions.push(action);
        addVariableChildToObject(actor, action);
    }
    if (ifdefor(source.minionBonuses)) {
        actor.minionBonusSources.push({'bonuses': source.minionBonuses});
    }
}
function removeActions(actor, source) {
    var variableChild;
    if (ifdefor(source.onHitEffect)) {
        variableChild = findVariableChildForBaseObject(actor, source.onHitEffect);
        removeElementFromArray(actor.onHitEffects, variableChild);
        removeElementFromArray(actor.variableChildren, variableChild);
    }
    if (ifdefor(source.onCritEffect)) {
        variableChild = findVariableChildForBaseObject(actor, source.onCritEffect);
        removeElementFromArray(actor.onCritEffects, variableChild);
        removeElementFromArray(actor.variableChildren, variableChild);
    }
    if (ifdefor(source.action)) {
        variableChild = findVariableChildForBaseObject(actor, source.action);
        removeElementFromArray(actor.actions, variableChild);
        removeElementFromArray(actor.variableChildren, variableChild);
    }
    if (ifdefor(source.reaction)) {
        variableChild = findVariableChildForBaseObject(actor, source.reaction);
        removeElementFromArray(actor.reactions, variableChild);
        removeElementFromArray(actor.variableChildren, variableChild);
    }
    if (ifdefor(source.minionBonuses)) {
        for (var bonusSource of actor.minionBonusSources) {
            if (bonusSource.bonuses === source.minionBonuses) {
                removeElementFromArray(actor.minionBonusSources, bonusSource);
            }
        }
    }
}
function updateAdventurer(adventurer) {
    // Clear the character's bonuses and graphics.
    initializeVariableObject(adventurer, {'variableObjectType': 'actor'}, adventurer);
    for (var stat of Object.keys(adventurer)) {
        if (stat.indexOf('Ops') === stat.length - 3) {
            delete adventurer[stat];
        }
    }
    adventurer.actions = [];
    adventurer.reactions = [];
    adventurer.onHitEffects = [];
    adventurer.onCritEffects = [];
    adventurer.allEffects = [];
    adventurer.minionBonusSources = [];
    var adventurerBonuses = {
        '+maxHealth': 20 * (adventurer.level + adventurer.job.dexterityBonus + adventurer.job.strengthBonus + adventurer.job.intelligenceBonus),
        '+accuracy': 1 + 2 * adventurer.level,
        '+evasion': adventurer.level,
        '+block': adventurer.level,
        '+magicBlock': adventurer.level / 2,
        '+dexterity': adventurer.level * adventurer.job.dexterityBonus,
        '+strength': adventurer.level * adventurer.job.strengthBonus,
        '+intelligence': adventurer.level * adventurer.job.intelligenceBonus,
        '+critDamage': .5,
        '+critAccuracy': .5,
        '+speed': 250,
        '+weaponless:minPhysicalDamage': adventurer.level,
        '+weaponless:maxPhysicalDamage': adventurer.level,
        '+weaponless:weaponRange': .5,
        // You are weaponless if you have no weapon equipped.
        '+weaponless:attackSpeed': .5,
        // You are unarmed if you have no weapon or offhand equipped.
        '+unarmed:attackSpeed': .5,
        '+weaponless:critChance': .01
    };
    adventurer.tags = recomputActorTags(adventurer);
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
    addActions(adventurer, abilities.basicAttack);
    adventurer.abilities.forEach(function (ability) {
        addActions(adventurer, ability);
        if (ability.bonuses) addBonusSourceToObject(adventurer, ability);
    });
    if (adventurer.character) {
        updateJewelBonuses(adventurer.character);
        addBonusSourceToObject(adventurer, adventurer.character.jewelBonuses);
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
        addBonusSourceToObject(adventurer, equipment.base);
        equipment.prefixes.forEach(function (affix) {
            addActions(adventurer, affix);
            addBonusSourceToObject(adventurer, affix);
        })
        equipment.suffixes.forEach(function (affix) {
            addActions(adventurer, affix);
            addBonusSourceToObject(adventurer, affix);
        })
        if (equipment.base.offset) {
            for (var i = 0; i < personFrames; i++) {
                adventurer.personContext.drawImage(images['gfx/person.png'], i * 32 + equipment.base.offset * sectionWidth, 0 , 32, 64, i * 32, 0, 32, 64);
            }
        }
    });
    addBonusSourceToObject(adventurer, {'bonuses': adventurerBonuses});
    addBonusSourceToObject(adventurer, coreStatBonusSource);
    recomputeDirtyStats(adventurer);
    //console.log(adventurer);
}
function recomputActorTags(actor) {
    var tags = {'actor': true};
    if (actor.equipment) {
        if (!actor.equipment.weapon) {
            // Fighting unarmed is considered using a fist weapon.
            tags['fist'] = true;
            tags['melee'] = true;
            tags['weaponless'] = true;
            // You gain the unarmed tag if both hands are free.
            if (!actor.equipment.offhand) {
                tags['unarmed'] = true;
            }
        } else {
            tags[actor.equipment.weapon.base.type] = true;
            for (var tag of Object.keys(ifdefor(actor.equipment.weapon.base.tags, {}))) {
                tags[tag] = true;
            }
            // You gain the noOffhand tag if offhand is empty and you are using a one handed weapon.
            if (!actor.equipment.offhand && !tags['twoHanded']) {
                tags['noOffhand'] = true;
            }
        }
        if (actor.equipment.offhand) {
            tags[actor.equipment.offhand.base.type] = true;
            for (var tag of Object.keys(ifdefor(actor.equipment.offhand.base.tags, {}))) {
                tags[tag] = true;
            }
        }
    }
    if (actor.base && actor.base.tags) {
        for (var tag of ifdefor(actor.base.tags, [])) tags[tag] = true;
        if (tags['ranged']) delete tags['melee'];
        else tags['melee'] = true;
    }
    if (actor.setRange) {
        if (actor.setRange === 'ranged') {
            tags['ranged'] = true;
            delete tags['melee'];
        } else {
            tags['melee'] = true;
            delete tags['ranged'];
        }
    }
    return tags;
}
function updateActorHelpText(actor) {
    if ($popup && canvasPopupTarget === actor) {
        $popup.html(actorHelpText(actor));
    }
}
function actorHelpText(actor) {
    var sections = [actor.name + ' ' + Math.ceil(actor.health) + '/' + Math.ceil(actor.maxHealth), ''];
    ifdefor(actor.prefixes, []).forEach(function (affix) {
        sections.push(bonusSourceHelpText(affix, actor));
    });
    ifdefor(actor.suffixes, []).forEach(function (affix) {
        sections.push(bonusSourceHelpText(affix, actor));
    });
    var countMap = {};
    ifdefor(actor.allEffects, []).forEach(function (effect) {
        var effectText = bonusSourceHelpText(effect, actor);
        countMap[effectText] = ifdefor(countMap[effectText], 0) + 1;
    });
    for (var text in countMap) {
        if (countMap[text] > 1) text += tag('div', 'effectCounter', 'x' + countMap[text]);
        sections.push(tag('div', 'effectText', text));
    }
    return sections.join('<br/>');
}
function gainLevel(adventurer) {
    adventurer.level++;
    adventurer.fame += adventurer.level;
    gain('fame', adventurer.level);
    // We need to update the adventurer from scratch here because we cannot
    // remove their bonuses based on their level since no reference is stored to it.
    // One way to avoid this in the future would be to store this as a single bonus
    // that uses the character level as input. Then if we called setStat(adventurer, 'level', adventurer.level + 1);
    // All the other stats would be updated as a result. A similar approach could be used to set the base monster bonuses.
    // The formulate for monster health is too complicated for the bonus system to support at the moment though.
    updateAdventurer(adventurer);
    refreshStatsPanel();
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
function setSelectedCharacter(character) {
    state.selectedCharacter = character;
    var adventurer = character.adventurer;
    // update the equipment displayed.
    equipmentSlots.forEach(function (type) {
        //detach any existing item
        $('.js-equipment .js-' + type + ' .js-item').detach();
        var equipment = adventurer.equipment[type];
        if (equipment) {
            $('.js-equipment .js-' + type).append(equipment.$item);
        }
    });
    // update stats panel.
    refreshStatsPanel(character, $('.js-characterColumn .js-stats'))
    // update controls:
    $('.js-jewelBoard .js-skillCanvas').data('character', character);
    character.jewelsCanvas = $('.js-jewelBoard .js-skillCanvas')[0];
    $('.js-jewelBonuses .js-content').empty().append(bonusSourceHelpText(character.jewelBonuses, character.adventurer));
    centerMapOnLevel(map[character.currentLevelKey]);
    updateAdventureButtons();
    updateConfirmSkillButton();
    updateEquipableItems();
    // Need to update which crafting levels are drawn in green/red.
    drawCraftingViewCanvas();
}
