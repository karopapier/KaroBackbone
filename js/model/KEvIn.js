var KEvIn = Backbone.Model.extend(/** @lends KEvIn.prototype*/{
    defaults: {},
    /**
     * @constructor KEvIn
     * @class KEvIn
     * Karo EVent INterfcae - handling and forwarding real time notifications, forwarding them to the KaroApp
     *
     */
    initialize: function (options) {
        options = options || {};
        console.log("Run init on KEvIn");
        _.bindAll(this, "ident", "hook", "start", "stop");
        if (!options.user) {
            throw Error("KEvIn needs a user");
        }
        this.user = options.user;
        this.listenTo(this.user, "change", this.ident);
        this.turted = new TURTED("http://ape.karopapier.de/turted");
        this.ident();
        this.hook();
    },
    ident: function () {
        var user = this.user;
        console.log("Ident with user", user.get("id"));

        if (user.get("id") === 0) {
            this.stop();
        } else {
            this.turted.ident(this.user.get("id"), this.user.get("login"), "KEvInLogsMeIn");
            this.start();
        }
    },
    hook: function () {
        this.turted.on("yourTurn", function (data) {
            Karopapier.vent.trigger("USER:DRAN", data);
        });
        this.turted.on('youMoved', function (data) {
            Karopapier.vent.trigger("USER:MOVED", data);
        });
        this.turted.on('anyOtherMoved', function (data) {
            Karopapier.vent.trigger("GAME:MOVE", data)
        });
        this.turted.on('newChatMessage', function (data) {
            console.log("Translate chat message");
            Karopapier.vent.trigger("CHAT:MESSAGE", data);
        });
    },
    start: function () {
        console.log("KEvIn joins");
        this.turted.join("karochat");
        this.turted.join("livelog");
    },
    stop: function () {
        console.log("KEvIn leaves");
        //this.turted.leave("karochat");
        //this.turted.leave("livelog");
    }
});
