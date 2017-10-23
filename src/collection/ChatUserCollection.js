var Backbone = require('backbone');
var User = require('../model/User');
module.exports = Backbone.Collection.extend({
    url: APIHOST + "/api/chat/users.json?callback=?",
    model: User
});