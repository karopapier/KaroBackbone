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

    },

    start: function() {

        return "XOSOFOX";

    },

    loadImage: function() {

    },

    loadUrl: function(url, callback) {
        var me = this;
        this.image.onload = function() {
            me.ctx.drawImage(me.image, 0, 0);
            callback();
        };
        this.image.src = url;
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
