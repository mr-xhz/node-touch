var path = require('path'),
    fs = require('fs');

var files = fs.readdirSync(__dirname);
var actions = {};
files.forEach(function(item){
    var m = require('./'+item);
    if(m.action && m.name){
        actions[m.name] = m;
    }
});

module.exports = {
    getAction(name){
        return actions[name];
    }
};