module("KaroUtil");
test("linkify", function () {
    var inputs = [
        "Hol mir nen Bier, Botrix!",
        "Nen schöne Abend wünsch ich",
        "Guck mal bei GID=12345",
        'Da ist ein Spiel unter http://www.karopapier.de/showmap.php?GID=12345 bei dem ich nicht weiter komme',
        "Wo leitest du mich hin? http://2.karopapier.de/game.html?GID=85566 ",
        "Die Dänen lügen nicht"
    ]

    var expects = [
        "Hol mir einen Bier, Botrix!",
        "Einen schöne Abend wünsch ich",
        'Guck mal bei <a class="GidLink12345" href="http://www.karopapier.de/showmap.php?GID=12345" target="_blank">12345</a>',
        'Da ist ein Spiel unter <a class="GidLink12345" href="http://www.karopapier.de/showmap.php?GID=12345" target="_blank">12345</a> bei dem ich nicht weiter komme',
        "Wo leitest du mich hin? http://2.karopapier.de/game.html?GID=85566 ",
        "Die Dänen lügen nicht"
    ]

    expect(inputs.length);

    for (var i = 0; i < inputs.length; i++) {
        equal(KaroUtil.linkify(inputs[i]), expects[i], inputs[i]);
    }
});
