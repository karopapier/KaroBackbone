var MoveMessageCollection = Backbone.Collection.extend({
    model: MoveMessage,
    comparator: function(mm) {
        return mm.get("move").get("t");
    }
});
