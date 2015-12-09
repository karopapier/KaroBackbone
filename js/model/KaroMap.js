/**
 * Created by p.dietrich on 30.11.2015.
 */

var KaroMap = Backbone.Model.extend({
    defaults: {
        id: 0,
        name: "o(-.-)o",
        mapcode: "",
        loaded: false
    },
    initialize: function (options) {
        //init Maps model
        this.constructor.__super__.initialize.apply(this, arguments);
    },
    loading: function() {
        //fill mapcode with growing Xs while waiting

    },
    retrieve: function() {
        //standard map
        var me = this;
        $.getJSON("//www.karopapier.de/api/map/" + this.get("id") + ".json?callback=?", function(data) {
            data.loaded = true;
            me.set(data);
        });
    }
});
