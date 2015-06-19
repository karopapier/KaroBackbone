var ChatControlView = Backbone.View.extend({
    tagName: "div",
    template: window["JST"]["chat/chatControl"],
    initialize: function () {
        _.bindAll(this, "render");
        this.listenTo(Karopapier.User, "change:id", this.render);
        return this;
    },
    events: {
        "submit": "sendMessage",
        "click .messageLimit": "setLimit"
    },
    sendMessage: function (e) {
        e.preventDefault();
        var msg = $('#newchatmessage').val();
        if (msg != "") {
            $.ajax({
                url: "http://www.karopapier.de/api/chat/message.json",
                type: "POST",
                method: "POST",
                crossDomain: true,
                //better than data: "msg=" + msg as it works with ???? as well
                data: {msg: msg},
                dataType: "json",
                xhrFields: {
                    withCredentials: true
                },
                success: function sendMessageSuccess(data) {
                    $('#newchatmessage').val("");
                    $('#newchatmessagesubmit').prop("disabled", false).stop().animate({opacity: 1});
                },
                error: function (xhr, status) {
                    console.error(status, xhr);
                    $('#newchatmessagesubmit').prop("disabled", false).stop().animate({opacity: 1});
                }
            });
            $('#newchatmessagesubmit').prop("disabled", true).stop().animate({opacity: 0});
        }
    },
    setLimit: function (e) {
        var limit = parseInt($(e.currentTarget).text());
        this.model.set("limit", limit);
    },
    render: function () {
        if (Karopapier.User.get("id") != 0) {
            this.$el.html(this.template(Karopapier.User.toJSON()));
        } else {
            this.$el.html("Nicht angemeldet");
        }
        return this;
    }
})
