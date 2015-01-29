module("Position");
test("Position tests", function () {
    var v;
    expect(4);

    //getVectorTo
    var pos1 = new Position(3, 3);
    var pos2 = new Position(2, 2);
    var vec = pos1.getVectorTo(pos2);
    var target = new Vector(-1, -1);
    equal(vec.toString(), target.toString(), 'getVectorTo returns correct vector');

    var pos1 = new Position(2, 1);
    var pos2 = new Position(2, 7);
    var vec = pos1.getVectorTo(pos2);
    var target = new Vector(0, 6);
    equal(vec.toString(), target.toString(), 'getVectorTo returns correct vector');

    //getPassedPositionsTo
    var pos1 = new Position(2, 1);
    var pos2 = new Position(2, 4);
    var positions = pos1.getPassedPositionsTo(pos2);
    var target = Array('[2|1]', '[2|2]', '[2|3]', '[2|4]');
    deepEqual(Object.getOwnPropertyNames(positions), target, 'getPassedPositionsTo calculates correct positions in order');

    //getPassedPositionsTo
    var pos1 = new Position(7, 8);
    var pos2 = new Position(1, 1);
    var positions = pos1.getPassedPositionsTo(pos2);
    var target = Array('[7|8]', '[7|7]', '[6|7]', '[6|6]', '[5|6]', '[5|5]', '[4|5]', '[4|4]', '[3|4]', '[3|3]', '[2|3]', '[2|2]', '[1|2]', '[1|1]');
    deepEqual(Object.getOwnPropertyNames(positions), target, 'getPassedPositionsTo calculates correct positions in order');
});
