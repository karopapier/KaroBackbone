var MapImageView=MapBaseView.extend({
	className: "mapImageView",
    tag: "img",
	initialize: function(options) {
        //init MapBaseView with creation of a settings model
        this.constructor.__super__.initialize.apply(this,arguments);
		_.bindAll(this,"render");
		this.model.bind("change:id",this.render);
        this.mapViewSettings.bind("change",this.render);
	},
	render: function() {
		//console.info("Getting image");
        console.log(this.model);
		var cps=(this.mapViewSettings.get("cpsActive")===true) ? 1 : 0;
        this.$el.attr("src", "http://reloaded.karopapier.de/images/loading.gif");
		this.$el.attr("src",'http://reloaded.karopapier.de/map/'+this.model.get("id")+'.png?size='+this.mapViewSettings.get("size")+'&border='+this.mapViewSettings.get("border")+'&cps='+cps);
    }
});