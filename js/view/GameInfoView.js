var GameInfoView = Backbone.View.extend({
	id: "gameInfo",
	initialize: function() {
		this.template= _.template('<b>Spielinfos:</b> <ul> <li>Karte: <%= mapId %> - <%= mapName %> von <%= mapAuthor %></li><li>Richtungsmodus <b><%= gameDir %></b>, MEANING</li><li>ZZZ steht auf <%= gameZzz %></li><li>Checkpoints sind <b><%= gameCps %></b> CHECK MAP</li><li>Taktisches Crashen ist <b><%= gameTc %></b></li></ul>übrigens wurde das Spiel am <%= gameCreated %> von <%= gameCreator %> gestartet.');
	},
	redraw: function(){
		this.$el.html(this.template({
			mapId: this.model.map.get("id"),
			mapName: this.model.map.get("name"),
			mapAuthor: this.model.map.get("author"),
			gameCreator: this.model.get("creator"),
			gameCreated: this.model.get("created"),
			gameDir: this.model.get("dir"),
			gameCps: this.model.get("cps"),
			gameTc: this.model.get("tcrash"),
			gameZzz: this.model.get("zzz")

		}));
	}
});

