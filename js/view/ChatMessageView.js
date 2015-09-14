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
        this.listenTo(this.model, "change", this.render);
    },
    render: function () {
        //var text = this.model.get("text");
        var me = this;
        var data = this.model.toJSON();
        this.$el.html(this.model.get("text"));
        data.text = this.$el.text();
        data.text = KaroUtil.linkify(data.text);
        this.$el.html(this.template(data));
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
        return this;
    }
});
