function pasteCharacterToClipBoard(character) {
    var $textarea = $tag('textarea');
    $('body').append($textarea);
    $textarea.val(JSON.stringify(exportCharacter(character)));
    $textarea[0].select();
    console.log('Attempting to export character to clipboard: ' + document.execCommand('copy'));
    $textarea.remove();
}

var testCharacters = [
    {"adventurer":{"equipment":{"weapon":{"itemKey":"cestus","itemLevel":2,"prefixes":[],"suffixes":[],"unique":false},"body":{"itemKey":"woolshirt","itemLevel":1,"prefixes":[],"suffixes":[],"unique":false},"feet":{"itemKey":"brokensandals","itemLevel":1,"prefixes":[],"suffixes":[],"unique":false},"head":{"itemKey":"strawhat","itemLevel":1,"prefixes":[],"suffixes":[],"unique":false},"offhand":{"itemKey":"woodenbowl","itemLevel":1,"prefixes":[],"suffixes":[],"unique":false},"arms":{"itemKey":"tornmittens","itemLevel":1,"prefixes":[],"suffixes":[],"unique":false},"legs":{"itemKey":"tatteredshorts","itemLevel":1,"prefixes":[],"suffixes":[],"unique":false},"back":{"itemKey":"quiver","itemLevel":1,"prefixes":[],"suffixes":[],"unique":false},"ring":{"itemKey":"ironband","itemLevel":1,"prefixes":[],"suffixes":[],"unique":false}},"hairOffset":6,"jobKey":"warrior","level":2,"name":"Hillary"},"board":{"fixed":[{"abilityKey":"warrior","shape":{"shapeKey":"diamond","x":145,"y":160,"rotation":300},"confirmed":true,"disabled":false},{"abilityKey":"vitality","shape":{"shapeKey":"triangle","x":204.99999999999997,"y":160,"rotation":60},"confirmed":true,"disabled":false}],"jewels":[{"tier":1,"quality":1.080809428040149,"components":[0.7894736842105263,0.14035087719298245,0.07017543859649122],"shape":{"shapeKey":"triangle","x":159.99999999999997,"y":134.01923788646687,"rotation":0}},{"tier":1,"quality":1.1155168638424982,"components":[0.7692307692307693,0.15384615384615385,0.07692307692307693],"shape":{"shapeKey":"triangle","x":129.99999999999994,"y":134.0192378864669,"rotation":0}},{"tier":1,"quality":1.1540653119571844,"components":[0.14655172413793102,0.07758620689655173,0.7758620689655172],"shape":{"shapeKey":"triangle","x":174.99999999999991,"y":159.99999999999994,"rotation":60}}],"spaces":[{"shapeKey":"diamond","x":145,"y":160,"rotation":300},{"shapeKey":"trapezoid","x":205,"y":160,"rotation":180},{"shapeKey":"trapezoid","x":115,"y":160,"rotation":0},{"shapeKey":"trapezoid","x":175,"y":211.96152422706632,"rotation":240},{"shapeKey":"trapezoid","x":145,"y":108.03847577293368,"rotation":60},{"shapeKey":"triangle","x":204.99999999999997,"y":160,"rotation":60},{"shapeKey":"triangle","x":174.99999999999997,"y":160,"rotation":0},{"shapeKey":"triangle","x":219.99999999999997,"y":185.98076211353316,"rotation":120}]},"gameSpeed":1,"divinityScores":{"meadow":12,"gnometemple":13},"fame":1541,"divinity":25,"currentLevelKey":"trail","levelCompleted":false,"applicationAge":23}


    

];