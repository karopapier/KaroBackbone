var EditorImageTranslatorSettings = Backbone.Model.extend({
    defaults: {
        binaryMode: true, //X or O
        inverted: false,
        scale: 10,
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

    recalcFromTarget: function() {

    },

    recalcFromScale: function() {

    }
});