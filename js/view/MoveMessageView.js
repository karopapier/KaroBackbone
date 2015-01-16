var MoveMessageView = Backbone.View.extend({
    template: _.template('<%= name %> (<%= date %>): &quot;<%= text %>&quot;<br />\n'),
    statusTemplate: _.template('<small><%= name %> (<%= date %>): &quot;<%= text %>&quot;<br /></small>\n'),
    initialize: function (options) {
        options = options || {};

        this.listenTo(this.collection, "change", this.render);
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
        console.log("Rendering mmv");
        var html = '';
        var filtered = this.collection.models;
        if (this.filter) {
            filtered = this.collection.filter(this.filter);
        }

        console.log(filtered);

        _.each(filtered, function (e) {
            var txt = e.get("move").get("msg");
            var tpl = this.template;
            if (txt.startsWith("-:K")) {
                tpl = this.statusTemplate;
            }
            html += tpl({
                name: e.get("player").get("name"),
                text: Karopapier.Util.linkify(e.get("move").get("msg")),
                date: moment(e.get("move").get("t"), "YYYY-MM-dd hh:mm:ss").format("YYYY-MM-DD")
            });
        }, this);
        console.log(html);
        if (html) {
            this.$el.html(html);
            this.$el[0].scrollTop = this.$el[0].scrollHeight;
        }
    }
});