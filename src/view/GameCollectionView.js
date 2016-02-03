//container for rendered map and players
var Marionette = require('backbone.marionette');
module.exports = Marionette.CompositeView.extend({
    childViewContainer: "tbody",
    template: window["JST"]["dran/dranGames"]
});
