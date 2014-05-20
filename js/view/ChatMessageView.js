var ChatMessageView = Backbone.View.extend({
    tagName: "div",
    initialize: function() {
        _.bindAll(this, "render");
        this.render();
    },
    render: function() {
        var text = this.model.get("text");
        //this.$el.html(text);
        //text = this.$el.text();
        this.$el.html(text);
        text = this.$el.text();
        text = Karopapier.Util.linkify(text)
        this.$el.attr("id",this.model.get("id")).html("<b>"+ this.model.get("user") + "</b> (" + this.model.get("time") + "): " + text);
        return this;
    }
})