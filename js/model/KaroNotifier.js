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
    add: function(n) {
        this.notifications.add(n);
    },
    remove: function(n) {
        this.notifications.remove(n);
    },
    addGameMoveNotification: function (data) {
        var text = 'Bei <b><%= name %></b> hat <%= movedLogin %> gerade gezogen. Jetzt ist <%= nextLogin %> dran';
        var t = _.template(text);
        var n = new Notification({
            text: t(data),
            level: "info",
            group: "global",
            imgUrl: "http://www.karopapier.de/pre/" + data.gid + ".png"
        });
        this.add(n);

        var me = this;
        setTimeout(function() {
            me.remove(n);
        },n.get("timeout"));
    },
    addUserDranNotification: function(data) {
        var text = 'Du bist dran! Bei <b><%= name %></b> hat <%= movedLogin %> gerade gezogen.';
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
