var DranGameCollection = Backbone.Collection.extend({
    model: Game,
    url: function () {
        return "http://www.karopapier.de/api/user/" + Karopapier.User.get("id") + "/dran.json?callback=?";
    },
    initialize: function () {
        _.bindAll(this, "addId");
    },
    addId: function (id, name) {
        var g = new Game({id: id});
        if (name) {
            console.log("Ich setz den namen auf",name);
            g.set("name", name)
        }
        this.add(g);
        console.log("Dran Q jetzt ", this.length);
    },
    parse: function (data) {
        return data.games;
    }
});
