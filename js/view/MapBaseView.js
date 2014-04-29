/**
 * Created with JetBrains PhpStorm.
 * User: pdietrich
 * Date: 10.08.12
 * Time: 12:07
 * To change this template use File | Settings | File Templates.
 */

var MapBaseView = Backbone.View.extend({
    optionDefaults: {
        size: 12,
        border: 1
    },
    initialize: function (options) {
        _.bindAll(this,"updateFieldSize","getRowColFromXY","getRowFromY","getColFromX","getXYFromRowCol","getXFromCol","getYFromRow","getFieldAtXY","setFieldAtXY","setFieldAtRowCol");
        _.defaults(options,this.optionDefaults);
        this.options = options;
        this.settings = new Backbone.Model(options);
        this.settings.bind("change:size change:border",this.updateFieldSize)
        this.updateFieldSize();
    },
    updateFieldSize: function() {
        this.fieldSize = (this.settings.get("size") + this.settings.get("border"));
        console.log("New fieldsize",this.fieldSize);
    },
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

    getXYFromRowCol: function (r, c) {
        return {
            "x": this.getXFromCol(c),
            "y": this.getYFromRow(r)
        }
    },

    getXFromCol: function(c) {
        return (c +.5) * this.fieldSize;
    },

    getYFromRow: function(r) {
        return (r +.5) * this.fieldSize;
    },

    getFieldAtXY: function (x, y) {
        alert("Deprecated");
        var rc = this.getRowColFromXY(x, y);
        return this.model.getFieldAtRowCol(rc.r,rc.c);
    },

    setFieldAtXY: function (x, y, field) {
        var rc = this.getRowColFromXY(x, y);
        var old = this.getFieldAtRowCol(rc.r, rc.c);
        if (old != field) {
            this.setFieldAtRowCol(rc.r, rc.c, field);
        }
    },
    setFieldAtRowCol: function (r, c, field) {
        this.model.setFieldAtRowCol(r, c, field);
    }
});
