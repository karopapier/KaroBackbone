var DranGameCollection = Backbone.Collection.extend({
    model: Game,
    url: function () {
        return "http://www.karopapier.de/api/user/" + Karopapier.User.get("id") + "/dran.json?callback=?";
    },
    initialize: function () {
        _.bindAll(this, "addId");
    },
    addId: function (id) {
        this.add(new Game({id: id}));
    },
    parse: function (data) {
        return data.games;
    }
});
