var GameTitleView = Backbone.View.extend({
    template: window.JST["game/gameTitle"],
    initialize:function() {
        this.listenTo(this.model,"change:name",this.render)
    },
    render: function() {
        var $old=this.$el;
        var $new = $(this.template(this.model.toJSON()));
        this.setElement($new);
        $old.replaceWith($new);
        return this;
    }
})
