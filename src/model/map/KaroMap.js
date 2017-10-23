var Backbone = require('backbone');
module.exports = Backbone.Model.extend({
    defaults: {
        id: 0,
        name: "o(-.-)o",
        mapcode: "1",
        loaded: false
    },
    initialize: function(options) {
        //init Maps model
        this.constructor.__super__.initialize.apply(this, arguments);
    },
    loading: function() {
        //fill mapcode with growing Xs while waiting

    },
    retrieve: function() {
        //standard map
        var me = this;
        $.getJSON(APIHOST + "/api/map/" + this.get("id") + ".json?callback=?", function(data) {
            data.loaded = true;
            me.set(data);
        });
    }
});
