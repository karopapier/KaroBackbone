var NewGame = Backbone.Model.extend({
    defaults: {
        id: 0
    },
    initialize: function () {
    },

    url: function () {
        return "/api/game/add.json";
    }
});
