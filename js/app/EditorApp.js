var EditorApp = Backbone.Marionette.Application.extend({
    initialize: function() {
        this.layout = new EditorLayout({
            editorApp: this
        });
        this.viewsettings = new MapViewSettings();
        this.editorsettings = new EditorSettings();
        this.map = new Map();
        this.map.setMapcode("XOSOFOXSNEP\n12345678901\n..LMNUVWXYZ");

    }
});
