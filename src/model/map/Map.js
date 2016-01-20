var _ = require('underscore');
var Backbone = require('backbone');
var Position = require('../Position');
karofill = require('../../polyfills');
module.exports = Backbone.Model.extend(/** @lends Map.prototype*/{
    defaults: {
        id: 0,
        cps: [],
        rows: 0,
        cols: 0
    },
    /**
     * Represents the map and its code
     * @constructor Map
     * @class Map
     */
    initialize: function() {
        _.bindAll(this, "updateMapcode", "getCpList", "setFieldAtRowCol", "getFieldAtRowCol", "getPosFromRowCol", "isPossible", "floodfill", "floodFill4");
        this.validFields = Object.keys(this.FIELDS);
        this.offroadRegEx = new RegExp("(X|P|L|G|N|V|T|W|Y|Z|_)");

        //sanitization binding
        this.bind("change:mapcode", this.updateMapcode);
    },
    FIELDS: {
        "F": "finish",
        "O": "road",
        "P": "parc",
        "S": "start",
        "G": "gold",
        "L": "lava",
        "N": "snow",
        "T": "tar",
        "V": "mountain",
        "W": "water",
        "X": "grass",
        "Y": "sand",
        "Z": "mud",
        ".": "night",
        "1": "cp1",
        "2": "cp2",
        "3": "cp3",
        "4": "cp4",
        "5": "cp5",
        "6": "cp6",
        "7": "cp7",
        "8": "cp8",
        "9": "cp9"
    },
    isValidField: function(c) {
        return this.validFields.indexOf(c.toUpperCase()) >= 0;
    },
    setMapcode: function(mapcode) {
        //make sure we don't have CR in there and make it all UPPERCASE
        var trimcode = mapcode.toUpperCase();
        trimcode = trimcode.replace(/\r/g, "");

        //nb of start positions ("S")
        var starties = (trimcode.match(/S/g) || []).length;

        //calc rows and cols
        var lines = trimcode.split('\n');
        var rows = lines.length;
        var line = lines[0].trim();
        var cols = line.length;
        var cps = this.getCpList(trimcode);

        this.set({
            "mapcode": trimcode,
            "starties": starties,
            "rows": rows,
            "cols": cols,
            "cps": cps
        });
    },

    getMapcodeAsArray: function() {
        return this.get("mapcode").split('\n');
    },

    setMapcodeFromArray: function(a) {
        this.setMapcode(a.join('\n'));
    },

    floodfill: function(row, col, color) {
        var oldColor = this.getFieldAtRowCol(row, col);
        this.fillstack = [];
        //console.log("Start fill", row, col, color);
        if (oldColor === color) return false;
        this.floodFill4(row, col, oldColor, color);
    },

    floodFill4: function(row, col, oldColor, color) {
        this.fillstack.push({row: row, col: col});
        while (this.fillstack.length > 0) {
            var rc = this.fillstack.pop();
            var r = rc.row;
            var c = rc.col;
            if (this.withinBounds({row: r, col: c})) {
                var field = this.getFieldAtRowCol(r, c);
                if (field === oldColor) {
                    this.setFieldAtRowCol(r, c, color);

                    this.fillstack.push({row: r, col: c + 1});
                    this.fillstack.push({row: r, col: c - 1});
                    this.fillstack.push({row: r + 1, col: c});
                    this.fillstack.push({row: r - 1, col: c});
                }
            }
        }
    },

    addRow: function(count, index) {
        /**
         * @param counter number of rows to insert
         * @param index   "before where to add". 0 is at front; undefined or negative at end
         */

        var codeRows = this.getMapcodeAsArray();
        var l = codeRows.length;
        if (l == 0) return false;
        if (count == 0) return false;
        var src = "";

        //normalize undefined index to negative
        if (typeof index === "undefined") index = -1;

        //find row to add
        if (index === 0) {
            src = codeRows[0];
        } else {
            src = codeRows[l - 1];
        }

        //modifying operation
        var op = function() {
        };
        if (index === 0) {
            op = Array.prototype.unshift;
        } else {
            op = Array.prototype.push;
        }

        for (var i = 1; i <= count; i++) {
            op.call(codeRows, src);
        }

        this.setMapcodeFromArray(codeRows);
    },
    addCol: function(count, index) {
        /**
         * @param counter number of cols to insert
         * @param index   "before where to add". 0 is at front; undefined or negative at end
         */

        var codeRows = this.getMapcodeAsArray();
        var l = codeRows.length;
        if (l == 0) return false;
        if (count == 0) return false;
        var src = "";

        //normalize undefined index to negative
        if (typeof index === "undefined") index = -1;

        var f;
        if (index === 0) {
            f = function(row) {
                var first = row[0];
                var pad = first.repeat(count);
                return pad + row;
            }
        } else {
            f = function(row) {
                var last = row.slice(-1);
                var pad = last.repeat(count);
                return row + pad;
            }
        }

        var newCodeRows = codeRows.map(f, count);
        this.setMapcodeFromArray(newCodeRows);
    },

    delRow: function(count, index) {
        /**
         * @param counter number of cols to delete
         * @param index   "before where to delete". 0 is at front; undefined or negative at end
         */

        var codeRows = this.getMapcodeAsArray();
        var l = codeRows.length;
        if (l == 0) return false;
        if (count == 0) return false;
        if (count > l) return false;

        //calc slice params
        //they define "what remains"
        var sliceStart = 0;
        var sliceEnd = l;
        if (index == 0) {
            sliceStart = count;
            sliceEnd = l;
        } else {
            sliceStart = 0;
            sliceEnd = -count;
        }

        var newCodeRows = codeRows.slice(sliceStart, sliceEnd)
        this.setMapcodeFromArray(newCodeRows);
    },

    delCol: function(count, index) {
        /**
         * @param counter number of cols to delete
         * @param index   "before where to delete". 0 is at front; undefined or negative at end
         */

        var codeRows = this.getMapcodeAsArray();
        var l = codeRows.length;
        if (l < 1) return false;
        var cols = codeRows[0].length;
        if (cols == 0) return false;
        if (count == 0) return false;
        if (count > cols) return false;

        //calc slice params
        //they define "what remains"
        var sliceStart = 0;
        var sliceEnd = 0;
        if (index == 0) {
            sliceStart = count;
            sliceEnd = cols;
        } else {
            sliceStart = 0;
            sliceEnd = -count;
        }

        //define function that is apply to every row
        var f = function(row) {
            return row.slice(sliceStart, sliceEnd);
        };

        var newCodeRows = codeRows.map(f, count);
        this.setMapcodeFromArray(newCodeRows);
    },

    updateMapcode: function(e, mapcode) {
        this.setMapcode(mapcode);
    },
    sanitize: function() {
        //console.log("sanitize and set correct code");

        var dirtyCode = this.get("mapcode").toUpperCase().trim();
        var starties = (dirtyCode.match(/S/g) || []).length;

        //find longest line
        var rows = dirtyCode.split("\n");
        var rowlength = 0;
        rows.forEach(function(row) {
            if (row.length > rowlength) {
                rowlength = row.length;
            }
        });

        //pad lines to match longest and replace invalid Characters
        var cleanRows = [];
        var parcs = 0;
        var me = this;
        rows.forEach(function(row) {
            if (row.length < rowlength) {
                var padXXX = Array(rowlength - row.length + 1).join("X");
                row += padXXX;
            }

            var cleanRow = "";

            for (var i = 0; i < rowlength; i++) {
                var c = row[i];
                if (me.isValidField(c)) {
                    cleanRow += row[i];
                } else {
                    cleanRow += "X";
                }
            }

            //set as many parcs as we have starties
            if (parcs < starties) {
                cleanRow = "P" + cleanRow.substr(1);
                parcs++;
            }
            cleanRows.push(cleanRow);
        });

        cleanCode = cleanRows.join("\n");
        //console.info(cleanCode);
        this.set("mapcode", cleanCode);

        //Make sure to remove \n at last line
    },
    getStartPositions: function() {
        return this.getFieldPositions("S");
    },
    getCpPositions: function(mapcode) {
        return this.getFieldPositions('\\d', mapcode);
    },
    getFieldPositions: function(field, mapcode) {
        var positions = [];
        var re = new RegExp(field, "g");
        mapcode = mapcode || this.get("mapcode");
        var hit;
        while (hit = re.exec(mapcode)) {
            var pos = hit.index;
            positions.push(new Position(this.getRowColFromPos(pos)));
        }
        return positions;
    },
    getCpList: function(mapcode) {
        mapcode = mapcode || this.get("mapcode");
        return (mapcode.match(/\d/g) || []).sort().filter(function(el, i, a) {
            if (i == a.indexOf(el))return 1;
            return 0;
        });
    },
    withinBounds: function(opt) {
        var x;
        var y;
        if ((opt.hasOwnProperty("row")) && opt.hasOwnProperty("col")) {
            x = opt.col;
            y = opt.row;
        } else if ((opt.hasOwnProperty("x")) && (opt.hasOwnProperty("y"))) {
            x = opt.x;
            y = opt.y;
        } else {
            console.error(opt);
            throw "param for withinBounds unclear";
        }
        if (x < 0) return false;
        if (y < 0) return false;
        if (x > this.get("cols") - 1) return false;
        if (y > this.get("rows") - 1) return false;
        return true;
    },
    setFieldAtRowCol: function(r, c, field) {
        var pos = this.getPosFromRowCol(r, c);
        var oldcode = this.get("mapcode");
        //console.log("Mapcodecheck");
        //only if different
        var oldfield = oldcode[pos];
        if (oldfield !== field) {
            mapcode = oldcode.substr(0, pos) + field + oldcode.substr(pos + 1);
            this.set("mapcode", mapcode, {silent: true});
            //trigger field change instead
            this.trigger("change:field", {r: r, c: c, field: field, oldfield: oldfield, oldcode: oldcode});
            //console.log("Change triggered");
        }
    },
    /**
     *
     * @param r 0..rows-1
     * @param c 0..cols-1
     * @returns {String}
     */
    getFieldAtRowCol: function(r, c) {
        //console.log(r, c);
        if (!this.withinBounds({row: r, col: c})) {
            console.error(r, c);
            throw  "Row " + r + ", Col " + c + " not within bounds";
        }
        var pos = this.getPosFromRowCol(r, c);
        //console.log("Ich sag",pos);
        return this.get("mapcode").charAt(pos);
    },
    getPosFromRowCol: function(r, c) {
        var pos = ( r * (this.get("cols") + 1)) + c;
        return pos;
    },
    getRowColFromPos: function(pos) {
        var cols = this.get("cols") + 1;
        var c = pos % cols;
        var r = Math.floor(pos / cols);
        return {row: r, col: c, x: c, y: r};
    },
    getPassedFields: function(mo) {
        if (!mo) console.error("No motion given");
        var positions = mo.getPassedPositions();
        //console.log(positions);
        var fields = [];
        for (var posKey in positions) {
            var pos = positions[posKey];
            var x = pos.get("x");
            var y = pos.get("y");
            if (this.withinBounds({x: x, y: y})) {
                fields.push(this.getFieldAtRowCol(y, x));
            } else {
                fields.push("_");
            }
        }
        return fields;
    },
    isPossible: function(mo) {
        var fields = this.getPassedFields(mo);

        //if undefined in fields, not possible
        if (fields.indexOf(undefined) >= 0) return false;

        //concat fields and test against offroad regexp
        return (!fields.join("").match(this.offroadRegEx));
    },
    /**
     * @param motions
     * @returns {Array} Motions
     */
    verifiedMotions: function(motions) {
        var remaining = [];
        for (var p = 0; p < motions.length; p++) {
            var mo = motions[p];
            if (this.isPossible(mo)) {
                remaining.push(mo);
            }
        }
        return remaining;
    }
});
