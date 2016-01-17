var MoveMessageCollection = Backbone.Collection.extend({
    model: Move,
    initialize: function () {
        _.bindAll(this, "updateFromPlayers");
    },

    comparator: function (mm) {
        return mm.get("t");
    },

    updateFromPlayers: function (players) {
        var msgs = [];
        players.each(function (p) {
            var withMessage = p.moves.filter(function (m) {
                return m.get("msg")
            });
            _.each(withMessage, function (m) {
                m.set("player", p);
            });
            msgs = msgs.concat(withMessage);
        });
        this.reset(msgs);
    }
});
