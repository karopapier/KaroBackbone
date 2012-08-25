var GameAppNavigationView = Backbone.View.extend({
	events: {
		'click .back': "backGame",
		'click .next': "nextGame",
		'click .smaller': "smallerView",
		'click .bigger': "biggerView"
	},

	render: function() {
		console.info("Rendering GameAppNav");
		var html='';
		html+= '<span class="clickable back">Back</span> ';
		html+= '<span class="clickable smaller"> - </span> ';
		html+= '<span class="clickable bigger"> + </span> ';
		html+= '<span class="clickable next">Next</span> ';
		this.$el.html(html);
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

