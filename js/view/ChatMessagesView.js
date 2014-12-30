var ChatMessagesView = Backbone.View.extend({
    tagName: "div",
    initialize: function () {
        _.bindAll(this, "render", "addItem", "limit");
        this.collection.on("reset", this.render);
        this.collection.on("add", this.addItem)
        this.collection.on("remove", this.removeItem)
        this.collection.fetch({reset: true});

        this.message_limit = this.model.get("limit");
        this.model.on("change", this.limit)
    },
    addItem: function (chatMessage) {
        //console.log("Single chatmessage add");
        var chatMessageView = new ChatMessageView({model: chatMessage});
        this.$el.append(chatMessageView.$el.hide().fadeIn());
        this.scrollDown();
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
    scrollDown: function() {
        //check if scrolled down
        var $parent = this.$el.parent();;
        var toScrollDown =$parent.prop("scrollHeight") - $parent.prop("clientHeight") - $parent.prop("scrollTop");
        //user is scrolled up, don't follow new line
        //console.log("To scroll down", toScrollDown, "force", force);
        if  (toScrollDown >40) {
            //console.log("Skip scroll");
            return false;
        }
        //console.log("Ich scrolle",$parent.prop('scrollHeight') );
        setTimeout(function() {
            //$el.animate({ scrollTop: $el.prop('scrollHeight') }, 1000);
            $parent.stop().animate({ scrollTop: $parent.prop("scrollHeight") }, 1000);
        },1000);

    },
    render: function () {
        //console.log("Full chatmessage render", this.message_limit);
        //console.log("Items: ", this.collection.length);
        this.$el.empty();
        var me = this;
        _.each(this.collection.last(this.message_limit), function (chatMessage) {
            this.addItem(chatMessage);
        }.bind(this));
        return this;
    }
})

function wieweitunten() {

    var $c=$('#chatMessages');
    return unten;
}