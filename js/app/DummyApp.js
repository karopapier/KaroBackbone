var DummyApp = Backbone.Marionette.Application.extend({
    initialize: function (options) {
        this.info = options.info||"-";
        console.log("Init Dummy App",options.info);
        this.layout = new DummyAppLayout();
        this.view = new DummyAppView({
            model: this
        });
    },
    start: function () {
        console.log("Start Dummy App",this.info);
        this.v1 = new LogView({
            info: this.info + " 1"
        });
        this.v2 = new LogView({
            info: this.info + " 2"
        });
    }
});

var DummyAppView = Marionette.ItemView.extend({
    class: "dummApp",
    render: function() {
        console.log(this.model, " is an app");
        this.model.layout.render();
        this.model.layout.slot1.show(this.model.v1);
        this.model.layout.slot2.show(this.model.v2);
        this.$el.html(this.model.layout.$el);
    }
});

var DummyAppLayout = Marionette.LayoutView.extend({
    template: function() {
        return '<div id="dummy1">1</div><div id="dummy2">2</div>';
    },
    regions: {
        slot1: "#dummy1",
        slot2: "#dummy2"
    }
});


