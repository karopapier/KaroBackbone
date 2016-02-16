var _ = require('underscore');
var Backbone = require('backbone');
var MoveMessageCollection = require('../collection/MoveMessageCollection');
var Map = require('./map/Map');
var PlayerCollection = require('../collection/PlayerCollection');
var MotionCollection = require('../collection/MotionCollection');
var MoveCollection = require('../collection/MoveCollection');
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

        /*
         New approach:

         1) Have on global move collection with ALL moves.
         - used as a base for blocktime
         - can be filtered by user for player's moves
         - used as a base for movemessages

         2) Have movemessagecollection
         3) Have a simple playercollection
         4) Have a hash of userid:movecollection per player
         No more moves within the player object

         -- ALL collections to be filled with the parse

         */
        //new approach:
        this.moveMessages = new MoveMessageCollection();
        this.moves = new MoveCollection();
        this.players = new PlayerCollection();
        this.playersMoves = {};
        this.possibles = new MotionCollection();

        this.listenTo(this, "change:completed", this.updatePossibles);
        this.listenTo(this.players, "movechange", function() {
            console.warn("Somebody triggered movechange on playerscollection");
            this.updatePossibles();
        });
    },

    url: function() {
        return "//www.karopapier.de/api/game/" + this.get("id") + "/details.json?callback=?";
    },

    parse: function(data) {
        var me = this;
        //check if this is a details.json
        if (data.game) {
            console.log("DETAIL PARSE", this.get("id"));
            //pass checkpoint info to map as "cpsActive" // map has cps attr as well, array of avail cps

            //map
            this.map.set({"cpsActive": data.game.cps}, {silent: true});
            this.map.set(data.map);

            this.playersMoves = {};

            //transform moves
            data.players.forEach(function(e, i) {
                var uid = e.id;
                var moves = e.moves;
                delete(e.moves);
                //console.log("Transform", moves.length, "moves for", uid);
                me.playersMoves[uid] = new MoveCollection(moves);
                me.moves.add(moves);
                var movesWithMsg  = moves.filter(function(e) {
                    return e.hasOwnProperty("msg");
                });
                _.each(movesWithMsg, function(m) {
                    //console.log(e);
                    m.player = e.name;
                });
                me.moveMessages.add(movesWithMsg);
            });
            //console.log("Moves:", me.moves.length);
            //console.log("MoveMessages:", me.moveMessages.length);

            //players
            this.players.reset(data.players);
            //console.log("Players", me.players.length);
            //console.log("Players", me.players);

            //game
            data.game.completed = true;
            data.game.loading = false;

            //return only the game part
            return data.game;
        } else {
            console.log("shallow parse");
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
        //console.log("Game", id, "is loading:", this.get("loading"));
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
        if (this.players.length < 1) return false;
        var currentPlayer = this.players.get(dranId);
        if (!currentPlayer) return false;
        var movesCount = this.playersMoves[dranId].length;

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

        var occupiedPositions = this.players.getOccupiedPositions((this.get("id") >= 75000)); //only for GID > 75000 limit to those that already moved
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
        //console.log(othergame.players.toJSON());
        this.players.reset(othergame.players.toJSON(), {parse: true});
        this.updatePossibles();
        //now set completed, really AT THE END
        this.set("completed", true);
        //console.warn("FINISHED SETTING FROM OTHER GAME");
    }
});
