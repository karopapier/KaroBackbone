var Conway = Backbone.Model.extend({
    initialize: function (options) {
        options = options || {};
        if (!options.map) {
            console.error("No map for Conway");
            return false;
        }
        this.map = options.map;
        this.changed = {};
        this.livingNeighbours={};
        this.currentMap = new Map();
        this.currentNeighbours={};
        _.bindAll(this, "step", "die", "rise", "adjustNeighbours", "countLivingNeighbours", "isAlive", "isDead", "setAllChanged", "calcField");
    },
    isAlive: function (f) {
        return (f === this.livingField());
    },
    isDead: function (f) {
        return (f === this.deadField());
    },
    deadField: function () {
        return "X";
    },
    livingField: function () {
        return "O";
    },
    countLivingNeighbours: function() {
        var cols = this.map.get("cols");
        var rows = this.map.get("rows");
        for (var r = 0, maxR = rows; r < maxR; r++) {
            for (var c = 0, maxC = cols; c < maxC; c++) {
                var livingNeighbours = 0;
                for (var x = -1; x <= 1; x++) {
                    for (var y = -1; y <= 1; y++) {
                        if ((x !== 0) || (y !== 0)) {
                            if (this.map.withinBounds({row: r + y, col: c + x})) {
                                if (this.isAlive(this.map.getFieldAtRowCol(r + y, c + x))) {
                                    livingNeighbours++;
                                }
                            }
                        }
                    }
                }
                this.livingNeighbours[r + "|" + c]=livingNeighbours;
            }
        }
    },
    die: function(r,c) {
        //console.log("Die",r,c);
        this.map.setFieldAtRowCol(r,c,this.deadField());
        this.adjustNeighbours(r,c,-1);
    },
    rise: function(r,c) {
        //console.log("Rise",r,c);
        this.map.setFieldAtRowCol(r,c,this.livingField());
        this.adjustNeighbours(r,c,1);
    },
    adjustNeighbours: function(r,c,i) {
        for (var x = -1; x <= 1; x++) {
            for (var y = -1; y <= 1; y++) {
                var ry = r +y;
                var cx = c +x;
                var k = ry +  "|" +cx;
                if (this.map.withinBounds({row: ry, col: cx})) {
                    if ((x !== 0) || (y !== 0)) {
                        this.livingNeighbours[k]+=i;
                    }
                    this.changed[k]={ r: ry, c:cx };
                }
            }
        }
    },
    setAllChanged: function() {
        var cols = this.map.get("cols");
        var rows = this.map.get("rows");

        for (var r = 0, maxR = rows; r < maxR; r++) {
            for (var c = 0, maxC = cols; c < maxC; c++) {
                this.changed[r + "|" + c]={ r: r, c:c };
            }
        }
    },
    calcField: function(r,c) {
        var field = this.currentMap.getFieldAtRowCol(r, c);
        //console.log("is field", field);
        if ((field === "X") || (field === "O") || (field==="Y") || (field==="Z")) {
            livingNeighbours = this.currentNeighbours[r + "|" + c];
            //console.log("has living nb", livingNeighbours);

            if (this.isDead(field)) {
                if (livingNeighbours == 3) {
                    this.rise(r,c);
                }
            } else {
                if (livingNeighbours < 2) {
                    this.die(r,c);
                }
                if (livingNeighbours > 3) {
                    this.die(r,c);
                }
            }
        }
    },
    step: function () {
        var cols = this.map.get("cols");
        var rows = this.map.get("rows");

        this.currentMap.setMapcode(this.map.get("mapcode"));
        this.currentNeighbours = JSON.parse( JSON.stringify( this.livingNeighbours));

        var currentChanged = this.changed;
        this.changed ={};

        for (var k in currentChanged) {
            var coords = currentChanged[k];
            r = coords.r;
            c=coords.c;
            //console.log("Calculate", r, c);

            this.calcField(r,c);
        }

        return true;
    }
});
