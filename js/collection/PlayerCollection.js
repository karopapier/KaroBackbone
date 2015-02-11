var PlayerCollection = Backbone.Collection.extend({
    model: Player,

    initialize: function(models, options) {

    },

    toJSON: function () {
        var modelJSON=[];
        this.each(function(e,i) {
            modelJSON.push(e.toJSON())
        })
        return modelJSON;
    },

    /**
     * positions, where all players currently stand that already moved this round
     */
    getOccupiedPositions: function() {
        var blockers = this.where({
            position: 0,
            status: "ok",
            moved: true
        });

        var positions=[];
        for (var i = 0, l=blockers.length;i<l; i++) {
            var mos =blockers[i].moves;
            if (mos.length>0) {
                var mo = mos.at(mos.length-1);
                positions.push(new Position({
                    x: mo.attributes.x,
                    y: mo.attributes.y
                }))
            };
        }
        return positions;
    }
});