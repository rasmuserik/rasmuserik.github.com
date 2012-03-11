bundler = {};
(function(exports) {
    var modules = { 
    };
    function module(path, content) {
        content += '//@ sourceURL=' + path;
        modules[path.replace(/.*\//,'').replace(/\.js$/,'')] = content;
    }
    function require(module) {
        if(typeof modules[module] === 'string') {
            var exports = {};
            Function('require', 'exports', modules[module]).call({}, require, exports);
            modules[module] = exports;
        } 
        return modules[module];
    }
    exports.module = module;
    exports.require = require;
})(bundler);
if(typeof console === 'undefined') {
    console = {log: function() {}};
}
