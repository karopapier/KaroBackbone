var MapImageView=Backbone.View.extend({
	className: "mapImageView",
	initialize: function() {
		_.bindAll(this);
		this.model.bind("change:id",this.getImage);
		this.options.settings.bind("change",this.getImage);
		this.img=$(document.createElement("img"));
		this.$img=$(this.img);
		this.$img.attr("src", "http://reloaded.karopapier.de/images/loading.gif");
		this.$el.append(this.img);
	},
	getImage: function() {
		console.info("Getting image");
		var cps=(this.model.get("cpsActive")===true) ? 1 : 0;
		this.$img.attr("src",'http://reloaded.karopapier.de/map/'+this.model.get("id")+'.png?size='+this.options.settings.get("size")+'&border='+this.options.settings.get("border")+'&cps='+cps);
	}
});