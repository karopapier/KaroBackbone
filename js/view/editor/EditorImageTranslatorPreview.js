var EditorImageTranslatorPreview = Marionette.ItemView.extend({
    tagName: "canvas",
    initialize: function(options) {
        _.bindAll(this, "drop");
        options = options || {};
        if (!options.imageTranslator) {
            console.error("No imageTranslator passed to EditorImageTranslatorPreview");
            return false;
        }

        this.imageTranslator = options.imageTranslator;
        this.img = new Image();
        this.canvas = this.el;
        this.ctx = this.canvas.getContext("2d");
        this.active = false;
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
                    me.imageTranslator.loadImage(me.img);
                };
                reader.readAsDataURL(file);
            }
        }
        //console.log("Set active");
        this.active = true;
        e.preventDefault();
    },

    render: function() {
        this.ctx.fillStyle = "rgb(200, 100, 0)";
        this.ctx.fillRect(0, 0, 30, 30);
        if (!this.active) {
            //console.info("not active");
            return true;
        }
        this.canvas.width = this.imageTranslator.settings.get("sourceWidth");
        this.canvas.height = this.imageTranslator.settings.get("sourceHeight");
        var imgdat = this.imageTranslator.getImageData();
        //console.log(imgdat);
        this.ctx.putImageData(imgdat, 0, 0);

        console.info("Now add grid");
    }
});