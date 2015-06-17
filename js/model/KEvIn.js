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
        _.bindAll(this, "ident", "start", "stop");
        if (!options.user) {
            throw Error("KEvIn needs a user");
        }
        this.user = options.user;
        this.listenTo(this.user, "change", this.ident);
        this.turted = new TURTED("http://ape.karopapier.de/turted");
        this.ident();
    },
    ident: function() {
        var user = this.user;
        console.log("Ident with user", user.get("id"));
        if (user.get("id")===0) return false;
        this.turted.ident(this.user.get("id"), this.user.get("login"), "KEvInLogsMeIn");
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
