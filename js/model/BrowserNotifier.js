var BrowserNotifier = Backbone.Model.extend(/** @lends BrowserNotifier.prototype*/{
    defaults: {},
    /**
     * @constructor BrowserNotifier
     * @class BrowserNotifier
     * BrowserNotifier manages all notifications to be shown in the browser
     *
     */
    initialize: function (options) {
        var me = this;

        this.eventEmitter = options.eventEmitter;
        this.user = options.user;
        this.settings = options.settings;

        this.eventEmitter.on('CHAT:MESSAGE', function (data) {
            console.warn(data.chatmsg);
            var b = new BrowserNotification({
                title: data.chatmsg.user + " spricht",
                body: data.chatmsg.text,
                level: "info",
                group: "global",
                tag: "chat",
                icon: "/favicon.ico",
                timeout: 2000,
                notifyClick: function () {
                    alert("Geklickt");
                }
            });

        });

        this.eventEmitter.on('GAME:MOVE', function (data) {
            //skip unrelated
            if (!data.related) {
                return false;
            }

            if (me.user.get("id") == data.nextId) {
                me.addUserDranNotification(data);
            } else {
                //me.addGameMoveNotification(data);
            }
        });
    },
    addUserDranNotification: function (data) {
        var text = 'Bei <%= gid %><%= name %> hat <%= movedLogin %> gerade gezogen.';
        var t = _.template(text);
        data.dran = this.user.get("dran");
        var b = new BrowserNotification({
            title: "Du bist dran (" + data.dran + ")",
            body: t(data),
            level: "info",
            group: "global",
            icon: "http://www.karopapier.de/pre/" + data.gid + ".png",
            tag: "dran",
            timeout: 2000
        });
    }
});
