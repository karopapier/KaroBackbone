var _ = require('underscore');
var Backbone = require('backbone');
module.exports = Backbone.Model.extend(/** @lends NotificationControl.prototype */ {
    defaults: {
        supported: undefined,
        granted: false,
        denied: false,
        final: false,
        enabled: false
    },
    /**
     * @constructor NotificationControl
     * @class NotificationControl
     */
    initialize: function () {
        _.bindAll(this, "granted", "unsupported", "denied", "finaldenied", "check", "request");
        //console.log("INIT WEB NOT");
        this.listenTo(this, "change", this.status);
        this.listenTo(this, "change:enabled", this.request);
        this.check();
    },
    unsupported: function () {
        //console.log("Browser kann nicht");
        this.set({
            "supported": false,
            "final": true,
            "enabled": false
        });
    },
    finaldenied: function () {
        this.set({
            granted: false,
            denied: true,
            final: true,
            enabled: false
        })
    },
    granted: function () {
        this.set({granted: true, denied: false, final: true});
    },
    denied: function () {
        this.set({granted: false, denied: true, final: true, enabled: false});
    },
    request: function () {
        if (this.get("enabled")) {
            var me = this;
            Notification.requestPermission(function (result) {
                //console.log(result);
                if (result === 'denied') {
                    me.denied();
                    return;
                } else if (result === 'default') {
                    me.set({granted: false, denied: false, enabled: false, final: false});
                    return;
                }
                me.granted();
            });
        }
    },
    status: function () {
        return true;
        console.log("-------------------------------");
        for (var k in this.attributes) {
            console.log(k, this.attributes[k]);
        }
    },
    check: function () {
        if (!("Notification" in window)) {
            this.unsupported();
        } else {
            this.set("supported", true);
            if (Notification.permission === "denied") {
                this.finaldenied();
            } else {
                this.request();
            }
        }
    }
});
