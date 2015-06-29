var ChatApp = Backbone.Marionette.LayoutView.extend({
    className: "chatApp",
    initialize: function () {
        _.bindAll(this, "updateView","render");
        this.layout = new ChatLayout({
            el: this.el
        });
        this.layout.render();

        this.configuration = new Backbone.Model({
            limit: 10,
            lastLineId: 0,
            atEnd: true,
            start: 0
        });

        this.chatMessageCache = new ChatMessageCache({});
        this.chatMessageCache.fetch();

        this.chatMessageCollection = new ChatMessageCollection();
        this.chatMessagesView = new ChatMessagesView({
            model: this.configuration,
            collection: this.chatMessageCollection
        });

        this.chatInfoView = new ChatInfoView({
            model: Karopapier.User
        });

        this.chatControlView = new ChatControlView({
            model: this.configuration
        });
        this.chatEnterView = new ChatEnterView({});

        this.listenTo(this.configuration, "change:start", function (conf, start) {
            console.log("Start changed to", start);
            this.chatMessageCache.cache(start);
        })

        //wire message cache and view collection together
        var me = this;
        this.listenTo(this.chatMessageCache, "add", function (cm) {
            var msgLineId = cm.get("lineId");
            //console.log("Added a cm with lineId", msgLineId);
            var lastLineId = this.configuration.get("lastLineId");
            //console.log("Last known", lastLineId);
            if (msgLineId > lastLineId) {
                this.configuration.set("lastLineId", msgLineId);
                //console.log(cm.get("lineId"), "new last");
            }
        });

        this.listenTo(this.chatMessageCache, "add", this.updateView);
        this.listenTo(this.configuration,"change:limit", this.updateView);

        //dirty first poor man's refresh and backup
        this.refreshMessages = setInterval(function () {
            //this.chatMessageCollection.fetch();
            this.chatInfoView.updateTopBlocker();
        }.bind(this), 60000);

        Karopapier.vent.on('CHAT:MESSAGE', function (data) {
            console.log("vent CHAT:MESSAGE triggered inside ChatApp");
            //disable due to XSS danger
            //console.log(data);
            //var cm = new ChatMessage(data.chatmsg);
            //console.log(cm);
            //me.chatMessageCollection.add(cm);
            me.chatMessageCache.cache(me.configuration.get("lastLineId"));
        });
    },
    updateView: function () {
        //console.log("New message in Cache", cm.get("lineId"));
        if (this.configuration.get("atEnd")) {
            var l = this.chatMessageCache.length;
            var lim = this.configuration.get("limit");
            this.chatMessageCollection.set(this.chatMessageCache.slice(l - lim));
        }
    },
    render: function () {
        this.layout.chatMessages.show(this.chatMessagesView);
        this.layout.chatInfo.show(this.chatInfoView);
        this.layout.chatControl.show(this.chatControlView);
        this.layout.chatEnter.show(this.chatEnterView);
        var $el = this.layout.chatMessages.$el;
        //setTimeout(function () {
        //$el.animate({scrollTop: $el.prop('scrollHeight')}, 100);
        //$el.animate({scrollTop: $el.prop('scrollHeight')}, 10);
        //}, 1000);
    }
});

