var ChatApp = Backbone.Marionette.Layout.extend({
    initialize: function () {
        this.layout = new ChatLayout({
            el: this.el
        });
        this.layout.render();

        this.configuration = new Backbone.Model();
        this.configuration.set("limit",4);

        this.chatMessageCollection = new ChatMessageCollection();
        this.chatMessagesView = new ChatMessagesView({
            model: this.configuration,
            collection: this.chatMessageCollection
        });

        this.chatUserCollection = new ChatUserCollection();
        this.chatUsersView = new ChatUsersView({
            collection: this.chatUserCollection
        })


        console.log("Init Chat app");
    },
    render: function() {
        console.log("Someone called ChatApp's render");
        this.layout.chatMessages.show(this.chatMessagesView);
        this.layout.chatInfo.show(this.chatUsersView);
    }
});

