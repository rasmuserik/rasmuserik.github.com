define(['jquery'], function($) {
    var arraySlice = Array.prototype.slice.apply.bind(Array.prototype.slice);

    function elemToObj(elem) {
        return {
            title: $(elem.firstChild).text().trim(),
            children: arraySlice($(elem).find('> ul > li'))
                .map(elemToObj),
            url: $(elem).find('> a').attr('href'),
            elem: elem
        }
    }

    function reset(menu) {
        var style = menu.elem.style;
        style.display = 'block'; 
        style.position = 'absolute'; 
        style.top = '100px'; 
        style.left = '100px'; 
        style.width = '500px'; 
        style.border = '1px solid black'; 
        menu.children.forEach(reset);
    }
    function totalSize(arr) {
        return arr.reduce(function(a,b) { return a + b.size; }, 0);
    }

    function calcSize(menu) {
        menu.children.forEach(calcSize);
        menu.size = totalSize(menu.children)/3 + 1;
    }
    function position(menu, x, y, w, h) {
        console.log('position', menu.title, x, y ,w, h);
        var style = menu.elem.style;
        style.left = x + 'px';
        style.top = y + 'px';
        style.width = w + 'px';
        style.height = h + 'px';
        positionArray(menu.children, 0, 40, w, h-40);
    }

    blah = 100;
    function positionArray(arr, x, y, w, h) {
        console.log('positionArray', arr, x, y, w, h);
        if(arr.length === 0) {
            return;
        }
        if(arr.length === 1) {
            return position(arr[0], x, y, w, h);
        }
        var size = totalSize(arr);
        var sizeSum = 0;

        // find the position in the array which
        // which splits it in two of same weight
        var pos = -1;
        while(sizeSum < size/2) {
            sizeSum += arr[++pos].size;
        }
        if(size/2-(sizeSum-arr[pos].size) > sizeSum - size/2) {
            ++pos;
        }

        var arr1 = arr.slice(0, pos);
        var arr2 = arr.slice(pos);

        if(blah) {
            --blah;
        if(w>2*h) {
            positionArray(arr1, x, y, w/2|0,h);
            positionArray(arr2, x + w/2|0, y, w-(w/2|0),h);
        } else {
            positionArray(arr1, x, y, w, h/2|0);
            positionArray(arr2, x ,y+h/2|0, w, h-(h/2|0));
        }
        }
    }

    $(function() {
        $('a').css('border', 'none');
        var menu = elemToObj($('div > ul > li')[0]);
 //       $('div > ul > li')[1].style.display = 'none';
        reset(menu);
        calcSize(menu);
        position(menu, 0,0,$(window).width(), $(window).height());
        console.log(menu);
    });
});
