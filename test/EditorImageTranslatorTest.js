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

function averageRgba(imageData) {
    if (imageData.length % 4 != 0) {
        console.error("Imagedate has a length of", imageData.length);
        return false;
    }

    var sum = [0, 0, 0];
    for (var p = 0, l = imageData.length; p < l; p += 4) {
        sum[0] += imageData[p];
        sum[1] += imageData[p + 1];
        sum[2] += imageData[p + 2];
    }
    var pixels = l / 4;
    avg = [sum[0] / pixels, sum[1] / pixels, sum[2] / pixels, 255];
    //console.log(avg);
    return avg;
}

test("imagedata", function(assert) {
    expect(1);
    var done = assert.async();

    var scaleWidth = 10;
    var scaleHeight = 10;

    var eit = new EditorImageTranslator();
    //var url = "/test/assets/pics/bw4x4.gif";
    var url = "/test/assets/pics/qr.png";
    eit.loadUrl(url, function() {
        var w = eit.image.width;
        var h = eit.image.height;

        assert.equal(w, 4, "Width ist 4");

        var mapcode = "";
        for (var row = 0; row < h; row += scaleHeight) {
            for (var col = 0; col < w; col += scaleWidth) {
                var imgdata = eit.ctx.getImageData(col, row, scaleWidth, scaleHeight);
                var pixelRgba = averageRgba(imgdata.data);
                if (pixelRgba[0] <= 127) {
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
});
