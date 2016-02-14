var Backbone = require('backbone');
var Player = require('../model/Player');
var Position = require('../model/Position');
module.exports = Backbone.Collection.extend({
    model: Player,

    initialize: function(models, options) {
    },

    toJSON: function() {
        var modelJSON = [];
        this.each(function(e, i) {
            modelJSON.push(e.toJSON());
        });
        return modelJSON;
    },

    /**
     * positions, where all players currently stand.
     * can be limited to those that already moved this round (according to change of rules for GID>75000)
     */
    getOccupiedPositions: function(onlyMoved) {
        var queryParams = {
            position: 0,
            status: "ok"
        };
        if (onlyMoved) {
            queryParams.moved = true;
        }
        var blockers = this.where(queryParams);

        var positions = [];
        for (var i = 0, l = blockers.length; i < l; i++) {
            var lastmove = blockers[i].getLastMove();
            if (lastmove) {
                positions.push(lastmove.getMotion().getSourcePosition());
            }
        }
        return positions;
    }
});