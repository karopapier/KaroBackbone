var Backbone = require('backbone');
var Move = require('./Move');
module.exports = Backbone.Model.extend(/** @lends Player.prototype */{
    /**
     * @construcor Player
     * @class Player
     */
    defaults: {
        id: 0,
        moveCount: -1,
        crashCount: -1,
        blocktime: 1
    },
    parse: function (data) {
        if (data.moves) {
            delete data.moves;
        }
        return data;
    },
    getLastMove: function () {
        return new Move(this.get("lastmove"));
    },
    getStatus: function () {
        var means = {
            "kicked": "rausgeworfen",
            "left": "ausgestiegen",
            "invited": "eingeladen"
        }
        var s = this.get("status");
        if (s in means) return means[s];
        return s;
    }
});