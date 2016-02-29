var Backbone = require('backbone');
var MapRenderView = require('../map/MapRenderView');
module.exports = Backbone.View.extend({
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
        this.listenTo(this.model, "change:mapcode", this.recalcDimensions);

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

    },
    render: function() {
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
        'mouseup': 'mouseup',
        "mousemove": "mousemove",
        "contextmenu": "rightclick"
    },

    rightclick: function(e) {
        if (this.editorsettings.get("rightclick")) {
            e.preventDefault();
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

        //check for W-E resize
        if (this.currentDirections.we) {
            var x = xy.x - this.resizeHandleWidth;
            var right = Math.floor((x - this.startX ) / this.fieldsize) > 0;
            var left = Math.ceil((x - this.startX ) / this.fieldsize) < 0;

            if (this.currentDirections.e) {
                if (right) {
                    this.model.addCol(1);
                    this.startX += this.fieldsize;
                }

                if (left) {
                    this.model.delCol(1);
                    this.startX -= this.fieldsize;
                }
            }

            if (this.currentDirections.w) {
                if (left) {
                    this.model.addCol(1, 0);
                    this.startX -= this.fieldsize;
                }

                if (right) {
                    this.model.delCol(1, 0);
                    this.startX += this.fieldsize;
                    //this.el.style.webkitTransform = this.el.style.transform = 'translate(' + this.fieldsize + 'px,' + 0 + 'px)';
                }
            }
        } else {
            //console.log("Skip WE");
        }

        //check for N-S resize
        if (this.currentDirections.ns) {
            var y = xy.y - this.resizeHandleWidth;
            var down = Math.floor((y - this.startY ) / this.fieldsize) > 0;
            var up = Math.ceil((y - this.startY ) / this.fieldsize) < 0;

            if (this.currentDirections.s) {

                if (down) {
                    this.model.addRow(1);
                    this.startY += this.fieldsize;
                }

                if (up) {
                    this.model.delRow(1);
                    this.startY -= this.fieldsize;
                }
            }

            if (this.currentDirections.n) {
                if (up) {
                    this.model.addRow(1, 0);
                    this.startY -= this.fieldsize;
                }

                if (down) {
                    this.model.delRow(1, 0);
                    this.startY += this.fieldsize;
                }
            }
        }

    },

    recalcDimensions: function(e) {
        this.w = this.$el.width();
        this.h = this.$el.height();
        var off = this.$el.offset();
        this.offLeft = Math.round(off.left);
        this.offTop = Math.round(off.top);
        this.outW = this.$el.outerWidth();
        this.outH = this.$el.outerHeight();
        //console.log("Now", this.w, this.h, this.outW, this.outH, this.offLeft, this.offTop);
    },

    resizeDirections: function(e) {
        var d = {
            we: "",
            ns: "",
            n: false,
            s: false,
            w: false,
            e: false
        };
        var xy = this.xyFromE(e);
        var x = xy.x;
        var y = xy.y;
        var rhw = this.resizeHandleWidth;
        var w = this.w;
        var h = this.h;

        if (x < rhw) {
            d.we = "w";
            d.w = true;
        }
        if (x > (w + rhw)) {
            d.we = "e";
            d.e = true;
        }

        if (y < rhw) {
            d.ns = "n";
            d.n = true;
        }
        if (y > (h + rhw)) {
            d.ns = "s";
            d.s = true;
        }

        d.direction = d.ns + d.we;
        return d;
    },

    mousedown: function(e) {
        var button = e.which;
        //console.log("Button", button, "right", this.editorsettings.get("rightclick"));
        if ((button == 3) && (!this.editorsettings.get("rightclick"))) {
            //leave default rightclick menu intact
            return true;
        }

        this.currentDirections = this.resizeDirections(e);
        this.fieldsize = this.viewsettings.get("size") + this.viewsettings.get("border");
        //console.log(this.fieldsize);

        this.editorsettings.set("undo", false);

        this.buttonDown[e.which] = true;
        var xy = this.xyFromE(e);
        //check if we are resizing
        if (this.currentDirections.direction !== "") {
            this.startX = xy.x - this.resizeHandleWidth;
            this.startY = xy.y - this.resizeHandleWidth;
            this.resizing = true;
            e.preventDefault();

            $(document).bind("mousemove", _.bind(this.mousemove, this));
            $(document).bind("mouseup", _.bind(this.mouseup, this));

            return false;
        }

        //no resize, start drawing

        //check draw mode
        if (this.editorsettings.get("drawmode") == "floodfill") {
            //console.log("FLOODFILL");
            var x = xy.x - this.resizeHandleWidth;
            var y = xy.y - this.resizeHandleWidth;
            var buttons = this.editorsettings.get("buttons");
            //console.log(this.buttonDown)

            for (var i = 1; i <= 3; i++) {
                //console.log(this.buttonDown)
                if (this.buttonDown[i]) {
                    //console.log("Floodfill", x, y, buttons[i]);
                    this.mapRenderView.floodfill(x, y, buttons[i]);
                }
            }
            return true;
        }

        //default draw mode
        this.drawing = true;
        //this.render();
        this.draw(e);
        return true;
    },

    mouseup: function(e) {
        this.editorsettings.set("undo", true);
        this.drawing = false;
        this.resizing = false;
        this.buttonDown[e.which] = false;
        $(document).unbind("mousemove");
        $(document).unbind("mouseup");
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
        var d = this.resizeDirections(e);
        if (d.direction) {
            this.el.style.cursor = d.direction + "-resize";
        } else {
            this.el.style.cursor = "crosshair";
        }
    },

    mouseleave: function(e) {
        //console.log("LEAVE");
        this.drawing = false;
        //this.resizing = false;
        for (var i = 1; i <= 3; i++) {
            this.buttonDown[e.which] = false;
        }
    },

});
