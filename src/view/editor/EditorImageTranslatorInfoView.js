var Marionette = require('backbone.marionette');
module.exports = Marionette.ItemView.extend({
    template: window.JST["editor/imagetranslatorinfo"],
    initialize: function() {
        this.listenTo(this.model, "change", this.render);
    }
});
