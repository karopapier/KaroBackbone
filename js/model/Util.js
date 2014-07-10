var YOUTUBE_CACHE = {};
(function (karo) {
    karo.Util = {};
    karo.Util.linkify = function (text) {
        if (!text) return text;

        //find links outside tags
        //outside tag lookahead: (?![^<]+>)
        text = text.replace(/(?![^<]+>)((https?\:\/\/|ftp\:\/\/)|(www\.))(\S+)(\w{2,4})(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi, function (url) {
            var className = "";
            var linktext = url;
            var linktitle = url;
            if (url.match('^https?:\/\/')) {
                //linktext = linktext.replace(/^https?:\/\//i,'')
                //linktext = linktext.replace(/^www./i,'')
            } else {
                url = 'http://' + url;
            }

            //special handdling: youtube
            if (url.match('youtube.com/.*v=.*')) {
                console.log("Its a yt url", url);
                var videoid = url.split("?").filter(function (part) {
                    return part.substr(0, 2) == "v=";
                })[0].split("=")[1];
                console.log("Its a yt url", url, videoid);
                className += " yt_" + videoid;
                var yt_url = 'https://www.googleapis.com/youtube/v3/videos?id=' + videoid + '&key=AIzaSyBuMu8QDh49VqGJo4cSS4_9pTC9cqZwy98&part=snippet';
                if (videoid in YOUTUBE_CACHE) {
                    var snippet = YOUTUBE_CACHE[videoid];
                    linktext = '<img height="20" src="' + snippet.thumbnails.default.url + '" />' + snippet.title;
                    linktitle = snippet.description;
                } else {
                    $.getJSON(yt_url, function (data) {
                        var snippet = data.items[0].snippet;
                        YOUTUBE_CACHE[videoid] = snippet;
                        linktext = '<img height="20" src="' + snippet.thumbnails.default.url + '" />' + snippet.title;
                        $('a.yt_' + videoid).attr("title", snippet.description).html(linktext);
                    });
                }
            } else if (url.match('.*\.jpg')) {
                console.log("Handling jpg url", url);
                linktext = '<img src="' + url + '" height="20" />';
            } else {
                console.log("Handling default url", url, text);
                if (url.match('^https?:\/\/')) {
                    linktext = linktext.replace(/^https?:\/\//i, '')
                    linktext = linktext.replace(/^www./i, '')
                }
            }

            return '<a class="' + className + '" title="' + linktitle + '" target="_blank" rel="nofollow" href="' + url + '">' + linktext + '</a>';
        });

        //Thomas Anders
        text = text.replace(/\banders\b/gi, ' <img style="opacity: .3" src="http://reloaded.karopapier.de/images/anders.jpg" alt="anders" title="anders" />');
        //nen -> einen
        text = text.replace(/\bnen\b/gi, 'einen');

        //smilies
        text = text.replace(/img src="\/images\/smilies\/(.*?).gif" alt=/g, 'img src="http://www.karopapier.de/bilder/smilies/$1.gif" alt=');

        //GID replacement to game link
        text = text.replace(/GID[ =]([0-9]{3,6})/gi, function (all, gid) {
            $.getJSON('http://reloaded.karopapier.de/api/game/' + gid + '/info.json?callback=?', function (gameInfo) {
                $('a.GidLink' + gid).text(gid + ' - ' + gameInfo.game.name);
            });
            return '<a class="GidLink' + gid + '" href="http://www.karopapier.de/showmap.php?GID=' + gid + '" target="_blank">' + gid + '</a>';
        });

        return text;
    }
}(Karopapier));

''.trim||(String.prototype.trim=function(){return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g,'')});
