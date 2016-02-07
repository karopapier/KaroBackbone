var _ = require('underscore');
var Backbone = require('backbone');
module.exports = Backbone.Model.extend(/** @lends KEvIn.prototype*/{
    defaults: {},
    /**
     * @constructor KEvIn
     * @class KEvIn
     * Karo EVent INterfcae - handling and forwarding real time notifications, forwarding them to the KaroApp
     *
     */
    initialize: function (options) {
        options = options || {};
        //console.log("Run init on KEvIn");
        _.bindAll(this, "ident", "hook", "start", "stop");
        if (!options.user) {
            throw Error("KEvIn needs a user");
        }
        if (!options.vent) {
            throw Error("KEvIn needs a vent object to trigger events on");
        }
        this.user = options.user;
        this.vent = options.vent;
        this.listenTo(this.user, "change:id", this.ident);
        this.turted = new TURTED("//ape.karopapier.de/turted");
        this.ident();
        this.hook();
    },
    ident: function () {
        var user = this.user;

        if (user.get("id") === 0) {
            this.stop();
        } else {
            this.turted.ident(this.user.get("id"), this.user.get("login"), "KEvInLogsMeIn");
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
            me.vent.trigger("GAME:MOVE", data);
            if (me.user.get("id") == data.nextId) {
                //console.info("USER:DRAN aus otherMoved");
                me.vent.trigger("USER:DRAN", data);
            }
            if (me.user.get("id") == data.movedId) {
                //console.info("USER:MOVED aus otherMoved");
                me.vent.trigger("USER:MOVED", data);
            }
        });

        //
        this.turted.on('anyOtherMoved', function (data) {
            data.related = false;
            //console.info("GAME:MOVE aus anyOtherMoved");
            me.vent.trigger("GAME:MOVE", data);
        });
        this.turted.on('newChatMessage', function (data) {
            //console.info("CHAT:MESSAGE");
            me.vent.trigger("CHAT:MESSAGE", data);
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
