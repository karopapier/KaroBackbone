var EditorLayout = Marionette.LayoutView.extend({
    initialize: function(options) {
        this.editorApp = options.editorApp;
        _.bindAll(this, "onShow");

        //global keyup handler for field selection shortcut
        $(document).on("keyup", this.hotkey);
    },
    regions: {
        "tools": ".editor-tools-container",
        "mapview": ".editor-mapview-container",
        "codeview": ".editor-codeview-container"
    },
    className: "editorAppView",
    template: window.JST["editor/layout"],
    hotkey: function(e) {
        if (e.target.tagName.toUpperCase() == "BODY") {
            if (e.which !== 0) {
                console.log("Charcter was typed. It was: " + String.fromCharCode(e.which));
            }
        }
    },
    onShow: function() {
        //add all subviews into the rendered view
        this.tools.show(new EditorToolsLayout({
            viewsettings: this.editorApp.viewsettings,
            editorsettings: this.editorApp.editorsettings
        }));

        this.mapview.show(new EditorMapView({
            viewsettings: this.editorApp.viewsettings,
            editorsettings: this.editorApp.editorsettings,
            model: this.editorApp.map
        }));

        /*
         var ctrlView = new ControlView({
         el: "#viewsettings",
         });
         */

        this.codeview.show(new EditorCodeView({
            model: this.editorApp.map,
        }));
    }
});
