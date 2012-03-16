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

exports.scaleText = function($elems) {
    _($elems).each(function(elem) {
        var $elem = $(elem);
        var h = $elem.height();
        var size = parseInt($elem.css('font-size'), 10);
        $elem.css('height', 'auto');
        while($elem.height() > h && size > 5) {
            --size;
            $elem.css('font-size', size);
        }
        $elem.css('height', h);
    });
};
