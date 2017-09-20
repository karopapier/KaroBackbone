var ChatUserCollection = Backbone.Collection.extend({
    url: "/api/chat/users.json?callback=?",
    model: User,
    initialize: function() {
        _.bindAll(this, "addItem");
    },
    addItem: function(e) {

    }
})