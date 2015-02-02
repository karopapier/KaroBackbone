var PossibleView = Backbone.View.extend({
    tagName: "div",
    className: "possibleMove",
    events: {
        "click": "checkMove",
        "mouseenter": "hoverMove",
        "mouseleave": "unhoverMove"
    },
    initialize: function (options) {
        _.bindAll(this, "checkMove", "hoverMove", "unhoverMove", "render");
        if (!options.hasOwnProperty("mapView")) {
            console.error("No mapView for PossiblesView");
        }
        this.mapView = options.mapView;
        //grabbing settings from the mapview to listen to size change
        this.settings = this.mapView.settings;
        this.listenTo(this.model, "change", this.render);
    },
    checkMove: function (e) {
        console.log("trigger", this.model);
        this.trigger("clicked", this.model);
    },
    hoverMove: function (e, a, b) {
        var mo = this.model;
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
    render: function () {
        var v = this.model.get("vector");
        var p = this.model.get("position");
        this.$el.css({
            left: p.get("x") * 12,
            top: p.get("y") * 12
        }).attr({
            title: this.model.toString(),
            "data-motionString": this.model.toString()
        });
        //if vector = (0|0], mark as start
        console.log(v.toString());
        if (v.toString()==="(0|0)") {
            this.$el.attr("title", "Start: " + this.model.toKeyString());
            this.$el.addClass("isStart");
        }
        return this;
    }
});
