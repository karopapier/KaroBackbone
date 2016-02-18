var _ = require('underscore');
var Marionette = require('backbone.marionette');
var GameLayout = require('../layout/GameLayout');
var GameAppView = require('../view/game/GameAppView');
var GameDranQueueView = require('../view/game/DranQueueView');
var Game = require('../model/Game');
var MapViewSettings = require('../model/map/MapViewSettings');
var MapRenderView = require('../view/map/MapRenderView');
var Map = require('../model/map/Map');
var PlayerCollection = require('../collection/PlayerCollection');
var MoveCollection = require('../collection/MoveCollection');
var MoveMessageCollection = require('../collection/MoveMessageCollection');
var PlayerTableView = require('../view/game/PlayerTableView');
var GameInfoView = require('../view/game/GameInfoView');
var PlayersMovesView = require('../view/map/PlayersMovesView');
var GridView = require('../view/map/GridView');
var StatusView = require('../view/StatusView');
var MoveMessagesView = require('../view/game/MoveMessagesView');
var QuickSettingsView = require('../view/map/QuickSettingsView');

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
        this.game = new Game({
            name: "Lade dade... Du?"
        });
        this.map = new Map({
            mapcode: "X"
        });
        this.players = new PlayerCollection();
        this.moves = new MoveCollection;
        this.moveMessages = new MoveMessageCollection();
        this.playersMoves = {};
        //this.map.setMapcode("XXXXXXXXX\nXNXNXNXNX\nXXXXXXXXX");

        /*
         SUBVIEWS
         */
        this.gameDranQueueView = new GameDranQueueView({
            collection: this.app.UserDranGames
        });

        this.gameTitleView = new Marionette.ItemView({
            model: this.game,
            tagName: "h1",
            id: "gameTitle",
            template: _.template("<%= name %>"),
            modelEvents: {
                "change:name": "render"
            }
        });

        this.mapRenderView = new MapRenderView({
            model: this.map,
            settings: this.viewSettings
        });

        this.playersMovesView = new PlayersMovesView({
            model: this.game,
            user: this.app.User,
            map: this.map,
            collection: this.players,
            playersMoves: this.playersMoves,
            settings: this.viewSettings
        });

        this.gridView = new GridView({
            model: this.game,
            players: this.players,
            user: this.app.User,
            map: this.map,
            settings: this.viewSettings
        });
        this.listenTo(this.gridView, "contextmenu", this.showQuickSettings)
        this.listenTo(this.gridView, "default", this.hideQuickSettings)

        this.playerTableView = new PlayerTableView({
            collection: this.players
        });

        this.gameInfoView = new GameInfoView({
            model: this.game,
            map: this.map
        });

        this.statusView = new StatusView({
            model: this.game,
            user: this.app.User
        });

        this.moveMessagesView = new MoveMessagesView({
            collection: this.moveMessages,
            user: this.app.User,
            util: this.app.util
        });

        this.logLinkView = new Marionette.ItemView({
            model: this.game,
            template: _.template('<a href="logs/<%= id %>.log">Link zur Logdatei</a>'),
            modelEvents: {
                "change:name": "render"
            }
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

    showQuickSettings: function(e) {
        console.log("Contextmenu in GameApp");
        var settingsView = new QuickSettingsView({
            text: "Hallo",
            className: "map-quickSettings"
        });

        settingsView = new PlayerTableView({
            collection: this.players,
            minimize: true
        });

        this.layout.quickSettingsView.show(settingsView);
        this.layout.quickSettingsView.$el.css({
            left: e.offsetX + "px",
            top: e.offsetY + "px"
        });
    },

    hideQuickSettings: function() {
        this.layout.quickSettingsView.reset();
        return true;
    },

    displayGame: function(cachedGame) {
        var me = this;
        console.info("NOW APPLY DATA TO VIEW");
        //console.log("cached game", cachedGame);

        //map attributes
        this.map.set(cachedGame.map.attributes);

        //console.log("cached game players", cachedGame.players);
        var uidsBefore = Object.keys(this.playersMoves);

        //reset and clean out obsolete playersMoves
        for (var pid in this.playersMoves) {
            if (!cachedGame.players.get(pid)) {
                this.playersMoves[pid].reset();
                delete this.playersMoves[pid];
            }
        }

        //add new playersMoves
        cachedGame.players.each(function(p, i) {
            var uid = p.get("id");
            if (!(uid in me.playersMoves)) {
                me.playersMoves[uid] = new MoveCollection();
            }
            var mc = me.playersMoves[uid];
            mc.set(cachedGame.playersMoves[uid].toJSON());
        });

        //console.log("Now setting players!");
        this.players.set(cachedGame.players.toJSON());
        //console.log("DONE setting players!");

        //this.moves =
        this.moveMessages.reset(cachedGame.moveMessages.toJSON());

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
            if (!cachedGame.get("loading")) {
                cachedGame.load();
            }
            cachedGame.listenTo(cachedGame, "change completed", function(g) {
                //set from game once loaded
                me.displayGame(g);
            });
        }

        this.map.setMapcode();
        //Now display the game in full detail!
    }
})
;
