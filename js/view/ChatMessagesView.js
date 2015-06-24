var ChatMessagesView = Backbone.View.extend({
    tagName: "div",
    initialize: function () {
        _.bindAll(this, "render", "addItem", "limit");
        this.collection.on("reset", this.render);
        this.collection.on("add", this.addItem)
        this.collection.on("remove", this.removeItem)
        this.collection.fetch({reset: true});

        this.message_limit = this.model.get("limit");
        this.model.on("change", this.limit);
    },
    addItem: function (chatMessage, animated) {
        if (typeof animated ==="undefined") animated=true;

        //console.log("Single chatmessage add");
        var chatMessageView = new ChatMessageView({model: chatMessage});
        this.$el.append(chatMessageView.$el);
        if (animated) {
            //chatMessageView.$el.hide().fadeIn();
            this.scrollDown();
        }
    },
    removeItem: function (chatMessage) {
        //console.log("Single chatmessage remove");
        //var chatMessageView = new ChatMessageView({model: chatMessage});
        //this.$el.append(chatMessageView.$el.hide().fadeIn());
    },
    limit: function (e, a) {
        this.message_limit = this.model.get("limit")
        this.render();
    },
    scrollDown: function(options) {
        options = _.defaults(options||{}, { forced: false, animated: true})
        console.log(options);
        //check if scrolled down
        var $parent = this.$el.parent();
        var toScrollDown =$parent.prop("scrollHeight") - $parent.prop("clientHeight") - $parent.prop("scrollTop");
        //user is scrolled up, don't follow new line
        if  ((toScrollDown >40) && !(options.forced)) {
            //console.log("Skip scroll");
            return false;
        }
        //console.log("Ich scrolle",$parent.prop('scrollHeight') );
        //setTimeout(function() {

            //$el.animate({ scrollTop: $el.prop('scrollHeight') }, 1000);
            if (options.animated) {
                $parent.stop().animate({ scrollTop: $parent.prop("scrollHeight") }, 1000);
            } else {
                $parent.stop().scrollTop($parent.prop("scrollHeight")-$parent.height());
            }
        //},100);

    },
    render: function () {
        //console.log("Full chatmessage render", this.message_limit);
        //console.log("Items: ", this.collection.length);
        this.$el.empty();
        var me = this;
        _.each(this.collection.last(this.message_limit), function (chatMessage) {
            this.addItem(chatMessage, false);
        }.bind(this));
        this.scrollDown({ forced: true, animated: false});
        return this;
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