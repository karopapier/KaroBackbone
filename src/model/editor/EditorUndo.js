var Backbone = require('backbone');
module.exports = Backbone.Model.extend({
    initialize: function(options) {
        _.bindAll(this, "undo");
        options = options || {};
        this.map = options.map;
        if (!this.map) {
            console.error("No map for EditorUndo");
            return false;
        }
        if (!options.editorsettings) {
            console.error("No editorsettings for EditorUndo");
            return false;
        }
        this.editorsettings = options.editorsettings;

        this.undoStack = [];
        this._enabled = true;
        this._lastChangeWasUndo = false;
        this.listenTo(this.editorsettings, "change:undo", this.checkStatus);
        this.listenTo(this.map, "change:field", function(e) {
            this.pushChange(e.oldcode);
        });

        this.listenTo(this.map, "change:mapcode", this.checkChange);
    },

    checkStatus: function() {
        if (this.editorsettings.get("undo")) {
            this.enable();
        } else {
            this.disable();
        }
    },

    checkChange: function(e) {
        if (this._lastChangeWasUndo) {
            //console.info("War ein undo");
        } else {
            this.pushChange(this.map.previous("mapcode"));
        }
        this._lastChangeWasUndo = false;
        //console.log("Undo hat noch", this.undoStack.length);
    },

    pushChange: function(code) {
        if (!this._enabled) return false;
        //console.log("Push ", code, "because", this._enabled);
        var l = this.undoStack.length;
        if (l > 0) {
            var prev = this.undoStack[l - 1];
            //console.log("Compare", prev, code);
            if (code === prev) {
                //console.info("Skip double triggered change, last undo is the same");
                return false;
            }
        }
        this.undoStack.push(code);
        this.trigger("change:undoStack", this.undoStack);
    },

    disable: function() {
        //console.log("Undo disabled");
        this.pushChange(this.map.get("mapcode"));
        this._enabled = false;
    },

    enable: function() {
        //console.log("Undo re-enabled, take snapshot")
        this._enabled = true;
        //this.pushChange(this.map.get("mapcode"));
    },


    undo: function() {
        if (this.undoStack.length >= 1) {
            this._lastChangeWasUndo = true;
            var undocode = this.undoStack.pop();
            //console.log(undocode);
            this.map.set("mapcode", undocode);
            //console.log("Now trigger change:undoStack");
            this.trigger("change:undoStack", this.undoStack);
        }
        //console.log("Undo hat noch", this.undoStack.length);
    }
});
