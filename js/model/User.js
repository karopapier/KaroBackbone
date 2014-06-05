var User = Backbone.ModelFactory({
    defaults: {
        id: 0,
        login: "Gast",
        dran: 0
    },
    initialize: function() {
        _.bindAll(this, "increaseDran", "decreaseDran")
        //console.log("I am ", this);
    },
    increaseDran: function() {
        this.set("dran", this.get("dran")+1);
    },
    decreaseDran: function() {
        this.set("dran", this.get("dran")-1);
    }
});
