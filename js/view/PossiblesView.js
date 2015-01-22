var PossiblesView = Backbone.View.extend({
    events: {
        "click .possibleMove": "checkMove",
        "mouseenter .possibleMove": "hoverMove",
        "mouseleave .possibleMove": "unhoverMove"
    },
    initialize: function(options) {
        _.bindAll(this,"clearPossibles", "checkMove", "render");
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

        this.listenTo(this.game,"change",this.render);
    },
    clearPossibles: function() {
        this.$('.possibleMove').remove();
    },
    checkMove: function(e) {
        var i = e.currentTarget.getAttribute("data-dirtyIndex");
        if (Karopapier.User.get("id") !== this.game.get("dranId")) {
            alert("Du bist ja gar nicht dran");
            e.preventDefaults();
            return false;
        }
        //console.log(i);
        //console.log(this.possibles);
        //console.log(this.possibles[i]);
        var p = this.possibles[i];
        //http://www.karopapier.de/move.php?GID=83790&xpos=76&ypos=28&xvec=-2&yvec=2
        var url = "http://www.karopapier.de/move.php?GID=" + this.game.get("id") + "&xpos=" + p.x + "&ypos=" + p.y + "&xvec=" + p.xv + "&yvec=" + p.yv;
        alert(url);
    },
    hoverMove: function(e, a, b) {
        //console.log(e);
    },
    unhoverMove: function(e, a, b) {
        //console.log(e);
    },
    render: function(a, b, c) {
        if (!this.game.get("completed")) return true;
        this.clearPossibles();
        console.log("Nu hier");
        if (this.game.get("finished")) return true;

        var dranId = this.game.get("dranId");
        var currentPlayer = this.game.players.get(dranId);
        var possibles = this.possibles = currentPlayer.get("possibles");
        console.log(possibles);
        console.log(possibles.length);
        if (possibles.lengt<1) {
            console.warn("NO POSSIBLE MOVES!!!");
        }
        var me=this;
        possibles.forEach(function(e,i) {
            //var p = new PossibleView({});
            console.log(e, i);
            var html='<div class="possibleMove" style="position: absolute; left: ' + e.x*12 + 'px; top: ' + e.y*12 + 'px; width:11px; height:11px; background-color: lightgray; cursor: pointer; z-index: 10" data-dirtyIndex="' + i + '"></div>';
            this.$el.append(html);
        },this);
        //check my turn add links
    }
});
