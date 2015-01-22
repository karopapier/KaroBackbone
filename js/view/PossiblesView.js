var PossiblesView = Backbone.View.extend({
    initialize: function(options) {
        _.bindAll(this,"clearPossibles", "render");
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
    render: function(a, b, c) {
        if (!this.game.get("completed")) return true;
        this.clearPossibles();
        console.log("Nu hier");
        if (this.game.get("finished")) return true;

        var dranId = this.game.get("dranId");
        var currentPlayer = this.game.players.get(dranId);
        var possibles = currentPlayer.get("possibles");
        console.log(possibles);
        console.log(possibles.length);
        if (possibles.lengt<1) {
            console.warn("NO POSSIBLE MOVES!!!");
        }
        var me=this;
        possibles.forEach(function(e,i) {
            console.log(e, i);
            var html='<div class="possibleMove" style="position: absolute; left: ' + e.x*12 + 'px; top: ' + e.y*12 + 'px; width:11px; height:11px; background-color: lightgray; cursor: pointer; z-index: 10"></div>';
            this.$el.append(html);
        },this)
        //check my turn add links
    }
});
