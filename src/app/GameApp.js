var _ = require('underscore');
var Marionette = require('backbone.marionette');
var GameLayout = require('../layout/GameLayout');
var GameAppView = require('../view/game/GameAppView');
var GameDranQueueView = require('../view/game/DranQueueView');
var Game = require('../model/Game');
var GameTitleView = require('../view/game/GameTitleView');
var MapViewSettings = require('../model/map/MapViewSettings');
var MapRenderView = require('../view/map/MapRenderView');
var Map = require('../model/map/Map');
var PlayerCollection = require('../collection/PlayerCollection');
var MoveCollection = require('../collection/MoveCollection');
var MoveMessageCollection = require('../collection/MoveMessageCollection');
var PlayerTableView = require('../view/game/PlayerTableView');
var GameInfoView = require('../view/game/GameInfoView');

module.exports = Marionette.Application.extend({
    className: "gameApp",
    initialize: function(options) {
        _.bindAll(this, "displayGame");
        var me = this;
        this.app = options.app; //Karopapier
        this.settings = options.settings;

        this.layout = new GameLayout({});
        this.view = new GameAppView({
            model: this
        });

        /*
         DATA
         */
        this.viewSettings = new MapViewSettings();
        this.game = new Game();
        this.map = new Map({
            mapcode: "X"
        });
        this.players = new PlayerCollection();
        this.moves = new MoveCollection;
        this.moveMessages = new MoveMessageCollection();
        //this.map.setMapcode("XXXXXXXXX\nXNXNXNXNX\nXXXXXXXXX");

        /*
         SUBVIEWS
         */
        this.gameDranQueueView = new GameDranQueueView({
            collection: this.app.UserDranGames
        });

        this.gameTitleView = new GameTitleView({
            model: this.game
        });

        this.mapRenderView = new MapRenderView({
            model: this.map,
            settings: this.viewSettings
        });

        this.playerTableView = new PlayerTableView({
            collection: this.players
        });

        this.gameInfoView = new GameInfoView({
            model: this.game,
            map: this.map
        });

        /*
         LOGIC
         */

        //make sure that (if available) the first two games in queue get/are always fully loaded with details
        this.listenTo(this.app.UserDranGames, "update", function() {
            console.log("Q update");
            var q = me.app.UserDranGames;
            q.first(2).forEach(function(g) {
                if (me.gameId === g.get("id")) {
                    console.warn("Am I about to re-fetch(??) data for the game I already am displaying? Can I skip this request?");
                }
                if (!g.get("completed")) g.load();
            });
        });

        this.app.vent.on('GAME:MOVE', function(data) {
            //console.info(data);
            //if info for this game, add it to moves
        });


    },
    displayGame: function(cachedGame) {
        console.info("NOW APPLY DATA TO VIEW");
        //console.log("cached game", cachedGame);

        //map attributes
        this.map.set(cachedGame.map.attributes);

        //console.log("cached game players", cachedGame.players);
        this.players.set(cachedGame.players.toJSON());
        //this.playersMoves =
        //this.moves =
        //this.moveMessages

        //game attributes
        this.game.set(cachedGame.attributes);
    },
    display: function(gameId) {
        var me = this;
        if (!gameId) {
            console.error("No game to display");
            return false;
        }

        console.info("DISPLAYING GAME", gameId);
        this.gameId = gameId;
        this.app.router.navigate("game.html?GID=" + this.gameId);

        var cachedGame = this.app.UserDranGames.get(gameId);
        if (cachedGame) {
            console.log("Game in Q");
        } else {
            console.log("Game not known");
            cachedGame = new Game({id: gameId});
            cachedGame.load();
        }

        if (cachedGame.get("completed")) {
            me.displayGame(cachedGame);
        } else {
            cachedGame.listenTo(cachedGame, "change completed", function(g) {
                //set from game once loaded
                me.displayGame(g);
            });
        }

        this.map.setMapcode();
        //Now display the game in full detail!
    }
});
