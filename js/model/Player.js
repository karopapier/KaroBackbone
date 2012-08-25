var Player = Backbone.Model.extend({
    defaults: {
        id: 0
    },

    initialize: function() {
        this.moves=new MoveCollection();
        this.lastmove=new Move();
        this.bind("change:id",function(o,id) {
            console.info(" New Player id: "+id);
        });
    }
});