var ChatMessagesView = Backbone.View.extend({
    tagName: "div",
    initialize: function () {
        _.bindAll(this, "addItem");
        this.collection.on("add", this.addItem);
        this.currentStart = 0;
        this.currentEnd = 0;
    },
    addItem: function (chatMessage, animated) {
        if (typeof animated === "undefined") animated = true;
        //console.log("Single chatmessage add");
        var chatMessageView = new ChatMessageView({model: chatMessage});

        //find out where to insert the template
        var lineId = parseInt(chatMessage.get("lineId"));

        var previousMessage = this.$el.find("#cm"+(lineId-1));
        //console.log("Previous", previousMessage[0]);
        chatMessageView.$el.find("img").on("load",this.scrollDown.bind(this));
        if (previousMessage[0]) {
            previousMessage.after(chatMessageView.$el)
        } else {
            this.$el.prepend(chatMessageView.$el);
        }

        if (animated) {
            //chatMessageView.$el.hide().fadeIn();
            this.scrollDown();
        }
        chatMessageView.listenTo(chatMessage, "remove", chatMessageView.remove);
    },
    removeItem: function(cm) {
        console.log(cm.get("lineId"),"removed");
    },
    scrollDown: function (options) {
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

        options.animated=false;
        //$el.animate({ scrollTop: $el.prop('scrollHeight') }, 1000);
        if (options.animated) {
            $parent.stop().animate({scrollTop: $parent.prop("scrollHeight")}, 100);
        } else {
            $parent.stop().scrollTop($parent.prop("scrollHeight") - $parent.height());
        }
        //},100);

    }
})

/*
 function wieweitunten() {
 var $c=$('#chatMessages');
 var topf=$c.prop("scrollTop");
 var hoch = $c.prop("scrollHeight");
 console.log(topf, hoch);
 }
 */