var EditorMapView = Backbone.View.extend({
    id: "editorMapView",
    initialize: function (options) {
        _.bindAll(this, "render", "draw", "mousedown", "mouseup", "mousemove", "mouseleave");
        this.settings = options.settings || new Backbone.Model();
        this.tools={
            buttonColor:["X","1","O"]
        };
        this.$el.bind("contextmenu", function () {
            return false;
        });

        //this.$el.css({"display": "inline-block"});
        /**
         this.$el.resizable({
								resize: function(e,ui) {
									var r=(ui.size.height/($this.settings.get("size")+$this.settings.get("border")));
									//console.log(r,$this.map.get("rows"));
								}
							});
         */
        this.buttonDown=[false, false, false];
    },
    render: function () {
        this.$el.empty();
        this.mapRenderView = new MapRenderView({
            settings: this.settings,
            model: this.model
        });
        this.$el.append(this.mapRenderView.el);
        this.model.set("mapcode", "XOX");
        this.mapRenderView.render();
    },
    events: {
        'mousedown': 'mousedown',
        'mouseup': 'mouseup',
        'mouseleave': 'mouseleave',
        "contextmenu": function () {
            return false;
        }
    },

    draw: function (e) {
        var x = e.pageX - this.$el.offset().left;
        var y = e.pageY - this.$el.offset().top;
        for (var i = 1; i <= 3; i++) {
            if (this.buttonDown[i]) {
                $('#drag' + i).text("(" + x + "|" + y + ")");
                this.mapRenderView.setFieldAtXY(x, y, this.tools.buttonColor[i]);
            }
        }
    },

    mousedown: function (e) {
        this.buttonDown[e.which] = true;
        e.preventDefault();
        //this.render();
        this.draw(e);
        this.$el.bind("mousemove", this.mousemove);
    },

    mouseup: function (e) {
        this.buttonDown[e.which] = false;
        //this.render();
        this.$el.unbind("mousemove");
    },

    mousemove: function (e) {
        this.draw(e);
    },

    mouseleave: function (e) {
        for (var i = 1; i <= 3; i++) {
            this.buttonDown[e.which] = false;
        }
        this.$el.unbind("mousemove");
    }
});
