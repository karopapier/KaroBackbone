var ChatUserCollection = Backbone.Collection.extend({
    url: "http://reloaded.karopapier.de/api/chat/users.json?callback=?",
    model: ChatUser,
    initialize: function() {
        _.bindAll(this, "addItem");
    },
    addItem: function(e) {

    }
})