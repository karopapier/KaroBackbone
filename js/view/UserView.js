var UserView = Backbone.View.extend({
    options: {
        withAnniversary: true,
        withGames: false,
        withDesperation: false
    },
    tagName: "span",
    initialize: function (options) {
        this.options = _.defaults(options || {}, this.options);

        _.bindAll(this, "dranChange", "render");

        this.model.on("change", this.render)
        this.listenTo(this.model, "change:dran", this.dranChange)

        this.render();
    },
    dranChange: function (user, newDran) {
        var prevDran = this.model.previous("dran");
        //console.log("Dran changed from", prevDran, " to ", newVal);
        var col=(prevDran>newDran) ? "#00ff00":"#ff0000";
        this.$el.effect('highlight',{"color":col});
    },
    render: function () {
        var html = '';
        if (this.options.withDesperation && this.model.get("desperate")) {
            html += '<img src="http://reloaded.karopapier.de/images/spielegeil.png" alt="Spielegeil" title="Spielegeil">';
        }
        html += '<span class="userLabel">' + this.model.get("login") + '</span>';

        if (this.options.withGames) {
            html += ' <small>(' + this.model.get("dran") + '/' + this.model.get("activeGames") + ')</small>';
        }
        this.$el.html(html);
        return this;
    }
})