var KEvIn = Backbone.Model.extend(/** @lends KEvIn.prototype*/{
    defaults: {},
    /**
     * @constructor KEvIn
     * @class KEvIn
     * Karo EVent INterfcae - handling and forwarding real time notifications, forwarding them to the KaroApp
     *
     */
    initialize: function (options) {
        options = options||{};
        console.log("Run init on KEvIn");
        _.bindAll(this, "start", "stop")
        console.warn(options);
        if (!options.user) {
            throw Error("KEvIn needs a user");
        }

        this.turted = new TURTED("http://ape.karopapier.de/turted");
        this.turted.ident(1, 'Didi', "notokenyet");
    },
    start: function() {
        this.turted.join("karochat");
        this.turted.join("livelog");
    },
    stop: function() {
        this.turted.leave("karochat");
        this.turted.leave("livelog");
    }
});
