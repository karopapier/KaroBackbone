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
        this.listenTo(this.user, "change:id", this.ident);
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
        //simple trigger for a new move
        this.turted.on("yourTurn", function (data) {
            Karopapier.vent.trigger("USER:DRAN", data);
        });

        //simple trigger for when you moved
        this.turted.on('youMoved', function (data) {
            Karopapier.vent.trigger("USER:MOVED", data);
        });

        //detailed trigger if a game related to you saw a move
        this.turted.on('otherMoved', function (data) {
            data.related = true;
            Karopapier.vent.trigger("GAME:MOVE", data);
        });

        //
        this.turted.on('anyOtherMoved', function (data) {
            data.related = false;
            Karopapier.vent.trigger("GAME:MOVE", data);
        });
        this.turted.on('newChatMessage', function (data) {
            Karopapier.vent.trigger("CHAT:MESSAGE", data);
        });
    },
    start: function () {
        this.turted.join("karochat");
        console.warn("GET RID OF LIVELOG");
        this.turted.join("livelog");
    },
    stop: function () {
        //this.turted.leave("karochat");
        //this.turted.leave("livelog");
    }
});
