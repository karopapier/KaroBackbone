// Load the http module to create an http server.
var http = require('http');

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
        response.writeHead(200, {"Content-Type": "text/html"});

        var coll = [
            {
                "id": "cm82c7a31e7243445fc6b7797a0f5843d1",
                "user": "mr-burns123",
                "text": "aber beim zweiten Crash war das doch eigentlich ein ZZZ von 2",
                "time": "17:39"    },
            {
                "id": "cm8bc66287641f06f01f6a9e96c935207e",
                "user": "Akari",
                "text": "interessantes verhalten, mu\u00df ich mir merken",
                "time": "17:53"    },
            {
                "id": "cm5302281083017806700d0038e7e48e63",
                "user": "Botrix",
                "text": "Heute gibt es Eiersalat!",
                "time": "18:57"
            },
            {
                "id": "cm232a120ad8ee7ab70f057ab33ae9da4a",
                "user": "Calypso",
                "text": "quabla: &quot;1 != 0&quot;",
                "time": "23:17"    },
            {
                "id": "cme6d61eabfe43feadda7d4288368d3723",
                "user": "quabla",
                "text": "burns, du darfst mich crashmeister nennen.",
                "time": "23:46"    },
            {
                "id": "cm888a8ffeee23ff1aef9403ddd57b708c",
                "user": "quabla",
                "text": "wasndasfuernzitat, du blech?",
                "time": "23:47"    },
            {
                "id": "cm83c6d61df10780f6fee6ad6b79f0951b",
                "user": "Didi",
                "text": "Welches Blech? ",
                "time": "6:37"    },
            {
                "id": "cm433c9c64349dbae36090249e927646af",
                "user": "karoheinzi",
                "text": "moin - nette Besucherzahl 444844",
                "time": "7:15"    },
            {
                "id": "cmaca7c2ce2c7eeab0b90221df73ba6f06",
                "user": "Akari",
                "text": "ja, ja, jaaaahhh, 3k Wollust geschaft",
                "time": "7:31"    },
            {
                "id": "cma2b943f0c2282bcd94651c748e6fb3c6",
                "user": "CarpeNoctem",
                "text": "knapp 2k ;)",
                "time": "9:17"    },
            {
                "id": "cma2b943f0c223577d94651c748e6fb3c6",
                "user": "Didi",
                "text": "Anders;)",
                "time": "9:17"    }
        ];

        var url = require('url');
        var url_parts = url.parse(request.url, true);
        var query = url_parts.query;
        var callback = query["callback"];
        var responseBody =""
        if (callback) {
            responseBody=callback + "(";
        }
        responseBody += JSON.stringify(coll);
        if (callback) {
            responseBody+= ")";
        }
        response.end(responseBody);
    })
    ;

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(8000);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8000/");