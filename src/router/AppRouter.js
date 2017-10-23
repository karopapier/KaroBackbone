var Backbone = require('backbone');
var ChatApp = require('../app/ChatApp');
var DranApp = require('../app/DranApp');
var GameApp = require('../app/GameApp');
var EditorApp = require('../app/EditorApp');
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
        "game.html": "showGame",
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
        this.app.editorApp = new EditorApp({
            app: this.app
        });
        this.app.layout.content.show(this.app.editorApp.layout);
    },
    showDran: function() {
        this.app.dranApp = new DranApp();
        this.app.layout.content.show(this.app.dranApp.view);
    },
    showGame: function(gameId) {
        this.app.gameApp = new GameApp({
            app: this.app,
            settings: this.app.Settings
        });
        this.app.layout.content.show(this.app.gameApp.view);
    },
    defaultRoute: function() {
        this.navigate("index.html", {trigger: true});
    }
});

