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
        //"contextmenu": "rightclick",
        "contextmenu .editor-tools-fields-field": "rightclick",
        "mousedown .editor-tools-fields-field": "selectField"
    },
    rightclick: function(e) {
        e.preventDefault();
        return false;
    },
    activeField: function() {
        var buttons = this.editorsettings.get("buttons");
        console.log("BUTTONS changed", buttons);
        //$('.fieldSelector', this.$el).removeClass("activeFieldSelector");
        //$('.fieldSelector[rel="' + buttons[1] + '"]', this.$el).addClass("activeFieldSelector");
    },

    selectField: function(e, i) {
        var buttons = this.editorsettings.get("buttons");
        var f = $(e.currentTarget).data("field");
        var w = e.which;
        console.log("Selected", f, "for", e.which);
        //unset silently to trigger change event on array
        //https://stackoverflow.com/questions/8491546/models-change-event-wont-fire-when-updating-an-array#
        if (buttons[w] != f) {
            var newButtons = [];
            for (var i = 0; i <= 3; i++) {
                newButtons[i] = buttons[i];
            }
            newButtons[e.which] = f;
            this.editorsettings.set("buttons", newButtons);
        }
    },

    render: function() {
        this.$el.empty();
        var fieldlists = ["OX", "SFP", "123456789", "LNWYZ"];
        var html = "";
        for (var r = 0; r < fieldlists.length; r++) {
            var fieldlist = fieldlists[r];
            for (var i = 0, e = fieldlist.length; i < e; i++) {
                var c = fieldlist[i];
                html += '<img src="/css/mapfields/' + c + '.png" class="editor-tools-fields-field" data-field="' + c + '"/>';
            }
            html += "<br/>";
        }
        this.$el.html(html);
    }
});

