/**
 * A coordinate with row and column
 * @typedef rcCoordinate
 * @type {Object}
 * @property {number} r row 0..rowCount-1
 * @property {number} c col 0..colCount-1
 */

/**
 * A coordinate with x and y
 * @typedef xyCoordinate
 * @type {Object}
 * @property {number} x x coordinate
 * @property {number} y y coordinate
 */

var Marionette = require('backbone.marionette');
module.exports = Marionette.View.extend(/** @lends MapBaseView.prototype */
    {
        optionDefaults: {
            size: 12,
            border: 1,
            cpsActive: true,
            cpsVisited: []
        },
        /**
         * Represents a MapView's base class, to be extended
         * @class MapBaseView
         * @constructor MapBaseView
         * @author Peter Dietrich
         * @augments Backbone.View
         */
        initialize: function (options) {
            options = options || {};
            _.bindAll(this, "updateFieldSize", "getRowColFromXY", "getRowFromY", "getColFromX", "getXYFromRowCol", "getXFromCol", "getYFromRow", "getFieldAtXY", "setFieldAtXY", "setFieldAtRowCol");
            _.defaults(options, this.optionDefaults);
            if (options.settings) {
                //apply and enrich the settings if some are missing
                var attr = options.settings.attributes;
                _.defaults(attr, this.optionDefaults);
                this.settings = options.settings;
                this.settings.set(attr);
            } else {
                this.settings = new Backbone.Model(options);
            }

            //console.log("BASE", this.settings.attributes);
            if (!options.model) {
                console.error("No Map model for MapView");
                return false;
            }
            this.listenTo(this.settings, "change:size change:border", this.updateFieldSize);
            this.updateFieldSize();
        },
        updateFieldSize: function () {
            this.fieldSize = (this.settings.get("size") + this.settings.get("border"));
            //console.log("New fieldsize",this.fieldSize);
        },

        /**
         * returns the corresponding row and col coordinates from a given x|y, taking current map size into account
         * @param {Number} x x coordinate
         * @param {Number} y y coordinate
         * @returns {rcCoordinate}
         *
         * */
        getRowColFromXY: function (x, y) {
            return {
                "r": this.getRowFromY(y),
                "c": this.getColFromX(x)
            };
        },
        getRowFromY: function (y) {
            //console.log("Math.floor(",y,"/",this.fieldSize,") = ", Math.floor(y / this.fieldSize));
            return Math.floor(y / this.fieldSize);
        },
        getColFromX: function (x) {
            //console.log("Math.floor(",x,"/",this.fieldSize,") = ", Math.floor(x / this.fieldSize));
            return Math.floor(x / this.fieldSize);
        },

        /**
         * returns x|y coordinated for a give row|col coordinate taking current size into account
         * @param {Number} r 0..rowCount-1
         * @param {Number} c 0..colCOunt-1
         * @returns {xyCoordinate}
         */
        getXYFromRowCol: function (r, c) {
            return {
                "x": this.getXFromCol(c),
                "y": this.getYFromRow(r)
            };
        },

        getXFromCol: function (c) {
            return (c + 0.5) * this.fieldSize;
        },

        getYFromRow: function (r) {
            return (r + 0.5) * this.fieldSize;
        },

        getFieldAtXY: function (x, y) {
            alert("Deprecated");
            var rc = this.getRowColFromXY(x, y);
            return this.model.getFieldAtRowCol(rc.r, rc.c);
        },

        floodfill: function(x,y,field) {
            var rc = this.getRowColFromXY(x, y);
            var old = this.model.getFieldAtRowCol(rc.r, rc.c);
            this.model.floodfill(rc.r, rc.c, field);
        },

        setFieldAtXY: function (x, y, field) {
            var rc = this.getRowColFromXY(x, y);
            var old = this.model.getFieldAtRowCol(rc.r, rc.c);
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
    }
);
