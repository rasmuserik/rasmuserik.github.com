var window = require('window');
var storage = window.localStorage;
var $ = require('zquery');
var _ = require('underscore');
var util = require('util');

var account;
var lastTime;
var recentLog;
var tasks;
var changes;


function update() {
    var elem = false;
    if(Object.keys(changes).length > 0) {
        elem = changes[Object.keys(changes)[0]];
        console.log('WARNING:', elem, changes);
    }

    var url = '<script src="https://rasmuserik-timelog.appspot.com/?' +
        'callback=timelogResponseFromServer' +
        '&name=' + account +
        '&since=' + lastTime;
    if(elem) {
        url += '&id=' + elem.id + '&value=' + window.escape(elem.value);
    }
    url += '"></script>';
    window.document.write(url);
}

function setCurrent(name) {
    var now = +new Date();
    changes[now] = {id: now, value: name};
    update();
}

exports.update = update;

window.timelogResponseFromServer = function(eventArr) {
    eventArr.forEach(function(elem) {
        recentLog[elem.id] = elem;
        lastTime = Math.max(lastTime, elem.timestamp);
        var task = tasks[elem.value] || {value: elem.value, earliest: elem.id, latest: 0};
        task.latest = Math.max(task.latest, elem.id);
        tasks[elem.value] = task;
        if(changes[elem.id]) {
            delete changes[elem.id];
        }
    });
    if(eventArr.length === 1000 || Object.keys(changes).length > 0) {
        update();
    }
    save();
};

function save() {
    storage.setItem('timelogAccount', account);
    storage.setItem('timelogLastTime', JSON.stringify(lastTime));
    storage.setItem('timelogRecentLog', JSON.stringify(recentLog));
    storage.setItem('timelogTasks', JSON.stringify(tasks));
    storage.setItem('timelogChanges', JSON.stringify(changes));
}

function openAccount() {
    account = storage.getItem('timelogAccount') || window.prompt('Please enter a name/passphrase for your timelog account. This should be a globally uniq secret name only you should know. Anybody knowing the name can acces the timelog account. If the name does not exist already, a new timelog will be created');
    if(!account) {
        throw {error: 'no timelog account'};
    }
    storage.setItem('timelogAccount', account);
    lastTime = JSON.parse(storage.getItem('timelogLastTime') || '0');
    recentLog = JSON.parse(storage.getItem('timelogRecentLog') || '{}');
    tasks = JSON.parse(storage.getItem('timelogTasks') || '{}');
    changes = JSON.parse(storage.getItem('timelogChanges') || '{}');
}

function getTaskList(n) {
    var entries = _(tasks)
            .values()
            .sort(function(a,b) { return b.latest - a.latest; })
            .slice(0, n);
    var result = [];
    entries = entries.sort(function(a,b) { return b.earliest - a.earliest; });
    return _(entries).pluck('value');
}
function getCurrent() {
    var time = 0;
    var value = '';
    _(tasks).each(function(_, entry) {
            if(entry.latest > time) {
                value = entry.value;
                time = entry.latest;
            }
    });
    return value;
}

exports.main = function() {
    openAccount();
    update();
    console.log(getTaskList(16));
    console.log(getCurrent());
};
