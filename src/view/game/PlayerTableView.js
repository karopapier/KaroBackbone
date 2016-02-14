var Marionette = require('backbone.marionette');
var PlayerTableRowView = require('./PlayerTableRowView');
var MoveCollection = require('../../collection/MoveCollection');
module.exports = Marionette.CompositeView.extend({
    tagName: "table",
    className: "playerCollection playerList thin",
    template: window["JST"]["game/playerTable"],
    childView: PlayerTableRowView,
    childViewContainer: "tbody",

    initialize: function() {
        _.bindAll(this, "render");
    },

    events: {
        "change input.checkAll": "checkAll"
    },

    checkAll: function(e) {
        var vis = $(e.currentTarget).prop("checked");
        this.collection.each(function(m) {
            m.set("visible", vis);
        });
    }
});
