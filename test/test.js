var tests = [
    //"example",
    "MotionTest",
    "MapTest",
    "GameTest",
    "KRACHZTest",
];

//tests = ["OnlyOneTest"];

for (var i = 0; i<tests.length;i++) {
    var testName = tests[i];
    exports[testName] = require('./'+testName);
}