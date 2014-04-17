/**
 * Created with JetBrains PhpStorm.
 * User: pdietrich
 * Date: 10.08.12
 * Time: 12:07
 * To change this template use File | Settings | File Templates.
 */

var MapView = Backbone.View.extend({
    options: {
        size: 12,
        border: 1
    },
    initialize: function (options) {
        this.options = _.defaults(options||{},this.options);
        this.size = this.options.size;
        this.border = this.options.border;
        console.log(this.options);
    },
    getRowColfromXY: function (x, y) {
        return {
            "r": this.getRowFromY(y),
            "c": this.getColFromX(x)
        }
    },
    getRowFromY: function (y) {
        return Math.floor(y / (this.size + this.border));
    },
    getColFromX: function (x) {
        return Math.floor(x / (this.size + this.border));
    },

    getXYfromRowCol: function (r, c) {
        return {
            "x": this.getXfromCol(c),
            "y": this.getYfromRow(r)
        }
    },

    getXfromCol: function(c) {
        return (c +.5) * (this.size+ this.border);
    },

    getYfromRow: function(r) {
        return (r +.5) * (this.size+ this.border);
    },

    getFieldAtXY: function (x, y) {
        alert("Deprecated");
        var rc = this.getRowColfromXY(x, y);
        return this.model.getFieldAtRowCol(rc.r,rc.c);
    },

    setFieldAtXY: function (x, y, field) {
        var rc = this.getRowColfromXY(x, y);
        var old = this.getFieldAtRowCol(rc.r, rc.c);
        if (old != field) {
            this.setFieldAtRowCol(rc.r, rc.c, field);
        }
    },
    setFieldAtRowCol: function (r, c, field) {
        this.model.setFieldAtRowCol(r, c, field);
    }
});
