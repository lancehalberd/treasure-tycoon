var personFrames = 5;
var maxLevel = 100;
var clothes = [1, 3];
var hair = [clothes[1] + 1, clothes[1] + 4];
var names = ['Chris', 'Leon', 'Hillary', 'Michelle', 'Rob', 'Reuben', 'Kingston', 'Silver', 'Blaise'];
var pointsTypes = ['coins', 'anima', 'fame'];
// These are the only variables on actors that can be targeted by effects.
var allActorVariables = {
    'levelCoefficient': 'This coefficient is used in several stats as a base for exponential scaling such as maxHealth, magicPower, armor, block and magic block',
    'dexterity': '.',
    'strength': '.',
    'intelligence': '.',
    'maxHealth': '.',
    'healthRegen': '.',
    'speed': '.',
    'magicPower': '.',
    // These stats are used as input into the actual range/damage stats on abilities/attacks.
    // For example spells use magicPower as input to damage, which is intelligence + average weaponMagicDamage.
    'minWeaponPhysicalDamage': '.', 'maxWeaponPhysicalDamage': '.',
    'minWeaponMagicDamage': '.', 'maxWeaponMagicDamage': '.',
    'weaponRange': '.',
    // defensive stats
    'evasion': '.',
    'block': '.', 'magicBlock': '.', 'armor': '.', 'magicResist': '.',
    // special traits
    'cloaking': '.', 'overHeal': '.', 'increasedDrops': '.',
    'reducedDivinityCost': 'Reduces the divinity cost to level at shrines by this percent',
    'equipmentMastery': '.', 'invulnerable': '.', 'maxBlock': '.', 'maxMagicBlock': '.', 'maxEvasion': '.',
    'uncontrollable': '.', 'twoToOneHanded': '.',
    'overHealReflection': '.',
    'healOnCast': '.',
    'castKnockBack': '.',
    // Used by Throwing Paradigm Shift which turns throwing weapons into melee weapons.
    'setRange': 'Override melee/ranged tags and weaponRange to specific values',
    'cannotAttack': 'Set to prevent a character from using actions with attack tag.',
    'healingAttacks': 'Set to make basic attack heal allies instead of damage enemies.',
    'imprintSpell': 'Staff paradigm shift imprints spells on weapon to replace basic attack stats',
    // tracked for debuffs that deal damage over time
    'damageOverTime': '.',
    // For enemy loot and color
    'coins': '.', 'anima': '.', 'lifeBarColor': '.', 'scale': '.',
    'tint': 'Color to of glowing tint', 'tintMaxAlpha': 'Max alpha for tint.', 'tintMinAlpha': 'Min alph for tint.'
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
    'knockbackRotation': 'How much to rotate targets that are knocked back.',
    'cull': '.',
    'armorPenetration': '.',
    'instantCooldownChance': '.', // %chance to ignore cooldown for an action
    'heals': 'Attack damage heals the target instead of hurting them.',
    'magicToPhysical': 'Magic damage applies as physical damage instead. For spell paradigm shift.',
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
    'dodge': 'This ability dodges incoming attacks. Only implemented for counter attack right now.'
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
    '+ranged:weaponPhysicalDamage': ['{dexterity}', '/', 10],
    '%maxHealth': [.002, '*', '{strength}'],
    '%weaponPhysicalDamage': [.002, '*', '{strength}'],
    '+melee:weaponPhysicalDamage': ['{strength}', '/', 10],
    '%block': [.002, '*', '{intelligence}'],
    '%magicBlock': [.002, '*', '{intelligence}'],
    '%accuracy': [.002, '*', '{intelligence}'],
    '+magic:weaponMagicDamage': ['{intelligence}', '/', 10],
    // Note that magicResist/evasion/accuracy don't need to scale to keep up with exponential max health/damage, but block, magic block and armor do.
    '*maxHealth': '{levelCoefficient}',
    '*armor': '{levelCoefficient}',
    '*block': '{levelCoefficient}',
    '*magicBlock': '{levelCoefficient}',
    '&maxHealth': '{bonusMaxHealth}',
    '*healthRegen': '{levelCoefficient}',
    '+healthRegen': [['{maxHealth}', '/', 50], '/', '{levelCoefficient}'],
    '+magicPower': [['{intelligence}', '*', '{levelCoefficient}'], '+', [['{minWeaponMagicDamage}', '+' ,'{maxWeaponMagicDamage}'], '*', 3]],
    '+minPhysicalDamage': '{minWeaponPhysicalDamage}',
    '+maxPhysicalDamage': '{maxWeaponPhysicalDamage}',
    '+minMagicDamage': '{minWeaponMagicDamage}',
    '+maxMagicDamage': '{maxWeaponMagicDamage}',
    // All sprites are drawn at half size at the moment.
    '+scale': 2,
    '$lifeBarColor': 'red'
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
    actor.maxReflectBarrier = actor.reflectBarrier = 0;
    actor.health = actor.maxHealth;
    actor.bonusMaxHealth = 0;
    actor.stunned = 0;
    actor.pull = null;
    actor.chargeEffect = null;
    actor.time = 0;
    actor.isDead = false;
    actor.timeOfDeath = undefined;
    actor.skillInUse = null;
    actor.slow = 0;
    actor.rotation = 0;
    actor.activity = null;
    actor.imprintedSpell = null;
    actor.area = actor.character.area;
    // actor.heading = [1, 0, 0];
    var stopTimeAction = findActionByTag(actor.reactions, 'stopTime');
    actor.temporalShield = actor.maxTemporalShield = (stopTimeAction ? stopTimeAction.duration : 0);
    updateActorDimensions(actor);
}
function returnToMap(character) {
    removeAdventureEffects(character.adventurer);
    character.paused = false;
    leaveCurrentArea(character);
    updateAdventureButtons();
    if (character.autoplay && character.replay) {
        startArea(character, character.currentLevelKey);
    } else if (testingLevel) {
        stopTestingLevel();
    } else if (state.selectedCharacter === character) {
        setContext('map');
        refreshStatsPanel(character, $('.js-characterColumn .js-stats'));
    } else {
        character.context = 'map';
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
    $('.js-global-divinity').text(character.divinity.abbreviate());
    $statsPanel.find('.js-maxHealth').text(adventurer.maxHealth.format(0).abbreviate());
    if (adventurer.actions.length) {
        $statsPanel.find('.js-range').text(getBasicAttack(adventurer).range.format(2));
    }
    $statsPanel.find('.js-speed').text(adventurer.speed.format(1));
    $statsPanel.find('.js-healthRegen').text(adventurer.healthRegen.format(1));
    updateDamageInfo(character, $statsPanel);
}
function newCharacter(job) {
    var character = {};
    var hero = makeAdventurerFromJob(job, 1, ifdefor(job.startingEquipment, {}));
    character.adventurer = hero;
    hero.character = character;
    hero.heading = [1, 0, 0]; // Character moves left to right by default.
    hero.isMainCharacter = true;
    hero.bonusMaxHealth = 0;
    hero.percentHealth = 1;
    hero.health = hero.maxHealth;
    var characterCanvas = createCanvas(40, 20);
    character.$characterCanvas = $(characterCanvas);
    character.$characterCanvas.addClass('js-character character')
        .attr('helptext', hero.job.name + ' ' + hero.name)
        .data('character', character);
    character.characterContext = characterCanvas.getContext("2d");
    character.boardCanvas = createCanvas(jewelsCanvas.width, jewelsCanvas.height);
    character.boardContext = character.boardCanvas.getContext("2d");
    character.time = now();
    character.gameSpeed = 1;
    character.replay = false;
    character.divinityScores = {};
    character.levelTimes = {};
    character.divinity = 0;
    character.currentLevelKey = 'guild';
    character.fame = 1;
    var abilityKey = ifdefor(abilities[job.key]) ? job.key : 'heal';
    hero.abilities.push(abilities[abilityKey]);
    for (var i = 0; i < ifdefor(window.testAbilities, []).length; i++) {
        hero.abilities.push(testAbilities[i]);
        console.log(abilityHelpText(testAbilities[i], hero));
    }
    character.board = readBoardFromData(job.startingBoard, character, abilities[abilityKey], true);
    centerShapesInRectangle(character.board.fixed.map(jewelToShape).concat(character.board.spaces), rectangle(0, 0, character.boardCanvas.width, character.boardCanvas.height));
    drawBoardBackground(character.boardContext, character.board);
    ifdefor(job.jewelLoot, [smallJewelLoot, smallJewelLoot, smallJewelLoot]).forEach(function (loot) {
        // Technically this gives the player the jewel, which we don't want to do for characters
        // generated that they don't control, but it immediately assigns it to the character,
        // so as long as this doesn't fail, that should not matter.
        draggedJewel = loot.generateLootDrop().gainLoot(hero);
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
    return makeShape(shapeData.p[0] * displayJewelShapeScale / originalJewelScale, shapeData.p[1] * displayJewelShapeScale / originalJewelScale, (shapeData.t % 360 + 360) % 360, shapeDefinitions[shapeData.k][0], displayJewelShapeScale);
}
function makeAdventurerFromData(adventurerData) {
    var personCanvas = createCanvas(personFrames * 96, 64);
    var personContext = personCanvas.getContext("2d");
    personContext.imageSmoothingEnabled = false;
    var adventurer = {
        'x': 0,
        'y': 0,
        'z': 0,
        'equipment': {},
        'job': characterClasses[adventurerData.jobKey],
        'source': setupActorSource({
            'width': 96,
            'height': 64,
            'yCenter': 44, // Measured from the top of the source
            'yOffset': 14, // Measured from the top of the source
            'actualHeight': 45,
            'xOffset': 39,
            'actualWidth': 18,
            'attackY': 19, // Measured from the bottom of the source
            'walkFrames': [0, 1, 0, 2],
            'attackPreparationFrames': [0, 3, 4],
            'attackRecoveryFrames': [4, 3]
        }),
        'bonuses': [],
        'unlockedAbilities': {},
        'abilities': [],
        'name': adventurerData.name,
        'hairOffset': adventurerData.hairOffset % 6,
        'skinColorOffset': ifdefor(adventurerData.skinColorOffset, Random.range(0, 2)) % 3,
        'level': adventurerData.level,
        'image': personCanvas,
        'personCanvas': personCanvas,
        'personContext': personContext,
        'attackCooldown': 0,
        'percentHealth': 1,
        'helpMethod': actorHelpText
    };
    initializeVariableObject(adventurer, {'variableObjectType': 'actor'}, adventurer);
    equipmentSlots.forEach(function (type) {
        adventurer.equipment[type] = null;
    });
    return adventurer;
}
function makeAdventurerFromJob(job, level, equipment) {
    var adventurer = makeAdventurerFromData({
        'jobKey': job.key,
        'level': level,
        'name': Random.element(names),
        'hairOffset': Random.range(0, 6),
        'skinColorOffset': Random.range(0, 2),
        'equipment': equipment
    });
    $.each(equipment, function (key, item) {
        state.craftedItems[item.key] = ifdefor(state.craftedItems[item.key], 0) | CRAFTED_NORMAL;
        equipItemProper(adventurer, makeItem(item, 1), false);
    });
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

function previewPointsChange(pointsType, amount) {
    if (amount === 0) return;
    var $pointsSpan = $('.js-global-' + pointsType);
    $pointsSpan.nextAll().show();
    var $amount = $pointsSpan.nextAll('.js-amount');
    $amount.toggleClass('cost', amount < 0);
    if (amount < 0) $amount.text('-' + Math.abs(amount).abbreviate());
    else $amount.text('+' + amount.abbreviate());
    if (pointsType === 'divinity') var balance = state.selectedCharacter.divinity + amount;
    else var balance = state[pointsType] + amount;
    var $balance = $pointsSpan.nextAll('.js-balance');
    $balance.toggleClass('cost', balance < 0);
    if (balance < 0) $balance.text('-' + Math.abs(balance).abbreviate());
    else $balance.text(balance.abbreviate());
}
function hidePointsPreview() {
    $('.js-amount, .js-bottomLine, .js-balance').hide();
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
    else updateReforgeButton();
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
    var levelCoefficient = Math.pow(1.05, adventurer.level);
    var adventurerBonuses = {
        '+maxHealth': 50 + 20 * (adventurer.level + adventurer.job.dexterityBonus + adventurer.job.strengthBonus + adventurer.job.intelligenceBonus),
        '+levelCoefficient': levelCoefficient,
        '+accuracy': 2 + 2 * adventurer.level,
        '+evasion': adventurer.level,
        '+block': adventurer.level,
        '+magicBlock': adventurer.level / 2,
        '+dexterity': adventurer.level * adventurer.job.dexterityBonus,
        '+strength': adventurer.level * adventurer.job.strengthBonus,
        '+intelligence': adventurer.level * adventurer.job.intelligenceBonus,
        '+critDamage': .5,
        '+critAccuracy': .5,
        '+speed': 250,
        '+weaponless:accuracy': 1 + 2 * adventurer.level,
        '+weaponless:minPhysicalDamage': 1 + adventurer.level,
        '+weaponless:maxPhysicalDamage': 2 + adventurer.level,
        '+weaponless:weaponRange': .5,
        // You are weaponless if you have no weapon equipped.
        '+weaponless:attackSpeed': .5,
        // You are unarmed if you have no weapon or offhand equipped.
        '+unarmed:attackSpeed': .5,
        '+weaponless:critChance': .01
    };
    adventurer.tags = recomputActorTags(adventurer);
    updateAdventurerGraphics(adventurer);
    addActions(adventurer, abilities.basicAttack);
    adventurer.abilities.forEach(function (ability) {
        addActions(adventurer, ability);
        if (ability.bonuses) addBonusSourceToObject(adventurer, ability);
    });
    if (adventurer.character) {
        updateJewelBonuses(adventurer.character);
        addBonusSourceToObject(adventurer, adventurer.character.jewelBonuses);
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
        });
        equipment.suffixes.forEach(function (affix) {
            addActions(adventurer, affix);
            addBonusSourceToObject(adventurer, affix);
        });
    });
    addBonusSourceToObject(adventurer, {'bonuses': adventurerBonuses});
    addBonusSourceToObject(adventurer, coreStatBonusSource);
    for (var bonusSource of guildBonusSources) {
        addBonusSourceToObject(adventurer, bonusSource);
    }
    recomputeDirtyStats(adventurer);
    //console.log(adventurer);
}
function updateAdventurerGraphics(adventurer) {
    var sectionWidth = personFrames * 96;
    var hat = adventurer.equipment.head;
    var hideHair = hat ? ifdefor(hat.base.hideHair, false) : false;
    adventurer.personContext.clearRect(0, 0, sectionWidth, 64);
    var skinColorYOffset = adventurer.skinColorOffset;
    var hairYOffset = adventurer.hairOffset;
    for (var frame = 0; frame < personFrames; frame++) {
        // Draw the person legs then body then hair then under garment then leg gear then body gear.
        adventurer.personContext.drawImage(images['gfx/personSprite.png'], frame * 96 + 64, skinColorYOffset * 64 , 32, 64, frame * 96 + 32, 0, 32, 64); //legs
        adventurer.personContext.drawImage(images['gfx/personSprite.png'], frame * 96, skinColorYOffset * 64 , 32, 64, frame * 96 + 32, 0, 32, 64); //body
        if (!hideHair) {
            adventurer.personContext.drawImage(images['gfx/hair.png'], frame * 96, hairYOffset * 64, 32, 64, frame * 96 + 32, 0, 32, 64); //hair
        }
        // To avoid drawing 'naked' characters, draw an undergarment (black dress?) if they
        // don't have both a pants and a shirt on.
        if ((!adventurer.equipment.body || !adventurer.equipment.body.base.source)
                || (!adventurer.equipment.legs || !adventurer.equipment.legs.base.source)) {
            adventurer.personContext.drawImage(images['gfx/equipment.png'], frame * 96, 8 * 64 , 32, 64, frame * 96 + 32, 0, 32, 64); //undergarment
        }
        // leg + body gear
        for (var subX of [64, 0]) {
            equipmentSlots.forEach(function (type) {
                var equipment = adventurer.equipment[type];
                if (!equipment || !equipment.base.source) return;
                var source = equipment.base.source;
                if (source.xOffset !== subX) return;
                adventurer.personContext.drawImage(images['gfx/equipment.png'], frame * 96 + source.xOffset, source.yOffset, 32, 64, frame * 96 + 32, 0, 32, 64);
            });
        }
        // Draw the weapon under the arm
        var weapon = adventurer.equipment.weapon;
        if (weapon && weapon.base.source) {
            var source = weapon.base.source;
            adventurer.personContext.drawImage(images['gfx/weapons.png'], frame * 96, source.yOffset, 96, 64, frame * 96, 0, 96, 64);
        }
        // Draw the person arm then arm gear
        adventurer.personContext.drawImage(images['gfx/personSprite.png'], frame * 96 + 32, skinColorYOffset * 64 , 32, 64, frame * 96 + 32, 0, 32, 64); // arm
        //arm gear
        equipmentSlots.forEach(function (type) {
            var equipment = adventurer.equipment[type];
            if (!equipment || !equipment.base.source) return;
            var source = equipment.base.source;
            if (source.xOffset !== 32) return; // don't draw this if it isn't arm gear
            adventurer.personContext.drawImage(images['gfx/equipment.png'], frame * 96 + source.xOffset, source.yOffset, 32, 64, frame * 96 + 32, 0, 32, 64);
        });
    }
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
    var name = actor.name;
    var prefixNames = [];
    var suffixNames = [];
    for (var prefix of ifdefor(actor.prefixes, [])) prefixNames.push(prefix.base.name);
    for (var suffix of ifdefor(actor.suffixes, [])) suffixNames.push(suffix.base.name);
    if (prefixNames.length) name = prefixNames.join(', ') + ' ' + name;
    if (suffixNames.length) name = name + ' of ' + suffixNames.join(' and ');
    var sections = [name + ' ' + Math.ceil(actor.health).abbreviate() + '/' + Math.ceil(actor.maxHealth).abbreviate()];
    if (actor.temporalShield > 0) {
        sections.push('Temporal Shield: ' + actor.temporalShield.format(1) + 's');
    }
    if (actor.reflectBarrier > 0) {
        sections.push('Reflect: ' + actor.reflectBarrier.format(0).abbreviate());
    }
    sections.push('');
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
    updateTrophy('level-' + adventurer.job.key, adventurer.level);
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
    // Enable the skipShrines option only once an adventurer levels the first time.
    state.skipShrinesEnabled = true;
    $('.js-shrineButton').show();
}

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
    return Math.ceil((1 - ifdefor(character.adventurer.reducedDivinityCost, 0)) * totalDivinityCost);
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
        $('.js-equipment .js-' + type + ' .js-placeholder').toggle(!equipment);
    });
    // update stats panel.
    refreshStatsPanel(character, $('.js-characterColumn .js-stats'));
    updateOffhandDisplay();
    // update controls:
    $('.js-jewelBoard .js-skillCanvas').data('character', character);
    character.jewelsCanvas = $('.js-jewelBoard .js-skillCanvas')[0];
    $('.js-jewelBonuses .js-content').empty().append(bonusSourceHelpText(character.jewelBonuses, character.adventurer));
    centerMapOnLevel(map[character.currentLevelKey]);
    updateAdventureButtons();
    updateConfirmSkillConfirmationButtons();
    updateEquipableItems();
    character.$characterCanvas.after($('.js-divinityPoints'));
    showContext(character.context);
    // Immediately show the desired camera position so the camera doesn't have to
    // catch up on showing the area (the camera isn't updated when the character isn't selected).
    if (character.area) character.area.cameraX = getTargetCameraX(character);
}

$('.js-jewelBoard').on('mouseover', function () {
    if (state.selectedCharacter.board.boardPreview) {
        var level = map[state.selectedCharacter.currentLevelKey];
        var skill = state.selectedCharacter.board.boardPreview.fixed[0].ability;
        previewPointsChange('divinity', -totalCostForNextLevel(state.selectedCharacter, level));
    }
});
$('.js-jewelBoard').on('mouseout', hidePointsPreview);