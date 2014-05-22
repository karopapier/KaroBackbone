var ChatMessageCollection = Backbone.Collection.extend({
    url: "http://reloaded.karopapier.de/api/chat/list.json?limit=10&callback=?",
    model: ChatMessage,
    initialize: function() {
        _.bindAll(this, "addItem");
    },
    addItem: function(e) {

    }
})