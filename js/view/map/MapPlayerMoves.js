var MapPlayerMoves = Backbone.View.extend({
    optionDefaults: {
        visible: true
    },
    initialize: function (options) {
        _.bindAll(this, "resize");
        console.info("MapPlayerMoves being called for", this.model.get("name"));
        //console.log(this.model);
        this.settings = options.settings;
        this.w = options.w;
        this.h = options.h;
        this.listenTo(this.settings, "change:size change:border change:drawMoveLimit", this.render);
        this.color = "#" + this.model.get("color");
    },

    /*
     events: {
     "mouseenter .playerPosition": "showPlayerInfo",
     "mouseleave .playerPosition": "hidePlayerInfo"
     },
     */

    render: function () {
        this.createGroup();
        this.resize();
        this.addMoves();
        this.addPosition();
    },

    createGroup: function () {
        //replace my container div with a svg group
        var g = KaroUtil.createSvg("g");
        this.setElement(g);
    },

    addPosition: function () {
        //if no move, nothing to draw, stop
        if (this.model.moves.length < 1) return false;

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
        //NOTE: when this render fires after first reset, not all game properties might be set yet
        var limit = this.settings.get("drawLimit");
        var color = this.color;

        var movesFragment = document.createDocumentFragment();
        //if only one move, stop here
        if (this.model.moves.length <= 1) return false;

        var moves = this.model.moves.toArray();
        if (limit > 0) {
            //reduce moves to limited amount
            moves = this.model.moves.last(limit + 1);
        }

        //console.log(moves);
        //console.log(player.attributes);
        if (this.model.get("position") > 0) {
            //finish, don't draw last line
            moves.pop();
            //console.log(moves);
        }
        //console.info(moves);
        var pathCode = "M" + (parseInt(moves[0].get("x") * this.fieldsize) + this.halfsize) + "," + (parseInt(moves[0].get("y") * this.fieldsize) + this.halfsize);
        moves.forEach(function (m, i) {
            var x = parseInt(m.get("x"));
            var y = parseInt(m.get("y"));
            pathCode += "L" + (x * this.fieldsize + 6) + "," + (y * this.fieldsize + 6);
            var square = KaroUtil.createSvg("rect", {
                x: x * this.fieldsize + 4,
                y: y * this.fieldsize + 4,
                width: 4,
                height: 4,
                fill: color
            });
            movesFragment.appendChild(square);
        }.bind(this));

        console.log(pathCode);
        var p = KaroUtil.createSvg("path", {
            d: pathCode,
            stroke: color,
            "stroke-width": 1,
            fill: "none"
        });
        console.log(p);
        //movesFragment.appendChild(p);
        //console.log(movesFragment);
        this.$el.append(p);
        console.log("RENDERTE moves for", this.model.get("name"));
    },

    resize: function () {
        this.size = this.settings.get("size");
        this.halfsize = this.size / 2;
        this.border = this.settings.get("border");
        this.fieldsize = this.size + this.border;
        console.log(this.$el, this.w, this.h);
        this.$el.css({
            width: this.w,
            height: this.h
        });
        this.$el.attr({
            width: this.w,
            height: this.h
        });
    },

    old_showPlayerInfo: function (e) {
        var playerId = e.currentTarget.getAttribute("data-playerId");
        var p = this.collection.get(playerId);
        this.activePi = new PlayerInfo({
            model: p
        });
        this.activePi.render();
        this.$el.parent().append(this.activePi.el);
    },
    old_hidePlayerInfo: function (e) {
        this.activePi.remove();
    },
    old_render: function () {
        this.el.appendChild(movesFragment);
        this.el.appendChild(posFragment);
    }
});
