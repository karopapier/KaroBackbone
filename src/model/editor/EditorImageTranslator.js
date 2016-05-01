var Backbone = require('backbone');
var EditorImageTranslatorSettings = require('./EditorImageTranslatorSettings');
var MapRenderPalette = require('../map/MapRenderPalette');
module.exports = Backbone.Model.extend({
    initialize: function(options) {
        options = options || {};
        if (!options.map) {
            console.error("No map passed to EditorImageTranslator");
            return;
        }
        if (!options.editorsettings) {
            console.error("No editorsettings passed to EditorImageTranslator");
            return;
        }
        this.map = options.map;
        this.editorsettings = options.editorsettings;

        _.bindAll(this, "loadImage", "loadUrl", "getImageData", "getFieldForRgbaArray", "initColorMode");
        //internal offscreen img and canvas
        this.origImage = new Image();
        this.avgImage = new Image();

        this.origCanvas = document.createElement('canvas');
        this.avgCanvas = document.createElement('canvas');
        this.previewCanvas = document.createElement('canvas');

        this.origCtx = this.origCanvas.getContext('2d');
        this.avgCtx = this.avgCanvas.getContext('2d');
        this.previewCtx = this.previewCanvas.getContext('2d');

        this.settings = new EditorImageTranslatorSettings();

        this.listenTo(this.settings, "change", this.mapcodeResize);
        this.listenTo(this.settings, "change:scaleWidth", this.recalcPreview);
        this.findOptions = {
            binary: true,
            invert: false,
            colors: ["X", "1"]
        };

        this.helper = 0;
        this.initColorMode(this.map, new MapRenderPalette());
    },

    convertRgbToXyz: function(rgb) {
        //http://www.easyrgb.com/index.php?X=MATH&H=02#text2
        var var_R = ( rgb[0] / 255 );        //R from 0 to 255
        var var_G = ( rgb[1] / 255 );        //G from 0 to 255
        var var_B = ( rgb[2] / 255 );        //B from 0 to 255

        if (var_R > 0.04045) {
            var_R = Math.pow((( var_R + 0.055 ) / 1.055), 2.4);
        }
        else {
            var_R = var_R / 12.92;
        }

        if (var_G > 0.04045) {
            var_G = Math.pow(( ( var_G + 0.055 ) / 1.055 ), 2.4);
        } else {
            var_G = var_G / 12.92;
        }

        if (var_B > 0.04045) {
            var_B = Math.pow(( ( var_B + 0.055 ) / 1.055 ), 2.4);
        } else {
            var_B = var_B / 12.92;
        }

        var_R = var_R * 100;
        var_G = var_G * 100;
        var_B = var_B * 100;

        //Observer. = 2°, Illuminant = D65
        var X = var_R * 0.4124 + var_G * 0.3576 + var_B * 0.1805
        var Y = var_R * 0.2126 + var_G * 0.7152 + var_B * 0.0722
        var Z = var_R * 0.0193 + var_G * 0.1192 + var_B * 0.9505


        return [X, Y, Z];
    },

    convertXyzToCIELAB: function(xyz) {

        var X = xyz[0];
        var Y = xyz[1];
        var Z = xyz[2];
        //Observer= 2°, Illuminant= D65
        var ref_X = 95.047;
        var ref_Y = 100.000;
        var ref_Z = 108.883;

        var var_X = X / ref_X;          //ref_X =  95.047   Observer= 2°, Illuminant= D65
        var var_Y = Y / ref_Y;          //ref_Y = 100.000
        var var_Z = Z / ref_Z;          //ref_Z = 108.883

        if (var_X > 0.008856) {
            var_X = Math.pow(var_X, ( 1 / 3 ));
        } else {
            var_X = ( 7.787 * var_X ) + ( 16 / 116 );
        }

        if (var_Y > 0.008856) {
            var_Y = Math.pow(var_Y, ( 1 / 3 ));
        } else {
            var_Y = ( 7.787 * var_Y ) + ( 16 / 116 );
        }

        if (var_Z > 0.008856) {
            var_Z = Math.pow(var_Z, ( 1 / 3 ));
        } else {
            var_Z = ( 7.787 * var_Z ) + ( 16 / 116 );
        }

        var CIE_L = ( 116 * var_Y ) - 16;
        var CIE_a = 500 * ( var_X - var_Y );
        var CIE_b = 200 * ( var_Y - var_Z );
        return [CIE_L, CIE_a, CIE_b];
    },

    recalcPreview: function() {
        var scale = this.settings.get("scaleWidth");
        var w = this.origCanvas.width;
        var h = this.origCanvas.height;
        var tr = this.settings.get("targetRows");
        var tc = this.settings.get("targetCols");
        this.avgCanvas.width = tc;
        this.avgCanvas.height = tr;
        var me = this;
        var avgimgdata = [];
        var x = 0;
        var y = 0;
        for (var col = 0; col < tc; col++) {
            for (var row = 0; row < tr; row++) {
                var imgdata = me.origCtx.getImageData(x, y, scale, scale);
                //console.log(imgdata.data, x, y, scale);
                var pixelRgba = me.averageRgba(imgdata.data);
                avgimgdata.push(pixelRgba[0]);
                avgimgdata.push(pixelRgba[1]);
                avgimgdata.push(pixelRgba[2]);
                avgimgdata.push(255);
                x++;
            }
            x = 0;
            y++;
        }
        var pid = new Uint8ClampedArray(avgimgdata);
        console.log(pid)
        var imgdata = this.avgCtx.createImageData(tc, tr);
        console.log("Jetzt setz ich");
        imgdata.data.set(pid);
        console.log(imgdata);
        this.avgCtx.putImageData(imgdata, 0, 0);
    },

    getFieldForRgbaArray: function(rgba, colormode) {
        if (!colormode) {
            var avg = (rgba[0] + rgba[1] + rgba[2]) / 3;
            var idx = (!this.findOptions.invert ^ !(avg <= 127)) << 0;  //true =1, false =0
            field = this.findOptions.colors[idx];
            return field;
        }

        //full color mode
        var minDiff = Infinity;
        var field = ".";

        var fieldHSL = this.rgb2hsl(rgba);
        for (var f in this.hsls) {
            var diff = 0;
            var hsl = this.hsls[f];
            //console.log("Diff", hsl, fieldHSL);

            diff += Math.pow(hsl[0] - fieldHSL[0], 2);
            diff += Math.pow(hsl[1] - fieldHSL[1], 2);
            diff += Math.pow(hsl[2] - fieldHSL[2], 2);

            if (diff < minDiff) {
                minDiff = diff;
                field = f;
            }
        }

        return field;

    },

    processField: function(row, col, tr, tc, x, y, w, h, scW, scH, withTimeout) {
        //console.log("Processing", row, col, x, y, w, h, scW, scH);
        //console.log("processing ",x,"/",w,"and",y,"/",h);
        var me = this;
        var imgdata = me.origCtx.getImageData(x, y, scW, scH);

        var pixelRgba = me.averageRgba(imgdata.data);
        var field = me.getFieldForRgbaArray(pixelRgba, !this.findOptions.binary);
        me.map.setFieldAtRowCol(row, col, field);

        if (!withTimeout) return false;

        //So we need to call the process for the next field ourselves...

        //next column
        x += scW;
        col += 1;
        if (col >= tc) {
            //col 0, but next row
            x = 0;
            col = 0;
            y += scH;
            row++;
        }

        if (row >= tr) {
            //console.log("DONE");
            this.editorsettings.set("undo", true);
            return true;
        }

        window.setTimeout(function() {
            me.processField(row, col, tr, tc, x, y, w, h, scW, scH, true);
        }, 0);
    },

    timecheck: function() {
        var start0 = new Date().getTime();
        var scW = this.settings.get("scaleWidth");
        var scH = this.settings.get("scaleHeight");

        this.processField(0, 0, 1, 1, 0, 0, scW, scH, scW, scH, false);
        var end0 = new Date().getTime();
        var t = Math.round(end0 - start0);
        //console.log(t);
        return t;
    },

    initColorMode: function(map, palette) {
        this.hsls = {};
        for (var f in map.FIELDS) {
            var mainRGB = palette.get(f).split(",").map(function(e) {
                return parseInt(e);
            });
            var hsl = this.rgb2hsl(mainRGB);
            this.hsls[f] = hsl;
        }
        return true;
    },

    run: function() {
        this.editorsettings.set("undo", false);
        this.helper = 0;
        this.mapcodeResize();
        var mapcode = "";
        var field = "";
        var scW = this.settings.get("scaleWidth");
        var scH = this.settings.get("scaleHeight");
        var w = this.origCanvas.width;
        var h = this.origCanvas.height;
        var t = this.settings.get("fieldtime");
        if (t == 0) {
            t = 20;
        }

        var tr = this.settings.get("targetRows");
        var tc = this.settings.get("targetCols");
        this.avgCanvas.width = tc;
        this.avgCanvas.height = tr;
        var me = this;
        var avgimgdata = [];
        var x = 0;
        var y = 0;
        for (var col = 0; col < tc; col++) {
            for (var row = 0; row < tr; row++) {
                var imgdata = me.avgCtx.getImageData(x, y, 1, 1);
                console.log(imgdata.data);
                var pixelRgba = imgdata.data;
                var field = me.getFieldForRgbaArray(pixelRgba, true);
                console.log(pixelRgba, field);
                me.map.setFieldAtRowCol(row, col, field);
                x++;
            }
            x = 0;
            y++;
        }
    },

    mapcodeResize: function() {
        //console.log("Resize map to", this.settings.get("targetCols"), this.settings.get("targetRows"));
        var undo = this.editorsettings.get("undo");
        this.editorsettings.set("undo", false);
        var row = new Array(this.settings.get("targetCols") + 1).join(".");
        var rows = [];
        for (var i = 0, l = this.settings.get("targetRows"); i < l; i++) {
            rows.push(row);
        }
        this.map.setMapcode(rows.join('\n'));
        this.editorsettings.set("undo", undo);
    },

    getSourceInfo: function() {
        return {
            width: this.origImage.width,
            height: this.origImage.height
        };
    },

    loadImage: function(img) {
        var w = img.width;
        var h = img.height;
        //console.log("Loaded img", w, h);

        //adjust internal canvas
        this.origCanvas.width = w;
        this.origCanvas.height = h;
        this.origCtx.drawImage(img, 0, 0);
        //console.log(this.canvas);
        //console.log(this.ctx);
        //console.log("Set new wh", w, h);
        this.settings.set({
            sourceWidth: w,
            sourceHeight: h
        });
        //console.log("Set new wh done");
        //console.log("Loaded, set active true");
        this.settings.set("active", true);
        //console.log("Active is true");
        this.editorsettings.set("undo", false);
        this.settings.set("fieldtime", this.timecheck());
        this.editorsettings.set("undo", true);
    },

    getImageData: function() {
        //console.log("get data of ctx", this.canvas.width, this.canvas.height);
        var tr = this.settings.get("targetRows");
        var tc = this.settings.get("targetCols");
        var pid = this.avgCtx.getImageData(0, 0, tc, tr);
        console.log("Ich gebe raus", pid);
        return pid;
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

            me.origCanvas.width = w;
            me.origCanvas.height = h;
            me.origCtx.drawImage(me.image, 0, 0);
            callback();
        };
        this.image.src = url;
    },

    averageRgba: function(imageData) {
        if (imageData.length % 4 != 0) {
            console.error("Imagedata has a length of", imageData.length);
            return false;
        }

        var sum0 = 0;
        var sum1 = 0;
        var sum2 = 0;
        for (var p = 0, l = imageData.length; p < l; p += 4) {
            sum0 += imageData[p];
            sum1 += imageData[p + 1];
            sum2 += imageData[p + 2];
        }
        var pixels = l / 4;
        avg = [sum0 / pixels, sum1 / pixels, sum2 / pixels, 255];
        //console.log(avg);
        return avg;
    },

    rgb2hsl: function(rgb) {

        return this.convertXyzToCIELAB(this.convertRgbToXyz(rgb));


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
    }
});
