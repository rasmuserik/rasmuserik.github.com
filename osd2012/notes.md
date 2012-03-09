# Initial abstract

    Programming practices such as: continuous integration with travis-ci,
    scripting and server-side code with node.js, modules and packaging
    (commonjs, npm, ...), cross-platform mobile apps with PhoneGap, and
    the what's and why's on the language and virtual machines. Code and
    slides for the talk will be online on http://solsort.dk/.

# Outline draft

opposites: browser vs. serverside

- intro
    - why:
        - ubiquitous scripting language with good virtual machines
    - what:
        - javascript features
    - how:
        - best practices


- Why - ubiquitous platform with good virtual machines 
    - ubiquitous
        - webbrowsers
        - smartphones (sometimes the only option)
        - scripting in applications (both open and proprietary)
        - server-side (node, java, embedded)
    - engines
        - v8 - node.js, chrome
        - SpiderMonkey - Mozilla
        - JavaScriptCore - Qt, Safari, Android
        - Rhino - Java SE 6
        - Opera Carakan/futhark/..., Microsoft Chakra/JScript, Embedthis Ejscript, Adobe ActionScript, Unity UnityScript
        - Nashorn, Java SE 8, to be open, webkit+node-compat, ?2013?

- What - javascript features and issues
    - somewhat functional dynamic asynchronous scripting language with prototypal object model, c-like syntax, and good and bad parts.

- How, - good practices
    - modules
        - commonjs - enderjs, browserify, ...
        - amd (Asynchronous Module Definition) - requirejs, ...
        - harmony
    - packaging
        - npm
        - mobile via phonegap
        - widget spec
        - minify (closure/uglify/...)
        - cache manifest
    - testing
        - Unit testing: jasmine, mocha,...
        - System testing: Selenium, zombie.js, ...
        - Continous integration with travis
        - Code coverage
    - documentation
        - Literate programming: docco
        - API-documentation: jsdoc
    - code style
        - avoid the bad parts, learn the good parts 
        - jshint, jslint, closure
        - style guides: choose one ie. google-styleguide 
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Serious JavaScript</title>
    <link href='http://fonts.googleapis.com/css?family=Ubuntu:400,700' rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Ubuntu+Condensed:400' rel='stylesheet' type='text/css'>
    <style>
        body {
            font-family: 'Ubuntu', sans-serif;
        }
        .main {
            position: fixed;
            top: 0px;
            left: 0px;
            width: 920pt;
            height: 690pt;
        }
        .main div {
            margin: 0pt;
            padding: 0pt;
        }
        .slide {
            border: 3pt solid black;
            margin: 0pt;
            padding: 0pt;
            position: absolute;
            width: 400pt;
            height: 300pt;
        }
        h1 {
            margin: 40pt 0pt 20pt 0pt;;
            padding: 0pt;
            font-size: 96pt;
        }
        h2 {
            font-size: 48pt;
            margin: 12pt;
            padding: 0pt;
        }

        .intro {
            left: 480pt;
            top: 140pt;
            text-align: center;
        }
        .intro div {
            font-size: 36pt;
            line-height: 140%;
        }

        .what {
            /*left: 30pt;
            top: 340pt;*/
            left: 27pt;
            top: 337pt;
        }
        .what .descr {
            position: absolute;
            top: 84pt;
            left: 60pt;
            font-size: 24pt;
            width: 340pt;
            text-align: left;
            line-height: 140%;
        }

        .how {
            /*left: 490pt;
            top: 340pt;*/
            left: 487pt;
             top: 337pt;
        }
        .how h2 {
            text-align: right;
        }
        .how h3 {
            /* font-weight: normal;*/
            font-family: 'Ubuntu', sans-serif;
            text-align: left;
            margin: 0pt 0pt 0pt 0pt;
        }
        .how > div {
            position: absolute;
            line-height: 120%;
            left: 24pt;
            font-family: 'Ubuntu', 'Ariel', sans-serif;
            margin: 0pt;
            padding: 0pt;
            font-size: 16pt;
        /*    width: 182pt;*/
        }
        /*
        .how .right h3 {
            text-align: right;
        }
        .how .right {
            text-align: right;
        }
        */
        .how > div {
            top: 18pt;
            width: 352pt;
            left: 20pt;
            text-align: left;
        }
        .how h3 {
            margin-top: 18pt;
            text-align: left;
        }
        .how > div > div:before {
            content: " • ";
        }

        .where {
            left: 480pt;
            top: 360pt;
        }
        .where div {
            line-height: 140%;
            font-size: 12pt;
        }
        .where h3 {
            /* font-weight: normal;*/
            text-align: left;
            margin: 0pt 0pt 6pt 0pt;
        }
        .where .top {
            position: absolute;
            top: 96pt;
        }
        .where .bottom {
            position: absolute;
            top: 190pt;
        }
        .where .left {
            left: 12pt;
            width: 100pt;
        }
        .where .middle {
            left: 126pt;
            width: 100pt;
            padding-left: 6pt;
            padding-right: 0pt;
        }
        .where .right h3 {
            letter-spacing: -0.9pt;
        }
        .where .right {
            font-family: 'Ubuntu', 'Ubuntu', sans-serif;
            left: 236pt;
            width: 160pt;
        }

        .timer {
            float: right;
            font-size: 16pt;
        }
    </style>
    <script src="../lib/es5-shim.min.js"></script>
    <script src="../lib/jquery-1.7.1.min.js"></script>
    <script>(function(){
        function now() {
            return (new Date()).getTime();
        }
        function startTimer() {
            var deadline = now() + 15*60*1000 + 1500;

            setInterval(function() {
                var time = deadline - now();
                $(".timer").text( time<0?'':  (time / 60000|0)+':' + (100+(time/1000|0)%60).toString().slice(1));
            }, 1000);
            //$(".timer").text(now());

        }
        function vendorPrefix(attr, val) {
            var result = {};
            ['', '-ms-', '-moz-', '-webkit-', '-o-'].forEach(function(prefix) {
                result[prefix+attr] = val;
            });
            return result;
        }
        var scale;
        function zoomout() {
            scale = $(window).height() / $('.main').height() ;
            var scaleStr = 'scale(' + scale + ', ' + scale + ')';
            $('.main')
                .css({top: 0, left: 0})
                .css(vendorPrefix('transform-origin', '0px 0px'))
                .css(vendorPrefix('transform', scaleStr));
        }
        function zoomin(slide) {
            var scaleVal = scale * 690 / 300;
            var scaleStr = 'scale(' + scaleVal + ', ' + scaleVal + ')';
            $m = $('.main');
            
            $m.css(vendorPrefix('transform-origin', '0px 0px'))
              .css(vendorPrefix('transform', scaleStr));
            var pt = $m.height()/690*scaleVal;
            var slides = [ 
                {top: -340*pt, left: -490*pt},
                {top: -340*pt, left: -30*pt}
            ];
            $m.css(slides[slide]);
        }
        $(window).resize(zoomout);
        $(function() {
            zoomout();
            var step = 1;

            $(document).on('keydown', function(ev) {
                var key = ev.keyCode;
                console.log(ev.keyCode);
                if([32, 39,40, 34, 9, 13].indexOf(key) !== -1) {
                    ++step;
                } else if([33, 38, 37, 20].indexOf(key) !== -1) {
                    --step;
                }
                if(49 <= key && key <= 52) {
                    step = (key - 49) * 2
                }
                if(key === 48) {
                    step = 1;
                }
                step = step&3;
                if(step&1) {
                    zoomout();
                } else {
                    zoomin(step/2);
                }
            });
            setTimeout(function() {
                $('.main').css(vendorPrefix('transition', 'all 1s'));
            }, 0);
            startTimer();
        });
    })();</script>
  </head>
  <body>
    <div class="timer"></div>
    <div class="main">
        <div class="intro">
            <h1>Serious JavaScript</h1>
            <div class="author"><sup>by</sup> Rasmus&thinsp;@&thinsp;solsort.dk</div>
            <div class="slidelink">
                slides and more at:&ensp;<a href="http://solsort.dk/osd2012">solsort.dk&#8202;/&#8202;osd2012</a>
            </div>
        </div>
        <!-- div class="where slide">
            <h2>Where&thinsp;?</h2>
            <div class="javascriptcore top left">
                <h3>JavaScriptCore</h3>
                <div>Safari</div>
                <div>Smartphones</div>
                <div>Qt &amp; Qt Quick</div>
            </div>
            <div class="v8 box top middle">
                <h3>V8</h3>
                <div>Chrome</div>
                <div>Generational GC</div>
                <div>node.js</div>
            </div>
            <div class="spidermonkey box bottom left">
                <h3>SpiderMonkey</h3>
                <div>Mozilla Firefox</div>
                <div>Tracing JIT</div>
                <div>NoSQL, PDF</div>
            </div>
            <div class="rhino box bottom bottom middle">
                <h3>Rhino</h3>
                <div>Mozilla</div>
                <div>Java Integration</div>
                <div>Part of Java SE 6</div>
            </div>
            <div class="browsers box top right">
                <h3>Other browsers engines</h3>
                <div>KJS • KDE</div>
                <div>Chakra, JScript • Microsoft</div>
                <div>Carakan, Futhark • Opera</div>
            </div>
            <div class="engines box bottom right">
                <h3>Other embedded engines</h3>
                <div>Nashorn: Java SE 8, 2013</div>
                <div>ActionScript, UnityScript</div>
                <div>EjScript, MiniJoe, LightScript</div>
            </div>
        </div-->
        <div class="what slide">
            <h2>What&thinsp;?</h2>
            <div class="descr">
                JavaScript:&ensp;ubiquitous <br/>
                somewhat functional <br/>
                scripting language with <br/>
                good virtual machines
                <!--asynchronous&ensp;dynamic <br/>

                prototypal object model <br/>
                and quirks.
                -->
            </div>
        </div>
        <div class="how slide">
            <h2>How&thinsp;?</h2>
            <div>
                    <h3>Testing</h3>
                    <div>Unit testing: Jasmine</div>
                    <div>System testing: Selenium</div>  
                    <div>Continous integration: Travis&nbsp;CI</div>
                    <h3>Documentation</h3>
                    <div>API-documentation: JSDoc</div>
                    <div>Literate programming: Docco</div>
                    <h3>Modules and packaging</h3>
                    <div>CommonJS Modules: exports, require</div>
                    <div>Node Package Manager: package.json</div>
                    <div>Mobile Apps via Cordova(PhoneGap)</div>
            </div>
            <!--div class="modules">
                <h3>Modules</h3>
                <div>CommonJS Modules</div>
                <div>EnderJS, Browserify, ...</div>
                <div>Future: Harmony (via Traceur)</div>
            </div>
            <div class="testing">
                <h3>Testing</h3>
                <div>Unit testing: Jasmine</div>
                <div>System testing: Selenium</div>  
                <div>Continous integration: Travis&nbsp;CI</div>
                <div>Code coverage</div>
            </div>
            <div class="documentation">
                <h3>Documentation</h3>
                <div>API-documentation: JSDoc</div>
                <div>Literate programming: Docco</div>
            </div>
            <div class="packaging">
                <h3>Modules and packaging</h3>
                <div>CommonJS Modules: <small><tt>exports</tt>, <tt>require</tt></small></div>
                <div>Node Package Manager</div>
                <div>Mobile Apps via Cordova(PhoneGap)</div>
                <div>Cache manifest and widget spec</div>
            </div>
            <div class="codestyle">
                <h3>Code Style</h3>
                <div>Bad parts, good parts, "use strict"</div>
                <div>Style checking: JSHint, Closure</div>
            </div-->
        </div>
    </div>
  </body>
</html>
