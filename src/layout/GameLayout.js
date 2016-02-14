var Marionette = require('backbone.marionette');
module.exports = Marionette.LayoutView.extend({
    template: window["JST"]["game/gameLayout"],
    regions: {
        gameQueue: "#gameQueue",
        gameInfo: "#gameInfo",
        gameTitleContainer: "#gameTitleContainer",
        gameStatus: "#gameStatus",
        mapViewContainer: "#mapViewContainer",
        playerTableView: "#playerTableView"
    }
});