var Backbone = require('backbone');
module.exports = Backbone.View.extend({
    tagName: "h1",
    id: "gameTitle",
    initialize: function() {
        this.listenTo(this.model, "change:name", this.render);
    },
    render: function() {
        this.$el.text(this.model.get("name"));
        return this;
    }
});
