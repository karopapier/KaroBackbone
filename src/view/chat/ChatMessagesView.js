var Backbone = require('backbone');
var ChatMessageView = require('./ChatMessageView');
module.exports = Backbone.View.extend({
    tagName: "div",
    id: "chatMessagesContainer",
    initialize: function(options) {
        options = options || {};
        if (!options.util) {
            console.error("No util in ChatMessagesView");
            return false;
        }
        this.util = options.util;
        _.bindAll(this, "addItem", "scrollCheck");
        this.collection.on("add", this.addItem);
        this.currentStart = 0;
        this.currentEnd = 0;
    },
    scrollcheck: function() {
        console.log("I scroll");
        var $parent = this.$el.parent();
        var toScrollDown = $parent.prop("scrollHeight") - $parent.prop("clientHeight") - $parent.prop("scrollTop");
        var $c = $('#chatMessages');
        var topf = $c.prop("scrollTop");
        var hoch = $c.prop("scrollHeight");
        console.log(topf, hoch);
    },
    addItem: function(chatMessage, animated) {
        var chatMessageView = new ChatMessageView({
            model: chatMessage,
            util: this.util
        });
        var lineId = parseInt(chatMessage.get("lineId"));

        //find out where to insert the template
        var previousMessage = this.$el.find("#cm" + (lineId - 1));

        //chatMessageView.$el.find("img").on("load", this.scrollDown.bind(this));

        //keep track of scroll
        var $parent = this.$el.parent();
        var sh = $parent.prop("scrollHeight");
        var st = $parent.scrollTop();

        //add message at right place, either at beginning or after previous one
        if (previousMessage[0]) {
            previousMessage.after(chatMessageView.$el)
        } else {
            this.$el.prepend(chatMessageView.$el);
        }
        var newSh = $parent.prop("scrollHeight");

        //find how much the height changed and scroll to original position
        $parent.scrollTop(st + newSh - sh);
    },
    removeItem: function(cm) {
        console.log(cm.get("lineId"), "removed");
    },
    scrollDown: function(options) {
        var $parent = this.$el.parent();
        options = _.defaults(options || {}, {forced: false, animated: true})
        //console.log(options);
        //check if scrolled down
        var $parent = this.$el.parent();
        var toScrollDown = $parent.prop("scrollHeight") - $parent.prop("clientHeight") - $parent.prop("scrollTop");
        //user is scrolled up, don't follow new line
        if ((toScrollDown > 40) && !(options.forced)) {
            //console.log("Skip scroll");
            return false;
        }
        //console.log("Ich scrolle",$parent.prop('scrollHeight') );
        //setTimeout(function() {

        /*
         options.animated=false;
         //$el.animate({ scrollTop: $el.prop('scrollHeight') }, 1000);
         if (options.animated) {
         $parent.stop().animate({scrollTop: $parent.prop("scrollHeight")}, 100);
         } else {
         $parent.stop().scrollTop($parent.prop("scrollHeight") - $parent.height());
         }
         //},100);
         */
        setTimeout(function() {
            $parent.stop().animate({scrollTop: $parent.prop("scrollHeight")}, 100);
        }, 10);
    },
    scrollCheck: function() {
        var $parent = this.$el.parent();
        var contentHeight = $parent.prop("scrollHeight");
        var top = $parent.prop("scrollTop"); //how much space until you reach the top
        var viewport = $parent.prop("clientHeight");
        var bottom = contentHeight - top - viewport; //how much space until you reach the bottom
        //console.log("We scrolled to top", top, "and bottom", bottom);
        if (top <= 100) {
            this.trigger("CHAT:MESSAGES:TOP");
        }
    }
})

/*
 #var toScrollDown = $parent.prop("scrollHeight") - $parent.prop("clientHeight") - $parent.prop("scrollTop");
 function wieweitunten() {
 var $c=$('#chatMessages');
 var topf=$c.prop("scrollTop");
 var hoch = $c.prop("scrollHeight");
 console.log(topf, hoch);
 }
 */