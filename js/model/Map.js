var Map = Backbone.Model.extend({
    defaults: {
        id: 0,
        cps: [],
        rows: 0,
        cols: 0
    },
    initialize: function() {
        _.bindAll(this);
        this.bind("change:id",function() {
            this.setMatrixFromCode()
        });
        this.bind("change:mapcode",function(e,mapcode) {
            this.updateStarties();
            this.updateCpList();
        },this);
    },
    updateStarties: function() {
        this.set("starties",(this.get("mapcode").match(/S/g)||[]).length);
    },
    updateCpList: function() {
        this.set("cps",(this.get("mapcode").match(/\d/g)||[]).sort().filter(function(el,i,a){if(i==a.indexOf(el))return 1;return 0}));
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
    },
    setFieldAtRowCol: function(r,c,field) {
        //console.log(this.attributes.matrix);
        this.attributes.matrix[r][c]=field;
        this.setMapcodeFromMatrix();
    },
    setMapcodeFromMatrix: function() {
        var matrix=this.get("matrix");
        var mapcodelines=[];
        for (r=0;r<matrix.length;r++) {
            mapcodelines.push(matrix[r].join(""));
        }
        this.set("mapcode",mapcodelines.join("\n"));
    }
});
