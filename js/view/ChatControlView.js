var ChatControlView = Backbone.View.extend({
    tagName: "div",
    template: window["JST"]["chat/chatControl"],
    initialize: function () {
        _.bindAll(this, "render");
        this.listenTo(Karopapier.User, "change:id", this.render);
        this.listenTo(this.model, "change:limit", this.render);
        this.listenTo(this.model, "change:start", this.render);
        this.listenTo(this.model, "change:lastLineId", this.render);
        return this;
    },
    events: {
        "click .messageLimit": "setLimit",
        "change #startPicker": "syncStart",
        "input #startPicker": "syncStart",
        "click #startLineUpdate": "setStart"
    },
    setStart: function(e) {
        var start = parseInt(this.$el.find("#startLine").val());
        this.model.set("start", start);
    },
    syncStart: function(e) {
        var v = parseInt(e.currentTarget.value);
        $('#startLine').val(v);
    },
    setLimit: function (e) {
        var limit = parseInt($(e.currentTarget).text());
        this.model.set("limit", limit);
    },
    render: function () {
        console.log("Render control view", this.model.get("start"), this.model.get("lastLineId"));
        if (Karopapier.User.get("id") != 0) {
            this.$el.html(this.template({user: Karopapier.User.toJSON(), settings: this.model.toJSON()}));
        } else {
            this.$el.html("Nicht angemeldet");
        }
        return this;
    }
})
