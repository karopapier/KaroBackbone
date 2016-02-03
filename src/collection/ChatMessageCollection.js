var Backbone = require('backbone');
var ChatMessage = require('../model/ChatMessage');
module.exports = Backbone.Collection.extend({
    model: ChatMessage
});
