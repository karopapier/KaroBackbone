var ChatMessageView = Backbone.View.extend({
    tagName: "div",
    className: "chatMessage",
    template: window["JST"]["chat/chatMessage"],
    initialize: function () {
        _.bindAll(this, "render");
        this.render();
    },
    render: function () {
        //var text = this.model.get("text");
        this.$el.html(this.model.get("text"));
        this.model.set("text", this.$el.text());
        //text = KaroUtil.linkify(text);
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});
