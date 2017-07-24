function genericAction(type, action, bonuses, helpText) {
    action.type = type;
    action.variableObjectType = 'action';
    action.icon = ifdefor(action.icon, 'gfx/496RpgIcons/openScroll.png');
    action.bonuses = bonuses;
    action.helpText = helpText;
    action.tags = ifdefor(action.tags, []);
    action.tags.unshift(type);
    return action;
}

function movementAction(type, action, bonuses, helpText) {
    action.type = type;
    action.variableObjectType = 'action';
    action.bonuses = bonuses;
    action.icon = ifdefor(action.icon, 'gfx/496RpgIcons/openScroll.png');
    action.helpText = helpText;
    action.tags = ifdefor(action.tags, []);
    action.tags.unshift('movement');
    action.tags.unshift(type);
    return action;
}

function attackAction(type, action, bonuses, helpText) {
    action.type = type;
    action.variableObjectType = 'action';
    // Range of an attack action is the weaponRange unless otherwise specified.
    if (typeof(bonuses['+range']) === 'undefined') {
        bonuses['+range'] = ['{weaponRange}'];
    }
    action.icon = ifdefor(action.icon, 'gfx/496RpgIcons/openScroll.png');
    action.bonuses = bonuses;
    action.helpText = helpText;
    action.tags = ifdefor(action.tags, []);
    action.tags.unshift('attack');
    action.tags.unshift(type);
    return action;
}

function spellAction(type, action, bonuses, helpText) {
    action.type = type;
    action.variableObjectType = 'action';
    if (typeof(bonuses['+power']) === 'undefined') {
        bonuses['+power'] = ['{magicPower}'];
    }
    if (typeof(bonuses['+prepTime']) === 'undefined') {
        bonuses['+prepTime'] = .3;
    }
    if (typeof(bonuses['+recoveryTime']) === 'undefined') {
        bonuses['+recoveryTime'] = .5;
    }
    action.icon = ifdefor(action.icon, sageIcon);
    action.bonuses = bonuses;
    action.helpText = helpText;
    action.tags = ifdefor(action.tags, []);
    action.tags.unshift('spell');
    action.tags.unshift(type);
    return action;
}

function buffEffect(effect, bonuses) {
    effect.variableObjectType = 'effect';
    effect.tags = ifdefor(effect.tags, []);
    effect.tags.unshift('buff');
    effect.bonuses = bonuses;
    return effect;
}
function debuffEffect(effect, bonuses) {
    effect.variableObjectType = 'effect';
    effect.tags = ifdefor(effect.tags, []);
    effect.tags.unshift('debuff');
    effect.bonuses = bonuses;
    return effect;
}

var effectSourceUp = ['gfx/militaryIcons.png', 17, 23, 16, 16, 0, 0];
var effectSourceArmor = ['gfx/militaryIcons.png', 65, 180, 12, 12, 8, 8];
//var effectSourceSword = ['gfx/militaryIcons.png', 52, 180, 12, 12, 8, 8];
var effectSourceSword = ['gfx/militaryIcons.png', 85, 74, 16, 16, 6, 4];
var effectSourcePoison = ['gfx/militaryIcons.png', 51, 74, 16, 16, 0, 0];
var effectAccuracy = ['gfx/militaryIcons.png', 65, 194, 12, 12, 8, 8];
var skills = {
    // Movement actions
    'dodge': movementAction('dodge', {'icon': dancerIcon}, {'+cooldown': 10, '+distance': -128, '$buff': buffEffect({}, {'+%evasion': .5, '+duration': 5})},
                            'Leap back to dodge an attack and gain: {$buff}'),
    'sideStep': movementAction('sideStep', {'icon': samuraiIcon, 'rangedOnly': true}, {'+cooldown': 10, '+moveDuration': .05, '+distance': 64,
                                        '$buff': buffEffect({}, {'++critChance': .2, '+duration': 2})},
                            'Side step a ranged attack and advance toward enemis gaining: {$buff}'),

    // Attack actions
    'basicAttack': attackAction('attack', {'tags': ['basic']}, {}, 'A basic attack'),
    'healingAttack': attackAction('attack', {'animation': 'wandHealing', 'restrictions': ['wand'], 'target': 'otherAllies'}, {'$heals': true}, 'Basic attacks heal allies instead of damage enemies.'),
    'bullseye': attackAction('attack', {'icon': jugglerIcon, showName: true}, {'*damage': 2, '+cooldown': 15, '$alwaysHits': 'Never misses', '$undodgeable': 'Cannot be dodged'}),
    'counterAttack': attackAction('counterAttack', {'icon': blackbeltIcon, showName: true}, {'*damage': 1.5, '+chance': .1},
                            'Perform a powerful counter attack.<br/>The chance to counter is lower the further away the attacker is.'),
    'dragonPunch': attackAction('attack', {'icon': blackbeltIcon, 'restrictions': ['fist'], showName: true},
                              {'*damage': 3, '+cooldown': 30, '$alwaysHits': 'Never misses', '$undodgeable': 'Cannot be dodged',
                                        '+distance': 256, '$domino': 'Knocks target away possibly damaging other enemies.'}),
    'hook':  attackAction('attack', {'icon': corsairIcon, showName: true}, {'+cooldown': 10, '+range': 10, '+dragDamage': 0, '+dragStun': 0, '+knockbackRotation': -60, '+rangeDamage': 0, '$alwaysHits': 'Never misses', '$pullsTarget': 'Pulls target'},
                            'Throw a hook to damage and pull enemies closer.'),
    'banishingStrike': attackAction('banish', {'icon': paladinIcon, 'restrictions': ['melee'], showName: true}, {'+cooldown': 30, '*damage': 2, '+distance': [6, '+', ['{strength}' , '/', 20]],
                '$alwaysHits': 'Never misses', '+purify': 0, '+shockwave': 0, '+knockbackRotation': 30,
                '$debuff': debuffEffect({}, {'+*weaponDamage': .5, '+duration': ['{intelligence}', '/', 20]}),
                '$otherDebuff': debuffEffect({}, {'+*speed': .1, '+duration': ['{intelligence}', '/', 20]})},
                'Perform a mighty strike that inflicts the enemy with: {$debuff} And knocks all other enemies away, slowing them.'),
    'evadeAndCounter': attackAction('evadeAndCounter', {'icon': dancerIcon, 'restrictions': ['melee']}, {'$alwaysHits': 'Never misses'}, 'Counter whenever you successfully evade an attack.'),
    'charge': attackAction('charge', {'icon': warriorIcon, 'tags': ['movement']}, {'+range': 15, '*damage': 2, '+cooldown': 10, '+speedBonus': 3, '+stun': .5,
                                            '+rangeDamage': 0, '$alwaysHits': 'Never misses'},
                                        'Charge at enemies, damaging and stunning them briefly on impact.'),
    'armorBreak': attackAction('attack', {'icon': warriorIcon, 'restrictions': ['melee'], showName: true}, {'*damage': 3, '+cooldown': 30, '+stun': .5, '$alwaysHits': 'Never misses',
                                            '$debuff': debuffEffect({}, {'+-armor': ['{strength}', '/', 2], '+-block': ['{strength}', '/', 2]})},
                                            'Deliver a might blow that destroys the targets armor causing: {$debuff}'),
    'blinkStrike': attackAction('attack', {'icon': assassinIcon, 'restrictions': ['melee'], 'tags': ['movement']}, {'*damage': 1.5, '+cooldown': 6, '$alwaysHits': 'Never misses', '+teleport': 6},
                                'Instantly teleport to and attack a nearby enemy.'),
    'soulStrike': attackAction('attack', {'icon': darkknightIcon, 'restrictions': ['melee'], showName: true}, {'+range': 2, '*damage': 2, '+cooldown': 15,
                               '$alwaysHits': 'Never misses', '+healthSacrifice': .2, '+cleave': 1},
                    'Sacrifice a portion of your current health to deal a cleaving attack that hits all enemies in an extended range.'),
    'powerShot': attackAction('attack', {'icon': 'gfx/496RpgIcons/abilityPowerShot.png', 'restrictions': ['ranged'], 'afterImages': 4}, {'+range': ['{weaponRange}', '+', 5], '+critChance': 1, '*damage': 1.5,
                                        '+cooldown': 10, '$alwaysHits': 'Never misses'},
                                'Perform a powerful long ranged attack that always strikes critically.'),
    'snipe': attackAction('attack', {'icon': sniperIcon, 'restrictions': ['ranged'], showName: true}, {'+range': ['{weaponRange}', '+', 10], '*damage': 2, '+cooldown': 30,
                            '$ignoreArmor': 'Ignore armor and block', '$ignoreResistance': 'Ignore magic resistance and magic block',
                            '$alwaysHits': 'Never misses'},
                            'Precisely target an enemies weak spot from any distance ignoring all armor and resistances.'),
    'dragonSlayer': attackAction('attack', {'icon': samuraiIcon, 'restrictions': ['melee'], showName: true},
                        {'+critDamage': .5, '*critChance': 2, '*damage': 3, '+cooldown': 20, '$alwaysHits': 'Never misses'},
                        'Strike with unparalleled ferocity.'),
    'throwWeapon': attackAction('attack', {'icon': 'gfx/496RpgIcons/abilityThrowWeapon.png', 'restrictions': ['melee'], 'tags': ['ranged'], showName: true},
                        {'+range': 12, '*damage': 1.5, '+cooldown': 10, '$alwaysHits': 'Never misses'},
                        'Throw a shadow clone of your weapon at a distant enemy.'),
    // Generic actions:
    'deflect': genericAction('deflect', {'icon': corsairIcon, showName: true}, {'+damageRatio': [.5, '+', ['{strength}', '/', 100]], '+cooldown': ['20', '*', [100, '/', [100, '+', '{dexterity}']]], '+chance': 1},
                             'Deflect ranged attacks back at enemies.'),
    'plunder': genericAction('plunder', {'icon': corsairIcon, showName: true}, {'+range': 2, '+count': 1, '+duration': ['{strength}', '/', 10], '+cooldown': ['40', '*', [100, '/', [100, '+', '{dexterity}']]]},
                             'Steal an enemies enchantment for yourself.'),
    'distract': genericAction('dodge', {'icon': dancerIcon, showName: true}, {'$globalDebuff': debuffEffect({}, {'+*accuracy': .5, '+duration': 2}), '+cooldown': 10},
                              'Dodge an attack with a distracting flourish that inflicts: {$globalDebuff} on all enemies.'),
    'charm': genericAction('charm', {'icon': 'gfx/496RpgIcons/abilityCharm.png', 'tags': ['minion']}, {'+range': 1, '+cooldown': ['240', '*', [100, '/', [100, '+', '{intelligence}']]]},
                           'Steal an enemies heart, turning them into an ally.'),
    'pet': genericAction('minion', {'icon': rangerIcon, 'target': 'none', 'tags': ['minion'], 'monsterKey': 'wolf'}, {'+limit': 1, '+cooldown': 30},
                         'Call a wolf to fight with you.'),
    'summonCaterpillar': genericAction('minion', {'target': 'none', 'tags': ['minion'], 'monsterKey': 'caterpillar'}, {'+limit': 3, '+cooldown': 20},
                         'Call a caterpillar to fight with you.'),
    'summonSkeleton': genericAction('minion', {'target': 'none', 'tags': ['minion'], 'monsterKey': 'skeleton'}, {'+limit': 2, '+cooldown': 15},
                         'Summon skeletons to fight for you.'),
    'howl': genericAction('minion', {'target': 'none', 'tags': ['minion'], 'monsterKey': 'wolf', showName: true}, {'+limit': 4, '+cooldown': 10},
                         'Summon a pack member to fight with you.'),
    'net': genericAction('effect', {'icon': sniperIcon, showName: true}, {'+cooldown': 10, '+range': 10, '$debuff': debuffEffect({}, {'+*speed': 0, '+duration': 3})},
                         'Throw a net to ensnare a distant enemy.'),
    'sicem': genericAction('effect', {'icon': rangerIcon, showName: true}, {'+cooldown': [60, '*', [100, '/', [100, '+', '{dexterity}']]],
                            '+range': 10, '$allyBuff': buffEffect({}, {'+*speed': 2, '+*attackSpeed': 2, '+*weaponDamage': 2, '+duration': 2})},
                            'Incite your allies to fiercely attack the enemy granting them: {$allyBuff}'),
    'consume': genericAction('consume', {'icon': 'gfx/496RpgIcons/abilityConsume.png', 'target': 'all', 'targetDeadUnits': true, 'consumeCorpse': true, showName: true},
                             {'+consumeRatio': .2, '+range': 5, '+count': 0, '+duration': 0},
                             'Consume the spirits of nearby fallen enemies and allies to regenerate your health.'),
    'aiming': genericAction('effect', {'icon': 'gfx/496RpgIcons/target.png', 'target': 'self', 'restrictions': ['ranged'], showName: true}, {'+cooldown': 30, '$buff': buffEffect({},
                            {'++range': 2, '+*attackSpeed': .5, '+*weaponDamage': 1.5, '+*accuracy': 1.5, '++critChance': .2, '++critDamage': .3, '+duration': 10})},
                            'Enter a state of heightened perception greatly increasing your sharpshooting abilities while reducing your attack speed. Grants: {$buff}'),
    'smokeBomb': genericAction('criticalCounter', {'icon': ninjaIcon, showName: true}, {'$dodgeAttack': true, '+cooldown': 100, '$globalDebuff': debuffEffect({},
                                    {'+*accuracy': 0, '+duration': 5})},
                'If an attack would deal more than half of your remaining life, dodge it and throw a smoke bomb causing: {$globalDebuff} to all enemies.'),
    'shadowClone': genericAction('clone', {'icon': 'gfx/496RpgIcons/abilityShadowClone.png', 'tags': ['minion']}, {'+limit': 10, '+chance': .1},
                        'Chance to summon a weak clone of yourself on taking damage'),
    'enhanceWeapon': genericAction('effect', {'icon': 'gfx/496RpgIcons/auraAttack.png', 'tags': ['spell'], 'target': 'self', showName: true}, {'+cooldown': 30, '$buff': buffEffect({'icons': [effectSourceUp, effectSourceSword]}, {
                            '++weaponPhysicalDamage': ['{strength}', '/', 10], '++weaponMagicDamage': ['{intelligence}', '/', 10],
                            '++critDamage': ['{dexterity}', '/', 500], '+duration': 10})},
                    'Enhance the strength of your weapon granting: {$buff}'),
    'enhanceArmor': genericAction('effect', {'icon': 'gfx/496RpgIcons/auraDefense.png', 'tags': ['spell'], 'target': 'self', showName: true}, {'+cooldown': 30, '$buff': buffEffect({'icons': [effectSourceUp, effectSourceArmor]}, {
                            '++armor': ['{strength}', '/', 10], '++magicBlock': ['{intelligence}', '/', 20],
                            '++block': ['{intelligence}', '/', 10], '++evasion': ['{dexterity}', '/', 10], '+duration': 15})},
                    'Enhance the strength of your armor granting: {$buff}'),
    'enhanceAbility': genericAction('effect', {'icon': enhancerIcon, 'tags': ['spell'], 'target': 'self', showName: true}, {'+cooldown': 20, '$buff': buffEffect({}, {
                            // This buff increases magicPower from magicDamage by 44% since that counts both damage and magicPower.
                            // Making a note here in case I want to change this *damage bonus to *physicalDamage later to balance this.
                            '+%cooldown': -.2, '+*magicPower': 1.2, '+*weaponDamage': 1.2, '+*range': 1.2, '+duration': 5})},
                    'Enhance your own abilities granting: {$buff}'),
    // Song buffs should be based on the singer's stats, not the stats of the targets. Not sure if this is the case or not.
    'attackSong': genericAction('song', {'icon': bardIcon, 'tags': ['song', 'field'], 'target': 'none', 'color': 'orange', 'alpha': .2},
                                {'+area': 8, '+cooldown': 30, '+duration': 10, '$buff': buffEffect({'icons': [effectSourceUp, effectSourceSword]}, {
                                    '+%attackSpeed': [.2, '+', ['{dexterity}', '/', 1000]],
                                    '+%accuracy': [.2, '+', ['{intelligence}', '/', 1000]],
                                    '+%weaponDamage': [.2, '+', ['{strength}', '/', 1000]]})},
            'Play a tune that inspires you and your allies to attack more fiercely, granting all allies in range: {$buff}'),
    'defenseSong': genericAction('song', {'icon': bardIcon, 'tags': ['song', 'field'], 'target': 'none', 'color': 'purple', 'alpha': .2},
                                 {'+area': 10, '+cooldown': 45, '+duration': 20, '$buff': buffEffect({'icons': [effectSourceUp, effectSourceArmor]}, {
                                    '+%evasion': [.2, '+', ['{dexterity}', '/', 1000]],
                                    '+%block': [.2, '+', ['{intelligence}', '/', 1000]],
                                    '+%magicBlock': [.2, '+', ['{intelligence}', '/', 1000]],
                                    '+%maxHealth': [.2, '+', ['{strength}', '/', 1000]]})},
            'Play an uplifting rondo that steels you and your allies defenses for battle, granting all allies in range: {$buff}'),
    'heroSong': genericAction('heroSong', {'icon': bardIcon, 'tags': ['song', 'field'], 'target': 'none', 'color': 'gold', 'alpha': .2},
                              {'+area': 8, '+cooldown':  ['300', '*', [100, '/', [100, '+', '{intelligence}']]],
                               '+duration': [2, '+', ['{dexterity}' , '/', '200']], '$buff': buffEffect({}, {
                                    '$$invulnerable': 'Invulnerability',
                                    '++healthRegen': ['{intelligence}', '/', 10],
                                    '+%critChance': ['{dexterity}', '/', 500]})},
            'Play a ballade to inspire heroic feats granting all allies in range: {$buff}'),
    'raiseDead': genericAction('minion', {'icon': sageIcon, 'target': 'enemies', 'targetDeadUnits': true, 'consumeCorpse': true, 'tags': ['spell']},
                               {'+limit': 10, '+range': 10, '+chance': .4, '+cooldown': .5},
                                'Chance to raise defeated enemies to fight for you.'),
    'tomFoolery': genericAction('dodge', {'icon': foolIcon, showName: true}, {'+cooldown': 30, '$buff': buffEffect({}, {
                '+*accuracy': 0, '$$maxEvasion': 'Evasion checks are always perfect', '+duration': 5})},
                'Dodge an attack and gain: {$buff}'),
    'mimic': genericAction('mimic', {'icon': foolIcon, showName: true}, {}, 'Counter an enemy ability with a copy of that ability.'),
    'decoy': genericAction('decoy', {'icon': foolIcon, 'tags': ['minion']}, {'+cooldown': 60},
                'Dodge an attack and leave behind a decoy that explodes on death damaging all enemies.'),
    'explode': genericAction('explode', {'tags': ['ranged']}, {'+power': ['{maxHealth}'], '+range': 10, '$alwaysHits': 'Shrapnel cannot be evaded'},
                             'Explode into shrapnel on death.'),
    // Spell actions
    'heal': spellAction('heal', {'icon': 'gfx/496RpgIcons/spellHeal.png', 'target': 'allies'}, {'+cooldown': 10, '+range': 10}, 'Cast a spell to restore {+power} health.'),
    'reflect': spellAction('reflect', {'target': 'allies', showName: true}, {'+cooldown': 20},
            'Create a magical barrier that will reflect projectile attacks until it breaks after taking {+power} damage. Further casting strengthens the barrier.'),
    'revive': spellAction('revive', {'icon': 'gfx/496RpgIcons/spellRevive.png', showName: true}, {'+cooldown': 120},
            'Upon receiving a lethal blow, cast a spell that brings you back to life with {+power} health.'),
    'protect': spellAction('effect', {'icon': 'gfx/496RpgIcons/spellProtect.png', 'target': 'allies', showName: true}, {'+cooldown': 30, '+range': 10, '$buff': buffEffect({'icons': [effectSourceUp, effectSourceArmor]}, {'++armor': ['{intelligence}'], '+duration': 20})},
                           'Create a magic barrier that grants: {$buff}'),
    'aegis': spellAction('criticalCounter', {'icon': 'gfx/496RpgIcons/buffShield.png', showName: true}, {'+cooldown': 60, '+stopAttack': 1,
                '$buff': buffEffect({}, {'$$maxBlock': 'Block checks are always perfect', '$$maxMagicBlock': 'Magic Block checks are always perfect', '+duration': 5})},
                'If an attack would deal more than half of your remaining life, prevent it and cast an enchantment that grants you: {$buff}'),
    'fireball': spellAction('spell', {'icon': 'gfx/496RpgIcons/spellFire.png', 'tags': ['ranged'],
                                        'animation': 'fireball', explosionAnimation: 'explosion', 'alpha': .8,
                                        sound: 'sounds/cheeseman/arrow.wav', explosionSound: 'sounds/fireball.flac', 'size': 40, 'color': 'red', 'gravity': 0},
                                    {'+range': 12, '+cooldown': 8, '$alwaysHits': 'Never misses', '+explode': 1, '+area': 3, '+areaCoefficient': .5},
                            'Conjure an explosive fireball to hurl at enemies dealing {+power} damage.'),
    'freeze': spellAction('spell', {'icon': 'gfx/496RpgIcons/spellFreeze.png', 'tags': ['nova'], 'height': 20, 'color': 'white', 'alpha': .7},
                                    {'+power': ['{magicPower}', '/', 2], '+area': [4, '+', ['{intelligence}', '/', '50']],
                                    '+areaCoefficient': 1, '+cooldown': 10, '$alwaysHits': 'Never misses', '+slowOnHit': 1},
                        'Emit a blast of icy air that deals {+power} damage and slows enemies. The effect is less the further away the enemy is.'),
    'storm': spellAction('spell', {'icon': 'gfx/496RpgIcons/spellStorm.png', 'tags': ['field'], 'yOffset': 100, 'height': 80, 'color': 'yellow', 'alpha': .2},
                         {'+hitsPerSecond': 2, '+duration': 5, '+power': ['{magicPower}', '/', 4],
                         '+area': [5, '+', ['{intelligence}', '/', '200']], '+cooldown': 20, '$alwaysHits': 'Never misses'},
                        'Create a cloud of static electricity that randomly deals magic damage to nearby enemies.'),
    'drainLife': spellAction('spell', {'tags': ['blast'], 'height': 20, 'color': 'green', 'alpha': .5},
                       {'+power': ['{magicPower}', '/', 2], '+range': 10, '+area': [8, '+', ['{intelligence}', '/', '200']],
                       '+areaCoefficient': 1, '+cooldown': 10, '+lifeSteal': 1, '$alwaysHits': 'Never misses'},
                        'Drain life from all enemies in a large area.'),
    'plague': spellAction('spell', {'icon': 'gfx/496RpgIcons/spellPlague.png', 'tags': ['blast'], 'height': 20, 'color': 'yellow', 'alpha': .4},
                        {'+power': ['{magicPower}', '/', 10], '+range': 10, '+area': [8, '+', ['{intelligence}', '/', '200']],
                        '+areaCoefficient': 1, '+cooldown': 20, '$alwaysHits': 'Never misses',
                        '$debuff': debuffEffect({}, {'++damageOverTime': ['{magicPower}', '/', 10], '+%healthRegen': -0.01, '$duration': 'forever'})},
                        'Apply a permanent debuff that deals damage over time to effected enemies.'),
    'stopTime': spellAction('stop', {'icon': 'gfx/496RpgIcons/clock.png'}, {'+duration': [1, '+', ['{intelligence}' , '/', '100']]},
                'Gain a temporal shield that protects you by stopping time whenever you are in danger. Can stop time for up to {+duration} seconds per adventure.'),
    'dispell': spellAction('spell', {'icon': sageIcon, 'tags': ['blast'], 'height': 20, 'color': 'grey', 'alpha': .4},
                    {'+range': 10, '+area': [8, '+', ['{intelligence}', '/', '100']], '+cooldown': 15,
                    '$alwaysHits': 'Never misses', '$debuff': debuffEffect({}, {'+*magicResist': .5, '+*magicBlock': .5, '$duration': 'forever', '+maxStacks': 3})},
                    'Premanently reduce the magic resistances of all enemies in a large area.'),
    'meteor': spellAction('spell', {'icon': 'gfx/496RpgIcons/spellMeteor.png', 'animation': 'fireball', 'tags': ['rain'],
                          'heightRatio': 1, 'minTheta': Math.PI, 'color': 'brown', 'alpha': .4, 'size': 30, 'gravity': .5},
                       {'+count': [2, '+', ['{intelligence}', '/', '100']], '+explode': 1, '+power': ['{magicPower}', '/', 2],
                       '+range': 10, '+area': [3, '+', ['{intelligence}', '/', '200']], '+cooldown': 25, '$alwaysHits': 'Never misses'},
                        'Rain {+count} meteors down on your enemies each dealing {+power} damage.')
};
// The skill key should be applied as a tag to each skill.
for (var skillKey in skills) {
    skills[skillKey].tags.unshift(skillKey);
}
