module("KaroUtil");
QUnit.test("linkify", function (assert) {
    var inputs = [
        "-:K Du wurdest zurückgesetzt K:-",
        "i've been looking for -:FfreedomF:-",
        "Schön -:REDrotRED:-",
        "Huhu :wavey:",
        "Nix",
        "Hol mir nen Bier, Botrix!",
        "Nen schönen Abend wünsch ich",
        "Nennen Sie mir nen Namen, Nena",
        "Ich kenn nen",
        "Jetzt wird alles anders!",
        "Anders gehts nicht",
        "Die Dänen lügen nicht",
        "Guck mal bei GID=12345",
        'Da ist ein Spiel unter http://www.karopapier.de/showmap.php?GID=12345 bei dem ich nicht weiter komme',
        "Wo leitest du mich hin? http://2.karopapier.de/game.html?GID=85566 ",
        "Hier is was nettes zum angucken http://feelgrafix.com/data_images/out/12/861215-nice-wallpaper.jpg. Schön, gell?",
        "Walk off the earth rocks: https://www.youtube.com/watch?v=0RgIK36X3Tw",
        "Vielleicht könnte man sowas ja damit verhindern? https://www.youtube.com/watch?t=13&v=Jg_K5j7_Bao",
        '<img src="/images/smilies/wavey.gif" alt="wavey" title="wavey">',
        'Didi und Stickerle fahr ich jetzt in Grund und Boden! GID=87654 <a href="http://www.karopapier.de/showmap.php?GID=87654">Direktlink_1.0</a>',
        "das geht doch schoener: https://en.wikipedia.org/wiki/File:Admiral_Horatio_Nelson,_Nelson's_Column,_Trafalgar_Square,_London.JPG"
    ];

    var expects = [
        "<i> Du wurdest zurückgesetzt </i>",
        "i've been looking for <b>freedom</b>",
        'Schön <span style="color: red">rot</span>',
        'Huhu <span class="smiley wavey">:wavey:</span>',
        "Nix",
        "Hol mir einen Bier, Botrix!",
        "Einen schönen Abend wünsch ich",
        "Nennen Sie mir einen Namen, Nena",
        "Ich kenn einen",
        'Jetzt wird alles  <img style="opacity: .3" src="//www.karopapier.de/images/anders.jpg" alt="anders" title="anders" />!',
        ' <img style="opacity: .3" src="//www.karopapier.de/images/anders.jpg" alt="anders" title="anders" /> gehts nicht',
        "Die Dänen lügen nicht",
        'Guck mal bei <a class="GidLink12345" href="//2.karopapier.de/game.html?GID=12345" target="_blank">12345</a>',
        'Da ist ein Spiel unter <a class="GidLink12345" href="//2.karopapier.de/game.html?GID=12345" target="_blank">12345</a> bei dem ich nicht weiter komme',
        'Wo leitest du mich hin? <a class="GidLink85566" href="//2.karopapier.de/game.html?GID=85566" target="_blank">85566</a> ',
        'Hier is was nettes zum angucken <a class="" title="http://feelgrafix.com/data_images/out/12/861215-nice-wallpaper.jpg" target="_blank" rel="nofollow" href="http://feelgrafix.com/data_images/out/12/861215-nice-wallpaper.jpg"><img src="http://feelgrafix.com/data_images/out/12/861215-nice-wallpaper.jpg" height="20" /></a>. Schön, gell?',
        'Walk off the earth rocks: <a class=" yt_0RgIK36X3Tw" title="https://www.youtube.com/watch?v=0RgIK36X3Tw" target="_blank" rel="nofollow" href="https://www.youtube.com/watch?v=0RgIK36X3Tw">https://www.youtube.com/watch?v=0RgIK36X3Tw</a>',
        'Vielleicht könnte man sowas ja damit verhindern? <a class=\" yt_Jg_K5j7_Bao\" title=\"https://www.youtube.com/watch?t=13&v=Jg_K5j7_Bao\" target=\"_blank\" rel=\"nofollow\" href=\"https://www.youtube.com/watch?t=13&v=Jg_K5j7_Bao\">https://www.youtube.com/watch?t=13&v=Jg_K5j7_Bao</a>',
        '<img src="//www.karopapier.de/bilder/smilies/wavey.gif" alt="wavey" title="wavey">',
        'Didi und Stickerle fahr ich jetzt in Grund und Boden! <a class="GidLink87654" href="//2.karopapier.de/game.html?GID=87654" target="_blank">87654</a> <a href="http://www.karopapier.de/showmap.php?GID=87654">Direktlink_1.0</a>',
        'das geht doch schoener: <a class="" title="https://en.wikipedia.org/wiki/File:Admiral_Horatio_Nelson,_Nelson\'s_Column,_Trafalgar_Square,_London.JPG" target="_blank" rel="nofollow" href="https://en.wikipedia.org/wiki/File:Admiral_Horatio_Nelson,_Nelson\'s_Column,_Trafalgar_Square,_London.JPG"><img src="https://en.wikipedia.org/wiki/File:Admiral_Horatio_Nelson,_Nelson\'s_Column,_Trafalgar_Square,_London.JPG" height="20" /></a>'
    ];

    var expectsUnfunny = [
        "<i> Du wurdest zurückgesetzt </i>",
        "i've been looking for <b>freedom</b>",
        'Schön <span style="color: red">rot</span>',
        'Huhu <span class="smiley wavey">:wavey:</span>',
        "Nix",
        "Hol mir nen Bier, Botrix!",
        "Nen schönen Abend wünsch ich",
        "Nennen Sie mir nen Namen, Nena",
        "Ich kenn nen",
        'Jetzt wird alles anders!',
        'Anders gehts nicht',
        "Die Dänen lügen nicht",
        'Guck mal bei <a class="GidLink12345" href="//2.karopapier.de/game.html?GID=12345" target="_blank">12345</a>',
        'Da ist ein Spiel unter <a class="GidLink12345" href="//2.karopapier.de/game.html?GID=12345" target="_blank">12345</a> bei dem ich nicht weiter komme',
        'Wo leitest du mich hin? <a class="GidLink85566" href="//2.karopapier.de/game.html?GID=85566" target="_blank">85566</a> ',
        'Hier is was nettes zum angucken <a class="" title="http://feelgrafix.com/data_images/out/12/861215-nice-wallpaper.jpg" target="_blank" rel="nofollow" href="http://feelgrafix.com/data_images/out/12/861215-nice-wallpaper.jpg"><img src="http://feelgrafix.com/data_images/out/12/861215-nice-wallpaper.jpg" height="20" /></a>. Schön, gell?',
        'Walk off the earth rocks: <a class=" yt_0RgIK36X3Tw" title="https://www.youtube.com/watch?v=0RgIK36X3Tw" target="_blank" rel="nofollow" href="https://www.youtube.com/watch?v=0RgIK36X3Tw">https://www.youtube.com/watch?v=0RgIK36X3Tw</a>',
        'Vielleicht könnte man sowas ja damit verhindern? <a class=\" yt_Jg_K5j7_Bao\" title=\"https://www.youtube.com/watch?t=13&v=Jg_K5j7_Bao\" target=\"_blank\" rel=\"nofollow\" href=\"https://www.youtube.com/watch?t=13&v=Jg_K5j7_Bao\">https://www.youtube.com/watch?t=13&v=Jg_K5j7_Bao</a>',
        '<img src="//www.karopapier.de/bilder/smilies/wavey.gif" alt="wavey" title="wavey">',
        'Didi und Stickerle fahr ich jetzt in Grund und Boden! <a class="GidLink87654" href="//2.karopapier.de/game.html?GID=87654" target="_blank">87654</a> <a href="http://www.karopapier.de/showmap.php?GID=87654">Direktlink_1.0</a>',
        'das geht doch schoener: <a class="" title="https://en.wikipedia.org/wiki/File:Admiral_Horatio_Nelson,_Nelson\'s_Column,_Trafalgar_Square,_London.JPG" target="_blank" rel="nofollow" href="https://en.wikipedia.org/wiki/File:Admiral_Horatio_Nelson,_Nelson\'s_Column,_Trafalgar_Square,_London.JPG"><img src="https://en.wikipedia.org/wiki/File:Admiral_Horatio_Nelson,_Nelson\'s_Column,_Trafalgar_Square,_London.JPG" height="20" /></a>'
    ];

    assert.expect(inputs.length * 2 + 3);

    //funny
    for (var i = 0; i < inputs.length; i++) {
        assert.equal(KaroUtil.linkify(inputs[i]), expects[i], inputs[i]);
    }

    //unfunny
    KaroUtil.set("funny", false);
    for (var i = 0; i < inputs.length; i++) {
        assert.equal(KaroUtil.linkify(inputs[i]), expectsUnfunny[i], inputs[i]);
    }


    KaroUtil.set("oldLink", true);
    inputs = [
        "Guck mal bei GID=12345",
        'Da ist ein Spiel unter http://www.karopapier.de/showmap.php?GID=12345 bei dem ich nicht weiter komme',
        "Wo leitest du mich hin? http://2.karopapier.de/game.html?GID=85566 ",
    ];

    expects = [
        'Guck mal bei <a class="GidLink12345" href="//www.karopapier.de/showmap.php?GID=12345" target="_blank">12345</a>',
        'Da ist ein Spiel unter <a class="GidLink12345" href="//www.karopapier.de/showmap.php?GID=12345" target="_blank">12345</a> bei dem ich nicht weiter komme',
        'Wo leitest du mich hin? <a class="GidLink85566" href="//www.karopapier.de/showmap.php?GID=85566" target="_blank">85566</a> ',
    ];

    for (var i = 0; i < inputs.length; i++) {
        assert.equal(KaroUtil.linkify(inputs[i]), expects[i], inputs[i]);
    }
});
