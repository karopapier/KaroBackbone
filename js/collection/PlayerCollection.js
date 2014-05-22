var PlayerCollection = Backbone.Collection.extend({
    model: Player,

    initialize: function(models, options) {
        _.bindAll(this);
        this.moveMessages=options.moveMessages;
        this.bind("reset",function(o,id) {
            console.info("Init Players");
            //Look for messages

            //clear messages first
            this.moveMessages.reset();
            this.each(function(player) {
                //parse player moves for messages
                player.get("moves").each(function(move){
                    if (move.get("msg")) {
                        mm=new MoveMessage({
                            "move": move,
                            "player": player
                        });
                        this.moveMessages.add(mm,{silent:true});
                    }
                },this);
            },this)
            this.moveMessages.trigger("change");
        });
    }
});