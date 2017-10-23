var Backbone = require('backbone');
module.exports = Backbone.Model.extend({
    defaults: {
        id: 0
    },
    initialize: function () {
    },

    url: function () {
        return APIHOST + "/api/game/add.json";
    }
});
