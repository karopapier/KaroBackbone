var MapCodeView = Backbone.View.extend({
    initialize: function () {
        _.bindAll(this, "render","setBounds");
        this.model.bind("change:mapcode", this.render);
        this.model.bind("change:rows change:cols", this.setBounds);
        this.render();
    },
    setBounds: function() {
        console.log("Bounds");
        this.$el.attr({
                "rows": this.model.get("rows"),
                "cols": this.model.get("cols")
            })
        ;
    },
    setCode: function() {
        console.log("Set Code");
        this.$el.val(this.model.get("mapcode"));
    },
    render: function () {
        this.setBounds();
        this.setCode();
    }
})
