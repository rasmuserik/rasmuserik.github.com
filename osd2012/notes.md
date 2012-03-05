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
