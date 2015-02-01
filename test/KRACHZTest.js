module("KRACHZ");
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
    equal(k.willCrash(mo, 3), false, mo.toString() + " will not crash in 3");

    mo.setXY1toXY2(1, 1, 3, 1);
    equal(k.willCrash(mo, 1), false, mo.toString() + " will not crash in 1");
    equal(k.willCrash(mo, 3), false, mo.toString() + " will not crash in 3");

    mo.setXY1toXY2(1, 1, 4, 1);
    equal(k.willCrash(mo, 1), false, mo.toString() + " will not crash in 1");
    equal(k.willCrash(mo, 3), true, mo.toString() + " will crash in 3");

    mo.setXY1toXY2(1, 1, 6, 1);
    equal(k.willCrash(mo, 1), true, mo.toString() + " will crash in 1");
    equal(k.willCrash(mo, 2), true, mo.toString() + " will crash in 2");

});
