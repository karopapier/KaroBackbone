var Marionette = require('backbone.marionette');
module.exports = Marionette.ItemView.extend({
    className: "dranAppView",
    render: function() {
        this.model.layout.render();
        //insert views
        this.model.layout.dranGames.show(this.model.gamesView);
        this.$el.html(this.model.layout.$el);
    }
});