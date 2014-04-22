var PathCollection = function () {
    this.add = function () {
    };
}
test("MapPathFinder functions outlines", function () {
    expect(2);
    var map = new Map();
    map.set("mapcode", "____\n_OO_\n____");
    var mapPathFinder = new MapPathFinder({map: map});
    mapPathFinder.getAllOutlines();

    var outlines;
    outlines = {
        "O": {
            "1|1": [
                {x1: 1,
                    y1: 1,
                    x2: 2,
                    y2: 1}
            ],
            "1|2": [
                {
                    "x1": 2,
                    "x2": 3,
                    "y1": 1,
                    "y2": 1
                }
            ],
            "1|3": [
                {
                    "x1": 3,
                    "x2": 3,
                    "y1": 1,
                    "y2": 2
                }
            ],
            "2|1": [
                {
                    "x1": 1,
                    "x2": 1,
                    "y1": 2,
                    "y2": 1
                }
            ],
            "2|2": [
                {
                    "x1": 2,
                    "x2": 1,
                    "y1": 2,
                    "y2": 2
                }
            ],
            "2|3": [
                {
                    "x1": 3,
                    "x2": 2,
                    "y1": 2,
                    "y2": 2
                }
            ]
        }
    }

    deepEqual(mapPathFinder.outlines, outlines, "outlines of OO are OK");


    map.set("mapcode", "_O__\n__O_");
    var mapPathFinder = new MapPathFinder({map: map});
    mapPathFinder.getAllOutlines();
    var outlines_1_2 = [
        {x1: 2,
            y1: 1,
            x2: 1,
            y2: 1
        },
        {x1: 2,
            y1: 1,
            x2: 3,
            y2: 1}
    ];
    deepEqual(mapPathFinder.outlines["O"]["1|2"], outlines_1_2, "two outlines begin at 1|2");
});

test("Outlinedirection", function() {
    expect(2);

    var map = new Map();
    map.set("mapcode", "____\n_OO_\n____");
    var mapPathFinder = new MapPathFinder({map: map});
    equal(mapPathFinder.getOutlineDirection({x1:4,y1:4,x2:3,y2:4}),"left");
    equal(mapPathFinder.getOutlineDirection({x1:4,y1:4,x2:5,y2:4}),"right");

})

