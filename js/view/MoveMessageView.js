var MoveMessageView = Backbone.View.extend({
    initialize: function() {
        _.bindAll(this);
        this.model.bind("change", this.redraw);
        this.template= _.template('<%= name %>: <%= text %><br />\n');
        //apply given filter function or preset with returning all
        if (this.options.filter) {
            this.filter=this.options.filter;
        } else {
            this.filter=function() { return true };
        }
    },
    redraw: function() {
        var html='';
        filtered=this.model.filter(this.filter);

        _.each(filtered,function(e) {
            html+=this.template({
                name: e.get("player").get("name"),
                text: e.get("move").get("msg")
            });
        },this);
        this.$el.html(html);
    }
});