var _ = require('underscore');
var Backbone = require('backbone');
module.exports = Backbone.View.extend(/** @lends FaviconView */ {
    tagName: "link",
    /**
     * @class FaviconView
     * @constructor FaviconView
     * @param options
     */
    initialize: function (options) {
        _.bindAll(this, "update", "reset", "addNum", "render")
        this.baseUrl = this.el.href;
        this.src = this.baseUrl;
        //console.log(this.el);
        //console.log(this.baseUrl);

        this.head = document.head || document.getElementsByTagName('head')[0];
        this.canvas = document.createElement("canvas");
        this.canvas.width = 16;
        this.canvas.height = 16;
        this.ctx = this.canvas.getContext("2d");
        this.img = new Image();
        this.img.src = this.src;

        //expects User as model
        this.model.on("change:dran change:id", this.update);

    },
    update: function (u, dran, e) {
        if (!dran) dran = 0;
        this.reset();
        //console.info("Update favicon ", dran);
        this.addNum(dran);
        this.render();
    },
    reset: function () {
        this.src = this.baseUrl;
    },
    addNum: function (n) {
        this.ctx.drawImage(this.img, 0, 0);
        if (n > 99) n = "99";
        this.ctx.textBaseline = "bottom";
        this.ctx.textAlign = "right";
        this.ctx.font = "8pt Arial";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(n, 15, 15);
        this.ctx.fillText(n, 15, 17);
        this.ctx.fillText(n, 17, 15);
        this.ctx.fillText(n, 17, 17);
        this.ctx.fillStyle = "black";
        this.ctx.fillText(n, 16, 16);
        this.src = this.canvas.toDataURL();
        //console.log("Old href: " + favicon.href);
        this.render();
    },
    render: function () {
        //console.log("Render favico");
        var link = document.createElement('link');
        link.id = 'favicon';
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = this.src;
        if (this.el) {
            document.head.removeChild(this.el);
        }
        document.head.appendChild(link);
        this.el = link;
        //console.log(link);
    }
});