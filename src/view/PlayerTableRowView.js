var PlayerTableRowView = Backbone.View.extend({
    tagName: "tr",
    className: "playerTableRow",
    template: window["JST"]["game/playerTableRow"],
    initialize: function () {
        _.bindAll(this, "render");
        //this.listenTo(this.collection, "change", this.render);
        //this.listenTo(this.collection, "reset", this.render);
        this.listenTo(this.model, "change:visible", this.updateVisibility);
        this.listenTo(this.model, "change:highlight", this.updateHighlight);
    },

    events: {
        "change input": "setVisibility",
        "mouseenter": "highlight",
        "mouseleave": "unhighlight"
    },

    setVisibility: function (e) {
        $e = $(e.currentTarget);
        this.model.set("visible", $e.prop("checked"));
    },

    updateVisibility: function () {
        this.$('input').prop("checked", this.model.get("visible"));
    },

    updateHighlight: function () {
        if (this.model.get("highlight")) {
            this.$el.addClass("highlight");
        } else {
            this.$el.removeClass("highlight");
        }
    },

    highlight: function () {
        this.model.set("highlight", true);
    },

    unhighlight: function () {
        this.model.set("highlight", false);
    },

    render: function () {
        var data = this.model.toJSON();
        var statusClass = "";
        var displayStatus = "";
        var status = this.model.get("status");
        var pos = this.model.get("position");
        if (status == "kicked" || status == "left") {
            statusClass = status;
            displayStatus = this.model.getStatus();
        }

        if (status === "ok") {
            if (this.model.get("dran")) {
                statusClass = "dran";
                displayStatus = "dran";
            } else {
                if (pos != 0) {
                    displayStatus = "wurde " + pos + ".";
                } else {
                    if (this.model.get("moved")) {
                        displayStatus = "war schon";
                        statusClass = "moved";
                    } else {
                        displayStatus = "kommt noch";
                        statusClass = "tomove";
                    }
                }
            }
        }

        data.lastmovetime = this.model.getLastMove() ? this.model.getLastMove().get("t") : "-";
        data.displayStatus = displayStatus;
        data.statusClass = statusClass;
        this.$el.html(this.template(data));
        return this;
    }
});
