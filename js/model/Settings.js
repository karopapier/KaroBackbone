var Settings = Backbone.Model.extend({
    defaults: {
        storageId: "aasdf",
        funny: true,
        chatNotification: true,
        dranNotification: true
    },
    initialize: function () {
        _.bindAll(this, "directSave", "onStorageEvent");
        $(window).bind('storage', this.onStorageEvent);
    },
    set: function(attributes, options) {
        Backbone.Model.prototype.set.apply(this, arguments);
        this.directSave();
    },
    onStorageEvent: function(e) {
        var key = e.originalEvent.key;
        var val = e.originalEvent.newValue;
        if (key === this.get("storageId")) {
            console.log("ICH SOLL WERDEN", val);
            var j = JSON.parse(val);
            //console.log(j);
            this.set(j);
        }
    },
    directSave: function (e) {
        //console.log("Direct save", e, this.toJSON());
        localStorage.setItem(this.get("storageId"), JSON.stringify(this.toJSON()));
    }
});