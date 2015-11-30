/**
 * Created by p.dietrich on 30.11.2015.
 */

var MapListItemView = Backbone.View.extend({
    tagName: "option",
    render: function() {
        this.$el.html(this.model.get("name"));
    }
});
