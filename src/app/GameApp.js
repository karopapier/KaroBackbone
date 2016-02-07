var Marionette = require('backbone.marionette');
var GameLayout = require('../layout/GameLayout');
var GameAppView = require('../view/game/GameAppView');
var GameDranQueueView =require('../view/game/DranQueueView');
module.exports = Marionette.Application.extend({
    className: "gameApp",
    initialize: function(options) {
        var me = this;
        this.app = options.app; //Karopapier
        this.settings = options.settings;

        this.layout = new GameLayout({});
        this.view = new GameAppView({
            model: this
        });

        this.gameDranQueueView = new GameDranQueueView({
            collection: this.app.UserDranGames
        });

        //make sure that (if available) the first two games in queue get/are always fully loaded with details
        this.listenTo(this.app.UserDranGames, "update", function() {
            console.log("Q update");
            var q = me.app.UserDranGames;
            q.first(2).forEach(function(g) {
                if (!g.get("completed")) g.load();
            });
            //var g = me.app.UserDranGames.at(0);
        });

        this.app.vent.on('GAME:MOVE', function(data) {
            //console.info(data);
        });
    }
});
