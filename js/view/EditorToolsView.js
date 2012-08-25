var EditorToolsView=Backbone.View.extend({
	id: "editorTools",
	initialize: function() {
		$this=this; //for jquery ui slider
		_.bindAll(this);
		this.settings=this.options.settings;
		this.$el.html(window.JST['editor/tools']);
		this.slider=$('#size-slider',this.$el).slider({
			value: 8,
			min: 1,
			max: 20
		});
		this.settings.set("size",8);
		$('#drawSize',this.$el).text(8);
		this.slider.bind("slide", function(event, ui) {
			$this.settings.set("size",ui.value);
			$('#drawSize',this.$el).text(ui.value);
		});
		this.$el.bind("contextmenu",function() { return false; });
		this.buttonColor=[null,"O","S","X"];
		this.highlightActiveField();
	},
	events: {
		"mousedown .fieldSelector": "selectField"
	},
	highlightActiveField: function() {
		$('.fieldSelector',this.$el).removeClass("activeFieldSelector");
		$('.fieldSelector[rel="'+this.buttonColor[1]+'"]',this.$el).addClass("activeFieldSelector");
	},

	selectField: function(e,i) {
		this.buttonColor[e.which]=$(e.currentTarget).attr("rel");
		this.highlightActiveField();
	}
});

