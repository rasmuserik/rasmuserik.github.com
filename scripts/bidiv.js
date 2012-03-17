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
        var $elem = $('<div>')
            .css('position', 'absolute')
            .css('left', x + 1)
            .css('top', y + 1)
            .css('padding', '0px 4px 0px 4px')
            .css('margin', 0)
            .css('width', Math.max(0, w-10))
            .css('height', Math.max(0, h-2))
            .css('background-color', util.colorHash(tree))
            .text(tree.replace('/', ' ').replace('#', ''));
        $dom.append($elem);
        webutil.scaleText($elem);
    } else {
        var x0 = x, x1 = x;
        var y0 = y, y1 = y;
        var w0 = w, w1 = w;
        var h0 = h, h1 = h;
        if(dir&1) {
            w0 >>= 1;
            x1 = x + w0;
            w1 = w - w0;
        } else {
            h0 >>= 1;
            y1 = y + h0;
            h1 = h - h0;
        }
        layoutTree(tree[0], $dom, x0,y0,w0,h0, dir+1);
        layoutTree(tree[1], $dom, x1,y1,w1,h1, dir+1);
    }
}


function update(dom) {
    var $dom = $(dom);
    $dom.html('');
    layoutTree(tree, $dom, 0, 0, $dom.width(), $dom.height(), 0);
    webutil.scaleText($dom.find('div'));
}


exports.run = function() {
    // ### Assign random weights to map;
    util.pseudoRandom(1000); // set seed
    tree = makeTree(menuRaw.concat(menuRaw).concat(menuRaw).concat(menuRaw));
    tree = makeTree(menuRaw);

    fullbrows.init({update: update});
};
