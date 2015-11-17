var DranApp = Backbone.Marionette.LayoutView.extend({
    className: "dranApp",
    initialize: function() {
        this.layout = new DranLayout({
            //el: this.el
        });
    },
    render: function () {
        console.log("Render of DranApp");
        this.layout.render();
        return;
        this.gamesView = new GameCollectionView({
            childView: GameListItemView,
            collection: Karopapier.UserDranGames
        })
        this.layout.dranGames.show(this.gamesView);
    }
});

