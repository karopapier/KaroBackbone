var WebNotifierControlView = Backbone.View.extend({
    initialize: function () {

        console.log("INIT WEB NOT VIEW");
        this.listenTo(this.model, "change:supported", this.updateSupported);
        this.listenTo(this.model, "change:denied", this.updateDenied);
    },

    updateSupported: function () {
        if (this.model.get("supported")) {
            this.$('#statusinfo').attr("data-quicktip", "Dein Browser kann das!");
            this.$('#statusinfo').removeClass().addClass("quicktip quicktip-box quicktip-ok");
        } else {
            this.$('#notificationEnabled').prop("disabled", true);
            this.$('#statusinfo').attr("data-quicktip", "Dein Browser unterstützt das leider nicht...");
            this.$('#statusinfo').removeClass().addClass("quicktip quicktip-box quicktip-error");
        }
    },
    updateDenied: function() {
        if (this.model.get("denied")) {
            console.log("DENIED");
            this.$('#notificationEnabled').prop("disabled", true);
            this.$('#statusinfo').attr("data-quicktip", "Du hast nicht erlaubt, Benachrichtigungen anzuzeigen.");
            //this.$('#statusinfo').attr("data-quicktip", "Du hast Karopapier.de nicht erlaubt, Benachrichtigungen anzuzeigen. Das bekommst Du nur mit Browsereinstellungen und reload wieder hin.");
            this.$('#statusinfo').removeClass().addClass("quicktip quicktip-box quicktip-warn");
        }
    },
    render: function () {
        var t = '';
        t += '<label for="notificationEnabled"> Desktop-Benachrichtigung?';
        t += '<span id="statusinfo" class="quicktip quicktip-box quicktip-info" data-quicktip="Mal gucken, ob Dein Browser das kann..."> &nbsp;</span>';
        t += ' </label>';
        t += '<span class="slidercheckbox">'
        t += '<input id="notificationEnabled" type="checkbox">';
        t += '<label for="notificationEnabled" class="slidercheckbox_onoff"></label>';
        t += '</span>';
        this.$el.html(t);
        this.updateSupported();
        this.updateDenied();
        return this;
    }
});
