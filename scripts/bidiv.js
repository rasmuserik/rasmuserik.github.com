var fullbrows = require('fullbrows');
var util = require('util');
var webutil = require('webutil');
var console = require('console');
var _ = require('underscore');
var $ = require('zquery');

var menuRaw = ['#source/bidiv',
        '#source/bundler',
        '#source/fullbrows',
        '#source/jsxml',
        '#source/main',
        '#source/menu',
        '#source/server',
        '#source/showSource',
        '#source/util',
        '#source/webutil',
        '#notes/browser_platforms',
        '#notes/c9ender',
        '#notes/coffee',
        '#notes/grapla',
        '#notes/htmlnotes',
        '#notes/jam-rep',
        '#notes/javascript',
        '#notes/jekyll',
        '#notes/js',
        '#notes/lightscriptapi',
        '#notes/notedump',
        '#notes/notes',
        '#notes/oauth2.html',
        '#notes/oauth2',
        '#notes/socnet',
        '#notes/tango',
        '#notes/ted',
        '#notes/toastmasters2',
        '#notes/vim',
        '/dkcities',
        '/notescore',
        '/planetcute'];

function makeTree(list) {
    if(list.length === 0) {
        throw 'argh';
    }
    if(list.length === 1) {
        return list[0];
    } else if(list.length === 2) {
        return list;
    }
    var pos = 1 + (util.pseudoRandom() % (list.length - 1));
    console.log(list.length, pos);
    return [makeTree(list.slice(0, pos)), makeTree(list.slice(pos))];
}
var tree;

function layoutTree(tree, $dom, x, y, w, h, dir) {
    if(typeof tree === 'string') {
        $dom.append($('<div>')
            .css('position', 'absolute')
            .css('left', Math.floor(x))
            .css('top', Math.floor(y))
            .css('width', Math.max(0,Math.ceil(w) - 12))
            .css('height', Math.max(0,Math.ceil(h) - 22))
            .css('border-radius', 5)
            //.css('border', '1px solid black')
            .css('padding', 5)
            //.css('box-shadow', '0px 0px 10px ' + util.colorHash(tree))
            .css('background-color', util.colorHash(tree))
            .text(tree.replace('/', ' ').replace('#', '')));
    } else {
        var x0 = x, y0 = y;
        if(dir) {
            w /= 2;
            x0 += w;
        } else {
            h /= 2;
            y0 += h;
        }
        layoutTree(tree[0], $dom, x,y,w,h, !dir);
        layoutTree(tree[1], $dom, x0,y0,w,h, !dir);
    }
}


function update(dom) {
    var $dom = $(dom);
    $dom.html('');
    layoutTree(tree, $dom, 0, 0, $dom.width(), $dom.height(), false);
    webutil.scaleText($dom.find('div'));
}


exports.run = function() {
    // ### Assign random weights to map;
    util.pseudoRandom(1000); // set seed
    tree = makeTree(menuRaw.concat(menuRaw).concat(menuRaw).concat(menuRaw));

    fullbrows.init({update: update});
};
