var EditorImageTranslatorLayout = Marionette.LayoutView.extend({
    className: "editorImageTranslator",
    template: window.JST["editor/imagetranslatorlayout"],
    initialize: function(options) {
        options = options || {};
        if (!options.imageTranslator) {
            console.error("No imageTranslator passed to EditorImageTranslatorLayout");
            return;
        }
        this.imageTranslator = options.imageTranslator;
        _.bindAll(this, "onShow");
    },
    regions: {
        "preview": ".editor-imagetranslator-preview",
        "info": ".editor-imagetranslator-info",
        "settings": ".editor-imagetranslator-settings"
    },
    onShow: function() {
        //add all subviews into the rendered view
        this.preview.show(new EditorImageTranslatorPreview({
            imageTranslator: this.imageTranslator
        }));

        this.info.show(new EditorImageTranslatorInfoView({
            model: this.imageTranslator.settings
        }));

        this.settings.show(new EditorImageTranslatorSettingsView({
            imageTranslator: this.imageTranslator
        }));
    }
});
