var ChatControlView = Backbone.View.extend({
    tagName: "div",
    template: window["JST"]["chat/chatControl"],
    initialize: function () {
        _.bindAll(this, "render");
        Karopapier.User.on("change:id",this.render);
        return this;
    },
    render: function () {
        if (Karopapier.User.get("id")!=0) {
            this.$el.html(this.template(Karopapier.User.toJSON()));
        } else {
            this.$el.html("Nicht angemeldet");
        }
        return this;
    }
})