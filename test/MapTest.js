var Map = require('../src/model/map/Map');
var Position = require('../src/model/Position');
var Motion = require('../src/model/Motion');
exports.MapPosCalculations = function(assert) {
    assert.expect(9);
    var map = new Map();
    map.set("rows", 5);
    map.set("cols", 6);
    assert.equal(map.getPosFromRowCol(0, 2), 2, "getPosFromRowCol works correctly");
    assert.equal(map.getPosFromRowCol(1, 2), 9, "getPosFromRowCol works correctly");
    assert.equal(map.getPosFromRowCol(2, 4), 18, "getPosFromRowCol works correctly");

    assert.equal(map.getRowColFromPos(2).col, 2, "getRowColFromPos works correctly");
    assert.equal(map.getRowColFromPos(2).row, 0, "getRowColFromPos works correctly");
    assert.equal(map.getRowColFromPos(9).col, 2, "getRowColFromPos works correctly");
    assert.equal(map.getRowColFromPos(9).row, 1, "getRowColFromPos works correctly");
    assert.equal(map.getRowColFromPos(18).row, 2, "getRowColFromPos works correctly");
    assert.equal(map.getRowColFromPos(18).col, 4, "getRowColFromPos works correctly");
    assert.done();
};

exports.Mapsetupfunctions = function(assert) {
    assert.expect(4);
    var map = new Map();
    map.set("mapcode", "XOSOFOX");
    assert.equal(map.get("rows"), 1, "correct number of rows");
    assert.equal(map.get("cols"), 7, "correct number of cols");

    map.set("mapcode", "XOSOFOX\nXOSOFOX\nXOSOFOX");
    assert.equal(map.get("rows"), 3, "correct number of rows");
    assert.equal(map.get("cols"), 7, "correct number of cols");
    assert.done();
};

exports.Mapdatagetterfunctions = function(assert) {
    assert.expect(7);
    var map = new Map();
    map.set("mapcode", "XOSOFOX");

    assert.equal(map.getFieldAtRowCol(0, 2), "S", "getFieldAtRowCol returns correct field of row 0");

    map.set("mapcode", "XXOFFFSS123456789VWXYZ\nPPPPPPPPFFFFFFFFOOOOOO\n123456789WWWXXXYYYOOOO")

    assert.equal(map.getFieldAtRowCol(0, 0), "X", "getFieldAtRowCol returns correct field of row 0");
    assert.equal(map.getFieldAtRowCol(0, 2), "O", "getFieldAtRowCol returns correct field of row 0");
    assert.equal(map.getFieldAtRowCol(1, 7), "P", "getFieldAtRowCol returns correct field of row 1");
    assert.equal(map.getFieldAtRowCol(1, 8), "F", "getFieldAtRowCol returns correct field of row 1");
    assert.equal(map.getFieldAtRowCol(2, 0), "1", "getFieldAtRowCol returns correct field of row 2");
    assert.equal(map.getFieldAtRowCol(2, 5), "6", "getFieldAtRowCol returns correct field of row 2");
    assert.done();
};

exports.Mapdatasetterfunctions = function(assert) {
    assert.expect(1);
    var map = new Map();

    map.set("mapcode", "XXXX\nXXXX\nXXXX");
    map.setFieldAtRowCol(1, 2, "O");
    assert.equal(map.get("mapcode"), "XXXX\nXXOX\nXXXX", "mapcode was correctly modified");
    assert.done();
};

exports.Mapmatrixhelpers = function(assert) {

    assert.expect(1);
    var map = new Map();
    map.set("mapcode", "XOSOFOX\n7654321\nVOLVOSF");
    assert.deepEqual(map.getMapcodeAsArray(), ["XOSOFOX", "7654321", "VOLVOSF"], "returns code as array");
    assert.done();
};

exports.MapgetStartPositions  =  function(assert) {
    assert.expect(1);

    var map = new Map();
    map.setMapcode("XXXXXXX\nXOSOFOX\nXOFOSOX\nXXXXSXS");

    var expected = ["[2|1]", "[4|2]", "[4|3]", "[6|3]"];
    assert.deepEqual(map.getStartPositions().map(function(p) {
        return p.toString()
    }), expected, "returns correct Start Positions");
    assert.done();
};

exports.isPossible = function(assert) {
    assert.expect(3);
    //isPossible
    var map = new Map();
    map.setMapcode("XXXXXXX\nXOSOFX1\nXXXXXXX");
    var mo = new Motion();
    mo.setXY1toXY2(1, 1, 6, 1);

    assert.equal(map.isPossible(mo), false, "motion not possible");

    var mo = new Motion();
    mo.setXY1toXY2(1, 1, 4, 2);
    var map = new Map();
    map.setMapcode("XXXXXX\nXOOXXX\nXXXOOO\nXXXXXX");

    assert.equal(map.isPossible(mo), true, "move through dot is possible");

    mo.setXY1toXY2(1, 1, 5, 2);
    assert.equal(map.isPossible(mo), false, "not possible");
    assert.done();
}

exports.getPassedFields =  function(assert) {
    assert.expect(1);

    //getPassedFields
    var pos = new Position({x: 6, y: 1});
    var vec = new Vector({x: 5, y: 0});
    var mo = new Motion({position: pos, vector: vec});
    var map = new Map();
    map.setMapcode("XXXXXXX\nXOSOFX1\nXXXXXXX");

    var expected = ["O", "S", "O", "F", "X", "1"];
    assert.deepEqual(map.getPassedFields(mo), expected, "getPassedFields");
    assert.done();
};

exports.sanitizecode = function(assert) {
    assert.expect(6);

    var map = new Map();
    map.set("mapcode", 'XOXX\nXOXXXXX\nVWXYZVX\nXSXXXXX\nXSX\nXOX\nXOXTTT\nXOX\nXOX\nXOX\nXOX\nXOX\nXOX\nXOXSF\nXOX\nXOX\n12345678\n');
    var sanitized = 'POXXXXXX\nPOXXXXXX\nPWXYZVXX\nXSXXXXXX\nXSXXXXXX\nXOXXXXXX\nXOXTTTXX\nXOXXXXXX\nXOXXXXXX\nXOXXXXXX\nXOXXXXXX\nXOXXXXXX\nXOXXXXXX\nXOXSFXXX\nXOXXXXXX\nXOXXXXXX\n12345678';
    map.sanitize();
    assert.equal(map.get("cols"), 8, "Cols correct");
    assert.equal(map.get("rows"), 17, "Rows correct");
    assert.equal(map.get("mapcode"), sanitized, "Complex code sanitized");
    assert.equal(map.getFieldAtRowCol(16, 4), "5", "Get correct field");
    assert.equal(map.getFieldAtRowCol(2, 0), "P", "3 parc fermée added");
    assert.notEqual(map.getFieldAtRowCol(3, 0), "P", "Only 3 parc fermée added");
    assert.done();
};

exports.MapgetCpPositions = function(assert) {
    var map = new Map();
    map.set("mapcode", "XOXX\nO112\n34XO\n7777");
    var positions = map.getCpPositions();
    expected = ["[1|1]", "[2|1]", "[3|1]", "[0|2]", "[1|2]", "[0|3]", "[1|3]", "[2|3]", "[3|3]"];
    assert.deepEqual(map.getCpPositions().map(function(p) {
        return p.toString()
    }), expected, "returns correct CP Positions");
    assert.done();
};

exports.RowColoperations = function(assert) {
    //ADD ROWS
    assert.expect(13);
    var map = new Map();
    map.set("mapcode", "XOXX");
    map.addRow(2);
    assert.equal(map.get("mapcode"), "XOXX\nXOXX\nXOXX", "addRow(2) adds two similar rows at end");

    map.set("mapcode", "XOXX\n1234");
    map.addRow(3);
    assert.equal(map.get("mapcode"), "XOXX\n1234\n1234\n1234\n1234", "addRow(2) adds three similar rows at end");

    map.set("mapcode", "SFSF\nXOXX\n1234");
    map.addRow(2, 0);
    assert.equal(map.get("mapcode"), "SFSF\nSFSF\nSFSF\nXOXX\n1234", "addRow(2,0) adds two similar rows at beginning");

    //ADD COLS
    map.set("mapcode", "SFSF\nXOXX\n1234");
    map.addCol(4);
    assert.equal(map.get("mapcode"), "SFSFFFFF\nXOXXXXXX\n12344444", "addCol(4,0) adds four similar cols at end");

    map.set("mapcode", "SFSF\nXOXX\n1234");
    map.addCol(4, 0);
    assert.equal(map.get("mapcode"), "SSSSSFSF\nXXXXXOXX\n11111234", "addCol(4,0) adds four similar cols at beginning");

    //DEL ROW
    map.set("mapcode", "SSSSSFSF\nXXXXXOXX\n11111234\nVOLVOXXX");
    map.delRow(2);
    assert.equal(map.get("mapcode"), "SSSSSFSF\nXXXXXOXX", "delRow(2) removes two rows at end");

    map.set("mapcode", "SSSSSFSF\nXXXXXOXX\n11111234\nVOLVOXXX");
    map.delRow(2, 0);
    assert.equal(map.get("mapcode"), "11111234\nVOLVOXXX", "delRow(2,0) removes first two rows");

    map.set("mapcode", "XOSOFOX");
    map.delRow(2);
    assert.equal(map.get("mapcode"), "XOSOFOX", "delRow(2,0) does nothing if only one is left");

    map.set("mapcode", "XOSOFOX");
    map.delRow(1);
    assert.equal(map.get("mapcode"), "", "delRow(1,0) deletes last row");

    //del COL
    map.set("mapcode", "SSSSSFSF\nXXXXXOXX\n11111234\nVOLVOXXX");
    map.delCol(2);
    assert.equal(map.get("mapcode"), "SSSSSF\nXXXXXO\n111112\nVOLVOX", "delRow(2) removes two cols at end");

    map.set("mapcode", "SSSSSFSF\nXXXXXOXX\n11111234\nVOLVOXXX");
    map.delCol(2, 0);
    assert.equal(map.get("mapcode"), "SSSFSF\nXXXOXX\n111234\nLVOXXX", "delCol(2,0) removes first two cols");

    map.set("mapcode", "X\nX\nX");
    map.delCol(2);
    assert.equal(map.get("mapcode"), "X\nX\nX", "delCol(2,0) does nothing if only one is left");

    map.set("mapcode", "X\nX\nX\nX");
    map.delCol(1);
    assert.equal(map.get("mapcode"), "\n\n\n", "delCol(1,0) deletes last col");
    assert.done();
};

exports.Floodfill =  function(assert) {

    assert.expect(2);
    var map = new Map();
    map.setMapcode('OOOOOOOOO\nOXXXOXXXO\nOXXXOXXXO\nOXXOXXXXO\nOOOXXXOOO\nOXXXXOXXO\nOXXXOXXXO\nOXXXOXXXO\nOOOOOOOOO');
    map.floodfill(5, 2, "1");
    expect = 'OOOOOOOOO\nOXXXO111O\nOXXXO111O\nOXXO1111O\nOOO111OOO\nO1111OXXO\nO111OXXXO\nO111OXXXO\nOOOOOOOOO';
    assert.equal(map.get("mapcode"), expect, "Flood filled central ara");

    map.setMapcode('OOOOOOOOO\nOXXXOXXXO\nOXXXOXXXO\nOXXOXXXXO\nOOOXXXOOO\nOXXXXOXXO\nOXXXOXXXO\nOXXXOXXXO\nOOOOOOOOO');
    map.floodfill(2, 4, "X");
    expect = 'XXXXXXXXX\nXXXXXXXXX\nXXXXXXXXX\nXXXOXXXXX\nXXXXXXXXX\nXXXXXOXXX\nXXXXXXXXX\nXXXXXXXXX\nXXXXXXXXX';
    assert.equal(map.get("mapcode"), expect, "Flood filled border");
    assert.done();
};
