var Backbone = require('backbone');
module.exports = Backbone.Model.extend(/** @lends Notification.prototype*/{
    defaults: {
        level: "info",
        text: "Notification",
        screen: true,
        group: "general",
        timeout: 8000,
        imageUrl: "",
        clickUrl: ""
    },
    /**
     * @constructor Notification
     * @class Notification
     * A Notification to be shown on screen or as browser notification
     *
     */
    initialize: function (options) {
        if (typeof options === "string") {
            this.set("text", options);
        } else {
            _.defaults(options, this.defaults);
        }
        this.set(options);
        return this;
    }
});
