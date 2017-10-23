var YOUTUBE_CACHE = {};
var KaroUtil = {};
(function(karoUtil) {
        karoUtil = karoUtil || {};
        karoUtil.funny = true;
        karoUtil.oldLink = false;
        karoUtil.init = function() {
            karoUtil.replacements = [];
            karoUtil.replacements.push({
                r: "<a (.*?)</a>",
                f: function(a) {
                    //real-link protector
                    return a;
                },
                sw: "i"
            });

            //Formatting
            karoUtil.replacements.push({
                r: "-:K",
                f: "<i>"
            });
            karoUtil.replacements.push({
                r: "K:-",
                f: "</i>"
            });
            karoUtil.replacements.push({
                r: "-:F",
                f: "<b>"
            });
            karoUtil.replacements.push({
                r: "F:-",
                f: "</b>"
            });
            karoUtil.replacements.push({
                r: "-:RED",
                f: '<span style="color: red">'
            });
            karoUtil.replacements.push({
                r: "RED:-",
                f: "</span>"
            });

            if (karoUtil.funny) {
                //Eier
                /* Ostern vorbEI
                karoUtil.replacements.push({
                    r: "ei",
                    f: function() {
                        var i=Math.round(Math.random()*4)+1;
                        var ei = "ei" + i;
                        return ' <img src="//2.karopapier.de/images/eier/' + ei + '.png" alt="Ei" title="Ei" />';
                    },
                    sw: "i"
                });
                */

                //-:Pic
                karoUtil.replacements.push({
                    r: "-:Pic src=(.*?) Pic:-",
                    f: function(text) {
                        return '<img src="http://daumennagel.de/' + RegExp.$1 + '" />';
                        //return '<img src="' + RegExp.$1 + '" />';
                    },
                });

                //nen
                karoUtil.replacements.push({
                    r: "(^|\\s)nen(^|\\s|$)",
                    f: function(text) {
                        return RegExp.$1 + "einen" + RegExp.$2;
                    },
                });

                //Nen
                karoUtil.replacements.push({
                    r: "(^|\\s)Nen(^|\\s|$)",
                    f: function() {
                        return RegExp.$1 + "Einen" + RegExp.$2;
                    }
                });

                //Thomas Anders
                karoUtil.replacements.push({
                    r: "\\banders\\b",
                    f: function() {
                        return ' <img style="opacity: .3" src="/images/anders.jpg" alt="anders" title="anders" />';
                    },
                    sw: "i"
                });

                //The HOFF
                karoUtil.replacements.push({
                    r: "\\bhoff\\b",
                    f: function() {
                        return ' <img style="opacity: .3" src="/images/hoff.jpg"     alt="hoff" title="hoff" />';
                    },
                    sw: "i"
                });
            }

            //GID
            karoUtil.replacements.push({
                r: "(?:http\\:\\/\\/www.karopapier.de\\/showmap.php\\?|http:\\/\\/2.karopapier.de\\/game.html\\?|\\b)GID[ =]([0-9]{3,6})\\b",
                f: function(all, gid) {
                    //console.log("All", all);
                    //console.log("GID", gid);
                    $.getJSON(APIHOST + '/api/game/' + gid + '/info.json?callback=?', function(gameInfo) {
                        $('a.GidLink' + gid).text(gid + ' - ' + gameInfo.game.name);
                    });
                    if (karoUtil.oldLink) {
                        return '<a class="GidLink' + gid + '" href="//www.karopapier.de/showmap.php?GID=' + gid + '" target="_blank">' + gid + '</a>';
                    } else {
                        return '<a class="GidLink' + gid + '" href="//2.karopapier.de/game.html?GID=' + gid + '" target="_blank">' + gid + '</a>';
                    }
                },
                sw: "i"
            });

            //Links
            karoUtil.replacements.push({
                r: "(?![^<]+>)((https?\\:\\/\\/|ftp\:\\/\\/)|(www\\.))(\\S+)(\\w{2,4})(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-\\/]))?",
                f: function(url) {
                    //console.log("URL MATCH", url);
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
                    if (url.match('youtube.com/.*v=.*') || url.match('youtu.be/.*')) {
                        //console.log("Its a yt url", url);
                        try {
                            var videoid = url.split("?")[1].split("&").filter(function(part) {
                                return part.substr(0, 2) == "v=";
                            })[0].split("=")[1];
                        } catch (err) {
                            //console.log("Try yt");
                            var videoid = url.split("tu\.be/")[1];
                        }
                        //console.log("Its a yt url", url, videoid);
                        className += " yt_" + videoid;
                        var yt_url = 'https://www.googleapis.com/youtube/v3/videos?id=' + videoid + '&key=AIzaSyBuMu8QDh49VqGJo4cSS4_9pTC9cqZwy98&part=snippet';
                        if (videoid in YOUTUBE_CACHE) {
                            var snippet = YOUTUBE_CACHE[videoid];
                            linktext = '<img height="20" src="' + snippet.thumbnails.default.url + '" />' + snippet.title;
                            linktitle = snippet.description;
                        } else {
                            //console.log(yt_url);
                            $.getJSON(yt_url, function(data) {
                                var snippet = data.items[0].snippet;
                                YOUTUBE_CACHE[videoid] = snippet;
                                linktext = '<img height="20" src="' + snippet.thumbnails.default.url + '" />' + snippet.title;
                                $('a.yt_' + videoid).attr("title", snippet.description).html(linktext);
                            });
                        }
                    } else if (url.match(/.*\.(jpg|gif|png)/i)) {
                        //console.log("Handling jpg url", url);
                        linktext = '<img src="' + url + '" height="20" />';
                    } else {
                        //console.log("Handling default url", url, text);
                        if (url.match('^https?:\/\/')) {
                            linktext = linktext.replace(/^https?:\/\//i, '');
                            linktext = linktext.replace(/^www./i, '');
                        }
                    }

                    return '<a class="' + className + '" title="' + linktitle + '" target="_blank" rel="nofollow" href="' + url + '">' + linktext + '</a>';
                },
                sw: "i"
            });

            //Smilies
            karoUtil.replacements.push({
                r: ":([a-z]*?):",
                f: function(all, smil) {
                    //console.log(smil);
                    var img = document.createElement("img");
                    img.src = "//www.karopapier.de/bilder/smilies/" + smil + ".gif";
                    img.onload = function() {
                        //console.log("Ich lud");
                        $('.smiley.' + smil).replaceWith(img);
                    }
                    return '<span class="smiley ' + smil + '">' + all + '</span>';
                },
                sw: "i"
            });

            karoUtil.replacements.push({
                r: 'img src="\\/images\\/smilies\\/(.*?).gif" alt=',
                f: function(all, smil) {
                    //console.log(all, smil);
                    return 'img src="//www.karopapier.de/bilder/smilies/' + RegExp.$1 + '.gif" alt=';
                },
                sw: "i"
            });
        };

        karoUtil.createSvg = function(tag, attrs) {
            var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
            for (var k in attrs)
                el.setAttribute(k, attrs[k]);
            return el;
        };

        karoUtil.linkify = function(text) {
            if (!text) return text;

            //console.log("Look at", text);
            for (var i = 0, l = this.replacements.length; i < l; i++) {
                var rpl = this.replacements[i];
                var r = rpl.r;
                var f = rpl.f;
                var sw = rpl.sw || "";
                //console.log(r, sw);

                var rx;
                if ("rx" in rpl) {
                    rx = rpl.rx;
                }else {
                    rx = new RegExp("^(.*?)(" + r + ")(.*?)$", sw);
                    rpl.rx = rx;
                }
                //console.log(rx);
                var parts = rx.exec(text);
                if (parts) {
                    //console.log("Match for", rx, parts);
                    var dump = parts.shift(); //whole string
                    var before = parts.shift();
                    var matchingText = parts.shift();
                    var after = parts.pop(); //there can be internal submatches
                    var textToReturn = karoUtil.linkify(before) + matchingText.replace(new RegExp(r, sw), f) + karoUtil.linkify(after);
                    //console.info(textToReturn);
                    return textToReturn;
                }
            }
            //console.log("No match, return text", text);
            //nothing matches?
            return text;
        };

        karoUtil.oldlinkify = function(text) {
            //smilies
            console.warn("DEPRECATED");
            return text;
        };

        karoUtil.lazyCss = function(url) {
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.type = "text/css";
            link.rel = "stylesheet"
            link.href = url;
            head.appendChild(link);
        };

        karoUtil.lazyJs = function(url) {
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = url;
            head.appendChild(script);
        }

        karoUtil.setFunny = function(tf) {
            console.warn("DEPRECATED setFunny");
            karoUtil.funny = tf;
            karoUtil.init();
        };

        karoUtil.set = function(k, v) {
            karoUtil[k] = v;
            karoUtil.init();
        };
        karoUtil.init();
    }
    (KaroUtil)
);

module.exports = KaroUtil;
