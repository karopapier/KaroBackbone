var Backbone = require('backbone');
module.exports = Backbone.View.extend({
    initialize: function(options) {
        _.bindAll(this, "render");
        options = options || {};
        if (!options.model) {
            console.error("No model for StatusView");
            return false;
        }
        if (!options.user) {
            console.error("No user for StatusView");
            return false
        }
        this.user = options.user;
        this.listenTo(this.model, "change:completed", this.render);
    },
    render: function() {
        var status = "";
        if (this.model.get("finished")) {
            status = "Spiel ist beendet";
        } else {
            if (this.model.get("dranId") === this.user.get("id")) {
                status = "<b>Du bist dran</b>, bitte mach Deinen Zug";
            } else {
                status = "Du bist nicht dran. " + this.model.get("dran") + " muss ziehen";
            }
        }
        this.$el.html(status);
    }
});
