var $ = require('zquery');
var _ = require('underscore');
var console = require('console');

var doccoLineRegEx = /^\s*\/\/( |$)/;
function isDoccoComment(line) {
    return line.match(doccoLineRegEx);
}

function docco(text) {
    var i;
    var showdown = require('showdown');
    showdown = new showdown.converter();

    text = text.split('\n');
    var result = [];
    var current = [];
    var prevIsDocco = true;

    var lineno = 0;
    text.forEach(function(line) {
        var currentIsDocco = !!isDoccoComment(line);

        if(currentIsDocco) {
            line = line.replace(doccoLineRegEx, '');
        } else {
            line = {lineno: lineno, line: line};
        }

        if(prevIsDocco === currentIsDocco) {
            current.push(line);
        } else {
            result.push(current);
            current = [line];
        }
        prevIsDocco = currentIsDocco;
        ++lineno;
    });
    result.push(current);
    if(result.length & 1) {
        result.push([]);
    }

    var docs = [];
    var code = [];
    for(i = 0; i < result.length; i += 2) {
        docs.push(result[i]);
        code.push(result[i+1]);
    }
    docs = docs.map(function(doc) { return showdown.makeHtml(doc.join('\n')); });
    code = code.map(function(code) {
        return '<pre>' + _.escape(_.pluck(code, 'line').join('\n')) + '</pre>';
    });

    result = ['<table>'];
    for(i = 0; i < docs.length; ++i) {
        result.push('<tr><td style="vertical-align: top">');
        result.push(docs[i]);
        result.push('</td><td style="vertical-align: top">');
        result.push(code[i]);
        result.push('</td></tr>');
    }
    result.push('</table>');
    return result.join('');

}

exports.show = function(filename) {
    $.ajax({
        url: ('/scripts/' + filename + '.js'),
        dataType: 'text',
        success: function(text) {
            $('body').html(docco(text));
        }
    });
};
