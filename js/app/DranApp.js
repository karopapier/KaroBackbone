var DranApp = Backbone.Marionette.Application.extend({
    className: "dranApp",
    initialize: function () {
        this.layout = new ChatLayout({});
        this.layout = new DranLayout({});
        this.view = new DranAppView({
            model: this
        });
        this.gamesView = new GameCollectionView({
            childView: GameListItemView,
            collection: Karopapier.UserDranGames
        })
    }
});

var DranAppView = Marionette.ItemView.extend({
    className: "dranAppView",
    render: function () {
        this.model.layout.render();
        //insert views
        this.model.layout.dranGames.show(this.model.gamesView);
        this.$el.html(this.model.layout.$el);
    }
});
