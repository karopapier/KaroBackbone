var MapSvgView = MapBaseView.extend({
    tagName: "svg",
    className: "mapSvgView",
    initialize: function () {
        this.constructor.__super__.initialize.apply(this,arguments);
        _.bindAll(this, "adjustSize","render");
        this.model.bind("change:rows change:cols", this.adjustSize);


        this.mapPathFinder = new MapPathFinder({
            map: this.model
        });

        this.$el.append("Hier");
        this.render();
    },
    adjustSize: function () {
        console.log(this.model.get("cols"));
        console.log(this.fieldSize);
        this.$el.attr({
            width: this.model.get("cols") * this.fieldSize,
            height: this.model.get("rows") * this.fieldSize
        })
    },
    render: function () {

        //do all the stuff
    }
});