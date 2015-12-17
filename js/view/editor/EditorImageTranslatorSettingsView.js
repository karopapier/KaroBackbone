var EditorImageTranslatorSettingsView = Marionette.ItemView.extend({
    template: window.JST["editor/imagetranslatorsettings"],
    initialize: function(options) {
        options = options || {};
        if (!options.imageTranslator) {
            console.error("No imageTranslator passed to TranslatorSettingsView");
            return;
        }
        this.imageTranslator = options.imageTranslator;
        _.bindAll(this, "run");
    },
    events: {
        "click button": "run"
    },

    run: function() {
        this.imageTranslator.run()
    },

    render: function() {
        this.$el.html(this.template(this.imageTranslator.settings.toJSON()));
    }
});
