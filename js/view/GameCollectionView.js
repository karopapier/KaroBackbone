//container for rendered map and players
var GameCollectionView = Marionette.CompositeView.extend({
    childViewContainer: "tbody",
    template: window["JST"]["dran/dranGames"]
});
