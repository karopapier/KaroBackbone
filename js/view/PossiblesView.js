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
        var dranId = this.game.get("dranId");
        //console.log(e.currentTarget);
        var i = e.currentTarget.getAttribute("data-dirtyIndex");
        if (Karopapier.User.get("id") !== dranId) {
            //alert("Du bist ja gar nicht dran");
            //e.preventDefaults();
            //return false;
        }
        //console.log(i);
        //console.log(this.possibles);
        //console.log(this.possibles[i]);
        var p = this.possibles[i];
        this.trigger("game:player:move", dranId, p);
        //http://www.karopapier.de/move.php?GID=83790&xpos=76&ypos=28&xvec=-2&yvec=2
        //var url = "http://www.karopapier.de/move.php?GID=" + this.game.get("id") + "&xpos=" + p.get("position").get("x") + "&ypos=" + p.get("position").get("y") + "&xvec=" + p.get("vector").get("x") + "&yvec=" + p.get("vector").get("y");
        //alert(url);

    },
    hoverMove: function (e, a, b) {
        var i = e.currentTarget.getAttribute("data-dirtyIndex");
        var mo = this.possibles[i];
        if (mo.get("vector").getLength()>3) {
            //console.log(mo);
            var stop = mo.getStopPosition();
            var div = $('<div class="stopPosition" style="left: ' + stop.get("x") * 12 + 'px; top: ' + stop.get("y") * 12 + 'px;"></div>');
            this.$el.append(div);
        }
    },
    unhoverMove: function (e, a, b) {
        this.$('.stopPosition').remove();
    },
    checkWillCrash: function(div, k, mo, i) {
        //console.info("Crash check");
        //console.log(mo.toString());
        //TAKES=0;
        if (k.willCrash(mo, 6)) {
            //console.warn("Das kracht",mo);
            div.addClass("willCrash");
        }
        //console.warn("FINISHED",mo.toString(),TAKES);
    },
    render: function () {
        this.clearPossibles();
        if (!this.game.get("completed")) return true;
        if (this.game.get("finished")) return true;

        var k = new KRACHZ({
            map: this.game.map
        });

        var dranId = this.game.get("dranId");
        var currentPlayer = this.game.players.get(dranId);
        var lastmove = currentPlayer.get("lastmove");
        var mo = lastmove.getMotion();

        //reduce possibles with map
        this.possibles = k.verifiedPossibles(mo.getPossibles());

        //check occupied
        var occupiedPositions = this.game.players.getOccupiedPositions();
        var occupiedPositionStrings = occupiedPositions.map(function(e) {
            return e.toString();
        });
        //console.log(occupiedPositionStrings);

        for (var i = 0; i < this.possibles.length; i++) {
            var possible = this.possibles[i];
            if (occupiedPositionStrings.indexOf(possible.toKeyString())<0) {
                //console.log("Der is möglich", possible);
                var div = $('<div title="' + possible.get("vector").toString() + '" class="possibleMove" style="left: ' + possible.get("position").get("x") * 12 + 'px; top: ' + possible.get("position").get("y") * 12 + 'px;" data-dirtyIndex="' + i + '"></div>');
                var me=this;
                setTimeout(this.checkWillCrash.bind(this,div, k, possible, i),i);
                this.$el.append(div);
            } else {
                //console.warn("Geht net", possible, "is belegt");
            }
        }
        //check my turn add links
    }
});
