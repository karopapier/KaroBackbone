var AppRouter = Backbone.Router.extend({
    routes: {
        "index.html": "showChat",
        "chat.html": "showChat",
        "game.html?GID=:gameId": "showGame",
        "newshowmap.php?GID=:gameId": "showGame",
        "game.html": "defaultRoute"
    },
    showChat: function () {
        console.log("Show Chat");
        if (!Karopapier.chatApp) {
            Karopapier.chatApp = new ChatApp();
        }
        Karopapier.content.show(Karopapier.chatApp);
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



