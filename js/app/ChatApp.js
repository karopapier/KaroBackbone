var ChatApp = Backbone.Marionette.LayoutView.extend({
    className: "chatApp",
    initialize: function () {
        _.bindAll(this, "updateView", "render");
        this.layout = new ChatLayout({
            el: this.el
        });
        this.layout.render();

        this.configuration = new Backbone.Model({
            limit: 100,
            lastLineId: 0,
            atEnd: true,
            start: 0
        });

        this.chatMessageCache = new ChatMessageCache({});
        this.chatMessageCache.cache(0,10); //initial short load

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

        this.listenTo(this.chatMessageCache,"CHAT:CACHE:UPDATED", function() {
            //chat cache was updated - filter what to view
            var start = this.configuration.get("start");
            var end = parseInt(start) + parseInt(this.configuration.get("limit"));
            var toShow = this.chatMessageCache.filter(function(cm) {
                var lineId = cm.get("lineId");
                //console.log("Check",lineId,"to be between",start,end);
                return ((lineId>=start) && (lineId<=end));
            });
            //console.log("Between",start,"and",end,"lie",toShow.length);
            this.chatMessageCollection.set(toShow);
        });

        //wire message cache and view collection together
        var me = this;
        this.listenTo(this.chatMessageCache.info, "change:lastLineId", function (ll) {
            console.warn("Update conf ll to ", ll.get("lastLineId"));
            this.configuration.set("lastLineId", ll.get("lastLineId"));
        });

        this.listenTo(this.configuration, "change:lastLineId", function () {
            //a change here only matters if we are "at the end"
            var ll = this.configuration.get("lastLineId");
            if (this.configuration.get("atEnd")) {
                var limit = this.configuration.get("limit");
                var start = ll - limit;
                var oldStart = this.configuration.get("start");
                //do this silently if start was 0
                this.configuration.set("start", start, {
                    //silent: (oldStart == 0)
                });
            }
        });

        //this.listenTo(this.chatMessageCache, "add", this.updateView);
        //this.listenTo(this.configuration, "change:limit", this.updateView);

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
        console.log("updateView");
        if (this.configuration.get("atEnd")) {
            console.log("We are at the end");
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

