module("KRACHZ");
test("KRACHZ tests", function () {
    expect(1);

    //getPassedFields
    var pos = new Position({x: 6, y: 1});
    var vec = new Vector({x: 5, y: 0});
    var mo = new Motion({position: pos, vector: vec});
    var map = new Map();
    map.setMapcode("XXXXXXX\nXOSOFX1\nXXXXXXX");

    var k = new KRACHZ({
        map: map
    });

    var expected = ["O", "S", "O", "F", "X", "1"];
    deepEqual(k.getPassedFields(mo), expected, "getPassedFields");
});

test("passed fields", function () {
    expect(3);
    //isPossible
    var map = new Map();
    map.setMapcode("XXXXXXX\nXOSOFX1\nXXXXXXX");
    var mo = new Motion();
    mo.setXY1toXY2(1, 1, 6, 1);

    var k = new KRACHZ({
        map: map
    });
    equal(k.isPossible(mo), false, "motion not possible");

    var mo = new Motion();
    mo.setXY1toXY2(1, 1, 4, 2);
    var map = new Map();
    map.setMapcode("XXXXXX\nXOOXXX\nXXXOOO\nXXXXXX");

    var k = new KRACHZ({
        map: map
    });

    equal(k.isPossible(mo), true, "move through dot is possible");

    mo.setXY1toXY2(1, 1, 5, 2);
    equal(k.isPossible(mo), false, "not possible");

})

test("willCrash", function () {
    expect(8);
    //willCrash
    var mo = new Motion();
    var map = new Map();
    map.setMapcode("XXXXXXX\nXOOOOOX\nXXXXXXX");

    var k = new KRACHZ({
        map: map
    });

    mo.setXY1toXY2(1, 1, 2, 1);
    equal(k.willCrash(mo, 1), false, mo.toString() + " will not crash in 1");
    equal(k.willCrash(mo, 7), false, mo.toString() + " will not crash in 7");

    mo.setXY1toXY2(1, 1, 3, 1);
    equal(k.willCrash(mo, 1), false, mo.toString() + " will not crash in 1");
    equal(k.willCrash(mo, 7), false, mo.toString() + " will not crash in 7");

    mo.setXY1toXY2(1, 1, 4, 1);
    equal(k.willCrash(mo, 1), false, mo.toString() + " will not crash in 1");
    equal(k.willCrash(mo, 7), true, mo.toString() + " will crash in 7");

    mo.setXY1toXY2(1, 1, 6, 1);
    equal(k.willCrash(mo, 1), true, mo.toString() + " will crash in 1");
    equal(k.willCrash(mo, 7), true, mo.toString() + " will crash in 7");

});
