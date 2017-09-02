var sounds = new Map(),
    numberOfSoundsLeftToLoad = 0,
    soundsMuted = false;

var requireSound = source => {
    var source, offset, volume, customDuration;
    [source, offset, volume] = source.split('+');
    if (offset) [offset, customDuration] = offset.split(':');

    if (sounds.has(source)) return sounds.get(source);
    var newSound = new Audio(source);
    newSound.instances = new Set();
    newSound.offset = offset || 0;
    newSound.customDuration = customDuration || 0;
    newSound.defaultVolume = volume || 1;
    sounds.set(source, newSound);
    /*numberOfSoundsLeftToLoad++;
    console.log('loading: ' + source);
    newSound.oncanplaythrough = () => {
        numberOfSoundsLeftToLoad--;
        console.log('loaded: ' + source);
    };*/
    return newSound;
};

var playSound = (source, area) => {
    if (soundsMuted || state.selectedCharacter.hero.area !== area ) return;
    var source, offset,volume, customDuration;
    [source, offset, volume] = source.split('+');
    if (offset) [offset, customDuration] = offset.split(':');
    var sound = requireSound(source);
    if (sound.instances.size >= 5) return;
    var newInstance = sound.cloneNode(false);
    newInstance.currentTime = (ifdefor(offset, sound.offset) || 0) / 1000;
    newInstance.volume = Math.min(1, (ifdefor(volume, sound.defaultVolume) || 1) / 50);
    newInstance.play().then(() => {
        var timeoutId;
        if (customDuration || sound.customDuration) {
            stimeoutId = setTimeout(() => {
                sound.instances.delete(newInstance);
                newInstance.onended = null;
                newInstance.pause();
                delete newInstance;
            }, parseInt(customDuration || sound.customDuration));
        }
        sound.instances.add(newInstance);
        newInstance.onended = () => {
            sound.instances.delete(newInstance);
            newInstance.onended = null;
            delete newInstance;
            clearTimeout(timeoutId);
        }
    });
};

var previousTrack = null;
var playTrack = source => {
    return;
    if (soundsMuted) return;
    var source, offset, volume;
    [source, offset, volume] = source.split('+');
    if (previousTrack) {
        previousTrack.stop();
    }
    var sound = requireSound(source);
    sound.currentTime = (ifdefor(offset, sound.offset) || 0) / 1000;
    sound.volume = Math.min(1, (ifdefor(volume, sound.defaultVolume) || 1) / 50);
    sound.play();
    previousTrack = sound;
};

[
    // Original sounds using bfxr
    'sounds/bfxr/strum.wav+0+10', 'sounds/bfxr/freeze.wav+0+10',
    // See credits.html for: Pack: Melee Attack by Unfa.
    'sounds/unfa/melee1.flac+200+10', 'sounds/unfa/melee2.flac', 'sounds/unfa/melee3.flac',
    // See credits.html for: Negative Magic Spell by Iwan Gabovitch.
    'sounds/fireball.flac',
    // See credits.html for: Pack: Sword Sounds by 32cheeseman32.
    'sounds/cheeseman/arrow.wav+0+50', 'sounds/cheeseman/sword.wav', 'sounds/cheeseman/arrowHit.wav+300:100',
    // See credits.html for: Laser Fire by dklon.
    'sounds/laser.wav',
    // See credits.html for: mobbrobb.
    'music/mobbrobb/map.mp3+0+.5',
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

var attackHitSounds = {
    bow: 'sounds/cheeseman/arrowHit.wav',
    throwing: 'sounds/cheeseman/arrowHit.wav',
}

var soundTrack = {
    map: 'music/mobbrobb/map.mp3',
}

