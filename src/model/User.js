var _ = require('underscore');
var Backbone = require('backbone-model-factory');
module.exports = Backbone.ModelFactory(/** @lends User.prototype */ {
    defaults: {
        id: 0,
        login: "Gast",
        dran: -1
    },
    /**
     * @class User
     * @constructor User
     */
    initialize: function() {
        _.bindAll(this, "increaseDran", "decreaseDran");
        this.url = "//www.karopapier.de/api/user/" + this.get("id") + "/info.json?callback=?";
    },
    increaseDran: function() {
        this.set("dran", this.get("dran") + 1);
    },
    decreaseDran: function() {
        this.set("dran", this.get("dran") - 1);
    }
});
