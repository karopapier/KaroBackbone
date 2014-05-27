var ChatLayout = Backbone.Marionette.Layout.extend({
    template: window["JST"]["chat/chatLayout"],
    regions: {
        chatMessages: "#chatMessages",
        chatInfo: "#chatInfo",
        chatControl: "#chatControl"
    }
})