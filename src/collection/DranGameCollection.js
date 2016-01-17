var DranGameCollection = Backbone.Collection.extend({
    model: Game,
    url: function () {
        return "//www.karopapier.de/api/user/" + Karopapier.User.get("id") + "/dran.json?callback=?";
    },
    initialize: function () {
        _.bindAll(this, "addId");
    },
    addId: function (id, name) {
        var g = new Game({id: id});
        if (name) {
            g.set("name", name)
        }
        this.add(g);
    },
    parse: function (data) {
        return data.games;
    }
});
