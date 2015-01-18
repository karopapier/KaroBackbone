var MapImageView = MapBaseView.extend({
    className: "mapImageView",
    tag: "img",
    initialize: function (options) {
        //init MapBaseView with creation of a settings model
        this.constructor.__super__.initialize.apply(this, arguments);
        _.bindAll(this, "render");
        this.model.bind("change:id", this.render);
        this.settings.bind("change", this.render);
    },
    render: function () {
        var mapid = this.model.get("id");
        if (mapid === 0) {
            this.$el.hide();
        } else {
            //console.info("Getting image");
            var cps = (this.settings.get("cpsActive") === true) ? 1 : 0;
            this.$el.show();
            this.$el.attr("src", "http://www.karopapier.de/images/loading.gif");
            this.$el.attr("src", 'http://www.karopapier.de/map/' + mapid + '.png?size=' + this.settings.get("size") + '&border=' + this.settings.get("border") + '&cps=' + cps);
        }
    }
});