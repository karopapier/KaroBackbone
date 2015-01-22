var Game = Backbone.Model.extend({
    defaults: {
        id: 0,
        completed: false
    },
    initialize: function () {
        _.bindAll(this, "parse", "load");
        this.map = new Map();
        this.moveMessages = new MoveMessageCollection();
        //pass the MoveMessage collection into it to have the messages ready in one go when walking the moves
        this.players = new PlayerCollection(
            [{id: 0}],
            {
                "moveMessages": this.moveMessages
            });
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
            console.warn("Dropped response for "+ data.game.id);
        }
    },

    load: function (id) {
        //silently set the id, events trigger after data is here
        //this.set({"id": id, completed: false}, {silent: true});
        this.set({"id": id, completed: false});
        console.info("Fetching game details for " + id);
        this.fetch();
    }
});
