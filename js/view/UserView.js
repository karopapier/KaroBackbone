var UserView = Backbone.View.extend({
    options: {
        withAnniversary: true,
        withGames: false,
        withDesperation: false
    },
    tagName: "span",
    initialize: function (options) {
        this.options = _.defaults(options || {}, this.options);

        _.bindAll(this, "render");

        this.model.on("change", this.render)

        this.render();
    },
    render: function () {
        var html = '';
        if (this.options.withDesperation && this.model.get("desperate")) {
            html += '<img src="http:///reloaded.karopapier.de/images/spielegeil.png" alt="Spielegeil" title="Spielegeil">';
        }
        html += '<span class="userLabel">' + this.model.get("login") + '</span>';

        if (this.options.withGames) {
            html += ' <small>(' + this.model.get("dran") + '/' + this.model.get("activeGames") + ')</small>';
        }
        this.$el.html(html);
        return this;
    }
})