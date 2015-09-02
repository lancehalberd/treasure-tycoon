
var Random = {
    /**
     * @param {Number} min  The smallest returned value
     * @param {Number} max  The largest returned value
     */
    'range': function (min, max) {
        return Math.floor(Math.random() * (max + 1 - min)) + min;
    },

    /**
     * @param {Array} array  The array of elements to return random element from
     */
    'element': function (collection) {
        if (collection.constructor == Object) {
            var keys = Object.keys(collection);
            return collection[this.element(keys)];
        }
        if (collection.constructor == Array) {
            return collection[this.range(0, collection.length - 1)];
        }
        console.log("Warning @ Random.element: "+ collection + " is neither Array or Object");
        return null;
    }
};

/**
 * Makes a deep copy of an object. Note that this will not make deep copies of
 * objects with prototypes.
 */
function copy(object) {
    if (typeof(object) == 'undefined' || object === null) {
        return null;
    }
    if (object.constructor == Array) {
        return jQuery.extend(true, [], object);
    }
    return jQuery.extend(true, {}, object);
}

function properCase(string) {
    return string.charAt(0).toUpperCase() + string.substring(1);
}

/**
 * Returns the angle from (x1, y1) to (x2,y2) which when given an image facing
 * right at angle 0, will point the image from x1,y1 towards x2,y2 when
 * context.rotate(angle) is used.
 *
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @return {Number}
 */
function atan2(x1, y1, x2, y2) {
    if (x1 == x2) {
        return(y2 > y1) ? Math.PI / 2 : -Math.PI / 2;
    }
    return Math.atan((y2 - y1) / (x2 - x1)) + (x2 < x1 ? Math.PI : 0);
}

function ifdefor(value, defaultValue) {
    if (value !== undefined) {
        return value;
    }
    if (defaultValue !== undefined) {
        return defaultValue;
    }
    return null;
}


function tag(type, classes, content) {
    return '<' + type + ' class="' + ifdefor(classes, '') + '">' + ifdefor(content, '') + '</' + type + '>';
}

function $tag(type, classes, content) {
    return $(tag(type, classes, content));
}

function now() {
    return Math.floor(new Date().getTime());
}

function isMouseOver($div) {
    var x = $('.js-mouseContainer').offset().left + mousePosition[0];
    var y = $('.js-mouseContainer').offset().top + mousePosition[1];
    var t = $div.offset().top;
    var l = $div.offset().left;
    var b = t + $div.outerHeight(true);
    var r = l + $div.outerWidth(true);
    return !(y < t || y > b || x < l || x > r);
}

function collision($div1, $div2) {
    var T = $div1.offset().top;
    var L = $div1.offset().left;
    var B = T + $div1.outerHeight(true);
    var R = L + $div1.outerWidth(true);
    var t = $div2.offset().top;
    var l = $div2.offset().left;
    var b = t + $div2.outerHeight(true);
    var r = l + $div2.outerWidth(true);
    return !(B < t || T > b || R < l || L > r);
}