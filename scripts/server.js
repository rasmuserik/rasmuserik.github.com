#!/usr/bin/env node
// # Utility for building javascript bundles
//

// # Setup and dependencies

/*global require:true,console:true,process:true,__dirname:true*/
/*jshint es5:true,strict:true,trailing:true,curly:true,eqeqeq:true*/
(function() {'use strict';

var util = require('./util');
var async = require('async');
var fs = require('fs');
var uglify = require('uglify-js');
var mustache = require('mustache');
var jshint = require('jshint').JSHINT;

// # Functions to build application bundle
function readFile(obj, callback) {
    console.log('readfile', obj.filename);
    fs.readFile(obj.filename, 'utf8', function(err, data) {
        obj.err = err;
        obj.filedata = data;
        callback(obj);
    });
}

function jsHint(obj, callback) {
    console.log('jshint', obj.filename);
    if(obj.err) {
        return callback(obj);
    }
    jshint('/*jshint strict: true, trailing: true, curly: true, ' +
           'es5: true, eqeqeq: true*/(function(){"use strict";' +
           '/*global require:true,module:true,exports:true,' +
            'console:true,setTimeout:true */' +
           obj.filedata + '})();');
    obj.jshint = '';
    jshint.errors.forEach(function(err) { if(err) {
        obj.jshint += mustache.to_html(
            '<div>{{file}} line {{line}} pos {{pos}}: {{err}}</div>',
            {file: obj.filename, line: err.line, 
            pos: err.character, err: err.reason});
    } });
    return callback(obj);
}

function applyUglify(obj, callback) {
    console.log('uglify', obj.filename);
    if(obj.err) {
        return callback(obj);
    }
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
            util.stringEscape(modulesource) , '\');'].join('');
}

function uniqModules(bundles) {
    return util.uniq(bundles.map(function(bundle) {
        return bundle.modules;
    }));
}
function uniqLibs(bundles) {
    return util.uniq(bundles.map(function(bundle) {
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

// ### Utilities for watching a files for changes
function watchCallback(obj, writeModulesCallback) { 
        return function(done) {
    fs.unwatchFile(obj.filename);
    fs.watchFile(obj.filename, obj.watchCallback);
    processFile(obj, function() {
        writeModulesCallback(done);
    });
};}

function watchObj(obj, writeModulesCallback) {
    // needs timeout to handle vims delete+create file when saving
    obj.watchCallback = util.delaySingleExecAsync(
            watchCallback(obj, writeModulesCallback), 1000);
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
            err += moduleName + JSON.stringify(module.err);
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
        resultFile = "document.body.innerHTML='" +
            util.stringEscape(err)+ "';";
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
    var delayedWriteBundles = util.delaySingleExecAsync(
            function(done) {
       writeBundles(bundles, fileObjs, done);
    });

    async.forEach(libObjs, readFile, function(err, objs) {
    async.forEach(moduleObjs, processFile, delayedWriteBundles);});

    moduleObjs.forEach(function(obj) {
        watchObj(obj, delayedWriteBundles);
    });
}

// # The actual bundles
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
                "scripts/showSource.js",
                "scripts/menu.js",
                "scripts/timelog.js",
                "scripts/bidiv.js",
                "scripts/webutil.js",
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

// # Web server

// Start a simple local web server 
var app = require('express').createServer();

app.configure(function(){
    app.use("/", require('express').static(
            __dirname.replace(/\/scripts$/, '')));
});

var port = process.env.PORT || 8080;
app.listen(port);
console.log('\nstarting server on port ' + port + '\n');

})();
