var Backbone = require('backbone');
module.exports = Backbone.View.extend({
    tagName: "div",
    className: "chatMessage",
    template: window["JST"]["chat/chatMessage"],
    id: function() {
        return "cm" + this.model.get("lineId");
    },
    initialize: function(options) {
        _.bindAll(this, "render");
        options = options || {};
        if (!options.util) {
            console.error("No util in ChatMessageView");
            return false;
        }
        this.util = options.util;

        //check if it is a botrix game message
        var bgreq = /Botrix, spiel mit/g;
        var bgack = /.*fahr ich jetzt in Grund und Boden!/g;
        var bgack2 = /.*mach ich jetzt Ruehrei/g;
        var bgack3 = /.*Direktlink/g;
        var line = this.model.get("text");
        if (line.match(bgreq) || line.match(bgack) || line.match(bgack2) || line.match(bgack3)) {
            this.model.set("isBotrixGameMessage", true);
            this.$el.addClass("botrixGame");
        }
        this.render();
        this.checkVisible();

        this.listenTo(this.model, "remove", this.remove);
        this.listenTo(this.model, "change:funny change:oldLink", this.updateText);
        this.listenTo(this.model, "change:showBotrix", this.checkVisible);
    },
    updateText: function() {

        var me = this;
        var $dummy = $("<span>");
        $dummy.html(this.model.get("text"));
        var text = $dummy.text();

        text = this.util.linkify(text);
        var $textSpan = this.$el.find(".chatText").first();
        $textSpan.html(text);
        var imgs = this.$el.find("img").load(function(e) {
            var $parparent = me.$el.parent().parent();
            var newHeight = me.$el.height();
            //console.log("Message height changed from", messageHeight, "to", newHeight);
            var old = $parparent.scrollTop();
            var now = old + newHeight - messageHeight;
            $parparent.scrollTop(now);
            //console.log("nachher", $parparent.scrollTop());
        });
        var messageHeight = -1;
        setTimeout(function() {
            messageHeight = me.$el.height();
        }, 5);
    },
    checkVisible: function() {
        var s = this.model.get("showBotrix");
        var is = this.model.get("isBotrixGameMessage");
        if (is && !s) {
            this.$el.hide();
        } else {
            this.$el.show();
        }
    },
    render: function() {
        //var text = this.model.get("text");
        var me = this;
        var data = this.model.toJSON();
        data.text = "";
        this.$el.html(this.template(data));

        this.updateText();
        return this;
    }
});
