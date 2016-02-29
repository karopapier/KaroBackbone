var Marionette = require('backbone.marionette');
var MapListView = require('../map/MapListView');
module.exports = Marionette.ItemView.extend({
    template: window.JST["editor/mapload"],
    initialize: function(options) {
        if (!options.editorApp) {
            console.error("No editorApp passed to EditorToolsMaploadView");
            return;
        }
        this.editorApp = options.editorApp;
        this.model = options.map;
        _.bindAll(this, "karoMapChange");
    },
    events: {
        "change .karoMaps": "karoMapChange"
    },
    karoMapChange: function(e) {
        var id = this.$('.karoMaps').val();
        var map = this.editorApp.karoMaps.get(id);
        var mapcode = map.get("mapcode");
        this.editorApp.map.setMapcode(mapcode);
    },
    render: function() {
        this.$el.empty();
        this.$el.html(this.template());
        this.karoMapListView = new MapListView({
            collection: this.editorApp.karoMaps,
            el: this.$("select")
        });
        this.karoMapListView.render();
        this.editorApp.karoMaps.fetch();
        //this.$el.append(this.karoMapListView.$el);
    }
});