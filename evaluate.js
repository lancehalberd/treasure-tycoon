
function evaluateValue(actor, value, localObject) {
    if (typeof value === 'number') {
        return value;
    }
    if (typeof value === 'string' && value.charAt(0) === '{') {
        if (value.indexOf('this.') >= 0) {
            return ifdefor(localObject[value.substring(6, value.length - 1)], 0);
        }
        var statKey = value.substring(1, value.length - 1);
        // console.log(statKey + ':' + actor[statKey]);
        return ifdefor(actor[statKey], 0);
    }
    // If this is an object, just return it for further processing.
    if (value.constructor !== Array) {
        return value;
    }
    var formula = value;
    if (!formula || !formula.length) {
        throw new Error('Expected "formula" to be an array, but value is: ' + formula);
    }
    var originalFormula = formula.slice();
    formula = formula.slice();

    if (formula.length == 1) {
        value = evaluateValue(actor, formula.shift(), localObject);
    } else if (formula.length == 2 && formula[0] === '-') {
        formula.shift()
        value = -1 * evaluateValue(actor, formula.shift(), localObject);
    } else {
        value = evaluateValue(actor, formula.shift(), localObject);
    }
    if (formula.length > 1) {
        var operator = formula.shift();
        var operand = evaluateValue(actor, formula.shift(), localObject);
        //console.log([value, operator, operand]);
        if (operator == '+') {
            value += operand;
        } else if (operator == '-') {
            value -= operand;
        } else if (operator == '*') {
            value *= operand;
        } else if (operator == '/') {
            if (operand === 0) value = 0;
            else value /= operand;
        }
    }
    return value;
}
function evaluateForDisplay(value, actor, localObject) {
    if (typeof value === 'undefined') {
        throw new Error('value was undefined');
    }
    if (!actor && actor !== null) {
        throw new Error('Forgot to pass actor to evaluateForDisplay.');
    }
    if (typeof value === 'number') {
        return value;
    }
    if (typeof value === 'string' && value.charAt(0) === '{') {
        return tag('span', 'formulaStat', value.substring(1, value.length - 1));
    }
    if (typeof value === 'string' || typeof value === 'boolean') {
        return value;
    }
    if (value.constructor !== Array) {
        if (value.bonuses) {
            return bonusSourceHelpText(value, actor, localObject);
        }
        return value;
    }
    var fullFormula = value;
    if (!fullFormula || !fullFormula.length) {
        throw new Error('Expected "formula" to be an array, but value is: ' + JSON.stringify(fullFormula));
    }
    formula = fullFormula.slice();
    if (formula.length === 1) {
        value = evaluateForDisplay(formula.shift(), null, localObject);
    } else if (formula.length == 2 && formula[0] === '-') {
        formula.shift();
        value = '-' + evaluateForDisplay(formula.shift(), null, localObject);
    } else {
        value = evaluateForDisplay(formula.shift(), null, localObject);
    }
    if (formula.length > 1) {
        value = '(' + value + ' '+ formula.shift() + ' ' + evaluateForDisplay(formula.shift(), null, localObject) +')';
    }
    if (actor) {
        value += ' ' + tag('span', 'formulaStat', '[=' +  evaluateValue(actor, fullFormula, localObject).format(2) +  ']');
    }
    return value;
}