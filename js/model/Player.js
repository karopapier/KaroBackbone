var Player = Backbone.Model.extend({
    defaults: {
        id: 0
    },
    initialize: function() {
        _.bindAll(this, "parse", "getLastMove");
    },
    parse: function(data) {
        this.moves=new MoveCollection();
        this.moves.reset(data.moves);
        delete data.moves;
        return data;
    },
    getLastMove: function(){
        if (this.moves.length>0) {
            return this.moves.at(this.moves.length-1);
        } else {
            return false;
        }
    }

});