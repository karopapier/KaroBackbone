var StaticView = Backbone.View.extend({
    initialize: function(options) {
        _.bindAll(this, "template");
        this.path = options.path;
    },
    template: function() {
        var path = this.path.replace(".html","");
        return window.JST["static/" + path];
    },
    render: function() {
        var content = this.template();
        this.$el.html(content);

        this.$('a[href*=".html"]').click(function(e) {
            var href=$(e.currentTarget).attr("href");
            console.log(href);
            Karopapier.router.navigate(href, {trigger: true});
            e.preventDefault();
            return false;
        });
    }
});