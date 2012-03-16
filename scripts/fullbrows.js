var util = require('util');
var webutil = require('webutil');
var $ = require('zquery');
var window = require('window');
var Modernizr = require('modernizr');

// # Browser window setup
var relayoutFn;
var browsOpt;
function relayout() {
    $('#content')
        .css('position', 'absolute')
        .css('left', 0)
        .css('top', 1)
        .css('overflow', 'hidden')
        .css('width', $(window).width())
        .css('height', browsOpt.scrollable ? 'auto' : webutil.windowHeight());
    if(typeof relayoutFn === 'function') {
        relayoutFn(window.document.getElementById('content'));
    }
    window.scrollTo(0,1);
}
var relayoutDelayed = util.niceSingle(relayout);

var init = exports.init = function(opt) {
    browsOpt = opt || {};
    relayoutFn = browsOpt.callback || browsOpt.update;
    if(!window.document.getElementById('content')) {
        $('body').append('<div id="content"></div>');
    }
    if(!Modernizr.touch) {
        $('body').css('overflow', 'hidden');
    } else {
        $('body').append('<div style="height:' +
                (Math.max(webutil.windowHeight(),$(window).width()) + 62) +
                'px;background-color: black;"></div>');
    }
    $('body').css('background-color', 'black');
    $(window).bind('resize', relayoutDelayed);
    $(window).bind('orientationchange', relayoutDelayed);
    relayout();
};
