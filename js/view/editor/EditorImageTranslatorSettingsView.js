var EditorImageTranslatorSettingsView = Marionette.ItemView.extend({
    template: window.JST["editor/imagetranslatorsettings"],
    initialize: function(options) {
        options = options || {};
        if (!options.imageTranslator) {
            console.error("No imageTranslator passed to TranslatorSettingsView");
            return;
        }
        this.imageTranslator = options.imageTranslator;
        _.bindAll(this, "changeScale", "run");
        this.listenTo(this.imageTranslator.settings, "change:active", this.render);
        this.listenTo(this.imageTranslator.settings, "change", this.update);
        this.listenTo(this.imageTranslator.editorsettings, "change:buttons", this.render);
    },
    events: {
        "click button": "run",
        "input input[name='scaleWidth']": "changeScale",
        "input[name='invert']": "changeSetting",
        "input[name='speedmode']": "changeSetting"
        //"input input[name='scaleHeight']": "changeScale"
    },

    update: function() {
        //console.log("EITSV update");
        this.$(".editor-imagetranslator-settings-invert").prop("checked", this.imageTranslator.settings.get("invert"));
        this.$(".editor-imagetranslator-settings-speedmode").prop("checked", this.imageTranslator.settings.get("speedmode"));
        this.$('.editor-imagetranslator-settings-scaleWidth').val(this.imageTranslator.settings.get("scaleWidth"));
    },

    changeSetting: function() {
        var invert = this.$(".editor-imagetranslator-settings-invert").prop("checked");
        this.imageTranslator.settings.set("invert", invert);

        var speedmode = this.$(".editor-imagetranslator-settings-speedmode").prop("checked");
        //console.log("Speedmode now", speedmode);
        this.imageTranslator.settings.set("speedmode", speedmode);
    },

    changeScale: function() {
        var scW = parseInt(this.$('.editor-imagetranslator-settings-scaleWidth').val());
        //console.log("SC", scW);
        if (scW < 1) scW = 1;
        this.imageTranslator.settings.setScale(scW);
    },

    run: function() {
        this.imageTranslator.run();
    },

    render: function() {
        //console.log("EITSV render");
        var json = this.imageTranslator.settings.toJSON();
        _.defaults(json, this.imageTranslator.editorsettings.toJSON());
        //console.log(json);
        this.$el.html(this.template(json));
        this.update();
    }
});
