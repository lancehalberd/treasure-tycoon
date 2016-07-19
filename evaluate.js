
function evaluateValue(actor, value, localObject) {
    if (typeof value === 'number') {
        return value;
    }
    if (typeof value === 'string' && value.charAt(0) === '{') {
        if (value.indexOf('this.') >= 0) {
            return localObject[value.substring(6, value.length - 1)];
        }
        return actor[value.substring(1, value.length - 1)];
    }
    // If this is an object, just return it for further processing.
    if (value.constructor !== Array) {
        return value;
    }
    var formula = value;
    if (!formula || !formula.length) {
        throw new Error('Expected "formula" to be an array, but value is: ' + formula);
    }
    formula = formula.slice();

    if (formula.length == 2 && formula[0] === '-') {
        formula.shift()
        value = -1 * evaluateValue(actor, formula.shift(), localObject);
    } else {
        value = evaluateValue(actor, formula.shift(), localObject);
    }
    if (formula.length > 1) {
        var operator = formula.shift();
        var operand = evaluateValue(actor, formula.shift(), localObject);
        // console.log([value, operator, operand]);
        if (operator == '+') {
            value += operand;
        } else if (operator == '-') {
            value -= operand;
        } else if (operator == '*') {
            value *= operand;
        } else if (operator == '/') {
            value /= operand;
        }
    }
    return value;
}
function evaluateForDisplay(value, actor, localObject) {
    if (typeof value === 'undefined') {
        throw new Error('Value was undefined');
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
        if (value.stats) {
            return bonusHelpText(value.stats, false, actor);
        }
        return value;
    }
    var fullFormula = value;
    if (!fullFormula || !fullFormula.length) {
        throw new Error('Expected "formula" to be an array, but value is: ' + JSON.stringify(fullFormula));
    }
    formula = fullFormula.slice();
    if (formula.length == 2 && formula[0] === '-') {
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