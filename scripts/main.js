exports.main = function() {
    $(function() {
        require('menu').doMenu($('div > ul > li')[0]);
    });
};
/*
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
