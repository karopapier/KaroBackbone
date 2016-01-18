var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
module.exports = Backbone.Model.extend(/** @lends LocalSyncModel */ {
    defaults: {
        storageId: "ID" + Math.round(Math.random() * 10000)
    },
    /**
     * @class LocalSyncModel
     * @constructor LocalSyncModel
     */
    initialize: function() {
        _.bindAll(this, "directSave", "onStorageEvent");
        $(window).bind('storage', this.onStorageEvent);
        var id = this.get("storageId");
        //console.log("INIT LOCALSYNC ON ", id);
        var data = store.get(id);
        //console.log("From store",data);
        //data = JSON.parse(data);
        //console.log("Data now", data);
        //console.log(this.attributes);
        this.set(data);
        this.initialized = true;
    },
    set: function(attributes, options) {
        Backbone.Model.prototype.set.apply(this, arguments);
        if (this.initialized) this.directSave();
    },
    onStorageEvent: function(e) {
        var key = e.originalEvent.key;
        var val = e.originalEvent.newValue;
        if (key === this.get("storageId")) {
            //console.log("ICH SOLL WERDEN", val);
            var j = JSON.parse(val);
            //console.log(j);
            this.set(j);
        }
    },
    directSave: function(e) {
        //console.log("Direct save", e, this.toJSON());
        store.set(this.get("storageId"), this.toJSON());
    }
});