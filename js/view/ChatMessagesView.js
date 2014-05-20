var ChatMessagesView = Backbone.View.extend({
    tagName: "div",
    initialize: function () {
        _.bindAll(this, "render", "addItem");
        this.collection.on("reset", this.render);
        this.collection.fetch();
        this.collection.on("add", this.addItem)
    },
    addItem: function (chatMessage) {
        var chatMessageView = new ChatMessageView({model: chatMessage});
        this.$el.append(chatMessageView.el);
    },
    render: function () {
        this.$el.empty();
        var me = this;
        this.collection.each(function (chatMessage) {
            this.addItem(chatMessage);
        }.bind(this));
        return this;
    }
})