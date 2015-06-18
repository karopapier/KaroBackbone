var Notifier = Backbone.Model.extend(/** @lends Notifier.prototype*/{
    defaults: {},
    /**
     * @constructor Notifier
     * @class Notifier
     * Notifier manages all notifications to be shown on the screen
     *
     */
    initialize: function (options) {
        _.bindAll(this, "show");
        this.notifications = new Backbone.Collection();
    },
    show: function(n) {
        this.notifications.add(n);
    }
});
