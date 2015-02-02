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
        var moString = e.currentTarget.getAttribute("data-motionString");
        if (Karopapier.User.get("id") !== dranId) {
            //alert("Du bist ja gar nicht dran");
            //e.preventDefaults();
            //return false;
        }
        //console.log(i);
        //console.log(this.possibles);
        //console.log(this.possibles[i]);
        var p = this.game.possibles.getByMotionString(moString);
        this.trigger("game:player:move", dranId, p);
        //http://www.karopapier.de/move.php?GID=83790&xpos=76&ypos=28&xvec=-2&yvec=2
        //var url = "http://www.karopapier.de/move.php?GID=" + this.game.get("id") + "&xpos=" + p.get("position").get("x") + "&ypos=" + p.get("position").get("y") + "&xvec=" + p.get("vector").get("x") + "&yvec=" + p.get("vector").get("y");
        //alert(url);

    },
    hoverMove: function (e, a, b) {
        var moString = e.currentTarget.getAttribute("data-motionString");
        console.info(moString);
        var mo = this.game.possibles.getByMotionString(moString);
        console.info(this.game.possibles);
        console.info(mo);
        if (mo.get("vector").getLength() > 3) {
            //console.log(mo);
            var stop = mo.getStopPosition();
            var div = $('<div class="stopPosition" style="left: ' + stop.get("x") * 12 + 'px; top: ' + stop.get("y") * 12 + 'px;"></div>');
            this.$el.append(div);
        }
    },
    unhoverMove: function (e, a, b) {
        this.$('.stopPosition').remove();
    },
    checkWillCrash: function (div, k, mo, i) {
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
        var possibles = this.game.possibles;
        //console.log(possibles);
        //var k = new KRACHZ({
        //map: this.map
        //});
        this.game.possibles.each(function (possible) {
            console.log("POSS", possible);
            console.log(possible.toString());
            var v = possible.get("vector");
            var div = $('<div title="' + possible.get("vector").toString() + '" class="possibleMove" style="left: ' + possible.get("position").get("x") * 12 + 'px; top: ' + possible.get("position").get("y") * 12 + 'px;" data-motionString="' + possible.toString() + '"></div>');
            var me = this;
            //setTimeout(this.checkWillCrash.bind(this,div, k, possible, i),i);
            this.$el.append(div);
        }.bind(this));
    }
});
