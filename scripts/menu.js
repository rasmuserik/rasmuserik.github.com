define(['jquery', 'modernizr'], function($, modernizr) {
    var arraySlice = Array.prototype.slice.apply.bind(Array.prototype.slice);
    var margin = 3;
    var titlesize = 20;
    var border = modernizr.boxshadow ? 0 : 1;

    function elemToObj(elem) {
        var result = {};
        return {
            title: $(elem.firstChild).text().trim(),
            children: arraySlice($(elem).find('> ul > li'))
                .map(elemToObj),
            url: $(elem).find('> a').attr('href'),
            elem: elem
        }
    }

    var seed = 1;
    function pseudoRandom(n) {
        return seed = (1664525 * (n || seed) + 1013904223) |0
    }

    function colorHash(text) {
        var result = 0;
        for(var i=0;i<text.length; ++i) {
            result = pseudoRandom(result + text.charCodeAt(i));
        }
        return "#" + ((result | 0xe0e0e0)&0xffffff).toString(16);
    }

    function reset(menu) {
        var style = menu.elem.style;
        style.fontSize = '16px';
        style.display = 'block'; 
        style.position = 'absolute'; 
        style.padding = margin/2 + 'px';
        style.top = '100px'; 
        style.left = '100px'; 
        style.margin = margin + 'px';
        style.textAlign = 'center';
        style.borderRadius = margin*2 + 'px';
        style.border = border + 'px solid #000000'; 
        style.overflow = 'hidden';
        style.backgroundColor = colorHash(menu.title);
        style.boxShadow = '3px 3px 9px rgba(0, 0, 0, .8)';
        style.webkitBoxShadow = '3px 3px 9px rgba(0, 0, 0, .8)';
        //style.webkitBoxShadow = 'inset 3px 3px 9px rgba(0, 0, 0, 0.5)';
        menu.children.forEach(reset);
    }
    function totalSize(arr) {
        return arr.reduce(function(a,b) { return a + b.size; }, 0);
    }

    function calcSize(menu) {
        menu.children.forEach(calcSize);
        menu.size = totalSize(menu.children)/1.5 + 1;
    }
    function position(menu, x, y, w, h) {
        w-= 2*(margin + border);
        h-= 2*(margin + border);
        var style = menu.elem.style;
        style.left = x + 'px';
        style.top = y + 'px';
        style.width = w + 'px';
        style.height = h + 'px';
        positionArray(menu.children, margin, titlesize+margin, w-margin*2, h-titlesize-margin*2);
    }

    function positionArray(arr, x, y, w, h) {
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

        if(w>1.2*h) {
            positionArray(arr1, x, y, w*ratio|0,h);
            positionArray(arr2, x + w*ratio|0, y, w-(w*ratio|0),h);
        } else {
            positionArray(arr1, x, y, w, h*ratio|0);
            positionArray(arr2, x ,y+h*ratio|0, w, h-(h*ratio|0));
        }
    }

    $(function() {
        //$('body').css('overflow', 'hidden');
        $('body').css('background', 'black');
        $('body').prepend('<div style="width:1000px; height:1000px;">blah</div>');
        $('a').css('border', 'none');
        var menu = elemToObj($('div > ul > li')[0]);
 //       $('div > ul > li')[1].style.display = 'none';
        reset(menu);
        calcSize(menu);
        position(menu, 0-margin,1+0-margin,$(window).width()+margin, $(window).height()+margin);

        function niceSingle(fn) {
            var running = false;
            return function() {
                if(running) {
                    return;
                }
                running = true;
                setTimeout(function() {
                    fn();
                    running = false;
                }, 100);
            }
        }

        window.scrollTo(1,0);
        $(window).resize(niceSingle(function() {
            position(menu, 0-margin,1+0-margin,$(window).width()+margin, $(window).height()+margin);
            window.scrollTo(1,0);
        }));
    });
});
