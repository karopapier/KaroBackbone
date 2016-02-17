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
        this.model.layout.gameTitleContainer.show(this.model.gameTitleView);
        this.model.layout.gameInfo.show(this.model.gameInfoView);
        this.model.layout.mapView.show(this.model.mapRenderView);
        this.model.layout.playersMovesView.show(this.model.playersMovesView);
        this.model.layout.statusView.show(this.model.statusView);
        this.model.layout.moveMessagesView.show(this.model.moveMessagesView);
        this.model.layout.gridView.show(this.model.gridView);
        this.model.layout.playerTableView.show(this.model.playerTableView);
        this.model.layout.logLinkView.show(this.model.logLinkView);
        this.$el.html(this.model.layout.$el);
    }
});
