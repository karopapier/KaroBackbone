var Game = Backbone.Model.extend({
    defaults: {
        id: 0,
        completed: false
    },
    initialize: function () {
        _.bindAll(this, "parse", "load", "updatePossibles");
        this.map = new Map();
        this.set("moveMessages", new MoveMessageCollection());
        //pass the MoveMessage collection into it to have the messages ready in one go when walking the moves
        this.set("players", new PlayerCollection());
        this.listenTo(this.get("players"), "reset", this.get("moveMessages").updateFromPlayers);
        this.possibles = new MotionCollection();
        this.listenTo(this, "change:completed", this.updatePossibles);
        this.listenTo(this.get("players"), "change", this.updatePossibles);
    },

    url: function () {
        return "http://www.karopapier.de/api/game/" + this.get("id") + "/details.json?callback=?";
    },

    parse: function (data) {
        //make sure data is matching current gameId (delayed responses get dropped)
        if (this.get("id") !== 0) {
            //check if this is a details.json
            if (data.game) {
                if (data.game.id == this.id) {
                    //pass checkpoint info to map as "cpsActive" // map has cps attr as well, array of avail cps
                    this.map.set({"cpsActive": data.game.cps}, {silent: true});
                    this.map.set(data.map);
                    this.get("players").reset(data.players, {parse: true});
                    data.game.completed = true;
                    return data.game;
                } else {
                    console.warn("Dropped response for " + data.game.id);
                }
            }
        }
        return data;
    },

    load: function (id) {
        //silently set the id, events trigger after data is here
        //this.set({"id": id, completed: false}, {silent: true});
        this.set({"id": id, completed: false});
        console.info("Fetching game details for " + id);
        this.fetch();
    },

    updatePossibles: function () {
        if (!(this.get("completed"))) return false;
        if (this.get("finished")) {
            this.possibles.reset([]);
            return true;
        }

        var dranId = this.get("dranId");
        if (this.get("players").length < 1) return false;
        var currentPlayer = this.get("players").get(dranId);
        if (!currentPlayer) return false;
        var movesCount = currentPlayer.moves.length;

        //FIXME
        var theoreticals;

        //TODO if no moves but dran and active, return starties
        if ((movesCount === 0) && (currentPlayer.get("status") == "ok")) {
            theoreticals = this.map.getStartPositions().map(function (e) {
                var v = new Vector({x: 0, y: 0});
                var mo = new Motion({
                    position: e,
                    vector: v
                });
                mo.set("isStart", true);
                return mo;
            });
        } else {
            var lastmove = currentPlayer.getLastMove();
            var mo = lastmove.getMotion();
            //get theoretic motions
            //reduce possibles with map
            theoreticals = mo.getPossibles();
            theoreticals = this.map.verifiedMotions(theoreticals);
        }

        var occupiedPositions = this.get("players").getOccupiedPositions();
        var occupiedPositionStrings = occupiedPositions.map(function (e) {
            return e.toString();
        });

        var possibles = [];
        for (var i = 0; i < theoreticals.length; i++) {
            var possible = theoreticals[i];
            if (occupiedPositionStrings.indexOf(possible.toKeyString()) < 0) {
                possibles.push(possible);
            }
        }
        this.possibles.reset(possibles);
    },
    /**
     * Set all nested parameters from other games data, keeping references intact
     * @param othergame
     */
    setFrom: function (othergame) {
        _.each(othergame.attributes, function (att, i) {
            if (typeof att !== "object") {
                console.log("Setting ", i, "to", att);
                this.set(i, att);
            }
        }, this);
        this.map.set(othergame.map.toJSON());
        console.log(othergame.get("players").toJSON());
        this.get("players").reset(othergame.get("players").toJSON(), {parse: true});
        othergame.get("players").each(function (p, i) {

        })
    }
});
