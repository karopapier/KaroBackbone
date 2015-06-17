var GameAppRouter = Backbone.Router.extend({
    routes: {
        "game.html?GID=:gameId": "showGame",
        "newshowmap.php?GID=:gameId": "showGame",
        "game.html": "defaultRoute"
    },
    showGame: function (gameId) {
        if (gameId) {
            game.load(gameId);
        }
    },
    defaultRoute: function () {
        this.navigate("game.html", {trigger: true});
        //this.navigate("game.html?GID=81161", {trigger: true});
        //this.navigate("game.html?GID=57655", {trigger: true});
    }
});



