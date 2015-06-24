var UserView = Backbone.View.extend({
    options: {
        withAnniversary: true,
        withGames: false,
        withDesperation: false,
        withGamesLink: false
    },
    tagName: "span",
    initialize: function (options) {
        if (!this.model) {
            console.error("No model!");
            return false;
        }
        this.options = _.defaults(options || {}, this.options);
        _.bindAll(this, "dranChange", "render");

        //console.log(this.model);
        this.listenTo(this.model, "change", this.render);
        this.listenTo(this.model, "change:dran", this.dranChange);

        this.render();
    },
    dranChange: function (user, newDran) {
        var prevDran = this.model.previous("dran");
        if (prevDran >= 0) {
            //console.log("Dran changed from", prevDran, " to ", newVal);
            var col = (prevDran > newDran) ? "#00ff00" : "#ff0000";
            this.$el.effect('highlight', {"color": col});
        }
    },
    render: function () {
        var html = '';
        if (this.options.withDesperation && this.model.get("desperate")) {
            html += '<img src="http://www.karopapier.de/images/spielegeil.png" alt="Spielegeil" title="Spielegeil">';
        }
        html += '<span class="userLabel">' + this.model.get("login") + '</span>';

        if (this.options.withGames) {
            html += ' <small>(';
            if (this.options.withGamesLink) {
                if (Karopapier.User.get("id") == this.model.get("id")) {
                    html += '<a href="/dran.html">';
                } else {
                    html+= '<a href="http://www.karopapier.de/showgames.php?spielevon=' + this.model.get("id") + '">';
                }
            }
            html += this.model.get("dran");
            if (this.options.withGamesLink) {
                html+="</a>";
            }
            html += '/';
            html += this.model.get("activeGames");
            html += ')</small>';
        }
        this.$el.html(html);
        return this;
    }
});
