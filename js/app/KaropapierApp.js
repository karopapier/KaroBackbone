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
        }
        this.User.fetch();

        this.UserDranGames = new DranGameCollection();

        //init Karo Event Interface KEvIn
        this.KEvIn = new KEvIn({
            user: this.User
        });

        this.notifier = new KaroNotifier();
        this.notifierView = new NotifierView({model: this.notifier});

        var me = this;
        //some initializers after the page is done

        //add container for notifications
        this.addInitializer(function () {
            me.notifierView.render();
        })

        //hook to events to update dran queue
        this.addInitializer(function () {
            //refresh function considering logout
            function refresh() {
                if (me.User.get("id") == 0) return false;
                me.UserDranGames.fetch();
            }
            refresh();

            this.listenTo(me.User, "change:id", refresh)

            me.vent.on("USER:DRAN", function (data) {
                //console.log("Da bin ich jetzt dran", data);
                me.UserDranGames.addId(data.id, data.name);
            })

            me.vent.on("USER:MOVED", function (data) {
                //console.log("Ich nehms weg",data);
                me.UserDranGames.remove(data.gid);
                //console.log("Jetzt wär es weg");
            })
        });

        //init dynamic favicon
        this.addInitializer(function () {
            me.favi = new FaviconView({
                model: me.User,
                el: '#favicon'
            })
        });

        //genereal page setup
        this.addInitializer(function () {
            me.addRegions({
                header: '#header',
                content: '#content',
                footer: '#footer'
            })
        })

        //user info bar right top
        this.addInitializer(function () {
            me.infoBar = new UserInfoBar({
                model: me.User
            });
            me.header.show(Karopapier.infoBar);
        })

        //Start the router
        this.addInitializer(function () {
            me.router = new AppRouter();
            Backbone.history.start({
                pushState: true
            });
        })

        //better place for this???
        me.vent.on('GAME:MOVE', function (data) {
            //skip unrelated
            if (!data.related) {
                console.warn(data.movedLogin, "zog bei", data.gid, data.name);
                return false;
            }

            if (me.User.get("id") == data.nextId) {
                me.notifier.addUserDranNotification(data);
            } else {
                me.notifier.addGameMoveNotification(data);
            }
        });

        me.vent.on('GAME:MOVE', function (data) {
            var movedUser = new User({id: data.movedId, login: data.movedLogin})
            movedUser.decreaseDran();
            var nextUser = new User({id: data.nextId, login: data.nextLogin});
            nextUser.increaseDran();
        });
    }
});

