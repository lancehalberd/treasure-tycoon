var abilities = {
    // Tier 1 classes
    // Juggler
    // how to make chaining apply to basic attack but not double up *throwing:attackSpeed, etc.
    'juggler': {'name': 'Juggling', 'bonuses': {'$throwing:skill:chaining': 'Projectiles ricochet between targets until they miss.'}},
    'minorDexterity': {'name': 'Minor Dexterity', 'bonuses': {'+dexterity': 5}},
    'throwingPower': {'name': 'Throwing Power', 'bonuses': {'*throwing:damage': 1.4, '+throwing:range': 2}},
    'throwingMastery': {'name': 'Throwing Mastery', 'bonuses': {'*throwing:attackSpeed': 1.5}},
    'sap': {'name': 'Sap', 'bonuses': {'+slowOnHit': .1, '+healthGainOnHit': 1}},
    'dodge': {'name': 'Dodge', 'bonuses': {'+evasion': 2}, 'reaction':
             {'type': 'dodge', 'stats': {'cooldown': 10, 'distance': -128, 'buff': {'stats': {'%evasion': .5, 'duration': 5}}}, 'helpText': 'Leap back to dodge an attack and gain: {buff}'}},
    'acrobatics': {'name': 'Acrobatics', 'bonuses': {'+evasion': 2, '+dodge:skill:cooldown': -2, '*dodge:skill:distance': 2}},
    'bullseye': {'name': 'Bullseye', 'action': {'type': 'attack', 'stats': {'attackPower': 2, 'cooldown': 15, '$alwaysHits': 'Never misses', '$undodgeable': 'Cannot be dodged'}}},
    'bullseyeCritical': {'name': 'Dead On', 'bonuses': {'+bullseye:skill:critChance': 1}, 'helpText': 'Bullseye always strikes critically.'},
    // Black Belt
    'blackbelt': {'name': 'Martial Arts', 'bonuses': {'*unarmed:damage': 3, '*unarmed:attackSpeed': 1.5,
                                                        '+unarmed:critChance': .15, '*unarmed:critDamage': 2, '*unarmed:critAccuracy': 2}},
    'fistMastery': {'name': 'Fist Mastery', 'bonuses': {'*fist:damage': 1.5}},
    'minorStrength': {'name': 'Minor Strength', 'bonuses': {'+strength': 5}},
    'vitality': {'name': 'Vitality', 'bonuses': {'+healthRegen': ['{strength}', '/', 10], '+strength': 5}},
    'counterAttack': {'name': 'Counter Attack', 'bonuses': {'+strength': 5}, 'reaction':
            {'type': 'counterAttack', 'stats': {'attackPower': 1.5, 'chance': .1}, 'helpText': 'Perform a powerful counter attack.<br/>The chance to counter is lower the further away the attacker is.'}},
    'counterPower': {'name': 'Improved Counter', 'bonuses': {'+strength': 5, '+counterAttack:skill:attackPower': .5, '*counterAttack:skill:accuracy': 1.5}},
    'counterChance': {'name': 'Heightened Reflexes', 'bonuses': {'+dexterity': 5, '+counterAttack:skill:chance': .1}},
    'dragonPunch': {'name': 'Dragon Punch', 'action':
        {'type': 'attack', 'restrictions': ['fist'], 'stats': {'cooldown': 30, '$alwaysHits': 'Never misses', '$undodgeable': 'Cannot be dodged', 'attackPower': 3, 'distance': 256, '$domino': 'Knocks target away possibly damaging other enemies.'}}},
    // Priest
    'priest': {'name': 'Divine Blessing', 'bonuses': {'*heal:power': 2, '*healthRegen': 2, '*healthGainOnHit': 2}},
    'minorIntelligence': {'name': 'Minor Intelligence', 'bonuses': {'+intelligence': 5}},
    'heal': {'name': 'Heal', 'bonuses': {'+intelligence': 5}, 'action':
            {'type': 'heal', 'target': 'allies', 'tags': ['spell'], 'stats': {'power': ['{intelligence}'], 'cooldown': 10}, 'helpText': 'Cast a spell to restore {power} health.'}},
    'reflect': {'name': 'Reflect', 'bonuses': {'+intelligence': 10}, 'action':
            {'type': 'reflect', 'target': 'self', 'tags': ['spell'], 'stats': {'power': ['{intelligence}'], 'cooldown': 20},
            'helpText': 'Create a magical barrier that will reflect projectile attacks until it breaks after taking {power} damage. Further casting strengthens the barrier.'}},
    'revive': {'name': 'Revive', 'bonuses': {'+intelligence': 10}, 'reaction':
            {'type': 'revive', 'tags': ['spell'], 'stats': {'power': ['{intelligence}'], 'cooldown': 120},
            'helpText': 'Upon receiving a lethal blow, cast a spell that brings you back to life with {power} health.'}},
    'reviveInstantCooldown': {'name': 'Miracle', 'bonuses': {'$revive:skill:instantCooldown': 'Reset cooldowns of other abilities'}},
    'reviveInvulnerability': {'name': 'Halo', 'bonuses': {'$revive:skill:buff': {'duration': 2, '$invulnerable': 'Invulnerability'}}},
    // Tier 2 classes
    // Corsair
    'corsair': {'name': 'Venom', 'bonuses': {'+poison': .2}, 'onHitEffect': {'debuff': {'*damage': .9}},
                    'helpText': "Apply a stacking buff with every hit that weakens enemies' attacks and deals damage over time."},
    'hook': {'name': 'Grappling Hook', 'action': {'type': 'attack',
                    'stats': {'cooldown': 10, 'range': 10, 'dragDamage': 0, 'dragStun': 0, 'rangeDamage': 0, '$alwaysHits': 'Never misses', '$pullsTarget': 'Pulls target'},
                    'helpText': 'Throw a hook to damage and pull enemies closer.'}},
    'hookRange': {'name': 'Long Shot', 'bonuses': {'+hook:skill:range': 5, '+hook:skill:cooldown': -3}},
    'hookDrag': {'name': 'Barbed Wire', 'bonuses': {'+hook:skill:dragDamage': .1}},
    'hookStun': {'name': 'Tazer Wire', 'bonuses': {'+hook:skill:dragStun': .1}},
    'hookPower': {'name': 'Power Shot', 'bonuses': {'+hook:skill:rangeDamage': .1}},
    'deflect': {'name': 'Deflect', 'bonuses': {'+dexterity': 10, '+strength': 5}, 'reaction':
            {'type': 'deflect', 'stats': {'attackPower': [.5, '+', ['{strength}', '/', 100]], 'cooldown': ['20', '*', [100, '/', [100, '+', '{dexterity}']]], 'chance': 1}, 'helpText': 'Deflect ranged attacks back at enemies.'}},
    'plunder': {'name': 'Plunder', 'bonuses': {'+dexterity': 5, '+strength': 10}, 'action':
            {'type': 'plunder', 'stats': {'range': 2, 'count': 1, 'duration': ['{strength}', '/', 10], 'cooldown': ['40', '*', [100, '/', [100, '+', '{dexterity}']]]}, 'helpText': 'Steal an enemies enchantment for yourself.'}},
    'deepPockets': {'name': 'Deep Pockets', 'bonuses': {'+dexterity': 10, '+plunder:skill:count': 1}, 'helpText': 'Steal an additional enchantment when you use plunder.'},
    'robBlind': {'name': 'Rob Blind', 'bonuses': {'+strength': 10, '+plunder:skill:count': 2}, 'helpText': 'Steal two additional enchantments when you use plunder.'},
    // Paladin
    'protect': {'name': 'Protect', 'bonuses': {'+intelligence': 5}, 'action':
            {'type': 'effect', 'tags': ['spell'], 'target': 'self', 'stats': {'cooldown': 30, 'buff': {'stats': {'+armor': ['{intelligence}'], 'duration': 20}}}, 'helpText': 'Create a magic barrier that grants: {buff}'}},
    'banishingStrike': {'name': 'Banishing Strike', 'bonuses': {'+intelligence': 5, '+strength': 5}, 'action':
            {'type': 'banish', 'restrictions': ['melee'], 'stats': {'cooldown': 30, 'attackPower': 2, 'distance': [6, '+', ['{strength}' , '/', 20]],
            '$alwaysHits': 'Never misses', 'purify': 0, 'shockwave': 0,
            'debuff': {'stats': {'*damage': .5, '*magicDamage': .5, 'duration': ['{intelligence}', '/', 20]}},
            'otherDebuff': {'stats': {'*speed': .1, 'duration': ['{intelligence}', '/', 20]}}}, 'helpText': 'Perform a mighty strike that inflicts the enemy with: {debuff} And knocks all other enemies away, slowing them.'}},
    'purify': {'name': 'Purify', 'bonuses': {'+intelligence': 10, '+banishingStrike:skill:purify': 4}, 'helpText': 'Remove all enchantments from enemies hit by banishing strike'},
    'shockwave': {'name': 'Shockwave', 'bonuses': {'+strength': 10, '+banishingStrike:skill:shockwave': 1}, 'helpText': 'Banishing strike also damages knocked back enemies'},
    'aegis': {'name': 'Aegis', 'bonuses': {'+magicBlock': 5, '+block': 10}, 'reaction':
            {'type': 'criticalCounter', 'tags': ['spell'], 'stats': {'cooldown': 60, 'stopAttack': 1,
            'buff': {'stats': {'$maxBlock': 'Block checks are always perfect', '$maxMagicBlock': 'Magic Block checks are always perfect', 'duration': 5}}},
            'helpText': 'If an attack would deal more than half of your remaining life, prevent it and cast an enchantment that grants you: {buff}'}},
    // Dancer
    'dancer': {'name': 'Dancing', 'bonuses': {'+evasion': 3}, 'reaction':
            {'type': 'evadeAndCounter', 'stats': {'$alwaysHits': 'Never misses', 'range': 1}, 'helpText': 'Counter whenever you successfully evade an attack.'}},
    'distract': {'name': 'Distract', 'bonuses': {'+evasion': 3}, 'reaction':
            {'type': 'dodge', 'stats': {'globalDebuff': {'stats': {'*accuracy': .5, 'duration': 2}}, 'cooldown': 10}, 'helpText': 'Dodge an attack with a distracting flourish that inflicts: {globalDebuff} on all enemies.'}},
    'charm': {'name': 'Charm', 'bonuses': {'+dexterity': 5, '+intelligence': 5}, 'action':
            {'type': 'charm', 'stats': {'range': 1, 'cooldown': ['240', '*', [100, '/', [100, '+', '{intelligence}']]]}, 'helpText': 'Steal an enemies heart, turning them into an ally.'}},
    // Tier 3 classes
    // Ranger
    'ranger': {'name': 'Taming', 'bonuses': {'*minion:healthBonus': 2, '*minion:attackSpeedBonus': 1.5, '*minion:speedBonus': 1.5}},
    'finesse':  {'name': 'Finesse', 'bonuses': {'%attackSpeed': .2}},
    'pet': {'name': 'Pet', 'action':
            {'type': 'minion', 'target': 'self', 'tags': ['pet'], 'monsterKey': 'petCaterpillar', 'stats': {'limit': 1, 'cooldown': 30, 'healthBonus': 1, 'damageBonus': 1, 'attackSpeedBonus': 1, 'speedBonus': 1},
            'helpText': 'Call up to 1 pet to fight with you.'}},
    //'petFood': {'name': 'Pet Food', 'bonuses': {'+pet:skill:cooldown': -3, '+pet:skill:healthBonus': 1}, 'helpText': 'Pet has 50% more health and can be called more frequently.'},
    //'petTraining': {'name': 'Pet Training', 'next': ['whistle'], 'bonuses': {'+pet:skill:cooldown': -3, '+pet:skill:damageBonus': .5}, 'helpText': 'Pet deals 50% more damage and can be called more frequently.'},
    //'whistle': {'name': 'Whistle', 'bonuses': {'+pet:skill:cooldown': -10}, 'helpText': 'Greatly reduces the cooldown for calling your pet.'},
    'net': {'name': 'Net Trap', 'action': {'type': 'effect',
                    'stats': {'cooldown': 10, 'range': 10, 'debuff': {'stats': {'*speed': 0, 'duration': 3}}},
                    'helpText': 'Throw a net to ensnare a distant enemy.'}},
    'sicem': {'name': 'Sic \'em', 'bonuses': {'+dexterity': 10}, 'action': {'type': 'effect',
                    'stats': {'cooldown': [60, '*', [100, '/', [100, '+', '{dexterity}']]], 'range': 10, 'allyBuff': {'stats': {'*speed': 2, '*attackSpeed': 2, '*damage': 2, 'duration': 2}}},
                    'helpText': 'Incite your allies to fiercely attack the enemy granting them: {allyBuff}'}},
    // Warrior
    'ferocity': {'name': 'Ferocity', 'bonuses': {'%damage': .2}},
    'charge': {'name': 'Charge', 'bonuses': {'+strength': 5}, 'action':
        {'type': 'charge', 'stats': {'range': 15, 'attackPower': 2, 'cooldown': 30, 'speedBonus': 3, 'stun': .5, 'area': 0, 'rangeDamage': 0, '$alwaysHits': 'Never misses'}, 'helpText': 'Charge at enemies, damaging and stunning them on impact.'}},
    'batteringRam': {'name': 'Battering Ram', 'bonuses': {'+charge:skill:rangeDamage': .1}, 'helpText': 'Charge deals more damage from further away.'},
    'impactRadius': {'name': 'Impact Radius', 'bonuses': {'+charge:skill:area': 6}, 'helpText': 'Charge damage and stun applies to nearby enemies.'},
    'armorBreak': {'name': 'Armor Break', 'bonuses': {'+strength': 15}, 'action':
        {'type': 'attack', 'restrictions': ['melee'], 'stats': {'attackPower': 3, 'cooldown': 30, 'stun': .5, '$alwaysHits': 'Never misses',
        'debuff': {'stats': {'-armor': ['{strength}', '/', 2], '-block': ['{strength}', '/', 2], 'duration': 0 /* 0=forever. help text won't display as buff if duration is unset.*/}}}, 'helpText': 'Deliver a might blow that destroys the targets armor causing: {debuff}'}},
    // Wizard
    'wizard': {'name': 'Arcane Prodigy', 'bonuses': {'*spell:skill:area': 2, '*spell:skill:power': 2}},
    'resonance': {'name': 'Resonance', 'bonuses': {'%magicDamage': .2}},
    'fireball': {'name': 'Fireball', 'bonuses': {'+intelligence': 5}, 'action':
        {'type': 'spell', 'tags': ['spell', 'ranged'], 'animation': 'fireball', 'size': 32, 'color': 'red', 'stats': {'power': ['{intelligence}'], 'range': 12, 'cooldown': 8, '$alwaysHits': 'Never misses', 'explode': 1, 'area': 3, 'areaCoefficient': .5},
        'helpText': 'Conjure an explosive fireball to hurl at enemies dealing {power} damage.'}},
    'chainReaction': {'name': 'Chain Reaction', 'bonuses': {'+fireball:skill:explode': 1}, 'helpText': 'Fireball explosions will chain an extra time.'},
    'freeze': {'name': 'Freeze', 'bonuses': {'+intelligence': 10}, 'action':
        {'type': 'spell', 'tags': ['spell', 'nova'], 'height': 20, 'color': 'white', 'alpha': .7, 'stats': {'power': ['{intelligence}', '/', 2], 'area': [4, '+', ['{intelligence}', '/', '50']], 'areaCoefficient': 1, 'cooldown': 10,
        '$alwaysHits': 'Never misses', 'slowOnHit': 1},
        'helpText': 'Emit a blast of icy air that deals {power} damage and slows enemies. The effect is less the further away the enemy is.'}},
    'absoluteZero': {'name': 'Absolute Zero', 'bonuses': {'*freeze:skill:slowOnHit': 2}},
    'storm': {'name': 'Storm', 'bonuses': {'+intelligence': 15}, 'action':
        {'type': 'spell', 'tags': ['spell', 'field'], 'height': 40, 'color': 'yellow', 'alpha': .2, 'stats': {'hitsPerSecond': 2, 'duration': 5, 'power': ['{intelligence}', '/', 4], 'area': [5, '+', ['{intelligence}', '/', '50']], 'cooldown': 20,
        '$alwaysHits': 'Never misses'},
        'helpText': 'Create a cloud of static electricity that randomly deals magic damage to nearby enemies.'}},
    'stormFrequency': {'name': 'Lightning Rod', 'bonuses': {'*storm:skill:hitsPerSecond': 2}},
    'stormDuration': {'name': 'Storm Mastery', 'bonuses': {'*storm:skill:duration': 2}},
    // Tier 4 classes
    // Assassin
    'blinkStrike': {'name': 'Blink Strike', 'bonuses': {'+dexterity': 5}, 'action':
        {'type': 'attack', 'restrictions': ['melee'], 'stats': {'attackPower': 1.5, 'cooldown': 6, '$alwaysHits': 'Never misses', 'teleport': 6}}, 'helpText': 'Instantly teleport to and attack a nearby enemy.'},
    // Dark Knight
    'soulStrike': {'name': 'Soul Strike', 'bonuses': {'+strength': 10}, 'action':
        {'type': 'attack', 'restrictions': ['melee'], 'bonuses': {'+skill:range': 2}, 'stats': {'attackPower': 2, 'cooldown': 15, '$alwaysHits': 'Never misses', 'healthSacrifice': .2, 'cleave': 1}},
        'helpText': 'Sacrifice a portion of your current health to deal a cleaving attack that hits all enemies in an extended range.'},
    // Bard
    'attackSong': {'name': 'Furious Tocatta', 'bonuses': {'+dexterity': 10}, 'action':
        // The stats on this buff should be based on the caster, not the target.
        {'type': 'song', 'tags': ['song', 'field'], 'target': 'allies', 'color': 'orange', 'alpha': .2, 'stats': {'area': 8, 'cooldown': 30, 'duration': 10,
        'buff': {'stats': {'%attackSpeed': [.2, '+', ['{dexterity}', '/', 1000]], '%accuracy': [.2, '+', ['{intelligence}', '/', 1000]], '%damage': [.2, '+', ['{strength}', '/', 1000]]}}
        }, 'helpText': 'Play a tune that inspires you and your allies to attack more fiercely, granting all allies in range: {buff}'}},
    'defenseSong': {'name': 'Rondo of Hope', 'bonuses': {'+intelligence': 10}, 'action':
        // The stats on this buff should be based on the caster, not the target.
        {'type': 'song', 'tags': ['song', 'field'], 'target': 'allies', 'color': 'purple', 'alpha': .2, 'stats': {'area': 10, 'cooldown': 45, 'duration': 20,
        'buff': {'stats': {'%evasion': [.2, '+', ['{dexterity}', '/', 1000]], '%block': [.2, '+', ['{intelligence}', '/', 1000]], '%health': [.2, '+', ['{strength}', '/', 1000]]}}
        }, 'helpText': 'Play an uplifting rondo that steels you and your allies defenses for battle, granting all allies in range: {buff}'}},
    'heroSong': {'name': 'Hero\'s Ballade', 'bonuses': {'+intelligence': 10, '+dexterity': 10}, 'action':
        // The stats on this buff should be based on the caster, not the target.
        {'type': 'heroSong', 'tags': ['song', 'field'], 'target': 'allies', 'color': 'gold', 'alpha': .2, 'stats': {'area': 8, 'cooldown':  ['300', '*', [100, '/', [100, '+', '{intelligence}']]], 'duration': [2, '+', ['{dexterity}' , '/', '200']],
        'buff': {'stats': {'$invulnerable': 'Invulnerability', '+healthRegen': ['{intelligence}', '/', 10], '%critChance': ['{dexterity}', '/', 500]}}
        }, 'helpText': 'Play a ballade to inspire heroic feats granting all allies in range: {buff}'}},
    // Tier 5 classes
    // Sniper
    'sniper': {'name': 'Sharp Shooter', 'bonuses': {'*bow:critChance': 1.5, '*bow:critDamage': 1.5, '$bow:criticalPiercing': 'Critical strikes hit multiple enemies.'}},
    'majorDexterity': {'name': 'Major Dexterity', 'bonuses': {'+dexterity': 20}},
    'powerShot': {'name': 'Power Shot', 'bonuses': {'+dexterity': 5},
        'action': {'type': 'attack', 'restrictions': ['ranged'], 'bonuses': {'+skill:range': 5, '+skill:critChance': 1},
                    'stats': {'attackPower': 1.5, 'cooldown': 10, '$alwaysHits': 'Never misses'},
                    'helpText': 'Perform a powerful long ranged attack that always strikes critically.'}},
    'snipe': {'name': 'Snipe', 'bonuses': {'+dexterity': 15},
        'action': {'type': 'attack', 'restrictions': ['ranged'], 'bonuses': {'+skill:range': 10},
                    'stats': {'attackPower': 2, 'cooldown': 30, '$ignoreArmor': 'Ignore armor and block',
                    '$ignoreResistance': 'Ignore magic resistance and magic block', '$alwaysHits': 'Never misses'},
                    'helpText': 'Precisely target an enemies weak spot from any distance ignoring all armor and resistances.'}},

    // Samurai
    'majorStrength': {'name': 'Major Strength', 'bonuses': {'+strength': 20}},
    'sideStep': {'name': 'Side Step', 'bonuses': {'+evasion': 2}, 'reaction':
             {'type': 'dodge', 'stats': {'cooldown': 10, 'rangedOnly': true, 'moveDuration': .05, 'distance': 64, 'buff': {'stats': {'+critChance': .2, 'duration': 2}}},
        'helpText': 'Side step a ranged attack and advance toward enemis gaining: {buff}'}},
    'dragonSlayer': {'name': 'Dragon Slayer', 'bonuses': {'+strength': 15},
        'action': {'type': 'attack', 'restrictions': ['melee'], 'bonuses': {'+skill:critDamage': .5, '*skill:critChance': 2},
                   'stats': {'attackPower': 3, 'cooldown': 20, '$alwaysHits': 'Never misses'},
        'helpText': 'Strike with unparalleled ferocity.'}},
    // Sorcerer
    'majorIntelligence': {'name': 'Major Intelligence', 'bonuses': {'+intelligence': 20}},
    'raiseDead': {'name': 'Raise Dead', 'bonuses': {'+intelligence': 5}, 'action':
            {'type': 'minion', 'target': 'enemies', 'targetDeadUnits': true, 'consumeCorpse': true, 'tags': ['spell'], 'stats': {'limit': 10, 'chance': .4, 'cooldown': .5, 'healthBonus': 1, 'damageBonus': 1, 'attackSpeedBonus': 1, 'speedBonus': 1},
            'helpText': 'Sometimes raise defeated enemies to fight for you.'}},
    'drainLife': {'name': 'Drain Life', 'bonuses': {'+intelligence': 10},
        'action': {'type': 'spell', 'tags': ['spell', 'blast'], 'height': 20, 'color': 'green', 'alpha': .5, 'bonuses': {'*skill:power': .5},
                   'stats': {'range': 10, 'power': ['{intelligence}', '/', 2], 'area': [8, '+', ['{intelligence}', '/', '100']], 'areaCoefficient': 1, 'cooldown': 10, 'lifeSteal': 1,
        '$alwaysHits': 'Never misses'},
        'helpText': 'Drain life from all enemies in a large area.'}},
    'plague': {'name': 'Plague', 'bonuses': {'+intelligence': 15},
        'action': {'type': 'spell', 'tags': ['spell', 'blast'], 'height': 20, 'color': 'yellow', 'alpha': .4, 'bonuses': {'*skill:power': .1},
                   'stats': {'range': 10, 'power': ['{intelligence}'], 'area': [8, '+', ['{intelligence}', '/', '100']], 'areaCoefficient': 1, 'cooldown': 20, '$alwaysHits': 'Never misses',
                             'debuff': {'stats': {'+damageOverTime': ['{this.power}'], 'duration': 0 /* 0=forever. help text won't display as buff if duration is unset.*/}}},
        'helpText': 'Apply a permanent debuff that deals damage over time to effected enemies.'}},
    // Tier 6 classes
    // Ninja
    'ninja': {'name': 'Ninjutsu', 'bonuses':{'$cloaking': 'Invisible while moving', '$oneHanded:skill:doubleStrike': 'Attacks hit twice'}},
    'smokeBomb': {'name': 'Smoke Bomb', 'bonuses': {'+dexterity': 10},
        'reaction': {'type': 'criticalCounter', 'stats': {'dodgeAttack': 1, 'globalDebuff': {'stats': {'*accuracy': 0, 'duration': 5}}, 'cooldown': 100},
            'helpText': 'If an attack would deal more than half of your remaining life, dodge it and throw a smoke bomb causing: {globalDebuff} to all enemies.'}},
    'throwWeapon': {'name': 'Throw Weapon', 'bonuses': {'+strength': 10},
        'action': {'type': 'attack', 'restrictions': ['melee'], 'tags': ['ranged'],
                    'stats': {'range': 12, 'attackPower': 1.5, 'cooldown': 10, '$alwaysHits': 'Never misses'},
                    'helpText': 'Throw a copy of your weapon at a distance enemy.'}},
    'shadowClone': {'name': 'Shadow Clone', 'bonuses': {'+strength': 10, '+dexterity': 10},
        'reaction': {'type': 'clone',  'tags': ['minion'], 'stats': {'limit': 10, 'chance': .1, 'healthBonus': .1, 'damageBonus': .1, 'speedBonus': 1.2},
            'helpText': 'Chance to summon a weak clone of yourself on taking damage'}},
    // Enhancer
    'enhanceWeapon': {'name': 'Enhance Weapon', 'bonuses': {'+strength': 10, '+intelligence': 5}, 'action':
            {'type': 'effect', 'tags': ['spell'], 'target': 'self', 'stats': {'cooldown': 20,
                'buff': {'stats': {'+damage': ['{strength}', '/', 10], '+magicDamage': ['{intelligence}', '/', 10], '+critDamage': ['{dexterity}', '/', 500], 'duration': 5}}},
                'helpText': 'Enhance the strength of your weapon granting: {buff}'}},
    'enhanceArmor': {'name': 'Enhance Armor', 'bonuses': {'+strength': 5, '+intelligence': 10}, 'action':
            {'type': 'effect', 'tags': ['spell'], 'target': 'self', 'stats': {'cooldown': 30,
                'buff': {'stats': {'+armor': ['{strength}', '/', 10], '+magicBlock': ['{intelligence}', '/', 20], '+block': ['{intelligence}', '/', 10], '+evasion': ['{dexterity}', '/', 10], 'duration': 15}}},
                'helpText': 'Enhance the strength of your armor granting: {buff}'}},
    'enhanceAbility': {'name': 'Enhance Ability', 'bonuses': {'+strength': 10, '+intelligence': 10}, 'action':
            {'type': 'effect', 'tags': ['spell'], 'target': 'self', 'stats': {'cooldown': 30,
                'buff': {'stats': {'+cooldownReduction': .2, '*power': 1.2, '*attackPower': 1.2, '*range': 1.2, 'duration': 10}}},
                'helpText': 'Enhance your own abilities granting: {buff}'}},
    // Sage
    'stopTime': {'name': 'Stop Time', 'bonuses': {'+intelligence': 10}, 'reaction':
            {'type': 'stop', 'tags': ['spell'], 'stats': {'duration': ['{intelligence}' , '/', '50'], 'cooldown': 120},
            'helpText': 'If an attack would deal more than half of your remaining life, negate it and cast a spell that stops time for everyone else.'}},
    'dispell': {'name': 'Dispell', 'bonuses': {'+intelligence': 15},
        'action': {'type': 'spell', 'tags': ['spell', 'blast'], 'height': 20, 'color': 'grey', 'alpha': .4, 'bonuses': {'*skill:power': 0},
                   'stats': {'range': 10, 'power': 0, 'area': [8, '+', ['{intelligence}', '/', '100']], 'cooldown': 15, '$alwaysHits': 'Never misses',
                             'debuff': {'stats': {'*magicResist': .5, '*magicBlock': .5, 'duration': 0 /* 0=forever. help text won't display as buff if duration is unset.*/}}},
        'helpText': 'Premanently reduce the magic resistances of all enemies in a large area.'}},
    'meteor': {'name': 'Meteor', 'bonuses': {'+intelligence': 20},
        'action': {'type': 'spell', 'tags': ['spell', 'rain'], 'height': 20, 'color': 'grey', 'alpha': .4, 'size': 20,
                   'stats': {'count': [1, '+', ['{intelligence}', '/', '100']], 'explode': 1, 'power': ['{intelligence}', '/', 2], 'area': [2, '+', ['{intelligence}', '/', '100']], 'cooldown': 15, '$alwaysHits': 'Never misses'},
        'helpText': 'Rain {count} meteors down on your enemies each dealing {power} damage.'}},
    'meteorShower': {'name': 'Meteor Shower', 'bonuses': {'+intelligence': 10, '+meteor:skill:count': ['{intelligence}', '/', '50'], '-meteor:skill:area': ['{intelligence}', '/', '200'], '-meteor:skill:power': ['{intelligence}', '/', '4']},
        'helpText': 'Summon many more, but less powerful meteors.'},
    'meteorPower': {'name': 'Meteor Power', 'bonuses': {'+intelligence': 10, '-meteor:skill:count': ['{intelligence}', '/', '200'], '+meteor:skill:area': ['{intelligence}', '/', '50'], '+meteor:skill:power': ['{intelligence}']},
        'helpText': 'Summon fewer, but much more powerful meteors.'},
    // Tier 7 classes
    // Master
    // Fool
    'tomFoolery': {'name': 'Tom Foolery', 'bonuses': {'+evasion': 5}, 'reaction':
             {'type': 'dodge', 'stats': {'cooldown': 30, 'buff': {'stats': {'*accuracy': 0, '$maxEvasion': 'Evasion checks are always perfect', 'duration': 5}}}, 'helpText': 'Dodge an attack and gain: {buff}'}},
    'mimic': {'name': 'Mimic', 'reaction':
             {'type': 'mimic', 'stats': {}, 'helpText': 'Counter an enemy ability with a copy of that ability.'}},
    'decoy': {'name': 'Decoy', 'reaction':
            {'type': 'decoy',  'tags': ['minion'], 'stats': {'cooldown': 60, 'healthBonus': .4, 'damageBonus': .4, 'speedBonus': 1.2},
            'helpText': 'Dodge an attack and leave behind a decoy that explodes on death damaging all enemies.'}},
    'explode': {'name': 'Decoy Burst', 'reaction':
             {'type': 'explode', 'tags': ['ranged'], 'stats': {'power': '{maxHealth}', '$alwaysHits': 'Shrapnel cannot be evaded'}, 'helpText': 'Explode into shrapnel on death.'}},
    // Monster abilities
    'summoner': {'bonuses': {'*minion:skill:limit': 2, '*minion:skill:cooldown': .5, '*minion:skill:healthBonus': 2, '*minion:skill:damageBonus': 2}},
    'summonSkeleton': {'name': 'Summon Skeleton', 'bonuses': {'+intelligence': 5}, 'action':
            {'type': 'minion', 'target': 'enemies', 'monsterKey': 'skeleton', 'tags': ['spell'], 'stats': {'limit': 2, 'cooldown': .5, 'healthBonus': .5, 'damageBonus': 1, 'attackSpeedBonus': 1, 'speedBonus': 1},
            'helpText': 'Raise a skeleton to fight for you.'}},
};
//var testJob = 'corsair';
var testAbilities = [];
//var testAbilities = [abilities.fireball, abilities.chainReaction, abilities.wizard];
//var testAbilities = [abilities.freeze, abilities.absoluteZero, abilities.wizard];
//var testAbilities = [abilities.storm, abilities.stormDuration, abilities.stormFrequency, abilities.wizard];
//var testAbilities = [abilities.fireball, abilities.chainReaction, abilities.wizard, abilities.freeze, abilities.absoluteZero, abilities.storm, abilities.stormDuration, abilities.stormFrequency];
//var testAbilities = [abilities.blinkStrike];
//var testAbilities = [abilities.soulStrike];
//var testAbilities = [abilities.pet, abilities.attackSong];
//var testAbilities = [abilities.pet, abilities.defenseSong];
//var testAbilities = [abilities.pet, abilities.heroSong];
//var testAbilities = [abilities.pet, abilities.attackSong, abilities.defenseSong, abilities.heroSong];
//var testAbilities = [abilities.sniper, abilities.snipe];
//var testAbilities = [abilities.majorStrength, abilities.dragonSlayer];
//var testAbilities = [abilities.raiseDead, abilities.plague];
//var testAbilities = [abilities.throwWeapon];
//var testAbilities = [abilities.enhanceWeapon, abilities.enhanceArmor, abilities.enhanceAbility];
//var testAbilities = [abilities.dispell, abilities.meteor];
//var testAbilities = [abilities.majorIntelligence, abilities.majorIntelligence, abilities.meteor, abilities.meteorRain, abilities.meteorPower];
//var testAbilities = [abilities.majorIntelligence, abilities.majorIntelligence, abilities.meteor, abilities.meteorPower];
$.each(abilities, function (key, ability) {
    ability.key = key;
    if (ability.action) {
        ability.action.name = ability.name;
        ability.action.key = key;
    }
    if (ability.reaction) {
        ability.reaction.name = ability.name;
        ability.reaction.key = key;
    }
});
var specialTraits = {};
function findSpecialTraits(object) {
    $.each(object, function (key, value) {
        if (typeof(key) === 'string' && key.indexOf('$') >= 0) specialTraits[key.substring(1).split(':').pop()] = true;
        if (typeof(value) === 'object') findSpecialTraits(value);
    })
}
findSpecialTraits(abilities);
function abilityHelpText(ability, character) {
    function evaluateActionStat(key) {
        return evaluateForDisplay(action.stats[key], character.adventurer, action);
    }
    var action = ifdefor(ability.action, ability.reaction);
    var sections = [ability.name, ''];
    if (ifdefor(ability.helpText)) {
        sections.push(ability.helpText.replace(/\{(\w+)\}/, function (match, key) {
            return evaluateForDisplay(ability.bonuses[key], character.adventurer, ability);
        }));
        sections.push('');
    }
    var helpText = bonusHelpText(ifdefor(ability.bonuses, {}, ability), false, character.adventurer);
    if (helpText) {
        sections.push(helpText);
        sections.push('');
    }
    if (action) {
        var actionSections = [];
        if (ifdefor(action.helpText)) {
            actionSections.push(action.helpText.replace(/\{(\w+)\}/, function (match, key) {
                return evaluateActionStat(key);
            }));
        }
        for (var i = 0; i < ifdefor(action.restrictions, []).length; i++) {
            actionSections.push(properCase(action.restrictions[i]) + ' only');
        }
        if (ifdefor(action.stats.attackPower)) {
            actionSections.push(evaluateForDisplay(action.stats.attackPower, character.adventurer, action).format(2) + 'x power');
        }
        $.each(action.stats, function (key, value) {
            if (key.charAt(0) === '$') {
                actionSections.push(value);
            }
        });
        if (ifdefor(action.monsterKey)) {
            actionSections.push('Summons a ' + monsters[action.monsterKey].name);
        }
        if (ifdefor(action.stats.healthBonus, 1) !== 1) {
            actionSections.push(evaluateActionStat('healthBonus').format(1) + 'x health');
        }
        if (ifdefor(action.stats.damageBonus, 1) !== 1) {
            actionSections.push(evaluateActionStat('damageBonus').format(1) + 'x damage');
        }
        if (ifdefor(action.stats.attackSpeedBonus, 1) !== 1) {
            actionSections.push(evaluateActionStat('attackSpeedBonus').format(1) + 'x attack speed');
        }
        if (ifdefor(action.stats.speedBonus, 1) !== 1) {
            actionSections.push(evaluateActionStat('speedBonus').format(1) + 'x movement speed');
        }
        if (ifdefor(action.stats.range)) {
            actionSections.push('Range ' + evaluateActionStat('range').format(1));
        }
        if (ifdefor(action.stats.area)) {
            actionSections.push('Area ' + evaluateActionStat('area').format(1));
        }
        if (ifdefor(action.stats.chance)) {
            actionSections.push(evaluateActionStat('chance').percent() + ' chance');
        }
        if (ifdefor(action.stats.duration)) {
            actionSections.push('lasts ' + evaluateActionStat('duration').format(1) + ' seconds');
        }
        if (ifdefor(action.stats.cooldown)) {
            actionSections.push('Cooldown: ' + evaluateActionStat('cooldown').format(1) + ' seconds');
        }
        sections.push(tag('div', 'abilityText', actionSections.join('<br/>')));
    }
    return sections.join('<br/>');
}