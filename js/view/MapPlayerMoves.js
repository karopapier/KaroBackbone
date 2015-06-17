var MapPlayerMoves = Backbone.View.extend({
    tag: "svg",
    optionDefaults: {
        size: 11,
        border: 1,
        drawMoveLimit: 2
    },
    events: {
        "mouseenter .playerPosition": "showPlayerInfo",
        "mouseleave .playerPosition": "hidePlayerInfo"
    },
    initialize: function (options) {
        if (!this.collection) {
            console.error("Missing Collection");
            return false;
        }

        if (!options.settings) {
            console.error("No settings passed into MapPlayerMoves");
            this.settings = new Backbone.Model(options);
        } else {
            this.settings = options.settings;
        }
        _.bindAll(this, "render");
        _.defaults(options, this.optionDefaults);
        this.listenTo(this.settings, "change:size change:border change:drawMoveLimit", this.render);
        this.listenTo(this.collection, "add remove", this.render);
        this.listenTo(this.collection, "reset", this.render);
        this.listenTo(this.collection, "change", this.render);
        this.listenTo(this.model, "change:completed", this.render);
    },
    adjustSize: function () {
        //console.log(this.model.get("cols"));
        //console.log(this.fieldSize);
        var w = this.model.map.get("cols") * (this.settings.get("size") + this.settings.get("border"));
        var h = this.model.map.get("rows") * (this.settings.get("size") + this.settings.get("border") );
        this.$el.css({
            width: w,
            height: h
        });
        this.$el.attr({
            width: w,
            height: h
        });
    },
    showPlayerInfo: function(e) {
        var playerId = e.currentTarget.getAttribute("data-playerId");
        var p = this.collection.get(playerId);
        this.activePi = new PlayerInfo({
            model: p
        });
        this.activePi.render();
        this.$el.parent().append(this.activePi.el);
    },
    hidePlayerInfo: function(e) {
        this.activePi.remove();
    },
    render: function () {
        //NOTE: when this render fires after first reset, not all game properties might be set yet
        if (!this.model.get("completed")) return false;
        this.adjustSize();
        var gameId = this.model.get("id");
        if (gameId === 0) {
            this.$el.hide();
        } else {
            this.$el.show();
            var defaultLimit = this.settings.get("drawMoveLimit");
            if (this.model.get("finished")) {
                defaultLimit = 0;
            }
        }

        //clear this el
        while (this.el.childNodes.length > 0) {
            var f = this.el.firstChild;
            this.el.removeChild(f);
        }

        var movesFragment = document.createDocumentFragment();
        var posFragment = document.createDocumentFragment();
        this.collection.each(function (player, i) {
            //console.info(player);
            var limit = defaultLimit;
            if (Karopapier.User.get("id") === player.get("id")) {
                //alle eigenen
                limit = 0;
            }
            if (player.get("highlighted")) limit = 0;
            var moves = player.moves.toArray();

            //if no move, nothing to draw, stop
            if (moves.length<1) return false;

            var color = "#" + player.get("color");
            var m = player.getLastMove();
            var currentPosition = KaroUtil.createSvg("circle", {
                cx: m.get("x") * 12 + 5.5,
                cy: m.get("y") * 12 + 5.5,
                r: 4,
                //stroke: "black",
                fill: color,
                class:"playerPosition",
                "data-playerId": player.get("id")
            });
            posFragment.appendChild(currentPosition);

            //if only one move, stop here
            if (moves.length<=1) return false;

            if (limit > 0) {
                moves = player.moves.last(this.settings.get("drawMoveLimit") + 1);
            }

            //console.log(moves);
            //console.log(player.attributes);
            if (player.get("position") > 0) {
                //finish, don't draw last line
                moves.pop();
                //console.log(moves);
            }
            //console.info(moves);
            var pathCode = "M" + (parseInt(moves[0].get("x") * 12) + 6) + "," + (parseInt(moves[0].get("y") * 12) + 6);
            moves.forEach(function (m, i) {
                var x = parseInt(m.get("x"));
                var y = parseInt(m.get("y"));
                pathCode += "L" + (x * 12 + 6) + "," + (y * 12 + 6);
                var square = KaroUtil.createSvg("rect",{
                    x: x*12+4,
                    y:y*12+4,
                    width: 4,
                    height: 4,
                    fill: color
                });
                movesFragment.appendChild(square);
            }.bind(this));
            //console.log(pathCode);
            var p = KaroUtil.createSvg("path", {
                d: pathCode,
                stroke: color,
                "stroke-width": 1,
                fill: "none"
            });
            movesFragment.appendChild(p);



            //console.log("RENDERTE moves for", player.get("name"));
        }.bind(this));
        this.el.appendChild(movesFragment);
        this.el.appendChild(posFragment);
    }
});
