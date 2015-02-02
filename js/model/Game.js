var Game = Backbone.Model.extend({
    defaults: {
        id: 0,
        completed: false
    },
    initialize: function () {
        _.bindAll(this, "parse", "load", "updatePossibles");
        this.map = new Map();
        this.moveMessages = new MoveMessageCollection();
        //pass the MoveMessage collection into it to have the messages ready in one go when walking the moves
        this.players = new PlayerCollection(
            [{id: 0}],
            {
                "moveMessages": this.moveMessages
            }
        );
        this.possibles = new MotionCollection();
        this.listenTo(this, "change:completed", this.updatePossibles);
        this.listenTo(this.players, "change", this.updatePossibles);
    },

    url: function () {
        return "http://www.karopapier.de/api/game/" + this.get("id") + "/details.json?callback=?";
    },

    parse: function (data) {
        //make sure data is matching current gameId (delayed responses get dropped)
        if (data.game.id == this.id) {
            //pass checkpoint info to map as "cpsActive" // map has cps attr as well, array of avail cps
            this.map.set({"cpsActive": data.game.cps}, {silent: true});
            this.map.set(data.map);
            playersData = data.players;
            _.each(playersData, function (playerData) {
                var lastmove = new Move(playerData.lastmove);
                playerData.lastmove = lastmove;
                var moves = new MoveCollection(playerData.moves);
                playerData.moves = moves;
            });
            this.players.reset(data.players);
            data.game.completed = true;
            return data.game;
        } else {
            console.warn("Dropped response for " + data.game.id);
        }
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
        console.info("Update possibles");

        var dranId = this.get("dranId");
        var currentPlayer = this.players.get(dranId);
        var lastmove = currentPlayer.get("lastmove");


        //FIXME

        //TODO if no moves but dran and active, return starties
        var movesCount = currentPlayer.get("moves").length;
        if ((movesCount == 0) && (currentPlayer.get("status") == "ok")) {
            var theoreticals = this.map.getStartPositions().map(function (e) {
                var v = new Vector({x: 0, y: 0});
                var mo = new Motion({
                    position: e,
                    vector: v
                })
                mo.set("isStart",true);
                return mo;
            });
        } else {
            var mo = lastmove.getMotion();
            //get theoretic motions
            //reduce possibles with map
            var theoreticals = mo.getPossibles();
            theoreticals = this.map.verifiedMotions(theoreticals);
        }

        var occupiedPositions = this.players.getOccupiedPositions();
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
    }
});
