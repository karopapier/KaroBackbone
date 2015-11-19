var APPS = {};
var AppRouter = Backbone.Router.extend({
    routes: {
        "chat.html": "showChat",
        "dran.html": "showDran",
        "game.html?GID=:gameId": "showGame",
        "newshowmap.php?GID=:gameId": "showGame",
        "game.html": "defaultRoute",
        ":path": "showStatic"
    },
    doDummy: function (info) {
        var a;
        if (info in APPS) {
            a = APPS[info];
        } else {
            a = new DummyApp({
                info: info
            });
            a.start();
            APPS[info] =a;
        }
        Karopapier.layout.content.show(a.view, {preventDestroy:true});
    },
    showStatic: function (path) {
        this.doDummy(path);
        return;

        Karopapier.layout.content.show(new StaticView({
            path: path
        }));
    },
    showChat: function () {
        console.log("Show Chat");
        this.doDummy("Chat");
        return;
        if (!Karopapier.chatApp) {
            Karopapier.chatApp = new ChatApp();
            Karopapier.chatApp.layout.render();
            setTimeout(Karopapier.chatApp.start, 1000);
        }
        Karopapier.layout.content.show(Karopapier.chatApp.layout, {preventDestroy: true});
    },
    showDran: function () {
        console.log("Show Dran");
        this.doDummy("Dran");
        return;
        if (!Karopapier.dranApp) {
            Karopapier.dranApp = new DranApp();
            //Karopapier.dranApp.start();
            Karopapier.dranApp.layout.render();
        }
        Karopapier.layout.content.show(Karopapier.dranApp.layout, {preventDestroy: true});
    },
    showGame: function (gameId) {
        this.doDummy("Game " + gameId);
        return;
        if (gameId) {
            game.load(gameId);
        }
    },
    defaultRoute: function () {
        this.doDummy("Game with no ID");
        return;
        this.navigate("game.html", {trigger: true});
        //this.navigate("game.html?GID=81161", {trigger: true});
        //this.navigate("game.html?GID=57655", {trigger: true});
    }
});



