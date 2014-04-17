var MapPathFinder = Backbone.Model.extend({
    initialize: function (options) {
        _.bindAll(this, "getNextPath", "checkField", "oldthing");
        //console.log(options);
        this.map = options.map;
        this.paths = new PathCollection();
        this.done = false;
        this.lastStartRow = 0;
        this.lastStartCol = 0;
        this.outlines = {};
        this.size = 13;
        this.alreadyChecked = {};
        this.depthSecurityBreak = 5000;
        this.WILDCARD_FIELDS = ["F", "S", "1", "2", "3", "4", "5", "6", "7", "8", "9", 1, 2, 3, 4, 5, 6, 7, 8, 9];
        this.stack = 0;
    },
    getNextPath: function () {
        var mapcode = this.map.get("mapcode");
        var cols = this.map.get("cols");
        var rows = this.map.get("rows");
        var lines = mapcode.split("\n");

        /*
        for rows and cols (start -1|-1)
        check right and bottom for change of field, if yes add outline
         */

        var currentChar = "";
        var r = this.lastStartRow;
        var c = this.lastStartCol;
        while (r < rows) {
            c = 0;
            while (c < cols) {
                var line = lines[r].replace("\n", "");
                var char = line.charAt(c);
                if (char in MAP_FIELDS) {
                    var startRow = r;
                    var startCol = c;
                    r = 9999;
                    c = 9999;
                }
                c++;
            }
            r++;
        }

        //console.log("Look at ", startRow, startCol);

        this.outlines = {};
        //recursive check for all adjacent fields
        this.checkField(startRow, startCol, char, 0, {r: startRow, c: startCol});


        //set all checked to " "
        _.each(this.alreadyChecked, function (e, i) {
            rc = this.getRowColFromKey(i);
            if (this.WILDCARD_FIELDS.indexOf(this.map.getFieldAtRowCol(rc.r, rc.c)) < 0) {
                this.map.setFieldAtRowCol(rc.r, rc.c, "_");
            }
        }.bind(this))

        //now combine all outlines into a path and add them

        //this.paths.add({
        //path: "M" + left + " " + top + "L" + right + " " + top + " L " + right + " " + bottom + " L " + left + " " + bottom + " Z",
        //class: MAP_FIELDS[char]
        //});

        //temp Render all outlines
        _.each(this.outlines, function (e, i) {
            var start = this.getRowColFromKey(i);
            var end = e;
            //console.log(start, end);

            this.paths.add({
                path: "M" + start.c * 13 + " " + start.r * 13 + "L" + end.c * 13 + " " + end.r * 13 + " Z",
                class: "mud"
            });
        }.bind(this));


        this.lastStartRow = startRow;
        this.lastStartCol = startCol;
        return true;
    },
    getKeyForRowCol: function (r, c) {
        return (r + "|" + c);
    },
    getRowColFromKey: function (k) {
        var s = k.split("|");
        return { r: parseInt(s[0]), c: parseInt(s[1])};
    },
    checkField: function (r, c, char, depth, from) {
        this.stack++;
        $('#stack').text(this.stack);
        if (typeof depth === "undefined") {
            depth = 1;
        }
        console.log("Looking at ", r, c, " with depth ", depth, "this", this);

        if (depth > this.depthSecurityBreak) {
            console.log("Security Break at depth ", depth);
            this.stack--;
            return false;
        }

        if (this.alreadyChecked[r + "|" + c]) {
            //console.log("... but it is already checked");
            this.stack--;
            return true;
        }

        if (typeof from === "undefined") {
            from = {r: -1, c: -1};
        }

        //mark this one as checked
        this.alreadyChecked[r + "|" + c] = true;
        //console.log(this.alreadyChecked);


        //for all 4 directions
        // check if thats where we come from
        // else get the char and if it is equal or wildcard, check it
        // else note the outlines

        var modifiers = {
            top: { r: -1, c: 0 },
            right: { r: 0, c: +1 },
            bottom: { r: +1, c: 0 },
            left: { r: 0, c: -1 }
        }

        outlineModifiers = {
            top: {
                from: { r: 0, c: 0},
                to: { r: 0, c: +1}
            },
            right: {
                from: { r: 0, c: +1},
                to: {r: +1, c: +1}
            },
            bottom: {
                from: {r: +1, c: +1},
                to: {r: +1, c: 0}
            },
            left: {
                from: {r: +1, c: 0},
                to: {r: 0, c: 0}
            }
        }

        //top
        var testField;

        for (var direction in modifiers) {
            //console.log("Now doing directions: ",direction,"from ", r,c)
            //console.log("Remembering i am coming from ", from);
            var mod = modifiers[direction];
            var testR = r + mod.r;
            var testC = c + mod.c;

            if (!((testR === from.r) && (testC === from.c))) {
                testField = this.map.getFieldAtRowCol(testR, testC)
                console.log("Considering ", testField, testR, testC);
                if ((testField === char) || (this.WILDCARD_FIELDS.indexOf(testField) >= 0)) {
                    //console.log("Gonna check ",testR,testC);

                    var k = this.getKeyForRowCol(testR, testC);
                    if (!(k in this.alreadyChecked)) {
                        //this.checkField(testR, testC, char, depth + 1, {r: r, c: c});
                        var me = this;
                        setTimeout((function () {
                            console.log("Sending forth ", testR, testC, testField);
                            this.checkField(testR, testC, char, depth + 1, {r: r, c: c});
                        }).call(this), 1)
                    }
                } else {
                    var fromMod = outlineModifiers[direction].from;
                    var toMod = outlineModifiers[direction].to;
                    //console.log("Adding outline", direction, fromMod, toMod)
                    this.outlines[this.getKeyForRowCol(r + fromMod.r, c + fromMod.c)] = {r: r + toMod.r, c: c + toMod.c};
                }

            }
        }

        //top this.outlines[this.getKeyForRowCol(r, c)] = {r: r, c: c + 1};
        //right this.outlines[this.getKeyForRowCol(r, c + 1)] = {r: r + 1, c: c + 1};
        //bottom this.outlines[this.getKeyForRowCol(r + 1, c + 1)] = {r: r + 1, c: c};
        //left this.outlines[this.getKeyForRowCol(r + 1, c)] = {r: r, c: c};
        this.stack--;
        $('#stack').text(this.stack);
        return true;
    },
    oldthing: function () {
        var mapcode = this.map.get("mapcode");
        var cols = this.map.get("cols");
        var rows = this.map.get("rows");
        var lines = mapcode.split("\n");
        while (mapcode.match(/[V|W|X|Y|Z|O|P]/)) {
            //for (var i = 0; i < 1400; i++) {

            var r = 0;
            var c = 0;
            while (r < rows) {
                c = 0;
                while (c < cols) {
                    var line = lines[r].replace("\n", "");
                    var char = line.charAt(c);
                    if (char in MAP_FIELDS) {
                        var startRow = r;
                        var startCol = c;
                        r = 9999;
                        c = 9999;
                    }
                    c++;
                }
                r++;
            }

            line = lines[startRow]
            var num = 1;
            while (line.charAt(startCol + num) === char) {
                num++;
            }
            line = line.substr(0, startCol) + new Array(num + 1).join(' ') + line.substr(startCol + num);
            lines[startRow] = line;

            mapcode = lines.join("\n");
            map.set("mapcode", mapcode);
            var size = 13;
            var left = startCol * size;
            var top = startRow * size;
            var right = left + (size * num);
            var bottom = top + size;
            this.paths.add({
                path: "M" + left + " " + top + "L" + right + " " + top + " L " + right + " " + bottom + " L " + left + " " + bottom + " Z",
                class: MAP_FIELDS[char]
            });
            return true;
        }
    }

});
