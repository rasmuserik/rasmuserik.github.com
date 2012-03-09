(function(){

    // OK, WARNING:
    //
    // This is a quick hack
    // to create some fancy slide transitions
    // for the presentation.
    //
    // Purely crappy code
    // not to be reused or maintained
    // please close your eyes
    // when trying to look at it :)
    //



    function startTimer() {
        var deadline = + new Date() + 15*60*1000 + 1500;
        $('body').append('<div class="timer"></div>');

        setInterval(function() {
            var time = deadline - new Date();
            $(".timer").text( time<0?'':  (time / 60000|0)+':' + (100+(time/1000|0)%60).toString().slice(1));
        }, 1000);

    }
    function vendorPrefix(attr, val) {
        var result = {};
        ['', '-ms-', '-moz-', '-webkit-', '-o-'].forEach(function(prefix) {
            result[prefix+attr] = val;
        });
        return result;
    }

    var scaleX, scaleY;
    function zoomout() {
        scaleX = $(window).width() / $('.main').width() ;
        scaleY = $(window).height() / $('.main').height() ;
        var scaleStr = 'scale(' + scaleX + ', ' + scaleY+ ')';
        $('.main')
            .css({top: 0, left: 0})
            .css(vendorPrefix('transform-origin', '0px 0px'))
            .css(vendorPrefix('transform', scaleStr));
    }
    function zoomin(slide) {
        var scaleValX = scaleX * 690 / 300;
        var scaleValY = scaleY * 690 / 300;
        var scaleStr = 'scale(' + scaleValX + ', ' + scaleValY + ')';
        $m = $('.main');
        
        $m.css(vendorPrefix('transform-origin', '0px 0px'))
          .css(vendorPrefix('transform', scaleStr));
        var ptX = $m.height()/690*scaleValX;
        var ptY = $m.height()/690*scaleValY;
        var slides = [ 
            {top: -340*ptY, left: -490*ptX},
            {top: -340*ptY, left: -30*ptX}
        ];
        $m.css(slides[slide]);
    }
    $(window).resize(zoomout);
    $(function() {
        zoomout();
        var step = 1;
        function nextSlide() {
            step = step+1&3;
            if(step&1) {
                zoomout();
            } else {
                zoomin(step/2);
            }
        }
        $(document).on('mousedown', nextSlide);

        $(document).on('keydown', nextSlide);
        setTimeout(function() {
            $('.main')
                .css(vendorPrefix('transition', 'all 1s'))
                .css('position', 'fixed');
        }, 0);
        startTimer();
    });
})();
