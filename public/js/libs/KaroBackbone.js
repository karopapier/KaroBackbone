/*! KaroBackbone 2017-03-05 */

var ChatApp = Backbone.Marionette.Application.extend({
    initialize: function() {
        _.bindAll(this, "updateView", "start", "scrollCheck"), this.layout = new ChatLayout({}), 
        this.view = new ChatAppView({
            model: this
        }), this.already = !0, this.configuration = new Backbone.Model({
            limit: Karopapier.Settings.get("chat_limit"),
            lastLineId: 0,
            atEnd: !0,
            start: 0,
            history: !1,
            funny: Karopapier.Settings.get("chat_funny"),
            showBotrix: Karopapier.Settings.get("chat_showBotrix"),
            oldLink: Karopapier.Settings.get("chat_oldLink")
        }), KaroUtil.set("funny", this.configuration.get("funny")), KaroUtil.set("oldLink", this.configuration.get("oldLink")), 
        this.chatMessageCache = new ChatMessageCache({}), this.chatMessageCache.cache(0, 20), 
        this.chatMessageCollection = new ChatMessageCollection(), this.chatMessagesView = new ChatMessagesView({
            model: this.configuration,
            collection: this.chatMessageCollection
        }), this.chatInfoView = new ChatInfoView({
            model: Karopapier.User
        }), this.chatControlView = new ChatControlView({
            model: this.configuration
        }), this.chatEnterView = new ChatEnterView({}), this.listenTo(this.configuration, "change:limit", function(a, b) {
            if (this.configuration.get("atEnd")) {
                var c = this.configuration.get("lastLineId") - this.configuration.get("limit");
                this.configuration.set("start", c);
            }
            Karopapier.Settings.set("chat_limit", b);
        }), this.listenTo(this.configuration, "change:start", function(a, b) {
            console.log("Start changed, was ", a.previous("start"), "now", b), this.chatMessageCache.cache(b);
        }), this.listenTo(this.configuration, "change:showBotrix", function(a, b) {
            Karopapier.Settings.set("chat_showBotrix", b);
        }), this.listenTo(this.configuration, "change:funny", function(a, b) {
            Karopapier.Settings.set("chat_funny", b);
        }), this.listenTo(this.configuration, "change:oldLink", function(a, b) {
            Karopapier.Settings.set("chat_oldLink", b);
        }), this.listenTo(Karopapier.Settings, "change:chat_limit", function(a, b) {
            this.configuration.set("limit", b);
        }), this.listenTo(Karopapier.Settings, "change:chat_funny", function(a, b) {
            this.configuration.set("funny", b), KaroUtil.set("funny", b), this.chatMessageCache.each(function(a) {
                a.set("funny", b);
            });
        }), this.listenTo(Karopapier.Settings, "change:chat_oldLink", function(a, b) {
            this.configuration.set("oldLink", b), KaroUtil.set("oldLink", b), this.chatMessageCache.each(function(a) {
                a.set("oldLink", b);
            });
        }), this.listenTo(Karopapier.Settings, "change:chat_showBotrix", function(a, b) {
            this.configuration.set("showBotrix", b), this.chatMessageCache.each(function(a) {
                a.set("showBotrix", b);
            });
        }), this.listenTo(this.chatMessageCache, "CHAT:CACHE:UPDATED", function() {
            var a = this.configuration.get("start"), b = parseInt(a) + parseInt(this.configuration.get("limit")), c = this.chatMessageCache.filter(function(c) {
                var d = c.get("lineId");
                return d >= a && b >= d;
            });
            this.chatMessageCollection.set(c);
        }), this.listenTo(this.chatMessagesView, "CHAT:MESSAGES:TOP", function() {
            if (!this.configuration.get("history")) return console.info("Not in history mode"), 
            !1;
            var a = 100, b = this.configuration.get("start"), c = this.configuration.get("limit");
            return 1 >= b ? !0 : (b -= a, this.configuration.set({
                start: b,
                limit: c + a
            }), void this.configuration.set("start", b));
        });
        var a = this;
        this.listenTo(this.chatMessageCache.info, "change:lastLineId", function(a) {
            console.warn("Update conf ll to ", a.get("lastLineId")), this.configuration.set("lastLineId", a.get("lastLineId"));
        }), this.listenTo(this.configuration, "change:lastLineId", function() {
            var a = this.configuration.get("lastLineId");
            if (this.configuration.get("atEnd")) {
                {
                    var b = this.configuration.get("limit"), c = a - b;
                    this.configuration.get("start");
                }
                this.configuration.set("start", c, {});
            }
        }), this.refreshMessages = setInterval(function() {
            this.chatInfoView.updateTopBlocker(), $.getJSON("//www.karopapier.de/api/chat/list.json?limit=2&callback=?");
        }.bind(this), 59e3), Karopapier.vent.on("CHAT:MESSAGE", function() {
            a.chatMessageCache.cache(a.configuration.get("lastLineId"));
        });
    },
    updateView: function() {
        if (this.configuration.get("atEnd")) {
            console.log("We are at the end");
            var a = this.chatMessageCache.length, b = this.configuration.get("limit");
            this.chatMessageCollection.set(this.chatMessageCache.slice(a - b));
        }
    },
    scrollCheck: function() {
        var a = this.chatMessagesView, b = this;
        this.already && (a.scrollCheck(), this.already = !1, setTimeout(function() {
            b.already = !0;
        }, 50));
    },
    start: function() {}
}), DranApp = Backbone.Marionette.Application.extend({
    className: "dranApp",
    initialize: function() {
        this.layout = new ChatLayout({}), this.layout = new DranLayout({}), this.view = new DranAppView({
            model: this
        }), this.gamesView = new GameCollectionView({
            childView: GameListItemView,
            collection: Karopapier.UserDranGames
        });
    }
}), DranAppView = Marionette.ItemView.extend({
    className: "dranAppView",
    render: function() {
        this.model.layout.render(), this.model.layout.dranGames.show(this.model.gamesView), 
        this.$el.html(this.model.layout.$el);
    }
}), DummyApp = Backbone.Marionette.Application.extend({
    initialize: function(a) {
        this.info = a.info || "-", console.log("Init Dummy App", a.info), this.layout = new DummyAppLayout(), 
        this.view = new DummyAppView({
            model: this
        });
    },
    start: function() {
        console.log("Start Dummy App", this.info), this.v1 = new LogView({
            info: this.info + " 1"
        }), this.v2 = new LogView({
            info: this.info + " 2"
        });
    }
}), DummyAppView = Marionette.ItemView.extend({
    "class": "dummApp",
    render: function() {
        console.log(this.model, " is an app"), this.model.layout.render(), this.model.layout.slot1.show(this.model.v1), 
        this.model.layout.slot2.show(this.model.v2), this.$el.html(this.model.layout.$el);
    }
}), DummyAppLayout = Marionette.LayoutView.extend({
    template: function() {
        return '<div id="dummy1">1</div><div id="dummy2">2</div>';
    },
    regions: {
        slot1: "#dummy1",
        slot2: "#dummy2"
    }
}), EditorApp = Backbone.Marionette.Application.extend({
    initialize: function() {
        this.layout = new EditorLayout({
            editorApp: this
        }), this.viewsettings = new MapViewSettings(), this.editorsettings = new EditorSettings(), 
        this.map = new Map(), this.map.setMapcode("XXXXXXXXXXXXXXXXXXXXXXXXXXXX\nXGGGGGGGGGGGGGGGGGGGGGGGGGXX\nXGVGGVGGGGGGVGGGVGVVVGVGGGTX\nXGVGVGGGGGGGVVGVVGVGGGVGGGTX\nXGVVGGGVVVGGVGVGVGVVGGVGGGTX\nXGVGVGGVGVGGVGGGVGVGGGVGGGTX\nXGVGGVGVVVVGVGGGVGVVVGVVVGTX\nXGGGGGGGGGGGGGGGGGGGGGGGGGTX\nXXTTTTTTTTTTTTTTTTTTTTTTTTTX\nXXXXXXXXXXXXXXXXXXXXXXXXXXXX"), 
        this.listenTo(Karopapier.vent, "HOTKEY", _.bind(this.hotkey, this)), this.karoMaps = new KaroMapCollection(), 
        this.imageTranslator = new EditorImageTranslator({
            map: this.map,
            editorsettings: this.editorsettings
        }), this.editorUndo = new EditorUndo({
            map: this.map,
            editorsettings: this.editorsettings
        });
    },
    hotkey: function(a) {
        var b = a.which, c = String.fromCharCode(b).toUpperCase();
        this.map.isValidField(c) && (this.editorsettings.setButtonField(1, c), a.preventDefault(), 
        a.stopPropagation()), a.ctrlKey && 26 == b && (this.editorUndo.undo(), a.preventDefault(), 
        a.stopPropagation());
    }
}), KaropapierApp = Marionette.Application.extend({
    initialize: function() {
        console.log("APP INIT!!!!!!!!!!!");
        this.User = new User({}), this.User.url = function() {
            return "//www.karopapier.de/api/user/check.json?callback=?";
        }, this.User.fetch(), this.UserDranGames = new DranGameCollection(), this.KEvIn = new KEvIn({
            user: this.User
        }), this.Settings = new LocalSyncModel({
            id: 1,
            storageId: "settings",
            chat_funny: !0,
            chat_limit: 20,
            chat_oldLink: !1,
            notification_chat: !0,
            notification_dran: !0
        }), this.notifier = new KaroNotifier({
            eventEmitter: this.vent,
            user: this.User,
            settings: this.Settings
        }), this.notifierView = new KaroNotifierView({
            model: this.notifier
        }), this.notificationControl = new NotificationControl(), this.browserNotifier = new BrowserNotifier({
            eventEmitter: this.vent,
            user: this.User,
            settings: this.Settings,
            control: this.notificationControl
        }), KaroUtil.lazyCss("//www.karopapier.de/css/slidercheckbox/slidercheckbox.css"), 
        this.listenTo(this, "start", this.bootstrap.bind(this));
    },
    bootstrap: function() {
        function a() {
            return 0 == c.User.get("id") ? !1 : void c.UserDranGames.fetch();
        }
        function b() {
            if (0 == c.User.get("id")) return !1;
            var a = c.User.get("theme"), b = "//www.karopapier.de/themes/" + a + "/css/theme.css";
            KaroUtil.lazyCss(b);
        }
        var c = this;
        console.log("Jetzt bootstrap app"), this.notifierView.render(), a(), this.listenTo(this.User, "change:id", a), 
        this.vent.on("USER:DRAN", function(a) {
            c.UserDranGames.addId(a.gid, a.name);
        }), this.vent.on("USER:MOVED", function(a) {
            c.UserDranGames.remove(a.gid);
        }), b(), this.listenTo(this.User, "change:id", b), this.favi = new FaviconView({
            model: this.User,
            el: "#favicon"
        }), this.titler = new TitleView({
            model: this.User,
            title: "Karopapier - Autofahren wie in der Vorlesung"
        }), this.titler.render(), this.layout = new KaropapierLayout({
            el: "body"
        }), this.infoBar = new UserInfoBar({
            model: this.User
        }), this.layout.header.show(Karopapier.infoBar), this.layout.navi.show(new NaviView()), 
        this.router = new AppRouter(), Backbone.history.start({
            pushState: !0
        }), this.vent.on("GAME:MOVE", function(a) {
            if (a.related) return !1;
            var b = new User({
                id: a.movedId,
                login: a.movedLogin
            });
            b.decreaseDran();
            var c = new User({
                id: a.nextId,
                login: a.nextLogin
            });
            c.increaseDran();
        }), $(document).on("keypress", function(a) {
            var b = a.target.tagName.toUpperCase();
            "BODY" === b && 0 !== a.which && c.vent.trigger("HOTKEY", a);
        });
    }
}), ChatLayout = Backbone.Marionette.LayoutView.extend({
    className: "chatLayout",
    template: window.JST["chat/chatLayout"],
    regions: {
        chatMessages: "#chatMessages",
        chatInfo: "#chatInfo",
        chatControl: "#chatControl",
        chatEnter: "#chatEnter",
        webNotifier: "#webNotifier"
    }
}), DranLayout = Backbone.Marionette.LayoutView.extend({
    template: window.JST["dran/dranLayout"],
    regions: {
        dranInfo: "#dranInfo",
        dranGames: "#dranGames"
    }
}), EditorImageTranslatorLayout = Marionette.LayoutView.extend({
    className: "editorImageTranslator",
    template: window.JST["editor/imagetranslatorlayout"],
    initialize: function(a) {
        return a = a || {}, a.imageTranslator ? (this.imageTranslator = a.imageTranslator, 
        void _.bindAll(this, "onShow")) : void console.error("No imageTranslator passed to EditorImageTranslatorLayout");
    },
    regions: {
        preview: ".editor-imagetranslator-preview",
        info: ".editor-imagetranslator-info",
        settings: ".editor-imagetranslator-settings"
    },
    onShow: function() {
        this.preview.show(new EditorImageTranslatorPreview({
            imageTranslator: this.imageTranslator
        })), this.info.show(new EditorImageTranslatorInfoView({
            model: this.imageTranslator.settings
        })), this.settings.show(new EditorImageTranslatorSettingsView({
            imageTranslator: this.imageTranslator
        }));
    }
}), EditorLayout = Marionette.LayoutView.extend({
    initialize: function(a) {
        return a = a || {}, a.editorApp ? (this.editorApp = a.editorApp, void _.bindAll(this, "onShow")) : void console.error("No editorApp passed to EditorLayout");
    },
    regions: {
        tools: ".editor-tools-container",
        mapview: ".editor-mapview-container",
        codeview: ".editor-codeview-container",
        imageTranslator: ".editor-imagetranslator-container"
    },
    className: "editorAppView",
    template: window.JST["editor/layout"],
    onShow: function() {
        this.tools.show(new EditorToolsLayout({
            editorApp: this.editorApp
        })), this.mapview.show(new EditorMapView({
            viewsettings: this.editorApp.viewsettings,
            editorsettings: this.editorApp.editorsettings,
            model: this.editorApp.map
        })), this.codeview.show(new EditorCodeView({
            model: this.editorApp.map
        })), this.imageTranslator.show(new EditorImageTranslatorLayout({
            imageTranslator: this.editorApp.imageTranslator,
            map: this.editorApp.map
        }));
    }
}), EditorToolsLayout = Marionette.LayoutView.extend({
    template: window.JST["editor/tools"],
    initialize: function(a) {
        return a = a || {}, a.editorApp ? (this.editorApp = a.editorApp, this.viewsettings = this.editorApp.viewsettings, 
        void (this.editorsettings = this.editorApp.editorsettings)) : void console.error("No editorApp passed to EditorToolsView");
    },
    regions: {
        fields: ".editor-tools-fields",
        buttons: ".editor-tools-mousebuttons",
        toolbox: ".editor-tools-toolbox",
        settings: ".editor-tools-viewsettings",
        mapload: ".editor-tools-mapload"
    },
    onShow: function() {
        this.fields.show(new EditorToolsFieldsView({
            editorsettings: this.editorsettings
        })), this.toolbox.show(new EditorToolsToolboxView({
            editorsettings: this.editorApp.editorsettings,
            editorUndo: this.editorApp.editorUndo
        })), this.buttons.show(new EditorToolsButtonsView({
            editorsettings: this.editorsettings
        })), this.settings.show(new EditorToolsSettingsView({
            viewsettings: this.viewsettings
        })), this.mapload.show(new EditorToolsMaploadView({
            editorApp: this.editorApp
        }));
    }
}), KaropapierLayout = Backbone.Marionette.LayoutView.extend({
    regions: {
        header: "#header",
        navi: "#navi",
        content: "#content",
        footer: "#footer"
    }
}), BrowserNotification = Backbone.Model.extend({
    defaults: {
        level: "info",
        text: "Notification",
        screen: !0,
        "native": !0,
        tag: "",
        group: "general",
        timeout: 8e3,
        icon: "/favicon.ico",
        onClick: function() {}
    },
    initialize: function() {
        try {
            this.myNotify = new Notification(this.get("title"), {
                body: this.get("body"),
                tag: this.get("tag"),
                icon: this.get("icon")
            });
        } catch (a) {
            return void console.log("Could not add notification");
        }
        var b = this.get("timeout");
        b && !isNaN(b) && (setTimeout(this.close.bind(this), b), console.log("Set to close after", b)), 
        this.myNotify.addEventListener("click", this.get("onClick"), !1);
    },
    close: function() {
        this.myNotify.close();
    }
}), BrowserNotifier = Backbone.Model.extend({
    defaults: {},
    initialize: function(a) {
        this.eventEmitter = a.eventEmitter, this.user = a.user, this.settings = a.settings, 
        this.control = a.control, this.eventEmitter.on("CHAT:MESSAGE", function(a) {
            console.warn(a.chatmsg);
            new BrowserNotification({
                title: a.chatmsg.user + " spricht",
                body: a.chatmsg.text,
                level: "info",
                group: "global",
                tag: "chat",
                icon: "/favicon.ico",
                timeout: 1e4,
                onClick: function() {
                    window.open("/index.html");
                }
            });
        }), this.listenTo(this.user, "change:dran", this.updateDran);
    },
    updateDran: function() {
        var a = this.user.get("dran"), b = "Du bist ein bisschen dran (" + a + ")";
        0 == a && (b = "Du bist gar nich dran!"), a > 10 && (b = "Du bist ganz schön dran! (" + a + ")"), 
        a > 20 && (b = "Du bist mal echt voll dran! (" + a + ")"), a > 30 && (b = "BOAH!! Du bist sooo dran! (" + a + ")"), 
        a > 40 && (b = "LOS! Du bist verdammt dran! (" + a + ")");
        var c = "";
        1 != a && (c = "en");
        {
            var d = "Du bist bei " + a + " Spiel" + c + " dran";
            new BrowserNotification({
                title: b,
                tag: "dran",
                body: d,
                icon: "/favicon.ico",
                timeout: a > 0 ? 0 : 2e3,
                onClick: function() {
                    window.open("/dran.html");
                }
            });
        }
    }
}), ChatMessage = Backbone.Model.extend({
    idAttribute: "lineId"
}), ChatUser = Backbone.Model.extend({}), Conway = Backbone.Model.extend({
    initialize: function(a) {
        return a = a || {}, a.map ? (this.map = a.map, this.changed = {}, this.livingNeighbours = {}, 
        this.currentMap = new Map(), this.currentNeighbours = {}, void _.bindAll(this, "step", "die", "rise", "adjustNeighbours", "countLivingNeighbours", "isAlive", "isDead", "setAllChanged", "calcField")) : (console.error("No map for Conway"), 
        !1);
    },
    isAlive: function(a) {
        return a === this.livingField();
    },
    isDead: function(a) {
        return a === this.deadField();
    },
    deadField: function() {
        return "X";
    },
    livingField: function() {
        return "O";
    },
    countLivingNeighbours: function() {
        for (var a = this.map.get("cols"), b = this.map.get("rows"), c = 0, d = b; d > c; c++) for (var e = 0, f = a; f > e; e++) {
            for (var g = 0, h = -1; 1 >= h; h++) for (var i = -1; 1 >= i; i++) (0 !== h || 0 !== i) && this.map.withinBounds({
                row: c + i,
                col: e + h
            }) && this.isAlive(this.map.getFieldAtRowCol(c + i, e + h)) && g++;
            this.livingNeighbours[c + "|" + e] = g;
        }
    },
    die: function(a, b) {
        this.map.setFieldAtRowCol(a, b, this.deadField()), this.adjustNeighbours(a, b, -1);
    },
    rise: function(a, b) {
        this.map.setFieldAtRowCol(a, b, this.livingField()), this.adjustNeighbours(a, b, 1);
    },
    adjustNeighbours: function(a, b, c) {
        for (var d = -1; 1 >= d; d++) for (var e = -1; 1 >= e; e++) {
            var f = a + e, g = b + d, h = f + "|" + g;
            this.map.withinBounds({
                row: f,
                col: g
            }) && ((0 !== d || 0 !== e) && (this.livingNeighbours[h] += c), this.changed[h] = {
                r: f,
                c: g
            });
        }
    },
    setAllChanged: function() {
        for (var a = this.map.get("cols"), b = this.map.get("rows"), c = 0, d = b; d > c; c++) for (var e = 0, f = a; f > e; e++) this.changed[c + "|" + e] = {
            r: c,
            c: e
        };
    },
    calcField: function(a, b) {
        var c = this.currentMap.getFieldAtRowCol(a, b);
        ("X" === c || "O" === c || "Y" === c || "Z" === c) && (livingNeighbours = this.currentNeighbours[a + "|" + b], 
        this.isDead(c) ? 3 == livingNeighbours && this.rise(a, b) : (livingNeighbours < 2 && this.die(a, b), 
        livingNeighbours > 3 && this.die(a, b)));
    },
    step: function() {
        this.map.get("cols"), this.map.get("rows");
        this.currentMap.setMapcode(this.map.get("mapcode")), this.currentNeighbours = JSON.parse(JSON.stringify(this.livingNeighbours));
        var a = this.changed;
        this.changed = {};
        for (var b in a) {
            var d = a[b];
            r = d.r, c = d.c, this.calcField(r, c);
        }
        return !0;
    }
}), CrashDetector = Backbone.Model.extend({
    initialize: function(a) {
        return _.bindAll(this, "willCrash"), a.hasOwnProperty("map") && "undefined" != typeof a.map ? (this.depth = 16, 
        this.knownCrashs = {}, this.goodVectors = {}, void (this.map = a.map)) : (console.error("No map provided to KRACHZ"), 
        !1);
    },
    willCrash: function(a, b) {
        var c = a.toString();
        if (c in this.knownCrashs) return !0;
        var d = this.goodVectors[c];
        if (void 0 !== typeof d && d >= b) return !1;
        if (1 == b) return this.goodVectors[c] = b, !1;
        for (var e = !0, f = a.getPossibles(), g = f.length, h = 0; g > h; h++) {
            var i = f[h];
            if (b == this.depth && count++, this.map.isPossible(i) && !this.willCrash(i, b - 1)) {
                e = !1;
                break;
            }
        }
        return e ? this.knownCrashs[c] = !0 : this.goodVectors[a] = b, e;
    }
}), Game = Backbone.Model.extend({
    defaults: {
        id: 0,
        completed: !1
    },
    initialize: function(a) {
        a = a || {}, _.bindAll(this, "parse", "load", "updatePossibles"), this.map = a.map ? a.map : new Map(), 
        this.set("moveMessages", new MoveMessageCollection()), this.set("players", new PlayerCollection()), 
        this.listenTo(this.get("players"), "reset", this.get("moveMessages").updateFromPlayers), 
        this.possibles = new MotionCollection(), this.listenTo(this, "change:completed", this.updatePossibles), 
        this.listenTo(this.get("players"), "movechange", function() {
            this.updatePossibles();
        });
    },
    url: function() {
        return "//www.karopapier.de/api/game/" + this.get("id") + "/details.json?callback=?";
    },
    parse: function(a) {
        if (0 !== this.get("id") && a.game) {
            if (a.game.id == this.id) return this.map.set({
                cpsActive: a.game.cps
            }, {
                silent: !0
            }), this.map.set(a.map), this.get("players").reset(a.players, {
                parse: !0
            }), a.game.completed = !0, a.game;
            console.warn("Dropped response for " + a.game.id);
        }
        return a;
    },
    load: function(a) {
        return a ? (this.set({
            id: a,
            completed: !1
        }), void this.fetch()) : !1;
    },
    updatePossibles: function() {
        if (!this.get("completed")) return !1;
        if (this.get("moved")) return !1;
        if (this.get("finished")) return this.possibles.reset([]), !0;
        var a = this.get("dranId");
        if (this.get("players").length < 1) return !1;
        var b = this.get("players").get(a);
        if (!b) return !1;
        var c, d = b.moves.length;
        if (0 === d && "ok" == b.get("status")) c = this.map.getStartPositions().map(function(a) {
            var b = new Vector({
                x: 0,
                y: 0
            }), c = new Motion({
                position: a,
                vector: b
            });
            return c.set("isStart", !0), c;
        }); else {
            var e = b.getLastMove(), f = e.getMotion();
            c = f.getPossibles(), c = this.map.verifiedMotions(c);
        }
        for (var g = this.get("players").getOccupiedPositions(this.get("id") >= 75e3), h = g.map(function(a) {
            return a.toString();
        }), i = [], j = 0; j < c.length; j++) {
            var k = c[j];
            h.indexOf(k.toKeyString()) < 0 && i.push(k);
        }
        this.possibles.reset(i);
    },
    setFrom: function(a) {
        this.set("completed", !1), a.set("completed", !1);
        var b = {};
        _.each(a.attributes, function(a, c) {
            "object" != typeof a && (b[c] = a);
        }), this.set(b), this.map.set(a.map.toJSON()), this.get("players").reset(a.get("players").toJSON(), {
            parse: !0
        }), this.updatePossibles(), this.set("completed", !0);
    }
}), KEvIn = Backbone.Model.extend({
    defaults: {},
    initialize: function(a) {
        if (a = a || {}, console.log("Run init on KEvIn"), _.bindAll(this, "ident", "hook", "start", "stop"), 
        !a.user) throw Error("KEvIn needs a user");
        this.user = a.user, this.listenTo(this.user, "change:id", this.ident), this.turted = new TURTED("//turted.karopapier.de/"), 
        this.ident(), this.hook();
    },
    ident: function() {
        var a = this.user;
        0 === a.get("id") ? this.stop() : (this.turted.ident({
            username: this.user.get("login")
        }), this.start());
    },
    hook: function() {
        this.turted.on("yourTurn", function() {}), this.turted.on("youMoved", function() {});
        var a = this;
        this.turted.on("otherMoved", function(b) {
            b.related = !0, Karopapier.vent.trigger("GAME:MOVE", b), a.user.get("id") == b.nextId && Karopapier.vent.trigger("USER:DRAN", b), 
            a.user.get("id") == b.movedId && Karopapier.vent.trigger("USER:MOVED", b);
        }), this.turted.on("anyOtherMoved", function(a) {
            a.related = !1, Karopapier.vent.trigger("GAME:MOVE", a);
        }), this.turted.on("newChatMessage", function(a) {
            Karopapier.vent.trigger("CHAT:MESSAGE", a);
        });
    },
    start: function() {
        this.turted.join("karochat"), this.turted.join("livelog");
    },
    stop: function() {}
}), KRACHZ = Backbone.Model.extend({
    initialize: function(a) {
        return _.bindAll(this, "willCrash"), a.hasOwnProperty("map") && "undefined" != typeof a.map ? void (this.cache = {}) : (console.error("No map provided to KRACHZ"), 
        !1);
    },
    willCrash: function(a, b) {
        var c = this.get("map");
        if (b || (b = 8), 0 === b) return !1;
        if (1 === b) return !c.isPossible(a);
        if ("(0|0)" == a.get("vector").toString()) return !1;
        var d = a.getStopPosition();
        if (!c.withinBounds({
            x: d.get("x"),
            y: d.get("y")
        })) return this.cache[a.toString()] = !0, !0;
        var e = a.getPossiblesByLength();
        if (e = c.verifiedMotions(e), 0 == e.length) return !0;
        if (1 == a.get("vector").getLength() && 8 == e.length) return !1;
        for (var f = 0, g = e.length, h = 0; g > h; h++) {
            var i = e[h], j = i.toString();
            if (b >= 1) {
                if (j in this.cache) return this.cache[j];
                var k = this.willCrash(i, b - 1);
                if (this.cache[j] = k, !k) return !1;
                f++;
            }
        }
        return f == e.length;
    }
}), KaroNotification = Backbone.Model.extend({
    defaults: {
        level: "info",
        text: "Notification",
        screen: !0,
        group: "general",
        timeout: 8e3,
        imageUrl: "",
        clickUrl: ""
    },
    initialize: function(a) {
        return "string" == typeof a ? this.set("text", a) : _.defaults(a, this.defaults), 
        this.set(a), this;
    }
}), KaroNotifier = Backbone.Model.extend({
    defaults: {},
    initialize: function(a) {
        _.bindAll(this, "add", "addGameMoveNotification", "addUserDranNotification");
        var b = this;
        this.notifications = new Backbone.Collection(), this.eventEmitter = a.eventEmitter, 
        this.user = a.user, this.settings = a.settings, this.eventEmitter.on("CHAT:MESSAGE", function(a) {
            console.warn(a.chatmsg);
            new BrowserNotification({
                title: a.chatmsg.user + " spricht",
                body: a.chatmsg.text,
                level: "info",
                group: "global",
                tag: "chat",
                icon: "/favicon.ico",
                timeout: 2e3,
                notifyClick: function() {
                    alert("Geklickt");
                }
            });
        }), this.eventEmitter.on("GAME:MOVE", function(a) {
            return a.related ? void (b.user.get("id") == a.nextId ? b.addUserDranNotification(a) : b.addGameMoveNotification(a)) : (1 == Karopapier.User.get("id") && console.warn(a.movedLogin, "zog bei", a.gid, a.name), 
            !1);
        });
    },
    add: function(a) {
        this.notifications.add(a);
        var b = a.get("timeout");
        if (0 !== b) {
            var c = this;
            setTimeout(function() {
                c.remove(a);
            }, b);
        }
    },
    remove: function(a) {
        this.notifications.remove(a);
    },
    addGameMoveNotification: function(a) {
        a.name.length > 30 && (a.name = a.name.substring(0, 27) + "...");
        var b = 'Bei <a href="/game.html?GID=<%= gid %>"><%- name %></a> hat <%= movedLogin %> gerade gezogen. Jetzt ist <%= nextLogin %> dran', c = _.template(b), d = new KaroNotification({
            text: c(a),
            level: "info",
            group: "global",
            imgUrl: "//www.karopapier.de/pre/" + a.gid + ".png"
        });
        this.add(d);
    },
    addUserDranNotification: function(a) {
        var b = 'Du bist dran! Bei <a href="/game.html?GID=<%= gid %>"><%- name %></a> hat <%= movedLogin %> gerade gezogen.', c = _.template(b), d = new KaroNotification({
            text: c(a),
            level: "ok",
            group: "dran",
            imgUrl: "//www.karopapier.de/pre/" + a.gid + ".png"
        });
        this.add(d);
    }
}), LocalSyncModel = Backbone.Model.extend({
    defaults: {
        storageId: "ID" + Math.round(1e4 * Math.random())
    },
    initialize: function() {
        _.bindAll(this, "directSave", "onStorageEvent"), $(window).bind("storage", this.onStorageEvent);
        var a = this.get("storageId"), b = store.get(a);
        this.set(b), this.initialized = !0;
    },
    set: function() {
        Backbone.Model.prototype.set.apply(this, arguments), this.initialized && this.directSave();
    },
    onStorageEvent: function(a) {
        var b = a.originalEvent.key, c = a.originalEvent.newValue;
        if (b === this.get("storageId")) {
            var d = JSON.parse(c);
            this.set(d);
        }
    },
    directSave: function() {
        store.set(this.get("storageId"), this.toJSON());
    }
}), Motion = Backbone.Model.extend({
    defaults: {
        position: {
            x: 0,
            y: 0
        },
        vector: {
            x: 0,
            y: 0
        }
    },
    initialize: function() {},
    setXY1toXY2: function(a, b, c, d) {
        var e = new Position({
            x: c,
            y: d
        }), f = new Vector({
            x: c - a,
            y: d - b
        });
        return this.set("position", e), this.set("vector", f), this;
    },
    setXYXvYv: function(a, b, c, d) {
        var e = new Position({
            x: a,
            y: b
        }), f = new Vector({
            x: c,
            y: d
        });
        return this.set("position", e), this.set("vector", f), this;
    },
    clone: function() {
        return new Motion({
            position: this.get("position").clone(),
            vector: this.get("vector").clone()
        });
    },
    toString: function() {
        return this.get("position").toString() + " " + this.get("vector").toString();
    },
    toKeyString: function() {
        return this.get("position").toString();
    },
    toMove: function() {
        return {
            x: this.get("position").get("x"),
            y: this.get("position").get("y"),
            xv: this.get("vector").get("x"),
            yv: this.get("vector").get("y")
        };
    },
    getStopPosition: function() {
        for (var a = this.getSourcePosition(), b = this.get("vector").clone(); b.getLength() > 0; ) a.move(b), 
        b.decelerate();
        return a;
    },
    getSourcePosition: function() {
        var a = new Position(this.get("position").toJSON());
        return a.set("x", a.get("x") - this.get("vector").get("x")), a.set("y", a.get("y") - this.get("vector").get("y")), 
        a;
    },
    getPossibles: function() {
        for (var a = [], b = 0, c = this.get("position").get("x"), d = this.get("position").get("y"), e = this.get("vector").get("x"), f = this.get("vector").get("y"), g = -1; 1 >= g; g++) for (var h = -1; 1 >= h; h++) {
            var i = e + h, j = f + g;
            if (0 !== i || 0 !== j) {
                var k = e + h, l = f + g;
                a[b] = new Motion().setXYXvYv(c + k, d + l, k, l), b++;
            }
        }
        return a;
    },
    getPossiblesByLength: function() {
        var a = this.getPossibles();
        return a = _.sortBy(a, function(a) {
            return a.get("vector").getLength();
        });
    },
    getPassedPositions: function() {
        return this.getSourcePosition().getPassedPositionsTo(this.get("position"));
    },
    move: function(a) {
        return this.get("position").move(a), this.set("vector", a), this;
    }
}), Move = Backbone.Model.extend({
    defaults: {
        x: 0,
        y: 0,
        xv: 0,
        yv: 0
    },
    getMotion: function() {
        var a = new Position({
            x: this.get("x"),
            y: this.get("y")
        }), b = new Vector({
            x: this.get("xv"),
            y: this.get("yv")
        });
        return new Motion({
            position: a,
            vector: b
        });
    }
}), NewGame = Backbone.Model.extend({
    defaults: {
        id: 0
    },
    initialize: function() {},
    url: function() {
        return "//www.karopapier.de/api/game/add.json";
    }
}), NotificationControl = Backbone.Model.extend({
    defaults: {
        supported: void 0,
        granted: !1,
        denied: !1,
        "final": !1,
        enabled: !1
    },
    initialize: function() {
        _.bindAll(this, "granted", "unsupported", "denied", "finaldenied", "check", "request"), 
        this.listenTo(this, "change", this.status), this.listenTo(this, "change:enabled", this.request), 
        this.check();
    },
    unsupported: function() {
        this.set({
            supported: !1,
            "final": !0,
            enabled: !1
        });
    },
    finaldenied: function() {
        this.set({
            granted: !1,
            denied: !0,
            "final": !0,
            enabled: !1
        });
    },
    granted: function() {
        this.set({
            granted: !0,
            denied: !1,
            "final": !0
        });
    },
    denied: function() {
        this.set({
            granted: !1,
            denied: !0,
            "final": !0,
            enabled: !1
        });
    },
    request: function() {
        if (this.get("enabled")) {
            var a = this;
            Notification.requestPermission(function(b) {
                return "denied" === b ? void a.denied() : "default" === b ? void a.set({
                    granted: !1,
                    denied: !1,
                    enabled: !1,
                    "final": !1
                }) : void a.granted();
            });
        }
    },
    status: function() {
        console.log("-------------------------------");
        for (var a in this.attributes) console.log(a, this.attributes[a]);
    },
    check: function() {
        "Notification" in window ? (this.set("supported", !0), "denied" === Notification.permission ? this.finaldenied() : this.request()) : this.unsupported();
    }
}), Player = Backbone.Model.extend({
    defaults: {
        id: 0
    },
    initialize: function() {
        _.bindAll(this, "parse", "getLastMove"), this.moves || (this.moves = new MoveCollection());
    },
    parse: function(a) {
        return this.moves || (this.moves = new MoveCollection()), this.moves.reset(a.moves), 
        delete a.moves, a;
    },
    getLastMove: function() {
        return this.moves.length > 0 ? this.moves.at(this.moves.length - 1) : !1;
    },
    toJSON: function() {
        var a = Backbone.Model.prototype.toJSON.call(this);
        return a.moves = this.moves.toJSON(), a;
    },
    getStatus: function() {
        var a = {
            kicked: "rausgeworfen",
            left: "ausgestiegen",
            invited: "eingeladen"
        }, b = this.get("status");
        return b in a ? a[b] : b;
    }
}), Position = Backbone.Model.extend({
    defaults: {
        x: 0,
        y: 0
    },
    initialize: function(a, b) {
        "object" == typeof a || ("number" == typeof a && "number" == typeof b ? (this.set("x", a), 
        this.set("y", b)) : console.error("Vector init messed up: ", a, b));
    },
    toString: function() {
        return "[" + this.get("x") + "|" + this.get("y") + "]";
    },
    move: function(a) {
        this.set("x", this.get("x") + a.get("x")), this.set("y", this.get("y") + a.get("y"));
    },
    getVectorTo: function(a) {
        var b = a.get("x") - this.get("x"), c = a.get("y") - this.get("y");
        return new Vector({
            x: b,
            y: c
        });
    },
    getPassedPositionsTo: function(a) {
        var b = this.getVectorTo(a), c = b.getPassedVectors(), d = {};
        for (var e in c) {
            b = c[e];
            var f = new Position(this.attributes);
            f.move(b), d[f.toString()] = f;
        }
        return d;
    }
}), User = Backbone.ModelFactory({
    defaults: {
        id: 0,
        login: "Gast",
        dran: -1
    },
    initialize: function() {
        _.bindAll(this, "increaseDran", "decreaseDran"), this.url = "//www.karopapier.de/api/user/" + this.get("id") + "/info.json?callback=?";
    },
    increaseDran: function() {
        this.set("dran", this.get("dran") + 1);
    },
    decreaseDran: function() {
        this.set("dran", this.get("dran") - 1);
    }
}), YOUTUBE_CACHE = {}, KaroUtil = {};

!function(a) {
    a = a || {}, a.funny = !0, a.oldLink = !1, a.init = function() {
        a.replacements = [], a.replacements.push({
            r: "<a (.*?)</a>",
            f: function(a) {
                return a;
            },
            sw: "i"
        }), a.replacements.push({
            r: "-:K",
            f: "<i>"
        }), a.replacements.push({
            r: "K:-",
            f: "</i>"
        }), a.replacements.push({
            r: "-:F",
            f: "<b>"
        }), a.replacements.push({
            r: "F:-",
            f: "</b>"
        }), a.replacements.push({
            r: "-:RED",
            f: '<span style="color: red">'
        }), a.replacements.push({
            r: "RED:-",
            f: "</span>"
        }), a.funny && (a.replacements.push({
            r: "(^|\\s)nen(^|\\s|$)",
            f: function() {
                return RegExp.$1 + "einen" + RegExp.$2;
            }
        }), a.replacements.push({
            r: "(^|\\s)Nen(^|\\s|$)",
            f: function() {
                return RegExp.$1 + "Einen" + RegExp.$2;
            }
        }), a.replacements.push({
            r: "\\banders\\b",
            f: function() {
                return ' <img style="opacity: .3" src="//www.karopapier.de/images/anders.jpg" alt="anders" title="anders" />';
            },
            sw: "i"
        }), a.replacements.push({
            r: "\\bhoff\\b",
            f: function() {
                return ' <img style="opacity: .3" src="//www.karopapier.de/images/hoff.jpg"     alt="hoff" title="hoff" />';
            },
            sw: "i"
        })), a.replacements.push({
            r: "(?:http\\:\\/\\/www.karopapier.de\\/showmap.php\\?|http:\\/\\/2.karopapier.de\\/game.html\\?|\\b)GID[ =]([0-9]{3,6})\\b",
            f: function(b, c) {
                return $.getJSON("//www.karopapier.de/api/game/" + c + "/info.json?callback=?", function(a) {
                    $("a.GidLink" + c).text(c + " - " + a.game.name);
                }), a.oldLink ? '<a class="GidLink' + c + '" href="//www.karopapier.de/showmap.php?GID=' + c + '" target="_blank">' + c + "</a>" : '<a class="GidLink' + c + '" href="//2.karopapier.de/game.html?GID=' + c + '" target="_blank">' + c + "</a>";
            },
            sw: "i"
        }), a.replacements.push({
            r: "(?![^<]+>)((https?\\:\\/\\/|ftp:\\/\\/)|(www\\.))(\\S+)(\\w{2,4})(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-\\/]))?",
            f: function(a) {
                var b = "", c = a, d = a;
                if (a.match("^https?://") || (a = "http://" + a), a.match("youtube.com/.*v=.*") || a.match("youtu.be/.*")) {
                    try {
                        var e = a.split("?")[1].split("&").filter(function(a) {
                            return "v=" == a.substr(0, 2);
                        })[0].split("=")[1];
                    } catch (f) {
                        var e = a.split("tu.be/")[1];
                    }
                    b += " yt_" + e;
                    var g = "https://www.googleapis.com/youtube/v3/videos?id=" + e + "&key=AIzaSyBuMu8QDh49VqGJo4cSS4_9pTC9cqZwy98&part=snippet";
                    if (e in YOUTUBE_CACHE) {
                        var h = YOUTUBE_CACHE[e];
                        c = '<img height="20" src="' + h.thumbnails["default"].url + '" />' + h.title, d = h.description;
                    } else $.getJSON(g, function(a) {
                        var b = a.items[0].snippet;
                        YOUTUBE_CACHE[e] = b, c = '<img height="20" src="' + b.thumbnails["default"].url + '" />' + b.title, 
                        $("a.yt_" + e).attr("title", b.description).html(c);
                    });
                } else a.match(/.*\.(jpg|gif|png)/i) ? c = '<img src="http://daumennagel.de/' + a + '" height="25" />' : a.match("^https?://") && (c = c.replace(/^https?:\/\//i, ""), 
                c = c.replace(/^www./i, ""));
                return '<a class="' + b + '" title="' + d + '" target="_blank" rel="nofollow" href="' + a + '">' + c + "</a>";
            },
            sw: "i"
        }), a.replacements.push({
            r: ":([a-z]*?):",
            f: function(a, b) {
                var c = document.createElement("img");
                return c.src = "//www.karopapier.de/bilder/smilies/" + b + ".gif", c.onload = function() {
                    $(".smiley." + b).replaceWith(c);
                }, '<span class="smiley ' + b + '">' + a + "</span>";
            },
            sw: "i"
        }), a.replacements.push({
            r: 'img src="\\/images\\/smilies\\/(.*?).gif" alt=',
            f: function() {
                return 'img src="//www.karopapier.de/bilder/smilies/' + RegExp.$1 + '.gif" alt=';
            },
            sw: "i"
        });
    }, a.createSvg = function(a, b) {
        var c = document.createElementNS("http://www.w3.org/2000/svg", a);
        for (var d in b) c.setAttribute(d, b[d]);
        return c;
    }, a.linkify = function(b) {
        if (!b) return b;
        for (var c = 0, d = this.replacements.length; d > c; c++) {
            var e = this.replacements[c], f = e.r, g = e.f, h = e.sw || "", i = new RegExp("^(.*?)(" + f + ")(.*?)$", h), j = i.exec(b);
            if (j) {
                var k = (j.shift(), j.shift()), l = j.shift(), m = j.pop(), n = a.linkify(k) + l.replace(new RegExp(f, h), g) + a.linkify(m);
                return n;
            }
        }
        return b;
    }, a.oldlinkify = function(a) {
        return console.warn("DEPRECATED"), a;
    }, a.lazyCss = function(a) {
        var b = document.getElementsByTagName("head")[0], c = document.createElement("link");
        c.type = "text/css", c.rel = "stylesheet", c.href = a, b.appendChild(c);
    }, a.lazyJs = function(a) {
        var b = document.getElementsByTagName("head")[0], c = document.createElement("script");
        c.type = "text/javascript", c.src = a, b.appendChild(c);
    }, a.setFunny = function(b) {
        console.warn("DEPRECATED setFunny"), a.funny = b, a.init();
    }, a.set = function(b, c) {
        a[b] = c, a.init();
    }, a.init();
}(KaroUtil), String.prototype.trim || !function() {
    var a = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    String.prototype.trim = function() {
        return this.replace(a, "");
    };
}(), String.prototype.startsWith || (String.prototype.startsWith = function(a, b) {
    return b = b || 0, this.indexOf(a, b) === b;
}), "function" != typeof String.prototype.truncate && (String.prototype.truncate = function(a, b) {
    return a.substring(0, b) + "...";
}), String.prototype.repeat || (String.prototype.repeat = function(a) {
    return a = a || 1, Array(a + 1).join(this);
});

var Vector = Backbone.Model.extend({
    defaults: {
        x: 0,
        y: 0
    },
    initialize: function(a, b) {
        "object" == typeof a || ("number" == typeof a && "number" == typeof b ? (this.set("x", a), 
        this.set("y", b)) : console.error("Vector init messed up: ", a, b));
    },
    clone: function() {
        return new Vector(this.attributes);
    },
    toString: function() {
        return "(" + this.get("x") + "|" + this.get("y") + ")";
    },
    getDirection: function(a) {
        var b = this.get(a);
        return 0 == b ? 0 : b / Math.abs(b);
    },
    getXDirection: function() {
        return this.getDirection("x");
    },
    getYDirection: function() {
        return this.getDirection("y");
    },
    getLength: function() {
        return Math.sqrt(Math.pow(this.get("x"), 2) + Math.pow(this.get("y"), 2));
    },
    decelerate: function(a) {
        if (a) {
            var b = this.get(a);
            if (0 == b) return !0;
            var b = (Math.abs(this.get(a)) - 1) * this.getDirection(a);
            this.set(a, b);
        } else this.decelerate("x"), this.decelerate("y");
    },
    getPassedVectors: function() {
        var a = this.get("x"), b = this.get("y"), c = a > 0 ? 1 : 0 > a ? -1 : 0, d = b > 0 ? 1 : 0 > b ? -1 : 0;
        if (a = Math.abs(a), b = Math.abs(b), a > b) var e = c, f = 0, g = 0, h = d, i = c, j = d, k = b, l = a; else var e = 0, f = d, g = c, h = 0, i = c, j = d, k = a, l = b;
        var m = 0, n = 0, o = {}, p = new Vector({
            x: 0,
            y: 0
        });
        o[p.toString()] = p;
        var q = (l - k) / 2;
        do 0 > q ? (q += l, m += g, n += h) : q > 0 ? (q -= k, m += e, n += f) : (q += l, 
        q -= k, m += i, n += j), p = new Vector({
            x: m,
            y: n
        }), o[p.toString()] = p; while (Math.abs(m) != a || Math.abs(n) != b);
        return o;
    }
}), EditorImageTranslator = Backbone.Model.extend({
    initialize: function(a) {
        return a = a || {}, a.map ? a.editorsettings ? (this.map = a.map, this.editorsettings = a.editorsettings, 
        _.bindAll(this, "loadImage", "loadUrl", "getImageData", "getFieldForRgbaArray", "initColorMode"), 
        this.image = new Image(), this.canvas = document.createElement("canvas"), this.ctx = this.canvas.getContext("2d"), 
        this.settings = new EditorImageTranslatorSettings(), this.listenTo(this.settings, "change", this.mapcodeResize), 
        this.findOptions = {
            binary: !0,
            invert: !1,
            colors: [ "X", "1" ]
        }, this.helper = 0, console.info("Dörtiii"), void this.initColorMode(this.map, new MapRenderPalette())) : void console.error("No editorsettings passed to EditorImageTranslator") : void console.error("No map passed to EditorImageTranslator");
    },
    getFieldForRgbaArray: function(a, b) {
        if (!b) {
            var c = (a[0] + a[1] + a[2]) / 3, d = (!this.findOptions.invert ^ !(127 >= c)) << 0;
            return f = this.findOptions.colors[d];
        }
        var e = 1/0, f = ".", g = this.rgb2hsl(a);
        for (var h in this.hsls) {
            var i = 0, j = this.hsls[h];
            i += Math.pow(j[0] - g[0], 2), i += Math.pow(j[1] - g[1], 2), i += Math.pow(j[2] - g[2], 2), 
            e > i && (e = i, f = h);
        }
        return f;
    },
    processField: function(a, b, c, d, e, f, g, h, i, j, k) {
        var l = this, m = l.ctx.getImageData(e, f, i, j), n = l.averageRgba(m.data), o = l.getFieldForRgbaArray(n, !this.findOptions.binary);
        return l.map.setFieldAtRowCol(a, b, o), k ? (e += i, b += 1, b >= d && (e = 0, b = 0, 
        f += j, a++), a >= c ? (this.editorsettings.set("undo", !0), !0) : void window.setTimeout(function() {
            l.processField(a, b, c, d, e, f, g, h, i, j, !0);
        }, 0)) : !1;
    },
    timecheck: function() {
        var a = new Date().getTime(), b = this.settings.get("scaleWidth"), c = this.settings.get("scaleHeight");
        this.processField(0, 0, 1, 1, 0, 0, b, c, b, c, !1);
        var d = new Date().getTime(), e = Math.round(d - a);
        return e;
    },
    initColorMode: function(a, b) {
        var c = /(O|P|G|L|N|T|V|W|X|Y|Z)/;
        this.hsls = {};
        for (var d in a.FIELDS) if (d.match(c)) {
            var e = b.get(d).split(",").map(function(a) {
                return parseInt(a);
            }), f = this.rgb2hsl(e);
            this.hsls[d] = f;
        }
        return !0;
    },
    run: function() {
        this.editorsettings.set("undo", !1), this.helper = 0, this.mapcodeResize();
        var a = this.settings.get("scaleWidth"), b = this.settings.get("scaleHeight"), c = this.canvas.width, d = this.canvas.height, e = this.settings.get("fieldtime"), f = this.settings.get("targetRows"), g = this.settings.get("targetCols");
        0 == e && (e = 20), this.findOptions = {
            binary: this.settings.get("binary"),
            invert: this.settings.get("invert"),
            colors: [ this.editorsettings.get("buttons")[1], this.editorsettings.get("buttons")[3] ]
        };
        var h = this, i = 0, j = 0;
        if (this.settings.get("speedmode")) {
            for (var k = 0; d > k; k += b) {
                for (var l = 0; c > l; l += a) h.processField(i, j, f, g, l, k, c, d, a, b, !1), 
                j++;
                j = 0, i++;
            }
            this.editorsettings.set("undo", !1);
        } else h.processField(0, 0, f, g, 0, 0, c, d, a, b, e);
        return !0;
    },
    mapcodeResize: function() {
        var a = this.editorsettings.get("undo");
        this.editorsettings.set("undo", !1);
        for (var b = new Array(this.settings.get("targetCols") + 1).join("."), c = [], d = 0, e = this.settings.get("targetRows"); e > d; d++) c.push(b);
        this.map.setMapcode(c.join("\n")), this.editorsettings.set("undo", a);
    },
    getSourceInfo: function() {
        return {
            width: this.image.width,
            height: this.image.height
        };
    },
    loadImage: function(a) {
        var b = a.width, c = a.height;
        this.canvas.width = b, this.canvas.height = c, this.ctx.drawImage(a, 0, 0), this.settings.set({
            sourceWidth: b,
            sourceHeight: c
        }), this.settings.set("active", !0), this.editorsettings.set("undo", !1), this.settings.set("fieldtime", this.timecheck()), 
        this.editorsettings.set("undo", !0);
    },
    getImageData: function() {
        return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    },
    loadUrl: function(a, b) {
        var c = this;
        this.image.onload = function() {
            var a = c.image.width, d = c.image.height;
            c.settings.set({
                sourceWidth: a,
                sourceHeight: d
            }), c.canvas.width = a, c.canvas.height = d, c.ctx.drawImage(c.image, 0, 0), b();
        }, this.image.src = a;
    },
    averageRgba: function(a) {
        if (a.length % 4 != 0) return console.error("Imagedate has a length of", a.length), 
        !1;
        for (var b = [ 0, 0, 0 ], c = 0, d = a.length; d > c; c += 4) b[0] += a[c], b[1] += a[c + 1], 
        b[2] += a[c + 2];
        var e = d / 4;
        return avg = [ b[0] / e, b[1] / e, b[2] / e, 255 ], avg;
    },
    rgb2hsl: function(a) {
        var b = a[0], c = a[1], d = a[2];
        b /= 255, c /= 255, d /= 255;
        var e, f, g = Math.max(b, c, d), h = Math.min(b, c, d), i = (g + h) / 2;
        if (g == h) e = f = 0; else {
            var j = g - h;
            switch (f = i > .5 ? j / (2 - g - h) : j / (g + h), g) {
              case b:
                e = (c - d) / j + (d > c ? 6 : 0);
                break;

              case c:
                e = (d - b) / j + 2;
                break;

              case d:
                e = (b - c) / j + 4;
            }
            e *= 60;
        }
        return f *= 100, i *= 100, [ Math.round(e), Math.round(f), Math.round(i) ];
    }
}), EditorImageTranslatorSettings = Backbone.Model.extend({
    defaults: {
        active: !1,
        binary: !0,
        speedmode: !0,
        inverted: !1,
        scaleWidth: 10,
        scaleHeight: 10,
        targetRows: 20,
        targetCols: 30,
        sourceWidth: 300,
        sourceHeight: 200,
        fieldtime: 0
    },
    initialize: function() {
        this.listenTo(this, "change:sourceWidth change:sourceHeight", this.recalcFromSource);
    },
    setScale: function(a) {
        if (0 == a) return !1;
        if (1 > a) return !1;
        var b = Math.floor(this.get("sourceWidth") / a), c = Math.floor(this.get("sourceHeight") / a);
        this.set({
            scaleWidth: a,
            scaleHeight: a,
            targetRows: c,
            targetCols: b
        });
    },
    setTargetRowCol: function(a, b) {
        var c = this.get("sourceWidth") / b, d = Math.floor(this.get("sourceHeight") / a);
        this.set({
            scaleWidth: c,
            scaleHeight: d,
            targetRows: a,
            targetCols: b
        });
    },
    recalcFromSource: function() {
        var a = this.get("sourceWidth"), b = this.get("sourceHeight"), c = 10;
        c = 60 > a || 40 > b ? 1 : Math.floor(this.get("sourceWidth") / 60), this.set({
            scaleWidth: c,
            scaleHeight: c,
            targetCols: Math.floor(a / c),
            targetRows: Math.floor(b / c)
        });
    }
}), EditorSettings = Backbone.Model.extend({
    defaults: {
        buttons: [ null, "O", "1", "X" ],
        rightclick: !0,
        drawmode: "draw"
    },
    setButtonField: function(a, b) {
        var c = this.get("buttons");
        if (c[a] != b) {
            for (var d = [], e = 0; 3 >= e; e++) d[e] = c[e];
            d[a] = b, this.set("buttons", d);
        }
    }
}), EditorUndo = Backbone.Model.extend({
    initialize: function(a) {
        return _.bindAll(this, "undo"), a = a || {}, this.map = a.map, this.map ? a.editorsettings ? (this.editorsettings = a.editorsettings, 
        this.undoStack = [], this._enabled = !0, this._lastChangeWasUndo = !1, this.listenTo(this.editorsettings, "change:undo", this.checkStatus), 
        this.listenTo(this.map, "change:field", function(a) {
            this.pushChange(a.oldcode);
        }), void this.listenTo(this.map, "change:mapcode", this.checkChange)) : (console.error("No editorsettings for EditorUndo"), 
        !1) : (console.error("No map for EditorUndo"), !1);
    },
    checkStatus: function() {
        this.editorsettings.get("undo") ? this.enable() : this.disable();
    },
    checkChange: function() {
        this._lastChangeWasUndo || this.pushChange(this.map.previous("mapcode")), this._lastChangeWasUndo = !1;
    },
    pushChange: function(a) {
        if (!this._enabled) return !1;
        var b = this.undoStack.length;
        if (b > 0) {
            var c = this.undoStack[b - 1];
            if (a === c) return !1;
        }
        this.undoStack.push(a), this.trigger("change:undoStack", this.undoStack);
    },
    disable: function() {
        this.pushChange(this.map.get("mapcode")), this._enabled = !1;
    },
    enable: function() {
        this._enabled = !0;
    },
    undo: function() {
        if (this.undoStack.length >= 1) {
            this._lastChangeWasUndo = !0;
            var a = this.undoStack.pop();
            this.map.set("mapcode", a), this.trigger("change:undoStack", this.undoStack);
        }
    }
}), KaroMap = Backbone.Model.extend({
    defaults: {
        id: 0,
        name: "o(-.-)o",
        mapcode: "1",
        loaded: !1
    },
    initialize: function() {
        this.constructor.__super__.initialize.apply(this, arguments);
    },
    loading: function() {},
    retrieve: function() {
        var a = this;
        $.getJSON("//www.karopapier.de/api/map/" + this.get("id") + ".json?callback=?", function(b) {
            b.loaded = !0, a.set(b);
        });
    }
}), Map = Backbone.Model.extend({
    defaults: {
        id: 0,
        cps: [],
        rows: 0,
        cols: 0
    },
    initialize: function() {
        _.bindAll(this, "updateMapcode", "getCpList", "setFieldAtRowCol", "getFieldAtRowCol", "getPosFromRowCol", "isPossible", "floodfill", "floodFill4"), 
        this.validFields = Object.keys(this.FIELDS), this.offroadRegEx = new RegExp("(X|P|L|G|N|V|T|W|Y|Z|_)"), 
        this.bind("change:mapcode", this.updateMapcode);
    },
    FIELDS: {
        F: "finish",
        O: "road",
        P: "parc",
        S: "start",
        G: "gold",
        L: "lava",
        N: "snow",
        T: "tar",
        V: "mountain",
        W: "water",
        X: "grass",
        Y: "sand",
        Z: "mud",
        ".": "night",
        "1": "cp1",
        "2": "cp2",
        "3": "cp3",
        "4": "cp4",
        "5": "cp5",
        "6": "cp6",
        "7": "cp7",
        "8": "cp8",
        "9": "cp9"
    },
    isValidField: function(a) {
        return this.validFields.indexOf(a.toUpperCase()) >= 0;
    },
    setMapcode: function(a) {
        var b = a.toUpperCase();
        b = b.replace(/\r/g, "");
        var c = (b.match(/S/g) || []).length, d = b.split("\n"), e = d.length, f = d[0].trim(), g = f.length, h = this.getCpList(b);
        this.set({
            mapcode: b,
            starties: c,
            rows: e,
            cols: g,
            cps: h
        });
    },
    getMapcodeAsArray: function() {
        return this.get("mapcode").split("\n");
    },
    setMapcodeFromArray: function(a) {
        this.setMapcode(a.join("\n"));
    },
    floodfill: function(a, b, c) {
        var d = this.getFieldAtRowCol(a, b);
        return this.fillstack = [], d === c ? !1 : void this.floodFill4(a, b, d, c);
    },
    floodFill4: function(a, b, c, d) {
        for (this.fillstack.push({
            row: a,
            col: b
        }); this.fillstack.length > 0; ) {
            var e = this.fillstack.pop(), f = e.row, g = e.col;
            if (this.withinBounds({
                row: f,
                col: g
            })) {
                var h = this.getFieldAtRowCol(f, g);
                h === c && (this.setFieldAtRowCol(f, g, d), this.fillstack.push({
                    row: f,
                    col: g + 1
                }), this.fillstack.push({
                    row: f,
                    col: g - 1
                }), this.fillstack.push({
                    row: f + 1,
                    col: g
                }), this.fillstack.push({
                    row: f - 1,
                    col: g
                }));
            }
        }
    },
    addRow: function(a, b) {
        var c = this.getMapcodeAsArray(), d = c.length;
        if (0 == d) return !1;
        if (0 == a) return !1;
        var e = "";
        "undefined" == typeof b && (b = -1), e = 0 === b ? c[0] : c[d - 1];
        var f = function() {};
        f = 0 === b ? Array.prototype.unshift : Array.prototype.push;
        for (var g = 1; a >= g; g++) f.call(c, e);
        this.setMapcodeFromArray(c);
    },
    addCol: function(a, b) {
        var c = this.getMapcodeAsArray(), d = c.length;
        if (0 == d) return !1;
        if (0 == a) return !1;
        "undefined" == typeof b && (b = -1);
        var e;
        e = 0 === b ? function(b) {
            var c = b[0], d = c.repeat(a);
            return d + b;
        } : function(b) {
            var c = b.slice(-1), d = c.repeat(a);
            return b + d;
        };
        var f = c.map(e, a);
        this.setMapcodeFromArray(f);
    },
    delRow: function(a, b) {
        var c = this.getMapcodeAsArray(), d = c.length;
        if (0 == d) return !1;
        if (0 == a) return !1;
        if (a > d) return !1;
        var e = 0, f = d;
        0 == b ? (e = a, f = d) : (e = 0, f = -a);
        var g = c.slice(e, f);
        this.setMapcodeFromArray(g);
    },
    delCol: function(a, b) {
        var c = this.getMapcodeAsArray(), d = c.length;
        if (1 > d) return !1;
        var e = c[0].length;
        if (0 == e) return !1;
        if (0 == a) return !1;
        if (a > e) return !1;
        var f = 0, g = 0;
        0 == b ? (f = a, g = e) : (f = 0, g = -a);
        var h = function(a) {
            return a.slice(f, g);
        }, i = c.map(h, a);
        this.setMapcodeFromArray(i);
    },
    updateMapcode: function(a, b) {
        this.setMapcode(b);
    },
    sanitize: function() {
        var a = this.get("mapcode").toUpperCase().trim(), b = (a.match(/S/g) || []).length, c = a.split("\n"), d = 0;
        c.forEach(function(a) {
            a.length > d && (d = a.length);
        });
        var e = [], f = 0, g = this;
        c.forEach(function(a) {
            if (a.length < d) {
                var c = Array(d - a.length + 1).join("X");
                a += c;
            }
            for (var h = "", i = 0; d > i; i++) {
                var j = a[i];
                h += g.isValidField(j) ? a[i] : "X";
            }
            b > f && (h = "P" + h.substr(1), f++), e.push(h);
        }), cleanCode = e.join("\n"), this.set("mapcode", cleanCode);
    },
    getStartPositions: function() {
        return this.getFieldPositions("S");
    },
    getCpPositions: function(a) {
        return this.getFieldPositions("\\d", a);
    },
    getFieldPositions: function(a, b) {
        var c = [], d = new RegExp(a, "g");
        b = b || this.get("mapcode");
        for (var e; e = d.exec(b); ) {
            var f = e.index;
            c.push(new Position(this.getRowColFromPos(f)));
        }
        return c;
    },
    getCpList: function(a) {
        return a = a || this.get("mapcode"), (a.match(/\d/g) || []).sort().filter(function(a, b, c) {
            return b == c.indexOf(a) ? 1 : 0;
        });
    },
    withinBounds: function(a) {
        var b, c;
        if (a.hasOwnProperty("row") && a.hasOwnProperty("col")) b = a.col, c = a.row; else {
            if (!a.hasOwnProperty("x") || !a.hasOwnProperty("y")) throw console.error(a), "param for withinBounds unclear";
            b = a.x, c = a.y;
        }
        return 0 > b ? !1 : 0 > c ? !1 : b > this.get("cols") - 1 ? !1 : c > this.get("rows") - 1 ? !1 : !0;
    },
    setFieldAtRowCol: function(a, b, c) {
        var d = this.getPosFromRowCol(a, b), e = this.get("mapcode"), f = e[d];
        f !== c && (mapcode = e.substr(0, d) + c + e.substr(d + 1), this.set("mapcode", mapcode, {
            silent: !0
        }), this.trigger("change:field", {
            r: a,
            c: b,
            field: c,
            oldfield: f,
            oldcode: e
        }));
    },
    getFieldAtRowCol: function(a, b) {
        if (!this.withinBounds({
            row: a,
            col: b
        })) throw console.error(a, b), "Row " + a + ", Col " + b + " not within bounds";
        var c = this.getPosFromRowCol(a, b);
        return this.get("mapcode").charAt(c);
    },
    getPosFromRowCol: function(a, b) {
        var c = a * (this.get("cols") + 1) + b;
        return c;
    },
    getRowColFromPos: function(a) {
        var b = this.get("cols") + 1, c = a % b, d = Math.floor(a / b);
        return {
            row: d,
            col: c,
            x: c,
            y: d
        };
    },
    getPassedFields: function(a) {
        a || console.error("No motion given");
        var b = a.getPassedPositions(), c = [];
        for (var d in b) {
            var e = b[d], f = e.get("x"), g = e.get("y");
            c.push(this.withinBounds({
                x: f,
                y: g
            }) ? this.getFieldAtRowCol(g, f) : "_");
        }
        return c;
    },
    isPossible: function(a) {
        var b = this.getPassedFields(a);
        return b.indexOf(void 0) >= 0 ? !1 : !b.join("").match(this.offroadRegEx);
    },
    verifiedMotions: function(a) {
        for (var b = [], c = 0; c < a.length; c++) {
            var d = a[c];
            this.isPossible(d) && b.push(d);
        }
        return b;
    }
}), MapPathFinder = Backbone.Model.extend({
    initialize: function(a) {
        if ("undefined" == typeof a) throw "MAP_MISSING";
        _.bindAll(this, "reset", "getMainField", "getAllOutlines", "getFieldOutlines", "getOutlineDirection"), 
        this.map = a, this.reset(), this.ROAD_FIELDS = [ "O", "F", "S", "1", "2", "3", "4", "5", "6", "7", "8", "9" ], 
        this.modifiers = {
            top: {
                r: -1,
                c: 0
            },
            right: {
                r: 0,
                c: 1
            },
            bottom: {
                r: 1,
                c: 0
            },
            left: {
                r: 0,
                c: -1
            }
        }, this.directions = {
            "-1|0": "up",
            "0|1": "right",
            "1|0": "down",
            "0|-1": "left"
        }, this.outlineModifiers = {
            top: {
                from: {
                    r: 0,
                    c: 0
                },
                to: {
                    r: 0,
                    c: 1
                }
            },
            right: {
                from: {
                    r: 0,
                    c: 1
                },
                to: {
                    r: 1,
                    c: 1
                }
            },
            bottom: {
                from: {
                    r: 1,
                    c: 1
                },
                to: {
                    r: 1,
                    c: 0
                }
            },
            left: {
                from: {
                    r: 1,
                    c: 0
                },
                to: {
                    r: 0,
                    c: 0
                }
            }
        };
    },
    reset: function() {
        this.outlines = {};
    },
    getMainField: function() {
        function a(a, b, c) {
            if (a += "", b += "", b.length <= 0) return a.length + 1;
            for (var d = 0, e = 0, f = c ? 1 : b.length; ;) {
                if (e = a.indexOf(b, e), !(e >= 0)) break;
                d++, e += f;
            }
            return d;
        }
        var b = this.map.get("mapcode"), c = "", d = 0;
        for (var e in this.map.FIELDS) {
            var f = a(b, e);
            f && f > d && (c = e, d = f);
        }
        return c;
    },
    getAllOutlines: function() {
        this.reset();
        for (var a, b = (this.map.get("mapcode"), this.map.get("cols")), c = this.map.get("rows"), d = 0, e = 0; c > d; ) {
            for (e = 0; b > e; ) a = this.map.withinBounds({
                row: d,
                col: e
            }) ? this.map.getFieldAtRowCol(d, e) : "_", a in this.map.FIELDS && this.getFieldOutlines(d, e), 
            e++;
            d++;
        }
        return !0;
    },
    getSvgPathFromOutlines: function(a, b) {
        var c = "", d = 1e4, e = -1, f = -1, g = "", h = _.first(_.values(a));
        for (e = h[0].y1, f = h[0].x1, g = this.getOutlineDirection(h), c = "M" + f * b + "," + e * b; !_.isEmpty(a) && d > 0; ) {
            var i = this.getKeyForRowCol(e, f);
            if (i in a) {
                var j = a[i], k = j.shift(), l = this.getOutlineDirection(k);
                l != g && (c += "L" + k.x1 * b + "," + k.y1 * b), g = l, f = k.x2, e = k.y2, 0 === j.length && delete a[i];
            } else {
                c += "L" + f * b + "," + e * b;
                var h = _.first(_.values(a));
                e = h[0].y1, f = h[0].x1, g = this.getOutlineDirection(h), c += "M" + f * b + "," + e * b;
            }
            d--;
        }
        return c += "Z";
    },
    getOutlineDirection: function(a) {
        var b = a.x2 - a.x1, c = a.y2 - a.y1;
        return this.directions[c + "|" + b];
    },
    getKeyForRowCol: function(a, b) {
        return a + "|" + b;
    },
    getRowColFromKey: function(a) {
        var b = a.split("|");
        return {
            r: parseInt(b[0]),
            c: parseInt(b[1])
        };
    },
    isLikeRoad: function(a) {
        return this.ROAD_FIELDS.indexOf(a) >= 0;
    },
    getFieldOutlines: function(a, b) {
        var c, d = this.map.getFieldAtRowCol(a, b), e = !1;
        for (var f in this.modifiers) {
            var g = this.modifiers[f], h = a + g.r, i = b + g.c;
            if (c = this.map.withinBounds({
                row: h,
                col: i
            }) ? this.map.getFieldAtRowCol(h, i) : "_", e = !1, "O" !== d && this.isLikeRoad(d) && !this.isLikeRoad(c) && (e = !0), 
            c != d) {
                var j = this.outlineModifiers[f].from, k = this.outlineModifiers[f].to;
                d in this.outlines || (this.outlines[d] = {});
                var l = b + j.c, m = a + j.r, n = b + k.c, o = a + k.r, p = this.getKeyForRowCol(m, l);
                "O" == d && this.isLikeRoad(c) || (p in this.outlines[d] || (this.outlines[d][p] = []), 
                this.outlines[d][p].push({
                    x1: l,
                    y1: m,
                    x2: n,
                    y2: o
                })), e && ("O" in this.outlines || (this.outlines.O = {}), p in this.outlines.O || (this.outlines.O[p] = []), 
                this.outlines.O[p].push({
                    x1: l,
                    y1: m,
                    x2: n,
                    y2: o
                }));
            }
        }
        return !0;
    }
}), MapPathStore = Backbone.Model.extend({
    getPath: function(a, b) {
        var c = 0, d = 0, e = "", f = function() {
            if (e === !1) return b(!1), !1;
            if (0 != c && 0 != d && "" != e) {
                var f = {};
                f.r = c, f.c = d;
                var g = new XMLSerializer().serializeToString(e);
                f.p = g, store.set("map" + a, f), b(f);
            }
        }, g = store.get("map" + a);
        g ? b(g) : ($.get("/paths/" + a + ".svg", function(a) {
            e = a.getElementById("mapSvgView"), f();
        }).fail(function(a) {
            console.error(a), e = !1, f();
        }), $.getJSON("//www.karopapier.de/api/map/" + a + ".json?callback=?", function(a) {
            c = a.rows, d = a.cols, f();
        }));
    },
    getFromUrl: function() {},
    getFromStore: function() {},
    saveToStore: function() {}
}), MapRenderPalette = Backbone.Model.extend({
    defaults: {
        road: "128,128,128",
        road_2: "100,100,100",
        grass: "0,200,0",
        grass_2: "0,180,0",
        sand: "230,230,115",
        sand_2: "200,200,100",
        mud: "100,70,0",
        mud_2: "90,60,0",
        mountain: "100,100,100",
        mountain_2: "0,0,0",
        gold: "255, 201, 14",
        gold_2: "255, 255, 0",
        lava: "240, 0, 0",
        lava_2: "180, 0, 0",
        water: "0,60,200",
        water_2: "0,30,100",
        snow: "255,255,255",
        snow_2: "120,120,120",
        start: "100,100,100",
        start_2: "200,200,200",
        tar: "0,0,0",
        tar_2: "40,40,40",
        finish: "255,255,255",
        finish_2: "0,0,0",
        night: "0,0,0",
        night_2: "0,0,0",
        parc: "200,200,200",
        parc_2: "120,120,120",
        cp1: "000,102,255",
        cp1_2: "0,0,0",
        cp2: "000,100,200",
        cp2_2: "255,255,255",
        cp3: "000,255,102",
        cp3_2: "0,0,0",
        cp4: "000,200,000",
        cp4_2: "255,255,255",
        cp5: "255,255,000",
        cp5_2: "0,0,0",
        cp6: "200,200,000",
        cp6_2: "255,255,255",
        cp7: "255,000,000",
        cp7_2: "0,0,0",
        cp8: "200,000,000",
        cp8_2: "255,255,255",
        cp9: "255,000,255",
        cp9_2: "0,0,0"
    },
    initialize: function() {
        _.bindAll(this, "setCharacterAlias", "getRGB"), this.setCharacterAlias(), this.bind("change", this.setCharacterAlias);
    },
    setCharacterAlias: function() {
        var a = this, b = new Map();
        _.each(b.FIELDS, function(b, c) {
            a.set(c, a.get(b)), a.set(c + "_2", a.get(b + "_2"));
        });
    },
    getRGB: function(a) {
        var b = this.get(a);
        return b || (console.error("No color for", a), b = "0,0,0"), "rgb(" + this.get(a) + ")";
    }
}), MapViewSettings = Backbone.Model.extend({
    defaults: {
        size: 11,
        border: 1,
        fillBorder: !0,
        specles: !0,
        drawLimit: 2,
        hidePassedCPs: !0,
        cpsActive: !0,
        cpsVisited: []
    }
}), ChatMessageCache = Backbone.Collection.extend({
    url: "//www.karopapier.de/api/chat/list.json?limit=100&callback=?",
    baseUrl: "//www.karopapier.de/api/chat/list.json",
    model: ChatMessage,
    comparator: "lineId",
    lastLineId: 0,
    initialize: function() {
        _.bindAll(this, "parse", "cache"), this.info = new Backbone.Model({
            lastLineId: 0
        });
    },
    cache: function(a, b) {
        "undefined" == typeof b && (b = 100);
        var c = this;
        console.log("Caching", a);
        this.findWhere({
            lineId: a
        });
        this.fetch({
            url: this.baseUrl + "?start=" + a + "&limit=" + b + "&callback=?",
            remove: !1,
            success: function() {
                c.trigger("CHAT:CACHE:UPDATED");
            }
        });
    },
    parse: function(a) {
        console.log("parsing cms");
        var b = this.info.get("lastLineId");
        return _.each(a, function(a) {
            a.lineId > b && (b = a.lineId);
        }), this.info.set("lastLineId", b), a;
    }
}), ChatMessageCollection = Backbone.Collection.extend({
    model: ChatMessage
}), ChatUserCollection = Backbone.Collection.extend({
    url: "//www.karopapier.de/api/chat/users.json?callback=?",
    model: User,
    initialize: function() {
        _.bindAll(this, "addItem");
    },
    addItem: function() {}
}), DranGameCollection = Backbone.Collection.extend({
    model: Game,
    url: function() {
        return "//www.karopapier.de/api/user/" + Karopapier.User.get("id") + "/dran.json?callback=?";
    },
    initialize: function() {
        _.bindAll(this, "addId");
    },
    addId: function(a, b) {
        var c = new Game({
            id: a
        });
        b && c.set("name", b), this.add(c);
    },
    parse: function(a) {
        return a.games;
    }
}), KaroMapCollection = Backbone.Collection.extend({
    model: KaroMap,
    url: "//www.karopapier.de/api/map/list.json?callback=?"
}), MotionCollection = Backbone.Collection.extend({
    model: Motion,
    getByMotionString: function(a) {
        var b = !1;
        return this.each(function(c) {
            c.toString() === a && (b = c);
        }), b;
    }
}), MoveCollection = Backbone.Collection.extend({
    model: Move
}), MoveMessageCollection = Backbone.Collection.extend({
    model: Move,
    initialize: function() {
        _.bindAll(this, "updateFromPlayers");
    },
    comparator: function(a) {
        return a.get("t");
    },
    updateFromPlayers: function(a) {
        var b = [];
        a.each(function(a) {
            var c = a.moves.filter(function(a) {
                return a.get("msg");
            });
            _.each(c, function(b) {
                b.set("player", a);
            }), b = b.concat(c);
        }), this.reset(b);
    }
}), PlayerCollection = Backbone.Collection.extend({
    model: Player,
    initialize: function() {},
    toJSON: function() {
        var a = [];
        return this.each(function(b) {
            a.push(b.toJSON());
        }), a;
    },
    getOccupiedPositions: function(a) {
        var b = {
            position: 0,
            status: "ok"
        };
        a && (b.moved = !0);
        for (var c = this.where(b), d = [], e = 0, f = c.length; f > e; e++) {
            var g = c[e].moves;
            if (g.length > 0) {
                var h = g.at(g.length - 1);
                d.push(new Position({
                    x: h.attributes.x,
                    y: h.attributes.y
                }));
            }
        }
        return d;
    }
}), FaviconView = Backbone.View.extend({
    tagName: "link",
    initialize: function() {
        _.bindAll(this, "update", "reset", "addNum", "render"), this.baseUrl = this.el.href, 
        this.src = this.baseUrl, this.head = document.head || document.getElementsByTagName("head")[0], 
        this.canvas = document.createElement("canvas"), this.canvas.width = 16, this.canvas.height = 16, 
        this.ctx = this.canvas.getContext("2d"), this.img = new Image(), this.img.src = this.src, 
        this.model.on("change:dran change:id", this.update);
    },
    update: function(a, b) {
        b || (b = 0), this.reset(), this.addNum(b), this.render();
    },
    reset: function() {
        this.src = this.baseUrl;
    },
    addNum: function(a) {
        this.ctx.drawImage(this.img, 0, 0), a > 99 && (a = "99"), this.ctx.textBaseline = "bottom", 
        this.ctx.textAlign = "right", this.ctx.font = "8pt Arial", this.ctx.fillStyle = "white", 
        this.ctx.fillText(a, 15, 15), this.ctx.fillText(a, 15, 17), this.ctx.fillText(a, 17, 15), 
        this.ctx.fillText(a, 17, 17), this.ctx.fillStyle = "black", this.ctx.fillText(a, 16, 16), 
        this.src = this.canvas.toDataURL(), this.render();
    },
    render: function() {
        var a = document.createElement("link");
        a.id = "favicon", a.type = "image/x-icon", a.rel = "shortcut icon", a.href = this.src, 
        this.el && document.head.removeChild(this.el), document.head.appendChild(a), this.el = a;
    }
}), GameAppNavigationView = Backbone.Marionette.ItemView.extend({
    template: "#game-navi-template",
    events: {
        "click .back": "backGame",
        "click .next": "nextGame",
        "click .smaller": "smallerView",
        "click .bigger": "biggerView"
    },
    smallerView: function() {
        var a = app.gameAppView.gameView.settings.get("size");
        app.gameAppView.gameView.settings.set({
            size: a - 1
        });
    },
    biggerView: function() {
        var a = app.gameAppView.gameView.settings.get("size");
        app.gameAppView.gameView.settings.set({
            size: a + 1
        });
    },
    backGame: function() {
        var a = parseInt(app.gameAppView.model.get("id"));
        app.router.navigate("game/" + (a - 1), {
            trigger: !0
        });
    },
    nextGame: function() {
        var a = parseInt(app.gameAppView.model.get("id"));
        app.router.navigate("game/" + (a + 1), {
            trigger: !0
        });
    }
}), GameAppView = Backbone.View.extend({
    tagName: "div",
    id: "GameApp",
    initialize: function() {
        this.template = _.template('<div style="float: left"><h1 id="title">KaroBackbone</h1><div id="latestMessages"></div></div><div id="gameInfo"></div><div class="clearer"></div></div><div id="GameView"></div><div id="moveMessages"></div><div id="GameDetails"></div><div id="gameAppNavigation"></div>'), 
        this.$el.html(this.template), this.game = this.model, _.bindAll(this), this.gameView = new GameView({
            model: this.model,
            el: $("#GameView", this.$el)
        }), this.navigation = new GameAppNavigationView({
            el: $("#gameAppNavigation", this.$el)
        }), this.navigation.render(), this.gameInfo = new GameInfoView({
            model: this.game,
            el: $("#gameInfo", this.$el)
        }), this.gameInfo.render(), this.latestMessages = new MoveMessageView({
            model: this.game.moveMessages,
            el: $("#latestMessages", this.$el),
            filter: function(a) {
                return "Kinvarra" == a.get("player").get("name");
            },
            max: 5
        }), this.moveMessages = new MoveMessageView({
            model: this.game.moveMessages,
            el: $("#moveMessages", this.$el),
            filter: !1,
            max: 10
        }), this.model.bind("change", this.redraw);
    },
    close: function() {
        this.gameView.close(), this.gameInfo.close(), this.navigation.close(), alert("Remove myself"), 
        this.$el.remove();
    },
    render: function() {
        app.content.append(this.el);
    },
    redraw: function() {
        app.setTitle(this.model.get("name")), this.gameInfo.redraw();
    },
    setGameId: function(a) {
        0 != a && this.model.load(a);
    }
}), GameCollectionView = Marionette.CompositeView.extend({
    childViewContainer: "tbody",
    template: window.JST["dran/dranGames"]
}), GameInfoView = Backbone.View.extend({
    id: "gameInfo",
    template: window.JST["game/gameInfo"],
    initialize: function() {
        _.bindAll(this, "render"), this.listenTo(this.model, "change", this.render), this.listenTo(this.model.map, "change", this.render), 
        this.dirTitle = {
            formula1: "Formula 1",
            classic: "klassisch",
            free: "egal"
        }, this.dirMeaning = {
            formula1: "erst alle über's die Ziel",
            classic: "erst weg vom Ziel",
            free: "fahrt wie ihr wollt"
        }, this.tcMeaning = {
            free: "grad egal",
            forbidden: "nicht erlaubt",
            allowed: "erlaubt"
        };
    },
    render: function() {
        if (!this.model.get("completed")) return !1;
        var a = this.model.toJSON();
        a.mapId = this.model.map.get("id"), a.mapName = this.model.map.get("name"), a.mapAuthor = this.model.map.get("author"), 
        a.dirMeaning = this.dirMeaning[a.dir], a.dirTitle = this.dirTitle[a.dir], a.createdDate = moment(this.model.get("created"), "YYYY-MM-DD HH:mm").format("DD.MM.YYYY"), 
        a.createdTime = moment(this.model.get("created"), "YYYY-MM-DD HH:mm").format("HH:mm");
        var b = "aktiviert";
        0 == this.model.map.get("cps").length ? b = "deaktiviert, die Karte hat keine" : this.model.get("withCheckpoints") || (b = "deaktiviert"), 
        a.cpStatus = b, a.tcMeaning = this.tcMeaning[this.model.get("tcrash")], this.$el.html(this.template(a));
    }
}), GameListItemView = Marionette.ItemView.extend({
    tagName: "tr",
    template: window.JST["game/gameListItem"]
}), GameTitleView = Backbone.View.extend({
    template: window.JST["game/gameTitle"],
    initialize: function() {
        this.listenTo(this.model, "change:name", this.render);
    },
    render: function() {
        var a = this.$el, b = $(this.template(this.model.toJSON()));
        return this.setElement(b), a.replaceWith(b), this;
    }
}), KaroNotificationView = Backbone.View.extend({
    tagName: "li",
    className: "notification",
    initialize: function() {
        _.bindAll(this, "render", "done"), this.listenTo(this.model, "remove", this.done);
    },
    events: {
        "click .close": "remove"
    },
    remove: function() {
        this.model.destroy();
    },
    done: function() {
        var a = this;
        this.$el.hide({
            effect: "slide",
            direction: "up",
            complete: function() {
                a.$el.remove();
            }
        });
    },
    render: function() {
        var a = this.model.get("text"), b = "";
        return this.el.style.position = "relative", this.$el.addClass(this.model.get("level")), 
        this.model.get("imgUrl") && (this.$el.addClass("withImage"), b += '<img class="notification-image" src="' + this.model.get("imgUrl") + '">'), 
        b += '<div class="notification-message">' + a + "</div>", b += '<img src="//www.karopapier.de/images/x.png" class="close" style="position: absolute; right: 0px; top: 0px">', 
        this.$el.html(b), this;
    }
}), KaroNotifierView = Backbone.View.extend({
    tagName: "ul",
    className: "notifier",
    initialize: function() {
        _.bindAll(this, "showNotification", "render"), this.listenTo(this.model.notifications, "add", this.showNotification);
    },
    showNotification: function(a) {
        var b = new KaroNotificationView({
            model: a
        }).render();
        b.el.style.display = "none", b.el.style.overflow = "hidden", this.$el.append(b.el), 
        b.$el.show({
            effect: "fade"
        });
    },
    render: function() {
        return $("body").append(this.el), this;
    }
}), LastMoveMessageView = Backbone.View.extend({
    initialize: function(a) {
        a = a || {}, this.listenTo(this.collection, "reset change", this.render), _.bindAll(this, "render"), 
        this.template = _.template("<small><%= name %> (<%= date %>): &quot;<%= text %>&quot;<br /></small>\n"), 
        this.settings = new Backbone.Model(), this.settings.set("timestamp", !1), this.listenTo(this.settings, "change:timestamp", this.render);
    },
    render: function() {
        var a = "", b = this.settings.get("timestamp");
        if (this.collection.length > 0 && b) {
            var c = function(a) {
                return d = moment(a.get("t"), "YYYY-MM-DD hh:mm:ss"), d.unix() > b.getTime() / 1e3;
            }, e = this.collection.filter(c);
            _.each(e, function(b) {
                var c = (b.get("msg"), this.template);
                a += c({
                    name: b.get("player").get("name"),
                    text: KaroUtil.linkify(b.get("msg")),
                    date: moment(b.get("t"), "YYYY-MM-DD hh:mm:ss").format("YYYY-MM-DD")
                });
            }, this);
        }
        a ? (a = "<small><b>Bordfunk seit Deinem letzten Zug:</b></small><br>" + a, this.$el.show()) : (this.$el.hide(), 
        a = ""), this.$el.html(a);
    }
}), LogView = Marionette.View.extend({
    tagName: "pre",
    initialize: function(a) {
        this.info = a.info || "-", this.log("Init");
    },
    log: function(a) {
        var b = new Date(), c = b.getHours(), d = b.getMinutes(), e = b.getSeconds(), f = b.getMilliseconds();
        d = 10 > d ? "0" + d : d, e = 10 > e ? "0" + e : e;
        var g = c + ":" + d + ":" + e + "." + f;
        this.$el.append(g + " " + this.info + " " + a + " (" + this.cid + ")\n");
    },
    render: function() {
        return this.log("Render"), this;
    }
}), MoveMessageView = Backbone.View.extend({
    template: _.template("<%= name %> (<%= date %>): &quot;<%= text %>&quot;<br />\n"),
    statusTemplate: _.template("<small><%= name %> (<%= date %>): &quot;<%= text %>&quot;<br /></small>\n"),
    initialize: function(a) {
        a = a || {}, this.listenTo(this.collection, "reset change", this.render), _.bindAll(this, "render"), 
        this.template = _.template("<%= name %> (<%= date %>): &quot;<%= text %>&quot;<br />\n"), 
        this.filter = !1, a.filter && (this.filter = a.filter);
    },
    render: function() {
        var a = "", b = this.collection.models;
        this.filter && (b = this.collection.filter(this.filter)), _.each(b, function(b) {
            var c = b.get("msg"), d = this.template;
            c.startsWith("-:K") && (d = this.statusTemplate), a += d({
                name: b.get("player").get("name"),
                text: KaroUtil.linkify(b.get("msg")),
                date: moment(b.get("t"), "YYYY-MM-DD hh:mm:ss").format("YYYY-MM-DD")
            });
        }, this), a || (a = "--------- Keiner spricht, hier herrscht höchste Konzentration --------"), 
        this.$el.html(a), this.$el[0].scrollTop = this.$el[0].scrollHeight;
    }
}), NaviView = Marionette.View.extend({
    template: window.JST["main/navi"],
    render: function() {
        return this.$el.html(this.template()), this.$('a[href*=".html"]').click(function(a) {
            var b = $(a.currentTarget).attr("href");
            return console.log(b), Karopapier.router.navigate(b, {
                trigger: !0
            }), a.preventDefault(), !1;
        }), this;
    }
}), NotificationControlView = Backbone.View.extend({
    initialize: function() {
        console.log("INIT WEB NOT VIEW"), this.listenTo(this.model, "change:supported", this.updateSupported), 
        this.listenTo(this.model, "change:denied", this.updateDenied), this.listenTo(this.model, "change:final", this.updateFinal), 
        this.listenTo(this.model, "change:enabled", this.updateEnabled);
    },
    events: {
        "change #notificationEnabled": "checkEnabled"
    },
    updateSupported: function() {
        this.model.get("supported") ? (this.$("#statusinfo").attr("data-quicktip", "Dein Browser kann das!"), 
        this.$("#statusinfo").removeClass().addClass("quicktip quicktip-box quicktip-ok")) : (this.$("#notificationEnabled").prop("disabled", !0), 
        this.$("#statusinfo").attr("data-quicktip", "Dein Browser unterst�tzt das leider nicht..."), 
        this.$("#statusinfo").removeClass().addClass("quicktip quicktip-box quicktip-error"));
    },
    updateEnabled: function() {
        this.$("#notificationEnabled").prop("checked", this.model.get("enabled"));
    },
    updateFinal: function() {
        this.model.get("denied") && this.model.get("final") ? this.$("#notificationEnabled").prop("disabled", !0) : this.$("#notificationEnabled").prop("disabled", !1);
    },
    updateDenied: function() {
        this.model.get("denied") && (console.log("DENIED"), this.$("#statusinfo").attr("data-quicktip", "Du hast nicht erlaubt, Benachrichtigungen anzuzeigen."), 
        this.$("#statusinfo").removeClass().addClass("quicktip quicktip-box quicktip-warn"));
    },
    checkEnabled: function() {
        var a = this.$("#notificationEnabled").prop("checked");
        this.model.set("enabled", a);
    },
    render: function() {
        var a = "";
        return a += '<label for="notificationEnabled"> Desktop-Benachrichtigung?', a += '<span id="statusinfo" class="quicktip quicktip-box quicktip-info" data-quicktip="Mal gucken, ob Dein Browser das kann..."> &nbsp;</span>', 
        a += " </label>", a += '<span class="slidercheckbox">', a += '<input id="notificationEnabled" type="checkbox">', 
        a += '<label for="notificationEnabled" class="slidercheckbox_onoff"></label>', a += "</span>", 
        this.$el.html(a), this.updateSupported(), this.updateDenied(), this.updateFinal(), 
        this.updateEnabled(), this;
    }
}), PlayerInfo = Backbone.View.extend({
    tag: "div",
    className: "playerInfo",
    initialize: function() {
        _.bindAll(this, "render");
    },
    render: function() {
        this.$el.html(this.model.get("id") + "-" + this.model.get("name")), this.$el.css({
            position: "absolute",
            top: 100,
            left: 100
        });
    }
}), PlayerTableRowView = Backbone.View.extend({
    tagName: "tr",
    className: "playerTableRow",
    template: window.JST["game/playerTableRow"],
    initialize: function() {
        _.bindAll(this, "render"), this.listenTo(this.model, "change:visible", this.updateVisibility), 
        this.listenTo(this.model, "change:highlight", this.updateHighlight);
    },
    events: {
        "change input": "setVisibility",
        mouseenter: "highlight",
        mouseleave: "unhighlight"
    },
    setVisibility: function(a) {
        $e = $(a.currentTarget), this.model.set("visible", $e.prop("checked"));
    },
    updateVisibility: function() {
        this.$("input").prop("checked", this.model.get("visible"));
    },
    updateHighlight: function() {
        this.model.get("highlight") ? this.$el.addClass("highlight") : this.$el.removeClass("highlight");
    },
    highlight: function() {
        this.model.set("highlight", !0);
    },
    unhighlight: function() {
        this.model.set("highlight", !1);
    },
    render: function() {
        var a = this.model.toJSON(), b = "", c = "", d = this.model.get("status"), e = this.model.get("position");
        return ("kicked" == d || "left" == d) && (b = d, c = this.model.getStatus()), "ok" === d && (this.model.get("dran") ? (b = "dran", 
        c = "dran") : 0 != e ? c = "wurde " + e + "." : this.model.get("moved") ? (c = "war schon", 
        b = "moved") : (c = "kommt noch", b = "tomove")), a.lastmovetime = this.model.getLastMove() ? this.model.getLastMove().get("t") : "-", 
        a.displayStatus = c, a.statusClass = b, this.$el.html(this.template(a)), this;
    }
}), PlayerTableView = Marionette.CompositeView.extend({
    tagName: "table",
    className: "playerCollection playerList thin",
    template: window.JST["game/playerTable"],
    childView: PlayerTableRowView,
    childViewContainer: "tbody",
    initialize: function() {
        _.bindAll(this, "render"), this.listenTo(this.collection, "reset add", this.calcBlocktime);
    },
    events: {
        "change input.checkAll": "checkAll"
    },
    checkAll: function(a) {
        var b = $(a.currentTarget).prop("checked");
        this.collection.each(function(a) {
            a.set("visible", b);
        });
    },
    calcBlocktime: function() {
        var a = new MoveCollection(), b = {};
        this.collection.each(function(c) {
            var d = c.get("id");
            b[d] = 0;
            var e = c.moves.toJSON();
            e.map(function(a) {
                a.userId = d;
            }), a.add(e);
        }), a.comparator = function(a) {
            return new Date(a.get("t").replace(" ", "T") + "Z").getTime();
        }, a.sort(), a.comparator = void 0;
        var c = new Date();
        if (a.length > 0) var c = new Date(a.at(0).get("t").replace(" ", "T") + "Z").getTime();
        a.each(function(a) {
            var d = new Date(a.get("t").replace(" ", "T") + "Z").getTime(), e = a.get("userId");
            b[e] += d - c, c = d;
        }), this.collection.each(function(a) {
            a.set("blocktime", parseInt(b[a.get("id")] / 1e3));
        });
    }
}), PossibleView = Backbone.View.extend({
    tagName: "div",
    className: "possibleMove",
    events: {
        touchstart: "wasTouch",
        click: "checkMove",
        mouseenter: "hoverMove",
        mouseleave: "unhoverMove",
        "click .confirmer": "confirmMove"
    },
    NOWAY: function() {
        alert("YES");
    },
    initialize: function(a) {
        this.mouseOrTouch = "mouse", _.bindAll(this, "checkMove", "hoverMove", "unhoverMove", "render", "cleanup"), 
        a.hasOwnProperty("mapView") || console.error("No mapView for PossiblesView"), this.mapView = a.mapView, 
        this.parent = a.parent, this.settings = this.mapView.settings, this.listenTo(this.model, "change", this.render), 
        this.$confirmer = $('<div class="confirmer" style="position: fixed; bottom: 20px; right:20px; width: 50px; height: 50px; background-color: red">' + this.model.get("vector").toString() + "</div>"), 
        this.$el.append(this.$confirmer.hide());
    },
    wasTouch: function() {
        this.mouseOrTouch = "touch";
    },
    confirmMove: function(a) {
        this.trigger("clicked", this.model), this.mouseOrTouch = "mouse", a.stopPropagation();
    },
    checkMove: function() {
        console.log("Click by ", this.mouseOrTouch), "touch" == this.mouseOrTouch ? (this.model.set("highlight", !0), 
        this.parent.trigger("changeHighlight", this)) : this.trigger("clicked", this.model), 
        this.mouseOrTouch = "mouse";
    },
    hoverMove: function() {
        var a = this.model;
        if (a.get("vector").getLength() > 2.8) {
            var b = a.getStopPosition();
            this.stopDiv = $('<div class="stopPosition" style="left: ' + 12 * b.get("x") + "px; top: " + 12 * b.get("y") + 'px;"></div>'), 
            this.$el.parent().append(this.stopDiv);
        }
    },
    unhoverMove: function() {
        this.stopDiv && this.stopDiv.remove();
    },
    cleanup: function() {
        return this.unhoverMove(), this;
    },
    render: function() {
        var a = this.model.get("vector"), b = this.model.get("position");
        this.$el.css({
            left: 12 * b.get("x"),
            top: 12 * b.get("y")
        }).attr({
            title: this.model.get("vector").toString(),
            "data-motionString": this.model.toString()
        }), this.model.get("highlight") ? (this.$el.addClass("highlight"), this.$confirmer.show()) : (this.$el.removeClass("highlight"), 
        this.$confirmer.hide());
        var c = this.model.get("willCrash");
        return void 0 !== c && this.$el.addClass(this.model.get("willCrash") ? "willCrash" : "noCrash"), 
        "(0|0)" === a.toString() && (this.$el.attr("title", "Start: " + this.model.toKeyString()), 
        this.$el.addClass("isStart")), this;
    }
}), PossiblesView = Backbone.View.extend({
    events: {
        clicked: "clickMove"
    },
    initialize: function(a) {
        _.bindAll(this, "clearPossibles", "checkWillCrash", "render"), a.hasOwnProperty("game") || console.error("No game for PossiblesView"), 
        a.hasOwnProperty("mapView") || console.error("No mapView for PossiblesView"), this.game = a.game, 
        this.mapView = a.mapView, this.settings = this.mapView.settings, this.listenTo(this.game.possibles, "reset", this.render), 
        this.listenTo(this, "changeHighlight", this.checkHighlight), this.highlight = !1;
    },
    clearPossibles: function() {
        _.each(this.views, function(a) {
            a.cleanup().remove();
        }), this.views = [];
    },
    clickMove: function(a) {
        this.trigger("game:player:move", this.game.get("dranId"), a);
    },
    checkWillCrash: function(a, b) {
        b.set("willCrash", a.willCrash(b, 16));
    },
    checkHighlight: function(a) {
        this.highlight && this.highlight.model.set("highlight", !1), a.model.set("highlight", !0), 
        this.highlight = a;
    },
    render: function() {
        this.clearPossibles();
        var a = (this.game.possibles, new KRACHZ({
            map: this.game.map
        }));
        this.game.possibles.each(function(b) {
            var c = new PossibleView({
                mapView: this.mapView,
                model: b,
                parent: this
            }).render();
            setTimeout(this.checkWillCrash.bind(this, a, b), 0), this.$el.append(c.el), this.views.push(c), 
            this.listenTo(c, "clicked", this.clickMove.bind(this));
        }.bind(this));
    }
}), StaticView = Backbone.View.extend({
    initialize: function(a) {
        _.bindAll(this, "template"), this.path = a.path;
    },
    template: function() {
        var a = this.path.replace(".html", "");
        return window.JST["static/" + a];
    },
    render: function() {
        var a = this.template();
        this.$el.html(a), this.$('a[href*=".html"]').click(function(a) {
            var b = $(a.currentTarget).attr("href");
            return console.log(b), Karopapier.router.navigate(b, {
                trigger: !0
            }), a.preventDefault(), !1;
        });
    }
}), StatusView = Backbone.View.extend({
    initialize: function(a) {
        return _.bindAll(this, "render"), a = a || {}, a.model ? void this.listenTo(this.model, "change:completed", this.render) : (console.error("No model for StatusView"), 
        !1);
    },
    render: function() {
        var a = "Du bist nicht dran";
        this.model.get("dranId") === Karopapier.User.get("id") && (a = "Du bist dran, bitte mach Deinen Zug bei " + this.model.get("id")), 
        this.$el.html(a);
    }
}), TitleView = Backbone.View.extend({
    initialize: function(a) {
        _.bindAll(this, "render"), this.title = a.title || "Karopapier", this.model.on("change:dran", this.render);
    },
    render: function() {
        var a = "", b = this.model.get("dran");
        b > 0 && (a += "(" + b + ") "), a += this.title, document.title = a;
    }
}), UserInfoBar = Backbone.View.extend({
    id: "userInfoBar",
    tagName: "div",
    template: window.JST["main/userInfoBar"],
    events: {
        "click .login": "login"
    },
    login: function(a) {
        return a.preventDefault(), console.log("Login now"), !1;
    },
    initialize: function() {
        _.bindAll(this, "render"), this.userView = new UserView({
            model: this.model,
            withGames: !0,
            withAnniversary: !0,
            withDesperation: !1,
            withGamesLink: !0
        }), this.listenTo(this.model, "change", this.render);
    },
    render: function() {
        return 0 !== this.model.get("id") ? (this.$el.html(this.userView.$el), this.$el.append(" "), 
        this.$el.append(this.template())) : this.$el.html('<a class="login" href="/login">Nicht angemeldet</a>'), 
        this;
    }
}), UserView = Backbone.View.extend({
    options: {
        withAnniversary: !0,
        withGames: !1,
        withDesperation: !1,
        withGamesLink: !1,
        withInfoLink: !1
    },
    tagName: "span",
    template: window.JST["user/userView"],
    initialize: function(a) {
        return this.model ? (this.options = _.defaults(a || {}, this.options), _.bindAll(this, "dranChange", "render", "onChange"), 
        this.listenTo(this.model, "change", this.onChange), void this.render()) : (console.error("No model!"), 
        !1);
    },
    onChange: function(a) {
        return a.changed.dran && 1 == _.size(a.changed) ? (this.dranChange(a), !0) : void this.render();
    },
    dranChange: function() {
        var a = this.model.previous("dran"), b = this.model.get("dran");
        if (a >= 0) {
            var c = a > b ? "#00ff00" : "#ff0000";
            this.$el.find("span.userLabel").effect("highlight", {
                color: c
            });
            var d = this.renderedView();
            this.$el.find("small").html($(d).filter("small").html());
        }
    },
    renderedView: function() {
        var a = this.model.toJSON();
        a.self = this.model.get("id") == Karopapier.User.get("id");
        var b = this.template({
            options: this.options,
            data: a
        });
        return b;
    },
    render: function() {
        this.$el.html(this.renderedView());
    }
}), WebNotifierView = Backbone.View.extend({
    initialize: function() {
        console.warn("I AM OBSOLETE"), console.log("INIT WEB NOT VIEW"), this.settings = new Backbone.Model({
            defaults: {
                supported: !1
            }
        });
    },
    unsupportedBrowser: function() {
        console.log("Browser kann nicht"), this.$("#notif").prop("disabled", !0), this.$("#statusinfo").attr("data-quicktip", "Dein Browser unterst�tzt das leider nicht..."), 
        this.$("#statusinfo").removeClass().addClass("quicktip quicktip-box quicktip-error");
    },
    notifPossible: function() {
        console.log("Browser k�nnte"), this.$("#statusinfo").attr("data-quicktip", "Dein Browser kann das!"), 
        this.$("#statusinfo").removeClass().addClass("quicktip quicktip-box quicktip-ok");
    },
    permissionCompletelyDenied: function() {
        console.log("Ich darf echt gar nicht"), this.$("#notif").prop("disabled", !0), this.$("#statusinfo").attr("data-quicktip", "Du hast Karopapier.de nicht erlaubt, Benachrichtigungen anzuzeigen. Das bekommst Du nur mit Browsereinstellungen und reload wieder hin."), 
        this.$("#statusinfo").removeClass().addClass("quicktip quicktip-box quicktip-warn");
    },
    permissionGranted: function() {
        console.log("Ich d�rfte");
    },
    permissionDenied: function() {
        console.log("Ich darf nicht"), this.$("#notif").prop("checked", !1), this.$("#notif").prop("disabled", !0), 
        this.$("#statusinfo").attr("data-quicktip", "Du hast Karopapier.de nicht erlaubt, Benachrichtigungen anzuzeigen."), 
        this.$("#statusinfo").removeClass().addClass("quicktip quicktip-box quicktip-warn");
    },
    webNotif: function() {
        $("#notif").prop("checked") && Notification.requestPermission(showWebNotif, permissionDenied);
    },
    showWebNotif: function() {
        var a = 123, b = "Du bist ein bisschen dran";
        0 == a && (b = "Du bist gar nich dran!"), a > 10 && (b = "Du bist ganz schoen dran!"), 
        a > 20 && (b = "Du bist mal echt voll dran!"), a > 30 && (b = "BOAH!! Du bist sooo dran!"), 
        a > 40 && (b = "LOS! Du bist verdammt dran!");
        var c = "";
        1 != a && (c = "en");
        new BrowserNotifcation({
            title: b,
            tag: "Dran",
            body: "Du musst bei " + a + " Spiel" + c + " ziehen",
            icon: "/favicon.ico",
            timeout: a > 0 ? 0 : 2,
            permissionDenied: permissionDenied,
            notifyClick: function() {
                window.open("//www.karopapier.de/dran");
            }
        }).show();
    },
    check: function() {
        if ("Notification" in window) {
            if ("denied" === Notification.permission) this.permissionCompletelyDenied(); else if (this.notifPossible(), 
            store.enabled) {
                var a = "user.settings.webnotification.dran", b = store.get(a) || !1;
                $("#notif").prop("checked", b);
            }
        } else this.settings.set("supported", !1), this.unsupportedBrowser();
        this.$("#notif").change(function(a) {
            var b = a.currentTarget.checked;
            if (store.enabled) {
                var c = "user.settings.webnotification.dran";
                store.set(c, b);
            }
            b && Notification.requestPermission(this.permissionGranted, this.permissionDenied);
        });
    },
    render: function() {
        var a = "";
        a += '<label for="notif"> Desktop-Benachrichtigung?', a += '<span id="statusinfo" class="quicktip quicktip-box quicktip-info" data-quicktip="Mal gucken, ob Dein Browser das kann..."> &nbsp;</span>', 
        a += " </label>", a += '<span class="slidercheckbox">', a += '<input id="notif" type="checkbox">', 
        a += '<label for="notif" class="slidercheckbox_onoff"></label>', a += "</span>", 
        this.$el.html(a);
    }
}), ChatAppView = Marionette.ItemView.extend({
    className: "chatAppView",
    render: function() {
        console.log(this.model, " is an app"), this.model.layout.render(), this.model.layout.chatMessages.show(this.model.chatMessagesView, {
            preventDestroy: !0
        }), this.model.layout.chatInfo.show(this.model.chatInfoView, {
            preventDestroy: !0
        }), this.model.layout.chatControl.show(this.model.chatControlView, {
            preventDestroy: !0
        }), this.model.layout.chatEnter.show(this.model.chatEnterView, {
            preventDestroy: !0
        }), this.$el.html(this.model.layout.$el);
        var a = this.model.layout.chatMessages.$el;
        $(a).on("scroll", this.model.chatMessagesView.scrollCheck);
    }
}), ChatControlView = Backbone.View.extend({
    tagName: "div",
    template: window.JST["chat/chatControl"],
    initialize: function() {
        return _.bindAll(this, "render"), this.listenTo(Karopapier.User, "change:id", this.render), 
        this.listenTo(this.model, "change:limit", this.render), this.listenTo(this.model, "change:start", this.render), 
        this.listenTo(this.model, "change:lastLineId", this.render), this.listenTo(this.model, "change:history", this.render), 
        this.listenTo(this.model, "change:funny", this.updateFunny), this.listenTo(this.model, "change:oldLink", this.updateOldLink), 
        this.listenTo(this.model, "change:showBotrix", this.updateBotrix), this.notificationControlView = new NotificationControlView({
            model: Karopapier.notificationControl
        }), this;
    },
    events: {
        "click .messageLimit": "setLimit",
        "change #startPicker": "syncStart",
        "input #startPicker": "syncStart",
        "click #startLineUpdate": "setStart",
        "click .toggleTimewarp": "toggleTimewarp",
        "click span.rewind": "rewind",
        "click span.forward": "forward",
        "click #funnyChat": "setLinkifyFun",
        "click #oldLink": "setOldLink",
        "click #showBotrix": "setShowBotrix"
    },
    setStart: function() {
        var a = parseInt(this.$el.find("#startLine").val());
        this.model.set("start", a);
    },
    syncStart: function(a) {
        var b = parseInt(a.currentTarget.value);
        $("#startLine").val(b);
    },
    setLimit: function(a) {
        var b = parseInt($(a.currentTarget).text());
        this.model.set("limit", b);
    },
    rewind: function() {
        var a = this.model.get("start");
        a > 100 && (a -= 100), this.model.set("start", a);
    },
    forward: function() {
        var a = this.model.get("start"), b = this.model.get("limit");
        a += 100, b += 100, this.model.set({
            start: a
        });
    },
    toggleTimewarp: function() {
        var a = this.model.get("history"), b = {};
        b.history = !a, b.limit = 100, b.limit = a ? 20 : 100, this.model.set(b);
    },
    setLinkifyFun: function(a) {
        var b = $(a.currentTarget).prop("checked");
        this.model.set("funny", b);
    },
    setShowBotrix: function(a) {
        var b = $(a.currentTarget).prop("checked");
        this.model.set("showBotrix", b);
    },
    setOldLink: function(a) {
        var b = $(a.currentTarget).prop("checked");
        this.model.set("oldLink", b);
    },
    updateFunny: function() {
        this.$el.find("#funnyChat").prop("checked", this.model.get("funny"));
    },
    updateOldLink: function() {
        this.$el.find("#oldLink").prop("checked", this.model.get("oldLink"));
    },
    updateBotrix: function() {
        this.$el.find("#showBotrix").prop("checked", this.model.get("showBotrix"));
    },
    render: function() {
        return console.log("Render control view", this.model.get("start"), this.model.get("lastLineId")), 
        0 != Karopapier.User.get("id") ? (this.$el.html(this.template({
            user: Karopapier.User.toJSON(),
            settings: this.model.toJSON()
        })), this.notificationControlView.setElement(this.$("#notificationControlView")).render()) : this.$el.html("Nicht angemeldet"), 
        this;
    }
}), ChatEnterView = Backbone.View.extend({
    tagName: "div",
    template: window.JST["chat/chatEnter"],
    initialize: function() {
        return _.bindAll(this, "render"), this.listenTo(Karopapier.User, "change:id", this.render), 
        this;
    },
    events: {
        submit: "sendMessage"
    },
    sendMessage: function(a) {
        a.preventDefault();
        var b = $("#newchatmessage").val();
        "" != b && ($.ajax({
            url: "//www.karopapier.de/api/chat/message.json",
            type: "POST",
            method: "POST",
            crossDomain: !0,
            data: {
                msg: b
            },
            dataType: "json",
            xhrFields: {
                withCredentials: !0
            },
            success: function() {
                $("#newchatmessage").val(""), $("#newchatmessagesubmit").prop("disabled", !1).stop().animate({
                    opacity: 1
                });
            },
            error: function(a, b) {
                console.error(b, a), $("#newchatmessagesubmit").prop("disabled", !1).stop().animate({
                    opacity: 1
                });
            }
        }), $("#newchatmessagesubmit").prop("disabled", !0).stop().animate({
            opacity: 0
        }));
    },
    render: function() {
        return this.$el.html(0 != Karopapier.User.get("id") ? this.template({
            user: Karopapier.User.toJSON()
        }) : "Nicht angemeldet"), this;
    }
}), ChatInfoView = Backbone.Marionette.ItemView.extend({
    tagName: "div",
    className: "chatInfoView",
    template: window.JST["chat/chatInfo"],
    initialize: function() {
        _.bindAll(this, "updateInfos", "updateTopBlocker", "updateHabdich", "updateDranInfo", "updateChatUser", "render"), 
        this.$el.html(this.template), this.chatUserCollection = new ChatUserCollection(), 
        this.chatUsersView = new ChatUsersView({
            collection: this.chatUserCollection,
            el: this.$("#chatUsers")
        }).render(), this.listenTo(this.chatUserCollection, "add remove reset change", this.updateHabdich), 
        this.model.on("change:id", this.updateInfos), this.model.on("change:dran", this.updateInfos), 
        this.dranInterval = setInterval(this.updateDranInfo, 6e4), this.blockerInterval = setInterval(this.updateTopBlocker, 6e4), 
        this.userInterval = setInterval(this.updateChatUser, 6e4), setTimeout(_.bind(this.updateChatUser), 1e3), 
        this.updateInfos();
    },
    onClose: function() {
        clearInterval(this.blockerInterval);
    },
    updateChatUser: function() {
        this.chatUserCollection.fetch();
    },
    updateInfos: function() {
        this.updateDranInfo(), this.updateHabdich(), this.updateTopBlocker();
    },
    updateDranInfo: function() {
        var a = this.model.get("id");
        if (0 != a) {
            var b;
            $.getJSON("//www.karopapier.de/api/user/blockerlist.json?callback=?", function(c) {
                blockerlist = c;
                var d = this.model.get("dran");
                if (0 == d && (b = 'Du bist ein <a href="//www.karopapier.de/karowiki/index.php/Nixblocker">Nixblocker</a>'), 
                1 == d && (b = "Bei einem Spiel dran"), d > 1 && (b = '<a href="/dran.html" target="ibndran">Bei <strong>' + d + '</strong> Spielen dran</a> <a href=""">'), 
                d > 0) {
                    var e = Karopapier.UserDranGames.at(0);
                    e && (b += '<br><a title="ZIEH!" href="/game.html?GID=' + e.get("id") + '"><b>Zieh!</b><img src="/images/arrow_right.png" style="vertical-align: center"></a>');
                }
                $("#chatInfoDran").html(b);
                var f = 0;
                if (blockerlist.length > 0) for (var g = blockerlist.length, h = 0; g > h; h++) blockerlist[h].id == a && (f = h + 1, 
                h = g + 100);
                b = "", f > 0 && (b += 1 == f ? "DU BIST DER <b>VOLLBLOCKER</b>" : 2 == f ? "DU BIST DER <b>VIZE-VOLLBLOCKER</b>" : "Platz " + f + ' der <a href="//www.karopapier.de/blocker">Blockerliste</a>'), 
                $("#chatInfoBlockerRank").html(b);
            }.bind(this));
        }
    },
    updateHabdich: function() {
        var a = _.reduce(this.chatUserCollection.pluck("dran"), function(a, b) {
            return a + b;
        }, 0);
        this.$("#chatHabdich").text(a);
    },
    updateTopBlocker: function() {
        if (0 != this.model.get("id")) {
            var a;
            $.getJSON("//www.karopapier.de/api/user/" + this.model.get("id") + "/blocker.json?callback=?", function(b) {
                if (b.length > 0) {
                    var c = b[0];
                    a = "Dein Top-Blocker: " + c.login + " (" + c.blocked + ")";
                } else a = "";
                $("#chatInfoTopBlocker").html(a);
            });
        }
    },
    render: function() {
        return this;
    }
}), ChatMessageView = Backbone.View.extend({
    tagName: "div",
    className: "chatMessage",
    template: window.JST["chat/chatMessage"],
    id: function() {
        return "cm" + this.model.get("lineId");
    },
    initialize: function() {
        _.bindAll(this, "render");
        var a = /Botrix, spiel mit/g, b = /.*fahr ich jetzt in Grund und Boden!/g, c = /.*mach ich jetzt Ruehrei/g, d = /.*Direktlink/g, e = this.model.get("text");
        (e.match(a) || e.match(b) || e.match(c) || e.match(d)) && (this.model.set("isBotrixGameMessage", !0), 
        this.$el.addClass("botrixGame")), this.render(), this.checkVisible(), this.listenTo(this.model, "remove", this.remove), 
        this.listenTo(this.model, "change:funny change:oldLink", this.updateText), this.listenTo(this.model, "change:showBotrix", this.checkVisible);
    },
    updateText: function() {
        var a = this, b = $("<span>");
        b.html(this.model.get("text"));
        var c = b.text();
        c = KaroUtil.linkify(c), c = emojione.unicodeToImage(c);
        var d = this.$el.find(".chatText").first();
        d.html(c);
        var e = (this.$el.find("img").load(function() {
            var b = a.$el.parent().parent(), c = a.$el.height(), d = b.scrollTop(), f = d + c - e;
            b.scrollTop(f);
        }), -1);
        setTimeout(function() {
            e = a.$el.height();
        }, 5);
    },
    checkVisible: function() {
        var a = this.model.get("showBotrix"), b = this.model.get("isBotrixGameMessage");
        b && !a ? this.$el.hide() : this.$el.show();
    },
    render: function() {
        var a = this.model.toJSON();
        return a.text = "", this.$el.html(this.template(a)), this.updateText(), this;
    }
}), ChatMessagesView = Backbone.View.extend({
    tagName: "div",
    id: "chatMessagesContainer",
    initialize: function() {
        _.bindAll(this, "addItem", "scrollCheck"), this.collection.on("add", this.addItem), 
        this.currentStart = 0, this.currentEnd = 0;
    },
    scrollcheck: function() {
        console.log("I scroll");
        var a = this.$el.parent(), b = (a.prop("scrollHeight") - a.prop("clientHeight") - a.prop("scrollTop"), 
        $("#chatMessages")), c = b.prop("scrollTop"), d = b.prop("scrollHeight");
        console.log(c, d);
    },
    addItem: function(a) {
        var b = new ChatMessageView({
            model: a
        }), c = parseInt(a.get("lineId")), d = this.$el.find("#cm" + (c - 1)), e = this.$el.parent(), f = e.prop("scrollHeight"), g = e.scrollTop();
        d[0] ? d.after(b.$el) : this.$el.prepend(b.$el);
        var h = e.prop("scrollHeight");
        e.scrollTop(g + h - f);
    },
    removeItem: function(a) {
        console.log(a.get("lineId"), "removed");
    },
    scrollDown: function(a) {
        var b = this.$el.parent();
        a = _.defaults(a || {}, {
            forced: !1,
            animated: !0
        });
        var b = this.$el.parent(), c = b.prop("scrollHeight") - b.prop("clientHeight") - b.prop("scrollTop");
        return c > 40 && !a.forced ? !1 : void setTimeout(function() {
            b.stop().animate({
                scrollTop: b.prop("scrollHeight")
            }, 100);
        }, 10);
    },
    scrollCheck: function() {
        {
            var a = this.$el.parent(), b = (a.prop("scrollHeight"), a.prop("scrollTop"));
            a.prop("clientHeight");
        }
        100 >= b && this.trigger("CHAT:MESSAGES:TOP");
    }
}), ChatUsersView = Marionette.CollectionView.extend({
    tagName: "ul",
    className: "chatUsersView",
    childView: UserView,
    childViewOptions: {
        tagName: "li",
        withGames: !0,
        withAnniversary: !0,
        withDesperation: !0,
        withGamesLink: !0,
        withInfoLink: !0
    }
}), EditorCodeView = Backbone.View.extend({
    initialize: function(a) {
        return a = a || {}, a.model ? void 0 : (console.error("No map for EditorCodeView"), 
        !1);
    },
    events: {
        "blur .mapCodeView": "sanity"
    },
    sanity: function() {
        this.model.sanitize();
    },
    render: function() {
        var a = new MapCodeView({
            className: "mapCodeView",
            model: this.model,
            readonly: !1
        });
        this.$el.append(a.$el);
    }
}), EditorImageTranslatorInfoView = Marionette.ItemView.extend({
    template: window.JST["editor/imagetranslatorinfo"],
    initialize: function() {
        this.listenTo(this.model, "change", this.render);
    }
}), EditorImageTranslatorPreview = Marionette.ItemView.extend({
    tagName: "canvas",
    initialize: function(a) {
        if (_.bindAll(this, "drop"), a = a || {}, !a.imageTranslator) return console.error("No imageTranslator passed to EditorImageTranslatorPreview"), 
        !1;
        this.imageTranslator = a.imageTranslator, this.canvas = this.el, this.ctx = this.canvas.getContext("2d");
        var b = this;
        this.img = new Image(), this.img.onload = function() {
            var a = b.img.width, c = b.img.height;
            b.canvas.width = a, b.canvas.height = c, b.ctx.drawImage(b.img, 0, 0);
        }, this.img.src = "/images/dragdropcat.png", this.imageTranslator.settings.set("active", !1), 
        this.listenTo(this.imageTranslator.settings, "change", this.render);
    },
    events: {
        dragover: "prevent",
        drop: "drop"
    },
    prevent: function(a) {
        return a.preventDefault(), !1;
    },
    drop: function(a) {
        a.preventDefault();
        var b = a.originalEvent, c = this, d = b.dataTransfer.files;
        if (d.length > 0) {
            var e = d[0];
            if ("undefined" != typeof FileReader && -1 != e.type.indexOf("image")) {
                var f = new FileReader();
                f.onload = function(a) {
                    c.img.src = a.target.result, c.img.onload = function() {
                        c.imageTranslator.loadImage(c.img);
                    };
                }, f.readAsDataURL(e);
            }
        }
        a.preventDefault();
    },
    render: function() {
        if (!this.imageTranslator.settings.get("active")) return !0;
        this.canvas.width = this.imageTranslator.settings.get("sourceWidth"), this.canvas.height = this.imageTranslator.settings.get("sourceHeight");
        var a = this.imageTranslator.getImageData();
        this.ctx.putImageData(a, 0, 0), console.info("Now add grid");
    }
}), EditorImageTranslatorSettingsView = Marionette.ItemView.extend({
    template: window.JST["editor/imagetranslatorsettings"],
    initialize: function(a) {
        return a = a || {}, a.imageTranslator ? (this.imageTranslator = a.imageTranslator, 
        _.bindAll(this, "changeScale", "changeSetting", "update", "run"), this.listenTo(this.imageTranslator.settings, "change:active", this.render), 
        this.listenTo(this.imageTranslator.settings, "change:binary", this.render), this.listenTo(this.imageTranslator.settings, "change", this.update), 
        void this.listenTo(this.imageTranslator.editorsettings, "change:buttons", this.render)) : void console.error("No imageTranslator passed to TranslatorSettingsView");
    },
    events: {
        "click button": "run",
        "input input[name='scaleWidth']": "changeScale",
        "click input[name='invert']": "changeSetting",
        "click input[name='speedmode']": "changeSetting",
        "click input[name='binary']": "changeSetting"
    },
    update: function() {
        this.$(".editor-imagetranslator-settings-invert").prop("checked", this.imageTranslator.settings.get("invert")), 
        this.$(".editor-imagetranslator-settings-speedmode").prop("checked", this.imageTranslator.settings.get("speedmode")), 
        this.$(".editor-imagetranslator-settings-binary").prop("checked", this.imageTranslator.settings.get("binary")), 
        this.$(".editor-imagetranslator-settings-scaleWidth").val(this.imageTranslator.settings.get("scaleWidth"));
    },
    changeSetting: function() {
        var a = this.$(".editor-imagetranslator-settings-binary").prop("checked");
        this.imageTranslator.settings.set("binary", a);
        var b = this.$(".editor-imagetranslator-settings-invert").prop("checked");
        this.imageTranslator.settings.set("invert", b);
        var c = this.$(".editor-imagetranslator-settings-speedmode").prop("checked");
        this.imageTranslator.settings.set("speedmode", c), console.log("Now bin invert, speed", a, b, c);
    },
    changeScale: function() {
        var a = parseInt(this.$(".editor-imagetranslator-settings-scaleWidth").val());
        1 > a && (a = 1), this.imageTranslator.settings.setScale(a);
    },
    run: function() {
        this.imageTranslator.run();
    },
    render: function() {
        var a = this.imageTranslator.settings.toJSON();
        _.defaults(a, this.imageTranslator.editorsettings.toJSON()), this.$el.html(this.template(a)), 
        this.update();
    }
}), EditorMapView = Backbone.View.extend({
    initialize: function(a) {
        return a = a || {}, a.viewsettings ? a.editorsettings ? (_.bindAll(this, "render", "draw", "mousedown", "mouseup", "mousemove", "mouseleave", "recalcDimensions"), 
        this.viewsettings = a.viewsettings, this.editorsettings = a.editorsettings, this.resizeHandleWidth = 15, 
        this.listenTo(this.model, "change:mapcode", this.recalcDimensions), this.buttonDown = [ !1, !1, !1, !1 ], 
        this.drawing = !1, void (this.resizing = !1)) : void console.error("No editorsettings passed to EditorMapView") : void console.error("No viewsettings passed to EditorMapView");
    },
    render: function() {
        this.mapRenderView = new MapRenderView({
            settings: this.viewsettings,
            model: this.model
        }), this.listenTo(this.mapRenderView, "render", this.recalcDimensions), this.setElement(this.mapRenderView.el), 
        this.$el.css("border", this.resizeHandleWidth + "px solid lightgrey"), this.mapRenderView.render();
    },
    events: {
        mouseleave: "mouseleave",
        mouseenter: "mouseenter",
        mousedown: "mousedown",
        mouseup: "mouseup",
        mousemove: "mousemove",
        contextmenu: "rightclick"
    },
    rightclick: function(a) {
        return this.editorsettings.get("rightclick") ? (a.preventDefault(), !1) : void 0;
    },
    xyFromE: function(a) {
        var b = a.pageX - this.offLeft, c = a.pageY - this.offTop;
        return {
            x: b,
            y: c
        };
    },
    draw: function(a) {
        for (var b = this.xyFromE(a), c = b.x - this.resizeHandleWidth, d = b.y - this.resizeHandleWidth, e = this.editorsettings.get("buttons"), f = 1; 3 >= f; f++) this.buttonDown[f] && this.mapRenderView.setFieldAtXY(c, d, e[f]);
    },
    resize: function(a) {
        if (!this.resize) return !1;
        var b = (a.target, this.xyFromE(a));
        if (this.currentDirections.we) {
            var c = b.x - this.resizeHandleWidth, d = Math.floor((c - this.startX) / this.fieldsize) > 0, e = Math.ceil((c - this.startX) / this.fieldsize) < 0;
            this.currentDirections.e && (d && (this.model.addCol(1), this.startX += this.fieldsize), 
            e && (this.model.delCol(1), this.startX -= this.fieldsize)), this.currentDirections.w && (e && (this.model.addCol(1, 0), 
            this.startX -= this.fieldsize), d && (this.model.delCol(1, 0), this.startX += this.fieldsize));
        }
        if (this.currentDirections.ns) {
            var f = b.y - this.resizeHandleWidth, g = Math.floor((f - this.startY) / this.fieldsize) > 0, h = Math.ceil((f - this.startY) / this.fieldsize) < 0;
            this.currentDirections.s && (g && (this.model.addRow(1), this.startY += this.fieldsize), 
            h && (this.model.delRow(1), this.startY -= this.fieldsize)), this.currentDirections.n && (h && (this.model.addRow(1, 0), 
            this.startY -= this.fieldsize), g && (this.model.delRow(1, 0), this.startY += this.fieldsize));
        }
    },
    recalcDimensions: function() {
        this.w = this.$el.width(), this.h = this.$el.height();
        var a = this.$el.offset();
        this.offLeft = Math.round(a.left), this.offTop = Math.round(a.top), this.outW = this.$el.outerWidth(), 
        this.outH = this.$el.outerHeight();
    },
    resizeDirections: function(a) {
        var b = {
            we: "",
            ns: "",
            n: !1,
            s: !1,
            w: !1,
            e: !1
        }, c = this.xyFromE(a), d = c.x, e = c.y, f = this.resizeHandleWidth, g = this.w, h = this.h;
        return f > d && (b.we = "w", b.w = !0), d > g + f && (b.we = "e", b.e = !0), f > e && (b.ns = "n", 
        b.n = !0), e > h + f && (b.ns = "s", b.s = !0), b.direction = b.ns + b.we, b;
    },
    mousedown: function(a) {
        var b = a.which;
        if (3 == b && !this.editorsettings.get("rightclick")) return !0;
        this.currentDirections = this.resizeDirections(a), this.fieldsize = this.viewsettings.get("size") + this.viewsettings.get("border"), 
        this.editorsettings.set("undo", !1), this.buttonDown[a.which] = !0;
        var c = this.xyFromE(a);
        if ("" !== this.currentDirections.direction) return this.startX = c.x - this.resizeHandleWidth, 
        this.startY = c.y - this.resizeHandleWidth, this.resizing = !0, a.preventDefault(), 
        $(document).bind("mousemove", _.bind(this.mousemove, this)), $(document).bind("mouseup", _.bind(this.mouseup, this)), 
        !1;
        if ("floodfill" == this.editorsettings.get("drawmode")) {
            for (var d = c.x - this.resizeHandleWidth, e = c.y - this.resizeHandleWidth, f = this.editorsettings.get("buttons"), g = 1; 3 >= g; g++) this.buttonDown[g] && this.mapRenderView.floodfill(d, e, f[g]);
            return !0;
        }
        return this.drawing = !0, this.draw(a), !0;
    },
    mouseup: function(a) {
        this.editorsettings.set("undo", !0), this.drawing = !1, this.resizing = !1, this.buttonDown[a.which] = !1, 
        $(document).unbind("mousemove"), $(document).unbind("mouseup");
    },
    mouseenter: function() {
        0 == this.offTop && this.recalcDimensions();
    },
    mousemove: function(a) {
        if (this.drawing) return this.draw(a), !0;
        if (this.resizing) return this.resize(a), !0;
        if ("CANVAS" !== a.target.tagName.toUpperCase()) return !1;
        var b = this.resizeDirections(a);
        this.el.style.cursor = b.direction ? b.direction + "-resize" : "crosshair";
    },
    mouseleave: function(a) {
        this.drawing = !1;
        for (var b = 1; 3 >= b; b++) this.buttonDown[a.which] = !1;
    }
}), EditorToolsButtonsView = Marionette.ItemView.extend({
    initialize: function(a) {
        return a = a || {}, a.editorsettings ? (this.editorsettings = a.editorsettings, 
        void this.listenTo(this.editorsettings, "change:buttons", this.update)) : void console.error("No editorsettings passed to EditorToolsButtonView");
    },
    urlFor: function(a) {
        return "/css/mapfields/" + a + ".png?v=25";
    },
    update: function(a, b) {
        for (var c = a.previous("buttons"), d = b, e = 1; 3 >= e; e++) c[e] != d[e] && this.$(".button" + e).attr("src", this.urlFor(d[e]));
    },
    render: function() {
        for (var a = this.editorsettings.get("buttons"), b = "Aktuelle Mausbelegung<br />Links, Mitte, Rechts: ", c = 1; 3 >= c; c++) b += '<img src="' + this.urlFor(a[c]) + '" class="button' + c + '" > ';
        this.$el.html(b);
    }
}), EditorToolsFieldsView = Marionette.ItemView.extend({
    initialize: function(a) {
        return a = a || {}, a.editorsettings ? (this.editorsettings = a.editorsettings, 
        this.listenTo(this.editorsettings, "change:buttons", this.update), this.listenTo(this.editorsettings, "change:rightclick", this.update), 
        this.listenTo(this.editorsettings, "change:drawmode", this.update), void _.bindAll(this, "setRightclick", "update", "selectField", "selectDrawmode")) : void console.error("No editorsettings passed to EditorToolsFieldsView");
    },
    events: {
        "contextmenu .editor-tools-fields-field": "rightclick",
        "change input": "setRightclick",
        "mousedown .editor-tools-fields-field": "selectField",
        "click .editor-tools-fields-drawmode": "selectDrawmode"
    },
    setRightclick: function() {
        var a = this.$(".editor-tools-fields-rightclick").prop("checked");
        this.editorsettings.set("rightclick", a);
    },
    rightclick: function(a) {
        return this.editorsettings.get("rightclick") ? (a.preventDefault(), !1) : void 0;
    },
    update: function() {
        var a = this.editorsettings.get("buttons");
        this.$(".editor-tools-fields-field").removeClass("activeField"), this.$('.editor-tools-fields-field[data-field="' + a[1] + '"]').addClass("activeField"), 
        this.$(".editor-tools-fields-drawmode").removeClass("activeField"), this.$('.editor-tools-fields-drawmode[data-drawmode="' + this.editorsettings.get("drawmode") + '"]').addClass("activeField"), 
        this.$(".editor-tools-fields-rightclick").prop("checked", this.editorsettings.get("rightclick"));
    },
    selectField: function(a) {
        var b = $(a.currentTarget).data("field"), c = a.which;
        return 3 != c || this.editorsettings.get("rightclick") ? void this.editorsettings.setButtonField(c, b) : !1;
    },
    selectDrawmode: function(a) {
        var b = $(a.currentTarget).data("drawmode");
        this.editorsettings.set("drawmode", b);
    },
    render: function() {
        this.$el.empty();
        for (var a = new Map(), b = [ "OX", "SFP", "123456789", "GLNVTWYZ" ], c = "", d = 0; d < b.length; d++) {
            for (var e = b[d], f = 0, g = e.length; g > f; f++) {
                var h = e[f];
                c += '<img src="/css/mapfields/' + h + '.png?v=201512181836" class="editor-tools-fields-field" data-field="' + h + '" title="' + a.FIELDS[h] + '" />';
            }
            c += "<br/>";
        }
        c += '<img src = "/images/draw.png" class="editor-tools-fields-drawmode" data-drawmode="draw" /> <img src = "/images/floodfill.png"  class="editor-tools-fields-drawmode" data-drawmode="floodfill"  /><br />', 
        c += '<label>Rechtsklick zum Malen? <input type="checkbox" name="rightclick" class="editor-tools-fields-rightclick"</label>', 
        this.$el.html(c), this.update();
    }
}), EditorToolsMaploadView = Marionette.ItemView.extend({
    template: window.JST["editor/mapload"],
    initialize: function(a) {
        return a.editorApp ? (this.editorApp = a.editorApp, this.model = a.map, void _.bindAll(this, "karoMapChange")) : void console.error("No editorApp passed to EditorToolsMaploadView");
    },
    events: {
        "change .karoMaps": "karoMapChange"
    },
    karoMapChange: function() {
        var a = this.$(".karoMaps").val(), b = this.editorApp.karoMaps.get(a), c = b.get("mapcode");
        this.editorApp.map.setMapcode(c);
    },
    render: function() {
        this.$el.empty(), this.$el.html(this.template()), this.karoMapListView = new MapListView({
            collection: this.editorApp.karoMaps,
            el: this.$("select")
        }), this.karoMapListView.render(), this.editorApp.karoMaps.fetch();
    }
}), EditorToolsSettingsView = Marionette.ItemView.extend({
    template: window.JST["editor/viewsettings"],
    initialize: function(a) {
        return a = a || {}, a.viewsettings ? (this.viewsettings = a.viewsettings, this.listenTo(this.viewsettings, "change:size change:border", this.update), 
        this.listenTo(this.viewsettings, "change:specles", this.update), void _.bindAll(this, "changeSizeBorder", "changeSpecles")) : void console.error("No viewsettings passed to EditorToolsSettingsView");
    },
    events: {
        "input input[name='size']": "changeSizeBorder",
        "input input[name='border']": "changeSizeBorder",
        "change input[name='specles']": "changeSpecles"
    },
    changeSizeBorder: function() {
        var a = parseInt(this.$(".editor-tools-settings-size").val()), b = parseInt(this.$(".editor-tools-settings-border").val());
        1 > a && (a = 1), a > 50 && (a = 50), b > 20 && (b = 20), 0 > b && (b = 0), this.viewsettings.set({
            size: a,
            border: b
        });
    },
    changeSpecles: function() {
        var a = this.$(".editor-tools-settings-specles").prop("checked");
        this.viewsettings.set("specles", a);
    },
    update: function() {
        this.$(".editor-tools-settings-size").val(this.viewsettings.get("size")), this.$(".editor-tools-settings-border").val(this.viewsettings.get("border")), 
        this.$(".editor-tools-settings-specles").prop("checked", this.viewsettings.get("specles"));
    },
    render: function() {
        this.$el.html(this.template());
    }
}), EditorToolsToolboxView = Marionette.ItemView.extend({
    initialize: function(a) {
        return a = a || {}, a.editorsettings ? (a = a || {}, a.editorUndo ? (this.editorsettings = a.editorsettings, 
        this.editorUndo = a.editorUndo, void this.listenTo(this.editorUndo, "change:undoStack", this.updateUndoCount)) : void console.error("No editorUndo passed to EditorToolsToolboxView")) : void console.error("No editorsettings passed to EditorToolsToolboxView");
    },
    events: {
        "click button": "undo"
    },
    undo: function() {
        this.editorUndo.undo();
    },
    updateUndoCount: function() {
        this.undoButton.text("Undo (" + this.editorUndo.undoStack.length + ")");
    },
    render: function() {
        this.undoButton = $('<button title="Strg+z">Undo</button>'), this.$el.html(this.undoButton), 
        this.updateUndoCount();
    }
}), MapBaseView = Marionette.View.extend({
    optionDefaults: {
        size: 12,
        border: 1,
        cpsActive: !0,
        cpsVisited: []
    },
    initialize: function(a) {
        if (a = a || {}, _.bindAll(this, "updateFieldSize", "getRowColFromXY", "getRowFromY", "getColFromX", "getXYFromRowCol", "getXFromCol", "getYFromRow", "getFieldAtXY", "setFieldAtXY", "setFieldAtRowCol"), 
        _.defaults(a, this.optionDefaults), a.settings) {
            var b = a.settings.attributes;
            _.defaults(b, this.optionDefaults), this.settings = a.settings, this.settings.set(b);
        } else this.settings = new Backbone.Model(a);
        return a.model ? (this.listenTo(this.settings, "change:size change:border", this.updateFieldSize), 
        void this.updateFieldSize()) : (console.error("No Map model for MapView"), !1);
    },
    updateFieldSize: function() {
        this.fieldSize = this.settings.get("size") + this.settings.get("border");
    },
    getRowColFromXY: function(a, b) {
        return {
            r: this.getRowFromY(b),
            c: this.getColFromX(a)
        };
    },
    getRowFromY: function(a) {
        return Math.floor(a / this.fieldSize);
    },
    getColFromX: function(a) {
        return Math.floor(a / this.fieldSize);
    },
    getXYFromRowCol: function(a, b) {
        return {
            x: this.getXFromCol(b),
            y: this.getYFromRow(a)
        };
    },
    getXFromCol: function(a) {
        return (a + .5) * this.fieldSize;
    },
    getYFromRow: function(a) {
        return (a + .5) * this.fieldSize;
    },
    getFieldAtXY: function(a, b) {
        alert("Deprecated");
        var c = this.getRowColFromXY(a, b);
        return this.model.getFieldAtRowCol(c.r, c.c);
    },
    floodfill: function(a, b, c) {
        {
            var d = this.getRowColFromXY(a, b);
            this.model.getFieldAtRowCol(d.r, d.c);
        }
        this.model.floodfill(d.r, d.c, c);
    },
    setFieldAtXY: function(a, b, c) {
        var d = this.getRowColFromXY(a, b), e = this.model.getFieldAtRowCol(d.r, d.c);
        e != c && this.setFieldAtRowCol(d.r, d.c, c);
    },
    setFieldAtRowCol: function(a, b, c) {
        this.model.setFieldAtRowCol(a, b, c);
    }
}), MapCodeView = Backbone.View.extend({
    tagName: "textarea",
    initialize: function(a) {
        _.defaults(a, {
            readonly: !0
        }), this.readonly = a.readonly, _.bindAll(this, "render", "setBounds", "setCode", "getCode", "updateModel"), 
        this.listenTo(this.model, "change:rows change:cols", this.setBounds), this.listenTo(this.model, "change:mapcode", this.setCode), 
        this.listenTo(this.model, "change:field", this.setCode), this.render(), this.readonly ? this.makeReadonly() : this.makeEditable();
    },
    makeReadonly: function() {
        this.$el.attr("disabled", "disabled"), this.undelegateEvents();
    },
    makeEditable: function() {
        this.delegateEvents({
            keyup: "updateModel"
        });
    },
    setBounds: function() {
        this.$el.attr({
            rows: this.model.get("rows") + 1,
            cols: this.model.get("cols") + 5
        });
    },
    setCode: function() {
        this.$el.val(this.model.get("mapcode"));
    },
    getCode: function() {
        return this.$el.val();
    },
    updateModel: function() {
        this.model.set("mapcode", this.getCode());
    },
    render: function() {
        this.setBounds(), this.setCode();
    }
}), MapImageView = MapBaseView.extend({
    className: "mapImageView",
    tag: "img",
    initialize: function() {
        this.constructor.__super__.initialize.apply(this, arguments), _.bindAll(this, "render"), 
        this.listenTo(this.model, "change:id", this.render), this.listenTo(this.settings, "change", this.render);
    },
    render: function() {
        var a = this.model.get("id");
        if (0 === a) this.$el.hide(); else {
            var b = this.settings.get("cpsActive") === !0 ? 1 : 0;
            this.$el.show(), this.$el.attr("src", "//www.karopapier.de/images/loading.gif"), 
            this.$el.attr("src", "//www.karopapier.de/map/" + a + ".png?size=" + this.settings.get("size") + "&border=" + this.settings.get("border") + "&cps=" + b);
        }
    }
}), MapListItemView = Backbone.View.extend({
    tagName: "option",
    render: function() {
        this.$el.attr("value", this.model.get("id")), this.$el.html(this.model.get("id") + " - " + this.model.get("name"));
    }
}), MapListView = Marionette.CollectionView.extend({
    tagName: "select",
    childView: MapListItemView,
    childViewContainer: "select",
    template: window.JST["map/listView"],
    events: {
        "change select": "selected"
    },
    selected: function(a) {
        var b = $(a.currentTarget), c = b.val(), d = this.collection.get(c);
        this.trigger("selected", d);
    }
}), MapPlayerLayer = Backbone.View.extend({
    tag: "img",
    optionDefaults: {
        size: 11,
        border: 1
    },
    initialize: function(a) {
        return alert("I HAVE BEEN USED"), this.model ? (_.bindAll(this, "render"), _.defaults(a, this.optionDefaults), 
        this.settings = new Backbone.Model(a), this.listenTo(this.settings, "change:size change:border", this.render), 
        void this.listenTo(this.model, "change:id", this.render)) : (console.error("Missing Model"), 
        !1);
    },
    render: function() {
        var a = this.model.get("id");
        if (0 === a) this.$el.hide(); else {
            this.$el.show(), this.$el.attr("src", "//www.karopapier.de/images/loading.gif");
            var b = 2;
            this.model.get("finished") && (b = 0), this.$el.attr("src", "//www.karopapier.de/imgenerateFG.php?GID=" + a + "&pixel=" + this.settings.get("size") + "&karoborder=" + this.settings.get("border") + "&limit=" + b);
        }
    }
}), MapPlayerMoves = Backbone.View.extend({
    optionDefaults: {
        visible: !0
    },
    initialize: function(a) {
        _.bindAll(this, "resize", "hidePlayerInfo", "showPlayerInfo"), a = a || {}, a.settings || console.error("No settings for MapPlayerMoves"), 
        this.settings = a.settings, this.w = a.w, this.h = a.h, this.listenTo(this.settings, "change:size change:border ", this.render), 
        this.listenTo(this.model, "change:drawLimit", this.render), this.listenTo(this.model, "change:visible", this.visibility), 
        this.listenTo(this.model, "change:highlight", this.highlight), this.color = "#" + this.model.get("color");
    },
    events: {
        "mouseenter .playerPosition": "showPlayerInfo",
        "mouseleave .playerPosition": "hidePlayerInfo"
    },
    render: function() {
        this.g ? this.$el.empty() : this.createGroup(), this.resize(), this.addMoves(), 
        this.addPosition(), this.visibility();
    },
    createGroup: function() {
        this.g = KaroUtil.createSvg("g", {
            "class": "playerMoves"
        }), this.setElement(this.g);
    },
    addPosition: function() {
        if (this.model.moves.length < 1) return !1;
        var a = this.model.getLastMove(), b = KaroUtil.createSvg("circle", {
            cx: a.get("x") * this.fieldsize + this.size / 2,
            cy: a.get("y") * this.fieldsize + this.size / 2,
            r: 4,
            fill: this.color,
            "class": "playerPosition",
            "data-playerId": this.model.get("id")
        });
        this.$el.append(b);
    },
    addMoves: function() {
        if (this.model.moves.length <= 1) return !1;
        var a = this.model.get("drawLimit"), b = this.color, c = document.createDocumentFragment(), d = this.model.moves.toArray();
        if (a >= 0 && (d = this.model.moves.last(a + 1)), this.model.get("position") > 0 && d.pop(), 
        d.length > 0) {
            var e = "M" + (parseInt(d[0].get("x") * this.fieldsize) + this.halfsize) + "," + (parseInt(d[0].get("y") * this.fieldsize) + this.halfsize);
            d.forEach(function(a) {
                var d = parseInt(a.get("x")), f = parseInt(a.get("y"));
                e += "L" + (d * this.fieldsize + this.halfsize) + "," + (f * this.fieldsize + this.halfsize);
                var g = KaroUtil.createSvg("rect", {
                    x: d * this.fieldsize + this.thirdsize,
                    y: f * this.fieldsize + this.thirdsize,
                    width: this.thirdsize,
                    height: this.thirdsize,
                    fill: b
                });
                c.appendChild(g);
            }.bind(this));
        }
        var f = KaroUtil.createSvg("path", {
            d: e,
            stroke: b,
            "stroke-width": 1,
            fill: "none"
        });
        this.$el.append(c), this.$el.append(f);
    },
    resize: function() {
        this.size = this.settings.get("size"), this.halfsize = this.size / 2, this.thirdsize = this.size / 3, 
        this.border = this.settings.get("border"), this.fieldsize = this.size + this.border;
    },
    visibility: function() {
        this.model.get("visible") ? this.$el.css("display", "inline") : this.$el.css("display", "none");
    },
    highlight: function() {
        this.model.get("highlight") ? this.model.set("drawLimit", -1) : this.model.set("drawLimit", this.model.get("initDrawLimit"));
    },
    showPlayerInfo: function(a) {
        return this.model.set("highlight", !0), !0;
    },
    hidePlayerInfo: function() {
        this.model.set("highlight", !1);
    },
    old_render: function() {
        this.el.appendChild(movesFragment), this.el.appendChild(posFragment);
    }
}), MapPlayersMoves = Marionette.CollectionView.extend({
    tag: "div",
    className: "Dings",
    optionDefaults: {
        size: 11,
        border: 1,
        drawMoveLimit: 2,
        visible: !0
    },
    childView: MapPlayerMoves,
    childViewOptions: function() {
        return {
            settings: this.settings
        };
    },
    initialize: function(a) {
        return this.collection ? (a.settings ? this.settings = a.settings : (console.error("No settings passed into MapPlayerMoves"), 
        this.settings = new Backbone.Model(a)), _.bindAll(this, "check", "render"), this.listenTo(this.settings, "change:size change:border", this.resize), 
        this.listenTo(Karopapier.User, "change:id", this.check), this.listenTo(this.model, "change:completed", this.check), 
        void this.listenTo(this.settings, "change:drawLimit", this.drawLimit)) : (console.error("Missing Collection"), 
        !1);
    },
    check: function() {
        return this.model.get("completed") ? (this.resize(), this.collection.each(function(a) {
            var b = 5, c = !0;
            a.get("id") == Karopapier.User.get("id") && (b = -1), a.get("position") > 0 && (b = -1, 
            c = !1), a.set({
                drawLimit: b,
                initDrawLimit: b,
                visible: c
            });
        }), void this.render()) : !1;
    },
    drawLimit: function() {
        var a = this.settings.get("drawLimit");
        this.collection.each(function(b) {
            b.set("drawLimit", a);
        });
    },
    resize: function() {
        var a = this.model.map.get("cols") * (this.settings.get("size") + this.settings.get("border")), b = this.model.map.get("rows") * (this.settings.get("size") + this.settings.get("border"));
        this.$el.css({
            width: a,
            height: b
        }), this.$el.attr({
            width: a,
            height: b
        });
    }
}), MapRenderView = MapBaseView.extend({
    className: "mapRenderView",
    tagName: "canvas",
    initialize: function() {
        this.constructor.__super__.initialize.apply(this, arguments), _.bindAll(this, "drawField", "render", "addBorder", "addFlags", "addStartGrid", "addSpecles", "renderCheckpoints", "prepareCache"), 
        this.listenTo(this.model, "change:mapcode", this.render), this.listenTo(this.model, "change:field", this.renderFieldChange), 
        this.listenTo(this.settings, "change:size change:border", this.prepareCache), this.listenTo(this.settings, "change:size change:border", this.render), 
        this.listenTo(this.settings, "change:cpsVisited change:cpsActive", this.prepareCache), 
        this.listenTo(this.settings, "change:cpsVisited change:cpsActive", this.renderCheckpoints), 
        this.listenTo(this.settings, "change:specles", this.prepareCache), this.listenTo(this.settings, "change:specles", this.render), 
        this.palette = new MapRenderPalette(), this.standardFields = "LNOVWXYZ.", this.flagFields = "F123456789", 
        this.ctx = this.el.getContext("2d"), this.helper = 0, this.prepareCache();
    },
    isCheckpoint: function(a) {
        return parseInt(a) == a;
    },
    isFlagField: function(a) {
        return this.flagFields.indexOf(a) >= 0;
    },
    isStandardField: function(a) {
        return this.standardFields.indexOf(a) >= 0;
    },
    prepareCache: function() {
        console.info("Prepare field cache");
        var a = this;
        this.imageDatas = {}, this.size = this.settings.get("size"), this.border = this.settings.get("border"), 
        this.fieldSize = this.size + this.border, this.specles = this.settings.get("specles"), 
        this.cpsActive = this.settings.get("cpsActive"), this.cpsVisited = this.settings.get("cpsVisited");
        var b = document.createElement("canvas");
        b.width = b.height = this.fieldSize;
        var c = b.getContext("2d");
        _.each(this.model.FIELDS, function(b, d) {
            if (a.isStandardField(d)) {
                a.imageDatas[d] = [];
                for (var e = 0; 4 > e; e++) c = a.prepareFieldCtx(c, d), a.imageDatas[d].push(c.getImageData(0, 0, a.fieldSize, a.fieldSize));
            } else c = a.prepareFieldCtx(c, d), a.imageDatas[d] = c.getImageData(0, 0, a.fieldSize, a.fieldSize);
        });
    },
    prepareFieldCtx: function(a, b) {
        var c = this;
        a.fillStyle = c.palette.getRGB(b);
        var d = 1, e = "";
        return c.isCheckpoint(b) && (c.cpsActive ? c.cpsVisited.indexOf(parseInt(b)) >= 0 && (a.fillStyle = c.palette.getRGB("O"), 
        a.fillRect(0, 0, c.fieldSize, c.fieldSize), e = c.palette.getRGB(b), e = e.replace("rgb", "rgba").replace(")", ", 0.3)"), 
        a.fillStyle = e, d = .3) : a.fillStyle = c.palette.getRGB("O")), a.fillRect(0, 0, c.fieldSize, c.fieldSize), 
        c.size > 1 && c.isFlagField(b) ? (e = c.palette.getRGB(b + "_2"), 1 != d && (e = e.replace("rgb", "rgba").replace(")", ", " + d + ")")), 
        c.addFlags(a, e), a) : (c.size > 4 && c.isStandardField(b) && c.specles && c.addSpecles(a, c.palette.getRGB(b + "_2")), 
        "S" === b ? (c.addStartGrid(a, c.palette.getRGB("S_2")), a) : (c.border > 0 && c.addBorder(a, c.palette.getRGB(b + "_2")), 
        a));
    },
    renderCheckpoints: function() {
        var a = this.model.getCpPositions(), b = this;
        a.forEach(function(a) {
            var c = a.attributes, d = b.model.getFieldAtRowCol(c.row, c.col);
            b.settings.get("cpsActive") ? b.drawField(c.row, c.col, d) : b.drawField(c.row, c.col, "O");
        });
    },
    renderFieldChange: function(a) {
        var b = a.field, c = a.r, d = a.c;
        this.drawField(c, d, b);
    },
    render: function() {
        console.warn("FULL RENDER", new Date()), this.trigger("before:render");
        var a = this.model, b = a.get("rows"), c = a.get("cols");
        this.el.width = a.get("cols") * this.fieldSize, this.el.height = a.get("rows") * this.fieldSize;
        for (var d = this, e = 0; b > e; e++) for (var f = 0; c > f; f++) {
            var g = a.getFieldAtRowCol(e, f);
            d.drawField(e, f, g);
        }
        this.trigger("render");
    },
    drawField: function(a, b, c) {
        var d = b * this.fieldSize, e = a * this.fieldSize, f = this.imageDatas[c];
        f || (c = "X", f = this.imageDatas.X), this.helper >= 4 && (this.helper = 0), this.isStandardField(c) && (f = f[this.helper], 
        this.helper++), this.ctx.putImageData(f, d, e);
    },
    addSpecles: function(a, b) {
        a.fillStyle = b;
        for (var c = 0; 3 > c; c++) {
            var d = Math.round(Math.random() * (this.size - 1)), e = Math.round(Math.random() * (this.size - 1));
            a.fillRect(d, e, 1, 1);
        }
    },
    addBorder: function(a, b) {
        a.lineWidth = this.border, a.strokeStyle = b, a.beginPath(), a.moveTo(this.size + this.border / 2, 0), 
        a.lineTo(this.size + this.border / 2, this.size + this.border / 2), a.lineTo(0, this.size + this.border / 2), 
        a.stroke(), a.closePath();
    },
    addFlags: function(a, b) {
        if (!(this.fieldSize < 2)) {
            a.fillStyle = b;
            for (var c = Math.round(this.fieldSize / 4), d = this.fieldSize / c, e = 0; d > e; e++) for (var f = 0; d > f; f++) if ((e + f) % 2 === 1) {
                var g = Math.round(e * c), h = Math.round(f * c);
                a.fillRect(g, h, c, c);
            }
        }
    },
    addStartGrid: function(a, b) {
        var c = this.fieldSize;
        a.lineWidth = this.fieldSize / 8, a.strokeStyle = b, a.beginPath(), a.rect(.3 * c, .3 * c, .4 * c, .4 * c), 
        a.stroke();
    }
}), MapSvgView = MapBaseView.extend({
    tagName: "div",
    template: window.JST["map/svg"],
    className: "mapSvgView",
    initialize: function(a) {
        this.constructor.__super__.initialize.apply(this, arguments), _.bindAll(this, "adjustSize", "render", "initSvg", "renderFromPathStore", "renderFromPathFinder"), 
        this.initSvg(), this.listenTo(this.model, "change:rows change:cols", this.adjustSize), 
        this.listenTo(this.model, "change:mapcode", this.render), this.listenTo(this.settings, "change:cpsVisited change:cpsActive", this.updateCheckpoints), 
        this.forceMapPathFinder = a.forceMapPathFinder || !1, this.paths = [], this.initCss(), 
        this.mapPathFinder = new MapPathFinder(this.model), this.render();
    },
    initCss: function() {
        $("#mapSvgStyle").remove();
        var a = document.createElement("style");
        a.appendChild(document.createTextNode("")), a.id = "mapSvgStyle", document.head.appendChild(a), 
        this.styleSheet = a.sheet, styleSheet = this.styleSheet, styleSheet.insertRule(".grass {fill: url('#grassPattern')", 0), 
        styleSheet.insertRule(".road {fill: url('#roadPattern')", 0), styleSheet.insertRule(".start {fill: url(#startPattern)}", 0), 
        styleSheet.insertRule(".finish { fill: url(#finishPattern) }", 0), styleSheet.insertRule(".mud { fill: rgb(100, 70, 0); }", 0), 
        styleSheet.insertRule(".sand { fill: rgb(230, 230, 115); }", 0), styleSheet.insertRule(".water { fill: blue; }", 0), 
        styleSheet.insertRule(".earth { fill: brown; }", 0), styleSheet.insertRule(".night { fill: black; }", 0), 
        styleSheet.insertRule(".parc { fill: rgb(200, 200, 200); }", 0), styleSheet.insertRule(".grasscolor {fill: rgb(0, 200, 0)}", 0), 
        styleSheet.insertRule(".grassspeclecolor {fill: rgb(0, 180, 0)}", 0), styleSheet.insertRule(".roadcolor {fill: rgb(128, 128, 128)}", 0), 
        styleSheet.insertRule(".roadspeclecolor {fill: rgb(100, 100, 100)}", 0), styleSheet.insertRule(".cp1color { fill: rgb(0, 102, 255); }", 0), 
        styleSheet.insertRule(".cp2color { fill: rgb(0, 100, 200); }", 0), styleSheet.insertRule(".cp3color { fill: rgb(0, 255, 102); }", 0), 
        styleSheet.insertRule(".cp4color { fill: rgb(0, 200, 0); }", 0), styleSheet.insertRule(".cp5color { fill: rgb(255, 255, 0); }", 0), 
        styleSheet.insertRule(".cp6color { fill: rgb(200, 200, 0); }", 0), styleSheet.insertRule(".cp7color { fill: rgb(255, 0, 0); }", 0), 
        styleSheet.insertRule(".cp8color { fill: rgb(200, 0, 0); }", 0), styleSheet.insertRule(".cp9color { fill: rgb(255, 0, 255); }", 0), 
        styleSheet.insertRule(".cp9 { fill: url(#cp9pattern); }", 0), styleSheet.insertRule(".cp8 { fill: url(#cp8pattern); }", 0), 
        styleSheet.insertRule(".cp7 { fill: url(#cp7pattern); }", 0), styleSheet.insertRule(".cp6 { fill: url(#cp6pattern); }", 0), 
        styleSheet.insertRule(".cp5 { fill: url(#cp5pattern); }", 0), styleSheet.insertRule(".cp4 { fill: url(#cp4pattern); }", 0), 
        styleSheet.insertRule(".cp3 { fill: url(#cp3pattern); }", 0), styleSheet.insertRule(".cp2 { fill: url(#cp2pattern); }", 0), 
        styleSheet.insertRule(".cp1 { fill: url(#cp1pattern); }", 0), this.updateCheckpoints();
    },
    clearCheckpointRules: function() {
        for (var a = 0; a < this.styleSheet.cssRules.length; a++) {
            var b = this.styleSheet.cssRules[a];
            ".cp" == b.selectorText.slice(0, 3) && b.style.fillOpacity && (this.styleSheet.deleteRule(a), 
            a--);
        }
    },
    updateCheckpoints: function() {
        this.clearCheckpointRules();
        var a = this.model.get("cps");
        if (this.settings.get("cpsActive") === !1) {
            for (var b = 0; b < a.length; b++) this.styleSheet.insertRule(".cp" + a[b] + " { fill-opacity: 0; }", this.styleSheet.cssRules.length);
            return !0;
        }
        var c = this.settings.get("cpsVisited");
        if (!c) return !0;
        if (0 === c.length) return !0;
        for (var b = 0; b < c.length; b++) this.styleSheet.insertRule(".cp" + c[b] + " { fill-opacity: .15; }", this.styleSheet.cssRules.length);
    },
    adjustSize: function() {
        var a = this.model.get("cols") * this.fieldSize, b = this.model.get("rows") * this.fieldSize;
        this.$el.css({
            width: a,
            height: b
        }), this.$SVG.attr({
            width: a,
            height: b
        });
    },
    initSvg: function() {
        var a = this.template(), b = new DOMParser().parseFromString(a, "text/xml");
        this.SVG = b.documentElement, this.$SVG = $(this.SVG);
        var c = this.$el;
        this.setElement(this.SVG), c.replaceWith(this.$SVG), this.adjustSize();
    },
    renderFromPathFinder: function() {
        if ("undefined" == typeof this.model.get("mapcode")) return !1;
        var a = this.mapPathFinder.getMainField(), b = this.model.FIELDS[a];
        this.$SVG.find("#mainfill").attr("class", b);
        var c = this.$SVG.find("#paths");
        $(c).empty(), this.mapPathFinder.getAllOutlines(), console.warn("Rendered using Outlines");
        var d = this.mapPathFinder.getSvgPathFromOutlines(this.mapPathFinder.outlines.O, this.fieldSize), e = this.model.FIELDS.O, f = this.makeSVG("path", {
            d: d,
            "class": e
        });
        c[0].appendChild(f);
        for (var g in this.mapPathFinder.outlines) if (g !== a && "O" !== g) {
            var d = this.mapPathFinder.getSvgPathFromOutlines(this.mapPathFinder.outlines[g], this.fieldSize), e = this.model.FIELDS[g], f = this.makeSVG("path", {
                d: d,
                "class": e
            });
            c[0].appendChild(f);
        }
        var h = this.model;
        document.getElementById("mapSvgView").setAttribute("viewBox", "0 0 " + 12 * h.get("cols") + " " + 12 * h.get("rows")), 
        this.initCss(), console.log("Render triggered"), this.trigger("rendered");
    },
    makeSVG: function(a, b) {
        var c = document.createElementNS("http://www.w3.org/2000/svg", a);
        for (var d in b) c.setAttribute(d, b[d]);
        return c;
    },
    renderFromPathStore: function() {
        var a = new MapPathStore(), b = this;
        a.getPath(this.model.get("id"), function(a) {
            if (a === !1) return b.renderFromPathFinder(), !1;
            var c = new DOMParser(), d = a.p;
            "<" != d.charAt(0) && (d = LZString.decompress(d));
            for (var e = c.parseFromString(d, "image/svg+xml"), f = b.$SVG.find("#paths")[0]; f.childNodes.length > 0; ) {
                var g = f.firstChild;
                f.removeChild(g);
            }
            f.appendChild(document.importNode(e.getElementById("paths"), !0)), document.getElementById("mapSvgView").setAttribute("viewBox", "0 0 " + 12 * a.c + " " + 12 * a.r), 
            b.initCss();
        });
    },
    render: function() {
        0 !== this.model.get("id") && this.model.get("id") < 1e3 && !this.forceMapPathFinder ? this.renderFromPathStore() : this.renderFromPathFinder();
    }
}), APPS = {}, AppRouter = Backbone.Router.extend({
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
    doDummy: function(a) {
        var b;
        a in APPS ? b = APPS[a] : (b = new DummyApp({
            info: a
        }), b.start(), APPS[a] = b), Karopapier.layout.content.show(b.view, {
            preventDestroy: !0
        });
    },
    showStatic: function(a) {
        this.doDummy(a);
    },
    showChat: function() {
        Karopapier.chatApp = new ChatApp(), Karopapier.layout.content.show(Karopapier.chatApp.view);
    },
    showEditor: function() {
        Karopapier.editorApp = new EditorApp(), Karopapier.layout.content.show(Karopapier.editorApp.layout);
    },
    showDran: function() {
        Karopapier.dranApp = new DranApp(), Karopapier.layout.content.show(Karopapier.dranApp.view);
    },
    showGame: function(a) {
        this.doDummy("Game " + a);
    },
    defaultRoute: function() {
        this.doDummy("Game with no ID");
    }
}), EditorAppRouter = Backbone.Router.extend({
    routes: {
        "editor.html": "loadMap",
        "editor/:mapId": "loadMap",
        editor: "loadMap",
        "": "loadMap"
    },
    loadMap: function(a) {
        return alert("Hier will ich gar nicht hin"), !1;
    }
}), GameAppRouter = Backbone.Router.extend({
    routes: {
        "game.html?GID=:gameId": "showGame",
        "newshowmap.php?GID=:gameId": "showGame",
        "game.html": "defaultRoute"
    },
    showGame: function(a) {
        a && game.load(a);
    },
    defaultRoute: function() {
        this.navigate("game.html", {
            trigger: !0
        });
    }
});
//# sourceMappingURL=KaroBackbone.js.map