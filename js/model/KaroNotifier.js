var KaroNotifier = Backbone.Model.extend(/** @lends KaroNotifier.prototype*/{
    defaults: {},
    /**
     * @constructor KaroNotifier
     * @class KaroNotifier
     * KaroNotifier manages all notifications to be shown on the screen and the browser
     * Provides custom methods as shortcuts for common notifications
     *
     */
    initialize: function (options) {
        _.bindAll(this, "add", "addGameMoveNotification", "addUserDranNotification");
        this.notifications = new Backbone.Collection();
    },
    add: function (n) {
        this.notifications.add(n);

        var t = n.get("timeout");
        if (t!==0) {
            var me = this;
            setTimeout(function () {
                me.remove(n);
            }, t);
        }
    },
    remove: function (n) {
        this.notifications.remove(n);
    },
    addGameMoveNotification: function (data) {
        var text = 'Bei <a href="/game.html?GID=<%= gid %>"><%= name %></a> hat <%= movedLogin %> gerade gezogen. Jetzt ist <%= nextLogin %> dran';
        var t = _.template(text);
        var n = new Notification({
            text: t(data),
            level: "info",
            group: "global",
            imgUrl: "http://www.karopapier.de/pre/" + data.gid + ".png"
        });
        this.add(n);
    },
    addUserDranNotification: function (data) {
        var text = 'Du bist dran! Bei <a href="/game.html?GID=<%= gid %>"><%= name %></a> hat <%= movedLogin %> gerade gezogen.';
        var t = _.template(text);
        var n = new Notification({
            text: t(data),
            level: "ok",
            group: "dran",
            imgUrl: "http://www.karopapier.de/pre/" + data.gid + ".png"
        });
        this.add(n);
    }
});
