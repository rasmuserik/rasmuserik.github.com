#!/usr/bin/env node
/*global require: true, console: true*/
(function() {
    "use strict";
    var async = require('async');
    var fs = require('fs');
    var uglify = require('uglify-js');
    
    function appendLibs(out, opt, next) {
        async.forEachSeries(opt.libs, function(libname, callback) {
            fs.readFile(libname, 'utf-8', function(err, data) {
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
        var out = ['(function(){'];
        appendLibs(out, opt, function() {
        appendModules(out, opt, function() {
        out.push(opt.run || "");
        out.push('})()');
        out = out.join('');
        if(opt.process) {
            out = opt.process(out);
        }
        console.log('writing', opt.out);
        fs.writeFile(opt.out, out);
        });});
    }

    function uglifyFn(str) {
        try {
            var ast = uglify.parser.parse(str);
            ast = uglify.uglify.ast_mangle(ast);
            ast = uglify.uglify.ast_squeeze(ast);
            return uglify.uglify.gen_code(ast);
        } catch(e) {
            return 'throw {error: "uglify-error"}';
        }
    }

    var watchers = [];
    function watchLists(arrs, fn) {
        var files = {};
        arrs.forEach(function(arr) {
            arr.forEach(function(filename) {
                files[filename] = true;
            });
        });
        Object.keys(files).forEach(function(filename) {
            watchers.push(fs.watch(filename, function(a, b) {
                console.log('watched', a, b);
                watchers.forEach(function(watcher) {
                    watcher.close();
                });
                watchers=[];
                fn();
                watchLists(arrs, fn);
            }));
        });
    }
    
    var libs = ["depend/zepto.js",
            "depend/modernizr.js",
            "depend/underscore.js",
            "depend/backbone.js",
            "depend/showdown.js",
            "lib/bundler.js"];
    
    var libsLegacy = ["depend/es5-shim.js",
              "depend/jquery-1.7.1.js",
              "depend/json2.js",
              "depend/modernizr.js",
              "depend/underscore.js",
              "depend/backbone.js",
              "depend/showdown.js",
              "lib/bundler.js"];
    
    var modules =  ["scripts/util.js",
                "scripts/jsxml.js",
                "scripts/main.js",
                "scripts/menu.js",
                "scripts/fullbrows.js"];
    
    watchLists([libs, libsLegacy, modules], allBundles);
    requestRun();

    function allBundles() {
        bundle({libs: libs, out: 'bundle.debug.js', modules: modules, run: 'bundler.require("main").main()'});
        bundle({libs: libsLegacy, out: 'bundle.legacy.debug.js', modules: modules, run: 'bundler.require("main").main()'});
        bundle({libs: libs, out: 'bundle.min.js', modules: modules, run: 'bundler.require("main").main()', process: uglifyFn});
        bundle({libs: libsLegacy, out: 'bundle.legacy.min.js', modules: modules, run: 'bundler.require("main").main()', process: uglifyFn});
    };

    var doRun = false;
    var running = false;
    function requestRun() {
        doRun = true;
        tryRun();
    }
    function tryRun() {
        if(!doRun) {
            return;
        }
        if(!running) {
            running = true;
            doRun = false;
            allBundles();
            setTimeout(function() { running = false; }, 4000);
            return;
        } 
        setTimeout(function() { tryRun(); }, 4000);
    }

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
