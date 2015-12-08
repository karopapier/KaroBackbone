var EditorToolsFieldsView = Marionette.ItemView.extend({
    initialize: function(options) {
        options = options || {};
        if (!options.editorsettings) {
            console.error("No editorsettings passed to EditorToolsFieldsView");
            return;
        }
        this.editorsettings = options.editorsettings;
        this.listenTo(this.editorsettings, "change:buttons", this.activeField);
        this.activeField();
    },
    events: {
        "contextmenu .editor-tools-fields-field": "rightclick",
        "mousedown .editor-tools-fields-field": "selectField",
    },
    rightclick: function(e) {
        e.preventDefault();
        return false;
    },
    activeField: function() {
        var buttons = this.editorsettings.get("buttons");
        console.log("BUTTONS changed", buttons);
        this.$('.editor-tools-fields-field').removeClass("activeField");
        this.$('.editor-tools-fields-field[data-field="' + buttons[1] + '"]').addClass("activeField");
    },

    selectField: function(e, i) {
        var f = $(e.currentTarget).data("field");
        var w = e.which;
        this.editorsettings.setButtonField(w, f);
    },

    render: function() {
        this.$el.empty();
        var fieldlists = ["OX", "SFP", "123456789", "LNVWYZ"];
        var html = "";
        for (var r = 0; r < fieldlists.length; r++) {
            var fieldlist = fieldlists[r];
            for (var i = 0, e = fieldlist.length; i < e; i++) {
                var c = fieldlist[i];
                html += '<img src="/css/mapfields/' + c + '.png?v=25" class="editor-tools-fields-field" data-field="' + c + '"/>';
            }
            html += "<br/>";
        }
        this.$el.html(html);
    }
});

