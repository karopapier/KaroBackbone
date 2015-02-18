var GameCollection = Backbone.Collection.extend({
	model: Game,
    initialize: function() {
        _.bindAll(this, "addId");
    },
    addId: function(id) {
        this.add(new Game({ id: id}));
    }
});
