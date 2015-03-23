var MapSvgView = MapBaseView.extend({
    tagName: "div",
    template: window.JST["map/svg"],
    className: "mapSvgView",
    initialize: function (options) {
        //init MapBaseView with creation of a settings model
        this.constructor.__super__.initialize.apply(this, arguments);
        _.bindAll(this, "adjustSize", "render", "initSvg", "renderFromPathStore", "renderFromPathFinder");
        this.initSvg();
        this.listenTo(this.model, "change:rows change:cols", this.adjustSize);
        this.listenTo(this.model, "change:mapcode", this.render);
        this.listenTo(this.settings, "change:cpsVisited change:cpsActive", this.updateCheckpoints);
        this.forceMapPathFinder = options.forceMapPathFinder||false;
        this.paths = [];

        this.initCss();

        this.mapPathFinder = new MapPathFinder(this.model);
        this.render();
    },
    initCss: function () {
        $('#mapSvgStyle').remove();
        var styleEl = document.createElement("style");
        styleEl.appendChild(document.createTextNode("")); //webkit fix
        styleEl.id="mapSvgStyle";
        document.head.appendChild(styleEl);
        this.styleSheet = styleEl.sheet;
        styleSheet = this.styleSheet;
        //styleSheet.insertRule(".grass {fill: rgb(0, 200, 0)}", 0);
        styleSheet.insertRule(".grass {fill: url('#grassPattern')", 0);
        styleSheet.insertRule(".road {fill: url('#roadPattern')", 0);
        styleSheet.insertRule(".start {fill: url(#startPattern)}", 0);
        styleSheet.insertRule(".finish { fill: url(#finishPattern) }", 0);
        styleSheet.insertRule(".mud { fill: rgb(100, 70, 0); }", 0);
        styleSheet.insertRule(".sand { fill: rgb(230, 230, 115); }", 0);
        styleSheet.insertRule(".water { fill: blue; }", 0);
        styleSheet.insertRule(".earth { fill: brown; }", 0);
        styleSheet.insertRule(".night { fill: black; }", 0);
        styleSheet.insertRule(".parc { fill: rgb(200, 200, 200); }", 0);

        styleSheet.insertRule(".grasscolor {fill: rgb(0, 200, 0)}", 0);
        styleSheet.insertRule(".grassspeclecolor {fill: rgb(0, 180, 0)}", 0);
        styleSheet.insertRule(".roadcolor {fill: rgb(128, 128, 128)}", 0);
        styleSheet.insertRule(".roadspeclecolor {fill: rgb(100, 100, 100)}", 0);
        styleSheet.insertRule(".cp1color { fill: rgb(0, 102, 255); }", 0);
        styleSheet.insertRule(".cp2color { fill: rgb(0, 100, 200); }", 0);
        styleSheet.insertRule(".cp3color { fill: rgb(0, 255, 102); }", 0);
        styleSheet.insertRule(".cp4color { fill: rgb(0, 200, 0); }", 0);
        styleSheet.insertRule(".cp5color { fill: rgb(255, 255, 0); }", 0);
        styleSheet.insertRule(".cp6color { fill: rgb(200, 200, 0); }", 0);
        styleSheet.insertRule(".cp7color { fill: rgb(255, 0, 0); }", 0);
        styleSheet.insertRule(".cp8color { fill: rgb(200, 0, 0); }", 0);
        styleSheet.insertRule(".cp9color { fill: rgb(255, 0, 255); }", 0);

        styleSheet.insertRule(".cp9 { fill: url(#cp9pattern); }", 0);
        styleSheet.insertRule(".cp8 { fill: url(#cp8pattern); }", 0);
        styleSheet.insertRule(".cp7 { fill: url(#cp7pattern); }", 0);
        styleSheet.insertRule(".cp6 { fill: url(#cp6pattern); }", 0);
        styleSheet.insertRule(".cp5 { fill: url(#cp5pattern); }", 0);
        styleSheet.insertRule(".cp4 { fill: url(#cp4pattern); }", 0);
        styleSheet.insertRule(".cp3 { fill: url(#cp3pattern); }", 0);
        styleSheet.insertRule(".cp2 { fill: url(#cp2pattern); }", 0);
        styleSheet.insertRule(".cp1 { fill: url(#cp1pattern); }", 0);

        this.updateCheckpoints();
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
        var cps = this.model.get("cps");
        if (this.settings.get("cpsActive") === false) {
            //no checkpoints required, hide them
            for (var cp = 0; cp < cps.length; cp++) {
                this.styleSheet.insertRule(".cp" + cps[cp] + " { fill-opacity: 0; }", this.styleSheet.cssRules.length);
            }
            return true;
        }

        //no, looks like cps are active
        var cpsVisited = this.settings.get("cpsVisited");
        if (!cpsVisited) return true;
        if (cpsVisited.length === 0) return true;
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
        var $old = this.$el;
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
        console.warn("Rendered using Outlines");
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
        var map = this.model;
        //console.log(map.attributes);
        document.getElementById('mapSvgView').setAttribute("viewBox", "0 0 " + (map.get("cols") * 12) + " " + (map.get("rows") * 12));
        this.initCss();
        console.log("Render triggered");
        this.trigger("rendered");
    },
    makeSVG: function (tag, attrs) {
        var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (var k in attrs)
            el.setAttribute(k, attrs[k]);
        return el;
    },
    renderFromPathStore: function () {
        //console.log("Render from pathstore");
        var mps = new MapPathStore();
        var me=this;
        mps.getPath(this.model.get("id"), function (map) {
            //console.log("Look at getPath Response", map)
            if (map===false) {
                //console.log("Trigger pathFinder from failed getPath");
                me.renderFromPathFinder();
                return false;
            }
            //get the map (from store or via request) and inject it via callback
            //console.log("Ich hab ne Karte", map);
            var parser = new DOMParser();
            //parse the path, check if it is compressed
            var path = map.p;
            if (path.charAt(0) != "<") {
                path = LZString.decompress(path);
            }
            //console.log("Path uncompressed: ",path);
            var doc = parser.parseFromString(path, "image/svg+xml");
            var mapNode = me.$SVG.find("#paths")[0];
            while (mapNode.childNodes.length > 0) {
                var f = mapNode.firstChild;
                mapNode.removeChild(f);
            }
            //console.log("Jetzt einfug");
            //console.log(doc.getElementById("mapSvgView"));
            mapNode.appendChild(document.importNode(doc.getElementById("paths"), true));
            //console.info("path render done");
            document.getElementById('mapSvgView').setAttribute("viewBox", "0 0 " + (map.c * 12) + " " + (map.r * 12));
            me.initCss();
        });
    },
    render: function () {
        if ((this.model.get("id") !== 0) && (this.model.get("id")<1000) && (!(this.forceMapPathFinder))) {
            this.renderFromPathStore();
        } else {
            //console.log("Trigger PathFinder from id being 0 or >1000");
            this.renderFromPathFinder();
        }
    }
});
