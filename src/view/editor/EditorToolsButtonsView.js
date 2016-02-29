var Marionette = require('backbone.marionette');
module.exports = Marionette.ItemView.extend({
    initialize: function(options) {
        options = options || {};
        if (!options.editorsettings) {
            console.error("No editorsettings passed to EditorToolsButtonView");
            return;
        }
        this.editorsettings = options.editorsettings;
        this.listenTo(this.editorsettings, "change:buttons", this.update);
    },
    urlFor: function(f) {
        return "/images/mapfields/" + f + ".png?v=25";
    },
    update: function(model, buttons) {
        var prev = model.previous("buttons");
        var now = buttons;
        for (var i = 1; i <= 3; i++) {
            if (prev[i] != now[i]) {
                //set new src
                this.$('.button' + i).attr("src", this.urlFor(now[i]));
            }
        }
    },
    render: function() {
        var buttons = this.editorsettings.get("buttons");
        var html = "Aktuelle Mausbelegung<br />Links, Mitte, Rechts: ";
        for (var i = 1; i <= 3; i++) {
            html += '<img src="' + this.urlFor(buttons[i]) + '" class="button' + i + '" > ';
        }
        this.$el.html(html);
    }
});

