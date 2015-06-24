var TitleView = Backbone.View.extend({
    initialize: function (options) {
        _.bindAll(this, "render")

        this.title = options.title || "Karopapier";

        //expects User as model
        this.model.on("change:dran", this.render);
    },
    render: function () {
        var t = "";
        var dran = this.model.get("dran");

        if (dran > 0) {
            t += "(" + dran + ") ";
        }
        t += this.title;
        document.title = t;
    }
});