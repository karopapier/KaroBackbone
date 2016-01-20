var Backbone = require('backbone');
var Vector = require('./Vector');
var Position = require('./Position');
module.exports = Position = Backbone.Model.extend(/** @lends Position.prototype */{
    defaults: {
        x: 0,
        y: 0
    },
    /**
     * @construcor Position
     * @class Position
     * @param x {interger} or {Object} either x or x/y map
     * @param y {integer} optional y
     */
    initialize: function(x, y) {
        //check if first arg is an object with x and y or if we have two numeric args
        if (typeof x === "object") {
            //we have an object, so we assume default map with x and y
        } else {
            //console.info("Hope for two numbers", x, y, " Is it?");
            //console.info(typeof x, typeof y);
            if ((typeof x === "number") && (typeof y === "number")) {
                this.set("x", x);
                this.set("y", y);
                //console.log(this.toString());
            } else {
                console.error("Vector init messed up: ", x, y);
            }
        }
    },

    toString: function() {
        return '[' + this.get("x") + '|' + this.get("y") + ']';
    },
    move: function(v) {
        this.set("x", this.get("x") + v.get("x"));
        this.set("y", this.get("y") + v.get("y"));
    },

    /**
     * calculates a vector that leads from this pos to given pos
     * @param Position p
     * @return Vector
     */
    getVectorTo: function(p) {
        var vx = p.get("x") - this.get("x");
        var vy = p.get("y") - this.get("y");
        return new Vector({x: vx, y: vy});
    },
    getPassedPositionsTo: function(p) {
        var v = this.getVectorTo(p);
        var vecs = v.getPassedVectors();
        var positions = {};

        for (var vecString in vecs) {
            v = vecs[vecString];
            var pos = new Position(this.attributes);
            pos.move(v);
            positions[pos.toString()] = pos;
        }
        return positions;
    }
});