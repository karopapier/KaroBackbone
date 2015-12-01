var MapViewSettings = Backbone.Model.extend({
    defaults: {
        size: 11,
        border: 1,
        fillBorder: true,
        specles: true,
        drawMoveLimit: 2,
        hidePassedCPs: true,
        cpsActive: true,
        cpsVisited: []
    }
});

