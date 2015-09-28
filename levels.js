
var levels = {};

function addLevel(levelData, level) {
    var key = levelData.name.replace(/\s*/g, '').toLowerCase() + level;
    var waves = [];
    var numberOfWaves = Math.floor(5 * Math.sqrt(level));
    // Make sure we have at least enough waves for the required events
    numberOfWaves = Math.max(levelData.events.length, numberOfWaves);
    var minWaveSize = Math.floor(Math.min(4, Math.sqrt(level)) * 10);
    var maxWaveSize = Math.floor(Math.min(10, 2.2 * Math.sqrt(level)) * 10);
    var eventsLeft = levelData.events.slice();
    while (waves.length < numberOfWaves) {
        var waveSize = Math.max(1, Math.floor(Random.range(minWaveSize, maxWaveSize) / 10));
        var wave = [];
        // The probability of including an event is the number of events over the number
        // of open waves left (ex)
        var wavesLeft = numberOfWaves - waves.length;
        // This will be 100% chance to include event wave once # events = # waves left
        if (Math.random() < eventsLeft.length / wavesLeft) {
            wave = eventsLeft.shift();
        }
        waves.push(wave);
        while (wave.length < waveSize) {
            wave.push(Random.element(levelData.monsters));
        }
    };
    levels[key] = {
        'key': key,
        'base': levelData,
        'level': level,
        'name': levelData.name + ' ' + level,
        'monsters': waves,
        'backgroundImage': levelData.backgroundImage
    };
}
function $levelButton(key) {
    return $tag('button', 'js-adventure adventure', levels[key].name).data('levelIndex', key);
}
function $nextLevelButton(currentLevel) {
    var levelData = currentLevel.base;
    var key = levelData.name.replace(/\s*/g, '').toLowerCase() + (currentLevel.level + 1);
    if (!levels[key]) {
        addLevel(levelData, currentLevel.level + 1);
    }
    return $levelButton(key);
}
function initializeLevels() {
    // monsters are random monsters that can be added to any waves or present in random waves.
    // events are predefined sets of monsters that will appear in order throughout the level.
    addLevel({'name': 'Forest', 'backgroundImage': images['gfx/forest.png'], 'monsters': [monsters['caterpillar'], monsters['gnome']],
             'events': [[monsters['gnome'], monsters['gnome']], [monsters['caterpillar'], monsters['caterpillar']], [monsters['butterfly']]]}, 1);
    addLevel({'name': 'Cave', 'backgroundImage': images['gfx/cave.png'], 'monsters': [monsters['gnome'], monsters['skeleton']],
             'events': [[monsters['skeleton'], monsters['skeleton']], [monsters['gnome'], monsters['gnome']], [monsters['giantSkeleton']]]}, 1);
    addLevel({'name': 'Field', 'backgroundImage': images['gfx/grass.png'],  'monsters': [monsters['caterpillar'], monsters['skeleton']],
             'events': [[monsters['caterpillar'], monsters['caterpillar']],
                        [monsters['skeleton'], monsters['skeleton']],
                        [monsters['dragon']]]}, 1);
}