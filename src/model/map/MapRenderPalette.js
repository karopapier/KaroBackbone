var Backbone = require('backbone');
var Map = require('./Map');
module.exports = Backbone.Model.extend({
    defaults: {
        "A": "255,250,197",
        "B": "255,242,103",
        "C": "255,234,0",
        "D": "255,193,0",
        "E": "243,137,0",
        "F": "225,54,0",
        "G": "219,0,22",
        "H": "220,0,107",
        "I": "166,6,66",
        "J": "162,95,152",
        "K": "80,8,83",
        "L": "203,232,245",
        "M": "112,197,233",
        "N": "0,141,204",
        "O": "0,85,160",
        "P": "3,44,121",
        "Q": "250,242,237",
        "R": "240,216,199",
        "S": "255,175,141",
        "T": "216,151,112",
        "U": "130,120,22",
        "V": "135,182,0",
        "W": "66,120,35",
        "X": "42,75,21",
        "Y": "123,194,179",
        "Z": "0,137,119",
        "1": "149,102,75",
        "2": "100,62,29",
        "3": "209,209,210",
        "4": "139,139,139",
        "5": "80,80,80",
        "6": "0,0,0"
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
