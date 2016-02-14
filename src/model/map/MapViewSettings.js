var Backbone = require('backbone');
module.exports = Backbone.Model.extend({
    defaults: {
        size: 11,
        border: 1,
        fillBorder: true,
        specles: true,
        drawLimit: 2,
        hidePassedCPs: true,
        cpsActive: true,
        cpsVisited: []
    }
});

