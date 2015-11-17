var AppRouter = Backbone.Router.extend({
    routes: {
        "chat.html": "showChat",
        "dran.html": "showDran",
        "game.html?GID=:gameId": "showGame",
        "newshowmap.php?GID=:gameId": "showGame",
        "game.html": "defaultRoute",
        ":path": "showStatic"
    },
    showStatic: function(path) {
        Karopapier.content.show(new StaticView({
            path: path
        }));
    },
    showChat: function () {
        console.log("Show Chat");
        if (!Karopapier.chatApp) {
            Karopapier.chatApp = new ChatApp();
        }
        Karopapier.content.show(Karopapier.chatApp.render());
    },
    showDran: function () {
        console.log("Show Dran");
        if (!Karopapier.dranApp) {
            Karopapier.dranApp = new DranApp();
        }
        Karopapier.content.show(Karopapier.dranApp);
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



