var ChatLayout = Backbone.Marionette.Layout.extend({
    template: window["JST"]["chat/layout"],
    regions: {
        chatmessages: "#chatmessages",
        chatinfo: "#chatinfo"
    }
})