module("Map");
test("Map pos calculations", function () {
    expect(9);
    var map = new Map();
    map.set("rows", 5);
    map.set("cols", 6);
    equal(map.getPosFromRowCol(0, 2), 2, "getPosFromRowCol works correctly");
    equal(map.getPosFromRowCol(1, 2), 9, "getPosFromRowCol works correctly");
    equal(map.getPosFromRowCol(2, 4), 18, "getPosFromRowCol works correctly");

    equal(map.getRowColFromPos(2).col, 2, "getRowColFromPos works correctly")
    equal(map.getRowColFromPos(2).row, 0, "getRowColFromPos works correctly")
    equal(map.getRowColFromPos(9).col, 2, "getRowColFromPos works correctly")
    equal(map.getRowColFromPos(9).row, 1, "getRowColFromPos works correctly")
    equal(map.getRowColFromPos(18).row, 2, "getRowColFromPos works correctly")
    equal(map.getRowColFromPos(18).col, 4, "getRowColFromPos works correctly")
});
test("Map setup functions", function () {
    expect(4);
    var map = new Map();
    map.set("mapcode", "XOSOFOX");
    equal(map.get("rows"), 1, "correct number of rows");
    equal(map.get("cols"), 7, "correct number of cols");

    map.set("mapcode", "XOSOFOX\nXOSOFOX\nXOSOFOX");
    equal(map.get("rows"), 3, "correct number of rows");
    equal(map.get("cols"), 7, "correct number of cols");
});

test("Map data getter functions", function () {
    expect(7);
    var map = new Map();
    map.set("mapcode", "XOSOFOX");

    equal(map.getFieldAtRowCol(0, 2), "S", "getFieldAtRowCol returns correct field of row 0");

    map.set("mapcode", "XXOFFFSS123456789VWXYZ\nPPPPPPPPFFFFFFFFOOOOOO\n123456789WWWXXXYYYOOOO")

    equal(map.getFieldAtRowCol(0, 0), "X", "getFieldAtRowCol returns correct field of row 0");
    equal(map.getFieldAtRowCol(0, 2), "O", "getFieldAtRowCol returns correct field of row 0");
    equal(map.getFieldAtRowCol(1, 7), "P", "getFieldAtRowCol returns correct field of row 1");
    equal(map.getFieldAtRowCol(1, 8), "F", "getFieldAtRowCol returns correct field of row 1");
    equal(map.getFieldAtRowCol(2, 0), "1", "getFieldAtRowCol returns correct field of row 2");
    equal(map.getFieldAtRowCol(2, 5), "6", "getFieldAtRowCol returns correct field of row 2");

});

test("Map data setter functions", function () {
    expect(1);
    var map = new Map();

    map.set("mapcode", "XXXX\nXXXX\nXXXX");
    map.setFieldAtRowCol(1, 2, "O");
    equal(map.get("mapcode"), "XXXX\nXXOX\nXXXX", "mapcode was correctly modified");
});

test("Map getStartPositions", function () {
    expect(1);

    var map = new Map();
    map.setMapcode("XXXXXXX\nXOSOFOX\nXOFOSOX\nXXXXSXS");

    var expected = ["[2|1]", "[4|2]", "[4|3]", "[6|3]"];
    deepEqual(map.getStartPositions().map(function (p) {
        return p.toString()
    }), expected, "returns correct Start Positions");

});

test("isPossible", function () {
    expect(3);
    //isPossible
    var map = new Map();
    map.setMapcode("XXXXXXX\nXOSOFX1\nXXXXXXX");
    var mo = new Motion();
    mo.setXY1toXY2(1, 1, 6, 1);

    equal(map.isPossible(mo), false, "motion not possible");

    var mo = new Motion();
    mo.setXY1toXY2(1, 1, 4, 2);
    var map = new Map();
    map.setMapcode("XXXXXX\nXOOXXX\nXXXOOO\nXXXXXX");

    equal(map.isPossible(mo), true, "move through dot is possible");

    mo.setXY1toXY2(1, 1, 5, 2);
    equal(map.isPossible(mo), false, "not possible");

})

test("getPassedFields", function () {
    expect(1);

    //getPassedFields
    var pos = new Position({x: 6, y: 1});
    var vec = new Vector({x: 5, y: 0});
    var mo = new Motion({position: pos, vector: vec});
    var map = new Map();
    map.setMapcode("XXXXXXX\nXOSOFX1\nXXXXXXX");

    var expected = ["O", "S", "O", "F", "X", "1"];
    deepEqual(map.getPassedFields(mo), expected, "getPassedFields");
});

test("sanitize code", function () {
    expect(6);

    var map = new Map();
    map.set("mapcode", 'XOXX\nXOXXXXX\nVWXYZVX\nXSXXXXX\nXSX\nXOX\nXOXTTT\nXOX\nXOX\nXOX\nXOX\nXOX\nXOX\nXOXSF\nXOX\nXOX\n12345678\n');
    var sanitized = 'POXXXXXX\nPOXXXXXX\nPWXYZVXX\nXSXXXXXX\nXSXXXXXX\nXOXXXXXX\nXOXXXXXX\nXOXXXXXX\nXOXXXXXX\nXOXXXXXX\nXOXXXXXX\nXOXXXXXX\nXOXXXXXX\nXOXSFXXX\nXOXXXXXX\nXOXXXXXX\n12345678';
    map.sanitize();
    equal(map.get("cols"), 8, "Cols correct");
    equal(map.get("rows"), 17, "Rows correct");
    equal(map.get("mapcode"), sanitized, "Complex code sanitized");
    equal(map.getFieldAtRowCol(16, 4), "5", "Get correct field");
    equal(map.getFieldAtRowCol(2, 0), "P", "3 parc fermée added");
    notEqual(map.getFieldAtRowCol(3, 0), "P", "Only 3 parc fermée added");
});
