/*global require: true, console: true*/
(function() {
    "use strict";
    var async = require('async');
    var fs = require('fs');
    
    function appendLibs(out, opt, next) {
        async.forEachSeries(opt.libs, function(libname, callback) {
            fs.readFile(libname, 'utf-8', function(err, data) {
                console.log(opt.out, libname, data.length);
                if(err) throw err;
                out.push(data);
                callback();
            });
        }, next);
    }
    
    function appendModules(out, opt, next) {
        async.forEachSeries(opt.modules, function(modulename, callback) {
            fs.readFile(modulename, 'utf-8', function(err, data) {
                if(err) throw err;
                console.log(opt.out, modulename, data.length);
                var process = opt.process || function(id) { return id; };
                out.push('bundler.module("');
                out.push(modulename);
                out.push('","');
                out.push(process(data).replace(/[^ !#-\[\]-~]/g, function(c) {
                        var code = c.charCodeAt(0);
                        if(code < 256) {
                            return "\\x" + (0x100 + code).toString(16).slice(1);
                        } else {
                            return "\\u" + (0x10000 + code).toString(16).slice(1);
                        }
                }));
                out.push('");\n');
                callback();
            });
        }, next);
    }
    
    function bundle(opt) {
        var out = [];
        appendLibs(out, opt, function() {
        appendModules(out, opt, function() {
        out.push(opt.run || "");
        fs.writeFile(opt.out, out.join(''));
        });});
    }
    
    var libs = ["depend/zepto.js",
            "depend/modernizr.js",
            "depend/underscore.js",
            "depend/backbone.js",
            "lib/bundler.js"];
    
    var libsIE = ["depend/es5-shim.js",
              "depend/jquery-1.7.1.js",
              "depend/json2.js",
              "depend/modernizr.js",
              "depend/underscore.js",
              "depend/backbone.js",
              "lib/bundler.js"];
    
    var modules =  ["scripts/util.js",
                "scripts/main.js",
                "scripts/menu.js",
                "scripts/fullbrows.js"];
    
    bundle({libs: libs, out: 'out.js', modules: modules, run: 'bundler.require("main").main()'});
    bundle({libs: libsIE, out: 'out.ie.js', modules: modules, run: 'bundler.require("main").main()'});
})();

(function server() {
    "use strict";
    var app = require('express').createServer();

    app.configure(function(){
        app.use("/", require('express').static(__dirname ));
    });

    var port = process.env.PORT || 8080;
    app.listen(port);
    console.log('starting server on port ' + port);
})();
