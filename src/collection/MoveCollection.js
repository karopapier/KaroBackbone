var Backbone = require('backbone');
var Move = require('../model/Move');
module.exports = Backbone.Collection.extend(/** @lends MoveCollection.prototype */{
    model: Move
});
