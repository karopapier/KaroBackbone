var Marionette = require('backbone.marionette');
var MoveMessageView = require('./MoveMessageView');
var TextView = require('../TextView');
module.exports = Marionette.CollectionView.extend({
    id: "mmv",
    initialize: function(options) {
        if (!options.util) {
            console.error("No util for MoveMessagesView");
            return false;
        }
        this.util = options.util;
    },
    childView: MoveMessageView,
    childViewOptions: function() {
        return {
            util: this.util
        };
    },
    emptyView: TextView,
    emptyViewOptions: {
        text: "--------- Keiner spricht, hier herrscht höchste Konzentration --------"
    },
    onRender: function() {
        var el = this.el;
        var parent = el.parentNode;
        if (parent) {
            parent.scrollTop = parent.scrollHeight;
        }
    }
});
