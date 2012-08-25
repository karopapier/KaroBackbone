var EditorView=Backbone.View.extend({
	id: 'editor',
	initialize: function() {
		_.bindAll(this);
		this.settings=new ViewSettings();
		this.editorToolsView=new EditorToolsView({ "settings": this.settings});
		this.editorMapView= new EditorMapView({ "settings": this.settings, "tools": this.editorToolsView});
		var mapArea=$(document.createElement("div"));
		//resizable container mapArea
		mapArea.attr("id","editorMapArea");
		mapArea.append(this.editorMapView.el);
		this.$el.append(mapArea);
		this.$el.append(this.editorToolsView.el);
		this.mapcode=$('<textarea id="mapcode" style="float: left; display: block">XOSOFOX</textarea>');
		this.$el.append(this.mapcode);
		this.$el.append($('<input type="button" class="loadMapcode" value="Load" />'));
		this.editorMapView.map.bind("change:rows change:cols",function() {
			this.mapcode.attr("rows",this.editorMapView.map.get("rows"));
			this.mapcode.attr("cols",this.editorMapView.map.get("cols"));
		},this);
		this.editorMapView.map.bind("change:mapcode",function(e,mapcode) {
			this.mapcode.val(mapcode);
		},this);
		this.editorMapView.map.bind("change:starties",function(e,starties) {
			$('#starties').text(starties);
		},this);
		this.editorMapView.map.bind("change:cps",function(e,cps) {
			$('#cpsUsed').text(cps.join(","));
		},this);
	},
	events: {
		'click .loadMapcode': "loadMapcode"
	},
	loadMapId: function(mapId) {
		var $this=this;
		$.getJSON("http://reloaded.karopapier.de/api/mapcode/"+mapId+".json?callback=?",function(data) {
			var mapcode=data.mapcode;
			$this.mapcode.val(mapcode);
			$this.loadMapcode(mapcode);
		});
	},
	loadMapcode: function() {
		this.editorMapView.map.set("mapcode",this.mapcode.val());
		this.editorMapView.map.setMatrixFromCode();
		this.editorMapView.render();
	}
});

