module("Map");
test("Map pos calculations", function () {
    expect(3);
    var map = new Map();
    map.set("rows", 5);
    map.set("cols", 6);
    equal(map.getPosFromRowCol(0, 2), 2, "getPosFromRowCol works correctly");
    equal(map.getPosFromRowCol(1, 2), 9, "getPosFromRowCol works correctly");
    equal(map.getPosFromRowCol(2, 4), 18, "getPosFromRowCol works correctly");

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

