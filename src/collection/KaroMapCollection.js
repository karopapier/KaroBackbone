/**
 * Created by p.dietrich on 30.11.2015.
 */

var KaroMapCollection = Backbone.Collection.extend({
    model: KaroMap,
    url: "//www.karopapier.de/api/map/list.json?callback=?",
});
