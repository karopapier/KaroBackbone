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
        return {
            settings: this.settings
        };
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

        _.bindAll(this, "check", "render");
        this.listenTo(this.settings, "change:size change:border", this.resize);
        this.listenTo(Karopapier.User, "change:id", this.check);
        //this.listenTo(this.collection, "change:visible", this.check);
        this.listenTo(this.model, "change:completed", this.check);
        this.listenTo(this.settings, "change:drawLimit", this.drawLimit);
    },
    check: function () {
        if (!this.model.get("completed")) return false;
        this.resize();

        //initialise visibility & drawLimits
        this.collection.each(function (m) {
            //defaults
            var drawLimit = 5;
            var visible = true;

            //console.warn("Determine limit for player; Me? Finished? Modified?");
            if (m.get("id") == Karopapier.User.get("id")) {
                drawLimit = -1;
            }
            if (m.get("position") > 0) {
                drawLimit = -1;
                visible = false;
            }

            m.set({
                drawLimit: drawLimit,
                initDrawLimit: drawLimit,
                visible: visible
            });
        });
        this.render();
    },

    drawLimit: function () {
        var newLimit = this.settings.get("drawLimit");
        this.collection.each(function (m) {
            m.set("drawLimit", newLimit);
        });
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
