var personFrames = 7;
var clothes = [1, 3];
var hair = [clothes[1] + 1, clothes[1] + 4];
var names = ['Chris', 'Leon', 'Hillary', 'Michelle', 'Rob', 'Reuben', 'Kingston', 'Silver'];
var walkLoop = [0, 1, 2, 3];
var fightLoop = [4, 5, 6];
var pointsTypes = ['IP', 'MP', 'RP', 'UP', 'AP'];
var allComputedStats = ['cloaking', 'dexterity', 'strength', 'intelligence', 'maxHealth', 'speed',
     'ip', 'xpValue', 'mp', 'rp', 'up',
     'evasion', 'block', 'magicBlock', 'armor', 'magicResist', 'accuracy', 'range', 'attackSpeed',
     'minDamage', 'maxDamage', 'minMagicDamage', 'maxMagicDamage',
     'critChance', 'critDamage', 'critAccuracy',
     'damageOnMiss', 'slowOnHit', 'healthRegen', 'healthGainOnHit',
     'increasedItems', 'increasedExperience'];
var allRoundedStats = ['dexterity', 'strength', 'intelligence', 'maxHealth', 'speed',
     'ip', 'xpValue', 'mp', 'rp', 'up',
     'evasion', 'block', 'magicBlock', 'armor', 'accuracy',
     'minDamage', 'maxDamage', 'minMagicDamage', 'maxMagicDamage'];

function displayInfoMode(character) {
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
    updateSkillButtons(character);
    if (character.replay) {
        startArea(character, currentLevelIndex);
    }
}
function refreshStatsPanel(character) {
    var adventurer = character.adventurer;
    var $statsPanel = character.$panel.find('.js-infoMode .js-stats');
    character.$panel.find('.js-name').text(adventurer.job.name + ' ' + adventurer.name);
    character.$panel.find('.js-level').text(adventurer.level);
    character.$panel.find('.js-infoMode .js-dexterity').text(adventurer.dexterity);
    character.$panel.find('.js-infoMode .js-strength').text(adventurer.strength);
    character.$panel.find('.js-infoMode .js-intelligence').text(adventurer.intelligence);
    $statsPanel.find('.js-toLevel').text(adventurer.xpToLevel - adventurer.xp);
    $statsPanel.find('.js-maxHealth').text(adventurer.maxHealth);
    $statsPanel.find('.js-damage').text(adventurer.minDamage + ' to ' + adventurer.maxDamage);
    $statsPanel.find('.js-magicDamage').text(adventurer.minMagicDamage + ' to ' + adventurer.maxMagicDamage);
    $statsPanel.find('.js-range').text(adventurer.range.format(2));
    $statsPanel.find('.js-attackSpeed').text(adventurer.attackSpeed.format(2));
    $statsPanel.find('.js-accuracy').text(adventurer.accuracy);
    $statsPanel.find('.js-armor').text(adventurer.armor);
    $statsPanel.find('.js-evasion').text(adventurer.evasion);
    $statsPanel.find('.js-block').text(adventurer.block);
    $statsPanel.find('.js-magicBlock').text(adventurer.magicBlock);
    $statsPanel.find('.js-speed').text(adventurer.speed);
}
function newCharacter(job) {
    var personCanvas = createCanvas(personFrames * 32, 64);
    var personContext = personCanvas.getContext("2d");
    personContext.imageSmoothingEnabled = false;
    var $newPlayerPanel = $('.js-playerPanelTemplate').clone()
        .removeClass('js-playerPanelTemplate').addClass('js-playerPanel').show();
    $('.js-playerColumn').prepend($newPlayerPanel);
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
    character.lastTime = character.time = now();
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
    character.board = readBoardFromData(job.startingBoard, character, abilities[abilityKey], true);
    centerShapesInRectangle(character.board.fixed.map(jewelToShape).concat(character.board.spaces), rectangle(0, 0, character.boardCanvas.width, character.boardCanvas.height));
    drawBoardBackground(character.boardContext, character.board);
    updateAdventurer(character.adventurer);
    ifdefor(job.loot, [simpleJewelLoot, simpleJewelLoot, simpleJewelLoot]).forEach(function (loot) {
        loot.generateLootDrop().gainLoot(character);
    });
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
        'attackCooldown': 0
    };
    equipmentSlots.forEach(function (type) {
        adventurer.equipment[type] = null;
    });
    $.each(equipment, function (key, item) {
        item.crafted = true;
        equipItem(adventurer, makeItem(item, 1));
    });
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
$('.js-newPlayer').on('click', newCharacter);

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
    if (pointsType == 'AP') updateHireButton();
    else updateCraftButton();
    $('.js-points' + pointsType).text(state[pointsType]);
}
function addBonusesAndAttacks(actor, source) {
    if (ifdefor(source.bonuses)) {
        actor.bonuses.push(source.bonuses);
    }
    if (ifdefor(source.attacks)) {
        source.attacks.forEach(function (baseAttack) {
            actor.attacks.push({'base': baseAttack});
        });
    }
}
function updateAdventurer(adventurer) {
    // Clear the character's bonuses and graphics.
    adventurer.bonuses = [];
    adventurer.attacks = [];
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
        addBonusesAndAttacks(adventurer, ability);
    });
    if (adventurer.character) {
        adventurer.character.board.jewels.forEach(function (jewel) {
            adventurer.bonuses.push(jewel.bonuses);
            adventurer.bonuses.push(jewel.adjacencyBonuses);
        });
        // Don't show the offhand slot if equipped with a two handed weapon.
        adventurer.character.$panel.find('.js-offhand').toggle(!hasTwoHandedWeapon(adventurer));
    }
    // Add the adventurer's current equipment to bonuses and graphics
    equipmentSlots.forEach(function (type) {
        var equipment = adventurer.equipment[type];
        if (!equipment) {
            return;
        }
        addBonusesAndAttacks(adventurer, equipment.base);
        equipment.prefixes.forEach(function (affix) {
            addBonusesAndAttacks(adventurer, affix);
        })
        equipment.suffixes.forEach(function (affix) {
            addBonusesAndAttacks(adventurer, affix);
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
    updateAdventurerStats(adventurer);
}
function updateAdventurerStats(adventurer) {
    adventurer.base.maxHealth = 10 * (adventurer.level + adventurer.job.dexterityBonus + adventurer.job.strengthBonus + adventurer.job.intelligenceBonus);
    adventurer.base.accuracy = 2 * adventurer.level;
    adventurer.base.evasion = adventurer.level;
    adventurer.base.block = adventurer.level;
    adventurer.base.magicBlock = adventurer.level / 2;
    adventurer.base.dexterity = adventurer.level * adventurer.job.dexterityBonus;
    adventurer.base.strength = adventurer.level * adventurer.job.strengthBonus;
    adventurer.base.intelligence = adventurer.level * adventurer.job.intelligenceBonus;
    adventurer.base.minDamage = 0;
    adventurer.base.maxDamage = 0;
    adventurer.base.range = 0;
    adventurer.base.attackSpeed = 0;
    adventurer.base.critChance = 0;
    adventurer.base.critDamage = .5;
    adventurer.base.critAccuracy = .5;
    if (!adventurer.equipment.weapon) {
        adventurer.base.minDamage = adventurer.level;
        adventurer.base.maxDamage = adventurer.level;
        adventurer.base.range = .5;
        adventurer.base.attackSpeed = 1;
        adventurer.base.critChance = .01;
    }
    allComputedStats.forEach(function (stat) {
        adventurer[stat] = getStat(adventurer, stat);
    });
    allRoundedStats.forEach(function (stat) {
        adventurer[stat] = Math.round(adventurer[stat]);
    });
    adventurer.attacks.forEach(function (attack) {
        $.each(attack.base.stats, function (stat) {
            attack[stat] = getStatForAttack(adventurer, attack.base, stat);
        })
    });
    if (ifdefor(adventurer.isMainCharacter)) {
        refreshStatsPanel(adventurer.character);
    }
}
function getStat(actor, stat) {
    var base = ifdefor(actor.base[stat], 0), plus = 0, percent = 1, multiplier = 1;
    var keys = [stat];
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
        keys.push('damage');
        percent += .002 * actor.strength;
        if (actor.range >= 5) {
            plus += Math.floor(actor.dexterity / 10);
        } else {
            plus += Math.floor(actor.strength / 10);
        }
    }
    if ((stat === 'minMagicDamage' || stat === 'maxMagicDamage')) {
        keys.push('magicDamage');
    }
    actor.bonuses.concat(ifdefor(actor.timedEffects, [])).forEach(function (bonus) {
        keys.forEach(function (key) {
            plus += evaluateValue(actor, ifdefor(bonus['+' + key], 0));
            percent += evaluateValue(actor, ifdefor(bonus['%' + key], 0));
            multiplier *= evaluateValue(actor, ifdefor(bonus['*' + key], 1));
        });
    });
    if ((stat === 'minMagicDamage' || stat === 'maxMagicDamage') && plus > 0) {
        plus += Math.floor(actor.intelligence / 10);
    }
    //console.log(stat +": " + ['(',base, '+', plus,') *', percent, '*', multiplier]);
    return (base + plus) * percent * multiplier;
}
function getStatForAttack(actor, dataObject, stat) {
    var base = evaluateValue(actor, ifdefor(dataObject.stats[stat], 0)), plus = 0, percent = 1, multiplier = 1;
    if (typeof base === 'object' && base.constructor != Array) {
        var subObject = {};
        $.each(base.stats, function (key, value) {
            subObject[key] = getStatForAttack(actor, base, key);
        });
        return subObject;
    }
    var keys = [stat];
    ifdefor(dataObject.tags, []).concat([dataObject.type]).forEach(function (prefix) {
        keys.push(prefix + ':' + stat);
    });
    actor.bonuses.forEach(function (bonus) {
        keys.forEach(function (key) {
            plus += evaluateValue(actor, ifdefor(bonus['+' + key], 0));
            percent += evaluateValue(actor, ifdefor(bonus['%' + key], 0));
            multiplier *= evaluateValue(actor, ifdefor(bonus['*' + key], 1));
        });
    });
    return (base + plus) * percent * multiplier;
}
function evaluateValue(actor, value) {
    if (typeof value === 'number') {
        return value;
    }
    if (typeof value === 'string' && value.charAt(0) === '{') {
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
    value = evaluateValue(actor, formula.shift());
    while (formula.length > 1) {
        var operator = formula.shift();
        var operand = evaluateValue(actor, formula.shift());
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
    gain('AP', adventurer.level);
    adventurer.maxHealth += 5;
    adventurer.health = adventurer.maxHealth;
    adventurer.xp = 0;
    adventurer.xpToLevel = xpToLevel(adventurer.level);
    updateAdventurerStats(adventurer);
}
function addCharacterClass(name, dexterityBonus, strengthBonus, intelligenceBonus, startingEquipment, startingBoard, loot, areaKey) {
    var key = name.replace(/\s*/g, '').toLowerCase();
    characterClasses[key] = {
        'key': key,
        'name': name,
        'dexterityBonus': dexterityBonus,
        'strengthBonus': strengthBonus,
        'intelligenceBonus': intelligenceBonus,
        'startingEquipment': ifdefor(startingEquipment, {'weapon': itemsByKey.rock}),
        'startingBoard': ifdefor(startingBoard, squareBoard),
        'loot': loot,
        'areaKey': ifdefor(areaKey, 'meadow')
    };
}

var triangleBoard = {
    'fixed': [{"k":"triangle","p":[187,106],"t":0}],
    'spaces': [{"k":"hexagon","p":[217,106],"t":0},{"k":"hexagon","p":[157,106],"t":0},{"k":"hexagon","p":[187,54.03847577293368],"t":0}]
};
var diamondBoard = {
    'fixed': [{"k":"diamond","p":[206.5,107.99038105676658],"t":-60}],
    'spaces': [{"k":"hexagon","p":[236.5,107.99038105676658],"t":0},{"k":"trapezoid","p":[236.5,107.99038105676658],"t":-120},{"k":"trapezoid","p":[206.5,107.99038105676658],"t":60},{"k":"hexagon","p":[176.5,56.02885682970026],"t":0}]
};
var diamondBoard2 = {
    'fixed': [{"k":"diamond","p":[442.51923788646684,283.9519052838329],"t":-240}],
    'spaces': [{"k":"hexagon","p":[382.51923788646684,231.99038105676658],"t":0},{"k":"hexagon","p":[442.51923788646684,283.9519052838329],"t":0},{"k":"trapezoid","p":[472.51923788646684,283.9519052838329],"t":-180},{"k":"trapezoid","p":[382.51923788646684,283.9519052838329],"t":-360}]
};
var hexBoard = {
    'fixed': [{"k":"hexagon","p":[195,80],"t":0}],
    'spaces': [{"k":"trapezoid","p":[195,131.96152422706632],"t":0},{"k":"trapezoid","p":[225,80],"t":180},
               {"k":"trapezoid","p":[240,105.98076211353316],"t":240},{"k":"trapezoid","p":[225,131.96152422706632],"t":300},
               {"k":"trapezoid","p":[195,80],"t": 120},{"k":"trapezoid","p":[180,105.98076211353316],"t":60}]
};
var squareBoard = {
    'fixed': [{"k":"square","p":[89,76],"t":0}],
    'spaces': [{"k":"hexagon","p":[89,106],"t":0},{"k":"hexagon","p":[89,24.03847577293368],"t":0},
        {"k":"hexagon","p":[144.98076211353316,61],"t":30},{"k":"hexagon","p":[63.01923788646684,61],"t":30},
        {"k":"rhombus","p":[134,50.01923788646684],"t":-30},{"k":"rhombus","p":[63.019237886466826,121],"t":-30},
        {"k":"rhombus","p":[144.98076211353316,121],"t":60},{"k":"rhombus","p":[73.99999999999999,50.01923788646685],"t":60}]
};

var characterClasses = {};
addCharacterClass('Fool', 0, 0, 0);

addCharacterClass('Archer', 2, 1, 0, {'weapon': itemsByKey.boomerang, 'body': itemsByKey.lamellar}, triangleBoard,
    [jewelLoot(['trapezoid'], [1, 1], [[10,15], [90, 100], [5, 10]], false), simpleJewelLoot, simpleJewelLoot], 'grove');
addCharacterClass('Black Belt', 0, 2, 1, {'weapon': itemsByKey.rock, 'body': itemsByKey.lamellar}, diamondBoard2,
    [jewelLoot(['trapezoid'], [1, 1], [[90, 100], [10,15], [5, 10]], false), simpleJewelLoot, simpleJewelLoot], 'meadow');
addCharacterClass('Priest', 1, 0, 2, {'weapon': itemsByKey.stick, 'body': itemsByKey.lamellar}, hexBoard,
    [jewelLoot(['trapezoid'], [1, 1], [[10,15], [5, 10], [90, 100]], false), simpleJewelLoot, simpleJewelLoot], 'cave');

addCharacterClass('Corsair', 2, 2, 1);
addCharacterClass('Paladin', 1, 2, 2);
addCharacterClass('Dancer', 2, 1, 2);

addCharacterClass('Marksman', 3, 1, 1);
addCharacterClass('Warrior', 1, 3, 1);
addCharacterClass('Wizard', 1, 1, 3);

addCharacterClass('Assassin', 3, 2, 1);
addCharacterClass('Dark Knight', 1, 3, 2);
addCharacterClass('Bard', 2, 1, 3);

addCharacterClass('Sniper', 4, 1, 2);
addCharacterClass('Samurai', 2, 4, 1);
addCharacterClass('Sorcerer', 1, 2, 4);

addCharacterClass('Ninja', 4, 4, 2);
addCharacterClass('Enhancer', 2, 4, 4);
addCharacterClass('Sage', 4, 2, 4);

addCharacterClass('Master', 4, 4, 4);

var ranks = [
    ['archer', 'blackbelt', 'priest'],
    ['corsair', 'paladin', 'dancer'],
    ['marksman', 'warrior', 'wizard'],
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
    $('.js-hire').text('Hire for ' + $jobOption.data('cost') + ' AP!');
    $('.js-hire').prop('disabled', (cost > state.AP));
}
$('.js-hire').on('click', function () {
    var $jobOption = $('.js-jobSelect').find(':selected');
    var cost = $jobOption.data('cost');
    if (!spend('AP', cost)) {
        return;
    }
    var jobKey = Random.element($jobOption.data('jobs'));
    newCharacter(characterClasses[jobKey]);
    updateRetireButtons();
});