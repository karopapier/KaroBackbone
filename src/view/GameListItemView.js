//container for rendered map and players
var Marionette = require('backbone.marionette');
module.exports = Marionette.ItemView.extend({
    tagName: "tr",
    template: window["JST"]["game/gameListItem"]
});

