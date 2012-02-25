define([], function() {
    function arrayToDivTree(list) {
        var elem = document.createElement('div');
        if(typeof list === 'string') {
            elem.appendChild(document.createTextNode(list));
            return elem;
        }
        if(!Array.isArray(list)) {
            throw {error: 'not valid list'};
        }
        for(var i = 0; i < list.length; ++i) {
            elem.appendChild(arrayToDivTree(list[i]));
        }
        return elem;
    }
    return arrayToDivTree;
})
