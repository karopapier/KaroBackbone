/**
 * Created by p.dietrich on 30.11.2015.
 */


var MapListView = Marionette.CompositeView.extend({
    childView: MapListItemView,
    childViewContainer: "select",
    template: window.JST["map/listView"],
    initialize: function() {

    }
});
