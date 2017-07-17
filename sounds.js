var sounds = new Map(),
    numberOfSoundsLeftToLoad = 0,
    soundsMuted = false;

var requireSound = source => {
    var source, offset;
    [source, offset] = source.split('+');

    if (sounds.has(source)) return sounds.get(source);
    var newSound = new Audio(source);
    newSound.instances = new Set();
    newSound.offset = offset || 0;
    numberOfSoundsLeftToLoad++;
    sounds.set(source, newSound);
    newSound.oncanplaythrough = () => {
        numberOfSoundsLeftToLoad--;
    };
    return newSound;
};

var playSound = source => {
    if (soundsMuted) return;
    var source, offset;
    [source, offset] = source.split('+');
    var sound = requireSound(source);
    if (sound.instances.size >= 5) return;
    var newInstance = sound.cloneNode(false);
    newInstance.currentTime = (ifdefor(offset, sound.offset) || 0) / 1000;
    newInstance.play();
    sound.instances.add(newInstance);
    newInstance.onended = () => {
        sound.instances.delete(newInstance);
        newInstance.onended = null;
        delete newInstance;
    }
}

[
    // See credits.html for: Pack: Melee Attack by Unfa.
    'sounds/unfa/melee1.flac', 'sounds/unfa/melee2.flac', 'sounds/unfa/melee3.flac',
    // See credits.html for: Negative Magic Spell by Iwan Gabovitch.
    'sounds/fireball.flac',
    // See credits.html for: Pack: Sword Sounds by 32cheeseman32
    'sounds/cheeseman/arrow.wav', 'sounds/cheeseman/sword.wav',
    // See credits.hml for: Laser Fire by dklon
    'sounds/laser.wav',
].forEach(requireSound);

var attackSounds = {
    unarmed: 'sounds/unfa/melee1.flac',
    fist: 'sounds/unfa/melee1.flac',
    staff: 'sounds/unfa/melee1.flac',
    bow: 'sounds/cheeseman/arrow.wav',
    throwing: 'sounds/cheeseman/arrow.wav',
    axe: 'sounds/cheeseman/sword.wav',
    polearm: 'sounds/cheeseman/sword.wav',
    dagger: 'sounds/cheeseman/sword.wav',
    sword: 'sounds/cheeseman/sword.wav',
    greatsword: 'sounds/cheeseman/sword.wav',
    wand: 'sounds/laser.wav',
};

