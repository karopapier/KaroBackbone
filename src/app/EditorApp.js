var Marionette = require('backbone.marionette');
var EditorLayout = require('../layout/EditorLayout');
var MapViewSettings = require('../model/map/MapViewSettings');
var EditorSettings = require('../model/editor/EditorSettings');
var EditorImageTranslator = require('../model/editor/EditorImageTranslator');
var EditorUndo = require('../model/editor/EditorUndo');
var KaroMapCollection = require('../collection/KaroMapCollection');
var Map = require('../model/map/Map');
module.exports = Marionette.Application.extend({
    initialize: function(options) {
        this.layout = new EditorLayout({
            editorApp: this
        });
        this.viewsettings = new MapViewSettings();
        this.editorsettings = new EditorSettings();
        this.app = options.app;
        this.map = new Map();
        this.map.setMapcode("XXXXXXXXXXXXXXXXXXXXXXXXXXXX\nXGGGGGGGGGGGGGGGGGGGGGGGGGXX\nXGVGGVGGGGGGVGGGVGVVVGVGGGTX\nXGVGVGGGGGGGVVGVVGVGGGVGGGTX\nXGVVGGGVVVGGVGVGVGVVGGVGGGTX\nXGVGVGGVGVGGVGGGVGVGGGVGGGTX\nXGVGGVGVVVVGVGGGVGVVVGVVVGTX\nXGGGGGGGGGGGGGGGGGGGGGGGGGTX\nXXTTTTTTTTTTTTTTTTTTTTTTTTTX\nXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
        //this.map.setMapcode("F123456789\nWXYZLNOXPS");
        /*
         this.viewsettings.set({
         size: 20,
         border: 10,
         specles: true
         });
         */

        this.listenTo(this.app.vent, "HOTKEY", _.bind(this.hotkey, this));

        this.karoMaps = new KaroMapCollection();
        //CustomMapCollection()
        //WikiMapCollection()

        this.imageTranslator = new EditorImageTranslator({
            map: this.map,
            editorsettings: this.editorsettings
        });

        this.editorUndo = new EditorUndo({
            map: this.map,
            editorsettings: this.editorsettings
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
