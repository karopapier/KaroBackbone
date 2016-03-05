var MapBaseView = require('./MapBaseView');
var MapRenderPalette = require('../../model/map/MapRenderPalette');
module.exports = MapBaseView.extend({
    className: "mapRenderView",
    tagName: "canvas",
    initialize: function(options) {
        //init MapBaseView with creation of a settings model
        this.constructor.__super__.initialize.apply(this, arguments);
        _.bindAll(this, "drawField", "render", "prepareCache");
        this.listenTo(this.model, "change:mapcode", this.render);
        this.listenTo(this.model, "change:field", this.renderFieldChange);

        this.listenTo(this.settings, "change:size change:border", this.prepareCache);
        this.listenTo(this.settings, "change:size change:border", this.render);

        this.palette = new MapRenderPalette();

        this.ctx = this.el.getContext("2d");
        this.helper = 0; //used to cycle through 4 different standardfield caches

        this.prepareCache();
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
            ctx = me.prepareFieldCtx(ctx, f);
            me.imageDatas[f] = ctx.getImageData(0, 0, me.fieldSize, me.fieldSize);
        });
    },

    prepareFieldCtx: function(ctx, f) {
        var me = this;

        //fill completely field with primary color
        ctx.fillStyle = "rgb(203, 191, 179)";
        ctx.fillRect(0, 0, me.fieldSize, me.fieldSize);

        var alpha = 1;
        var color = "";

        ctx.fillStyle = me.palette.getRGB(f);
        //ctx.fillRect(3, 3, me.fieldSize-6, me.fieldSize-6);
        ctx.beginPath();
        ctx.arc(me.fieldSize / 2, me.fieldSize / 2, (me.fieldSize / 2)-1, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();

        return ctx;
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
        this.ctx.putImageData(d, x, y);
    }
});
