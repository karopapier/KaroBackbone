/**
 * Created by pdietrich on 20.05.14.
 */


var KaropapierApp = Marionette.Application.extend({
    //global layout with regions for nav, sidebar, header and user info...
    initialize: function (options) {
        console.log('APP INIT!!!!!!!!!!!');
        this.User = new User({});
        //make this user refer to "check" for loging in
        this.User.url = function () {
            return "http://www.karopapier.de/api/user/check.json?callback=?";
        };
        this.User.fetch();

        this.UserDranGames = new DranGameCollection();

        //init Karo Event Interface KEvIn
        this.KEvIn = new KEvIn({
            user: this.User
        });

        this.Settings = new Settings({ id: 1 });

        this.notifier = new KaroNotifier();
        this.notifierView = new NotifierView({model: this.notifier});

        var me = this;
        //some initializers after the page is done

        //add container for notifications
        this.addInitializer(function () {
            me.notifierView.render();
        });

        //hook to events to update dran queue
        this.addInitializer(function () {
            //refresh function considering logout
            function dranRefresh() {
                if (me.User.get("id") == 0) return false;
                me.UserDranGames.fetch();
            }

            dranRefresh();

            this.listenTo(me.User, "change:id", dranRefresh)

            me.vent.on("USER:DRAN", function (data) {
                me.UserDranGames.addId(data.gid, data.name);
            });

            me.vent.on("USER:MOVED", function (data) {
                me.UserDranGames.remove(data.gid);
            });
        });

        //hook to events to update dran queue
        this.addInitializer(function () {
            //refresh function considering logout
            function loadTheme() {
                if (me.User.get("id") == 0) return false;
                var theme = me.User.get("theme");
                var themeUrl = "http://www.karopapier.de/themes/" + theme + "/css/theme.css";
                KaroUtil.lazyCss(themeUrl);
            }

            loadTheme();
            this.listenTo(me.User, "change:id", loadTheme);
        });

        //init dynamic favicon
        this.addInitializer(function () {
            me.favi = new FaviconView({
                model: me.User,
                el: '#favicon'
            })
        });

        this.addInitializer(function () {
            me.titler = new TitleView({
                model: me.User,
                title: "Karopapier - Autofahren wie in der Vorlesung"
            })
            me.titler.render();
        });

        //genereal page setup
        this.addInitializer(function () {
            me.addRegions({
                header: '#header',
                content: '#content',
                footer: '#footer'
            });
        });

        //user info bar right top
        this.addInitializer(function () {
            me.infoBar = new UserInfoBar({
                model: me.User
            });
            me.header.show(Karopapier.infoBar);
        });

        //Start the router
        this.addInitializer(function () {
            me.router = new AppRouter();
            Backbone.history.start({
                pushState: true
            });
        });

        //lazy css
        this.addInitializer(function() {
            KaroUtil.lazyCss("http://www.karopapier.de/css/slidercheckbox/slidercheckbox.css");
        })

        //better place for this???
        me.vent.on('GAME:MOVE', function (data) {
            //skip unrelated
            if (!data.related) {
                if (Karopapier.User.get("id") == 1) console.warn(data.movedLogin, "zog bei", data.gid, data.name);
                return false;
            }

            if (me.User.get("id") == data.nextId) {
                me.notifier.addUserDranNotification(data);
            } else {
                me.notifier.addGameMoveNotification(data);
            }
        });

        me.vent.on('GAME:MOVE', function (data) {
            //only for unrelated moves, count up or down
            if (data.related) return false;
            var movedUser = new User({id: data.movedId, login: data.movedLogin})
            movedUser.decreaseDran();
            var nextUser = new User({id: data.nextId, login: data.nextLogin});
            nextUser.increaseDran();
        });
    }
});

