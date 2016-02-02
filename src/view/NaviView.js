var Marionette = require('backbone.marionette');
module.exports = Marionette.View.extend(/** @lends NaviView.prototype */ {
    template: window.JST["main/navi"],
    render: function() {
        this.$el.html(this.template());
        this.$('a[href*=".html"]').click(function(e) {
            var href = $(e.currentTarget).attr("href");
            console.log(href);
            Karopapier.router.navigate(href, {trigger: true});
            e.preventDefault();
            return false;
        });
        return this;
    }
});