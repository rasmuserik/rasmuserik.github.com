bundler = {};
(function(exports) {
    var modules = { 
    };
    function module(path, content) {
        content += '//@ sourceURL=' + path;
        modules[path.replace(/.*\//,'').replace(/\.js$/,'')] = content;
    }
    function require(name) {
        if(typeof modules[name] === 'string') {
            var exports = {};
            var module = {exports: exports};
            Function('require', 'exports', 'module', modules[name]).call({}, require, exports, module);
            modules[name] = module.exports;
        } 
        return modules[name];
    }
    exports.module = module;
    exports.require = require;
    module('backbone', 'module.exports=Backbone');
    module('underscore', 'module.exports=_');
    module('zquery', 'module.exports=$');
    module('modernizr', 'module.exports=Modernizr');
    module('showdown', 'module.exports=Showdown');
})(bundler);
if(typeof console === 'undefined') {
    console = {log: function() {}};
}
