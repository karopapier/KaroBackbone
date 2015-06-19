var DranApp = Backbone.Marionette.LayoutView.extend({
    className: "dranApp",
    initialize: function () {
        this.layout = new DranLayout({
            el: this.el
        });
        this.layout.render();
    },
    render: function () {
        this.gamesView = new GameCollectionView({
            childView: GameListItemView,
            collection: Karopapier.UserDranGames
        })
        this.layout.dranGames.show(this.gamesView);
    }
});

