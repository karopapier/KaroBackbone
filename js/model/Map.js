var Map = Backbone.Model.extend({
    defaults: {
        id: 0,
        cps: [],
        rows: 0,
        cols: 0
    },
    initialize: function () {
        _.bindAll(this, "updateSize", "updateStarties", "updateCpList", "setFieldAtRowCol", "getFieldAtRowCol", "getPosFromRowCol");
        this.bind("change:mapcode", function (e, mapcode) {
            this.updateSize();
            var trimcode = mapcode;
            trimcode = trimcode.replace(/\r/g, ""); //make sure we don't have CR in there
            this.set("mapcode", trimcode, {silent: true});
            this.updateStarties();
            this.updateCpList();
        }, this);
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
        var pos = ( r * (this.get("cols")+1)) + c;
        return pos;
    }
});
