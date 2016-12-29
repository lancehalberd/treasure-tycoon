
//Back/Neck/Waist
addItem(1, {'slot': 'back', 'type': 'cloak', 'name': 'Plain Cloak', 'bonuses': {'+evasion': 1, '+armor': 1, '+maxHealth': 6}, icon: 'cloak'});
addItem(2, {'slot': 'back', 'type': 'quiver', 'restrictions': ['ranged', 'physical'], 'name': 'Simple Quiver', 'bonuses': {'+minWeaponPhysicalDamage': 2, '+maxWeaponPhysicalDamage': 4}, icon: 'quiver'});
addItem(3, {'slot': 'back', 'type': 'baldric', 'restrictions': ['melee', 'physical'], 'name': 'Worne Baldric', 'bonuses': {'+minWeaponPhysicalDamage': 2, '+maxWeaponPhysicalDamage': 3}, icon: 'scabbard'});
addItem(4, {'slot': 'back', 'type': 'amulet', 'restrictions': ['magic'], 'name': 'Choker', 'bonuses': {'+minWeaponMagicDamage': 1, '+maxWeaponMagicDamage': 2}, icon: 'amulet'});
addItem(15, {'slot': 'back', 'type': 'cloak', 'name': 'Travelers Cloak', 'bonuses': {'+evasion': 10}, icon: 'cloak'});
addItem(16, {'slot': 'back', 'type': 'cloak', 'name': 'Fur Cloak', 'bonuses': {'+block': 10}, icon: 'cloak'});
addItem(17, {'slot': 'back', 'type': 'cloak', 'name': 'Plated Cloak', 'bonuses': {'+armor': 10}, icon: 'cloak'});
addItem(21, {'slot': 'back', 'type': 'quiver', 'restrictions': ['bow'], 'name': 'Neverending Quiver', 'bonuses': {'+minPhysicalDamage': 130, '+maxPhysicalDamage': 150}, icon: 'quiver'});
addItem(22, {'slot': 'back', 'type': 'sheath', 'restrictions': ['sword'], 'name': 'Runed Scabbard', 'bonuses': {'+minPhysicalDamage': 50, '+maxPhysicalDamage': 75}, icon: 'scabbard'});
addItem(23, {'slot': 'back', 'type': 'bandolier', 'restrictions': ['throwing'], 'name': 'Bandolier', 'bonuses':{'+minPhysicalDamage': 55, '+maxPhysicalDamage': 80}, icon: 'quiver'});
addItem(24, {'slot': 'back', 'type': 'baldric', 'restrictions': ['axe'], 'name': 'Heavy Baldric', 'bonuses': {'+minPhysicalDamage': 75, '+maxPhysicalDamage': 120}, icon: 'scabbard'});
addItem(25, {'slot': 'back', 'type': 'amulet', 'restrictions': ['wand'], 'name': 'Runed Amulet', 'bonuses': {'+minMagicDamage': 25, '+maxMagicDamage': 40}, icon: 'amulet'});
addItem(26,{'slot': 'back', 'type': 'sheath', 'restrictions': ['dagger'], 'name': 'Etched Sheath', 'bonuses':{'+minPhysicalDamage': 45, '+maxPhysicalDamage': 70}, icon: 'scabbard'});
addItem(27, {'slot': 'back', 'type': 'sheath', 'restrictions': ['polearm'], 'name': 'Cover', 'bonuses':{'+minPhysicalDamage': 120, '+maxPhysicalDamage': 150}, icon: 'scabbard'});
addItem(28, {'slot': 'back', 'type': 'sheath', 'restrictions': ['greatsword'], 'name': 'Large Scabbard', 'bonuses':{'+minPhysicalDamage': 110, '+maxPhysicalDamage': 135}, icon: 'scabbard'});
addItem(29, {'slot': 'back', 'type': 'amulet', 'restrictions': ['staff'], 'name': 'Heavy Amulet', 'bonuses': {'+minMagicDamage': 40, '+maxMagicDamage': 60}, icon: 'amulet'});

//Rings
addItem(1, {'slot': 'ring', 'type': 'ring', 'name': 'Iron Band', 'bonuses': {'+minWeaponPhysicalDamage': 2, '+maxWeaponPhysicalDamage': 4}, 'source': equipmentSources.ring, icon: 'band'});
addItem(2, {'slot': 'ring', 'type': 'ring', 'name': 'Gold Band', 'bonuses': {'+minWeaponMagicDamage': 1, '+maxWeaponMagicDamage': 2}, 'source': equipmentSources.ring, icon: 'band'});
addItem(4, {'slot': 'ring', 'type': 'ring', 'name': 'Ruby Ring', 'bonuses': {'+strength': 6}, 'source': equipmentSources.ring, icon: 'ring'});
addItem(5, {'slot': 'ring', 'type': 'ring', 'name': 'Emerald Ring', 'bonuses': {'+dexterity': 6}, 'source': equipmentSources.ring, icon: 'ring'});
addItem(6, {'slot': 'ring', 'type': 'ring', 'name': 'Sapphire Ring', 'bonuses': {'+intelligence': 6}, 'source': equipmentSources.ring, icon: 'ring'});
addItem(10, {'slot': 'ring', 'type': 'ring', 'name': 'Etched Band', 'bonuses': {'+magicBlock': 10}, 'source': equipmentSources.bracelet, icon: 'band'});
addItem(12, {'slot': 'ring', 'type': 'ring', 'name': 'Topaz Ring', 'bonuses': {'+strength': 3, '+dexterity': 3}, 'source': equipmentSources.ring, icon: 'ring'});
addItem(13, {'slot': 'ring', 'type': 'ring', 'name': 'Aquamarine Ring', 'bonuses': {'+intelligence': 3, '+dexterity': 3}, 'source': equipmentSources.ring, icon: 'ring'});
addItem(14, {'slot': 'ring', 'type': 'ring', 'name': 'Amethyst Ring', 'bonuses': {'+strength': 3, '+intelligence': 3}, 'source': equipmentSources.ring, icon: 'ring'});
addItem(19, {'slot': 'ring', 'type': 'ring', 'name': 'Diamond Ring', 'bonuses': {'+strength': 2, '+dexterity': 2, '+intelligence': 2}, 'source': equipmentSources.ring, icon: 'ring'});
addItem(20, {'slot': 'ring', 'type': 'ring', 'name': 'Jade Band', 'bonuses': {'+healthRegen': 5}, 'source': equipmentSources.bracelet, icon: 'band'});
addItem(22, {'slot': 'ring', 'type': 'ring', 'name': 'Meteoric Band', 'bonuses': {'%physicalDamage': 0.2}, 'source': equipmentSources.bracelet, icon: 'band'});
addItem(23, {'slot': 'ring', 'type': 'ring', 'name': 'Orichalcum Band', 'bonuses': {'%magicDamage': 0.2}, 'source': equipmentSources.bracelet, icon: 'band'});
addItem(24, {'slot': 'ring', 'type': 'ring', 'name': 'Adamantium Band', 'bonuses': {'%melee:damage': 0.2}, 'source': equipmentSources.bracelet, icon: 'band'});
addItem(25, {'slot': 'ring', 'type': 'ring', 'name': 'Dragonbone Band', 'bonuses': {'%ranged:damage': 0.2}, 'source': equipmentSources.bracelet, icon: 'band'});