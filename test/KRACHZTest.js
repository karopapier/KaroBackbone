var Motion = require('../src/model/Motion');
var Map = require('../src/model/map/Map');
var KRACHZ = require('../src/model/KRACHZ');
exports.willCrash = function(test) {
    test.expect(8);
    //willCrash
    var mo = new Motion();
    var map = new Map();
    map.setMapcode("XXXXXXX\nXOOOOOX\nXXXXXXX");

    var k = new KRACHZ({
        map: map
    });

    mo.setXY1toXY2(1, 1, 2, 1);
    test.equal(k.willCrash(mo, 1), false, mo.toString() + " will not crash in 1");
    test.equal(k.willCrash(mo, 3), false, mo.toString() + " will not crash in 3");

    mo.setXY1toXY2(1, 1, 3, 1);
    test.equal(k.willCrash(mo, 1), false, mo.toString() + " will not crash in 1");
    test.equal(k.willCrash(mo, 3), false, mo.toString() + " will not crash in 3");

    mo.setXY1toXY2(1, 1, 4, 1);
    test.equal(k.willCrash(mo, 1), false, mo.toString() + " will not crash in 1");
    test.equal(k.willCrash(mo, 3), true, mo.toString() + " will crash in 3");

    mo.setXY1toXY2(1, 1, 6, 1);
    test.equal(k.willCrash(mo, 1), true, mo.toString() + " will crash in 1");
    test.equal(k.willCrash(mo, 2), true, mo.toString() + " will crash in 2");
    test.done();
};

exports.cornerCourse = function(test) {
    test.expect(4);
    var map = new Map();
    map.setMapcode("XXXXXXXX\nXOOOOOOO\nXXOOXXXX\nXXXOOXXX\nXXXXOOXX\nXXXXXOOX\nXXXXXXOO");

    var k = new KRACHZ({
        map: map
    });

    var mo;
    mo = new Motion();
    mo.setXY1toXY2(4, 1, 3, 1);
    test.equal(k.willCrash(mo, 5), false, mo.toString() + " will not crash in 5");

    mo = new Motion();
    mo.setXY1toXY2(4, 1, 3, 2);
    test.equal(k.willCrash(mo, 5), false, mo.toString() + " will not crash in 5");

    mo = new Motion();
    mo.setXY1toXY2(4, 1, 2, 1);
    test.equal(k.willCrash(mo, 5), true, mo.toString() + " will crash in 5");

    mo = new Motion();
    mo.setXY1toXY2(4, 1, 2, 2);
    test.equal(k.willCrash(mo, 5), true, mo.toString() + " will crash in 5");


    test.done();

};