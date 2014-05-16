var Map = Backbone.Model.extend({
    defaults: {
        id: 0,
        cps: [],
        rows: 0,
        cols: 0
    },
    initialize: function () {
        _.bindAll(this, "updateMapcode", "updateSize", "updateStarties", "updateCpList", "setFieldAtRowCol", "getFieldAtRowCol", "getPosFromRowCol");
        this.bind("change:mapcode", this.updateMapcode);
    },
    updateMapcode: function (e, mapcode) {
        this.updateSize();

        //make sure we don't have CR in there and make it all UPPERCASE
        var trimcode = mapcode.toUpperCase();
        trimcode = trimcode.replace(/\r/g, "");

        this.set("mapcode", trimcode, {silent: true});
        this.updateStarties();
        this.updateCpList();
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
    setFieldAtRowCol: function (r, c, field) {
        var pos = this.getPosFromRowCol(r, c);
        var mapcode = this.get("mapcode");
        var l = mapcode.length;
        mapcode = mapcode.substr(0, pos) + field + mapcode.substr(pos + 1);
        this.set("mapcode", mapcode);
    },
    getFieldAtRowCol: function (r, c) {
        if (r < 0) return undefined;
        if (c < 0) return undefined;
        if (r >= this.get("rows")) return undefined;
        if (c >= this.get("cols")) return undefined;
        var pos = this.getPosFromRowCol(r, c);
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
