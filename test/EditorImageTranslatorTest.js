module("EditorImageTranslator");

test("rgb to hsl", function() {
    var trans = new EditorImageTranslator();

    //values from https://en.wikipedia.org/wiki/HSL_and_HSV#Saturation, slightly adjusted due to rounding
    var rgbs = [
        [255, 255, 255],
        [128, 128, 128],
        [0, 0, 0],
        [255, 0, 0],
        [191, 191, 0],
        [0, 128, 0],
        [128, 255, 255],
        [128, 128, 255],
        [191, 64, 191],
        [160, 164, 36],
        [65, 27, 234],
        [30, 172, 65],
        [240, 200, 14],
        [180, 48, 229],
        [237, 118, 81],
        [254, 248, 136],
        [25, 203, 151],
        [54, 38, 152],
        [126, 126, 184]
    ];

    var hsls = [
        [0, 0, 100],
        [0, 0, 50],
        [0, 0, 0],
        [0, 100, 50],
        [60, 100, 37],
        [120, 100, 25],
        [180, 100, 75],
        [240, 100, 75],
        [300, 50, 50],
        [62, 64, 39],
        [251, 83, 51],
        [135, 70, 40],
        [49, 89, 50],
        [284, 78, 54],
        [14, 81, 62],
        [57, 98, 76],
        [162, 78, 45],
        [248, 60, 37],
        [240, 29, 61]
    ];

    expect(rgbs.length);
    for (var i = 0; i < rgbs.length; i++) {
        deepEqual(trans.rgb2hsl(rgbs[i]), hsls[i], "Works for " + rgbs[i].join(","));
    }
});

test("imagedata", function(assert) {
    expect(1);
    var done = assert.async();

    var eit = new EditorImageTranslator();
    var url = "/test/assets/pics/bw4x4.gif";
    eit.loadUrl(url, function() {
        var w = eit.image.width;
        var h = eit.image.height;
        var imgdata = eit.ctx.getImageData(0, 0, w, h);
        var rgba = imgdata.data;

        assert.equal(w, 4, "Width ist 4");

        var mapcode = "";
        for (var row = 0; row < h; row++) {
            for (var col = 0; col < w; col++) {
                imgdata = eit.ctx.getImageData(col, row, 1, 1);
                var pixelRgba = imgdata.data;
                console.log(pixelRgba);
                if (pixelRgba[0] == 255) {
                    mapcode += "O";
                } else {
                    mapcode += "X";
                }
            }
            mapcode += "\n";
        }
        console.log(mapcode);
        done();
    });
    console.log("Direkt");
});
