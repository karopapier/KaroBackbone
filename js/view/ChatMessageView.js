var ChatMessageView = Backbone.View.extend({
    tagName: "div",
    className: "chatMessage",
    template: window["JST"]["chat/chatMessage"],
    id: function() {
        return "cm"+ this.model.get("lineId");
    },
    initialize: function () {
        _.bindAll(this, "render");
        this.render();
    },
    render: function () {
        //var text = this.model.get("text");
        var data = this.model.toJSON();
        this.$el.html(this.model.get("text"));
        data.text = this.$el.text();
        //text = KaroUtil.linkify(text);
        this.$el.html(this.template(data));
        return this;
    }
});
