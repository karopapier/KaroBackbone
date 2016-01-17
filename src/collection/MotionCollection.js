var MotionCollection = Backbone.Collection.extend({
	model: Motion,

	getByMotionString: function(moString) {
		var motion=false;
		this.each(function(mo) {
			if (mo.toString()===moString) {
				motion=mo;
			}
		})
		return motion;
	}
});
