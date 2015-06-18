var NotificationView = Backbone.View.extend({
    tagName: "li",
    className: "notification",
    initialize: function () {
        _.bindAll(this, "render");
        //this.render();
    },
    render: function () {
        var text = this.model.get("text");
        this.$el.addClass(this.model.get("level"));
        this.$el.html(text);
        return this;
    }
});
