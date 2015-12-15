var EditorImageTranslator = Backbone.Model.extend({
    //drop area to receive file
    //area to show dropped image
    //   -> EditorImageTranslatorView?
    //   -> EditorImageTranslatorSourceView?
    //   -> EditorImageTranslatorSettingsView?

    //INPUTS
    //src canvas or imagedata
    //target mapcode

    //SETTINGS:
    //bw mode (XO) or color mode (full palette)
    //scale factor width
    //scale factor height

    //RUN
    //translate rectangles into one map field


    //include progress callback


    initialize: function() {
        this.image = new Image();
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.settings = new EditorImageTranslatorSettings();
    },

    run: function() {
        var mapcode = "";
        var scaleWidth = this.settings.get("scaleWidth");
        var scaleHeight = this.settings.get("scaleHeight");
        var w = this.image.width;
        var h = this.image.height;

        console.log("Run translation of " + w + "x" + h + " at", scaleWidth, scaleHeight);
        var codeRows = [];
        for (var row = 0; row < h; row += scaleHeight) {
            for (var col = 0; col < w; col += scaleWidth) {
                var imgdata = this.ctx.getImageData(col, row, scaleWidth, scaleHeight);
                var pixelRgba = this.averageRgba(imgdata.data);
                if (pixelRgba[0] <= 127) {
                    mapcode += "O";
                } else {
                    mapcode += "X";
                }
            }
            codeRows.push(mapcode);
            mapcode = "";
        }
        mapcode = codeRows.join('\n');
        console.log(mapcode);
        this.set("mapcode", mapcode);
        return true;
    },

    getSourceInfo: function() {
        return {
            width: this.image.width,
            height: this.image.height
        }
    },

    loadImage: function(img) {
        console.log("Load", img);
        var w = img.width;
        var h = img.height;
        this.settings.set({
            sourceWidth: w,
            sourceHeight: h
        });

        this.canvas.width = w;
        this.canvas.height = h;
        this.ctx.drawImage(img, 0, 0);
        console.log("Loaded");
    },

    loadUrl: function(url, callback) {
        var me = this;
        this.image.onload = function() {
            var w = me.image.width;
            var h = me.image.height;
            me.settings.set({
                sourceWidth: w,
                sourceHeight: h
            });

            me.canvas.width = w;
            me.canvas.height = h;
            me.ctx.drawImage(me.image, 0, 0);
            callback();
        };
        this.image.src = url;
    },

    averageRgba: function(imageData) {
        if (imageData.length % 4 != 0) {
            console.error("Imagedate has a length of", imageData.length);
            return false;
        }

        var sum = [0, 0, 0];
        for (var p = 0, l = imageData.length; p < l; p += 4) {
            sum[0] += imageData[p];
            sum[1] += imageData[p + 1];
            sum[2] += imageData[p + 2];
        }
        var pixels = l / 4;
        avg = [sum[0] / pixels, sum[1] / pixels, sum[2] / pixels, 255];
        //console.log(avg);
        return avg;
    },

    rgb2hsl: function(rgb) {
        /**
         * based on
         * http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
         * and adjusted
         *
         * Converts an RGB color value to HSL. Conversion formula
         * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
         * Assumes r, g, and b are contained in the set [0, 255] and
         * returns h, s, and l in the set [0, 1].
         *
         * @param   Array           [red, green, blue]
         * @return  Array           The HSL representation
         */
        var r = rgb[0];
        var g = rgb[1];
        var b = rgb[2];
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h *= 60;
        }
        s *= 100;
        l *= 100;

        return [Math.round(h), Math.round(s), Math.round(l)];
    },
    getFieldForRGB: function(r, g, b) {
        return "X";
    }

});
