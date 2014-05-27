var ChatMessageCollection = Backbone.Collection.extend({
    url: "http://reloaded.karopapier.de/api/chat/list.json?limit=100&callback=?",
    //url: "http://localhost:8000/?callback=?",
    model: ChatMessage,
    initialize: function() {
        _.bindAll(this, "addItem");
    },
    addItem: function(e) {

    }
})