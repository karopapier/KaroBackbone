var Marionette = require('backbone.marionette');
module.exports = Marionette.LayoutView.extend({
    template: window["JST"]["game/gameLayout"],
    regions: {
        gameQueue: "#gameQueue",
        gameInfo: "#gameInfo",
        gameTitleContainer: "#gameTitleContainer",
        gameStatus: "#gameStatus",
        mapView: ".mapView",
        playersMovesView: ".playersMovesView",
        gridView: ".gridView",
        quickSettingsView: ".quickSettingsView",
        playerTableView: "#playerTableView",
        statusView: "#statusView",
        moveMessagesView: "#moveMessagesView",
        logLinkView: "#logLinkView"
    }
});