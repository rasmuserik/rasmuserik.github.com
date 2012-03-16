#!/usr/bin/env node
/*global require: true, setTimeout: true, console: true*/
/*jshint es5: true*/

var pu = require('./pureutils');

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
                pu.stringEscape(modulesource) , '\');'].join('');
    }

    function uniqModules(bundles) {
        return pu.uniq(bundles.map(function(bundle) {
            return bundle.modules;
        }));
    }
    function uniqLibs(bundles) {
        return pu.uniq(bundles.map(function(bundle) {
            return bundle.libs;
        }));
    }

    function processFile(obj, callback) {
        readFile(obj, function(obj) {
        jsHint(obj, function(obj) {
        applyUglify(obj, function(obj) {
        callback(null, obj);
        });});});
    }

    function watchCallback(obj, writeModulesCallback) { return function(done) {
        fs.unwatchFile(obj.filename);
        fs.watchFile(obj.filename, obj.watchCallback);
        processFile(obj, function() {
            writeModulesCallback(done);
        });
    };}

    function watchObj(obj, writeModulesCallback) {
        // needs timeout to handle vims delete+create file when saving
        obj.watchCallback = pu.delaySingleExecAsync(watchCallback(obj, writeModulesCallback), 1000);
        fs.watchFile(obj.filename, obj.watchCallback);
    }

    function writeBundle(bundle, fileObjHash, callback) {
        console.log('writebundle', bundle.out);
        var resultFile = [];
        var err = '';
        bundle.libs.forEach(function(libName) {
            var lib = fileObjHash[libName];
            if(lib.err) {
                console.log(libName, lib.err);
                err += lib.err;
            } else {
                resultFile.push(lib.filedata);
            }
        });
        bundle.modules.forEach(function(moduleName) {
            var module = fileObjHash[moduleName];
            if(module.err) {
                err += module.err;
                console.log(moduleName, module.err);
            } else {
                resultFile.push(moduleString(
                    moduleName, module[bundle.moduleVersion]));
                err += module.jshint;
            }
        });
        resultFile.push(bundle.run);
        resultFile = resultFile.join('\n');
        if(err) {
            resultFile = "document.body.innerHTML='"+ pu.stringEscape(err)+ "';";
        } 
        fs.writeFile(bundle.out, resultFile, 'utf8', callback);
    }

    function writeBundles(bundles, fileObjs, callback) {
        var fileObjHash = {};
        fileObjs.forEach(function(obj) {
            fileObjHash[obj.filename] = obj;
        });
        async.forEach(bundles, function(bundle, callback) {
            writeBundle(bundle, fileObjHash, callback);
        }, callback);
    }

    function bundle(bundles) {
        var moduleObjs = uniqModules(bundles).map(function(filename) {
                return {filename: filename}; 
            });
        var libObjs = uniqLibs(bundles).map(function(filename) {
                return {filename: filename}; 
            });
        var fileObjs = libObjs.concat(moduleObjs);
        var delayedWriteBundles = pu.delaySingleExecAsync(function(done) {
           writeBundles(bundles, fileObjs, done);
        });

        async.forEach(libObjs, readFile, function(err, objs) {
        async.forEach(moduleObjs, processFile, delayedWriteBundles);});

        moduleObjs.forEach(function(obj) {
            watchObj(obj, delayedWriteBundles);
        });
    }


    var base = ["depend/zepto.min.js"];
    var legacy = ["depend/es5-shim.min.js",
                  "depend/jquery-1.7.1.min.js",
                  "depend/json2.min.js"];
    var libs = ["depend/modernizr.js",
                "depend/underscore-min.js",
                "depend/backbone-min.js",
                "depend/showdown.min.js",
                "scripts/bundler.js"];
    var modules =  ["scripts/util.js",
                    "scripts/jsxml.js",
                    "scripts/main.js",
                    "scripts/menu.js",
                    "scripts/fullbrows.js"];

    var bundles = [
        { out: 'dist/bundle.debug.js',
          libs: base.concat(libs),
          modules: modules,
          moduleVersion: 'filedata',
          run: 'bundler.require("main").main()'},

        { out: 'dist/bundle.legacy.debug.js',
          libs: legacy.concat(libs),
          modules: modules,
          moduleVersion: 'filedata',
          run: 'bundler.require("main").main()'},

        { out: 'dist/bundle.min.js',
          libs: base.concat(libs),
          modules: modules,
          moduleVersion: 'minified',
          run: 'bundler.require("main").main()'},

        { out: 'dist/bundle.legacy.min.js',
          libs: legacy.concat(libs),
          modules: modules,
          moduleVersion: 'minified',
          run: 'bundler.require("main").main()'}
    ];

    bundle(bundles);

})();

(function server() {
    /*global process: true, __dirname: true*/
    "use strict";
    var app = require('express').createServer();

    app.configure(function(){
        app.use("/", require('express').static(__dirname.replace(/\/scripts$/, '')));
    });

    var port = process.env.PORT || 8080;
    app.listen(port);
    console.log('\nstarting server on port ' + port + '\n');
})();
