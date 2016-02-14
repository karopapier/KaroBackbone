var Backbone = require("backbone");
var Position = require('./Position');
var Vector = require('./Vector');
var Motion = require('./Motion');
module.exports = Backbone.Model.extend({
    defaults: {
        uid: 0,
        x: 0,
        y: 0,
        xv: 0,
        yv: 0
    },
    getMotion: function() {
        var pos = new Position({x: this.get("x"), y: this.get("y")});
        var vec = new Vector({x: this.get("xv"), y: this.get("yv")});
        return new Motion({
            position: pos,
            vector: vec
        });
    }
});
