var ChatMessageCache = Backbone.Collection.extend({
    url:  "http://www.karopapier.de/api/chat/list.json?limit=100&callback=?",
    baseUrl: "http://www.karopapier.de/api/chat/list.json",
    model: ChatMessage,
    comparator: "lineId",
    initialize: function() {
        //_.bindAll(this, "addItem");
    },
    cache: function(start) {
        this.fetch({
            url: this.baseUrl + "?start=" + start + "&limit=100&callback=?",
            remove: false
        });
    }
})