var KRACHZ = Backbone.Model.extend(/** @lends KRACHZ.prototype*/{
    /**
     * @constructor KRACHZ
     * @class KRACHZ
     *
     * Kalkuliert
     * Regelkonform
     * Alle
     * Crash
     * Herbeiführenden
     * Züge
     *
     * aka "Crash Detection"
     * Considers map and checks motions vs mapcode
     */

    //map
    //motion
    //calc with depth
    initialize: function (options) {
        if (!options.hasOwnProperty("map")) {
            console.error("No map provided to KRACHZ");
            return false;
        }
        this.cache={};
    },
    getPassedFields: function (mo) {
        if (!mo) console.error("No motion given");
        var map = this.get("map");
        var positions = mo.getPassedPositions();
        //console.log(positions);
        var fields = [];
        for (var posKey in positions) {
            var pos = positions[posKey];
            var x = pos.get("x");
            var y = pos.get("y");
            if (map.withinBounds({x:x,y:y})) {
                fields.push(map.getFieldAtRowCol(y,x));
            } else {
                fields.push("_");
            }
        }
        return fields;
    },
    isPossible: function (mo) {
        var fields = this.getPassedFields(mo);
        //console.log(fields);
        if (fields.indexOf(undefined) >= 0) return false;
        if (fields.indexOf("X") >= 0) return false;
        if (fields.indexOf("Y") >= 0) return false;
        if (fields.indexOf("Z") >= 0) return false;
        if (fields.indexOf("V") >= 0) return false;
        if (fields.indexOf("W") >= 0) return false;
        if (fields.indexOf("_") >= 0) return false;
        //console.log(mo.toString(), "is possible");
        return true;
    },
    willCrash: function (mo, depth) {
        if (depth===0) return false;
        if (depth===1) return !this.isPossible(mo);
        if (mo.get("vector").toString() == "(0|0)") {
            return false;
        }
        console.warn("starting",mo.toString(), depth);
        if (!depth) depth = 8;
        var possibles = mo.getPossibles();
        //console.log(possibles);


        var crashes = 0;
        for (var p = 0; p < possibles.length; p++) {
            //console.info(possibles[p],"now")
            var possible = possibles[p];
            if (this.isPossible(possible)) {
                var moString = possible.toString();
                console.log(moString, "is possible, go deeper");
                if (depth>=1) {
                    if (moString in this.cache) {
                        console.info("Cached",moString);
                        return this.cache[moString];
                    }
                    var wc = this.willCrash(possible, depth - 1);
                    this.cache[moString]=wc;
                    if (wc) crashes++;
                }
            } else {
                crashes++;
                //console.warn ("is no possible", crashes);
            }
        }
        return crashes == 9;
    },
    /**
     *
     * @param mo Motion
     */
    isValid: function (mo) {
        var passed = mo.getPassedFields();
    }
});
