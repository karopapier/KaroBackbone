var Backbone = require('backbone');
var ChatApp = require('../app/ChatApp');
var DranApp = require('../app/DranApp');
module.exports = Backbone.Router.extend({
    initialize: function(options) {
        options = options || {};
        if (!options.app) {
            console.error("No app for AppRouter");
            return false;
        }
        this.app = options.app;
        this.app.APPS = {};
    },
    routes: {
        "": "showChat",
        "index.html": "showChat",
        "chat.html": "showChat",
        "dran.html": "showDran",
        "editor.html": "showEditor",
        "game.html?GID=:gameId": "showGame",
        "newshowmap.php?GID=:gameId": "showGame",
        "game.html": "defaultRoute",
        ":path": "showStatic"
    },
    doDummy: function(info) {
        var a;
        if (info in this.app.APPS) {
            a = this.app.APPS[info];
        } else {
            a = new DummyApp({
                info: info
            });
            a.start();
            this.app.APPS[info] = a;
        }
        this.app.layout.content.show(a.view, {preventDestroy: true});
    },
    showStatic: function(path) {
        this.doDummy(path);
        return;

        this.app.layout.content.show(new StaticView({
            path: path
        }));
    },
    showChat: function() {
        //if (!this.app.chatApp) {
        //this.app.chatContainer = new Backbone.View();
        this.app.chatApp = new ChatApp({
            app: this.app,
            settings: this.app.Settings
        });
        this.app.layout.content.show(this.app.chatApp.view);
    },
    showEditor: function() {
        this.app.editorApp = new EditorApp();
        this.app.layout.content.show(this.app.editorApp.layout);
    },
    showDran: function() {
        this.app.dranApp = new DranApp();
        this.app.layout.content.show(this.app.dranApp.view);
    },
    showGame: function(gameId) {
        this.doDummy("Game " + gameId);
        return;
        if (gameId) {
            game.load(gameId);
        }
    },
    defaultRoute: function() {
        this.doDummy("Game with no ID");
        return;
        this.navigate("game.html", {trigger: true});
        //this.navigate("game.html?GID=81161", {trigger: true});
        //this.navigate("game.html?GID=57655", {trigger: true});
    }
});



