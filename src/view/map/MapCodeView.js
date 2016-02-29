var Backbone = require('backbone');
module.exports = Backbone.View.extend({
    tagName: "textarea",
    initialize: function(options) {
        _.defaults(options, {readonly: true});
        this.readonly = options.readonly;
        _.bindAll(this, "render", "setBounds", "setCode", "getCode", "updateModel");
        //this.listenTo(this.model, "change:mapcode", this.render);
        this.listenTo(this.model, "change:rows change:cols", this.setBounds);
        this.listenTo(this.model, "change:mapcode", this.setCode);
        this.listenTo(this.model, "change:field", this.setCode);
        this.render();
        if (this.readonly) {
            this.makeReadonly();
        } else {
            this.makeEditable();
        }
    },
    makeReadonly: function() {
        this.$el.attr("disabled", "disabled");
        this.undelegateEvents();
    },
    makeEditable: function() {
        this.delegateEvents({
            "keyup": "updateModel"
        });
    },
    setBounds: function() {
        //console.log("Bounds");
        this.$el.attr({
            "rows": this.model.get("rows") + 1,
            "cols": this.model.get("cols") + 5
        })
        ;
    },
    setCode: function() {
        //console.info("I need to change");
        this.$el.val(this.model.get("mapcode"));
    },
    getCode: function() {
        return this.$el.val();
    },
    updateModel: function() {
        this.model.set("mapcode", this.getCode());
    },
    render: function() {
        this.setBounds();
        this.setCode();
    }
});