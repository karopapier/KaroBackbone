var WebNotifier = Backbone.Model.extend({
    defaults: {
        supported: undefined,
        granted: false,
        denied: false,
        final: false,
        enabled: false
    },
    initialize: function () {
        _.bindAll(this, "granted", "unsupported","denied", "finaldenied");
        console.log("INIT WEB NOT");
        this.listenTo(this, "change", this.status);
        this.check();
    },
    unsupported: function () {
        console.log("Browser kann nicht");
        this.set({
            "supported": false,
            "final": true
        });
    },
    finaldenied: function () {
        console.log("Ich darf echt gar nicht");
        this.set({
            granted: false,
            denied: true,
            final: true
        })
    },
    granted: function () {
        this.set({ granted: true });
    },
    denied: function () {
        this.set({ granted: false });
    },
    request: function () {
        Notification.requestPermission(this.granted, this.denied);
    },
    status: function() {
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
