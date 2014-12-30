var EditorView = Backbone.View.extend({
    id: 'editor',
    initialize: function () {
        _.bindAll(this, "loadMapId", "loadMapcode", "buttonDown");


        this.map = new Map();
        this.mapView = new MapRenderView({ model: this.map});
        this.settings = this.mapView.mapViewSettings;
        this.model = new Backbone.Model({
            buttonDown: 0
        });

        this.model.on("change:buttonDown", this.buttonDown);

        //Build the DOM, #TODO use Marionette layouts instead
        //resizable container for the rendered map
        var mapArea = $("<div>");
        mapArea.attr("id", "editorMap");
        mapArea.append(this.mapView.el);
        this.$el.append(mapArea);

        var toolsArea = $("<div>");
        toolsArea.attr("id", "editorTools");
        this.toolsView = new EditorToolsView({
            "settings": this.settings,
            "el": toolsArea
        });
        this.$el.append(toolsArea);

        var codeArea = $('<div></div>');
        codeArea.attr("id", "mapCode");
        this.codeView = new MapCodeView({
            model: this.map,
            el: codeArea
        });
        this.$el.append(codeArea);
        //editorview needs to include a PLAIN MapRenderView and a MapCodeView
        //the EDITOR needs to handle mouse events and send draw commands to the mapview

        //the EDIOTR needs to init a EditorToolsView and listen on changes of the settings, passing them to the MapView.mapViewSettings

        //this.$el.append($('<input type="button" class="loadMapcode" value="Load" />'));
        this.map.bind("change:cps", function (e, cps) {
            $('#cpsUsed').text(cps.join(","));
        }, this);
    },
    buttonDown: function () {
        console.log("Triggered Buttondown");
        var down = this.model.get("buttonDown");
        console.log(down);
    },
    events: {
        'click .loadMapcode': "loadMapcode"
    },
    loadMapId: function (mapId) {
        console.log("Ich lade jetzt",mapId);
        var $this = this;
        $.getJSON("http://www.karopapier.de/api/mapcode/" + mapId + ".json?callback=?", function (mapcode) {
            $this.map.set("mapcode",mapcode);
        });
    },
    loadMapcode: function () {
        this.codeView.map.set("mapcode", this.mapcode.val());
        this.codeView.render();
    }
});

