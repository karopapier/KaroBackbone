var ChatAppView = Marionette.ItemView.extend({
    class: "chatApp",
    render: function() {
        console.log(this.model, " is an app");
        this.model.layout.render();


        this.model.layout.chatMessages.show(this.model.chatMessagesView, {preventDestroy: true});
        this.model.layout.chatInfo.show(this.model.chatInfoView, {preventDestroy: true});
        this.model.layout.chatControl.show(this.model.chatControlView, {preventDestroy: true});
        this.model.layout.chatEnter.show(this.model.chatEnterView, {preventDestroy: true});
        //var $el = this.layout.chatMessages.$el;
        //$($el).on("scroll", this.scrollCheck);
        //this.layout.chatInfo.show(new LogView());
        this.$el.html(this.model.layout.$el);
    }
});