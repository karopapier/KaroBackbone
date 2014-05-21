var ChatApp = Backbone.Marionette.Layout.extend({
    initialize: function () {
        this.layout = new ChatLayout({
            el: this.el
        });
        this.layout.render();

        this.chatMessageCollection = new ChatMessageCollection();
        this.chatMessagesView = new ChatMessagesView({
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
        this.layout.chatmessages.show(this.chatMessagesView);
        this.layout.chatinfo.show(this.chatUsersView);
    }
});

