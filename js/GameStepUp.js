
var game = new Game();
game.load(GameId);

var mmv = new MoveMessageView({
    el: '#moveMessages',
    collection: game.moveMessages
});

var giv = new GameInfoView({
    model: game,
    el: "#gameInfo"
});

var gtv = new GameTitleView({
    el: "#gameTitle",
    model: game
});

                changeMap(96);

            function getMap(mapid, cb) {
                var rows = 0;
                var cols = 0;
                var path = "";

                var amifinished = function () {
                    //console.log("check if finished");
                    if (rows != 0 && cols != 0 && path != "") {
                        var m = {};
                        m.r = rows;
                        m.c = cols;
                        m.p = LZString.compress(path);
                        store.set("map" + mapid, m);
                        cb(m);
                    } else {
                        //console.errorlog("Fehlt noch was");
                    }
                };

                var i = store.get("map" + mapid);
                if (i) {
                    //console.log ("I from store",i);
                    cb(i);
                } else {
                    $.get("/paths/" + mapid + ".svg", function (data) {
                        //console.log(data);
                        path = data;
                        amifinished();
                    });
                    $.getJSON("http://www.karopapier.de/api/map/" + mapid + ".json?callback=?", function (data) {
                        //console.log(data);
                        rows = data.rows;
                        cols = data.cols;
                        amifinished();
                    });
                }
            }

            function changeMap(mapid) {

                getMap(mapid, function (map) {
                    //console.log("Ich hab ne Karte",map);
                    var parser = new DOMParser();
                    var path = map.p;
                    if (path.charAt(0) != "<") {
                        path = LZString.decompress(path);
                    }
                    var doc = parser.parseFromString(path, "image/svg+xml");
                    //console.log(doc);
                    //console.log(document.getElementById("map").firstChild);
                    var mapNode = document.getElementById("map");
                    //console.log(mapNode);
                    while (mapNode.childNodes.length > 0) {
                        var f = mapNode.firstChild;
                        mapNode.removeChild(f);
                    }
                    //console.log("Jetzt einfug");
                    document.getElementById("map").appendChild(document.importNode(doc.getElementsByTagName("svg")[0], true));
                    //console.log("Gefugt");
                    //$('#map').html(map.path);
                    //$('#map').append(doc);
                    //$(doc).appendTo($('#map'));
                    document.getElementById('mapSvgView').setAttribute("viewBox", "0 0 " + (map.c * 12) + " " + (map.r * 12));


                    //funky scal calc
                    //take width for granted and adjust height to certain max height, then start using transform
                    //maxzoom = 3;


                    //alert(document.getElementById('mapSvgView').currentScale);
                });
            }

            function loadSvgToId(url, id) {
                $.get(url, function (text) {
                    //console.log("HIER mit url",url);
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(text, "image/svg+xml");
                    //console.log("Doc",doc);
                    document.getElementById(id).appendChild(document.importNode(doc.getElementsByTagName(id)[0], true));
                });
            }
            ;

