var async = require('async');
var fs = require('fs');

function build(opts) {
}

function appendLibs(out, opt, next) {
    async.forEachSeries(opt.libs, function(libname, callback) {
        console.log(libname);
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
            console.log(modulename);
            var process = opt.process || function(id) { return id; };
            out.push('bundler.module("');
            out.push(modulename);
            out.push('","');
            out.push(process(data).replace(/[^ !#-\[\]-~]/g, function(c) {
                    code = c.charCodeAt(0);
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
    out = [];
    appendLibs(out, opt, function() {
    appendModules(out, opt, function() {
    out.push(opt.run || "");
    fs.writeFile(opt.out, out.join(''));
    })});
}

libs = ["depend/zepto.js",
        "depend/backbone.js",
        "depend/underscore.js"];

libsIE = ["depend/es5-shim.js",
          "depend/jquery-1.7.1.js",
          "depend/json2.js",
          "depend/underscore.js",
          "depend/backbone.js"];

modules =  ["scripts/util.js",
            "scripts/main.js",
            "scripts/menu.js",
            "scripts/fullbrows.js"];

//bundle({libs: libs, out: 'out.js', modules: modules});
//bundle({libs: libsIE, out: 'out.ie.js', modules: modules});
bundle({
    libs: ['lib/test.js', 'lib/bundler.js'], 
    modules: ['scripts/test.js'], 
    out: 'out.js', 
    run: "bundler.require('test').test();"});
