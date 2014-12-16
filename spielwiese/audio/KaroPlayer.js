var KaroPlayer = function(o) {
    var options = o || {};
    var baseUrl = options.baseUrl || "";
    var baseType = options.baseType || "";
    var audioPlayer = document.createElement("audio");
    var queue={};

    var player = {
        getFullUrl: function(url) {
            var realUrl = "";
            if (url.indexOf("http") == 0) {
                realUrl =  url;
            } else {
                realUrl = baseUrl + url;
            }
            if (baseType !=="") {
                realUrl += "." + baseType;
            }
            return realUrl;
        },
        isLoaded: function(url) {
            return (url in queue);
        },
        preload: function(url, callback) {
            if (!this.isLoaded(url)) {
                var a = document.createElement("audio");
                a.setAttribute('src', this.getFullUrl(url));
                //audioPlayer.setAttribute('controls', 'controls');
                //audioPlayer.setAttribute('id', 'audioPlayer');
                a.load();
                if (typeof(callback) == "function") {
                    a.addEventListener("canplaythrough", callback, false);
                }
                queue[url] = a;
            }
        },
        getPlayer: function(url) {
            if (this.isLoaded(url)) {
                return queue[url];
            }

        },
        play: function(url) {
            this.preload(url);
            audioPlayer = this.getPlayer(url);
            audioPlayer.play();
        }
    }
    return player;
}