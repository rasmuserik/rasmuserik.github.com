var util = require('util');
var fullbrows = require('fullbrows');
var Modernizr = require('modernizr');
var $ = require('zquery');
var window = require('window');

var boxWidth = 1.5;
var position, positionArray; // recursive function forward declaration

// # Config
var margin = 2;
var padding = 2;
var titlesize = 20;
var border = Modernizr.boxshadow ? 0 : 1;

// # Transformation to nested list to object
function elemToObj(elem) {
    var result = {};
    result.title = $(elem.firstChild).text().trim();
    result.children = [];
    if(elem.children[0]) {
        var elems = elem.children[0].children;
        for(var i=0;i<elems.length;++i) {
            result.children.push(elemToObj(elems[i]));
        }
    }
    result.url = elem.children[0] && elem.children[0].href;
    result.elem = elem;
    return result;
}

// # Initialise the objects, calculate weight
function totalSize(arr) {
    return arr.reduce(function(a,b) { return a + b.size; }, 0);
}
// style the elemements, and calculate weight which will be the basis for their size
function initMenu(menu) {
    var style = menu.elem.style;
    style.fontSize = '16px';
    style.display = 'block';
    style.position = 'absolute';
    style.padding = padding + 'px';
    style.top = '100px';
    style.left = '100px';
    style.margin = margin + 'px';
    style.textAlign = 'center';
    style.borderRadius = margin*2 + 'px';
    style.border = border + 'px solid #000000';
    style.overflow = 'hidden';
    style.backgroundColor = util.colorHash(menu.title);
    style.boxShadow = '3px 3px 9px rgba(0, 0, 0, .8)';
    style.webkitBoxShadow = '3px 3px 9px rgba(0, 0, 0, .8)';
    if(menu.url) {
        var url = menu.url;
        $(menu.elem).bind(Modernizr.touch?'touchstart':'mousedown', function() {
            window.location = url;
        });
    }
    menu.children.forEach(initMenu);
    menu.size = totalSize(menu.children)/1.5 + 1;
    fullbrows.init({callback: function(elem) {
        position(menu, -margin,-margin,$(elem).width()+margin, $(elem).height()+margin);
    }});
}

// # Calculate position of boxes
position = function(menu, x, y, w, h) {
    w-= 2*(margin + border + padding);
    h-= 2*(margin + border + padding);
    var $elem = $(menu.elem);

    $elem.css('left', x)
         .css('top', y)
         .css('width', w);

    var fontsize = 16;
    $elem.css('fontSize', fontsize);
    if(menu.children.length === 0) {
        $elem.css('height', 'auto');
        while(fontsize && $elem.height() > h) {
            --fontsize;
            $elem.css('fontSize', fontsize);
        }
    }
    $elem.css('height', h);
    $elem.css('boxShadow', '3px 3px 9px rgba(0, 0, 0, .8)');
    positionArray(menu.children, padding*2, titlesize + padding, w-padding*2, h-titlesize-padding*2);
};

positionArray = function(arr, x, y, w, h) {
    if(arr.length === 0) {
        return;
    }
    if(arr.length === 1) {
        return position(arr[0], x, y, w, h);
    }
    var weight = totalSize(arr);
    var splitsum = weight;
    var sum = 0;

    // find the position in the array which
    // which splits it in two of same weight
    var pos = 0;
    var ratio;
    for(var i=0;i<arr.length;++i) {
        sum += arr[i].size;
        if(Math.abs(sum-weight/2) < splitsum) {
            pos = i+1;
            splitsum = Math.abs(sum-weight/2);
            ratio = sum / weight;
        }
    }

    var arr1 = arr.slice(0, pos);
    var arr2 = arr.slice(pos);

    if(w>boxWidth*h) {
        positionArray(arr1, x, y, w*ratio|0,h);
        positionArray(arr2, x + w*ratio|0, y, w-(w*ratio|0),h);
    } else {
        positionArray(arr1, x, y, w, h*ratio|0);
        positionArray(arr2, x ,y+h*ratio|0, w, h-(h*ratio|0));
    }
};

exports.doMenu = function(elem) {
    initMenu(elemToObj(elem));
};
