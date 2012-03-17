/*global setTimeout: true*/
exports.stringEscape = function(str) {
    return str.replace(/[^" !#-&(-\[\]-~]/g, function(c) {
        var code = c.charCodeAt(0);
        if(code < 256) {
            return "\\x" + (0x100 + code).toString(16).slice(1);
        } else {
            return "\\u" + (0x10000 + code).toString(16).slice(1);
        }
    });
};

exports.delaySingleExecAsync = function(fn, delay) {
    delay = delay || 10;
    var scheduled = false;
    var running = false;
    var doneFns = [];
    var scheduleFn;
    function exec() {
        scheduled = false;
        var fns = doneFns;
        doneFns = [];
        if(running) {
            return scheduleFn();
        }
        running = true;
        fn(function() {
            running = false;
            fns.forEach(function(fn) {fn();});
        });
    }
    scheduleFn = function(done) {
        if(typeof done === 'function') {
            doneFns.push(done);
        }
        if(scheduled) {
            return;
        }
        scheduled = true;
        setTimeout(exec, delay);
    };
    return scheduleFn;
};

var flattenArrays = exports.flattenArrays = function(list) {
    if(Array.isArray(list)) {
        return list.map(flattenArrays).reduce(function(a,b) {
            return a.concat(b);
        });
    } else {
        return [list];
    }
};

exports.uniq = function(lists) {
    var hash = {};
    flattenArrays(lists).forEach(function(elem) {
            hash[elem] = true;
    });
    return Object.keys(hash);
};

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
        setTimeout(function() {
            fn();
            running = false;
        }, 10);
    };
};

// ## Deterministic pseudorandom number generator
var seed = 1;
var pseudoRandom = exports.pseudoRandom = function(n) {
    return (seed = (1664525 * (n || seed) + 1013904223) &0x7fffffff);
};

exports.hash = function(text) {
    var result = 0;
    for(var i=0;i<text.length; ++i) {
        result = pseudoRandom(result + text.charCodeAt(i));
    }
    return result;
};

// ## From a string, generate a HTML-color
// pastel theme
exports.colorHash = function(text) {
    return "#" + ((exports.hash(text) | 0xe0e0e0)&0xffffff).toString(16);
};
