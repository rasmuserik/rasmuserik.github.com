bundler = {};
(function(exports) {
    var modules = { 
    };
    function module(path, content) {
        content += '//@ sourceURL=' + path;
        modules[path.replace(/.*\//,'').replace(/\.js$/,'')] = content;
    }
    function require(name) {
        name = name.replace(/.*\//,'').replace(/\.js$/,'');
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
    module('window', 'module.exports=window');
    module('document', 'module.exports=document');
    module('modernizr', 'module.exports=Modernizr');
    module('showdown', 'module.exports=Showdown');
    module('console', 'module.exports=window.console || {log: function() {}}');
})(bundler);
require = bundler.require;
