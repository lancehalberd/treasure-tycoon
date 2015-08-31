
$('.js-newItem').on('click', function (event) {
    if (characters.length <= 0) {
        return;
    }
    if (!spendItemPoints(1)) {
        return;
    }
    var item = makeItem(Random.element(items[0]));
    $('.js-inventory').prepend(item.$item);
});

function equipItem(character, item) {
    if (character.equipment[item.base.type]) {
        console.log("Tried to equip an item without first unequiping!");
        return;
    }
    item.$item.detach();
    character.equipment[item.base.type] = item;
    updateCharacter(character);
}
function isEquiped(character, item) {
    return character.equipment[item.base.type] === item;
}
function makeItem(base) {
    var item = {
        'base': base
    };
    item.$item = $tag('div', 'js-item item', tag('div', 'icon ' + base.icon));
    item.$item.data('item', item);
    return item;
}

$('body').on('click', '.js-level1', function (event) {
    var $panel = $(this).closest('.js-playerPanel');
    var character = $panel.data('character');
    startArea(character, 'Adventure');
});

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
        $('.js-equipment .js-' + item.base.type).each(function (index, element) {
            if (collision($dragHelper, $(element))) {
                var sourceCharacter = $source.closest('.js-playerPanel').data('character');
                hit = true
                var targetCharacter = $(element).closest('.js-playerPanel').data('character');
                var current = targetCharacter.equipment[item.base.type];
                targetCharacter.equipment[item.base.type] = null;
                if (sourceCharacter) {
                    sourceCharacter.equipment[item.base.type] = null;
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
                    character.equipment[item.base.type] = null;
                    updateCharacter(character);
                }
                $source.detach();
                $target.before($source);
            }
        }
        if (!hit && collision($dragHelper, $('.js-inventory'))) {
            var character = $source.closest('.js-playerPanel').data('character');
            if (character) {
                character.equipment[item.base.type] = null;
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

var items = [
    [
        {'type': 'weapon', 'name': 'dagger', 'bonuses': {'+minDamage': 2, '+maxDamage': 5, '+range': 2, '+attackSpeed': 2}, 'icon': 'sword'},
        {'type': 'weapon', 'name': 'bow', 'bonuses': {'+minDamage': 3, '+maxDamage': 6, '+range': 10, '+attackSpeed': 1}, 'icon': 'bow'},
        {'type': 'weapon', 'name': 'axe', 'bonuses': {'+minDamage': 3, '+maxDamage': 6, '+range': 2, '+attackSpeed': 1.5}, 'icon': 'axe'},
        {'type': 'weapon', 'name': 'wand', 'bonuses': {'+minDamage': 1, '+maxDamage': 2, '+minMagicDamage': 1, '+maxMagicDamage': 2, '+range': 7, '+attackSpeed': 1.5}, 'icon': 'wand'},
        {'type': 'shield', 'name': 'small shield', 'bonuses': {'+block': 2, '+armor': 2}, 'icon': 'shield'},
        {'type': 'boots', 'name': 'swift boots', 'bonuses': {'+speed': 1}, icon: 'boots'},
        {'type': 'boots', 'name': 'steel boots', 'bonuses': {'+speed': -1, '+armor': 1}, icon: 'boots'},
        {'type': 'armor', 'name': 'green tunic', 'bonuses': {'+evasion': 2}, 'offset': 1, icon: 'armor'},
        {'type': 'armor', 'name': 'purple tunic', 'bonuses': {'+armor': 2}, 'offset': 2, icon: 'armor'},
        {'type': 'armor', 'name': 'black tunic', 'bonuses': {'+maxHealth': 10}, 'offset': 3, icon: 'armor'},
        {'type': 'hat', 'name': 'brown hair', 'bonuses': {'+evasion': 1}, 'offset': 4, icon: 'hat'},
        {'type': 'hat', 'name': 'blond hair', 'bonuses': {'+speed': 1}, 'offset': 5, icon: 'hat'},
        {'type': 'hat', 'name': 'purple hair', 'bonuses': {'+armor': 1}, 'offset': 6, icon: 'hat'},
        {'type': 'hat', 'name': 'black hair', 'bonuses': {'%maxHealth': .1}, 'offset': 7, icon: 'hat'}
    ]
];
var itemsByKey = {};
items[0].forEach(function (item) {
    var key = item.name.replace(/\s*/g, '').toLowerCase();
    itemsByKey[key] = item;
});