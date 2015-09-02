
$('.js-newItem').on('click', function (event) {
    if (characters.length <= 0) {
        return;
    }
    if (!spendItemPoints(5)) {
        return;
    }
    var item = makeItem(Random.element(items[0]));
    $('.js-inventory').prepend(item.$item);
});

function equipItem(character, item) {
    if (character.equipment[item.base.slot]) {
        console.log("Tried to equip an item without first unequiping!");
        return;
    }
    item.$item.detach();
    character.equipment[item.base.slot] = item;
    updateCharacter(character);
}
function sellValue(item) {
    return item.level * item.level * item.level;
}
function isEquiped(character, item) {
    return character.equipment[item.base.slot] === item;
}
function makeItem(base) {
    var item = {
        'base': base,
        'level': 1
    };
    item.$item = $tag('div', 'js-item item', tag('div', 'icon ' + base.icon)).attr('helpText', itemHelpText(item));
    item.$item.data('item', item);
    return item;
}
function itemHelpText(item) {
    var sections = [item.base.name, ''];
    if (ifdefor(item.base.bonuses['+minDamage']) != null) {
        sections.push('Damage: ' + item.base.bonuses['+minDamage'] + ' to ' + item.base.bonuses['+maxDamage']);
    }
    if (ifdefor(item.base.bonuses['+minMagicDamage'] != null)) {
        sections.push('Magic: ' + item.base.bonuses['+minMagicDamage'] + ' to ' + item.base.bonuses['+maxMagicDamage']);
    }
    if (ifdefor(item.base.bonuses['+range'])) {
        sections.push('Range: ' + item.base.bonuses['+range']);
    }
    if (ifdefor(item.base.bonuses['+attackSpeed'])) {
        sections.push('Attack Speed: ' + item.base.bonuses['+attackSpeed']);
    }
    if (ifdefor(item.base.bonuses['+armor'])) {
        sections.push('Armor: ' + item.base.bonuses['+armor']);
    }
    if (ifdefor(item.base.bonuses['+evasion'])) {
        sections.push('Evasion: ' + item.base.bonuses['+evasion']);
    }
    if (ifdefor(item.base.bonuses['+block'])) {
        sections.push('Block: ' + item.base.bonuses['+block']);
    }
    if (ifdefor(item.base.bonuses['+maxHealth'])) {
        sections.push('+' + item.base.bonuses['+maxHealth'] + ' health');
    }
    if (ifdefor(item.base.bonuses['%maxHealth'])) {
        sections.push('%' + (100 * item.base.bonuses['%maxHealth']) + ' increased health');
    }
    if (ifdefor(item.base.bonuses['+speed'])) {
        sections.push((item.base.bonuses['+speed'] > 0 ? '+' : '') + item.base.bonuses['+speed'] + ' speed');
    }
    sections.push('');
    sections.push('Sell for ' + sellValue(item) + ' IP');
    return sections.join('<br/>');
}

var $dragHelper = null;
var dragged = false;
$('body').on('mouseup', function (event) {
    if (dragged) {
        stopDrag();
    }
});
$('body').on('mousedown', '.js-item', function (event) {
    if ($dragHelper) {
        stopDrag();
        return;
    }
    $dragHelper = $(this).clone();
    $dragHelper.data('$source', $(this));
    $(this).css('opacity', '.3');
    $dragHelper.css('position', 'absolute');
    updateDragHelper();
    $('.js-mouseContainer').append($dragHelper);
    dragged = false;
});

function updateDragHelper() {
    if (!$dragHelper) {
        return;
    }
    $dragHelper.css('left', (mousePosition[0] - 10) + 'px');
    $dragHelper.css('top', (mousePosition[1] - 10) + 'px');
    dragged = true;
}

$(document).on("mousemove", function (event) {
    updateDragHelper();
});

function stopDrag() {
    if ($dragHelper) {
        var $source = $dragHelper.data('$source');
        var item = $source.data('item');
        var hit = false;
        if (collision($dragHelper, $('.js-sellItem'))) {
            sellItem(item);
            hit = true;
        }
        if (!hit) {
            $('.js-equipment .js-' + item.base.slot).each(function (index, element) {
                if (collision($dragHelper, $(element))) {
                    var sourceCharacter = $source.closest('.js-playerPanel').data('character');
                    hit = true
                    var targetCharacter = $(element).closest('.js-playerPanel').data('character');
                    var current = targetCharacter.equipment[item.base.slot];
                    targetCharacter.equipment[item.base.slot] = null;
                    if (sourceCharacter) {
                        sourceCharacter.equipment[item.base.slot] = null;
                        if (!current) {
                            updateCharacter(sourceCharacter);
                        }
                    } else {
                        //unequip the existing item.
                        if (current) {
                            current.$item.detach();
                            $('.js-inventory').append(current.$item);
                        }
                    }
                    var $parent = $source.parent();
                    equipItem(targetCharacter, item);
                    if (sourceCharacter && current) {
                        equipItem(sourceCharacter, current);
                    }
                }
            });
        }
        if (!hit) {
            var $target = null;
            $('.js-inventory .js-item').each(function (index, element) {
                var $element = $(element);
                if (collision($dragHelper, $element) && !$element.is($source)) {
                    $target = $element;
                }
            });
            if ($target) {
                hit = true;
                var character = $source.closest('.js-playerPanel').data('character');
                if (character) {
                    character.equipment[item.base.slot] = null;
                    updateCharacter(character);
                }
                $source.detach();
                $target.before($source);
            }
        }
        if (!hit && collision($dragHelper, $('.js-inventory'))) {
            var character = $source.closest('.js-playerPanel').data('character');
            if (character) {
                character.equipment[item.base.slot] = null;
                updateCharacter(character);
            }
            $source.detach();
            $('.js-inventory').append($source);
        }
        $source.css('opacity', '1');
        $dragHelper.remove();
        $dragHelper = null;
    }
}

function sellItem(item) {
    var sourceCharacter = item.$item.closest('.js-playerPanel').data('character');
    if (sourceCharacter) {
        sourceCharacter.equipment[item.base.slot] = null;
        updateCharacter(sourceCharacter);
    }
    item.$item.remove();
    item.$item = null;
    gainIp(sellValue(item));
}

var items = [
    [
        {'slot': 'weapon', 'type': 'sword', 'name': 'Dagger', 'bonuses': {'+minDamage': 2, '+maxDamage': 5, '+range': 2, '+attackSpeed': 2}, 'icon': 'sword'},
        {'slot': 'weapon', 'type': 'bow',  'name': 'Bow', 'bonuses': {'+minDamage': 3, '+maxDamage': 6, '+range': 10, '+attackSpeed': 1}, 'icon': 'bow'},
        {'slot': 'weapon', 'type': 'axe',  'name': 'Axe', 'bonuses': {'+minDamage': 3, '+maxDamage': 6, '+range': 2, '+attackSpeed': 1.5}, 'icon': 'axe'},
        {'slot': 'weapon', 'type': 'wand',  'name': 'Wand', 'bonuses': {'+minDamage': 0, '+maxDamage': 1, '+minMagicDamage': 1, '+maxMagicDamage': 2, '+range': 7, '+attackSpeed': 1.5}, 'icon': 'wand'},
        {'slot': 'shield', 'type': 'shield',  'name': 'Small Shield', 'bonuses': {'+block': 2, '+armor': 2}, 'icon': 'shield'},
        {'slot': 'boots', 'type': 'boots',  'name': 'Swift Boots', 'bonuses': {'+speed': 1}, icon: 'boots'},
        {'slot': 'boots', 'type': 'boots',  'name': 'Steel Boots', 'bonuses': {'+speed': -1, '+armor': 1}, icon: 'boots'},
        {'slot': 'armor', 'type': 'tunic',  'name': 'Tunic', 'bonuses': {'+evasion': 2}, 'offset': 1, icon: 'armor'},
        {'slot': 'armor', 'type': 'armor',  'name': 'Chainmail', 'bonuses': {'+armor': 2}, 'offset': 2, icon: 'armor'},
        {'slot': 'armor', 'type': 'tunic',  'name': 'Leather Vest', 'bonuses': {'+maxHealth': 10}, 'offset': 3, icon: 'armor'},
        {'slot': 'hat', 'type': 'short hair',  'name': 'Short Brown Hair', 'bonuses': {'+evasion': 1}, 'offset': 4, icon: 'hat'},
        {'slot': 'hat', 'type': 'short hair',  'name': 'Short Blond Hair', 'bonuses': {'+speed': 1}, 'offset': 5, icon: 'hat'},
        {'slot': 'hat', 'type': 'long hair',  'name': 'Long Purple Hair', 'bonuses': {'+armor': 1}, 'offset': 6, icon: 'hat'},
        {'slot': 'hat', 'type': 'long hair',  'name': 'Long Black Hair', 'bonuses': {'%maxHealth': .1}, 'offset': 7, icon: 'hat'}
    ]
];
var itemsByKey = {};
items[0].forEach(function (item) {
    var key = item.name.replace(/\s*/g, '').toLowerCase();
    itemsByKey[key] = item;
});


$(document).on('keydown', function(event) {
    if (event.which == 83) { // 's'
        if ($popupTarget.closest('.js-inventory').length > 0) {
            var item = $popupTarget.data('item');
            sellItem(item);
        }
    }
    console.log(event.which);
});