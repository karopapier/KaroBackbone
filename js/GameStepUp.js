var game = new Game();
//game.load(GameId);

var mmv = new MoveMessageView({
    el: '#moveMessages',
    collection: game.moveMessages
});

var giv = new GameInfoView({
    model: game,
    el: "#gameInfo"
});

var gtv = new GameTitleView({
    el: "#gameTitle",
    model: game
});

var svgView = new MapSvgView({
    el: "#mapSvgView",
    model: game.map,
    size: 11,
    border: 1
});

var GameRouter = Backbone.Router.extend({
    routes: {
        "game.html?GID=:gameId": "showGame",
        "newshowmap.php?GID=:gameId": "showGame"
    },
    showGame: function(gameId) {
        if (gameId) {
            game.load(gameId);
        }
    }
})

var mpl = new MapPlayerLayer({
    el: '#fgImg',
    model: game
});
mpl.render();

gr = new GameRouter();

Backbone.history.start({
    pushState: true
});

console.log("Da");
