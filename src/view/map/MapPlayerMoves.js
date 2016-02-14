var MapPlayerMoves = Backbone.View.extend({
    optionDefaults: {
        visible: true
    },
    initialize: function (options) {
        _.bindAll(this, "resize", "hidePlayerInfo", "showPlayerInfo");
        //console.info("MapPlayerMoves being called for", this.model.get("name"));
        //console.log(options);
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
        this.listenTo(this.model, "change:drawLimit", this.render);
        this.listenTo(this.model, "change:visible", this.visibility);
        this.listenTo(this.model, "change:highlight", this.highlight);
        this.color = "#" + this.model.get("color");
    },

    events: {
        "mouseenter .playerPosition": "showPlayerInfo",
        "mouseleave .playerPosition": "hidePlayerInfo"
    },

    render: function () {
        if (!this.g) {
            this.createGroup();
        } else {
            this.$el.empty();
        }
        this.resize();
        this.addMoves();
        this.addPosition();
        this.visibility();
    },

    createGroup: function () {
        //replace my container div with a svg group
        this.g = KaroUtil.createSvg("g", {
            class: "playerMoves"
        });
        this.setElement(this.g);
    },

    addPosition: function () {
        //if no move, nothing to draw, stop
        if (this.collection.length < 1) return false;

        var m = this.model.getLastMove();
        var currentPosition = KaroUtil.createSvg("circle", {
            cx: m.get("x") * this.fieldsize + this.size / 2,
            cy: m.get("y") * this.fieldsize + this.size / 2,
            r: 4,
            //stroke: "black",
            fill: this.color,
            class: "playerPosition",
            "data-playerId": this.model.get("id")
        });
        this.$el.append(currentPosition);
    },

    addMoves: function () {
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
            moves.forEach(function (m, i) {
                var x = parseInt(m.get("x"));
                var y = parseInt(m.get("y"));
                pathCode += "L" + (x * this.fieldsize + this.halfsize) + "," + (y * this.fieldsize + this.halfsize);
                var square = KaroUtil.createSvg("rect", {
                    x: x * this.fieldsize + this.thirdsize,
                    y: y * this.fieldsize + this.thirdsize,
                    width: this.thirdsize,
                    height: this.thirdsize,
                    fill: color
                });
                movesFragment.appendChild(square);
            }.bind(this));
        }

        //console.log(pathCode);
        var p = KaroUtil.createSvg("path", {
            d: pathCode,
            stroke: color,
            "stroke-width": 1,
            fill: "none"
        });
        //movesFragment.appendChild(p);
        //console.log(movesFragment);
        this.$el.append(movesFragment);
        this.$el.append(p);
        //console.log("RENDERTE moves for", this.model.get("name"));
    },

    resize: function () {
        this.size = this.settings.get("size");
        this.halfsize = this.size / 2;
        this.thirdsize = this.size / 3;
        this.border = this.settings.get("border");
        this.fieldsize = this.size + this.border;
    },

    visibility: function () {
        //console.log(this.model.attributes);
        if (this.model.get("visible")) {
            this.$el.css("display", "inline");
        } else {
            this.$el.css("display", "none");
        }
    },

    highlight: function () {
        if (this.model.get("highlight")) {
            this.model.set("drawLimit", -1);
        } else {
            this.model.set("drawLimit", this.model.get("initDrawLimit"));
        }
    },

    showPlayerInfo: function (e) {
        this.model.set("highlight", true);
        return true;
        var playerId = e.currentTarget.getAttribute("data-playerId");
        var p = this.collection.get(playerId);
        this.activePi = new PlayerInfo({
            model: p
        });
        this.activePi.render();
        this.$el.parent().append(this.activePi.el);
    },
    hidePlayerInfo: function (e) {
        this.model.set("highlight", false);
        //this.activePi.remove();
    }
});
