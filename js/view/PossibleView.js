var PossibleView = Backbone.View.extend({
    tagName: "div",
    className: "possibleMove",
    events: {
        "touchstart": "wasTouch",
        "click": "checkMove",
        "mouseenter": "hoverMove",
        "mouseleave": "unhoverMove",
        "click .confirmer": "confirmMove"
    },
    NOWAY: function() {
        alert("YES");
    },
    initialize: function (options) {
        this.mouseOrTouch = "mouse";
        _.bindAll(this, "checkMove", "hoverMove", "unhoverMove", "render", "cleanup");
        if (!options.hasOwnProperty("mapView")) {
            console.error("No mapView for PossiblesView");
        }
        this.mapView = options.mapView;
        this.parent = options.parent;
        //grabbing settings from the mapview to listen to size change
        this.settings = this.mapView.settings;
        this.listenTo(this.model, "change", this.render);

        this.$confirmer = $('<div class="confirmer" style="position: fixed; bottom: 20px; right:20px; width: 50px; height: 50px; background-color: red">' + this.model.get("vector").toString() + '</div>');
        this.$el.append(this.$confirmer.hide());

    },
    wasTouch: function() {
        this.mouseOrTouch="touch";
    },
    confirmMove: function (e) {
        this.trigger("clicked", this.model);
        this.mouseOrTouch="mouse";
        e.stopPropagation();
    },
    checkMove: function (e) {
        console.log("Click by ", this.mouseOrTouch);
        if (this.mouseOrTouch=="touch") {
            this.model.set("highlight", true);
            this.parent.trigger("changeHighlight", this);
        } else {
            //console.log("trigger", this.model);
            this.trigger("clicked", this.model);
        }
        this.mouseOrTouch="mouse";
    },
    hoverMove: function (e, a, b) {
        var mo = this.model;
        if (mo.get("vector").getLength() > 2.8) {
            //console.log(mo);
            var stop = mo.getStopPosition();
            this.stopDiv = $('<div class="stopPosition" style="left: ' + stop.get("x") * 12 + 'px; top: ' + stop.get("y") * 12 + 'px;"></div>');
            this.$el.parent().append(this.stopDiv);
        }
    },
    unhoverMove: function () {
        if (this.stopDiv) this.stopDiv.remove();
    },
    cleanup: function() {
        this.unhoverMove();
        return this;
    },
    render: function () {
        var v = this.model.get("vector");
        var p = this.model.get("position");
        this.$el.css({
            left: p.get("x") * 12,
            top: p.get("y") * 12
        }).attr({
            title: this.model.get("vector").toString(),
            "data-motionString": this.model.toString()
        });

        if (this.model.get("highlight")) {
            this.$el.addClass("highlight");
            this.$confirmer.show();
        } else {
            this.$el.removeClass("highlight");
            this.$confirmer.hide();
        }
        //if vector = (0|0], mark as start
        //console.log(v.toString());
        var willCrash = this.model.get("willCrash");
        if (willCrash !== undefined) {
            if (this.model.get("willCrash")) {
                this.$el.addClass("willCrash");
            } else {
                this.$el.addClass("noCrash");
            }
        }
        if (v.toString()==="(0|0)") {
            this.$el.attr("title", "Start: " + this.model.toKeyString());
            this.$el.addClass("isStart");
        }
        return this;
    }
});
