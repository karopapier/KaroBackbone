var AppRouter = Backbone.Router.extend({
    routes: {
        "chat.html": "showChat",
        "dran.html": "showDran",
        "game.html?GID=:gameId": "showGame",
        "newshowmap.php?GID=:gameId": "showGame",
        "game.html": "defaultRoute",
        ":path": "showStatic"
    },
    showStatic: function (path) {
        Karopapier.layout.content.show(new StaticView({
            path: path
        }));
    },
    showChat: function () {
        console.log("Show Chat");
        if (!Karopapier.chatApp) {
            Karopapier.chatApp = new ChatApp();
            //Karopapier.chatApp.start();
            Karopapier.chatApp.layout.render();
        }
        Karopapier.layout.content.show(Karopapier.chatApp.layout, {preventDestroy: true});
    },
    showDran: function () {
        console.log("Show Dran");
        if (!Karopapier.dranApp) {
            Karopapier.dranApp = new DranApp();
            //Karopapier.dranApp.start();
            Karopapier.dranApp.layout.render();
        }
        Karopapier.layout.content.show(Karopapier.dranApp.layout, {preventDestroy: true});
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



