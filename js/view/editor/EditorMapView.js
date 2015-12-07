var EditorMapView = Backbone.View.extend({
    id: "editorMapView",
    initialize: function(options) {
        options = options || {};
        if (!options.viewsettings) {
            console.error("No viewsettings passed to EditorMapView");
            return;
        }
        if (!options.editorsettings) {
            console.error("No editorsettings passed to EditorMapView");
            return;
        }

        _.bindAll(this, "render", "draw", "mousedown", "mouseup", "mousemove", "mouseleave");
        this.viewsettings = options.viewsettings;
        this.editorsettings = options.editorsettings;

        //this.$el.css({"display": "inline-block"});
        /**
         this.$el.resizable({
								resize: function(e,ui) {
									var r=(ui.size.height/($this.settings.get("size")+$this.settings.get("border")));
									//console.log(r,$this.map.get("rows"));
								}
							});
         */
        this.buttonDown = [false, false, false, false];
    },
    render: function() {
        this.$el.empty();
        this.mapRenderView = new MapRenderView({
            settings: this.viewsettings,
            model: this.model
        });
        this.$el.append(this.mapRenderView.el);
        this.mapRenderView.render();
    },
    events: {
        'mousedown': 'mousedown',
        'mouseup': 'mouseup',
        'mouseleave': 'mouseleave',
        "contextmenu": function() {
            return false;
        }
    },

    draw: function(e) {
        var x = e.pageX - this.$el.offset().left;
        var y = e.pageY - this.$el.offset().top;
        var buttons = this.editorsettings.get("buttons");
        //console.log("Draw ", x, y);
        for (var i = 1; i <= 3; i++) {
            if (this.buttonDown[i]) {
                $('#drag' + i).text("(" + x + "|" + y + ")").show();
                this.mapRenderView.setFieldAtXY(x, y, buttons[i]);
            }
        }
    },

    mousedown: function(e) {
        this.drawing = true;
        this.buttonDown[e.which] = true;
        e.preventDefault();
        //this.render();
        this.draw(e);
        this.$el.bind("mousemove", this.mousemove);
    },

    mouseup: function(e) {
        this.drawing = false;
        this.buttonDown[e.which] = false;
        //this.render();
        this.$el.unbind("mousemove");
    },

    mousemove: function(e) {
        if (this.drawing) {
            this.draw(e);
        }
    },

    mouseleave: function(e) {
        this.drawing = false;
        for (var i = 1; i <= 3; i++) {
            this.buttonDown[e.which] = false;
        }
        this.$el.unbind("mousemove");
    }
});
