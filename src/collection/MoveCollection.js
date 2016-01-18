var Backbone = require('backbone');
var Move = require('../model/Move');
var MoveCollection = Backbone.Collection.extend(/** @lends MoveCollection.prototype */{
    model: Move
});
