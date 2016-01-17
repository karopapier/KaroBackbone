#!/usr/bin/env node

var Promise = require("es6-promise").Promise;
var http = require('http');

var MapRenderView = require('../)

console.log("Usage: node thumbnailgenerator.js 82345 ../images/82345.png");
var userArgs = process.argv.slice(2);

var gid = userArgs[0];
var outputfilepath = userArgs[1];

console.log("Create Thumbnail for GID", gid, "to", outputfilepath);

function getGameDetails(gid) {
    return new Promise(function(resolve, reject) {
        var options = {
            host: 'www.karopapier.de',
            path: 'http://www.karopapier.de/api/game/44773/details.json'
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
    })
};

function getMapcode(details) {
    return new Promise(function(resolve, reject) {
        resolve(details.map.mapcode);
    })
}

function logval(val) {
    console.log()
}

getGameDetails(gid)
    .then(getMapcode)
    .then(function(mapcode)
        .then()
        .{
        console.log(mapcode);
        code = mapcode;
    });


