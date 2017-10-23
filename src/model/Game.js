var _ = require('underscore');
var Backbone = require('backbone');
var MoveMessageCollection = require('../collection/MoveMessageCollection');
var Map = require('./map/Map');
var PlayerCollection = require('../collection/PlayerCollection');
var MotionCollection = require('../collection/MotionCollection');
var Motion = require('./Motion');

module.exports = Backbone.Model.extend(/** @lends Game.prototype */ {
    defaults: {
        id: 0,
        completed: false,
        loading: false
    },
    /**
     * @constructor Game
     * @class Game
     * @param options map
     */
    initialize: function(options) {
        options = options || {};
        _.bindAll(this, "parse", "load", "updatePossibles");
        if (options.map) {
            this.map = options.map;
            if (typeof this.map === "number") {
                this.map = new Map({
                    id: this.map
                });
            }
        } else {
            this.map = new Map();
        }
        this.set("moveMessages", new MoveMessageCollection());
        //pass the MoveMessage collection into it to have the messages ready in one go when walking the moves
        this.set("players", new PlayerCollection());
        this.listenTo(this.get("players"), "reset", this.get("moveMessages").updateFromPlayers);
        this.possibles = new MotionCollection();
        this.listenTo(this, "change:completed", this.updatePossibles);
        this.listenTo(this.get("players"), "movechange", function() {
            //console.log("movechange");
            this.updatePossibles();
        });
    },

    url: function () {
        return APIHOST + "/api/game/" + this.get("id") + "/details.json?callback=?";
    },

    parse: function(data) {
        //console.log("PARSE");
        //make sure data is matching current gameId (delayed responses get dropped)
        if (this.get("id") !== 0) {
            //check if this is a details.json
            if (data.game) {
                //console.log("DETAIL PARSE");
                if (data.game.id == this.id) {
                    //pass checkpoint info to map as "cpsActive" // map has cps attr as well, array of avail cps
                    this.map.set({"cpsActive": data.game.cps}, {silent: true});
                    this.map.set(data.map);
                    //console.log("RESET PLAYERS NOW");
                    this.get("players").reset(data.players, {parse: true});
                    data.game.completed = true;
                    data.game.loading = false;
                    //console.log("RETURN DATA NOW");
                    return data.game;
                } else {
                    console.warn("Dropped response for " + data.game.id);
                }
            }
        }
        return data;
    },

    load: function(id) {
        var hasId = this.get("id");

        //if not ID already set or passed, return
        if (!id && !hasId) return false;
        if (hasId > 0) id = hasId;

        //if already loading, return
        //@TODO: consider timeout of "loading"
        console.log("Game", id, "is loading:", this.get("loading"));
        if (this.get("loading")) return false;
        //silently set the id, events trigger after data is here
        //this.set({"id": id, completed: false}, {silent: true});
        this.set({"id": id, completed: false, loading: true});
        console.info("Fetching game details for " + id);
        this.fetch();
    },

    updatePossibles: function() {
        //console.warn("Start Recalc possibles for", this.get("id"));
        if (!(this.get("completed"))) return false;
        if (this.get("moved")) return false;
        if (this.get("finished")) {
            this.possibles.reset([]);
            return true;
        }
        //console.warn("Really DO recalc possibles for", this.get("id"));

        var dranId = this.get("dranId");
        if (this.get("players").length < 1) return false;
        var currentPlayer = this.get("players").get(dranId);
        if (!currentPlayer) return false;
        var movesCount = currentPlayer.moves.length;

        //FIXME
        var theoreticals;

        //if no moves but dran and active, return starties
        if ((movesCount === 0) && (currentPlayer.get("status") == "ok")) {
            theoreticals = this.map.getStartPositions().map(function(e) {
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

        var occupiedPositions = this.get("players").getOccupiedPositions((this.get("id") >= 75000)); //only for GID > 75000 limit to those that already moved
        var occupiedPositionStrings = occupiedPositions.map(function(e) {
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
    setFrom: function(othergame) {
        //console.warn("START SETTING FROM OTHER GAME");
        this.set("completed", false);
        othergame.set("completed", false);
        var attribsToSet = {};
        _.each(othergame.attributes, function(att, i) {
            if (typeof att !== "object") {
                //console.log("Setting ", i, "to", att);
                attribsToSet[i] = att;
            }
        });
        this.set(attribsToSet);
        this.map.set(othergame.map.toJSON());
        //console.log(othergame.get("players").toJSON());
        this.get("players").reset(othergame.get("players").toJSON(), {parse: true});
        this.updatePossibles();
        //now set completed, really AT THE END
        this.set("completed", true);
        //console.warn("FINISHED SETTING FROM OTHER GAME");
    }
});
