var _ = require('underscore');
var Backbone = require('backbone');
module.exports = Backbone.View.extend({
    tagName: "div",
    id: "GameApp",
    className: "gameAppView",
    render: function() {
        //this.model is the gameApp with its collections
        this.model.layout.render();

        //insert views
        this.model.layout.gameQueue.show(this.model.gameDranQueueView, {preventDestroy: true});
        //this.model.layout.chatMessages.show(this.model.chatMessagesView, {preventDestroy: true});
        //this.model.layout.chatInfo.show(this.model.chatInfoView, {preventDestroy: true});
        //this.model.layout.chatControl.show(this.model.chatControlView, {preventDestroy: true});
        //this.model.layout.chatEnter.show(this.model.chatEnterView, {preventDestroy: true});

        this.$el.html(this.model.layout.$el);
    }
});
