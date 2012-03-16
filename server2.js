#!/usr/bin/env node
/*global require: true, setTimeout: true, console: true*/

var uniq, delaySingleExecAsync, flattenArrays;
// # Util
(function() {
    "use strict";
    delaySingleExecAsync = function(fn, delay) {
        delay = delay || 10;
        var scheduled = false;
        var running = false;
        function exec() {
            scheduled = false;
            if(running) return schedule();
            running = true;
            fn(done);
        }
        function done() {
            running = false;
        }
        function schedule() {
            if(scheduled) return;
            scheduled = true;
            setTimeout(exec, delay);
        }
        return schedule;
    }

    function flattenArrays(list) {
        if(Array.isArray(list)) {
            return list.map(flattenArrays).reduce(function(a,b) {
                return a.concat(b);
            });
        } else {
            return [list];
        }
    }

    uniq = function(lists) {
        var hash = {};
        flattenArrays(lists).forEach(function(elem) {
                hash[elem] = true;
        });
        return Object.keys(hash);
    }
})();

(function() {
    "use strict";
    var async = require('async');
    var fs = require('fs');
    var uglify = require('uglify-js');
    var mustache = require('mustache');
    var jshint = require('jshint').JSHINT;
    
    function appendLibs(out, opt, next) {
        async.forEachSeries(opt.libs, function(libname, callback) {
            fs.readFile(libname, 'utf-8', function(err, data) {
                if(err) throw err;
                out.push(data);
                callback();
            });
        }, next);
    }

    function readFile(obj, callback) {
        console.log('readfile', obj.filename);
        fs.readFile(obj.filename, 'utf8', function(err, data) {
            obj.err = obj.err || err;
            obj.filedata = data;
            callback(obj);
        });
    }

    function jsHint(obj, callback) {
        console.log('jshint', obj.filename);
        if(obj.err) return callback(obj);
        jshint('(function(){"use strict";/*global require: true, exports: true */' + obj.filedata + '})();');
        obj.jshint = '';
        jshint.errors.forEach(function(err) {
            if(err) obj.jshint += mustache.to_html(
                '<div>{{file}} line {{line}} pos {{pos}}: {{err}}</div>',
                {file: obj.filename, line: err.line, pos: err.character, err: err.reason});
        });
        return callback(obj);
    }

    function applyUglify(obj, callback) {
        console.log('uglify', obj.filename);
        if(obj.err) return callback(obj);
        try {
            var ast = uglify.parser.parse(obj.filedata);
            var mangled = uglify.uglify.ast_mangle(ast);
            var squeezed = uglify.uglify.ast_squeeze(ast);
            obj.minified = uglify.uglify.gen_code(squeezed);
        } catch(e) {
            obj.err = {err: 'uglify-error', details: e};
        }
        callback(obj);
    }

    function moduleString(modulename, modulesource) {
        return ['bundler.module(\'', modulename, '\',\'',
            modulesource.replace(/[^" !#-&(-\[\]-~]/g, function(c) {
                var code = c.charCodeAt(0);
                if(code < 256) {
                    return "\\x" + (0x100 + code).toString(16).slice(1);
                } else {
                    return "\\u" + (0x10000 + code).toString(16).slice(1);
                }
            }), '\');'].join('');
    }

    function uniqFiles(bundles) {
        return uniq(bundles.map(function(bundle) {
            return [bundle.libs, bundle.modules];
        }));
    };

    function processFile(obj, callback) {
        readFile(obj, function(obj) {
        jsHint(obj, function(obj) {
        applyUglify(obj, function(obj) {
        callback(null, obj);
        })})});
    }

    function bundle(bundles) {
        var fileObjs = uniqFiles(bundles).map(function(filename) {
                return {filename: filename}; 
            });
        async.forEach(fileObjs, processFile, function(err, objs) {
           writeBundles(bundles, fileObjs);
        });
    };

    function writeBundles(bundles, fileObjs, callback) {
        var fileObjHash = {};
        fileObjs.forEach(function(obj) {
            fileObjHash[obj.filename] = obj;
        });
        async.forEach(bundles, function(bundle, callback) {
            writeBundle(bundle, fileObjHash, callback);
        }, callback);
    }

    function writeBundle(bundle, fileObjHash, callback) {
        console.log('writebundle', bundle.out);
        var resultFile = [];
        var err = '';
        bundle.libs.forEach(function(libName) {
            var lib = fileObjHash[libName];
            resultFile.push(lib[bundle.libVersion]);
            err += lib.err || '';
        });
        bundle.modules.forEach(function(moduleName) {
            var module = fileObjHash[moduleName];
            resultFile.push(moduleString(
                    moduleName, module[bundle.moduleVersion]));
            err += module.jshint;
            err += module.err || '';
        });
        resultFile.push(bundle.run);
        if(err) {
            resultFile = ['document.write("', err, '");'];
        } 
        resultFile = resultFile.join('\n');
        fs.writeFile(bundle.out, resultFile, 'utf8', callback);
    }


    
    var base = ["depend/zepto.js"];
    var legacy = ["depend/es5-shim.js",
                  "depend/jquery-1.7.1.js",
                  "depend/json2.js"];
    var libs = ["depend/modernizr.js",
                "depend/underscore.js",
                "depend/backbone.js",
                "depend/showdown.js",
                "scripts/bundler.js"];
    var modules =  ["scripts/util.js",
                    "scripts/jsxml.js",
                    "scripts/main.js",
                    "scripts/menu.js",
                    "scripts/fullbrows.js"];

    var bundles = [
        { out: 'dist/bundle2.debug.js',
          libs: base.concat(libs),
          modules: modules,
          libVersion: 'filedata', moduleVersion: 'filedata',
          run: 'bundler.require("main").main()'},

        { out: 'dist/bundle2.legacy.debug.js',
          libs: legacy.concat(libs),
          modules: modules,
          libVersion: 'filedata', moduleVersion: 'filedata',
          run: 'bundler.require("main").main()'},

        { out: 'dist/bundle2.min.js',
          libs: base.concat(libs),
          modules: modules,
          libVersion: 'minified', moduleVersion: 'minified',
          run: 'bundler.require("main").main()'},

        { out: 'dist/bundle2.legacy.min.js',
          libs: legacy.concat(libs),
          modules: modules,
          libVersion: 'minified', moduleVersion: 'minified',
          run: 'bundler.require("main").main()'}
    ];

    bundle(bundles);

})();

/*
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
*/
