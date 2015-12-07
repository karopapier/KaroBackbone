var EditorApp = Backbone.Marionette.Application.extend({
    initialize: function() {
        this.layout = new EditorLayout({
            editorApp: this
        });
        this.viewsettings = new MapViewSettings();
        this.editorsettings = new Backbone.Model({
            buttons: [null, "X", "O", "1"]
        });
        this.map = new Map();
        this.map.setMapcode("XOSOFOXSNEP\n12345678901\n...MNUVWXYZ");
    }
});
