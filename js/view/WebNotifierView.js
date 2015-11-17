var WebNotifierView = Backbone.View.extend({
    initialize: function () {

        console.warn ("I AM OBSOLETE");
        console.log("INIT WEB NOT VIEW");

        this.settings = new Backbone.Model({
            defaults: {
                supported: false
            }
        });

    },
    unsupportedBrowser: function () {
        console.log("Browser kann nicht");
        this.$('#notif').prop("disabled", true);
        this.$('#statusinfo').attr("data-quicktip", "Dein Browser unterst�tzt das leider nicht...");
        this.$('#statusinfo').removeClass().addClass("quicktip quicktip-box quicktip-error");
    },
    notifPossible: function () {
        console.log("Browser k�nnte");
        this.$('#statusinfo').attr("data-quicktip", "Dein Browser kann das!");
        this.$('#statusinfo').removeClass().addClass("quicktip quicktip-box quicktip-ok");
    },
    permissionCompletelyDenied: function () {
        console.log("Ich darf echt gar nicht");
        this.$('#notif').prop("disabled", true);
        this.$('#statusinfo').attr("data-quicktip", "Du hast Karopapier.de nicht erlaubt, Benachrichtigungen anzuzeigen. Das bekommst Du nur mit Browsereinstellungen und reload wieder hin.");
        this.$('#statusinfo').removeClass().addClass("quicktip quicktip-box quicktip-warn");
    },
    permissionGranted: function () {
        console.log("Ich d�rfte");
    },
    permissionDenied: function () {
        console.log("Ich darf nicht");
        this.$('#notif').prop("checked", false);
        this.$('#notif').prop("disabled", true);
        this.$('#statusinfo').attr("data-quicktip", "Du hast Karopapier.de nicht erlaubt, Benachrichtigungen anzuzeigen.");
        this.$('#statusinfo').removeClass().addClass("quicktip quicktip-box quicktip-warn");
    },
    webNotif: function () {
        if ($('#notif').prop("checked")) {
            Notification.requestPermission(showWebNotif, permissionDenied);
        }
    },
    showWebNotif: function () {
        var DRAN = 123;

        var title = "Du bist ein bisschen dran";
        if (DRAN == 0) title = "Du bist gar nich dran!";
        if (DRAN > 10) title = "Du bist ganz schoen dran!";
        if (DRAN > 20) title = "Du bist mal echt voll dran!";
        if (DRAN > 30) title = "BOAH!! Du bist sooo dran!";
        if (DRAN > 40) title = "LOS! Du bist verdammt dran!";
        var en = "";
        if (DRAN != 1) en = "en";
        var n = new BrowserNotifcation({
            title: title,
            tag: "Dran",
            body: "Du musst bei " + DRAN + " Spiel" + en + " ziehen",
            icon: "/favicon.ico",
            timeout: DRAN > 0 ? 0 : 2,
            permissionDenied: permissionDenied,
            notifyClick: function () {
                //window.open("http://www.karopapier.de/showmap.php?GID="+data.gid);
                window.open("//www.karopapier.de/dran");
            }
        }).show();
    },
    check: function () {
        if (!("Notification" in window)) {
            this.settings.set("supported", false);
            this.unsupportedBrowser();
        } else {
            if (Notification.permission === "denied") {
                this.permissionCompletelyDenied();
            } else {
                this.notifPossible();
                if (store.enabled) {
                    var storePath = "user.settings.webnotification.dran";
                    var notifyIntention = store.get(storePath) || false;
                    $('#notif').prop("checked", notifyIntention);
                }
            }
        }

        this.$('#notif').change(function (e) {
            var wantNotification = e.currentTarget.checked;
            if (store.enabled) {
                var storePath = "user.settings.webnotification.dran";
                store.set(storePath, wantNotification);
            }
            if (wantNotification) {
                Notification.requestPermission(this.permissionGranted, this.permissionDenied);
            }
        });
    },
    render: function () {
        var t = '';
        t += '<label for="notif"> Desktop-Benachrichtigung?';
        t += '<span id="statusinfo" class="quicktip quicktip-box quicktip-info" data-quicktip="Mal gucken, ob Dein Browser das kann..."> &nbsp;</span>';
        t += ' </label>';
        t += '<span class="slidercheckbox">'
        t += '<input id="notif" type="checkbox">';
        t += '<label for="notif" class="slidercheckbox_onoff"></label>';
        t += '</span>';
        this.$el.html(t);
    }
});
