var EditorCodeView = Backbone.View.extend({
    initialize: function(options) {
        options = options || {};
        if (!options.model) {
            console.error("No map for EditorCodeView");
            return false;
        }

    },
    render: function() {
        var mcv = new MapCodeView({
            model: this.model,
            readonly: false
        });
        this.$el.append(mcv.$el);
        this.$el.append("<button>San</button>");
    }
});