var EditorAppRouter = Backbone.Router.extend({
	routes: {
		"editor/:mapId": "loadMap",
		"editor": "loadMap",
		"": "loadMap"
	},

	loadMap: function(mapId) {
		console.info("Loading "+mapId);
		mapId = mapId || 1;
		app.editor.loadMapId(mapId);
	}
});