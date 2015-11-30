/**
 * Created by p.dietrich on 30.11.2015.
 */

var MapEditUndo = Backbone.Model.extend({
    initialize: function (options) {
        this.model = options.map;
        _.bindAll(this, "undo");
        this.UNDO = [];
        this.WAS_UNDO = false;
        this.listenTo(this.model, "change:field", function (e) {
            this.UNDO.push(e.oldcode);
        });

        this.listenTo(this.model, "change:mapcode", function (e) {
            //console.log("Mapcode changed, save undo");
            if (this.WAS_UNDO) {
                //console.info("War ein undo");
            } else {
                this.UNDO.push(this.model.previous("mapcode"));
            }
            this.WAS_UNDO = false;
            //console.log("Undo hat noch", this.UNDO.length);
        });

    },
    undo: function () {
        console.log("UNDO");
        if (this.UNDO.length >= 1) {
            this.WAS_UNDO = true;
            var undocode = this.UNDO.pop();
            this.model.set("mapcode", undocode);
        }
        //console.log("Undo hat noch", this.UNDO.length);
    }
});
