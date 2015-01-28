Karopapier.User = new User({});
//make this user refer to "check" for loging in
Karopapier.User.url = function () {
    return "http://www.karopapier.de/api/user/check.json?callback=?";
};
Karopapier.User.fetch();

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
        "newshowmap.php?GID=:gameId": "showGame",
        "game.html": "defaultRoute"
    },
    showGame: function(gameId) {
        if (gameId) {
            game.load(gameId);
        }
    },
    defaultRoute: function() {
        this.navigate("game.html?GID=81111", {trigger:true});
    }
});

var pt = new PlayerTable({
    collection: game.players,
    el: "#playerTable"
});

var mpm = new MapPlayerMoves({
    model: game,
    collection: game.players,
    el: '#mapPlayerMoves'
});

/*
var mpl = new MapPlayerLayer({
    el: '#fgImg',
    model: game
});
mpl.render();
*/

var possView = new PossiblesView({
    el: "#mapImage",
    game: game,
    mapView: svgView
});

Karopapier.listenTo(possView,"game:player:move", function(playerId, mo) {
    var player = game.players.get(playerId);
    var move = new Move(mo.toMove());
    move.set("t", Date());
    player.set("lastmove", move);
    player.get("moves").add(move);
    console.warn(player);
    mpm.render();
    possView.render();

});

gr = new GameRouter();

Backbone.history.start({
    pushState: true
});
console.info("Stepup done");
