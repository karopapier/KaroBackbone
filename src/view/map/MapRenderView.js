var MapBaseView = require('./MapBaseView');
var MapRenderPalette = require('../../model/map/MapRenderPalette');
module.exports = MapBaseView.extend({
    className: "mapRenderView",
    tagName: "canvas",
    initialize: function(options) {
        //init MapBaseView with creation of a settings model
        this.constructor.__super__.initialize.apply(this, arguments);
        _.bindAll(this, "drawField", "render", "addBorder", "addFlags", "addStartGrid", "addSpecles", "renderCheckpoints", "prepareCache");
        this.listenTo(this.model, "change:mapcode", this.render);
        this.listenTo(this.model, "change:field", this.renderFieldChange);

        this.listenTo(this.settings, "change:size change:border", this.prepareCache);
        this.listenTo(this.settings, "change:size change:border", this.render);

        this.listenTo(this.settings, "change:cpsVisited change:cpsActive", this.prepareCache);
        this.listenTo(this.settings, "change:cpsVisited change:cpsActive", this.renderCheckpoints);

        this.listenTo(this.settings, "change:specles", this.prepareCache);
        this.listenTo(this.settings, "change:specles", this.render);

        this.palette = new MapRenderPalette();

        this.standardFields = "LNOVWXYZ.";
        this.flagFields = "F123456789";
        this.ctx = this.el.getContext("2d");
        this.helper = 0; //used to cycle through 4 different standardfield caches

        this.prepareCache();
    },

    isCheckpoint: function(f) {
        return (parseInt(f) == f);
    },

    isFlagField: function(f) {
        return (this.flagFields.indexOf(f) >= 0);
    },

    isStandardField: function(f) {
        return (this.standardFields.indexOf(f) >= 0);
    },

    prepareCache: function() {
        console.info("Prepare field cache");
        var me = this;
        this.imageDatas = {};
        this.size = this.settings.get("size");
        this.border = this.settings.get("border");
        this.fieldSize = this.size + this.border;
        this.specles = this.settings.get("specles");
        this.cpsActive = this.settings.get("cpsActive");
        this.cpsVisited = this.settings.get("cpsVisited");

        var canvas = document.createElement("canvas");
        canvas.width = canvas.height = this.fieldSize;
        var ctx = canvas.getContext("2d");

        _.each(this.model.FIELDS, function(name, f) {
            if (me.isStandardField(f)) {
                me.imageDatas[f] = [];
                //create 4 different random fields
                for (var i = 0; i < 4; i++) {
                    ctx = me.prepareFieldCtx(ctx, f);
                    me.imageDatas[f].push(ctx.getImageData(0, 0, me.fieldSize, me.fieldSize));
                }
            } else {
                ctx = me.prepareFieldCtx(ctx, f);
                me.imageDatas[f] = ctx.getImageData(0, 0, me.fieldSize, me.fieldSize);
            }
        });
    },

    prepareFieldCtx: function(ctx, f) {
        var me = this;

        //fill completely field with primary color
        ctx.fillStyle = me.palette.getRGB(f);

        var alpha = 1;
        var color = "";
        //if CP but not active, replace with "O"
        if (me.isCheckpoint(f)) {
            if (!me.cpsActive) {
                ctx.fillStyle = me.palette.getRGB("O");
            } else {
                if (me.cpsVisited.indexOf(parseInt(f)) >= 0) {
                    ctx.fillStyle = me.palette.getRGB("O");
                    ctx.fillRect(0, 0, me.fieldSize, me.fieldSize);
                    //change to rgba with .3
                    color = me.palette.getRGB(f);
                    color = color.replace("rgb", "rgba").replace(")", ", 0.3)");
                    ctx.fillStyle = color;
                    alpha = 0.3;
                }
            }
        }

        ctx.fillRect(0, 0, me.fieldSize, me.fieldSize);

        if (me.size > 1 && me.isFlagField(f)) {
            color = me.palette.getRGB(f + "_2");
            if (alpha != 1) {
                color = color.replace("rgb", "rgba").replace(")", ", " + alpha + ")");
            }
            me.addFlags(ctx, color);
            return ctx;
        }

        //no specles on tiny fields
        //specles only on standard fields
        if (me.size > 4 && me.isStandardField(f) && me.specles) {
            me.addSpecles(ctx, me.palette.getRGB(f + "_2"));
        }

        if (f === "S") {
            me.addStartGrid(ctx, me.palette.getRGB("S_2"));
            return ctx;
        }

        if (me.border > 0) {
            me.addBorder(ctx, me.palette.getRGB(f + "_2"));
        }
        return ctx;
    },

    renderCheckpoints: function() {
        //console.warn("RENDER CHECKPOINTS", new Date());

        //find cps
        var cps = this.model.getCpPositions();
        //console.log("CPs to render", cps);
        var me = this;

        //for each cp, drawField
        cps.forEach(function(pos) {
            var cp = pos.attributes;
            var f = me.model.getFieldAtRowCol(cp.row, cp.col);
            //console.log("Rendering CP", cp, f);
            if (me.settings.get("cpsActive")) {
                me.drawField(cp.row, cp.col, f);
            } else {
                me.drawField(cp.row, cp.col, "O");
            }
        });
    },

    renderFieldChange: function(e, a, b) {
        //console.info("Fieldchange only");
        var field = e.field;
        var r = e.r;
        var c = e.c;
        this.drawField(r, c, field);
    },

    render: function() {
        console.warn("FULL RENDER", new Date());
        this.trigger("before:render");
        var map = this.model;
        var rows = map.get("rows");
        var cols = map.get("cols");
        this.el.width = map.get("cols") * (this.fieldSize);
        this.el.height = map.get("rows") * (this.fieldSize);

        var me = this;
        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                var f = map.getFieldAtRowCol(r, c);
                me.drawField(r, c, f);
            }
        }
        this.trigger("render");
    },

    drawField: function(r, c, field) {
        var x = c * (this.fieldSize);
        var y = r * (this.fieldSize);
        var d = this.imageDatas[field];
        if (!d) {
            //unknown new field??
            field = "X";
            d = this.imageDatas["X"];
        }
        if (this.helper >= 4) this.helper = 0;
        if (this.isStandardField(field)) {
            d = d[this.helper];
            this.helper++;
        }
        this.ctx.putImageData(d, x, y);
    },

    addSpecles: function(ctx, color) {
        //console.log("Adding specles ");
        ctx.fillStyle = color;
        for (var i = 0; i < 3; i++) {
            var xr = Math.round(Math.random() * (this.size - 1));
            var yr = Math.round(Math.random() * (this.size - 1));
            ctx.fillRect(xr, yr, 1, 1);
        }
    },

    addBorder: function(ctx, color) {
        //console.log("Adding border");
        ctx.lineWidth = this.border;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(this.size + this.border / 2, 0);
        ctx.lineTo(this.size + this.border / 2, this.size + this.border / 2);
        ctx.lineTo(0, this.size + this.border / 2);
        ctx.stroke();
        ctx.closePath();
    },

    addFlags: function(ctx, color) {
        //assume prefilled with color1
        if (this.fieldSize < 2) return;
        ctx.fillStyle = color;

        var factor = Math.round(this.fieldSize / 4);
        var sende = this.fieldSize / factor;

        for (var m = 0; m < sende; m++) {
            for (var n = 0; n < sende; n++) {
                if ((m + n) % 2 === 1) {
                    var xm = Math.round(m * factor);
                    var yn = Math.round(n * factor);
                    ctx.fillRect(xm, yn, factor, factor);
                }
            }
        }
    },

    addStartGrid: function(ctx, color) {
        //fg square
        var newSize = this.fieldSize;
        ctx.lineWidth = this.fieldSize / 8;
        ctx.strokeStyle = color;
        ctx.beginPath();
        //30% border
        ctx.rect(0.3 * newSize, 0.3 * newSize, 0.4 * newSize, 0.4 * newSize);
        ctx.stroke();

    }
});
