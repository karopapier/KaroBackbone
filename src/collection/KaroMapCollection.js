var Backbone = require('backbone');
var KaroMap = require('../model/map/KaroMap');
module.exports = Backbone.Collection.extend({
    model: KaroMap,
    url: "//www.karopapier.de/api/map/list.json?callback=?",
});
