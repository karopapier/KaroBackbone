/*
 var crazyHelperFunction = function (mo, depth) {
 var pos1 = mo.getSourcePosition();
 var pos2 = mo.get("position");
 var x1 = parseInt(pos1.get("x") * 12 + 6)
 var x2 = parseInt(pos2.get("x") * 12 + 6)
 var y1 = parseInt(pos1.get("y") * 12 + 6)
 var y2 = parseInt(pos2.get("y") * 12 + 6)
 var f = depth * 16 - 1;

 var l = Karopapier.Util.createSvg("line", {
 x1: x1,
 x2: x2,
 y1: y1,
 y2: y2,
 stroke: "rgb(" + f + ",0,0)" //+f+","+f+")"
 })
 document.getElementById("mapPlayerMoves").appendChild(l);
 };
 var TAKES = 0;
 */
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
        this.cache = {};
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
            if (map.withinBounds({x: x, y: y})) {
                fields.push(map.getFieldAtRowCol(y, x));
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
    verifiedPossibles: function (possibles) {
        var remaining = [];
        for (var p = 0; p < possibles.length; p++) {
            var possible = possibles[p];
            if (this.isPossible(possible)) {
                remaining.push(possible);
            }
        }
        return remaining;
    },
    willCrash: function (mo, depth) {
        //console.warn("starting", mo.toString(), depth);
        if (!depth) depth = 8;
        //crazyHelperFunction(mo, depth);
        //TAKES++;
        if (depth === 0) return false;
        if (depth === 1) {
            //console.warn("TIEF 1", mo);
            //crazyHelperFunction(mo, 0);
            return !this.isPossible(mo);
        }
        if (mo.get("vector").toString() == "(0|0)") {
            //console.log("NULLER");
            return false;
        }
        var possibles = mo.getPossibles();
        //console.log(possibles);
        possibles = this.verifiedPossibles(possibles);
        if (possibles.length == 0) {
            //console.warn("Nothin left");
            return true;
        }

        //I think I could turn around
        if ((mo.get("vector").getLength() == 1) && (possibles.length == 8)) return false;

        var crashes = 0;
        for (var p = 0; p < possibles.length; p++) {
            //console.info(possibles[p],"now")
            var possible = possibles[p];
            var moString = possible.toString();
            //console.log(moString, "Depth:", depth, p + "/" + crashes);
            if (depth >= 1) {
                if (moString in this.cache) {
                    //console.info("Cached",moString);
                    return this.cache[moString];
                }
                var wc = this.willCrash(possible, depth - 1);
                this.cache[moString] = wc;
                if (wc) {
                    crashes++;
                } else {
                    return false;
                }
            }
        }
        //console.info(crashes, possibles.length);
        return crashes == possibles.length;
    },
    /**
     *
     * @param mo Motion
     */
    isValid: function (mo) {
        var passed = mo.getPassedFields();
    }
});
