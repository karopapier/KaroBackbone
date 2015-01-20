var MapSvgView = MapBaseView.extend({
    tagName: "div",
    template: window.JST["map/svg"],
    className: "mapSvgView",
    initialize: function () {
        //init MapBaseView with creation of a settings model
        this.constructor.__super__.initialize.apply(this, arguments);
        _.bindAll(this, "adjustSize", "render", "initSvg");
        this.initSvg();

        this.settings.bind("change", this.adjustSize);
        this.model.bind("change:rows change:cols", this.adjustSize);
        this.model.bind("change:mapcode", this.render);
        this.listenTo(this.settings, "change:cpsVisited", this.updateCheckpoints);
        this.model.bind("")
        this.paths = [];

        this.initCss();

        this.mapPathFinder = new MapPathFinder(this.model);
        this.render();
    },
    initCss: function () {
        var styleEl = document.createElement("style");
        styleEl.appendChild(document.createTextNode("")); //webkit fix
        document.head.appendChild(styleEl);
        this.styleSheet = styleEl.sheet;
        styleSheet = this.styleSheet;
        styleSheet.insertRule(".grass {fill: rgb(0, 200, 0)}", 0);
        styleSheet.insertRule(".road {fill: rgb(128, 128, 128)}", 1);
        styleSheet.insertRule(".start {fill: url(#startPattern)}", 2);
        styleSheet.insertRule(".road { fill: rgb(128, 128, 128); }", 3);
        styleSheet.insertRule(".start { fill: url(#startPattern) }", 4);
        styleSheet.insertRule(".finish { fill: url(#finishPattern) }", 5);
        styleSheet.insertRule(".mud { fill: rgb(100, 70, 0); }", 6);
        styleSheet.insertRule(".sand { fill: rgb(230, 230, 115); }", 7);
        styleSheet.insertRule(".water { fill: blue; }", 8);
        styleSheet.insertRule(".earth { fill: brown; }", 9);
        styleSheet.insertRule(".night { fill: black; }", 10);
        styleSheet.insertRule(".parc { fill: rgb(200, 200, 200); }", 11);
        styleSheet.insertRule(".cp1color { fill: rgb(0, 102, 255); }", 12);
        styleSheet.insertRule(".cp2color { fill: rgb(0, 100, 200); }", 13);
        styleSheet.insertRule(".cp3color { fill: rgb(0, 255, 102); }", 14);
        styleSheet.insertRule(".cp4color { fill: rgb(0, 200, 0); }", 15);
        styleSheet.insertRule(".cp5color { fill: rgb(255, 255, 0); }", 16);
        styleSheet.insertRule(".cp6color { fill: rgb(200, 200, 0); }", 17);
        styleSheet.insertRule(".cp7color { fill: rgb(255, 0, 0); }", 18);
        styleSheet.insertRule(".cp8color { fill: rgb(200, 0, 0); }", 19);
        styleSheet.insertRule(".cp9color { fill: rgb(255, 0, 255); }", 20);
        styleSheet.insertRule(".cp1 { fill: url(#cp1pattern); }", 21);
        styleSheet.insertRule(".cp2 { fill: url(#cp2pattern); }", 22);
        styleSheet.insertRule(".cp3 { fill: url(#cp3pattern); }", 23);
        styleSheet.insertRule(".cp4 { fill: url(#cp4pattern); }", 24);
        styleSheet.insertRule(".cp5 { fill: url(#cp5pattern); }", 25);
        styleSheet.insertRule(".cp6 { fill: url(#cp6pattern); }", 26);
        styleSheet.insertRule(".cp7 { fill: url(#cp7pattern); }", 27);
        styleSheet.insertRule(".cp8 { fill: url(#cp8pattern); }", 28);
        styleSheet.insertRule(".cp9 { fill: url(#cp9pattern); }", 29);
    },
    clearCheckpointRules: function () {
        for (var r = 0; r < this.styleSheet.cssRules.length; r++) {
            var rule = this.styleSheet.cssRules[r];
            if (rule.selectorText.slice(0, 3) == ".cp") { //startsWith
                //console.log(rule.style.fillOpacity); //.fillOpacity);
                if (rule.style.fillOpacity) {
                    this.styleSheet.deleteRule(r);
                    r--;
                }
            }
        }
    },
    updateCheckpoints: function () {
        this.clearCheckpointRules();
        var cpsVisited = this.settings.get("cpsVisited");
        if (cpsVisited.length == 0) return true;
        for (var cp = 0; cp < cpsVisited.length; cp++) {
            //console.log("CP",cpsVisited[cp]);
            this.styleSheet.insertRule(".cp" + cpsVisited[cp] + " { fill-opacity: .15; }", this.styleSheet.cssRules.length);
        }
    },
    adjustSize: function () {
        //console.log(this.model.get("cols"));
        //console.log(this.fieldSize);
        var w = this.model.get("cols") * this.fieldSize;
        var h = this.model.get("rows") * this.fieldSize;
        this.$el.css({width: w, height: h});
        this.$SVG.attr({width: w, height: h});
    },
    initSvg: function () {
        //get template code
        //var svgTemplate = MapTemplate();
        var svgSrcCode = this.template();
        var svgDOM = new DOMParser().parseFromString(svgSrcCode, "text/xml");
        this.SVG = svgDOM.documentElement;
        this.$SVG = $(this.SVG);
        var $old=this.$el;
        this.setElement(this.SVG);
        $old.replaceWith(this.$SVG);
        this.adjustSize();
    },
    renderFromPathFinder: function () {
        //console.log("Rendering SvgView");
        if (typeof this.model.get("mapcode") === "undefined") {
            return false;
        }

        //get mainfill
        var mainchar = this.mapPathFinder.getMainField();
        //console.log("Mainchar",mainchar);
        var mainclass = this.model.FIELDS[mainchar];
        this.$SVG.find('#mainfill').attr("class", mainclass);

        var $paths = this.$SVG.find('#paths');
        $($paths).empty();

        //get outlines
        this.mapPathFinder.getAllOutlines();
        //console.log(this.mapPathFinder.outlines);
        //console.log("Found Outlines");
        //console.log(this.model.get("id"));

        //render paths
        //make sure to render "road" first so it does not cover cps
        var path = this.mapPathFinder.getSvgPathFromOutlines(this.mapPathFinder.outlines["O"], this.fieldSize);
        var fieldClass = this.model.FIELDS["O"];
        var p = this.makeSVG("path", {
            d: path,
            class: fieldClass
        })
        $paths[0].appendChild(p);

        for (var char in this.mapPathFinder.outlines) {
            if (char !== mainchar && char !== "O") {
                //console.log("Path for ",char);
                var path = this.mapPathFinder.getSvgPathFromOutlines(this.mapPathFinder.outlines[char], this.fieldSize);
                var fieldClass = this.model.FIELDS[char];

                var p = this.makeSVG("path", {
                    d: path,
                    class: fieldClass
                })
                $paths[0].appendChild(p);
            }
        }
        this.trigger("rendered");
    },
    makeSVG: function (tag, attrs) {
        var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attrs)
            el.setAttribute(k, attrs[k]);
        return el;
    },
    render: function () {
        if (this.model.get("id") !== 0) {
            //alert("Über Id");
            this.renderFromPathFinder();
        } else {
            this.renderFromPathFinder();
        }
    }
});
