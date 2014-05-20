(function (karo) {
    karo.Util = {};
    karo.Util.linkify = function (text) {
        if (!text) return text;

        text = text.replace(/\banders\b/gi, ' <img style="opacity: .3" src="http://reloaded.karopapier.de/images/anders.jpg" alt="anders" title="anders" />');
        text = text.replace(/\bnen\b/gi, 'einen');

        text = text.replace(/img src="\/images\/smilies\/(.*?).gif" alt=/g, 'img src="http://www.karopapier.de/bilder/smilies/$1.gif" alt=');

        text = text.replace(/GID[ =]([0-9]{3,6})/gi, function (all, gid) {
            $.getJSON('http://reloaded.karopapier.de/api/game/' + gid + '/info.json?callback=?', function (gameInfo) {
                $('a.GidLink' + gid).text(gid + ' - ' + gameInfo.game.name);
            });
            return '<a class="GidLink' + gid + '" href="http://www.karopapier.de/showmap.php?GID=' + gid + '" target="_blank">' + gid + '</a>';
        });

        return text;
    }
}(Karopapier));
