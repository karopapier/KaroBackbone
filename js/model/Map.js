var Map = Backbone.Model.extend({
    defaults: {
        id: 0,
        cps: false,
        rowCount: 0,
        colCount: 0,
    },
    initialize: function() {
        _.bindAll(this);
        this.bind("change:id",function(id) {
            this.setMatrixFromCode()
        });
    },

    setMatrixFromCode: function () {
        var lines=this.get("mapcode").split('\n');
        this.rowCount=lines.length;
        this.matrix= [];
        for (var l=0;l<this.rowCount;l++) {
            var line=lines[l];
            this.matrix[l]=[];
            var chars=line.split('');
            this.colCount=chars.length;
            for (var c=0;c<this.colCount;c++) {
                this.matrix[l][c]=line[c];
            }
        }
    }
});
