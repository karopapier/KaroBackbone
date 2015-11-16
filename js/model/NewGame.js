var NewGame = Backbone.Model.extend({
    defaults: {
        id: 0
    },
    initialize: function () {
    },

    url: function () {
        return "//www.karopapier.de/api/game/add.json";
    }
});
