var EditorToolsButtonsView = Marionette.ItemView.extend({
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
        return "/css/mapfields/" + f + ".png";
    },
    update: function(model, buttons) {
        console.log(model);
        var prev = model.previous("buttons");
        var now = buttons;
        console.log("P", prev);
        console.log("N", now);
        for (var i = 1; i <= 3; i++) {
            if (prev[i] != now[i]) {
                //remove existing icon- class
                this.$('.button' + i).attr("src", this.urlFor(now[i]));
            }
        }
    },
    render: function() {
        var buttons = this.editorsettings.get("buttons");
        var html = "Mausknöpfe<br />Links, Mitte, Rechts: ";
        for (var i = 1; i <= 3; i++) {
            html += '<img src="' + this.urlFor(buttons[i]) + '" class="button' + i + '" > ';
        }
        this.$el.html(html);
    }
});

