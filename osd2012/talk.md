# Initial abstract

    Programming practices such as: continuous integration with travis-ci,
    scripting and server-side code with node.js, modules and packaging
    (commonjs, npm, ...), cross-platform mobile apps with PhoneGap, and
    the what's and why's on the language and virtual machines. Code and
    slides for the talk will be online on http://solsort.dk/.

# Outline draft

opposites: browser vs. serverside

- intro
    - why and what, - state of javascript
    - practical, - dive into a sample project
    - a glimpse into the future(present)
- javascript - why and what
    - why
        - cross platform ubiquity
        - functional
        - state of the art: dynamic language virtual machines
    - what
        - async => what-not
        - somewhat functional language
        - scripting (regex, hashmaps, ...)
        - dynamic 
        - prototypal object model
        - browser vs. server side
        - where-to harmony
- javascript engines, compilers and virtual machines
    - v8 - node.js, chrome
    - SpiderMonkey - Mozilla
    - JavaScriptCore - Qt, Safari, Android
    - Rhino - Java SE 6
    - Carakan/... (Opera), Chakra/... (Microsoft), 
    - Nashorn, Java SE 8, to be open, webkit+node-compat, ?2013?
    - traceour - harmony
- Best practice
    - modules
        - commonjs modules + async: requirejs, ender, 
        - harmony
    - packaging
        - npm
        - mobile via phonegap
        - widget spec
        - cache manifest
    - testing
        - unit testing: jasmine, mocha,...
        - system testing: Selenium, zombie.js, ...
        - continous integration with travis
        - code coverage
    - documentation
        - Literate programming: docco
        - API-documentation: jsdoc
    - code style: several exists, choose one. The one from google is a good bet.
