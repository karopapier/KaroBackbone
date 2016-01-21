var Position = require('../src/model/Position');
var Vector = require('../src/model/Vector')
exports.Positiontests = function (test) {
    var v
        ,p
        ,pos1
        ,pos2
        ,vec
        ,target
        ,actual
        ;

    test.expect(4);

    //getVectorTo
    pos1 = new Position(3, 3);
    pos2 = new Position(2, 2);
    vec = pos1.getVectorTo(pos2);
    target = new Vector(-1, -1);
    test.equal(vec.toString(), target.toString(), 'getVectorTo returns correct vector');

    pos1 = new Position(2, 1);
    pos2 = new Position(2, 7);
    vec = pos1.getVectorTo(pos2);
    target = new Vector(0, 6);
    test.equal(vec.toString(), target.toString(), 'getVectorTo returns correct vector');

    //getPassedPositionsTo
    pos1 = new Position(2, 1);
    pos2 = new Position(2, 4);
    positions = pos1.getPassedPositionsTo(pos2);
    //need to use for loop to maintain order
    actual =[];
    for (p in positions) {
        actual.push(p);
    }
    target = [
        '[2|1]',
        '[2|2]',
        '[2|3]',
        '[2|4]'];
    test.deepEqual(actual, target, 'getPassedPositionsTo calculates correct positions in order');

    //getPassedPositionsTo
    pos1 = new Position(7, 8);
    pos2 = new Position(1, 1);
    positions = pos1.getPassedPositionsTo(pos2);
    actual =[];
    for (p in positions) {
        actual.push(p);
    }
    target = [
        '[7|8]',
        '[7|7]',
        '[6|7]',
        '[6|6]',
        '[5|6]',
        '[5|5]',
        '[4|5]',
        '[4|4]',
        '[3|4]',
        '[3|3]',
        '[2|3]',
        '[2|2]',
        '[1|2]',
        '[1|1]'
    ];
    test.deepEqual(actual, target, 'getPassedPositionsTo calculates correct positions in order');
    test.done();
};
