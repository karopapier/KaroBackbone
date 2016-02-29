var Marionette = require('backbone.marionette');
module.exports = Marionette.ItemView.extend({
    initialize: function(options) {
        options = options || {};
        if (!options.editorsettings) {
            console.error("No editorsettings passed to EditorToolsToolboxView");
            return;
        }

        options = options || {};
        if (!options.editorUndo) {
            console.error("No editorUndo passed to EditorToolsToolboxView");
            return;
        }

        this.editorsettings = options.editorsettings;
        this.editorUndo = options.editorUndo;
        this.listenTo(this.editorUndo, "change:undoStack", this.updateUndoCount);
    },

    events: {
        'click button': "undo"

    },

    undo: function() {
        this.editorUndo.undo();
    },

    updateUndoCount: function(model, buttons) {
        this.undoButton.text("Undo (" + this.editorUndo.undoStack.length + ")");
    },

    render: function() {
        this.undoButton = $('<button title="Strg+z">Undo</button>');
        this.$el.html(this.undoButton);
        this.updateUndoCount()
    }
});

