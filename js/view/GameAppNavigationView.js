var GameAppNavigationView = Backbone.Marionette.ItemView.extend({
	template: "#game-navi-template",
	events: {
		'click .back': "backGame",
		'click .next': "nextGame",
		'click .smaller': "smallerView",
		'click .bigger': "biggerView"
	},

	"smallerView": function () {
		var size=app.gameAppView.gameView.settings.get("size");
		app.gameAppView.gameView.settings.set({"size":size-1});
	},

	"biggerView": function () {
		var size=app.gameAppView.gameView.settings.get("size");
		app.gameAppView.gameView.settings.set({"size":size+1});
	},

	"backGame": function() {
		var oldId=parseInt(app.gameAppView.model.get("id"));
		app.router.navigate('game/'+(oldId-1),{trigger: true});
	},
	"nextGame": function() {
		var oldId=parseInt(app.gameAppView.model.get("id"));
		app.router.navigate('game/'+(oldId+1),{trigger: true});
	}
})

