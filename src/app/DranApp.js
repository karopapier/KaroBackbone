var Marionette = require('backbone.marionette');
var ChatLayout = require('../layout/ChatLayout');
var DranLayout = require('../layout/DranLayout');
var DranAppView = require('../view/DranAppView');
var GameCollectionView = require('../view/game/GameCollectionView');
var GameListItemView = require('../view/game/GameListItemView');
module.exports = Marionette.Application.extend({
    className: "dranApp",
    initialize: function() {
        this.layout = new ChatLayout({});
        this.layout = new DranLayout({});
        this.view = new DranAppView({
            model: this
        });
        this.gamesView = new GameCollectionView({
            childView: GameListItemView,
            collection: Karopapier.UserDranGames
        });
    }
});
