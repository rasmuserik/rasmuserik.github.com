define(['zquery', 'modernizr', 'window', 'exports'], function($, modernizr, window, exports) { 'use strict';
    // # Util
    function niceSingle(fn) {
        var running = false;
        return function() {
            if(running) {
                return;
            }
            running = true;
            window.setTimeout(function() {
                fn();
                running = false;
            }, 10);
        };
    }

    function windowHeight() {
        var height = $(window).height();
        // workaround buggy window height on iOS
        if(height === 356 || height === 208) {
            height += 60;
        }
        return height;
    }

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
            .css('height', browsOpt.scrollable ? 'auto' : windowHeight());
        if(typeof relayoutFn === 'function') {
            relayoutFn(window.document.getElementById('content'));
        }
        window.scrollTo(0,1);
    }
    var relayoutDelayed = niceSingle(relayout);

    var init = exports.init = function(opt) {
        browsOpt = opt || {};
        relayoutFn = opt.callback;
        if(!window.document.getElementById('content')) {
            $('body').append('<div id="content"></div>');
        }
        if(!modernizr.touch) {
            $('body').css('overflow', 'hidden');
        } else {
            $('body').append('<div style="height:' + 
                    (Math.max(windowHeight(),$(window).width()) + 62) + 
                    'px;background-color: black;"></div>');
        }
        $('body').css('background', 'black');
        $(window).bind('resize', relayoutDelayed);
        $(window).bind('orientationchange', relayoutDelayed);
        relayout();
    };
});
