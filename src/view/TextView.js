var Backbone = require('backbone');
module.exports = Backbone.View.extend({
    initialize: function(options) {
        this.text = options.text || "-";
    },
    render: function() {
        this.$el.html(this.text);
        return this;
    }
});