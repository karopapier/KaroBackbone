var _ = require('underscore');
var Backbone = require('backbone');
var MoveCollection = require('../collection/MoveCollection');
module.exports = Backbone.Model.extend(/** @lends Player.prototype */{
    /**
     * @construcor Player
     * @class Player
     */
    defaults: {
        id: 0
    },
    initialize: function () {
        _.bindAll(this, "parse", "getLastMove");
        if (!this.moves) {
            this.moves = new MoveCollection();
        }
        //this.listenTo(this.moves, "add remove change", this.trigger.bind(this,"movechange"));
        //this.listenTo(this.moves, "reset", this.trigger.bind(this,"movereset"));
    },
    parse: function (data) {
        if (!this.moves) {
            this.moves = new MoveCollection();
        }
        this.moves.reset(data.moves);
        delete data.moves;
        return data;
    },
    getLastMove: function () {
        if (this.moves.length > 0) {
            return this.moves.at(this.moves.length - 1);
        } else {
            return false;
        }
    },
    toJSON: function () {
        var modelJSON = Backbone.Model.prototype.toJSON.call(this);
        modelJSON.moves = this.moves.toJSON();
        return modelJSON;
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