var PlayerCollection = Backbone.Collection.extend({
    model: Player,

    initialize: function(models, options) {
        this.moveMessages=options.moveMessages;
        this.listenTo(this, "reset",function(o,id) {
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
    },
    /**
     * positions, where all players currently stand that alrady moves this round
     */
    getOccupiedPositions: function() {
        var blockers = _.where(this.toJSON(),{
            position: 0,
            status: "ok",
            moved: true
        });

        var blockMoves = _.pluck(blockers,"lastmove");
        var positions=[];
        _.each(blockMoves, function(e) {
            positions.push(new Position({
                x: e.attributes.x,
                y: e.attributes.y
            }));
        })
        return positions;
    }
});