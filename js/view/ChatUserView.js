var ChatUserView = Backbone.View.extend({
    tagName: "div",
    initialize: function() {
        _.bindAll(this, "render");
        this.render();
    },
    render: function() {
        this.$el.html(this.model.get("login"));
        return this;
    }
})