var ChatApp = Backbone.Marionette.LayoutView.extend({
    className: "chatApp",
    initialize: function () {
        _.bindAll(this, "updateView", "render", "scrollCheck");
        this.layout = new ChatLayout({
            el: this.el
        });
        this.layout.render();
        this.already = true;

        //console.log("Im ChatApp.init ist funny", Karopapier.Settings.get("chat_funny"));
        this.configuration = new Backbone.Model({
            limit: Karopapier.Settings.get("chat_limit"),
            lastLineId: 0,
            atEnd: true,
            start: 0,
            history: false,
            funny: Karopapier.Settings.get("chat_funny"),
            showBotrix: Karopapier.Settings.get("chat_showBotrix"),
            oldLink: Karopapier.Settings.get("chat_oldLink")
        });
        KaroUtil.set("funny", this.configuration.get("funny"));
        KaroUtil.set("oldLink", this.configuration.get("oldLink"));

        this.chatMessageCache = new ChatMessageCache({});
        this.chatMessageCache.cache(0, 20); //initial short load

        this.chatMessageCollection = new ChatMessageCollection();
        this.chatMessagesView = new ChatMessagesView({
            model: this.configuration,
            collection: this.chatMessageCollection
        });
        this.chatMessagesView.render();

        this.chatInfoView = new ChatInfoView({
            model: Karopapier.User
        });

        this.chatControlView = new ChatControlView({
            model: this.configuration
        });

        this.chatEnterView = new ChatEnterView({});
        this.webNotifierView = new WebNotifierView();

        this.listenTo(this.configuration, "change:limit", function (conf, limit) {
            if (this.configuration.get("atEnd")) {
                var start = this.configuration.get("lastLineId") - this.configuration.get("limit");
                this.configuration.set("start", start);
            }
            Karopapier.Settings.set("chat_limit", limit);
        });

        this.listenTo(this.configuration, "change:start", function (conf, start) {
            console.log("Start changed, was ", conf.previous("start"), "now", start);
            this.chatMessageCache.cache(start);
        });

        this.listenTo(this.configuration, "change:showBotrix", function (conf, showBotrix) {
            Karopapier.Settings.set("chat_showBotrix", showBotrix);
        });

        this.listenTo(this.configuration, "change:funny", function (conf, funny) {
            Karopapier.Settings.set("chat_funny", funny);
        });

        this.listenTo(this.configuration, "change:oldLink", function (conf, oldLink) {
            Karopapier.Settings.set("chat_oldLink", oldLink);
        });

        this.listenTo(Karopapier.Settings, "change:chat_limit", function (conf, limit) {
            this.configuration.set("limit", limit);
        });

        this.listenTo(Karopapier.Settings, "change:chat_funny", function (conf, funny) {
            //console.log("ChatApp bekommt mit, dass sich Karo.Settings -> funny geändert hat",funny);
            this.configuration.set("funny", funny);
            KaroUtil.set("funny", funny);
            this.chatMessageCache.each(function (m) {
                //dummy trigger change event to force re-render
                m.set("funny", funny);
            });
        });

        this.listenTo(Karopapier.Settings, "change:chat_oldLink", function (conf, oldLink) {
            console.log("ChatApp bekommt mit, dass sich Karo.Settings -> oldLink geändert hat",oldLink);
            this.configuration.set("oldLink", oldLink);
            KaroUtil.set("oldLink", oldLink);
            this.chatMessageCache.each(function (m) {
                //dummy trigger change event to force re-render
                m.set("oldLink", oldLink);
            });
        });

        this.listenTo(Karopapier.Settings, "change:chat_showBotrix", function (conf, showBotrix) {
            //console.log("ChatApp bekommt mit, dass sich Karo.Settings -> showBotrix geändert hat",showBotrix);
            this.configuration.set("showBotrix", showBotrix);
            this.chatMessageCache.each(function (m) {
                //dummy trigger change event to force re-render
                m.set("showBotrix", showBotrix);
            });
        });

        this.listenTo(this.chatMessageCache, "CHAT:CACHE:UPDATED", function () {
            //chat cache was updated - filter what to view
            var start = this.configuration.get("start");
            var end = parseInt(start) + parseInt(this.configuration.get("limit"));
            var toShow = this.chatMessageCache.filter(function (cm) {
                var lineId = cm.get("lineId");
                //console.log("Check",lineId,"to be between",start,end);
                return ((lineId >= start) && (lineId <= end));
            });
            //console.log("Between",start,"and",end,"lie",toShow.length);
            this.chatMessageCollection.set(toShow);
        });

        this.listenTo(this.chatMessagesView, "CHAT:MESSAGES:TOP", function () {
            if (!this.configuration.get("history")) {
                console.info("Not in history mode");
                return false;
            }

            var extender = 100;
            var start = this.configuration.get("start");
            var limit = this.configuration.get("limit");
            if (start <= 1) return true;
            start -= extender;
            this.configuration.set({
                start: start,
                limit: limit + extender
            })
            this.configuration.set("start", start);
        })

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
            //console.log("vent CHAT:MESSAGE triggered inside ChatApp");
            //disable due to XSS danger
            //console.log(data);
            //var cm = new ChatMessage(data.chatmsg);
            //console.log(cm);
            //me.chatMessageCollection.add(cm);
            me.chatMessageCache.cache(me.configuration.get("lastLineId"));
        });
    },
    updateView: function () {
        //console.log("updateView");
        if (this.configuration.get("atEnd")) {
            console.log("We are at the end");
            var l = this.chatMessageCache.length;
            var lim = this.configuration.get("limit");
            this.chatMessageCollection.set(this.chatMessageCache.slice(l - lim));
        }
    },
    scrollCheck: function (e) {
        //console.log("Check already", this.already);
        var cmv = this.chatMessagesView;
        var me = this;
        if (this.already) {
            cmv.scrollCheck();
            this.already = false;
            setTimeout(function () {
                me.already = true
            }, 50);
        }
    },
    render: function () {
        this.layout.chatMessages.show(this.chatMessagesView);
        this.layout.chatInfo.show(this.chatInfoView);
        this.layout.chatControl.show(this.chatControlView);
        this.layout.chatEnter.show(this.chatEnterView);
        this.layout.webNotifier.show(this.webNotifierView);

        this.webNotifierView.check();
        var $el = this.layout.chatMessages.$el;

        $($el).on("scroll", this.scrollCheck);
    }
});

