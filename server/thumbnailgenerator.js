#!/usr/bin/env node

var Promise = require("es6-promise").Promise;
var http = require('http');

var rendr = require('rendr');

var MapRenderView = require('../src/view/map/MapRenderView');

var userArgs = process.argv.slice(2);

var gid = userArgs[0];
var outputfilepath = userArgs[1];

function exitWithUsage() {
    console.log('Usage: node thumbnailgenerator.js 82345 ../images/82345.png');
    return false;
}

if (!gid || !outputfilepath) {
    exitWithUsage();
    return false;
}

console.log("Create Thumbnail for GID", gid, "to", outputfilepath);

function getGameDetails(gid) {
    return new Promise(function(resolve, reject) {
        var options = {
            host: 'www.karopapier.de',
            path: 'http://www.karopapier.de/api/game/' + gid + '/details.json'
        };

        callback = function(response) {
            var str = '';

            //another chunk of data has been recieved, so append it to `str`
            response.on('data', function(chunk) {
                str += chunk;
            });

            //the whole response has been recieved, so we just print it out here
            response.on('end', function() {
                resolve(JSON.parse(str));
            });
        }

        http.request(options, callback).end();
    });
};

function getMapcodeFromDetails(details) {
    return new Promise(function(resolve, reject) {
        resolve(details.map.mapcode);
    });
}

function logval(val) {
    console.log(val);
}

getGameDetails(gid)
    .then(getMapcodeFromDetails)
    .then(function(mapcode) {
        var code = mapcode;
        logval(code);
        var mrv = new MapRenderView();
        //mrv.setMapcode(mapcode);
        //logval(mrv.ctx);
    })
    .catch(function(err) {
        console.error(err);
    });

