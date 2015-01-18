var MapBaseView = Backbone.View.extend(/** @lends MapBaseView.prototype */{
    optionDefaults: {
        size: 12,
        border: 1,
        cpsActive: true
    },
    /**
     * Represents a MapView's base class, to be extended
     * @class MapBaseView
     * @constructor MapBaseView
     * @author Peter Dietrich
     * @augments Backbone.View
     */
    initialize: function (options) {
        _.bindAll(this, "updateFieldSize", "getRowColFromXY", "getRowFromY", "getColFromX", "getXYFromRowCol", "getXFromCol", "getYFromRow", "getFieldAtXY", "setFieldAtXY", "setFieldAtRowCol");
        _.defaults(options, this.optionDefaults);
        this.options = options;
        this.mapViewSettings = new Backbone.Model(options);
        this.mapViewSettings.bind("change:size change:border", this.updateFieldSize)
        this.updateFieldSize();
    },
    updateFieldSize: function () {
        this.fieldSize = (this.mapViewSettings.get("size") + this.mapViewSettings.get("border"));
        //console.log("New fieldsize",this.fieldSize);
    },

    /**
     * returns the corresponding row and col coordinates from a given x|y, taking current map size into account
     * @param {Number} x
     * @param {Number} y
     * @returns  {r|c Coord Object}
     * */
    getRowColFromXY: function (x, y) {
        return {
            "r": this.getRowFromY(y),
            "c": this.getColFromX(x)
        }
    },
    getRowFromY: function (y) {
        return Math.floor(y / this.fieldSize);
    },
    getColFromX: function (x) {
        return Math.floor(x / this.fieldSize);
    },

    /**
     * returns x|y coordinated for a give row|col coordinate taking current size into account
     * @param {Number} r 0..rowCount-1
     * @param {Number} c 0..colCOunt-1
     * @returns {X|Y Coord Object}
     */
    getXYFromRowCol: function (r, c) {
        return {
            "x": this.getXFromCol(c),
            "y": this.getYFromRow(r)
        }
    },

    getXFromCol: function (c) {
        return (c + .5) * this.fieldSize;
    },

    getYFromRow: function (r) {
        return (r + .5) * this.fieldSize;
    },

    getFieldAtXY: function (x, y) {
        alert("Deprecated");
        var rc = this.getRowColFromXY(x, y);
        return this.model.getFieldAtRowCol(rc.r, rc.c);
    },

    setFieldAtXY: function (x, y, field) {
        var rc = this.getRowColFromXY(x, y);
        var old = this.getFieldAtRowCol(rc.r, rc.c);
        if (old != field) {
            this.setFieldAtRowCol(rc.r, rc.c, field);
        }
    },

    /**
     * sets the field's map code at row and col coordinates
     * @param {Number} r 0..rowCount-1
     * @param {Number} c 0..colCOunt-1
     * @param {Character} field
     * */
    setFieldAtRowCol: function (r, c, field) {
        this.model.setFieldAtRowCol(r, c, field);
    }
});
