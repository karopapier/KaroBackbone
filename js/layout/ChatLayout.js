var ChatLayout = Backbone.Marionette.LayoutView.extend({
    template: window["JST"]["chat/chatLayout"],
    regions: {
        chatMessages: "#chatMessages",
        chatInfo: "#chatInfo",
        chatControl: "#chatControl",
        chatEnter: "#chatEnter",
        webNotifier: "#webNotifier"
    }
});