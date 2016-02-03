var tests = [
    //"example",
    "GameTest",
    "KRACHZTest",
    "MapTest",
    "MotionTest",
    "PositionTest",
    "VectorTest",
    //"UserFactoryTest",
];

//tests = ["VectorTest"];

for (var i = 0; i<tests.length;i++) {
    var testName = tests[i];
    console.log("Run",testName);
    exports[testName] = require('./'+testName);
}