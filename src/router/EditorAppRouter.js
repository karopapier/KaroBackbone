var EditorAppRouter = Backbone.Router.extend({
    routes: {
        "editor.html": "loadMap",
        "editor/:mapId": "loadMap",
        "editor": "loadMap",
        "": "loadMap"
    },

    loadMap: function(mapId) {
        alert("Hier will ich gar nicht hin");
        return false;
        console.info("Loading " + mapId);
        mapId = mapId || 1;
        app.loadMapId(mapId);
    }
});