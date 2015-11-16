var MapPathStore = Backbone.Model.extend({
    getPath: function (mapid, cb) {
        var rows = 0;
        var cols = 0;
        var path = "";

        var amifinished = function () {
            //console.log("check if finished");
            //we should have the path and dimensions here
            //console.log(path);
            if (path===false) {
                //console.warn("I stop this!!!")
                cb(false);
                return false;
            }
            if (rows != 0 && cols != 0 && path != "") {
                var m = {};
                m.r = rows;
                m.c = cols;

                var xml = (new XMLSerializer).serializeToString(path);
                m.p = xml;
                store.set("map" + mapid, m);
                cb(m);
            } else {
                //console.log("Fehlt noch was");
            }
        };

        //check if we have the path in store
        var i = store.get("map" + mapid);
        if (i) {
            //console.log ("I from store",i);
            cb(i);
        } else {
            //we need to get the path and dimensions via request
            $.get("/paths/" + mapid + ".svg", function (data) {
                //console.debug(data);
                path = data.getElementById("mapSvgView");
                amifinished();
            }).fail(function(err) {
                console.error(err);
                path = false;
                amifinished();
            });
            $.getJSON("//www.karopapier.de/api/map/" + mapid + ".json?callback=?", function (data) {
                //console.log(data);
                rows = data.rows;
                cols = data.cols;
                amifinished();
            });
        }
    },
    getFromUrl: function (id) {  },
    getFromStore: function (id) {  },
    saveToStore: function (id, path) {  }
});
