var Backbone = require('backbone');
var jsxml = require('jsxml');

console.log(Backbone);

var SiteMap = Backbone.Router.extend({
    routes: {
        'menu': 'menu',
        'notes/*path': 'notes',
        '*default': 'default'
    },
    'default': function() { },
    menu: menuFn,
    notes: notes
});

var markdown = require('markdown');
function notes(fnname) {
    console.log(fnname);
    var html = markdown.toHTML(markdown.parse('# Hello world\n\n blah blah blah'));
    console.log(html);
    $.get('notes/' + fnname + '.md', function(text) {
        var html = markdown.toHTML(markdown.parse(text));
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
    require('menu').doMenu($('#content > ul > li')[0]);
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
/*
exports.main = function() {
    require('zquery')(function() {
        require('menu').doMenu($('div > ul > li')[0]);
    });
};
function showHTML() { };
function redirect() { };
function showMarkDown() { };
   console.log(['solsort.dk',
    {title: 'Curriculum Vitae', app: showHTML('/CurriculumVitae')},
    ['Apps',
        {title: 'Danske Byer', app: redirect('/dkcities')},
        {title: 'NoteScore', app: redirect('/notescore')},
        {title: 'PlanetCute', app: redirect('/planetcute')}],
    ['Notes',
        {title: 'Tekststruktur for rapporter', app: showMarkDown('/notes/tekststruktur-for-rapporter')},
        {title: 'Tommelfingerregler for skrivning', app: showMarkDown('/notes/tommelfingerregler-for-skrivning')},
        {title: 'Fototips', app: showMarkDown('/notes/fototips')},
        {title: 'TED talks', app: showMarkDown('/notes/ted')},
        ['Tech',
            {title: 'Cloud9 and Ender', app: showMarkDown('/notes/tech/c9ender')},
            {title: 'Jekyll / github-pages', app: showMarkDown('/notes/tech/jekyll')},
            {title: 'vim', app: showMarkDown('/notes/tech/vim')},
            {title: 'CoffeeScript', app: showMarkDown('/notes/tech/coffee')}]],
    ['JavaScript',
        {title: 'devintro', app: showMarkDown('/devintro/book')},
        ['JS1K',
            {title: '4djuliabrot', app: showMarkDown('/f1k/blah')},
            {title: 'rain', app: showMarkDown('/f1k/rain')}],
        ['Tweet-size',
            {title: 'brownian motion', app: showMarkDown('/f1k/brown')},
            {title: 'sierpinsky', app: showMarkDown('/f1k/sierpinsky')}],
       {title: 'iOS style', app: showMarkDown('')},
       {title: 'hierachical layout', app: showMarkDown('')},
       {title: 'slidein transitions', app: showMarkDown('')}],
    ['Presentations',
        {title: 'OAuth2', app: showMarkDown('/presentations/oauth2')}]]); */
