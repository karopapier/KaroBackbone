var Backbone = require('backbone');
module.exports = Backbone.View.extend({
    tagName: "canvas",
    initialize: function(options) {
        _.bindAll(this, "drop");
        options = options || {};
        if (!options.imageTranslator) {
            console.error("No imageTranslator passed to EditorImageTranslatorPreview");
            return false;
        }

        this.imageTranslator = options.imageTranslator;
        this.canvas = this.el;
        this.ctx = this.canvas.getContext("2d");

        var me = this;
        this.img = new Image();
        this.img.onload = function() {
            //console.log("Cat loaded");
            var w = me.img.width;
            var h = me.img.height;

            //adjust internal canvas
            me.canvas.width = w;
            me.canvas.height = h;
            me.ctx.drawImage(me.img, 0, 0);
        };
        this.img.src = "/images/dragdropcat.png";

        this.imageTranslator.settings.set("active", false);
        this.imageTranslator.settings.set("done", false);
        this.listenTo(this.imageTranslator.settings, "change", this.render);
    },

    events: {
        "dragover": "prevent",
        "drop": "drop",
    },

    prevent: function(e) {
        e.preventDefault();
        return false;
    },

    drop: function(e) {
        e.preventDefault();
        var origEvent = e.originalEvent;
        var me = this;
        var files = origEvent.dataTransfer.files;
        if (files.length > 0) {
            var file = files[0];
            if (typeof FileReader !== "undefined" && file.type.indexOf("image") != -1) {
                var reader = new FileReader();
                // Note: addEventListener doesn't work in Google Chrome for this event
                reader.onload = function(e) {
                    me.img.src = e.target.result;
                    me.img.onload = function() {
                        me.imageTranslator.loadImage(me.img);
                    };
                };
                reader.readAsDataURL(file);
            }
        }
        //console.log("Set active");
        e.preventDefault();
    },

    render: function() {
        if (!this.imageTranslator.settings.get("active")) {
            //console.info("not active");
            return true;
        }
        var w = this.imageTranslator.settings.get("targetCols");
        var h = this.imageTranslator.settings.get("targetRows");
        console.log("Render preview", w, h);

        //resize resets canvas
        this.canvas.width = w;
        this.canvas.height = h;

        console.log(this.imageTranslator.settings.attributes);
        var imgdat = this.imageTranslator.getImageData();
        console.log("Imgdata I got", imgdat);
        console.log(imgdat);
        this.ctx.putImageData(imgdat, 0, 0);
        //this.canvas.style.width = (w * 10) + "px";
        //this.canvas.style.height = (h * 10) + "px";
    }
});