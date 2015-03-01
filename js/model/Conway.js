var Conway = Backbone.Model.extend({
    initialize: function (options) {
        options = options || {};
        if (!options.map) {
            console.error("No map for Conway");
            return false;
        }
        this.map = options.map;
        _.bindAll(this, "step")
    },
    isAlive: function (f) {
        return (f === this.livingField())
    },
    isDead: function (f) {
        return (f === this.deadField())
    },
    deadField: function () {
        return "X"
    },
    livingField: function () {
        return "O"
    },
    step: function () {
        var cols = this.map.get("cols");
        var rows = this.map.get("rows");

        var nextMap = new Map();
        nextMap.setMapcode(this.map.get("mapcode"));

        for (var r = 0, maxR = rows; r < maxR; r++) {
            for (var c = 0, maxC = cols; c < maxC; c++) {
                var field = this.map.getFieldAtRowCol(r, c);
                if ((field === "X") || (field === "O") || (field==="Y") || (field==="Z")) {
                    var livingNeighbours = 0;
                    for (var x = -1; x <= 1; x++) {
                        for (var y = -1; y <= 1; y++) {
                            if ((x !== 0) || (y !== 0)) {
                                if (this.map.withinBounds({row: r + y, col: c + x})) {
                                    if (this.isAlive(this.map.getFieldAtRowCol(r + y, c + x))) {
                                        livingNeighbours++
                                    }
                                }
                            }
                        }
                    }

                    if (this.isDead(field)) {
                        if (livingNeighbours == 3) {
                            field = this.livingField();
                        } else {
                            field = this.deadField();
                        }
                    } else {
                        if (livingNeighbours < 2) {
                            //stirbt
                            //field = field;
                            field = this.deadField();
                        }
                        if (livingNeighbours > 3) {
                            field = this.deadField();
                        }
                    }
                }
                nextMap.setFieldAtRowCol(r, c, field);
            }
        }

        var newMapcode = nextMap.get("mapcode");
        var oldMapcode = this.map.get("mapcode");
        this.map.setMapcode(nextMap.get("mapcode"));
        mrv.render();
        return (newMapcode !== oldMapcode);
    }
})