var Notification = Backbone.Model.extend(/** @lends Notification.prototype*/{
    defaults: {
        level: "info",
        text: "Notification",
        screen: true,
        native: true,
        class: "general",
        timeout: 5000
    },
    /**
     * @constructor Notification
     * @class Notification
     * A Notification to be shown on screen or as browser notification
     *
     */
    initialize: function (options) {
        console.log("OPTIONS:",options)
        if (typeof options==="string") {
            this.set("text",options);
        } else {
            _.defaults(options, this.defaults);
        }
        console.log("Clever merge", options);
        return this;
    }
});
