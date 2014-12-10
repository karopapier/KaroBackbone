var MapImageView = MapBaseView.extend({
    className: "mapImageView",
    tag: "img",
    initialize: function (options) {
        //init MapBaseView with creation of a settings model
        this.constructor.__super__.initialize.apply(this, arguments);
        _.bindAll(this, "render");
        this.model.bind("change:id", this.render);
        this.mapViewSettings.bind("change", this.render);
    },
    render: function () {
        var mapid = this.model.get("id");
        if (mapid === 0) {
            this.$el.hide();
        } else {
            //console.info("Getting image");
            var cps = (this.mapViewSettings.get("cpsActive") === true) ? 1 : 0;
            this.$el.show();
            this.$el.attr("src", "http://www.karopapier.de/images/loading.gif");
            this.$el.attr("src", 'http://www.karopapier.de/map/' + mapid + '.png?size=' + this.mapViewSettings.get("size") + '&border=' + this.mapViewSettings.get("border") + '&cps=' + cps);
        }
    }
});