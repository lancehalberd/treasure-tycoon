<?php
    $version = '0.8';
    function addScripts($scriptNames) {
        foreach ($scriptNames as $scriptName) {
            $version = hash_file('md5', $scriptName);
            ?>
<script src="<?=  $scriptName . '?v=' . $version ?>"></script><?php
        }
    }
?>
<html>
<head>
    <style type="text/css" >
        .pagebody {
            background-color: black;
            background-repeat: repeat;
            font-size: 16px;
            font-family: 'kingthings_calligraphica_2Rg', Georgia, serif;
        }
        .mainGame {
            position: relative;
            margin-left: auto;
            margin-right: auto;
            padding-top: 10px;
            width: 800px;
            min-height: 600px;
            background-color: black;
            background-repeat: repeat;
            top: 0px;
            -moz-user-select: none;
            -khtml-user-select: none;
            -webkit-user-select: none;
            -o-user-user-select: none;
            cursor: default;
        }
        .loading {
            font-size: 50px;
            color: white;
        }
        .stat {
            display: inline-block;
            width: 200px;
            margin-right: 20px;
        }
    </style>
    <script>
        var assetVersion = '<?= $version ?>';
    </script>
    <link rel="stylesheet" type="text/css" href="styles.css?v=<?= hash_file('md5', 'styles.css') ?>"/>
    <script src="lib/jquery.min.js"></script>
    <script src="lib/jstorage.min.js"></script>
    <script src="lib/async.js"></script>
    <title>Treasure Tycoon</title>
</head>
<body class="pagebody">

<div class="js-mainGame js-mouseContainer mainGame">
    <div class="js-loading loading" style="display: none">
        Loading...
    </div>
    <script>
        // Only show the loading text if it takes more than .2 seconds to load
        setTimeout(function () {
            if (!$('.js-gameContent').is(':visible')) {
                $('.js-loading').show();
            }
        }, 200);
    </script>
    <div class="js-gameContent gameContent" style="display: none">
        <div class="js-jewelContext js-itemContext pointsBarPadding"> </div>
        <div class="js-mainCanvasContainer mainCanvasContainer js-adventureContext js-guildContext js-mapContext">
            <canvas class="js-mainCanvas mainCanvas" width="800" height="600" style="background-color: blue;"></canvas>
            <div class="js-editingControls editingControlsTop" style="display: none">
                <select class="js-levelSelect"></select>
                <input class="js-levelNameInput" placeholder="Level Name" />
                <select class="js-levelBackgroundSelect"></select>
                <select class="js-levelSkillSelect levelSkillSelect"></select>
                <textarea class="js-levelDescriptionInput levelDescriptionInput" rows="8" cols="40" placeholder="Level Description"></textarea>
            </div>
            <div class="js-adventureControls js-adventureContext adventureControls" style="display: none;">
                <span class="js-autoplayButton icon autoplayButton adventureButton" helptext="Auto Explore"></span>
                <span class="js-repeatButton icon repeatButton adventureButton" helptext="Repeat this adventure"></span>
                <span class="js-fastforwardButton icon fastforwardButton adventureButton" helptext="Fast Forward"></span>
                <span class="js-pauseButton icon pauseButton adventureButton" helptext="Pause this adventure"></span>
                <span class="js-slowMotionButton icon slowMotionButton adventureButton" helptext="Slow Motion"></span>
                <span class="js-shrineButton icon shrineButton adventureButton" helptext="Visit Shrines" style="display: none;"></span>
            </div>
            <div class="js-editingControls editingControlsBottom" style="display: none">
                <div class="levelEditingSection">Test Characters: <select class="js-testCharacters"></select><button class="js-testLevel">Test</button></div>
                <div class="levelEditingSection">Monsters: <span class="js-monsters"><select class="js-monsterSelect"></select></span></div>
                <div class="levelEditingSection">Enemy Skills: <span class="js-enemySkills"><select class="js-enemySkillSelect"></select></span></div>
                <div class="levelEditingSection">Events:
                    <ol class="js-levelEvents"></ol>
                    <ul><li><button class="js-addLevelEvent editEventButton">+</button></li></ul>
                </div>
            </div>
        </div>
        <div class="js-adventureContext" style="height: 300px;"></div>
        <div class="js-characterColumn displayColumn characterColumn js-jewelContext js-itemContext">
            <div class="js-stats stats playerBox js-jewelContext js-itemContext">
                <div style="position: absolute; left: 5px; top: 0px;">Level <span class="js-playerLevel">X</span> <span class="js-playerName controlBarEntry">X</span></div>
                <canvas class="js-canvas js-previewCanvas" width="64" height="128" style="position: absolute; left: 0px; top: 20px;"></canvas>
                <div>
                    <span class="playerStat"><span helptext="Starting health for each adventure."><span class="icon health"></span> <span class="js-maxHealth">X</span></span>
                    <span style="font-size: 12px" helptext="How fast your adventurer regenerates health.">(<span class="js-healthRegen" >X</span>)</span></span>
                    <span class="playerStat" helptext="How famous this adventurer is. Famous adventurers are more powerful but also more expensive.<br/> Hiring and retiring famous adventurers increases the fame of your guild.">
                        <span class="icon fame"></span> <span class="js-fame">X</span>
                    </span>
                </div>
                <div>
                    <span class="playerStat"><span class="icon damage"></span> <span class="js-damage">X</span></span>
                    <span helptext="Higher range will let you attack enemies safely from afar."><span class="icon range"></span> <span class="js-range">X</span></span>
                </div>
                <div>
                    <span  class="playerStat"><span class="icon protection"></span> <span class="js-protection" style="margin-right: 5px;">X</span></span>
                    <span  class="playerStat"><span class="icon protection"><span class="icon iconLayer magic" style="opacity: .7;"></span></span> <span class="js-resistance">X</span></span>
                </div>
                <div>
                    <span class="playerStat"><span class="icon damage"><span class="icon iconLayer no" style="opacity: .7;"></span></span> <span class="js-evasion">X</span></span>
                    <span class="playerStat" helptext="How fast your adventurer moves"><span class="icon speed"></span> <span class="js-speed">X</span></span>
                </div>
                <div style="float: right; margin-right: 5px; margin-top: 10px;"><button class="js-retire" style="display: none;" helptext="Permanently remove this adventurer from your guild.">Retire</button></div>
                <div class="triStatBox">
                    <div class="js-dexterity dexterity" helptext="Dexterity increases attack speed, evasion and damage with ranged weapons.">X</div>
                    <div class="js-strength strength" helptext="Strength increases physical damage, health and damage with melee weapons.">X</div>
                    <div class="js-intelligence intelligence" helptext="Intelligence increases accuracy, block and magic block and damage with magic weapons.">X</div>
                </div>
            </div><div class="js-equipment equipment playerBox js-itemContext">
                <div class="js-head js-itemSlot itemSlot head"><div class="js-placeholder placeholder icon helmet" helptext="Head"></div></div>
                <div class="js-body js-itemSlot itemSlot body"><div class="js-placeholder placeholder icon heavyArmor" helptext="Body"></div></div>
                <div class="js-arms js-itemSlot itemSlot arms"><div class="js-placeholder placeholder icon gloves" helptext="Hands"></div></div>
                <div class="js-weapon js-itemSlot itemSlot weapon"><div class="js-placeholder placeholder icon sword" helptext="Weapon"></div></div>
                <div class="js-offhand js-itemSlot itemSlot offhand"><div class="js-placeholder placeholder icon heavyShield" helptext="Offhand"></div></div>
                <div class="js-legs js-itemSlot itemSlot legs"><div class="js-placeholder placeholder icon pants" helptext="Legs"></div></div>
                <div class="js-feet js-itemSlot itemSlot feet"><div class="js-placeholder placeholder icon feet" helptext="Feet"></div></div>
                <div class="js-back js-itemSlot itemSlot back"><div class="js-placeholder placeholder icon cloak" helptext="Back"></div></div>
                <div class="js-ring js-itemSlot itemSlot ring"><div class="js-placeholder placeholder icon band" helptext="Ring"></div></div>
        </div><div class="js-jewelBonuses js-jewelContext jewelBonuses"><div class="panelTitle" style="text-align: center;">Jewel Bonuses</div><div class="js-content"></div></div>
        </div><div class="displayColumn jewelColumn js-jewelContext"><div class="jewelOptions">
            <button class="js-jewelSortRuby">Ruby</button>
            <button class="js-jewelSortEmerald">Emerald</button>
            <button class="js-jewelSortSaphire">Saphire</button>
            <br/>
            <button class="js-jewelSortTopaz">Topaz</button>
            <button class="js-jewelSortAquamarine">Aquamarine</button>
            <button class="js-jewelSortAmethyst">Amethyst</button>
            <br/>
            <button class="js-jewelSortDiamond">Diamond</button>
            <button class="js-jewelSortQuality">Quality</button>
            <br/>
            Tier: <label class="js-jewelTier1 js-jewelTierLabel" helptext="Toggle display of Tier 1 (Level 1) Jewels"><input type="checkbox" checked="checked" value="1"/> 1</label>
            <label class="js-jewelTier2 js-jewelTierLabel" helptext="Toggle display of Tier 2 (Level 10) Jewels"><input type="checkbox" checked="checked" value="2"/> 2</label>
            <label class="js-jewelTier3 js-jewelTierLabel" helptext="Toggle display of Tier 3 (Level 20) Jewels"><input type="checkbox" checked="checked" value="3"/> 3</label>
            <label class="js-jewelTier4 js-jewelTierLabel" helptext="Toggle display of Tier 4 (Level 40) Jewels"><input type="checkbox" checked="checked" value="4"/> 4</label>
            <label class="js-jewelTier5 js-jewelTierLabel" helptext="Toggle display of Tier 5 (Level 60) Jewels"><input type="checkbox" checked="checked" value="5"/> 5</label>
        </div><div class="js-jewelInventory jewel-inventory"></div></div><div class="js-jewelColumn displayColumn js-jewelContext">
            <div class="js-jewelBoard jewelBoard">
                <canvas class="js-canvas js-skillCanvas" width="320" height="320"></canvas>
                <div class="js-augmentConfirmationButtons augmentConfirmationButtons">
                    <button class="js-confirmSkill confirmSkill" helptext="Finalize augmentation"><span class="icon confirm"></span></button>
                    <button class="js-cancelSkill cancelSkill" helptext="Cancel this augmentation"><span class="icon cancel"></span></button>
                </div>
            </div>
            <div class="js-jewelPanel infoPanel jewelCrafting">
                <div class="panelTitle" style="text-align: center;">Altar of Creation</div>
                <div style="text-align: center;">
                    <div class="js-jewelCraftingSlot js-jewelCraftingSlotA jewelCraftingSlot mainJewelCraftingSlot" helptext="Drag a jewel here to craft."></div>
                    <div class="js-jewelCraftingSlot js-jewelCraftingSlotB jewelCraftingSlot mainJewelCraftingSlot" helptext="Drag a jewel here to craft."></div>
                </div>
                <button class="js-jewelCraftingButton centered" style="display: none;">Split</button>
                <button class="js-jewelDeformationButton centered" style="display: none;">Expand</button>
                <button class="js-sellItem sellItem" disabled helptext="Drag items here to sell them. <br/> You can also hover over an item and type 'S' to sell quickly."><div class="icon money"></div></button>
                <div class="extraJewelSlots">
                    <div class="js-jewelCraftingSlot jewelCraftingSlot"></div>
                    <div class="js-jewelCraftingSlot jewelCraftingSlot"></div>
                    <div class="js-jewelCraftingSlot jewelCraftingSlot"></div>
                    <div class="js-jewelCraftingSlot jewelCraftingSlot"></div>
                </div>
            </div>
        </div><div class="js-itemPanel itemPanel js-itemContext">
            <div class="js-itemCrafting itemCrafting">
                <div class="panelTitle">Shrine of Fortune</div>
                <div class="craftingHelp">Offer coins for blessings from The Goddess</div>
                <div class="craftingCanvasContainer">
                    <canvas class="js-craftingCanvas craftingCanvas" height="210" width="1100" style="background-color: white;"></canvas>
                    <div class="js-craftingSelectOptions craftingSelectOptions" style="display: none;">
                        <div class="craftingSelectOptionsAligner">
                            Receive Your Blessing
                            <div class="js-reforge itemCraftingOption centerSlot"><div class="icon anvil"></div></div>
                            <div class="js-itemSlot itemSlot bottomLeftSlot"></div>
                            <div class="js-itemSlot itemSlot topSlot"></div>
                            <div class="js-itemSlot itemSlot bottomRightSlot"></div>
                        </div>
                    </div>
                </div>
                <div class="craftingHelp">Complete harder areas to unlock higher equipment levels.</div>
            </div>
            <div class="js-inventory displayColumn inventory"><div class="js-inventorySlot js-itemSlot itemSlot inventorySlot" helptext="Drag an item here to move it into your inventory."></div></div>
            <div class="js-enchantmentOptions enchantmentOptions">
                <div class="js-enchantmentSlot js-itemSlot itemSlot centerSlot"></div>
                <div class="js-enchant enchantingOption topSlot"><div class="icon wand"></div></div>
                <div class="js-mutate enchantingOption leftSlot"><div class="icon bag"></div></div>
                <div class="js-imbue enchantingOption rightSlot"><div class="icon enchanting"></div></div>
                <div class="js-resetEnchantments enchantingOption bottomSlot"><div class="icon anvil"></div></div>
                <button class="js-sellItem sellItem" disabled helptext="Drag items here to sell them. <br/> You can also hover over an item and type 'S' to sell quickly."><div class="icon money"></div></button>
            </div>
        </div>
        <div class="js-charactersBox points charactersBox" helptext="Divinity can be used at shrines to level up and gain new bonuses and abilities. <br/><br/> Completing new adventures grants divinity and access to the shrine for that area. <br/><br/> Leveling allows you to equip more powerful gear and increases health and basic stats slightly.">
            <div class="js-divinityPoints divinityPoints">
                <div class="pointsIcon"><span class="icon divinity"></span></div>
                <div class="pointsColumn">
                    <span class="js-global-divinity divinity">1000</span>
                    <br/>
                    <span class="js-amount" style="display: none;">-200</span>
                    <hr class="js-bottomLine bottomLine" style="display: none;">
                    <span class="js-balance divinity" style="display: none;">800</span>
                </div>
            </div>
        </div>
        <div class="js-pointsBar pointsBar">
            <div class="points" helptext="The fame of your guild effects how powerful your guild recruits will be and how much you will have to pay to recruit them.<br/><br/>Fame is gained by leveling adventurers and completing new areas.<br/>Hiring famous adventurers also increases the fame of your guild.">
                <div class="pointsIcon"><span class="icon fame"></span></div>
                <div class="pointsColumn">
                    <span class="js-global-fame fame">1000</span>
                    <br/>
                    <span class="js-amount" style="display: none;">-200</span>
                    <hr class="js-bottomLine bottomLine" style="display: none;">
                    <span class="js-balance fame" style="display: none;">800</span>
                </div>
            </div>
            <div class="points js-coinsContainer" helpText>
                <div class="pointsIcon"><span class="icon coin"></span></div>
                <div class="pointsColumn">
                    <span class="js-global-coins coin">1000</span>
                    <br/>
                    <span class="js-amount" style="display: none;">-200</span>
                    <hr class="js-bottomLine bottomLine" style="display: none;">
                    <span class="js-balance coin" style="display: none;">800</span>
                </div>
            </div>
            <div class="points" helptext="Anima is used to enchant items with special powers.<br/>Anima is absorbed from defeated enemies and salvaged from gems.">
                <div class="pointsIcon"><span class="icon anima"></span></div>
                <div class="pointsColumn">
                    <span class="js-global-anima anima">1000</span>
                    <br/>
                    <span class="js-amount" style="display: none;">-200</span>
                    <hr class="js-bottomLine bottomLine" style="display: none;">
                    <span class="js-balance anima" style="display: none;">800</span>
                </div>
            </div>
        </div>
        <div class="js-areaMenu areaMenu" style="display: none;">
            <div class="js-areaTitle areaTitle">Dark Forest</div>
            <div class="areaDifficulties">
                <div class="js-easyDifficulty difficulty easy" helptext="Enemies are weaker on easy mode but you will receive 20% less coins, anima and divinity.">
                    <div class="js-areaMedal icon bronzeMedal areaMedal"></div>Easy x0.8</div>
                <div class="js-normalDifficulty difficulty normal">
                    <div class="js-areaMedal icon silverMedal areaMedal"></div>Normal x1</div>
                <div class="js-hardDifficulty difficulty hard" helptext="Enemies are much stronger on hard mode but you will receive 50% more coins, anima and divinity.">
                    <div class="js-areaMedal icon goldMedal areaMedal"></div>Hard x1.5</div>
                <div class="js-challengeDifficulty difficulty challenge">Challenge</div>
                <div class="js-endlessDifficulty difficulty endless" helptext="This difficulty will gets harder each time you complete it and easier each time you fall.">Endless</div>
            </div>
            <div class="js-areaDescription areaDescription">
                Beware! The venom from the spiders in these woods will suppress your health regeneration.
            </div>
        </div>
        <div class="js-heroApplication heroApplication singleHeroApplication" style="display: none;">
            <div class="heroApplicationBody"><div class="js-stats stats playerBox">
                    <div style="position: absolute; left: 35px; top: 0px;"><span class="js-playerName controlBarEntry">X</span></div>
                    <canvas class="js-canvas js-previewCanvas" width="64" height="128" style="position: absolute; left: -2px; top: 0px;"></canvas>
                    <span helptext="How famous this adventurer is. Famous adventurers are more powerful but also more expensive.<br/> Hiring famous adventurers increases the fame of your guild.">
                        <span class="icon fame"></span> <span class="js-fame">X</span>
                    </span>
                    <span helptext="Starting health for each adventure."><span class="icon health"></span> <span class="js-maxHealth">X</span></span>
                    <div style="position: relative; overflow: hidden; height: 160px; width: 160px;">
                        <canvas class="js-canvas js-skillCanvas" width="360" height="360" style="width: 360px; height: 360px; position: relative; left: -80px; top: -80px; opacity: .6"></canvas>
                    </div>
                    <div class="statGrowth">
                        <div class="js-dexterityGrowth statGrowthBar dexterity" helptext="Dexterity increases attack speed, evasion and damage with ranged weapons."></div>
                        <div class="js-strengthGrowth statGrowthBar strength" helptext="Strength increases physical damage, health and damage with melee weapons."></div>
                        <div class="js-intelligenceGrowth statGrowthBar intelligence" helptext="Intelligence increases accuracy, block and magic block and damage with magic weapons."></div>
                    </div>
                </div>
                <p><button class="js-hireApplicant heroApplicationButton" helptext>Hire <span class="js-hirePrice"></span></button></p>
                <p><button class="js-seekNewApplicant heroApplicationButton" helptext="Seek another guild applicant. Completing adventures will reduce this price.">Seek Another <span class="js-seekPrice"></span></button></p>
            </div>
        </div>
    </div>
</div>
</body>
<?php
addScripts(['utils.js', 'mouse.js', 'drawDashedRectangle.js', 'images.js', 'bonuses.js',
    'drawJewel.js', 'drawBoard.js', 'inventory.js', 'armor.js', 'weapons.js', 'accessories.js',
    'evaluate.js','helpText.js','jewels.js','jewel-inventory.js','skills.js','abilities.js',
    'loot.js','boards.js', 'character.js', 'jobs.js', 'achievements.js', 'crafting.js','enchanting.js','uniques.js',
    'heroApplication.js', 'effects.js','performAttack.js','useSkill.js',
    'adventure.js', 'drawAdventure.js', 'monsters.js','levels.js','vector.js',
    'sphereVector.js','camera.js','mapData.js', 'map.js', 'furniture.js', 'guild.js', 'drawMap.js','editLevel.js',
    'polygon.js','backgrounds.js', 'testCharacters.js','saveGame.js','main.js']);
?>
</html>
<?php
