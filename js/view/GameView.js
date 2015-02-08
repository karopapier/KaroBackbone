//container for rendered map and players
var GameView = Backbone.View.extend({
	initialize: function() {
		this.game=this.model;
		this.template= _.template('<div id="mapImageView"></div><div id="playersView"></div>');
		this.$el.html(this.template);

		this.settings=new ViewSettings();
		this.mapImageView=new MapImageView({
			model: this.model.map,
			settings: this.settings,
			el: $('#mapImageView',this.$el)
		});

		this.playersView=new PlayerCollectionView({
			model:this.model.get("players"),
			settings: this.settings,
			el: $('#playersView',this.$el)
		});
	},
	render: function() {
		this.$el.html(this.template());
		this.mapImageView.render();
		this.$el.append(this.mapImageView.$el);

	}
});

