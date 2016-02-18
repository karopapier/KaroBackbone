var Marionette = require('backbone.marionette');
var PlayerTableRowView = require('./PlayerTableRowView');
var MoveCollection = require('../../collection/MoveCollection');
module.exports = Marionette.CompositeView.extend({
    tagName: "table",
    className: "playerCollection playerList thin",
    template: window["JST"]["game/playerTable"],
    childView: PlayerTableRowView,
    childViewContainer: "tbody",
    childViewOptions: function() {
        return {
            minimize: this.minimize
        };
    },

    initialize: function(options) {
        _.bindAll(this, "render");
        //overwrite template for minimize mode
        if (options.minimize) {
            this.template = window["JST"]["game/playerTable_mini"];
            this.minimize = true;
        }
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
