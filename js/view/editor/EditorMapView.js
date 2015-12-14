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

        _.bindAll(this, "render", "draw", "mousedown", "mouseup", "mousemove", "mouseleave", "recalcDimensions");
        this.viewsettings = options.viewsettings;
        this.editorsettings = options.editorsettings;
        this.resizeHandleWidth = 15;
        this.listenTo (this.model, "change:mapcode", this.recalcDimensions);

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
        this.drawing = false;
        this.resizing = false;

        $(document).mousemove(_.bind(this.mousemove, this));
        $(document).mouseup(_.bind(this.mouseup, this));

    },
    render: function() {
        this.viewsettings.set({
            size: 20,
            border: 8
        });
        this.mapRenderView = new MapRenderView({
            settings: this.viewsettings,
            model: this.model
        });
        this.listenTo(this.mapRenderView, "render", this.recalcDimensions);
        this.setElement(this.mapRenderView.el);
        this.$el.css("border", this.resizeHandleWidth + "px solid lightgrey");
        this.mapRenderView.render();
    },

    events: {
        'mouseleave': 'mouseleave',
        'mouseenter': "mouseenter",
        'mousedown': 'mousedown',
        //'mouseup': 'mouseup',
        //"mousemove": "mousemove",
        "contextmenu": function() {
            return false;
        }
    },

    xyFromE: function(e) {
        var x = (e.pageX - this.offLeft);
        var y = (e.pageY - this.offTop);
        return {x: x, y: y};
    },

    draw: function(e) {
        var xy = this.xyFromE(e);
        var x = xy.x - this.resizeHandleWidth;
        var y = xy.y - this.resizeHandleWidth;
        var buttons = this.editorsettings.get("buttons");
        //console.log("Draw ", x, y);
        for (var i = 1; i <= 3; i++) {
            if (this.buttonDown[i]) {
                this.mapRenderView.setFieldAtXY(x, y, buttons[i]);
            }
        }
    },

    resize: function(e) {
        if (!this.resize) return false;
        var target = e.target;

        var xy = this.xyFromE(e);
        var x = xy.x - this.resizeHandleWidth;
        var y = xy.y - this.resizeHandleWidth;
        var Fieldsize = 28;

        //console.log(this.startX, x);
        //console.log(this.startY, y);
        console.log(this.rd);
        var plusX = Math.floor((x - this.startX ) / Fieldsize);
        var minusX = Math.ceil((x - this.startX ) / Fieldsize);
        //var plusY = Math.floor((y - this.startY ) / Fieldsize);
        //var minusY = Math.ceil((y - this.startY ) / Fieldsize);

        console.log("X, startX, plusX:", x, this.startX, plusX);

        //console.log(plusX, minusX, plusY, minusY);
        if (plusX > 0) {
            console.log("Add col");
            this.model.addCol(1);
            this.startX += Fieldsize;
        }


        if (minusX < 0) {
            //console.log("Del col");
            this.model.delCol(1);
            this.startX -= Fieldsize;
        }

        /*
        if (plusY > 0) {
            //console.log("Add row");
            //map.addRow(1);
        }
        /*
         if (minusY < 0) {
         //map.delRow(1);
         }
         */

    },

    recalcDimensions: function(e) {
        this.w = this.$el.width();
        this.h = this.$el.height();
        var off = this.$el.offset();
        this.offLeft = Math.round(off.left);
        this.offTop = Math.round(off.top);
        this.outW = this.$el.outerWidth();
        this.outH = this.$el.outerHeight();
        console.log("Now", this.w, this.h, this.outW, this.outH, this.offLeft, this.offTop);
    },

    resizeDirection: function(e) {
        var directionNS = "";
        var directionWE = "";
        var xy = this.xyFromE(e);
        var x = xy.x;
        var y = xy.y;
        var rhw = this.resizeHandleWidth;
        var w = this.w;
        var h = this.h;

        if (x < rhw) directionWE = "w";
        if (x > (w + rhw)) directionWE = "e";
        if (y < rhw) directionNS = "n";
        if (y > (h + rhw)) directionNS = "s";
        var direction = directionNS + directionWE;
        console.log(direction);
        return direction;
    },

    mousedown: function(e) {
        this.rd = this.resizeDirection(e);
        if (this.rd !== "") {
            var xy = this.xyFromE(e);
            this.startX = xy.x - this.resizeHandleWidth;
            this.startY = xy.y - this.resizeHandleWidth;
            this.resizing = true;
            e.preventDefault();
            return false;
        }

        this.drawing = true;
        this.buttonDown[e.which] = true;
        //this.render();
        this.draw(e);
        return true;
    },

    mouseup: function(e) {
        this.drawing = false;
        this.resizing = false;
        this.buttonDown[e.which] = false;
    },

    mouseenter: function(e) {
        //If it's not correctly updated, do this!
        if (this.offTop == 0) this.recalcDimensions();
    },

    mousemove: function(e) {
        if (this.drawing) {
            this.draw(e);
            return true;
        }

        if (this.resizing) {
            this.resize(e);
            return true;
        }

        if (e.target.tagName.toUpperCase() !== "CANVAS") return false;
        //console.log(e.target);

        //simple mouse move
        var rd = this.resizeDirection(e);
        if (rd) {
            this.el.style.cursor = this.resizeDirection(e) + "-resize";
        } else {
            this.el.style.cursor = "crosshair";
        }
    },

    mouseleave: function(e) {
        console.log("LEAVE");
        this.drawing = false;
        //this.resizing = false;
        for (var i = 1; i <= 3; i++) {
            this.buttonDown[e.which] = false;
        }
    },

});
