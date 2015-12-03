var MapRenderPalette = Backbone.Model.extend({
    defaults: {
        "road": "128,128,128",
        "roadspecle": "100,100,100",
        "grass": "0,200,0",
        "grassspecle": "0,180,0",
        "sand": "230,230,115",
        "sandspecle": "200,200,100",
        "mud": "100,70,0",
        "mudspecle": "90,60,0",
        "mountain": "100,100,100",
        "mountainspecle": "0,0,0",
        "lava": "255, 201, 14",
        "lavaspecle": "255, 255, 0",
        "water": "0,60,200",
        "waterspecle": "0,30,100",
        "snow": "255,255,255",
        "snowspecle": "120,120,120",
        "start1": "200,200,200",
        "start2": "100,100,100",
        "finish1": "255,255,255",
        "finish2": "0,0,0",
        "checkpoint1": "000,102,255", //Checkpoint 1
        "checkpoint2": "000,100,200", //Checkpoint 2
        "checkpoint3": "000,255,102", //Checkpoint 3
        "checkpoint4": "000,200,000", //Checkpoint 4
        "checkpoint5": "255,255,000", //Checkpoint 5
        "checkpoint6": "200,200,000", //Checkpoint 6
        "checkpoint7": "255,000,000", //Checkpoint 7
        "checkpoint8": "200,000,000", //Checkpoint 8
        "checkpoint9": "255,000,255", //Checkpoint 9
        "checkpointBgOdd": "0,0,0",
        "checkpointBgEven": "255,255,255",
        "fog": "0,0,0",
        "fogspecle": "0,0,0",
        "parc": "200,200,200"
    },
    initialize: function() {
        _.bindAll(this, "setAlias", "getRGB");
        this.setAlias();
        this.bind("change", this.setAlias);
    },
    setAlias: function() {
        var alias = {
            "L": "lava",
            "Lspecle": "lavaspecle",
            "O": "road",
            "Ospecle": "roadspecle",
            "N": "snow",
            "Nspecle": "snowspecle",
            "V": "mountain",
            "Vspecle": "mountainspecle",
            "W": "water",
            "Wspecle": "waterspecle",
            "X": "grass",
            "Xspecle": "grassspecle",
            "Y": "sand",
            "Yspecle": "sandspecle",
            "Z": "mud",
            "Zspecle": "mudspecle",
            ".": "fog",
            ".specle": "fogspecle",
        };

        for (a in alias) {
            origin = alias[a];
            this.set(a, this.get(origin));
        }
    },
    getRGB: function(field) {
        return "rgb(" + this.get(field) + ")";
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
