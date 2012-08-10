var Map = Backbone.Model.extend({
    defaults: {
        id: 0,
        cps: false,
        rows: 0,
        cols: 0
    },
    initialize: function() {
        _.bindAll(this);
        this.bind("change:id",function(id) {
            this.setMatrixFromCode()
        });
    },

    setMatrixFromCode: function () {
        var lines=this.get("mapcode").split('\n');
        this.set({"rows":lines.length});
        var matrix= [];
        for (var l=0;l<this.get("rows");l++) {
            var line=lines[l];
            matrix[l]=[];
            var chars=line.split('');
            this.set({"cols":chars.length});
            for (var c=0;c<this.get("cols");c++) {
                matrix[l][c]=line[c];
            }
        }
	    this.set({"matrix":matrix});
    }
});
