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
/*
Ability outlines for each class:

xxx 1: Ability 1
xxx Minor stat boost (shared)
xxx 3: Specialization boost 1
xxx Flat defense boost (shared)
xxx Flat offense boost (shared)
xxx 5: Ability 2
xxx Scaling defense boost (shared)
___ 6: Specialization Paradigm Shift - changes how a specialization works.
xxx Scaling offense boost (shared)
xxx 7: Specialization boost 2
xxx Major stat boost (shared)
xxx 9: Specialization boost 3
xxx 10: Ability 3
*/
var tintCompositeCanvas = createCanvas(64, 64);
var tintCompositeContext = tintCompositeCanvas.getContext('2d');
function drawTintIcon(context, target) {
    var compositeTarget = {'left': 0, 'top': 0, 'width': this.width, 'height': this.height};
    // Draw the tinted section the specified color.
    drawTintedImage(tintCompositeContext, images[this.imageFile], this.color, 1, this, compositeTarget);
    // Draw the untinted section on top of the tinted section.
    drawImage(tintCompositeContext, images[this.imageFile],
        {'left': this.left, 'top': this.top + this.height, 'width': this.width, 'height': this.height}, compositeTarget);
    drawImage(context, tintCompositeCanvas,
        compositeTarget, target);
}
function tintIcon(imageFile, color) {
    requireImage(imageFile);
    return {
        imageFile,
        'left': 0,
        'top': 0,
        'width': 32,
        'height': 32,
        color,
        'draw': drawTintIcon
    };
}

function getAbilityIconSource(ability) {
    if (!ability) return null;
    var icon = ifdefor(ability.icon);
    if (ability.action) icon = icon || ability.action.icon;
    if (ability.reaction) icon = icon || ability.reaction.icon;
    if (!icon) icon = 'gfx/496RpgIcons/openScroll.png';
    if (icon.draw) return icon;
    return {'image': images[icon], 'left': 0, 'top': 0, 'width': 34, 'height': 34};
}
var abilities = {
    'basicAttack': {name: 'Basic Attack', 'action': skills.basicAttack},
'passiveBonus': {name: '-----Core Passives-----'},
    'minorDexterity': {name: 'Minor Dexterity', 'bonuses': {'+dexterity': [10, '+', '{level}']}, 'icon': tintIcon('gfx/upArrowsTint.png', '#0f0')},
    'flatEvasion': {name: 'Basic Evasion', 'bonuses': {'+evasion': 10}},
    'flatRangedAttackDamage':  {name: 'Archery', 'bonuses': {'+ranged:attack:weaponPhysicalDamage': 8}},
    'percentEvasion': {name: 'Enhanced Evasion', 'bonuses': {'%evasion': 0.2}},
    'percentAttackSpeed': {name: 'Finesse', 'bonuses': {'%attackSpeed': 0.2}},
    'majorDexterity': {name: 'Major Dexterity', 'bonuses': {'+dexterity': 30, '*dexterity': 1.1}, 'icon': tintIcon('gfx/upArrowsTint.png', '#0f0')},
    'minorIntelligence': {name: 'Minor Intelligence', 'bonuses': {'+intelligence': [10, '+', '{level}']}, 'icon': tintIcon('gfx/upArrowsTint.png', '#00f')},
    'flatBlock': {name: 'Basic Blocking', 'bonuses': {'+block': 10}},
    'flatMagicDamage':  {name: 'Ensorcel', 'bonuses': {'+magic:weaponMagicDamage': 6}},
    'percentBlocking': {name: 'Enhanced Blocking', 'bonuses': {'%block': 0.2}},
    'percentMagicDamage': {name: 'Resonance', 'bonuses': {'%weaponMagicDamage': .2}},
    'majorIntelligence': {name: 'Major Intelligence', 'bonuses': {'+intelligence': 30, '*intelligence': 1.1}, 'icon': tintIcon('gfx/upArrowsTint.png', '#00f')},
    'minorStrength': {name: 'Minor Strength', 'bonuses': {'+strength': [10, '+', '{level}']}, 'icon': tintIcon('gfx/upArrowsTint.png', '#f00')},
    'flatArmor': {name: 'Basic Toughness', 'bonuses': {'+armor': 10}},
    'flatMeleeAttackDamage':  {name: 'Sparring', 'bonuses': {'+melee:attack:weaponPhysicalDamage': 10}},
    'percentArmor': {name: 'Enhanced Toughness', 'bonuses': {'%armor': 0.2}},
    'percentPhysicalDamage': {name: 'Ferocity', 'bonuses': {'%weaponPhysicalDamage': 0.2}},
    'majorStrength': {name: 'Major Strength', 'bonuses': {'+strength': 30, '*strength': 1.1}, 'icon': tintIcon('gfx/upArrowsTint.png', '#f00')},
    'minorVigor': {name: 'Minor Vigor', 'bonuses': {'+dexterity': [5, '+', ['{level}', '/', 2]], '+strength': [5, '+', ['{level}', '/', 2]]}, 'icon': tintIcon('gfx/upArrowsTint.png', '#ff0')},
    'flatMovementSpeed': {name: 'Basic Mobility', 'bonuses': {'+speed': 20}},
    'flatCriticalChance':  {name: 'Find Weakness', 'bonuses': {'+critChance': 0.02}},
    'percentMovementSpeed': {name: 'Enhanced Mobility', 'bonuses': {'%speed': 0.2}},
    'percentCriticalChance': {name: 'Precision', 'bonuses': {'%critChance': 0.2}},
    'majorVigor': {name: 'Major Vigor', 'bonuses': {'+dexterity': 15, '*dexterity': 1.05, '+strength': 15, '*strength': 1.05}, 'icon': tintIcon('gfx/upArrowsTint.png', '#ff0')},
    'minorWill': {name: 'Minor Will', 'bonuses': {'+strength': [5, '+', ['{level}', '/', 2]], '+intelligence': [5, '+', ['{level}', '/', 2]]}, 'icon': tintIcon('gfx/upArrowsTint.png', '#f0f')},
    'flatMagicBlock': {name: 'Basic Warding', 'bonuses': {'+magicBlock': 5}},
    'flatMagicPower':  {name: 'Arcane Potency', 'bonuses': {'+magicPower': 60}},
    'percentMagicBlock': {name: 'Enhanced Warding', 'bonuses': {'%magicBlock': 0.2}},
    'percentMagicPower': {name: 'Amplify', 'bonuses': {'%magicPower': 0.4}},
    'majorWill': {name: 'Major Will', 'bonuses': {'+strength': 15, '*strength': 1.05, '+intelligence': 15, '*intelligence': 1.05}, 'icon': tintIcon('gfx/upArrowsTint.png', '#f0f')},
    'minorCharisma': {name: 'Minor Charisma', 'bonuses': {'+dexterity': [5, '+', ['{level}', '/', 2]], '+intelligence': [5, '+', ['{level}', '/', 2]]}, 'icon': tintIcon('gfx/upArrowsTint.png', '#0ff')},
    'flatDuration': {name: 'Basic Channeling', 'bonuses': {'+duration': 2}},
    'flatAreaOfEffect':  {name: 'Extension', 'bonuses': {'+area': 2}},
    'percentDuration': {name: 'Enhanced Channeling', 'bonuses': {'%duration': 0.2}},
    'percentAreaOfEffect': {name: 'Influence', 'bonuses': {'%area': 0.2}},
    'majorCharisma': {name: 'Major Charisma', 'bonuses': {'+dexterity': 15, '*dexterity': 1.05, '+intelligence': 15, '*intelligence': 1.05}, 'icon': tintIcon('gfx/upArrowsTint.png', '#0ff')},
    'healthPerLevel': {name: 'Life Force', 'bonuses': {'+maxHealth': [5, '*', '{level}']}},
    'flatRange': {name: 'Farsight', 'bonuses': {'+ranged:range': 1}},
    'percentHealth': {name: 'Larger than Life', 'bonuses': {'%maxHealth': 0.2, '+scale': .2}},
    'percentAccuracy': {name: 'Concentration', 'bonuses': {'%accuracy': 0.4}},
    'cooldownReduction': {name: 'Acuity', 'bonuses': {'%cooldown': -0.05}},
'specializationIndex': {name: '-----Specialization-----'},
    'throwingPower': {name: 'Throwing Power', 'icon': 'gfx/496RpgIcons/buffThrown.png', 'bonuses': {'%throwing:weaponPhysicalDamage': .3, '+throwing:weaponRange': 2}},
    'throwingDamage': {name: 'Throwing Mastery', 'icon': 'gfx/496RpgIcons/buffThrown.png', 'bonuses': {'%throwing:weaponPhysicalDamage': .2, '%throwing:attackSpeed': .2}},
    'throwingCriticalChance': {name: 'Throwing Precision', 'icon': 'gfx/496RpgIcons/buffThrown.png', 'bonuses': {'%throwing:critChance': .3, '%throwing:attackSpeed': .3}},
    'throwingParadigmShift': {name: 'Melee Throwing', 'icon': 'gfx/496RpgIcons/buffThrown.png', 'bonuses': {'$throwing:setRange': 'melee', '$throwing:weaponRange': 1, '*throwing:weaponDamage': 1.3, '*throwing:attackSpeed': 1.3}},
    'rangedAccuracy': {name: 'Ranged Accuracy', 'icon': 'gfx/496RpgIcons/target.png', 'bonuses': {'%ranged:accuracy': .3, '+ranged:range': 1}},
    'rangedDamage': {name: 'Ranged Damage', 'icon': 'gfx/496RpgIcons/target.png', 'bonuses': {'%ranged:weaponDamage': .2, '+ranged:range': 1}},
    'rangedAttackSpeed': {name: 'Ranged Attack Speed', 'icon': 'gfx/496RpgIcons/target.png', 'bonuses': {'%ranged:attackSpeed': .2, '+ranged:range': 1}},
    'rangedParadigmShift': {name: 'Close Quarters', 'icon': 'gfx/496RpgIcons/target.png', 'bonuses': {'*ranged:range': .5, '*ranged:weaponDamage': 1.3, '*ranged:accuracy': 1.3}},
    'bowRange': {name: 'Bow Range', 'icon': 'gfx/496RpgIcons/buffBow.png', 'bonuses': {'+bow:weaponRange': 3, '+bow:critDamage': .5}},
    'bowPhysicalDamage': {name: 'Physical Bow Damage', 'icon': 'gfx/496RpgIcons/buffBow.png', 'bonuses': {'%bow:weaponPhysicalDamage': 0.3, '+bow:critDamage': 0.3}},
    'bowDamage': {name: 'Bow Damage', 'icon': 'gfx/496RpgIcons/buffBow.png', 'bonuses': {'%bow:weaponDamage': 0.3, '+bow:critDamage': .3}},
    'bowParadigmShift': {name: 'One Handed Archery', 'icon': 'gfx/496RpgIcons/buffBow.png', 'bonuses': {'*bow:weaponRange': .5, '$bow:twoToOneHanded': 'Equipping a bow only uses one hand.'}},
    'fistDamage': {name: 'Fist Damage', 'icon': 'gfx/496RpgIcons/buffFist.png', 'bonuses': {'%fist:weaponPhysicalDamage': .3, '+fist:critDamage': .3}},
    'fistCriticalChance': {name: 'Fist Precision', 'icon': 'gfx/496RpgIcons/buffFist.png', 'bonuses': {'%fist:critChance': .3, '%fist:accuracy': .3}},
    'fistAttackSpeed': {name: 'Fist Attack Speed', 'icon': 'gfx/496RpgIcons/buffFist.png', 'bonuses': {'%fist:attackSpeed': .2, '%fist:weaponPhysicalDamage': .2}},
    'fistParadigmShift': {name: 'Jujutsu', 'icon': 'gfx/496RpgIcons/buffFist.png', 'bonuses': {'*fist:weaponDamage': 2, '+fist:counterAttack:chance': .3, '$fist:cannotAttack': 'Cannot attack', '$fist:counterAttack:dodge': 'Dodge countered attacks.'}},
    'swordPhysicalDamage': {name: 'Sword Damage', 'icon': 'gfx/496RpgIcons/buffSword.png', 'bonuses': {'%sword:weaponPhysicalDamage': .3, '%sword:critChance': .3}},
    'swordAccuracy': {name: 'Sword Accuracy', 'icon': 'gfx/496RpgIcons/buffSword.png', 'bonuses': {'%sword:accuracy': .5, '+sword:critChance': .2}},
    'swordAttackSpeed': {name: 'Sword Attack Speed', 'icon': 'gfx/496RpgIcons/buffSword.png', 'bonuses': {'%sword:attackSpeed': .2, '%sword:weaponPhysicalDamage': .2}},
    'swordParadigmShift': {name: 'Two Hands', 'icon': 'gfx/496RpgIcons/buffSword.png', 'bonuses': {'*noOffhand:sword:weaponDamage': 1.5, '*noOffhand:sword:attackSpeed': .75}},
    'greatswordDamage': {name: 'Greatsword Damage', 'icon': 'gfx/496RpgIcons/buffGreatSword.png', 'bonuses': {'%greatsword:weaponDamage': .3, '%greatsword:critChance': .3}},
    'greatswordPhysicalDamage': {name: 'Greatsword Physical Damage', 'icon': 'gfx/496RpgIcons/buffGreatSword.png', 'bonuses': {'%greatsword:weaponPhysicalDamage': .4, '%greatsword:accuracy': .2}},
    'greatswordAccuracy': {name: 'Greatsword Accuracy', 'icon': 'gfx/496RpgIcons/buffGreatSword.png', 'bonuses': {'%greatsword:accuracy': .5, '%greatsword:weaponPhysicalDamage': 0.2}},
    'greatswordParadigmShift': {name: 'Greatsword Wave', 'icon': 'gfx/496RpgIcons/buffGreatSword.png', 'bonuses': {'*greatsword:weaponRange': 2, '*greatsword:attackSpeed': 0.5}},
    'wandRange': {name: 'Wand Range', 'icon': 'gfx/496RpgIcons/buffWand.png', 'bonuses': {'+wand:weaponRange': 2, '%wand:weaponMagicDamage': .3}},
    'wandAttackSpeed': {name: 'Wand Attack Speed', 'icon': 'gfx/496RpgIcons/buffWand.png', 'bonuses': {'%wand:attackSpeed': .2, '%wand:weaponMagicDamage': .2}},
    'wandCritChance': {name: 'Wand Critical Chance', 'icon': 'gfx/496RpgIcons/buffWand.png', 'bonuses': {'%wand:critChance': .3, '%wand:weaponMagicDamage': .3}},
    'wandParadigmShift': {name: 'Healing Attacks', 'icon': 'gfx/496RpgIcons/buffWand.png', 'bonuses': {'$wand:healingAttacks': true}, 'action': skills.healingAttack},
    'staffDamage': {name: 'Staff Damage', 'icon': 'gfx/496RpgIcons/buffStaff.png', 'bonuses': {'%staff:weaponDamage': .5, '%staff:accuracy': .2}},
    'staffCritDamage': {name: 'Staff Crit Damage', 'icon': 'gfx/496RpgIcons/buffStaff.png', 'bonuses': {'+staff:critDamage': .3, '%staff:weaponMagicDamage': .3}},
    'staffAccuracy': {name: 'Staff Accuracy', 'icon': 'gfx/496RpgIcons/buffStaff.png', 'bonuses': {'%staff:accuracy': .3, '%staff:weaponDamage': .3}},
    'staffParadigmShift': {name: 'Spell Staff', 'icon': 'gfx/496RpgIcons/buffStaff.png', 'bonuses': {'$staff:imprintSpell': 'The last spell you cast is imprinted on your weapon.'}},
    'spellCDR': {name: 'Spell Cooldown Reduction', 'bonuses': {'%spell:cooldown': -.1}},
    'spellPower': {name: 'Spell Power', 'bonuses': {'%spell:power': .4, '+spell:range': 2}},
    'spellPrecision': {name: 'Spell Precision', 'bonuses': {'%spell:critChance': .3, '+spell:critDamage': .3}},
    'spellParadigmShift': {name: 'Secular Spells', 'bonuses': {'$spell:magicToPhysical': 'Magic damage is dealt as physical damage.'}},
    'axePhysicalDamage': {name: 'Axe Physical Damage', 'icon': 'gfx/496RpgIcons/buffAxe.png', 'bonuses': {'%axe:weaponPhysicalDamage': .4, '%axe:accuracy': .2}},
    'axeAttackSpeed': {name: 'Axe Attack Speed', 'icon': 'gfx/496RpgIcons/buffAxe.png', 'bonuses': {'%axe:attackSpeed': .4, '%axe:accuracy': .2}},
    'axeCritDamage': {name: 'Axe Critical Damage', 'icon': 'gfx/496RpgIcons/buffAxe.png', 'bonuses': {'+axe:critDamage': .3, '%axe:weaponPhysicalDamage': .3}},
    //'axeParadigmShift': {name: '', 'bonuses': {'%:': .3, '%:': .3}},
    'criticalDamage': {name: 'Critical Damage', 'icon': 'gfx/496RpgIcons/target.png', 'bonuses': {'+critDamage': .5}},
    'criticalStrikes': {name: 'Critical Strikes', 'icon': 'gfx/496RpgIcons/target.png', 'bonuses': {'%critChance': .2, '+critDamage': .3}},
    'criticalAccuracy': {name: 'Critical Accuracy', 'icon': 'gfx/496RpgIcons/target.png', 'bonuses': {'+critAccuracy': .5, '%critChance': .2}},
    //'criticalParadigmShift': {name: '', 'icon': 'gfx/496RpgIcons/target.png', 'bonuses': {'%:': .3, '%:': .3}},
    'oneHandedDamage': {name: 'One Handed Damage', 'bonuses': {'%oneHanded:weaponDamage': .2, '%oneHanded:attackSpeed': .2}},
    'oneHandedCritChance': {name: 'One Handed Critical Chance', 'bonuses': {'%oneHanded:critChance': .2, '%oneHanded:attackSpeed': .2}},
    'oneHandedCritDamage': {name: 'One Handed Critical Damage', 'bonuses': {'%oneHanded:critDamage': .2, '%oneHanded:attackSpeed': .2}},
    'oneHandedParadigmShift': {name: 'Dual Wield', 'bonuses': {'*noOffhand:oneHanded:attackSpeed': 1.5}},
    'shieldDexterity': {name: 'Shield Agility', 'icon': 'gfx/496RpgIcons/buffShield.png', 'bonuses': {'%shield:attackSpeed': .3, '%shield:evasion': .3}},
    'shieldStrength': {name: 'Shield Toughness', 'icon': 'gfx/496RpgIcons/buffShield.png', 'bonuses': {'%shield:weaponDamage': .3, '%shield:armor': .3}},
    'shieldIntelligence': {name: 'Shield Tactics', 'icon': 'gfx/496RpgIcons/buffShield.png', 'bonuses': {'%shield:accuracy': .3, '%shield:block': .3, '%shield:magicBlock': .3}},
    //'shieldParadigmShift': {name: '', 'icon': 'gfx/496RpgIcons/buffShield.png', 'bonuses': {'%:': .3, '%:': .3}}, // Dual wield shields, no basic attack
    'polearmRange': {name: 'Polearm Range', 'icon': 'gfx/496RpgIcons/buffPolearm.png', 'bonuses': {'+polearm:weaponRange': 1, '%polearm:weaponPhysicalDamage': .4}},
    'polearmAccuracy': {name: 'Polearm Accuracy', 'icon': 'gfx/496RpgIcons/buffPolearm.png', 'bonuses': {'%polearm:accuracy': .3, '%polearm:weaponDamage': .3}},
    'polearmCritDamage': {name: 'Polearm Critical Damage', 'icon': 'gfx/496RpgIcons/buffPolearm.png', 'bonuses': {'+polearm:critDamage': .3, '%polearm:weaponPhysicalDamage': .3}},
    //'polearmParadigmShift': {name: 'Crushing Blows', 'icon': 'gfx/496RpgIcons/buffPolearm.png', 'bonuses': {'*polearm:damage': .75, '*polearm:attackSpeed': .75, '+polearm:cripple': .5}},
    'meleeDamage': {name: 'Melee Damage', 'bonuses': {'%melee:weaponDamage': .2, '%melee:accuracy': .2}},
    'meleeAttackSpeed': {name: 'Melee Attack Speed', 'bonuses': {'%melee:attackSpeed': .2, '%melee:accuracy': .2}},
    'meleeCritChance': {name: 'Melee CriticalChance', 'bonuses': {'%melee:critChance': .2, '%melee:accuracy': .2}},
    //'meleeParadigmShift': {name: '', 'bonuses': {'%:': .3, '%:': .3}},
    'movementCDR': {name: 'Movement Cooldown Reduction', 'bonuses': {'%movement:cooldown': -.1, '%movement:distance': .1}},
    'movementDamage': {name: 'Movement Damage', 'bonuses': {'%movement:damage': .3, '%movement:critDamage': .3}},
    'movementPrecision': {name: 'Movement Precision', 'bonuses': {'%movement:accuracy': .3, '%movement:critChance': .3}},
    //'movementParadigmShift': {name: '', 'bonuses': {'%:': .3, '%:': .3}},
    'minionToughness': {name: 'Ally Toughness', 'icon': rangerIcon, 'bonuses': {'%minion:maxHealth': .5, '%minion:armor': .3}},
    'minionDamage': {name: 'Ally Damage', 'icon': rangerIcon, 'bonuses': {'%minion:damage': .3, '%minion:accuracy': .3}},
    'minionFerocity': {name: 'Ally Ferocity', 'icon': rangerIcon, 'bonuses': {'%minion:attackSpeed': .5, '%minion:critChance': .3}},
    //'minionParadigmShift': {name: '', 'bonuses': {'%:': .3, '%:': .3}},
    'magicMagicDamage': {name: 'Magic Weapon Magic Damage', 'bonuses': {'%magic:weaponMagicDamage': .3, '%magic:accuracy': .3}},
    'magicAttackSpeed': {name: 'Magic Weapon Attack Speed', 'bonuses': {'%magic:attackSpeed': .2, '%magic:critChance': .2}},
    'magicDamage': {name: 'Magic Weapon Damage', 'bonuses': {'%magic:weaponDamage': .2, '%magic:critDamage': .3}},
    //'magicParadigmShift': {name: '', 'bonuses': {'%:': .3, '%:': .3}},
    'daggerAttackSpeed': {name: 'Dagger Attack Speed', 'icon': 'gfx/496RpgIcons/buffDagger.png', 'bonuses': {'%dagger:attackSpeed': .2, '%dagger:critChance': .2}},
    'daggerCritChance': {name: 'Dagger Critical Chance', 'icon': 'gfx/496RpgIcons/buffDagger.png', 'bonuses': {'%dagger:critChance': .3, '%dagger:weaponDamage': .2}},
    'daggerDamage': {name: 'Dagger Damage', 'icon': 'gfx/496RpgIcons/buffDagger.png', 'bonuses': {'%dagger:weaponDamage': .2, '%dagger:attackSpeed': .2}},
    //'daggerParadigmShift': {name: '', 'bonuses': {'%:': .3, '%:': .3}},
'tier1Index': {name: '------Tier 1------'},
    'jugglerIndex': {name: '---Juggler---'},
        'juggler': {name: 'Juggling', 'icon': jugglerIcon, 'bonuses': {'$throwing:attack:chaining': 'Projectiles ricochet between targets until they miss.'}},
        'sap': {name: 'Sap', 'icon': jugglerIcon, 'bonuses': {'+slowOnHit': .1, '+healthGainOnHit': 1},
            onMissEffect: {
                variableObjectType: 'trigger',
                bonuses: {'$debuff': debuffEffect({'icons':[effectAccuracy]}, {'+-evasion': 2, '$duration': 'forever'})}
            },
            helpText: 'Reduce enemy evasion on miss.'
        },
        'dodge': {name: 'Dodge', 'bonuses': {'+evasion': 2}, 'reaction': skills.dodge},
        'acrobatics': {name: 'Acrobatics', 'icon': dancerIcon, 'bonuses': {'+evasion': 2, '-dodge:cooldown': 2, '*dodge:distance': 2}},
        'bullseye': {name: 'Bullseye', 'action': skills.bullseye},
        'bullseyeCritical': {name: 'Dead On', 'icon': 'gfx/496RpgIcons/target.png', 'bonuses': {'+bullseye:critChance': 1}, 'helpText': 'Bullseye always strikes critically.'},
    'blackbeltIndex': {name: '---Blackbelt---'},
        'blackbelt': {name: 'Martial Arts', 'icon': blackbeltIcon,
            'bonuses': {'*unarmed:damage': 3, '*unarmed:attackSpeed': 1.5, '+unarmed:critChance': .15, '*unarmed:critDamage': 2, '*unarmed:critAccuracy': 2}},
        'vitality': {name: 'Vitality', 'icon': blackbeltIcon, 'bonuses': {'+healthRegen': ['{strength}', '/', 10], '+strength': 5}},
        'counterAttack': {name: 'Counter Attack', 'icon': blackbeltIcon, 'bonuses': {'+strength': 5}, 'reaction': skills.counterAttack},
        'counterPower': {name: 'Improved Counter', 'icon': blackbeltIcon, 'bonuses': {'+strength': 5, '+counterAttack:attackPower': .5, '*counterAttack:accuracy': 1.5}},
        'counterChance': {name: 'Heightened Reflexes', 'icon': blackbeltIcon, 'bonuses': {'+dexterity': 5, '+counterAttack:chance': .1}},
        'dragonPunch': {name: 'Dragon Punch', 'icon': blackbeltIcon, 'action': skills.dragonPunch},
    'priestIndex': {name: '---Priest---'},
        'priest': {name: 'Divine Blessing', 'icon': 'gfx/496RpgIcons/abilityDivineBlessing.png', 'bonuses': {'+healOnCast': .1, '+overHealReflection': .5, '+castKnockBack': 9}},
        'heal': {name: 'Heal', 'bonuses': {'+intelligence': 5}, 'action': skills.heal},
        'reflect': {name: 'Reflect', 'bonuses': {'+intelligence': 10}, 'action': skills.reflect},
        'revive': {name: 'Revive', 'bonuses': {'+intelligence': 10}, 'reaction': skills.revive},
        'reviveInstantCooldown': {name: 'Miracle', 'bonuses': {'$revive:instantCooldown': '*'}},
        'reviveInvulnerability': {name: 'Halo', 'bonuses': {'$revive:buff': buffEffect({}, {'+duration': 2, '$$invulnerable': 'Invulnerability'})}},
'tier2Index': {name: '------Tier 2------'},
    'corsairIndex': {name: '---Corsair---'},
        'corsair': {name: 'Venom', 'icon': 'gfx/496RpgIcons/abilityVenom.png',
                'bonuses': {'+poison': .2}, 'onHitEffect': {'variableObjectType': 'trigger', 'bonuses': {'$debuff': debuffEffect({'icons':[effectSourcePoison]}, {'+*weaponDamage': .9, '+duration': 2})}},
                        'helpText': "Apply a stacking debuff with every hit that weakens enemies' attacks and deals damage over time."},
        'hook': {name: 'Grappling Hook', 'action': skills.hook},
        'hookRange': {name: 'Long Shot', 'bonuses': {'+hook:range': 5, '+hook:cooldown': -3}},
        'hookDrag': {name: 'Barbed Wire', 'bonuses': {'+hook:dragDamage': .1}},
        'hookStun': {name: 'Tazer Wire', 'bonuses': {'+hook:dragStun': .1}},
        'hookPower': {name: 'Power Shot', 'bonuses': {'+hook:rangeDamage': .1}},
        'deflect': {name: 'Deflect', 'bonuses': {'+dexterity': 10, '+strength': 5}, 'reaction': skills.deflect},
        'deflectDamage': {name: 'Deflect Power', 'bonuses': {'*deflect:damageRatio': 2, '+strength': 5}},
        'plunder': {name: 'Plunder', 'bonuses': {'+dexterity': 5, '+strength': 10}, 'action': skills.plunder},
        'deepPockets': {name: 'Deep Pockets', 'bonuses': {'+dexterity': 10, '+plunder:count': 1}, 'helpText': 'Steal an additional enchantment when you use plunder.'},
        'robBlind': {name: 'Rob Blind', 'bonuses': {'+strength': 10, '+plunder:count': 2}, 'helpText': 'Steal two additional enchantments when you use plunder.'},
    'paladinIndex': {name: '---Paladin---'},
        'paladin': {name: 'Faith', 'icon': 'gfx/496RpgIcons/abilityDivineBlessing.png', 'bonuses': {'*buff:duration': 1.5, '+buff:%damage': .1}},
        'protect': {name: 'Protect', 'bonuses': {'+intelligence': 5}, 'action': skills.protect},
        'banishingStrike': {name: 'Banishing Strike', 'bonuses': {'+intelligence': 5, '+strength': 5}, 'action': skills.banishingStrike},
        'purify': {name: 'Purify', 'bonuses': {'+intelligence': 10, '+banishingStrike:purify': 4}, 'helpText': 'Remove all enchantments from enemies hit by banishing strike'},
        'shockwave': {name: 'Shockwave', 'bonuses': {'+strength': 10, '+banishingStrike:shockwave': 1}, 'helpText': 'Banishing strike also damages knocked back enemies'},
        'aegis': {name: 'Aegis', 'bonuses': {'+magicBlock': 5, '+block': 10}, 'reaction': skills.aegis},
    'dancerIndex': {name: '---Dancer---'},
        'dancer': {name: 'Dancing', 'icon': 'gfx/496RpgIcons/openScroll.png', 'bonuses': {'+evasion': 3}, 'reaction': skills.evadeAndCounter},
        'distract': {name: 'Distract', 'bonuses': {'+evasion': 3}, 'reaction': skills.distract},
        'charm': {name: 'Charm', 'bonuses': {'+dexterity': 5, '+intelligence': 5}, 'action': skills.charm},
        'dervish': {name: 'Whirling Dervish', 'bonuses': {'+dexterity': 15}, 'onHitEffect': {'variableObjectType': 'trigger', 'bonuses': {'$buff': buffEffect({}, {'+%attackSpeed': .04, '+%speed': .04, '+duration': 1})}},
                    'helpText': "Gain momentum with each hit you land granting increased attack speed and movement speed."},
'tier3Index': {name: '------Tier 3------'},
    'rangerIndex': {name: '---Ranger---'},
        'ranger': {name: 'Taming', 'minionBonuses': {'*maxHealth': 2, '*attackSpeed': 1.5, '*speed': 1.2}},
        'pet': {name: 'Pet', 'action': skills.pet},
        'petFood': {name: 'Pet Food', 'bonuses': {'-pet:cooldown': 3}, 'minionBonuses': {'*pet:maxHealth': 1.5}},
        'petTraining': {name: 'Pet Training', 'bonuses': {'-pet:cooldown': 3}, 'minionBonuses': {'*pet:damage': 1.5}},
        'whistle': {name: 'Whistle', 'bonuses': {'*pet:cooldown': .5}},
        'net': {name: 'Net Trap', 'action': skills.net},
        'netArea': {name: 'Wide Net', 'bonuses': {'+net:area': 5}},
        'sicem': {name: 'Sic \'em', 'bonuses': {'+dexterity': 10}, 'action': skills.sicem},
        'unleashe': {name: 'unleashe', 'bonuses': {'+sicem:buff:+lifeSteal': .1, '+sicem:buff:duration': 2},
                        'helpText': 'Sicem buff grants life steal and lasts an additional 2 seconds'},
    'warriorIndex': {name: '---Warrior---'},
        'warrior': {name: 'Cleave', 'bonuses': {'%melee:weaponDamage': .5, '+melee:cleave': .6, '+melee:cleaveRange': 3}},
        'charge': {name: 'Charge', 'bonuses': {'+strength': 5}, 'action': skills.charge},
        'batteringRam': {name: 'Battering Ram', 'bonuses': {'+charge:rangeDamage': .1},
            'helpText': 'Charge deals more damage from further away.'},
        'impactRadius': {name: 'Impact Radius', 'bonuses': {'+charge:area': 6},
            'helpText': 'Charge damage and stun applies to nearby enemies.'},
        'overpower': {name: 'Overpower', 'bonuses': {'+strength': 10, '+melee:knockbackChance': .3, '+melee:knockbackDistance': 3}},
        'armorBreak': {name: 'Armor Break', 'bonuses': {'+strength': 15}, 'action': skills.armorBreak},
    'wizardIndex': {name: '---Wizard---'},
        'wizard': {name: 'Arcane Prodigy', 'bonuses': {'*spell:area': 2, '*magicPower': 2}},
        'fireball': {name: 'Fireball', 'bonuses': {'+intelligence': 5}, 'action': skills.fireball},
        'chainReaction': {name: 'Chain Reaction', 'bonuses': {'+fireball:explode': 1}, 'helpText': 'Fireball explosions will chain an extra time.'},
        'freeze': {name: 'Freeze', 'bonuses': {'+intelligence': 10}, 'action': skills.freeze},
        'absoluteZero': {name: 'Absolute Zero', 'bonuses': {'*freeze:slowOnHit': 2}},
        'storm': {name: 'Storm', 'bonuses': {'+intelligence': 15}, 'action': skills.storm},
        'stormFrequency': {name: 'Lightning Rod', 'bonuses': {'*storm:hitsPerSecond': 2}},
        'stormDuration': {name: 'Storm Mastery', 'bonuses': {'*storm:duration': 2}},
'tier4Index': {name: '------Tier 4------'},
    'assassinIndex': {name: '---Assassin---'},
        'assassin': {name: 'First Strike', 'bonuses': {'$firstStrike': '100% critical strike chance against enemies with full health.'}},
        'blinkStrike': {name: 'Blink Strike', 'bonuses': {'+dexterity': 5}, 'action': skills.blinkStrike},
        'cull': {name: 'Cull', 'bonuses': {'+strength': 10, '+cull': .1}, 'icon': assassinIcon},
        'cripple': {name: 'Cripple', 'bonuses': {'+strength': 10, '+dexterity': 10}, 'icon': assassinIcon,
                'onCritEffect': {'variableObjectType': 'trigger', 'bonuses': {'$debuff': debuffEffect({}, {'+*speed': .5, '+*attackSpeed': .5, '+duration': 5, '+maxStacks': 1})}}},
    'darkknightIndex': {name: '---Dark Knight---'},
        'darkknight': {name: 'Blood Lust', 'bonuses': {'+overHeal': .5, '+lifeSteal': .05}},
        'consume': {name: 'Consume', 'bonuses': {'+intelligence': 5}, 'action': skills.consume},
        'soulStrike': {name: 'Soul Strike', 'bonuses': {'+strength': 10}, 'action': skills.soulStrike},
        'reaper': {name: 'Reaper', 'bonuses': {'+intelligence': 10, '+strength': 5, '+consume:count': 1, '+consume:duration': 10}, 'icon': darkknightIcon,
            'helpText': 'Gain the powers of consumed monsters for a short period.'},
    'bardIndex': {name: '---Bard---'},
        'bard': {name: 'Charisma', 'bonuses': {'*minion:cooldown': .6, '+minion:limit': 1, '*song:duration': 1.5, '+buff:area': 8}},
        'attackSong': {name: 'Furious Tocatta', 'bonuses': {'+dexterity': 10}, 'action': skills.attackSong},
        'defenseSong': {name: 'Rondo of Hope', 'bonuses': {'+intelligence': 10}, 'action': skills.defenseSong},
        'heroSong': {name: 'Hero\'s Ballade', 'bonuses': {'+intelligence': 10, '+dexterity': 10}, 'action': skills.heroSong},
'tier5Index': {name: '------Tier 5------'},
    'sniperIndex': {name: '---Sniper---'},
        'sniper': {name: 'Sharp Shooter', 'bonuses': {'*bow:critChance': 1.5, '*bow:critDamage': 1.5, '$bow:criticalPiercing': 'Critical strikes hit multiple enemies.'}},
        'powerShot': {name: 'Power Shot', 'bonuses': {'+dexterity': 5}, 'action': skills.powerShot},
        'powerShotKnockback': {name: 'Power Shot Knockback', 'bonuses': {'+dexterity': 5, '+strength': 5, '+powerShot:knockbackChance': 1, '+powerShot:knockbackDistance': 5}},
        'aiming': {name: 'Aiming', 'action': skills.aiming},
        'snipe': {name: 'Snipe', 'bonuses': {'+dexterity': 15}, 'action': skills.snipe},
    'samuraiIndex': {name: '---Samurai---'},
        'samurai': {name: 'Great Warrior', 'bonuses': {'+twoHanded:melee:physical': [2, '*', '{level}'], '+twoHanded:melee:block': [2, '*', '{level}'], '+twoHanded:melee:magicBlock': '{level}'}},
        'sideStep': {name: 'Side Step', 'bonuses': {'+evasion': 2}, 'reaction': skills.sideStep},
        'dragonSlayer': {name: 'Dragon Slayer', 'bonuses': {'+strength': 10}, 'action': skills.dragonSlayer},
        'armorPenetration': {name: 'Penetrating Strikes', 'bonuses': {'+strength': 15, '+melee:armorPenetration': .3}},
    'sorcerorIndex': {name: '---Sorceror---'},
        'raiseDead': {name: 'Raise Dead', 'bonuses': {'+intelligence': 5}, 'action': skills.raiseDead},
        'drainLife': {name: 'Drain Life', 'bonuses': {'+intelligence': 10}, 'action': skills.drainLife},
        'plague': {name: 'Plague', 'bonuses': {'+intelligence': 15}, 'action': skills.plague},
'tier6Index': {name: '------Tier 6------'},
    'ninjaIndex': {name: '---Ninja---'},
        'ninja': {name: 'Ninjutsu', 'bonuses':{'$cloaking': 'Invisible while moving', '$oneHanded:doubleStrike': 'Attacks hit twice'}},
        'smokeBomb': {name: 'Smoke Bomb', 'bonuses': {'+dexterity': 10}, 'reaction': skills.smokeBomb},
        'throwWeapon': {name: 'Throw Weapon', 'bonuses': {'+strength': 10}, 'action': skills.throwWeapon},
        'shadowClone': {name: 'Shadow Clone', 'bonuses': {'+strength': 10, '+dexterity': 10}, 'reaction': skills.shadowClone,
            'minionBonuses': {'*shadowClone:maxHealth': .1, '*shadowClone:damage': .1, '$shadowClone:tint': 'black',
                              '$shadowClone:tintMinAlpha': 0.7, '$shadowClone:tintMaxAlpha': .9}},
    'enhancerIndex': {name: '---Enhancer---'},
        'enhancer': {name: 'Enhance Spirit', 'bonuses': {'*dexterity': 2, '*strength': 2, '*intelligence': 2}},
        'enhanceWeapon': {name: 'Enhance Weapon', 'bonuses': {'+strength': 10, '+intelligence': 5}, 'action': skills.enhanceWeapon},
        'enhanceArmor': {name: 'Enhance Armor', 'bonuses': {'+strength': 5, '+intelligence': 10}, 'action': skills.enhanceArmor},
        'enhanceAbility': {name: 'Enhance Ability', 'bonuses': {'+strength': 10, '+intelligence': 10}, 'action': skills.enhanceAbility},
    'sageIndex': {name: '---Sage---'},
        'sage': {name: 'Profound Insight', 'bonuses': {'*cooldown': .5}},
        'stopTime': {name: 'Temporal Shield', 'bonuses': {'+intelligence': 10}, 'reaction': skills.stopTime},
        'dispell': {name: 'Dispell', 'bonuses': {'+intelligence': 15}, 'action': skills.dispell},
        'meteor': {name: 'Meteor', 'bonuses': {'+intelligence': 20}, 'action': skills.meteor},
        'meteorShower': {name: 'Meteor Shower', 'bonuses': {'+intelligence': 10, '+meteor:count': ['{intelligence}', '/', '50'],
                        '-meteor:area': ['{intelligence}', '/', '400'], '-meteor:power': ['{magicPower}', '/', '4']},
                        'helpText': 'Summon many more, but less powerful meteors.'},
        'meteorPower': {name: 'Meteor Power', 'bonuses': {'+intelligence': 10, '-meteor:count': ['{intelligence}', '/', '200'],
                        '+meteor:area': ['{intelligence}', '/', '100'], '+meteor:power': ['{magicPower}']},
                        'helpText': 'Summon fewer, but much more powerful meteors.'},
'tier7Index': {name: '------Tier 7------'},
    'masterIndex': {name: '---Master---'},
        'equipmentMastery': {name: 'Equipment Mastery', 'bonuses': {'+strength': 5, '+dexterity': 5, '+intelligence': 5, '$equipmentMastery': 'Equip gear beyond your level for a 10% penalty per level.'}},
        'abilityMastery': {name: 'Ability Mastery', 'bonuses': {'+strength': 10, '+dexterity': 10, '+intelligence': 10, '+instantCooldownChance': .1}},
    'foolIndex': {name: '---Fool---'},
        'tomFoolery': {name: 'Tom Foolery', 'bonuses': {'+evasion': 5}, 'reaction': skills.tomFoolery},
        'mimic': {name: 'Mimic', 'reaction': skills.mimic},
        'decoy': {name: 'Decoy', 'reaction': skills.decoy,
                    'minionBonuses': {'*decoy:maxHealth': .4, '*decoy:damage': .4, '*decoy:speed': 1.2, '$decoy:tint': 'red',
                              '$decoy:tintMinAlpha': 0.5, '$decoy:tintMaxAlpha': .6}},
        'explode': {name: 'Decoy Burst', 'reaction': skills.explode},
'enemyIndex': {name: '---Enemies---'},
    'summoner': {name: 'Summoner', 'bonuses': {'*minion:limit': 2, '*minion:cooldown': .5},
            'minionBonuses': {'*maxHealth': 1.5, '*weaponDamage': 1.2}},
    'summonSkeleton': {name: 'Summon Skeleton', 'action': skills.summonSkeleton},
    'summonCaterpillar': {name: 'Spawn', 'action': skills.summonCaterpillar},
    'rangeAndAttackSpeed': {name: 'Range And Attack Speed', 'bonuses': {'+range': 2, '+attackSpeed': .5}},
    'dodgeHook': {name: 'Dodge then Hook', 'bonuses': {'$dodge:instantCooldown': 'hook'}},
    'spellAOE': {name: 'Spell AOE', 'bonuses': {'+spell:area': 20}},
    'slowSpells': {name: 'Slow Spells', 'bonuses': {'*spell:cooldown': 1.2}},
    'chargeKnockback': {name: 'Charge Knockback', 'bonuses': {'+charge:knockbackChance': 1, '+charge:knockbackDistance': 10, '+charge:knockbackRotation': 30}},
    'stealth': {name: 'Stealth', 'bonuses':{'$cloaking': 'Invisible while moving'}},
    'dodgeNetReflect': {name: 'Dodge then Hook', 'bonuses': {'$dodge:instantCooldown': 'net', '$net:instantCooldown': 'reflect'}},
    'poison': {name: 'Poison', 'onHitEffect': {'variableObjectType': 'trigger', 'bonuses': {'$debuff': debuffEffect({}, {'+*healthRegen': 0, '++damageOverTime': '{level}', '+duration': 3})}}},
    'enemyDancing': {name: 'Dancing', 'reaction': skills.evadeAndCounter},
    'consumeRange': {name: 'Consume Range', 'bonuses': {'+consume:range': 5}},
    'consumeRatio': {name: 'Consume Range', 'bonuses': {'+consume:consumeRatio': .5}},
    'howl': {name: 'Howl', 'action': skills.howl},
    'howlSingAttack': {name: 'Howl Sing Attack', 'bonuses': {'$howl:instantCooldown': 'attackSong', '$attackSong:instantCooldown': 'sicem'}},
};
var testJob;// = 'blackbelt';
var testAbilities = [];
//var testAbilities = [abilities.charge];
//var testAbilities = [abilities.counterAttack, abilities.fistParadigmShift, abilities.counterChance, abilities.counterPower];
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
//var testAbilities = [abilities.majorIntelligence, abilities.majorIntelligence, abilities.meteor, abilities.meteorShower, abilities.meteorPower];
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
