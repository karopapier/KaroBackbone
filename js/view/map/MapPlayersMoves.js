var MapPlayersMoves = Marionette.CollectionView.extend({
    tag: "div",
    className: "Dings",
    optionDefaults: {
        size: 11,
        border: 1,
        drawMoveLimit: 2,
        visible: true
    },
    childView: MapPlayerMoves,
    childViewOptions: function () {
        console.warn("Determine limit for player; Me? Finished? Modified?");
        var drawLimit = 5;

        //own viewsettings for each player
        var settings = new Backbone.Model(this.settings.attributes);
        settings.set({
            drawLimit: drawLimit,
            visible: true
        });
        return {
            settings: settings,
            w: 360,
            h: 348
        }
    },
    initialize: function (options) {
        console.log("I AM THERE!");
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

        _.bindAll(this, "check", "render");
        this.listenTo(this.settings, "change:size change:border", this.resize);
        this.listenTo(this.collection, "change", this.check);
        this.listenTo(this.model, "change:completed", this.check);
        console.log("Ha nu");
    },
    check: function () {
        if (!this.model.get("completed")) return false;
        this.render();
    },
    resize: function () {
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
    }
});
