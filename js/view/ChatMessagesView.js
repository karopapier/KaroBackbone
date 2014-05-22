var ChatMessagesView = Backbone.View.extend({
    tagName: "div",
    initialize: function () {
        _.bindAll(this, "render", "addItem", "limit");
        this.collection.on("reset", this.render);
        this.collection.fetch();
        this.collection.on("add", this.addItem)

        this.message_limit = 0;

        this.model.on("change", this.limit)
    },
    addItem: function (chatMessage) {
        console.log("Single chatmessage add");
        var chatMessageView = new ChatMessageView({model: chatMessage});
        this.$el.append(chatMessageView.$el.hide().fadeIn());
    },
    limit: function(e, a) {
        this.message_limit = this.model.get("limit")
        this.render();
    },
    render: function () {
        console.log("Full chatmessage render");
        this.$el.empty();
        var me = this;
        _.each(this.collection.last(this.message_limit),function (chatMessage) {
            this.addItem(chatMessage);
        }.bind(this));
        return this;
    }
})