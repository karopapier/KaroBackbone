var ChatUsersView = Backbone.View.extend({
    tagName: "div",
    initialize: function () {
        _.bindAll(this, "render", "addItem", "delItem");
        this.collection.on("reset", this.render);
        this.collection.fetch();
        this.collection.on("add", this.addItem)
        this.collection.on("remove", this.delItem)
    },
    addItem: function (user) {
        var chatUserView = new UserView({
            model: user,
            withGames: true,
            withAnniversary: true,
            withDesperation: true
        });
        var li = $('<li></li>');
        li.append(chatUserView.el);
        this.$el.append(li);
    },
    delItem: function (user) {
        console.log("Expecting to Remove ", user);
    },
    render: function () {
        this.$el.empty();
        var me = this;
        this.collection.each(function (chatUser) {
            this.addItem(chatUser);
        }.bind(this));
        return this;
    }
})