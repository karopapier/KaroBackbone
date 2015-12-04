var ChatUsersView = Backbone.View.extend({
    tagName: "ul",
    className: "chatUsersView",
    initialize: function () {
        _.bindAll(this, "render", "addItem");
        this.collection.on("reset", this.render);
        //TODO get rid of this fetch here...
        this.collection.fetch({reset: true});
        this.collection.on("add", this.addItem);
    },
    addItem: function (user) {
        var chatUserView = new UserView({
            model: user,
            withGames: true,
            withAnniversary: true,
            withDesperation: true,
            withGamesLink: true,
            withInfoLink: true
        });
        var li = $('<li></li>');
        li.append(chatUserView.el);
        this.$el.append(li);
    },
    render: function () {
        this.$el.empty();
        var me = this;
        this.collection.each(function (chatUser) {
            this.addItem(chatUser);
        }.bind(this));
        return this;
    }
});
