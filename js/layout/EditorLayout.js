var EditorLayout = Marionette.LayoutView.extend({
    initialize: function(options) {
        this.editorApp = options.editorApp;
        _.bindAll(this, "onShow");
    },
    regions: {
        "tools": ".editor-tools-container",
        "mapview": ".editor-mapview-container",
        "codeview": ".editor-codeview-container"
    },
    className: "editorAppView",
    template: window.JST["editor/layout"],
    onShow: function() {
        //add all subviews into the rendered view
        this.tools.show(new EditorToolsLayout({
            viewsettings: this.editorApp.viewsettings,
            editorsettings: this.editorApp.editorsettings,
            editorApp: this.editorApp
        }));

        this.mapview.show(new EditorMapView({
            viewsettings: this.editorApp.viewsettings,
            editorsettings: this.editorApp.editorsettings,
            model: this.editorApp.map
        }));

        this.codeview.show(new EditorCodeView({
            model: this.editorApp.map,
        }));
    }
});
