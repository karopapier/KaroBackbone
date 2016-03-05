var Backbone = require('backbone');
var Map = require('./Map');
module.exports = Backbone.Model.extend({
    defaults: {
        "A": "255,255,255",
        "B": "254,242,124",
        "C": "249,220,41",
        "D": "252,189,75",
        "E": "239,131,33",
        "F": "225,65,26",
        "G": "225,5,28",
        "H": "167,34,51",
        "I": "134,36,87",
        "J": "20,64,135",
        "K": "85,133,197",
        "L": "132,168,220",
        "M": "4,161,235",
        "N": "11,117,79",
        "O": "27,162,97",
        "P": "141,199,43",
        "Q": "166,193,77",
        "R": "188,86,82",
        "S": "212,128,82",
        "T": "162,114,78",
        "U": "103,73,73",
        "V": "203,191,179",
        "W": "130,126,123",
        "X": "0,0,0"
    },
    initialize: function() {
        _.bindAll(this, "setCharacterAlias", "getRGB");
        this.setCharacterAlias();
        this.bind("change", this.setCharacterAlias);
    },
    setCharacterAlias: function() {
        //make colors accessible via name or character
        var me = this;
        var map = new Map();
        _.each(map.FIELDS, function(name, char) {
            //name and nameBG are already set

            //so we need to set <char> and <char>_2
            me.set(char, me.get(name));
            me.set(char + "_2", me.get(name + "_2"));
        });
    },
    getRGB: function(field) {
        var rgb = this.get(field);
        if (!rgb) {
            console.error("No color for", field);
            rgb = "0,0,0";
        }
        return "rgb(" + this.get(field) + ")";
    }
});
