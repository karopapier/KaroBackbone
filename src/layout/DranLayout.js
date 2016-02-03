var Backbone = require('backbone');
module.exports = Backbone.Marionette.LayoutView.extend({
    template: window["JST"]["dran/dranLayout"],
    regions: {
        dranInfo: "#dranInfo",
        dranGames: "#dranGames"
    }
});