var EditorToolsLayout = Marionette.LayoutView.extend({
    template: window.JST["editor/tools"],
    initialize: function(options) {
        options = options || {};
        if (!options.viewsettings) {
            console.error("No viewsettings passed to EditorToolsView");
            return;
        }
        if (!options.editorsettings) {
            console.error("No editorsettings passed to EditorToolsView");
            return;
        }
        this.viewsettings = options.viewsettings;
        this.editorsettings = options.editorsettings;
    },
    regions: {
        "buttons": ".editor-tools-mousebuttons",
        "fields": ".editor-tools-fields",
        "settings": ".editor-tools-viewsettings"
    },
    onShow: function() {
        this.buttons.show(new EditorToolsButtonsView({
            editorsettings: this.editorsettings
        }));
        this.fields.show(new EditorToolsFieldsView({
            editorsettings: this.editorsettings
        }));
        this.settings.show(new EditorToolsSettingsView({
            viewsettings: this.viewsettings
        }));
    }
});

