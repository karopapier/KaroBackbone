var MapListView = Marionette.CollectionView.extend({
    tagName: "select",
    childView: MapListItemView,
    template: window.JST["map/listView"]
});
