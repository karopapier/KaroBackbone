//container for rendered map and players
var Marionette = require('backbone.marionette');
var GameListItemView = require('./GameListItemView');
module.exports = Marionette.CollectionView.extend({
    tagName: "ul",
    childView: GameListItemView
});
