var Marionette = require('backbone.marionette');
var Map = require('../../model/map/Map');
module.exports = Marionette.ItemView.extend({
    initialize: function(options) {
        options = options || {};
        if (!options.editorsettings) {
            console.error("No editorsettings passed to EditorToolsFieldsView");
            return;
        }
        this.editorsettings = options.editorsettings;
        this.listenTo(this.editorsettings, "change:buttons", this.update);
        this.listenTo(this.editorsettings, "change:rightclick", this.update);
        this.listenTo(this.editorsettings, "change:drawmode", this.update);

        _.bindAll(this, "setRightclick", "update", "selectField", "selectDrawmode");
    },
    events: {
        "contextmenu .editor-tools-fields-field": "rightclick",
        "change input": "setRightclick",
        "mousedown .editor-tools-fields-field": "selectField",
        "click .editor-tools-fields-drawmode": "selectDrawmode"
    },

    setRightclick: function() {
        var rightclick = this.$(".editor-tools-fields-rightclick").prop("checked");
        this.editorsettings.set("rightclick", rightclick);
    },

    rightclick: function(e) {
        if (this.editorsettings.get("rightclick")) {
            e.preventDefault();
            return false;
        }
    },

    update: function() {
        var buttons = this.editorsettings.get("buttons");
        this.$('.editor-tools-fields-field').removeClass("activeField");
        this.$('.editor-tools-fields-field[data-field="' + buttons[1] + '"]').addClass("activeField");

        this.$('.editor-tools-fields-drawmode').removeClass("activeField");
        this.$('.editor-tools-fields-drawmode[data-drawmode="' + this.editorsettings.get("drawmode") + '"]').addClass("activeField");

        this.$('.editor-tools-fields-rightclick').prop("checked", this.editorsettings.get("rightclick"));
    },

    selectField: function(e, i) {
        var f = $(e.currentTarget).data("field");
        var w = e.which;
        if ((w == 3) && (!this.editorsettings.get("rightclick"))) {
            return false;
        }
        this.editorsettings.setButtonField(w, f);
    },

    selectDrawmode: function(e, i) {
        var m = $(e.currentTarget).data("drawmode");
        this.editorsettings.set("drawmode", m);
    },

    render: function() {
        this.$el.empty();
        var map = new Map();
        var fieldlists = ["OX", "SFP", "123456789", "GLNVTWYZ"];
        var html = "";
        for (var r = 0; r < fieldlists.length; r++) {
            var fieldlist = fieldlists[r];
            for (var i = 0, e = fieldlist.length; i < e; i++) {
                var c = fieldlist[i];
                html += '<img src="/images/mapfields/' + c + '.png?v=201512181836" class="editor-tools-fields-field" data-field="' + c + '" title="' + map.FIELDS[c] + '" />';
            }
            html += "<br/>";
        }
        html += '<img src = "/images/draw.png" class="editor-tools-fields-drawmode" data-drawmode="draw" /> <img src = "/images/floodfill.png"  class="editor-tools-fields-drawmode" data-drawmode="floodfill"  /><br />';
        html += '<label>Rechtsklick zum Malen? <input type="checkbox" name="rightclick" class="editor-tools-fields-rightclick"</label>';
        this.$el.html(html);
        this.update();
    }
});
