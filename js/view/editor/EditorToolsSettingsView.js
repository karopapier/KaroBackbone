var EditorToolsSettingsView = Marionette.ItemView.extend({
    template: window.JST["editor/viewsettings"],
    initialize: function(options) {
        options = options || {};
        if (!options.viewsettings) {
            console.error("No viewsettings passed to EditorToolsSettingsView");
            return;
        }
        this.viewsettings = options.viewsettings;
        this.listenTo(this.viewsettings, "change:size change:border", this.update);
        _.bindAll(this, "changeSizeBorder");
    },
    events: {
        "change input[name='size']": "changeSizeBorder",
        "change input[name='border']": "changeSizeBorder"
    },
    changeSizeBorder: function(e) {
        var size = parseInt(this.$('.editor-tools-settings-size').val());
        var border = parseInt(this.$('.editor-tools-settings-border').val());
        if (size < 1) size = 1;
        if (size > 50) size = 50;
        if (border > 20) border = 20;
        if (border < 0)  border = 0;
        console.log("Update settings to ", size, border);
        this.viewsettings.set({
            size: size,
            border: border
        });

    },
    update: function(e) {
        console.log("Overwrite");
        this.$('.editor-tools-settings-size').val(this.viewsettings.get("size"));
        this.$('.editor-tools-settings-border').val(this.viewsettings.get("border"));
    },
    render: function() {
        this.$el.html(this.template());
    }
});
