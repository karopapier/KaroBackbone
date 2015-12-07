var EditorToolsView = Backbone.View.extend({
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
        this.viewsettings=options.viewsettings;
        this.editorsettings = options.editorsettings;
        this.highlightActiveField();
    },
    events: {
        "contextmenu": "rightclick",
        "mousedown .fieldSelector": "selectField"
    },
    rightclick: function() {
        console.log("Rightclick");
    },
    highlightActiveField: function() {
        var buttonColor = this.editorsettings.get("buttonColor");
        $('.fieldSelector', this.$el).removeClass("activeFieldSelector");
        $('.fieldSelector[rel="' + buttonColor[1] + '"]', this.$el).addClass("activeFieldSelector");
    },

    selectField: function(e, i) {
        this.buttonColor[e.which] = $(e.currentTarget).attr("rel");
        this.highlightActiveField();
    }
});

