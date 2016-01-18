var Backbone = require('backbone');
module.exports = Backbone.View.extend(/** lends NotificationControl */ {
    /**
     * @constructor NotificationControl
     * @class NotificationControl
     */
    initialize: function() {

        console.log("INIT WEB NOT VIEW");
        this.listenTo(this.model, "change:supported", this.updateSupported);
        this.listenTo(this.model, "change:denied", this.updateDenied);
        this.listenTo(this.model, "change:final", this.updateFinal);
        this.listenTo(this.model, "change:enabled", this.updateEnabled);
    },
    events: {
        "change #notificationEnabled": "checkEnabled"
    },
    updateSupported: function() {
        if (this.model.get("supported")) {
            this.$('#statusinfo').attr("data-quicktip", "Dein Browser kann das!");
            this.$('#statusinfo').removeClass().addClass("quicktip quicktip-box quicktip-ok");
        } else {
            this.$('#notificationEnabled').prop("disabled", true);
            this.$('#statusinfo').attr("data-quicktip", "Dein Browser unterst�tzt das leider nicht...");
            this.$('#statusinfo').removeClass().addClass("quicktip quicktip-box quicktip-error");
        }
    },
    updateEnabled: function() {
        this.$('#notificationEnabled').prop("checked", this.model.get("enabled"));
    },
    updateFinal: function() {
        if (this.model.get("denied") && this.model.get("final")) {
            this.$('#notificationEnabled').prop("disabled", true);
        } else {
            this.$('#notificationEnabled').prop("disabled", false);
        }
    },
    updateDenied: function() {
        if (this.model.get("denied")) {
            console.log("DENIED");
            this.$('#statusinfo').attr("data-quicktip", "Du hast nicht erlaubt, Benachrichtigungen anzuzeigen.");
            //this.$('#statusinfo').attr("data-quicktip", "Du hast Karopapier.de nicht erlaubt, Benachrichtigungen
            // anzuzeigen. Das bekommst Du nur mit Browsereinstellungen und reload wieder hin.");
            this.$('#statusinfo').removeClass().addClass("quicktip quicktip-box quicktip-warn");
        }
    },
    checkEnabled: function() {
        var on = this.$("#notificationEnabled").prop("checked");
        this.model.set("enabled", on);
    },
    render: function() {
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
        this.updateFinal();
        this.updateEnabled();
        return this;
    }
});
