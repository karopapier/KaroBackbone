test("Vector tests", function () {
    var v;
    expect(8);
    v = new Vector({x: -5, y: 7});
    equal(v.toString(), '(-5|7)', '->toString returns (|)');

    v = new Vector(-5,7);
    equal(v.toString(), '(-5|7)', '->constructor works with 2 numeric params');

    v = new Vector({x:2, y:2});
    var order = Array("(0|0)", "(1|1)", "(2|2)");
    var vecs = v.getPassedVectors();
    deepEqual(Object.getOwnPropertyNames(vecs), order, '->getPassedVectors returns correct passed vectors');

    v = new Vector({x:0, y:3});
    order = Array("(0|0)", "(0|1)", "(0|2)", "(0|3)");
    vecs = v.getPassedVectors();
    deepEqual(Object.getOwnPropertyNames(vecs), order, '->getPassedVectors returns correct passed vectors');

    v = new Vector({x:-2, y:1});
    order = Array("(0|0)", "(-1|0)", "(-1|1)", "(-2|1)");
    vecs = v.getPassedVectors();
    deepEqual(Object.getOwnPropertyNames(vecs), order, '->getPassedVectors returns correct passed vectors');

    v = new Vector(-3, -1);
    order = Array("(0|0)", "(-1|0)", "(-2|-1)", "(-3|-1)");
    vecs = Object.getOwnPropertyNames(v.getPassedVectors());
    deepEqual(vecs, order, '->getPassedVectors returns correct passed vectors');

    v = new Vector(2,2);
    v.decelerate();
    equal(v.toString(), "(1|1)", "->decelerate without param decelerates both");

    v = new Vector(-2,-7);
    v.decelerate();
    equal(v.toString(), "(-1|-6)", "->decelerate without param decelerates both when negative");
});