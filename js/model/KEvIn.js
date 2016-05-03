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
        this.turted = new TURTED("//turted.karopapier.de/");
        this.ident();
        this.hook();
    },
    ident: function () {
        var user = this.user;

        if (user.get("id") === 0) {
            this.stop();
        } else {
            this.turted.ident({"username": this.user.get("login")});
            this.start();
        }
    },
    hook: function () {
        //simple trigger for a new move - consider skipping it for the more eloquent GAME:MOVE with my id
        this.turted.on("yourTurn", function (data) {
            //console.log("SKIPPED - yourTurn not forwared")
            //Karopapier.vent.trigger("USER:DRAN", data);
        });

        //simple trigger for when you moved
        this.turted.on('youMoved', function (data) {
            //console.info("USER:MOVED aus youMoved");
            //console.log("SKIPPED - youMoved not forwared")
            //Karopapier.vent.trigger("USER:MOVED", data);
        });

        //detailed trigger if a game related to you saw a move
        var me = this;
        this.turted.on('otherMoved', function (data) {
            data.related = true;
            //console.info("GAME:MOVE aus otherMoved");
            Karopapier.vent.trigger("GAME:MOVE", data);
            if (me.user.get("id") == data.nextId) {
                //console.info("USER:DRAN aus otherMoved");
                Karopapier.vent.trigger("USER:DRAN", data);
            }
            if (me.user.get("id") == data.movedId) {
                //console.info("USER:MOVED aus otherMoved");
                Karopapier.vent.trigger("USER:MOVED", data);
            }
        });

        //
        this.turted.on('anyOtherMoved', function (data) {
            data.related = false;
            //console.info("GAME:MOVE aus anyOtherMoved");
            Karopapier.vent.trigger("GAME:MOVE", data);
        });
        this.turted.on('newChatMessage', function (data) {
            //console.info("CHAT:MESSAGE");
            Karopapier.vent.trigger("CHAT:MESSAGE", data);
        });
    },
    start: function () {
        this.turted.join("karochat");
        this.turted.join("livelog");
    },
    stop: function () {
        //this.turted.leave("karochat");
        //this.turted.leave("livelog");
    }
});
