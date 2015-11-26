var Map = Backbone.Model.extend(/** @lends Map.prototype*/{
    defaults: {
        id: 0,
        cps: [],
        rows: 0,
        cols: 0,
        validFields: ["V","W","X", "Y", "Z", "O", "S", "F", "P", 1, 2, 3, 4, 5, 6, 7, 8, 9, "."]
    },
    /**
     * Represents the map and its code
     * @constructor Map
     * @class Map
     */
    initialize: function () {
        _.bindAll(this, "updateMapcode", "getCpList", "setFieldAtRowCol", "getFieldAtRowCol", "getPosFromRowCol");

        //sanitization binding
        this.bind("change:mapcode", this.updateMapcode);
    },
    setMapcode: function (mapcode) {
        //make sure we don't have CR in there and make it all UPPERCASE
        var trimcode = mapcode.toUpperCase();
        trimcode = trimcode.replace(/\r/g, "");

        //nb of start positions ("S")
        var starties = (trimcode.match(/S/g) || []).length;

        //calc rows and cols
        var lines = trimcode.split('\n');
        var rows = lines.length;
        var line = lines[0].trim();
        var cols = line.length;
        var cps = this.getCpList(trimcode);

        this.set({
            "mapcode": trimcode,
            "starties": starties,
            "rows": rows,
            "cols": cols,
            "cps": cps
        });
    },
    updateMapcode: function (e, mapcode) {
        this.setMapcode(mapcode);
    },
    getStartPositions: function () {
        var starts = [];
        var startSearch = /S/g;
        var code = this.get("mapcode");
        var hit;
        while (hit = startSearch.exec(code)) {
            var strPos = hit.index;
            starts.push(new Position(this.getRowColFromPos(strPos)));
        }
        return starts;
    },
    getCpList: function (mapcode) {
        mapcode = mapcode || this.get("mapcode");
        return (mapcode.match(/\d/g) || []).sort().filter(function (el, i, a) {
            if (i == a.indexOf(el))return 1;
            return 0;
        });
    },
    withinBounds: function (opt) {
        var x;
        var y;
        if ((opt.hasOwnProperty("row")) && opt.hasOwnProperty("col")) {
            x = opt.col;
            y = opt.row;
        } else if ((opt.hasOwnProperty("x")) && (opt.hasOwnProperty("y"))) {
            x = opt.x;
            y = opt.y;
        } else {
            console.error(opt);
            throw "param for withinBounds unclear";
        }
        if (x < 0) return false;
        if (y < 0) return false;
        if (x > this.get("cols") - 1) return false;
        if (y > this.get("rows") - 1) return false;
        return true;
    },
    setFieldAtRowCol: function (r, c, field) {
        var pos = this.getPosFromRowCol(r, c);
        var mapcode = this.get("mapcode");
        console.log("Mapcodecheck");
        //only if different
        if (mapcode[pos] !== field) {
            mapcode = mapcode.substr(0, pos) + field + mapcode.substr(pos + 1);
            this.set("mapcode", mapcode, {silent: true});
            //trigger field change instead
            this.trigger("change:field", {r: r, c: c, field: field});
            console.log("Change triggered");
        }
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
            console.error(r, c);
            throw  "Row " + r + ", Col " + c + " not within bounds";
        }
        var pos = this.getPosFromRowCol(r, c);
        //console.log("Ich sag",pos);
        return this.get("mapcode").charAt(pos);
    },
    getPosFromRowCol: function (r, c) {
        var pos = ( r * (this.get("cols") + 1)) + c;
        return pos;
    },
    getRowColFromPos: function (pos) {
        var cols = this.get("cols") + 1;
        var c = pos % cols;
        var r = Math.floor(pos / cols);
        return {row: r, col: c, x: c, y: r};
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
    },
    getPassedFields: function (mo) {
        if (!mo) console.error("No motion given");
        var positions = mo.getPassedPositions();
        //console.log(positions);
        var fields = [];
        for (var posKey in positions) {
            var pos = positions[posKey];
            var x = pos.get("x");
            var y = pos.get("y");
            if (this.withinBounds({x: x, y: y})) {
                fields.push(this.getFieldAtRowCol(y, x));
            } else {
                fields.push("_");
            }
        }
        return fields;
    },
    isPossible: function (mo) {
        var fields = this.getPassedFields(mo);
        //console.log(fields);
        if (fields.indexOf(undefined) >= 0) return false;
        if (fields.indexOf("X") >= 0) return false;
        if (fields.indexOf("Y") >= 0) return false;
        if (fields.indexOf("Z") >= 0) return false;
        if (fields.indexOf("V") >= 0) return false;
        if (fields.indexOf("W") >= 0) return false;
        if (fields.indexOf("P") >= 0) return false;
        if (fields.indexOf("_") >= 0) return false;
        //console.log(mo.toString(), "is possible");
        return true;
    },
    /**
     * @param motions
     * @returns {Array} Motions
     */
    verifiedMotions: function (motions) {
        var remaining = [];
        for (var p = 0; p < motions.length; p++) {
            var mo = motions[p];
            if (this.isPossible(mo)) {
                remaining.push(mo);
            }
        }
        return remaining;
    }
});
