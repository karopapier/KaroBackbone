var ChatLayout = Backbone.Marionette.LayoutView.extend({
    className: "chatApp",
    template: window["JST"]["chat/chatLayout"],
    regions: {
        chatMessages: "#chatMessages",
        chatInfo: "#chatInfo",
        chatControl: "#chatControl",
        chatEnter: "#chatEnter",
        webNotifier: "#webNotifier"
    },
    render: function () {
        console.log("Yeah, I do get called and I know", this.model);
    }
});