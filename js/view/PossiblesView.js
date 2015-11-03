var PossiblesView = Backbone.View.extend({
    events: {
        "clicked": "clickMove"
    },
    initialize: function (options) {
        //console.warn("I AM THE POSSIBLES VIEW");
        _.bindAll(this, "clearPossibles", "checkWillCrash", "render" );
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
        this.listenTo(this.game.possibles, "reset", this.render);
        this.listenTo(this, "changeHighlight", this.checkHighlight);
        this.highlight = false;
    },
    clearPossibles: function () {
        //console.info("Clear possibles");
        _.each(this.views, function(v) {
            //console.log("Ich entferne nen alten possible");
            v.cleanup().remove();
        });
        this.views=[];
        //this.$('.possibleMove').remove();
    },
    clickMove: function(mo) {
        //forward the event
        this.trigger("game:player:move", this.game.get("dranId"), mo);
    },
    checkWillCrash: function(k, possible) {
        possible.set("willCrash", k.willCrash(possible, 16));
    },
    checkHighlight: function(e, a, b) {
        //console.log("Triggered");
        if (this.highlight) {
            this.highlight.model.set("highlight", false);
        }
        e.model.set("highlight",true);
        this.highlight = e;
    },
    render: function () {
        //console.info("Rendering possibles for",this.game.get("id"));
        this.clearPossibles();
        var possibles = this.game.possibles;
        //console.log(possibles);

        var k = new KRACHZ({
            map: this.game.map
        });

        this.game.possibles.each(function (possible) {
            var posView = new PossibleView({
                mapView: this.mapView,
                model: possible,
                parent: this
            }).render();
            setTimeout(this.checkWillCrash.bind(this, k, possible),0);
            //console.log(posView.el);
            //console.log(this.$el);
            this.$el.append(posView.el);
            this.views.push(posView);
            this.listenTo(posView, "clicked", this.clickMove.bind(this));
        }.bind(this));
    }
});
