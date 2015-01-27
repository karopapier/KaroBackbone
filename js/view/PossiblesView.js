var PossiblesView = Backbone.View.extend({
    events: {
        "click .possibleMove": "checkMove",
        "mouseenter .possibleMove": "hoverMove",
        "mouseleave .possibleMove": "unhoverMove"
    },
    initialize: function (options) {
        _.bindAll(this, "clearPossibles", "checkMove", "render");
        if (!options.hasOwnProperty("game")) {
            console.error("No game for PossiblesView");
        }
        if (!options.hasOwnProperty("mapView")) {
            console.error("No mapView for PossiblesView");
        }
        this.game = options.game;
        this.mapView = options.mapView;
        //grabbing settings from the mapview to listen to size change
        this.settings = this.mapView.settings;

        this.listenTo(this.game, "change", this.render);
    },
    clearPossibles: function () {
        this.$('.possibleMove').remove();
    },
    checkMove: function (e) {
        console.log(e.currentTarget);
        var i = e.currentTarget.getAttribute("data-dirtyIndex");
        if (Karopapier.User.get("id") !== this.game.get("dranId")) {
            alert("Du bist ja gar nicht dran");
            e.preventDefaults();
            return false;
        }
        console.log(i);
        console.log(this.possibles);
        console.log(this.possibles[i]);
        var p = this.possibles[i];
        //http://www.karopapier.de/move.php?GID=83790&xpos=76&ypos=28&xvec=-2&yvec=2
        var url = "http://www.karopapier.de/move.php?GID=" + this.game.get("id") + "&xpos=" + p.get("position").get("x") + "&ypos=" + p.get("position").get("y") + "&xvec=" + p.get("vector").get("x") + "&yvec=" + p.get("vector").get("y");
        alert(url);

    },
    hoverMove: function (e, a, b) {
        //console.log(e);
    },
    unhoverMove: function (e, a, b) {
        //console.log(e);
    },
    render: function (a, b, c) {
        if (!this.game.get("completed")) return true;
        this.clearPossibles();
        if (this.game.get("finished")) return true;

        var k = new KRACHZ({
            map: this.game.map
        });

        var dranId = this.game.get("dranId");
        var currentPlayer = this.game.players.get(dranId);
        //var possibles = this.possibles = currentPlayer.get("possibles");
        var lastmove = currentPlayer.get("lastmove");
        var mo = lastmove.getMotion();
        this.possibles = mo.getPossibles();
        //console.log(possibles);
        var classes = "possibleMove";

        for (var i = 0; i < 9; i++) {
            var possible = this.possibles[i];
            if (k.isPossible(possible)) {
                //console.log("Der is möglich", possible);
                if (k.willCrash(possible, 5)) {
                    classes += " willCrash";
                    //console.info("ABer crasht");
                }
                var html = '<div class="' + classes + '" style="left: ' + possible.get("position").get("x") * 12 + 'px; top: ' + possible.get("position").get("y") * 12 + 'px;" data-dirtyIndex="' + i + '"></div>';
                this.$el.append(html);
            } else {
                //console.warn("Geht net", possible)
            }
        }
        //check my turn add links
    }
});
