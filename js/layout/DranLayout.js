var DranLayout = Backbone.Marionette.LayoutView.extend({
    template: window["JST"]["dran/dranLayout"],
    regions: {
        dranInfo: "#dranInfo",
        dranGames: "#dranGames"
    }
})