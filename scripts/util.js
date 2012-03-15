var window = require('window');
var $ = require('zquery');
// ## Throttle a function and limit it to a single invocation per 10ms
// Slightly delay execution of a function, and make sure it only run once,
// even though it is requested several times to be executed.
exports.niceSingle = function(fn) {
    var running = false;
    return function() {
        if(running) {
            return;
        }
        running = true;
        window.setTimeout(function() {
            fn();
            running = false;
        }, 10);
    };
};

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

// ## Deterministic pseudorandom number generator
var seed = 1;
var pseudoRandom = exports.pseudoRandom = function(n) {
    return (seed = (1664525 * (n || seed) + 1013904223) |0);
};

// ## From a string, generate a HTML-color
// pastel theme
exports.colorHash = function(text) {
    var result = 0;
    for(var i=0;i<text.length; ++i) {
        result = pseudoRandom(result + text.charCodeAt(i));
    }
    return "#" + ((result | 0xe0e0e0)&0xffffff).toString(16);
};
