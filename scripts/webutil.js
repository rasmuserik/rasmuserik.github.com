var window = require('window');
var $ = require('zquery');
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
