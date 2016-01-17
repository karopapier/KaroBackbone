var GameAppView = Backbone.View.extend({
	tagName: "div",
	id: "GameApp",


	initialize: function() {
		this.template = _.template('<div style="float: left"><h1 id="title">KaroBackbone</h1><div id="latestMessages"></div></div><div id="gameInfo"></div><div class="clearer"></div></div><div id="GameView"></div><div id="moveMessages"></div><div id="GameDetails"></div><div id="gameAppNavigation"></div>');
		this.$el.html(this.template);

		this.game=this.model;

		_.bindAll(this);

		this.gameView=new GameView({
			model:this.model,
			el: $('#GameView',this.$el)
		});

		//init game navigation
		this.navigation=new GameAppNavigationView({
			el: $('#gameAppNavigation',this.$el)
		});
		this.navigation.render();

		//init game info
		this.gameInfo=new GameInfoView({
			model: this.game,
			el: $('#gameInfo',this.$el)
		});
		this.gameInfo.render();

		//init latestMessages
		this.latestMessages=new MoveMessageView({
			model: this.game.moveMessages,
			el: $('#latestMessages',this.$el),
			filter: function(mm) {
				return (mm.get("player").get("name")=="Kinvarra");
			},
			max: 5
		})
		//init moveMessages
		this.moveMessages=new MoveMessageView({
			model: this.game.moveMessages,
			el: $('#moveMessages',this.$el),
			filter: false,
			max:10
		});

		//events
		this.model.bind("change",this.redraw);
	},

	close: function() {
		//remove child views
		this.gameView.close();
		this.gameInfo.close();
		this.navigation.close();
		alert("Remove myself");
		this.$el.remove();
	},

	render: function() {
		app.content.append(this.el);
	},

	redraw: function() {
		app.setTitle(this.model.get("name"));
		this.gameInfo.redraw();
		//need to create a template
	},

	setGameId: function(gameId) {
		if (gameId!=0) {
			this.model.load(gameId);
		}
	}

})
