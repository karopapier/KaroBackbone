var Backbone = require('backbone');
var Motion = require('../model/Motion');
module.exports = Backbone.Collection.extend(/** @lends MotionCollection.prototype */ {
    model: Motion,
    getByMotionString: function(moString) {
        var motion = false;
        this.each(function(mo) {
            if (mo.toString() === moString) {
                motion = mo;
            }
        })
        return motion;
    }
});
