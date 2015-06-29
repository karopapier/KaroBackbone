var ChatApp = Backbone.Marionette.LayoutView.extend({
    className: "chatApp",
    initialize: function () {
        this.layout = new ChatLayout({
            el: this.el
        });
        this.layout.render();

        this.configuration = new Backbone.Model({
            limit: 12,
            lastLineId: 0,
            atEnd: true
        });

        this.chatMessageCache = new ChatMessageCache({
        });
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

        //wire message cache and view collection together
        var me = this;
        this.listenTo(this.chatMessageCache, "add", function(cm) {
            //console.log("Added",cm, cm.get("lineId"));
            var lastLineId = this.configuration.get("lastLineId");
            if (cm.get("lineId")>lastLineId) {
                this.configuration.set("lastLineId", cm.get("lineId"));
                //console.log(cm.get("lineId"), "new last");
            }
        });

        this.listenTo(this.chatMessageCache, "add", function(cm) {
            //console.log("New message in Cache", cm.get("lineId"));
            if (me.configuration.get("atEnd")) {
                var l = me.chatMessageCache.length;
                var lim = me.configuration.get("limit");
                me.chatMessageCollection.set(me.chatMessageCache.slice(l-lim-1));
            }
        });

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
    render: function () {
        this.layout.chatMessages.show(this.chatMessagesView);
        this.layout.chatInfo.show(this.chatInfoView);
        this.layout.chatControl.show(this.chatControlView);
        var $el = this.layout.chatMessages.$el;
        //setTimeout(function () {
            //$el.animate({scrollTop: $el.prop('scrollHeight')}, 100);
            //$el.animate({scrollTop: $el.prop('scrollHeight')}, 10);
        //}, 1000);
    }
});

