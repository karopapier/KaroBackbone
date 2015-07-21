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
    },
    render: function () {
        //var text = this.model.get("text");
        var data = this.model.toJSON();
        this.$el.html(this.model.get("text"));
        data.text = this.$el.text();
        console.log(data.text);
        data.text = KaroUtil.linkify(data.text);
        console.log(data.text);
        this.$el.html(this.template(data));
        return this;
    }
});
