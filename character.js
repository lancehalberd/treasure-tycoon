
var personFrames = 7;
var clothes = [1, 3];
var hair = [clothes[1] + 1, clothes[1] + 4];
var names = ['Chris', 'Leon', 'Hillary', 'Michelle', 'Rob', 'Reuben', 'Kingston', 'Silver'];
var walkLoop = [0, 1, 2, 3];
var fightLoop = [4, 5, 6];
var pointsTypes = ['IP', 'MP', 'RP', 'UP', 'AP'];
var allComputedStats = ['cloaking', 'dexterity', 'strength', 'intelligence', 'maxHealth', 'speed',
     'ip', 'xp', 'mp', 'rp', 'up',
     'evasion', 'block', 'magicBlock', 'armor', 'magicResist', 'accuracy', 'range', 'attackSpeed',
     'minDamage', 'maxDamage', 'minMagicDamage', 'maxMagicDamage',
     'critChance', 'critDamage', 'critAccuracy',
     'damageOnMiss', 'slowOnHit', 'healthRegen', 'healthGainOnHit'];
var allFlooredStats = ['dexterity', 'strength', 'intelligence', 'maxHealth', 'speed',
     'ip', 'xp', 'mp', 'rp', 'up',
     'evasion', 'block', 'magicBlock', 'armor', 'accuracy',
     'minDamage', 'maxDamage', 'minMagicDamage', 'maxMagicDamage'];
var allFixed2Stats = ['range', 'attackSpeed'];

function displayInfoMode(character) {
    character.adventurer.health = character.adventurer.maxHealth;
    character.adventurer.attackCooldown = 0;
    character.adventurer.target = null;
    character.adventurer.slow = 0;
    character.$panel.find('.js-adventureMode').hide();
    var $infoPanel = character.$panel.find('.js-infoMode');
    $infoPanel.show();
    var currentArea = character.area;
    character.area = null;
    refreshStatsPanel(character);
    character.$panel.find('.js-recall').prop('disabled', true);
    if (character.replay) {
        startArea(character, currentArea);
    }
}
function refreshStatsPanel(character) {
    var adventurer = character.adventurer;
    var $statsPanel = character.$panel.find('.js-infoMode .js-stats');
    character.$panel.find('.js-name').text(adventurer.job.name + ' ' + adventurer.name);
    character.$panel.find('.js-level').text(adventurer.level);
    $statsPanel.find('.js-dexterity').text(adventurer.dexterity);
    $statsPanel.find('.js-strength').text(adventurer.strength);
    $statsPanel.find('.js-intelligence').text(adventurer.intelligence);
    $statsPanel.find('.js-toLevel').text(adventurer.xpToLevel - adventurer.xp);
    $statsPanel.find('.js-maxHealth').text(adventurer.maxHealth);
    $statsPanel.find('.js-damage').text(adventurer.minDamage + ' to ' + adventurer.maxDamage);
    $statsPanel.find('.js-magicDamage').text(adventurer.minMagicDamage + ' to ' + adventurer.maxMagicDamage);
    $statsPanel.find('.js-range').text(adventurer.range);
    $statsPanel.find('.js-attackSpeed').text(adventurer.attackSpeed);
    $statsPanel.find('.js-accuracy').text(adventurer.accuracy);
    $statsPanel.find('.js-armor').text(adventurer.armor);
    $statsPanel.find('.js-evasion').text(adventurer.evasion);
    $statsPanel.find('.js-block').text(adventurer.block);
    $statsPanel.find('.js-speed').text(adventurer.speed);
}
function newCharacter(job) {
    var personCanvas = createCanvas(personFrames * 32, 64);
    var personContext = personCanvas.getContext("2d");
    personContext.imageSmoothingEnabled = false;
    var $newPlayerPanel = $('.js-playerPanelTemplate').clone()
        .removeClass('js-playerPanelTemplate').addClass('js-playerPanel').show();
    $('.js-playerColumn').prepend($newPlayerPanel);
    var character = {
        'adventurer': makeAdventurer(job, 1, job.startingEquipment)
    };
    character.adventurer.character = character;
    character.adventurer.direction = 1; // Character moves left to right.
    character.adventurer.isMainCharacter = true;
    character.$panel = $newPlayerPanel;
    character.canvas = $newPlayerPanel.find('.js-adventureMode .js-canvas')[0];
    character.context = character.canvas.getContext("2d");
    character.context.imageSmoothingEnabled = false;
    character.previewContext = $newPlayerPanel.find('.js-infoMode .js-canvas')[0].getContext("2d"),
    character.previewContext.imageSmoothingEnabled = false;
    character.lastTime = character.time = now();
    character.gameSpeed = 1;
    character.replay = false;
    character.levelsCompleted = {};
    character.previewContext.imageSmoothingEnabled = false;
    state.characters.push(character);
    $newPlayerPanel.data('character', character);
    $newPlayerPanel.find('.js-map').append($levelButton('forest1')).append($levelButton('cave1')).append($levelButton('field1'));
    displayInfoMode(character);
    updateAdventurer(character.adventurer);
    if (ifdefor(abilities[job.key])) {
        unlockAbility(character, job.key);
    } else {
        unlockAbility(character, 'healing');
    }
    updateRetireButtons();
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
        'bonuses': [],
        'skillPoints': 1,
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
        equipItem(adventurer, makeItem(item, 1));
    });
    return adventurer;
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
    adventurer.base.critDamage = .5;
    adventurer.base.critAccuracy = .5;
    if (!adventurer.equipment.weapon) {
        adventurer.base.minDamage = adventurer.level;
        adventurer.base.maxDamage = adventurer.level;
        adventurer.base.range = .5;
        adventurer.base.attackSpeed = 1;
        adventurer.base.critChance = .01;
    } else {
        adventurer.base.minDamage = 0;
        adventurer.base.maxDamage = 0;
    }
    allComputedStats.forEach(function (stat) {
        adventurer[stat] = getStat(adventurer, stat);
    });
    allFlooredStats.forEach(function (stat) {
        adventurer[stat] = Math.floor(adventurer[stat]);
    });
    allFixed2Stats.forEach(function (stat) {
        adventurer[stat] = adventurer[stat].toFixed(2);
    });
    adventurer.health = adventurer.maxHealth;
    adventurer.attacks.forEach(function (attack) {
        $.each(attack.base.stats, function (stat) {
            attack[stat] = getStatForAttack(adventurer, attack, stat);
        })
    });
    if (ifdefor(adventurer.isMainCharacter)) {
        refreshStatsPanel(adventurer.character);
    }
}
function getStat(actor, stat) {
    var base = ifdefor(actor.base[stat], 0), plus = 0, percent = 1, multiplier = 1;
    if (stat === 'evasion' || stat === 'attackSpeed') {
        percent += .01 * actor.dexterity;
    }
    if (stat === 'maxHealth') {
        percent += .01 * actor.strength;
    }
    if (stat === 'block' || stat === 'magicBlock' || stat === 'accuracy') {
        percent += .01 * actor.intelligence;
    }
    actor.bonuses.forEach(function (bonus) {
        plus += ifdefor(bonus['+' + stat], 0);
        percent += ifdefor(bonus['%' + stat], 0);
        multiplier *= ifdefor(bonus['*' + stat], 1);
    });
    if (stat === 'minDamage' || stat === 'maxDamage') {
        percent += .01 * actor.strength;
        if (actor.range >= 5) {
            plus += Math.floor(actor.dexterity / 4);
        } else {
            plus += Math.floor(actor.strength / 4);
        }
    }
    if ((stat === 'minMagicDamage' || stat === 'maxMagicDamage') && plus > 0) {
        plus += Math.floor(actor.intelligence / 4);
    }
    //console.log(stat +": " + ['(',base, '+', plus,') *', percent, '*', multiplier]);
    return (base + plus) * percent * multiplier;
}
function getStatForAttack(actor, attack, stat) {
    var base = ifdefor(attack.base.stats[stat], 0), plus = 0, percent = 1, multiplier = 1;
    actor.bonuses.forEach(function (bonus) {
        [stat, attack.base.type + ':' + stat].forEach(function (key) {
            plus += ifdefor(bonus['+' + key], 0);
            percent += ifdefor(bonus['%' + key], 0);
            multiplier *= ifdefor(bonus['*' + key], 1);
        });
    });
    return (base + plus) * percent * multiplier;
}
function gainXP(adventurer, amount) {
    adventurer.xp += amount;
    while (adventurer.xp >= adventurer.xpToLevel) {
        adventurer.level++;
        gain('AP', adventurer.level);
        adventurer.maxHealth += 5;
        adventurer.health = adventurer.maxHealth;
        adventurer.xp -= adventurer.xpToLevel;
        adventurer.xpToLevel = xpToLevel(adventurer.level);
        adventurer.skillPoints++;
        updateAdventurerStats(adventurer);
        updateSkillTree(adventurer.character);
    }
}
function addCharacterClass(name, dexterityBonus, strengthBonus, intelligenceBonus, startingEquipment) {
    var key = name.replace(/\s*/g, '').toLowerCase();
    characterClasses[key] = {
        'key': key,
        'name': name,
        'dexterityBonus': dexterityBonus,
        'strengthBonus': strengthBonus,
        'intelligenceBonus': intelligenceBonus,
        'startingEquipment': ifdefor(startingEquipment, {'weapon': itemsByKey.dagger})
    };
}

var characterClasses = {};
addCharacterClass('Fool', 0, 0, 0);

addCharacterClass('Archer', 2, 1, 0, {'weapon': itemsByKey.bow});
addCharacterClass('Black Belt', 0, 2, 1, {'weapon': itemsByKey.dagger});
addCharacterClass('Priest', 1, 0, 2, {'weapon': itemsByKey.wand});

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
});