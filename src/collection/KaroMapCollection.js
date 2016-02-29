var Backbone = require('backbone');
var KaroMap = require('../model/map/KaroMap');
module.exports = Backbone.Collection.extend({
    model: KaroMap,
    url: "/api/map/list.json?callback=?",
});
