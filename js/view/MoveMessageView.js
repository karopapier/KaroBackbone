var MoveMessageView = Backbone.View.extend({
    template: _.template('<%= name %> (<%= date %>): &quot;<%= text %>&quot;<br />\n'),
    statusTemplate: _.template('<small><%= name %> (<%= date %>): &quot;<%= text %>&quot;<br /></small>\n'),
    initialize: function (options) {
        options = options || {};

        this.listenTo(this.collection, "reset change", this.render);
        _.bindAll(this, "render");
        //check statusmeldung add small
        //this.template = _.template('<small><%= name %> (<%= date %>): &quot;<%= text %>&quot;<br /></small>\n');
        this.template = _.template('<%= name %> (<%= date %>): &quot;<%= text %>&quot;<br />\n');
        this.filter = false;
        if (options.filter) {
            this.filter = options.filter;
        }
    },
    render: function () {
        //console.log("Rendere Movemessages, derer", this.collection.length);
        var html = '';
        var filtered = this.collection.models;
        if (this.filter) {
            filtered = this.collection.filter(this.filter);
        }

        _.each(filtered, function (e) {
            var txt = e.get("msg");
            var tpl = this.template;
            if (txt.startsWith("-:K")) {
                tpl = this.statusTemplate;
            }
            html += tpl({
                name: e.get("player").get("name"),
                text: KaroUtil.linkify(e.get("msg")),
                date: moment(e.get("t"), "YYYY-MM-DD hh:mm:ss").format("YYYY-MM-DD")
            });
        }, this);

        if (!html) {
            html = "--------- Keiner spricht, hier herrscht höchste Konzentration --------";
        }

        this.$el.html(html);
        this.$el[0].scrollTop = this.$el[0].scrollHeight;
    }
});
