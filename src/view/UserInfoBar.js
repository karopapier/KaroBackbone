var _ = require('underscore');
var Backbone = require('backbone');
var UserView = require('./UserView');
module.exports = Backbone.View.extend({
    id: "userInfoBar",
    tagName: "div",
    template: window.JST["main/userInfoBar"],
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
        var uid = this.model.get("id");
        if (uid > 0) {
            this.$el.html(this.userView.$el);
            this.$el.append(" ");
            this.$el.append(this.template());
            return this;
        }

        var html = "Moment, kenn ich Dich?";
        if (uid === 0) {
            html = '<a class="login" href="/login">Nicht angemeldet</a>';
        }
        this.$el.html(html);
        return this;
    }
});
