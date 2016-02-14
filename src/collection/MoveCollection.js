var Backbone = require('backbone');
var Move = require('../model/Move');
module.exports = Backbone.Collection.extend(/** @lends MoveCollection.prototype */{
    model: Move,
    calcBlocktime: function() {
        console.warn("Full Calc Blocktime of MoveCollection");
        var blocktime = {};
        this.collection.each(function(p) {
            var id = p.get("id");
            blocktime[id] = 0;
            //console.log(p);
            //console.log(p.get("name"), p.moves.length);
            var ms = p.moves.toJSON();
            ms.map(function(m) {
                m.userId = id
            });
            moves.add(ms);
        });

        this.comparator = function(m) {
            return new Date(m.get("t").replace(" ", "T") + "Z").getTime();
        };
        moves.sort();
        moves.comparator = undefined;
        var lasttime = new Date();
        if (moves.length > 0) {
            var lasttime = new Date(moves.at(0).get("t").replace(" ", "T") + "Z").getTime();
        }
        moves.each(function(m) {
            var d = new Date(m.get("t").replace(" ", "T") + "Z").getTime();
            var userId = m.get("userId");
            blocktime[userId] += (d - lasttime);
            lasttime = d;
        });
        this.collection.each(function(p) {
            p.set("blocktime", parseInt(blocktime[p.get("id")] / 1000));
        });
    }
});
