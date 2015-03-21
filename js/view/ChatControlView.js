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
        console.log(e);
        e.preventDefault();
        console.log(e);
        var msg = $('#newchatmessage').val();
        if (msg != "") {
            $.ajax({
                url: "http://www.karopapier.de/api/chat/message.json",
                type: "POST",
                crossDomain: true,
                data: "msg=" + msg,
                //JSON.stringify({"msg": msg}),
                dataType: "json",
                xhrFields: {
                    withCredentials: true
                },
                success: function sendMessageSuccess(data) {
                    $('#newchatmessagesubmit').prop("disabled", false);
                    $('#newchatmessage').val("");
                    $('#chatEnterForm').slideDown(100)
                },
                error: function (xhr, status) {
                    console.error(status, xhr);
                    $('#newchatmessagesubmit').prop("disabled", false);
                    $('#chatEnterForm').slideDown(100)
                }
            });
            $('#newchatmessagesubmit').prop("disabled", true);
            $('#chatEnterForm').slideUp(100)
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
