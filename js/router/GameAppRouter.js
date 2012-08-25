var AppRouter = Backbone.Router.extend({
	routes: {
		"game/:gameId": "showGame",
		"game": "showGame",
		"": "showGame"
	},

	showGame: function(gameId) {
		console.info("Routing to "+gameId);
		gameId = gameId || 70000;
		app.gameAppView.setGameId(gameId);
	}
});

