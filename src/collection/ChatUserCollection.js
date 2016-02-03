var Backbone = require('backbone');
var User = require('../model/User');
module.exports = Backbone.Collection.extend({
    url: "//www.karopapier.de/api/chat/users.json?callback=?",
    model: User
});