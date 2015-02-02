var PossiblesView = Backbone.View.extend({
    events: {
        "clicked": "clickMove"
    },
    initialize: function (options) {
        console.warn("I AM THE POSSIBLES VIEW");
        _.bindAll(this, "clearPossibles", "render");
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
        _.each(this.views, function(v) {
            v.remove();
        })
        this.views=[];
        //this.$('.possibleMove').remove();
    },
    clickMove: function(mo) {
        console.log("HA WAAAAS");
        this.trigger("game:player:move", 999, mo);
    },
    render: function () {
        this.clearPossibles();
        var possibles = this.game.possibles;
        //console.log(possibles);
        //var k = new KRACHZ({
        //map: this.map
        //});
        this.game.possibles.each(function (possible) {
            var posView = new PossibleView({
                mapView: this.mapView,
                model: possible
            }).render();
            //setTimeout(this.checkWillCrash.bind(this,div, k, possible, i),i);
            console.log(posView.el);
            //console.log(this.$el);
            this.$el.append(posView.el);
            this.views.push(posView);
        }.bind(this));
    }
});
