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
        this.model.layout.mapViewContainer.show(this.model.mapRenderView, {preventDestroy: true});
        this.model.layout.gameTitleContainer.show(this.model.gameTitleView);
        this.model.layout.playerTableView.show(this.model.playerTableView);
        this.model.layout.gameInfo.show(this.model.gameInfoView);
        this.$el.html(this.model.layout.$el);
    }
});
