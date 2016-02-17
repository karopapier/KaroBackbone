var Marionette = require('backbone.marionette');
module.exports = Marionette.ItemView.extend({
    tagName: "g",
    /* this makes it generate namespaced SVG tags */
    _createElement: function(tagName) {
        return document.createElementNS("http://www.w3.org/2000/svg", tagName);
    },
    initialize: function(options) {
        options = options || {};
        if (!options.settings) {
            console.error("No settings for MapPlayerMoves");
            return false;
        }

        if (!options.util) {
            console.error("No utils for MapPlayerMoves");
            return false;
        }

        if (!options.model) {
            console.error("No model player for MapPlayerMoves");
            return false;
        }

        this.settings = options.settings;
        this.w = options.w;
        this.h = options.h;
        this.listenTo(this.settings, "change:size change:border ", this.render);
        this.listenTo(this.model, "change:drawLimit change:movesCount change:crashCount", this.render);
        this.listenTo(this.model, "change:visible", this.visibility);
        this.listenTo(this.model, "change:highlight", this.highlight);
        this.color = "#" + this.model.get("color");
    },

    render: function() {
        this.$el.empty();
        this.resize();
        this.addMoves();
        this.visibility();
    },

    addMoves: function() {
        var me = this;
        //if only one move, stop here
        if (this.collection.length <= 1) return false;

        var limit = this.model.get("drawLimit");
        //console.log("Limit:", limit);
        var color = this.color;
        var movesFragment = document.createDocumentFragment();

        var moves = this.collection.toArray();
        if (limit >= 0) {
            //reduce moves to limited amount
            moves = this.collection.last(limit + 1);
        }

        if (this.model.get("position") > 0) {
            //finished, don't draw last line
            moves.pop();
        }
        //console.log("Render with moves", moves.length);

        if (moves.length > 0) {

            //start path for all moves
            var pathCode = "M" + (parseInt(moves[0].get("x") * this.fieldsize) + this.halfsize) + "," + (parseInt(moves[0].get("y") * this.fieldsize) + this.halfsize);
            moves.forEach(function(m, i) {
                var x = parseInt(m.get("x"));
                var y = parseInt(m.get("y"));
                pathCode += "L" + (x * this.fieldsize + this.halfsize) + "," + (y * this.fieldsize + this.halfsize);
                var square = this._createElement("rect");
                var attrs = {
                    x: x * this.fieldsize + this.thirdsize,
                    y: y * this.fieldsize + this.thirdsize,
                    width: this.thirdsize,
                    height: this.thirdsize,
                    fill: color
                };
                for (var k in attrs) square.setAttribute(k, attrs[k]);
                movesFragment.appendChild(square);
            }.bind(this));
            //console.log(pathCode);
        }

        //console.log(pathCode);
        var p = this._createElement("path");
        var attrs = {
            d: pathCode,
            stroke: color,
            "stroke-width": 1,
            fill: "none"
        };
        for (var k in attrs) p.setAttribute(k, attrs[k]);
        ////movesFragment.appendChild(p);
        //console.log(movesFragment);
        this.el.appendChild(movesFragment);
        this.el.appendChild(p);
        //this.$el.append(movesFragment);
        //this.$el.append(p);
        //console.log("RENDERTE moves for", this.model.get("name"));
    },

    resize: function() {
        this.size = this.settings.get("size");
        this.halfsize = this.size / 2;
        this.thirdsize = this.size / 3;
        this.border = this.settings.get("border");
        this.fieldsize = this.size + this.border;
    },

    visibility: function() {
        if (this.model.get("visible") || (this.model.get("highlight"))) {
            this.$el.css("display", "inline");
        } else {
            this.$el.css("display", "none");
        }
    },

    highlight: function() {
        //console.log("Change highlight");
        if (this.model.get("highlight")) {
            this.model.set("drawLimit", -1);
        } else {
            this.model.set("drawLimit", this.model.get("initDrawLimit"));
        }
        //make sure to show the highlighted one
        this.visibility();
    }
});
