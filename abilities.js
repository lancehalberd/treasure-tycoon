/**
 * Notes on targeting skills:
 * This system is very ad hoc and should probably be cleaned up as it becomes clearer what the actual needs of the system are.
 * Essentially every time a stat is calculated it looks for modifiers that potentially target its value. These can target the name of
 * the stat directly, or some set of filters in the case that the modifier is not intended to modify all values with the stat name.
 *
 * Modifying all values with the given key:
 * [operator][key] {'+range': 5} will add 5 to the base value of range for computed objects, including stats on actors, actions and buffs.
 *
 * Modifying values with the given key on skills objects that include the given tag:
 * [operator][tag]:[key] {'*buff:duration': 2} will double the value of duration on all computed objects that include the tag 'buff'.
 * Note that some tags are applied based on the actor, not on the explicit tags on the object being processed. For example:
 * '+throwing:range' will apply to all skills a player uses provided they are using a throwing weapon.
 * '+revive:power' will apply only to the revive skill. The name of a skill is automatically converted to a special tag for targeting.
 * This could cause trouble if the tag generated for a skill name conflicted with another tag. For instance if we had both a revive skill
 * and a revive tag, there is no way to target those individually.
 */
var abilities = {
    'basicAttack': {'name': 'Basic Attack', 'action': skills.basicAttack},
    'throwingPower': {'name': 'Throwing Power', 'bonuses': {'%throwing:physicalDamage': .3, '+throwing:range': 2}},
    'throwingDamage': {'name': 'Throwing Mastery', 'bonuses': {'%throwing:physicalDamage': .2, '%throwing:attackSpeed': .2}},
    'throwingCriticalChance': {'name': 'Throwing Precision', 'bonuses': {'%throwing:critChance': .3, '%throwing:attackSpeed': .3}},
    'throwingParadigmShift': {'name': 'Melee Throwing', 'bonuses': {'*throwing:range': .2, '*throwing:damage': 1.3}}, // This should be throwing -> melee with range: 2 then 1.3xdamage and attack speed.

    'rangedAccuracy': {'name': 'Ranged Accuracy', 'bonuses': {'%ranged:accuracy': .3, '+ranged:range': 1}},
    'rangedDamage': {'name': 'Ranged Damage', 'bonuses': {'%ranged:damage': .2, '+ranged:range': 1}},
    'rangedAttackSpeed': {'name': 'Ranged Attack Speed', 'bonuses': {'%ranged:attackSpeed': .2, '+ranged:range': 1}},
    'rangedParadigmShift': {'name': 'Close Quarters', 'bonuses': {'*ranged:range': .5, '*ranged:damage': 1.3, '*ranged:accuracy': 1.3}},

    'bowRange': {'name': 'Bow Range', 'bonuses': {'+bow:range': 3, '+bow:critDamage': .5}},
    'bowPhysicalDamage': {'name': 'Physical Bow Damage', 'bonuses': {'*bow:physicalDamage': .3, '+bow:critDamage': .3}},
    'bowDamage': {'name': 'Bow Damage', 'bonuses': {'*bow:damage': .5, '*+bow:critDamage': .3}},
    //'bowParadigmShift': {'name': 'Bow Shield', 'bonuses': {'*bow:range': .5, '$bow:twoToOneHanded': 'Equipping a bow only uses one hand.'}}, // This doesn't work yet because setting twoToOneHanded needs to happen before we check to hide the offhand slot.

    'fistDamage': {'name': 'Fist Damage', 'bonuses': {'%fist:physicalDamage': .3, '+fist:critDamage': .3}},
    'fistCriticalChance': {'name': 'Fist Precision', 'bonuses': {'%fist:critChance': .3, '%fist:accuracy': .3}},
    'fistAttackSpeed': {'name': 'Fist Attack Speed', 'bonuses': {'%fist:attackSpeed': .2, '%fist:physicalDamage': .2}},
    //'fistParadigmShift': {'name': '', 'bonuses': {}},

    'swordPhysicalDamage': {'name': 'Sword Damage', 'bonuses': {'%sword:physicalDamage': .3, '%sword:critChance': .3}},
    'swordAccuracy': {'name': 'Sword Accuracy', 'bonuses': {'%sword:accuracy': .5, '*sword:critChance': .2}},
    'swordAttackSpeed': {'name': 'Sword Attack Speed', 'bonuses': {'%sword:attackSpeed': .2, '%sword:physicalDamage': .2}},
    'swordParadigmShift': {'name': 'Two Hands', 'bonuses': {'*noOffhand:damage': 1.5, '*noOffhand:attackSpeed': .75}}, // This should be noOffhand:sword

    'greatswordDamage': {'name': 'Greatsword Damage', 'bonuses': {'%greatsword:damage': .3, '%greatsword:critChance': .3}},
    'greatswordPhysicalDamage': {'name': 'Greatsword Physical Damage', 'bonuses': {'%greatsword:physicalDamage': .4, '%greatsword:accuracy': .2}},
    'greatswordAccuracy': {'name': 'Greatsword Accuracy', 'bonuses': {'%greatsword:accuracy': .5, '%greatsword:physicalDamage': .2}},
    'greatswordParadigmShift': {'name': 'Greatsword Wave', 'bonuses': {'*greatsword:range': 2, '*greatsword:attackSpeed': .5}},

    'wandRange': {'name': 'Wand Range', 'bonuses': {'+wand:range': 2, '%wand:magicDamage': .3}},
    'wandAttackSpeed': {'name': 'Wand Attack Speed', 'bonuses': {'%wand:attackSpeed': .2, '%wand:magicDamage': .2}},
    'wandCritChance': {'name': 'Want Critical Chance', 'bonuses': {'%wand:critChance': .3, '%wand:magicDamage': .3}},
    //'wandParadigmShift': {'name': '', 'bonuses': {'%:': .3, '%:': .3}},

    'staffDamage': {'name': 'Staff Damage', 'bonuses': {'%staff:damage': .5, '%staff:accuracy': .2}},
    'staffCritDamage': {'name': 'Staff Crit Damage', 'bonuses': {'+staff:critDamage': .3, '%staff:magicDamage': .3}},
    'staffAccuracy': {'name': 'Staff Accuracy', 'bonuses': {'%staff:accuracy': .3, '%staff:damage': .3}},
    //'staffParadigmShift': {'name': '', 'bonuses': {'%:': .3, '%:': .3}},

    'spellCDR': {'name': 'Spell Cooldown Reduction', 'bonuses': {'%spell:cooldown': -.1}},
    'spellPower': {'name': 'Spell Power', 'bonuses': {'%spell:damage': .4, '+spell:range': 2}},
    'spellPrecision': {'name': 'Spell Precision', 'bonuses': {'%spell:critChance': .3, '+spell:critDamage': .3}},
    //'spellParadigmShift': {'name': '', 'bonuses': {'%:': .3, '%:': .3}},

    'axePhysicalDamage': {'name': 'Axe Physical Damage', 'bonuses': {'%axe:physicalDamage': .4, '%axe:accuracy': .2}},
    'axeAttackSpeed': {'name': 'Axe Attack Speed', 'bonuses': {'%axe:speed': .4, '%axe:accuracy': .2}},
    'axeCritDamage': {'name': 'Axe Critical Damage', 'bonuses': {'+axe:critDamage': .3, '%axe:physicalDamage': .3}},
    //'axeParadigmShift': {'name': '', 'bonuses': {'%:': .3, '%:': .3}},

    'criticalDamage': {'name': 'Critical Damage', 'bonuses': {'+critDamage': .5}},
    'criticalStrikes': {'name': 'Critical Strikes', 'bonuses': {'%critChance': .2, '+critDamage': .3}},
    'criticalAccuracy': {'name': 'Critical Accuracy', 'bonuses': {'+critAccuracy': .5, '%critChance': .2}},
    //'criticalParadigmShift': {'name': '', 'bonuses': {'%:': .3, '%:': .3}},

    'oneHandedDamage': {'name': 'One Handed Damage', 'bonuses': {'%oneHanded:damage': .2, '%oneHanded:attackSpeed': .2}},
    'oneHandedCritChance': {'name': 'One Handed Critical Chance', 'bonuses': {'%oneHanded:critChance': .2, '%oneHanded:attackSpeed': .2}},
    'oneHandedCritDamage': {'name': 'One Handed Critical Damage', 'bonuses': {'%oneHanded:critDamage': .2, '%oneHanded:attackSpeed': .2}},
    'oneHandedParadigmShift': {'name': 'Dual Wield', 'bonuses': {'*noOffhand:attackSpeed': 1.5, '*noOffhand:damage': .75}},

    'shieldDexterity': {'name': 'Shield Agility', 'bonuses': {'%shield:attackSpeed': .3, '%shield:evasion': .3}},
    'shieldStrength': {'name': 'Shield Toughness', 'bonuses': {'%shield:damage': .3, '%shield:armor': .3}},
    'shieldIntelligence': {'name': 'Shield Tactics', 'bonuses': {'%shield:accuracy': .3, '%shield:block': .3, '%shield:magicBlock': .3}},
    //'shieldParadigmShift': {'name': '', 'bonuses': {'%:': .3, '%:': .3}}, // Dual wield shields, no basic attack

    'polearmRange': {'name': 'Polearm Range', 'bonuses': {'+polearm:range': 1, '%polearm:physicalDamage': .4}},
    'polearmAccuracy': {'name': 'Polearm Accuracy', 'bonuses': {'%polearm:accuracy': .3, '%polearm:damage': .3}},
    'polearmCritDamage': {'name': 'Polearm Critical Damage', 'bonuses': {'+polearm:critDamage': .3, '%polearm:physicalDamage': .3}},
    //'polearmParadigmShift': {'name': '', 'bonuses': {'%:': .3, '%:': .3}},

    'meleeDamage': {'name': 'Melee Damage', 'bonuses': {'%melee:damage': .2, '%melee:accuracy': .2}},
    'meleeAttackSpeed': {'name': 'Melee Attack Speed', 'bonuses': {'%melee:attackSpeed': .2, '%melee:accuracy': .2}},
    'meleeCritChance': {'name': 'Melee CriticalChance', 'bonuses': {'%melee:critChance': .2, '%melee:accuracy': .2}},
    //'meleeParadigmShift': {'name': '', 'bonuses': {'%:': .3, '%:': .3}},

    'movementCDR': {'name': 'Movement Cooldown Reduction', 'bonuses': {'%movement:cooldown': -.1, '%movement:range': .1}},
    'movementDamage': {'name': 'Movement Damage', 'bonuses': {'%movement:damage': .3, '%movement:critDamage': .3}},
    'movementPrecision': {'name': 'Movement Precision', 'bonuses': {'%movement:accuracy': .3, '%movement:critChance': .3}},
    //'movementParadigmShift': {'name': '', 'bonuses': {'%:': .3, '%:': .3}},

    'minionToughness': {'name': 'Ally Toughness', 'bonuses': {'%minion:maxHealth': .5, '%minion:armor': .3}},
    'minionDamage': {'name': 'Ally Damage', 'bonuses': {'%minion:damage': .3, '%minion:accuracy': .3}},
    'minionFerocity': {'name': 'Ally Ferocity', 'bonuses': {'%minion:attackSpeed': .5, '%minion:critChance': .3}},
    //'minionParadigmShift': {'name': '', 'bonuses': {'%:': .3, '%:': .3}},

    'magicMagicDamage': {'name': 'Magic Weapon Magic Damage', 'bonuses': {'%magic:magicDamage': .3, '%magic:accuracy': .3}},
    'magicAttackSpeed': {'name': 'Magic Weapon Attack Speed', 'bonuses': {'%magic:attackSpeed': .2, '%magic:critChance': .2}},
    'magicDamage': {'name': 'Magic Weapon Damage', 'bonuses': {'%magic:damage': .2, '%magic:critDamage': .3}},
    //'magicParadigmShift': {'name': '', 'bonuses': {'%:': .3, '%:': .3}},

    'daggerAttackSpeed': {'name': 'Dagger Attack Speed', 'bonuses': {'%dagger:attackSpeed': .2, '%dagger:critChance': .2}},
    'daggerCritChance': {'name': 'Dagger Critical Chance', 'bonuses': {'%dagger:critChance': .3, '%dagger:damage': .2}},
    'daggerDamage': {'name': 'Dagger Damage', 'bonuses': {'%dagger:damage': .2, '%dagger:attackSpeed': .2}},
    //'daggerParadigmShift': {'name': '', 'bonuses': {'%:': .3, '%:': .3}},
'tier1Index': {'name': '------Tier 1------'},
    'jugglerIndex': {'name': '---Juggler---'},
        'juggler': {'name': 'Juggling', 'bonuses': {'$throwing:chaining': 'Projectiles ricochet between targets until they miss.'}},
        'minorDexterity': {'name': 'Minor Dexterity', 'bonuses': {'+dexterity': 10}},
        'evasion': {'name': 'Evasion', 'bonuses': {'%evasion': .5}},
        'sap': {'name': 'Sap', 'bonuses': {'+slowOnHit': .1, '+healthGainOnHit': 1}},
        'dodge': {'name': 'Dodge', 'bonuses': {'+evasion': 2}, 'reaction': skills.dodge},
        'acrobatics': {'name': 'Acrobatics', 'bonuses': {'+evasion': 2, '+dodge:cooldown': -2, '*dodge:distance': 2}},
        'bullseye': {'name': 'Bullseye', 'action': skills.bullseye},
        'bullseyeCritical': {'name': 'Dead On', 'bonuses': {'+bullseye:critChance': 1}, 'helpText': 'Bullseye always strikes critically.'},
    'blackbeltIndex': {'name': '---Blackbelt---'},
        'blackbelt': {'name': 'Martial Arts',
            'bonuses': {'*unarmed:damage': 3, '*unarmed:attackSpeed': 1.5, '+unarmed:critChance': .15, '*unarmed:critDamage': 2, '*unarmed:critAccuracy': 2}},
        'minorStrength': {'name': 'Minor Strength', 'bonuses': {'+strength': 10}},
        'vitality': {'name': 'Vitality', 'bonuses': {'+healthRegen': ['{strength}', '/', 10], '+strength': 5}},
        'counterAttack': {'name': 'Counter Attack', 'bonuses': {'+strength': 5}, 'reaction': skills.counterAttack},
        'counterPower': {'name': 'Improved Counter', 'bonuses': {'+strength': 5, '+counterAttack:attackPower': .5, '*counterAttack:accuracy': 1.5}},
        'counterChance': {'name': 'Heightened Reflexes', 'bonuses': {'+dexterity': 5, '+counterAttack:chance': .1}},
        'dragonPunch': {'name': 'Dragon Punch', 'action': skills.dragonPunch},
    'priestIndex': {'name': '---Priest---'},
        'priest': {'name': 'Divine Blessing', 'bonuses': {'*heal:power': 2, '*healthRegen': 2, '*healthGainOnHit': 2}},
        'minorIntelligence': {'name': 'Minor Intelligence', 'bonuses': {'+intelligence': 10}},
        'heal': {'name': 'Heal', 'bonuses': {'+intelligence': 5}, 'action': skills.heal},
        'reflect': {'name': 'Reflect', 'bonuses': {'+intelligence': 10}, 'action': skills.reflect},
        'revive': {'name': 'Revive', 'bonuses': {'+intelligence': 10}, 'reaction': skills.revive},
        'reviveInstantCooldown': {'name': 'Miracle', 'bonuses': {'$revive:instantCooldown': '*'}},
        'reviveInvulnerability': {'name': 'Halo', 'bonuses': {'$revive:buff': buffEffect({}, {'+duration': 2, '$$invulnerable': 'Invulnerability'})}},
'tier2Index': {'name': '------Tier 2------'},
    'corsairIndex': {'name': '---Corsair---'},
        'corsair': {'name': 'Venom', 'bonuses': {'+poison': .2}, 'onHitEffect': {'variableObjectType': 'trigger', 'bonuses': {'$debuff': debuffEffect({}, {'+*damage': .9})}},
                        'helpText': "Apply a stacking debuff with every hit that weakens enemies' attacks and deals damage over time."},
        'hook': {'name': 'Grappling Hook', 'action': skills.hook},
        'hookRange': {'name': 'Long Shot', 'bonuses': {'+hook:range': 5, '+hook:cooldown': -3}},
        'hookDrag': {'name': 'Barbed Wire', 'bonuses': {'+hook:dragDamage': .1}},
        'hookStun': {'name': 'Tazer Wire', 'bonuses': {'+hook:dragStun': .1}},
        'hookPower': {'name': 'Power Shot', 'bonuses': {'+hook:rangeDamage': .1}},
        'deflect': {'name': 'Deflect', 'bonuses': {'+dexterity': 10, '+strength': 5}, 'reaction': skills.deflect},
        'plunder': {'name': 'Plunder', 'bonuses': {'+dexterity': 5, '+strength': 10}, 'action': skills.plunder},
        'deepPockets': {'name': 'Deep Pockets', 'bonuses': {'+dexterity': 10, '+plunder:count': 1}, 'helpText': 'Steal an additional enchantment when you use plunder.'},
        'robBlind': {'name': 'Rob Blind', 'bonuses': {'+strength': 10, '+plunder:count': 2}, 'helpText': 'Steal two additional enchantments when you use plunder.'},
    'paladinIndex': {'name': '---Paladin---'},
        'paladin': {'name': 'Faith', 'bonuses': {'*buff:duration': 2}},
        'protect': {'name': 'Protect', 'bonuses': {'+intelligence': 5}, 'action': skills.protect},
        'banishingStrike': {'name': 'Banishing Strike', 'bonuses': {'+intelligence': 5, '+strength': 5}, 'action': skills.banishingStrike},
        'purify': {'name': 'Purify', 'bonuses': {'+intelligence': 10, '+banishingStrike:purify': 4}, 'helpText': 'Remove all enchantments from enemies hit by banishing strike'},
        'shockwave': {'name': 'Shockwave', 'bonuses': {'+strength': 10, '+banishingStrike:shockwave': 1}, 'helpText': 'Banishing strike also damages knocked back enemies'},
        'aegis': {'name': 'Aegis', 'bonuses': {'+magicBlock': 5, '+block': 10}, 'reaction': skills.aegis},
    'dancerIndex': {'name': '---Dancer---'},
        'dancer': {'name': 'Dancing', 'bonuses': {'+evasion': 3}, 'reaction': skills.evadeAndCounter},
        'distract': {'name': 'Distract', 'bonuses': {'+evasion': 3}, 'reaction': skills.distract},
        'charm': {'name': 'Charm', 'bonuses': {'+dexterity': 5, '+intelligence': 5}, 'action': skills.charm},
        'dervish': {'name': 'Whirling Dervish', 'bonuses': {'+dexterity': 15}, 'onHitEffect': {'variableObjectType': 'trigger', 'bonuses': {'$buff': buffEffect({}, {'+%attackSpeed': .05, '+%speed': .05, '+duration': 2})}},
                    'helpText': "Gain momentum with each hit you land granting increased attack speed and movement speed."},
'tier3Index': {'name': '------Tier 3------'},
    'rangerIndex': {'name': '---Ranger---'},
        'ranger': {'name': 'Taming', 'minionBonuses': {'*maxHealth': 2, '*attackSpeed': 1.5, '*speed': 1.5}},
        'finesse':  {'name': 'Finesse', 'bonuses': {'%attackSpeed': .2}},
        'pet': {'name': 'Pet', 'action': skills.pet},
        'petFood': {'name': 'Pet Food', 'bonuses': {'-pet:cooldown': 3}, 'minionBonuses': {'*pet:maxHealth': 1.5}},
        'petTraining': {'name': 'Pet Training', 'bonuses': {'-pet:cooldown': 3}, 'minionBonuses': {'*pet:damage': 1.5}},
        'whistle': {'name': 'Whistle', 'bonuses': {'*pet:cooldown': .5}},
        'net': {'name': 'Net Trap', 'action': skills.net},
        'netArea': {'name': 'Wide Net', 'bonuses': {'+net:area': 5}},
        'sicem': {'name': 'Sic \'em', 'bonuses': {'+dexterity': 10}, 'action': skills.sicem},
        'unleashe': {'name': 'unleashe', 'bonuses': {'+sicem:buff:+lifeSteal': .1, '+sicem:buff:duration': 2},
                        'helpText': 'Sicem buff grants life steal and lasts an additional 2 seconds'},
    'warriorIndex': {'name': '---Warrior---'},
        'warrior': {'name': 'Cleave', 'bonuses': {'%melee:damage': .5, '+melee:cleave': .6, '+melee:cleaveRange': 3}},
        'ferocity': {'name': 'Ferocity', 'bonuses': {'%physicalDamage': .2}},
        'charge': {'name': 'Charge', 'bonuses': {'+strength': 5}, 'action': skills.charge},
        'batteringRam': {'name': 'Battering Ram', 'bonuses': {'+charge:rangeDamage': .1},
            'helpText': 'Charge deals more damage from further away.'},
        'impactRadius': {'name': 'Impact Radius', 'bonuses': {'+charge:area': 6},
            'helpText': 'Charge damage and stun applies to nearby enemies.'},
        'overpower': {'name': 'Overpower', 'bonuses': {'+strength': 10, '+melee:knockbackChance': .3, '+melee:knockbackDistance': 3}},
        'armorBreak': {'name': 'Armor Break', 'bonuses': {'+strength': 15}, 'action': skills.armorBreak},
    'wizardIndex': {'name': '---Wizard---'},
        'wizard': {'name': 'Arcane Prodigy', 'bonuses': {'*spell:area': 2, '*magicPower': 2}},
        'resonance': {'name': 'Resonance', 'bonuses': {'%magicDamage': .2}},
        'fireball': {'name': 'Fireball', 'bonuses': {'+intelligence': 5}, 'action': skills.fireball},
        'chainReaction': {'name': 'Chain Reaction', 'bonuses': {'+fireball:explode': 1}, 'helpText': 'Fireball explosions will chain an extra time.'},
        'freeze': {'name': 'Freeze', 'bonuses': {'+intelligence': 10}, 'action': skills.freeze},
        'absoluteZero': {'name': 'Absolute Zero', 'bonuses': {'*freeze:slowOnHit': 2}},
        'storm': {'name': 'Storm', 'bonuses': {'+intelligence': 15}, 'action': skills.storm},
        'stormFrequency': {'name': 'Lightning Rod', 'bonuses': {'*storm:hitsPerSecond': 2}},
        'stormDuration': {'name': 'Storm Mastery', 'bonuses': {'*storm:duration': 2}},
'tier4Index': {'name': '------Tier 4------'},
    'assassinIndex': {'name': '---Assassin---'},
        'assassin': {'name': 'First Strike', 'bonuses': {'$firstStrike': '100% critical strike chance against enemies with full health.'}},
        'blinkStrike': {'name': 'Blink Strike', 'bonuses': {'+dexterity': 5}, 'action': skills.blinkStrike},
        'cull': {'name': 'Cull', 'bonuses': {'+strength': 10, '+cull': .1}},
        'cripple': {'name': 'Cripple', 'bonuses': {'+strength': 10, '+dexterity': 10},
                'onCritEffect': {'variableObjectType': 'trigger', 'bonuses': {'$debuff': debuffEffect({}, {'+*speed': .5, '+*attackSpeed': .5, '+duration': 5})}}},
    'darkknightIndex': {'name': '---Dark Knight---'},
        'darkknight': {'name': 'Blood Lust', 'bonuses': {'+overHeal': .5, '+lifeSteal': .05}},
        'consume': {'name': 'Consume', 'bonuses': {'+intelligence': 5}, 'action': skills.consume},
        'soulStrike': {'name': 'Soul Strike', 'bonuses': {'+strength': 10}, 'action': skills.soulStrike},
        'reaper': {'name': 'Reaper', 'bonuses': {'+intelligence': 10, '+strength': 5, '+consume:count': 1, '+consume:duration': 10},
            'helpText': 'Gain the powers of consumed monsters for a short period.'},
    'bardIndex': {'name': '---Bard---'},
        'bard': {'name': 'Charisma', 'bonuses': {'*minion:cooldown': .6, '+minion:limit': 1, '*song:duration': 1.5, '+buff:area': 8}},
        'attackSong': {'name': 'Furious Tocatta', 'bonuses': {'+dexterity': 10}, 'action': skills.attackSong},
        'defenseSong': {'name': 'Rondo of Hope', 'bonuses': {'+intelligence': 10}, 'action': skills.defenseSong},
        'heroSong': {'name': 'Hero\'s Ballade', 'bonuses': {'+intelligence': 10, '+dexterity': 10}, 'action': skills.heroSong},
'tier5Index': {'name': '------Tier 5------'},
    'sniperIndex': {'name': '---Sniper---'},
        'sniper': {'name': 'Sharp Shooter', 'bonuses': {'*bow:critChance': 1.5, '*bow:critDamage': 1.5, '$bow:criticalPiercing': 'Critical strikes hit multiple enemies.'}},
        'majorDexterity': {'name': 'Major Dexterity', 'bonuses': {'+dexterity': 30}},
        'powerShot': {'name': 'Power Shot', 'bonuses': {'+dexterity': 5}, 'action': skills.powerShot},
        'aiming': {'name': 'Aiming', 'bonuses': {'*ranged:accuracy': 1.5, '+ranged:critChance': .1, '+ranged:critDamage': .3}},
        'snipe': {'name': 'Snipe', 'bonuses': {'+dexterity': 15}, 'action': skills.snipe},
    'samuraiIndex': {'name': '---Samurai---'},
        'samurai': {'name': 'Great Warrior', 'bonuses': {'*twoHanded:damage': 2}},
        'majorStrength': {'name': 'Major Strength', 'bonuses': {'+strength': 30}},
        'sideStep': {'name': 'Side Step', 'bonuses': {'+evasion': 2}, 'reaction': skills.sideStep},
        'dragonSlayer': {'name': 'Dragon Slayer', 'bonuses': {'+strength': 10}, 'action': skills.dragonSlayer},
        'armorPenetration': {'name': 'Penetrating Strikes', 'bonuses': {'+strength': 15, '+melee:armorPenetration': .3}},
    'sorcerorIndex': {'name': '---Sorceror---'},
        'majorIntelligence': {'name': 'Major Intelligence', 'bonuses': {'+intelligence': 30}},
        'raiseDead': {'name': 'Raise Dead', 'bonuses': {'+intelligence': 5}, 'action': skills.raiseDead},
        'drainLife': {'name': 'Drain Life', 'bonuses': {'+intelligence': 10}, 'action': skills.drainLife},
        'plague': {'name': 'Plague', 'bonuses': {'+intelligence': 15}, 'action': skills.plague},
'tier6Index': {'name': '------Tier 6------'},
    'ninjaIndex': {'name': '---Ninja---'},
        'ninja': {'name': 'Ninjutsu', 'bonuses':{'$cloaking': 'Invisible while moving', '$oneHanded:doubleStrike': 'Attacks hit twice'}},
        'smokeBomb': {'name': 'Smoke Bomb', 'bonuses': {'+dexterity': 10}, 'reaction': skills.smokeBomb},
        'throwWeapon': {'name': 'Throw Weapon', 'bonuses': {'+strength': 10}, 'action': skills.throwWeapon},
        'shadowClone': {'name': 'Shadow Clone', 'bonuses': {'+strength': 10, '+dexterity': 10}, 'reaction': skills.shadowClone,
            'minionBonuses': {'*shadowClone:maxHealth': .1, '*shadowClone:damage': .1, '*shadowClone:speed': 1.2}},
    'enhancerIndex': {'name': '---Enhancer---'},
        'enhanceWeapon': {'name': 'Enhance Weapon', 'bonuses': {'+strength': 10, '+intelligence': 5}, 'action': skills.enhanceWeapon},
        'enhanceArmor': {'name': 'Enhance Armor', 'bonuses': {'+strength': 5, '+intelligence': 10}, 'action': skills.enhanceArmor},
        'enhanceAbility': {'name': 'Enhance Ability', 'bonuses': {'+strength': 10, '+intelligence': 10}, 'action': skills.enhanceAbility},
    'sageIndex': {'name': '---Sage---'},
        'sage': {'name': 'Profound Insight', 'bonuses': {'%cooldown': -.5}},
        'stopTime': {'name': 'Stop Time', 'bonuses': {'+intelligence': 10}, 'reaction': skills.stopTime},
        'dispell': {'name': 'Dispell', 'bonuses': {'+intelligence': 15}, 'action': skills.dispell},
        'meteor': {'name': 'Meteor', 'bonuses': {'+intelligence': 20}, 'action': skills.meteor},
        'meteorShower': {'name': 'Meteor Shower', 'bonuses': {'+intelligence': 10, '+meteor:count': ['{magicPower}', '/', '50'],
                        '-meteor:area': ['{magicPower}', '/', '200'], '-meteor:power': ['{magicPower}', '/', '4']},
                        'helpText': 'Summon many more, but less powerful meteors.'},
        'meteorPower': {'name': 'Meteor Power', 'bonuses': {'+intelligence': 10, '-meteor:count': ['{magicPower}', '/', '200'],
                        '+meteor:area': ['{magicPower}', '/', '50'], '+meteor:power': ['{magicPower}']},
                        'helpText': 'Summon fewer, but much more powerful meteors.'},
'tier7Index': {'name': '------Tier 7------'},
    'masterIndex': {'name': '---Master---'},
        'equipmentMastery': {'name': 'Equipment Mastery', 'bonuses': {'+strength': 5, '+dexterity': 5, '+intelligence': 5, '$equipmentMastery': 'Equip gear beyond your level for a 10% penalty per level.'}},
        'abilityMastery': {'name': 'Ability Mastery', 'bonuses': {'+strength': 10, '+dexterity': 10, '+intelligence': 10, '+instantCooldownChance': .1}},
    'foolIndex': {'name': '---Fool---'},
        'tomFoolery': {'name': 'Tom Foolery', 'bonuses': {'+evasion': 5}, 'reaction': skills.tomFoolery},
        'mimic': {'name': 'Mimic', 'reaction': skills.mimic},
        'decoy': {'name': 'Decoy', 'reaction': skills.decoy,
                    'minionBonuses': {'*decoy:maxHealth': .4, '*decoy:damage': .4, '*decoy:speed': 1.2}},
        'explode': {'name': 'Decoy Burst', 'reaction': skills.explode},
'enemyIndex': {'name': '---Enemies---'},
    'summoner': {'name': 'Summoner', 'bonuses': {'*minion:limit': 2, '*minion:cooldown': .5},
            'minionBonuses': {'*maxHealth': 2, '*damage': 2}},
    'summonSkeleton': {'name': 'Summon Skeleton', 'action': skills.summonSkeleton},
    'summonCaterpillar': {'name': 'Spawn', 'action': skills.summonCaterpillar},
    'rangeAndAttackSpeed': {'name': 'Range And Attack Speed', 'bonuses': {'+range': 2, '+attackSpeed': .5}},
    'dodgeHook': {'name': 'Dodge then Hook', 'bonuses': {'$dodge:instantCooldown': 'hook'}}
};
var testJob;// = 'blackbelt';
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
//var testAbilities = [abilities.protect, abilities.enhanceWeapon];
//var testAbilities = [abilities.overpower];
//var testAbilities = [abilities.cull, abilities.cripple];
//var testAbilities = [abilities.vitality, abilities.consume];
//var testAbilities = [abilities.pet, abilities.attackSong, abilities.protect, abilities.raiseDead];
//var testAbilities = [abilities.aiming, abilities.snipe];
//var testAbilities = [abilities.armorPenetration];
//var testAbilities = [abilities.armorPenetration, abilities.abilityMastery, abilities.fireball];
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
