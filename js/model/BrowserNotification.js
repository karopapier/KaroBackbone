var BrowserNotification = Backbone.Model.extend({
    defaults: {
        level: "info",
        text: "Notification",
        screen: true,
        native: true,
        group: "general",
        timeout: 8000,
        imageUrl: "",
        clickUrl: ""

    },
    initialize: function (options) {

        this.myNotify = new Notification(this.get("title"), {
            'body': this.get("body"),
            'tag': this.get("tag"),
            'icon': this.get("icon")
        });

        var timeout = this.get("timeout");
        if (timeout && !isNaN(timeout)) {
            setTimeout(this.close.bind(this), timeout);
        }

        //this.myNotify.addEventListener('show', this, false);
        //this.myNotify.addEventListener('error', this, false);
        //this.myNotify.addEventListener('close', this, false);
        //this.myNotify.addEventListener('click', this, false);
    },
    close: function () {
        //alert("Zumach");
    }
});


/*y
 var n = new BrowserNotifcation(title, {
 tag: "Dran",
 body: "Du musst bei " + DRAN + " Spiel" + en + " ziehen",
 icon: "/favicon.ico",
 timeout: DRAN > 0 ? 0 : 2,
 permissionDenied: permissionDenied,
 notifyClick: function () {
 //window.open("http://www.karopapier.de/showmap.php?GID="+data.gid);
 window.open("http://www.karopapier.de/dran");
 }
 }).show();
 */