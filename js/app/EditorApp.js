var EditorApp = Backbone.Marionette.Application.extend({
    initialize: function() {
        this.layout = new EditorLayout({
            editorApp: this
        });
        this.viewsettings = new MapViewSettings();
        this.editorsettings = new EditorSettings();
        this.map = new Map();
        this.map.setMapcode("XOSOFOXSNEP\n12345678901\n..LMNUVWXYZ");

        this.listenTo(Karopapier.vent, "HOTKEY", _.bind(this.hotkey, this));

        this.karoMaps = new KaroMapCollection();
        //CustomMapCollection()
        //WikiMapCollection()
    },
    hotkey: function(e) {
        var char = String.fromCharCode(e.which).toUpperCase();
        if (this.map.isValidField(char)) {
            this.editorsettings.setButtonField(1, char);
        }
    }
});
