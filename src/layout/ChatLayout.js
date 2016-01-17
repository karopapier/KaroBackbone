var ChatLayout = Backbone.Marionette.LayoutView.extend({
    className: "chatLayout",
    template: window["JST"]["chat/chatLayout"],
    regions: {
        chatMessages: "#chatMessages",
        chatInfo: "#chatInfo",
        chatControl: "#chatControl",
        chatEnter: "#chatEnter",
        webNotifier: "#webNotifier"
    }
});