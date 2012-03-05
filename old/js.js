(function() {
    var name = location.href.split("?");
    if(name.length !== 2) throw document.write("Invalid url parameter");
    name = name[1];

    var elem = document.createElement('script');
    elem.src = name + ".js";
    document.write("loading: " + name + ".js");
)();
