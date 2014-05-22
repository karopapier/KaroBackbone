var UserView = Backbone.View.extend({
    options: {
        withAnniversary: true,
        withGames: false,
        withDesperation: false
    },
    tagName: "span",
    initialize: function(options) {
        this.options = _.defaults(options || {}, this.options);
        console.log("Mit spiel",this.options.withGames);
        _.bindAll(this, "render");
        this.render();
        console.log("User view options", options);
    },
    render: function() {
        this.$el.html(this.model.get("login"));
        return this;
    }
})