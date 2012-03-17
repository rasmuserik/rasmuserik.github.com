var window = require('window');
var $ = require('zquery');
var _ = require('underscore');
// ## Actual window height
//
// The height of the window, including height of optional auto-hiding address bar.
exports.windowHeight = function() {
    var height = $(window).height();
    // workaround buggy window height on iOS
    if(height === 356 || height === 208) {
        height += 60;
    }
    return height;
};

function binsearch(a, b, fn) {
    if(a >= b) {
        return a;
    }
    var t = (a + b + 1) >> 1;
    if(fn(t)) {
        return binsearch(a, t-1, fn);
    } else {
        return binsearch(t, b, fn);
    }
}

exports.scaleText = function($elems) {
    _($elems).each(function(elem) {
        var $elem = $(elem);
        var h = $elem.height();
        var size = parseInt($elem.css('font-size'), 10);
        $elem.css('overflow', 'hidden');
        binsearch(2, Math.min($elem.height() >> 1, 100), function(size) {
            $elem.css('font-size', size);
            return elem.scrollHeight > elem.clientHeight || elem.scrollWidth > elem.clientWidth;
        });
        $elem.css('height', h);
    });
};
