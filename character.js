
function resetCharacter(character) {
    character.health = character.maxHealth;
    character.attackCooldown = 0;
    character.target = null;
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
    $statsPanel.find('.js-block').text(character.evasion);
    $statsPanel.find('.js-speed').text(character.speed);
}
function newCharacter() {
    if (!spendItemPoints(1)) {
        return;
    }
    var hairFrame =Math.random() < .05 ? 0 : Random.range(hair[0], hair[1]);
    var shirtFrame = Math.random() < .05 ? 0 :Random.range(clothes[0], clothes[1]);
    var personCanvas = createCanvas(128, 64);
    var personContext = personCanvas.getContext("2d");
    personContext.imageSmoothingEnabled= false;
    var $newPlayerPanel = $('.js-playerPanelTemplate').clone()
        .removeClass('js-playerPanelTemplate').addClass('js-playerPanel').show();
    $('.js-newPlayer').after($newPlayerPanel);
    var canvas = $newPlayerPanel.find('.js-adventureMode .js-canvas')[0];
    var context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    var job = Random.element(jobPool);
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
            'speed': 8,
            'evasion': 1,
            'block': 1,
        },
        'bonuses': [],
        'name': Random.element(names),
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
        'attackCooldown': 0
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
}
$('.js-newPlayer').on('click', newCharacter);

function xpToLevel(level) {
    return (level + 1) * (level + 2) * 5;
}
function gainIp(amount) {
    itemPoints += amount;
    $('.js-itemPoints').text(itemPoints);
}
function spendItemPoints(amount) {
    if (amount > itemPoints) {
        return false;
    }
    itemPoints -= amount;
    $('.js-itemPoints').text(itemPoints);
    return true;
}
function updateCharacter(character) {
    // Clear the character's bonuses and graphics.
    character.bonuses = [];
    character.personContext.clearRect(0, 0, 128, 64);
    for (var i = 0; i < 4; i++) {
        character.personContext.drawImage(images['gfx/person.png'], i * 32, 0 , 32, 64, i * 32, 0, 32, 64);
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
        if (equipment.base.offset) {
            for (var i = 0; i < 4; i++) {
                character.personContext.drawImage(images['gfx/person.png'], i * 32 + equipment.base.offset * 128, 0 , 32, 64, i * 32, 0, 32, 64);
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
    ['dexterity', 'strength', 'intelligence', 'maxHealth', 'speed',
     'evasion', 'block', 'magicBlock', 'armor', 'magicResist', 'accuracy', 'range', 'attackSpeed',
     'minDamage', 'maxDamage', 'minMagicDamage', 'maxMagicDamage'].forEach(function (stat) {
        character[stat] = getStat(character, stat);
    });
    ['dexterity', 'strength', 'intelligence', 'maxHealth', 'speed',
     'evasion', 'block', 'magicBlock', 'armor', 'magicResist', 'accuracy',
     'minDamage', 'maxDamage', 'minMagicDamage', 'maxMagicDamage'].forEach(function (stat) {
        character[stat] = Math.floor(character[stat])
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
            plus += Math.floor(character.dexterity / 2);
        } else {
            plus += Math.floor(character.strength / 2);
        }
    }
    if ((stat === 'minMagicDamage' || stat === 'maxMagicDamage') && plus > 0) {
        plus += Math.floor(character.intelligence / 2);
    }
    // If a character has no implicit base attackspeed, min or max damage, we assume these values are 1.
    // This happens when the character has no equipped weapons, for instance.
    if (plus === 0) {
        if (stat === 'minDamage' || stat === 'maxDamage') {
            plus = character.level;
        } else if (stat === 'attackSpeed' || stat === 'range') {
            plus = 1;
        }
    }
    return (base + plus) * percent * multiplier;
}
function gainXp(character, amount) {
    character.xp += amount;
    while (character.xp >= character.xpToLevel) {
        character.level++;
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

addCharacterClass('Marskman', 3, 1, 1);
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

var jobPool = [characterClasses['archer'], characterClasses['blackbelt'], characterClasses['priest']];