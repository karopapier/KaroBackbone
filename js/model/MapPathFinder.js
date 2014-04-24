var MapPathFinder = Backbone.Model.extend({
        initialize: function (options) {
            _.bindAll(this, "getMainField", "getAllOutlines", "getFieldOutlines", "getOutlineDirection");
            //console.log(options);
            this.map = options.map;
            this.mainField = '';
            this.paths = new PathCollection();
            this.done = false;
            this.lastStartRow = 0;
            this.lastStartCol = 0;
            this.outlines = {};
            this.size = 13;
            this.depthSecurityBreak = 5000;
            this.WILDCARD_FIELDS = ["F", "S", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
            this.stack = 0;
            this.modifiers = {
                top: { r: -1, c: 0 },
                right: { r: 0, c: +1 },
                bottom: { r: +1, c: 0 },
                left: { r: 0, c: -1 }
            };
            this.directions = {
                "-1|0": "up",
                "0|1": "right",
                "1|0": "down",
                "0|-1": "left"
            };
            this.outlineModifiers = {
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
            };
        },
        getMainField: function () {
            var mc = this.map.get("mapcode");
            var mostChar = "";
            var charCount = 0;
            for (var char in MAP_FIELDS) {
                var nb = mc.match(new RegExp(char, "g"))
                if (nb) {
                    if (nb.length > charCount) {
                        mostChar = char;
                        charCount = nb.length;
                    }
                }
            }

            this.mainField = mostChar;
            return mostChar;
        },
        getAllOutlines: function () {
            var char;
            var mapcode = this.map.get("mapcode");
            var cols = this.map.get("cols");
            var rows = this.map.get("rows");

            var currentChar = "";
            var r = 0;
            var c = 0;
            while (r < rows) {
                c = 0;
                while (c < cols) {
                    char = this.map.getFieldAtRowCol(r, c);
                    //if (char == "O") {
                    if (char in MAP_FIELDS) {
                        this.getFieldOutlines(r, c);
                    }
                    c++;
                }
                r++;
            }
            return true;
        },
        getSvgPathFromOutlines: function (outlines, size) {
            var s = size || 13;
            var path = "";
            var emergencyBreak = 1000;
            var lastR = -1;
            var lastC = -1;
            var lastDirection = "";

            console.info(outlines);

            //get first
            //console.log(outlines);
            var firstOutline = _.first(_.values(outlines));

            console.debug(firstOutline);

            //set initial "last position" to start of first outline
            lastR = firstOutline[0].y1;
            lastC = firstOutline[0].x1;
            lastDirection = this.getOutlineDirection(firstOutline);
            path = "M" + lastC * s + "," + lastR * s;

            console.log(lastR, lastC);

            while ((!(_.isEmpty(outlines))) && (emergencyBreak > 0)) {
                var searchKey = this.getKeyForRowCol(lastR, lastC);
                console.log("Looking for key", searchKey);
                console.log(path);

                if (searchKey in outlines) {
                    var a = outlines[searchKey];
                    var o = a.shift();
                    var thisDirection = this.getOutlineDirection(o);

                    if (thisDirection != lastDirection) {
                        path += "L" + (o.x1 * s) + "," + (o.y1 * s);
                    }

                    lastDirection = thisDirection;

                    lastC = o.x2;
                    lastR = o.y2;

                    if (a.length === 0) {
                        console.log("del ", searchKey);
                        delete outlines[searchKey];
                    } else {
                        console.info(o.length);
                    }
                } else {
                    console.info("No connection for ", searchKey);
                    console.log("Close");
                    path += "L" + (lastC * s) + "," + (lastR * s);
                    console.info("Start NEW");
                    var firstOutline = _.first(_.values(outlines));
                    lastR = firstOutline[0].y1;
                    lastC = firstOutline[0].x1;
                    lastDirection = this.getOutlineDirection(firstOutline);
                    path += "M" + lastC * s + "," + lastR * s;
                }

                console.log(outlines);

                emergencyBreak--;
            }

            console.log("Break", emergencyBreak);
            path += "Z";
            return path;
        },
        cleanOutlines: function () {
            for (var char in this.outlines) {
                var pathKeys = this.outlines[char];
                for (var code in pathKeys) {
                    var coords = code.split("|");
                    var r1 = coords[0];
                    var c1 = coords[1];
                    var r2 = coords[2];
                    var c2 = coords[3];

                    this.paths.add({
                        path: "M" + c1 * 13 + "" + r1 * 13 + "L" + c2 * 13 + " " + r2 * 13 + " Z",
                        class: "road"
                    });

                }
            }
            return true;
        },

        getOutlineDirection: function (outline) {
            var x = outline.x2 - outline.x1;
            var y = outline.y2 - outline.y1;
            return this.directions[y + "|" + x];
        },

        getKeyForRowCol: function (r, c) {
            return (r + "|" + c);
        },
        getRowColFromKey: function (k) {
            var s = k.split("|");
            return { r: parseInt(s[0]), c: parseInt(s[1])};
        },
        getFieldOutlines: function (r, c) {

            var currentField = this.map.getFieldAtRowCol(r, c);

            //for all 4 directions
            // get the char and if it is different, add outline

            var testField;

            for (var direction in this.modifiers) {
                //console.log("Now doing directions: ",direction,"from ", r,c)
                //console.log("Remembering i am coming from ", from);
                var mod = this.modifiers[direction];
                var testR = r + mod.r;
                var testC = c + mod.c;

                testField = this.map.getFieldAtRowCol(testR, testC)
                //if (this.WILDCARD_FIELDS.indexOf(testField) >= 0) {
                ////no need to draw the outline here
                //return true;
                //}

                if (testField != currentField) {
                    //add outlines
                    var fromMod = this.outlineModifiers[direction].from;
                    var toMod = this.outlineModifiers[direction].to;
                    if (!(currentField in this.outlines)) {
                        //init outline per char
                        this.outlines[currentField] = {};
                    }

                    //use start as key and add array of outlines, as several outlines can start at one point

                    var x1 = c + fromMod.c;
                    var y1 = r + fromMod.r;
                    var x2 = c + toMod.c;
                    var y2 = r + toMod.r;
                    var k = this.getKeyForRowCol(y1, x1);

                    if (!(k in this.outlines[currentField])) {
                        this.outlines[currentField][k] = [];
                    }
                    this.outlines[currentField][k].push({x1: x1, y1: y1, x2: x2, y2: y2});
                }
            }

            //top this.outlines[this.getKeyForRowCol(r, c)] = {r: r, c: c + 1};
            //right this.outlines[this.getKeyForRowCol(r, c + 1)] = {r: r + 1, c: c + 1};
            //bottom this.outlines[this.getKeyForRowCol(r + 1, c + 1)] = {r: r + 1, c: c};
            //left this.outlines[this.getKeyForRowCol(r + 1, c)] = {r: r, c: c};
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

    })
    ;
