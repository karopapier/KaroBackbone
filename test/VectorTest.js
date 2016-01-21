var Vector = require('../src/model/Vector');
exports.Vectortests = function (test) {
    var v;
    var actual;
    test.expect(10);
    v = new Vector({x: -5, y: 7});
    test.equal(v.toString(), '(-5|7)', '->toString returns (|)');

    v = new Vector(-5,7);
    test.equal(v.toString(), '(-5|7)', '->constructor works with 2 numeric params');

    v = new Vector({x:2, y:2});
    var order = ["(0|0)", "(1|1)", "(2|2)"];
    var vecs = v.getPassedVectors();
    actual = [];
    for (v in vecs) {
        actual.push(v);
    }
    test.deepEqual(actual, order, '->getPassedVectors returns correct passed vectors 1');

    v = new Vector({x:0, y:3});
    order = ["(0|0)", "(0|1)", "(0|2)", "(0|3)"];
    vecs = v.getPassedVectors();
    actual = [];
    for (v in vecs) {
        actual.push(v);
    }
    test.deepEqual(actual, order, '->getPassedVectors returns correct passed vectors 2');

    v = new Vector({x:-2, y:1});
    order = ["(0|0)", "(-1|0)", "(-1|1)", "(-2|1)"];
    vecs = v.getPassedVectors();
    actual = [];
    for (v in vecs) {
        actual.push(v);
    }
    test.deepEqual(actual, order, '->getPassedVectors returns correct passed vectors 3');

    v = new Vector(-3, -1);
    order = ["(0|0)", "(-1|0)", "(-2|-1)", "(-3|-1)"];
    vecs = v.getPassedVectors();
    actual = [];
    for (v in vecs) {
        actual.push(v);
    }
    test.deepEqual(actual, order, '->getPassedVectors returns correct passed vectors 4');

    v = new Vector(2,2);
    v.decelerate();
    test.equal(v.toString(), "(1|1)", "->decelerate without param decelerates both");

    v = new Vector(-2,-7);
    v.decelerate();
    test.equal(v.toString(), "(-1|-6)", "->decelerate without param decelerates both when negative");

    var v2 = v.clone();
    test.equal(v.toString(),v2.toString(),"clones have same values");
    test.notDeepEqual(v,v2,"clones should not be deep test.equal but have different ids");
    test.done();
};