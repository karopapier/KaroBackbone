var Map = Backbone.Model.extend(/** @lends Map.prototype*/{
    defaults: {
        id: 0,
        cps: [],
        rows: 0,
        cols: 0
    },
    /**
     * Represents the map and its code
     * @constructor Map
     * @class Map
     */
    initialize: function () {
        _.bindAll(this, "updateMapcode", "updateSize", "updateStarties", "updateCpList", "setFieldAtRowCol", "getFieldAtRowCol", "getPosFromRowCol");
        this.bind("change:mapcode", this.updateMapcode);
    },
    setMapcode: function(mapcode) {
        //make sure we don't have CR in there and make it all UPPERCASE
        var trimcode = mapcode.toUpperCase();
        trimcode = trimcode.replace(/\r/g, "");
        this.set("mapcode", trimcode, {silent: true});
        this.updateSize();
        this.updateStarties();
        this.updateCpList();
    },
    updateMapcode: function (e, mapcode) {
        this.setMapcode(mapcode);
    },
    updateStarties: function () {
        this.set("starties", (this.get("mapcode").match(/S/g) || []).length);
    },
    updateCpList: function () {
        this.set("cps", (this.get("mapcode").match(/\d/g) || []).sort().filter(function (el, i, a) {
            if (i == a.indexOf(el))return 1;
            return 0
        }));
    },
    updateSize: function () {
        var lines = this.get("mapcode").split('\n');
        this.set({"rows": lines.length});
        var line = lines[0].trim();
        this.set("cols", line.length);
    },
    withinBounds: function(opt) {
        if ((opt.hasOwnProperty("row")) && opt.hasOwnProperty("col")) {
            var x = opt.col;
            var y= opt.row;
        } else if ((opt.hasOwnProperty("x")) && (opt.hasOwnProperty("y"))) {
            var x = opt.x;
            var y= opt.y;
        } else {
            console.error(opt)
            throw "param for withinBounds unclear";
        }
        if (x < 0) return false;
        if (y < 0) return false;
        if (x > this.get("cols")-1) return false;
        if (y > this.get("rows")-1) return false;
        return true;
    },
    setFieldAtRowCol: function (r, c, field) {
        var pos = this.getPosFromRowCol(r, c);
        var mapcode = this.get("mapcode");
        var l = mapcode.length;
        mapcode = mapcode.substr(0, pos) + field + mapcode.substr(pos + 1);
        this.set("mapcode", mapcode);
    },
    /**
     *
     * @param r 0..rows-1
     * @param c 0..cols-1
     * @returns {String}
     */
    getFieldAtRowCol: function (r, c) {
        //console.log(r, c);
        if (!this.withinBounds({row: r, col: c})) {
            console.error(r,c);
            throw  "Row " + r + ", Col " + c + " not within bounds";
            return false;
        }
        var pos = this.getPosFromRowCol(r, c);
        //console.log("Ich sag",pos);
        return this.get("mapcode").charAt(pos);
    },
    getPosFromRowCol: function (r, c) {
        var pos = ( r * (this.get("cols") + 1)) + c;
        return pos;
    },
    FIELDS: {
        "F": "finish",
        "O": "road",
        "P": "parc",
        "S": "start",
        "V": "stone",
        "W": "water",
        "X": "grass",
        "Y": "sand",
        "Z": "mud",
        ".": "night",
        "1": "cp1",
        "2": "cp2",
        "3": "cp3",
        "4": "cp4",
        "5": "cp5",
        "6": "cp6",
        "7": "cp7",
        "8": "cp8",
        "9": "cp9"
    }
});
