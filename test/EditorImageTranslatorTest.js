QUnit.module("EditorImageTranslator");

QUnit.test("rgb to hsl", function() {
    var trans = new EditorImageTranslator({
        map: new Map(),
        editorsettings: new EditorSettings()
    });

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

QUnit.test("imagedata", function(assert) {
    expect(6);
    var done = assert.async();

    var scaleWidth = 10;
    var scaleHeight = 10;

    var eit = new EditorImageTranslator({
        map: new Map(),
        editorsettings: new EditorSettings()
    });
    //var url = "/test/assets/pics/bw4x4.gif";
    var url = "/test/assets/pics/qr.png";

    var qrcode = "";
    qrcode += "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n";
    qrcode += "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n";
    qrcode += "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n";
    qrcode += "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n";
    qrcode += "XXXXOOOOOOOXOXXOOOOXXXOOOOOOOXXXX\n";
    qrcode += "XXXXOXXXXXOXXOOXXOOXXXOXXXXXOXXXX\n";
    qrcode += "XXXXOXOOOXOXXXOXOOOOOXOXOOOXOXXXX\n";
    qrcode += "XXXXOXOOOXOXXXXXOOXXXXOXOOOXOXXXX\n";
    qrcode += "XXXXOXOOOXOXXOXOXXXXOXOXOOOXOXXXX\n";
    qrcode += "XXXXOXXXXXOXXXOXOXXXXXOXXXXXOXXXX\n";
    qrcode += "XXXXOOOOOOOXOXOXOXOXOXOOOOOOOXXXX\n";
    qrcode += "XXXXXXXXXXXXOXOOXOOOOXXXXXXXXXXXX\n";
    qrcode += "XXXXOOXOOXOXXOOOXXOXOXOXXXXXOXXXX\n";
    qrcode += "XXXXXOXXXXXXXOXXOOOOXOXOOOOOXXXXX\n";
    qrcode += "XXXXOOXXOOOXXXOOXXOOXXOOXOXXOXXXX\n";
    qrcode += "XXXXXXXOXXXOXOOOOXOOOXXOXOOOOXXXX\n";
    qrcode += "XXXXOXOOOOOOXOXOOXXOXXOXXXXXOXXXX\n";
    qrcode += "XXXXOXOOOOXXOXXXXOOOOOXXOXXOXXXXX\n";
    qrcode += "XXXXOOOXOOOOXOXOOOOOXOOXOOOOOXXXX\n";
    qrcode += "XXXXOXXXOXXOXXOOXXXXOOXOXOOXOXXXX\n";
    qrcode += "XXXXOXXOXOOOOXOXOOXOOOOOOXOOXXXXX\n";
    qrcode += "XXXXXXXXXXXXOXXOOXOXOXXXOXOOXXXXX\n";
    qrcode += "XXXXOOOOOOOXXXOOXXOXOXOXOXXXOXXXX\n";
    qrcode += "XXXXOXXXXXOXXOXXXOOOOXXXOXXOOXXXX\n";
    qrcode += "XXXXOXOOOXOXOOXXOXXOOOOOOXXXXXXXX\n";
    qrcode += "XXXXOXOOOXOXOOXOXOOOXXOXXXXOOXXXX\n";
    qrcode += "XXXXOXOOOXOXXOOOOOXOOOXXOOOOOXXXX\n";
    qrcode += "XXXXOXXXXXOXOOXOXXXXXXXOOXOOOXXXX\n";
    qrcode += "XXXXOOOOOOOXOOXOOXXXOOXXXOXXOXXXX\n";
    qrcode += "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n";
    qrcode += "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n";
    qrcode += "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n";
    qrcode += "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

    eit.loadUrl(url, function() {
        assert.equal(eit.getSourceInfo().width, 330, "EIT returns correct source width");

        eit.settings.setTargetRowCol(66, 66);
        eit.settings.set("invert", true);

        assert.equal(eit.settings.get("scaleWidth"), 5, "EIT calculates scale factor of 5");

        eit.settings.setScale(10);


        assert.equal(eit.settings.get("scaleWidth"), 10, "EIT returns previously set scale factor of 10");
        assert.equal(eit.settings.get("targetCols"), 33, "EIT calculates target cols");
        assert.equal(eit.run(), true, "successful conversion returns true");
        assert.equal(eit.map.get("mapcode"), qrcode, "returns correct mapcode");

        done();
    });
});
