var Backbone = require('backbone');
var jsxml = require('jsxml');
var console = require('console');
var $ = require('zquery');

var SiteMap = Backbone.Router.extend({
    routes: {
        'menu': 'menu',
        'bidiv': 'bidiv',
        'unicodeTest': 'unicodeTest',
        'notes/*path': 'notes',
        'source/*path': 'source',
        'timelog': 'timelog',
        '*default': 'default'
    },
    'default': function() { },
    unicodeTest: unicodeTest,
    timelog: require('timelog').main,
    menu: menuFn,
    bidiv: require('bidiv').run,
    source: function(name) { require('showSource').show(name); },
    notes: notes
});

function unicodeTest() {
    var t = [];
    var i;
    var n = 65538;
    $('body').text('');
    for(i=0;i<n;++i) {
        t.push(i);
    }
    t = t.map(function(a) { return String.fromCharCode(a); });
    t = t.join('');
    for(i=0;i<n;++i) {
        if(t.charCodeAt(i) !== i) {
            $('body').append('error t[' + i + '] -> ' + t.charCodeAt(i) + '<br>');
        }
    }
    $('body').append('done');
}

function notes(fnname) {
    var showdown;
    showdown = require('showdown');
    showdown = new showdown.converter();
    console.log(showdown);
    $.get('notes/' + fnname + '.md', function(text) {
        var html = showdown.makeHtml(text);
        $('#content').html(html);
    });
}

var sitemap = new SiteMap();

exports.main = function() {
    $(function() { Backbone.history.start(); });
};

function menuFn() {
    require('fullbrows').init();
    $('#content').html(jsxml.toDOM(menuXml));
    require('./menu').doMenu($('#content > ul > li')[0]);
}

var menuXml = ["ul",
    ["li","solsort.dk",["ul",
        ["li",["a",{"href":"/CurriculumVitae.html"},"CV"]],
        ["li","Apps",["ul",
            ["li",["a",{"href":"/dkcities"},"Danskebyer"]],
            ["li",["a",{"href":"/notescore"},"notescore"]],
            ["li",["a",{"href":"/planetcute"},"PlanetCute"]]]],
        ["li","Notes",["ul",
            ["li",["a",{"href":"/notes/tekststruktur-for-rapporter.html"},"Tekststruktur for rapporter"]],
            ["li",["a",{"href":"/notes/tommelfingerregler-for-skrivning.html"},"Tommelfingerregler for skrivning"]],
            ["li",["a",{"href":"/notes/fototips.html"},"Fototips"]],
            ["li","Tech",["ul",
                ["li",["a",{"href":"/notes/tech/c9ender.html"},"Cloud9 and Ender"]],
                ["li",["a",{"href":"/notes/tech/jekyll.html"},"Jekyll / github-pages"]],
                ["li",["a",{"href":"/notes/tech/vim.html"},"vim"]],
                ["li",["a",{"href":"/notes/tech/coffee.html"},"CoffeeScript"]]]],
            ["li",["a",{"href":"/notes/ted.html"},"TED talks"]]]],
        ["li","JS",["ul",
            ["li",["a",{"href":"/devintro/book.html"},"devintro"]],
            ["li","1k",["ul",
                ["li",["a",{"href":"/f1k/blah.html"},"4d juliabrot"]],
                ["li",["a",{"href":"/f1k/rain.html"},"rain"]]]],
            ["li","tweetsize",["ul",
                ["li",["a",{"href":"/f1k/brown.html"},"brownian motion"]],
                ["li",["a",{"href":"/f1k/sierpinsky.html"},"sierpinsky"]]]],
            ["li","“iOS style”:"],["li","“hierachical layout”:"],
            ["li","“slidein transitions”:"]]],
        ["li","Presentations",["ul",
            ["li",["a",{"href":"/presentations/oauth2.html"},"OAuth2"]]]]]]];
