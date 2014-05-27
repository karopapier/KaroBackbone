var ChatApp = Backbone.Marionette.Layout.extend({
    initialize: function () {
        this.layout = new ChatLayout({
            el: this.el
        });
        this.layout.render();

        this.configuration = new Backbone.Model();
        this.configuration.set("limit", 20);

        this.chatMessageCollection = new ChatMessageCollection();
        this.chatMessagesView = new ChatMessagesView({
            model: this.configuration,
            collection: this.chatMessageCollection
        });

        this.chatUserCollection = new ChatUserCollection();
        this.chatUsersView = new ChatUsersView({
            collection: this.chatUserCollection
        })

        this.chatControlView = new ChatControlView({
            model: this.configuration
        });

        //dirty first poor man's refresh
        this.refreshMessages = setInterval(function() {
            this.chatMessageCollection.fetch()
        }.bind(this),60000);
    },
    render: function () {
        this.layout.chatMessages.show(this.chatMessagesView);
        this.layout.chatInfo.show(this.chatUsersView);
        this.layout.chatControl.show(this.chatControlView);
    }
});

