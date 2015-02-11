var Player = Backbone.Model.extend({
    defaults: {
        id: 0
    },
    initialize: function() {
        _.bindAll(this, "parse", "getLastMove");
        if (!this.moves) {
            this.moves=new MoveCollection();
        }
        this.listenTo(this.moves, "add remove change reset", this.triggerChange);
    },
    triggerChange: function() {
        this.trigger("change");
    },
    parse: function(data) {
        if (!this.moves) {
            this.moves=new MoveCollection();
        }
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
    },
    toJSON: function() {
        var modelJSON= Backbone.Model.prototype.toJSON.call(this);
        modelJSON.moves = this.moves.toJSON();
        return modelJSON;
    }

});