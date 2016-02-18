//var Marionette = require('backbone.marionette');
var Backbone = require('backbone');
module.exports = Backbone.View.extend(/** @lends GridView.prototype */{
    /* this makes it generate namespaced SVG tags */
    _createElement: function(tagName) {
        return document.createElementNS("http://www.w3.org/2000/svg", tagName);
    },
    tagName: "svg",
    optionDefaults: {
        size: 11,
        border: 1,
        drawMoveLimit: 2,
        visible: true
    },
    /**
     * @class GridView
     * @constructur GridView
     * @param options
     * @returns {boolean}
     */
    initialize: function(options) {
        options = options || {};

        if (!options.players) {
            console.error("Missing Player Collection in GridView");
            return false;
        }
        this.players = options.players;

        if (!options.settings) {
            console.error("Missing settings in GridView");
            return false;
        }
        this.settings = options.settings;

        if (!options.user) {
            console.error("No user passed into GridView");
            return false;
        }
        this.user = options.user;

        if (!options.map) {
            console.error("No map passed into GridView");
            return false;
        }
        this.map = options.map;

        this.listenTo(this.map, "change:rows change:cols", this.resize);
        this.listenTo(this.settings, "change:size change:border", this.resize);
        this.listenTo(this.user, "change:id", this.check);
        this.listenTo(this.settings, "change:drawLimit", this.drawLimit);
        this.listenTo(this.players, "change add remove reset", this.drawPositions);
        this.resize();
    },
    events: {
        "contextmenu": "contextmenu",
        "click": "leftclick"
    },

    contextmenu: function(e) {
        this.trigger("contextmenu", e);
        e.preventDefault();
    },

    leftclick: function(e) {
        this.trigger("default");
    },

    drawPositions: function() {
        //console.log("DRAW POSITIONS");
        this.fieldsize = this.settings.get("size") + this.settings.get("border");
        this.players.each(function(p) {
            var x = p.get("lastmove").x;
            var y = p.get("lastmove").y;
            var color = "#" + p.get("color");
            var pos = this._createElement("circle");
            var attrs = {
                cx: x * this.fieldsize + this.fieldsize / 2,
                cy: y * this.fieldsize + this.fieldsize / 2,
                r: this.fieldsize * .3,
                fill: color
            };
            for (var k in attrs) pos.setAttribute(k, attrs[k]);
            this.$el.append(pos);
        }.bind(this));
    },

    resize: function() {
        this.fieldSize = (this.settings.get("size") + this.settings.get("border"));
        var w = this.map.get("cols") * this.fieldSize;
        var h = this.map.get("rows") * this.fieldSize;
        this.$el.css({width: w, height: h}).attr({width: w, height: h});
    }
});
