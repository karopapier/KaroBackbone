var MapPlayerMoves = Backbone.View.extend({
    tag: "svg",
    optionDefaults: {
        size: 11,
        border: 1
    },
    initialize: function (options) {
        if (!this.collection) {
            console.error("Missing Collection");
            return false;
        }
        _.bindAll(this, "render");
        _.defaults(options, this.optionDefaults);
        this.settings = new Backbone.Model(options);
        this.listenTo(this.settings, "change:size change:border", this.render);
        this.listenTo(this.collection, "change", this.render);
        this.listenTo(this.collection, "reset", this.render);
    },
    adjustSize: function () {
        //console.log(this.model.get("cols"));
        //console.log(this.fieldSize);
        var w = this.model.map.get("cols") * this.settings.get("size");
        var h = this.model.map.get("rows") * this.settings.get("size");
        this.$el.css({width: w, height: h});
        this.$el.attr({width: w, height: h});
    },
    render: function () {
        this.adjustSize();
        var gameId = this.model.get("id");
        if (gameId === 0) {
            this.$el.hide();
        } else {
            this.$el.show();
            //http://www.karopapier.de/imgenerateFG.php?GID=78483&pixel=11&karoborder=1&limit=2
            var limit = 2;
            if (this.model.get("finished")) {
                limit = 0;
            }
        }

        var me =this;
        this.collection.each(function (player, i) {
            var m = player.get("lastmove");

            console.log(m.attributes);
            var circle = Karopapier.Util.createSVG("circle", {
                cx: m.get("x") * 12+5,
                cy: m.get("y") * 12+5,
                r: 5,
                stroke: "black",
                fill: "red"
            });
            me.el.appendChild(circle);
        });
        console.log("RENDERTE");
    }
});
