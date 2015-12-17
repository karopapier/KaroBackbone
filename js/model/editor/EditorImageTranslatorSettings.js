var EditorImageTranslatorSettings = Backbone.Model.extend({
    defaults: {
        binaryMode: true, //X or O
        inverted: false,
        scaleWidth: 10,
        scaleHeight: 10,
        targetRows: 20,
        targetCols: 30,
        sourceWidth: 300,
        sourceHeight: 200
    },
    initialize: function() {
        //_.bindAll(this, "recalcFromTarget", "recalcFromScale");
        //bindings
        this.listenTo(this, "change:sourceWidth change:sourceHeight", this.recalcFromSource);
    },

    setScale: function(sc) {
        if (sc == 0) return false;
        if (sc < 1) return false;
        var tc = Math.floor(this.get("sourceWidth") / sc);
        var tr = Math.floor(this.get("sourceHeight") / sc);
        this.set({
            scaleWidth: sc,
            scaleHeight: sc,
            targetRows: tr,
            targetCols: tc
        })
    },

    setTargetRowCol: function(r, c) {
        var scw = this.get("sourceWidth") / c;
        var sch = Math.floor(this.get("sourceHeight") / r);
        this.set({
            scaleWidth: scw,
            scaleHeight: sch,
            targetRows: r,
            targetCols: c
        })
    },

    recalcFromSource: function() {
        // assume default target cols of 60
        //calc scale to match that
        var TARGETCOLS = 60;

        var srcW = this.get("sourceWidth");
        var srcH = this.get("sourceHeight");
        var sc = 10;
        if ((srcW < 60) || (srcH < 40)) {
            sc = 1;
        } else {
            sc = Math.floor(this.get("sourceWidth") / 60);
        }

        this.set({
            scaleWidth: sc,
            scaleHeight: sc,
            targetCols: Math.floor(srcW / sc),
            targetRows: Math.floor(srcH / sc)
        })
    }
});