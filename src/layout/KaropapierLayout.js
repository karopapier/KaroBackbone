var Marionette = require('backbone.marionette');
module.exports = Marionette.LayoutView.extend({
    regions: {
        header: "#header",
        navi: "#navi",
        content: "#content",
        footer: "#footer",
        lastChatMessage: '.lastChatMessage'
    }
});