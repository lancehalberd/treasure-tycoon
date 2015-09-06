
var personFrames = 7;
var clothes = [1, 3];
var hair = [clothes[1] + 1, clothes[1] + 4];
var names = ['Chris', 'Leon', 'Hillary', 'Michelle', 'Rob', 'Reuben', 'Kingston', 'Silver'];
var walkLoop = [0, 1, 2, 3];
var fightLoop = [4, 5, 6];

function resetCharacter(character) {
    character.health = character.maxHealth;
    character.attackCooldown = 0;
    character.target = null;
    character.slow = 0;
    character.$panel.find('.js-adventureMode').hide();
    var $infoPanel = character.$panel.find('.js-infoMode');
    $infoPanel.show();
    character.area = null;
    refreshStatsPanel(character);
}
function refreshStatsPanel(character) {
    var $statsPanel = character.$panel.find('.js-infoMode .js-stats');
    $statsPanel.find('.js-name').text(character.job.name + ' ' + character.name);
    $statsPanel.find('.js-level').text(character.level);
    $statsPanel.find('.js-dexterity').text(character.dexterity);
    $statsPanel.find('.js-strength').text(character.strength);
    $statsPanel.find('.js-intelligence').text(character.intelligence);
    $statsPanel.find('.js-toLevel').text(character.xpToLevel - character.xp);
    $statsPanel.find('.js-maxHealth').text(character.maxHealth);
    $statsPanel.find('.js-damage').text(character.minDamage + ' to ' + character.maxDamage);
    $statsPanel.find('.js-magicDamage').text(character.minMagicDamage + ' to ' + character.maxMagicDamage);
    $statsPanel.find('.js-range').text(character.range);
    $statsPanel.find('.js-attackSpeed').text(character.attackSpeed);
    $statsPanel.find('.js-accuracy').text(character.accuracy);
    $statsPanel.find('.js-armor').text(character.armor);
    $statsPanel.find('.js-evasion').text(character.evasion);
    $statsPanel.find('.js-block').text(character.block);
    $statsPanel.find('.js-speed').text(character.speed);
}
function newCharacter(job) {
    var hairFrame = Math.random() < .05 ? 0 : Random.range(hair[0], hair[1]);
    var shirtFrame = Math.random() < .05 ? 0 : Random.range(clothes[0], clothes[1]);
    var personCanvas = createCanvas(personFrames * 32, 64);
    var personContext = personCanvas.getContext("2d");
    personContext.imageSmoothingEnabled= false;
    var $newPlayerPanel = $('.js-playerPanelTemplate').clone()
        .removeClass('js-playerPanelTemplate').addClass('js-playerPanel').show();
    $('.js-playerColumn').prepend($newPlayerPanel);
    var canvas = $newPlayerPanel.find('.js-adventureMode .js-canvas')[0];
    var context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    var character = {
        'x': 0,
        'equipment': {
            'boots': null,
            'armor': null,
            'hat': null,
            'weapon': null,
            'shield': null
        },
        'job': job,
        'base': {
            'maxHealth': 20,
            'armor': 0,
            'speed': 250,
            'evasion': 1,
            'block': 1,
        },
        'bonuses': [],
        'name': Random.element(names),
        'hairOffset': Random.range(hair[0], hair[1]),
        'level': 1,
        'xp': 0,
        'xpToLevel': xpToLevel(0),
        'enemies': [],
        'personCanvas': personCanvas,
        'personContext': personContext,
        '$panel': $newPlayerPanel,
        'context': context,
        'canvasWidth': canvas.width,
        'canvasHeight': canvas.height,
        'area': null,
        'attackCooldown': 0,
        'lastTime': now()
    };
    $.each(job.startingEquipment, function (key, item) {
        equipItem(character, makeItem(item));
    });
    updateCharacter(character);
    var canvas = $newPlayerPanel.find('.js-infoMode .js-canvas')[0];
    var context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    characters.push(character);
    $newPlayerPanel.data('character', character);
    resetCharacter(character);
    updateRetireButtons();
}
$('.js-newPlayer').on('click', newCharacter);

function xpToLevel(level) {
    return (level + 1) * (level + 2) * 5;
}
function gainIP(amount) {
    itemPoints += amount;
    $('.js-itemPoints').text(itemPoints);
}
function spendIP(amount) {
    if (amount > itemPoints) {
        return false;
    }
    itemPoints -= amount;
    $('.js-itemPoints').text(itemPoints);
    return true;
}
function gainMP(amount) {
    magicPoints += amount;
    $('.js-magicPoints').text(magicPoints);
}
function spendMP(amount) {
    if (amount > magicPoints) {
        return false;
    }
    magicPoints -= amount;
    $('.js-magicPoints').text(magicPoints);
    return true;
}
function gainRP(amount) {
    rarePoints += amount;
    $('.js-rarePoints').text(rarePoints);
}
function spendRP(amount) {
    if (amount > rarePoints) {
        return false;
    }
    rarePoints -= amount;
    $('.js-rarePoints').text(rarePoints);
    return true;
}
function gainUP(amount) {
    uniquePoints += amount;
    $('.js-uniquePoints').text(uniquePoints);
}
function spendUP(amount) {
    if (amount > uniquePoints) {
        return false;
    }
    uniquePoints -= amount;
    $('.js-uniquePoints').text(uniquePoints);
    return true;
}
function gainAP(amount) {
    adventurePoints += amount;
    updateHireButton();
    $('.js-adventurePoints').text(adventurePoints);
}
function spendAP(amount) {
    if (amount > adventurePoints) {
        return false;
    }
    adventurePoints -= amount;
    updateHireButton();
    $('.js-adventurePoints').text(adventurePoints);
    return true;
}
function updateCharacter(character) {
    // Clear the character's bonuses and graphics.
    character.bonuses = [];
    var sectionWidth = personFrames * 32;
    var hat = character.equipment.hat;
    var hideHair = hat ? ifdefor(hat.base.hideHair, false) : false;
    character.personContext.clearRect(0, 0, sectionWidth, 64);
    for (var i = 0; i < personFrames; i++) {
        character.personContext.drawImage(images['gfx/person.png'], i * 32, 0 , 32, 64, i * 32, 0, 32, 64);
        if (!hideHair) {
            character.personContext.drawImage(images['gfx/person.png'], i * 32 + character.hairOffset * sectionWidth, 0 , 32, 64, i * 32, 0, 32, 64);
        }
    }
    // Add the character's current equipment to bonuses and graphics
    ['boots', 'armor', 'hat', 'weapon', 'shield'].forEach(function (type) {
        var equipment = character.equipment[type];
        var $equipmentPanel = character.$panel.find('.js-infoMode .js-equipment');
        var $equipmentSlot = $equipmentPanel.find('.js-' + type);
        if (!equipment) {
            return;
        }
        if (equipment.base.bonuses) {
            character.bonuses.push(equipment.base.bonuses);
        }
        equipment.prefixes.forEach(function (affix) {
            character.bonuses.push(affix.bonuses);
        })
        equipment.suffixes.forEach(function (affix) {
            character.bonuses.push(affix.bonuses);
        })
        if (equipment.base.offset) {
            for (var i = 0; i < personFrames; i++) {
                character.personContext.drawImage(images['gfx/person.png'], i * 32 + equipment.base.offset * sectionWidth, 0 , 32, 64, i * 32, 0, 32, 64);
            }
        }
        $equipmentSlot.append(equipment.$item);
    });
    updateStats(character);
}
function updateStats(character) {
    character.base.maxHealth = 10 * (character.level + character.job.dexterityBonus + character.job.strengthBonus + character.job.intelligenceBonus);
    character.base.accuracy = 2 * character.level;
    character.base.evasion = character.level;
    character.base.block = character.level;
    character.base.evasion = character.level;
    character.base.dexterity = character.level * character.job.dexterityBonus;
    character.base.strength = character.level * character.job.strengthBonus;
    character.base.intelligence = character.level * character.job.intelligenceBonus;
    if (!character.equipment.weapon) {
        character.base.minDamage = character.level;
        character.base.maxDamage = character.level;
    } else {
        character.base.minDamage = 0;
        character.base.maxDamage = 0;
    }
    ['dexterity', 'strength', 'intelligence', 'maxHealth', 'speed',
     'evasion', 'block', 'magicBlock', 'armor', 'magicResist', 'accuracy', 'range', 'attackSpeed',
     'minDamage', 'maxDamage', 'minMagicDamage', 'maxMagicDamage',
     'damageOnMiss', 'slowOnHit', 'healthRegen', 'healthGainOnHit'].forEach(function (stat) {
        character[stat] = getStat(character, stat);
    });
    ['dexterity', 'strength', 'intelligence', 'maxHealth', 'speed',
     'evasion', 'block', 'magicBlock', 'armor', 'magicResist', 'accuracy',
     'minDamage', 'maxDamage', 'minMagicDamage', 'maxMagicDamage'].forEach(function (stat) {
        character[stat] = Math.floor(character[stat]);
    });
    ['range', 'attackSpeed'].forEach(function (stat) {
        character[stat] = character[stat].toFixed(2);
    });
    character.health = character.maxHealth;
    refreshStatsPanel(character);
}
function getStat(character, stat) {
    var base = ifdefor(character.base[stat], 0);
    var plus = 0;
    var percent = 1;
    var multiplier = 1;
    if (stat === 'evasion' || stat === 'attackSpeed') {
        percent += .01 * character.dexterity;
    }
    if (stat === 'maxHealth') {
        percent += .01 * character.strength;
    }
    if (stat === 'block' || stat === 'magicBlock' || stat === 'accuracy') {
        percent += .01 * character.intelligence;
    }
    character.bonuses.forEach(function (bonus) {
        plus += ifdefor(bonus['+' + stat], 0);
        percent += ifdefor(bonus['%' + stat], 0);
        multiplier *= ifdefor(bonus['*' + stat], 1);
    });
    if (stat === 'minDamage' || stat === 'maxDamage') {
        percent += .01 * character.strength;
        if (character.range >= 5) {
            plus += Math.floor(character.dexterity / 4);
        } else {
            plus += Math.floor(character.strength / 4);
        }
    }
    if ((stat === 'minMagicDamage' || stat === 'maxMagicDamage') && plus > 0) {
        plus += Math.floor(character.intelligence / 4);
    }
    // If a character has no implicit base attackspeed, min or max damage, we assume these values are 1.
    // This happens when the character has no equipped weapons, for instance.
    if (plus === 0 && (stat === 'attackSpeed' || stat === 'range')) {
        plus = 1;
    }
    return (base + plus) * percent * multiplier;
}
function gainXP(character, amount) {
    character.xp += amount;
    while (character.xp >= character.xpToLevel) {
        character.level++;
        gainAP(character.level);
        character.maxHealth += 5;
        character.health = character.maxHealth;
        character.xp -= character.xpToLevel;
        character.xpToLevel = xpToLevel(character.level);
        updateStats(character);
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
    $('.js-hire').prop('disabled', (cost > adventurePoints));
}
$('.js-hire').on('click', function () {
    var $jobOption = $('.js-jobSelect').find(':selected');
    var cost = $jobOption.data('cost');
    if (!spendAP(cost)) {
        return;
    }
    var jobKey = Random.element($jobOption.data('jobs'));
    newCharacter(characterClasses[jobKey]);
});