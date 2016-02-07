//container for rendered map and players
var Marionette = require('backbone.marionette');
module.exports = Marionette.ItemView.extend({
    tagName: "span",
    template: window["JST"]["game/dranQueueItem"],
    initialize: function() {
        this.listenTo(this.model, "change", this.render);
    }
});

