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
        $elem.css('height', 'auto');
        binsearch(3, 64, function(size) {
            $elem.css('font-size', size);
            return $elem.height() > h || elem.scrollWidth > elem.offsetWidth;
        });
        $elem.css('height', h);
    });
};
