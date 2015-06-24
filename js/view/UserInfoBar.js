var UserInfoBar = Backbone.View.extend({
    id: "userInfoBar",
    tagName: "div",
    template: window.JST["global/userInfoBar"],
    events: {
        "click .login": "login"
    },
    login: function(e) {
        e.preventDefault();
        console.log("Login now");
        return false;
    },
    initialize: function(options) {
        _.bindAll(this, "render");
        this.userView = new UserView({
            model: this.model,
            withGames: true,
            withAnniversary: true,
            withDesperation: false,
            withGamesLink: true
        });
        this.listenTo(this.model, "change", this.render);
    },
    render: function() {
        if (this.model.get("id") !== 0) {
            this.$el.html(this.userView.$el);
            this.$el.append(" ");
            this.$el.append(this.template());
        } else {
            this.$el.html('<a class="login" href="/login">Nicht angemeldet</a>');
        }
        return this;
    }
});
