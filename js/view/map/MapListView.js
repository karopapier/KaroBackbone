var MapListView = Marionette.CollectionView.extend({
    tagName: "select",
    childView: MapListItemView,
    childViewContainer: "select",
    template: window.JST["map/listView"],
    events: {
        "change select": "selected"
    },
    selected: function (e) {
        var $select = $(e.currentTarget)
        var id = $select.val();
        var m = this.collection.get(id);
        this.trigger("selected", m);
    }
});
