var EditorApp = Backbone.Marionette.Application.extend({
    initialize: function() {
        this.layout = new EditorLayout({
            editorApp: this
        });
        this.viewsettings = new MapViewSettings({
            specles: false
        });
        this.editorsettings = new EditorSettings();
        this.map = new Map();
        this.map.setMapcode("XXXXXXXXXXXXXXXXXXXXXXXXXXXX\nXLLLLLLLLLLLLLLLLLLLLLLLLLXX\nXLVLLVLLLLLLVLLLVLVVVLVLLL.X\nXLVLVLLLLLLLVVLVVLVLLLVLLL.X\nXLVVLLLVVVLLVLVLVLVVLLVLLL.X\nXLVLVLLVLVLLVLLLVLVLLLVLLL.X\nXLVLLVLVVVVLVLLLVLVVVLVVVL.X\nXLLLLLLLLLLLLLLLLLLLLLLLLL.X\nXX.........................X\nXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

        this.listenTo(Karopapier.vent, "HOTKEY", _.bind(this.hotkey, this));

        this.karoMaps = new KaroMapCollection();
        //CustomMapCollection()
        //WikiMapCollection()

        this.editorUndo = new EditorUndo({
            map: this.map
        });
    },
    hotkey: function(e) {
        var ascii = e.which;
        var char = String.fromCharCode(ascii).toUpperCase();
        //check hotkey for being a map code
        if (this.map.isValidField(char)) {
            this.editorsettings.setButtonField(1, char);
            e.preventDefault();
            e.stopPropagation();
        }

        //ctrl + z -->undo
        if (e.ctrlKey && ascii == 26) {
            //UNDO
            this.editorUndo.undo()
            e.preventDefault();
            e.stopPropagation();
        }

        //console.log("Unhandled hotkey",char, ascii);
    }
});
