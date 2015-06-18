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
        _.bindAll(this, "add");
        this.notifications = new Backbone.Collection();
    },
    add: function(n) {
        this.notifications.add(n);
    },
    addGameMoveNotification: function (data) {
        var text = '<img src="http://www.karopapier.de/pre/<%= gid %>.png"> Bei <b><%= name %></b> hat <%= movedLogin %> gerade gezogen. Jetzt ist <%= nextLogin %> dran';
        var t = _.template(text);
        var n = new Notification({
            text: t(data)
        });
        this.add(n);
    },
    addUserDranNotification: function(data) {
        var text = '<img src="http://www.karopapier.de/pre/<%= gid %>.png"> Bei <b><%= name %></b> hat <%= movedLogin %> gerade gezogen. Jetzt ist <%= nextLogin %> dran';
        var t = _.template(text);
        var n = new Notification({
            text: t(data),
            level: "ok",
            group: "dran"
        });
        this.add(n);
    }
});
