var Backbone = require('backbone');
var Map = require('./Map');
module.exports = Backbone.Model.extend({
    defaults: {
        "A": "255,255,255",
        "B": "0,0,0",
        "C": "255,237,0",
        "D": "242,148,0",
        "E": "226,0,26",
        "F": "226,0,114",
        "G": "177,200,0",
        "H": "0,157,48",
        "I": "0,102,173",
        "J": "120,23,119",
        "K": "188,188,182",
        "L": "234,202,171",
        "M": "163,217,236",
        "N": "0,166,212",
        "O": "0,151,143",
        "P": "122,80,52",
        "Q": "255,245,155",
        "R": "255,204,0",
        "S": "241,219,198",
        "T": "222,172,125",
        "U": "171,129,94",
        "V": "148,139,32",
        "W": "139,203,189",
        "X": "124,153,185",
        "Y": "70,34,121",
        "Z": "0,55,123",
        "1": "181,12,81",
        "2": "183,13,48",
        "3": "3,122,53",
        "4": "0,99,109",
        "5": "213,169,198",
        "6": "176,111,157",
        "7": "228,223,33",
        "8": "213,237,245",
        "9": "227,227,222",
        "0": "255,250,209",
        "a": "100,100,89",
        "b": "146,145,135",
        "c": "247,201,215",
        "d": "214,128,147"
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
