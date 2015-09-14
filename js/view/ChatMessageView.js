var ChatMessageView = Backbone.View.extend({
    tagName: "div",
    className: "chatMessage",
    template: window["JST"]["chat/chatMessage"],
    id: function () {
        return "cm" + this.model.get("lineId");
    },
    initialize: function () {
        _.bindAll(this, "render");
        this.render();
        this.listenTo(this.model, "remove", this.remove);
        this.listenTo(this.model, "change:funny", this.updateText);
    },
    updateText: function() {

        var me = this;
        //first parse html
        var $dummy = $("<span>");
        $dummy.html(this.model.get("text"));
        var text = $dummy.text();

        text = KaroUtil.linkify(text);
        var $textSpan = this.$el.find(".chatText").first();
        $textSpan.html(text);
        var imgs = this.$el.find("img").load(function (e) {
            var $parparent = me.$el.parent().parent();
            var newHeight = me.$el.height();
            //console.log("Message height changed from", messageHeight, "to", newHeight);
            var old = $parparent.scrollTop();
            var now = old + newHeight - messageHeight;
            $parparent.scrollTop(now);
            //console.log("nachher", $parparent.scrollTop());
        });
        var messageHeight = -1;
        setTimeout(function () {
            messageHeight = me.$el.height();
        }, 5);
    },
    render: function () {
        //var text = this.model.get("text");
        var me = this;
        var data = this.model.toJSON();
        data.text = "";
        this.$el.html(this.template(data));

        this.updateText();
        return this;
    }
});
