var MapSvgView = MapBaseView.extend({
    tagName: "div",
    className: "mapSvgView",
    initialize: function () {
        //init MapBaseView with creation of a settings model
        this.constructor.__super__.initialize.apply(this, arguments);
        _.bindAll(this, "adjustSize", "render", "initSvg");
        this.initSvg();

        this.mapViewSettings.bind("change", this.adjustSize);
        this.model.bind("change:rows change:cols", this.adjustSize);
        this.model.bind("change:mapcode", this.render);
        this.paths = [];

        this.mapPathFinder = new MapPathFinder(this.model);

        this.render();
    },
    adjustSize: function () {
        console.log(this.model.get("cols"));
        console.log(this.fieldSize);
        var w = this.model.get("cols") * this.fieldSize;
        var h = this.model.get("rows") * this.fieldSize;
        this.$el.css({width: w, height: h});
        this.$SVG.attr({ width: w,  height: h });
    },
    initSvg: function () {
        //get template code
        var svgTemplate = MapTemplate();
        var svgDOM = new DOMParser().parseFromString(svgTemplate, "text/xml");
        this.SVG = svgDOM.documentElement;
        this.$SVG = $(this.SVG);
        this.$el.empty();
        this.el.appendChild(this.SVG);
    },
    render: function () {
        console.log("Rendering SvgView");
        if (typeof this.model.get("mapcode") === "undefined") {
            return false;
        }

        //get mainfill
        var char = this.mapPathFinder.getMainField();
        var mainclass = this.model.FIELDS[char];
        this.$SVG.find('#mainfill').attr("class", mainclass);

        var $paths = this.$SVG.find('#paths');

        //get outlines
        this.mapPathFinder.getAllOutlines();

        //render paths
        for (var char in this.mapPathFinder.outlines) {
            //console.log(char);
            var path = this.mapPathFinder.getSvgPathFromOutlines(this.mapPathFinder.outlines[char], this.fieldSize);
            var fieldClass= this.model.FIELDS[char];

            var p = this.makeSVG("path", {
                d: path,
                class: fieldClass
            })
            $paths[0].appendChild(p);
        }

    },
    makeSVG: function (tag, attrs) {
        var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attrs)
            el.setAttribute(k, attrs[k]);
        return el;
    }

});