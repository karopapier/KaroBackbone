var NotifierView = Backbone.View.extend({
    tagName: "ul",
    className: "notifier",
    initialize: function () {
        _.bindAll(this, "showNotification", "render");
        //this.render();
        this.listenTo(this.model.notifications, "add", this.showNotification);
    },
    showNotification: function (notification) {  //, notifications) {
        console.log("Das N", notification);
        var nv = new NotificationView({
            model: notification
        }).render();
        nv.el.style.display = "none";
        this.$el.append(nv.el);
        nv.$el.show({
            effect: "fade"
        });

        //clean up after timeout
        setTimeout(function () {
            nv.$el.hide({
                effect: "slide",
                direction: "up",
                complete: function () {
                    nv.$el.remove();
                }
            });
        }, notification.get("timeout"));
    },
    render: function () {
        console.log(this.el);
        $("body").append(this.el);
        var text = this.model.get("text");
        this.$el.html(text);
        return this;
    }
});
