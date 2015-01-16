var Player = Backbone.Model.extend({
    defaults: {
        id: 0
    },
    initialize: function() {
        this.moves=new MoveCollection();
        this.lastmove=new Move();
    }
});