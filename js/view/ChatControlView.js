var ChatControlView = Backbone.View.extend({
    tagName: "div",
    template: window["JST"]["chat/chatControl"],
    initialize: function () {
        _.bindAll(this, "render");
        this.listenTo(Karopapier.User, "change:id", this.render);
        return this;
    },
    events: {
        "submit": "sendMessage"
    },
    sendMessage: function (e) {
        console.log(e);
        e.preventDefault();
        console.log(e);
        var msg = $('#newchatmessage').val();
        if (msg != "") {
            $.post("http://reloaded.karopapier.de/api/chat/message.json", {"msg": msg}, function sendMessageSuccess(data) {
                $('#newchatmessagesubmi').prop("disabled", false);
            });
            /*
            $.ajax({
                url: "http://reloaded.karopapier.de/api/chat/message.json",
                type: "POST",
                crossDomain: true,
                data: JSON.stringify({"msg": msg}),
                dataType: "json",
                success: function sendMessageSuccess(data) {
                    $('#newchatmessagesubmi').prop("disabled", false);
                },
                error: function (xhr, status) {
                    console.error(status, xhr);
                }
            });
            */
            $('#newchatmessagesubmi').prop("disabled", true);
        }
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