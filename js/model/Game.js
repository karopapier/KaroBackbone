var Game = Backbone.Model.extend({
	defaults: {
		id: 0
	},

	url: function() {
		return "http://reloaded.karopapier.de/api/game/"+this.get("id")+"/details.json?callback=?";
	},

	parse: function(data) {
		//make sure data is matching current gameId (delayed reposens get dropped)
		if (data.game.id==this.id) {
			//pass checkpoint info to map as "cpsActive" // map has cps attr as well, array of avail cps
			this.map.set({"cpsActive":data.game.cps},{silent:true});
			this.map.set(data.map);
			playersData=data.players;
			_.each(playersData,function(playerData) {
				lastmove=new Move(playerData.lastmove);
				playerData.lastmove=lastmove;
				moves=new MoveCollection(playerData.moves);
				playerData.moves=moves;
			});
			this.players.reset(data.players);
			return data.game;
		} else {
			console.info("Dropped response for "+data.game.id);
		}
	},

	initialize: function() {
		this.map = new Map();
		this.moveMessages =new MoveMessageCollection();
		this.players = new PlayerCollection([{id:0}],{"moveMessages": this.moveMessages});
	},

	load: function (id) {
		//silently set the id, events trigger after data is here
		this.set({"id": id},{silent:true});
		console.info("Fetching for "+id);
		this.fetch();
	}
});
