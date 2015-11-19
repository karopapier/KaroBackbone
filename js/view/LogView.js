var LogView = Backbone.View.extend({
    tagName: "pre",
    initialize: function (options) {
        this.info = options.info|| "-";
        this.log("Init");
    },
    log: function (t) {
        var d = new Date();
        var h = d.getHours();
        var m = d.getMinutes();
        var s = d.getSeconds();
        m = (m < 10) ? "0" + m : m;
        s = (s < 10) ? "0" + s : s;
        var ds = h + ":" + m + ":" + s;
        this.$el.append(ds + " " + this.info + " " + t + " (" + this.cid + ")\n");
    },
    render: function () {
        this.log("Render");
        return this;
    }
});