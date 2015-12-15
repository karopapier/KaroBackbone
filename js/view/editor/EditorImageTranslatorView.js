var EditorImageTranslatorView = Marionette.ItemView.extend({
    //file

    //dropable area

    //preview
    template: window.JST["editor/imagetranslator"],
    initialize: function(options) {
        _.bindAll(this, "run");
        //console.log("Drop area", options.droparea);
    },

    events: {
        "dragover img": "prevent",
        "drop img": "drop",
        "click button": "run"
    },

    prevent: function(e) {
        e.preventDefault();
        return false;
    },

    drop: function(e) {
        e.preventDefault();
        var origEvent = e.originalEvent;
        var me = this;
        var files = origEvent.dataTransfer.files;
        if (files.length > 0) {
            var file = files[0];
            if (typeof FileReader !== "undefined" && file.type.indexOf("image") != -1) {
                var reader = new FileReader();
                // Note: addEventListener doesn't work in Google Chrome for this event
                reader.onload = function(e) {
                    me.preview.src = e.target.result;
                    me.model.loadImage(me.preview);
                };
                reader.readAsDataURL(file);
            }
        }
        e.preventDefault();

    },

    run: function() {
        console.log("RUn translator");
        this.model.run();
    },

    render: function() {
        this.$el.html(this.template());

        this.$el.append(new Marionette.ItemView({
            model: this.settings,
            template: _.template("<%= sourceWidth %>")
        }));

        this.$preview = this.$("img");
        this.preview = this.$preview[0];
    }
});