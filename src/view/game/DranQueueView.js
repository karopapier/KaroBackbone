//container for rendered map and players
var Marionette = require('backbone.marionette');
var DranQueueItemView = require('./DranQueueItemView');
module.exports = Marionette.CollectionView.extend({
    tagName: "div",
    childView: DranQueueItemView
});
