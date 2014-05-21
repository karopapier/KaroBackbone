var ChatUsersView = Backbone.View.extend({
    tagName: "div",
    initialize: function () {
        _.bindAll(this, "render", "addItem");
        this.collection.on("reset", this.render);
        this.collection.fetch();
        this.collection.on("add", this.addItem)
    },
    addItem: function (user) {
        var chatUserView = new ChatUserView({model: user});
        this.$el.append(chatUserView.el);
    },
    render: function () {
        console.log("Rendering the ChatUserView");
        this.$el.empty();
        var me = this;
        this.collection.each(function (chatUser) {
            this.addItem(chatUser);
        }.bind(this));
        return this;
    }
})