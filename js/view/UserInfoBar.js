var UserInfoBar = Backbone.View.extend({
    id: "userInfoBar",
    tagName: "div",
    template: window["JST"]["global/userInfoBar"],
    initialize: function (options) {
        _.bindAll(this, "render");
        this.userView = new UserView({
            model: this.model,
            withGames: true,
            withAnniversary: true,
            withDesperation: false
        })
        this.listenTo(this.model, "change", this.render);
    },
    render: function () {
        if (this.model.get("id") != 0) {
            this.$el.html(this.userView.$el);
            this.$el.append(this.template());
        } else {
            this.$el.html("Nicht angemeldet");
        }
        return this;
    }
})