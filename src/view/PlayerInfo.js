var PlayerInfo = Backbone.View.extend({
    tag: "div",
    className: "playerInfo",
    initialize: function() {
        _.bindAll(this,"render");
    },
    render: function () {
        //var user = new User({id: this.model.get("id")});
        //user.fetch();
        //var userView = new UserView({model: user});
        this.$el.html(this.model.get("id") + "-" + this.model.get("name"));
        //this.$el.append(userView.el);
        this.$el.css({
            position: "absolute",
            top: 100,
            left: 100
        });
    }
});
